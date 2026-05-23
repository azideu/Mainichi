import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button3D from '../components/Button3D';

// Comprehensive Kana Database (46 Basic Sounds)
const KANA_DATA = [
  // Vowels
  { hiragana: 'あ', katakana: 'ア', romaji: 'a', strokeCount: 3, mnemonic: '“あ” looks like an Apple with a stem!', vocab: 'あさ', vocabKanji: '朝', vocabRomaji: 'asa', vocabMeaning: 'Morning', row: 0, col: 0 },
  { hiragana: 'い', katakana: 'イ', romaji: 'i', strokeCount: 2, mnemonic: '“い” looks like two Eels swimming!', vocab: 'いぬ', vocabKanji: '犬', vocabRomaji: 'inu', vocabMeaning: 'Dog', row: 1, col: 0 },
  { hiragana: 'う', katakana: 'ウ', romaji: 'u', strokeCount: 2, mnemonic: '“う” looks like a U-bend pipe tilted!', vocab: 'うち', vocabKanji: '家', vocabRomaji: 'uchi', vocabMeaning: 'House / Home', row: 2, col: 0 },
  { hiragana: 'え', katakana: 'エ', romaji: 'e', strokeCount: 2, mnemonic: '“え” looks like an Exotic bird on a branch!', vocab: 'えんぴつ', vocabKanji: '鉛筆', vocabRomaji: 'enpitsu', vocabMeaning: 'Pencil', row: 3, col: 0 },
  { hiragana: 'お', katakana: 'オ', romaji: 'o', strokeCount: 3, mnemonic: '“お” looks like a golf ball On a tee!', vocab: 'おいしい', vocabKanji: '美味しい', vocabRomaji: 'oishii', vocabMeaning: 'Delicious', row: 4, col: 0 },

  // K-Row
  { hiragana: 'か', katakana: 'カ', romaji: 'ka', strokeCount: 3, mnemonic: '“か” looks like a Kite flying in the wind!', vocab: 'かさ', vocabKanji: '傘', vocabRomaji: 'kasa', vocabMeaning: 'Umbrella', row: 0, col: 1 },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki', strokeCount: 4, mnemonic: '“き” looks like a Key to open a lock!', vocab: 'きっぷ', vocabKanji: '切符', vocabRomaji: 'kippu', vocabMeaning: 'Ticket', row: 1, col: 1 },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku', strokeCount: 1, mnemonic: '“く” looks like a Cuckoo bird’s beak!', vocab: 'くるま', vocabKanji: '車', vocabRomaji: 'kuruma', vocabMeaning: 'Car', row: 2, col: 1 },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke', strokeCount: 3, mnemonic: '“け” looks like a Keg of soda!', vocab: 'けいたい', vocabKanji: '携帯', vocabRomaji: 'keitai', vocabMeaning: 'Mobile Phone', row: 3, col: 1 },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko', strokeCount: 2, mnemonic: '“こ” looks like two Co-existing worms!', vocab: 'こども', vocabKanji: '子供', vocabRomaji: 'kodomo', vocabMeaning: 'Child', row: 4, col: 1 },

  // S-Row
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa', strokeCount: 3, mnemonic: '“さ” looks like a Samurai sword on a stand!', vocab: 'さかな', vocabKanji: '魚', vocabRomaji: 'sakana', vocabMeaning: 'Fish', row: 0, col: 2 },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi', strokeCount: 1, mnemonic: '“し” looks like a long, flowing strand of She’s hair!', vocab: 'しお', vocabKanji: '塩', vocabRomaji: 'shio', vocabMeaning: 'Salt', row: 1, col: 2 },
  { hiragana: 'す', katakana: 'ス', romaji: 'su', strokeCount: 2, mnemonic: '“す” looks like a Swing looping around!', vocab: 'すし', vocabKanji: '寿司', vocabRomaji: 'sushi', vocabMeaning: 'Sushi', row: 2, col: 2 },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se', strokeCount: 3, mnemonic: '“せ” looks like two people sitting on a Settee!', vocab: 'せんせい', vocabKanji: '先生', vocabRomaji: 'sensei', vocabMeaning: 'Teacher', row: 3, col: 2 },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so', strokeCount: 1, mnemonic: '“そ” looks like a Sewing stitch pattern!', vocab: 'そら', vocabKanji: '空', vocabRomaji: 'sora', vocabMeaning: 'Sky', row: 4, col: 2 },

  // T-Row
  { hiragana: 'た', katakana: 'タ', romaji: 'ta', strokeCount: 4, mnemonic: '“た” looks like the letters T and A!', vocab: 'たまご', vocabKanji: '卵', vocabRomaji: 'tamago', vocabMeaning: 'Egg', row: 0, col: 3 },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi', strokeCount: 2, mnemonic: '“ち” looks like a Cheerleader holding a ball!', vocab: 'ちず', vocabKanji: '地図', vocabRomaji: 'chizu', vocabMeaning: 'Map', row: 1, col: 3 },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', strokeCount: 1, mnemonic: '“つ” looks like a giant Tsunami wave!', vocab: 'つくえ', vocabKanji: '机', vocabRomaji: 'tsukue', vocabMeaning: 'Desk', row: 2, col: 3 },
  { hiragana: 'て', katakana: 'テ', romaji: 'te', strokeCount: 1, mnemonic: '“て” looks like a dog’s tail!', vocab: 'てがみ', vocabKanji: '手紙', vocabRomaji: 'tegami', vocabMeaning: 'Letter', row: 3, col: 3 },
  { hiragana: 'to', katakana: 'ト', romaji: 'to', strokeCount: 2, mnemonic: '“と” looks like a Thorn stuck in a toe!', vocab: 'ともだち', vocabKanji: '友達', vocabRomaji: 'tomodachi', vocabMeaning: 'Friend', row: 4, col: 3, hiraganaOverride: 'と' },

  // N-Row
  { hiragana: 'な', katakana: 'ナ', romaji: 'na', strokeCount: 4, mnemonic: '“な” looks like a Nun kneeling before a cross!', vocab: 'なつ', vocabKanji: '夏', vocabRomaji: 'natsu', vocabMeaning: 'Summer', row: 0, col: 4 },
  { hiragana: 'に', katakana: 'ニ', romaji: 'ni', strokeCount: 3, mnemonic: '“に” looks like two Needles laying flat!', vocab: 'にく', vocabKanji: '肉', vocabRomaji: 'niku', vocabMeaning: 'Meat', row: 1, col: 4 },
  { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', strokeCount: 2, mnemonic: '“ぬ” looks like a bowl of Noodles being twisted!', vocab: 'ぬるい', vocabKanji: '温い', vocabRomaji: 'nurui', vocabMeaning: 'Lukewarm', row: 2, col: 4 },
  { hiragana: 'ね', katakana: 'ネ', romaji: 'ne', strokeCount: 2, mnemonic: '“ね” looks like a Net with a fish caught in it!', vocab: 'ねこ', vocabKanji: '猫', vocabRomaji: 'neko', vocabMeaning: 'Cat', row: 3, col: 4 },
  { hiragana: 'の', katakana: 'ノ', romaji: 'no', strokeCount: 1, mnemonic: '“の” looks like a NO smoking sign!', vocab: 'のりもの', vocabKanji: '乗り物', vocabRomaji: 'norimono', vocabMeaning: 'Vehicle', row: 4, col: 4 },

  // H-Row
  { hiragana: 'は', katakana: 'ハ', romaji: 'ha', strokeCount: 3, mnemonic: '“は” looks like a Hockey stick and net!', vocab: 'はな', vocabKanji: '花', vocabRomaji: 'hana', vocabMeaning: 'Flower / Nose', row: 0, col: 5 },
  { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', strokeCount: 1, mnemonic: '“ひ” looks like a big He-he smile!', vocab: 'ひこうき', vocabKanji: '飛行機', vocabRomaji: 'hikouki', vocabMeaning: 'Airplane', row: 1, col: 5 },
  { hiragana: 'ふ', katakana: 'フ', romaji: 'fu', strokeCount: 4, mnemonic: '“ふ” looks like a Mt. Fuji sketch!', vocab: 'ふね', vocabKanji: '船', vocabRomaji: 'fune', vocabMeaning: 'Ship / Boat', row: 2, col: 5 },
  { hiragana: 'へ', katakana: 'ヘ', romaji: 'he', strokeCount: 1, mnemonic: '“へ” looks like a peak on the Horizon!', vocab: 'へや', vocabKanji: '部屋', vocabRomaji: 'heya', vocabMeaning: 'Room', row: 3, col: 5 },
  { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', strokeCount: 4, mnemonic: '“ほ” looks like a Hot stove with a chimney!', vocab: 'ほん', vocabKanji: '本', vocabRomaji: 'hon', vocabMeaning: 'Book', row: 4, col: 5 },

  // M-Row
  { hiragana: 'ま', katakana: 'マ', romaji: 'ma', strokeCount: 3, mnemonic: '“ま” looks like a Mast on a sailing ship!', vocab: 'まち', vocabKanji: '町', vocabRomaji: 'machi', vocabMeaning: 'Town / City', row: 0, col: 6 },
  { hiragana: 'み', katakana: 'ミ', romaji: 'mi', strokeCount: 2, mnemonic: '“み” looks like a Musical note!', vocab: 'みず', vocabKanji: '水', vocabRomaji: 'mizu', vocabMeaning: 'Water', row: 1, col: 6 },
  { hiragana: 'む', katakana: 'ム', strokeCount: 3, mnemonic: '“む” looks like a Mooing cow’s head!', vocab: 'むし', vocabKanji: '虫', vocabRomaji: 'mushi', vocabMeaning: 'Bug / Insect', row: 2, col: 6, romaji: 'mu' },
  { hiragana: 'め', katakana: 'メ', romaji: 'me', strokeCount: 2, mnemonic: '“め” looks like a messy plate of food!', vocab: 'めがね', vocabKanji: '眼鏡', vocabRomaji: 'megane', vocabMeaning: 'Glasses', row: 3, col: 6 },
  { hiragana: 'も', katakana: 'モ', romaji: 'mo', strokeCount: 3, mnemonic: '“も” looks like a fish hook to catch More fish!', vocab: 'もり', vocabKanji: '森', vocabRomaji: 'mori', vocabMeaning: 'Forest', row: 4, col: 6 },

  // Y-Row
  { hiragana: 'や', katakana: 'ヤ', romaji: 'ya', strokeCount: 3, mnemonic: '“や” looks like a Yak with long horns!', vocab: 'やま', vocabKanji: '山', vocabRomaji: 'yama', vocabMeaning: 'Mountain', row: 0, col: 7 },
  { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', strokeCount: 2, mnemonic: '“ゆ” looks like a Unicycle!', vocab: 'ゆき', vocabKanji: '雪', vocabRomaji: 'yuki', vocabMeaning: 'Snow', row: 2, col: 7 },
  { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', strokeCount: 2, mnemonic: '“よ” looks like a Yo-yo spinning!', vocab: 'よる', vocabKanji: '夜', vocabRomaji: 'yoru', vocabMeaning: 'Night', row: 4, col: 7 },

  // R-Row
  { hiragana: 'ら', katakana: 'ラ', romaji: 'ra', strokeCount: 2, mnemonic: '“ら” looks like a Rabbit sitting up!', vocab: 'らいねん', vocabKanji: '来年', vocabRomaji: 'rainen', vocabMeaning: 'Next Year', row: 0, col: 8 },
  { hiragana: 'り', katakana: 'リ', romaji: 'ri', strokeCount: 2, mnemonic: '“り” looks like two Reeds standing!', vocab: 'りんご', vocabKanji: '林檎', vocabRomaji: 'ringo', vocabMeaning: 'Apple', row: 1, col: 8 },
  { hiragana: 'る', katakana: 'ル', romaji: 'ru', strokeCount: 1, mnemonic: '“る” looks like a Route winding round!', vocab: 'るす', vocabKanji: '留守', vocabRomaji: 'rusu', vocabMeaning: 'Absence / Away', row: 2, col: 8 },
  { hiragana: 'れ', katakana: 'レ', romaji: 're', strokeCount: 2, mnemonic: '“れ” looks like a person resting!', vocab: 'れいぞうこ', vocabKanji: '冷蔵庫', vocabRomaji: 'reizouko', vocabMeaning: 'Refrigerator', row: 3, col: 8 },
  { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', strokeCount: 1, mnemonic: '“ろ” looks like a winding Road with no end loops!', vocab: 'ろく', vocabKanji: '六', vocabRomaji: 'roku', vocabMeaning: 'Six', row: 4, col: 8 },

  // W-Row / N
  { hiragana: 'わ', katakana: 'ワ', romaji: 'wa', strokeCount: 2, mnemonic: '“わ” looks like a Waterfall splashing down!', vocab: 'わたし', vocabKanji: '私', vocabRomaji: 'watashi', vocabMeaning: 'I / Me', row: 0, col: 9 },
  { hiragana: 'を', katakana: 'ヲ', romaji: 'wo', strokeCount: 3, mnemonic: '“を” looks like a person walking!', vocab: '〜を', vocabKanji: '〜を', vocabRomaji: '... o', vocabMeaning: 'Object particle', row: 2, col: 9 },
  { hiragana: 'ん', katakana: 'ン', romaji: 'n', strokeCount: 1, mnemonic: '“ん” looks like the letter N!', vocab: 'にほん', vocabKanji: '日本', vocabRomaji: 'nihon', vocabMeaning: 'Japan', row: 4, col: 9 }
];

// Sound Columns setup
const COLUMNS = [
  { name: 'Vowels', label: 'あ' },
  { name: 'K-Row', label: 'か' },
  { name: 'S-Row', label: 'さ' },
  { name: 'T-Row', label: 'た' },
  { name: 'N-Row', label: 'な' },
  { name: 'H-Row', label: 'は' },
  { name: 'M-Row', label: 'ま' },
  { name: 'Y-Row', label: 'や' },
  { name: 'R-Row', label: 'ら' },
  { name: 'W/N-Row', label: 'わ' }
];

const ROWS = [
  { idx: 0, label: 'a' },
  { idx: 1, label: 'i' },
  { idx: 2, label: 'u' },
  { idx: 3, label: 'e' },
  { idx: 4, label: 'o' }
];

// Helper to pronounce Japanese words using native SpeechSynthesis
const speakText = (text, rate = 0.8) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};

const Kana = () => {
  const [activeTab, setActiveTab] = useState('hiragana'); // 'hiragana' | 'katakana' | 'practice'
  const [selectedChar, setSelectedChar] = useState(KANA_DATA[0]);

  // Practice state
  const [selectedGroups, setSelectedGroups] = useState(['Vowels']); // Practice subsets
  const [practiceDeck, setPracticeDeck] = useState([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState('hiragana'); // Practice characters
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [choices, setChoices] = useState([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Set active selected character when switching Hiragana/Katakana grids
  const handleCharClick = (char) => {
    setSelectedChar(char);
    // Auto-pronounce
    speakText(activeTab === 'hiragana' ? (char.hiraganaOverride || char.hiragana) : char.katakana);
  };

  // Practice deck generators
  const startPractice = () => {
    // Map column labels to consonant columns
    const columnsToInclude = selectedGroups.map(grpName => COLUMNS.findIndex(c => c.name === grpName));
    
    // Filter database
    const pool = KANA_DATA.filter(char => columnsToInclude.includes(char.col));
    
    if (pool.length === 0) return;

    // Shuffle pool and slice 10 cards for practice
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const deck = shuffled.slice(0, 10);
    
    setPracticeDeck(deck);
    setPracticeIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setStreak(0);
    setScore(0);
    setSessionCompleted(false);
    generateQuizChoices(deck[0], pool);
  };

  const generateQuizChoices = (card, fullPool) => {
    const correctVal = card.romaji;
    // Get all other distractors
    const distractors = KANA_DATA
      .filter(c => c.romaji !== correctVal)
      .map(c => c.romaji)
      .filter((val, idx, self) => self.indexOf(val) === idx);
    
    // Shuffle and pick 3
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [...shuffledDistractors, correctVal].sort(() => 0.5 - Math.random());
    setChoices(options);
  };

  const handleChoiceSelect = (choice) => {
    if (showFeedback) return;
    
    setSelectedChoice(choice);
    setShowFeedback(true);
    const isCorrect = choice === practiceDeck[practiceIndex].romaji;
    
    const correctChar = practiceMode === 'hiragana' 
      ? (practiceDeck[practiceIndex].hiraganaOverride || practiceDeck[practiceIndex].hiragana) 
      : practiceDeck[practiceIndex].katakana;
      
    speakText(correctChar); // Play sounds immediately

    if (isCorrect) {
      setStreak(prev => prev + 1);
      setScore(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextPractice = () => {
    if (practiceIndex < practiceDeck.length - 1) {
      const nextIdx = practiceIndex + 1;
      setPracticeIndex(nextIdx);
      setSelectedChoice(null);
      setShowFeedback(false);
      
      const columnsToInclude = selectedGroups.map(grpName => COLUMNS.findIndex(c => c.name === grpName));
      const pool = KANA_DATA.filter(char => columnsToInclude.includes(char.col));
      generateQuizChoices(practiceDeck[nextIdx], pool);
    } else {
      setSessionCompleted(true);
    }
  };

  // Toggle rows selection helper
  const handleGroupToggle = (groupName) => {
    if (selectedGroups.includes(groupName)) {
      if (selectedGroups.length > 1) {
        setSelectedGroups(selectedGroups.filter(g => g !== groupName));
      }
    } else {
      setSelectedGroups([...selectedGroups, groupName]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-xl text-left"
    >
      {/* Editorial Header */}
      <div className="mb-8">
        <h1 className="font-h1 text-primary mb-2 tracking-tighter">Kana Sanctuary</h1>
        <p className="font-body-lg text-outline">Learn, study, and train your Hiragana (平仮名) and Katakana (片仮名) foundations.</p>
      </div>

      {/* Segmented Controller Tab Bar */}
      <div className="bg-surface rounded-2xl p-1 mb-8 shadow-paper-layer border border-outline/10 flex relative max-w-md">
        <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none mix-blend-multiply rounded-2xl"></div>
        {['hiragana', 'katakana', 'practice'].map((tab) => {
          const isSelected = activeTab === tab;
          let label = tab === 'hiragana' ? '平仮名 Hiragana' : tab === 'katakana' ? '片仮名 Katakana' : '仮名練習 Trainer';
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'practice') {
                  startPractice();
                }
              }}
              className={`flex-1 py-2 px-3 text-center rounded-xl font-label-caps text-[10px] tracking-wider z-10 transition-all font-bold ${
                isSelected ? 'text-primary bg-primary/10 border border-primary/10 shadow-sm' : 'text-outline hover:text-primary'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT GRID OR PRACTICE */}
      {activeTab !== 'practice' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: KANA TABLE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-3xl p-6 shadow-paper-layer border border-outline/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Headers Consonants Row */}
                <div className="grid grid-cols-10 gap-1.5 mb-2 pb-2 border-b border-outline/5 text-center">
                  {COLUMNS.map((col) => (
                    <div key={col.name} className="flex flex-col items-center">
                      <span className="font-label-caps text-[8px] text-outline leading-none">{col.name.split('-')[0]}</span>
                      <span className="text-[12px] font-bold text-primary leading-none mt-1">{col.label}</span>
                    </div>
                  ))}
                </div>

                {/* Rows Grid */}
                <div className="space-y-1.5">
                  {ROWS.map((row) => (
                    <div key={row.idx} className="grid grid-cols-10 gap-1.5 items-center">
                      {COLUMNS.map((col, cIdx) => {
                        // Find character matching row and column
                        const char = KANA_DATA.find(k => k.row === row.idx && k.col === cIdx);
                        
                        if (!char) {
                          return <div key={`${row.idx}-${cIdx}`} className="h-14"></div>; // Blank slot
                        }

                        const isSelected = selectedChar?.romaji === char.romaji;
                        const symbol = activeTab === 'hiragana' ? (char.hiraganaOverride || char.hiragana) : char.katakana;
                        
                        return (
                          <button
                            key={char.romaji}
                            onClick={() => handleCharClick(char)}
                            className={`h-14 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden group ${
                              isSelected 
                                ? 'bg-primary/10 border-primary shadow-sm text-primary font-bold' 
                                : 'bg-surface border-outline/5 hover:border-primary/20 hover:bg-surface-bright text-on-surface'
                            }`}
                          >
                            <span className="text-[18px] font-medium leading-none z-10" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
                              {symbol}
                            </span>
                            <span className="font-label-caps text-[8px] text-outline opacity-60 group-hover:opacity-100 mt-1 leading-none z-10">
                              {char.romaji}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="font-label-caps text-outline text-[9px] tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">volume_up</span> Tip: Tap any character above to hear its authentic pronunciation!
            </p>
          </div>

          {/* RIGHT 1/3 COLUMN: CHARACTER DETAIL STUDY CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {selectedChar && (
                  <motion.div
                    key={selectedChar.romaji}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-surface rounded-3xl p-6 shadow-paper-layer border border-outline/10 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none rounded-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      
                      {/* Big Japanese calligraph cell */}
                      <div className="relative w-36 h-36 bg-surface-container-lowest rounded-full border border-outline/10 flex items-center justify-center shadow-inner mb-4 overflow-hidden">
                        <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none"></div>
                        <div className="absolute inset-4 border border-dashed border-outline/10 rounded-full animate-[spin_40s_linear_infinite]"></div>
                        <span 
                          className="text-[72px] font-bold text-primary relative z-10 leading-none"
                          style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
                        >
                          {activeTab === 'hiragana' ? (selectedChar.hiraganaOverride || selectedChar.hiragana) : selectedChar.katakana}
                        </span>
                      </div>

                      {/* Header details */}
                      <div className="mb-4">
                        <h2 className="font-h2 text-on-surface">{selectedChar.romaji.toUpperCase()} Sound</h2>
                        <span className="font-label-caps text-[9px] text-outline tracking-wider border border-outline/10 bg-surface-container-low px-2 py-0.5 rounded-full mt-1.5 inline-block">
                          {selectedChar.strokeCount} STROKES
                        </span>
                      </div>

                      {/* Play Sound Trigger */}
                      <button
                        onClick={() => speakText(activeTab === 'hiragana' ? (selectedChar.hiraganaOverride || selectedChar.hiragana) : selectedChar.katakana, 0.75)}
                        className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-transform mb-6 shadow-sm"
                        title="Hear Sound"
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
                      </button>

                      {/* Mnemonic Memory Aid */}
                      <div className="w-full text-left bg-secondary/5 border border-secondary/15 rounded-2xl p-4 mb-6">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="material-symbols-outlined text-secondary text-[18px]">lightbulb</span>
                          <span className="font-label-caps text-secondary tracking-widest text-[9px] font-bold">MNEMONIC AID</span>
                        </div>
                        <p className="font-body-md text-on-surface-variant leading-relaxed">
                          {selectedChar.mnemonic}
                        </p>
                      </div>

                      {/* Example JLPT N5 Vocabulary */}
                      <div className="w-full text-left border-t border-outline/10 pt-4">
                        <span className="font-label-caps text-outline text-[9px] tracking-wider mb-3 block">EXAMPLE VOCABULARY</span>
                        <div className="bg-surface-container-low border border-outline/5 p-4 rounded-2xl flex justify-between items-center group">
                          <div>
                            <span 
                              className="text-[20px] font-bold text-primary tracking-wide block"
                              style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
                            >
                              {activeTab === 'hiragana' ? selectedChar.vocab : selectedChar.katakana === 'ア' ? 'アイス' : selectedChar.katakana === 'イ' ? 'インク' : selectedChar.katakana === 'ウ' ? 'ウサギ' : selectedChar.vocab}
                            </span>
                            <span className="font-label-caps text-[9px] text-outline tracking-wider font-bold block mt-0.5">
                              {selectedChar.vocabRomaji} • {selectedChar.vocabMeaning}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => speakText(activeTab === 'hiragana' ? selectedChar.vocab : selectedChar.katakana === 'ア' ? 'アイス' : selectedChar.katakana === 'イ' ? 'インク' : selectedChar.katakana === 'ウ' ? 'ウサギ' : selectedChar.vocab, 0.8)}
                            className="w-8 h-8 rounded-xl bg-surface border border-outline/10 text-outline hover:text-primary hover:border-primary/20 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[16px]">volume_up</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      ) : (
        /* TAB 3: SPEED PRACTICE TRAINER GAME */
        <div className="max-w-2xl mx-auto">
          {!practiceDeck.length || sessionCompleted ? (
            /* CONFIGURATION OR COMPLETE SCREEN */
            <div className="bg-surface rounded-3xl p-8 shadow-paper-layer border border-outline/10 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none rounded-3xl"></div>
              
              {!sessionCompleted ? (
                /* SETUP PANEL */
                <div className="relative z-10 space-y-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20 shadow-sm">
                    <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'wght' 300" }}>school</span>
                  </div>
                  <div>
                    <h2 className="font-h1 text-on-surface mb-2 tracking-tighter">Trainer Sanctuary</h2>
                    <p className="font-body-lg text-outline leading-relaxed">Customize your focus rows below to practice character recall drills.</p>
                  </div>

                  {/* Vowel or Katakana Toggle */}
                  <div className="flex gap-4 justify-center border-t border-b border-outline/5 py-4">
                    <button
                      onClick={() => setPracticeMode('hiragana')}
                      className={`px-4 py-2 rounded-xl font-label-caps text-[9px] tracking-widest font-bold border transition-all ${
                        practiceMode === 'hiragana' ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface border-outline/15 text-outline'
                      }`}
                    >
                      平仮名 HIRAGANA
                    </button>
                    <button
                      onClick={() => setPracticeMode('katakana')}
                      className={`px-4 py-2 rounded-xl font-label-caps text-[9px] tracking-widest font-bold border transition-all ${
                        practiceMode === 'katakana' ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface border-outline/15 text-outline'
                      }`}
                    >
                      片仮名 KATAKANA
                    </button>
                  </div>

                  {/* Character Column Grid selects */}
                  <div>
                    <span className="font-label-caps text-outline text-[9px] tracking-widest mb-4 block">SELECT STUDY ROWS</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {COLUMNS.map((col) => {
                        const isIncluded = selectedGroups.includes(col.name);
                        return (
                          <button
                            key={col.name}
                            onClick={() => handleGroupToggle(col.name)}
                            className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center ${
                              isIncluded 
                                ? 'bg-primary/5 border-primary text-primary font-bold shadow-sm' 
                                : 'bg-surface border-outline/10 text-outline hover:border-primary/20'
                            }`}
                          >
                            <span className="text-[14px]" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>{col.label}</span>
                            <span className="font-label-caps text-[8px] mt-1 opacity-70">{col.name.split('-')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline/5">
                    <Button3D variant="primary" onClick={startPractice} className="w-full py-5">
                      Begin Practice Run
                    </Button3D>
                  </div>
                </div>
              ) : (
                /* COMPLETION SCREEN */
                <div className="relative z-10 space-y-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-paper-layer">
                    <span className="material-symbols-outlined text-[42px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                  </div>
                  <div>
                    <h2 className="font-h1 text-on-surface mb-2 tracking-tighter">Session Completed!</h2>
                    <p className="font-body-lg text-outline leading-relaxed">You have completed your 10-card character drill.</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="bg-surface-container-low border border-outline/5 rounded-2xl p-4">
                      <span className="font-label-caps text-outline text-[9px] tracking-wider block mb-1">SCORE</span>
                      <span className="text-[24px] font-bold text-primary">{score} / 10</span>
                    </div>
                    <div className="bg-surface-container-low border border-outline/5 rounded-2xl p-4">
                      <span className="font-label-caps text-outline text-[9px] tracking-wider block mb-1">ACCURACY</span>
                      <span className="text-[24px] font-bold text-primary">{Math.round((score / 10) * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-outline/5">
                    <Button3D variant="secondary" onClick={() => setPracticeDeck([])} className="flex-1">
                      Adjust Rows
                    </Button3D>
                    <Button3D variant="primary" onClick={startPractice} className="flex-1">
                      Retry Drill
                    </Button3D>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ACTIVE TRAINER DRILL CARD */
            <div className="space-y-6">
              
              {/* Progress and Streaks Header */}
              <div className="flex justify-between items-center bg-surface border border-outline/10 p-4 rounded-2xl shadow-paper-layer">
                <button
                  onClick={() => setPracticeDeck([])}
                  className="font-label-caps tracking-widest text-[9px] text-outline hover:text-primary flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span> QUIT
                </button>

                {/* Center progress bar */}
                <div className="flex-1 max-w-[200px] sm:max-w-xs mx-4">
                  <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden border border-outline/5">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${((practiceIndex + 1) / practiceDeck.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Right streak fire indicator */}
                <div className="flex items-center gap-1 border border-primary/10 bg-primary/5 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-primary text-[16px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  <span className="font-label-caps text-primary font-bold text-[10px]">{streak}</span>
                </div>
              </div>

              {/* Main Calligraphy Card */}
              <div className="bg-surface rounded-3xl p-10 shadow-paper-layer border border-outline/10 relative overflow-hidden text-center flex flex-col items-center">
                <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none rounded-3xl"></div>
                
                {/* Visual circle frame */}
                <div className="relative w-44 h-44 bg-surface rounded-full border border-dashed border-outline/10 flex items-center justify-center mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none"></div>
                  <span 
                    className="text-[96px] font-bold text-primary leading-none"
                    style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
                  >
                    {practiceMode === 'hiragana' 
                      ? (practiceDeck[practiceIndex].hiraganaOverride || practiceDeck[practiceIndex].hiragana) 
                      : practiceDeck[practiceIndex].katakana
                    }
                  </span>
                </div>

                <p className="font-body-lg text-outline leading-relaxed mb-8">What is the correct Romaji reading for this character?</p>

                {/* Multiple choice Options Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {choices.map((choice) => {
                    const isSelected = selectedChoice === choice;
                    const isCorrectOption = choice === practiceDeck[practiceIndex].romaji;
                    
                    let btnStyle = "py-4 px-6 rounded-2xl border font-h2 shadow-sm text-center transition-all duration-200 flex items-center justify-center gap-2 ";
                    
                    if (!showFeedback) {
                      btnStyle += "bg-surface border-outline/10 hover:border-primary/30 hover:bg-surface-bright text-on-surface active:scale-[0.98]";
                    } else {
                      if (isCorrectOption) {
                        btnStyle += "bg-primary/10 border-primary text-primary font-bold";
                      } else if (isSelected) {
                        btnStyle += "bg-error/10 border-error text-error font-bold animate-shake";
                      } else {
                        btnStyle += "bg-surface-variant/20 border-outline/5 text-outline opacity-60";
                      }
                    }

                    return (
                      <button
                        key={choice}
                        disabled={showFeedback}
                        onClick={() => handleChoiceSelect(choice)}
                        className={btnStyle}
                      >
                        <span>{choice}</span>
                        {showFeedback && isCorrectOption && (
                          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                        )}
                        {showFeedback && isSelected && !isCorrectOption && (
                          <span className="material-symbols-outlined text-[16px] text-error">cancel</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation or Mnemonic Reveal */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-md mt-6 text-left bg-secondary/5 border border-secondary/15 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="material-symbols-outlined text-secondary text-[16px]">lightbulb</span>
                        <span className="font-label-caps text-secondary tracking-widest text-[9px] font-bold">MEMORY TIP</span>
                      </div>
                      <p className="font-body-md text-on-surface-variant leading-relaxed">
                        {practiceDeck[practiceIndex].mnemonic}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action footer button */}
                {showFeedback && (
                  <div className="w-full max-w-md mt-8 pt-6 border-t border-outline/5 flex justify-end">
                    <Button3D variant="primary" onClick={handleNextPractice} className="w-full sm:w-auto px-8">
                      {practiceIndex === practiceDeck.length - 1 ? 'Show Results' : 'Next Character'}
                      <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
                    </Button3D>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Kana;
