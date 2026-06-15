import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button3D from '../components/Button3D';
import LoadingState from '../components/LoadingState';
import HankoStamp from '../components/HankoStamp';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { createPortal } from 'react-dom';

const SYSTEM_REVIEWS = {
  1: [
    { id: 1, author: "KenjiS", rating: 5, date: "2 days ago", comment: "Perfect compilation of N5 kanji. The progression feels natural and matches standard class materials closely." },
    { id: 2, author: "Aiko_JP", rating: 5, date: "1 week ago", comment: "The brush strokes feel extremely authentic. Essential study path for any beginner." }
  ],
  2: [
    { id: 3, author: "GaijinSensei", rating: 4, date: "3 days ago", comment: "Excellent travel reference! Helped me order ramen flawlessly in Kyoto. High recommendation." },
    { id: 4, author: "TabiLover", rating: 5, date: "5 days ago", comment: "Beautifully organized. The furigana notes are spot on for quick reference." }
  ],
  default: [
    { id: 5, author: "Shokunin", rating: 5, date: "Just now", comment: "Incredibly useful! High-quality custom list with precise definitions. Perfect addition to the main daily path." }
  ]
};

const getPreviewFontSize = (text) => {
  if (!text) return 'text-[24px]';
  const len = text.length;
  if (len <= 2) return 'text-[24px]';
  if (len === 3) return 'text-[18px]';
  if (len === 4) return 'text-[15px]';
  if (len === 5) return 'text-[13px]';
  return 'text-[11px] px-1 text-center leading-tight';
};

