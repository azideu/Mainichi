# Mainichi (毎日)

Mainichi is a joyful, tactile Japanese language learning platform designed for mobile-first mastery. It blends spaced repetition learning (SRS) with a structured daily foundations curriculum, dynamic community deck sharing, and high-fidelity 3D micro-animations.

---

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MySQL Database**

### Installation & Database Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/azideu/Mainichi.git
   cd Mainichi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and specify the following configurations:
   ```env
   DB_HOST=your-mysql-host
   DB_PORT=your-mysql-port
   DB_USER=your-mysql-user
   DB_PASSWORD=your-mysql-password
   DB_NAME=mainichi
   DB_SSL=true
   JWT_SECRET=your-secret-key
   PORT=5005
   ```

4. **Initialize and Seed Database:**
   Run the database initialization script to create tables, apply constraints, and seed default vocabulary items:
   ```bash
   node server/init-db.js
   ```

5. **Start the Development Servers:**
   ```bash
   npm run dev
   ```
   This starts both the Vite frontend dev server (default port `5173`) and the Express backend server (port `5005`) concurrently.

---

## Tech Stack

- **Frontend**: React (v18), Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: MySQL (using `mysql2` client connection pooling)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt password hashing
- **Icons**: Google Material Symbols

---

## Project Directory Structure

```text
Mainichi/
├── dist/                          # Production build output
├── mockups/                       # Design assets and mockups
├── server/                        # Backend Application Code
│   ├── index.js                   # Express Server, API endpoints, & SRS controllers
│   ├── init-db.js                 # DB connection and seeding controller
│   └── schema.sql                 # MySQL schema definitions
├── src/                           # Frontend React Code
│   ├── assets/                    # Vector graphics and UI images
│   ├── components/                # Reusable UI elements (Button3D, MasteryRing, etc.)
│   ├── constants/                 # Centralized curriculum database (lessons.js)
│   ├── context/                   # Global React contexts (AppContext, AuthContext)
│   ├── pages/                     # Main routing view components (Dashboard, Review, etc.)
│   ├── utils/                     # Client-side utility functions
│   ├── App.jsx                    # Routing table and app shell
│   ├── index.css                  # Typography, design system tokens, and global styling
│   └── main.jsx                   # React bootstrapper
├── package.json                   # Project scripts and dependencies
├── tailwind.config.js             # Tailwind utility styling theme configurations
└── vite.config.js                 # Vite compiler configurations
```

---

## Database Schema Design

The backend uses a highly structured relational MySQL schema containing the following tables:

*   **`mainichi_users`**: Manages authentication profiles, secure password hashes, and user metadata.
*   **`mainichi_decks`**: Stores vocabulary categories/decks, mapping their author (supports both admin-seeded default decks and user-created custom decks).
*   **`mainichi_vocabulary`**: Stores vocabulary flashcards, including fields for Kana phrases (`kanji`), Furigana helpers, English meanings, and pronunciation guidelines.
*   **`mainichi_user_decks`**: A join table mapping users to their downloaded decks, dictating which decks are visible in their active workspace.
*   **`mainichi_user_progress`**: Tracks active review logs for Spaced Repetition (SRS), including easiness factors, repetitions count, interval schedules, and due dates.
*   **`mainichi_user_stats`**: Tracks user study streaks (current and longest), last-active dates, and custom daily targets.
*   **`mainichi_deck_reviews`**: Stores user-submitted star ratings (1 to 5) and feedback comments for custom decks.
*   **`mainichi_user_lessons`**: Tracks user progress through the structured foundational curriculum.

---

## Spaced Repetition System (SRS) Mechanics

Mainichi utilizes a customized **SuperMemo SM-2** spaced repetition algorithm to optimize memory retention. When a user reviews a card and selects a difficulty (`hard`, `good`, `easy`), the backend processes their stats as follows:

1.  **Response Types**:
    *   **`hard`**: Sets interval days to `0` and resets repetitions to `0`. The card remains in the immediate review list.
    *   **`good`**: Increments repetitions count. If repetitions equal `1`, the next review is in `1` day; if `2`, it is scheduled for `4` days; if higher, it is scheduled for `previous_interval * easiness_factor` days.
    *   **`easy`**: Increments repetitions count, boosts the `easiness_factor` by `0.15` (meaning future intervals expand faster), and schedules the review date.
2.  **Daily Limit Restraining**: For the main JLPT N5 deck, reviews are automatically throttled to the user's customizable daily goal (e.g., 20 cards), accounting for reviews already completed in the user's local timezone.
3.  **Dynamic Unlocking**: Completing structured daily lessons unlocks relevant vocabulary records and logs them into `mainichi_user_progress` with `next_review_date = CURRENT_TIMESTAMP`, allowing them to filter directly into the SRS review queue.

---

## API Reference

### Authentication
*   `POST /api/auth/register` - Creates a new user profile.
*   `POST /api/auth/login` - Returns a JWT auth token.

### Decks & Discover
*   `GET /api/decks` - Fetches all decks, including their author profile and download status.
*   `POST /api/decks` - Publishes a custom deck.
*   `POST /api/decks/:id/download` - Unlocks and saves a deck to the user's list.
*   `DELETE /api/decks/:id/download` - Deletes a downloaded deck and removes its progress reviews.

### SRS & Progress
*   `GET /api/progress/stats` - Returns daily streaks, mastered words counts, and daily goal completion.
*   `GET /api/progress/due` - Fetches due review cards for a specific deck (filtered by daily limits).
*   `POST /api/progress/review` - Logs a review result and calculates the next scheduling interval.
*   `PUT /api/progress/settings` - Updates user preferences (daily goals, mastery requirements).

### Lessons Sync
*   `GET /api/lessons/completed` - Returns an array of lesson IDs completed by the authenticated user.
*   `POST /api/lessons/complete` - Records lesson completion, unlocks the parent deck, and immediately schedules the lesson's target words for review.

### Deck Reviews
*   `GET /api/decks/:deck_id/reviews` - Returns ratings and comments for a deck.
*   `POST /api/decks/:deck_id/reviews` - Submits a 1-5 star rating and comment (updates previous reviews in place).

---

## 📄 License
Private / Proprietary
