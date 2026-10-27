/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat, CatPattern, CatRarity, CatPersonality } from '../types/cat';
import { CUTE_KITTEN_NAMES } from '../data/gameData';
import { CatSvg } from './CatSvg';
import { sound } from '../utils/audio';
import { X, Sparkles, Coins, Heart, Check, RefreshCw, Egg } from 'lucide-react';

interface EggHatchModalProps {
  playerCoins: number;
  ownedCats: Cat[];
  onHatchCat: (newCat: Cat, price: number) => void;
  onClose: () => void;
}

interface EggType {
  id: string;
  name: string;
  cost: number;
  description: string;
  shellColor: string;
  accentColor: string;
  patternType: 'spots' | 'stripes' | 'petals' | 'stars';
  rarity: CatRarity;
  possibleBreeds: {
    breed: string;
    baseColor: string;
    pattern: CatPattern;
    patternColor: string;
    eyeColor: string;
    personality: CatPersonality;
  }[];
}

const EGG_CATALOG: EggType[] = [
  {
    id: 'egg_meadow',
    name: 'Cozy Meadow Egg',
    cost: 55,
    description: 'A warm pastel egg wrapped in fresh grass. Hatches loving everyday companions.',
    shellColor: '#ECFDF5',
    accentColor: '#10B981',
    patternType: 'spots',
    rarity: 'common',
    possibleBreeds: [
      {
        breed: 'Scottish Fold',
        baseColor: '#F5EBE1',
        pattern: 'solid',
        patternColor: '#E6D5C3',
        eyeColor: '#10B981',
        personality: 'Cuddle Bug',
      },
      {
        breed: 'Ginger Tabby',
        baseColor: '#FDBA74',
        pattern: 'tabby',
        patternColor: '#EA580C',
        eyeColor: '#F59E0B',
        personality: 'Sunbather',
      },
      {
        breed: 'Tuxedo',
        baseColor: '#374151',
        pattern: 'tuxedo',
        patternColor: '#1F2937',
        eyeColor: '#34D399',
        personality: 'Curious Explorer',
      },
    ],
  },
  {
    id: 'egg_garden',
    name: 'Calico Garden Egg',
    cost: 140,
    description: 'An ivory egg with delicate garden speckles. Hatches curious and gentle breeds.',
    shellColor: '#FEF3C7',
    accentColor: '#D97706',
    patternType: 'stripes',
    rarity: 'uncommon',
    possibleBreeds: [
      {
        breed: 'Calico',
        baseColor: '#FDF4E3',
        pattern: 'calico',
        patternColor: '#4B5563',
        eyeColor: '#FBBF24',
        personality: 'Sweet Dreamer',
      },
      {
        breed: 'Siamese Point',
        baseColor: '#EBE3D5',
        pattern: 'siamese',
        patternColor: '#5C4436',
        eyeColor: '#38BDF8',
        personality: 'Gentle Gourmet',
      },
      {
        breed: 'Russian Blue',
        baseColor: '#94A3B8',
        pattern: 'solid',
        patternColor: '#64748B',
        eyeColor: '#059669',
        personality: 'Zen Sleeper',
      },
    ],
  },
  {
    id: 'egg_golden',
    name: 'Golden Wildflower Egg',
    cost: 280,
    description: 'A radiant golden egg with wildflower ribbons. Hatches energetic, rare feline breeds.',
    shellColor: '#FEF08A',
    accentColor: '#B45309',
    patternType: 'stripes',
    rarity: 'rare',
    possibleBreeds: [
      {
        breed: 'Golden Bengal',
        baseColor: '#FCD34D',
        pattern: 'bengal',
        patternColor: '#B45309',
        eyeColor: '#10B981',
        personality: 'Playful Rascal',
      },
      {
        breed: 'Maine Coon',
        baseColor: '#D97706',
        pattern: 'tabby',
        patternColor: '#78350F',
        eyeColor: '#F59E0B',
        personality: 'Cuddle Bug',
      },
    ],
  },
  {
    id: 'egg_sakura',
    name: 'Sakura Blossom Egg',
    cost: 550,
    description: 'A soft petal-pink egg smelling of spring blossoms. Hatches mythical sweet companions.',
    shellColor: '#FCE7F3',
    accentColor: '#EC4899',
    patternType: 'petals',
    rarity: 'mythic',
    possibleBreeds: [
      {
        breed: 'Sakura Blossom',
        baseColor: '#FCE7F3',
        pattern: 'sakura',
        patternColor: '#F472B6',
        eyeColor: '#FB7185',
        personality: 'Sweet Dreamer',
      },
      {
        breed: 'Rose Quartz Fold',
        baseColor: '#FFF1F2',
        pattern: 'solid',
        patternColor: '#FDA4AF',
        eyeColor: '#E11D48',
        personality: 'Cuddle Bug',
      },
    ],
  },
  {
    id: 'egg_celestial',
    name: 'Cosmic Starlight Egg',
    cost: 950,
    description: 'An enchanted midnight-indigo egg with glowing stars. Hatches legendary celestial companions.',
    shellColor: '#312E81',
    accentColor: '#FDE047',
    patternType: 'stars',
    rarity: 'celestial',
    possibleBreeds: [
      {
        breed: 'Celestial Starlight',
        baseColor: '#312E81',
        pattern: 'celestial',
        patternColor: '#818CF8',
        eyeColor: '#FBBF24',
        personality: 'Sweet Dreamer',
      },
      {
        breed: 'Aurora Dawn',
        baseColor: '#67E8F9',
        pattern: 'aurora',
        patternColor: '#C084FC',
        eyeColor: '#34D399',
        personality: 'Curious Explorer',
      },
    ],
  },
];