const Community = () => {
  const navigate = useNavigate();
  const { user, setIsPremiumModalOpen, becomeCreator } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const [activeTab, setActiveTab] = useState('discover'); // discover | workshop
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(user?.is_creator === 1 || localStorage.getItem('mainichi_is_creator') === 'true');

  useEffect(() => {
    if (user) {
      setIsCreator(user.is_creator === 1 || localStorage.getItem('mainichi_is_creator') === 'true');
    }
  }, [user]);
  
  // Modals & Drawers State
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [selectedDeckVocab, setSelectedDeckVocab] = useState([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewTab, setPreviewTab] = useState('words'); // words | reviews
  const [hoveredWord, setHoveredWord] = useState(null);
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    setSupportsHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  // Search & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Reviews & Ratings state
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Compute filtered & sorted decks
  const filteredDecks = decks
    .filter(deck => {
      const query = searchQuery.toLowerCase();
      return (
        deck.title.toLowerCase().includes(query) ||
        (deck.description && deck.description.toLowerCase().includes(query)) ||
        (deck.author && deck.author.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'popular') return b.word_count - a.word_count;
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });
  
  // Creator Application Wizard State
  const [showCreatorWizard, setShowCreatorWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [creatorHandle, setCreatorHandle] = useState('');
  const [creatorBio, setCreatorBio] = useState('');
  const [creatorFocus, setCreatorFocus] = useState([]);
  const [signedName, setSignedName] = useState('');

  // Deck Creator Form State
  const [showCreatorForm, setShowCreatorForm] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newDeckPremium, setNewDeckPremium] = useState(false);
  const [newDeckType, setNewDeckType] = useState('kanji'); // 'kanji' | 'phrase'
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [newDeckVocab, setNewDeckVocab] = useState([
    { kanji: '', furigana: '', onyomi: '', kunyomi: '', english: '' }
  ]);
  const [isSubmittingDeck, setIsSubmittingDeck] = useState(false);

  // Fetch Decks from DB
  const fetchDecks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch('/api/decks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDecks(data);
      }
    } catch (err) {
      console.error("Failed to fetch community decks", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // Download / Unlock Deck
  const handleDownload = async (deckId, isPremium) => {
    if (isPremium && user?.is_premium !== 1) {
      setIsPremiumModalOpen(true);
      return;
    }
    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch(`/api/decks/${deckId}/download`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Refresh decks list to show unlocked status
        await fetchDecks();
        // If drawer is open, update selected deck unlocked state
        if (selectedDeck && selectedDeck.id === deckId) {
          setSelectedDeck(prev => ({ ...prev, downloaded: 1 }));
        }
      }
    } catch (err) {
      console.error("Failed to download deck", err);
    }
  };

  // Remove / Deactivate Deck
  const handleRemove = async (deckId) => {
    const confirmed = await showConfirm("Are you sure you want to remove this deck and all its study records from your account?", "Remove Deck");
    if (!confirmed) return;
    
    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch(`/api/decks/${deckId}/download`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Refresh decks list to show unlocked status
        await fetchDecks();
        // If drawer is open, update selected deck unlocked state
        if (selectedDeck && selectedDeck.id === deckId) {
          setSelectedDeck(prev => ({ ...prev, downloaded: 0 }));
        }
      } else {
        await showAlert("Failed to remove deck. Please try again.", "Error");
      }
    } catch (err) {
      console.error("Failed to remove deck", err);
      await showAlert("Error occurred while removing deck.", "Error");
    }
  };

  // Fetch reviews for a deck
  const fetchReviews = async (deckId) => {
    try {
      setIsReviewsLoading(true);
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch(`/api/decks/${deckId}/reviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
        
        // Pre-populate if current user has already reviewed
        const userReview = data.find(r => r.user_id === user?.id);
        if (userReview) {
          setNewReviewRating(userReview.rating);
          setNewReviewComment(userReview.comment);
        } else {
          setNewReviewRating(5);
          setNewReviewComment('');
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedDeck) return;
    const confirmed = await showConfirm("Are you sure you want to delete your review for this deck?", "Delete Review");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch(`/api/decks/${selectedDeck.id}/reviews`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        await fetchReviews(selectedDeck.id);
        await showAlert("Review deleted successfully.", "Success");
      } else {
        const errData = await res.json();
        await showAlert(errData.error || "Failed to delete review.", "Error");
      }
    } catch (err) {
      console.error("Failed to delete review", err);
      await showAlert("Error occurred while deleting review.", "Error");
    }
  };

  // Submit a review for a deck
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (user?.isGuest) {
      await showAlert("Guest users cannot write reviews. Please create an account to share your thoughts!", "Account Required");
      return;
    }
    if (!selectedDeck) return;
    if (newReviewRating < 1 || newReviewRating > 5) {
      await showAlert("Please select a rating between 1 and 5 stars.", "Validation Error");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch(`/api/decks/${selectedDeck.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newReviewRating,
          comment: newReviewComment
        })
      });

      if (res.ok) {
        setNewReviewComment('');
        setNewReviewRating(5);
        // Refresh reviews
        await fetchReviews(selectedDeck.id);
      } else {
        const errData = await res.json();
        await showAlert(errData.error || "Failed to submit review.", "Error");
      }
    } catch (err) {
      console.error("Failed to submit review", err);
      await showAlert("Error occurred while submitting review.", "Error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Open Preview Drawer and fetch vocabulary list
  const handleOpenPreview = async (deck) => {
    setSelectedDeck(deck);
    setPreviewTab('words');
    setIsPreviewLoading(true);
    setNewReviewRating(5);
    setNewReviewComment('');

    try {
      const token = localStorage.getItem('mainichi_token');
      const vocabPromise = fetch(`/api/decks/${deck.id}/vocab`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.ok ? r.json() : []);

      const [vocabData] = await Promise.all([
        vocabPromise,
        fetchReviews(deck.id)
      ]);
      setSelectedDeckVocab(vocabData);
    } catch (err) {
      console.error("Failed to fetch vocabulary preview", err);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Handle deck creator vocab additions
  const handleAddVocabRow = () => {
    setNewDeckVocab([...newDeckVocab, { kanji: '', furigana: '', onyomi: '', kunyomi: '', english: '' }]);
  };

  const handleRemoveVocabRow = (index) => {
    if (newDeckVocab.length > 1) {
      setNewDeckVocab(newDeckVocab.filter((_, idx) => idx !== index));
    }
  };

  const handleVocabChange = (index, field, value) => {
    const updated = [...newDeckVocab];
    updated[index][field] = value;
    setNewDeckVocab(updated);
  };

  // Submit new deck
  const handleOpenCreateForm = () => {
    setEditingDeckId(null);
    setNewDeckTitle('');
    setNewDeckDesc('');
    setNewDeckPremium(false);
    setNewDeckType('kanji');
    setNewDeckVocab([{ kanji: '', furigana: '', onyomi: '', kunyomi: '', english: '' }]);
    setShowCreatorForm(true);
  };

  const handleEditClick = (deck) => {
    setNewDeckTitle(deck.title);
    setNewDeckDesc(deck.description || '');
    setNewDeckPremium(deck.is_premium === 1);
    setNewDeckType(deck.deck_type || 'kanji');
    setNewDeckVocab(selectedDeckVocab.map(v => ({
      id: v.id,
      kanji: v.kanji,
      furigana: v.furigana || '',
      onyomi: v.onyomi || '',
      kunyomi: v.kunyomi || '',
      english: v.english
    })));
    setEditingDeckId(deck.id);
    setSelectedDeck(null);
    setShowCreatorForm(true);
  };

  const handleDeleteDeck = async (deckId) => {
    const confirmed = await showConfirm("Are you sure you want to permanently delete this deck? This action cannot be undone and will erase all associated progress records.", "Delete Deck");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch(`/api/decks/${deckId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setSelectedDeck(null);
        await fetchDecks();
        await showAlert("Deck deleted successfully.", "Success");
      } else {
        const errData = await res.json();
        await showAlert(errData.error || "Failed to delete deck.", "Error");
      }
    } catch (err) {
      console.error("Failed to delete deck", err);
    }
  };

  const handlePublishDeck = async (e) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) {
      await showAlert("Please specify a Deck Title.", "Validation Error");
      return;
    }
    
    // Filter and validate non-empty rows
    const validVocab = newDeckVocab.filter(v => v.kanji.trim() && v.english.trim());
    if (validVocab.length === 0) {
      await showAlert("Please add at least one vocabulary card with a Kanji/Phrase and English meaning.", "Validation Error");
      return;
    }

    try {
      setIsSubmittingDeck(true);
      const token = localStorage.getItem('mainichi_token');
      
      const url = editingDeckId ? `/api/decks/${editingDeckId}` : '/api/decks';
      const method = editingDeckId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newDeckTitle,
          description: newDeckDesc,
          is_premium: newDeckPremium,
          deck_type: newDeckType,
          vocabulary: validVocab
        })
      });

      if (res.ok) {
        // Reset form
        setNewDeckTitle('');
        setNewDeckDesc('');
        setNewDeckPremium(false);
        setNewDeckType('kanji');
        setNewDeckVocab([{ kanji: '', furigana: '', onyomi: '', kunyomi: '', english: '' }]);
        setEditingDeckId(null);
        setShowCreatorForm(false);
        
        // Refresh and return
        await fetchDecks();
      } else {
        const errData = await res.json();
        await showAlert(errData.error || `Failed to ${editingDeckId ? 'update' : 'publish'} deck.`, "Error");
      }
    } catch (err) {
      console.error(`Failed to ${editingDeckId ? 'update' : 'publish'} deck`, err);
    } finally {
      setIsSubmittingDeck(false);
    }
  };

  // Creator focus area selector toggle
  const toggleFocus = (focus) => {
    if (creatorFocus.includes(focus)) {
      setCreatorFocus(creatorFocus.filter(f => f !== focus));
    } else {
      setCreatorFocus([...creatorFocus, focus]);
    }
  };

  // Creator approval finalization
  const handleCreatorApprove = async () => {
    if (user?.isGuest) {
      localStorage.setItem('mainichi_is_creator', 'true');
      setIsCreator(true);
      setWizardStep(4);
      return;
    }
    const success = await becomeCreator();
    if (success) {
      setWizardStep(4);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const panelVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.15
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  if (isLoading) {
    return <LoadingState message="Connecting to scholars..." />;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto pb-6 md:pb-xl px-2 sm:px-4">
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-4 md:mb-8 hidden md:flex justify-between items-end">
        <div>
          <h1 className="font-h1 text-primary mb-2 tracking-tighter">Community</h1>
          <p className="font-body-md text-outline tracking-wide">Share custom paths and study with standard lists.</p>
        </div>
        
        {isCreator && activeTab === 'workshop' && (
          <Button3D variant="primary" onClick={handleOpenCreateForm} className="w-auto py-3 px-5 text-sm">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Create Deck
          </Button3D>
        )}
      </motion.div>

      {/* Main Tabs */}
      <motion.div variants={itemVariants} className="flex bg-surface-variant/30 rounded-xl p-1 mb-4 md:mb-8 backdrop-blur-sm border border-outline/10">
        <button 
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 font-label-caps tracking-widest rounded-xl transition-all duration-300 ${activeTab === 'discover' ? 'bg-surface shadow-paper-layer text-primary border border-outline/10' : 'text-outline hover:text-on-surface'}`}
        >
          DISCOVER
        </button>
        <button 
          onClick={() => setActiveTab('workshop')}
          className={`flex-1 py-3 font-label-caps tracking-widest rounded-xl transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'workshop' ? 'bg-surface shadow-paper-layer text-secondary border border-outline/10' : 'text-outline hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-[16px]">hardware</span> WORKSHOP
        </button>
      </motion.div>

      {/* Discover Decks / Workshop Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'discover' && (
          <motion.div
            key="discover"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
            className="space-y-6 mb-16"
          >
            {/* Search & Sort Filter Bar */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 bg-surface rounded-2xl p-3 md:p-4 shadow-paper-layer border border-outline/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>
              
              {/* Search Input */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search decks or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-variant/30 hover:bg-surface-variant/50 focus:bg-surface-bright border border-outline/15 rounded-xl pl-9 pr-4 py-2 text-[11px] focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-surface border border-outline/15 rounded-xl pl-3 pr-8 py-2 text-[11px] font-medium focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-surface-bright transition-colors appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Cards Count (High-Low)</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[14px] text-outline pointer-events-none">unfold_more</span>
              </div>
            </motion.div>

            {filteredDecks.length === 0 ? (
              <div className="bg-surface rounded-2xl p-10 border border-outline/10 text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
                <span className="material-symbols-outlined text-[48px] text-outline opacity-50 mb-2">import_contacts</span>
                <p className="font-body-md text-outline">No matching decks found. Try a different query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {filteredDecks.map(deck => (
                  <motion.div 
                    variants={itemVariants} 
                    key={deck.id} 
                    onClick={() => handleOpenPreview(deck)}
                    className="bg-surface rounded-2xl p-4 md:p-md border border-outline/10 shadow-paper-layer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6 group relative overflow-hidden transition-colors hover:border-primary/20 cursor-pointer"
                  >
                    {/* Washi Texture */}
                    <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
                    {/* Ink wash hover */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-h3 text-on-surface tracking-tight group-hover:text-primary transition-colors">{deck.title}</h3>
                        {deck.is_premium === 1 && (
                          <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[9px] font-label-caps px-2 py-0.5 rounded-full tracking-widest whitespace-nowrap shrink-0">
                            PREMIUM
                          </span>
                        )}
                        {deck.downloaded === 1 && (
                          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-label-caps px-2 py-0.5 rounded-full tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">check</span> ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="font-body-md text-on-surface-variant text-sm mb-2 md:mb-4 leading-relaxed line-clamp-2">{deck.description || 'No description provided.'}</p>
                      <div className="flex items-center gap-6 text-xs font-label-caps text-outline tracking-widest">
                        <span className="flex items-center gap-1.5">
                          Crafted by <span className="text-on-surface font-semibold">{deck.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">menu_book</span> {deck.word_count} cards
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-auto relative z-10 flex gap-2">
                      {deck.downloaded === 1 ? (
                        <Button3D 
                          variant="primary" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/flashcard?deckId=${deck.id}`);
                          }}
                        >
                          Study Now
                        </Button3D>
                      ) : (
                        <Button3D 
                          variant={deck.is_premium === 1 ? 'primary' : 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(deck.id, deck.is_premium === 1);
                          }}
                        >
                          {deck.is_premium === 1 ? 'Unlock Deck' : 'Download'}
                        </Button3D>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'workshop' && (
          <motion.div
            key="workshop"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
            className="space-y-8 mb-16"
          >
            {!isCreator ? (
              <motion.div variants={itemVariants} className="bg-primary-container rounded-3xl p-4 md:p-lg text-center border border-primary/20 shadow-paper-layer relative overflow-hidden">
                <div className="absolute inset-0 bg-washi opacity-40 mix-blend-multiply pointer-events-none"></div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-[56px] text-primary mb-4" style={{ fontVariationSettings: "'wght' 200" }}>storefront</span>
                  <h3 className="font-h3 text-on-primary-container mb-3 tracking-tight">Become a Creator</h3>
                  <p className="font-body-md text-on-primary-container/85 mb-8 max-w-md mx-auto leading-relaxed">
                    Join other master scholars. Share your custom vocabulary lists with the world and unlock creator achievements.
                  </p>
                  <Button3D variant="primary" onClick={() => { setWizardStep(1); setShowCreatorWizard(true); }} className="max-w-[200px] mx-auto">
                    Apply Now
                  </Button3D>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-md border border-dashed border-outline/20 flex flex-col justify-center items-center text-center py-10 shadow-sm cursor-pointer hover:border-primary/40 transition-colors" onClick={handleOpenCreateForm}>
                  <span className="material-symbols-outlined text-[48px] text-primary/50 mb-3">add_circle</span>
                  <h3 className="font-h3 text-on-surface mb-1">Create a Custom Deck</h3>
                  <p className="font-body-md text-outline max-w-sm">Design, add vocabulary, and publish your own Japanese learning deck.</p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h2 className="font-label-caps text-outline tracking-widest mb-3 md:mb-4">YOUR HANDCRAFTED DECKS</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-md">
                  {decks.filter(d => d.author === creatorHandle || d.author === user?.name || d.author === 'Admin').map(deck => (
                    <motion.div 
                      variants={itemVariants}
                      key={deck.id} 
                      onClick={() => handleOpenPreview(deck)} 
                      className="bg-surface rounded-2xl p-4 md:p-md border border-outline/10 shadow-paper-layer flex flex-col justify-between cursor-pointer hover:border-secondary/30 transition-colors relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-h3 text-on-surface group-hover:text-secondary transition-colors">{deck.title}</h4>
                          {deck.is_premium === 1 && (
                            <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[8px] font-label-caps px-2 py-0.5 rounded-full tracking-widest whitespace-nowrap shrink-0">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="font-body-md text-on-surface-variant text-sm mb-6 line-clamp-2">{deck.description || 'No description.'}</p>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-label-caps text-outline tracking-widest border-t border-outline/5 pt-3 mt-2">
                        <span>{deck.word_count} CARDS</span>
                        <span className="text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">visibility</span> PREVIEW
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. DECK DETAIL & PREVIEW DRAWER (Washi Sliding Panel) */}
      {/* ========================================================================= */}
      {createPortal(
        <AnimatePresence>
          {selectedDeck && (
            <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeck(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Sliding Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-surface-bright h-full shadow-ambient border-l border-outline/10 flex flex-col z-10"
            >
              {/* Authentic Washi Texture */}
              <div className="absolute inset-0 bg-washi opacity-35 mix-blend-multiply pointer-events-none"></div>

              {/* Drawer Header */}
              <div className="relative z-10 pt-[calc(16px+env(safe-area-inset-top,0px)+var(--notch-gap))] pb-4 px-4 md:pt-[calc(24px+env(safe-area-inset-top,0px))] md:pb-md md:px-md border-b border-outline/10 flex justify-between items-center bg-surface">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px] md:text-[28px]">import_contacts</span>
                  <span className="font-label-caps text-outline tracking-widest text-xs">DECK ARCHIVE</span>
                </div>
                <button onClick={() => setSelectedDeck(null)} className="text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-md space-y-4 md:space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="font-h2 text-on-surface tracking-tight leading-none">{selectedDeck.title}</h2>
                    {selectedDeck.is_premium === 1 && (
                      <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[9px] font-label-caps px-2 py-0.5 rounded-full tracking-widest whitespace-nowrap shrink-0">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  <p className="font-body-md text-outline text-xs tracking-wider font-label-caps mb-3">BY <span className="text-on-surface font-semibold">{selectedDeck.author}</span></p>
                  <p className="font-body-lg text-on-surface-variant leading-relaxed bg-surface/50 border border-outline/5 rounded-xl p-4">{selectedDeck.description || "No description provided."}</p>
                </div>

                {/* Sub Tabs Inside Drawer */}
                <div className="flex border-b border-outline/10 p-0.5 bg-surface-variant/20 rounded-xl">
                  <button 
                    onClick={() => setPreviewTab('words')}
                    className={`flex-1 py-2 font-label-caps tracking-widest text-xs rounded-lg transition-all ${previewTab === 'words' ? 'bg-surface text-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
                  >
                    VOCABULARY ({selectedDeckVocab.length})
                  </button>
                  <button 
                    onClick={() => setPreviewTab('reviews')}
                    className={`flex-1 py-2 font-label-caps tracking-widest text-xs rounded-lg transition-all ${previewTab === 'reviews' ? 'bg-surface text-secondary shadow-sm' : 'text-outline hover:text-on-surface'}`}
                  >
                    SCHOLAR REVIEWS
                  </button>
                </div>

                {/* Vocabulary Grid Tab */}
                {previewTab === 'words' && (
                  <div className="space-y-4">
                    {isPreviewLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <span className="text-outline text-xs font-label-caps tracking-widest">Retrieving words...</span>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 md:gap-sm">
                          {selectedDeckVocab.map(word => (
                            <div 
                              key={word.id}
                              onMouseEnter={() => {
                                if (supportsHover) setHoveredWord(word);
                              }}
                              onMouseLeave={() => {
                                if (supportsHover) setHoveredWord(null);
                              }}
                              onClick={() => {
                                if (!supportsHover) {
                                  setHoveredWord(prev => prev?.id === word.id ? null : word);
                                }
                              }}
                              className={`aspect-square bg-surface border rounded-xl flex items-center justify-center font-h2 text-on-surface shadow-paper-layer transition-all hover:scale-105 cursor-pointer relative overflow-hidden group select-none ${hoveredWord?.id === word.id ? 'border-primary bg-primary/5' : 'border-outline/10'}`}
                            >
                              <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>
                              <span className={`${getPreviewFontSize(word.kanji)} font-bold text-on-surface`} style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>{word.kanji}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Tooltip Detail Panel */}
                        <div className="h-24 md:h-32 mt-4 md:mt-6">
                          <AnimatePresence mode="wait">
                            {hoveredWord ? (
                              <motion.div 
                                key={hoveredWord.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-surface rounded-2xl p-4 border border-primary/20 shadow-md relative overflow-hidden h-full flex flex-col justify-center"
                              >
                                <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
                                <div className="flex justify-between items-start relative z-10">
                                  <div>
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-h2 text-primary">{hoveredWord.kanji}</span>
                                      {hoveredWord.furigana && (
                                        <span className="text-sm font-body-md text-outline font-medium">({hoveredWord.furigana})</span>
                                      )}
                                    </div>
                                    <p className="font-body-md text-on-surface-variant font-medium mt-1 leading-snug">{hoveredWord.english}</p>
                                  </div>
                                  <div className="text-right text-[10px] font-label-caps text-outline tracking-widest leading-normal">
                                    {hoveredWord.onyomi && <div>ON: {hoveredWord.onyomi}</div>}
                                    {hoveredWord.kunyomi && <div>KUN: {hoveredWord.kunyomi}</div>}
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="h-full flex items-center justify-center border border-dashed border-outline/15 rounded-2xl bg-surface/30">
                                <p className="font-body-md text-outline text-xs text-center leading-relaxed">
                                  <span className="material-symbols-outlined text-[18px] align-middle mr-1.5">ads_click</span>
                                  Hover or tap on a card to study its readings/meanings
                                </p>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Scholarly Reviews Tab */}
                {previewTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Write Review Form */}
                    {selectedDeck.downloaded === 1 && (() => {
                      if (user?.isGuest) {
                        return (
                          <div className="bg-surface rounded-2xl p-6 border border-outline/10 shadow-sm relative overflow-hidden mb-6 text-center">
                            <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>
                            <span className="material-symbols-outlined text-[32px] text-outline mb-2">lock</span>
                            <p className="font-body-md text-sm text-outline font-semibold mb-1">Scholar Reviews Locked</p>
                            <p className="font-body-md text-xs text-outline/80">Please create an account to share your thoughts and rate custom paths!</p>
                          </div>
                        );
                      }
                      const hasExistingReview = reviews.some(r => r.user_id === user?.id);
                      return (
                        <form onSubmit={handleSubmitReview} className="bg-surface rounded-2xl p-4 border border-outline/10 shadow-sm relative overflow-hidden mb-6">
                          <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>
                          <h4 className="font-label-caps text-on-surface text-xs tracking-wider font-semibold mb-3 relative z-10 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-secondary">rate_review</span>
                            {hasExistingReview ? "Edit Your Scholar Review" : "Write a Scholar Review"}
                          </h4>
                          
                          <div className="flex items-center gap-1 mb-3 relative z-10">
                            <span className="font-label-caps text-outline text-[10px] tracking-wider font-semibold mr-2">YOUR RATING:</span>
                            {[1, 2, 3, 4, 5].map((starValue) => (
                              <button
                                key={starValue}
                                type="button"
                                onClick={() => setNewReviewRating(starValue)}
                                className="text-secondary hover:scale-110 transition-transform focus:outline-none"
                              >
                                <span 
                                  className="material-symbols-outlined text-[20px]" 
                                  style={{ fontVariationSettings: `'FILL' ${newReviewRating >= starValue ? 1 : 0}` }}
                                >
                                  star
                                </span>
                              </button>
                            ))}
                          </div>
 
                          <div className="mb-4 relative z-10">
                            <textarea
                              value={newReviewComment}
                              onChange={(e) => setNewReviewComment(e.target.value)}
                              placeholder="Share your thoughts about this custom path..."
                              rows={3}
                              maxLength={500}
                              className="w-full bg-surface-bright border border-outline/25 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-secondary focus:outline-none transition-colors shadow-sm resize-none"
                            />
                          </div>
 
                          <div className="flex justify-end gap-3 relative z-10">
                            {hasExistingReview && (
                              <button
                                type="button"
                                onClick={handleDeleteReview}
                                disabled={isSubmittingReview}
                                className="py-2.5 px-4 text-[11px] font-label-caps tracking-wider font-semibold rounded-xl bg-surface border border-error/30 text-error hover:bg-error/5 hover:border-error/50 transition-colors active:scale-[0.98] flex items-center gap-1.5"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                Delete
                              </button>
                            )}
                            <Button3D
                              type="submit"
                              variant="secondary"
                              disabled={isSubmittingReview}
                              className="py-2.5 px-4 text-xs font-semibold w-full sm:w-auto"
                            >
                              {isSubmittingReview ? "Submitting..." : (hasExistingReview ? "Update Review" : "Submit Review")}
                            </Button3D>
                          </div>
                        </form>
                      );
                    })()}

                    {/* Loader */}
                    {isReviewsLoading && (
                      <div className="flex justify-center items-center py-4">
                        <div className="w-5 h-5 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* Reviews List */}
                    {(!isReviewsLoading || reviews.length > 0) && (
                      <div className="space-y-4">
                        {(reviews.length > 0 ? reviews : (SYSTEM_REVIEWS[selectedDeck.id] || SYSTEM_REVIEWS.default)).map(rev => (
                          <div key={rev.id} className="bg-surface rounded-2xl p-4 border border-outline/10 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                              <div>
                                <span className="font-body-md font-semibold text-on-surface text-sm">{rev.author}</span>
                                <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[7px] font-label-caps px-1.5 py-0.5 rounded-full tracking-wider ml-2 font-semibold font-semibold">SCHOLAR</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-outline font-mono">
                                  {rev.date || new Date(rev.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                {user && rev.user_id === user.id && (
                                  <button
                                    onClick={handleDeleteReview}
                                    className="text-outline hover:text-error transition-colors p-1"
                                    title="Delete Review"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-secondary text-[12px] mb-2 relative z-10">
                              {[...Array(rev.rating)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              ))}
                              {[...Array(5 - rev.rating)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                              ))}
                            </div>
                            <p 
                              className="text-on-surface-variant leading-relaxed text-sm relative z-10"
                              style={{ fontFamily: "'Georgia', 'Noto Serif JP', serif", fontStyle: "italic" }}
                            >
                              "{rev.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Drawer Bottom Bar (Purchase/Study) */}
              <div className="relative z-10 p-md border-t border-outline/10 bg-surface flex flex-col gap-3">
                {user && selectedDeck.author_id === user.id && (
                  <div className="flex gap-2 w-full border-b border-outline/10 pb-3 mb-1">
                    <button
                      type="button"
                      onClick={() => handleEditClick(selectedDeck)}
                      className="flex-1 py-2.5 rounded-xl bg-surface border border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-colors text-xs font-label-caps tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit Path
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDeck(selectedDeck.id)}
                      className="flex-1 py-2.5 rounded-xl bg-surface border border-error/30 text-error hover:bg-error/5 hover:border-error/50 transition-colors text-xs font-label-caps tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                      Delete Path
                    </button>
                  </div>
                )}
                {selectedDeck.downloaded === 1 ? (
                  <div className="flex gap-2 w-full">
                    <Button3D 
                      variant="primary" 
                      onClick={() => {
                        setSelectedDeck(null);
                        navigate(`/flashcard?deckId=${selectedDeck.id}`);
                      }}
                      className="flex-1"
                    >
                      Study path now
                      <span className="material-symbols-outlined ml-2">arrow_right_alt</span>
                    </Button3D>
                    {selectedDeck.id !== 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemove(selectedDeck.id)}
                        className="px-4 py-3 rounded-xl bg-surface border border-error/25 text-error hover:bg-error/5 hover:border-error/45 transition-all text-xs font-label-caps tracking-wider flex items-center gap-1 active:scale-[0.98]"
                        title="Remove Path"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <Button3D 
                    variant={selectedDeck.is_premium === 1 ? 'primary' : 'secondary'}
                    onClick={() => handleDownload(selectedDeck.id, selectedDeck.is_premium === 1)}
                  >
                    {selectedDeck.is_premium === 1 ? 'Unlock & Download Custom Path' : 'Download to Study Queue'}
                  </Button3D>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* ========================================================================= */}
      {/* 2. CREATOR APPLICATION WIZARD OVERLAY */}
      {/* ========================================================================= */}
      {createPortal(
        <AnimatePresence>
          {showCreatorWizard && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (wizardStep !== 4) setShowCreatorWizard(false); }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Wizard Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-surface-bright rounded-3xl p-lg border border-outline/10 shadow-ambient overflow-hidden z-10"
            >
              {/* Authentic Washi Texture */}
              <div className="absolute inset-0 bg-washi opacity-35 mix-blend-multiply pointer-events-none"></div>

              {/* Step indicator */}
              <div className="flex justify-between items-center mb-6 relative z-10 border-b border-outline/5 pb-3">
                <span className="font-label-caps text-primary tracking-widest text-xs font-semibold">APPLICATION STEPS</span>
                <span className="font-mono text-xs text-outline font-semibold">{wizardStep}/4</span>
              </div>

              {/* STEP 1: Handle & Bio */}
              {wizardStep === 1 && (
                <div className="space-y-6 relative z-10">
                  <div>
                    <h3 className="font-h2 text-on-surface mb-2 tracking-tight">Tell us your Moniker</h3>
                    <p className="font-body-md text-outline text-sm">Select your creator signature and write a brief description of your focus.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="font-label-caps text-outline tracking-wider text-[10px] mb-2 block font-semibold">CREATOR HANDLE</label>
                      <input 
                        type="text" 
                        value={creatorHandle} 
                        onChange={(e) => setCreatorHandle(e.target.value)} 
                        placeholder="e.g. SushiMaster"
                        className="w-full bg-surface border border-outline/25 rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:outline-none transition-colors shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-outline tracking-wider text-[10px] mb-2 block font-semibold">Haiku/Creator Bio</label>
                      <textarea 
                        value={creatorBio} 
                        onChange={(e) => setCreatorBio(e.target.value)} 
                        placeholder="e.g. Master of Kyoto paths, guiding learners through local food kanji..."
                        rows={3}
                        className="w-full bg-surface border border-outline/25 rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:outline-none transition-colors shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  <Button3D 
                    variant="primary" 
                    onClick={async () => {
                      if (!creatorHandle.trim() || !creatorBio.trim()) {
                        await showAlert("Please fill in your Creator Handle and Bio.", "Validation Error");
                        return;
                      }
                      setWizardStep(2);
                    }}
                  >
                    Continue Journey
                    <span className="material-symbols-outlined">arrow_right_alt</span>
                  </Button3D>
                </div>
              )}

              {/* STEP 2: Focus Specialization */}
              {wizardStep === 2 && (
                <div className="space-y-6 relative z-10">
                  <div>
                    <h3 className="font-h2 text-on-surface mb-2 tracking-tight">Your Deck Speciality</h3>
                    <p className="font-body-md text-outline text-sm">Choose the branches of study you plan to handcraft for our sanctuary.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-sm py-2">
                    {['Vocabulary', 'Grammar Notes', 'Travel Phrases', 'Slang & Idioms'].map(focus => {
                      const selected = creatorFocus.includes(focus);
                      return (
                        <button
                          key={focus}
                          onClick={() => toggleFocus(focus)}
                          className={`py-3 px-4 rounded-xl border text-center font-label-caps text-xs tracking-widest transition-all ${selected ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-surface border-outline/10 text-outline hover:border-primary/30'}`}
                        >
                          {focus}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <div className="w-[120px] shrink-0">
                      <Button3D variant="secondary" onClick={() => setWizardStep(1)}>Back</Button3D>
                    </div>
                    <div className="flex-1">
                      <Button3D 
                        variant="primary" 
                        onClick={async () => {
                          if (creatorFocus.length === 0) {
                            await showAlert("Please select at least one speciality focus.", "Validation Error");
                            return;
                          }
                          setWizardStep(3);
                        }}
                      >
                        Verify Signature
                      </Button3D>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Signature & Red Hanko Stamp */}
              {wizardStep === 3 && (
                <div className="space-y-6 relative z-10">
                  <div>
                    <h3 className="font-h2 text-on-surface mb-2 tracking-tight">Sign the Scholar Pact</h3>
                    <p className="font-body-md text-outline text-sm">Verify your moniker by writing down your signed handle below to authorize your application.</p>
                  </div>

                  <div>
                    <label className="font-label-caps text-outline tracking-wider text-[10px] mb-2 block font-semibold">SIGN SIGNATURE</label>
                    <input 
                      type="text" 
                      value={signedName} 
                      onChange={(e) => setSignedName(e.target.value)} 
                      placeholder="Type your handle name to sign..."
                      className="w-full bg-surface border border-outline/25 rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:outline-none transition-colors shadow-sm font-serif italic text-lg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="w-[120px] shrink-0">
                      <Button3D variant="secondary" onClick={() => setWizardStep(2)}>Back</Button3D>
                    </div>
                    <div className="flex-1">
                      <Button3D 
                        variant="primary" 
                        onClick={async () => {
                          if (!signedName.trim()) {
                            await showAlert("Please enter your signature handle to sign.", "Validation Error");
                            return;
                          }
                          handleCreatorApprove();
                        }}
                      >
                        Authorize Stamp
                      </Button3D>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Success & Celebration */}
              {wizardStep === 4 && (
                <div className="space-y-6 relative z-10 text-center py-6 flex flex-col items-center">
                  <HankoStamp text="合格" size={100} className="mb-4" />
                  
                  <div>
                    <h3 className="font-h1 text-primary tracking-tighter mb-2">Creator Approved!</h3>
                    <p className="font-body-lg text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                      Your moniker <span className="text-on-surface font-semibold">"{creatorHandle}"</span> has been officially sealed into our Sanctuary records.
                    </p>
                  </div>

                  <Button3D 
                    variant="primary" 
                    onClick={() => {
                      setShowCreatorWizard(false);
                      setWizardStep(1);
                    }}
                    className="w-full mt-4"
                  >
                    Enter Workshop
                  </Button3D>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE DECK CREATOR WORKSHOP FORM DRAWER */}
      {/* ========================================================================= */}
      {createPortal(
        <AnimatePresence>
          {showCreatorForm && (
            <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isSubmittingDeck) setShowCreatorForm(false); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Form Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl bg-surface-bright h-full shadow-ambient border-l border-outline/10 flex flex-col z-10"
            >
              {/* Authentic Washi Texture */}
              <div className="absolute inset-0 bg-washi opacity-35 mix-blend-multiply pointer-events-none"></div>

              {/* Header */}
              <div className="relative z-10 pt-[calc(24px+env(safe-area-inset-top,0px)+var(--notch-gap))] pb-md px-md border-b border-outline/10 flex justify-between items-center bg-surface">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[28px]">handyman</span>
                  <span className="font-label-caps text-outline tracking-widest text-xs font-semibold">HANDCRAFT NEW PATH</span>
                </div>
                <button onClick={() => setShowCreatorForm(false)} className="text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handlePublishDeck} className="relative z-10 flex-1 overflow-y-auto p-md space-y-6">
                <div>
                  <label className="font-label-caps text-outline tracking-wider text-[10px] mb-2 block font-semibold">DECK TITLE</label>
                  <input 
                    type="text" 
                    value={newDeckTitle} 
                    onChange={(e) => setNewDeckTitle(e.target.value)} 
                    placeholder="e.g. Master Kyoto Restaurants"
                    required
                    className="w-full bg-surface border border-outline/25 rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:outline-none transition-colors shadow-sm"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-outline tracking-wider text-[10px] mb-2 block font-semibold">DESCRIPTION</label>
                  <textarea 
                    value={newDeckDesc} 
                    onChange={(e) => setNewDeckDesc(e.target.value)} 
                    placeholder="Describe what cards are included and how learners should study them..."
                    rows={3}
                    className="w-full bg-surface border border-outline/25 rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:outline-none transition-colors shadow-sm resize-none"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-outline tracking-wider text-[10px] mb-2 block font-semibold">DECK TYPE</label>
                  <div className="flex border border-outline/15 p-0.5 bg-surface rounded-xl shadow-sm">
                    <button 
                      type="button"
                      onClick={() => setNewDeckType('kanji')}
                      className={`flex-1 py-2 font-label-caps tracking-widest text-xs rounded-lg transition-all ${newDeckType === 'kanji' ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
                    >
                      Kanji
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewDeckType('phrase')}
                      className={`flex-1 py-2 font-label-caps tracking-widest text-xs rounded-lg transition-all ${newDeckType === 'phrase' ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
                    >
                      Phrases/Sentences
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-surface border border-outline/10 p-4 rounded-xl shadow-sm">
                  <input 
                    type="checkbox" 
                    id="deckPremium" 
                    checked={newDeckPremium}
                    onChange={(e) => setNewDeckPremium(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <label htmlFor="deckPremium" className="font-label-caps text-on-surface tracking-wider text-xs cursor-pointer select-none">
                    MARK DECK AS <span className="text-tertiary font-semibold">PREMIUM COLLECTION</span>
                  </label>
                </div>

                {/* Vocabulary Lists */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-outline/5 pb-2">
                    <span className="font-label-caps text-outline tracking-widest text-xs font-semibold">VOCABULARY CARDS ({newDeckVocab.length})</span>
                    <button 
                      type="button" 
                      onClick={handleAddVocabRow}
                      className="font-label-caps text-secondary text-xs hover:text-secondary-variant transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span> ADD CARD
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newDeckVocab.map((card, idx) => (
                      <div key={idx} className="bg-surface border border-outline/10 rounded-2xl p-4 space-y-4 relative shadow-sm">
                        {newDeckVocab.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveVocabRow(idx)}
                            className="absolute right-3 top-3 text-outline hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                        
                        <div className="grid grid-cols-2 gap-md pt-2">
                          <div>
                            <label className="font-label-caps text-outline text-[9px] tracking-wider mb-1 block font-semibold">
                              {newDeckType === 'phrase' ? 'PHRASE/SENTENCE (文)' : 'KANJI (単語)'}
                            </label>
                            <input 
                              type="text" 
                              value={card.kanji} 
                              onChange={(e) => handleVocabChange(idx, 'kanji', e.target.value)} 
                              placeholder={newDeckType === 'phrase' ? 'e.g. お元気ですか' : 'e.g. 先生'}
                              required
                              className="w-full bg-surface-bright border border-outline/20 rounded-lg px-3 py-2 text-on-surface text-sm focus:border-secondary focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="font-label-caps text-outline text-[9px] tracking-wider mb-1 block font-semibold">ENGLISH (英語)</label>
                            <input 
                              type="text" 
                              value={card.english} 
                              onChange={(e) => handleVocabChange(idx, 'english', e.target.value)} 
                              placeholder="e.g. teacher, doctor"
                              required
                              className="w-full bg-surface-bright border border-outline/20 rounded-lg px-3 py-2 text-on-surface text-sm focus:border-secondary focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        {newDeckType === 'phrase' ? (
                          <div>
                            <label className="font-label-caps text-outline text-[9px] tracking-wider mb-1 block font-semibold">FURIGANA / READING (よみがな)</label>
                            <input 
                              type="text" 
                              value={card.furigana} 
                              onChange={(e) => handleVocabChange(idx, 'furigana', e.target.value)} 
                              placeholder="e.g. おげんきですか"
                              required
                              className="w-full bg-surface-bright border border-outline/20 rounded-lg px-3 py-2 text-on-surface text-sm focus:border-secondary focus:outline-none transition-colors"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-sm">
                            <div>
                              <label className="font-label-caps text-outline text-[8px] tracking-wider mb-1 block">FURIGANA</label>
                              <input 
                                type="text" 
                                value={card.furigana} 
                                onChange={(e) => handleVocabChange(idx, 'furigana', e.target.value)} 
                                placeholder="e.g. せんせい"
                                className="w-full bg-surface-bright border border-outline/10 rounded-lg px-2.5 py-1.5 text-on-surface text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="font-label-caps text-outline text-[8px] tracking-wider mb-1 block">ON'YOMI</label>
                              <input 
                                type="text" 
                                value={card.onyomi} 
                                onChange={(e) => handleVocabChange(idx, 'onyomi', e.target.value)} 
                                placeholder="e.g. セン"
                                className="w-full bg-surface-bright border border-outline/10 rounded-lg px-2.5 py-1.5 text-on-surface text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="font-label-caps text-outline text-[8px] tracking-wider mb-1 block">KUN'YOMI</label>
                              <input 
                                type="text" 
                                value={card.kunyomi} 
                                onChange={(e) => handleVocabChange(idx, 'kunyomi', e.target.value)} 
                                placeholder="e.g. さき"
                                className="w-full bg-surface-bright border border-outline/10 rounded-lg px-2.5 py-1.5 text-on-surface text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 pb-8 flex gap-3">
                  <Button3D 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowCreatorForm(false)} 
                    className="w-[120px]"
                    disabled={isSubmittingDeck}
                  >
                    Cancel
                  </Button3D>
                  <Button3D 
                    type="submit" 
                    variant="primary" 
                    className="flex-1"
                    disabled={isSubmittingDeck}
                  >
                    {isSubmittingDeck ? "Sealing scrolls..." : "Publish Deck"}
                  </Button3D>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </motion.div>
  );
};

export default Community;
