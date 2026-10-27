/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat } from '../types/cat';
import { Heart, Utensils, Sparkles, Smile, Award, Edit2, Check } from 'lucide-react';

interface CatCarePanelProps {
  cat: Cat;
  onFeed: () => void;
  onPet: () => void;
  onBrush: () => void;
  onRenameCat: (catId: string, newName: string) => void;
  isFeeding: boolean;
  isPetting: boolean;
}

export const CatCarePanel: React.FC<CatCarePanelProps> = ({
  cat,
  onFeed,
  onPet,
  onBrush,
  onRenameCat,
  isFeeding,
  isPetting,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(cat.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onRenameCat(cat.id, nameInput.trim());
    }
    setIsRenaming(false);
  };

  // Trait descriptions & quotes
  const getCatQuote = (cat: Cat) => {
    if (cat.happiness > 80 && cat.hunger > 70) {
      return `"${cat.name} is purring softly and stretching out in the warm sunbeams."`;
    } else if (cat.hunger < 35) {
      return `"${cat.name} looks over at the food dish with polite, hopeful eyes."`;
    } else if (cat.happiness < 40) {
      return `"${cat.name} gently brushes against your ankle, seeking a warm cuddle."`;
    }
    return `"${cat.name} is feeling peaceful, watching dust motes dance in the air."`;
  };

  const rarityColor = {
    common: 'text-stone-600 bg-stone-100 border-stone-200',
    uncommon: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    rare: 'text-sky-700 bg-sky-50 border-sky-200',
    mythic: 'text-purple-700 bg-purple-50 border-purple-200',
    celestial: 'text-amber-700 bg-amber-50 border-amber-200',
  }[cat.rarity];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-6 shadow-md border border-stone-200/80">
      {/* Cat Header: Name, Breed, Personality */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                className="font-cozy text-2xl font-bold text-stone-800 bg-amber-50 border-b-2 border-amber-400 px-2 py-0.5 rounded outline-none w-44"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
                title="Save Name"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="font-cozy text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
                {cat.name}
              </h2>
              <button
                onClick={() => {
                  setNameInput(cat.name);
                  setIsRenaming(true);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                title="Rename cat"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${rarityColor}`}>
            {cat.breed}
          </span>
        </div>

        {/* Personality & Age */}
        <div className="flex items-center gap-3 text-xs text-stone-500">
          <span className="font-medium text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/50">
            {cat.personality}
          </span>
          <span aria-hidden="true">·</span>
          <span>{cat.isKitten ? 'Playful Kitten' : 'Adult Companion'}</span>
        </div>
      </div>

      {/* Tender Thought Bubble */}
      <div className="my-3.5 px-3.5 py-2.5 rounded-2xl bg-[#FFFDF7] border border-amber-100 text-xs sm:text-sm text-stone-600 italic">
        {getCatQuote(cat)}
      </div>

      {/* Needs Bars (Decays very slowly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        {/* Hunger Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-stone-600">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <span>Fullness</span>
            </span>
            <span className="tabular-nums font-semibold text-stone-700">
              {Math.round(cat.hunger)}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-300 to-amber-400 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(8, cat.hunger))}%` }}
            />
          </div>
        </div>

        {/* Happiness Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-stone-600">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Happiness</span>
            </span>
            <span className="tabular-nums font-semibold text-stone-700">
              {Math.round(cat.happiness)}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-rose-300 to-rose-400 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(8, cat.happiness))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gentle Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-2">
        {/* Feed Button */}
        <button
          onClick={onFeed}
          disabled={isFeeding}
          className="flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/90 hover:from-amber-100 hover:to-amber-200/90 border border-amber-200/80 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-cozy text-xs sm:text-sm font-bold text-stone-800">
            Feed Cat
          </span>
          <span className="text-[10px] text-amber-700 font-medium">
            +3 coins · +25% food
          </span>
        </button>

        {/* Pet & Cuddle Button */}
        <button
          onClick={onPet}
          disabled={isPetting}
          className="flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl bg-gradient-to-b from-rose-50 to-rose-100/90 hover:from-rose-100 hover:to-rose-200/90 border border-rose-200/80 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-400" />
          </div>
          <span className="font-cozy text-xs sm:text-sm font-bold text-stone-800">
            Pet & Purr
          </span>
          <span className="text-[10px] text-rose-700 font-medium">
            +2 coins · +15% joy
          </span>
        </button>

        {/* Gentle Brush / Groom Button */}
        <button
          onClick={onBrush}
          className="flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl bg-gradient-to-b from-sky-50 to-sky-100/90 hover:from-sky-100 hover:to-sky-200/90 border border-sky-200/80 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 text-sky-600" />
          </div>
          <span className="font-cozy text-xs sm:text-sm font-bold text-stone-800">
            Groom Fur
          </span>
          <span className="text-[10px] text-sky-700 font-medium">
            +4 coins · +20% joy
          </span>
        </button>
      </div>

      {/* Quiet Cat Stats footer */}
      <div className="flex items-center justify-between text-[11px] text-stone-600 mt-4 pt-3 border-t border-stone-100">
        <span>Tender Cuddles: <strong className="text-stone-700 tabular-nums">{cat.totalPets}</strong></span>
        <span>Meals Enjoyed: <strong className="text-stone-700 tabular-nums">{cat.totalMeals}</strong></span>
        <span>Fav Toy: <strong className="text-stone-700">{cat.favoriteToy}</strong></span>
      </div>
    </div>
  );
};
