-- Users table for Authentication
CREATE TABLE IF NOT EXISTS mainichi_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture LONGTEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    is_creator BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories/Decks table
CREATE TABLE IF NOT EXISTS mainichi_decks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    deck_type VARCHAR(50) DEFAULT 'kanji',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES mainichi_users(id) ON DELETE SET NULL
);

-- Vocabulary/Flashcards table (CRUD)
CREATE TABLE IF NOT EXISTS mainichi_vocabulary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deck_id INT,
    kanji VARCHAR(100) NOT NULL,
    furigana VARCHAR(100),
    onyomi VARCHAR(255),
    kunyomi VARCHAR(255),
    english VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES mainichi_decks(id) ON DELETE CASCADE
);

-- User Progress / SRS Tracking
CREATE TABLE IF NOT EXISTS mainichi_user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vocab_id INT NOT NULL,
    easiness_factor FLOAT DEFAULT 2.5,
    interval_days INT DEFAULT 0,
    repetitions INT DEFAULT 0,
    next_review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY user_vocab (user_id, vocab_id),
    FOREIGN KEY (user_id) REFERENCES mainichi_users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES mainichi_vocabulary(id) ON DELETE CASCADE
);

-- User Statistics
CREATE TABLE IF NOT EXISTS mainichi_user_stats (
    user_id INT PRIMARY KEY,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_study_date DATE,
    words_mastered INT DEFAULT 0,
    mastery_requirement INT DEFAULT 10,
    daily_goal INT DEFAULT 20,
    FOREIGN KEY (user_id) REFERENCES mainichi_users(id) ON DELETE CASCADE
);

-- User Decks Join Table
CREATE TABLE IF NOT EXISTS mainichi_user_decks (
    user_id INT NOT NULL,
    deck_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, deck_id),
    FOREIGN KEY (user_id) REFERENCES mainichi_users(id) ON DELETE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES mainichi_decks(id) ON DELETE CASCADE
);

-- Deck Reviews/Comments table
CREATE TABLE IF NOT EXISTS mainichi_deck_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deck_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_deck_user (deck_id, user_id),
    FOREIGN KEY (deck_id) REFERENCES mainichi_decks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES mainichi_users(id) ON DELETE CASCADE
);

-- User completed lessons table
CREATE TABLE IF NOT EXISTS mainichi_user_lessons (
    user_id INT NOT NULL,
    lesson_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES mainichi_users(id) ON DELETE CASCADE
);





