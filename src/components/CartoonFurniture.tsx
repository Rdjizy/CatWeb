/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoomCustomization } from '../types/cat';

interface FurnitureProps {
  decor: RoomCustomization;
  onClick?: () => void;
  className?: string;
}

/**
 * High-quality illustrated cartoony game assets for furniture pieces.
 * Clean, charming, Studio Ghibli & Animal Crossing-inspired cozy vector art.
 */

// 1. CARTOONY CAT BEDS
export const CartoonCatBed: React.FC<FurnitureProps> = ({ decor, onClick, className = '' }) => {
  const { bedStyle, bedColor } = decor;

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200 select-none ${className}`}
      title="Cat Bed (Click to nap or customize)"
    >
      {bedStyle === 'donut' && (
        <svg viewBox="0 0 160 110" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="donutShade" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="80" cy="100" rx="68" ry="10" fill="#2E2018" opacity="0.18" />
          {/* Outer plush ring */}
          <ellipse cx="80" cy="65" rx="68" ry="38" fill={bedColor || '#FBCFE8'} />
          <ellipse cx="80" cy="65" rx="68" ry="38" fill="url(#donutShade)" />
          {/* Inner sunken cushion */}
          <ellipse cx="80" cy="68" rx="46" ry="24" fill="#FFFBEB" />
          <ellipse cx="80" cy="68" rx="46" ry="24" fill="#000000" opacity="0.08" />
          {/* Cute paw print embroidery */}
          <ellipse cx="80" cy="70" rx="9" ry="7" fill={bedColor || '#F472B6'} opacity="0.5" />
          <circle cx="72" cy="61" r="3" fill={bedColor || '#F472B6'} opacity="0.5" />
          <circle cx="80" cy="58" r="3.2" fill={bedColor || '#F472B6'} opacity="0.5" />
          <circle cx="88" cy="61" r="3" fill={bedColor || '#F472B6'} opacity="0.5" />
          {/* Plush bolster wrinkles/stitching */}
          <path d="M 28 65 Q 40 50 56 62" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 104 62 Q 120 50 132 65" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      )}

      {bedStyle === 'cloud' && (
        <svg viewBox="0 0 170 115" className="w-full h-full drop-shadow-lg">
          <ellipse cx="85" cy="104" rx="72" ry="10" fill="#2E2018" opacity="0.15" />
          {/* Fluffy cartoon cloud lobes */}
          <g fill={bedColor || '#E0F2FE'}>
            <circle cx="45" cy="65" r="32" />
            <circle cx="85" cy="50" r="38" />
            <circle cx="125" cy="65" r="32" />
            <ellipse cx="85" cy="72" rx="60" ry="26" />
          </g>
          {/* Soft inner fleece */}
          <ellipse cx="85" cy="72" rx="44" ry="18" fill="#FFFFFF" opacity="0.9" />
          {/* Sleeping cute face on cloud */}
          <path d="M 72 72 Q 78 77 84 72" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 88 72 Q 94 77 100 72" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <ellipse cx="68" cy="75" rx="4" ry="2" fill="#FDA4AF" opacity="0.7" />
          <ellipse cx="104" cy="75" rx="4" ry="2" fill="#FDA4AF" opacity="0.7" />
        </svg>
      )}

      {bedStyle === 'canopy' && (
        <svg viewBox="0 0 160 130" className="w-full h-full drop-shadow-xl">
          <ellipse cx="80" cy="120" rx="65" ry="9" fill="#2E2018" opacity="0.2" />
          {/* Four golden canopy posts */}
          <rect x="22" y="25" width="6" height="85" rx="3" fill="#D97706" />
          <rect x="132" y="25" width="6" height="85" rx="3" fill="#D97706" />
          {/* Top royal draped canopy with scalloped valance */}
          <path d="M 18 30 Q 80 15 142 30 L 140 45 Q 110 52 80 44 Q 50 52 20 45 Z" fill="#C084FC" />
          <path d="M 22 45 Q 36 52 50 45 Q 65 52 80 45 Q 95 52 110 45 Q 125 52 138 45" stroke="#FDE047" strokeWidth="2" fill="none" />
          {/* Royal velvet thick cushion */}
          <rect x="24" y="80" width="112" height="30" rx="14" fill={bedColor || '#A855F7'} />
          <rect x="28" y="82" width="104" height="22" rx="10" fill="#E9D5FF" />
          {/* Golden finial knobs */}
          <circle cx="25" cy="24" r="5" fill="#FBBF24" />
          <circle cx="135" cy="24" r="5" fill="#FBBF24" />
        </svg>
      )}

      {bedStyle === 'strawberry' && (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-lg">
          <ellipse cx="80" cy="108" rx="66" ry="10" fill="#2E2018" opacity="0.18" />
          {/* Giant Strawberry Tart Body */}
          <ellipse cx="80" cy="70" rx="66" ry="38" fill="#F43F5E" />
          {/* Tart crust base */}
          <path d="M 18 78 Q 80 108 142 78 Q 80 118 18 78 Z" fill="#D97706" opacity="0.85" />
          {/* White whipped cream inner cushion */}
          <ellipse cx="80" cy="70" rx="46" ry="24" fill="#FFF1F2" />
          <ellipse cx="80" cy="70" rx="42" ry="20" fill="#FFFFFF" />
          {/* Strawberry seeds */}
          <circle cx="34" cy="62" r="2" fill="#FDE047" />
          <circle cx="50" cy="52" r="2" fill="#FDE047" />
          <circle cx="110" cy="52" r="2" fill="#FDE047" />
          <circle cx="126" cy="62" r="2" fill="#FDE047" />
          {/* Green Strawberry Leaf Crown */}
          <path d="M 80 34 Q 70 20 60 28 Q 72 36 78 40 Q 80 18 85 24 Q 85 36 82 40 Q 95 24 102 32 Q 90 38 84 40 Z" fill="#22C55E" />
        </svg>
      )}

      {bedStyle === 'wicker' && (
        <svg viewBox="0 0 160 110" className="w-full h-full drop-shadow-md">
          <ellipse cx="80" cy="100" rx="66" ry="10" fill="#2E2018" opacity="0.18" />
          {/* Wicker basket weave */}
          <ellipse cx="80" cy="65" rx="66" ry="36" fill="#B45309" />
          {/* Weave texture lines */}
          <ellipse cx="80" cy="65" rx="62" ry="33" fill="#D97706" />
          {/* Plaid wool blanket folded inside */}
          <ellipse cx="80" cy="66" rx="48" ry="24" fill="#FDE047" />
          <path d="M 40 66 Q 80 82 120 66" stroke="#DC2626" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M 60 52 L 60 80 M 100 52 L 100 80" stroke="#DC2626" strokeWidth="2" opacity="0.7" />
          {/* Cozy cotton turn-down hem */}
          <ellipse cx="80" cy="67" rx="36" ry="16" fill="#FEF3C7" />
        </svg>
      )}
    </div>
  );
};

// 2. CARTOONY CAT TREE & SCRATCHING CONDOS
export const CartoonCatTree: React.FC<FurnitureProps> = ({ decor, onClick, className = '' }) => {
  const { catTreeStyle } = decor;

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200 select-none ${className}`}
      title="Cat Climbing Tree (Click to scratch or customize)"
    >
      {catTreeStyle === 'condo' && (
        <svg viewBox="0 0 140 210" className="w-full h-full drop-shadow-lg">
          {/* Base */}
          <ellipse cx="70" cy="198" rx="55" ry="10" fill="#E2E8F0" />
          <rect x="25" y="185" width="90" height="15" rx="7" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
          {/* Lower Sisal Scratching Poles */}
          <rect x="42" y="115" width="14" height="70" rx="3" fill="#E5D0B5" stroke="#B89973" strokeWidth="1.5" />
          <rect x="84" y="115" width="14" height="70" rx="3" fill="#E5D0B5" stroke="#B89973" strokeWidth="1.5" />
          {/* Sisal wrapping lines */}
          {[125, 140, 155, 170].map((y) => (
            <React.Fragment key={y}>
              <line x1="42" y1={y} x2="56" y2={y} stroke="#8C6D47" strokeWidth="1.5" />
              <line x1="84" y1={y} x2="98" y2={y} stroke="#8C6D47" strokeWidth="1.5" />
            </React.Fragment>
          ))}
          {/* Middle Cat Condo Cubby Box with Cat-Ear Doorway */}
          <rect x="28" y="75" width="84" height="50" rx="14" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2.5" />
          {/* Cat-eared entrance hole */}
          <path d="M 60 115 L 60 98 Q 63 92 66 95 L 70 98 L 74 95 Q 77 92 80 98 L 80 115 Z" fill="#3D2612" />
          {/* Upper pole */}
          <rect x="63" y="35" width="14" height="40" rx="3" fill="#E5D0B5" stroke="#B89973" strokeWidth="1.5" />
          {/* Top Roost Bed with Scalloped Edge */}
          <ellipse cx="70" cy="35" rx="42" ry="15" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="70" cy="34" rx="36" ry="11" fill="#FEF3C7" />
          {/* Dangling Wool Pom-Pom Toy */}
          <line x1="100" y1="75" x2="105" y2="100" stroke="#DC2626" strokeWidth="1.5" />
          <circle cx="106" cy="103" r="5.5" fill="#F43F5E" className="animate-bounce" />
        </svg>
      )}

      {catTreeStyle === 'castle' && (
        <svg viewBox="0 0 140 220" className="w-full h-full drop-shadow-xl">
          {/* Castle Base */}
          <rect x="20" y="185" width="100" height="18" rx="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          {/* Castle Tower Stone Wall */}
          <rect x="35" y="80" width="70" height="105" rx="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          {/* Castle Turret Battlement at Top */}
          <path d="M 30 80 L 30 65 L 42 65 L 42 72 L 54 72 L 54 65 L 66 65 L 66 72 L 78 72 L 78 65 L 90 65 L 90 72 L 102 72 L 102 65 L 110 65 L 110 80 Z" fill="#94A3B8" />
          {/* Royal Purple Flag waving on top */}
          <line x1="70" y1="65" x2="70" y2="28" stroke="#78350F" strokeWidth="2" />
          <polygon points="70,30 96,40 70,50" fill="#A855F7" />
          {/* Arched Castle Gateway */}
          <path d="M 52 185 L 52 140 Q 70 120 88 140 L 88 185 Z" fill="#475569" />
          {/* Sisal rope climbing ladder on side */}
          <line x1="108" y1="80" x2="114" y2="185" stroke="#B45309" strokeWidth="3" strokeDasharray="4,3" />
        </svg>
      )}

      {catTreeStyle === 'birch' && (
        <svg viewBox="0 0 140 210" className="w-full h-full drop-shadow-lg">
          {/* Natural grassy moss mound */}
          <ellipse cx="70" cy="195" rx="55" ry="12" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
          {/* White birch tree trunk */}
          <path d="M 62 195 Q 60 120 54 45 L 72 45 Q 74 120 78 195 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Birch tree dark bark notches */}
          <line x1="62" y1="160" x2="72" y2="158" stroke="#334155" strokeWidth="2" />
          <line x1="58" y1="130" x2="68" y2="128" stroke="#334155" strokeWidth="2" />
          <line x1="60" y1="90" x2="70" y2="92" stroke="#334155" strokeWidth="2" />
          {/* Leafy Perch Shelves */}
          <ellipse cx="44" cy="115" rx="26" ry="10" fill="#86EFAC" stroke="#22C55E" strokeWidth="1.5" />
          <ellipse cx="88" cy="75" rx="28" ry="11" fill="#86EFAC" stroke="#22C55E" strokeWidth="1.5" />
          <ellipse cx="63" cy="40" rx="34" ry="13" fill="#86EFAC" stroke="#22C55E" strokeWidth="1.5" />
          {/* Cute hanging bird toy */}
          <line x1="95" y1="85" x2="100" y2="115" stroke="#000" strokeWidth="1" strokeDasharray="2,2" />
          <circle cx="100" cy="118" r="4.5" fill="#38BDF8" />
        </svg>
      )}
    </div>
  );
};

