// ── Game State Manager ───────────────────────────────────────────────────────
// Orchestrates all game systems: grid, queue, merge engine, scoring, levels.

import { Grid } from './grid.js';
import { MergeEngine } from './mergeEngine.js';
import { TileQueue } from './tileQueue.js';
import { TILES, LEVELS, BIOMES, ANIMALS, LANDMARKS } from './tiles.js';
import { AudioManager } from './audio.js';

export class GameState {
  constructor() {
    this.audio = new AudioManager();
    this.currentLevel = 1;
    this.grid = null;
    this.queue = null;
    this.mergeEngine = null;
    this.score = 0;
    this.mergeBonus = 0;
    this.targetScore = 0;
    this.state = 'menu'; // menu | playing | won | lost | tutorial
    this.undoStack = [];
    this.maxUndos = 1;
    this.undosRemaining = 1;
    this.turnCount = 0;
    this.totalMerges = 0;
    this.chainMerges = 0;
    this.longestChain = 0;
    this.animalsSpawned = [];
    this.landmarksBuilt = [];
    this.tilesCreated = {};
    this.animalTypesSpawned = new Set();
    this.events = []; // pending animation events
    this.processing = false;
    this.stardust = 0;
    this.totalStardust = 0;
    this.levelsCompleted = {};
    this.collection = { tiles: {}, animals: {}, landmarks: {} };
    this.tutorialStep = -1; // -1 = not in tutorial
    this.onStateChange = null; // UI callback
    this.onEvent = null; // animation callback
    this.levelDef = null;

    this._loadSave();
  }

  // ── Level Management ─────────────────────────────────────────────────────

  startLevel(levelId) {
    this.levelDef = LEVELS.find(l => l.id === levelId);
    if (!this.levelDef) return;

    this.currentLevel = levelId;
    this.grid = new Grid(this.levelDef.gridSize);
    this.queue = new TileQueue(this.levelDef.biome, 2);
    this.score = 0;
    this.mergeBonus = 0;
    this.targetScore = this.levelDef.target;
    this.state = 'playing';
    this.undosRemaining = this.maxUndos;
    this.undoStack = [];
    this.turnCount = 0;
    this.totalMerges = 0;
    this.chainMerges = 0;
    this.longestChain = 0;
    this.animalsSpawned = [];
    this.landmarksBuilt = [];
    this.tilesCreated = {};
    this.animalTypesSpawned = new Set();
    this.events = [];
    this.processing = false;

    // Tutorial on level 1
    if (levelId === 1 && !this.levelsCompleted[1]) {
      this.state = 'tutorial';
      this.tutorialStep = 0;
      // Force tutorial queue
      this.queue.setQueue(['earth_1', 'earth_1']);
    }

    this._notify('levelStart');
  }

  // ── Core Gameplay ────────────────────────────────────────────────────────

  async placeTile(row, col) {
    if (this.state !== 'playing' && this.state !== 'tutorial') return false;
    if (this.processing) return false;

    const tile = this.queue.peek();
    if (!tile) return false;

    // Save state for undo
    this._saveUndoState();

    // Place the tile
    const success = this.grid.place(row, col, tile);
    if (!success) {
      this.undoStack.pop(); // revert undo save
      return false;
    }

    this.processing = true;
    this.turnCount++;

    // Draw next tile from queue
    this.queue.draw();

    // Sound
    this.audio.playPlace();

    // Emit place event
    this._emitEvent({ type: 'place', row, col, tile: { ...tile } });

    // Process merges
    const mergeEvents = await this._processMerges(row, col);

    // Update score
    this._recalculateScore();

    // Check win/loss
    this._checkEndCondition();

    this.processing = false;

    // Handle tutorial progression
    if (this.state === 'tutorial') {
      this._advanceTutorial(mergeEvents);
    }

    this._notify('turnEnd');
    return true;
  }

