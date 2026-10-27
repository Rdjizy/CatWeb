/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat, CatPattern, CatRarity, CatPersonality } from '../types/cat';
import { CUTE_KITTEN_NAMES } from '../data/gameData';
import { CatSvg } from './CatSvg';
import { X, Sparkles, Heart, Wand2, RefreshCw, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface BreedingModalProps {
  ownedCats: Cat[];
  playerCoins: number;
  onKittenBorn: (newKitten: Cat, cost: number) => void;
  onClose: () => void;
}

export const BreedingModal: React.FC<BreedingModalProps> = ({
  ownedCats,
  playerCoins,
  onKittenBorn,
  onClose,
}) => {
  const [parent1Id, setParent1Id] = useState<string>(ownedCats[0]?.id || '');
  const [parent2Id, setParent2Id] = useState<string>(ownedCats[1]?.id || '');

  // Breeding Animation States: 'setup' | 'nursery' | 'reveal'
  const [breedingState, setBreedingState] = useState<'setup' | 'nursery' | 'reveal'>('setup');
  const [bornKitten, setBornKitten] = useState<Cat | null>(null);
  const [kittenName, setKittenName] = useState<string>('');
  const [isMutation, setIsMutation] = useState<boolean>(false);

  const parent1 = ownedCats.find((c) => c.id === parent1Id);
  const parent2 = ownedCats.find((c) => c.id === parent2Id);

  const breedingCost = 35; // Very accessible and cozy!
  const canAfford = playerCoins >= breedingCost;
  const canBreed = parent1 && parent2 && parent1.id !== parent2Id && canAfford;

  const handleStartBreeding = () => {
    if (!canBreed || !parent1 || !parent2) return;

    sound.playPetChime(1);
    setBreedingState('nursery');

    // Roll genetic inheritance
    const mutationRoll = Math.random();
    const hasMutation = mutationRoll < 0.22; // 22% fun chance of rare mutation!
    setIsMutation(hasMutation);

    // Color inheritance
    let baseColor = Math.random() < 0.5 ? parent1.baseColor : parent2.baseColor;
    let pattern: CatPattern = Math.random() < 0.5 ? parent1.pattern : parent2.pattern;
    let patternColor = Math.random() < 0.5 ? parent1.patternColor : parent2.patternColor;
    let eyeColor = Math.random() < 0.5 ? parent1.eyeColor : parent2.eyeColor;
    let rarity: CatRarity = parent1.rarity === 'celestial' || parent2.rarity === 'celestial' ? 'mythic' : 'uncommon';

    if (hasMutation) {
      const rareMutations = [
        { baseColor: '#FCE7F3', pattern: 'sakura' as CatPattern, patternColor: '#F472B6', eyeColor: '#FB7185', rarity: 'mythic' as CatRarity },
        { baseColor: '#312E81', pattern: 'celestial' as CatPattern, patternColor: '#818CF8', eyeColor: '#FBBF24', rarity: 'celestial' as CatRarity },
        { baseColor: '#FEF3C7', pattern: 'aurora' as CatPattern, patternColor: '#F59E0B', eyeColor: '#34D399', rarity: 'rare' as CatRarity },
        { baseColor: '#CFFAFE', pattern: 'calico' as CatPattern, patternColor: '#0284C7', eyeColor: '#818CF8', rarity: 'rare' as CatRarity },
      ];
      const mut = rareMutations[Math.floor(Math.random() * rareMutations.length)];
      baseColor = mut.baseColor;
      pattern = mut.pattern;
      patternColor = mut.patternColor;
      eyeColor = mut.eyeColor;
      rarity = mut.rarity;
    }

    const personalities: CatPersonality[] = [
      'Cuddle Bug',
      'Playful Rascal',
      'Sweet Dreamer',
      'Curious Explorer',
      'Gentle Gourmet',
      'Sunbather',
    ];
    const inheritedPersonality =
      Math.random() < 0.4
        ? parent1.personality
        : Math.random() < 0.7
        ? parent2.personality
        : personalities[Math.floor(Math.random() * personalities.length)];

    const defaultName = CUTE_KITTEN_NAMES[Math.floor(Math.random() * CUTE_KITTEN_NAMES.length)];
    setKittenName(defaultName);

    const newKitten: Cat = {
      id: `kitten_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: defaultName,
      breed: hasMutation ? 'Starlight Hybrid' : `${parent1.breed.split(' ')[0]} Mix`,
      rarity,
      personality: inheritedPersonality,
      baseColor,
      pattern,
      patternColor,
      bellyColor: '#FFFDF7',
      eyeColor,
      hunger: 95,
      happiness: 100,
      isKitten: true,
      birthTimestamp: Date.now(),
      parents: [parent1.name, parent2.name],
      totalPets: 1,
      totalMeals: 1,
      favoriteToy: 'Wool Pom-pom',
    };

    setBornKitten(newKitten);

    // 2.4 second cute nursery incubation animation
    setTimeout(() => {
      sound.playKittenHatch();
      sound.playMeow(1.3); // High pitched cute kitten chirp!
      setBreedingState('reveal');
    }, 2400);
  };

  const handleFinishReveal = () => {
    if (!bornKitten) return;
    const finalizedKitten: Cat = {
      ...bornKitten,
      name: kittenName.trim() || bornKitten.name,
    };
    onKittenBorn(finalizedKitten, breedingCost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-[#FCFBF8] rounded-3xl shadow-2xl border border-amber-200/60 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50/80 via-amber-50/50 to-stone-50 border-b border-stone-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-cozy text-xl sm:text-2xl font-bold text-stone-800">
                Cozy Nursery & Breeding
              </h3>
              <p className="text-xs text-stone-500">
                Pair two loving parents to raise a sweet kitten with inherited coats and rare mutation chances!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- STATE 1: SETUP PARENTS --- */}
        {breedingState === 'setup' && (
          <div className="p-6 space-y-6">
            {ownedCats.length < 2 ? (
              <div className="text-center py-10 space-y-3">
                <p className="text-stone-600 font-cozy text-base">
                  You need at least 2 cats in your sanctuary to start breeding.
                </p>
                <p className="text-xs text-stone-400">
                  Adopt another friendly cat from the Adoption Center to welcome a new generation!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  {/* Parent 1 Selector */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3 text-center">
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      Parent 1
                    </span>

                    <select
                      value={parent1Id}
                      onChange={(e) => setParent1Id(e.target.value)}
                      className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-rose-400"
                    >
                      {ownedCats.map((cat) => (
                        <option key={cat.id} value={cat.id} disabled={cat.id === parent2Id}>
                          {cat.name} ({cat.breed})
                        </option>
                      ))}
                    </select>

                    {parent1 && (
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 flex items-center justify-center">
                          <CatSvg cat={parent1} size="sm" />
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          Pattern: <strong className="capitalize">{parent1.pattern}</strong> · {parent1.personality}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Parent 2 Selector */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3 text-center">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      Parent 2
                    </span>

                    <select
                      value={parent2Id}
                      onChange={(e) => setParent2Id(e.target.value)}
                      className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                    >
                      {ownedCats.map((cat) => (
                        <option key={cat.id} value={cat.id} disabled={cat.id === parent1Id}>
                          {cat.name} ({cat.breed})
                        </option>
                      ))}
                    </select>

                    {parent2 && (
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 flex items-center justify-center">
                          <CatSvg cat={parent2} size="sm" />
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          Pattern: <strong className="capitalize">{parent2.pattern}</strong> · {parent2.personality}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Genetics & Mutation Odds Info */}
                <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/60 text-xs text-stone-600 flex items-center gap-3">
                  <Wand2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong className="text-stone-800">Gentle Genetics:</strong> Kitten inherits coat color, eye hue, and patterns from parents, with a <span className="text-rose-600 font-bold">22% chance of a rare mutation</span> (Sakura Blossom, Starlight, or Pastel Aurora)!
                  </div>
                </div>

                {/* Breed CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={handleStartBreeding}
                    disabled={!canBreed}
                    className={`w-full py-3.5 px-6 rounded-2xl font-cozy text-base font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      canBreed
                        ? 'bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 hover:from-rose-500 hover:to-amber-500 text-white shadow-md active:scale-[0.98]'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Nurture & Breed Kitten (Cost: {breedingCost} coins)</span>
                  </button>
                  {!canAfford && (
                    <p className="text-center text-xs text-rose-500 mt-2 font-medium">
                      Need {breedingCost - playerCoins} more coins. Pet or feed your cats to earn coins!
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* --- STATE 2: NURSERY BASKET INCUBATION --- */}
        {breedingState === 'nursery' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            {/* Woven Basket with floating hearts */}
            <div className="relative animate-bounce" style={{ animationDuration: '1.2s' }}>
              <div className="w-36 h-24 bg-amber-200 rounded-b-3xl border-4 border-amber-300 shadow-xl relative flex items-center justify-center overflow-hidden">
                {/* Cozy Blanket */}
                <div className="absolute top-0 inset-x-0 h-8 bg-rose-200 rounded-b-full border-b-2 border-rose-300" />
                <Heart className="w-8 h-8 text-rose-500 fill-rose-400 animate-pulse mt-4" />
              </div>

              {/* Floating Sparkles around basket */}
              <div className="absolute -top-4 -left-4 animate-ping">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div className="absolute -top-3 -right-3 animate-ping" style={{ animationDelay: '0.4s' }}>
                <Sparkles className="w-6 h-6 text-rose-400" />
              </div>
            </div>

            <div>
              <h4 className="font-cozy text-xl font-bold text-stone-800">
                A tiny kitten is arriving...
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Tucking into the warm fleece blanket with gentle purrs...
              </p>
            </div>
          </div>
        )}

        {/* --- STATE 3: KITTEN REVEAL --- */}
        {breedingState === 'reveal' && bornKitten && (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-5 animate-fade-in">
            {isMutation && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-rose-100 border border-purple-300 text-purple-800 text-xs font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Rare Mutation Discovered!</span>
              </div>
            )}

            {/* Kitten Graphic */}
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-b from-amber-50 to-rose-50 border-2 border-amber-200/60 shadow-lg flex items-center justify-center p-2 relative">
              <CatSvg cat={bornKitten} size="md" expression="petting" />
            </div>

            <div>
              <h4 className="font-cozy text-2xl font-bold text-stone-800">
                Welcome, Little One!
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Breed: <strong className="text-stone-700">{bornKitten.breed}</strong> · Trait:{' '}
                <strong className="text-amber-800">{bornKitten.personality}</strong>
              </p>
              {bornKitten.parents && (
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Proud Parents: {bornKitten.parents[0]} & {bornKitten.parents[1]}
                </p>
              )}
            </div>

            {/* Name Input */}
            <div className="w-full max-w-xs space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 block text-left">
                Give your kitten a sweet name:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={kittenName}
                  onChange={(e) => setKittenName(e.target.value)}
                  maxLength={18}
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 outline-none focus:border-rose-400"
                />
                <button
                  onClick={() => {
                    const randomName = CUTE_KITTEN_NAMES[Math.floor(Math.random() * CUTE_KITTEN_NAMES.length)];
                    setKittenName(randomName);
                  }}
                  className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors"
                  title="Randomize Name"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleFinishReveal}
              className="w-full max-w-xs py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-cozy text-sm font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Welcome to the Sanctuary</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
