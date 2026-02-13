# Pocket Planet Merge — UI Wireframes

*Text-based wireframe layouts for every screen. Dimensions assume a 375×812pt (iPhone SE / standard mobile) portrait canvas.*

---

## 1. Splash Screen

```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│                             │
│        ╭───────────╮        │
│        │  ○    ○   │        │
│        │  POCKET   │        │
│        │  PLANET   │        │
│        │  MERGE    │        │
│        ╰───────────╯        │
│                             │
│     ▓▓▓▓▓▓▓▓▓░░░░  72%     │
│                             │
│    "Tip: Wild tiles match   │
│     any adjacent type!"     │
│                             │
│                             │
└─────────────────────────────┘
```

**Notes:**
- Logo is a small 3D planet with the game title on/below it.
- Loading bar is subtle, centered, with percentage.
- Tip of the day rotates from a pool of 20 tips.
- Auto-transitions to Main Menu when loading completes.

---

## 2. Main Menu / World Map

```
┌─────────────────────────────┐
│ ⭐ 1,240    Seedling    💎 35│  ← Top HUD bar
│─────────────────────────────│
│                             │
│   ☁️  ☁️       ☁️             │
│          [SKY]              │  ← Locked biome (foggy)
│       ·  ·  ·  🔒          │
│                             │
│        [OCEAN]              │  ← Locked biome
│       ·  ·  ·  🔒          │
│                             │
│        [TUNDRA]             │  ← Locked biome
│       ·  ·  ·  🔒          │
│                             │
│        [DESERT]             │  ← Unlocked biome
│       ●──●──●──●──◐        │  ← Levels (● = done, ◐ = current)
│                             │
│       [GRASSLAND]           │  ← Starting biome
│       ●──●──●──●──●──●     │
│              ▲              │
│         (current)           │
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │  ← Bottom nav bar
│ Book  Shop  Daily Events Friends│
└─────────────────────────────┘
```

**Notes:**
- World map scrolls vertically. Biomes stack upward like a tower/ascent.
- Level nodes: filled circle = completed, half circle = current, empty = locked.
- Tapping a completed level lets the player replay for a higher score.
- Tapping current level starts gameplay.
- Locked biomes show a progress bar: "Score 2,340 more to unlock!"
- Bottom nav bar has 5 icons. Active tab is highlighted.
- Top HUD: Stardust (left, gold star icon), Player Title (center), Moonstones (right, gem icon). Tapping currencies goes to Shop.

---

## 3. Gameplay Screen

```
┌─────────────────────────────┐
│ ⏸      Planet Score         │
│        ╔═══════════╗        │
│        ║   1,240   ║        │  ← Current score (large)
│        ╚═══════════╝        │
│        Target: 3,000        │  ← Target (smaller)
│                    🎯🎯     │  ← Bonus goal icons
│                             │
│   ┌─────────────────────┐   │
│   │     │     │     │   │   │  ← Row 1
│   │     │ 🪨  │     │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │ 🌿  │ 🌿  │   │   │  ← Row 2
│   │ 💧  │     │     │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │ 🪨  │   │   │  ← Row 3
│   │ 🌿  │ ⛰️  │     │🪨 │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │  ← Row 4
│   │ 💧  │ 🐸  │ 🌲  │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │  ← Row 5
│   │     │ 🪨  │ 💧  │🌿 │   │
│   └─────┴─────┴─────┴───┘   │
│                             │
│                             │
│                             │
│   ↩️     [ 🪨 ] → [ 💧 ]    │  ← Undo btn + tile queue
│   ×1     Next     Then      │
│                             │
└─────────────────────────────┘
```

**Notes:**
- Pause button (⏸) top-left corner.
- Score prominently centered at top. Target below.
- Bonus goal icons (top-right): dim = incomplete, bright = complete. Tap to see details.
- Grid is centered, occupies ~60% of screen height.
- Each cell: ~52×52pt on 5×5 grid with 4pt gutters = ~280pt total width.
- Tiles show their icon/art. Animals sit on top of tiles. Landmarks replace tiles visually.
- Bottom area: Undo button (left, shows remaining count), Next tile (center, highlighted/raised), Then tile (right, slightly dimmed).
- Empty cells have a subtle dotted outline to indicate they're tappable.
- Background: The planet globe, visible behind the grid, rotating slowly.

