// ── Tile Definitions & Merge Chains ──────────────────────────────────────────
// Every tile type in the game, organized by chain.

export const ChainType = {
  EARTH: 'earth',
  WATER: 'water',
  PLANT: 'plant',
  SAND: 'sand',
  SNOW: 'snow',
};

// Tile registry: chain → tier → tile definition
// Each tile has: id, name, emoji, points, chain, tier, lifeBurst config
export const TILES = {
  // ── Earth Chain ──
  earth_1: { id: 'earth_1', name: 'Rock',    emoji: '🪨', points: 10,   chain: 'earth', tier: 1, color: '#8B7355' },
  earth_2: { id: 'earth_2', name: 'Hill',    emoji: '⛰️',  points: 40,   chain: 'earth', tier: 2, color: '#6B8E23' },
  earth_3: { id: 'earth_3', name: 'Mountain',emoji: '🏔️', points: 150,  chain: 'earth', tier: 3, color: '#4682B4',
    lifeBurst: { chance: 0.7, animals: ['goat', 'eagle'] } },
  earth_4: { id: 'earth_4', name: 'Volcano', emoji: '🌋', points: 500,  chain: 'earth', tier: 4, color: '#DC143C',
    lifeBurst: { chance: 1.0, animals: ['salamander'], landmarks: ['lava_pool'] } },
  earth_5: { id: 'earth_5', name: 'Floating Island', emoji: '🏝️', points: 1500, chain: 'earth', tier: 5, color: '#9370DB',
    lifeBurst: { chance: 1.0, animals: ['phoenix'], landmarks: ['sky_temple'], count: 2 } },

  // ── Water Chain ──
  water_1: { id: 'water_1', name: 'Puddle',  emoji: '💧', points: 10,   chain: 'water', tier: 1, color: '#4FC3F7' },
  water_2: { id: 'water_2', name: 'Pond',    emoji: '🌊', points: 40,   chain: 'water', tier: 2, color: '#0288D1',
    lifeBurst: { chance: 0.7, animals: ['frog'] } },
  water_3: { id: 'water_3', name: 'River',   emoji: '🏞️', points: 150,  chain: 'water', tier: 3, color: '#01579B',
    lifeBurst: { chance: 0.7, animals: ['fish'] } },
  water_4: { id: 'water_4', name: 'Lake',    emoji: '🏖️', points: 500,  chain: 'water', tier: 4, color: '#006064',
    lifeBurst: { chance: 1.0, animals: ['swan'], landmarks: ['waterfall'] } },
  water_5: { id: 'water_5', name: 'Ocean',   emoji: '🐋', points: 1500, chain: 'water', tier: 5, color: '#01579B',
    lifeBurst: { chance: 1.0, animals: ['whale'], landmarks: ['lighthouse'], count: 2 } },

  // ── Plant Chain ──
  plant_1: { id: 'plant_1', name: 'Grass',   emoji: '🌿', points: 10,   chain: 'plant', tier: 1, color: '#66BB6A' },
  plant_2: { id: 'plant_2', name: 'Bush',    emoji: '🌳', points: 40,   chain: 'plant', tier: 2, color: '#388E3C' },
  plant_3: { id: 'plant_3', name: 'Forest',  emoji: '🌲', points: 150,  chain: 'plant', tier: 3, color: '#1B5E20',
    lifeBurst: { chance: 0.7, animals: ['deer', 'rabbit'] } },
  plant_4: { id: 'plant_4', name: 'Ancient Grove', emoji: '🍀', points: 500, chain: 'plant', tier: 4, color: '#004D40',
    lifeBurst: { chance: 1.0, animals: ['owl'], landmarks: ['treehouse'] } },
  plant_5: { id: 'plant_5', name: 'World Tree', emoji: '🌴', points: 1500, chain: 'plant', tier: 5, color: '#1A237E',
    lifeBurst: { chance: 1.0, animals: ['unicorn'], landmarks: ['fairy_ring'], count: 2 } },

  // ── Sand Chain ──
  sand_1: { id: 'sand_1', name: 'Sand',     emoji: '🏜️', points: 10,   chain: 'sand', tier: 1, color: '#D4A056' },
  sand_2: { id: 'sand_2', name: 'Dune',     emoji: '🏖️', points: 40,   chain: 'sand', tier: 2, color: '#C88A32' },
  sand_3: { id: 'sand_3', name: 'Oasis',    emoji: '🌴', points: 150,  chain: 'sand', tier: 3, color: '#A0522D',
    lifeBurst: { chance: 0.7, animals: ['camel'] } },
  sand_4: { id: 'sand_4', name: 'Temple',   emoji: '🏛️', points: 500,  chain: 'sand', tier: 4, color: '#8B4513',
    lifeBurst: { chance: 1.0, animals: ['scorpion'], landmarks: ['sphinx'] } },
  sand_5: { id: 'sand_5', name: 'Mirage City', emoji: '✨', points: 1500, chain: 'sand', tier: 5, color: '#FFD700',
    lifeBurst: { chance: 1.0, animals: ['fennec'], landmarks: ['pyramid'], count: 2 } },

  // ── Snow Chain ──
  snow_1: { id: 'snow_1', name: 'Snowflake', emoji: '❄️', points: 10,   chain: 'snow', tier: 1, color: '#B3E5FC' },
  snow_2: { id: 'snow_2', name: 'Snow Drift',emoji: '🌨️', points: 40,   chain: 'snow', tier: 2, color: '#81D4FA' },
  snow_3: { id: 'snow_3', name: 'Glacier',   emoji: '🧊', points: 150,  chain: 'snow', tier: 3, color: '#4FC3F7',
    lifeBurst: { chance: 0.7, animals: ['penguin'] } },
  snow_4: { id: 'snow_4', name: 'Ice Palace', emoji: '🏰', points: 500,  chain: 'snow', tier: 4, color: '#039BE5',
    lifeBurst: { chance: 1.0, animals: ['polar_bear'], landmarks: ['ice_spire'] } },
  snow_5: { id: 'snow_5', name: 'Aurora Peak',emoji: '🌌', points: 1500, chain: 'snow', tier: 5, color: '#7C4DFF',
    lifeBurst: { chance: 1.0, animals: ['snow_fox'], landmarks: ['northern_lights'], count: 2 } },

  // ── Special ──
  wild:   { id: 'wild', name: 'Wild', emoji: '🌈', points: 0, chain: 'wild', tier: 0, color: '#FF6FD8' },
};

