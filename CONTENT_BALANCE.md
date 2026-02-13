# Pocket Planet Merge — Content & Balance Data

*All tuning values for tiles, scoring, economy, spawn rates, level configs, and progression curves.*

---

## 1. Tile Scoring Values

Every tile on the board contributes to Planet Score. Higher-tier tiles are worth exponentially more.

### 1.1 Base Tile Point Values (Per Chain)

| Tier | Name Pattern | Point Value | Notes |
|---|---|---|---|
| T1 | Rock, Puddle, Grass, etc. | 10 | Lowest value, most common |
| T2 | Hill, Pond, Bush, etc. | 40 | 3× T1 + bonus |
| T3 | Mountain, River, Forest, etc. | 150 | First life-burst tier |
| T4 | Volcano, Lake, Ancient Grove, etc. | 500 | Landmark-spawning tier |
| T5 | Floating Island, Ocean, World Tree, etc. | 1,500 | Legendary tile |

### 1.2 Animal & Landmark Bonus Points

| Entity Type | Bonus Points | Stacks? |
|---|---|---|
| Common animal (T2–T3 spawn) | +75 | Yes, per animal on board |
| Rare animal (T4 spawn) | +200 | Yes |
| Legendary animal (T5 spawn) | +600 | Yes |
| Landmark (T4 spawn) | +300 | Yes |
| Legendary landmark (T5 spawn) | +800 | Yes |

### 1.3 Merge Bonus Points

Awarded instantly when a merge happens, on top of the new tile's board value.

| Merge Type | Instant Bonus |
|---|---|
| Standard merge (3 tiles) | +20 |
| Large merge (4 tiles) | +50 |
| Huge merge (5+ tiles) | +100 |
| Chain merge (2-step) | +40 per step after the first |
| Chain merge (3-step) | +80 per step after the first |
| Chain merge (4+ step) | +150 per step after the first |

### 1.4 Bonus Goal Rewards

| Goal Type | Stardust Reward | Score Multiplier |
|---|---|---|
| Completed 1 bonus goal | +30 Stardust | 1.1× final score |
| Completed 2 bonus goals | +75 Stardust | 1.25× final score |
| Completed all bonus goals (perfect) | +150 Stardust | 1.5× final score |

---

## 2. Tile Spawn Weights

The tile queue draws from a weighted pool. Weights determine how likely each tier and chain type is to appear.

### 2.1 Tier Spawn Weights (Base)

| Tier | Weight | Approx. Frequency |
|---|---|---|
| T1 | 85 | ~85% of spawns |
| T2 | 12 | ~12% of spawns |
| T3 | 3 | ~3% of spawns (luck/reward feel) |
| T4 | 0 | Never spawns naturally |
| T5 | 0 | Never spawns naturally |

### 2.2 Chain Distribution by Biome

Each biome has a primary, secondary, and tertiary chain. Only T1 tiles from these chains spawn.

| Biome | Primary (50%) | Secondary (30%) | Tertiary (20%) |
|---|---|---|---|
| Grassland | Earth | Plant | Water |
| Desert | Sand | Earth | Magma |
| Tundra | Snow | Water | Crystal |
| Ocean | Water | Coral | Tide |
| Sky | Cloud | Star | Flower |

### 2.3 Wild Tile

| Parameter | Value |
|---|---|
| Base spawn rate | 1 in 12 tiles (~8.3%) |
| With "Lucky Stars" upgrade Lv1 | 1 in 10 (~10%) |
| With "Lucky Stars" upgrade Lv2 | 1 in 9 (~11.1%) |
| With "Lucky Stars" upgrade Lv3 | 1 in 8 (~12.5%) |

### 2.4 Obstacle Spawn (Levels with Obstacles)

| Obstacle Type | Biome | Spawn Trigger | Clear Method |
|---|---|---|---|
| Meteor Rock | Grassland | Pre-placed or every 8th turn | Merge any T3+ adjacent |
| Sandstorm Tile | Desert | Every 6th turn | Merge a Water-chain tile adjacent |
| Ice Block | Tundra | Pre-placed or every 7th turn | Merge a Magma/Earth-chain tile adjacent |
| Coral Wall | Ocean | Pre-placed | Merge any 2 tiles adjacent (softens then breaks) |
| Storm Cloud | Sky | Every 10th turn | Merge a Cloud-chain tile adjacent |

