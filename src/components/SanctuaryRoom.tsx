/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Cat, RoomCustomization } from '../types/cat';
import { CatSvg } from './CatSvg';
import { Heart, Sparkles, Paintbrush, DoorOpen, Image as ImageIcon } from 'lucide-react';
import { sound } from '../utils/audio';
import { CartoonCatBed, CartoonCatTree, CartoonRug, CartoonDoor } from './CartoonFurniture';
import livingRoomBg from '../assets/images/livingroom_cozy_1793113228910.jpg';

interface SanctuaryRoomProps {
  cats: Cat[];
  activeCat: Cat;
  upgrades: Record<string, number>;
  decor: RoomCustomization;
  onPetCat: (catId: string, event?: React.MouseEvent | React.PointerEvent) => void;
  onSelectCat: (catId: string) => void;
  activeExpression: 'idle' | 'petting' | 'eating' | 'sleeping';
  onNavigate?: (view: 'house' | 'bedroom' | 'farm' | 'tabletop') => void;
  onOpenDecor?: () => void;
}

interface FloatingEffect {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'coin';
  text?: string;
}

export const SanctuaryRoom: React.FC<SanctuaryRoomProps> = ({
  cats,
  activeCat,
  upgrades,
  decor,
  onPetCat,
  onSelectCat,
  activeExpression,
  onNavigate,
  onOpenDecor,
}) => {
  const [effects, setEffects] = useState<FloatingEffect[]>([]);
  const [isSwipingCat, setIsSwipingCat] = useState(false);

  // Swipe gesture tracking
  const lastStrokePos = useRef<{ x: number; y: number } | null>(null);
  const strokeSoundThrottle = useRef<number>(0);

  // Other owned cats lounging around the room
  const otherCats = cats.filter((c) => c.id !== activeCat.id);
  const sofaCat = otherCats[0] || null;
  const armchairCat = otherCats[1] || null;
  const windowCat = otherCats[2] || null;
  const plantCat = otherCats[3] || null;

  const fireplaceTier = upgrades['fireplace'] || 0;

  // Spawn floating heart effect at specific coordinate
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

  // --- SWIPE-TO-PET ON ACTIVE CAT ---

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsSwipingCat(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastStrokePos.current = { x: e.clientX, y: e.clientY };

    sound.playCutePetSound();
    onPetCat(activeCat.id, e);
    spawnHeart(x + 40, y - 20, '+2 coins');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSwipingCat || !lastStrokePos.current) return;
    e.stopPropagation();

    const dx = e.clientX - lastStrokePos.current.x;
    const dy = e.clientY - lastStrokePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Every 32px of swipe/stroke across the cat
    if (dist > 32) {
      lastStrokePos.current = { x: e.clientX, y: e.clientY };
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Throttle sound slightly so continuous petting sounds lovely
      const now = Date.now();
      if (now - strokeSoundThrottle.current > 350) {
        sound.playCutePetSound();
        strokeSoundThrottle.current = now;
      }

      onPetCat(activeCat.id, e);
      spawnHeart(x, y - 15, '+1 coin');
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isSwipingCat) {
      setIsSwipingCat(false);
      lastStrokePos.current = null;
      sound.playPurr(0.8);
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] rounded-3xl overflow-hidden shadow-xl border border-amber-200/60 select-none group">
      {/* --- HOUSE BACKGROUND IMAGE (Living Room) --- */}
      <img
        src={livingRoomBg}
        alt="Cozy Cat Sanctuary Living Room"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover scale-[1.01]"
      />

      {/* Subtle warm sunlight overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-amber-100/10 pointer-events-none" />

      {/* Fireplace glow */}
      {fireplaceTier > 0 && (
        <div className="absolute top-[52%] right-[19%] sm:right-[21%] z-10 pointer-events-none">
          <div className="w-10 h-10 bg-amber-500/25 rounded-full blur-md animate-pulse" />
        </div>
      )}

      {/* --- CLICKABLE MEMORY PHOTO FRAME (On Fireplace Mantelpiece) --- */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          sound.playMemoryChime();
          onNavigate?.('tabletop');
        }}
        className="absolute top-[37%] sm:top-[36%] right-[20%] sm:right-[21%] z-25 cursor-pointer hover:scale-115 active:scale-95 transition-all group/frame flex flex-col items-center"
        title="Click to view our keepsake photo & read love letters on the table"
      >
        <div className="relative p-1 rounded-md bg-gradient-to-b from-amber-200 to-amber-500 border-2 border-amber-600 shadow-xl overflow-hidden group-hover/frame:shadow-rose-400/50">
          {/* Small thumbnail of user's image */}
          <div className="w-9 h-6 sm:w-11 sm:h-7 rounded overflow-hidden bg-white shadow-inner">
            <img
              src="/assets/aistudio/image_01b5480e.png"
              alt="Memory Frame Thumbnail"
              className="w-full h-full object-cover group-hover/frame:scale-110 transition-transform"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full flex items-center justify-center animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full flex items-center justify-center">
            <Heart className="w-1.5 h-1.5 text-white fill-white" />
          </div>
        </div>

        <span className="mt-1 px-2 py-0.5 rounded-full bg-rose-950/85 backdrop-blur-xs text-[9px] font-bold text-rose-200 shadow-sm border border-rose-400/50 group-hover/frame:bg-rose-900 transition-colors flex items-center gap-1 whitespace-nowrap animate-bounce">
          <span>💌 View Letters & Photo</span>
        </span>
      </div>

      {/* --- INTERACTIVE CLICKABLE DOORS TO OTHER ROOMS --- */}
      {/* Left Door -> Cozy Bedroom (Aligned with left cat-eared door) */}
      <div
        onClick={() => {
          sound.playPetChime(1);
          onNavigate?.('bedroom');
        }}
        className="absolute top-[20%] sm:top-[22%] left-[9%] sm:left-[11%] z-25 cursor-pointer hover:scale-105 active:scale-95 transition-all group/door flex flex-col items-center"
        title="Walk into the Cozy Cat Bedroom"
      >
        <CartoonDoor label="Bedroom" />
        <span className="mt-1 px-2 py-0.5 rounded-full bg-amber-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-200 shadow-sm border border-amber-500/40 group-hover/door:bg-amber-900 transition-colors flex items-center gap-1">
          <DoorOpen className="w-3 h-3 text-amber-300" />
          <span>To Bedroom</span>
        </span>
      </div>

      {/* Right Arch -> Pasture Farm (Aligned with right arched garden door) */}
      <div
        onClick={() => {
          sound.playPetChime(2);
          onNavigate?.('farm');
        }}
        className="absolute top-[20%] sm:top-[22%] right-[3%] sm:right-[4%] z-25 cursor-pointer hover:scale-105 active:scale-95 transition-all group/door flex flex-col items-center"
        title="Walk out to the Pasture Farm"
      >
        <div className="w-13 sm:w-16 h-22 sm:h-26 rounded-t-full bg-gradient-to-b from-emerald-700/80 to-emerald-950/90 border-2 border-emerald-400/80 shadow-lg flex flex-col items-center justify-center p-1 relative overflow-hidden backdrop-blur-xs">
          <div className="absolute inset-1 rounded-t-full border border-emerald-300/40 flex flex-col items-center justify-center bg-emerald-500/10">
            <span className="text-xl sm:text-2xl animate-pulse">🌾</span>
          </div>
        </div>
        <span className="mt-1 px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-xs text-[10px] font-bold text-emerald-200 shadow-sm border border-emerald-500/40 group-hover/door:bg-emerald-900 transition-colors flex items-center gap-1">
          <span>To Farm</span>
        </span>
      </div>

      {/* --- CUSTOMIZED CARTOON FURNITURE GAME ASSETS --- */}
      {/* Cartoon Rug beneath active cat */}
      <div className="absolute bottom-[2%] sm:bottom-[3%] left-1/2 -translate-x-1/2 z-15 pointer-events-none flex justify-center">
        <CartoonRug
          decor={decor}
          className="w-52 sm:w-72 h-20 sm:h-28 opacity-90 drop-shadow-md"
        />
      </div>

      {/* Cartoon Cat Bed placed in the room */}
      <div
        onClick={() => onOpenDecor?.()}
        className="absolute bottom-[9%] left-[18%] sm:left-[22%] z-22 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        title="Customized Cat Bed (Click to customize furniture)"
      >
        <CartoonCatBed decor={decor} />
      </div>

      {/* Cartoon Cat Tree placed next to window / shelf */}
      <div
        onClick={() => onOpenDecor?.()}
        className="absolute bottom-[18%] right-[28%] sm:right-[30%] z-21 cursor-pointer hover:scale-105 active:scale-95 transition-transform hidden sm:block"
        title="Customized Cat Tree Tower (Click to customize furniture)"
      >
        <CartoonCatTree decor={decor} />
      </div>

      {/* Quick Customize Furniture Floating Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          sound.playCutePetSound();
          onOpenDecor?.();
        }}
        className="absolute top-3 left-3 sm:left-4 z-30 px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-stone-800 backdrop-blur-sm shadow-md border border-amber-300 font-cozy text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:shadow-lg"
      >
        <Paintbrush className="w-3.5 h-3.5 text-rose-500" />
        <span>Customize Furniture</span>
      </button>

      {/* --- LOUNGING COMPANIONS IN THE ROOM (Tappable cats) --- */}
      {sofaCat && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playCutePetSound();
            onPetCat(sofaCat.id);
            onSelectCat(sofaCat.id);
          }}
          title={`${sofaCat.name} is resting on the sofa (Click to pet/switch)`}
          className="absolute bottom-[28%] sm:bottom-[30%] right-[14%] sm:right-[18%] z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        >
          <CatSvg cat={sofaCat} size="sm" expression="sleeping" />
        </div>
      )}

      {armchairCat && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playCutePetSound();
            onPetCat(armchairCat.id);
            onSelectCat(armchairCat.id);
          }}
          title={`${armchairCat.name} is lounging on the armchair (Click to pet/switch)`}
          className="absolute bottom-[16%] sm:bottom-[18%] left-[8%] sm:left-[11%] z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        >
          <CatSvg cat={armchairCat} size="sm" expression="idle" />
        </div>
      )}

      {windowCat && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playCutePetSound();
            onPetCat(windowCat.id);
            onSelectCat(windowCat.id);
          }}
          title={`${windowCat.name} is enjoying the mountain view (Click to pet/switch)`}
          className="absolute top-[48%] sm:top-[50%] left-[26%] sm:left-[28%] z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        >
          <CatSvg cat={windowCat} size="sm" expression="idle" />
        </div>
      )}

      {plantCat && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playCutePetSound();
            onPetCat(plantCat.id);
            onSelectCat(plantCat.id);
          }}
          title={`${plantCat.name} is inspecting the houseplants (Click to pet/switch)`}
          className="absolute bottom-[35%] sm:bottom-[36%] left-[45%] z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        >
          <CatSvg cat={plantCat} size="sm" expression="idle" />
        </div>
      )}

      {/* --- HERO ACTIVE CAT ON WARM RUG (Exclusive Click & Swipe-to-Pet Zone) --- */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute bottom-[3%] sm:bottom-[5%] left-1/2 -translate-x-1/2 z-30 cursor-pointer touch-none select-none transition-transform hover:scale-105 active:scale-95 duration-200"
        title="Swipe or click across the cat to pet and hear purrs!"
      >
        <CatSvg
          cat={activeCat}
          size="lg"
          expression={isSwipingCat ? 'petting' : activeExpression}
          showShadow={true}
        />

        {/* Floating Petting Hearts & Coins */}
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

      {/* Treat dish indicator */}
      <div className="absolute bottom-3 right-4 sm:right-6 z-25 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200 shadow-xs">
          <div className="w-6 h-4 bg-amber-200 rounded-full border border-amber-300 relative overflow-hidden flex items-center justify-center">
            <div
              className="w-4 h-2 bg-amber-600 rounded-full transition-transform"
              style={{ transform: `scale(${Math.max(0.3, activeCat.hunger / 100)})` }}
            />
          </div>
          <span className="text-[10px] font-bold text-stone-700">TREAT DISH</span>
        </div>
      </div>

      {/* Swipe to Pet Hint */}
      <div className="absolute top-3 right-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 text-xs text-stone-700 shadow-sm font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
          <span>Swipe or tap on the cat to cuddle</span>
        </div>
      </div>
    </div>
  );
};