// Given a tile id, return the next tier tile id in the same chain (or null if max)
export function getNextTier(tileId) {
  const tile = TILES[tileId];
  if (!tile || tile.chain === 'wild') return null;
  const nextId = `${tile.chain}_${tile.tier + 1}`;
  return TILES[nextId] ? nextId : null;
}

// Get tile def by chain and tier
export function getTileByChainTier(chain, tier) {
  const id = `${chain}_${tier}`;
  return TILES[id] || null;
}

// ── Animals ──────────────────────────────────────────────────────────────────

export const ANIMALS = {
  goat:       { id: 'goat',       name: 'Goat',         emoji: '🐐', points: 75,  rarity: 'common' },
  eagle:      { id: 'eagle',      name: 'Eagle',        emoji: '🦅', points: 75,  rarity: 'common' },
  frog:       { id: 'frog',       name: 'Frog',         emoji: '🐸', points: 75,  rarity: 'common' },
  fish:       { id: 'fish',       name: 'Fish',         emoji: '🐟', points: 75,  rarity: 'common' },
  deer:       { id: 'deer',       name: 'Deer',         emoji: '🦌', points: 75,  rarity: 'common' },
  rabbit:     { id: 'rabbit',     name: 'Rabbit',       emoji: '🐇', points: 75,  rarity: 'common' },
  swan:       { id: 'swan',       name: 'Swan',         emoji: '🦢', points: 200, rarity: 'rare' },
  owl:        { id: 'owl',        name: 'Owl',          emoji: '🦉', points: 200, rarity: 'rare' },
  penguin:    { id: 'penguin',    name: 'Penguin',      emoji: '🐧', points: 75,  rarity: 'common' },
  butterfly:  { id: 'butterfly',  name: 'Butterfly',    emoji: '🦋', points: 75,  rarity: 'common' },
  salamander: { id: 'salamander', name: 'Salamander',   emoji: '🦎', points: 200, rarity: 'rare' },
  phoenix:    { id: 'phoenix',    name: 'Phoenix',      emoji: '🔥', points: 600, rarity: 'legendary' },
  whale:      { id: 'whale',      name: 'Whale',        emoji: '🐳', points: 600, rarity: 'legendary' },
  unicorn:    { id: 'unicorn',    name: 'Unicorn',      emoji: '🦄', points: 600, rarity: 'legendary' },
  camel:      { id: 'camel',      name: 'Camel',        emoji: '🐫', points: 75,  rarity: 'common' },
  scorpion:   { id: 'scorpion',   name: 'Scorpion',     emoji: '🦂', points: 200, rarity: 'rare' },
  fennec:     { id: 'fennec',     name: 'Fennec Fox',   emoji: '🦊', points: 600, rarity: 'legendary' },
  polar_bear: { id: 'polar_bear', name: 'Polar Bear',   emoji: '🐻‍❄️', points: 200, rarity: 'rare' },
  snow_fox:   { id: 'snow_fox',   name: 'Snow Fox',     emoji: '🦊', points: 600, rarity: 'legendary' },
};