| Meteor Shield Upgrade | Effect on Obstacle Spawn |
|---|---|
| Level 0 (default) | Normal rate |
| Level 1 | Obstacle spawn interval +2 turns |
| Level 2 | Obstacle spawn interval +4 turns |
| Level 3 | Obstacle spawn interval +6 turns |

---

## 3. Life Burst Probability & Loot Tables

### 3.1 Life Burst Trigger Rate

| Merge Tier Result | Life Burst Chance |
|---|---|
| T1 → T2 | 0% (never) |
| T2 → T3 | 70% |
| T3 → T4 | 100% (guaranteed) |
| T4 → T5 | 100% (guaranteed, spawns 2 entities) |

### 3.2 Loot Table: What Spawns

When a life burst triggers, the game rolls on the following table.

**T3 Life Burst (70% chance to trigger):**

| Roll | Result | Weight |
|---|---|---|
| Animal (common) | Chain-specific common animal | 80% |
| Nothing extra | Just the merge, no spawn | 20% |

**T4 Life Burst (guaranteed):**

| Roll | Result | Weight |
|---|---|---|
| Animal (rare) | Chain-specific rare animal | 50% |
| Landmark | Chain-specific T4 landmark | 40% |
| Both | Animal + Landmark | 10% |

**T5 Life Burst (guaranteed, 2 spawns):**

| Spawn 1 | Spawn 2 |
|---|---|
| Chain-specific legendary animal (100%) | Chain-specific legendary landmark (100%) |

### 3.3 Spawn Placement Priority

1. Empty cell adjacent to the merged tile.
2. If no adjacent empty cell: nearest empty cell (Manhattan distance).
3. If no empty cell at all: the entity is "stored" — awarded to collection book but not placed on board. A small notification appears: "Collected! (No room on planet.)"

---

## 4. Economy Balance

### 4.1 Stardust Earn Rates

| Source | Amount | Frequency |
|---|---|---|
| Completed run (win) | 20 + (Planet Score ÷ 50) | Per run |
| Failed run (loss) | 10 + (Planet Score ÷ 100) | Per run |
| Bonus goal (each) | 30 / 75 / 150 (see §1.4) | Per run |
| Daily gift (day 1) | 50 | Daily |
| Daily gift (day 2) | 60 | Daily |
| Daily gift (day 3) | 75 | Daily |
| Daily gift (day 4) | 90 | Daily |
| Daily gift (day 5) | 110 | Daily |
| Daily gift (day 6) | 130 | Daily |
| Daily gift (day 7) | 150 + 5 Moonstones | Daily |
| Daily goal | 40 | Daily |
| Daily Planet (completion) | 60 | Daily |
| Daily Planet (top 10%) | +100 bonus | Daily |
| Weekend event (full completion) | 300 + exclusive cosmetic | Weekly |
| Weekly challenge | 200 + badge | Weekly |
| Collection book page (first fill) | 100 + 10 Moonstones | One-time |
| Friend gift (send or receive) | 25 | Daily (1/day) |
| Ad: double Stardust | 2× run earnings | Per ad watched |

### 4.2 Stardust Costs

| Item | Cost | Notes |
|---|---|---|
| Extra undo (in-run) | 50 | Or watch an ad |
| Bigger Planet upgrade | 2,000 | One-time |
| Deeper Queue upgrade | 1,500 | One-time |
| Lucky Stars Lv1 | 800 | — |
| Lucky Stars Lv2 | 1,600 | — |
| Lucky Stars Lv3 | 3,200 | — |
| Life Magnet upgrade | 2,500 | One-time |
| Sturdy Core Lv1 | 600 | — |
| Sturdy Core Lv2 | 1,200 | — |
| Sturdy Core Lv3 | 2,400 | — |
| Meteor Shield Lv1 | 1,000 | — |
| Meteor Shield Lv2 | 2,000 | — |
| Meteor Shield Lv3 | 4,000 | — |
| Basic cosmetics | 500–1,500 | Planet skins, merge effects |
| Premium cosmetics (also buyable with Moonstones) | 2,000–5,000 | Higher-tier skins |

