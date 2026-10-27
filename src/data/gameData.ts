/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cat, HouseUpgrade, FarmCrop, FarmPlot, RoomCustomization } from '../types/cat';

export const DEFAULT_ROOM_DECOR: RoomCustomization = {
  bedStyle: 'donut',
  bedColor: '#F472B6',
  rugStyle: 'mandala',
  rugColor: '#F59E0B',
  catTreeStyle: 'condo',
  plantStyle: 'monstera',
  lampStyle: 'kitty',
  curtainStyle: 'golden',
  isLampOn: true,
  isCurtainOpen: true,
};

export const INITIAL_CAT: Cat = {
  id: 'starter_cat_mochi',
  name: 'Mochi',
  breed: 'Scottish Fold',
  rarity: 'common',
  personality: 'Cuddle Bug',
  baseColor: '#F5EBE1', // warm cream
  pattern: 'solid',
  patternColor: '#E6D5C3',
  bellyColor: '#FFFDF9',
  eyeColor: '#10B981', // emerald
  hunger: 85,
  happiness: 90,
  isKitten: false,
  birthTimestamp: Date.now() - 86400000 * 3,
  parents: null,
  totalPets: 12,
  totalMeals: 4,
  favoriteToy: 'Feather Wand',
};

export const SHOP_CATS: Omit<Cat, 'hunger' | 'happiness' | 'totalPets' | 'totalMeals' | 'birthTimestamp'>[] = [
  {
    id: 'shop_cat_marmalade',
    name: 'Marmalade',
    breed: 'Ginger Tabby',
    rarity: 'common',
    personality: 'Sunbather',
    baseColor: '#FDBA74', // warm ginger orange
    pattern: 'tabby',
    patternColor: '#EA580C',
    bellyColor: '#FFF7ED',
    eyeColor: '#F59E0B', // amber
    isKitten: false,
    parents: null,
    favoriteToy: 'Yarn Ball',
  },
  {
    id: 'shop_cat_oreo',
    name: 'Oreo',
    breed: 'Tuxedo',
    rarity: 'common',
    personality: 'Curious Explorer',
    baseColor: '#374151', // sleek charcoal
    pattern: 'tuxedo',
    patternColor: '#1F2937',
    bellyColor: '#FFFFFF',
    eyeColor: '#34D399', // mint green
    isKitten: false,
    parents: null,
    favoriteToy: 'Catnip Mouse',
  },
  {
    id: 'shop_cat_sunny',
    name: 'Sunny',
    breed: 'Calico',
    rarity: 'uncommon',
    personality: 'Sweet Dreamer',
    baseColor: '#FDF4E3', // soft ivory
    pattern: 'calico',
    patternColor: '#4B5563', // charcoal + orange patches
    bellyColor: '#FFFFFF',
    eyeColor: '#FBBF24', // warm golden
    isKitten: false,
    parents: null,
    favoriteToy: 'Jingle Bell',
  },
  {
    id: 'shop_cat_koko',
    name: 'Koko',
    breed: 'Siamese Point',
    rarity: 'uncommon',
    personality: 'Gentle Gourmet',
    baseColor: '#EBE3D5', // fawn
    pattern: 'siamese',
    patternColor: '#5C4436', // dark seal point
    bellyColor: '#F7F3EC',
    eyeColor: '#38BDF8', // sapphire blue
    isKitten: false,
    parents: null,
    favoriteToy: 'Laser Pointer',
  },
  {
    id: 'shop_cat_misty',
    name: 'Misty',
    breed: 'Russian Blue',
    rarity: 'rare',
    personality: 'Zen Sleeper',
    baseColor: '#94A3B8', // silver-blue
    pattern: 'solid',
    patternColor: '#64748B',
    bellyColor: '#E2E8F0',
    eyeColor: '#059669', // deep emerald
    isKitten: false,
    parents: null,
    favoriteToy: 'Silk Ribbon',
  },
  {
    id: 'shop_cat_bengal',
    name: 'Cleo',
    breed: 'Golden Bengal',
    rarity: 'rare',
    personality: 'Playful Rascal',
    baseColor: '#FCD34D', // golden honey
    pattern: 'bengal',
    patternColor: '#B45309', // amber rosettes
    bellyColor: '#FEF3C7',
    eyeColor: '#10B981',
    isKitten: false,
    parents: null,
    favoriteToy: 'Chasing Feather',
  },
  {
    id: 'shop_cat_hana',
    name: 'Hana',
    breed: 'Sakura Blossom',
    rarity: 'mythic',
    personality: 'Cuddle Bug',
    baseColor: '#FCE7F3', // pastel petal pink
    pattern: 'sakura',
    patternColor: '#F472B6',
    bellyColor: '#FFF1F2',
    eyeColor: '#FB7185', // rose quartz
    isKitten: false,
    parents: null,
    favoriteToy: 'Cherry Blossom Branch',
  },
  {
    id: 'shop_cat_cosmo',
    name: 'Cosmo',
    breed: 'Celestial Starlight',
    rarity: 'celestial',
    personality: 'Sweet Dreamer',
    baseColor: '#312E81', // deep midnight indigo
    pattern: 'celestial',
    patternColor: '#818CF8',
    bellyColor: '#E0E7FF',
    eyeColor: '#FBBF24', // golden star
    isKitten: false,
    parents: null,
    favoriteToy: 'Starlight Prism',
  },
];

