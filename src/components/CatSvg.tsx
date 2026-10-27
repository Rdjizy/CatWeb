/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cat, CatPattern } from '../types/cat';

interface CatSvgProps {
  cat: Cat;
  expression?: 'idle' | 'petting' | 'eating' | 'sleeping';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
}

export const CatSvg: React.FC<CatSvgProps> = ({
  cat,
  expression = 'idle',
  className = '',
  size = 'md',
  showShadow = true,
}) => {
  const {
    baseColor,
    pattern,
    patternColor,
    bellyColor,
    earColor = '#F9A8D4',
    eyeColor,
    isKitten,
  } = cat;

  // Size dimensions
  const dimensions = {
    sm: { width: 80, height: 75 },
    md: { width: 140, height: 130 },
    lg: { width: 200, height: 185 },
    xl: { width: 280, height: 260 },
  }[size];

  // Scale factor for kittens
  const scale = isKitten ? 0.85 : 1;
  const isSleeping = expression === 'sleeping';
  const isPetting = expression === 'petting';
  const isEating = expression === 'eating';

  // Renders distinct coat patterns
  const renderPattern = (pat: CatPattern) => {
    switch (pat) {
      case 'tabby':
        return (
          <g fill="none" stroke={patternColor} strokeWidth="3.5" strokeLinecap="round" opacity="0.85">
            {/* Forehead M mark */}
            <path d="M 88 56 L 94 65 L 100 56 L 106 65 L 112 56" />
            <path d="M 94 51 L 100 46 L 106 51" strokeWidth="2.5" />
            {/* Body stripes */}
            <path d="M 52 118 Q 66 122 76 118" />
            <path d="M 50 134 Q 68 138 78 132" />
            <path d="M 148 118 Q 134 122 124 118" />
            <path d="M 150 134 Q 132 138 122 132" />
            {/* Tail stripes */}
            <path d="M 154 162 Q 164 160 168 152" strokeWidth="3" />
            <path d="M 166 142 Q 172 136 170 126" strokeWidth="3" />
          </g>
        );

      case 'calico':
        return (
          <g opacity="0.9">
            <path d="M 72 45 Q 85 40 88 58 Q 78 72 68 62 Z" fill={patternColor} />
            <path d="M 112 44 Q 128 42 132 58 Q 122 68 114 60 Z" fill="#D97706" />
            <path d="M 54 115 Q 75 110 82 130 Q 75 150 56 142 Z" fill={patternColor} />
            <path d="M 122 112 Q 148 116 144 140 Q 126 150 118 132 Z" fill="#D97706" />
            <path d="M 160 135 Q 175 130 172 155 Q 158 165 154 148 Z" fill={patternColor} />
          </g>
        );

      case 'tuxedo':
        return (
          <g>
            <path
              d="M 86 85 Q 100 95 114 85 Q 126 125 118 158 Q 100 164 82 158 Q 74 125 86 85 Z"
              fill={bellyColor || '#FFFFFF'}
            />
            <path d="M 94 65 Q 100 62 106 65 L 104 80 Q 100 84 96 80 Z" fill="#FFFFFF" />
            <ellipse cx="80" cy="162" rx="14" ry="9" fill="#FFFFFF" />
            <ellipse cx="120" cy="162" rx="14" ry="9" fill="#FFFFFF" />
          </g>
        );

      case 'siamese':
        return (
          <g opacity="0.92">
            <ellipse cx="100" cy="74" rx="26" ry="20" fill={patternColor} />
            <path d="M 66 32 L 78 20 L 86 36 Z" fill={patternColor} />
            <path d="M 134 32 L 122 20 L 114 36 Z" fill={patternColor} />
            <path
              d="M 148 160 C 175 160 185 130 172 105 C 166 94 156 94 154 100 C 152 106 158 112 162 120 C 170 136 158 150 142 152 Z"
              fill={patternColor}
            />
            <ellipse cx="80" cy="162" rx="12" ry="8" fill={patternColor} />
            <ellipse cx="120" cy="162" rx="12" ry="8" fill={patternColor} />
          </g>
        );

      case 'bengal':
        return (
          <g fill="none" stroke={patternColor} strokeWidth="3" strokeLinecap="round" opacity="0.88">
            <circle cx="64" cy="120" r="5" fill="#D97706" />
            <circle cx="76" cy="138" r="6" fill="#D97706" />
            <circle cx="62" cy="148" r="4" fill="#D97706" />
            <circle cx="136" cy="120" r="5" fill="#D97706" />
            <circle cx="124" cy="138" r="6" fill="#D97706" />
            <circle cx="138" cy="148" r="4" fill="#D97706" />
            <path d="M 94 54 Q 100 50 106 54" />
          </g>
        );

      case 'celestial':
        return (
          <g opacity="0.95">
            <g fill="#FDE047">
              <polygon points="70,118 72,122 76,122 73,125 74,129 70,126 66,129 67,125 64,122 68,122" />
              <polygon points="130,115 132,119 136,119 133,122 134,126 130,123 126,126 127,122 124,119 128,119" />
              <polygon points="100,140 101,143 104,143 102,145 103,148 100,146 97,148 98,145 96,143 99,143" />
            </g>
            <circle cx="60" cy="136" r="2.5" fill="#FFFFFF" />
            <circle cx="85" cy="115" r="2" fill="#FFFFFF" />
            <circle cx="140" cy="135" r="2.5" fill="#FFFFFF" />
            <circle cx="118" cy="125" r="2" fill="#FFFFFF" />
            <path d="M 68 124 Q 85 118 99 142 Q 115 128 130 120" stroke="#FEF08A" strokeWidth="1" strokeDasharray="2,3" fill="none" opacity="0.7" />
          </g>
        );

      case 'sakura':
        return (
          <g fill="#F472B6" opacity="0.9">
            <ellipse cx="68" cy="122" rx="4" ry="7" transform="rotate(25 68 122)" />
            <ellipse cx="78" cy="138" rx="4" ry="7" transform="rotate(-30 78 138)" />
            <ellipse cx="132" cy="122" rx="4" ry="7" transform="rotate(-20 132 122)" />
            <ellipse cx="122" cy="138" rx="4" ry="7" transform="rotate(35 122 138)" />
            <circle cx="100" cy="56" r="3" fill="#FDA4AF" />
          </g>
        );

      case 'aurora':
        return (
          <g opacity="0.65">
            <path
              d="M 60 115 C 80 100 120 100 140 115 C 145 135 135 155 100 155 C 65 155 55 135 60 115 Z"
              fill="url(#auroraGradient)"
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <svg
        viewBox="0 0 200 190"
        className={`w-full h-full overflow-visible transition-transform duration-300 ${
          isPetting ? 'scale-105' : ''
        } ${isSleeping ? 'opacity-95' : ''}`}
        style={{ transformOrigin: 'center bottom' }}
      >
        <defs>
          <radialGradient id="bodyShade" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </radialGradient>
          <linearGradient id="auroraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.7" />
          </linearGradient>
          <filter id="softGaze" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Floor Shadow */}
        {showShadow && (
          <ellipse
            cx="100"
            cy="176"
            rx="56"
            ry="9"
            fill="#3D2E24"
            opacity="0.12"
          />
        )}

        {/* Master Cat Scaled Group */}
        <g
          transform={`scale(${scale})`}
          style={{ transformOrigin: '100px 170px' }}
          className={isSleeping || isPetting ? 'animate-purr' : ''}
        >
          {/* Animated Swishing Tail */}
          <path
            d="M 145 155 C 180 155 190 120 176 96 C 170 85 160 88 158 94 C 156 100 162 108 166 116 C 172 130 162 144 140 148 Z"
            fill={baseColor}
            className="animate-tail"
            style={{ transformOrigin: '145px 155px' }}
          />
          <path
            d="M 145 155 C 180 155 190 120 176 96 C 170 85 160 88 158 94 C 156 100 162 108 166 116 C 172 130 162 144 140 148 Z"
            fill="url(#bodyShade)"
            className="animate-tail"
            style={{ transformOrigin: '145px 155px' }}
          />

          {/* Ears with earColor and Twitch Animation */}
          <g>
            {/* Left Ear with twitch */}
            <g className="animate-ear-left">
              <path
                d="M 62 48 L 74 18 Q 80 15 84 22 L 92 48 Z"
                fill={baseColor}
              />
              <path
                d="M 68 44 L 75 25 Q 78 22 81 27 L 86 44 Z"
                fill={earColor}
                opacity="0.8"
              />
            </g>
            {/* Right Ear */}
            <g>
              <path
                d="M 138 48 L 126 18 Q 120 15 116 22 L 108 48 Z"
                fill={baseColor}
              />
              <path
                d="M 132 44 L 125 25 Q 122 22 119 27 L 114 44 Z"
                fill={earColor}
                opacity="0.8"
              />
            </g>
          </g>

          {/* Main Body */}
          <path
            d="M 60 110 C 50 140 60 168 100 168 C 140 168 150 140 140 110 C 135 90 65 90 60 110 Z"
            fill={baseColor}
          />

          {/* Belly Patch */}
          <ellipse
            cx="100"
            cy="138"
            rx="28"
            ry="24"
            fill={bellyColor || '#FFF8EE'}
            opacity="0.85"
          />

          {/* Pattern Overlay on Body */}
          {renderPattern(pattern)}

          {/* Body Soft Shadow & Highlights */}
          <path
            d="M 60 110 C 50 140 60 168 100 168 C 140 168 150 140 140 110 C 135 90 65 90 60 110 Z"
            fill="url(#bodyShade)"
          />

          {/* Front Paws */}
          <g fill={baseColor}>
            <ellipse cx="80" cy="164" rx="14" ry="9" />
            <ellipse cx="120" cy="164" rx="14" ry="9" />
            <path d="M 77 165 L 77 170 M 83 165 L 83 170" stroke="#000" strokeWidth="1" opacity="0.15" />
            <path d="M 117 165 L 117 170 M 123 165 L 123 170" stroke="#000" strokeWidth="1" opacity="0.15" />
          </g>

          {/* Cat Head */}
          <circle
            cx="100"
            cy="70"
            r="38"
            fill={baseColor}
            filter="url(#softGaze)"
          />
          <circle
            cx="100"
            cy="70"
            r="38"
            fill="url(#bodyShade)"
          />

          {/* Facial Cheeks / Snout Bulb */}
          <ellipse cx="92" cy="79" rx="9" ry="7" fill={bellyColor || '#FFF9F0'} opacity="0.9" />
          <ellipse cx="108" cy="79" rx="9" ry="7" fill={bellyColor || '#FFF9F0'} opacity="0.9" />

          {/* Cute Nose */}
          <polygon
            points="97,75 103,75 100,79"
            fill={earColor || '#F472B6'}
          />

          {/* Mouth :3 */}
          <path
            d="M 94 80 Q 97 84 100 80 Q 103 84 106 80"
            fill="none"
            stroke="#5C4538"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Whiskers */}
          <g stroke="#5C4538" strokeWidth="1.2" strokeLinecap="round" opacity="0.45">
            <line x1="82" y1="76" x2="54" y2="72" />
            <line x1="81" y1="80" x2="52" y2="80" />
            <line x1="82" y1="84" x2="55" y2="88" />
            <line x1="118" y1="76" x2="146" y2="72" />
            <line x1="119" y1="80" x2="148" y2="80" />
            <line x1="118" y1="84" x2="145" y2="88" />
          </g>

          {/* Cheerful Blush */}
          {(isPetting || isEating || cat.happiness > 75) && (
            <g fill="#FB7185" opacity="0.4">
              <ellipse cx="78" cy="79" rx="6" ry="3.5" />
              <ellipse cx="122" cy="79" rx="6" ry="3.5" />
            </g>
          )}

          {/* EYES with Idle Blinking */}
          {isSleeping ? (
            <g stroke="#4A3B32" strokeWidth="2.2" strokeLinecap="round" fill="none">
              <path d="M 80 68 Q 87 74 94 68" />
              <path d="M 106 68 Q 113 74 120 68" />
            </g>
          ) : isPetting || isEating ? (
            <g stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 78 70 Q 86 63 94 70" />
              <path d="M 106 70 Q 114 63 122 70" />
            </g>
          ) : (
            <g className="animate-blink">
              {/* Left Eye */}
              <circle cx="85" cy="67" r="8.5" fill={eyeColor} />
              <circle cx="85.5" cy="67" r="5.5" fill="#292524" />
              <circle cx="83" cy="64.5" r="2.8" fill="#FFFFFF" />
              <circle cx="87.5" cy="69" r="1.2" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="115" cy="67" r="8.5" fill={eyeColor} />
              <circle cx="114.5" cy="67" r="5.5" fill="#292524" />
              <circle cx="112.5" cy="64.5" r="2.8" fill="#FFFFFF" />
              <circle cx="117" cy="69" r="1.2" fill="#FFFFFF" />
            </g>
          )}

          {/* Eating Food Morsel particles */}
          {isEating && (
            <g fill="#EA580C">
              <circle cx="94" cy="88" r="2" />
              <circle cx="106" cy="89" r="1.8" />
              <circle cx="100" cy="92" r="2.2" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
