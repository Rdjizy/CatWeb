/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat, CatPattern } from '../types/cat';
import { CatSvg } from './CatSvg';
import { CUTE_KITTEN_NAMES } from '../data/gameData';
import { sound } from '../utils/audio';
import { Sparkles, Dices, Heart, Check, Palette } from 'lucide-react';

interface CatCustomizerProps {
  initialCat?: Cat;
  onConfirm: (customCat: Cat) => void;
  title?: string;
  submitLabel?: string;
}

const FUR_COLORS = [
  { name: 'Warm Cream', hex: '#F5EBE1' },
  { name: 'Ginger Orange', hex: '#FDBA74' },
  { name: 'Golden Honey', hex: '#FCD34D' },
  { name: 'Smokey Charcoal', hex: '#4B5563' },
  { name: 'Russian Silver', hex: '#94A3B8' },
  { name: 'Snow White', hex: '#FFFFFF' },
  { name: 'Rich Mocha', hex: '#78350F' },
  { name: 'Lavender Mist', hex: '#E9D5FF' },
  { name: 'Blush Rose', hex: '#FCE7F3' },
  { name: 'Mint Fawn', hex: '#D1FAE5' },
];

const EYE_COLORS = [
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Sky Aqua', hex: '#38BDF8' },
  { name: 'Golden Amber', hex: '#F59E0B' },
  { name: 'Rose Quartz', hex: '#FB7185' },
  { name: 'Deep Sapphire', hex: '#2563EB' },
  { name: 'Amethyst', hex: '#9333EA' },
  { name: 'Hazel Green', hex: '#84CC16' },
];

const EAR_COLORS = [
  { name: 'Soft Pink', hex: '#F9A8D4' },
  { name: 'Rose Petal', hex: '#FB7185' },
  { name: 'Warm Peach', hex: '#FDBA74' },
  { name: 'Coral', hex: '#F87171' },
  { name: 'Lavender', hex: '#C084FC' },
  { name: 'Espresso', hex: '#5C4436' },
  { name: 'Mint Tint', hex: '#6EE7B7' },
];

const PATTERN_COLORS = [
  { name: 'Tiger Ginger', hex: '#EA580C' },
  { name: 'Dark Cocoa', hex: '#451A03' },
  { name: 'Charcoal', hex: '#1F2937' },
  { name: 'Golden Amber', hex: '#D97706' },
  { name: 'Soft Lavender', hex: '#818CF8' },
  { name: 'Sakura Rose', hex: '#F472B6' },
];

const PATTERN_TYPES: { type: CatPattern; label: string }[] = [
  { type: 'solid', label: 'Solid Coat' },
  { type: 'tabby', label: 'Tabby Stripes' },
  { type: 'tuxedo', label: 'Tuxedo Bib' },
  { type: 'calico', label: 'Calico Patches' },
  { type: 'siamese', label: 'Siamese Points' },
  { type: 'celestial', label: 'Celestial Stars' },
  { type: 'sakura', label: 'Sakura Blossoms' },
];

