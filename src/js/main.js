// ── Pocket Planet Merge — Main UI Controller ─────────────────────────────────
// Renders all screens, handles input, and drives UI animations.

import { GameState } from './gameState.js';
import { TILES, BIOMES, ANIMALS, LANDMARKS } from './tiles.js';

const game = new GameState();

const BODY_THEMES = ['biome-menu', 'biome-grassland', 'biome-desert', 'biome-tundra', 'biome-volcanic'];
const BIOME_ACCENTS = {
  grassland: '#6ae3a0',
  desert: '#ffc46b',
  tundra: '#8edcff',
  volcanic: '#ff9b7a',
};
let devUnlockAllLevels = false;

// ── DOM References ───────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
  menu: $('#menu-screen'),
  levels: $('#levels-screen'),
  game: $('#game-screen'),
  result: $('#result-screen'),
  shop: $('#shop-screen'),
  collection: $('#collection-screen'),
};
const ambientVideos = {
  'biome-menu': $('#ambient-video-menu'),
  'biome-grassland': $('#ambient-video-grassland'),
  'biome-desert': $('#ambient-video-desert'),
  'biome-tundra': $('#ambient-video-tundra'),
  'biome-volcanic': $('#ambient-video-volcanic'),
};
const AMBIENT_THEME_VIDEO = {
  'biome-menu': 'biome-menu',
  'biome-grassland': 'biome-grassland',
  'biome-desert': 'biome-desert',
  'biome-tundra': 'biome-tundra',
  'biome-volcanic': 'biome-volcanic',
};

function syncAmbientVideoPlayback(activeTheme) {
  const activeVideoTheme = AMBIENT_THEME_VIDEO[activeTheme] || null;
  for (const [theme, video] of Object.entries(ambientVideos)) {
    if (!video) continue;
    video.muted = true;

    if (theme === activeVideoTheme) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }
}

// ── Screen Management ────────────────────────────────────────────────────────
function showScreen(name) {
  for (const s of Object.values(screens)) s.classList.remove('active');
  screens[name].classList.add('active');
}

function applyTheme(theme) {
  document.body.classList.remove(...BODY_THEMES);
  document.body.classList.add(theme);
  syncAmbientVideoPlayback(theme);
}

function applyBiomeTheme(biomeId) {
  const theme = BODY_THEMES.includes(`biome-${biomeId}`) ? `biome-${biomeId}` : 'biome-menu';
  applyTheme(theme);
}

// ── Menu Screen ──────────────────────────────────────────────────────────────
function syncMenuStardust() {
  const menuStardust = $('#menu-stardust');
  if (menuStardust) menuStardust.textContent = `${game.stardust} Stardust`;
}

function renderMenu() {
  applyTheme('biome-menu');
  syncMenuStardust();
  showScreen('menu');
}

