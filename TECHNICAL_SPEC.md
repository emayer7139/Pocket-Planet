# Pocket Planet Merge — Technical Specification

*System architecture, data schemas, screen flows, state machines, and implementation guidance.*

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Mobile)                   │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌────────────────┐  │
│  │  UI Layer  │  │Game Logic │  │  Data Layer    │  │
│  │  (Screens, │  │(Grid,Merge│  │  (Save, Config,│  │
│  │   HUD,     │◄►│ Score,    │◄►│   Analytics,   │  │
│  │   Anim)    │  │ Spawning) │  │   Economy)     │  │
│  └───────────┘  └───────────┘  └───────┬────────┘  │
│                                        │            │
│  ┌───────────┐  ┌───────────┐  ┌───────▼────────┐  │
│  │  Audio    │  │  Ad SDK   │  │  Local Save    │  │
│  │  Manager  │  │  (AdMob)  │  │  (JSON/Binary) │  │
│  └───────────┘  └───────────┘  └───────┬────────┘  │
│                                        │            │
└────────────────────────────────────────┼────────────┘
                                         │
                              ┌──────────▼──────────┐
                              │   BACKEND (Minimal)  │
                              │                      │
                              │  ┌────────────────┐  │
                              │  │  Cloud Save    │  │
                              │  │  (Firebase)    │  │
                              │  └────────────────┘  │
                              │  ┌────────────────┐  │
                              │  │  Daily Seed    │  │
                              │  │  Generator     │  │
                              │  └────────────────┘  │
                              │  ┌────────────────┐  │
                              │  │  Leaderboard   │  │
                              │  │  Service       │  │
                              │  └────────────────┘  │
                              │  ┌────────────────┐  │
                              │  │  Event Config  │  │
                              │  │  (Remote)      │  │
                              │  └────────────────┘  │
                              │  ┌────────────────┐  │
                              │  │  Friend/Social │  │
                              │  │  Service       │  │
                              │  └────────────────┘  │
                              └─────────────────────┘
```

### 1.2 Design Principles

- **Client-authoritative gameplay.** All game logic runs on-device. The server never validates moves or scores for normal play. (Daily Planet leaderboard may use server-side validation for anti-cheat in a future update.)
- **Offline-first.** The game is fully playable offline. Cloud sync happens opportunistically when connectivity is available.
- **Minimal server.** The backend is a thin set of serverless functions (Firebase Cloud Functions or AWS Lambda) for daily seeds, leaderboards, event configs, and cloud saves. No always-on server.
- **Deterministic replay.** Given a seed (tile queue) and a sequence of player moves (cell coordinates), the entire run can be replayed deterministically. This enables async challenges and anti-cheat verification.

---

## 2. Core Systems — Detailed Design

### 2.1 Grid Manager

**Responsibility:** Owns the NxN grid state, handles tile placement, adjacency queries, and board-full detection.

**Data Structure:**

```
Grid {
    size: int (5 or 6)
    cells: Cell[size][size]
}

Cell {
    row: int
    col: int
    tile: Tile | null
    is_obstacle: bool
    obstacle_type: ObstacleType | null
}

