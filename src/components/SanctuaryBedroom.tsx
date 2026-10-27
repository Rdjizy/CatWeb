/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Cat, RoomCustomization } from '../types/cat';
import { CatSvg } from './CatSvg';
import { CartoonCatBed, CartoonRug, CartoonDoor } from './CartoonFurniture';
import { Heart, Palette, Sparkles, Moon } from 'lucide-react';
import { sound } from '../utils/audio';

interface SanctuaryBedroomProps {
  cats: Cat[];
  activeCat: Cat;
  decor: RoomCustomization;
  onPetCat: (catId: string, event?: React.MouseEvent | React.PointerEvent) => void;
  onSelectCat: (catId: string) => void;
  onNavigateTo?: (view: 'house' | 'bedroom' | 'farm') => void;
  onNavigate?: (view: 'house' | 'bedroom' | 'farm') => void;
  onOpenDecorModal?: () => void;
  onOpenDecor?: () => void;
  activeExpression: 'idle' | 'petting' | 'eating' | 'sleeping';
}

interface FloatingEffect {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'coin';
  text?: string;
}

export const SanctuaryBedroom: React.FC<SanctuaryBedroomProps> = ({
  cats,
  activeCat,
  decor,
  onPetCat,
  onSelectCat,
  onNavigateTo,
  onNavigate,
  onOpenDecorModal,
  onOpenDecor,
  activeExpression,
}) => {
  const handleNav = onNavigate || onNavigateTo;
  const handleOpenDecor = onOpenDecor || onOpenDecorModal;
  const [effects, setEffects] = useState<FloatingEffect[]>([]);
  const [isSwipingCat, setIsSwipingCat] = useState(false);
  const [catInBedNook, setCatInBedNook] = useState(false);

  const lastStrokePos = useRef<{ x: number; y: number } | null>(null);
  const strokeSoundThrottle = useRef<number>(0);

  // Other lounging cats in bedroom
  const otherCats = cats.filter((c) => c.id !== activeCat.id);
  const armchairCat = otherCats[0] || null;
  const windowCat = otherCats[1] || null;

  const spawnHeart = (x: number, y: number, text?: string) => {
    const newEffect: FloatingEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: 'heart',
      text,
    };
    setEffects((prev) => [...prev.slice(-12), newEffect]);
    setTimeout(() => {
      setEffects((prev) => prev.filter((eff) => eff.id !== newEffect.id));
    }, 1100);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsSwipingCat(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastStrokePos.current = { x: e.clientX, y: e.clientY };

    sound.playCutePetSound();
    onPetCat(activeCat.id, e);
    spawnHeart(x + 30, y - 20, '+2 coins');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSwipingCat || !lastStrokePos.current) return;
    e.stopPropagation();

    const dx = e.clientX - lastStrokePos.current.x;
    const dy = e.clientY - lastStrokePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 30) {
      lastStrokePos.current = { x: e.clientX, y: e.clientY };
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const now = Date.now();
      if (now - strokeSoundThrottle.current > 350) {
        sound.playCutePetSound();
        strokeSoundThrottle.current = now;
      }

      onPetCat(activeCat.id, e);
      spawnHeart(x, y - 15, '+1 coin');
    }
  };

  const handlePointerUp = () => {
    if (isSwipingCat) {
      setIsSwipingCat(false);
      lastStrokePos.current = null;
      sound.playPurr(0.8);
    }
  };

  const handleBedNookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCutePetSound();
    setCatInBedNook((prev) => !prev);
    spawnHeart(240, 180, catInBedNook ? 'Awake!' : 'Cozy Nap time! zZz');
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] rounded-3xl overflow-hidden shadow-xl border border-amber-200/60 select-none group">
      {/* Background Studio Ghibli Bedroom Image */}
      <img
        src="/assets/images/cozy_cat_bedroom.jpg"
        alt="Cozy Cat Sanctuary Bedroom"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover scale-[1.01]"
      />

      {/* Warm Fairy Light & Evening Ambience Scrim */}
      {decor.isLampOn ? (
        <div className="absolute inset-0 bg-amber-400/15 pointer-events-none mix-blend-overlay" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-amber-100/10 pointer-events-none" />
      )}

      {/* --- CLICKABLE DOOR TO LIVING ROOM (Top-Left) --- */}
      <div className="absolute top-4 left-4 sm:left-6 z-20">
        <CartoonDoor
          label="Living Room"
          destination="Living Room"
          icon="🛋️"
          onClick={() => {
            sound.playPetChime(1);
            handleNav?.('house');
          }}
        />
      </div>

      {/* --- CLICKABLE PATH TO FARM (Top-Right) --- */}
      <div className="absolute top-4 right-4 sm:right-6 z-20">
        <CartoonDoor
          label="Pasture Farm"
          destination="Pasture Farm"
          icon="🌾"
          onClick={() => {
            sound.playPetChime(2);
            handleNav?.('farm');
          }}
        />
      </div>

      {/* --- INTERACTIVE CAT BED NOOK (Center-Left) --- */}
      <div
        onClick={handleBedNookClick}
        className="absolute bottom-[22%] left-[36%] sm:left-[39%] z-20 w-32 sm:w-44 cursor-pointer hover:scale-105 transition-transform"
        title="Wooden Cat Bed Nook (Click to call cat to nap!)"
      >
        <CartoonCatBed decor={decor} />

        {/* If cat called to bed nook */}
        {catInBedNook && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <CatSvg cat={activeCat} size="sm" expression="sleeping" />
            <span className="absolute -top-3 right-0 text-xs font-bold text-amber-500 animate-bounce">
              zZz...
            </span>
          </div>
        )}
      </div>

      {/* --- LOUNGING CAT ON BEDROOM ARMCHAIR (Right) --- */}
      {armchairCat && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playCutePetSound();
            onPetCat(armchairCat.id);
            onSelectCat(armchairCat.id);
          }}
          title={`${armchairCat.name} is napping on the plush armchair`}
          className="absolute bottom-[20%] right-[16%] sm:right-[18%] z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        >
          <CatSvg cat={armchairCat} size="sm" expression="sleeping" />
        </div>
      )}

      {/* --- CAT SITTING BY SUNLIT BEDROOM WINDOW (Left) --- */}
      {windowCat && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playCutePetSound();
            onPetCat(windowCat.id);
            onSelectCat(windowCat.id);
          }}
          title={`${windowCat.name} is sunbathing by the window`}
          className="absolute bottom-[36%] left-[16%] sm:left-[18%] z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        >
          <CatSvg cat={windowCat} size="sm" expression="idle" />
        </div>
      )}

      {/* --- CENTER RUG & ACTIVE CAT (With Swipe-to-Pet) --- */}
      {!catInBedNook && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute bottom-[3%] sm:bottom-[5%] left-1/2 -translate-x-1/2 z-30 cursor-pointer touch-none select-none transition-transform hover:scale-105 active:scale-95 duration-200"
          title="Swipe or tap across the cat to pet!"
        >
          <CatSvg
            cat={activeCat}
            size="lg"
            expression={isSwipingCat ? 'petting' : activeExpression}
            showShadow={true}
          />

          {/* Floating Hearts along stroke path */}
          {effects.map((eff) => (
            <div
              key={eff.id}
              className="absolute z-50 pointer-events-none flex items-center gap-1 text-rose-500 font-bold text-sm"
              style={{
                left: eff.x,
                top: eff.y,
                animation: 'heartFloat 1.1s ease-out forwards',
              }}
            >
              <Heart className="w-5 h-5 fill-rose-400 stroke-rose-600 drop-shadow" />
              {eff.text && (
                <span className="text-amber-500 font-cozy text-xs bg-white/95 px-2 py-0.5 rounded-full shadow-sm border border-amber-200 whitespace-nowrap">
                  {eff.text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Room Decor Button */}
      <div className="absolute bottom-3 left-4 z-25">
        <button
          onClick={handleOpenDecor}
          className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-bold border border-amber-300 shadow-md hover:bg-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 text-rose-500" />
          <span>Customize Furniture</span>
        </button>
      </div>

      {/* Bedroom Ambient Hint */}
      <div className="absolute bottom-3 right-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-stone-200 text-xs text-stone-700 shadow-sm font-medium">
          <Moon className="w-3.5 h-3.5 text-amber-600" />
          <span>Cozy Bedroom Nook · Click doors to explore</span>
        </div>
      </div>
    </div>
  );
};
