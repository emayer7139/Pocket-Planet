// ── Tile Queue Manager ───────────────────────────────────────────────────────
// Generates upcoming tiles from weighted random pools based on biome.

import { TILES, BIOMES } from './tiles.js';

export class TileQueue {
  constructor(biomeId = 'grassland', previewCount = 2) {
    this.biome = BIOMES[biomeId];
    this.previewCount = previewCount;
    this.queue = [];
    this.turnCount = 0;
    this.wildCounter = 0;
    this.wildInterval = 12;

    // Fill the preview queue
    for (let i = 0; i < this.previewCount; i++) {
      this.queue.push(this._generate());
    }
  }

  // Peek at the next tile without removing it.
  peek() {
    return this.queue[0] || null;
  }

  // Get the full preview queue.
  peekAll() {
    return [...this.queue];
  }

  // Draw the next tile and generate a replacement.
  draw() {
    this.turnCount++;
    const tile = this.queue.shift();
    this.queue.push(this._generate());
    return tile;
  }

  // Set a specific next tile (used by tutorial).
  setNext(tileId) {
    this.queue[0] = { ...TILES[tileId] };
  }

  // Force the entire queue to specific tiles (for tutorial).
  setQueue(tileIds) {
    this.queue = tileIds.map(id => ({ ...TILES[id] }));
  }

  _generate() {
    // Wild tile check
    this.wildCounter++;
    if (this.wildCounter >= this.wildInterval) {
      this.wildCounter = 0;
      return { ...TILES.wild };
    }

    // Tier roll
    const tierRoll = Math.random() * 100;
    let tier;
    if (tierRoll < 85) tier = 1;
    else if (tierRoll < 97) tier = 2;
    else tier = 3;

    // Chain roll (biome-weighted)
    const chainRoll = Math.random() * 100;
    let chainKey;
    if (chainRoll < this.biome.weights.primary) {
      chainKey = this.biome.chains.primary;
    } else if (chainRoll < this.biome.weights.primary + this.biome.weights.secondary) {
      chainKey = this.biome.chains.secondary;
    } else {
      chainKey = this.biome.chains.tertiary;
    }

    // Clamp tier — T2 and T3 spawns only if that tile exists
    const tileId = `${chainKey}_${tier}`;
    if (TILES[tileId]) {
      return { ...TILES[tileId] };
    }
    // Fallback to T1
    return { ...TILES[`${chainKey}_1`] };
  }

  // Change biome (when switching levels).
  setBiome(biomeId) {
    this.biome = BIOMES[biomeId];
  }
}
