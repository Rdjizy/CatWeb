/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, RotateCw, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface LandscapeNoticeProps {
  isLandscape: boolean;
  onLockLandscape: () => Promise<boolean>;
}

export const LandscapeNotice: React.FC<LandscapeNoticeProps> = ({
  isLandscape,
  onLockLandscape,
}) => {
  const [dismissed, setDismissed] = useState(false);

  // Only display if user is in portrait mode and haven't dismissed it
  if (isLandscape || dismissed) {
    return null;
  }

  const handleRotate = async () => {
    sound.playPetChime(1);
    await onLockLandscape();
    setDismissed(true);
  };

  return (
    <aside
      aria-label="Landscape Recommendation"
      className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-45 max-w-sm bg-stone-900/90 text-white backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center gap-3 animate-fade-in select-none"
    >
      <div className="relative w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
        <Smartphone className="w-5 h-5 animate-pulse" />
        <RotateCw className="w-3.5 h-3.5 absolute -top-1 -right-1 text-rose-300 animate-spin" style={{ animationDuration: '4s' }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold font-cozy text-amber-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Landscape Recommended!
        </div>
        <p className="text-[11px] text-stone-300 leading-tight mt-0.5">
          Turn your device sideways for the full cozy sanctuary view.
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleRotate}
          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-900 font-bold font-cozy text-xs transition-transform cursor-pointer shadow-xs"
        >
          Rotate
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