  async _processMerges(row, col) {
    const tile = this.grid.get(row, col);
    if (!tile || tile.isAnimal || tile.isLandmark) return [];
    if (tile.id === 'wild') return [];

    const allEvents = [];
    await this._chainMerge(row, col, allEvents, 0);
    return allEvents;
  }

  async _chainMerge(row, col, allEvents, chainStep) {
    const tile = this.grid.get(row, col);
    if (!tile || tile.isAnimal || tile.isLandmark) return;

    const group = this.grid.findMergeGroup(row, col);
    if (group.length < 3) return;

    // Determine next tier
    const baseTile = group.find(g => g.tile.id !== 'wild')?.tile || tile;
    const nextTileId = `${baseTile.chain}_${baseTile.tier + 1}`;
    const nextTileDef = TILES[nextTileId];
    if (!nextTileDef) return;

    // Calculate merge bonus
    let bonus = 20;
    if (group.length === 4) bonus = 50;
    if (group.length >= 5) bonus = 100;
    if (chainStep > 0) bonus += chainStep <= 1 ? 40 : chainStep <= 2 ? 80 : 150;

    this.mergeBonus += bonus;
    this.totalMerges++;
    if (chainStep > 0) this.chainMerges++;
    this.longestChain = Math.max(this.longestChain, chainStep + 1);

    // Track tile creation
    this.tilesCreated[nextTileId] = (this.tilesCreated[nextTileId] || 0) + 1;
    this._discoverTile(nextTileId);

    // Merge event for animations
    const mergeEvent = {
      type: 'merge',
      fromCells: group.map(g => ({ row: g.row, col: g.col, tile: { ...g.tile } })),
      toRow: row,
      toCol: col,
      resultTile: { ...nextTileDef },
      bonus,
      chainStep,
      groupSize: group.length,
    };
    allEvents.push(mergeEvent);
    this._emitEvent(mergeEvent);

    // Sound
    this.audio.playMerge(nextTileDef.tier, chainStep);

    // Remove group tiles
    for (const g of group) {
      this.grid.remove(g.row, g.col);
    }

    // Place result
    this.grid.place(row, col, nextTileDef);

    // Life burst
    if (nextTileDef.lifeBurst) {
      this._processLifeBurst(row, col, nextTileDef);
    }

    // Chain: check if the new tile can merge again
    await this._chainMerge(row, col, allEvents, chainStep + 1);
  }

  _processLifeBurst(row, col, tileDef) {
    const lb = tileDef.lifeBurst;
    if (!lb || Math.random() > lb.chance) return;

    const spawnCount = lb.count || 1;
    for (let i = 0; i < spawnCount; i++) {
      let spawnType, spawnDef;

      if (i === 0 && lb.animals && lb.animals.length > 0) {
        spawnType = 'animal';
        const animalId = lb.animals[Math.floor(Math.random() * lb.animals.length)];
        spawnDef = ANIMALS[animalId];
      } else if (lb.landmarks && lb.landmarks.length > 0) {
        spawnType = 'landmark';
        const lmId = lb.landmarks[Math.floor(Math.random() * lb.landmarks.length)];
        spawnDef = LANDMARKS[lmId];
      } else if (lb.animals && lb.animals.length > 0) {
        spawnType = 'animal';
        const animalId = lb.animals[Math.floor(Math.random() * lb.animals.length)];
        spawnDef = ANIMALS[animalId];
      }

      if (!spawnDef) continue;

      // Find spawn position
      const emptyAdj = this.grid.findEmptyAdjacent(row, col);
      let spawnPos = emptyAdj.length > 0
        ? emptyAdj[Math.floor(Math.random() * emptyAdj.length)]
        : this.grid.findNearestEmpty(row, col);

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

      if (spawnPos) {
        this.grid.place(spawnPos.row, spawnPos.col, entityTile);

        if (spawnType === 'animal') {
          this.animalsSpawned.push(spawnDef.id);
          this.animalTypesSpawned.add(spawnDef.id);
          this._discoverAnimal(spawnDef.id);
        } else {
          this.landmarksBuilt.push(spawnDef.id);
          this._discoverLandmark(spawnDef.id);
        }

        this.audio.playLifeBurst(spawnDef.rarity || 'common');

        this._emitEvent({
          type: 'lifeBurst',
          spawnType,
          entity: spawnDef,
          row: spawnPos.row,
          col: spawnPos.col,
          sourceRow: row,
          sourceCol: col,
        });
      }
    }
  }

