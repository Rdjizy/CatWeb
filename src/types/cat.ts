/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CatPattern =
  | 'solid'
  | 'tabby'
  | 'calico'
  | 'tuxedo'
  | 'siamese'
  | 'bengal'
  | 'celestial'
  | 'sakura'
  | 'aurora';

export type CatRarity = 'common' | 'uncommon' | 'rare' | 'mythic' | 'celestial';

export type CatPersonality =
  | 'Cuddle Bug'
  | 'Sunbather'
  | 'Gentle Gourmet'
  | 'Playful Rascal'
  | 'Zen Sleeper'
  | 'Curious Explorer'
  | 'Sweet Dreamer';

export interface Cat {
  id: string;
  name: string;
  breed: string;
  rarity: CatRarity;
  personality: CatPersonality;
  baseColor: string;
  pattern: CatPattern;
  patternColor: string;
  bellyColor: string;
  earColor?: string; // customizable inner ears / ear tips
  eyeColor: string;
  hunger: number; // 0 - 100 (100 = full)
  happiness: number; // 0 - 100 (100 = blissful)
  isKitten: boolean;
  birthTimestamp: number;
  parents?: [string, string] | null; // Parent names
  totalPets: number;
  totalMeals: number;
  favoriteToy: string;
}

export type UpgradeCategory =
  | 'bed'
  | 'scratcher'
  | 'window'
  | 'plants'
  | 'toys'
  | 'room'
  | 'rug'
  | 'fireplace';

export interface HouseUpgrade {
  id: string;
  name: string;
  category: UpgradeCategory;
  description: string;
  cost: number;
  tier: number;
  maxTier: number;
  passiveCoinsPerSec: number;
  happinessDecayReduction: number;
}

export interface FarmCrop {
  id: string;
  name: string;
  seedCost: number;
  growDurationSec: number;
  sellPrice: number;
  hungerRestore: number;
  happinessRestore: number;
  icon: string;
  description: string;
}

export interface FarmPlot {
  id: number;
  cropId: string | null;
  plantedAt: number | null; // timestamp
  isWatered: boolean;
}

export interface RoomCustomization {
  bedStyle: 'donut' | 'cloud' | 'canopy' | 'wicker' | 'strawberry';
  bedColor: string;
  rugStyle: 'mandala' | 'cloud' | 'daisy' | 'plaid';
  rugColor: string;
  catTreeStyle: 'condo' | 'castle' | 'birch';
  plantStyle: 'monstera' | 'sakura' | 'catgrass';
  lampStyle: 'fairy' | 'kitty' | 'moon';
  curtainStyle: 'golden' | 'blush' | 'starry';
  isLampOn: boolean;
  isCurtainOpen: boolean;
}

export interface GameState {
  herName: string;
  hasSeenIntro: boolean;
  coins: number;
  totalCoinsEarned: number;
  cats: Cat[];
  activeCatId: string;
  upgrades: Record<string, number>; // upgradeId -> purchased tier (0 if unbought)
  roomDecor: RoomCustomization;
  farmPlots: FarmPlot[];
  inventory: Record<string, number>; // cropId -> quantity
  musicEnabled: boolean;
  sfxEnabled: boolean;
  idleSoundsEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'fireplace';
  masterVolume: number;
  lastSaveTimestamp: number;
}