// ── Landmarks ────────────────────────────────────────────────────────────────

export const LANDMARKS = {
  lava_pool:       { id: 'lava_pool',       name: 'Lava Pool',       emoji: '♨️',  points: 300 },
  sky_temple:      { id: 'sky_temple',      name: 'Sky Temple',      emoji: '🛕', points: 800 },
  waterfall:       { id: 'waterfall',       name: 'Waterfall',       emoji: '⛲', points: 300 },
  lighthouse:      { id: 'lighthouse',      name: 'Lighthouse',      emoji: '🗼', points: 800 },
  treehouse:       { id: 'treehouse',       name: 'Treehouse',       emoji: '🏡', points: 300 },
  fairy_ring:      { id: 'fairy_ring',      name: 'Fairy Ring',      emoji: '💫', points: 800 },
  sphinx:          { id: 'sphinx',          name: 'Sphinx',          emoji: '🗿', points: 300 },
  pyramid:         { id: 'pyramid',         name: 'Pyramid',         emoji: '🔺', points: 800 },
  ice_spire:       { id: 'ice_spire',       name: 'Ice Spire',       emoji: '🔷', points: 300 },
  northern_lights: { id: 'northern_lights', name: 'Northern Lights', emoji: '🌠', points: 800 },
};

// ── Biome Definitions ────────────────────────────────────────────────────────

export const BIOMES = {
  grassland: {
    id: 'grassland',
    name: 'Grassland',
    chains: { primary: 'earth', secondary: 'plant', tertiary: 'water' },
    weights: { primary: 50, secondary: 30, tertiary: 20 },
    bgColor: '#E8F5E9',
    unlockScore: 0,
  },
  desert: {
    id: 'desert',
    name: 'Desert',
    chains: { primary: 'sand', secondary: 'earth', tertiary: 'water' },
    weights: { primary: 50, secondary: 30, tertiary: 20 },
    bgColor: '#FFF8E1',
    unlockScore: 5000,
  },
  tundra: {
    id: 'tundra',
    name: 'Tundra',
    chains: { primary: 'snow', secondary: 'water', tertiary: 'earth' },
    weights: { primary: 50, secondary: 30, tertiary: 20 },
    bgColor: '#E3F2FD',
    unlockScore: 15000,
  },
};

// ── Level Definitions ────────────────────────────────────────────────────────