export const CAT_RARITY_PRICES: Record<string, number> = {
  common: 75,
  uncommon: 180,
  rare: 350,
  mythic: 750,
  celestial: 1500,
};

export const HOUSE_UPGRADES: HouseUpgrade[] = [
  {
    id: 'bed',
    name: 'Cozy Sleeping Bed',
    category: 'bed',
    description: 'A dedicated plush nest for deep, restful cat naps.',
    cost: 45,
    tier: 1,
    maxTier: 3,
    passiveCoinsPerSec: 0.2,
    happinessDecayReduction: 0.1,
  },
  {
    id: 'scratcher',
    name: 'Sisal Scratching Tree',
    category: 'scratcher',
    description: 'Satisfies natural clawing instincts and keeps kitties joyful.',
    cost: 60,
    tier: 1,
    maxTier: 3,
    passiveCoinsPerSec: 0.3,
    happinessDecayReduction: 0.15,
  },
  {
    id: 'window',
    name: 'Sunlit Window Perch',
    category: 'window',
    description: 'Watch gentle clouds float by and chirping backyard birds.',
    cost: 80,
    tier: 1,
    maxTier: 3,
    passiveCoinsPerSec: 0.4,
    happinessDecayReduction: 0.2,
  },
  {
    id: 'plants',
    name: 'Pet-Safe Botanical Garden',
    category: 'plants',
    description: 'Fresh organic cat grass, calming chamomile, and leafy ferns.',
    cost: 50,
    tier: 1,
    maxTier: 3,
    passiveCoinsPerSec: 0.25,
    happinessDecayReduction: 0.1,
  },
  {
    id: 'toys',
    name: 'Interactive Toy Chest',
    category: 'toys',
    description: 'Feather wands, wool yarn balls, and automatic catnip toys.',
    cost: 70,
    tier: 1,
    maxTier: 3,
    passiveCoinsPerSec: 0.35,
    happinessDecayReduction: 0.15,
  },
  {
    id: 'rug',
    name: 'Plush Pastel Cloud Rug',
    category: 'rug',
    description: 'Soft wool underpaw that radiates warmth across the wooden floor.',
    cost: 40,
    tier: 1,
    maxTier: 2,
    passiveCoinsPerSec: 0.2,
    happinessDecayReduction: 0.05,
  },
  {
    id: 'fireplace',
    name: 'Gentle Hearth Heater',
    category: 'fireplace',
    description: 'A softly glowing hearth with relaxing crackling warmth.',
    cost: 240,
    tier: 1,
    maxTier: 2,
    passiveCoinsPerSec: 0.8,
    happinessDecayReduction: 0.3,
  },
  {
    id: 'room',
    name: 'Sanctuary Expansion',
    category: 'room',
    description: 'Expands the room architecture, opening up sunbeams and room for more cats.',
    cost: 320,
    tier: 1,
    maxTier: 3,
    passiveCoinsPerSec: 1.2,
    happinessDecayReduction: 0.25,
  },
];

