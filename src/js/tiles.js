// ── Tile Definitions & Merge Chains ──────────────────────────────────────────
// Every tile type in the game, organized by chain.

export const ChainType = {
  MEADOW: 'meadow',
  BROOK: 'brook',
  BLOOM: 'bloom',
  DUNE: 'dune',
  RELIC: 'relic',
  MIRAGE: 'mirage',
  FROST: 'frost',
  AURORA: 'aurora',
  CRYSTAL: 'crystal',
  MAGMA: 'magma',
  ASH: 'ash',
  OBSIDIAN: 'obsidian',
  WILD: 'wild',
};

// Tile registry: chain → tier → tile definition
// Each tile has: id, name, emoji, points, chain, tier, lifeBurst config
export const TILES = {
  // ── Grassland Chains (meadow / brook / bloom) ──
  meadow_1: { id: 'meadow_1', name: 'Meadow Sprout', emoji: '🌱', points: 10, chain: 'meadow', tier: 1, color: '#7bd56a' },
  meadow_2: { id: 'meadow_2', name: 'Tall Meadow',   emoji: '🌾', points: 40, chain: 'meadow', tier: 2, color: '#67c55a' },
  meadow_3: { id: 'meadow_3', name: 'Verdant Field', emoji: '🌿', points: 150, chain: 'meadow', tier: 3, color: '#4aa84b',
    lifeBurst: { chance: 0.7, animals: ['deer', 'rabbit'] } },
  meadow_4: { id: 'meadow_4', name: 'Emerald Prairie', emoji: '🌳', points: 500, chain: 'meadow', tier: 4, color: '#2f8b41',
    lifeBurst: { chance: 1.0, animals: ['owl'], landmarks: ['treehouse'] } },

  brook_1: { id: 'brook_1', name: 'Dew Drop',       emoji: '💧', points: 10, chain: 'brook', tier: 1, color: '#6ad4ff' },
  brook_2: { id: 'brook_2', name: 'Ripple Pool',    emoji: '🫧', points: 40, chain: 'brook', tier: 2, color: '#50bff5' },
  brook_3: { id: 'brook_3', name: 'Singing Stream', emoji: '🌊', points: 150, chain: 'brook', tier: 3, color: '#3299e4',
    lifeBurst: { chance: 0.7, animals: ['frog', 'fish'] } },
  brook_4: { id: 'brook_4', name: 'Crystal Cascade', emoji: '💦', points: 500, chain: 'brook', tier: 4, color: '#1d7ec9',
    lifeBurst: { chance: 1.0, animals: ['swan'], landmarks: ['waterfall'] } },

  bloom_1: { id: 'bloom_1', name: 'Flower Bud',      emoji: '🌷', points: 10, chain: 'bloom', tier: 1, color: '#e8a0c9' },
  bloom_2: { id: 'bloom_2', name: 'Petal Cluster',   emoji: '🌸', points: 40, chain: 'bloom', tier: 2, color: '#e27bb6' },
  bloom_3: { id: 'bloom_3', name: 'Floral Ring',     emoji: '🪻', points: 150, chain: 'bloom', tier: 3, color: '#c95a9f',
    lifeBurst: { chance: 0.7, animals: ['butterfly'] } },
  bloom_4: { id: 'bloom_4', name: 'Sunblossom Crown', emoji: '🌺', points: 500, chain: 'bloom', tier: 4, color: '#a94287',
    lifeBurst: { chance: 1.0, animals: ['unicorn'], landmarks: ['fairy_ring'] } },

  // ── Desert Chains (dune / relic / mirage) ──
  dune_1: { id: 'dune_1', name: 'Sand Seed',      emoji: '⏳', points: 10, chain: 'dune', tier: 1, color: '#cf9a5a' },
  dune_2: { id: 'dune_2', name: 'Dune Crest',     emoji: '🏜️', points: 40, chain: 'dune', tier: 2, color: '#c48643' },
  dune_3: { id: 'dune_3', name: 'Oasis Palm',     emoji: '🌴', points: 150, chain: 'dune', tier: 3, color: '#ad7334',
    lifeBurst: { chance: 0.7, animals: ['camel'] } },
  dune_4: { id: 'dune_4', name: 'Golden Expanse', emoji: '🌄', points: 500, chain: 'dune', tier: 4, color: '#8f5f27',
    lifeBurst: { chance: 1.0, animals: ['fennec'], landmarks: ['sphinx'] } },

  relic_1: { id: 'relic_1', name: 'Ancient Brick',  emoji: '🧱', points: 10, chain: 'relic', tier: 1, color: '#c37c58' },
  relic_2: { id: 'relic_2', name: 'Rune Tablet',    emoji: '📜', points: 40, chain: 'relic', tier: 2, color: '#a86a46' },
  relic_3: { id: 'relic_3', name: 'Sun Reliquary',  emoji: '🏺', points: 150, chain: 'relic', tier: 3, color: '#8f5637',
    lifeBurst: { chance: 0.7, animals: ['scorpion'] } },
  relic_4: { id: 'relic_4', name: 'Desert Sanctum', emoji: '🏛️', points: 500, chain: 'relic', tier: 4, color: '#74442a',
    lifeBurst: { chance: 1.0, animals: ['fennec'], landmarks: ['pyramid'] } },

  mirage_1: { id: 'mirage_1', name: 'Heat Haze',    emoji: '☀️', points: 10, chain: 'mirage', tier: 1, color: '#e2b572' },
  mirage_2: { id: 'mirage_2', name: 'Shimmer Veil', emoji: '✨', points: 40, chain: 'mirage', tier: 2, color: '#d6a45f' },
  mirage_3: { id: 'mirage_3', name: 'Mirage Gate',  emoji: '🌀', points: 150, chain: 'mirage', tier: 3, color: '#c0914f',
    lifeBurst: { chance: 0.7, animals: ['camel'] } },
  mirage_4: { id: 'mirage_4', name: 'Mirage City',  emoji: '🌇', points: 500, chain: 'mirage', tier: 4, color: '#9f7740',
    lifeBurst: { chance: 1.0, animals: ['scorpion'], landmarks: ['lighthouse'] } },

  // ── Tundra Chains (frost / aurora / crystal) ──
  frost_1: { id: 'frost_1', name: 'Snowflake',    emoji: '❄️', points: 10, chain: 'frost', tier: 1, color: '#9fd8ff' },
  frost_2: { id: 'frost_2', name: 'Snowdrift',    emoji: '🌨️', points: 40, chain: 'frost', tier: 2, color: '#84c8f1' },
  frost_3: { id: 'frost_3', name: 'Ice Bloom',    emoji: '🧊', points: 150, chain: 'frost', tier: 3, color: '#66b3df',
    lifeBurst: { chance: 0.7, animals: ['penguin'] } },
  frost_4: { id: 'frost_4', name: 'Glacial Crown', emoji: '🏔️', points: 500, chain: 'frost', tier: 4, color: '#4b95bf',
    lifeBurst: { chance: 1.0, animals: ['polar_bear'], landmarks: ['ice_spire'] } },

  aurora_1: { id: 'aurora_1', name: 'Polar Spark',   emoji: '🌟', points: 10, chain: 'aurora', tier: 1, color: '#9ee7f4' },
  aurora_2: { id: 'aurora_2', name: 'Moon Halo',     emoji: '🌙', points: 40, chain: 'aurora', tier: 2, color: '#7ad5e4' },
  aurora_3: { id: 'aurora_3', name: 'Aurora Ribbon', emoji: '🌌', points: 150, chain: 'aurora', tier: 3, color: '#58bfd1',
    lifeBurst: { chance: 0.7, animals: ['snow_fox'] } },
  aurora_4: { id: 'aurora_4', name: 'Star Crown',    emoji: '🌠', points: 500, chain: 'aurora', tier: 4, color: '#3ea3b8',
    lifeBurst: { chance: 1.0, animals: ['snow_fox'], landmarks: ['northern_lights'] } },

  crystal_1: { id: 'crystal_1', name: 'Ice Shard',      emoji: '🔹', points: 10, chain: 'crystal', tier: 1, color: '#86b8ff' },
  crystal_2: { id: 'crystal_2', name: 'Crystal Prism',  emoji: '🔷', points: 40, chain: 'crystal', tier: 2, color: '#6ca3ef' },
  crystal_3: { id: 'crystal_3', name: 'Gem Shelf',      emoji: '💎', points: 150, chain: 'crystal', tier: 3, color: '#548ad8',
    lifeBurst: { chance: 0.7, animals: ['penguin'] } },
  crystal_4: { id: 'crystal_4', name: 'Prism Cathedral', emoji: '🪩', points: 500, chain: 'crystal', tier: 4, color: '#3c72bd',
    lifeBurst: { chance: 1.0, animals: ['polar_bear'], landmarks: ['northern_lights'] } },

  // ── Volcanic Chains (magma / ash / obsidian) ──
  magma_1: { id: 'magma_1', name: 'Ember Spark', emoji: '🔥', points: 10, chain: 'magma', tier: 1, color: '#ff8458' },
  magma_2: { id: 'magma_2', name: 'Lava Flow',   emoji: '🧨', points: 40, chain: 'magma', tier: 2, color: '#f56c43' },
  magma_3: { id: 'magma_3', name: 'Magma Vent',  emoji: '🌋', points: 150, chain: 'magma', tier: 3, color: '#d95233',
    lifeBurst: { chance: 0.7, animals: ['salamander'] } },
  magma_4: { id: 'magma_4', name: 'Inferno Core', emoji: '☄️', points: 500, chain: 'magma', tier: 4, color: '#b84026',
    lifeBurst: { chance: 1.0, animals: ['phoenix'], landmarks: ['lava_pool'] } },

  ash_1: { id: 'ash_1', name: 'Soot Puff',   emoji: '🌫️', points: 10, chain: 'ash', tier: 1, color: '#a3a0ab' },
  ash_2: { id: 'ash_2', name: 'Ash Cloud',   emoji: '💨', points: 40, chain: 'ash', tier: 2, color: '#8f8b97' },
  ash_3: { id: 'ash_3', name: 'Ember Squall', emoji: '🌪️', points: 150, chain: 'ash', tier: 3, color: '#7a7580',
    lifeBurst: { chance: 0.7, animals: ['salamander'] } },
  ash_4: { id: 'ash_4', name: 'Pyro Storm',  emoji: '🌩️', points: 500, chain: 'ash', tier: 4, color: '#66616b',
    lifeBurst: { chance: 1.0, animals: ['phoenix'], landmarks: ['sky_temple'] } },

  obsidian_1: { id: 'obsidian_1', name: 'Char Stone',     emoji: '🪨', points: 10, chain: 'obsidian', tier: 1, color: '#5b5965' },
  obsidian_2: { id: 'obsidian_2', name: 'Obsidian Shard', emoji: '◼️', points: 40, chain: 'obsidian', tier: 2, color: '#4a4853' },
  obsidian_3: { id: 'obsidian_3', name: 'Basalt Pillars', emoji: '🧱', points: 150, chain: 'obsidian', tier: 3, color: '#3d3b46',
    lifeBurst: { chance: 0.7, animals: ['goat', 'eagle'] } },
  obsidian_4: { id: 'obsidian_4', name: 'Forge Monolith', emoji: '🗻', points: 500, chain: 'obsidian', tier: 4, color: '#2f2d35',
    lifeBurst: { chance: 1.0, animals: ['phoenix'], landmarks: ['sky_temple'] } },

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
  waterfall:       { id: 'waterfall',       name: 'Waterfall',       emoji: '🏞️', points: 300 },
  lighthouse:      { id: 'lighthouse',      name: 'Lighthouse',      emoji: '🗼', points: 800 },
  treehouse:       { id: 'treehouse',       name: 'Treehouse',       emoji: '🏡', points: 300 },
  fairy_ring:      { id: 'fairy_ring',      name: 'Fairy Ring',      emoji: '🍄', points: 800 },
  sphinx:          { id: 'sphinx',          name: 'Sphinx',          emoji: '🦁', points: 300 },
  pyramid:         { id: 'pyramid',         name: 'Pyramid',         emoji: '🔺', points: 800 },
  ice_spire:       { id: 'ice_spire',       name: 'Ice Spire',       emoji: '🔷', points: 300 },
  northern_lights: { id: 'northern_lights', name: 'Northern Lights', emoji: '🌠', points: 800 },
};