export const LEVELS = [
  // ── Grassland (levels 1-10) ──
  { id: 1,  biome: 'grassland', target: 300,  gridSize: 5, bonusGoals: [],
    stardust: 25, description: 'A new world begins.' },
  { id: 2,  biome: 'grassland', target: 500,  gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'earth_2', count: 1, label: 'Create 1 Hill' }],
    stardust: 30, description: 'Build your first hill.' },
  { id: 3,  biome: 'grassland', target: 800,  gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 1, label: 'Spawn 1 animal' }],
    stardust: 35, description: 'Life stirs on your planet.' },
  { id: 4,  biome: 'grassland', target: 1000, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'plant_3', count: 1, label: 'Create 1 Forest' }],
    stardust: 40, description: 'Forests take root.' },
  { id: 5,  biome: 'grassland', target: 1500, gridSize: 5,
    bonusGoals: [
      { type: 'spawn_animals', count: 3, label: 'Spawn 3 animals' },
      { type: 'create_tile', tileId: 'water_3', count: 1, label: 'Create 1 River' },
    ],
    stardust: 50, description: 'Rivers flow, creatures gather.' },
  { id: 6,  biome: 'grassland', target: 2000, gridSize: 5,
    bonusGoals: [
      { type: 'create_tile', tileId: 'earth_3', count: 1, label: 'Create 1 Mountain' },
      { type: 'create_tile', tileId: 'water_3', count: 1, label: 'Create 1 River' },
    ],
    stardust: 60, description: 'Peaks rise above the plains.' },
  { id: 7,  biome: 'grassland', target: 2500, gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 5, label: 'Spawn 5 animals' }],
    stardust: 70, description: 'A thriving ecosystem.' },
  { id: 8,  biome: 'grassland', target: 3000, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'plant_3', count: 2, label: 'Create 2 Forests' }],
    stardust: 80, description: 'The forests spread wide.' },
  { id: 9,  biome: 'grassland', target: 3500, gridSize: 5,
    bonusGoals: [
      { type: 'build_landmark', count: 1, label: 'Build 1 landmark' },
      { type: 'spawn_rare', count: 1, label: 'Spawn 1 rare animal' },
    ],
    stardust: 90, description: 'Civilization dawns.' },
  { id: 10, biome: 'grassland', target: 4000, gridSize: 5,
    bonusGoals: [
      { type: 'spawn_animal_types', count: 2, label: 'Spawn 2 different species' },
      { type: 'build_landmark', count: 1, label: 'Build 1 landmark' },
    ],
    stardust: 100, description: 'A world complete.' },

  // ── Desert (levels 11-15) ──
  { id: 11, biome: 'desert', target: 3000, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'sand_3', count: 1, label: 'Create 1 Oasis' }],
    stardust: 80, description: 'Heat shimmers on the horizon.' },
  { id: 12, biome: 'desert', target: 4000, gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 2, label: 'Spawn 2 animals' }],
    stardust: 90, description: 'Life finds a way.' },
  { id: 13, biome: 'desert', target: 5000, gridSize: 5,
    bonusGoals: [{ type: 'build_landmark', count: 1, label: 'Build the Sphinx' }],
    stardust: 100, description: 'Ancient wonders rise.' },
  { id: 14, biome: 'desert', target: 6000, gridSize: 5,
    bonusGoals: [
      { type: 'create_tile', tileId: 'sand_3', count: 2, label: 'Create 2 Oases' },
      { type: 'spawn_animals', count: 4, label: 'Spawn 4 animals' },
    ],
    stardust: 120, description: 'The desert blooms.' },
  { id: 15, biome: 'desert', target: 7500, gridSize: 5,
    bonusGoals: [
      { type: 'spawn_animals', count: 5, label: 'Spawn 5 animals' },
      { type: 'build_landmark', count: 2, label: 'Build 2 landmarks' },
    ],
    stardust: 150, description: 'A mirage becomes real.' },
];