### 3.1 Pause Overlay

```
┌─────────────────────────────┐
│                             │
│    ╔═══════════════════╗    │
│    ║                   ║    │
│    ║     ⏸ PAUSED      ║    │
│    ║                   ║    │
│    ║  ┌─────────────┐  ║    │
│    ║  │  ▶ Resume    │  ║    │
│    ║  └─────────────┘  ║    │
│    ║  ┌─────────────┐  ║    │
│    ║  │  🔄 Restart  │  ║    │
│    ║  └─────────────┘  ║    │
│    ║  ┌─────────────┐  ║    │
│    ║  │  🏠 Quit     │  ║    │
│    ║  └─────────────┘  ║    │
│    ║                   ║    │
│    ║   🔊 On  🎵 On   ║    │
│    ║   📳 On           ║    │
│    ║                   ║    │
│    ╚═══════════════════╝    │
│                             │
└─────────────────────────────┘
```

**Notes:**
- Semi-transparent dark overlay behind the panel.
- Quick-access sound/music/haptic toggles at bottom of panel.
- "Quit" returns to World Map (current run progress is lost — confirm dialog: "Leave this planet? Progress will be lost.").

---

## 4. Merge Animation Sequence (Visual Reference)

### Frame 1: Before Merge
```
   ┌─────┬─────┬─────┐
   │     │ 🪨  │     │
   ├─────┼─────┼─────┤
   │ 🪨  │ 🪨  │     │  ← 3 rocks adjacent
   ├─────┼─────┼─────┤
   │     │     │     │
   └─────┴─────┴─────┘
         ▲
     last placed
```

### Frame 2: Tiles Slide (0.2s)
```
   ┌─────┬─────┬─────┐
   │     │  ↓  │     │
   ├─────┼─────┼─────┤
   │  →  │ ✨  │     │  ← Tiles slide toward merge point
   ├─────┼─────┼─────┤
   │     │     │     │
   └─────┴─────┴─────┘
```

### Frame 3: Result Appears (0.2s)
```
   ┌─────┬─────┬─────┐
   │     │     │     │
   ├─────┼─────┼─────┤
   │     │ ⛰️  │     │  ← Hill appears with ring of particles
   ├─────┼─────┼─────┤
   │     │     │     │
   └─────┴─────┴─────┘
         +50
```

---

## 5. Win Result Screen

```
┌─────────────────────────────┐
│                             │
│      🎆  🎇  🎆  🎇         │  ← Fireworks animation
│                             │
│    ╔═══════════════════╗    │
│    ║  🌍 PLANET         ║    │
│    ║     COMPLETE!      ║    │
│    ╚═══════════════════╝    │
│                             │
│   Planet Score ........1,840│
│   Merge Bonuses .........320│
│   Bonus: 2 Forests ✅ ..+110│
│   Bonus: 3 Animals ✅ ..+150│
│   ─────────────────────────│
│   Total .................2,420│
│                             │
│   ⭐ +68 Stardust           │
│   ┌───────────────────┐    │
│   │ 🎬 Watch to Double │    │  ← Optional ad
│   └───────────────────┘    │
│                             │
│   NEW! 🐸 Frog discovered!  │  ← Collection notification
│                             │
│   ┌──────────┐ ┌─────────┐ │
│   │ Next     │ │ Replay  │ │
│   │ Level ▶  │ │   🔄    │ │
│   └──────────┘ └─────────┘ │
│        ┌────────────┐      │
│        │ 📸 Share   │      │  ← Snapshot button
│        └────────────┘      │
└─────────────────────────────┘
```

**Notes:**
- Score breakdown uses dot leaders for readability.
- Bonus goals show checkmarks (✅) if completed, empty circles if missed.
- "Watch to Double" button is clearly optional, visually distinct from primary actions.
- "NEW!" badge draws attention to collection discoveries.
- "Next Level" is the primary button (larger, colored). "Replay" is secondary.
- "Share" generates a planet snapshot image.