**Total Stardust to buy all upgrades:** 23,300
**Estimated runs to earn 23,300 Stardust (no ads, average wins):** ~250–350 runs (~4–6 hours of play)

### 4.3 Moonstone Earn Rates (Free)

| Source | Amount | Frequency |
|---|---|---|
| Day 7 streak bonus | 5 | Weekly |
| Collection page complete | 10 | One-time per page |
| Achievement milestones | 5–25 | One-time each |
| Weekly challenge (first clear) | 10 | Weekly |
| Biome unlock | 20 | One-time per biome |

**Estimated free Moonstones per month (active player):** 80–120

### 4.4 Moonstone Costs

| Item | Cost | USD Equivalent |
|---|---|---|
| Basic cosmetic (alternative to Stardust) | 30 | ~$0.90 |
| Premium cosmetic | 60–100 | ~$1.80–$3.00 |
| Exclusive cosmetic (Season Pass items if bought individually) | 150 | ~$4.50 |
| 5-pack undos | 20 | ~$0.60 |
| Skip level (advance without winning) | 50 | ~$1.50 |

### 4.5 Economy Guardrails

- **Stardust sink:** Cosmetics are an infinite sink (rotating shop). Upgrades are a finite sink.
- **No pay-to-win:** Upgrades only buyable with Stardust (earned in-game). Moonstones buy cosmetics and convenience only.
- **Ad pacing:** Maximum 1 interstitial per 4 runs. Maximum 3 rewarded ads per run (continue, double, undo). Rewarded ads are always opt-in.
- **Moonstone pricing anchored to $0.03/Moonstone** at the best-value tier ($9.99 = 600). Smaller packs are less efficient to encourage bundles.

---

## 5. Level Configuration Data

### 5.1 Grassland Levels (1–10)

| Lvl | Grid | Target Score | Bonus 1 | Bonus 2 | Obstacles | Tile Pool Modifier | Stardust (Win) |
|---|---|---|---|---|---|---|---|
| 1 | 5×5 | 300 | — | — | 0 | Only Earth T1 (tutorial) | 25 |
| 2 | 5×5 | 500 | Create 1 Hill | — | 0 | Earth + Plant T1 | 30 |
| 3 | 5×5 | 800 | Spawn 1 animal | — | 0 | All Grassland chains | 35 |
| 4 | 5×5 | 1,000 | Create 1 Forest | — | 0 | Standard | 40 |
| 5 | 5×5 | 1,500 | Spawn 3 animals | Create 1 River | 0 | Standard | 50 |
| 6 | 5×5 | 2,000 | Create 1 Mountain + 1 River | — | 0 | Standard | 60 |
| 7 | 5×5 | 2,500 | Spawn 5 animals | — | 0 | Wild tiles disabled | 70 |
| 8 | 5×5 | 3,000 | Create 2 Forests | — | 1 meteor | Standard | 80 |
| 9 | 5×5 | 3,500 | Build 1 landmark | Spawn 1 rare animal | 0 | Slight T2 boost (+5%) | 90 |
| 10 | 5×5 | 4,000 | Spawn 2 different types | Build 1 landmark | 2 meteors | Standard | 100 |

### 5.2 Desert Levels (11–20)

