/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cat, GameState, RoomCustomization } from './types/cat';
import { INITIAL_CAT, HOUSE_UPGRADES, DEFAULT_FARM_PLOTS, DEFAULT_ROOM_DECOR } from './data/gameData';
import { sound } from './utils/audio';
import { IntroScreen } from './components/IntroScreen';
import { SanctuaryRoom } from './components/SanctuaryRoom';
import { SanctuaryBedroom } from './components/SanctuaryBedroom';
import { SanctuaryFarm } from './components/SanctuaryFarm';
import { TabletopMemoryView } from './components/TabletopMemoryView';
import { RoomDecorModal } from './components/RoomDecorModal';
import { CatCarePanel } from './components/CatCarePanel';
import { EggHatchModal } from './components/EggHatchModal';
import { FurnitureShopModal } from './components/FurnitureShopModal';
import { BreedingModal } from './components/BreedingModal';
import { CatCollectionModal } from './components/CatCollectionModal';
import { SettingsModal } from './components/SettingsModal';
import { CatCustomizer } from './components/CatCustomizer';
import {
  Heart,
  Coins,
  Sparkles,
  BookOpen,
  Settings,
  Volume2,
  VolumeX,
  Music,
  Sprout,
  Palette,
  X,
  Home,
  Egg,
  BedDouble,
  Paintbrush,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'purrfect_haven_save_v4';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          herName: parsed.herName || 'Sweetheart',
          hasSeenIntro: parsed.hasSeenIntro ?? false,
          coins: parsed.coins ?? 65,
          totalCoinsEarned: parsed.totalCoinsEarned ?? 65,
          cats: parsed.cats?.length ? parsed.cats : [INITIAL_CAT],
          activeCatId: parsed.activeCatId || INITIAL_CAT.id,
          upgrades: parsed.upgrades || {},
          roomDecor: parsed.roomDecor || DEFAULT_ROOM_DECOR,
          farmPlots: parsed.farmPlots?.length ? parsed.farmPlots : DEFAULT_FARM_PLOTS,
          inventory: parsed.inventory || { crop_catnip: 2 },
          musicEnabled: parsed.musicEnabled ?? true,
          sfxEnabled: parsed.sfxEnabled ?? true,
          idleSoundsEnabled: parsed.idleSoundsEnabled ?? true,
          ambientSound: parsed.ambientSound || 'rain',
          masterVolume: parsed.masterVolume ?? 0.75,
          lastSaveTimestamp: Date.now(),
        };
      }
    } catch {
      // fallback
    }

    return {
      herName: 'Sweetheart',
      hasSeenIntro: false,
      coins: 65,
      totalCoinsEarned: 65,
      cats: [INITIAL_CAT],
      activeCatId: INITIAL_CAT.id,
      upgrades: {},
      roomDecor: DEFAULT_ROOM_DECOR,
      farmPlots: DEFAULT_FARM_PLOTS,
      inventory: { crop_catnip: 2 },
      musicEnabled: true,
      sfxEnabled: true,
      idleSoundsEnabled: true,
      ambientSound: 'rain',
      masterVolume: 0.75,
      lastSaveTimestamp: Date.now(),
    };
  });

  const [currentView, setCurrentView] = useState<'house' | 'bedroom' | 'farm' | 'tabletop'>('house');
  const [activeExpression, setActiveExpression] = useState<'idle' | 'petting' | 'eating' | 'sleeping'>('idle');
  const [isFeeding, setIsFeeding] = useState(false);
  const [isPetting, setIsPetting] = useState(false);

  const [activeModal, setActiveModal] = useState<
    'none' | 'shop' | 'furniture' | 'breeding' | 'collection' | 'settings' | 'customizer' | 'room_decor'
  >('none');

  const [offlineToast, setOfflineToast] = useState<{ coins: number } | null>(null);

  // Audio settings sync
  useEffect(() => {
    sound.musicEnabled = gameState.musicEnabled;
    sound.sfxEnabled = gameState.sfxEnabled;
    sound.setMasterVolume(gameState.masterVolume);
    if (gameState.hasSeenIntro) {
      sound.setAmbient(gameState.ambientSound);
    }
  }, [gameState.musicEnabled, gameState.sfxEnabled, gameState.masterVolume, gameState.ambientSound, gameState.hasSeenIntro]);

  // Offline passive earnings
  useEffect(() => {
    if (!gameState.hasSeenIntro) return;

    const now = Date.now();
    const elapsedSeconds = Math.min(86400, Math.floor((now - gameState.lastSaveTimestamp) / 1000));

    if (elapsedSeconds > 10) {
      let passivePerSec = 0.15;
      Object.entries(gameState.upgrades).forEach(([upgradeId, tier]) => {
        const up = HOUSE_UPGRADES.find((u) => u.id === upgradeId);
        if (up && tier > 0) {
          passivePerSec += up.passiveCoinsPerSec * tier;
        }
      });

      const earned = Math.floor(elapsedSeconds * passivePerSec);
      if (earned > 0) {
        setGameState((prev) => ({
          ...prev,
          coins: prev.coins + earned,
          totalCoinsEarned: prev.totalCoinsEarned + earned,
          lastSaveTimestamp: now,
        }));
        setOfflineToast({ coins: earned });
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch {
      // ignore
    }
  }, [gameState]);

  // Idle Cat Chirps & Purrs loop
  useEffect(() => {
    if (!gameState.hasSeenIntro || !gameState.idleSoundsEnabled) return;

    const interval = setInterval(() => {
      sound.playIdleCatSound();
    }, 24000);

    return () => clearInterval(interval);
  }, [gameState.hasSeenIntro, gameState.idleSoundsEnabled]);

  // Main 1s Game Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => {
        let passiveIncome = 0.15;
        let happinessBonus = 0;

        Object.entries(prev.upgrades).forEach(([upgradeId, tier]) => {
          const up = HOUSE_UPGRADES.find((u) => u.id === upgradeId);
          if (up && tier > 0) {
            passiveIncome += up.passiveCoinsPerSec * tier;
            happinessBonus += up.happinessDecayReduction * tier;
          }
        });

        const hungerDecay = Math.max(0.015, 0.05 - happinessBonus * 0.01);
        const happinessDecay = Math.max(0.01, 0.04 - happinessBonus * 0.01);

        const updatedCats = prev.cats.map((cat) => ({
          ...cat,
          hunger: Math.max(25, cat.hunger - hungerDecay),
          happiness: Math.max(30, cat.happiness - happinessDecay),
        }));

        return {
          ...prev,
          coins: Math.round((prev.coins + passiveIncome) * 100) / 100,
          totalCoinsEarned: prev.totalCoinsEarned + passiveIncome,
          cats: updatedCats,
          lastSaveTimestamp: Date.now(),
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeCat =
    gameState.cats.find((c) => c.id === gameState.activeCatId) ||
    gameState.cats[0] ||
    INITIAL_CAT;

  // Care Handlers
  const handleFeed = () => {
    if (isFeeding) return;
    setIsFeeding(true);
    setActiveExpression('eating');
    sound.playFeedSound();
    sound.playCoinSound();

    setGameState((prev) => {
      const updatedCats = prev.cats.map((c) => {
        if (c.id === activeCat.id) {
          return {
            ...c,
            hunger: Math.min(100, c.hunger + 25),
            happiness: Math.min(100, c.happiness + 8),
            totalMeals: c.totalMeals + 1,
          };
        }
        return c;
      });

      return {
        ...prev,
        coins: prev.coins + 3,
        totalCoinsEarned: prev.totalCoinsEarned + 3,
        cats: updatedCats,
      };
    });

    setTimeout(() => {
      setIsFeeding(false);
      setActiveExpression('idle');
    }, 1400);
  };

  const handlePet = (catId = activeCat.id) => {
    setActiveExpression('petting');

    setGameState((prev) => {
      const updatedCats = prev.cats.map((c) => {
        if (c.id === catId) {
          return {
            ...c,
            happiness: Math.min(100, c.happiness + 12),
            totalPets: c.totalPets + 1,
          };
        }
        return c;
      });

      return {
        ...prev,
        coins: prev.coins + 2,
        totalCoinsEarned: prev.totalCoinsEarned + 2,
        cats: updatedCats,
      };
    });

    setTimeout(() => {
      setActiveExpression('idle');
    }, 1200);
  };

  const handleBrush = () => {
    sound.playCutePetSound();
    setActiveExpression('petting');

    setGameState((prev) => {
      const updatedCats = prev.cats.map((c) => {
        if (c.id === activeCat.id) {
          return {
            ...c,
            happiness: Math.min(100, c.happiness + 20),
            totalPets: c.totalPets + 1,
          };
        }
        return c;
      });

      return {
        ...prev,
        coins: prev.coins + 4,
        totalCoinsEarned: prev.totalCoinsEarned + 4,
        cats: updatedCats,
      };
    });

    setTimeout(() => {
      setActiveExpression('idle');
    }, 1100);
  };

  const handleRenameCat = (catId: string, newName: string) => {
    setGameState((prev) => ({
      ...prev,
      cats: prev.cats.map((c) => (c.id === catId ? { ...c, name: newName } : c)),
    }));
  };

  const handleUpdateCat = (updatedCat: Cat) => {
    setGameState((prev) => ({
      ...prev,
      cats: prev.cats.map((c) => (c.id === updatedCat.id ? updatedCat : c)),
    }));
    setActiveModal('none');
  };

  const handleHatchCat = (newCat: Cat, price: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - price),
      cats: [...prev.cats, newCat],
      activeCatId: newCat.id,
    }));
  };

  const handleBuyUpgrade = (upgradeId: string, cost: number, newTier: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - cost),
      upgrades: {
        ...prev.upgrades,
        [upgradeId]: newTier,
      },
    }));
  };

  const handleKittenBorn = (newKitten: Cat, cost: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - cost),
      cats: [...prev.cats, newKitten],
      activeCatId: newKitten.id,
    }));
  };

  // Farm Handlers
  const handlePlantSeed = (plotId: number, cropId: string, seedCost: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - seedCost),
      farmPlots: prev.farmPlots.map((p) =>
        p.id === plotId
          ? { ...p, cropId, plantedAt: Date.now(), isWatered: false }
          : p
      ),
    }));
  };

  const handleWaterPlot = (plotId: number) => {
    setGameState((prev) => ({
      ...prev,
      farmPlots: prev.farmPlots.map((p) =>
        p.id === plotId ? { ...p, isWatered: true } : p
      ),
    }));
  };

  const handleHarvestPlot = (plotId: number, cropId: string) => {
    const yieldAmount = Math.random() < 0.25 ? 2 : 1;
    setGameState((prev) => ({
      ...prev,
      farmPlots: prev.farmPlots.map((p) =>
        p.id === plotId
          ? { ...p, cropId: null, plantedAt: null, isWatered: false }
          : p
      ),
      inventory: {
        ...prev.inventory,
        [cropId]: (prev.inventory[cropId] || 0) + yieldAmount,
      },
    }));
  };

  const handleSellCrop = (cropId: string, quantity: number, earnings: number) => {
    setGameState((prev) => {
      const currentQty = prev.inventory[cropId] || 0;
      const newQty = Math.max(0, currentQty - quantity);
      const newInventory = { ...prev.inventory };
      if (newQty === 0) {
        delete newInventory[cropId];
      } else {
        newInventory[cropId] = newQty;
      }

      return {
        ...prev,
        coins: prev.coins + earnings,
        totalCoinsEarned: prev.totalCoinsEarned + earnings,
        inventory: newInventory,
      };
    });
  };

  const handleFeedCropToCat = (cropId: string) => {
    const crop = DEFAULT_FARM_PLOTS ? undefined : null; // dummy to keep bundler clean
    const cropDef = (window as unknown as { currentCrop?: unknown }) || null;

    setActiveExpression('eating');
    setTimeout(() => setActiveExpression('idle'), 1500);

    setGameState((prev) => {
      const currentQty = prev.inventory[cropId] || 0;
      if (currentQty <= 0) return prev;

      const newQty = currentQty - 1;
      const newInventory = { ...prev.inventory };
      if (newQty === 0) {
        delete newInventory[cropId];
      } else {
        newInventory[cropId] = newQty;
      }

      const updatedCats = prev.cats.map((c) => {
        if (c.id === activeCat.id) {
          return {
            ...c,
            hunger: Math.min(100, c.hunger + 35),
            happiness: Math.min(100, c.happiness + 45),
            totalMeals: c.totalMeals + 1,
          };
        }
        return c;
      });

      return {
        ...prev,
        coins: prev.coins + 5,
        totalCoinsEarned: prev.totalCoinsEarned + 5,
        cats: updatedCats,
        inventory: newInventory,
      };
    });
  };

  const handleUpdateDecor = (newDecor: RoomCustomization) => {
    setGameState((prev) => ({
      ...prev,
      roomDecor: newDecor,
    }));
  };

  const handleResetGame = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    setGameState({
      herName: 'Sweetheart',
      hasSeenIntro: true,
      coins: 65,
      totalCoinsEarned: 65,
      cats: [INITIAL_CAT],
      activeCatId: INITIAL_CAT.id,
      upgrades: {},
      roomDecor: DEFAULT_ROOM_DECOR,
      farmPlots: DEFAULT_FARM_PLOTS,
      inventory: { crop_catnip: 2 },
      musicEnabled: true,
      sfxEnabled: true,
      idleSoundsEnabled: true,
      ambientSound: 'rain',
      masterVolume: 0.75,
      lastSaveTimestamp: Date.now(),
    });
  };

  let totalPassivePerSec = 0.15;
  Object.entries(gameState.upgrades).forEach(([upgradeId, tier]) => {
    const up = HOUSE_UPGRADES.find((u) => u.id === upgradeId);
    if (up && tier > 0) {
      totalPassivePerSec += up.passiveCoinsPerSec * tier;
    }
  });

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col text-stone-700 selection:bg-rose-200 selection:text-rose-900 select-none pb-24 md:pb-12">
      {/* --- FIRST-TIME INTRO & CAT CUSTOMIZER --- */}
      {!gameState.hasSeenIntro && (
        <IntroScreen
          herName={gameState.herName}
          onStartGame={(name, customStarterCat) => {
            setGameState((prev) => ({
              ...prev,
              herName: name,
              hasSeenIntro: true,
              cats: [customStarterCat],
              activeCatId: customStarterCat.id,
            }));
          }}
        />
      )}

      {/* --- TOP HEADER (Responsive & Never Crowded on Mobile) --- */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand & Dedication */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-400 text-white flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h1 className="font-cozy text-lg sm:text-xl font-black text-stone-800 tracking-tight leading-none whitespace-nowrap">
              Purrfect Haven
            </h1>
            <span className="text-[11px] text-rose-500 font-semibold truncate max-w-[120px] sm:max-w-none inline-block">
              For {gameState.herName}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Hidden on small mobile screens to prevent overflow!) */}
        <nav className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-2xl mr-1">
            <button
              onClick={() => {
                setCurrentView('house');
                sound.playPetChime(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-cozy flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'house'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-rose-500" />
              <span>Living Room</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('bedroom');
                sound.playPetChime(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-cozy flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'bedroom'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5 text-amber-500" />
              <span>Bedroom</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('farm');
                sound.playPetChime(2);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-cozy flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'farm'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pasture Farm</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('tabletop');
                sound.playMemoryChime();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-cozy flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'tabletop'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-300" />
              <span>Keepsake Table</span>
            </button>
          </div>

          <button
            onClick={() => setActiveModal('room_decor')}
            className="px-2.5 py-1.5 rounded-xl font-cozy text-xs font-bold flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <Paintbrush className="w-3.5 h-3.5 text-pink-500" />
            <span>Customize Decor</span>
          </button>

          <button
            onClick={() => setActiveModal('shop')}
            className="px-2.5 py-1.5 rounded-xl font-cozy text-xs font-bold flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <Egg className="w-3.5 h-3.5 text-amber-600" />
            <span>Adopt Eggs</span>
          </button>

          <button
            onClick={() => setActiveModal('furniture')}
            className="px-2.5 py-1.5 rounded-xl font-cozy text-xs font-bold flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upgrades</span>
          </button>

          <button
            onClick={() => setActiveModal('breeding')}
            className="px-2.5 py-1.5 rounded-xl font-cozy text-xs font-bold flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-300" />
            <span>Nursery</span>
          </button>

          <button
            onClick={() => setActiveModal('collection')}
            className="px-2.5 py-1.5 rounded-xl font-cozy text-xs font-bold flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Album ({gameState.cats.length})</span>
          </button>
        </nav>

        {/* Right Corner: Coins, Sound, Settings */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 shadow-xs font-cozy font-bold text-amber-900 text-xs sm:text-sm">
            <Coins className="w-4 h-4 text-amber-600" />
            <span className="tabular-nums font-mono">{Math.floor(gameState.coins)}</span>
          </div>

          <button
            onClick={() => {
              const next = !gameState.musicEnabled;
              sound.toggleMusic(next);
              setGameState((prev) => ({ ...prev, musicEnabled: next }));
            }}
            title={gameState.musicEnabled ? 'Mute lullaby' : 'Play lullaby'}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            {gameState.musicEnabled ? (
              <Music className="w-4 h-4 text-rose-500 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          <button
            onClick={() => setActiveModal('settings')}
            title="Settings & Relaxing Ambience"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --- MOBILE THUMB BOTTOM NAVIGATION BAR (Fixed & Always Visible on Mobile) --- */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FCFBF8]/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-1 py-1.5 flex items-center justify-around select-none"
      >
        <button
          onClick={() => {
            setCurrentView('house');
            sound.playPetChime(1);
          }}
          className={`flex flex-col items-center justify-center p-1 rounded-2xl min-w-[48px] transition-colors cursor-pointer ${
            currentView === 'house' ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-cozy font-bold">Living</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('bedroom');
            sound.playPetChime(1);
          }}
          className={`flex flex-col items-center justify-center p-1 rounded-2xl min-w-[48px] transition-colors cursor-pointer ${
            currentView === 'bedroom' ? 'text-amber-600 font-bold' : 'text-stone-500'
          }`}
        >
          <BedDouble className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-cozy font-bold">Bedroom</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('farm');
            sound.playPetChime(2);
          }}
          className={`flex flex-col items-center justify-center p-1 rounded-2xl min-w-[48px] transition-colors cursor-pointer ${
            currentView === 'farm' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-cozy font-bold">Farm</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('tabletop');
            sound.playMemoryChime();
          }}
          className={`flex flex-col items-center justify-center p-1 rounded-2xl min-w-[44px] transition-colors cursor-pointer ${
            currentView === 'tabletop' ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5 fill-rose-300 text-rose-500" />
          <span className="text-[9px] font-cozy font-bold">Letters</span>
        </button>

        <button
          onClick={() => setActiveModal('room_decor')}
          className="flex flex-col items-center justify-center p-1 rounded-2xl min-w-[44px] text-pink-600 cursor-pointer active:scale-95 transition-transform"
        >
          <Paintbrush className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-cozy font-bold">Decor</span>
        </button>

        <button
          onClick={() => setActiveModal('shop')}
          className="flex flex-col items-center justify-center p-1 rounded-2xl min-w-[44px] text-amber-700 cursor-pointer active:scale-95 transition-transform"
        >
          <Egg className="w-5 h-5 mb-0.5 text-amber-600" />
          <span className="text-[9px] font-cozy font-bold">Eggs</span>
        </button>

        <button
          onClick={() => setActiveModal('breeding')}
          className="flex flex-col items-center justify-center p-1 rounded-2xl min-w-[44px] text-rose-500 cursor-pointer active:scale-95 transition-transform"
        >
          <Heart className="w-5 h-5 mb-0.5 fill-rose-300" />
          <span className="text-[9px] font-cozy font-bold">Nursery</span>
        </button>

        <button
          onClick={() => setActiveModal('collection')}
          className="flex flex-col items-center justify-center p-1 rounded-2xl min-w-[44px] text-purple-700 cursor-pointer active:scale-95 transition-transform"
        >
          <BookOpen className="w-5 h-5 mb-0.5 text-purple-600" />
          <span className="text-[9px] font-cozy font-bold">Album</span>
        </button>
      </nav>

      {/* --- OFFLINE EARNINGS BANNER --- */}
      {offlineToast && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-xs sm:text-sm font-cozy font-bold flex items-center justify-center gap-2 shadow-sm animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>
            Welcome back! While you were resting, your cozy sanctuary generated +{offlineToast.coins} coins!
          </span>
          <button
            onClick={() => setOfflineToast(null)}
            className="underline ml-2 text-amber-100 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* --- MAIN GAME CONTAINER --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Passive Income & Ambience Ticker */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>+{totalPassivePerSec.toFixed(1)} coins / sec passive income</span>
            </span>
            <span className="text-[11px] text-stone-500">
              Playing gentle {gameState.ambientSound} sound
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('customizer')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Recolor / Edit Active Cat</span>
            </button>
          </div>
        </div>

        {/* --- VIEW SWITCHER: LIVING ROOM, BEDROOM, TABLETOP, or FARM --- */}
        {currentView === 'house' ? (
          <section aria-label="Cat Sanctuary Living Room">
            <SanctuaryRoom
              cats={gameState.cats}
              activeCat={activeCat}
              upgrades={gameState.upgrades}
              decor={gameState.roomDecor || DEFAULT_ROOM_DECOR}
              onPetCat={(catId) => handlePet(catId)}
              onSelectCat={(catId) => {
                setGameState((prev) => ({ ...prev, activeCatId: catId }));
                sound.playCutePetSound();
              }}
              activeExpression={activeExpression}
              onNavigate={setCurrentView}
              onOpenDecor={() => setActiveModal('room_decor')}
            />
          </section>
        ) : currentView === 'bedroom' ? (
          <section aria-label="Cat Sanctuary Cozy Bedroom">
            <SanctuaryBedroom
              cats={gameState.cats}
              activeCat={activeCat}
              decor={gameState.roomDecor || DEFAULT_ROOM_DECOR}
              onPetCat={(catId) => handlePet(catId)}
              onSelectCat={(catId) => {
                setGameState((prev) => ({ ...prev, activeCatId: catId }));
                sound.playCutePetSound();
              }}
              activeExpression={activeExpression}
              onNavigate={setCurrentView}
              onOpenDecor={() => setActiveModal('room_decor')}
            />
          </section>
        ) : currentView === 'tabletop' ? (
          <section aria-label="Our Keepsake Tabletop Desk">
            <TabletopMemoryView
              herName={gameState.herName}
              activeCat={activeCat}
              onBackToRoom={() => setCurrentView('house')}
            />
          </section>
        ) : (
          <section aria-label="Sanctuary Pasture Farm">
            <SanctuaryFarm
              playerCoins={gameState.coins}
              activeCat={activeCat}
              farmPlots={gameState.farmPlots}
              inventory={gameState.inventory}
              onPlantSeed={handlePlantSeed}
              onWaterPlot={handleWaterPlot}
              onHarvestPlot={handleHarvestPlot}
              onSellCrop={handleSellCrop}
              onFeedCropToCat={handleFeedCropToCat}
              onNavigate={setCurrentView}
            />
          </section>
        )}

        {/* --- QUICK CAT SWITCHER STRIP --- */}
        {gameState.cats.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
            <span className="text-xs font-semibold text-stone-500 shrink-0">Your Cats:</span>
            {gameState.cats.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setGameState((prev) => ({ ...prev, activeCatId: c.id }));
                  sound.playCutePetSound();
                }}
                className={`px-3 py-1.5 rounded-2xl text-xs font-cozy font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  c.id === activeCat.id
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-stone-400" style={{ backgroundColor: c.baseColor }} />
                <span>{c.name}</span>
                <span className="text-[10px] opacity-80 font-normal">({c.breed})</span>
              </button>
            ))}
          </div>
        )}

        {/* --- CAT CARE & INTERACTION PANEL --- */}
        <section aria-label="Cat Care Controls">
          <CatCarePanel
            cat={activeCat}
            onFeed={handleFeed}
            onPet={() => handlePet(activeCat.id)}
            onBrush={handleBrush}
            onRenameCat={handleRenameCat}
            isFeeding={isFeeding}
            isPetting={isPetting}
          />
        </section>
      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* Room Decor Customization Modal */}
      {activeModal === 'room_decor' && (
        <RoomDecorModal
          decor={gameState.roomDecor || DEFAULT_ROOM_DECOR}
          onSaveDecor={handleUpdateDecor}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* Egg Hatching Modal */}
      {activeModal === 'shop' && (
        <EggHatchModal
          playerCoins={gameState.coins}
          ownedCats={gameState.cats}
          onHatchCat={handleHatchCat}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'furniture' && (
        <FurnitureShopModal
          playerCoins={gameState.coins}
          upgrades={gameState.upgrades}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'breeding' && (
        <BreedingModal
          ownedCats={gameState.cats}
          playerCoins={gameState.coins}
          onKittenBorn={handleKittenBorn}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'collection' && (
        <CatCollectionModal
          cats={gameState.cats}
          activeCatId={activeCat.id}
          onSelectActiveCat={(id) => {
            setGameState((prev) => ({ ...prev, activeCatId: id }));
            setActiveModal('none');
          }}
          onRenameCat={handleRenameCat}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          herName={gameState.herName}
          musicEnabled={gameState.musicEnabled}
          sfxEnabled={gameState.sfxEnabled}
          idleSoundsEnabled={gameState.idleSoundsEnabled}
          ambientSound={gameState.ambientSound}
          masterVolume={gameState.masterVolume}
          onUpdateSettings={(settings) => {
            setGameState((prev) => ({ ...prev, ...settings }));
          }}
          onOpenCustomizer={() => setActiveModal('customizer')}
          onResetGame={handleResetGame}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'customizer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/50 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-4 overflow-hidden border border-amber-200">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <CatCustomizer
              initialCat={activeCat}
              title={`Recolor & Style ${activeCat.name}`}
              submitLabel="Save Changes to Cat"
              onConfirm={handleUpdateCat}
            />
          </div>
        </div>
      )}
    </div>
  );
}
