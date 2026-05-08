import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button3D from '../components/Button3D';
import LoadingState from '../components/LoadingState';

const MOCK_DECKS = [
  { id: 1, title: 'Anime Vocabulary', author: 'OtakuMaster', downloads: 1205, price: 'Free', rating: 4.8 },
  { id: 2, title: 'JLPT N4 Grammar Notes', author: 'SenseiSarah', downloads: 856, price: 'Premium', rating: 4.9 },
  { id: 3, title: 'Travel Phrases 101', author: 'WanderlustJP', downloads: 3400, price: 'Free', rating: 4.7 }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  if (isLoading) {
    return <LoadingState message="Discovering paths..." />;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto pb-xl">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="font-h1 text-primary mb-2 tracking-tighter">Community</h1>
        <p className="font-body-md text-outline tracking-wide">Discover and share custom learning paths.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex bg-surface-variant/30 rounded-xl p-1 mb-8 backdrop-blur-sm border border-outline/10">
        <button 
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 font-label-caps tracking-widest rounded-xl transition-all duration-300 ${activeTab === 'discover' ? 'bg-surface shadow-paper-layer text-primary border border-outline/10' : 'text-outline hover:text-on-surface'}`}
        >
          DISCOVER
        </button>
        <button 
          onClick={() => setActiveTab('premium')}
          className={`flex-1 py-3 font-label-caps tracking-widest rounded-xl transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'premium' ? 'bg-surface shadow-paper-layer text-tertiary border border-outline/10' : 'text-outline hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> PREMIUM
        </button>
      </motion.div>

      <div className="space-y-6 mb-16">
        {MOCK_DECKS.filter(d => activeTab === 'discover' || d.price === 'Premium').map(deck => (
          <motion.div variants={itemVariants} key={deck.id} className="bg-surface rounded-2xl p-md border border-outline/10 shadow-paper-layer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group relative overflow-hidden transition-colors hover:border-primary/20">
            {/* Washi Texture */}
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
            {/* Ink wash hover */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-h3 text-on-surface tracking-tight">{deck.title}</h3>
                {deck.price === 'Premium' && (
                  <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[10px] font-label-caps px-2 py-0.5 rounded-full tracking-widest">
                    PREMIUM
                  </span>
                )}
              </div>
              <p className="font-body-md text-outline text-sm mb-4">Crafted by <span className="text-on-surface-variant font-medium">{deck.author}</span></p>
              <div className="flex items-center gap-6 text-xs font-label-caps text-outline tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'wght' 200" }}>download</span> {deck.downloads}
                </span>
                <span className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>star</span> {deck.rating}
                </span>
              </div>
            </div>
            
            <div className="w-full sm:w-auto relative z-10">
              <Button3D variant={deck.price === 'Premium' ? 'primary' : 'secondary'}>
                {deck.price === 'Premium' ? 'Unlock Deck' : 'Download'}
              </Button3D>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="bg-primary-container rounded-3xl p-lg text-center border border-primary/20 shadow-paper-layer relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-40 mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10">
          <span className="material-symbols-outlined text-[56px] text-primary mb-4" style={{ fontVariationSettings: "'wght' 200" }}>storefront</span>
          <h3 className="font-h2 text-on-primary-container mb-3 tracking-tight">Become a Creator</h3>
          <p className="font-body-md text-on-primary-container/80 mb-8 max-w-md mx-auto leading-relaxed">
            Share your custom vocabulary paths with the world and earn revenue by becoming a Premium Creator.
          </p>
          <Button3D variant="primary">Apply Now</Button3D>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Community;
