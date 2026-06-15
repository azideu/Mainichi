import { IS_APP_INVENTOR, saveToTinyDB } from './appInventorBridge';

// Override localStorage.getItem for guest users so we don't have to modify token retrieval on every page
const originalGetItem = localStorage.getItem;
localStorage.getItem = function (key) {
  if (key === 'mainichi_token' || key === 'mainichi_user') {
    const isGuest = sessionStorage.getItem('mainichi_guest') === 'true';
    if (isGuest) {
      return sessionStorage.getItem(key);
    }
  }
  return originalGetItem.call(localStorage, key);
};

// Helper to check if user is guest
const getIsGuest = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('mainichi_user') || 'null');
    return user && user.isGuest;
  } catch (e) {
    return false;
  }
};

const getGuestStats = () => {
  const defaultStats = {
    current_streak: 0,
    longest_streak: 0,
    last_study_date: null,
    words_mastered: 0,
    mastery_requirement: 10,
    daily_goal: 20
  };
  try {
    const stats = sessionStorage.getItem('mainichi_guest_stats');
    if (!stats) {
      sessionStorage.setItem('mainichi_guest_stats', JSON.stringify(defaultStats));
      return defaultStats;
    }
    const parsed = JSON.parse(stats);
    
    // Reset streak if we missed a day
    const todayStr = getLocalDateString();
    if (parsed.last_study_date) {
      const diffDays = getDaysDiff(todayStr, parsed.last_study_date);
      if (diffDays > 1) {
        parsed.current_streak = 0;
        sessionStorage.setItem('mainichi_guest_stats', JSON.stringify(parsed));
        syncGuestProgressToTinyDB();
      }
    }
    return parsed;
  } catch (e) {
    return defaultStats;
  }
};

const saveGuestStats = (stats) => {
  sessionStorage.setItem('mainichi_guest_stats', JSON.stringify(stats));
  syncGuestProgressToTinyDB();
};

const getGuestReviews = () => {
  try {
    return JSON.parse(sessionStorage.getItem('mainichi_guest_progress') || '{}');
  } catch (e) {
    return {};
  }
};

const saveGuestReviews = (reviews) => {
  sessionStorage.setItem('mainichi_guest_progress', JSON.stringify(reviews));
  syncGuestProgressToTinyDB();
};

const getGuestCompletedLessons = () => {
  try {
    return JSON.parse(sessionStorage.getItem('mainichi_guest_completed_lessons') || '[]');
  } catch (e) {
    return [];
  }
};

const saveGuestCompletedLessons = (lessons) => {
  sessionStorage.setItem('mainichi_guest_completed_lessons', JSON.stringify(lessons));
  syncGuestProgressToTinyDB();
};

