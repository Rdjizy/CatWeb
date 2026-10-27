/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat } from '../types/cat';
import { CatCustomizer } from './CatCustomizer';
import { Heart, Edit3, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface IntroScreenProps {
  herName: string;
  onStartGame: (name: string, customStarterCat: Cat) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ herName, onStartGame }) => {
  const [name, setName] = useState(herName || 'Sweetheart');
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState<'greeting' | 'customize'>('greeting');

  const handleProceedToCustomize = () => {
    sound.playPetChime(2);
    setStep('customize');
  };

  const handleFinishCustomizer = (customCat: Cat) => {
    sound.startBackgroundMusic();
    onStartGame(name.trim() || 'Sweetheart', customCat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-[#FDFBF7] via-[#F8F2EB] to-[#F1E8DF] overflow-y-auto select-none">
      {/* Decorative Pastel Ambient Orbs */}
      <div className="fixed top-12 left-10 w-72 h-72 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-60 h-60 rounded-full bg-sky-200/35 blur-3xl pointer-events-none" />

      {step === 'greeting' ? (
        /* STEP 1: Sweet Dedication Greeting */
        <div className="relative max-w-lg w-full bg-white/85 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-300/30 border border-stone-200/70 text-center animate-fade-in my-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-semibold mb-6 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-rose-400 stroke-rose-500 animate-pulse" />
            <span>A Cozy Cat Sanctuary</span>
          </div>

          <div className="mb-4">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2 mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  autoFocus
                  maxLength={24}
                  className="text-center font-cozy text-2xl sm:text-3xl font-bold text-stone-800 bg-rose-50/70 border-b-2 border-rose-400 rounded-lg px-3 py-1 outline-none w-64 shadow-inner"
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline px-2 py-1"
                >
                  Done
                </button>
              </div>
            ) : (
              <h1 className="font-cozy text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight leading-tight flex items-center justify-center flex-wrap gap-x-2">
                <span className="text-rose-600 underline decoration-rose-300 decoration-wavy decoration-2">
                  {name}
                </span>
                <span>, this is for you.</span>
                <button
                  onClick={() => setIsEditing(true)}
                  title="Personalize dedication name"
                  className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors inline-flex items-center"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </h1>
            )}
          </div>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Welcome to your personal peaceful haven. No timers to stress you, no game overs, and no rush.
            First, let's design your very own companion kitten!
          </p>

          <button
            onClick={handleProceedToCustomize}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 hover:from-rose-500 hover:to-amber-500 text-white font-cozy text-lg font-bold shadow-lg shadow-rose-300/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Create Your First Kitten</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        /* STEP 2: Starter Cat Customizer with Scroll Wheels */
        <div className="relative max-w-4xl w-full my-auto animate-fade-in">
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Dedicated to {name}
            </span>
          </div>
          <CatCustomizer
            title="Design Your Companion Cat"
            submitLabel="Enter Sanctuary with Your Kitten"
            onConfirm={handleFinishCustomizer}
          />
        </div>
      )}
    </div>
  );
};
