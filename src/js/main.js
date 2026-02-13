// ── Pocket Planet Merge — Main UI Controller ─────────────────────────────────
// Renders all screens, handles input, drives animations.

import { GameState } from './gameState.js';
import { TILES, LEVELS, BIOMES, ANIMALS, LANDMARKS } from './tiles.js';

const game = new GameState();

// ── DOM References ───────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
  menu: $('#menu-screen'),
  levels: $('#levels-screen'),
  game: $('#game-screen'),
  result: $('#result-screen'),
  collection: $('#collection-screen'),
};

// ── Screen Management ────────────────────────────────────────────────────────
function showScreen(name) {
  for (const s of Object.values(screens)) s.classList.remove('active');
  screens[name].classList.add('active');
}

// ── Menu Screen ──────────────────────────────────────────────────────────────
function renderMenu() {
  $('#menu-stardust').textContent = `${game.stardust} Stardust`;
  showScreen('menu');
}

// ── Level Select ─────────────────────────────────────────────────────────────
function renderLevels() {
  const container = $('#levels-list');
  container.innerHTML = '';
  const levels = game.getAvailableLevels();
  let currentBiome = null;

  for (const level of levels) {
    if (level.biome !== currentBiome) {
      currentBiome = level.biome;
      const biome = BIOMES[currentBiome];
      const label = document.createElement('div');
      label.className = 'biome-label';
      label.style.gridColumn = '1 / -1';
      label.textContent = biome ? biome.name : currentBiome;
      container.appendChild(label);
    }

    const node = document.createElement('div');
    node.className = 'level-node';
    if (level.completed) node.classList.add('completed');
    else if (level.unlocked && !level.completed) node.classList.add('current');
    else node.classList.add('locked');

    node.innerHTML = `<span>${level.id}</span>`;
    if (level.bestScore > 0) {
      node.innerHTML += `<span class="level-score">${level.bestScore}</span>`;
    }

    if (level.unlocked) {
      node.addEventListener('click', () => {
        game.audio.init();
        game.audio.resume();
        game.audio.playTap();
        game.startLevel(level.id);
        renderGame();
        showScreen('game');
      });
    }
    container.appendChild(node);
  }

  showScreen('levels');
}

// ── Gameplay Screen ──────────────────────────────────────────────────────────
let gridEl = null;
let cellEls = [];

function renderGame() {
  const biome = game.getBiomeForLevel(game.currentLevel);
  document.body.style.background = biome.bgColor;
  $('#game-screen').style.background = 'transparent';

  renderGrid();
  renderScore();
  renderQueue();
  renderBonusGoals();
  renderUndoButton();
  renderTutorial();
}

function renderGrid() {
  gridEl = $('#game-grid');
  gridEl.innerHTML = '';
  gridEl.className = `grid size-${game.grid.size}`;
  cellEls = [];

  for (let r = 0; r < game.grid.size; r++) {
    cellEls[r] = [];
    for (let c = 0; c < game.grid.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('click', () => handleCellClick(r, c));

      gridEl.appendChild(cell);
      cellEls[r][c] = cell;
    }
  }

  refreshGridTiles();
}

function refreshGridTiles(animatedCells = {}) {
  for (let r = 0; r < game.grid.size; r++) {
    for (let c = 0; c < game.grid.size; c++) {
      const cell = cellEls[r][c];
      const tile = game.grid.get(r, c);

      // Clear existing tile content
      const existing = cell.querySelector('.tile');
      if (existing) existing.remove();

      if (tile) {
        cell.classList.add('occupied');
        const tileEl = document.createElement('div');
        tileEl.className = 'tile';

        const key = `${r},${c}`;
        if (animatedCells[key] === 'merge-result') {
          tileEl.classList.add('merged-result');
        } else if (animatedCells[key] === 'life-burst') {
          tileEl.classList.add('life-burst', 'entity');
        } else if (animatedCells[key] === 'merging') {
          tileEl.classList.add('merging');
        } else if (tile.isAnimal || tile.isLandmark) {
          tileEl.classList.add('entity');
        }

        tileEl.textContent = tile.emoji;

        if (tile.tier > 0 && !tile.isAnimal && !tile.isLandmark) {
          const tierBadge = document.createElement('span');
          tierBadge.className = 'tile-tier';
          tierBadge.textContent = 'T' + tile.tier;
          tileEl.appendChild(tierBadge);
        }

        cell.appendChild(tileEl);
      } else {
        cell.classList.remove('occupied');
      }
    }
  }
}

