# Mainichi (毎日)

Mainichi is a joyful, tactile Japanese language learning platform designed for mobile-first mastery. It blends spaced repetition learning (SRS) with a structured daily foundations curriculum, dynamic community deck sharing, high-fidelity 3D micro-animations, and full mobile-native integration.

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
- **UI Elements**: Google Material Symbols, Lucide React Icons
- **Speech Integration**: HTML5 Web Speech Synthesis (with browser preview fallback) & App Inventor Speech Recognition

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
│   ├── components/                # Reusable UI elements (Button3D, ThemeDialog, etc.)
│   ├── constants/                 # Centralized curriculum database (lessons.js)
│   ├── context/                   # Global React contexts (AppContext, AuthContext, DialogContext)
│   ├── pages/                     # Main routing view components (Dashboard, Review, etc.)
│   ├── utils/                     # Client-side utility functions (appInventorBridge.js)
│   ├── App.jsx                    # Routing table, AppLayout, and app shell
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
*   **`mainichi_decks`**: Stores vocabulary categories/decks, mapping their author (supports both admin-seeded default decks and user-created custom decks). Includes a `deck_type` field to distinguish quiz flows.
*   **`mainichi_vocabulary`**: Stores vocabulary flashcards, including fields for Kanji/Kana phrases (`kanji`), Furigana helpers, English meanings, and reading guidelines.
*   **`mainichi_user_decks`**: A join table mapping users to their downloaded decks, dictating which decks are visible in their active workspace.
*   **`mainichi_user_progress`**: Tracks active review logs for Spaced Repetition (SRS), including easiness factors, repetitions count, interval schedules, and due dates.
*   **`mainichi_user_stats`**: Tracks user study streaks (current and longest), last-active dates, and custom daily targets.
*   **`mainichi_deck_reviews`**: Stores user-submitted star ratings (1 to 5) and feedback comments for custom decks.
*   **`mainichi_user_lessons`**: Tracks user progress through the structured foundational curriculum.

---

## MIT App Inventor Integration

Mainichi includes a high-fidelity communication bridge enabling full integration when wrapped inside the **MIT App Inventor** mobile client.

### Communication Bridge (`appInventorBridge.js`)
The bridge utilizes `window.AppInventor.setWebViewString` to send structured commands as JSON payloads. The mobile client intercepts these messages and performs native actions.

#### Actions Sent to App Inventor
- **`SPEAK`**: Commands the app to read text out loud using the phone's native Text-to-Speech (TTS) module.
- **`SAVE_TINYDB`**: Caches progress state or credentials locally on the device via native storage (`TinyDB`).
- **`GET_TINYDB`**: Requests cached data from the device's persistent storage.
- **`PLAY_MEDIA`**: Plays sound effects or audio assets loaded inside App Inventor.
- **`CONNECTION_STATUS`**: Updates the application when the phone moves online or offline to manage local syncing.

#### Actions Received from App Inventor
- **`TINYDB_RESPONSE`**: Dispatches cached progress data back to the webview (e.g. `mainichi_guest_data` for seamless guest sessions).
- **`SENSOR_DATA`**: Listens for device movement (e.g. `SHAKE` accelerometer events to shuffle active cards).
- **`SPEECH_RESULT`**: Inputs text returned from the device's native Speech Recognizer (allowing users to speak their answers).

### Responsive Layout Notch Fitting
To accommodate modern devices with screen camera cutouts, a dynamic notch adjustment is integrated:
- The app detects if it is running inside the iOS WebKit container or the App Inventor mobile webview.
- Adjusts the `--notch-gap` CSS custom property (typically `44px` on mobile wrappers and `0px` in standard browsers) to push headers and notification bars safely below the device status notch.

---

## Custom Premium Themed Dialogs

To maintain visual immersion, browser native blocking dialogs (`alert()` and `confirm()`) are completely replaced by an in-app overlay system:
* **Global Provider**: Triggered asynchronously from any component or hook using `await showAlert(message, title)` or `await showConfirm(message, title)`.
* **Aesthetics**: Styled with a dark glassmorphism blurred backdrop (`bg-black/40 backdrop-blur-sm`), a rounded Ivory washi paper sheet, and organic borders.
* **Smart Actions**: Integrates Google Material Symbols / Lucide Icons and uses custom tactile `Button3D` components, featuring warn/danger highlights (e.g. bright red warnings for deletes).

---

## Spaced Repetition System (SRS) Mechanics

Mainichi utilizes a customized **SuperMemo SM-2** spaced repetition algorithm to optimize memory retention. When a user reviews a card and selects a difficulty (`hard`, `good`, `easy`), the backend processes their stats as follows:

1.  **Response Types**:
    *   **`hard`**: Sets interval days to `0` and resets repetitions to `0`. The card remains in the immediate review list.
    *   **`good`**: Increments repetitions count. If repetitions equal `1`, the next review is in `1` day; if `2`, it is scheduled for `4` days; if higher, it is scheduled for `previous_interval * easiness_factor` days.
    *   **`easy`**: Increments repetitions count, boosts the `easiness_factor` by `0.15` (meaning future intervals expand faster), and schedules the review date.
2.  **Daily Limit Restraining**: For the main JLPT N5 deck, reviews are automatically throttled to the user's customizable daily goal (e.g., 20 cards), accounting for reviews already completed in the user's local timezone.
3.  **Dynamic Unlocking**: Completing structured daily lessons unlocks relevant vocabulary records and logs them into `mainichi_user_progress` with `next_review_date = CURRENT_TIMESTAMP`, allowing them to filter directly into the SRS review queue.

### Study Card Decks & Quiz Flows
The curriculum supports two distinct categories of decks:
*   **Kanji Decks**: Prompts the user to study and input multiple readings, covering the Kanji Recall phase, English meanings, and Japanese Onyomi/Kunyomi readings.
*   **Phrases/Sentences Decks**: Standardized simplified quiz flow where the user is shown the phrase/sentence, the English meaning, and is prompted to recall only the Furigana reading (bypassing Onyomi/Kunyomi).

---

## API Reference

### Authentication
*   `POST /api/auth/register` - Creates a new user profile.
*   `POST /api/auth/login` - Returns a JWT auth token.

### Decks & Discover
*   `GET /api/decks` - Fetches all decks, including their author profile and download status.
*   `POST /api/decks` - Publishes a custom deck (Kanji or Phrase/Sentence types).
*   `PUT /api/decks/:id` - Updates a custom deck's fields and dynamically reconciles card additions/deletions.
*   `DELETE /api/decks/:id` - Permanently deletes a custom deck and cleans up all study records.
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
*   `GET /api/decks/:deck_id/reviews` - Returns ratings, comments, and author `user_id` values.
*   `POST /api/decks/:deck_id/reviews` - Submits a 1-5 star rating and comment (updates previous reviews in place).
*   `DELETE /api/decks/:deck_id/reviews` - Deletes the user's review for a given deck.

---

## 📄 License
Private / Proprietary
