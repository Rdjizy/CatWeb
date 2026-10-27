/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoomCustomization } from '../types/cat';
import { CartoonCatBed, CartoonCatTree, CartoonRug } from './CartoonFurniture';
import { sound } from '../utils/audio';
import { X, Sparkles, Check, Palette, Home, Moon, Sun } from 'lucide-react';

interface RoomDecorModalProps {
  decor: RoomCustomization;
  onSaveDecor: (newDecor: RoomCustomization) => void;
  onClose: () => void;
}

const BED_COLORS = [
  { name: 'Pastel Rose', hex: '#FBCFE8' },
  { name: 'Sky Aqua', hex: '#BAE6FD' },
  { name: 'Honey Amber', hex: '#FDE68A' },
  { name: 'Mint Green', hex: '#A7F3D0' },
  { name: 'Soft Lavender', hex: '#E9D5FF' },
  { name: 'Mocha Brown', hex: '#D7B998' },
];

const RUG_COLORS = [
  { name: 'Sunrise Gold', hex: '#FDE68A' },
  { name: 'Cloud White', hex: '#F0F9FF' },
  { name: 'Coral Rose', hex: '#FCA5A5' },
  { name: 'Fresh Mint', hex: '#BBF7D0' },
  { name: 'Lavender Mist', hex: '#DDD6FE' },
];

export const RoomDecorModal: React.FC<RoomDecorModalProps> = ({
  decor,
  onSaveDecor,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bed' | 'tree' | 'rug' | 'lights'>('bed');
  const [tempDecor, setTempDecor] = useState<RoomCustomization>({ ...decor });

  const handleApply = () => {
    sound.playKittenHatch();
    onSaveDecor(tempDecor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-[#FCFBF8] rounded-3xl shadow-2xl border border-amber-200/80 flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 via-rose-50 to-stone-50 border-b border-stone-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-cozy text-xl sm:text-2xl font-bold text-stone-800">
                Customize Furniture & Room Decor
              </h3>
              <p className="text-xs text-stone-500">
                Pick your favorite cartoon beds, climbing trees, rugs, and ambient lights!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-2.5 bg-stone-50/80 border-b border-stone-200/50 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'bed', label: '🛏️ Cat Beds' },
            { id: 'tree', label: '🌳 Climbing Trees' },
            { id: 'rug', label: '🌸 Cozy Rugs' },
            { id: 'lights', label: '💡 Cozy Lighting' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                sound.playPetChime(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold font-cozy whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: CAT BEDS */}
          {activeTab === 'bed' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-700 block">
                Choose Cat Bed Style:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'donut', name: 'Velvet Donut' },
                  { id: 'cloud', name: 'Cartoon Cloud' },
                  { id: 'canopy', name: 'Royal Canopy' },
                  { id: 'strawberry', name: 'Strawberry Tart' },
                  { id: 'wicker', name: 'Wicker Plaid' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setTempDecor((prev) => ({ ...prev, bedStyle: s.id as any }));
                      sound.playCutePetSound();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                      tempDecor.bedStyle === s.id
                        ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="w-24 h-16 flex items-center justify-center mb-1">
                      <CartoonCatBed decor={{ ...tempDecor, bedStyle: s.id as any }} />
                    </div>
                    <span className="font-cozy font-bold text-xs text-stone-800">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bed Color Palette */}
              <div className="pt-2">
                <span className="text-xs font-bold text-stone-700 block mb-2">
                  Bed Cushion Color:
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {BED_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setTempDecor((prev) => ({ ...prev, bedColor: c.hex }));
                        sound.playPetChime(2);
                      }}
                      className={`w-9 h-9 rounded-full shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center ${
                        tempDecor.bedColor === c.hex
                          ? 'border-rose-500 scale-110 ring-2 ring-rose-300 shadow-sm'
                          : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {tempDecor.bedColor === c.hex && <Check className="w-4 h-4 text-stone-800" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAT CLIMBING TREES */}
          {activeTab === 'tree' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-700 block">
                Choose Cat Climbing Tree & Scratcher:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'condo', name: 'Pastel Cat Condo' },
                  { id: 'castle', name: 'Stone Castle Tower' },
                  { id: 'birch', name: 'Fairytale Birch Tree' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setTempDecor((prev) => ({ ...prev, catTreeStyle: s.id as any }));
                      sound.playCutePetSound();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                      tempDecor.catTreeStyle === s.id
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="w-20 h-28 flex items-center justify-center mb-1">
                      <CartoonCatTree decor={{ ...tempDecor, catTreeStyle: s.id as any }} />
                    </div>
                    <span className="font-cozy font-bold text-xs text-stone-800">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COZY RUGS */}
          {activeTab === 'rug' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-700 block">
                Choose Cozy Room Rug:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'mandala', name: 'Sunrise Mandala Rug' },
                  { id: 'cloud', name: 'Fluffy Cloud Rug' },
                  { id: 'daisy', name: 'Daisy Blossom Rug' },
                  { id: 'plaid', name: 'Warm Plaid Rug' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setTempDecor((prev) => ({ ...prev, rugStyle: s.id as any }));
                      sound.playPetChime(1);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                      tempDecor.rugStyle === s.id
                        ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="w-32 h-16 flex items-center justify-center mb-1">
                      <CartoonRug decor={{ ...tempDecor, rugStyle: s.id as any }} />
                    </div>
                    <span className="font-cozy font-bold text-xs text-stone-800">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rug Color Palette */}
              <div className="pt-2">
                <span className="text-xs font-bold text-stone-700 block mb-2">
                  Rug Accent Color:
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {RUG_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setTempDecor((prev) => ({ ...prev, rugColor: c.hex }));
                        sound.playPetChime(2);
                      }}
                      className={`w-9 h-9 rounded-full shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center ${
                        tempDecor.rugColor === c.hex
                          ? 'border-amber-500 scale-110 ring-2 ring-amber-300 shadow-sm'
                          : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {tempDecor.rugColor === c.hex && <Check className="w-4 h-4 text-stone-800" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIGHTING & CURTAINS */}
          {activeTab === 'lights' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="font-cozy font-bold text-stone-800 text-sm">
                    Fairy String Lights & Night Glow
                  </h4>
                  <p className="text-xs text-stone-500">
                    Cast a warm, sleepy evening glow over the room.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTempDecor((prev) => ({ ...prev, isLampOn: !prev.isLampOn }));
                    sound.playPetChime(3);
                  }}
                  className={`px-4 py-2 rounded-xl font-cozy text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    tempDecor.isLampOn
                      ? 'bg-amber-400 text-stone-900 shadow-sm'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {tempDecor.isLampOn ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{tempDecor.isLampOn ? 'Warm Glow ON' : 'Daylight OFF'}</span>
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="font-cozy font-bold text-stone-800 text-sm">
                    Window Sheer Curtains
                  </h4>
                  <p className="text-xs text-stone-500">
                    Draw sheer curtains to soften direct sunlight.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTempDecor((prev) => ({ ...prev, isCurtainOpen: !prev.isCurtainOpen }));
                    sound.playPetChime(2);
                  }}
                  className={`px-4 py-2 rounded-xl font-cozy text-xs font-bold transition-all cursor-pointer ${
                    tempDecor.isCurtainOpen
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  <span>{tempDecor.isCurtainOpen ? 'Curtains Open' : 'Curtains Drawn'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Confirmation */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-cozy text-xs font-bold shadow-md hover:from-rose-600 hover:to-amber-600 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Furniture to House</span>
          </button>
        </div>
      </div>
    </div>
  );
};