Tile {
    id: UUID
    chain: ChainType (earth, water, plant, snow, sand, ...)
    tier: int (1–5)
    is_animal: bool
    is_landmark: bool
    animal_type: AnimalType | null
    landmark_type: LandmarkType | null
    placed_turn: int
}
```

**Key Operations:**

| Operation | Description | Complexity |
|---|---|---|
| `place_tile(row, col, tile)` | Places tile in cell. Returns error if occupied. | O(1) |
| `get_adjacent(row, col)` | Returns list of orthogonal neighbors (up to 4). | O(1) |
| `find_merge_group(row, col)` | BFS/flood-fill from placed tile to find all connected identical tiles. Returns group if size ≥ 3. | O(N) where N = grid cells |
| `is_board_full()` | Checks if all cells are occupied. | O(N) |
| `has_possible_merges()` | Scans for any group of 3+ identical adjacent tiles. Used for game-over check. | O(N) |
| `remove_tiles(list)` | Removes tiles from specified cells. | O(k) |
| `find_empty_adjacent(row, col)` | Returns nearest empty cell to given position. | O(N) |

### 2.2 Tile Queue Manager

**Responsibility:** Generates and serves the upcoming tile sequence.

**Data Structure:**

```
TileQueue {
    seed: int (for deterministic mode / Daily Planet)
    rng: SeededRNG
    biome: BiomeType
    level_config: LevelConfig
    queue: Tile[] (visible lookahead, typically 2–3)
    turn_count: int
    wild_counter: int
}
```

**Generation Algorithm:**

```
function generate_next_tile():
    turn_count += 1

    // Wild tile check
    wild_counter += 1
    if wild_counter >= wild_interval:
        wild_counter = 0
        return WildTile

    // Obstacle check (if level has obstacles)
    if level_config.has_obstacles AND turn_count % obstacle_interval == 0:
        queue obstacle spawn (placed by system, not player)

    // Tier roll
    tier_roll = rng.random(0, 100)
    if tier_roll < 85: tier = 1
    else if tier_roll < 97: tier = 2
    else: tier = 3

    // Chain roll (biome-weighted)
    chain_roll = rng.random(0, 100)
    if chain_roll < 50: chain = biome.primary_chain
    else if chain_roll < 80: chain = biome.secondary_chain
    else: chain = biome.tertiary_chain

    return Tile(chain, tier)
```

### 2.3 Merge Engine

**Responsibility:** Detects merges, executes them, handles chain reactions, triggers life bursts, and calculates score deltas.

**Merge Flow (State Machine):**

```
           ┌──────────────┐
           │  TILE_PLACED  │
           └──────┬───────┘
                  │
                  ▼
        ┌─────────────────┐
        │ CHECK_FOR_MERGE  │◄──────────────────┐
        └────────┬────────┘                    │
                 │                              │
          ┌──────┴──────┐                       │
          │             │                       │
     No merge      Merge found                 │
          │             │                       │
          ▼             ▼                       │
    ┌──────────┐  ┌───────────┐                │
    │  IDLE    │  │ EXECUTE   │                │
    │(wait for │  │ MERGE     │                │
    │next turn)│  │           │                │
    └──────────┘  └─────┬─────┘                │
                        │                       │
                        ▼                       │
                  ┌───────────┐                │
                  │ LIFE_BURST│                │
                  │ CHECK     │                │
                  └─────┬─────┘                │
                        │                       │
                        ▼                       │
                  ┌───────────┐                │
                  │ SCORE     │                │
                  │ UPDATE    │                │
                  └─────┬─────┘                │
                        │                       │
                        ▼                       │
                  ┌───────────────┐             │
                  │ CHECK_CHAIN   │─── Yes ─────┘
                  │ (new tile     │
                  │  has merge?)  │
                  └───────┬───────┘
                          │ No
                          ▼
                    ┌──────────┐
                    │  IDLE    │
                    └──────────┘
```

**Merge Execution Steps:**

1. Identify merge group (BFS from placed tile).
2. Determine merge result: `new_tier = group[0].tier + 1`, same chain.
3. Determine merge position: the cell of the last-placed tile.
4. Play merge animation (tiles slide to merge point).
5. Remove all group tiles from grid.
6. Place result tile at merge position.
7. Award merge bonus points.
8. Check life burst eligibility (tier ≥ 3).
9. If life burst: roll loot table, find spawn cell, place entity.
10. Check if result tile forms a new merge group → if yes, recurse (chain merge).
11. Update score display.

### 2.4 Score Manager

**Data Structure:**

```
RunScore {
    planet_score: int       // sum of all tile values on board
    merge_bonus: int        // accumulated merge bonuses
    total_score: int        // planet_score + merge_bonus
    target_score: int       // level target
    bonus_goals: BonusGoal[]
    animals_spawned: int
    landmarks_built: int
    chain_merges: int
    highest_tier_reached: int
}