  // ── Score ─────────────────────────────────────────────────────────────────

  _recalculateScore() {
    this.score = this.grid.calculateScore() + this.mergeBonus;
  }

  getTotalScore() {
    return this.score;
  }

  getProgress() {
    return Math.min(1, this.score / this.targetScore);
  }

  // ── Bonus Goals ──────────────────────────────────────────────────────────

  getBonusGoalStatus() {
    if (!this.levelDef || !this.levelDef.bonusGoals) return [];
    return this.levelDef.bonusGoals.map(goal => {
      let current = 0;
      switch (goal.type) {
        case 'create_tile':
          current = this.tilesCreated[goal.tileId] || 0;
          break;
        case 'spawn_animals':
          current = this.animalsSpawned.length;
          break;
        case 'spawn_rare':
          current = this.animalsSpawned.filter(id => {
            const a = ANIMALS[id];
            return a && (a.rarity === 'rare' || a.rarity === 'legendary');
          }).length;
          break;
        case 'spawn_animal_types':
          current = this.animalTypesSpawned.size;
          break;
        case 'build_landmark':
          current = this.landmarksBuilt.length;
          break;
      }
      return { ...goal, current, completed: current >= goal.count };
    });
  }

  // ── Win / Loss ───────────────────────────────────────────────────────────

  _checkEndCondition() {
    // Win?
    if (this.score >= this.targetScore) {
      this.state = 'won';
      this.audio.playWin();
      this._onWin();
      this._notify('win');
      return;
    }

    // Loss? Board full with no possible merges
    if (this.grid.emptyCount() === 0) {
      // Check if any merges are possible
      let hasMerge = false;
      for (let r = 0; r < this.grid.size; r++) {
        for (let c = 0; c < this.grid.size; c++) {
          const tile = this.grid.get(r, c);
          if (tile && !tile.isAnimal && !tile.isLandmark && tile.id !== 'wild') {
            const group = this.grid.findMergeGroup(r, c);
            if (group.length >= 3) { hasMerge = true; break; }
          }
        }
        if (hasMerge) break;
      }

      if (!hasMerge) {
        this.state = 'lost';
        this.audio.playLoss();
        this._notify('loss');
      }
    }
  }

  _onWin() {
    // Calculate stardust reward
    const baseDust = this.levelDef ? this.levelDef.stardust : 25;
    const bonusGoals = this.getBonusGoalStatus();
    const completedGoals = bonusGoals.filter(g => g.completed).length;

    let bonusDust = 0;
    if (completedGoals === 1) bonusDust = 30;
    else if (completedGoals === 2) bonusDust = 75;
    else if (completedGoals >= 3) bonusDust = 150;

    const earned = baseDust + bonusDust;
    this.stardust += earned;
    this.totalStardust += earned;

    // Mark level complete
    this.levelsCompleted[this.currentLevel] = {
      bestScore: Math.max(this.score, (this.levelsCompleted[this.currentLevel]?.bestScore || 0)),
      bonusCompleted: completedGoals,
    };

    this._save();
  }

