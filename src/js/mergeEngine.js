// ── Merge Engine ─────────────────────────────────────────────────────────────
// Detects merges, executes them, handles chain cascading, triggers life bursts.

import { TILES, getNextTier, ANIMALS, LANDMARKS } from './tiles.js';

export class MergeEngine {
  constructor(grid, onMerge, onLifeBurst, onChainStep) {
    this.grid = grid;
    this.onMerge = onMerge || (() => {});           // callback(mergeData)
    this.onLifeBurst = onLifeBurst || (() => {});    // callback(burstData)
    this.onChainStep = onChainStep || (() => {});    // callback(step)
  }

  // After placing a tile at (row, col), check for and execute merges.
  // Returns an array of merge events (for animation sequencing).
  async processPlace(row, col) {
    const events = [];
    await this._checkAndMerge(row, col, events, 0);
    return events;
  }

  async _checkAndMerge(row, col, events, chainStep) {
    const tile = this.grid.get(row, col);
    if (!tile || tile.id === 'wild') return;
    if (tile.isAnimal || tile.isLandmark) return;

    const group = this.grid.findMergeGroup(row, col);
    if (group.length < 3) return;

    // Determine the merge result
    const nextTileId = getNextTier(tile.id);
    if (!nextTileId) return; // max tier, no merge possible

    const nextTileDef = TILES[nextTileId];
    if (!nextTileDef) return;

    // Calculate merge bonus
    let mergeBonus = 20; // standard 3-tile
    if (group.length === 4) mergeBonus = 50;
    if (group.length >= 5) mergeBonus = 100;
    if (chainStep > 0) {
      mergeBonus += chainStep <= 1 ? 40 : chainStep <= 2 ? 80 : 150;
    }

    // Create merge event
    const mergeEvent = {
      type: 'merge',
      fromTiles: group.map(g => ({ row: g.row, col: g.col, tile: { ...g.tile } })),
      resultRow: row,
      resultCol: col,
      resultTile: { ...nextTileDef, row, col },
      mergeBonus,
      chainStep,
      groupSize: group.length,
    };

    // Remove all tiles in the group from the grid
    for (const g of group) {
      this.grid.remove(g.row, g.col);
    }

    // Place the result tile at the merge point
    this.grid.place(row, col, nextTileDef);

    events.push(mergeEvent);
    this.onMerge(mergeEvent);

    if (chainStep > 0) {
      this.onChainStep(chainStep);
    }

    // Check for life burst
    if (nextTileDef.lifeBurst) {
      const burstEvents = this._processLifeBurst(row, col, nextTileDef);
      for (const be of burstEvents) {
        events.push(be);
        this.onLifeBurst(be);
      }
    }

    // Check for chain merge (the new tile might form another group)
    await this._checkAndMerge(row, col, events, chainStep + 1);
  }

  _processLifeBurst(row, col, tileDef) {
    const bursts = [];
    const lb = tileDef.lifeBurst;
    if (!lb) return bursts;

    // Roll chance
    if (Math.random() > lb.chance) return bursts;

    const spawnCount = lb.count || 1;

    for (let i = 0; i < spawnCount; i++) {
      // Decide: animal or landmark?
      let spawnType, spawnDef;

      if (lb.landmarks && lb.animals) {
        // T4+: can spawn either or both
        if (i === 0 && lb.animals.length > 0) {
          spawnType = 'animal';
          const animalId = lb.animals[Math.floor(Math.random() * lb.animals.length)];
          spawnDef = ANIMALS[animalId];
        } else if (lb.landmarks.length > 0) {
          spawnType = 'landmark';
          const landmarkId = lb.landmarks[Math.floor(Math.random() * lb.landmarks.length)];
          spawnDef = LANDMARKS[landmarkId];
        }
      } else if (lb.animals && lb.animals.length > 0) {
        spawnType = 'animal';
        const animalId = lb.animals[Math.floor(Math.random() * lb.animals.length)];
        spawnDef = ANIMALS[animalId];
      }

      if (!spawnDef) continue;

      // Find spawn location
      const emptyAdj = this.grid.findEmptyAdjacent(row, col);
      let spawnPos;
      if (emptyAdj.length > 0) {
        spawnPos = emptyAdj[Math.floor(Math.random() * emptyAdj.length)];
      } else {
        spawnPos = this.grid.findNearestEmpty(row, col);
      }

      if (spawnPos) {
        const entityTile = {
          id: `${spawnType}_${spawnDef.id}`,
          name: spawnDef.name,
          emoji: spawnDef.emoji,
          points: spawnDef.points,
          chain: 'entity',
          tier: 0,
          isAnimal: spawnType === 'animal',
          isLandmark: spawnType === 'landmark',
          entityId: spawnDef.id,
          rarity: spawnDef.rarity || 'common',
          color: spawnType === 'animal' ? '#FFB74D' : '#CE93D8',
        };

        this.grid.place(spawnPos.row, spawnPos.col, entityTile);

        bursts.push({
          type: 'lifeBurst',
          spawnType,
          entity: spawnDef,
          row: spawnPos.row,
          col: spawnPos.col,
          sourceRow: row,
          sourceCol: col,
        });
      } else {
        // No room — collected but not placed
        bursts.push({
          type: 'lifeBurst',
          spawnType,
          entity: spawnDef,
          row: null,
          col: null,
          sourceRow: row,
          sourceCol: col,
          noRoom: true,
        });
      }
    }

    return bursts;
  }
}
