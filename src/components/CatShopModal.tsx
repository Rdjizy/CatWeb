/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat } from '../types/cat';
import { SHOP_CATS, CAT_RARITY_PRICES } from '../data/gameData';
import { CatSvg } from './CatSvg';
import { X, Sparkles, Coins, Check, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface CatShopModalProps {
  playerCoins: number;
  ownedCats: Cat[];
  onAdoptCat: (newCat: Cat, price: number) => void;
  onClose: () => void;
}

export const CatShopModal: React.FC<CatShopModalProps> = ({
  playerCoins,
  ownedCats,
  onAdoptCat,
  onClose,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [adoptedFeedback, setAdoptedFeedback] = useState<string | null>(null);

  const ownedBreeds = new Set(ownedCats.map((c) => c.breed));

  const filteredCats = SHOP_CATS.filter((cat) => {
    if (filter === 'all') return true;
    return cat.rarity === filter;
  });

  const handleAdopt = (shopCat: typeof SHOP_CATS[0]) => {
    const price = CAT_RARITY_PRICES[shopCat.rarity] || 100;
    if (playerCoins < price) return;

    const newCat: Cat = {
      ...shopCat,
      id: `adopted_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      hunger: 90,
      happiness: 85,
      isKitten: false,
      birthTimestamp: Date.now(),
      parents: null,
      totalPets: 0,
      totalMeals: 0,
    };

    sound.playKittenHatch();
    onAdoptCat(newCat, price);
    setAdoptedFeedback(`Welcome home, ${newCat.name}!`);

    setTimeout(() => {
      setAdoptedFeedback(null);
    }, 2800);
  };

  const rarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'celestial':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'mythic':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rare':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'uncommon':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#FCFBF8] rounded-3xl shadow-2xl border border-amber-200/60 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50/80 via-rose-50/50 to-stone-50 border-b border-stone-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 text-amber-600 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-cozy text-xl sm:text-2xl font-bold text-stone-800">
                Cat Adoption Center
              </h3>
              <p className="text-xs text-stone-500">
                Give a loving home to unique breeds with distinct coats and gentle personalities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/70 border border-amber-200 rounded-full font-cozy font-bold text-amber-900 text-sm">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="tabular-nums">{playerCoins}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Adopted Feedback Toast */}
        {adoptedFeedback && (
          <div className="bg-emerald-500 text-white text-center py-2 px-4 text-sm font-cozy font-bold flex items-center justify-center gap-2 shadow-inner">
            <Sparkles className="w-4 h-4" />
            <span>{adoptedFeedback}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="px-6 py-2.5 bg-stone-50/60 border-b border-stone-200/40 flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'common', 'uncommon', 'rare', 'mythic', 'celestial'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors whitespace-nowrap cursor-pointer ${
                filter === t
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Cats Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {filteredCats.map((catTemplate) => {
            const price = CAT_RARITY_PRICES[catTemplate.rarity] || 100;
            const isOwned = ownedBreeds.has(catTemplate.breed);
            const canAfford = playerCoins >= price;

            // Mock full Cat for preview
            const previewCat: Cat = {
              ...catTemplate,
              hunger: 90,
              happiness: 95,
              totalPets: 0,
              totalMeals: 0,
              birthTimestamp: Date.now(),
            };

            return (
              <div
                key={catTemplate.id}
                className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-xs hover:shadow-md transition-shadow flex items-center gap-4"
              >
                {/* Visual Cat Thumbnail */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F5EBE1] border border-stone-200/60 flex items-center justify-center shrink-0 p-1">
                  <CatSvg cat={previewCat} size="sm" showShadow={false} />
                </div>

                {/* Details & Actions */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-cozy font-bold text-stone-800 text-base truncate">
                      {catTemplate.name}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${rarityBadge(
                        catTemplate.rarity
                      )}`}
                    >
                      {catTemplate.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mb-1">{catTemplate.breed}</p>
                  <p className="text-[11px] text-amber-800 italic mb-2.5 line-clamp-1">
                    Trait: {catTemplate.personality}
                  </p>

                  {/* Buy Button / Owned Status */}
                  {isOwned ? (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 py-1 px-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      <span>In Family</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdopt(catTemplate)}
                      disabled={!canAfford}
                      className={`w-full py-1.5 px-3 rounded-xl font-cozy text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-500 text-stone-900 shadow-xs active:scale-[0.98]'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>Adopt for {price} coins</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