export const UPGRADE_TIER_NAMES: Record<string, string[]> = {
  bed: ['Fluffy Pastel Donut', 'Velvet Cloud Cushion', 'Royal Canopy Hammock'],
  scratcher: ['Natural Sisal Pole', 'Multi-Floor Cat Tree', 'Castle Climbing Tower'],
  window: ['Sunlit Window Shelf', 'Bay Window & Bird Feeder', 'Starlit Solarium Skylight'],
  plants: ['Potted Cat Grass Pot', 'Monstera & Fern Nook', 'Indoor Floral Conservatory'],
  toys: ['Feather & Wool Jingle', 'Smart Laser Mouse Box', 'Wonderland Cat Gym'],
  rug: ['Woven Oval Pastel Rug', 'Tufted Cloud Hearth Rug'],
  fireplace: ['Warm Ambient Hearth', 'Stone Fireplace & Hearth Mat'],
  room: ['Cozy Studio Nook', 'Sun-Drenched Garden Parlor', 'Grand Whisker Estate'],
};

export const CUTE_KITTEN_NAMES = [
  'Mochi', 'Boba', 'Peanut', 'Luna', 'Oliver', 'Cleo', 'Biscuit',
  'Chai', 'Pippin', 'Marshmallow', 'Tofu', 'Nutmeg', 'Clover',
  'Buttercup', 'Waffles', 'Snowball', 'Fig', 'Puff', 'Bramble'
];

export const FARM_CROPS: FarmCrop[] = [
  {
    id: 'crop_catnip',
    name: 'Cozy Catnip',
    seedCost: 8,
    growDurationSec: 12,
    sellPrice: 18,
    hungerRestore: 20,
    happinessRestore: 35,
    icon: '🌿',
    description: 'Fresh fragrant catnip that makes cats roll around with blissful purrs.',
  },
  {
    id: 'crop_salmonberry',
    name: 'Salmon Berry',
    seedCost: 20,
    growDurationSec: 25,
    sellPrice: 45,
    hungerRestore: 40,
    happinessRestore: 45,
    icon: '🍓',
    description: 'Juicy, sweet berries with a savory aroma loved by gourmet felines.',
  },
  {
    id: 'crop_sunwheat',
    name: 'Sunlit Golden Wheat',
    seedCost: 35,
    growDurationSec: 45,
    sellPrice: 80,
    hungerRestore: 30,
    happinessRestore: 30,
    icon: '🌾',
    description: 'Sun-dried grain ground into crunchy homemade kitty biscuits.',
  },
  {
    id: 'crop_tunamelon',
    name: 'Golden Tuna-Melon',
    seedCost: 70,
    growDurationSec: 70,
    sellPrice: 165,
    hungerRestore: 65,
    happinessRestore: 65,
    icon: '🍈',
    description: 'A prize-winning, melt-in-the-mouth farm delicacy that cats go wild for!',
  },
  {
    id: 'crop_kittymint',
    name: 'Fresh Kitty Mint',
    seedCost: 15,
    growDurationSec: 18,
    sellPrice: 34,
    hungerRestore: 25,
    happinessRestore: 40,
    icon: '🌱',
    description: 'Crisp organic mint herbs giving soothing digestion and playful energy.',
  },
];

export const DEFAULT_FARM_PLOTS: FarmPlot[] = [
  { id: 1, cropId: null, plantedAt: null, isWatered: false },
  { id: 2, cropId: null, plantedAt: null, isWatered: false },
  { id: 3, cropId: null, plantedAt: null, isWatered: false },
  { id: 4, cropId: null, plantedAt: null, isWatered: false },
  { id: 5, cropId: null, plantedAt: null, isWatered: false },
  { id: 6, cropId: null, plantedAt: null, isWatered: false },
];
