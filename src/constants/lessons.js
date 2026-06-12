// Centrally managed Japanese lessons database
export const LESSONS = [
  {
    id: 'greetings',
    title: 'Common Greetings',
    japaneseTitle: 'あいさつ',
    phrase: 'こんにちは',
    romaji: 'Konnichiwa',
    meaning: 'Hello / Good afternoon',
    icon: 'chat_bubble',
    difficulty: 'N5 (Beginner)',
    duration: '2 mins',
    unit: 'UNIT 1',
    description: 'Start your Japanese foundations with standard greetings and everyday etiquette.',
    slides: [
      {
        title: 'The Versatile Greeting',
        japaneseContent: 'こんにちは',
        romaji: 'Konnichiwa',
        content: '“Konnichiwa” is the most famous and widely used Japanese greeting. It is the go-to phrase for saying "Hello" or "Good afternoon" to friends, coworkers, and strangers alike.'
      },
      {
        title: 'Pronunciation & Spelling',
        japaneseContent: 'こんにち は',
        romaji: 'Konnichi wa',
        content: 'Although it is pronounced "Konnichi-wa", the final character is written as は (ha), not わ (wa). This is because historically, the greeting was short for "Konnichi wa gokigen ikaga desu ka?" (As for today, how are you feeling?). The "は" remains as the topic marker particle!'
      },
      {
        title: 'Time of Day Guidelines',
        japaneseContent: 'おはよう vs こんにちは vs こんばんは',
        romaji: 'Ohayou vs Konnichiwa vs Konbanwa',
        content: 'Use “Konnichiwa” primarily from late morning (around 10:30 AM) until dusk. For early mornings, use “Ohayou” (おはよう - Good morning), and for nighttime, use “Konbanwa” (こんばんは - Good evening).'
      }
    ],
    quiz: {
      question: 'Why is the final character in “こんにちは” written as は (ha) instead of わ (wa)?',
      options: [
        'It is a spelling mistake.',
        'It historically acted as the grammatical topic marker particle "wa".',
        'It is easier to write in Hiragana.',
        'It changes the meaning to goodbye.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Historically, the greeting was short for a longer phrase starting with "Konnichi wa..." (As for today...). The "は" (ha) represents the grammatical topic marker particle, which is pronounced as "wa".'
    }
  },
  {
    id: 'gratitude',
    title: 'Expressing Gratitude',
    japaneseTitle: '感謝',
    phrase: 'ありがとう',
    romaji: 'Arigatou',
    meaning: 'Thank you',
    icon: 'favorite',
    difficulty: 'N5 (Beginner)',
    duration: '2 mins',
    unit: 'UNIT 2',
    description: 'Learn how to thank friends and formal superiors politely in various social scenarios.',
    slides: [
      {
        title: 'The Warm Thank You',
        japaneseContent: 'ありがとう',
        romaji: 'Arigatou',
        content: '“Arigatou” is a warm, casual way to express thanks. It is perfect for close friends, family members, or peers.'
      },
      {
        title: 'Politeness Matters',
        japaneseContent: 'ありがとうございます',
        romaji: 'Arigatou gozaimasu',
        content: 'To express gratitude to superiors, teachers, or strangers, append "gozaimasu" to make it "Arigatou gozaimasu". This elevates it to a formal, polite level of respect.'
      },
      {
        title: 'Deep Gratitude Origin',
        japaneseContent: '有り難う',
        romaji: 'Arigatou (Kanji origin)',
        content: 'Historically, "Arigatou" comes from "ari-gatai", which literally means "difficult to exist" or "rare/precious". When someone does a favor, you are saying it is a rare and precious occurrence!'
      }
    ],
    quiz: {
      question: 'What should you append to “ありがとう” to make it formal and polite?',
      options: [
        'です (desu)',
        'ございます (gozaimasu)',
        'ます (masu)',
        'だよ (dayo)'
      ],
      correctAnswerIndex: 1,
      explanation: 'Appending "gozaimasu" makes it "Arigatou gozaimasu", which is the standard polite form of thank you in Japanese.'
    }
  },
  {
    id: 'first_meeting',
    title: 'First Impressions',
    japaneseTitle: '自己紹介',
    phrase: 'はじめまして',
    romaji: 'Hajimemashite',
    meaning: 'Nice to meet you',
    icon: 'sentiment_satisfied',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins',
    unit: 'UNIT 3',
    description: 'Master first-meeting self-introductions, name signing, and basic polite follow-ups.',
    slides: [
      {
        title: 'Meeting for the First Time',
        japaneseContent: 'はじめまして',
        romaji: 'Hajimemashite',
        content: '“Hajimemashite” is said when meeting someone for the very first time. It translates to "Nice to meet you" or "How do you do?".'
      },
      {
        title: 'The Beginning of a Journey',
        japaneseContent: '始める',
        romaji: 'Hajimeru (To begin)',
        content: 'The phrase comes from the verb "hajimeru" (始める) meaning "to begin" or "to start". By saying "Hajimemashite", you are literally declaring: "We are beginning our relationship."'
      },
      {
        title: 'Polite Follow-up',
        japaneseContent: 'よろしくおねがいします',
        romaji: 'Yoroshiku onegaishimasu',
        content: 'After introducing yourself, always finish with "Yoroshiku onegaishimasu". This humble phrase translates to "Please favor me" or "Please treat me kindly".'
      }
    ],
    quiz: {
      question: 'What verb does the phrase “はじめまして” stem from?',
      options: [
        'おわる (To end)',
        'はじめる (To begin)',
        'あそぶ (To play)',
        'はなす (To speak)'
      ],
      correctAnswerIndex: 1,
      explanation: '“Hajimemashite” stems from the verb "hajimeru" (始める), meaning "to begin", symbolizing the start of a new connection.'
    }
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    japaneseTitle: '道案内',
    phrase: '〜はどこですか',
    romaji: '... wa doko desu ka?',
    meaning: 'Where is...?',
    icon: 'map',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins',
    unit: 'UNIT 4',
    description: 'Master the essential phrase for finding stations, restrooms, hotels, and convenience stores.',
    slides: [
      {
        title: 'Where is...?',
        japaneseContent: '〜はどこですか',
        romaji: '... wa doko desu ka?',
        content: 'This is the ultimate survival phrase for navigating Japan. Simply insert a noun (like station, hotel, or bathroom) in place of the tilde (〜) to ask where it is.'
      },
      {
        title: 'Crucial Locations',
        japaneseContent: '駅はどこですか / トイレはどこですか',
        romaji: 'Eki wa doko desu ka? / Toire wa doko desu ka?',
        content: 'Common nouns to use: 駅 (Eki - Station), トイレ (Toire - Toilet), ホテル (Hoteru - Hotel), or コンビニ (Konbini - Convenience store).'
      },
      {
        title: 'Adding Politeness',
        japaneseContent: 'あのう、すみません。〜はどこですか',
        romaji: 'Anou, sumimasen. ... wa doko desu ka?',
        content: 'To be polite when asking strangers, start with "Anou, sumimasen" (Umm, excuse me) to capture their attention before asking your direction question.'
      }
    ],
    quiz: {
      question: 'How do you ask "Where is the station (eki)?" in Japanese?',
      options: [
        '駅はどれですか (Eki wa dore desu ka?)',
        '駅はどこですか (Eki wa doko desu ka?)',
        '駅はなんですか (Eki wa nan desu ka?)',
        '駅をください (Eki o kudasai)'
      ],
      correctAnswerIndex: 1,
      explanation: '“どこ (doko)” is the Japanese word for "where". Therefore, "Eki wa doko desu ka?" means "Where is the station?".'
    }
  },
  {
    id: 'food',
    title: 'Ordering Food',
    japaneseTitle: '注文',
    phrase: '〜をください',
    romaji: '... o kudasai',
    meaning: 'Please give me...',
    icon: 'restaurant',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins',
    unit: 'UNIT 5',
    description: 'Learn to confidently request water, menus, and order dishes in dining venues.',
    slides: [
      {
        title: 'Ordering Food',
        japaneseContent: '〜をください',
        romaji: '... o kudasai',
        content: 'To order food or request items in Japan, use the particle "o" (written as を) followed by "kudasai" (ください), which means "please give me".'
      },
      {
        title: 'Common Ordering Items',
        japaneseContent: '水をください / メニューをください',
        romaji: 'Mizu o kudasai / Menyuu o kudasai',
        content: 'Common words: 水 (Mizu - Water), メニュー (Menyuu - Menu), or any food item (e.g. ラーメンをください - Ramen, please).'
      },
      {
        title: 'Asking for Quantities',
        japaneseContent: 'これをひとつください',
        romaji: 'Kore o hitotsu kudasai',
        content: 'Point to a menu item and say "Kore o hitotsu kudasai" to mean "Please give me one of this". "ひとつ (hitotsu)" is the counter for one item.'
      }
    ],
    quiz: {
      question: 'What is the correct way to say "Water (mizu), please" in a Japanese restaurant?',
      options: [
        '水はどこですか (Mizu wa doko desu ka?)',
        '水をください (Mizu o kudasai)',
        '水はあります (Mizu wa arimasu)',
        '水をありがとう (Mizu o arigatou)'
      ],
      correctAnswerIndex: 1,
      explanation: '“をください (o kudasai)” is the standard way to request an item, making "Mizu o kudasai" the correct phrase for "Water, please".'
    }
  },
  {
    id: 'shopping',
    title: 'Shopping & Prices',
    japaneseTitle: '買い物',
    phrase: '〜はいくらですか',
    romaji: '... wa ikura desu ka?',
    meaning: 'How much is...?',
    icon: 'shopping_bag',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins',
    unit: 'UNIT 6',
    description: 'Learn to ask the price of items when shopping and identify Japanese Yen rates.',
    slides: [
      {
        title: 'Asking for Price',
        japaneseContent: '〜はいくらですか',
        romaji: '... wa ikura desu ka?',
        content: 'When shopping in Japan, use this phrase to find the price of any item. "いくら (ikura)" means "how much".'
      },
      {
        title: 'Pointing at Items',
        japaneseContent: 'これはいくらですか',
        romaji: 'Kore wa ikura desu ka?',
        content: 'Use "これ (kore)" to mean "this". If you are holding or pointing directly at an item, say "Kore wa ikura desu ka?" (How much is this?).'
      },
      {
        title: 'Responding to Prices',
        japaneseContent: '〜円です',
        romaji: '... en desu',
        content: 'Prices will be given in Japanese Yen, pronounced "en" (written as 円). For example, "1000円です" (Sen en desu) means "It is 1000 Yen".'
      }
    ],
    quiz: {
      question: 'What does the word “いくら (ikura)” mean?',
      options: [
        'Where',
        'Who',
        'How much',
        'What'
      ],
      correctAnswerIndex: 2,
      explanation: '“いくら (ikura)” is the question word for "how much" when asking for prices.'
    }
  },
  {
    id: 'time',
    title: 'Telling Time',
    japaneseTitle: '時間',
    phrase: 'いまなんじですか',
    romaji: 'Ima nan-ji desu ka?',
    meaning: 'What time is it now?',
    icon: 'schedule',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins',
    unit: 'UNIT 7',
    description: 'Master time asking and basic hours counting (PM/AM) for scheduling appointments.',
    slides: [
      {
        title: 'Asking the Time',
        japaneseContent: 'いまなんじですか',
        romaji: 'Ima nan-ji desu ka?',
        content: 'To ask for the current time, use this phrase. "いま (ima)" means "now", and "なんじ (nan-ji)" means "what hour".'
      },
      {
        title: 'Hours Counter',
        japaneseContent: '〜時',
        romaji: '... ji',
        content: 'Hours are counted by adding the suffix "ji" (時) to numbers. For example: 一時 (ichi-ji - 1 o\'clock), 二時 (ni-ji - 2 o\'clock), 三時 (san-ji - 3 o\'clock).'
      },
      {
        title: 'AM and PM',
        japaneseContent: '午前 / 午後',
        romaji: 'Gozen / Gogo',
        content: 'Add "午前 (gozen)" for AM or "午後 (gogo)" for PM before the time. For example: "午前九時 (gozen ku-ji)" is 9:00 AM.'
      }
    ],
    quiz: {
      question: 'How do you say "What time is it now?" in Japanese?',
      options: [
        'いまはどこですか (Ima wa doko desu ka?)',
        'いまなんじですか (Ima nan-ji desu ka?)',
        'なんじをください (Nan-ji o kudasai)',
        'いまはなんですか (Ima wa nan desu ka?)'
      ],
      correctAnswerIndex: 1,
      explanation: '“いまなんじですか (Ima nan-ji desu ka?)” translates to "Now what hour is it?", which is the standard way to ask for the time.'
    }
  }
];

export const FUTURE_LESSONS = [
  {
    id: 'weather',
    title: 'Talking about Weather',
    japaneseTitle: '天気',
    phrase: 'きょうはあついですね',
    romaji: 'Kyou wa atsui desu ne',
    meaning: 'It is hot today, isn\'t it?',
    icon: 'wb_sunny',
    difficulty: 'N5 (Beginner)',
    duration: '4 mins'
  },
  {
    id: 'hobbies',
    title: 'Sharing Hobbies',
    japaneseTitle: '趣味',
    phrase: 'しゅみはなんですか',
    romaji: 'Shumi wa nan desu ka?',
    meaning: 'What is your hobby?',
    icon: 'sports_esports',
    difficulty: 'N5 (Beginner)',
    duration: '5 mins'
  },
  {
    id: 'numbers',
    title: 'Counting Items',
    japaneseTitle: '数え方',
    phrase: 'ひとつ、ふたつ、みっつ',
    romaji: 'Hitotsu, futatsu, mittsu',
    meaning: 'One, two, three (items)',
    icon: 'pin',
    difficulty: 'N5 (Beginner)',
    duration: '4 mins'
  },
  {
    id: 'emergency',
    title: 'Emergency Help',
    japaneseTitle: '緊急',
    phrase: 'たすけてください',
    romaji: 'Tasukete kudasai',
    meaning: 'Please help me',
    icon: 'emergency',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins'
  }
];
