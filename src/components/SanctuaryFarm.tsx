/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cat, FarmCrop, FarmPlot } from '../types/cat';
import { FARM_CROPS } from '../data/gameData';
import { CatSvg } from './CatSvg';
import { sound } from '../utils/audio';
import {
  Sprout,
  Droplets,
  Sparkles,
  Coins,
  Utensils,
  ShoppingBag,
  Heart,
  Clock,
  ArrowRight,
  Package,
  DoorOpen,
  Home,
} from 'lucide-react';

interface SanctuaryFarmProps {
  playerCoins: number;
  activeCat: Cat;
  farmPlots: FarmPlot[];
  inventory: Record<string, number>;
  onPlantSeed: (plotId: number, cropId: string, seedCost: number) => void;
  onWaterPlot: (plotId: number) => void;
  onHarvestPlot: (plotId: number, cropId: string) => void;
  onSellCrop: (cropId: string, quantity: number, earnings: number) => void;
  onFeedCropToCat: (cropId: string) => void;
  onNavigate?: (view: 'house' | 'bedroom' | 'farm') => void;
}

export const SanctuaryFarm: React.FC<SanctuaryFarmProps> = ({
  playerCoins,
  activeCat,
  farmPlots,
  inventory,
  onPlantSeed,
  onWaterPlot,
  onHarvestPlot,
  onSellCrop,
  onFeedCropToCat,
  onNavigate,
}) => {
  const [selectedPlotForPlanting, setSelectedPlotForPlanting] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'plots' | 'pantry' | 'market'>('plots');
  const [farmNotification, setFarmNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFarmNotification(msg);
    setTimeout(() => setFarmNotification(null), 2500);
  };

  const handleChooseCrop = (plotId: number, crop: FarmCrop) => {
    if (playerCoins < crop.seedCost) {
      showNotification(`Need ${crop.seedCost - playerCoins} more coins for ${crop.name} seeds.`);
      return;
    }
    sound.playPlantSound();
    onPlantSeed(plotId, crop.id, crop.seedCost);
    setSelectedPlotForPlanting(null);
    showNotification(`Planted ${crop.name}!`);
  };

  const handleWater = (plotId: number) => {
    sound.playWaterSound();
    onWaterPlot(plotId);
    showNotification('Watered plot! Crops are growing faster.');
  };

  const handleHarvest = (plot: FarmPlot) => {
    if (!plot.cropId) return;
    const crop = FARM_CROPS.find((c) => c.id === plot.cropId);
    sound.playHarvestSound();
    onHarvestPlot(plot.id, plot.cropId);
    showNotification(`Harvested fresh ${crop?.name || 'crop'}! Added to pantry.`);
  };

  const handleSell = (crop: FarmCrop, count: number) => {
    const totalEarnings = crop.sellPrice * count;
    sound.playCoinSound();
    onSellCrop(crop.id, count, totalEarnings);
    showNotification(`Sold ${count}x ${crop.name} for +${totalEarnings} coins!`);
  };

  const handleFeed = (crop: FarmCrop) => {
    sound.playFeedSound();
    onFeedCropToCat(crop.id);
    showNotification(`Fed fresh ${crop.name} to ${activeCat.name}!`);
  };

  const totalInventoryItems = Object.values(inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* --- TOP FARM MEADOW WITH 2nd IMAGE BACKGROUND --- */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden shadow-xl border border-amber-200/60 select-none">
        {/* Background Image (Attachment 2: image_9ff990f5.png) */}
        <img
          src="/assets/aistudio/image_9ff990f5.png"
          alt="Sanctuary Meadow Farm"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
        />

        {/* Soft morning sun warmth filter */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-amber-200/10 pointer-events-none" />

        {/* Friendly Cat playing in the meadow */}
        <div className="absolute bottom-[28%] right-[18%] sm:right-[22%] z-20 pointer-events-auto hover:scale-105 transition-transform">
          <CatSvg cat={activeCat} size="sm" expression="idle" />
        </div>

        {/* 6 Garden Soil Plots placed in the foreground pasture */}
        <div className="absolute bottom-4 inset-x-3 sm:inset-x-8 z-30 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {farmPlots.map((plot) => {
            const crop = FARM_CROPS.find((c) => c.id === plot.cropId);
            const now = Date.now();
            const elapsedSec = plot.plantedAt ? (now - plot.plantedAt) / 1000 : 0;
            const duration = crop ? (plot.isWatered ? crop.growDurationSec * 0.7 : crop.growDurationSec) : 1;
            const progress = crop ? Math.min(1, elapsedSec / duration) : 0;
            const isReady = crop && progress >= 1;
            const remainingSec = Math.max(0, Math.ceil(duration - elapsedSec));

            return (
              <div
                key={plot.id}
                className="bg-[#5C3D24]/90 backdrop-blur-xs rounded-2xl p-2 sm:p-2.5 border-2 border-[#8B5A2B] shadow-lg flex flex-col items-center justify-between min-h-[95px] text-center transition-all hover:border-amber-300"
              >
                {/* Soil Plot Header */}
                <div className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">
                  Plot #{plot.id}
                </div>

                {/* Plot State Rendering */}
                {!crop ? (
                  <div className="my-auto">
                    <button
                      onClick={() => setSelectedPlotForPlanting(plot.id)}
                      className="px-2 py-1 rounded-xl bg-amber-400/90 hover:bg-amber-400 text-stone-900 text-[11px] font-bold shadow-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Sprout className="w-3.5 h-3.5 text-stone-900" />
                      <span>Plant</span>
                    </button>
                  </div>
                ) : isReady ? (
                  <div className="my-auto flex flex-col items-center animate-bounce">
                    <span className="text-2xl drop-shadow">{crop.icon}</span>
                    <button
                      onClick={() => handleHarvest(plot)}
                      className="mt-1 px-2.5 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-cozy text-[10px] font-bold shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      Harvest!
                    </button>
                  </div>
                ) : (
                  <div className="w-full my-auto flex flex-col items-center">
                    <span className="text-xl mb-0.5 animate-pulse opacity-90">{crop.icon}</span>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-stone-900/60 rounded-full overflow-hidden border border-amber-700/50 my-1">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-1000"
                        style={{ width: `${Math.round(progress * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between w-full text-[9px] text-amber-100/90 px-0.5">
                      <span className="tabular-nums font-mono">{remainingSec}s</span>
                      {!plot.isWatered && (
                        <button
                          onClick={() => handleWater(plot.id)}
                          title="Water to speed up by 30%!"
                          className="p-1 bg-sky-500/80 hover:bg-sky-500 text-white rounded-md transition-colors cursor-pointer"
                        >
                          <Droplets className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Farm Hint / Header */}
        <div className="absolute top-3 left-4 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-stone-200 text-xs text-stone-700 shadow-sm font-medium">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pasture Farm · Grow Organic Food & Herbs</span>
          </div>
        </div>

        {/* Interactive Farm Gates / House Return Doors */}
        {onNavigate && (
          <div className="absolute top-3 right-4 z-25 flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPetChime(1);
                onNavigate('house');
              }}
              className="px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-stone-800 backdrop-blur-sm shadow-md border border-amber-300 font-cozy text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:shadow-lg"
              title="Return to Living Room"
            >
              <Home className="w-3.5 h-3.5 text-rose-500" />
              <span>Living Room</span>
            </button>
            <button
              onClick={() => {
                sound.playPetChime(1);
                onNavigate('bedroom');
              }}
              className="px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-stone-800 backdrop-blur-sm shadow-md border border-amber-300 font-cozy text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:shadow-lg"
              title="Go to Cat Bedroom"
            >
              <DoorOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Bedroom</span>
            </button>
          </div>
        )}

        {/* Seed Selector Modal if a plot is tapped */}
        {selectedPlotForPlanting !== null && (
          <div className="absolute inset-0 z-40 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
            <div className="bg-[#FCFBF8] rounded-3xl p-5 max-w-md w-full border border-amber-200 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-cozy font-bold text-stone-800 text-base flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Choose Seeds for Plot #{selectedPlotForPlanting}</span>
                </h4>
                <button
                  onClick={() => setSelectedPlotForPlanting(null)}
                  className="text-stone-400 hover:text-stone-700 p-1 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {FARM_CROPS.map((crop) => {
                  const canAfford = playerCoins >= crop.seedCost;
                  return (
                    <div
                      key={crop.id}
                      onClick={() => handleChooseCrop(selectedPlotForPlanting, crop)}
                      className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        canAfford
                          ? 'bg-white hover:bg-amber-50/80 border-stone-200 hover:border-amber-300'
                          : 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{crop.icon}</span>
                        <div>
                          <div className="font-cozy font-bold text-stone-800 text-sm">
                            {crop.name}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Grows in {crop.growDurationSec}s · Sells for {crop.sellPrice} coins
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs shrink-0">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>{crop.seedCost}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- FARM NOTIFICATION TOAST --- */}
      {farmNotification && (
        <div className="bg-emerald-600 text-white text-center py-2 px-4 rounded-2xl text-xs sm:text-sm font-cozy font-bold shadow-md animate-fade-in flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{farmNotification}</span>
        </div>
      )}

      {/* --- FARM LOWER HUB (Crop Pantry & Market Stand) --- */}
      <div className="bg-white/90 rounded-3xl p-5 sm:p-6 shadow-md border border-stone-200/80">
        {/* Hub Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('plots')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'plots'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Planting Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('pantry')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'pantry'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Utensils className="w-4 h-4 text-rose-600" />
              <span>Feed Cat with Crops ({totalInventoryItems})</span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'market'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Sell at Farm Stand</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PLANTING GUIDE */}
        {activeTab === 'plots' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {FARM_CROPS.map((crop) => (
              <div
                key={crop.id}
                className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3"
              >
                <span className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-stone-200">
                  {crop.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-cozy font-bold text-stone-800 text-sm">{crop.name}</div>
                  <p className="text-[11px] text-stone-500 mb-1.5 line-clamp-2">
                    {crop.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-stone-600 font-medium">
                    <span>Seed: <strong>{crop.seedCost} coins</strong></span>
                    <span>·</span>
                    <span>Sells: <strong className="text-emerald-700">+{crop.sellPrice} coins</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CROP PANTRY & FEEDING */}
        {activeTab === 'pantry' && (
          <div className="space-y-3">
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-400 shrink-0" />
              <span>
                Feeding organic farm harvests directly to <strong>{activeCat.name}</strong> restores massive fullness and happiness!
              </span>
            </div>

            {totalInventoryItems === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs space-y-1">
                <Package className="w-8 h-8 mx-auto opacity-50 mb-1 text-stone-400" />
                <p>Your crop pantry is empty.</p>
                <p>Harvest crops from the farm above to feed your cats fresh home-grown treats!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FARM_CROPS.map((crop) => {
                  const count = inventory[crop.id] || 0;
                  if (count <= 0) return null;

                  return (
                    <div
                      key={crop.id}
                      className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{crop.icon}</span>
                        <div>
                          <div className="font-cozy font-bold text-stone-800 text-sm">
                            {crop.name} <span className="text-xs text-rose-600 font-bold">x{count}</span>
                          </div>
                          <div className="text-[11px] text-emerald-700">
                            +{crop.hungerRestore}% Food · +{crop.happinessRestore}% Joy
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleFeed(crop)}
                        className="py-1.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-cozy text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Feed 1</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FARM MARKET STAND (Selling crops for coins) */}
        {activeTab === 'market' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Sell your farm bounty to traveling merchants for instant coins to buy room upgrades and adopt rare cats!
              </span>
            </div>

            {totalInventoryItems === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs space-y-1">
                <ShoppingBag className="w-8 h-8 mx-auto opacity-50 mb-1 text-stone-400" />
                <p>No crops ready for sale.</p>
                <p>Plant and harvest crops above to stock up your farm market stand!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FARM_CROPS.map((crop) => {
                  const count = inventory[crop.id] || 0;
                  if (count <= 0) return null;

                  return (
                    <div
                      key={crop.id}
                      className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{crop.icon}</span>
                        <div>
                          <div className="font-cozy font-bold text-stone-800 text-sm">
                            {crop.name} <span className="text-xs text-amber-700 font-bold">x{count}</span>
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Price: <strong>{crop.sellPrice} coins each</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSell(crop, 1)}
                          className="py-1 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-cozy text-xs font-bold border border-amber-300 transition-colors cursor-pointer"
                        >
                          Sell 1 (+{crop.sellPrice})
                        </button>
                        {count > 1 && (
                          <button
                            onClick={() => handleSell(crop, count)}
                            className="py-1 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-cozy text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            Sell All (+{crop.sellPrice * count})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