// 3. CARTOONY COZY RUGS
export const CartoonRug: React.FC<FurnitureProps> = ({ decor, onClick, className = '' }) => {
  const { rugStyle, rugColor } = decor;

  return (
    <div onClick={onClick} className={`relative select-none ${className}`}>
      {rugStyle === 'mandala' && (
        <svg viewBox="0 0 240 120" className="w-full h-full drop-shadow-md">
          {/* Braided outer rim */}
          <ellipse cx="120" cy="60" rx="114" ry="54" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
          <ellipse cx="120" cy="60" rx="110" ry="50" fill={rugColor || '#FDE68A'} />
          {/* Mandala Sunburst Petals */}
          <ellipse cx="120" cy="60" rx="85" ry="38" fill="#F59E0B" opacity="0.3" />
          <ellipse cx="120" cy="60" rx="60" ry="26" fill="#EF4444" opacity="0.25" />
          <ellipse cx="120" cy="60" rx="35" ry="15" fill="#FEF08A" />
          {/* Fringe Tassels */}
          <path d="M 10 60 Q 5 60 0 60 M 230 60 Q 235 60 240 60" stroke="#D97706" strokeWidth="3" strokeDasharray="3,3" />
        </svg>
      )}

      {rugStyle === 'cloud' && (
        <svg viewBox="0 0 240 120" className="w-full h-full drop-shadow-md">
          <ellipse cx="120" cy="60" rx="110" ry="48" fill="#BAE6FD" opacity="0.4" />
          {/* Fluffy Cloud Carpet */}
          <g fill={rugColor || '#F0F9FF'} stroke="#7DD3FC" strokeWidth="2">
            <ellipse cx="80" cy="60" rx="55" ry="35" />
            <ellipse cx="160" cy="60" rx="55" ry="35" />
            <ellipse cx="120" cy="50" rx="60" ry="36" />
          </g>
          {/* Stitch border */}
          <ellipse cx="120" cy="56" rx="85" ry="32" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.4" />
        </svg>
      )}

      {rugStyle === 'daisy' && (
        <svg viewBox="0 0 240 120" className="w-full h-full drop-shadow-md">
          {/* Daisy Flower Petals */}
          <g fill={rugColor || '#FFFFFF'} stroke="#FDE68A" strokeWidth="2">
            <ellipse cx="120" cy="25" rx="20" ry="22" />
            <ellipse cx="120" cy="95" rx="20" ry="22" />
            <ellipse cx="55" cy="60" rx="32" ry="16" />
            <ellipse cx="185" cy="60" rx="32" ry="16" />
            <ellipse cx="75" cy="35" rx="26" ry="18" transform="rotate(-25 75 35)" />
            <ellipse cx="165" cy="35" rx="26" ry="18" transform="rotate(25 165 35)" />
            <ellipse cx="75" cy="85" rx="26" ry="18" transform="rotate(25 75 85)" />
            <ellipse cx="165" cy="85" rx="26" ry="18" transform="rotate(-25 165 85)" />
          </g>
          {/* Golden Center */}
          <ellipse cx="120" cy="60" rx="42" ry="24" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="120" cy="60" rx="36" ry="19" fill="#FDE047" />
        </svg>
      )}

      {rugStyle === 'plaid' && (
        <svg viewBox="0 0 240 120" className="w-full h-full drop-shadow-md">
          <ellipse cx="120" cy="60" rx="112" ry="50" fill={rugColor || '#FCA5A5'} stroke="#F87171" strokeWidth="2" />
          {/* Plaid lines */}
          <ellipse cx="120" cy="60" rx="90" ry="38" stroke="#DC2626" strokeWidth="3" fill="none" opacity="0.6" />
          <line x1="60" y1="20" x2="60" y2="100" stroke="#1E3A8A" strokeWidth="3" opacity="0.4" />
          <line x1="120" y1="12" x2="120" y2="108" stroke="#1E3A8A" strokeWidth="3" opacity="0.4" />
          <line x1="180" y1="20" x2="180" y2="100" stroke="#1E3A8A" strokeWidth="3" opacity="0.4" />
        </svg>
      )}
    </div>
  );
};