| Lvl | Grid | Target Score | Bonus 1 | Bonus 2 | Obstacles | Tile Pool Modifier | Stardust (Win) |
|---|---|---|---|---|---|---|---|
| 11 | 5×5 | 3,000 | Create 1 Oasis | — | 0 | Desert chains active | 80 |
| 12 | 5×5 | 4,000 | Spawn a Camel | — | 0 | Standard | 90 |
| 13 | 5×5 | 5,000 | Build Sphinx landmark | — | 2 sandstorm | Standard | 100 |
| 14 | 5×5 | 6,000 | Create 2 Oases | Create 1 Dune | 3 sandstorm | Standard | 120 |
| 15 | 5×5 | 7,500 | Spawn 5 animals | Build 2 landmarks | 2 sandstorm | Board starts 30% filled with sand T1 | 150 |
| 16 | 5×5 | 5,500 | Create 1 Magma Pool | — | 1 sandstorm | Magma chain boosted | 110 |
| 17 | 5×5 | 6,500 | Spawn 3 rare animals | — | 2 sandstorm | T2 spawn rate +8% | 130 |
| 18 | 5×5 | 7,000 | Build Sandstone Temple | Create 1 Volcano | 3 sandstorm | Standard | 140 |
| 19 | 5×5 | 8,000 | Spawn 7 animals total | Build 3 landmarks | 2 sandstorm | Wild rate boosted | 160 |
| 20 | 5×5 | 10,000 | Create Mirage City (T5) | — | 4 sandstorm | Boss: board starts 40% filled | 200 |

### 5.3 Tundra Levels (21–30)

| Lvl | Grid | Target Score | Bonus 1 | Bonus 2 | Obstacles | Stardust (Win) |
|---|---|---|---|---|---|---|
| 21 | 5×5 | 5,000 | Create 1 Glacier | — | 0 | 100 |
| 22 | 5×5 | 6,000 | Spawn a Penguin | Create 1 Crystal Cluster | 1 ice block | 120 |
| 23 | 5×5 | 7,500 | Build Ice Spire | — | 2 ice blocks | 140 |
| 24 | 5×5 | 8,500 | Create 2 Glaciers | Spawn 4 animals | 2 ice blocks | 150 |
| 25 | 6×6 | 10,000 | Spawn Polar Bear | Build 2 landmarks | 3 ice blocks | 180 |
| 26 | 6×6 | 11,000 | Create 1 Geode | Spawn 6 animals | 2 ice blocks | 190 |
| 27 | 6×6 | 12,500 | Build Crystal Cavern | — | 3 ice blocks | 200 |
| 28 | 6×6 | 14,000 | Spawn 8 animals | Build 3 landmarks | 4 ice blocks | 220 |
| 29 | 6×6 | 16,000 | Create Aurora Peak (T5) | Spawn Snow Fox | 3 ice blocks | 250 |
| 30 | 6×6 | 20,000 | Create 2 T5 tiles | Build 4 landmarks | 5 ice blocks | 300 |

### 5.4 Difficulty Curve Parameters

| Level Range | Avg. Moves to Win | Expected Win Rate (New Player) | Expected Win Rate (Experienced) |
|---|---|---|---|
| 1–5 | 15–20 | 90–95% | 99% |
| 6–10 | 20–25 | 70–80% | 90% |
| 11–15 | 22–28 | 55–65% | 85% |
| 16–20 | 25–30 | 45–55% | 80% |
| 21–25 | 25–32 | 35–45% | 75% |
| 26–30 | 28–35 | 25–35% | 70% |

---

## 6. Progression Curve

### 6.1 Cumulative Score Milestones

| Milestone | Cumulative Score | Reward |
|---|---|---|
| First Hill | 200 | Tutorial completion badge |
| First Animal | 600 | Collection Book unlocks |
| Grassland Mastered | 5,000 | Desert biome unlocks + 20 Moonstones |
| 10 Animals Collected | 8,000 | "Animal Friend" badge + 100 Stardust |
| Desert Mastered | 15,000 | Tundra biome unlocks + 20 Moonstones |
| First T5 Tile | 20,000 | "Planet Architect" badge + 200 Stardust |
| Tundra Mastered | 30,000 | Ocean biome unlocks + 20 Moonstones |
| 50% Collection Book | 40,000 | "Cosmic Explorer" badge + 25 Moonstones |
| Ocean Mastered | 60,000 | Sky biome unlocks + 20 Moonstones |
| 100% Collection Book | 100,000+ | "Pocket God" title + exclusive planet skin |

### 6.2 Player Level (XP System)