BonusGoal {
    type: GoalType
    description: string
    target_value: int
    current_value: int
    completed: bool
}
```

**Score Recalculation:** After every merge, planet_score is recalculated by summing all tile values on the board (including animals and landmarks). This is O(N) but N is at most 36 (6×6), so it's trivial.

### 2.5 Life Burst System

**Flow:**

1. Merge Engine signals a qualifying merge (tier ≥ 3).
2. Roll against life burst probability (see CONTENT_BALANCE.md §3.1).
3. If triggered, roll loot table for the specific chain and tier.
4. Find spawn cell (see §3.3 in CONTENT_BALANCE.md).
5. Create animal/landmark tile and place it.
6. Play life burst animation + sound.
7. Update collection book if this is a new discovery.
8. Award bonus points.

### 2.6 Save System

**Local Save Format (JSON):**

```
SaveData {
    version: int
    player: {
        id: string (UUID)
        name: string
        xp: int
        level: int
        stardust: int
        moonstones: int
        created_at: ISO8601
        last_played: ISO8601
    }
    progression: {
        current_level: int
        cumulative_score: int
        biomes_unlocked: string[]
        levels_completed: { level_id: { stars: int, best_score: int, completed_at: ISO8601 } }
    }
    upgrades: {
        bigger_planet: bool
        deeper_queue: bool
        lucky_stars: int (0–3)
        life_magnet: bool
        sturdy_core: int (0–3)
        meteor_shield: int (0–3)
    }
    collection: {
        tiles: { tile_id: { discovered: bool, merge_count: int } }
        animals: { animal_id: { discovered: bool, spawn_count: int } }
        landmarks: { landmark_id: { discovered: bool, build_count: int } }
    }
    cosmetics: {
        owned: string[]
        equipped: {
            planet_skin: string
            tile_skin: string
            merge_effect: string
            music_pack: string
        }
    }
    daily: {
        last_login_date: ISO8601
        streak_count: int
        daily_planet_completed_today: bool
        daily_planet_best_score: int
        daily_goal_completed: bool
    }
    social: {
        friends: string[] (player IDs)
        gifts_sent_today: int
        challenges_sent: { challenge_id: { seed: int, score: int, opponent_id: string } }
    }
    settings: {
        sound_enabled: bool
        music_enabled: bool
        haptics_enabled: bool
        notifications_enabled: bool
        ad_free: bool
    }
    stats: {
        total_runs: int
        total_wins: int
        total_merges: int
        total_chain_merges: int
        longest_chain: int
        highest_single_run_score: int
        total_animals_spawned: int
        total_landmarks_built: int
        total_stardust_earned: int
        total_ads_watched: int
        play_time_seconds: int
    }
    achievements: { achievement_id: { unlocked: bool, unlocked_at: ISO8601 } }
}
```

**Save Triggers:**
- After every completed run (win or loss).
- After any purchase (upgrade, cosmetic, IAP).
- After collection book update.
- On app background/suspend.
- Every 60 seconds during active play (crash safety).

**Cloud Sync:**
- On app launch: pull cloud save, compare timestamps, use most recent.
- On significant events (level complete, purchase): push to cloud.
- Conflict resolution: latest `last_played` timestamp wins. If within 5 minutes, merge additively (take max of each counter).

### 2.7 Economy Manager

**Responsibility:** Single source of truth for currency balances. All earn/spend goes through this system.

**Operations:**

| Operation | Validation |
|---|---|
| `earn_stardust(amount, source)` | Always succeeds. Logs source for analytics. |
| `spend_stardust(amount, sink)` | Fails if balance < amount. Logs sink. |
| `earn_moonstones(amount, source)` | Always succeeds. Logs source. |
| `spend_moonstones(amount, sink)` | Fails if balance < amount. Logs sink. |
| `process_iap(product_id, receipt)` | Validates receipt with platform store. Grants currency/item on success. |
| `grant_ad_reward(reward_type)` | Called after confirmed ad completion. Grants appropriate reward. |

**Anti-Exploit:** Currency balances are stored locally but also logged server-side on cloud sync. If a local balance is suspiciously higher than the server-side log, the server value is used on next sync.

### 2.8 Tutorial Manager

**State Machine:**

```
TUTORIAL_STATES = {
    NOT_STARTED,
    PLACE_FIRST_ROCK,
    PLACE_TWO_MORE,
    FIRST_MERGE,
    INTRODUCE_VARIETY,
    FIRST_LIFE_BURST,
    SHOW_GOAL,
    COMPLETE
}
```

Each state has:
- **Entry condition:** What triggers transition to this state.
- **UI overlay:** Message text, highlighted cells, disabled buttons.
- **Exit condition:** What the player must do to advance.
- **Persistence:** Tutorial state saved so it survives app kill.

Post-tutorial tooltips (undo button, queue explanation) use a separate `TooltipManager` that tracks which tips have been shown.

### 2.9 Audio Manager

**Architecture:**

```
AudioManager {
    bgm_player: AudioSource (looping, crossfade between tracks)
    sfx_pool: AudioSource[] (pool of 8 sources for concurrent SFX)
    haptic_engine: HapticFeedback

    // Dynamic merge sound
    merge_base_note: float (Hz)
    merge_pitch_scale: float[] = [1.0, 1.2, 1.4, 1.6, 1.8] // per tier
    chain_pitch_offset: float = 0.1 // added per chain step
}
```

**Merge Sound Logic:**
- Base note: C5 (523 Hz) on a marimba/xylophone sample.
- Tier pitch: Multiply base frequency by `merge_pitch_scale[tier]`.
- Chain bonus: Each step in a chain adds `chain_pitch_offset` to create an ascending melody.
- Result: A simple merge plays one note. A 4-step chain plays four ascending notes, naturally creating a satisfying musical phrase.

**BGM Crossfade:**
- When switching biomes, crossfade over 2 seconds.
- BGM volume ducks 30% during merge animations so SFX is prominent.

---

## 3. Screen Flow

### 3.1 Navigation Map

```
                    ┌──────────┐
                    │  SPLASH  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
            ┌───────│MAIN MENU │───────┐
            │       │/WORLD MAP│       │
            │       └──┬───┬──┘       │
            │          │   │          │
     ┌──────▼──┐  ┌────▼┐ ┌▼─────┐  ┌▼────────┐
     │COLLECTION│  │SHOP │ │SOCIAL│  │SETTINGS │
     │  BOOK   │  │     │ │      │  │         │
     └─────────┘  └─────┘ └──────┘  └─────────┘
            │
            │ (tap level)
            │
     ┌──────▼──────┐
     │   GAMEPLAY   │
     │              │
     └──────┬──────┘
            │
     ┌──────┴──────┐
     │             │