async function handleCellClick(row, col) {
  if (game.state !== 'playing' && game.state !== 'tutorial') return;
  if (game.processing) return;
  if (game.grid.get(row, col) !== null) return;

  game.audio.resume();

  // Snapshot queue before placing
  const placedTile = game.queue.peek();
  const success = await game.placeTile(row, col);
  if (!success) return;

  // Animate: show the placed tile
  refreshGridTiles({ [`${row},${col}`]: 'place' });

  // Small delay then process merge visuals
  await sleep(100);

  // Refresh with any merge results
  const animated = {};
  // Check what changed — find merge results and life bursts
  for (let r = 0; r < game.grid.size; r++) {
    for (let c = 0; c < game.grid.size; c++) {
      const tile = game.grid.get(r, c);
      if (tile && tile.isAnimal) animated[`${r},${c}`] = 'life-burst';
      if (tile && tile.isLandmark) animated[`${r},${c}`] = 'life-burst';
    }
  }
  refreshGridTiles(animated);
  renderScore();
  renderQueue();
  renderBonusGoals();
  renderUndoButton();
  renderTutorial();

  // Check for end state
  if (game.state === 'won' || game.state === 'lost') {
    await sleep(600);
    renderResult();
  }
}

function renderScore() {
  const scoreEl = $('#score-current');
  const oldScore = parseInt(scoreEl.textContent) || 0;
  scoreEl.textContent = game.getTotalScore();

  if (game.getTotalScore() > oldScore) {
    scoreEl.classList.remove('bump');
    void scoreEl.offsetWidth; // force reflow
    scoreEl.classList.add('bump');
  }

  $('#score-target').textContent = `Target: ${game.targetScore}`;
  const pct = Math.min(100, Math.round(game.getProgress() * 100));
  $('#score-bar-fill').style.width = pct + '%';
}

function renderQueue() {
  const q = game.queue.peekAll();
  const container = $('#queue-display');
  container.innerHTML = '';

  q.forEach((tile, i) => {
    if (i > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'queue-arrow';
      arrow.textContent = '\u2192';
      container.appendChild(arrow);
    }

    const qTile = document.createElement('div');
    qTile.className = 'queue-tile' + (i === 0 ? ' next' : '');
    qTile.textContent = tile.emoji;

    const label = document.createElement('span');
    label.className = 'queue-tile-label';
    label.textContent = i === 0 ? 'Next' : 'Then';
    qTile.appendChild(label);

    container.appendChild(qTile);
  });
}

function renderBonusGoals() {
  const container = $('#bonus-goals');
  container.innerHTML = '';
  const goals = game.getBonusGoalStatus();
  for (const goal of goals) {
    const el = document.createElement('span');
    el.className = 'bonus-goal' + (goal.completed ? ' completed' : '');
    el.textContent = goal.label;
    container.appendChild(el);
  }
}

function renderUndoButton() {
  const btn = $('#undo-btn');
  btn.disabled = !game.canUndo();
  $('#undo-count').textContent = game.undosRemaining;
}

function renderTutorial() {
  const banner = $('#tutorial-banner');
  const msg = game.getTutorialMessage();
  if (msg && (game.state === 'tutorial' || game.tutorialStep >= 0)) {
    banner.textContent = msg.text;
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }
}

// ── Undo Handler ─────────────────────────────────────────────────────────────
function handleUndo() {
  if (game.undo()) {
    refreshGridTiles();
    renderScore();
    renderQueue();
    renderBonusGoals();
    renderUndoButton();
  }
}