export const EggHatchModal: React.FC<EggHatchModalProps> = ({
  playerCoins,
  ownedCats,
  onHatchCat,
  onClose,
}) => {
  // States: 'catalog' | 'hatching' | 'revealed'
  const [stage, setStage] = useState<'catalog' | 'hatching' | 'revealed'>('catalog');
  const [selectedEgg, setSelectedEgg] = useState<EggType | null>(null);
  const [crackCount, setCrackCount] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);
  const [hatchedCat, setHatchedCat] = useState<Cat | null>(null);
  const [chosenName, setChosenName] = useState('');

  const handleBuyEgg = (egg: EggType) => {
    if (playerCoins < egg.cost) return;
    setSelectedEgg(egg);
    setCrackCount(0);
    setStage('hatching');
    sound.playPetChime(1);
  };

  const handleTapEgg = () => {
    if (!selectedEgg || isWobbling) return;
    setIsWobbling(true);
    sound.playEggCrack();

    const nextCount = crackCount + 1;
    setCrackCount(nextCount);

    setTimeout(() => {
      setIsWobbling(false);
    }, 400);

    // 3 taps cracks the egg open!
    if (nextCount >= 3) {
      // Pick random cat from egg's pool
      const pick =
        selectedEgg.possibleBreeds[
          Math.floor(Math.random() * selectedEgg.possibleBreeds.length)
        ];
      const randomName =
        CUTE_KITTEN_NAMES[Math.floor(Math.random() * CUTE_KITTEN_NAMES.length)];
      setChosenName(randomName);

      const newCat: Cat = {
        id: `hatched_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: randomName,
        breed: pick.breed,
        rarity: selectedEgg.rarity,
        personality: pick.personality,
        baseColor: pick.baseColor,
        pattern: pick.pattern,
        patternColor: pick.patternColor,
        bellyColor: '#FFFDF9',
        earColor: '#F9A8D4',
        eyeColor: pick.eyeColor,
        hunger: 95,
        happiness: 100,
        isKitten: true,
        birthTimestamp: Date.now(),
        parents: null,
        totalPets: 1,
        totalMeals: 0,
        favoriteToy: 'Wool Pom-pom',
      };

      setHatchedCat(newCat);

      setTimeout(() => {
        sound.playKittenHatch();
        sound.playKittenChirp();
        setStage('revealed');
      }, 700);
    }
  };

  const handleFinishAdoption = () => {
    if (!hatchedCat || !selectedEgg) return;
    const finalCat: Cat = {
      ...hatchedCat,
      name: chosenName.trim() || hatchedCat.name,
    };
    onHatchCat(finalCat, selectedEgg.cost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#FCFBF8] rounded-3xl shadow-2xl border border-amber-200/60 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50/90 via-rose-50/50 to-stone-50 border-b border-stone-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shadow-xs">
              <Egg className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-cozy text-xl sm:text-2xl font-bold text-stone-800">
                {stage === 'catalog'
                  ? 'Cat Egg Hatchery'
                  : stage === 'hatching'
                  ? 'Tap the Egg to Hatch!'
                  : 'A Kitten is Born!'}
              </h3>
              <p className="text-xs text-stone-500">
                {stage === 'catalog'
                  ? 'Choose a mysterious cozy egg. Each egg hatches a unique kitten breed!'
                  : stage === 'hatching'
                  ? 'Gently tap the egg shell to help your kitten emerge!'
                  : 'Welcome your new furry companion to the sanctuary!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 border border-amber-200 rounded-full font-cozy font-bold text-amber-900 text-sm">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="tabular-nums font-mono">{playerCoins}</span>
            </div>
            {stage === 'catalog' && (
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* --- STAGE 1: EGG SHOP CATALOG --- */}
        {stage === 'catalog' && (
          <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            {EGG_CATALOG.map((egg) => {
              const canAfford = playerCoins >= egg.cost;
              return (
                <div
                  key={egg.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-center"
                >
                  <div className="flex flex-col items-center">
                    {/* Visual SVG Egg Graphic */}
                    <div className="w-24 h-28 my-2 relative flex items-center justify-center">
                      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
                        <defs>
                          <radialGradient id={`eggShade_${egg.id}`} cx="40%" cy="35%" r="60%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
                          </radialGradient>
                        </defs>
                        {/* Egg base */}
                        <path
                          d="M 50 10 C 25 10 12 45 12 75 C 12 100 28 115 50 115 C 72 115 88 100 88 75 C 88 45 75 10 50 10 Z"
                          fill={egg.shellColor}
                        />
                        {/* Egg Pattern Overlays */}
                        {egg.patternType === 'spots' && (
                          <g fill={egg.accentColor} opacity="0.65">
                            <circle cx="38" cy="55" r="5" />
                            <circle cx="62" cy="45" r="4" />
                            <circle cx="50" cy="80" r="6" />
                            <circle cx="32" cy="88" r="4" />
                            <circle cx="68" cy="85" r="5" />
                          </g>
                        )}
                        {egg.patternType === 'stripes' && (
                          <g stroke={egg.accentColor} strokeWidth="4" strokeLinecap="round" opacity="0.6">
                            <path d="M 25 60 Q 50 72 75 60" />
                            <path d="M 22 80 Q 50 92 78 80" />
                          </g>
                        )}
                        {egg.patternType === 'petals' && (
                          <g fill={egg.accentColor} opacity="0.75">
                            <circle cx="50" cy="50" r="4" />
                            <circle cx="35" cy="75" r="4.5" />
                            <circle cx="65" cy="75" r="4" />
                          </g>
                        )}
                        {egg.patternType === 'stars' && (
                          <g fill={egg.accentColor} opacity="0.9">
                            <polygon points="50,42 52,48 58,48 53,52 55,58 50,54 45,58 47,52 42,48 48,48" />
                            <polygon points="35,70 36,74 40,74 37,77 38,81 35,79 32,81 33,77 30,74 34,74" />
                            <polygon points="65,72 66,76 70,76 67,79 68,83 65,81 62,83 63,79 60,76 64,76" />
                          </g>
                        )}
                        {/* Shading */}
                        <path
                          d="M 50 10 C 25 10 12 45 12 75 C 12 100 28 115 50 115 C 72 115 88 100 88 75 C 88 45 75 10 50 10 Z"
                          fill={`url(#eggShade_${egg.id})`}
                        />
                      </svg>
                    </div>

                    <h4 className="font-cozy font-bold text-stone-800 text-base mb-0.5">
                      {egg.name}
                    </h4>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mb-2">
                      {egg.rarity}
                    </span>

                    <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                      {egg.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBuyEgg(egg)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-3 rounded-xl font-cozy text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 text-stone-900 shadow-xs active:scale-95'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-700" />
                    <span>Hatch for {egg.cost} coins</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* --- STAGE 2: TAP-TO-CRACK INCUBATION --- */}
        {stage === 'hatching' && selectedEgg && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                {selectedEgg.name}
              </span>
              <h4 className="font-cozy text-2xl font-bold text-stone-800">
                Tap the Egg to Hatch ({3 - crackCount} taps left!)
              </h4>
            </div>

            {/* Interactive Wobbling Egg on Velvet Nest */}
            <div
              onClick={handleTapEgg}
              className={`relative cursor-pointer transition-transform duration-300 p-4 select-none ${
                isWobbling ? 'scale-105 rotate-3' : 'hover:scale-105'
              }`}
            >
              {/* Velvet Cushion */}
              <div className="w-48 h-16 bg-rose-200/80 rounded-full border-4 border-rose-300 shadow-xl absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-36 h-10 bg-rose-100 rounded-full shadow-inner" />
              </div>

              {/* Egg SVG with Cracks */}
              <div className="w-36 h-44 relative z-10 mx-auto">
                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xl">
                  {/* Egg Base */}
                  <path
                    d="M 50 10 C 25 10 12 45 12 75 C 12 100 28 115 50 115 C 72 115 88 100 88 75 C 88 45 75 10 50 10 Z"
                    fill={selectedEgg.shellColor}
                  />

                  {/* Cracks Rendering */}
                  {crackCount >= 1 && (
                    <path
                      d="M 50 30 L 45 42 L 54 50 L 48 62"
                      stroke="#4A2E18"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      className="animate-pulse"
                    />
                  )}
                  {crackCount >= 2 && (
                    <g stroke="#4A2E18" strokeWidth="2.8" strokeLinecap="round" fill="none">
                      <path d="M 48 62 L 60 74 L 52 86 L 62 98" />
                      <path d="M 45 42 L 32 48 L 24 45" />
                    </g>
                  )}
                </svg>

                {crackCount >= 2 && (
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-ping pointer-events-none">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-400" />
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-500 animate-pulse">
              Click or tap directly on the egg shell!
            </p>
          </div>
        )}

        {/* --- STAGE 3: KITTEN REVEAL --- */}
        {stage === 'revealed' && hatchedCat && (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-5 animate-fade-in flex-1 overflow-y-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Hatched Successfully!</span>
            </div>

            {/* Hatched Kitten Avatar */}
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-b from-amber-50 to-rose-50 border-2 border-amber-200 shadow-lg flex items-center justify-center p-2 relative">
              <CatSvg cat={hatchedCat} size="md" expression="petting" />
            </div>

            <div>
              <h4 className="font-cozy text-2xl font-bold text-stone-800">
                Meet your new companion!
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Breed: <strong className="text-stone-800">{hatchedCat.breed}</strong> · Trait:{' '}
                <strong className="text-amber-800">{hatchedCat.personality}</strong>
              </p>
            </div>

            {/* Rename Input */}
            <div className="w-full max-w-xs space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 block text-left">
                Give your kitten a name:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chosenName}
                  onChange={(e) => setChosenName(e.target.value)}
                  maxLength={18}
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 outline-none focus:border-rose-400"
                />
                <button
                  onClick={() => {
                    const randomName =
                      CUTE_KITTEN_NAMES[Math.floor(Math.random() * CUTE_KITTEN_NAMES.length)];
                    setChosenName(randomName);
                  }}
                  className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors cursor-pointer"
                  title="Randomize name"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleFinishAdoption}
              className="w-full max-w-xs py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-cozy text-sm font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Welcome to Sanctuary</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
