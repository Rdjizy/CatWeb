/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, CloudRain, Flame, RotateCcw, Heart, Palette, Sliders } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  herName: string;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  idleSoundsEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'fireplace';
  masterVolume: number;
  onUpdateSettings: (settings: {
    herName?: string;
    musicEnabled?: boolean;
    sfxEnabled?: boolean;
    idleSoundsEnabled?: boolean;
    ambientSound?: 'none' | 'rain' | 'fireplace';
    masterVolume?: number;
  }) => void;
  onOpenCustomizer?: () => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  herName,
  musicEnabled,
  sfxEnabled,
  idleSoundsEnabled,
  ambientSound,
  masterVolume,
  onUpdateSettings,
  onOpenCustomizer,
  onResetGame,
  onClose,
}) => {
  const [name, setName] = useState(herName);
  const [volume, setVolume] = useState(masterVolume ?? 0.85);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleMusic = () => {
    const next = !musicEnabled;
    sound.toggleMusic(next);
    onUpdateSettings({ musicEnabled: next });
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    sound.sfxEnabled = next;
    onUpdateSettings({ sfxEnabled: next });
  };

  const handleToggleIdleSounds = () => {
    const next = !idleSoundsEnabled;
    onUpdateSettings({ idleSoundsEnabled: next });
  };

  const handleSetAmbient = (type: 'none' | 'rain' | 'fireplace') => {
    sound.setAmbient(type);
    onUpdateSettings({ ambientSound: type });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setMasterVolume(val);
    onUpdateSettings({ masterVolume: val });
  };

  const handleSaveName = () => {
    if (name.trim()) {
      onUpdateSettings({ herName: name.trim() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#FCFBF8] rounded-3xl shadow-2xl border border-amber-200/60 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50/80 to-stone-50 border-b border-stone-200/60 flex items-center justify-between">
          <h3 className="font-cozy text-xl font-bold text-stone-800">
            Sanctuary Atmosphere & Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Dedication Name Personalization */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
              <span>Dedicated To:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 outline-none focus:border-rose-400"
              />
              <button
                onClick={handleSaveName}
                className="py-2 px-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>

          {/* Master Volume Slider (Louder Sound as requested!) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Master Ambience & Sound Volume</span>
              </span>
              <span className="tabular-nums font-mono text-amber-900">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
          </div>

          {/* Sound Controls */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Sound & Peaceful Ambience
            </h4>

            {/* Background Lullaby Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="text-xs font-bold text-stone-800">Background Lullaby</div>
                  <div className="text-[10px] text-stone-500">Calming generative piano chords</div>
                </div>
              </div>
              <button
                onClick={handleToggleMusic}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  musicEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                }`}
              >
                {musicEnabled ? 'Playing' : 'Muted'}
              </button>
            </div>

            {/* SFX Purrs & Meows Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-stone-800">Pet & Interaction Noises</div>
                  <div className="text-[10px] text-stone-500">Cute purrs, squeaks, and chirps</div>
                </div>
              </div>
              <button
                onClick={handleToggleSfx}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sfxEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                }`}
              >
                {sfxEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            {/* Idle Cat Sounds Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="text-xs font-bold text-stone-800">Periodic Idle Cat Chirps</div>
                  <div className="text-[10px] text-stone-500">Soft sleepy purrs while you relax</div>
                </div>
              </div>
              <button
                onClick={handleToggleIdleSounds}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  idleSoundsEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                }`}
              >
                {idleSoundsEnabled ? 'Active' : 'Muted'}
              </button>
            </div>

            {/* Ambient Nature Soundscapes */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-stone-600">Louder Ambience Soundscape:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSetAmbient('none')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    ambientSound === 'none'
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  None
                </button>
                <button
                  onClick={() => handleSetAmbient('rain')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    ambientSound === 'rain'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Soft Rain</span>
                </button>
                <button
                  onClick={() => handleSetAmbient('fireplace')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    ambientSound === 'fireplace'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Fireplace</span>
                </button>
              </div>
            </div>
          </div>

          {/* Open Cat Customizer button */}
          {onOpenCustomizer && (
            <div className="pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenCustomizer();
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-100 to-amber-100 hover:from-rose-200 hover:to-amber-200 text-stone-800 font-cozy text-xs font-bold border border-rose-200/80 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Palette className="w-4 h-4 text-rose-600" />
                <span>Customize Active Cat (Coat, Eyes, Ears)</span>
              </button>
            </div>
          )}

          {/* Reset Save Data */}
          <div className="pt-2 border-t border-stone-200/60">
            {showConfirmReset ? (
              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-center space-y-2">
                <p className="text-xs text-rose-800 font-medium">
                  Are you sure you want to start a brand new sanctuary?
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      onResetGame();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="py-1 px-3 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="py-1 px-3 bg-stone-200 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2 text-stone-400 hover:text-rose-600 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset sanctuary progress</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