// ── Result Screen ────────────────────────────────────────────────────────────
function renderResult() {
  const isWin = game.state === 'won';

  // Fireworks on win
  if (isWin) spawnFireworks();

  $('#result-icon').textContent = isWin ? '\uD83C\uDF0D' : '\uD83D\uDE14';
  const titleEl = $('#result-title');
  titleEl.textContent = isWin ? 'Planet Complete!' : 'Planet Full!';
  titleEl.className = 'result-title ' + (isWin ? 'win' : 'loss');

  // Score breakdown
  const scoreRows = $('#result-score-rows');
  scoreRows.innerHTML = '';
  addResultRow(scoreRows, 'Planet Score', game.grid.calculateScore());
  addResultRow(scoreRows, 'Merge Bonuses', game.mergeBonus);
  if (game.animalsSpawned.length > 0) {
    addResultRow(scoreRows, 'Animals', game.animalsSpawned.length);
  }
  if (game.landmarksBuilt.length > 0) {
    addResultRow(scoreRows, 'Landmarks', game.landmarksBuilt.length);
  }
  addResultRow(scoreRows, 'Total', game.getTotalScore(), true);

  // Stardust
  const reward = isWin ? game.getWinReward() : game.getLossReward();
  $('#result-stardust').textContent = `+${reward.total} Stardust`;

  // Bonus goals
  const bonusContainer = $('#result-bonus');
  bonusContainer.innerHTML = '';
  const goals = game.getBonusGoalStatus();
  for (const goal of goals) {
    const el = document.createElement('div');
    el.className = 'bonus-result ' + (goal.completed ? 'done' : 'missed');
    el.innerHTML = `<span>${goal.completed ? '\u2713' : '\u2717'} ${goal.label}</span><span>${goal.current}/${goal.count}</span>`;
    bonusContainer.appendChild(el);
  }

  // Discoveries
  const discContainer = $('#result-discoveries');
  discContainer.innerHTML = '';
  const discoveries = game.getNewDiscoveries();
  for (const d of discoveries) {
    const badge = document.createElement('div');
    badge.className = 'discovery-badge';
    badge.innerHTML = `<span class="new-tag">NEW!</span> ${d.emoji} ${d.name}`;
    discContainer.appendChild(badge);
  }

  // Buttons
  const nextBtn = $('#result-next-btn');
  if (isWin) {
    const nextId = game.getNextLevelId();
    nextBtn.textContent = nextId ? `Level ${nextId} \u25B6` : 'Back to Map';
    nextBtn.onclick = () => {
      game.audio.playTap();
      if (nextId) {
        game.startLevel(nextId);
        renderGame();
        showScreen('game');
      } else {
        renderLevels();
      }
    };
    nextBtn.style.display = '';
  } else {
    nextBtn.style.display = 'none';
  }

  $('#result-retry-btn').onclick = () => {
    game.audio.playTap();
    game.startLevel(game.currentLevel);
    renderGame();
    showScreen('game');
  };

  showScreen('result');
}

function addResultRow(container, label, value, isTotal = false) {
  const row = document.createElement('div');
  row.className = 'result-row' + (isTotal ? ' total' : '');
  row.innerHTML = `<span class="label">${label}</span><span class="value">${value.toLocaleString()}</span>`;
  container.appendChild(row);
}

// ── Collection Screen ────────────────────────────────────────────────────────
let collectionTab = 'tiles';

function renderCollection() {
  showScreen('collection');
  renderCollectionTab(collectionTab);
}

function renderCollectionTab(tab) {
  collectionTab = tab;

  // Update tab buttons
  $$('.collection-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  const grid = $('#collection-grid');
  grid.innerHTML = '';

  if (tab === 'tiles') {
    const allTiles = Object.values(TILES).filter(t => t.id !== 'wild');
    const discovered = Object.keys(game.collection.tiles).length;
    $('#collection-progress').textContent = `${discovered} / ${allTiles.length} discovered`;

    for (const tile of allTiles) {
      const d = game.collection.tiles[tile.id];
      const item = createCollectionItem(tile.emoji, tile.name, d ? `\u00D7${d.count}` : '', !d);
      grid.appendChild(item);
    }
  } else if (tab === 'animals') {
    const allAnimals = Object.values(ANIMALS);
    const discovered = Object.keys(game.collection.animals).length;
    $('#collection-progress').textContent = `${discovered} / ${allAnimals.length} discovered`;

    for (const animal of allAnimals) {
      const d = game.collection.animals[animal.id];
      const item = createCollectionItem(animal.emoji, animal.name, d ? `\u00D7${d.count}` : '', !d);
      grid.appendChild(item);
    }
  } else if (tab === 'landmarks') {
    const allLandmarks = Object.values(LANDMARKS);
    const discovered = Object.keys(game.collection.landmarks).length;
    $('#collection-progress').textContent = `${discovered} / ${allLandmarks.length} discovered`;

    for (const lm of allLandmarks) {
      const d = game.collection.landmarks[lm.id];
      const item = createCollectionItem(lm.emoji, lm.name, d ? `\u00D7${d.count}` : '', !d);
      grid.appendChild(item);
    }
  }
}

function createCollectionItem(emoji, name, count, undiscovered) {
  const item = document.createElement('div');
  item.className = 'collection-item' + (undiscovered ? ' undiscovered' : '');
  item.innerHTML = `
    <span>${undiscovered ? '?' : emoji}</span>
    <span class="item-name">${undiscovered ? '???' : name}</span>
    ${count ? `<span class="item-count">${count}</span>` : ''}
  `;
  return item;
}

// ── Fireworks ────────────────────────────────────────────────────────────────
function spawnFireworks() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = 50 + Math.random() * (window.innerWidth - 100);
      const y = 50 + Math.random() * (window.innerHeight * 0.5);
      createFirework(x, y);
    }, i * 300);
  }
}