export const CatCustomizer: React.FC<CatCustomizerProps> = ({
  initialCat,
  onConfirm,
  title = 'Design Your Starter Kitten',
  submitLabel = 'Bring Kitten Home',
}) => {
  const [name, setName] = useState(initialCat?.name || 'Mochi');
  const [baseColor, setBaseColor] = useState(initialCat?.baseColor || FUR_COLORS[0].hex);
  const [eyeColor, setEyeColor] = useState(initialCat?.eyeColor || EYE_COLORS[0].hex);
  const [earColor, setEarColor] = useState(initialCat?.earColor || EAR_COLORS[0].hex);
  const [pattern, setPattern] = useState<CatPattern>(initialCat?.pattern || 'solid');
  const [patternColor, setPatternColor] = useState(initialCat?.patternColor || PATTERN_COLORS[0].hex);
  const [bellyColor, setBellyColor] = useState(initialCat?.bellyColor || '#FFFDF9');
  const [testExpression, setTestExpression] = useState<'idle' | 'petting'>('idle');

  const previewCat: Cat = {
    id: initialCat?.id || 'starter_cat',
    name: name.trim() || 'Mochi',
    breed: 'Custom Companion',
    rarity: 'rare',
    personality: initialCat?.personality || 'Cuddle Bug',
    baseColor,
    pattern,
    patternColor,
    bellyColor,
    earColor,
    eyeColor,
    hunger: 90,
    happiness: 95,
    isKitten: false,
    birthTimestamp: Date.now(),
    parents: null,
    totalPets: 0,
    totalMeals: 0,
    favoriteToy: 'Feather Wand',
  };

  const handleTestPet = () => {
    sound.playCutePetSound();
    setTestExpression('petting');
    setTimeout(() => setTestExpression('idle'), 1100);
  };

  const handleRandomizeName = () => {
    const randomName = CUTE_KITTEN_NAMES[Math.floor(Math.random() * CUTE_KITTEN_NAMES.length)];
    setName(randomName);
    sound.playMeow(1.2);
  };

  const handleSave = () => {
    sound.playKittenHatch();
    onConfirm(previewCat);
  };

  return (
    <div className="w-full bg-white/90 rounded-3xl p-6 shadow-xl border border-stone-200/80 flex flex-col md:flex-row gap-6 items-center">
      {/* Left: Interactive Live Preview with Petting Test */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/60 to-rose-50/50 rounded-2xl p-6 border border-amber-200/50 w-full md:w-64 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2">
          Live Cat Preview
        </span>

        <div
          onClick={handleTestPet}
          className="cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200"
          title="Click to test pet and meow!"
        >
          <CatSvg cat={previewCat} size="md" expression={testExpression} />
        </div>

        <button
          onClick={handleTestPet}
          className="mt-4 px-3 py-1.5 rounded-full bg-white text-rose-600 text-xs font-bold border border-rose-200 shadow-xs hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-400" />
          <span>Click to Pet & Meow</span>
        </button>

        <div className="mt-3 text-center">
          <div className="font-cozy font-bold text-stone-800 text-lg">{previewCat.name}</div>
          <div className="text-[11px] text-stone-500 capitalize">{previewCat.pattern} Coat</div>
        </div>
      </div>

      {/* Right: Scroll Wheels for Each Part */}
      <div className="flex-1 w-full space-y-4 max-h-[460px] overflow-y-auto pr-1">
        <div>
          <h3 className="font-cozy text-xl font-bold text-stone-800 flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-500" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-stone-500">
            Customize every part of your cat with the scrollable color palettes below.
          </p>
        </div>

        {/* Name Input with Randomizer */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Cat Name:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="e.g. Mochi, Luna, Boba"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 outline-none focus:border-rose-400"
            />
            <button
              onClick={handleRandomizeName}
              className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors cursor-pointer"
              title="Random cute name"
            >
              <Dices className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. FUR (Base Coat) Scroll Wheel */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-stone-700">1. Fur Coat Color:</span>
            <span className="text-stone-500 text-[11px]">
              {FUR_COLORS.find((c) => c.hex === baseColor)?.name || 'Custom'}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {FUR_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setBaseColor(c.hex);
                  sound.playPetChime(1);
                }}
                className={`w-9 h-9 rounded-full shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center shadow-xs ${
                  baseColor === c.hex ? 'border-rose-500 scale-110 shadow-sm ring-2 ring-rose-300' : 'border-stone-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {baseColor === c.hex && <Check className="w-4 h-4 text-stone-800 drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. EYES Scroll Wheel */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-stone-700">2. Eye Color:</span>
            <span className="text-stone-500 text-[11px]">
              {EYE_COLORS.find((c) => c.hex === eyeColor)?.name || 'Custom'}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {EYE_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setEyeColor(c.hex);
                  sound.playPetChime(2);
                }}
                className={`w-9 h-9 rounded-full shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center shadow-xs ${
                  eyeColor === c.hex ? 'border-sky-500 scale-110 shadow-sm ring-2 ring-sky-300' : 'border-stone-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {eyeColor === c.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. EARS (Inner Ear) Scroll Wheel */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-stone-700">3. Ears & Nose Color:</span>
            <span className="text-stone-500 text-[11px]">
              {EAR_COLORS.find((c) => c.hex === earColor)?.name || 'Custom'}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {EAR_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setEarColor(c.hex);
                  sound.playPetChime(3);
                }}
                className={`w-9 h-9 rounded-full shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center shadow-xs ${
                  earColor === c.hex ? 'border-rose-500 scale-110 shadow-sm ring-2 ring-rose-300' : 'border-stone-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {earColor === c.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* 4. PATTERN TYPE & COLOR */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 block">4. Coat Pattern:</label>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {PATTERN_TYPES.map((p) => (
              <button
                key={p.type}
                onClick={() => {
                  setPattern(p.type);
                  sound.playPetChime(4);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  pattern === p.type
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {pattern !== 'solid' && (
            <div className="pt-1">
              <span className="text-[11px] text-stone-500 mb-1 block">Pattern Accent Color:</span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {PATTERN_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setPatternColor(c.hex);
                      sound.playPetChime(2);
                    }}
                    className={`w-8 h-8 rounded-full shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center ${
                      patternColor === c.hex ? 'border-amber-500 scale-110 ring-2 ring-amber-300' : 'border-stone-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {patternColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Confirmation Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-cozy text-sm font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
