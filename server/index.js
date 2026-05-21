import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5005;
const JWT_SECRET = process.env.JWT_SECRET || 'mainichi_super_secret_key_2024';

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, '../dist')));

// MySQL Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mainichi_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jsonwebtoken.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==========================================
// DATE & TIMEZONE UTILITY FUNCTIONS
// ==========================================

// Get calendar date in user's local timezone (based on timezone offset header)
function getUserLocalDate(req) {
  const clientOffset = parseInt(req.headers['x-timezone-offset'] || '0', 10);
  // clientOffset is in minutes (e.g. -480 for GMT+8, 300 for GMT-5).
  // We subtract this offset to convert UTC server time to user local time.
  const localTime = new Date(Date.now() - (clientOffset * 60 * 1000));
  return {
    year: localTime.getUTCFullYear(),
    month: localTime.getUTCMonth(), // 0-indexed
    day: localTime.getUTCDate(),
    toString() {
      return `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
    }
  };
}

// Calculate difference in calendar days between user's current date and a stored date string YYYY-MM-DD
function getCalendarDaysDiff(currentLocalDate, storedDateStr) {
  if (!storedDateStr) return 0;
  
  // Stored date is formatted as YYYY-MM-DD in SQL query
  const parts = storedDateStr.split(/[- T]/);
  if (parts.length < 3) return 0;
  
  const storedYear = parseInt(parts[0], 10);
  const storedMonth = parseInt(parts[1], 10) - 1; // 0-indexed
  const storedDay = parseInt(parts[2], 10);
  
  const d1 = Date.UTC(currentLocalDate.year, currentLocalDate.month, currentLocalDate.day);
  const d2 = Date.UTC(storedYear, storedMonth, storedDay);
  
  return Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
}

// Convert client timezone offset in minutes to SQL CONVERT_TZ offset string (e.g. '+08:00')
function getTimezoneOffsetString(req) {
  const clientOffset = parseInt(req.headers['x-timezone-offset'] || '0', 10);
  const offsetMin = -clientOffset; 
  const sign = offsetMin >= 0 ? '+' : '-';
  const absMin = Math.abs(offsetMin);
  const hours = Math.floor(absMin / 60);
  const mins = absMin % 60;
  return `${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const [existing] = await pool.query('SELECT * FROM mainichi_users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO mainichi_users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Create initial stats record
    await pool.query('INSERT INTO mainichi_user_stats (user_id) VALUES (?)', [result.insertId]);

    const token = jsonwebtoken.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: result.insertId, name, email, profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM mainichi_users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jsonwebtoken.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, profile_picture: user.profile_picture } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ==========================================
// USER PROFILE ROUTES
// ==========================================

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, profile_picture } = req.body;
    const userId = req.user.id;

    await pool.query(
      'UPDATE mainichi_users SET name = ?, profile_picture = ? WHERE id = ?',
      [name, profile_picture, userId]
    );

    res.json({ success: true, user: { id: userId, name, profile_picture } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ==========================================
// VOCABULARY CRUD ROUTES
// ==========================================

// Create Vocabulary
app.post('/api/vocab', authenticateToken, async (req, res) => {
  try {
    const { deck_id, kanji, furigana, english } = req.body;
    const [result] = await pool.query(
      'INSERT INTO mainichi_vocabulary (deck_id, kanji, furigana, english) VALUES (?, ?, ?, ?)',
      [deck_id, kanji, furigana, english]
    );
    res.status(201).json({ id: result.insertId, deck_id, kanji, furigana, english });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Read Vocabulary (Get deck)
app.get('/api/decks/:deck_id/vocab', authenticateToken, async (req, res) => {
  try {
    const { deck_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM mainichi_vocabulary WHERE deck_id = ?', [deck_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Update Vocabulary
app.put('/api/vocab/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { kanji, furigana, english } = req.body;
    await pool.query(
      'UPDATE mainichi_vocabulary SET kanji = ?, furigana = ?, english = ? WHERE id = ?',
      [kanji, furigana, english, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Delete Vocabulary
app.delete('/api/vocab/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM mainichi_vocabulary WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ==========================================
// SRS & PROGRESS TRACKING ROUTES
// ==========================================

// Get user stats and settings
app.get('/api/progress/stats', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    let [statsRows] = await pool.query(
      'SELECT user_id, current_streak, longest_streak, DATE_FORMAT(last_study_date, "%Y-%m-%d") as last_study_date, words_mastered, mastery_requirement, daily_goal FROM mainichi_user_stats WHERE user_id = ?',
      [user_id]
    );
    
    // If stats don't exist for some reason, create defaults
    if (statsRows.length === 0) {
      await pool.query('INSERT INTO mainichi_user_stats (user_id) VALUES (?)', [user_id]);
      [statsRows] = await pool.query(
        'SELECT user_id, current_streak, longest_streak, DATE_FORMAT(last_study_date, "%Y-%m-%d") as last_study_date, words_mastered, mastery_requirement, daily_goal FROM mainichi_user_stats WHERE user_id = ?',
        [user_id]
      );
    }
    
    const stats = statsRows[0];
    let currentStreak = stats.current_streak;
    const todayLocalDate = getUserLocalDate(req);
    
    // Reset streak if there's a day of inactivity (yesterday was missed)
    if (stats.last_study_date) {
      const diffDays = getCalendarDaysDiff(todayLocalDate, stats.last_study_date);
      
      if (diffDays > 1) {
        currentStreak = 0;
        await pool.query('UPDATE mainichi_user_stats SET current_streak = 0 WHERE user_id = ?', [user_id]);
      }
    }
    
    // Calculate daily goal current progress (reviews done today in client's timezone)
    const tzOffsetStr = getTimezoneOffsetString(req);
    const [doneRows] = await pool.query(
      'SELECT COUNT(*) as count FROM mainichi_user_progress WHERE user_id = ? AND DATE(CONVERT_TZ(updated_at, "+00:00", ?)) = ?',
      [user_id, tzOffsetStr, todayLocalDate.toString()]
    );
    const reviewsDoneToday = doneRows[0].count;
    
    res.json({
      streak: currentStreak,
      longestStreak: stats.longest_streak,
      masteredWords: stats.words_mastered,
      masteryRequirement: stats.mastery_requirement,
      dailyGoal: { current: reviewsDoneToday, total: stats.daily_goal }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Update settings
app.put('/api/progress/settings', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    let { masteryRequirement, dailyGoal } = req.body;
    
    if (masteryRequirement > 10) masteryRequirement = 10;
    if (masteryRequirement < 1) masteryRequirement = 1;
    if (dailyGoal < 1) dailyGoal = 1;

    await pool.query(
      'UPDATE mainichi_user_stats SET mastery_requirement = ?, daily_goal = ? WHERE user_id = ?', 
      [masteryRequirement, dailyGoal, user_id]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ==========================================
// PRESENTATION & DEMO SANDBOX ENDPOINTS
// ==========================================

// Reset user progress (refills review queue and resets stats)
app.post('/api/progress/demo/reset', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Delete progress records
    await pool.query('DELETE FROM mainichi_user_progress WHERE user_id = ?', [user_id]);
    
    // Reset stats
    await pool.query(
      'UPDATE mainichi_user_stats SET current_streak = 0, longest_streak = 0, last_study_date = NULL, words_mastered = 0 WHERE user_id = ?',
      [user_id]
    );
    
    res.json({ success: true, message: 'Progress fully reset. Daily queue reloaded!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Simulate 5-day active streak (last study date = yesterday, so today reviews increment to 6!)
app.post('/api/progress/demo/simulate-streak', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Calculate yesterday in user's client local timezone based on offset header
    const clientOffset = parseInt(req.headers['x-timezone-offset'] || '0', 10);
    const yesterdayLocalTime = new Date(Date.now() - (clientOffset * 60 * 1000) - 86400000);
    const yesterdayStr = `${yesterdayLocalTime.getUTCFullYear()}-${String(yesterdayLocalTime.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterdayLocalTime.getUTCDate()).padStart(2, '0')}`;
    
    // Delete progress to refill queue
    await pool.query('DELETE FROM mainichi_user_progress WHERE user_id = ?', [user_id]);
    
    // Set streak to 5, longest streak to 10, last study date to yesterday
    await pool.query(
      'UPDATE mainichi_user_stats SET current_streak = 5, longest_streak = 10, last_study_date = ?, words_mastered = 3 WHERE user_id = ?',
      [yesterdayStr, user_id]
    );
    
    res.json({ success: true, message: 'Simulated 5-day active streak! Next review will increment it to 6.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Get due reviews
app.get('/api/progress/due', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // 1. Get user's daily goal
    const [statsRows] = await pool.query('SELECT daily_goal FROM mainichi_user_stats WHERE user_id = ?', [user_id]);
    const dailyGoal = statsRows[0]?.daily_goal || 20;
    
    // 2. Get reviews done today
    const [doneRows] = await pool.query(
      'SELECT COUNT(*) as count FROM mainichi_user_progress WHERE user_id = ? AND DATE(updated_at) = CURRENT_DATE',
      [user_id]
    );
    const reviewsDoneToday = doneRows[0].count;
    
    const limit = Math.max(0, dailyGoal - reviewsDoneToday);
    
    if (limit === 0) {
      return res.json([]);
    }

    // Select all vocabulary that:
    // 1. Has no progress record yet (new cards)
    // 2. Has a next_review_date in the past
    const query = `
      SELECT v.* FROM mainichi_vocabulary v
      LEFT JOIN mainichi_user_progress p ON v.id = p.vocab_id AND p.user_id = ?
      WHERE p.next_review_date <= CURRENT_TIMESTAMP OR p.id IS NULL
      ORDER BY p.next_review_date ASC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [user_id, limit]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Record a review result (Spaced Repetition Logic)
app.post('/api/progress/review', authenticateToken, async (req, res) => {
  try {
    const { vocab_id, rating } = req.body; // rating: 'easy', 'good', 'hard'
    const user_id = req.user.id;

    // Get current progress or set defaults
    let [progressRows] = await pool.query('SELECT * FROM mainichi_user_progress WHERE user_id = ? AND vocab_id = ?', [user_id, vocab_id]);
    let progress = progressRows[0] || {
      easiness_factor: 2.5,
      interval_days: 0,
      repetitions: 0
    };

    // SuperMemo-2 Algorithm basics
    let quality = 0;
    if (rating === 'easy') quality = 5;
    if (rating === 'good') quality = 4;
    if (rating === 'hard') quality = 3; // Using 3 so it doesn't drop rep count to 0, just reduces EF

    // Custom SRS Stages (in minutes)
    // 0: 10m, 1: 90m, 2: 4h, 3: 1d, 4: 3d, 5: 7d, 6: 14d, 7: 30d, 8: 90d, 9: 180d
    const intervals = [10, 90, 240, 1440, 4320, 10080, 20160, 43200, 129600, 259200];
    
    let intervalMinutes = 0;
    if (quality >= 3) {
      if (progress.repetitions < intervals.length) {
        intervalMinutes = intervals[progress.repetitions];
      } else {
        // Fallback to SM-2 like growth
        const lastInterval = progress.interval_days * 1440 || intervals[intervals.length - 1];
        intervalMinutes = Math.round(lastInterval * progress.easiness_factor);
      }
      progress.repetitions += 1;
    } else {
      progress.repetitions = 0;
      intervalMinutes = 10; // Reset to 10 minutes if failed
    }

    // Update interval_days for legacy/DB compatibility (approximate)
    progress.interval_days = Math.max(1, Math.round(intervalMinutes / 1440));

    // Update Easiness Factor
    progress.easiness_factor = progress.easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (progress.easiness_factor < 1.3) progress.easiness_factor = 1.3;

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setMinutes(nextReview.getMinutes() + intervalMinutes);

    // Upsert the progress
    await pool.query(`
      INSERT INTO mainichi_user_progress (user_id, vocab_id, easiness_factor, interval_days, repetitions, next_review_date)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        easiness_factor = VALUES(easiness_factor),
        interval_days = VALUES(interval_days),
        repetitions = VALUES(repetitions),
        next_review_date = VALUES(next_review_date)
    `, [user_id, vocab_id, progress.easiness_factor, progress.interval_days, progress.repetitions, nextReview]);

    // ==== Update Streak and Mastered Words ====
    // 1. Get current stats
    const [statsRows] = await pool.query(
      'SELECT user_id, current_streak, longest_streak, DATE_FORMAT(last_study_date, "%Y-%m-%d") as last_study_date, words_mastered, mastery_requirement FROM mainichi_user_stats WHERE user_id = ?',
      [user_id]
    );
    const stats = statsRows[0];
    
    if (stats) {
      const todayLocalDate = getUserLocalDate(req);
      let newStreak = stats.current_streak;
      let newLongest = stats.longest_streak;
      
      if (!stats.last_study_date) {
        newStreak = 1;
      } else {
        const diffDays = getCalendarDaysDiff(todayLocalDate, stats.last_study_date);
        
        if (diffDays === 1) {
          // Studied yesterday, increment streak
          newStreak += 1;
        } else if (diffDays > 1) {
          // Missed a day, reset streak
          newStreak = 1;
        }
        // If diffDays === 0, already studied today, streak remains the same
      }
      
      if (newStreak > newLongest) {
        newLongest = newStreak;
      }

      // 2. Recalculate mastered words based on the requirement
      const reqReps = stats.mastery_requirement || 3;
      const [masteredRows] = await pool.query(
        'SELECT COUNT(*) as count FROM mainichi_user_progress WHERE user_id = ? AND repetitions >= ?',
        [user_id, reqReps]
      );
      const newMasteredWords = masteredRows[0].count;

      // 3. Update stats table with user's local date string
      await pool.query(
        'UPDATE mainichi_user_stats SET current_streak = ?, longest_streak = ?, last_study_date = ?, words_mastered = ? WHERE user_id = ?',
        [newStreak, newLongest, todayLocalDate.toString(), newMasteredWords, user_id]
      );

      res.json({ success: true, next_review_date: nextReview, streak: newStreak, masteredWords: newMasteredWords });
    } else {
      res.json({ success: true, next_review_date: nextReview });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Mainichi Express API running on port ${PORT}`);
});