// ── Biome Definitions ────────────────────────────────────────────────────────

export const BIOMES = {
  grassland: {
    id: 'grassland',
    name: 'Grassland',
    chains: { primary: 'meadow', secondary: 'bloom', tertiary: 'brook' },
    weights: { primary: 46, secondary: 30, tertiary: 24 },
    bgColor: '#E8F5E9',
    unlockScore: 0,
  },
  desert: {
    id: 'desert',
    name: 'Desert',
    chains: { primary: 'dune', secondary: 'relic', tertiary: 'mirage' },
    weights: { primary: 48, secondary: 30, tertiary: 22 },
    bgColor: '#FFF8E1',
    unlockScore: 5000,
  },
  tundra: {
    id: 'tundra',
    name: 'Tundra',
    chains: { primary: 'frost', secondary: 'aurora', tertiary: 'crystal' },
    weights: { primary: 48, secondary: 30, tertiary: 22 },
    bgColor: '#E3F2FD',
    unlockScore: 15000,
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic',
    chains: { primary: 'magma', secondary: 'ash', tertiary: 'obsidian' },
    weights: { primary: 50, secondary: 30, tertiary: 20 },
    bgColor: '#2D1F1B',
    unlockScore: 22000,
  },
};

// ── Level Definitions ────────────────────────────────────────────────────────