---

## 6. Loss Result Screen

```
┌─────────────────────────────┐
│                             │
│                             │
│    ╔═══════════════════╗    │
│    ║   🌍 PLANET FULL!  ║    │
│    ╚═══════════════════╝    │
│                             │
│   Your Score:         1,840 │
│   Target:             3,000 │
│                             │
│   ▓▓▓▓▓▓▓▓▓░░░░  61%       │  ← Progress bar (how close)
│   So close! 1,160 more.    │
│                             │
│   ┌───────────────────────┐ │
│   │  🎬 Watch to Continue  │ │  ← Clears 5 lowest tiles
│   │  (Clears 5 tiles)     │ │
│   └───────────────────────┘ │
│                             │
│   ⭐ +24 Stardust           │
│                             │
│   ┌──────────┐ ┌─────────┐ │
│   │ Try      │ │  World  │ │
│   │ Again 🔄 │ │  Map 🏠 │ │
│   └──────────┘ └─────────┘ │
│                             │
│                             │
└─────────────────────────────┘
```

**Notes:**
- Tone is encouraging, not punishing. "So close!" or "Almost there!" messages.
- Progress bar shows how close the player was to the target.
- "Watch to Continue" clearly states what the ad does (clears 5 lowest-tier tiles to free space). Only available once per run.
- "Try Again" is the primary action. Quick tap → instant restart.
- Reduced Stardust compared to a win, but never zero.

---

## 7. Collection Book

### 7.1 Main View (Tiles Tab)

```
┌─────────────────────────────┐
│  ← Back     COLLECTION      │
│─────────────────────────────│
│  [Tiles] Animals Landmarks  │  ← Tab bar
│   ^^^^                      │
│  Overall: 34/120 (28%)      │  ← Progress
│  ▓▓▓▓▓░░░░░░░░░░░░         │
│                             │
│  ── Earth Chain ──          │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │ 🪨 ││ ⛰️ ││ 🏔️ ││ ░░ │  │  ← ░░ = undiscovered
│  │ x42││ x18││ x3 ││ ?? │  │     (silhouette)
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐                    │
│  │ ░░ │                    │
│  │ ?? │                    │
│  └────┘                    │
│                             │
│  ── Water Chain ──          │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │ 💧 ││ 🌊 ││ 🏞️ ││ ░░ │  │
│  │ x31││ x12││ x2 ││ ?? │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐                    │
│  │ ░░ │                    │
│  │ ?? │                    │
│  └────┘                    │
│                             │
│  ── Plant Chain ──          │
│  ...                        │
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │
└─────────────────────────────┘
```

### 7.2 Item Detail Popup

