import React, { useState } from 'react';
import Button3D from '../components/Button3D';

const MOCK_DECKS = [
  { id: 1, title: 'Anime Vocabulary', author: 'OtakuMaster', downloads: 1205, price: 'Free', rating: 4.8 },
  { id: 2, title: 'JLPT N4 Grammar Notes', author: 'SenseiSarah', downloads: 856, price: 'Premium', rating: 4.9 },
  { id: 3, title: 'Travel Phrases 101', author: 'WanderlustJP', downloads: 3400, price: 'Free', rating: 4.7 }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="animate-in fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-h1 text-primary mb-2">Community</h1>
        <p className="font-body-md text-on-surface-variant">Discover and share custom learning decks.</p>
      </div>

      <div className="flex bg-surface-container rounded-lg p-1 mb-6">
        <button 
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-2 font-label-caps rounded-md transition-colors ${activeTab === 'discover' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Discover
        </button>
        <button 
          onClick={() => setActiveTab('premium')}
          className={`flex-1 py-2 font-label-caps rounded-md transition-colors flex justify-center items-center gap-1 ${activeTab === 'premium' ? 'bg-surface-container-lowest shadow-sm text-tertiary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-[16px]">stars</span> Premium
        </button>
      </div>

      <div className="space-y-4 mb-xl">
        {MOCK_DECKS.filter(d => activeTab === 'discover' || d.price === 'Premium').map(deck => (
          <div key={deck.id} className="bg-surface-container-lowest rounded-xl p-md border border-surface-variant shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-h3 text-on-surface">{deck.title}</h3>
                {deck.price === 'Premium' && (
                  <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Premium
                  </span>
                )}
              </div>
              <p className="font-body-md text-on-surface-variant text-sm mb-2">By {deck.author}</p>
              <div className="flex items-center gap-4 text-xs font-label-caps text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">download</span> {deck.downloads}
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {deck.rating}
                </span>
              </div>
            </div>
            
            <button className={`px-6 py-2 rounded-lg font-button-text transition-transform active:scale-95 ${deck.price === 'Premium' ? 'bg-tertiary text-on-tertiary shadow-[0_4px_0_#104648]' : 'bg-surface-container text-on-surface shadow-[0_4px_0_#d8dadc]'}`}>
              {deck.price === 'Premium' ? 'Unlock' : 'Download'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-primary-container rounded-xl p-md text-center border border-primary/20">
        <span className="material-symbols-outlined text-[48px] text-primary mb-2">storefront</span>
        <h3 className="font-h3 text-on-primary-container mb-2">Become a Creator</h3>
        <p className="font-body-md text-on-primary-container/80 mb-4 max-w-md mx-auto">
          Share your custom vocabulary decks with the world and earn revenue by becoming a Premium Creator.
        </p>
        <Button3D variant="primary">Apply Now</Button3D>
      </div>
    </div>
  );
};

export default Community;
