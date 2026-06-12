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

// Ensure tables exist on startup
async function ensureTablesExist() {
  try {
    // 1. Create table if not exists (old schema might not have unique key)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mainichi_deck_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        deck_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (deck_id) REFERENCES mainichi_decks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES mainichi_users(id) ON DELETE CASCADE
      )
    `);

    // 2. Clean up duplicate reviews (keep the latest one)
    await pool.query(`
      DELETE r1 FROM mainichi_deck_reviews r1
      INNER JOIN mainichi_deck_reviews r2 
      ON r1.deck_id = r2.deck_id 
      AND r1.user_id = r2.user_id 
      AND r1.id < r2.id
    `);

    // 3. Add unique constraint if it doesn't exist
    try {
      await pool.query(`
        ALTER TABLE mainichi_deck_reviews 
        ADD UNIQUE KEY unique_deck_user (deck_id, user_id)
      `);
      console.log("✅ Added unique key constraint to mainichi_deck_reviews table.");
    } catch (indexErr) {
      // If it already exists, indexErr.code is usually 'ER_DUP_KEYNAME' or similar
      if (indexErr.code !== 'ER_DUP_KEYNAME') {
        console.log("ℹ️ unique_deck_user constraint already exists or failed to add:", indexErr.message);
      }
    }

    // 4. Seed sample decks (survival phrases, basic adjectives, dining vocab)
    const [existingDecks] = await pool.query('SELECT id FROM mainichi_decks WHERE id IN (2, 3, 4)');
    if (existingDecks.length < 3) {
      console.log("🌱 Seeding sample Kana decks...");
      
      // Seed Deck 2 (Essential Survival Phrases)
      await pool.query(`
        INSERT INTO mainichi_decks (id, author_id, title, description, is_premium)
        VALUES (2, NULL, 'Survival Japanese', 'Useful conversational phrases and greetings in Kana for navigating daily situations.', FALSE)
        ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)
      `);
      await pool.query('DELETE FROM mainichi_vocabulary WHERE deck_id = 2');
      await pool.query(`
        INSERT INTO mainichi_vocabulary (deck_id, kanji, furigana, onyomi, kunyomi, english) VALUES
        (2, 'こんにちは', '', '', '', 'hello / good afternoon'),
        (2, 'すみません', '', '', '', 'excuse me / I am sorry'),
        (2, 'ありがとう', '', '', '', 'thank you'),
        (2, 'おねがいします', '', '', '', 'please (requesting)'),
        (2, 'はい', '', '', '', 'yes'),
        (2, 'いいえ', '', '', '', 'no'),
        (2, 'おかいけい、おねがいします', '', '', '', 'the bill, please'),
        (2, 'トイレはどこですか', '', '', '', 'where is the toilet?'),
        (2, 'おいしいです', '', '', '', 'it is delicious'),
        (2, 'ごちそうさまでした', '', '', '', 'thank you for the meal (after eating)'),
        (2, 'いただきます', '', '', '', 'thank you for the meal (before eating)')
      `);

      // Seed Deck 3 (Basic Japanese Adjectives)
      await pool.query(`
        INSERT INTO mainichi_decks (id, author_id, title, description, is_premium)
        VALUES (3, NULL, 'Everyday Adjectives', 'Essential adjectives in Hiragana for describing things, feelings, and places.', FALSE)
        ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)
      `);
      await pool.query('DELETE FROM mainichi_vocabulary WHERE deck_id = 3');
      await pool.query(`
        INSERT INTO mainichi_vocabulary (deck_id, kanji, furigana, onyomi, kunyomi, english) VALUES
        (3, 'たのしい', '', '', '', 'fun / enjoyable'),
        (3, 'おいしい', '', '', '', 'delicious'),
        (3, 'おもしろい', '', '', '', 'interesting / funny'),
        (3, 'むずかしい', '', '', '', 'difficult'),
        (3, 'やさしい', '', '', '', 'easy / kind'),
        (3, 'あつい', '', '', '', 'hot'),
        (3, 'さむい', '', '', '', 'cold (weather)'),
        (3, 'ちいさい', '', '', '', 'small'),
        (3, 'おおきい', '', '', '', 'big'),
        (3, 'いい', '', '', '', 'good'),
        (3, 'わるい', '', '', '', 'bad'),
        (3, 'いそがしい', '', '', '', 'busy')
      `);

      // Seed Deck 4 (Restaurant & Dining Vocab)
      await pool.query(`
        INSERT INTO mainichi_decks (id, author_id, title, description, is_premium)
        VALUES (4, NULL, 'Restaurant & Dining', 'Useful words in Hiragana/Katakana for ordering food and dining out.', FALSE)
        ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)
      `);
      await pool.query('DELETE FROM mainichi_vocabulary WHERE deck_id = 4');
      await pool.query(`
        INSERT INTO mainichi_vocabulary (deck_id, kanji, furigana, onyomi, kunyomi, english) VALUES
        (4, 'おみず', '', '', '', 'water'),
        (4, 'おちゃ', '', '', '', 'tea'),
        (4, 'メニュー', '', '', '', 'menu'),
        (4, 'ごはん', '', '', '', 'rice / meal'),
        (4, 'ラーメン', '', '', '', 'ramen'),
        (4, 'すし', '', '', '', 'sushi'),
        (4, 'やきとり', '', '', '', 'yakitori'),
        (4, 'ビール', '', '', '', 'beer'),
        (4, 'さかな', '', '', '', 'fish'),
        (4, 'にく', '', '', '', 'meat'),
        (4, 'おさら', '', '', '', 'plate'),
        (4, 'スプーン', '', '', '', 'spoon')
      `);
      
      console.log("🌱 Seeded sample Kana decks successfully.");
    }

    console.log("✅ Database table mainichi_deck_reviews verified/created.");
  } catch (err) {
    console.error("❌ Error initializing mainichi_deck_reviews table:", err);
  }
}
ensureTablesExist();

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

// Centralized helper to get timezone offset securely from query, body, or header
function getClientOffset(req) {
  let offset = req.query.tzOffset || (req.body && req.body.tzOffset) || req.headers['x-timezone-offset'];
  if (offset === undefined || offset === null) return 0;
  return parseInt(offset, 10) || 0;
}

// Get calendar date in user's local timezone (based on timezone offset header, query, or body)
function getUserLocalDate(req) {
  const clientOffset = getClientOffset(req);
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
  const clientOffset = getClientOffset(req);
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
    res.status(201).json({ token, user: { id: result.insertId, name, email, profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi', is_premium: 0 } });
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
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, profile_picture: user.profile_picture, is_premium: user.is_premium } });
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

// Upgrade user to premium subscription
app.post('/api/user/subscribe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Update is_premium to true
    await pool.query('UPDATE mainichi_users SET is_premium = TRUE WHERE id = ?', [userId]);

    // Fetch the updated user details to return to the frontend
    const [rows] = await pool.query('SELECT id, name, email, profile_picture, is_premium FROM mainichi_users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: rows[0] });
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
// DECKS & COMMUNITY ROUTES
// ==========================================

// Get Decks
app.get('/api/decks', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const query = `
      SELECT d.id, d.title, d.description, d.is_premium, d.created_at, 
             COALESCE(u.name, 'Admin') AS author, 
             (SELECT COUNT(*) FROM mainichi_vocabulary WHERE deck_id = d.id) AS word_count,
             EXISTS(SELECT 1 FROM mainichi_user_decks WHERE user_id = ? AND deck_id = d.id) AS downloaded
      FROM mainichi_decks d
      LEFT JOIN mainichi_users u ON d.author_id = u.id
      ORDER BY d.id ASC
    `;
    const [rows] = await pool.query(query, [user_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Create Deck (with vocabulary list inside a transaction)
app.post('/api/decks', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const user_id = req.user.id;
    const { title, description, is_premium, vocabulary } = req.body;

    if (!title || !vocabulary || !Array.isArray(vocabulary) || vocabulary.length === 0) {
      return res.status(400).json({ error: 'Title and a non-empty vocabulary list are required.' });
    }

    // 1. Insert Deck
    const [deckResult] = await connection.query(
      'INSERT INTO mainichi_decks (author_id, title, description, is_premium) VALUES (?, ?, ?, ?)',
      [user_id, title, description || '', is_premium ? 1 : 0]
    );
    const deck_id = deckResult.insertId;

    // 2. Insert Vocabulary Cards
    const vocabValues = vocabulary.map(item => [
      deck_id,
      item.kanji,
      item.furigana || '',
      item.onyomi || '',
      item.kunyomi || '',
      item.english
    ]);

    await connection.query(
      'INSERT INTO mainichi_vocabulary (deck_id, kanji, furigana, onyomi, kunyomi, english) VALUES ?',
      [vocabValues]
    );

    // 3. Auto-unlock/download the deck for the creator
    await connection.query(
      'INSERT INTO mainichi_user_decks (user_id, deck_id) VALUES (?, ?)',
      [user_id, deck_id]
    );

    await connection.commit();
    res.status(201).json({ success: true, deck_id, word_count: vocabulary.length });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  } finally {
    connection.release();
  }
});

// Download/Unlock Deck
app.post('/api/decks/:id/download', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const deck_id = parseInt(req.params.id, 10);

    // Verify deck exists
    const [deckRows] = await pool.query('SELECT * FROM mainichi_decks WHERE id = ?', [deck_id]);
    if (deckRows.length === 0) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    // Insert join table record
    await pool.query(
      'INSERT IGNORE INTO mainichi_user_decks (user_id, deck_id) VALUES (?, ?)',
      [user_id, deck_id]
    );

    res.json({ success: true, message: 'Deck unlocked successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Remove/Deactivate Deck from User Account
app.delete('/api/decks/:id/download', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const deck_id = parseInt(req.params.id, 10);

    if (deck_id === 1) {
      return res.status(400).json({ error: 'Cannot remove the core N5 deck.' });
    }

    // 1. Delete user-deck link
    await pool.query(
      'DELETE FROM mainichi_user_decks WHERE user_id = ? AND deck_id = ?',
      [user_id, deck_id]
    );

    // 2. Delete review progress for cards in this deck
    await pool.query(
      'DELETE FROM mainichi_user_progress WHERE user_id = ? AND vocab_id IN (SELECT id FROM mainichi_vocabulary WHERE deck_id = ?)',
      [user_id, deck_id]
    );

    res.json({ success: true, message: 'Deck removed from account successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Get all reviews for a deck
app.get('/api/decks/:deck_id/reviews', authenticateToken, async (req, res) => {
  try {
    const deck_id = parseInt(req.params.deck_id, 10);
    const [reviews] = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.name as author
      FROM mainichi_deck_reviews r
      JOIN mainichi_users u ON r.user_id = u.id
      WHERE r.deck_id = ?
      ORDER BY r.created_at DESC
    `, [deck_id]);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Post a review for a deck