Players earn XP equal to their Planet Score each run. Levels are cosmetic titles.

| Player Level | XP Required (Cumulative) | Title |
|---|---|---|
| 1 | 0 | Seedling |
| 2 | 500 | Pebble Pusher |
| 3 | 1,500 | Stone Stacker |
| 4 | 3,500 | Hill Maker |
| 5 | 7,000 | Valley Crafter |
| 6 | 12,000 | Mountain Shaper |
| 7 | 20,000 | River Weaver |
| 8 | 32,000 | Forest Keeper |
| 9 | 50,000 | World Builder |
| 10 | 75,000 | Planet Architect |
| 11 | 110,000 | Star Gardener |
| 12 | 160,000 | Galaxy Sculptor |
| 13 | 225,000 | Cosmic Dreamer |
| 14 | 310,000 | Universe Crafter |
| 15 | 420,000 | Pocket God |

Each level-up grants: 50 Stardust + 5 Moonstones + a brief celebration animation.

---

## 7. Achievement List

### 7.1 Merge Achievements

| Achievement | Condition | Reward |
|---|---|---|
| First Steps | Perform your first merge | 20 Stardust |
| Chain Reaction | Trigger a 2-step chain merge | 50 Stardust |
| Cascade! | Trigger a 3-step chain merge | 100 Stardust + 5 Moonstones |
| Avalanche | Trigger a 4+ step chain merge | 200 Stardust + 10 Moonstones |
| Merger of Worlds | Create one of every T3 tile | 150 Stardust + 10 Moonstones |
| Legendary Crafter | Create one of every T5 tile | 500 Stardust + 25 Moonstones |
| Merge Master | Perform 1,000 total merges | 200 Stardust |
| Merge Legend | Perform 10,000 total merges | 500 Stardust + 15 Moonstones |

### 7.2 Collection Achievements

| Achievement | Condition | Reward |
|---|---|---|
| Animal Lover | Discover 5 different animals | 100 Stardust |
| Zoologist | Discover all 10 core animals | 200 Stardust + 10 Moonstones |
| Landmark Spotter | Build 5 different landmarks | 100 Stardust |
| Architect | Build all 10 core landmarks | 200 Stardust + 10 Moonstones |
| Biome Explorer | Unlock all 5 biomes | 300 Stardust + 20 Moonstones |
| Completionist | Fill 100% of the collection book | 1,000 Stardust + 50 Moonstones |

### 7.3 Score Achievements

| Achievement | Condition | Reward |
|---|---|---|
| Growing World | Reach 5,000 Planet Score in one run | 100 Stardust |
| Thriving Planet | Reach 10,000 Planet Score in one run | 200 Stardust + 10 Moonstones |
| Perfect World | Reach 20,000 Planet Score in one run | 500 Stardust + 25 Moonstones |
| Cosmic Record | Reach 50,000 Planet Score in one run | 1,000 Stardust + 50 Moonstones |

### 7.4 Session Achievements

| Achievement | Condition | Reward |
|---|---|---|
| Dedicated | Play 7 days in a row | 100 Stardust + 5 Moonstones |
| Devoted | Play 30 days in a row | 300 Stardust + 15 Moonstones |
| Eternal | Play 100 days in a row | 500 Stardust + 25 Moonstones |
| Daily Champion | Finish in top 10% of Daily Planet 5 times | 200 Stardust + 10 Moonstones |
| Social Star | Share 10 planet snapshots | 100 Stardust |
| Friendly | Send 10 friend gifts | 100 Stardust |

---

## 8. Daily Planet Seed Generation

The Daily Planet uses a deterministic pseudo-random seed so all players get the same puzzle.

### Seed Formula

```
seed = hash(YYYY-MM-DD + "pocket-planet-daily" + version_salt)
```

### Daily Planet Config

