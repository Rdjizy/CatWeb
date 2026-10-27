/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat } from '../types/cat';
import { CatSvg } from './CatSvg';
import { X, Heart, Utensils, Award, Sparkles, Check, Edit2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface CatCollectionModalProps {
  cats: Cat[];
  activeCatId: string;
  onSelectActiveCat: (catId: string) => void;
  onRenameCat: (catId: string, newName: string) => void;
  onClose: () => void;
}

export const CatCollectionModal: React.FC<CatCollectionModalProps> = ({
  cats,
  activeCatId,
  onSelectActiveCat,
  onRenameCat,
  onClose,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartRename = (cat: Cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveRename = (catId: string) => {
    if (editName.trim()) {
      onRenameCat(catId, editName.trim());
    }
    setEditingId(null);
  };

  const handleSwitchCat = (id: string) => {
    sound.playPetChime(3);
    sound.playMeow(1.0);
    onSelectActiveCat(id);
  };

  const totalPets = cats.reduce((sum, c) => sum + c.totalPets, 0);
  const avgHappiness = Math.round(
    cats.reduce((sum, c) => sum + c.happiness, 0) / (cats.length || 1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FCFBF8] rounded-3xl shadow-2xl border border-amber-200/60 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50/80 via-amber-50/50 to-stone-50 border-b border-stone-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-cozy text-xl sm:text-2xl font-bold text-stone-800">
                Cat Family Album & Collection
              </h3>
              <p className="text-xs text-stone-500">
                View all your cherished companions, their unique personalities, and life stats.
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

        {/* Sanctuary Summary Banner */}
        <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-200/50 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-stone-500">Family Members: </span>
              <strong className="text-stone-800 font-bold tabular-nums">{cats.length} cats</strong>
            </div>
            <div>
              <span className="text-stone-500">Average Happiness: </span>
              <strong className="text-rose-600 font-bold tabular-nums">{avgHappiness}%</strong>
            </div>
            <div>
              <span className="text-stone-500">Total Tender Cuddles: </span>
              <strong className="text-amber-800 font-bold tabular-nums">{totalPets}</strong>
            </div>
          </div>
        </div>

        {/* Cats Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {cats.map((cat) => {
            const isActive = cat.id === activeCatId;
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className={`rounded-2xl p-4 border transition-all ${
                  isActive
                    ? 'bg-rose-50/40 border-rose-300 shadow-sm'
                    : 'bg-white border-stone-200/80 shadow-xs hover:border-amber-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Cat Visual Avatar */}
                  <div className="w-24 h-24 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-center shrink-0 p-1">
                    <CatSvg cat={cat} size="sm" showShadow={false} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            maxLength={16}
                            className="text-sm font-bold bg-amber-50 border border-amber-300 rounded px-1.5 py-0.5 outline-none w-28"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(cat.id)}
                            className="p-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-cozy font-bold text-stone-800 text-base truncate">
                            {cat.name}
                          </h4>
                          <button
                            onClick={() => handleStartRename(cat)}
                            className="text-stone-400 hover:text-stone-700 p-0.5"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 capitalize">
                        {cat.rarity}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 mb-1">
                      {cat.breed} {cat.isKitten && '· (Kitten)'}
                    </p>
                    <p className="text-[11px] text-amber-800 italic mb-2">
                      Trait: {cat.personality}
                    </p>

                    {/* Needs Progress Bars */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-600 mb-3">
                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Fullness</span>
                          <span className="tabular-nums font-semibold">{Math.round(cat.hunger)}%</span>
                        </div>
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${cat.hunger}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Happiness</span>
                          <span className="tabular-nums font-semibold">{Math.round(cat.happiness)}%</span>
                        </div>
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-400 rounded-full"
                            style={{ width: `${cat.happiness}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    {isActive ? (
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 py-1 px-3 bg-rose-100/70 rounded-xl border border-rose-200">
                        <Heart className="w-3 h-3 fill-rose-500" />
                        <span>Active Room Companion</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSwitchCat(cat.id)}
                        className="py-1 px-3 bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-800 rounded-xl text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
                      >
                        Bring to Center
                      </button>
                    )}
                  </div>
                </div>

                {/* Pedigree / Lineage note */}
                {cat.parents && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 text-[10px] text-stone-600 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>
                      Born in Sanctuary to <strong>{cat.parents[0]}</strong> & <strong>{cat.parents[1]}</strong>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