app.post('/api/decks/:deck_id/reviews', authenticateToken, async (req, res) => {
  try {
    const deck_id = parseInt(req.params.deck_id, 10);
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user has already reviewed this deck
    const [existing] = await pool.query(
      'SELECT id FROM mainichi_deck_reviews WHERE deck_id = ? AND user_id = ?',
      [deck_id, user_id]
    );

    if (existing.length > 0) {
      // Update existing review
      await pool.query(`
        UPDATE mainichi_deck_reviews
        SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP
        WHERE deck_id = ? AND user_id = ?
      `, [rating, comment || '', deck_id, user_id]);
      res.json({ success: true, message: 'Review updated successfully.' });
    } else {
      // Insert new review
      await pool.query(`
        INSERT INTO mainichi_deck_reviews (deck_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `, [deck_id, user_id, rating, comment || '']);
      res.json({ success: true, message: 'Review submitted successfully.' });
    }
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
      'SELECT user_id, current_streak, longest_streak, DATE_FORMAT(last_study_date, \'%Y-%m-%d\') as last_study_date, words_mastered, mastery_requirement, daily_goal FROM mainichi_user_stats WHERE user_id = ?',
      [user_id]
    );
    
    // If stats don't exist for some reason, create defaults
    if (statsRows.length === 0) {
      await pool.query('INSERT INTO mainichi_user_stats (user_id) VALUES (?)', [user_id]);
      [statsRows] = await pool.query(
        'SELECT user_id, current_streak, longest_streak, DATE_FORMAT(last_study_date, \'%Y-%m-%d\') as last_study_date, words_mastered, mastery_requirement, daily_goal FROM mainichi_user_stats WHERE user_id = ?',
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
      'SELECT COUNT(*) as count FROM mainichi_user_progress WHERE user_id = ? AND DATE(CONVERT_TZ(updated_at, \'+00:00\', ?)) = ?',
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

// Get progress for each downloaded deck
app.get('/api/progress/decks', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // First get the user's mastery requirement
    let [statsRows] = await pool.query(
      'SELECT mastery_requirement FROM mainichi_user_stats WHERE user_id = ?',
      [user_id]
    );
    let masteryReq = 10; // Default
    if (statsRows.length > 0) {
      masteryReq = statsRows[0].mastery_requirement;
    }
    
    const query = `
      SELECT d.id, d.title, d.description, d.is_premium,
             (SELECT COUNT(*) FROM mainichi_vocabulary WHERE deck_id = d.id) as word_count,
             (SELECT COUNT(*) FROM mainichi_user_progress p 
              JOIN mainichi_vocabulary v ON p.vocab_id = v.id
              WHERE p.user_id = ? AND v.deck_id = d.id) as studied_count,
             (SELECT COUNT(*) FROM mainichi_user_progress p 
              JOIN mainichi_vocabulary v ON p.vocab_id = v.id
              WHERE p.user_id = ? AND v.deck_id = d.id AND p.repetitions >= ?) as mastered_count
      FROM mainichi_decks d
      JOIN mainichi_user_decks ud ON d.id = ud.deck_id
      WHERE ud.user_id = ?
      ORDER BY d.id ASC
    `;
    
    const [decksProgress] = await pool.query(query, [user_id, user_id, masteryReq, user_id]);
    res.json(decksProgress);
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
    
    // Calculate yesterday in user's client local timezone based on offset header, query, or body
    const clientOffset = getClientOffset(req);
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
    const deckId = req.query.deckId ? parseInt(req.query.deckId, 10) : 1;
    
    // 1. Get user's daily goal
    const [statsRows] = await pool.query('SELECT daily_goal FROM mainichi_user_stats WHERE user_id = ?', [user_id]);
    const dailyGoal = statsRows[0]?.daily_goal || 20;
    
    let limit = 999;
    
    // Apply daily goal restrictions only to the main N5 core deck (deckId = 1)
    if (deckId === 1) {
      // 2. Get reviews done today (timezone-aware)
      const tzOffsetStr = getTimezoneOffsetString(req);
      const todayLocalDate = getUserLocalDate(req);
      const [doneRows] = await pool.query(
        'SELECT COUNT(*) as count FROM mainichi_user_progress WHERE user_id = ? AND DATE(CONVERT_TZ(updated_at, \'+00:00\', ?)) = ?',
        [user_id, tzOffsetStr, todayLocalDate.toString()]
      );
      const reviewsDoneToday = doneRows[0].count;
      limit = Math.max(0, dailyGoal - reviewsDoneToday);
      
      if (limit === 0) {
        return res.json([]);
      }
    }

    // Select all vocabulary that:
    // 1. Belongs to the requested deckId
    // 2. Has no progress record yet (new cards)
    // 3. Has a next_review_date in the past
    const query = `
      SELECT v.* FROM mainichi_vocabulary v
      LEFT JOIN mainichi_user_progress p ON v.id = p.vocab_id AND p.user_id = ?
      WHERE v.deck_id = ? AND (p.next_review_date <= CURRENT_TIMESTAMP OR p.id IS NULL)
      ORDER BY p.next_review_date ASC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [user_id, deckId, limit]);
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
      'SELECT user_id, current_streak, longest_streak, DATE_FORMAT(last_study_date, \'%Y-%m-%d\') as last_study_date, words_mastered, mastery_requirement FROM mainichi_user_stats WHERE user_id = ?',
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

// Override/Correct a misclicked review
app.post('/api/progress/review/override', authenticateToken, async (req, res) => {
  try {
    const { vocab_id } = req.body;
    const user_id = req.user.id;

    // Get the current progress
    const [progressRows] = await pool.query('SELECT * FROM mainichi_user_progress WHERE user_id = ? AND vocab_id = ?', [user_id, vocab_id]);
    if (progressRows.length === 0) {
      return res.status(404).json({ error: 'No progress found to override' });
    }

    const progress = progressRows[0];
    
    // Reconstruct previous SM2 state and recalculate for 'good' (quality = 4)
    const prevRepetitions = Math.max(0, progress.repetitions - 1);
    const prevEF = Math.max(1.3, progress.easiness_factor + 0.14); // Revert quality 3 subtraction

    let newRepetitions = prevRepetitions + 1;
    const intervals = [10, 90, 240, 1440, 4320, 10080, 20160, 43200, 129600, 259200];
    let intervalMinutes = 0;
    if (newRepetitions < intervals.length) {
      intervalMinutes = intervals[newRepetitions];
    } else {
      const lastInterval = (progress.interval_days * 1440) || intervals[intervals.length - 1];
      intervalMinutes = Math.round(lastInterval * prevEF);
    }
    const intervalDays = Math.max(1, Math.round(intervalMinutes / 1440));
    
    const nextReview = new Date();
    nextReview.setMinutes(nextReview.getMinutes() + intervalMinutes);

    // Update progress table
    await pool.query(`
      UPDATE mainichi_user_progress 
      SET easiness_factor = ?, interval_days = ?, repetitions = ?, next_review_date = ?
      WHERE user_id = ? AND vocab_id = ?
    `, [prevEF, intervalDays, newRepetitions, nextReview, user_id, vocab_id]);

    res.json({ success: true, next_review_date: nextReview });
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