const getGuestDownloadedDecks = () => {
  try {
    const decks = sessionStorage.getItem('mainichi_guest_downloaded_decks');
    if (!decks) {
      const initial = [1]; // Deck 1 (JLPT N5 Core) downloaded by default
      sessionStorage.setItem('mainichi_guest_downloaded_decks', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(decks);
  } catch (e) {
    return [1];
  }
};

const saveGuestDownloadedDecks = (decks) => {
  sessionStorage.setItem('mainichi_guest_downloaded_decks', JSON.stringify(decks));
  syncGuestProgressToTinyDB();
};

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDaysDiff = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return 0;
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffMs = Math.abs(d1.getTime() - d2.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

const recordGuestReview = (vocabId, rating, deckId = 1) => {
  const reviews = getGuestReviews();
  const stats = getGuestStats();
  
  let progress = reviews[vocabId] || {
    vocab_id: vocabId,
    deck_id: deckId,
    easiness_factor: 2.5,
    interval_days: 0,
    repetitions: 0
  };

  // Ensure deck_id is set
  if (deckId && !progress.deck_id) {
    progress.deck_id = deckId;
  }

  let quality = 0;
  if (rating === 'easy') quality = 5;
  if (rating === 'good') quality = 4;
  if (rating === 'hard') quality = 3;

  const intervals = [10, 90, 240, 1440, 4320, 10080, 20160, 43200, 129600, 259200];
  let intervalMinutes = 0;
  
  if (quality >= 3) {
    if (progress.repetitions < intervals.length) {
      intervalMinutes = intervals[progress.repetitions];
    } else {
      const lastInterval = progress.interval_days * 1440 || intervals[intervals.length - 1];
      intervalMinutes = Math.round(lastInterval * progress.easiness_factor);
    }
    progress.repetitions += 1;
  } else {
    progress.repetitions = 0;
    intervalMinutes = 10;
  }

  progress.interval_days = Math.max(1, Math.round(intervalMinutes / 1440));
  progress.easiness_factor = progress.easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (progress.easiness_factor < 1.3) progress.easiness_factor = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setMinutes(nextReviewDate.getMinutes() + intervalMinutes);
  progress.next_review_date = nextReviewDate.toISOString();
  progress.updated_at = new Date().toISOString();

  reviews[vocabId] = progress;
  saveGuestReviews(reviews);

  // Update streak
  const todayStr = getLocalDateString();
  let newStreak = stats.current_streak;
  let newLongest = stats.longest_streak;
  
  if (!stats.last_study_date) {
    newStreak = 1;
  } else {
    const diffDays = getDaysDiff(todayStr, stats.last_study_date);
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }
  
  if (newStreak > newLongest) {
    newLongest = newStreak;
  }
  
  stats.current_streak = newStreak;
  stats.longest_streak = newLongest;
  stats.last_study_date = todayStr;

  // Recalculate mastered words
  const reqReps = stats.mastery_requirement || 10;
  let masteredWordsCount = 0;
  Object.keys(reviews).forEach(k => {
    if (reviews[k].repetitions >= reqReps) {
      masteredWordsCount++;
    }
  });
  stats.words_mastered = masteredWordsCount;
  
  saveGuestStats(stats);
  
  return {
    success: true,
    next_review_date: progress.next_review_date,
    streak: newStreak,
    masteredWords: masteredWordsCount
  };
};

const recordGuestReviewOverride = (vocabId) => {
  const reviews = getGuestReviews();
  const progress = reviews[vocabId];
  if (!progress) return { success: false, error: 'No progress found to override' };
  
  progress.repetitions = Math.max(1, progress.repetitions);
  progress.easiness_factor = (progress.easiness_factor || 2.5) + 0.15;
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 1); // 1 day
  progress.next_review_date = nextReview.toISOString();
  progress.updated_at = new Date().toISOString();
  
  reviews[vocabId] = progress;
  saveGuestReviews(reviews);
  
  return { success: true, next_review_date: progress.next_review_date };
};

const completeGuestLesson = async (lessonId) => {
  const lessons = getGuestCompletedLessons();
  if (!lessons.includes(lessonId)) {
    lessons.push(lessonId);
    saveGuestCompletedLessons(lessons);
  }
  
  const LESSON_VOCAB_MAPPING = {
    greetings: { deckId: 2, words: ['こんにちは', 'はい', 'いいえ'] },
    gratitude: { deckId: 2, words: ['ありがとう', 'おねがいします'] },
    first_meeting: { deckId: 5, words: ['はじめまして', 'よろしくおねがいします'] },
    directions: { deckId: 2, words: ['トイレはどこですか', 'すみません'] },
    food: { deckId: 4, words: ['おみず', 'メニュー', 'ラーメン', 'おさら', 'スプーン'] },
    shopping: { deckId: 2, words: ['おかいけい、おねがいします'] },
    time: { deckId: 5, words: ['しょうしょうおまちください', 'おまたせしました'] }
  };
  
  const mapping = LESSON_VOCAB_MAPPING[lessonId];
  if (mapping) {
    const { deckId, words } = mapping;
    
    // Unlock deck
    const downloadedDecks = getGuestDownloadedDecks();
    if (!downloadedDecks.includes(deckId)) {
      downloadedDecks.push(deckId);
      saveGuestDownloadedDecks(downloadedDecks);
    }
    
    // Fetch deck vocabulary
    try {
      const res = await originalFetch(`/api/decks/${deckId}/vocab`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('mainichi_token')}`
        }
      });
      if (res.ok) {
        const vocabList = await res.json();
        const reviews = getGuestReviews();
        
        vocabList.forEach(vocab => {
          if (words.includes(vocab.kanji)) {
            if (!reviews[vocab.id]) {
              reviews[vocab.id] = {
                vocab_id: vocab.id,
                deck_id: deckId,
                easiness_factor: 2.5,
                interval_days: 0,
                repetitions: 0,
                next_review_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
            } else {
              reviews[vocab.id].next_review_date = new Date().toISOString();
              reviews[vocab.id].updated_at = new Date().toISOString();
            }
          }
        });
        saveGuestReviews(reviews);
      }
    } catch (e) {
      console.error("Failed to fetch vocabulary for guest completed lesson", e);
    }
  }
};

const getGuestDueCards = async (deckId) => {
  const res = await originalFetch(`/api/decks/${deckId}/vocab`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('mainichi_token')}`
    }
  });
  
  if (!res.ok) return [];
  const vocabList = await res.json();
  
  const reviews = getGuestReviews();
  const stats = getGuestStats();
  const now = new Date();
  
  const dueCards = vocabList.filter(vocab => {
    const progress = reviews[vocab.id];
    if (!progress) return true; // new card
    const nextReview = new Date(progress.next_review_date);
    return nextReview <= now;
  });
  
  if (deckId === 1) {
    const todayStr = getLocalDateString();
    let reviewsDoneToday = 0;
    Object.keys(reviews).forEach(k => {
      const rev = reviews[k];
      if (rev.updated_at && rev.updated_at.startsWith(todayStr)) {
        reviewsDoneToday++;
      }
    });
    
    const limit = Math.max(0, stats.daily_goal - reviewsDoneToday);
    return dueCards.slice(0, limit);
  }
  
  return dueCards;
};

const getGuestProgressDecks = async () => {
  const res = await originalFetch(`/api/decks`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('mainichi_token')}`
    }
  });
  if (!res.ok) return [];
  const decks = await res.json();
  
  const downloadedDecks = getGuestDownloadedDecks();
  const reviews = getGuestReviews();
  const stats = getGuestStats();
  
  const filtered = decks.filter(d => downloadedDecks.includes(d.id));
  
  return filtered.map(d => {
    let studiedCount = 0;
    let masteredCount = 0;
    
    Object.keys(reviews).forEach(k => {
      const rev = reviews[k];
      if (rev.deck_id === d.id) {
        studiedCount++;
        if (rev.repetitions >= stats.mastery_requirement) {
          masteredCount++;
        }
      }
    });
    
    return {
      ...d,
      studied_count: studiedCount,
      mastered_count: masteredCount
    };
  });
};

const resetGuestProgress = () => {
  sessionStorage.setItem('mainichi_guest_progress', '{}');
  const defaultStats = {
    current_streak: 0,
    longest_streak: 0,
    last_study_date: null,
    words_mastered: 0,
    mastery_requirement: 10,
    daily_goal: 20
  };
  sessionStorage.setItem('mainichi_guest_stats', JSON.stringify(defaultStats));
  sessionStorage.setItem('mainichi_guest_completed_lessons', '[]');
  sessionStorage.setItem('mainichi_guest_downloaded_decks', '[1]');
  syncGuestProgressToTinyDB();
};

const simulateGuestStreak = () => {
  const stats = getGuestStats();
  stats.current_streak = 5;
  stats.longest_streak = 5;
  saveGuestStats(stats);
};

// Global exports for saving/clearing to/from TinyDB
export const syncGuestProgressToTinyDB = () => {
  if (!IS_APP_INVENTOR) return;
  try {
    const isGuest = sessionStorage.getItem('mainichi_guest') === 'true';
    if (!isGuest) return;
    
    const user = JSON.parse(sessionStorage.getItem('mainichi_user') || 'null');
    const token = sessionStorage.getItem('mainichi_token');
    const stats = JSON.parse(sessionStorage.getItem('mainichi_guest_stats') || 'null');
    const reviews = JSON.parse(sessionStorage.getItem('mainichi_guest_progress') || 'null');
    const completedLessons = JSON.parse(sessionStorage.getItem('mainichi_guest_completed_lessons') || 'null');
    const unlockedDecks = JSON.parse(sessionStorage.getItem('mainichi_guest_downloaded_decks') || 'null');
    
    const payload = {
      user,
      token,
      stats,
      reviews,
      completedLessons,
      unlockedDecks
    };
    
    saveToTinyDB('mainichi_guest_data', payload);
  } catch (e) {
    console.error("Failed to sync guest progress to TinyDB", e);
  }
};

export const clearGuestProgressInTinyDB = () => {
  if (IS_APP_INVENTOR) {
    saveToTinyDB('mainichi_guest_data', null);
  }
};

// Intercept window.fetch
const originalFetch = window.fetch;
window.fetch = async function (url, options) {
  if (getIsGuest() && typeof url === 'string' && url.startsWith('/api/')) {
    const method = (options?.method || 'GET').toUpperCase();
    const urlObj = new URL(url, window.location.origin);
    const pathname = urlObj.pathname;
    
    // 1. Stats
    if (pathname === '/api/progress/stats' && method === 'GET') {
      const stats = getGuestStats();
      const todayStr = getLocalDateString();
      const reviews = getGuestReviews();
      let reviewsDoneToday = 0;
      Object.keys(reviews).forEach(k => {
        const rev = reviews[k];
        if (rev.updated_at && rev.updated_at.startsWith(todayStr)) {
          reviewsDoneToday++;
        }
      });
      return jsonResponse({
        streak: stats.current_streak,
        longestStreak: stats.longest_streak,
        masteredWords: stats.words_mastered,
        masteryRequirement: stats.mastery_requirement,
        dailyGoal: { current: reviewsDoneToday, total: stats.daily_goal }
      });
    }
    
    // 2. Settings
    if (pathname === '/api/progress/settings' && method === 'PUT') {
      const { masteryRequirement, dailyGoal } = JSON.parse(options.body);
      const stats = getGuestStats();
      stats.mastery_requirement = masteryRequirement;
      stats.daily_goal = dailyGoal;
      saveGuestStats(stats);
      return jsonResponse({ success: true });
    }
    
    // 3. Review
    if (pathname === '/api/progress/review' && method === 'POST') {
      const { vocab_id, rating, deck_id } = JSON.parse(options.body);
      const data = recordGuestReview(vocab_id, rating, deck_id);
      return jsonResponse(data);
    }

    // 4. Override
    if (pathname === '/api/progress/review/override' && method === 'POST') {
      const { vocab_id } = JSON.parse(options.body);
      const data = recordGuestReviewOverride(vocab_id);
      return jsonResponse(data);
    }

    // 5. Lessons completed
    if (pathname === '/api/lessons/completed' && method === 'GET') {
      const lessons = getGuestCompletedLessons();
      return jsonResponse(lessons);
    }

    // 6. Complete lesson
    if (pathname === '/api/lessons/complete' && method === 'POST') {
      const { lessonId } = JSON.parse(options.body);
      await completeGuestLesson(lessonId);
      return jsonResponse({ success: true, message: 'Lesson completed and review vocabulary unlocked.' });
    }

    // 7. Due reviews
    if (pathname === '/api/progress/due' && method === 'GET') {
      const deckId = parseInt(urlObj.searchParams.get('deckId') || '1', 10);
      const data = await getGuestDueCards(deckId);
      return jsonResponse(data);
    }

    // 8. Download/Delete deck
    if (pathname.startsWith('/api/decks/') && pathname.endsWith('/download')) {
      const parts = pathname.split('/');
      const deckId = parseInt(parts[3], 10);
      const downloadedDecks = getGuestDownloadedDecks();
      if (method === 'POST') {
        if (!downloadedDecks.includes(deckId)) {
          downloadedDecks.push(deckId);
          saveGuestDownloadedDecks(downloadedDecks);
        }
      } else if (method === 'DELETE') {
        const index = downloadedDecks.indexOf(deckId);
        if (index > -1) {
          downloadedDecks.splice(index, 1);
          saveGuestDownloadedDecks(downloadedDecks);
        }
      }
      return jsonResponse({ success: true });
    }

    // 9. Get decks
    if (pathname === '/api/decks' && method === 'GET') {
      const res = await originalFetch(url, options);
      if (res.ok) {
        const decks = await res.json();
        const downloadedDecks = getGuestDownloadedDecks();
        const mappedDecks = decks.map(d => ({
          ...d,
          downloaded: downloadedDecks.includes(d.id) ? 1 : 0
        }));
        return jsonResponse(mappedDecks);
      }
      return res;
    }

    // 10. Get progress decks
    if (pathname === '/api/progress/decks' && method === 'GET') {
      const res = await getGuestProgressDecks();
      return jsonResponse(res);
    }

    // 11. Demo Reset
    if (pathname === '/api/progress/demo/reset' && method === 'POST') {
      resetGuestProgress();
      return jsonResponse({ success: true });
    }

    // 12. Demo Simulate Streak
    if (pathname === '/api/progress/demo/simulate-streak' && method === 'POST') {
      simulateGuestStreak();
      return jsonResponse({ success: true });
    }

    // 13. Update Profile (save guest name and profile picture to sessionStorage)
    if (pathname === '/api/user/profile' && method === 'PUT') {
      const { name, profile_picture } = JSON.parse(options.body);
      const user = JSON.parse(sessionStorage.getItem('mainichi_user') || '{}');
      user.name = name;
      user.profile_picture = profile_picture;
      sessionStorage.setItem('mainichi_user', JSON.stringify(user));
      syncGuestProgressToTinyDB();
      return jsonResponse({ success: true, user });
    }

    // 14. Subscriptions (reject for guest)
    if (pathname === '/api/user/subscribe' && method === 'POST') {
      return jsonResponse({ error: 'Guests cannot purchase premium subscriptions. Please register to unlock premium features!' }, 400);
    }
  }

  return originalFetch(url, options);
};