// ── Level Select ─────────────────────────────────────────────────────────────
function renderLevels() {
  applyTheme('biome-menu');
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
    node.style.setProperty('--level-accent', BIOME_ACCENTS[level.biome] || '#70d3f7');
    const isUnlocked = level.unlocked || devUnlockAllLevels;

    if (level.completed) node.classList.add('completed');
    else if (level.unlocked && !level.completed) node.classList.add('current');
    else if (!isUnlocked) node.classList.add('locked');

    node.innerHTML = `<span>${level.id}</span>`;
    if (level.bestScore > 0) {
      node.innerHTML += `<span class="level-score">${level.bestScore}</span>`;
    }

    if (isUnlocked) {
      node.addEventListener('click', () => {
        game.audio.init();
        game.audio.resume();
        game.audio.playTap();
        activePower = null;
        swapSelection = null;
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
let activePower = null;
let swapSelection = null;
let shopReturnScreen = 'menu';

const TILE_EFFECT_CLASSES = ['placed', 'merging', 'merged-result', 'life-burst'];

function renderGame() {
  const biome = game.getBiomeForLevel(game.currentLevel);
  applyBiomeTheme(biome.id);

  if (activePower && !game.canUsePower(activePower)) {
    activePower = null;
    swapSelection = null;
  }

  renderGrid();
  renderScore();
  renderQueue();
  renderBonusGoals();
  renderUndoButton();
  renderHudStatus();
  renderPowerTray();
  renderPowerHint();
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

function sanitizeClassToken(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
}

function getTileSignature(tile) {
  return [
    tile.id || '',
    tile.emoji || '',
    tile.chain || '',
    tile.tier || 0,
    tile.isAnimal ? 1 : 0,
    tile.isLandmark ? 1 : 0,
  ].join('|');
}

function getTileMotionClasses(tile) {
  const motion = [];
  const id = tile.id || '';

  if (id) motion.push(`tile-motion-${sanitizeClassToken(id)}`);
  if (id.startsWith('earth_')) motion.push('tile-motion-earth');
  if (id.startsWith('water_')) motion.push('tile-motion-water');
  if (id.startsWith('plant_')) motion.push('tile-motion-plant');
  if (id.startsWith('sand_')) motion.push('tile-motion-sand');
  if (id.startsWith('snow_')) motion.push('tile-motion-snow');
  if (id === 'wild') motion.push('tile-motion-rainbow');

  if (id === 'earth_2' || id === 'earth_3' || id === 'earth_4' || id === 'earth_5') {
    motion.push('tile-motion-snow');
  }

  if (tile.isAnimal) motion.push('tile-motion-animal');
  if (tile.isLandmark) motion.push('tile-motion-landmark');

  return [...new Set(motion)];
}

function createTileElement(tile) {
  const tileEl = document.createElement('div');
  tileEl.className = 'tile';
  tileEl.dataset.signature = getTileSignature(tile);
  tileEl.dataset.tileId = tile.id;
  tileEl.dataset.chain = tile.chain || 'entity';
  tileEl.style.setProperty('--tile-color', tile.color || '#7ac4ff');

  tileEl.classList.add(`tile-id-${sanitizeClassToken(tile.id)}`);
  tileEl.classList.add(`tile-chain-${sanitizeClassToken(tile.chain || 'entity')}`);

  const motionClasses = getTileMotionClasses(tile);
  if (motionClasses.length > 0) tileEl.classList.add(...motionClasses);

  if (tile.isAnimal || tile.isLandmark) tileEl.classList.add('entity');

  const fx = document.createElement('span');
  fx.className = 'tile-fx';
  tileEl.appendChild(fx);

  const glyph = document.createElement('span');
  glyph.className = 'tile-glyph';
  glyph.textContent = tile.emoji;
  tileEl.appendChild(glyph);

  if (tile.tier > 0 && !tile.isAnimal && !tile.isLandmark) {
    const tierBadge = document.createElement('span');
    tierBadge.className = 'tile-tier';
    tierBadge.textContent = 'T' + tile.tier;
    tileEl.appendChild(tierBadge);
  }

  return tileEl;
}

function applyTileAnimation(tileEl, tile, animationType) {
  tileEl.classList.remove(...TILE_EFFECT_CLASSES);

  if (tile.isAnimal || tile.isLandmark) tileEl.classList.add('entity');
  if (!animationType) return;

  // Force reflow so repeated animation classes replay on existing nodes.
  void tileEl.offsetWidth;

  if (animationType === 'merge-result') tileEl.classList.add('merged-result');
  else if (animationType === 'life-burst') tileEl.classList.add('life-burst', 'entity');
  else if (animationType === 'merging') tileEl.classList.add('merging');
  else if (animationType === 'place') tileEl.classList.add('placed');
}

function refreshGridTiles(animatedCells = {}) {
  for (let r = 0; r < game.grid.size; r++) {
    for (let c = 0; c < game.grid.size; c++) {
      const cell = cellEls[r][c];
      const tile = game.grid.get(r, c);
      const existing = cell.querySelector('.tile');
      const key = `${r},${c}`;

      if (tile) {
        cell.classList.add('occupied');
        cell.dataset.chain = tile.chain || 'entity';
        const signature = getTileSignature(tile);
        let tileEl = existing;

        if (!tileEl || tileEl.dataset.signature !== signature) {
          if (tileEl) tileEl.remove();
          tileEl = createTileElement(tile);
          cell.appendChild(tileEl);
        }

        applyTileAnimation(tileEl, tile, animatedCells[key]);
      } else {
        if (existing) existing.remove();
        cell.classList.remove('occupied');
        delete cell.dataset.chain;
      }
    }
  }
}

function renderPowerTray() {
  const inventory = game.getPowerInventory();
  const defs = [
    { id: 'swap', btn: '#power-swap', count: '#power-swap-count' },
    { id: 'wildSeed', btn: '#power-wild', count: '#power-wild-count' },
    { id: 'clear', btn: '#power-clear', count: '#power-clear-count' },
  ];

  for (const def of defs) {
    const btn = $(def.btn);
    const countEl = $(def.count);
    if (!btn || !countEl) continue;

    const qty = inventory[def.id] || 0;
    countEl.textContent = qty;
    btn.disabled = qty <= 0 || game.state !== 'playing';
    btn.classList.toggle('active', activePower === def.id);
  }

  if (activePower && (inventory[activePower] || 0) <= 0) {
    activePower = null;
    swapSelection = null;
  }
}

function renderPowerHint(msg = '') {
  const hint = $('#power-hint');
  if (!hint) return;

  let text = msg;
  if (!text) {
    if (!activePower) text = '';
    else if (activePower === 'swap') {
      text = swapSelection
        ? 'Select the second occupied tile.'
        : 'Swap mode: select the first occupied tile.';
    } else if (activePower === 'wildSeed') {
      text = 'Wild mode: tap an empty cell.';
    } else if (activePower === 'clear') {
      text = 'Clear mode: tap an occupied tile.';
    }
  }

  hint.textContent = text;
  hint.classList.toggle('active', !!text);
}

function setActivePower(powerId) {
  if (game.state !== 'playing') return;

  if (activePower === powerId) {
    activePower = null;
    swapSelection = null;
  } else {
    activePower = powerId;
    swapSelection = null;
  }

  renderPowerTray();
  renderPowerHint();
}

async function handlePowerAction(row, col) {
  if (activePower === 'swap') {
    if (!swapSelection) {
      if (!game.grid.get(row, col)) {
        renderPowerHint('Swap needs an occupied tile first.');
        return false;
      }
      swapSelection = { row, col };
      pulseClass(cellEls[row]?.[col], 'place-glow', 200);
      renderPowerHint();
      return false;
    }

    if (swapSelection.row === row && swapSelection.col === col) {
      swapSelection = null;
      renderPowerHint('Swap selection cancelled.');
      return false;
    }

    if (!game.grid.get(row, col)) {
      renderPowerHint('Second swap tile must be occupied.');
      return false;
    }

    const from = swapSelection;
    swapSelection = null;
    const success = await game.useSwap(from.row, from.col, row, col);
    if (!success) {
      renderPowerHint('Swap failed.');
      return false;
    }

    renderPowerHint('Swap complete.');
    return true;
  }

  if (activePower === 'wildSeed') {
    if (game.grid.get(row, col) !== null) {
      renderPowerHint('Wild Seed needs an empty cell.');
      return false;
    }
    const success = await game.useWildSeed(row, col);
    if (!success) return false;
    renderPowerHint('Wild tile planted.');
    return true;
  }

  if (activePower === 'clear') {
    if (!game.grid.get(row, col)) {
      renderPowerHint('Clear needs an occupied tile.');
      return false;
    }
    const success = game.useClear(row, col);
    if (!success) return false;
    renderPowerHint('Tile removed.');
    return true;
  }

  return false;
}

async function refreshAfterPowerAction() {
  refreshGridTiles();
  renderScore();
  renderQueue(true);
  renderBonusGoals();
  renderUndoButton();
  renderHudStatus();
  renderPowerTray();
  renderTutorial();

  if (game.state === 'won' || game.state === 'lost') {
    await sleep(420);
    renderResult();
  }
}

async function handleCellClick(row, col) {
  if (game.state !== 'playing' && game.state !== 'tutorial') return;
  if (game.processing) return;

  game.audio.resume();

  if (game.state === 'playing' && activePower) {
    const used = await handlePowerAction(row, col);
    if (!used) return;
    await refreshAfterPowerAction();
    return;
  }

  if (game.grid.get(row, col) !== null) return;

  const success = await game.placeTile(row, col);
  if (!success) return;

  refreshGridTiles({ [`${row},${col}`]: 'place' });
  renderQueue(true);
  renderScore();
  renderBonusGoals();
  renderUndoButton();
  renderHudStatus();
  renderPowerTray();
  renderPowerHint();
  renderTutorial();

  await sleep(100);

  const animated = {};
  for (let r = 0; r < game.grid.size; r++) {
    for (let c = 0; c < game.grid.size; c++) {
      const tile = game.grid.get(r, c);
      if (tile && (tile.isAnimal || tile.isLandmark)) animated[`${r},${c}`] = 'life-burst';
    }
  }

  refreshGridTiles(animated);
  renderScore();
  renderQueue();
  renderBonusGoals();
  renderUndoButton();
  renderHudStatus();
  renderPowerTray();
  renderPowerHint();
  renderTutorial();

  if (game.state === 'won' || game.state === 'lost') {
    await sleep(650);
    renderResult();
  }
}

function renderScore() {
  const scoreEl = $('#score-current');
  const oldScore = parseInt(scoreEl.textContent, 10) || 0;
  const nextScore = game.getTotalScore();
  scoreEl.textContent = nextScore;

  if (nextScore > oldScore) pulseClass(scoreEl, 'bump', 300);

  $('#score-target').textContent = `Target: ${game.targetScore}`;
  const pct = Math.min(100, Math.round(game.getProgress() * 100));
  $('#score-bar-fill').style.width = pct + '%';
}

function renderQueue(animate = false) {
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
    qTile.className = 'queue-tile' + (i === 0 ? ' next' : '') + (animate ? ' shift-in' : '');
    qTile.style.setProperty('--tile-color', tile.color || '#86c9ff');

    const emoji = document.createElement('span');
    emoji.className = 'queue-emoji';
    emoji.textContent = tile.emoji;
    qTile.appendChild(emoji);

    const label = document.createElement('span');
    label.className = 'queue-tile-label';
    label.textContent = i === 0 ? 'Next' : i === 1 ? 'Soon' : 'Later';
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

function renderHudStatus(animateCombo = false) {
  const combo = game.getComboStatus();
  const comboEl = $('#combo-chip');
  comboEl.textContent = combo.streak > 0
    ? `Combo x${combo.multiplier.toFixed(2)}`
    : 'Combo Ready';
  comboEl.classList.toggle('active', combo.streak > 0);
  if (animateCombo) pulseClass(comboEl, 'pulse', 460);

  const wild = game.getWildChargeStatus();
  $('#nova-fill').style.width = `${Math.round(wild.pct * 100)}%`;
  const meter = $('#nova-meter');
  meter.classList.toggle('charged', wild.charge > 0);
  meter.setAttribute('data-charge', String(wild.charge));

  const rerollBtn = $('#reroll-btn');
  rerollBtn.disabled = !game.canUseReroll();
  $('#reroll-count').textContent = wild.charge;
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

// ── Undo / Reroll ───────────────────────────────────────────────────────────
function handleUndo() {
  if (game.undo()) {
    refreshGridTiles();
    renderScore();
    renderQueue();
    renderBonusGoals();
    renderUndoButton();
    renderHudStatus();
    renderPowerTray();
    renderPowerHint();
  }
}

function handleReroll() {
  if (!game.useReroll(false)) return;
  renderQueue(true);
  renderHudStatus();
}

// ── Result Screen ────────────────────────────────────────────────────────────
function renderResult() {
  const isWin = game.state === 'won';
  if (isWin) spawnFireworks();

  $('#result-icon').textContent = isWin ? '\uD83C\uDF0D' : '\u26A0\uFE0F';
  const titleEl = $('#result-title');
  const subtitleEl = $('#result-subtitle');
  titleEl.textContent = isWin ? 'Planet Complete!' : 'No Moves Left';
  subtitleEl.textContent = isWin
    ? 'You reached the target and stabilized this world.'
    : 'You are out of valid merges. Restart this level or visit the shop for powerups.';
  titleEl.className = 'result-title ' + (isWin ? 'win' : 'loss');

  const scoreRows = $('#result-score-rows');
  scoreRows.innerHTML = '';
  addResultRow(scoreRows, 'Planet Score', game.grid.calculateScore());
  addResultRow(scoreRows, 'Merge Bonuses', game.mergeBonus);
  if (game.comboBonus > 0) addResultRow(scoreRows, 'Combo Bonus', game.comboBonus);
  if (game.bestComboMultiplier > 1) {
    addResultRow(scoreRows, 'Peak Combo', `x${game.bestComboMultiplier.toFixed(2)}`);
  }
  if (game.animalsSpawned.length > 0) addResultRow(scoreRows, 'Animals', game.animalsSpawned.length);
  if (game.landmarksBuilt.length > 0) addResultRow(scoreRows, 'Landmarks', game.landmarksBuilt.length);
  addResultRow(scoreRows, 'Total', game.getTotalScore(), true);

  const reward = isWin ? game.getWinReward() : game.getLossReward();
  $('#result-stardust').textContent = `+${reward.total} Stardust`;

  const bonusContainer = $('#result-bonus');
  bonusContainer.innerHTML = '';
  for (const goal of game.getBonusGoalStatus()) {
    const el = document.createElement('div');
    el.className = 'bonus-result ' + (goal.completed ? 'done' : 'missed');
    el.innerHTML = `<span>${goal.completed ? '\u2713' : '\u2717'} ${goal.label}</span><span>${goal.current}/${goal.count}</span>`;
    bonusContainer.appendChild(el);
  }

  const discContainer = $('#result-discoveries');
  discContainer.innerHTML = '';
  for (const d of game.getNewDiscoveries()) {
    const badge = document.createElement('div');
    badge.className = 'discovery-badge';
    badge.innerHTML = `<span class="new-tag">NEW!</span> ${d.emoji} ${d.name}`;
    discContainer.appendChild(badge);
  }

  const nextBtn = $('#result-next-btn');
  if (isWin) {
    const nextId = game.getNextLevelId();
    nextBtn.textContent = nextId ? `Level ${nextId} \u25B6` : 'Back to Map';
    nextBtn.onclick = () => {
      game.audio.playTap();
      if (nextId) {
        game.startLevel(nextId);
        activePower = null;
        swapSelection = null;
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

  $('#result-retry-btn').textContent = isWin ? 'Retry \uD83D\uDD04' : 'Restart \uD83D\uDD04';
  $('#result-retry-btn').onclick = () => {
    game.audio.playTap();
    game.startLevel(game.currentLevel);
    activePower = null;
    swapSelection = null;
    renderGame();
    showScreen('game');
  };

  showScreen('result');
}

function addResultRow(container, label, value, isTotal = false) {
  const row = document.createElement('div');
  row.className = 'result-row' + (isTotal ? ' total' : '');
  const valueText = typeof value === 'number' ? value.toLocaleString() : value;
  row.innerHTML = `<span class="label">${label}</span><span class="value">${valueText}</span>`;
  container.appendChild(row);
}

// ── Collection Screen ────────────────────────────────────────────────────────
let collectionTab = 'nature';

function renderCollection() {
  applyTheme('biome-menu');
  showScreen('collection');
  renderCollectionTab(collectionTab);
}

function renderCollectionTab(tab) {
  collectionTab = tab;
  $$('.collection-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  const grid = $('#collection-grid');
  grid.innerHTML = '';

  if (tab === 'nature') {
    const allTiles = Object.values(TILES).filter(t => t.id !== 'wild');
    const discovered = Object.keys(game.collection.tiles).length;
    $('#collection-progress').textContent = `${discovered} / ${allTiles.length} discovered`;

    const groups = [
      { chain: 'earth', label: 'Earth' },
      { chain: 'water', label: 'Water' },
      { chain: 'plant', label: 'Plant' },
      { chain: 'sand', label: 'Sand' },
      { chain: 'snow', label: 'Snow' },
    ];

    for (const group of groups) {
      const chainTiles = allTiles
        .filter(tile => tile.chain === group.chain)
        .sort((a, b) => a.tier - b.tier);
      if (chainTiles.length === 0) continue;

      const title = document.createElement('div');
      title.className = 'collection-group-title';
      title.textContent = group.label;
      grid.appendChild(title);

      for (const tile of chainTiles) {
        const d = game.collection.tiles[tile.id];
        const item = createCollectionItem(
          tile.emoji,
          tile.name,
          d ? `\u00D7${d.count}` : '',
          !d && !devUnlockAllLevels
        );
        grid.appendChild(item);
      }
    }
  } else if (tab === 'animals') {
    const allAnimals = Object.values(ANIMALS);
    const discovered = Object.keys(game.collection.animals).length;
    $('#collection-progress').textContent = `${discovered} / ${allAnimals.length} discovered`;

    for (const animal of allAnimals) {
      const d = game.collection.animals[animal.id];
      const item = createCollectionItem(
        animal.emoji,
        animal.name,
        d ? `\u00D7${d.count}` : '',
        !d && !devUnlockAllLevels
      );
      grid.appendChild(item);
    }
  } else if (tab === 'landmarks') {
    const allLandmarks = Object.values(LANDMARKS);
    const discovered = Object.keys(game.collection.landmarks).length;
    $('#collection-progress').textContent = `${discovered} / ${allLandmarks.length} discovered`;

    for (const lm of allLandmarks) {
      const d = game.collection.landmarks[lm.id];
      const item = createCollectionItem(
        lm.emoji,
        lm.name,
        d ? `\u00D7${d.count}` : '',
        !d && !devUnlockAllLevels
      );
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

// ── Shop Screen ──────────────────────────────────────────────────────────────
function openShop(from = 'menu') {
  shopReturnScreen = from;
  renderShop();
  showScreen('shop');
}

function renderShop() {
  applyTheme('biome-menu');

  const data = game.getShopData();
  $('#shop-wallet').textContent = `${game.stardust} Stardust`;

  const powerGrid = $('#shop-powers');
  powerGrid.innerHTML = '';

  for (const power of data.powers) {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-card-icon">${power.icon}</div>
      <div class="shop-card-title">${power.name}</div>
      <div class="shop-card-desc">${power.description}</div>
      <div class="shop-card-meta">Owned: ${power.owned}</div>
    `;

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary shop-buy-btn';
    btn.textContent = `Buy (${power.cost})`;
    btn.disabled = game.stardust < power.cost;
    btn.addEventListener('click', () => {
      game.audio.playTap();
      const res = game.buyPower(power.id, 1);
      if (!res.ok) {
        spawnSystemPop('Need more Stardust', $('#shop-wallet'), 'reroll');
        return;
      }
      syncMenuStardust();
      renderShop();
      renderPowerTray();
      spawnSystemPop(`+1 ${power.name}`, $('#shop-wallet'), 'wild');
    });

    card.appendChild(btn);
    powerGrid.appendChild(card);
  }

  const packGrid = $('#shop-stardust');
  packGrid.innerHTML = '';

  for (const pack of data.stardustPacks) {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-card-icon">✨</div>
      <div class="shop-card-title">${pack.name}</div>
      <div class="shop-card-desc">+${pack.amount} Stardust</div>
      <div class="shop-card-meta">${pack.priceLabel}</div>
    `;

    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary shop-buy-btn';
    btn.textContent = `Purchase ${pack.priceLabel}`;
    btn.addEventListener('click', () => {
      game.audio.playTap();
      const ok = window.confirm(`Simulate purchase of ${pack.name} (${pack.priceLabel})?`);
      if (!ok) return;
      game.purchaseStardustPack(pack.id);
      syncMenuStardust();
      renderShop();
      renderPowerTray();
      spawnSystemPop(`+${pack.amount} Stardust`, $('#shop-wallet'), 'wild');
    });

    card.appendChild(btn);
    packGrid.appendChild(card);
  }
}

function handleShopBack() {
  if (shopReturnScreen === 'game') {
    renderGame();
    showScreen('game');
    return;
  }
  if (shopReturnScreen === 'collection') {
    renderCollection();
    return;
  }
  renderMenu();
}

// ── Visual Effects ───────────────────────────────────────────────────────────
function spawnFireworks() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = 50 + Math.random() * (window.innerWidth - 100);
      const y = 50 + Math.random() * (window.innerHeight * 0.5);
      createFirework(x, y);
    }, i * 260);
  }
}

function createFirework(cx, cy) {
  const container = document.createElement('div');
  container.className = 'firework';
  container.style.left = cx + 'px';
  container.style.top = cy + 'px';

  const colors = ['#ff7961', '#ffd76f', '#73e59f', '#6fbaff', '#9f8fff', '#fca5d8'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'firework-particle';
    const angle = (i / 12) * Math.PI * 2;
    const dist = 38 + Math.random() * 42;
    p.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1200);
}

function spawnMergeParticles(row, col, color = '#6ee1aa') {
  if (!gridEl) return;
  const cellEl = cellEls[row]?.[col];
  if (!cellEl) return;

  const rect = cellEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = [color, '#ffd770', '#f7a5cc', '#78ceff', '#87efb5'];

  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 10) * Math.PI * 2;
    const dist = 18 + Math.random() * 28;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

function spawnSystemPop(text, anchorEl, cls = '') {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const pop = document.createElement('div');
  pop.className = `system-pop ${cls}`.trim();
  pop.textContent = text;
  pop.style.left = rect.left + rect.width / 2 - 38 + 'px';
  pop.style.top = rect.top - 10 + 'px';
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 900);
}

function pulseClass(el, className, duration = 450) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), duration);
}

// ── Game Event Listener ──────────────────────────────────────────────────────
game.onEvent = (event) => {
  if (event.type === 'place') {
    const cellEl = cellEls[event.row]?.[event.col];
    pulseClass(cellEl, 'place-glow', 380);
  }

  if (event.type === 'merge') {
    const cellEl = cellEls[event.toRow]?.[event.toCol];
    if (cellEl) {
      const pop = document.createElement('div');
      pop.className = 'merge-pop' + (event.chainStep > 0 ? ' chain' : '');
      let label = `+${event.bonus}`;
      if (event.comboBonus > 0) label += ` x${event.comboMultiplier.toFixed(2)}`;
      if (event.chainStep > 0) label += ' Chain!';
      pop.textContent = label;
      const rect = cellEl.getBoundingClientRect();
      pop.style.left = rect.left + rect.width / 2 - 30 + 'px';
      pop.style.top = rect.top - 10 + 'px';
      document.body.appendChild(pop);
      setTimeout(() => pop.remove(), 950);
      spawnMergeParticles(event.toRow, event.toCol, event.resultTile?.color);
    }

    const animated = {};
    animated[`${event.toRow},${event.toCol}`] = 'merge-result';
    setTimeout(() => refreshGridTiles(animated), 50);
  }

  if (event.type === 'lifeBurst' && event.row !== null) {
    const animated = {};
    animated[`${event.row},${event.col}`] = 'life-burst';
    setTimeout(() => {
      refreshGridTiles(animated);
      spawnMergeParticles(event.row, event.col, '#ffbe6d');
    }, 180);
  }

  if (event.type === 'combo') {
    renderHudStatus(event.changed && event.hadMerge);
  }

  if (event.type === 'novaCharge') {
    renderHudStatus();
    renderQueue(true);
    pulseClass($('#nova-meter'), 'burst', 620);
    spawnSystemPop(`Wild +${event.grants}`, $('#nova-meter'), 'wild');
  }

  if (event.type === 'reroll') {
    renderQueue(true);
    renderHudStatus();
    spawnSystemPop('Queue rerolled', $('#reroll-btn'), 'reroll');
  }

  if (event.type === 'powerUsed') {
    if (event.powerId === 'swap') {
      pulseClass(cellEls[event.fromRow]?.[event.fromCol], 'place-glow', 280);
      pulseClass(cellEls[event.toRow]?.[event.toCol], 'place-glow', 280);
      if (event.hadMerge) spawnSystemPop('Swap Merge!', $('#power-swap'), 'wild');
    } else if (event.powerId === 'wildSeed') {
      refreshGridTiles({ [`${event.row},${event.col}`]: 'place' });
      spawnMergeParticles(event.row, event.col, '#79d9ff');
    } else if (event.powerId === 'clear') {
      spawnMergeParticles(event.row, event.col, '#d4f6b3');
    }
  }

  if (event.type === 'shopPurchase') {
    const wallet = $('#shop-wallet');
    if (wallet) wallet.textContent = `${game.stardust} Stardust`;
  }
};

game.onStateChange = (type) => {
  if (type === 'tutorial') {
    renderTutorial();
    renderHudStatus();
    renderPowerTray();
    renderPowerHint();
  }

  if ((type === 'win' || type === 'loss') && screens.game.classList.contains('active')) {
    setTimeout(() => renderResult(), 280);
  }
};

// ── Utility ──────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Wire Up Buttons ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme('biome-menu');

  document.addEventListener('keydown', (event) => {
    const isDevToggle = event.code === 'Backquote' || event.key === '~' || event.key === '`';
    if (!isDevToggle || event.repeat) return;
    const isLevelsActive = screens.levels.classList.contains('active');
    const isCollectionActive = screens.collection.classList.contains('active');
    if (!isLevelsActive && !isCollectionActive) return;

    event.preventDefault();
    devUnlockAllLevels = !devUnlockAllLevels;

    if (isLevelsActive) renderLevels();
    if (isCollectionActive) renderCollectionTab(collectionTab);

    const anchor = isCollectionActive ? $('#collection-back') : $('#levels-back');
    spawnSystemPop(
      devUnlockAllLevels ? 'Dev Mode: levels + collection unlocked' : 'Dev Mode: off',
      anchor,
      devUnlockAllLevels ? 'wild' : 'reroll'
    );
  });

  // Menu
  $('#btn-play').addEventListener('click', () => {
    game.audio.init();
    game.audio.resume();
    game.audio.playTap();
    renderLevels();
  });
  $('#btn-shop').addEventListener('click', () => {
    game.audio.init();
    game.audio.playTap();
    openShop('menu');
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
    activePower = null;
    swapSelection = null;
    renderLevels();
  });
  $('#sound-btn').addEventListener('click', () => {
    const on = game.audio.toggle();
    $('#sound-btn').textContent = on ? '\uD83D\uDD0A' : '\uD83D\uDD07';
  });
  $('#undo-btn').addEventListener('click', () => handleUndo());
  $('#reroll-btn').addEventListener('click', () => handleReroll());
  $('#shop-quick-btn').addEventListener('click', () => {
    game.audio.playTap();
    openShop('game');
  });

  $$('.power-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      game.audio.playTap();
      setActivePower(btn.dataset.power);
    });
  });

  // Result
  $('#result-map-btn').addEventListener('click', () => {
    game.audio.playTap();
    renderLevels();
  });

  // Shop
  $('#shop-back').addEventListener('click', () => {
    game.audio.playTap();
    handleShopBack();
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

  renderMenu();
});



