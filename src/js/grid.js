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

  // BFS: find all connected tiles matching the given tileId starting from (row, col).
  // For wild tiles, they match any adjacent tile's id.
  findMergeGroup(row, col) {
    const startTile = this.cells[row][col];
    if (!startTile) return [];

    const targetId = startTile.id;
    if (targetId === 'wild') return []; // wild tiles don't initiate merges on their own

    const visited = new Set();
    const group = [];
    const queue = [[row, col]];
    visited.add(`${row},${col}`);

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const tile = this.cells[r][c];
      if (!tile) continue;

      // Match: same tile id, or wild tile
      if (tile.id === targetId || tile.id === 'wild') {
        group.push({ row: r, col: c, tile });
        // Explore neighbors
        for (const { row: nr, col: nc } of this.getAdjacent(r, c)) {
          const key = `${nr},${nc}`;
          if (!visited.has(key)) {
            visited.add(key);
            const neighborTile = this.cells[nr][nc];
            if (neighborTile && (neighborTile.id === targetId || neighborTile.id === 'wild')) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    return group;
  }

  // Check if the board is completely full.
  isFull() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.cells[r][c] === null) return true; // found empty = not full
      }
    }
    return false; // no empty cells
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