// 4. INTERACTIVE DOORS (Click to travel between rooms)
interface DoorProps {
  label: string;
  destination?: string;
  onClick?: () => void;
  className?: string;
  icon?: string;
}

export const CartoonDoor: React.FC<DoorProps> = ({
  label,
  destination = 'Next Room',
  onClick,
  className = '',
  icon = '🚪',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 duration-200 ${className}`}
      title={`Click to go to ${destination}`}
    >
      <div className="relative flex flex-col items-center">
        {/* Cute hanging wooden sign board */}
        <div className="mb-1.5 px-3 py-1 rounded-xl bg-amber-100 border-2 border-amber-400 shadow-md flex items-center gap-1.5 group-hover:bg-amber-200 transition-colors animate-float-gentle">
          <span className="text-sm">{icon}</span>
          <span className="font-cozy font-bold text-xs text-amber-900 whitespace-nowrap">
            {label}
          </span>
        </div>

        {/* Door Frame & Door SVG */}
        <div className="w-20 sm:w-24 h-32 sm:h-38 rounded-t-full bg-[#5C3D24] p-1.5 border-4 border-[#3D2612] shadow-2xl relative overflow-hidden">
          {/* Inner Door Panel */}
          <div className="w-full h-full rounded-t-full bg-[#8B5A2B] border-2 border-[#A26D3A] flex flex-col justify-between p-2 relative">
            {/* Upper glass/panel window */}
            <div className="w-full h-12 rounded-t-full bg-sky-200/40 border border-amber-900/30 grid grid-cols-2">
              <div className="border-r border-amber-900/20" />
              <div />
            </div>
            {/* Brass Door Knob */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-300 border-2 border-amber-600 shadow-md group-hover:scale-125 transition-transform flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-100" />
            </div>
            {/* Lower wood panels */}
            <div className="w-full h-10 border border-amber-900/30 rounded-lg bg-[#75471F]" />
          </div>
        </div>
      </div>
    </div>
  );
};
