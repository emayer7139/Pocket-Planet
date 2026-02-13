# Pocket Planet Merge — Game Design Document

*A casual mobile merge game where you grow a tiny planet from dust to a thriving world, one satisfying merge at a time.*

---

## 1. Elevator Pitch

Pocket Planet Merge is a cozy, one-handed merge puzzle game where players combine simple tiles — rock, water, and grass — on a tiny 5x5 planet grid to create hills, rivers, forests, mountains, and eventually entire biomes teeming with adorable animals and miniature landmarks. Each run lasts 30 to 90 seconds, making it perfect for bus rides, waiting rooms, and bedtime wind-downs. The "just one more planet" hook comes from the tension of a filling board, the dopamine of chain-merging three rocks into a volcano, and the long-term joy of filling out a collection book of creatures and worlds. It has mass appeal because it combines the proven merge-puzzle mechanic (Threes!, Triple Town, 2048) with the cozy planet-builder fantasy (seen in games like Doodle God and Worldbox), wrapped in bright toy-like art that appeals to ages 8 to 80, all without time pressure or aggressive monetization.

---

## 2. Player Controls & Rules

### Controls

| Action | Input |
|---|---|
| **Place a tile** | Tap any empty cell on the 5x5 grid. The next tile in the queue is placed there. |
| **Merge** | Automatic. When 3 or more identical tiles are orthogonally adjacent after placement, they merge into one higher-tier tile on the last-placed cell. |
| **Preview** | The next 2 tiles are shown in a queue at the bottom of the screen (like Tetris's "next piece"). |
| **Undo** | One free undo per run. Additional undos available via watching an ad or spending soft currency. |
| **Rotate view** | Swipe the planet globe in the background for a cosmetic spin (does not affect gameplay). |

### Rules

1. **Grid size:** 5x5 (25 cells). Upgradeable to 6x6 later in progression.
2. **Tile spawn:** Each turn, the player places one tile from the queue. Tiles are drawn from a weighted random pool based on the current biome/level.
3. **Merging:** 3+ identical adjacent tiles merge into 1 tile of the next tier. The resulting tile can immediately chain-merge if it forms a new group of 3+.
4. **Life bursts:** Certain merges (tier 3 and above) trigger a "life burst" — a small animated pop that spawns an animal or landmark on a random empty adjacent cell. Life bursts are the primary source of Planet Score.
5. **Planet Score:** Every tile on the board has a point value. Animals and landmarks are worth bonus points. The sum is the Planet Score.
6. **Wild tiles:** Occasionally (roughly 1 in 12 tiles), a rainbow "wild tile" appears that matches any adjacent type for merging.
7. **Obstacle tiles (later levels):** Meteor rocks, ice, and sand storms place unmergeable blockers that must be cleared by merging adjacent tiles of a specific type.

---

## 3. Core Gameplay Loop, Fail State & "One More Try"

### Core Loop (One Run: 30–90 seconds)

```
Start Run → See target Planet Score & bonus goals
    ↓
Place tile from queue onto grid
    ↓
Tiles merge automatically → chain merges → life bursts
    ↓
Board state updates, score tallies
    ↓
Repeat until target reached (WIN) or board fills (LOSE)
```

### Fail State

The run ends when **every cell on the grid is occupied and no merges are possible**. If the player has not reached the target Planet Score, the run is a loss. There is no timer — the only pressure is spatial.

### What Makes It "One More Try"

- **Near misses:** The player can see they were 200 points short, or one merge away from a chain that would have cleared half the board. The feeling of "if I had just placed that river tile one cell to the left..." is immediate.
- **Randomness with skill:** The tile queue is random, but placement is entirely the player's choice. Losses feel learnable, not unfair.
- **Chain merge fantasy:** Every run has the *possibility* of a massive chain reaction. Players chase the feeling of a 4-step cascade that transforms a cluttered board into a pristine mountain range.
- **Collection progress:** Even a lost run might spawn a new animal or landmark the player hasn't seen before, giving partial progress toward the collection book.
- **Quick restart:** Tapping "Try Again" instantly starts a new run with zero loading time.

---

## 4. Progression & Meta Loop

### 4.1 Soft Currency: Stardust

Earned every run (win or lose, scaled to score). Used for undos, cosmetics, and upgrades.

### 4.2 Hard Currency: Moonstones

Earned slowly through achievements, daily rewards, and events. Purchasable with real money. Used for premium cosmetics and convenience items.

### 4.3 Upgrades (Permanent, bought with Stardust)

| Upgrade | Effect | Levels |
|---|---|---|
| Bigger Planet | Unlock 6x6 grid | 1 |
| Deeper Queue | See 3 upcoming tiles instead of 2 | 1 |
| Lucky Stars | Increase wild tile frequency slightly | 3 |
| Life Magnet | Life bursts spawn on the best available cell, not random | 1 |
| Sturdy Core | Start each run with 1 pre-placed tier-2 tile | 3 |
| Meteor Shield | Reduce obstacle spawn rate on obstacle levels | 3 |

### 4.4 Unlocks (Progression-gated)

- **Biomes:** Unlock new biomes by reaching cumulative Planet Score milestones (see Section 10 for biome list).
- **Merge chains:** Higher-tier tiles unlock as the player progresses through levels.
- **Board themes:** Visual skins for the grid (wooden board, stone slab, cloud platform).

### 4.5 Cosmetics (Stardust or Moonstones)

- **Planet skins:** Change the background globe (Earth, Mars, candy planet, ocean world, etc.).
- **Tile skins:** Alternate art for tile sets (pixel art pack, watercolor pack, winter pack).
- **Merge effects:** Different particle animations for merges (sparkles, petals, snowflakes, bubbles).
- **Music packs:** Alternate background tracks (lo-fi, chiptune, nature sounds).

### 4.6 Collection Book

A persistent album with pages for:
- Every tile in every merge chain (bronze/silver/gold border based on how many times merged).
- Every animal discovered.
- Every landmark built.
- Every biome completed.

Filling a page grants a one-time Stardust and Moonstone reward.

### 4.7 Storyline Hook

> *A tiny cosmic seed drifts through space. You catch it in your palm. With each merge, the seed grows — from barren rock to a living, breathing pocket planet. But the universe is vast, and there are more seeds out there. Can you grow them all?*

Each biome unlock is framed as discovering a new cosmic seed. The collection book is your "galaxy of pocket planets." There is a gentle narrator voice (text only) that says things like: *"Your first mountain! The animals can see for miles now."* This gives emotional progression without requiring cutscenes or heavy narrative.

---

## 5. Daily & Weekly Content

### Daily

| Feature | Details |
|---|---|
| **Daily Planet** | A pre-set puzzle board with a specific tile queue. Same for all players. One attempt. Leaderboard ranked by score. |
| **Daily Gift** | Log in → receive Stardust. Streak bonus: days 1–6 give increasing Stardust, day 7 gives a Moonstone. Missing a day resets the streak to day 1 but does NOT take anything away. |
| **Daily Goal** | One simple bonus objective ("Merge 5 forests today"). Completing it grants Stardust. |

### Weekly

| Feature | Details |
|---|---|
| **Weekend Event** | A themed 3-day event (e.g., "Ocean Weekend" — water tiles appear more often, exclusive whale animal available). Progress is cumulative across all runs during the event. Rewards: exclusive cosmetic + Stardust. |
| **Weekly Challenge** | A harder puzzle (e.g., "Reach 5000 Planet Score on a 4x4 grid"). Completing it unlocks a badge. |

### Philosophy

- **No punishment for missing days.** Streaks give bonuses but breaking one never removes progress.
- **No energy system.** Players can always play. Unlimited runs.
- **No expiring content.** Event cosmetics may rotate back. Nothing is permanently missable.

---

## 6. Monetization

### Core Principle

The game is free to play, and every piece of gameplay content is earnable without paying. Money buys time savings and cosmetics — never power.

### 6.1 Ads

| Ad Type | Trigger | Reward |
|---|---|---|
| **Rewarded video (opt-in)** | After a loss: "Watch to continue?" Adds 5 empty cells (clears lowest-tier tiles). Once per run. | Continue the run |
| **Rewarded video (opt-in)** | After a win: "Double your Stardust?" | 2x Stardust for that run |
| **Rewarded video (opt-in)** | Extra undo: "Watch for +1 undo?" | 1 additional undo |
| **Interstitial (skippable after 5s)** | After every 4th completed run. Removed entirely with any purchase. | None |

### 6.2 In-App Purchases

| Item | Price (USD) | Contents |
|---|---|---|
| **Starter Bundle** (one-time) | $1.99 | 500 Stardust + 50 Moonstones + removes interstitial ads forever |
| **Moonstone Pouch** | $2.99 | 100 Moonstones |
| **Moonstone Chest** | $5.99 | 250 Moonstones |
| **Moonstone Vault** | $9.99 | 600 Moonstones |
| **Season Pass** (monthly) | $3.99/month | Exclusive monthly cosmetic set (planet skin + tile skin + merge effect) + 2x daily gift Stardust + 1 free undo per run |
| **Cosmetic Bundles** (rotating) | $2.99–$4.99 | Themed sets (e.g., "Cherry Blossom Pack": pink tile skin + petal merge effect + sakura landmark) |

### 6.3 What Is Never Paywalled

- Grid upgrades, tile unlocks, biome progression, animals, landmarks.
- Access to daily/weekly content.
- Ability to play unlimited runs at any time.
- Collection book progress.

### 6.4 What Premium Currency Buys

- Cosmetic skins (also earnable slowly with Stardust).
- Convenience: extra undos (also available via ads), instant unlock of upgrades (also earnable with Stardust).
- Season Pass exclusive cosmetics (the only truly exclusive items, but they are visual only).

---

## 7. Art Direction

### Visual Style

**Cozy toy-like 3D with clean outlines**, similar to the aesthetic of *Tiny Wings* meets *Monument Valley* meets a Playmobil playset. Think: soft lighting, rounded shapes, pastel-bright colors, and miniature scale.

- **Camera:** Top-down view of the 5x5 grid. The grid sits on a small spherical planet that slowly rotates in the background. The planet's surface reflects the biome (green and lush for Grassland, sandy for Desert, snowy for Tundra).
- **Tiles:** Slightly puffy, raised 3D tiles with a subtle shadow. Each tier looks visually "more complex" — a rock tile is a smooth pebble; a mountain tile has snowy peaks, tiny trees, and a cloud wisp.
- **Animals:** Tiny, round, low-poly creatures with 2–3 idle animations (bobbing, blinking, wagging). They sit on tiles after life bursts.
- **Landmarks:** Small 3D models (lighthouse, windmill, castle) that glow softly.

### UI Style

- **Minimal HUD:** Score at top center, tile queue at bottom center, undo button bottom-left, settings gear top-right.
- **Font:** Rounded sans-serif (similar to Nunito or Comfortaa). Friendly, readable.
- **Buttons:** Soft rounded rectangles with subtle bounce animations on tap.
- **Colors:** Each biome has a palette. Grassland = greens/yellows/sky blue. Ocean = teals/blues/white. Desert = golds/oranges/warm brown. Tundra = whites/light blues/silver. Volcano = reds/blacks/amber.
- **No clutter:** The grid and the planet are the stars. UI elements are translucent and recede when not needed.

### Animations

| Event | Animation | Duration |
|---|---|---|
| **Tile placed** | Tile drops in with a soft bounce and a tiny dust puff | 0.2s |
| **Merge (3 tiles)** | Tiles slide toward the merge point, flash white, pop into the new tile with a ring of particles | 0.4s |
| **Chain merge** | Same as merge but with escalating particle intensity and a subtle screen shake | 0.4s per step |
| **Life burst** | A small starburst of colored sparks; the animal/landmark fades in with a bounce and a chime | 0.6s |
| **Board full (loss)** | Tiles gently gray out, planet dims, soft "aww" sound | 1.0s |
| **Target reached (win)** | All tiles glow, fireworks around the planet, animals jump, triumphant jingle | 2.0s |
| **Undo** | Tile rewinds (reverse of placement animation) with a soft "whoosh" | 0.3s |

### Sound Design

- **Merge sounds:** A pentatonic xylophone note on each merge, pitched higher for higher tiers. Chain merges play ascending notes, creating an impromptu melody.
- **Life burst:** A soft chime + a tiny animal vocalization (chirp, ribbit, squeak).
- **Ambient:** Gentle background loop that matches the biome (birdsong for Grassland, waves for Ocean, wind for Tundra). Fades between biomes smoothly.
- **UI taps:** Soft, satisfying "click" — like tapping a wooden block.
- **Win jingle:** A short 4-note ascending phrase on a marimba.
- **Loss sound:** A gentle descending phrase — warm, not punishing. Think "better luck next time" not "you failed."
- **Haptics (mobile):** Light tap on tile placement, medium pulse on merge, strong pulse on chain merge. Optional, togglable in settings.

---

## 8. Social Features

All social features are async and require zero chatting.

| Feature | Details |
|---|---|
| **Global Leaderboard** | Daily Planet runs are ranked globally. Top 100 visible. Player sees their rank and the ranks of friends. Resets daily. |
| **Friend Leaderboard** | Persistent weekly score (sum of best daily runs). Compare with friends added via share code or linked social account. |
| **Planet Snapshots** | After any run, the player can save a "snapshot" of their planet — a small 3D render of the finished grid with animals and landmarks. Shareable as an image to social media, messaging apps, or the in-game gallery. |
| **Async Challenges** | A player can send a "Challenge Seed" to a friend: the exact same tile queue and grid. The friend plays it and scores are compared. No real-time connection needed. |
| **Friend Boosts** | Once per day, a player can send a "Stardust Gift" (25 Stardust) to a friend. Both the sender and receiver get the Stardust. Encourages mutual engagement without obligation. |
| **Community Gallery** | An in-game feed of the week's most-liked planet snapshots. Players can "heart" snapshots. Top snapshots get a small Stardust reward. |

---

## 9. Tutorial Flow (First 2 Minutes)

The tutorial is integrated into the first run. No separate tutorial screen. The player is playing from the first tap.

### Step-by-step

**Screen: The planet is empty. A small cosmic seed floats down and lands on the grid. The grid lights up.**

> **Narrator text (bottom banner):** *"A tiny world is born. Let's help it grow."*

**Step 1 — Place your first tile (0:00–0:15)**
- The queue shows a single Rock tile. All cells are highlighted.
- **On-screen message:** *"Tap anywhere to place your rock."*
- Player taps a cell. The rock drops in with a bounce.
- **On-screen message:** *"Nice! Every tile makes your planet a little bigger."*

**Step 2 — Place two more rocks (0:15–0:30)**
- Queue shows Rock, Rock. Two cells adjacent to the first rock are gently pulsing (suggested, not forced).
- **On-screen message:** *"Place two more rocks near each other."*
- Player places them. If they place them adjacently → merge triggers automatically.

**Step 3 — First merge (0:30–0:45)**
- The 3 rocks merge into a **Hill** with a sparkle animation and a xylophone note.
- **On-screen message:** *"Three rocks became a hill! Merging is the heart of your planet."*
- A small "+50" score floats up.

**Step 4 — Introduce water and grass (0:45–1:10)**
- Queue now shows Water, Grass, Rock.
- **On-screen message:** *"Different elements shape your world. Try placing them."*
- Player places freely. If they create a second merge, the narrator says: *"You're a natural."*

**Step 5 — First life burst (1:10–1:30)**
- After a tier-2+ merge, a life burst triggers. A tiny bird appears on an adjacent tile.
- **On-screen message:** *"A new friend! Merging higher tiles brings life to your planet."*
- The bird does a small hop animation.

**Step 6 — Show the goal (1:30–1:45)**
- The Planet Score target appears at the top: "Goal: 300."
- **On-screen message:** *"Reach the Planet Score to complete your planet. Keep merging!"*
- The tutorial overlay fades. The player continues the run freely.

**Step 7 — End of first run (1:45–2:00)**
- The first run's target is set very low (300) so the player almost always wins.
- **On win:** Fireworks, animals jump, narrator says: *"Your first pocket planet! There are many more seeds in the cosmos..."*
- The player is taken to the world map, which shows the next level.
- **On-screen message:** *"Tap to grow your next planet."*

**Post-tutorial:** The undo button and queue preview are introduced organically over the next 2–3 levels with single-line tooltips ("This is your undo. Use it wisely!"). No further forced tutorials.

---

## 10. Example Content

### 10.1 Merge Chains (20 Chains)

Each chain follows the rule: 3 of Tier N → 1 of Tier (N+1).

#### Earth Chain (Primary)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Rock | No |
| 2 | Hill | No |
| 3 | Mountain | Yes — spawns Goat or Eagle |
| 4 | Volcano | Yes — spawns Fire Salamander + Lava Pool landmark |
| 5 | Floating Island | Yes — spawns Phoenix + Sky Temple landmark |

#### Water Chain
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Puddle | No |
| 2 | Pond | Yes — spawns Frog |
| 3 | River | Yes — spawns Fish |
| 4 | Lake | Yes — spawns Swan + Waterfall landmark |
| 5 | Ocean | Yes — spawns Whale + Lighthouse landmark |

#### Plant Chain
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Grass | No |
| 2 | Bush | No |
| 3 | Forest | Yes — spawns Deer or Rabbit |
| 4 | Ancient Grove | Yes — spawns Owl + Treehouse landmark |
| 5 | World Tree | Yes — spawns Unicorn + Fairy Ring landmark |

#### Snow Chain (Tundra biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Snowflake | No |
| 2 | Snow Drift | No |
| 3 | Glacier | Yes — spawns Penguin |
| 4 | Ice Palace | Yes — spawns Polar Bear + Ice Spire landmark |
| 5 | Aurora Peak | Yes — spawns Snow Fox + Northern Lights landmark |

#### Sand Chain (Desert biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Sand | No |
| 2 | Dune | No |
| 3 | Oasis | Yes — spawns Camel |
| 4 | Sandstone Temple | Yes — spawns Scorpion + Sphinx landmark |
| 5 | Mirage City | Yes — spawns Fennec Fox + Pyramid landmark |

#### Coral Chain (Ocean biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Pebble | No |
| 2 | Coral | No |
| 3 | Reef | Yes — spawns Clownfish |
| 4 | Atoll | Yes — spawns Sea Turtle + Sunken Ship landmark |
| 5 | Leviathan Trench | Yes — spawns Manta Ray + Underwater City landmark |

#### Crystal Chain (Cavern biome — unlocked late)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Gem Shard | No |
| 2 | Crystal Cluster | No |
| 3 | Geode | Yes — spawns Bat |
| 4 | Crystal Cavern | Yes — spawns Glow Worm + Mushroom Garden landmark |
| 5 | Diamond Core | Yes — spawns Crystal Dragon + Underground Palace landmark |

#### Flower Chain (Spring event / Meadow biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Seed | No |
| 2 | Sprout | No |
| 3 | Flower | Yes — spawns Butterfly |
| 4 | Garden | Yes — spawns Hummingbird + Gazebo landmark |
| 5 | Enchanted Meadow | Yes — spawns Fairy + Wishing Well landmark |

#### Cloud Chain (Sky biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Mist | No |
| 2 | Cloud | No |
| 3 | Thunderhead | Yes — spawns Hawk |
| 4 | Storm | Yes — spawns Griffin + Lightning Tower landmark |
| 5 | Celestial Sky | Yes — spawns Dragon + Cloud Castle landmark |

#### Magma Chain (Volcanic biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Ember | No |
| 2 | Lava Flow | No |
| 3 | Magma Pool | Yes — spawns Fire Beetle |
| 4 | Eruption | Yes — spawns Lava Golem + Obsidian Forge landmark |
| 5 | Infernal Caldera | Yes — spawns Magma Wyrm + Volcano Throne landmark |

#### Mushroom Chain (Fungal biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Spore | No |
| 2 | Toadstool | No |
| 3 | Mushroom Ring | Yes — spawns Hedgehog |
| 4 | Fungal Forest | Yes — spawns Chameleon + Fairy House landmark |
| 5 | Mycelium Heart | Yes — spawns Mushroom Spirit + Living Tree landmark |

#### Bamboo Chain (Zen biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Bamboo Shoot | No |
| 2 | Bamboo Patch | No |
| 3 | Bamboo Grove | Yes — spawns Red Panda |
| 4 | Zen Garden | Yes — spawns Crane + Pagoda landmark |
| 5 | Temple of Harmony | Yes — spawns Koi Dragon + Moon Bridge landmark |

#### Autumn Chain (Seasonal event)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Fallen Leaf | No |
| 2 | Leaf Pile | No |
| 3 | Maple Tree | Yes — spawns Squirrel |
| 4 | Harvest Field | Yes — spawns Stag + Covered Bridge landmark |
| 5 | Golden Forest | Yes — spawns Spirit Deer + Harvest Moon landmark |

#### Star Chain (Cosmic biome — endgame)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Dust Mote | No |
| 2 | Star Fragment | No |
| 3 | Nebula | Yes — spawns Comet Fox |
| 4 | Constellation | Yes — spawns Star Whale + Observatory landmark |
| 5 | Galaxy | Yes — spawns Cosmic Turtle + Space Station landmark |

#### Honey Chain (Meadow sub-chain)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Clover | No |
| 2 | Wildflower Field | No |
| 3 | Beehive | Yes — spawns Bee |
| 4 | Honey Glade | Yes — spawns Bear + Apiary landmark |
| 5 | Golden Meadow | Yes — spawns Honeybadger + Mead Hall landmark |

#### Tide Chain (Beach sub-chain)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Wet Sand | No |
| 2 | Tide Pool | No |
| 3 | Lagoon | Yes — spawns Crab |
| 4 | Mangrove | Yes — spawns Pelican + Boardwalk landmark |
| 5 | Tropical Paradise | Yes — spawns Dolphin + Tiki Hut landmark |

#### Vine Chain (Jungle biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Moss | No |
| 2 | Fern | No |
| 3 | Vine Tangle | Yes — spawns Parrot |
| 4 | Jungle Canopy | Yes — spawns Monkey + Temple Ruins landmark |
| 5 | Lost City | Yes — spawns Jaguar + Golden Idol landmark |

#### Frost Chain (Winter event)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Frost Crystal | No |
| 2 | Icicle | No |
| 3 | Frozen Pond | Yes — spawns Snow Bunny |
| 4 | Winter Wonderland | Yes — spawns Snowy Owl + Ice Rink landmark |
| 5 | Eternal Winter | Yes — spawns Frost Elk + Crystal Palace landmark |

#### Shadow Chain (Halloween event / Mystery biome)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Wisp | No |
| 2 | Fog | No |
| 3 | Haunted Hollow | Yes — spawns Black Cat |
| 4 | Enchanted Ruins | Yes — spawns Ghost + Spooky Mansion landmark |
| 5 | Shadow Realm | Yes — spawns Phantom Wolf + Void Gate landmark |

#### Rainbow Chain (Special / Celebration event)
| Tier | Tile | Life Burst? |
|---|---|---|
| 1 | Prism Shard | No |
| 2 | Rainbow Arc | No |
| 3 | Color Burst | Yes — spawns Rainbow Frog |
| 4 | Prism Garden | Yes — spawns Peacock + Crystal Fountain landmark |
| 5 | Spectrum Palace | Yes — spawns Aurora Bird + Rainbow Bridge landmark |

---

### 10.2 Animals (10 Core + Extras)

These are the 10 animals tracked in the base collection book. Biome-specific animals are bonus entries.

| # | Animal | Source Chain | Tier Trigger | Idle Animation |
|---|---|---|---|---|
| 1 | Goat | Earth | Mountain (T3) | Hops between rocks |
| 2 | Frog | Water | Pond (T2) | Sits, blinks, catches fly |
| 3 | Fish | Water | River (T3) | Swims in a tiny circle |
| 4 | Deer | Plant | Forest (T3) | Grazes, looks up |
| 5 | Rabbit | Plant | Forest (T3) | Nibbles, ear twitch |
| 6 | Eagle | Earth | Mountain (T3) | Perches, spreads wings |
| 7 | Swan | Water | Lake (T4) | Glides, tucks head |
| 8 | Owl | Plant | Ancient Grove (T4) | Blinks, rotates head |
| 9 | Penguin | Snow | Glacier (T3) | Waddles, belly slides |
| 10 | Butterfly | Flower | Flower (T3) | Flutters around tile |

---

### 10.3 Landmarks (10 Core)

| # | Landmark | Source Chain | Tier Trigger | Visual |
|---|---|---|---|---|
| 1 | Lava Pool | Earth | Volcano (T4) | Glowing orange pool with bubbles |
| 2 | Sky Temple | Earth | Floating Island (T5) | Tiny pagoda on a cloud |
| 3 | Waterfall | Water | Lake (T4) | Cascading blue sparkles |
| 4 | Lighthouse | Water | Ocean (T5) | Rotating beam of light |
| 5 | Treehouse | Plant | Ancient Grove (T4) | Small house nestled in branches |
| 6 | Fairy Ring | Plant | World Tree (T5) | Glowing mushroom circle |
| 7 | Ice Spire | Snow | Ice Palace (T4) | Towering crystalline spike |
| 8 | Sphinx | Sand | Sandstone Temple (T4) | Miniature golden sphinx |
| 9 | Gazebo | Flower | Garden (T4) | White lattice structure with vines |
| 10 | Pagoda | Bamboo | Zen Garden (T4) | Red multi-tiered tower |

---

### 10.4 Biomes (5 Core)

Each biome determines the tile pool, visual theme, and available merge chains.

| # | Biome | Primary Chains | Unlock Condition | Planet Background |
|---|---|---|---|---|
| 1 | **Grassland** | Earth, Water, Plant | Default (start) | Green rolling hills, blue sky |
| 2 | **Desert** | Sand, Earth, Magma | Cumulative score 5,000 | Golden dunes, orange sunset |
| 3 | **Tundra** | Snow, Water, Crystal | Cumulative score 15,000 | White peaks, aurora sky |
| 4 | **Ocean** | Water, Coral, Tide | Cumulative score 30,000 | Deep blue sea, scattered islands |
| 5 | **Sky** | Cloud, Star, Flower | Cumulative score 60,000 | Floating islands, pink-purple sky |

---

### 10.5 Level Goals (15 Examples)

| Level | Biome | Target Score | Bonus Goals | Special Condition |
|---|---|---|---|---|
| 1 | Grassland | 300 | — | Tutorial level |
| 2 | Grassland | 500 | Create 1 Hill | — |
| 3 | Grassland | 800 | Spawn 1 animal | — |
| 4 | Grassland | 1,000 | Create 1 Forest | — |
| 5 | Grassland | 1,500 | Spawn 3 animals | — |
| 6 | Grassland | 2,000 | Create 1 Mountain + 1 River | — |
| 7 | Grassland | 2,500 | Spawn 5 animals | Wild tiles disabled |
| 8 | Grassland | 3,000 | Create 2 Forests | 1 meteor obstacle pre-placed |
| 9 | Grassland | 3,500 | Build 1 landmark | — |
| 10 | Grassland | 4,000 | Spawn 2 different animal types | 2 meteor obstacles pre-placed |
| 11 | Desert | 3,000 | Create 1 Oasis | Sand tiles added to pool |
| 12 | Desert | 4,000 | Spawn a Camel | — |
| 13 | Desert | 5,000 | Build Sphinx landmark | 2 sand storm obstacles |
| 14 | Desert | 6,000 | Create 2 Oases + 1 Dune chain | 3 obstacles |
| 15 | Desert | 7,500 | Spawn 5 animals + build 2 landmarks | Boss level: board starts half-filled with sand |

---

## 11. Retention Design

### Day 1 (First Session)

**Goal:** Player finishes tutorial, wins 3–5 runs, feels smart and cozy.

| Hook | Mechanism |
|---|---|
| Instant success | First level target is very low. Player wins within 60 seconds. |
| Collection spark | First animal spawned triggers collection book unlock. "You discovered your first creature!" |
| Upgrade tease | After level 3, the player earns enough Stardust to buy their first upgrade, creating an immediate sense of investment. |
| Session end hook | After 5 levels, a "New biome almost unlocked!" progress bar appears at 70%. The player knows one more session will get them there. |

### Day 7 (One Week)

**Goal:** Player has a routine (daily planet, daily goal), feels progress in the collection book, and has tried at least 2 biomes.

| Hook | Mechanism |
|---|---|
| Daily habit | Daily Planet and Daily Goal are now familiar. The player checks in to maintain their streak (day 7 gives a Moonstone). |
| Collection depth | The player has discovered 15–20 tiles, 5–6 animals, and 2–3 landmarks. The collection book shows clear gaps to fill, motivating continued play. |
| Social loop | By now, the player has seen the "Challenge a Friend" prompt and the snapshot share button. If they have a friend playing, the async challenge loop begins. |
| Second biome novelty | Desert unlocked, introducing new tile types and visual variety. The game feels fresh again. |
| First weekend event | The player experiences their first themed event, earning an exclusive cosmetic. Limited-time content creates gentle urgency. |

### Day 30 (One Month)

**Goal:** Player is invested in long-term collection, engaged in weekly events, and has potentially spent money on a cosmetic they love.

| Hook | Mechanism |
|---|---|
| Meta progression | 3–4 biomes unlocked, multiple upgrades purchased. The player's choices have shaped their experience. |
| Collection completionism | The collection book is 40–60% filled. Rare animals and tier-5 landmarks are white whales that keep the player pushing for high scores. |
| Social investment | Leaderboard rank among friends is a soft competition. Weekly scores create recurring engagement. |
| Cosmetic identity | The player has customized their planet skin, tile set, and merge effect. Their game feels "theirs." |
| Seasonal content | A seasonal event (Spring Bloom, Winter Frost, etc.) introduces a limited merge chain and exclusive animal, giving returning players something new. |
| Skill ceiling | Higher levels with obstacles and smaller grids challenge experienced players. The game has depth beyond first impressions. |

---

## 12. Technical Outline (Lightweight)

### 12.1 Screens

| Screen | Purpose |
|---|---|
| **Splash / Loading** | Logo, loading bar, tip of the day |
| **Main Menu / World Map** | Planet selection, level progression, biome map |
| **Gameplay** | 5x5 (or 6x6) grid, HUD, tile queue, score |
| **Run Result (Win)** | Score breakdown, Stardust earned, bonus goals completed, snapshot button, "Next Level" / "Replay" |
| **Run Result (Loss)** | Score breakdown, "Watch ad to continue" option, "Try Again" |
| **Collection Book** | Tabs for tiles, animals, landmarks, biomes. Tap entries for details. |
| **Shop** | Stardust/Moonstone purchases, cosmetic bundles, Season Pass |
| **Daily Planet** | Special board with daily seed, leaderboard |
| **Events** | Current event details, progress bar, rewards |
| **Settings** | Sound, music, haptics, notifications, account link |
| **Friends / Social** | Friend list, leaderboard, challenge history, gift button |
| **Profile** | Player stats, badges, current cosmetics |

### 12.2 Core Systems

| System | Description |
|---|---|
| **Grid Manager** | Manages the NxN tile grid, handles placement, adjacency checks, merge detection (BFS/flood-fill for connected groups), and chain-merge cascading. |
| **Tile Queue** | Generates upcoming tiles from a weighted random pool based on biome and level config. Handles wild tile injection. |
| **Merge Engine** | Executes merges: removes source tiles, spawns result tile, triggers life burst logic, calculates score delta, and checks for chain merges recursively. |
| **Life Burst System** | On qualifying merges, selects an animal or landmark from the chain's loot table and spawns it on a valid adjacent cell. |
| **Score Manager** | Tracks per-run Planet Score, cumulative score, and bonus goal progress. Determines win/loss. |
| **Progression Manager** | Tracks cumulative score for biome unlocks, level completion, upgrade purchases, and collection book entries. Persisted to local storage + cloud save. |
| **Economy Manager** | Manages Stardust and Moonstone balances, purchase validation, and ad reward grants. |
| **Collection Book** | Persistent registry of all discovered tiles, animals, and landmarks with discovery count and display state. |
| **Daily/Event Manager** | Fetches daily seed from server (or generates deterministically from date), manages event timers and progress, and handles streak tracking. |
| **Ad Manager** | Integrates with ad SDK (e.g., AdMob, Unity Ads). Manages rewarded video state, interstitial frequency, and ad-free status. |
| **Social Manager** | Handles friend lists (via platform Game Center / Google Play Games or custom share codes), leaderboard submission, snapshot generation, and async challenge seeds. |
| **Save System** | Local save (JSON or binary) + cloud sync (platform cloud save or lightweight custom backend). Handles conflict resolution (latest timestamp wins). |
| **Audio Manager** | Manages BGM, SFX, and haptic feedback. Supports dynamic pitch shifting for merge chains. |
| **Tutorial Manager** | State machine that tracks tutorial progress and triggers contextual tooltips for the first few levels. |
| **Analytics Manager** | Tracks key events for game health monitoring (see 12.3). |

### 12.3 Data to Track (Analytics)

| Category | Events |
|---|---|
| **Session** | Session start, session end, session duration, runs per session |
| **Gameplay** | Run start, run end (win/loss), final score, tiles placed, merges performed, chain length, life bursts triggered, bonus goals completed, undo used |
| **Progression** | Level completed, biome unlocked, upgrade purchased, collection entry discovered |
| **Economy** | Stardust earned (source), Stardust spent (sink), Moonstone earned (source), Moonstone spent (sink) |
| **Monetization** | Ad watched (type, placement), IAP initiated, IAP completed (product, price), IAP failed |
| **Retention** | Daily active, weekly active, monthly active, day-N retention (D1, D7, D14, D30), streak length |
| **Social** | Snapshot shared, challenge sent, challenge completed, friend added, gift sent |
| **Funnel** | Tutorial step reached, first merge, first animal, first landmark, first biome unlock, first purchase |
| **Performance** | Frame rate, load times, crash reports, device model, OS version |

### 12.4 Platform & Tech Recommendations

- **Engine:** Unity (broad mobile support, strong 2D/3D hybrid capabilities, large asset store for prototyping) or Godot (lighter weight, fully open source, good for small studios).
- **Backend (minimal):** A lightweight server or serverless functions (Firebase, AWS Lambda) for daily seeds, leaderboards, event configs, and cloud saves. Most game logic is client-side.
- **Target platforms:** iOS 14+, Android 8+.
- **Estimated build size:** Under 150 MB (compressed), with biome assets loaded on demand after initial install if needed.

---

## 13. Summary

Pocket Planet Merge is designed to be the game you open when you have 60 seconds and want to feel good. It respects the player's time, rewards every session with tangible progress, and never punishes absence. The merge mechanic is proven, the planet-growing fantasy is universally appealing, and the cozy art direction invites players in rather than overwhelming them. With ethical monetization, lightweight social features, and a deep-but-gentle progression loop, it is built to sustain a loyal player base that grows through word of mouth, shared planet snapshots, and the simple joy of watching a tiny world come to life under your thumb.

---

*Document version: 1.0 — Pocket Planet Merge Game Design Document*
*Prepared for: Small studio production planning*