```
┌─────────────────────────────┐
│                             │
│    ╔═══════════════════╗    │
│    ║                   ║    │
│    ║     🏔️             ║    │  ← 3D model preview
│    ║   (rotates slowly)║    │     (interactive: player
│    ║                   ║    │      can spin it)
│    ╚═══════════════════╝    │
│                             │
│    MOUNTAIN                 │
│    Earth Chain — Tier 3     │
│                             │
│    "The peaks touch the     │
│     clouds. Animals can     │
│     see for miles."         │
│                             │
│    Times merged: 3          │
│    First discovered: Day 2  │
│                             │
│    Spawns: Goat, Eagle      │
│                             │
│    ┌─────────────────┐      │
│    │     Close ✕     │      │
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

---

## 8. Shop

```
┌─────────────────────────────┐
│  ← Back        SHOP         │
│─────────────────────────────│
│ [Featured] Stardust Moonstone│
│  ^^^^^^^^                   │
│                             │
│  ╔═══════════════════════╗  │
│  ║  🌟 STARTER BUNDLE 🌟  ║  │
│  ║  500⭐ + 50💎 + No Ads  ║  │
│  ║  $1.99  [BUY]          ║  │
│  ╚═══════════════════════╝  │
│                             │
│  ╔═══════════════════════╗  │
│  ║  SEASON PASS - Feb     ║  │
│  ║  🌸 Cherry Blossom Set  ║  │
│  ║  Planet + Tiles + Effect║  │
│  ║  + 2x Daily Stardust   ║  │
│  ║  $3.99/mo  [SUBSCRIBE] ║  │
│  ╚═══════════════════════╝  │
│                             │
│  ── Cosmetics ──            │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │Mars││Cndy││Cstl││Stpk│  │
│  │1000││1500││2000││2500│  │
│  │ ⭐ ││ ⭐ ││ ⭐ ││ ⭐ │  │
│  └────┘└────┘└────┘└────┘  │
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │
└─────────────────────────────┘
```

---

## 9. Daily Planet

```
┌─────────────────────────────┐
│  ← Back    DAILY PLANET     │
│─────────────────────────────│
│  Tuesday — Desert Biome     │
│  Resets in: 14h 23m         │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │  ← Same gameplay grid
│  │    5×5 Grid         │   │     (no upgrades applied)
│  │    (standard        │   │
│  │     gameplay)       │   │
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  Queue: 30 tiles            │
│  ┌─────────────────────────┐│
│  │🪨💧🌿🪨🪨🌿💧🪨🌵💧🌿...││  ← Scrollable tile queue
│  └─────────────────────────┘│
│                             │
│  ── Your Rank ──            │
│  Today: #342 (Top 8%)       │
│  Best: #89 (Top 2%)         │
│                             │
│  ── Leaderboard ──          │
│  1. StarMaker42    4,820    │
│  2. PlanetPal      4,510    │
│  3. CozyGamer      4,290    │
│  ...                        │
│  342. You           2,140   │
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │
└─────────────────────────────┘
```

**Notes:**
- The full 30-tile queue is visible (scrollable strip). This is unique to Daily Planet — players can plan ahead.
- Leaderboard updates in real-time (or near real-time with polling).
- If the player hasn't played today, a large "PLAY" button replaces the grid preview.
- After playing (one attempt), the grid shows the player's final board state as a static snapshot.

---

## 10. Events Screen

```
┌─────────────────────────────┐
│  ← Back       EVENTS        │
│─────────────────────────────│
│                             │
│  ╔═══════════════════════╗  │
│  ║  🌸 SPRING AWAKENING   ║  │
│  ║                       ║  │
│  ║  [Event Banner Art]   ║  │
│  ║                       ║  │
│  ║  Ends in: 1d 8h 42m  ║  │
│  ╚═══════════════════════╝  │
│                             │
│  Flower tiles bloom across  │
│  all biomes this weekend!   │
│                             │
│  ── Progress ──             │
│  ▓▓▓▓▓▓▓▓▓▓▓░░░░░ 2,340    │
│  🥉500  🥈2,000  🥇5,000   │
│   ✅      ✅       ○        │
│                             │
│  🥉 100⭐ ............. ✅  │
│  🥈 200⭐ + 10💎 ....... ✅  │
│  🥇 300⭐ + 🌸 Sakura      │
│     Planet Skin ........ ○  │
│                             │
│  Exclusive: 🦌 Cherry       │
│  Blossom Deer               │
│  (Spawn via Flower chain)   │
│                             │
│  ┌───────────────────────┐  │
│  │      ▶ PLAY           │  │  ← Launches run with event modifier
│  └───────────────────────┘  │
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │
└─────────────────────────────┘
```

---

## 11. Social / Friends Screen

```
┌─────────────────────────────┐
│  ← Back      FRIENDS        │
│─────────────────────────────│
│ [Friends] Challenges Gallery │
│  ^^^^^^^^                   │
│                             │
│  ┌─────────────────────────┐│
│  │ + Add Friend            ││  ← Opens share code / link
│  └─────────────────────────┘│
│                             │
│  ── This Week's Scores ──   │
│                             │
│  ┌─────────────────────────┐│
│  │ 🟢 CozyGamer   12,400   ││
│  │    ⚔️ Challenge  🎁 Gift ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🟢 StarMaker42  11,200  ││
│  │    ⚔️ Challenge  🎁 Gift ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ ⚫ PlanetPal    9,800   ││  ← ⚫ = offline
│  │    ⚔️ Challenge  🎁 Sent ││  ← Already gifted today
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🟢 You          8,650   ││
│  └─────────────────────────┘│
│                             │
│  ── Incoming ──             │
│  🎁 CozyGamer sent you      │
│     25 Stardust! [Claim]    │
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │
└─────────────────────────────┘
```

### 11.1 Challenges Tab

```
┌─────────────────────────────┐
│  ← Back      FRIENDS        │
│─────────────────────────────│
│  Friends [Challenges] Gallery│
│           ^^^^^^^^^^^       │
│                             │
│  ── Incoming Challenges ──  │
│                             │
│  ┌─────────────────────────┐│
│  │ CozyGamer challenges you!││
│  │ Grassland · 30 tiles    ││
│  │ Their score: ???        ││  ← Hidden until you play
│  │         [ACCEPT]        ││
│  └─────────────────────────┘│
│                             │
│  ── Completed ──            │
│                             │
│  ┌─────────────────────────┐│
│  │ vs StarMaker42          ││
│  │ You: 3,200  Them: 2,890 ││
│  │ 🏆 YOU WON!             ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ vs PlanetPal            ││
│  │ You: 2,100  Them: 3,450 ││
│  │ They won this time.     ││
│  └─────────────────────────┘│
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │
└─────────────────────────────┘
```

### 11.2 Community Gallery Tab

```
┌─────────────────────────────┐
│  ← Back      FRIENDS        │
│─────────────────────────────│
│  Friends Challenges [Gallery]│
│                     ^^^^^^^^│
│                             │
│  ── This Week's Top Planets ─│
│                             │
│  ┌─────────────────────────┐│
│  │ ╔═════════════════════╗ ││
│  │ ║  [Planet Snapshot]  ║ ││  ← 3D render of final board
│  │ ║  CozyGamer          ║ ││
│  │ ║  Score: 18,420      ║ ││
│  │ ║  Tundra · Lv 28     ║ ││
│  │ ╚═════════════════════╝ ││
│  │  ❤️ 142   📸 Snapshot    ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ ╔═════════════════════╗ ││
│  │ ║  [Planet Snapshot]  ║ ││
│  │ ║  StarMaker42        ║ ││
│  │ ║  Score: 16,200      ║ ││
│  │ ║  Desert · Lv 19     ║ ││
│  │ ╚═════════════════════╝ ││
│  │  ❤️ 98    📸 Snapshot    ││
│  └─────────────────────────┘│
│                             │
│─────────────────────────────│
│  📖    🛒    🌟    📅    👥  │
└─────────────────────────────┘
```

---

## 12. Settings Screen

```
┌─────────────────────────────┐
│  ← Back      SETTINGS       │
│─────────────────────────────│
│                             │
│  Sound Effects    [●━━━━━○] │  ← Volume slider
│  Music            [●━━━━━○] │
│  Haptics          [  ON  ]  │  ← Toggle
│  Notifications    [  ON  ]  │
│                             │
│  ─────────────────────────  │
│                             │
│  Account                    │
│  ┌─────────────────────────┐│
│  │ Link Apple ID    [Link] ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ Link Google      [Link] ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ Restore Purchases       ││
│  └─────────────────────────┘│
│                             │
│  ─────────────────────────  │
│                             │
│  Player ID: a1b2c3d4 [📋]  │  ← Copy button
│  Version: 1.0.0 (42)       │
│                             │
│  Privacy Policy             │
│  Terms of Service           │
│  Credits                    │
│  Support & Feedback         │
│                             │
└─────────────────────────────┘
```

---

## 13. Profile Screen

```
┌─────────────────────────────┐
│  ← Back      PROFILE        │
│─────────────────────────────│
│                             │
│        ╭───────────╮        │
│        │  🌍       │        │  ← Player's equipped
│        │  (planet  │        │     planet skin preview
│        │   skin)   │        │
│        ╰───────────╯        │
│     Level 7 — River Weaver  │
│     XP: 20,000 / 32,000    │
│     ▓▓▓▓▓▓▓▓▓░░░░░░        │
│                             │
│  ── Stats ──                │
│  Total Runs ........... 186 │
│  Wins ................. 124 │
│  Win Rate ............. 67% │
│  Total Merges ...... 3,842  │
│  Longest Chain ......... 4  │
│  Best Score ....... 12,400  │
│  Animals Found ... 8 / 10   │
│  Landmarks Built . 6 / 10   │
│  Play Time ........ 4h 22m  │
│                             │
│  ── Badges ──               │
│  🏅🏅🏅🏅○○○○○○              │
│  4 / 10 unlocked            │
│                             │
│  ── Equipped ──             │
│  Planet: Classic Earth      │
│  Tiles: Default             │
│  Effect: Default Sparkle    │
│  Music: Standard            │
│  [Customize]                │
│                             │
└─────────────────────────────┘
```

---

## 14. Tutorial Overlay Sequence

### Step 1: First Tile

```
┌─────────────────────────────┐
│                             │
│  (score hidden)             │
│                             │
│   ┌─────────────────────┐   │
│   │     │     │     │   │   │
│   │     │     │     │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │  ← All cells pulsing
│   │     │     │     │   │   │     softly
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │
│   │     │     │     │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │
│   │     │     │     │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │
│   │     │     │     │   │   │
│   └─────┴─────┴─────┴───┘   │
│                             │
│  ╔═══════════════════════╗  │
│  ║ Tap anywhere to place ║  │  ← Tutorial banner
│  ║ your rock. 🪨         ║  │
│  ╚═══════════════════════╝  │
│                             │
│          [ 🪨 ]             │  ← Only 1 tile in queue
│                             │
└─────────────────────────────┘
```

### Step 3: First Merge

```
┌─────────────────────────────┐
│                             │
│                             │
│   ┌─────────────────────┐   │
│   │     │     │     │   │   │
│   │     │     │     │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │
│   │     │ 🪨✨│ 🪨✨│   │   │  ← Rocks glowing,
│   ├─────┼─────┼─────┼───┤   │     about to merge
│   │     │     │     │   │   │
│   │     │ 🪨✨│     │   │   │
│   ├─────┼─────┼─────┼───┤   │
│   │     │     │     │   │   │
│   └─────┴─────┴─────┴───┘   │
│                             │
│  ╔═══════════════════════╗  │
│  ║ Three rocks became a  ║  │
│  ║ hill! ⛰️ Merging is    ║  │
│  ║ the heart of your     ║  │
│  ║ planet.               ║  │
│  ╚═══════════════════════╝  │
│                             │
│         +50 ⭐               │
│                             │
└─────────────────────────────┘
```

---

## 15. Notification Templates

| Trigger | Title | Body | Timing |
|---|---|---|---|
| Daily Planet reset | "New Daily Planet!" | "Today's planet awaits. Can you top yesterday's score?" | 9:00 AM local |
| Streak reminder | "Don't break your streak!" | "Day {N} streak — log in to keep it going!" | 8:00 PM local (only if not played today) |
| Event start | "{Event Name} begins!" | "Special tiles and an exclusive animal await!" | Event start time |
| Event ending | "Event ending soon!" | "{Event Name} ends in 4 hours. Claim your rewards!" | 4 hours before end |
| Friend challenge | "Challenge received!" | "{FriendName} wants to see your best planet!" | On receipt |
| Friend gift | "Gift received!" | "{FriendName} sent you Stardust!" | On receipt |
| Come back (D3) | "Your planets miss you!" | "A new week of daily planets awaits." | 3 days after last session |
| Come back (D7) | "Cosmic seeds are waiting" | "New events and challenges have arrived!" | 7 days after last session |

**Rules:**
- Maximum 1 notification per day (unless friend-triggered).
- Players can disable all notifications in Settings.
- Never more than 2 re-engagement notifications total. Stop after D7 if player doesn't return.

---

*Document version: 1.0 — UI Wireframes*