┌────▼────┐  ┌────▼────┐
│ WIN     │  │ LOSS    │
│ RESULT  │  │ RESULT  │
└────┬────┘  └────┬────┘
     │            │
     │  ┌─────┐   │
     └─►│NEXT │◄──┘
        │LEVEL│
        └──┬──┘
           │
           ▼
      WORLD MAP


   Side entries (accessible from Main Menu):
   ┌─────────────┐  ┌──────────┐  ┌─────────┐
   │DAILY PLANET │  │  EVENTS  │  │ PROFILE │
   └─────────────┘  └──────────┘  └─────────┘
```

### 3.2 Screen Specifications

#### Splash Screen
- **Duration:** 2–3 seconds or until assets loaded.
- **Content:** Game logo (animated planet forming from particles), loading bar, "Tip of the Day" text.
- **Transition:** Fade to Main Menu.

#### Main Menu / World Map
- **Layout:** Scrollable map showing biome regions with level nodes (dots connected by paths). Current level pulses. Locked biomes are grayed/foggy.
- **HUD:** Top bar with Stardust count (left), Moonstones count (right), player level/title (center). Bottom bar with navigation icons: Collection Book, Shop, Daily Planet, Events, Social, Settings.
- **Interactions:** Tap level node → transition to Gameplay. Tap biome name → info popup.

#### Gameplay Screen
- **Layout:**
  - **Top:** Planet Score (large, center), target score (smaller, below), bonus goal indicators (small icons, top-right).
  - **Center:** 5×5 (or 6×6) grid. Grid cells are clearly delineated squares with rounded corners. The planet globe rotates slowly behind the grid (parallax background).
  - **Bottom:** Tile queue (2–3 tiles shown left-to-right, next tile highlighted), Undo button (bottom-left, with counter badge), Pause/Settings (top-left).
- **Interactions:** Tap cell → place tile. Tap undo → rewind last move. Tap pause → pause overlay.

#### Win Result Screen
- **Layout:**
  - Planet celebration animation (background).
  - "Planet Complete!" header.
  - Score breakdown: Planet Score, Merge Bonuses, Bonus Goals (checkmarks), Total.
  - Stardust earned (with option to "Watch ad to double").
  - New discoveries (animals/landmarks found this run, with "NEW" badge).
  - Buttons: "Next Level" (primary), "Replay" (secondary), "Share Snapshot" (tertiary).
- **Transition:** "Next Level" → Gameplay (next level). "Replay" → Gameplay (same level). Snapshot → share sheet.

#### Loss Result Screen
- **Layout:**
  - Planet dims (background).
  - "Planet Full!" header (gentle, not harsh).
  - Score reached vs. target (progress bar showing how close).
  - "Watch ad to continue?" button (clears 5 cells).
  - Stardust earned (reduced).
  - Buttons: "Try Again" (primary), "World Map" (secondary).

#### Collection Book
- **Layout:** Tabbed view (Tiles, Animals, Landmarks, Biomes). Each tab shows a grid of circular icons. Discovered items are full color; undiscovered are silhouettes. Tap an item → detail popup with name, description, stats (times merged/spawned), and 3D model preview.
- **Progress bar:** Per page and overall completion percentage shown at top.

#### Shop
- **Tabs:** Featured (rotating deals), Stardust Items, Moonstone Items, IAP (real money).
- **Each item:** Icon, name, price, "Buy" button. Owned items show a checkmark.
- **Season Pass:** Banner at top of Featured tab with preview of monthly rewards.

#### Daily Planet
- **Layout:** Same as Gameplay but with fixed tile queue visible as a row of all 30 tiles across the bottom (scrollable). Leaderboard button in top-right. Timer showing hours until next Daily Planet.
- **Post-run:** Score + rank + percentile shown. "Share" button for bragging.

#### Events
- **Layout:** Event banner (art + title + timer). Progress bar with 3 tier markers (Bronze/Silver/Gold). Current event chain tiles displayed. Reward previews at each tier. "Play" button that launches normal gameplay with event tile pool modifier active.

#### Social / Friends
- **Layout:** Friend list (avatar + name + weekly score). "Add Friend" (share code or platform link). Buttons per friend: "Challenge" (send async seed), "Gift" (send Stardust, once/day). Tabs: Friends, Challenges (inbox/outbox), Community Gallery.

#### Settings
- **Toggles:** Sound, Music, Haptics, Notifications.
- **Buttons:** Link Account (Google/Apple), Restore Purchases, Privacy Policy, Terms of Service, Credits, Support/Feedback.
- **Info:** Player ID (copyable), app version.

#### Profile
- **Content:** Player avatar (auto-generated from equipped cosmetics), level/title, stats summary (total runs, wins, merges, play time), badge showcase (selected achievements), equipped cosmetics preview.

---

## 4. Input Handling

### 4.1 Tap Detection

- **Tap target size:** Each grid cell must be at minimum 44×44 points (iOS HIG) / 48×48 dp (Material Design).
- **On a 5×5 grid:** With 8pt gutters, the grid fits within ~280pt width — comfortably within one-handed thumb reach on phones ≥ 375pt wide (iPhone SE and up).
- **On a 6×6 grid:** ~336pt width. Still fits but cells are tighter. Consider hiding non-essential UI during gameplay on smaller devices.
- **Dead zone:** 4pt dead zone around each cell to prevent mis-taps.
- **Feedback:** Immediate visual feedback on tap (cell highlights) before tile placement animation plays.

### 4.2 Gesture Support

| Gesture | Action | Context |
|---|---|---|
| Tap | Place tile / select UI element | Everywhere |
| Swipe (background) | Rotate planet globe (cosmetic) | Gameplay |
| Long press (tile) | Show tile info tooltip | Gameplay |
| Swipe left (result screen) | Quick restart / next level | Result screens |
| Pinch (future) | Reserved for zoom if needed on 6×6 | Gameplay |

### 4.3 One-Handed Optimization

- All critical buttons (undo, pause) are in the bottom half of the screen.
- Tile queue is centered at the bottom, within natural thumb arc.
- Score and goals are at the top (read-only, no tap needed during play).
- No swipe-to-merge or drag mechanics — only taps. This ensures one-handed, one-thumb play.

---

## 5. Data Schemas (Server-Side)

### 5.1 Daily Seed

```
DailySeed {
    date: "YYYY-MM-DD"
    seed: int (hash of date + salt)
    biome: BiomeType
    queue: int[] (30 tile IDs, deterministic from seed)
    version: int (schema version for compatibility)
}
```

Endpoint: `GET /daily-seed?date=YYYY-MM-DD`
Response cached at CDN with 24-hour TTL.

### 5.2 Leaderboard Entry

```
LeaderboardEntry {
    player_id: string
    player_name: string
    score: int
    date: "YYYY-MM-DD"
    replay_hash: string (hash of move sequence for verification)
    submitted_at: ISO8601
}
```

Endpoint: `POST /leaderboard/daily`
Query: `GET /leaderboard/daily?date=YYYY-MM-DD&limit=100&offset=0`

### 5.3 Event Config

```
EventConfig {
    event_id: string
    title: string
    description: string
    start_time: ISO8601
    end_time: ISO8601
    theme_chain: ChainType
    tile_pool_modifier: float (injection rate, e.g., 0.15)
    exclusive_animal: AnimalType
    tiers: [
        { name: "Bronze", target: 500, rewards: [...] },
        { name: "Silver", target: 2000, rewards: [...] },
        { name: "Gold", target: 5000, rewards: [...] }
    ]
    cosmetic_reward: CosmeticID
    banner_image_url: string
}
```

Endpoint: `GET /events/current`
Polled on app launch and every 6 hours.

### 5.4 Cloud Save

```
CloudSave {
    player_id: string
    save_data: SaveData (see §2.6, compressed/encrypted)
    last_modified: ISO8601
    checksum: string (SHA-256 of save_data)
    device_id: string
}
```

Endpoint: `PUT /save/{player_id}` / `GET /save/{player_id}`
Sync on launch, on significant events, and on app background.

### 5.5 Async Challenge

```
Challenge {
    challenge_id: string
    sender_id: string
    receiver_id: string
    seed: int
    biome: BiomeType
    queue: int[] (tile sequence)
    sender_score: int
    receiver_score: int | null
    status: "pending" | "completed" | "expired"
    created_at: ISO8601
    expires_at: ISO8601 (7 days from creation)
}
```

Endpoint: `POST /challenges` / `GET /challenges/{player_id}` / `PUT /challenges/{challenge_id}`

### 5.6 Friend Gift

```
Gift {
    gift_id: string
    sender_id: string
    receiver_id: string
    amount: 25 (Stardust)
    claimed: bool
    created_at: ISO8601
}
```

Endpoint: `POST /gifts` / `GET /gifts/{player_id}/unclaimed`

---

## 6. Analytics Events

### 6.1 Event Schema (Common Fields)

Every event includes:

```
{
    event_name: string,
    timestamp: ISO8601,
    player_id: string,
    session_id: string,
    player_level: int,
    platform: "ios" | "android",
    device_model: string,
    os_version: string,
    app_version: string,
    country: string
}
```

### 6.2 Event Catalog

#### Session Events

| Event | Additional Fields |
|---|---|
| `session_start` | `is_first_session: bool`, `days_since_install: int` |
| `session_end` | `duration_seconds: int`, `runs_played: int` |

#### Gameplay Events

| Event | Additional Fields |
|---|---|
| `run_start` | `level_id: int`, `biome: string`, `grid_size: int`, `is_daily: bool`, `is_challenge: bool` |
| `run_end` | `result: "win" | "loss"`, `score: int`, `target: int`, `tiles_placed: int`, `merges: int`, `chain_merges: int`, `longest_chain: int`, `animals_spawned: int`, `landmarks_built: int`, `highest_tier: int`, `bonus_goals_completed: int`, `undo_used: int`, `duration_seconds: int`, `continued_with_ad: bool` |
| `merge` | `chain: string`, `from_tier: int`, `to_tier: int`, `group_size: int`, `is_chain: bool`, `chain_step: int` |
| `life_burst` | `entity_type: "animal" | "landmark"`, `entity_id: string`, `is_new_discovery: bool` |

#### Economy Events

| Event | Additional Fields |
|---|---|
| `currency_earn` | `currency: "stardust" | "moonstone"`, `amount: int`, `source: string` |
| `currency_spend` | `currency: "stardust" | "moonstone"`, `amount: int`, `sink: string`, `item_id: string` |
| `iap_initiated` | `product_id: string`, `price: float`, `currency: string` |
| `iap_completed` | `product_id: string`, `price: float`, `transaction_id: string` |
| `iap_failed` | `product_id: string`, `error: string` |
| `ad_requested` | `ad_type: "rewarded" | "interstitial"`, `placement: string` |
| `ad_completed` | `ad_type: string`, `placement: string`, `reward: string` |
| `ad_skipped` | `ad_type: string`, `placement: string` |

#### Progression Events

| Event | Additional Fields |
|---|---|
| `level_complete` | `level_id: int`, `score: int`, `attempts: int` |
| `biome_unlock` | `biome: string` |
| `upgrade_purchase` | `upgrade_id: string`, `upgrade_level: int`, `cost: int` |
| `collection_discover` | `entity_type: string`, `entity_id: string`, `total_discovered: int`, `total_possible: int` |
| `player_level_up` | `new_level: int`, `total_xp: int` |

#### Social Events

| Event | Additional Fields |
|---|---|
| `snapshot_shared` | `platform: string` (twitter, instagram, etc.) |
| `challenge_sent` | `challenge_id: string` |
| `challenge_completed` | `challenge_id: string`, `result: "win" | "loss"` |
| `gift_sent` | `recipient_id: string` |
| `friend_added` | `method: "code" | "platform"` |

#### Funnel Events (First-Time Only)

| Event | Trigger |
|---|---|
| `ftue_start` | App opened for the first time |
| `ftue_first_tap` | Player places first tile |
| `ftue_first_merge` | First merge occurs |
| `ftue_first_animal` | First animal spawned |
| `ftue_first_win` | First level completed |
| `ftue_world_map` | First time on world map |
| `ftue_second_level` | Second level started |
| `ftue_complete` | Tutorial state machine reaches COMPLETE |

---

## 7. Performance Targets

| Metric | Target | Notes |
|---|---|---|
| Frame rate | 60 FPS (gameplay), 30 FPS minimum | Drop to 30 FPS only during heavy particle effects |
| Load time (cold start) | < 3 seconds | To splash screen. Game-ready in < 5s. |
| Load time (level start) | < 0.5 seconds | Near-instant feel for "one more try" |
| Memory usage | < 200 MB | Target low-end devices with 2 GB RAM |
| Battery draw | Low | No heavy physics, no constant network. Audio and simple animations only. |
| App size (download) | < 100 MB | Initial download. Asset bundles for later biomes loaded on demand. |
| App size (installed) | < 150 MB | With all biomes downloaded |
| Network usage | Minimal | Cloud sync, leaderboard, events only. < 1 MB/day for active player. |
| Offline capability | Full gameplay | All features except leaderboards, cloud sync, and events work offline |

---

## 8. Platform-Specific Notes

### iOS
- Minimum deployment target: iOS 14.0.
- Support iPhone SE (2nd gen) and up (screen width ≥ 375pt).
- Integrate with Game Center for achievements and leaderboards (optional secondary system).
- Use StoreKit 2 for IAP.
- Use SKAdNetwork for ad attribution.
- Support Dynamic Island / Live Activities for event countdowns (stretch goal).

### Android
- Minimum SDK: API 26 (Android 8.0 Oreo).
- Support screen densities from hdpi to xxxhdpi.
- Integrate with Google Play Games Services for achievements and leaderboards.
- Use Google Play Billing Library v6+ for IAP.
- Handle notch/cutout insets gracefully.
- Support Android back button (pause during gameplay, navigate back on menus).

### Cross-Platform
- Use platform-agnostic engine (Unity or Godot) for shared codebase.
- Abstract platform services (auth, IAP, ads, haptics) behind interfaces for per-platform implementation.
- Save data format is identical across platforms. Cloud save enables cross-platform progression (same account, different devices).

---

## 9. Security Considerations

| Concern | Mitigation |
|---|---|
| Save file tampering | Checksum validation on cloud sync. If checksum mismatch, server save takes precedence. |
| Fake IAP receipts | Server-side receipt validation with Apple/Google before granting premium currency. |
| Leaderboard cheating | Daily Planet uses deterministic replay: top scores can be verified by replaying the move sequence server-side. Flagged scores are hidden. |
| Memory editing (e.g., GameGuardian) | Obfuscate currency values in memory (store as `value XOR key` with rotating key). Not bulletproof but raises the bar. |
| Network sniffing | All API calls over HTTPS. API keys stored in platform-secure storage (Keychain / Keystore). |
| Bot/automation | Rate limit API calls. Flag accounts with inhuman play patterns (< 1 second between moves consistently). |

---

## 10. Testing Strategy

### 10.1 Unit Tests

| System | Test Focus |
|---|---|
| Grid Manager | Adjacency correctness, boundary conditions, placement validation |
| Merge Engine | 3-tile merge, 4-tile merge, 5-tile merge, L-shape merge, T-shape merge, chain merges (2/3/4 steps), no-merge cases |
| Tile Queue | Deterministic output given same seed, weight distribution over 10,000 samples |
| Score Manager | Point calculation, bonus goal tracking, score recalculation after merge |
| Life Burst | Probability distribution, spawn placement, collection book update |
| Economy | Earn/spend validation, insufficient balance handling, overflow protection |
| Save System | Serialize/deserialize round-trip, version migration, corruption handling |

### 10.2 Integration Tests

| Flow | Test Scenario |
|---|---|
| Full run (win) | Simulate a complete winning run. Verify score, Stardust, collection, progression all update correctly. |
| Full run (loss) | Simulate a losing run. Verify reduced rewards, ad-continue flow. |
| Chain merge | Set up a board state that triggers a 4-step chain. Verify all intermediate states and final score. |
| Tutorial | Step through entire tutorial. Verify state machine transitions and persistence. |
| Daily Planet | Generate seed, play a run, submit score, verify leaderboard entry. |
| Cloud sync | Save locally, sync to server, modify server, sync back, verify merge. |

### 10.3 Playtesting Metrics

| Metric | Target |
|---|---|
| Tutorial completion rate | > 95% |
| D1 retention | > 40% |
| D7 retention | > 20% |
| D30 retention | > 8% |
| Average session length | 5–10 minutes |
| Average runs per session | 4–8 |
| First IAP conversion | > 3% within 7 days |
| Ad opt-in rate (rewarded) | > 50% of eligible impressions |

---

*Document version: 1.0 — Technical Specification*
