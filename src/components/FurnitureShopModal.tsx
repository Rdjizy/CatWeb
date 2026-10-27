/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HOUSE_UPGRADES, UPGRADE_TIER_NAMES } from '../data/gameData';
import { HouseUpgrade, UpgradeCategory } from '../types/cat';
import { X, Sparkles, Coins, Check, ArrowUpRight, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface FurnitureShopModalProps {
  playerCoins: number;
  upgrades: Record<string, number>;
  onBuyUpgrade: (upgradeId: string, cost: number, newTier: number) => void;
  onClose: () => void;
}

export const FurnitureShopModal: React.FC<FurnitureShopModalProps> = ({
  playerCoins,
  upgrades,
  onBuyUpgrade,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'bed', label: 'Beds' },
    { id: 'scratcher', label: 'Scratchers' },
    { id: 'window', label: 'Windows' },
    { id: 'plants', label: 'Plants' },
    { id: 'toys', label: 'Toys' },
    { id: 'room', label: 'Room Expansion' },
    { id: 'rug', label: 'Cozy Rugs' },
    { id: 'fireplace', label: 'Hearth' },
  ];

  const filteredItems = HOUSE_UPGRADES.filter((u) => {
    if (selectedCategory === 'all') return true;
    return u.category === selectedCategory;
  });

  const handlePurchase = (upgrade: HouseUpgrade) => {
    const currentTier = upgrades[upgrade.id] || 0;
    if (currentTier >= upgrade.maxTier) return;

    const nextTier = currentTier + 1;
    // Scaled price for higher tiers
    const cost = Math.round(upgrade.cost * Math.pow(1.8, currentTier));

    if (playerCoins < cost) return;

    sound.playKittenHatch();
    onBuyUpgrade(upgrade.id, cost, nextTier);

    const tierName = UPGRADE_TIER_NAMES[upgrade.id]?.[nextTier - 1] || upgrade.name;
    setPurchaseToast(`Added "${tierName}" to your room!`);

    setTimeout(() => {
      setPurchaseToast(null);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#FCFBF8] rounded-3xl shadow-2xl border border-amber-200/60 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50/80 via-emerald-50/40 to-stone-50 border-b border-stone-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-xs">
              <Home className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-cozy text-xl sm:text-2xl font-bold text-stone-800">
                Sanctuary Workshop & Decor
              </h3>
              <p className="text-xs text-stone-500">
                Upgrade beds, perches, plants, and rooms. Generates passive coins and brings joy!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/70 border border-amber-200 rounded-full font-cozy font-bold text-amber-900 text-sm">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="tabular-nums">{playerCoins}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Purchase Toast */}
        {purchaseToast && (
          <div className="bg-emerald-600 text-white text-center py-2 px-4 text-sm font-cozy font-bold flex items-center justify-center gap-2 shadow-inner">
            <Sparkles className="w-4 h-4" />
            <span>{purchaseToast}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="px-6 py-2.5 bg-stone-50/60 border-b border-stone-200/40 flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Upgrades Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {filteredItems.map((upgrade) => {
            const currentTier = upgrades[upgrade.id] || 0;
            const isMaxed = currentTier >= upgrade.maxTier;
            const nextTier = currentTier + 1;
            const nextCost = Math.round(upgrade.cost * Math.pow(1.8, currentTier));
            const canAfford = playerCoins >= nextCost;

            const currentTierTitle =
              currentTier > 0
                ? UPGRADE_TIER_NAMES[upgrade.id]?.[currentTier - 1] || `Tier ${currentTier}`
                : 'Not Yet Furnished';

            const nextTierTitle =
              !isMaxed && UPGRADE_TIER_NAMES[upgrade.id]?.[nextTier - 1]
                ? UPGRADE_TIER_NAMES[upgrade.id][nextTier - 1]
                : null;

            return (
              <div
                key={upgrade.id}
                className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-cozy font-bold text-stone-800 text-base">
                      {upgrade.name}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      Tier {currentTier}/{upgrade.maxTier}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mb-2 leading-relaxed">
                    {upgrade.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50 mb-3 text-[11px] space-y-1">
                    <div className="text-stone-700">
                      <strong>Current:</strong> {currentTierTitle}
                    </div>
                    {nextTierTitle && (
                      <div className="text-amber-800 font-medium">
                        <strong>Next Upgrade:</strong> {nextTierTitle}
                      </div>
                    )}
                    <div className="text-emerald-700 font-medium flex items-center gap-1 pt-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>
                        Passive income: +{(upgrade.passiveCoinsPerSec * (currentTier || 1)).toFixed(1)} coins/sec
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purchase / Upgrade Button */}
                {isMaxed ? (
                  <div className="w-full py-2 px-3 rounded-xl bg-stone-100 text-stone-500 text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Fully Upgraded</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(upgrade)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-3 rounded-xl font-cozy text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-[0.98]'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {currentTier === 0 ? 'Buy' : 'Upgrade'} for {nextCost} coins
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