  getWinReward() {
    const baseDust = this.levelDef ? this.levelDef.stardust : 25;
    const bonusGoals = this.getBonusGoalStatus();
    const completedGoals = bonusGoals.filter(g => g.completed).length;
    let bonusDust = 0;
    if (completedGoals === 1) bonusDust = 30;
    else if (completedGoals === 2) bonusDust = 75;
    else if (completedGoals >= 3) bonusDust = 150;
    return { base: baseDust, bonus: bonusDust, total: baseDust + bonusDust };
  }

  getLossReward() {
    return { base: Math.floor(10 + this.score / 100), total: Math.floor(10 + this.score / 100) };
  }

  // ── Undo ─────────────────────────────────────────────────────────────────

  _saveUndoState() {
    this.undoStack.push({
      gridSnap: this.grid.snapshot(),
      queueSnap: this.queue.peekAll().map(t => ({ ...t })),
      score: this.score,
      mergeBonus: this.mergeBonus,
      turnCount: this.turnCount,
      animalsSpawned: [...this.animalsSpawned],
      landmarksBuilt: [...this.landmarksBuilt],
      tilesCreated: { ...this.tilesCreated },
      animalTypes: new Set(this.animalTypesSpawned),
    });
    // Keep only last undo
    if (this.undoStack.length > 1) this.undoStack.shift();
  }

  canUndo() {
    return this.undosRemaining > 0 && this.undoStack.length > 0 && this.state === 'playing';
  }

  undo() {
    if (!this.canUndo()) return false;

    const snap = this.undoStack.pop();
    this.grid.restore(snap.gridSnap);
    this.queue.setQueue(snap.queueSnap.map(t => t.id));
    this.score = snap.score;
    this.mergeBonus = snap.mergeBonus;
    this.turnCount = snap.turnCount;
    this.animalsSpawned = snap.animalsSpawned;
    this.landmarksBuilt = snap.landmarksBuilt;
    this.tilesCreated = snap.tilesCreated;
    this.animalTypesSpawned = snap.animalTypes;
    this.undosRemaining--;

    this.audio.playUndo();
    this._notify('undo');
    return true;
  }

  // ── Tutorial ─────────────────────────────────────────────────────────────

  getTutorialMessage() {
    const messages = [
      { text: 'A tiny world is born. Tap anywhere to place your rock.', highlight: 'all' },
      { text: 'Place two more rocks near each other.', highlight: 'adjacent' },
      { text: 'Three rocks became a hill! Merging is the heart of your planet.', highlight: null },
      { text: 'Different elements shape your world. Try placing them!', highlight: 'all' },
      { text: 'A new friend! Merging higher tiles brings life to your planet.', highlight: null },
      { text: 'Reach the Planet Score to complete your planet. Keep merging!', highlight: null },
    ];
    if (this.tutorialStep >= 0 && this.tutorialStep < messages.length) {
      return messages[this.tutorialStep];
    }
    return null;
  }

  _advanceTutorial(mergeEvents) {
    if (this.tutorialStep === 0 && this.turnCount >= 1) {
      this.tutorialStep = 1;
      this.queue.setQueue(['earth_1', 'earth_1']);
      this._notify('tutorial');
    } else if (this.tutorialStep === 1 && mergeEvents.length > 0) {
      this.tutorialStep = 2;
      this._notify('tutorial');
      // After a short pause, move to step 3
      setTimeout(() => {
        this.tutorialStep = 3;
        this._notify('tutorial');
      }, 1500);
    } else if (this.tutorialStep === 1 && this.turnCount >= 3) {
      // They placed 3 rocks but didn't merge — still continue
      this.tutorialStep = 3;
      this._notify('tutorial');
    } else if (this.tutorialStep === 3) {
      if (mergeEvents.length > 0) {
        // Check for life burst
        const hasLifeBurst = this.animalsSpawned.length > 0 || this.landmarksBuilt.length > 0;
        if (hasLifeBurst) {
          this.tutorialStep = 4;
          this._notify('tutorial');
          setTimeout(() => {
            this.tutorialStep = 5;
            this.state = 'playing';
            this._notify('tutorial');
          }, 2000);
        }
      }
      if (this.turnCount >= 8 && this.tutorialStep === 3) {
        // Force end tutorial
        this.tutorialStep = 5;
        this.state = 'playing';
        this._notify('tutorial');
      }
    }
  }

