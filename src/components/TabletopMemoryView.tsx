/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat } from '../types/cat';
import { CatSvg } from './CatSvg';
import { sound } from '../utils/audio';
import tabletopBg from '../assets/images/memory_tabletop_1793113294646.jpg';
import {
  Heart,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Mail,
  X,
  Upload,
  Maximize2,
} from 'lucide-react';

interface TabletopMemoryViewProps {
  herName: string;
  activeCat: Cat;
  onBackToRoom: () => void;
}

export const TabletopMemoryView: React.FC<TabletopMemoryViewProps> = ({
  herName,
  activeCat,
  onBackToRoom,
}) => {
  const [activeLetter, setActiveLetter] = useState<'none' | 'love_letter' | 'reasons'>('none');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('purrfect_memory_photo') || null;
    } catch {
      return null;
    }
  });
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

  const displayImage = customPhotoUrl || '/assets/aistudio/download_94a4e50a.png';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomPhotoUrl(result);
        try {
          localStorage.setItem('purrfect_memory_photo', result);
        } catch {
          // localStorage full, keep in state
        }
        sound.playCutePetSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const openLetter = (type: 'love_letter' | 'reasons') => {
    sound.playPaperSound();
    setActiveLetter(type);
  };

  return (
    <div className="relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300/70 select-none flex flex-col justify-between p-4 sm:p-6 animate-fade-in">
      {/* Background Image: Cozy Wooden Tabletop with Tea & Petals */}
      <img
        src={tabletopBg}
        alt="Cozy Wooden Tabletop"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover scale-[1.01]"
      />

      {/* Gentle warm lighting vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-amber-100/15 pointer-events-none" />

      {/* --- TOP BAR: Back Navigation & Memory Title --- */}
      <div className="relative z-20 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sound.playPetChime(1);
            onBackToRoom();
          }}
          className="px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-stone-800 backdrop-blur-md shadow-md border border-amber-300 font-cozy text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>Back to Living Room</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-amber-900/80 backdrop-blur-md text-amber-100 border border-amber-400/50 shadow-md flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
          <span className="font-cozy text-xs sm:text-sm font-bold tracking-wide">
            Our Keepsake Table · For {herName}
          </span>
        </div>
      </div>

      {/* --- CENTER TABLETOP SCENE --- */}
      <div className="relative z-15 my-auto flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 py-4">
        {/* --- LEFT SIDE: LOVE LETTER ENVELOPE / NOTE --- */}
        <div
          onClick={() => openLetter('love_letter')}
          className="group cursor-pointer flex flex-col items-center transition-all hover:scale-105 active:scale-95 duration-200"
          title="Click to open this love letter"
        >
          {/* Note card / folded letter */}
          <div className="w-36 sm:w-44 h-28 sm:h-32 rounded-2xl bg-[#FFFDF7] p-3 shadow-xl border-2 border-amber-300/80 group-hover:border-rose-400 group-hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between rotate-[-3deg] group-hover:rotate-0">
            {/* Wax seal & ribbon */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-500 border border-rose-300 flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-rose-500 tracking-wider">
                <Mail className="w-3 h-3" />
                <span>Love Letter</span>
              </div>
              <p className="text-xs font-serif text-stone-700 font-semibold line-clamp-2 mt-1 leading-snug">
                &ldquo;Dear my love, my baby, my everything...&rdquo;
              </p>
            </div>

            <div className="text-[10px] font-cozy text-amber-700 bg-amber-50 rounded-lg px-2 py-0.5 text-center font-bold border border-amber-200/60">
              Tap to Open &amp; Read ✉️
            </div>
          </div>
          <span className="mt-2 text-xs font-cozy font-bold text-amber-950 bg-white/85 px-3 py-1 rounded-full shadow-xs border border-amber-200">
            A Letter From My Heart
          </span>
        </div>

        {/* --- CENTER: FRAMED PHOTOGRAPH --- */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => setIsPhotoExpanded(true)}
            className="group cursor-pointer relative p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-500/80 shadow-2xl transition-all hover:scale-105 active:scale-98 duration-200"
            title="Click to enlarge our photo"
          >
            {/* Hanging plaque / banner */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-cozy font-bold shadow-md border border-rose-300 flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3 fill-amber-200 text-amber-200" />
              <span>Our Sanctuary Memory</span>
            </div>

            {/* Photo Glass & Mat */}
            <div className="relative w-48 sm:w-60 md:w-64 h-32 sm:h-40 md:h-44 rounded-xl overflow-hidden bg-white shadow-inner border border-amber-300/50">
              <img
                src={displayImage}
                alt="Our Memory Photo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Glass Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/5 pointer-events-none" />

              {/* Expand Hint */}
              <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Little Wooden Stand Feet */}
            <div className="absolute -bottom-2.5 left-6 w-5 h-3 bg-amber-800 rounded-b-md shadow-md" />
            <div className="absolute -bottom-2.5 right-6 w-5 h-3 bg-amber-800 rounded-b-md shadow-md" />
          </div>

          {/* Change / Upload Photo control */}
          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer text-[11px] font-cozy font-bold text-amber-900 bg-white/90 hover:bg-white px-3 py-1 rounded-full shadow-xs border border-amber-300 transition-colors flex items-center gap-1">
              <Upload className="w-3 h-3 text-amber-700" />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {customPhotoUrl && (
              <button
                onClick={() => {
                  setCustomPhotoUrl(null);
                  try {
                    localStorage.removeItem('purrfect_memory_photo');
                  } catch {}
                }}
                className="text-[10px] font-semibold text-rose-600 hover:underline bg-white/80 px-2 py-1 rounded-full border border-rose-200"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* --- RIGHT SIDE: REASONS WHY I LOVE MY BABY NOTE --- */}
        <div
          onClick={() => openLetter('reasons')}
          className="group cursor-pointer flex flex-col items-center transition-all hover:scale-105 active:scale-95 duration-200"
          title="Click to read reasons why I love you"
        >
          {/* Note card / pastel stationery */}
          <div className="w-36 sm:w-44 h-28 sm:h-32 rounded-2xl bg-[#FFF8FA] p-3 shadow-xl border-2 border-rose-300/80 group-hover:border-rose-500 group-hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between rotate-[3deg] group-hover:rotate-0">
            {/* Cute flower ribbon accent */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-amber-900 fill-amber-900" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-pink-600 tracking-wider">
                <BookOpen className="w-3 h-3" />
                <span>Sweet Notes</span>
              </div>
              <p className="text-xs font-serif text-stone-700 font-semibold line-clamp-2 mt-1 leading-snug">
                &ldquo;Reasons why I love my baby...&rdquo;
              </p>
            </div>

            <div className="text-[10px] font-cozy text-rose-700 bg-rose-50 rounded-lg px-2 py-0.5 text-center font-bold border border-rose-200/60">
              Tap to Open &amp; Read 💖
            </div>
          </div>
          <span className="mt-2 text-xs font-cozy font-bold text-amber-950 bg-white/85 px-3 py-1 rounded-full shadow-xs border border-amber-200">
            Reasons Why I Love You
          </span>
        </div>
      </div>

      {/* --- COMPANION CAT NAPPING BY THE DESK --- */}
      <div className="relative z-20 flex items-center justify-between text-xs text-amber-950 bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 border border-amber-200/70 shadow-sm">
        <div className="flex items-center gap-2">
          <CatSvg cat={activeCat} size="sm" expression="sleeping" />
          <div>
            <span className="font-bold">{activeCat.name}</span>
            <span className="text-stone-500 ml-1.5">is softly purring by your memory letters...</span>
          </div>
        </div>

        <span className="text-[11px] text-stone-400 italic hidden sm:inline">
          &ldquo;Love makes every day warmer.&rdquo;
        </span>
      </div>

      {/* ========================================================================= */}
      {/* --- MODAL 1: HEARTFELT LOVE LETTER (Grammar-Corrected & Preserved Filipino) --- */}
      {/* ========================================================================= */}
      {activeLetter === 'love_letter' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fade-in select-text">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFDF9] shadow-2xl p-6 sm:p-8 border-4 border-amber-200/90 flex flex-col justify-between">
            {/* Close button */}
            <button
              onClick={() => setActiveLetter('none')}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 bg-amber-100/60 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Paper stationery texture styling */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-dashed border-rose-200 pb-3">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-800 text-lg sm:text-xl">
                    To My Love, My Everything
                  </h3>
                  <span className="text-xs text-rose-500 font-cozy font-semibold">
                    Written with all my heart
                  </span>
                </div>
              </div>

              {/* Grammar-Corrected Letter Content */}
              <div className="text-stone-800 font-serif leading-relaxed space-y-3.5 text-sm sm:text-base pr-1">
                <p className="font-bold text-rose-700 text-base sm:text-lg">
                  Dear my love, my baby, my everything,
                </p>

                <p>
                  I am writing this letter to say how truly thankful I am that you came into my life. Without you, my world was just black and white, and not fun at all. You made my life so colorful, joyful, and full of happiness.
                </p>

                <p>
                  Every single morning when I wake up, I feel so deeply grateful to be alive and to have you by my side.
                </p>

                <p>
                  There might be times when we face challenges in our relationship, but I pray that we always stay strong and never give up on each other. I love you so much and you mean everything to me—I truly cannot imagine a life without you in it.
                </p>

                <p className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 italic">
                  I am deeply sorry for the times I have hurt you. I promise <span className="font-bold text-rose-600 not-italic">na babawi ako</span>, and I will do everything it takes to make sure you will trust me and feel safe with me again.
                </p>
              </div>
            </div>

            {/* Letter Signoff */}
            <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 font-sans">Forever and always yours,</p>
                <p className="font-serif font-bold text-rose-600 text-base sm:text-lg">
                  With all my love ❤️
                </p>
              </div>

              <button
                onClick={() => setActiveLetter('none')}
                className="px-5 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-cozy text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-transform active:scale-95"
              >
                Keep in Heart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL 2: REASONS WHY I LOVE MY BABY (Grammar-Corrected) --- */}
      {/* ========================================================================= */}
      {activeLetter === 'reasons' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fade-in select-text">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFBF7] shadow-2xl p-6 sm:p-8 border-4 border-rose-200/90 flex flex-col justify-between">
            {/* Close button */}
            <button
              onClick={() => setActiveLetter('none')}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 bg-rose-100/60 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 border-b-2 border-dashed border-rose-200 pb-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-800 text-lg sm:text-xl">
                    Reasons Why I Love My Baby
                  </h3>
                  <span className="text-xs text-rose-500 font-cozy font-semibold">
                    The little and big things that mean the world to me
                  </span>
                </div>
              </div>

              {/* Grammar-Corrected Reasons List */}
              <div className="space-y-3 font-serif text-sm sm:text-base text-stone-800 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p>
                    She is the one who brought vibrant colors into my black-and-white world.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p>
                    She gives me a reason to wake up with joy, purpose, and gratitude every single day.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    She is the one who always comforts and cheers me up whenever I feel down.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <p>
                    She supports me in everything—even when things seem almost impossible, she still believes in me with all her heart.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-200/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-pink-200 text-pink-800 text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <p>
                    I love her from the very bottom of my heart, and I want to live the rest of my life by her side.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Signoff */}
            <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-between">
              <span className="text-xs font-cozy text-rose-500 font-bold">
                You will always be my greatest blessing. 💕
              </span>

              <button
                onClick={() => setActiveLetter('none')}
                className="px-5 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-cozy text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-transform active:scale-95"
              >
                Cherish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- EXPANDED PHOTO MODAL --- */}
      {/* ========================================================================= */}
      {isPhotoExpanded && (
        <div
          onClick={() => setIsPhotoExpanded(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border-4 border-amber-300"
          >
            <button
              onClick={() => setIsPhotoExpanded(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={displayImage}
              alt="Expanded Memory"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <p className="mt-2 text-center text-xs text-stone-500 font-cozy">
              Our Special Memory · Forever in our Purrfect Sanctuary
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
