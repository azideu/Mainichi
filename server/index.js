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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// SRS & PROGRESS TRACKING ROUTES
// ==========================================

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

    if (quality >= 3) {
      if (progress.repetitions === 0) {
        progress.interval_days = 1;
      } else if (progress.repetitions === 1) {
        progress.interval_days = 6;
      } else {
        progress.interval_days = Math.round(progress.interval_days * progress.easiness_factor);
      }
      progress.repetitions += 1;
    } else {
      progress.repetitions = 0;
      progress.interval_days = 1;
    }

    // Update Easiness Factor
    progress.easiness_factor = progress.easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (progress.easiness_factor < 1.3) progress.easiness_factor = 1.3;

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + progress.interval_days);

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

    res.json({ success: true, next_review_date: nextReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Mainichi Express API running on port ${PORT}`);
});