export const LEVELS = [
  // ── Grassland (levels 1-10) ──
  { id: 1,  biome: 'grassland', target: 300,  gridSize: 5, bonusGoals: [],
    stardust: 25, description: 'A new world begins.' },
  { id: 2,  biome: 'grassland', target: 500,  gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'meadow_2', count: 1, label: 'Create 1 Tall Meadow' }],
    stardust: 30, description: 'Grow your first meadow cluster.' },
  { id: 3,  biome: 'grassland', target: 800,  gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 1, label: 'Spawn 1 animal' }],
    stardust: 35, description: 'Life stirs on your planet.' },
  { id: 4,  biome: 'grassland', target: 1000, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'bloom_3', count: 1, label: 'Create 1 Floral Ring' }],
    stardust: 40, description: 'Wildflowers begin to flourish.' },
  { id: 5,  biome: 'grassland', target: 1500, gridSize: 5,
    bonusGoals: [
      { type: 'spawn_animals', count: 3, label: 'Spawn 3 animals' },
      { type: 'create_tile', tileId: 'brook_3', count: 1, label: 'Create 1 Singing Stream' },
    ],
    stardust: 50, description: 'Rivers flow, creatures gather.' },
  { id: 6,  biome: 'grassland', target: 2000, gridSize: 5,
    bonusGoals: [
      { type: 'create_tile', tileId: 'meadow_3', count: 1, label: 'Create 1 Verdant Field' },
      { type: 'create_tile', tileId: 'brook_3', count: 1, label: 'Create 1 Singing Stream' },
    ],
    stardust: 60, description: 'Your grassland ecosystem stabilizes.' },
  { id: 7,  biome: 'grassland', target: 2500, gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 5, label: 'Spawn 5 animals' }],
    stardust: 70, description: 'A thriving ecosystem.' },
  { id: 8,  biome: 'grassland', target: 3000, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'bloom_3', count: 2, label: 'Create 2 Floral Rings' }],
    stardust: 80, description: 'The bloom belt expands.' },
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

  // ── Desert (levels 11-20) ──
  { id: 11, biome: 'desert', target: 3000, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'dune_3', count: 1, label: 'Create 1 Oasis Palm' }],
    stardust: 80, description: 'Heat shimmers on the horizon.' },
  { id: 12, biome: 'desert', target: 4000, gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 2, label: 'Spawn 2 animals' }],
    stardust: 90, description: 'Life finds a way.' },
  { id: 13, biome: 'desert', target: 5000, gridSize: 5,
    bonusGoals: [{ type: 'build_landmark', count: 1, label: 'Build the Sphinx' }],
    stardust: 100, description: 'Ancient wonders rise.' },
  { id: 14, biome: 'desert', target: 6000, gridSize: 5,
    bonusGoals: [
      { type: 'create_tile', tileId: 'dune_3', count: 2, label: 'Create 2 Oasis Palms' },
      { type: 'spawn_animals', count: 4, label: 'Spawn 4 animals' },
    ],
    stardust: 120, description: 'The desert blooms.' },
  { id: 15, biome: 'desert', target: 7500, gridSize: 5,
    bonusGoals: [
      { type: 'spawn_animals', count: 5, label: 'Spawn 5 animals' },
      { type: 'build_landmark', count: 2, label: 'Build 2 landmarks' },
    ],
    stardust: 150, description: 'A mirage becomes real.' },
  { id: 16, biome: 'desert', target: 8200, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'dune_4', count: 1, label: 'Create 1 Golden Expanse' }],
    stardust: 170, description: 'Ancient stone wakes beneath the dunes.' },
  { id: 17, biome: 'desert', target: 9000, gridSize: 5,
    bonusGoals: [{ type: 'spawn_rare', count: 1, label: 'Spawn 1 rare creature' }],
    stardust: 180, description: 'Only the toughest life survives.' },
  { id: 18, biome: 'desert', target: 9800, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'mirage_4', count: 1, label: 'Create Mirage City' }],
    stardust: 195, description: 'Legends glimmer on the horizon.' },
  { id: 19, biome: 'desert', target: 10600, gridSize: 5,
    bonusGoals: [
      { type: 'build_landmark', count: 2, label: 'Build 2 landmarks' },
      { type: 'spawn_animal_types', count: 2, label: 'Spawn 2 species' },
    ],
    stardust: 210, description: 'Trade routes stretch across the sands.' },
  { id: 20, biome: 'desert', target: 11500, gridSize: 5,
    bonusGoals: [
      { type: 'spawn_animals', count: 6, label: 'Spawn 6 animals' },
      { type: 'build_landmark', count: 3, label: 'Build 3 landmarks' },
    ],
    stardust: 230, description: 'The desert kingdom stands eternal.' },

  // ── Tundra (levels 21-25) ──
  { id: 21, biome: 'tundra', target: 5000, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'frost_3', count: 1, label: 'Create 1 Ice Bloom' }],
    stardust: 160, description: 'A cold wind sweeps the world.' },
  { id: 22, biome: 'tundra', target: 6200, gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 3, label: 'Spawn 3 animals' }],
    stardust: 175, description: 'Tracks appear in the fresh snow.' },
  { id: 23, biome: 'tundra', target: 7600, gridSize: 5,
    bonusGoals: [{ type: 'build_landmark', count: 1, label: 'Build 1 landmark' }],
    stardust: 195, description: 'Ice crystals tower into the sky.' },
  { id: 24, biome: 'tundra', target: 9000, gridSize: 5,
    bonusGoals: [
      { type: 'create_tile', tileId: 'frost_4', count: 1, label: 'Create 1 Glacial Crown' },
      { type: 'spawn_rare', count: 2, label: 'Spawn 2 rare animals' },
    ],
    stardust: 215, description: 'Auroras dance over frozen seas.' },
  { id: 25, biome: 'tundra', target: 10500, gridSize: 5,
    bonusGoals: [
      { type: 'build_landmark', count: 2, label: 'Build 2 landmarks' },
      { type: 'spawn_animal_types', count: 3, label: 'Spawn 3 species' },
    ],
    stardust: 240, description: 'The polar realm reaches full bloom.' },

  // ── Volcanic (levels 26-30) ──
  { id: 26, biome: 'volcanic', target: 7200, gridSize: 5,
    bonusGoals: [{ type: 'create_tile', tileId: 'magma_4', count: 1, label: 'Create 1 Inferno Core' }],
    stardust: 185, description: 'Magma veins crack the crust.' },
  { id: 27, biome: 'volcanic', target: 8600, gridSize: 5,
    bonusGoals: [{ type: 'spawn_animals', count: 4, label: 'Spawn 4 animals' }],
    stardust: 205, description: 'Heat-loving creatures emerge.' },
  { id: 28, biome: 'volcanic', target: 10000, gridSize: 5,
    bonusGoals: [{ type: 'build_landmark', count: 2, label: 'Build 2 landmarks' }],
    stardust: 225, description: 'Basalt monuments pierce the ash.' },
  { id: 29, biome: 'volcanic', target: 11600, gridSize: 5,
    bonusGoals: [
      { type: 'create_tile', tileId: 'ash_4', count: 1, label: 'Create 1 Pyro Storm' },
      { type: 'spawn_rare', count: 2, label: 'Spawn 2 rare animals' },
    ],
    stardust: 250, description: 'Fire and sand forge strange wonders.' },
  { id: 30, biome: 'volcanic', target: 13200, gridSize: 5,
    bonusGoals: [
      { type: 'spawn_animals', count: 7, label: 'Spawn 7 animals' },
      { type: 'build_landmark', count: 3, label: 'Build 3 landmarks' },
    ],
    stardust: 280, description: 'A blazing world reaches equilibrium.' },
];
