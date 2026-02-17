// ── Grid Manager ─────────────────────────────────────────────────────────────
// Manages the NxN grid state, tile placement, adjacency, and board queries.

import { TILES } from './tiles.js';

export class Grid {
  constructor(size = 5) {
    this.size = size;
    this.cells = [];
    this.clear();
  }

  clear() {
    this.cells = [];
    for (let r = 0; r < this.size; r++) {
      this.cells[r] = [];
      for (let c = 0; c < this.size; c++) {
        this.cells[r][c] = null; // null = empty
      }
    }
  }

  // Place a tile object at (row, col). Returns false if occupied.
  place(row, col, tile) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return false;
    if (this.cells[row][col] !== null) return false;
    this.cells[row][col] = { ...tile, row, col };
    return true;
  }

  // Remove tile at (row, col). Returns the removed tile or null.
  remove(row, col) {
    const tile = this.cells[row][col];
    this.cells[row][col] = null;
    return tile;
  }

  // Get tile at (row, col) or null.
  get(row, col) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return null;
    return this.cells[row][col];
  }

  // Get orthogonal neighbors of (row, col).
  getAdjacent(row, col) {
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const neighbors = [];
    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
        neighbors.push({ row: nr, col: nc, tile: this.cells[nr][nc] });
      }
    }
    return neighbors;
  }

  // BFS: find exactly 3 connected tiles matching the given tileId starting from (row, col).
  // Wild tiles act as wildcards but are only consumed when needed to reach 3.
  findMergeGroup(row, col) {
    const startTile = this.cells[row][col];
    if (!startTile) return [];

    const evaluateGroupForTarget = (targetId) => {
      if (!targetId || targetId === 'wild') return [];

      const visited = new Set();
      const group = [];
      // Two queues: non-wild tiles are explored first so wilds are only
      // consumed when needed to reach a group of 3.
      const primaryQueue = [[row, col]];   // non-wild matches
      const wildQueue = [];                // wild matches
      visited.add(`${row},${col}`);

      while (group.length < 3 && (primaryQueue.length > 0 || wildQueue.length > 0)) {
        // Prefer non-wild tiles over wild tiles.
        const [r, c] = primaryQueue.length > 0 ? primaryQueue.shift() : wildQueue.shift();
        const tile = this.cells[r][c];
        if (!tile) continue;

        if (tile.id === targetId || tile.id === 'wild') {
          group.push({ row: r, col: c, tile });
          if (group.length >= 3) break;

          for (const { row: nr, col: nc } of this.getAdjacent(r, c)) {
            const key = `${nr},${nc}`;
            if (visited.has(key)) continue;

            const neighborTile = this.cells[nr][nc];
            if (!neighborTile) continue;

            if (neighborTile.id === targetId) {
              visited.add(key);
              primaryQueue.push([nr, nc]);
            } else if (neighborTile.id === 'wild') {
              visited.add(key);
              wildQueue.push([nr, nc]);
            }
          }
        }
      }

      return group;
    };

    if (startTile.id !== 'wild') {
      return evaluateGroupForTarget(startTile.id);
    }

    // Wild can initiate merges; pick the best target chain touching connected wild tiles.
    const candidates = new Set();
    const wildVisited = new Set([`${row},${col}`]);
    const wQueue = [[row, col]];
    while (wQueue.length > 0) {
      const [wr, wc] = wQueue.shift();
      for (const { row: nr, col: nc, tile } of this.getAdjacent(wr, wc)) {
        if (!tile) continue;
        const key = `${nr},${nc}`;
        if (tile.id === 'wild') {
          if (!wildVisited.has(key)) {
            wildVisited.add(key);
            wQueue.push([nr, nc]);
          }
          continue;
        }

        if (tile.isAnimal || tile.isLandmark) continue;
        candidates.add(tile.id);
      }
    }

    let best = [];
    for (const targetId of candidates) {
      const group = evaluateGroupForTarget(targetId);
      if (group.length > best.length) best = group;
    }

    return best;
  }

  // Check if the board is completely full.
  isFull() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.cells[r][c] === null) return false;
      }
    }
    return true;
  }

  // Count empty cells.
  emptyCount() {
    let count = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.cells[r][c] === null) count++;
      }
    }
    return count;
  }

  // Find the nearest empty cell to (row, col) using BFS.
  findNearestEmpty(row, col) {
    const visited = new Set();
    const queue = [[row, col]];
    visited.add(`${row},${col}`);

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      if (this.cells[r][c] === null) return { row: r, col: c };
      for (const { row: nr, col: nc } of this.getAdjacent(r, c)) {
        const key = `${nr},${nc}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    return null; // no empty cell
  }

  // Find empty cells adjacent to (row, col).
  findEmptyAdjacent(row, col) {
    return this.getAdjacent(row, col).filter(n => n.tile === null);
  }

  // Get all tiles on the board as a flat array.
  allTiles() {
    const tiles = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.cells[r][c] !== null) {
          tiles.push(this.cells[r][c]);
        }
      }
    }
    return tiles;
  }

  // Deep clone the grid state (for undo).
  snapshot() {
    const snap = [];
    for (let r = 0; r < this.size; r++) {
      snap[r] = [];
      for (let c = 0; c < this.size; c++) {
        snap[r][c] = this.cells[r][c] ? { ...this.cells[r][c] } : null;
      }
    }
    return snap;
  }

  // Restore from a snapshot.
  restore(snap) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        this.cells[r][c] = snap[r][c] ? { ...snap[r][c] } : null;
      }
    }
  }

  // Calculate total planet score from all tiles on the board.
  calculateScore() {
    let score = 0;
    for (const tile of this.allTiles()) {
      score += tile.points || 0;
    }
    return score;
  }
}