function createFirework(cx, cy) {
  const container = document.createElement('div');
  container.className = 'firework';
  container.style.left = cx + 'px';
  container.style.top = cy + 'px';

  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FD8', '#C084FC'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'firework-particle';
    const angle = (i / 12) * Math.PI * 2;
    const dist = 40 + Math.random() * 40;
    p.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1200);
}

// ── Merge Particles ──────────────────────────────────────────────────────────
function spawnMergeParticles(row, col, color = '#4CAF50') {
  if (!gridEl) return;
  const cellEl = cellEls[row]?.[col];
  if (!cellEl) return;

  const rect = cellEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const colors = [color, '#FFD54F', '#FF6FD8', '#4FC3F7', '#81C784'];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 8) * Math.PI * 2;
    const dist = 20 + Math.random() * 25;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

// ── Game Event Listener ──────────────────────────────────────────────────────
game.onEvent = (event) => {
  if (event.type === 'merge') {
    // Show merge score popup
    const cellEl = cellEls[event.toRow]?.[event.toCol];
    if (cellEl) {
      const pop = document.createElement('div');
      pop.className = 'merge-pop' + (event.chainStep > 0 ? ' chain' : '');
      const label = event.chainStep > 0 ? `+${event.bonus} Chain!` : `+${event.bonus}`;
      pop.textContent = label;
      const rect = cellEl.getBoundingClientRect();
      pop.style.left = rect.left + rect.width / 2 - 20 + 'px';
      pop.style.top = rect.top - 10 + 'px';
      document.body.appendChild(pop);
      setTimeout(() => pop.remove(), 900);

      spawnMergeParticles(event.toRow, event.toCol, event.resultTile?.color);
    }

    // Refresh with merge animation
    const animated = {};
    animated[`${event.toRow},${event.toCol}`] = 'merge-result';
    setTimeout(() => refreshGridTiles(animated), 50);
  }

  if (event.type === 'lifeBurst' && event.row !== null) {
    const animated = {};
    animated[`${event.row},${event.col}`] = 'life-burst';
    setTimeout(() => {
      refreshGridTiles(animated);
      spawnMergeParticles(event.row, event.col, '#FFB74D');
    }, 200);
  }
};

game.onStateChange = (type) => {
  if (type === 'tutorial') {
    renderTutorial();
  }
};

// ── Utility ──────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Wire Up Buttons ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Menu
  $('#btn-play').addEventListener('click', () => {
    game.audio.init();
    game.audio.resume();
    game.audio.playTap();
    renderLevels();
  });
  $('#btn-collection').addEventListener('click', () => {
    game.audio.init();
    game.audio.playTap();
    renderCollection();
  });

  // Levels
  $('#levels-back').addEventListener('click', () => {
    game.audio.playTap();
    renderMenu();
  });

  // Game HUD
  $('#pause-btn').addEventListener('click', () => {
    game.audio.playTap();
    renderLevels();
  });
  $('#sound-btn').addEventListener('click', () => {
    const on = game.audio.toggle();
    $('#sound-btn').textContent = on ? '\uD83D\uDD0A' : '\uD83D\uDD07';
  });
  $('#undo-btn').addEventListener('click', () => handleUndo());

  // Result
  $('#result-map-btn').addEventListener('click', () => {
    game.audio.playTap();
    document.body.style.background = '#E8F5E9';
    renderLevels();
  });

  // Collection
  $$('.collection-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      game.audio.playTap();
      renderCollectionTab(tab.dataset.tab);
    });
  });
  $('#collection-back').addEventListener('click', () => {
    game.audio.playTap();
    renderMenu();
  });

  // Start on menu
  renderMenu();
});