  // ── Collection ───────────────────────────────────────────────────────────

  _discoverTile(tileId) {
    if (!this.collection.tiles[tileId]) {
      this.collection.tiles[tileId] = { count: 0, discovered: true };
    }
    this.collection.tiles[tileId].count++;
  }

  _discoverAnimal(animalId) {
    if (!this.collection.animals[animalId]) {
      this.collection.animals[animalId] = { count: 0, discovered: true, isNew: true };
    } else {
      this.collection.animals[animalId].isNew = false;
    }
    this.collection.animals[animalId].count++;
  }

  _discoverLandmark(landmarkId) {
    if (!this.collection.landmarks[landmarkId]) {
      this.collection.landmarks[landmarkId] = { count: 0, discovered: true, isNew: true };
    } else {
      this.collection.landmarks[landmarkId].isNew = false;
    }
    this.collection.landmarks[landmarkId].count++;
  }

  getNewDiscoveries() {
    const discoveries = [];
    for (const [id, data] of Object.entries(this.collection.animals)) {
      if (data.isNew) {
        discoveries.push({ type: 'animal', ...ANIMALS[id] });
        data.isNew = false;
      }
    }
    for (const [id, data] of Object.entries(this.collection.landmarks)) {
      if (data.isNew) {
        discoveries.push({ type: 'landmark', ...LANDMARKS[id] });
        data.isNew = false;
      }
    }
    return discoveries;
  }

  // ── Level Navigation ─────────────────────────────────────────────────────

  getAvailableLevels() {
    return LEVELS.map(level => ({
      ...level,
      unlocked: level.id === 1 || this.levelsCompleted[level.id - 1],
      completed: !!this.levelsCompleted[level.id],
      bestScore: this.levelsCompleted[level.id]?.bestScore || 0,
    }));
  }

  getNextLevelId() {
    const next = this.currentLevel + 1;
    return LEVELS.find(l => l.id === next) ? next : null;
  }

  getBiomeForLevel(levelId) {
    const level = LEVELS.find(l => l.id === levelId);
    return level ? BIOMES[level.biome] : BIOMES.grassland;
  }

  // ── Save / Load ──────────────────────────────────────────────────────────

  _save() {
    try {
      const data = {
        stardust: this.stardust,
        totalStardust: this.totalStardust,
        levelsCompleted: this.levelsCompleted,
        collection: this.collection,
        currentLevel: this.currentLevel,
      };
      localStorage.setItem('pocketPlanetSave', JSON.stringify(data));
    } catch (e) {
      // localStorage not available
    }
  }

  _loadSave() {
    try {
      const raw = localStorage.getItem('pocketPlanetSave');
      if (raw) {
        const data = JSON.parse(raw);
        this.stardust = data.stardust || 0;
        this.totalStardust = data.totalStardust || 0;
        this.levelsCompleted = data.levelsCompleted || {};
        this.collection = data.collection || { tiles: {}, animals: {}, landmarks: {} };
        this.currentLevel = data.currentLevel || 1;
      }
    } catch (e) {
      // corrupted save, start fresh
    }
  }

  resetSave() {
    this.stardust = 0;
    this.totalStardust = 0;
    this.levelsCompleted = {};
    this.collection = { tiles: {}, animals: {}, landmarks: {} };
    this.currentLevel = 1;
    localStorage.removeItem('pocketPlanetSave');
  }

  // ── Event Bus ────────────────────────────────────────────────────────────

  _emitEvent(event) {
    if (this.onEvent) this.onEvent(event);
  }

  _notify(type) {
    if (this.onStateChange) this.onStateChange(type);
  }
}