| Parameter | Value |
|---|---|
| Grid size | 5×5 (always, regardless of upgrades) |
| Tile queue length | 30 tiles (fixed, same for everyone) |
| Biome | Rotates: Mon=Grassland, Tue=Desert, Wed=Tundra, Thu=Ocean, Fri=Sky, Sat/Sun=Random |
| Upgrades | Disabled (level playing field) |
| Wild tiles | Included in the fixed queue (positions determined by seed) |
| Obstacles | None (pure skill) |
| Scoring | Standard rules apply |
| Attempts | 1 per day (no retries, no ad-continue) |

---

## 9. Event Template Data

### Weekend Event Structure

| Field | Value |
|---|---|
| Duration | Friday 00:00 UTC → Sunday 23:59 UTC |
| Mechanic | Cumulative points across all runs during the event period |
| Progress tiers | 3 tiers: Bronze (500 pts), Silver (2,000 pts), Gold (5,000 pts) |
| Bronze reward | 100 Stardust |
| Silver reward | 200 Stardust + 10 Moonstones |
| Gold reward | 300 Stardust + exclusive cosmetic (event-themed) |
| Tile pool modifier | Event chain tiles appear at 15% rate alongside biome tiles |
| Exclusive animal | Available only during this event's life bursts (added to collection permanently) |

### Event Rotation (12-Month Calendar)

| Month | Event Name | Theme Chain | Exclusive Animal | Exclusive Cosmetic |
|---|---|---|---|---|
| Jan | Frost Festival | Frost | Arctic Hare | Snowglobe planet skin |
| Feb | Valentine Bloom | Flower (pink) | Lovebird | Heart merge effect |
| Mar | Spring Awakening | Flower | Cherry Blossom Deer | Sakura tile skin |
| Apr | Rainy Season | Water (boosted) | Rainforest Frog | Rainbow merge effect |
| May | Jungle Expedition | Vine | Golden Monkey | Explorer planet skin |
| Jun | Summer Splash | Tide | Tropical Fish | Beach tile skin |
| Jul | Stargazer | Star | Comet Bunny | Galaxy merge effect |
| Aug | Volcano Rush | Magma | Phoenix Chick | Lava planet skin |
| Sep | Harvest Moon | Autumn | Harvest Mouse | Autumn tile skin |
| Oct | Shadow Night | Shadow | Spectral Cat | Spooky merge effect |
| Nov | Mushroom Festival | Mushroom | Truffle Pig | Mushroom planet skin |
| Dec | Winter Wonderland | Frost + Snow | Reindeer | Holiday tile skin |

---

## 10. Cosmetic Catalog & Pricing

### 10.1 Planet Skins

| Skin Name | Source | Stardust | Moonstones |
|---|---|---|---|
| Classic Earth | Default | Free | — |
| Red Mars | Shop | 1,000 | 30 |
| Ocean World | Biome unlock (Ocean) | Free | — |
| Candy Planet | Shop | 1,500 | 50 |
| Crystal Planet | Shop | 2,000 | 60 |
| Steampunk Globe | Shop | 2,500 | 80 |
| Tiny Moon | Achievement (100 wins) | Free | — |
| Pixel Planet | Premium shop | — | 100 |
| Snowglobe | Jan event exclusive | Event | — |
| Galaxy Swirl | Jul event exclusive | Event | — |

### 10.2 Tile Skins

| Skin Set | Source | Stardust | Moonstones |
|---|---|---|---|
| Default | Default | Free | — |
| Pixel Art Pack | Shop | 1,500 | 50 |
| Watercolor Pack | Shop | 2,000 | 60 |
| Winter Pack | Shop | 1,500 | 50 |
| Neon Pack | Premium shop | — | 80 |
| Wooden Toy Pack | Premium shop | — | 100 |

### 10.3 Merge Effects

| Effect Name | Source | Stardust | Moonstones |
|---|---|---|---|
| Default Sparkle | Default | Free | — |
| Petal Burst | Shop | 800 | 25 |
| Snowflake Swirl | Shop | 800 | 25 |
| Bubble Pop | Shop | 1,000 | 30 |
| Lightning Crackle | Premium shop | — | 60 |
| Rainbow Trail | Feb event exclusive | Event | — |
| Stardust Shower | Achievement (1,000 merges) | Free | — |

---

*Document version: 1.0 — Content & Balance Data*
