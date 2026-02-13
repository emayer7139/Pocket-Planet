# Pocket Planet Merge — Release Roadmap

*Milestone plan, feature priorities, team structure, and release phases from prototype to live service.*

---

## 1. Team Assumptions

This roadmap is designed for a **small studio of 4–6 people:**

| Role | Count | Responsibilities |
|---|---|---|
| Game Designer / Producer | 1 | Design, balance, project management, analytics |
| Programmer (Gameplay) | 1–2 | Core systems, UI, backend integration |
| Artist (2D/3D) | 1 | Tile art, animals, landmarks, UI, VFX |
| Sound Designer (part-time / contract) | 0.5 | SFX, music, haptics |
| QA / Community (part-time) | 0.5 | Testing, player feedback, social channels |

**Engine:** Unity 2022 LTS (or Godot 4.x if the team prefers open source).

---

## 2. Development Phases

### Phase Overview

```
 Month:  1    2    3    4    5    6    7    8    9   10   11   12
        ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
Proto   ▓▓▓▓▓▓▓▓▓
Alpha            ▓▓▓▓▓▓▓▓▓▓▓▓▓
Beta                          ▓▓▓▓▓▓▓▓▓▓▓▓▓
Soft                                        ▓▓▓▓▓▓▓▓
Launch                                               ▓▓▓
Live                                                    ▓▓▓▓▓▓▓
```

---

### Phase 1: Prototype (Months 1–2)

**Goal:** Prove the core loop is fun. One biome. Placeholder art. Playable on-device.

#### Milestones

| Week | Deliverable |
|---|---|
| 1–2 | Grid Manager: 5×5 grid, tap-to-place, tile data model. Merge Engine: 3-tile merge with BFS detection. Placeholder tiles (colored squares). |
| 3–4 | Chain merges (recursive). Tile Queue (weighted random, 2-tile preview). Score Manager (basic point tally). Win/loss conditions. |
| 5–6 | Life burst system (spawn entities on merge). Undo system (1 free undo). 3 merge chains (Earth, Water, Plant) with placeholder art. |
| 7–8 | Basic HUD (score, target, queue). 5 playable levels with tuned targets. On-device testing (iOS + Android). First playtest with 5–10 external testers. |

#### Exit Criteria

- [ ] Core loop plays in 30–90 seconds per run.
- [ ] Chain merges feel satisfying (even with placeholder art).
- [ ] 8/10 playtesters say "I want to play again" after their first run.
- [ ] Win rate on level 1 is > 90%. Win rate on level 5 is 50–70%.

#### Key Risks

| Risk | Mitigation |
|---|---|
| Merge detection is buggy with complex shapes | Write exhaustive unit tests for L-shapes, T-shapes, and 5+ groups before moving on. |
| Game feels too random / too deterministic | Tune T1 spawn weight (currently 85%). If too random, increase to 90%. If too deterministic, decrease to 80%. |
| One-handed play is awkward | Test on smallest target device (iPhone SE). Cells must be ≥ 44pt. Adjust grid layout early. |

---

### Phase 2: Alpha (Months 3–5)

**Goal:** Content-complete for Grassland biome. Real art. Tutorial. Progression. Internal playtesting.

#### Milestones

| Week | Deliverable |
|---|---|
| 9–10 | Art pipeline established. First 3 tile chains in final art (Earth, Water, Plant). Planet globe background. Grid visual polish. |
| 11–12 | 10 core animals modeled and animated (idle animations). 10 core landmarks modeled. Life burst VFX (particles, glow). |
| 13–14 | Tutorial Manager (7-step integrated tutorial). Post-tutorial tooltips (undo, queue). First-time user experience polished. |
| 15–16 | 10 Grassland levels fully designed and balanced. Bonus goals system. Level selection / World Map (Grassland region). |
| 17–18 | Save system (local JSON). Progression Manager (cumulative score, biome unlock gates). Collection Book (Tiles, Animals, Landmarks tabs). |
| 19–20 | Economy Manager (Stardust earn/spend). Upgrade system (6 upgrades, Stardust costs). Shop screen (Stardust tab). |
| — | Sound design pass: merge sounds (pentatonic xylophone), life burst chimes, ambient Grassland BGM, UI taps, win/loss jingles. Haptic feedback. |

#### Exit Criteria

- [ ] Grassland (10 levels) plays from start to finish with final art and sound.
- [ ] Tutorial completion rate > 95% in playtests.
- [ ] Collection book tracks all Grassland content correctly.
- [ ] Save/load works across app kills and device restarts.
- [ ] 15/20 playtesters complete all 10 Grassland levels.

---

### Phase 3: Beta (Months 6–8)

**Goal:** All 5 biomes. All 20 merge chains. Monetization. Social features. Daily content. Performance-ready.

#### Milestones

| Week | Deliverable |
|---|---|
| 21–23 | Desert biome: Sand, Magma chains art + levels (11–20). Desert ambient music. Sandstorm obstacles. |
| 24–26 | Tundra biome: Snow, Crystal chains art + levels (21–30). Tundra ambient music. Ice block obstacles. 6×6 grid unlock at level 25. |
| 27–28 | Ocean biome: Coral, Tide chains art + levels (31–40). Sky biome: Cloud, Star chains art + levels (41–50). |
| 29–30 | Remaining merge chains art (Flower, Mushroom, Bamboo, Autumn, Honey, Vine, Frost, Shadow, Rainbow). Event-specific and sub-biome content. |
| 31–32 | Monetization: Ad SDK integration (AdMob). Rewarded ads (continue, double, undo). Interstitials (every 4th run, removed with purchase). IAP: Starter Bundle, Moonstone packs, Season Pass. |
| 33–34 | Social: Friend system (share codes). Leaderboards (daily, weekly, friends). Async challenges. Friend gifts. Planet snapshot sharing. Community gallery. |
| 35–36 | Daily Planet: Deterministic seed generation, fixed queue display, daily leaderboard. Daily gift streak. Daily goal. Weekend event system (framework + first event). |
| — | Backend: Firebase project setup. Cloud Functions for daily seeds, leaderboards, events, cloud save, friend/challenge services. |
| — | Performance optimization pass. Memory profiling. Load time optimization. Battery testing. |

#### Exit Criteria

- [ ] 50 levels across 5 biomes are playable.
- [ ] 20 merge chains are complete with final art.
- [ ] Ad flow works end-to-end (rewarded + interstitial).
- [ ] IAP flow works end-to-end with receipt validation.
- [ ] Daily Planet generates correct seeds and ranks players.
- [ ] Async challenges work between two test accounts.
- [ ] App runs at 60 FPS on target low-end devices (iPhone SE 2nd gen, Samsung Galaxy A13).
- [ ] App size < 100 MB (download).

---

### Phase 4: Soft Launch (Months 9–10)

**Goal:** Release to limited markets. Gather real retention and monetization data. Tune balance.

#### Soft Launch Markets

| Market | Platform | Rationale |
|---|---|---|
| Canada | iOS + Android | English-speaking, similar to US, manageable scale |
| Australia | iOS + Android | English-speaking, different timezone for global testing |
| Philippines | Android | High Android adoption, cost-effective UA for testing |

#### Soft Launch Goals

| Metric | Target | Action if Below |
|---|---|---|
| D1 Retention | > 40% | Review tutorial funnel. Check for confusion or friction. |
| D7 Retention | > 20% | Review progression pacing. Check if daily/weekly content is engaging. |
| D30 Retention | > 8% | Review meta loop depth. Add more collection/cosmetic content. |
| Session Length | 5–10 min | If too short: runs end too fast (lower target scores). If too long: runs drag (raise target scores). |
| ARPDAU (ads) | > $0.05 | Adjust ad placements. Test interstitial frequency (every 3rd vs 5th run). |
| IAP Conversion (D7) | > 3% | Review Starter Bundle pricing/value. Test $0.99 entry point. |
| Tutorial Completion | > 90% | Simplify steps. Add skip option after step 3. |

#### Soft Launch Activities

| Week | Activity |
|---|---|
| 1–2 | Deploy to soft launch markets. Monitor crash rates, ANRs, load times. Hotfix critical bugs. |
| 3–4 | First balance pass: adjust level difficulty based on win rates. Tune Stardust economy based on earn/spend ratios. |
| 5–6 | A/B test: Starter Bundle at $0.99 vs $1.99. A/B test: interstitial after every 3rd vs 5th run. |
| 7–8 | Second balance pass based on D7/D14 data. Add or remove levels if progression is too fast/slow. Polish based on player feedback (app store reviews, support tickets). |

---

### Phase 5: Global Launch (Month 11)

**Goal:** Worldwide release with marketing push.

#### Pre-Launch Checklist

- [ ] All soft launch issues resolved.
- [ ] D1 > 40%, D7 > 20% confirmed in soft launch data.
- [ ] IAP flow validated on both platforms.
- [ ] App Store Optimization (ASO): screenshots, video preview, description, keywords.
- [ ] Press kit prepared: game description, screenshots, trailer, press contacts.
- [ ] Social media accounts active (Twitter/X, Instagram, TikTok).
- [ ] Community Discord or Reddit set up.
- [ ] Localization (at minimum): English, Spanish, Portuguese, French, German, Japanese, Korean, Simplified Chinese.
- [ ] Accessibility: VoiceOver/TalkBack labels for all interactive elements. Colorblind mode for tile differentiation.
- [ ] Privacy: GDPR consent flow, COPPA compliance (if targeting under 13), ATT prompt (iOS).

#### Launch Week Plan

| Day | Activity |
|---|---|
| Day -7 | Send press kit to 50+ mobile game outlets and YouTubers. |
| Day -3 | Post launch trailer on social media. "Coming This Week" announcement. |
| Day 0 | Release worldwide on iOS App Store and Google Play. Feature request submitted to both stores 6 weeks prior. |
| Day 0 | Social media blitz: launch posts, developer behind-the-scenes, "make your first planet" CTA. |
| Day 1–3 | Monitor crash rates, server load, review sentiment. Hotfix if needed. Respond to early reviews. |
| Day 3–7 | First weekend event goes live. Push notification to all installed users. |

---

### Phase 6: Live Service (Month 12+)

**Goal:** Sustain and grow the player base with regular content updates.

#### Monthly Cadence

| Week | Activity |
|---|---|
| Week 1 | Season Pass refresh (new monthly cosmetic set). |
| Week 2 | New weekend event with exclusive animal + cosmetic. |
| Week 3 | Balance pass based on analytics. Bug fixes. QoL improvements. |
| Week 4 | Community spotlight (top planets, player feedback response). |

#### Quarterly Content Drops

| Quarter | Content | Details |
|---|---|---|
| Q1 Post-Launch | "Jungle Expansion" | New biome (Jungle), Vine chain, 10 new levels (51–60), 3 new animals, 2 new landmarks. |
| Q2 Post-Launch | "Cavern Depths" | New biome (Cavern), Crystal chain expanded, underground-themed levels, new obstacle type (stalactites). |
| Q3 Post-Launch | "Seasonal Celebrations" | Full seasonal event calendar (Spring/Summer/Fall/Winter). 4 seasonal merge chains. Rotating limited cosmetics. |
| Q4 Post-Launch | "Multiplayer Merge" | Real-time 1v1 mode: same seed, race to target score. Ranked ladder with seasonal rewards. |

#### Year 2+ Vision

| Feature | Description |
|---|---|
| Planet Creator Mode | Freeplay sandbox where players build planets without a target score. Share creations. |
| Planet Visitors | Other players' animals can "visit" your planet (async). Earn friendship bonuses. |
| Guild/Club System | Join a club of up to 30 players. Club challenges with shared rewards. Club leaderboard. |
| Cross-Promotion | If the studio makes a second game, cross-promote with in-game cosmetic rewards. |

---

## 3. Feature Priority Matrix

### Must Have (Launch)

| Feature | Phase |
|---|---|
| 5×5 grid with tap-to-place | Prototype |
| 3-tile merge + chain merges | Prototype |
| Tile queue (2 preview) | Prototype |
| Life burst system | Prototype |
| Score + win/loss | Prototype |
| 1 free undo | Prototype |
| Tutorial (7 steps) | Alpha |
| 3 merge chains (Earth, Water, Plant) | Alpha |
| 10 animals, 10 landmarks | Alpha |
| 10 Grassland levels | Alpha |
| Save system (local) | Alpha |
| Collection book | Alpha |
| Stardust economy + upgrades | Alpha |
| All 5 biomes, 50 levels | Beta |
| All 20 merge chains | Beta |
| Rewarded ads + interstitials | Beta |
| IAP (Starter Bundle, Moonstones) | Beta |
| Daily Planet + leaderboard | Beta |
| Daily gift streak | Beta |
| Settings screen | Beta |

### Should Have (Launch or Shortly After)

| Feature | Phase |
|---|---|
| 6×6 grid upgrade | Beta |
| Weekend events | Beta |
| Season Pass | Beta |
| Friend system + challenges | Beta |
| Planet snapshots + sharing | Beta |
| Cloud save | Beta |
| Cosmetic shop (planet skins, tile skins, merge effects) | Beta |
| Obstacle tiles | Beta |
| Notifications | Beta |
| Achievements | Beta |

### Nice to Have (Post-Launch)

| Feature | Phase |
|---|---|
| Community gallery | Live |
| Weekly challenge | Live |
| Music packs | Live |
| Additional biomes | Live (quarterly) |
| Real-time 1v1 | Live (Q4) |
| Planet Creator mode | Year 2 |
| Club system | Year 2 |
| Colorblind mode | Launch (accessibility) |

---

## 4. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Core loop isn't fun enough | Medium | Critical | Prototype phase is dedicated to proving fun. Kill the project early if playtests fail. Don't invest in art until fun is validated. |
| 2 | Retention is below targets | Medium | High | Soft launch phase specifically measures retention. Have a list of "retention levers" ready: more content, better pacing, streak improvements, push notification tuning. |
| 3 | Monetization revenue too low | Medium | High | Test multiple price points in soft launch A/B tests. Have a plan to add a battle pass or cosmetic gatcha if initial monetization underperforms (without making it aggressive). |
| 4 | Scope creep delays launch | High | Medium | Strictly prioritize "Must Have" features. Cut "Should Have" items if behind schedule. Launch with Grassland + Desert only if needed, then add biomes post-launch. |
| 5 | Server costs exceed revenue | Low | Medium | The backend is minimal (serverless). Estimated cost: < $200/month at 50K DAU. Scale concerns only arise at 500K+ DAU, which is a good problem to have. |
| 6 | App store rejection | Low | Medium | Follow platform guidelines strictly. No lootboxes (cosmetics are direct purchase). COPPA/GDPR compliance from day one. Submit early for review. |
| 7 | Copycat competition | Medium | Low | Speed to market matters. The cozy art style and planet theme are differentiators. Focus on polish and player experience, not feature count. |
| 8 | Artist burnout (1 artist, lots of content) | Medium | High | Prioritize reusable art patterns (tile tiers share silhouettes, animals share base rigs). Use color palettes to differentiate biomes cheaply. Consider contract artist for event content. |

---

## 5. Key Performance Indicators (KPIs)

### Product KPIs

| KPI | Target (Launch) | Target (Mature, 6mo+) |
|---|---|---|
| DAU | 10,000 | 50,000+ |
| D1 Retention | 45% | 50% |
| D7 Retention | 22% | 25% |
| D30 Retention | 10% | 12% |
| Avg. Session Length | 7 min | 8 min |
| Avg. Sessions/Day | 2.5 | 3 |
| Tutorial Completion | 93% | 95% |
| Level 10 Reach (D7) | 60% of D7 retained | 70% |

### Revenue KPIs

| KPI | Target (Launch) | Target (Mature) |
|---|---|---|
| ARPDAU (total) | $0.08 | $0.12 |
| ARPDAU (ads) | $0.05 | $0.06 |
| ARPDAU (IAP) | $0.03 | $0.06 |
| IAP Conversion (D7) | 3% | 5% |
| IAP Conversion (D30) | 6% | 10% |
| Paying User ARPPU | $8 | $12 |
| Ad opt-in rate (rewarded) | 55% | 60% |

### Health KPIs

| KPI | Target |
|---|---|
| Crash rate | < 0.5% of sessions |
| ANR rate (Android) | < 0.2% |
| App Store rating | > 4.5 stars |
| Support ticket volume | < 50/week at 50K DAU |
| Server uptime | > 99.9% |

---

## 6. Budget Estimate (12 Months to Launch)

| Category | Monthly Cost | 12-Month Total | Notes |
|---|---|---|---|
| Team salaries (4.5 FTE avg) | $30,000–$50,000 | $360,000–$600,000 | Varies by region. Assumes indie/small studio rates. |
| Software licenses (Unity, tools) | $500 | $6,000 | Unity Pro + supporting tools |
| Server costs (Firebase) | $50–$200 | $600–$2,400 | Minimal until launch |
| Sound/music (contract) | $2,000 (months 4–5) | $4,000 | Contract sound designer for SFX + 5 BGM tracks |
| Marketing (soft launch UA) | $2,000/mo (months 9–10) | $4,000 | Test campaigns in soft launch markets |
| Marketing (launch) | $10,000 (month 11) | $10,000 | Launch UA burst + PR |
| App store fees | $100/year each | $200 | Apple ($99) + Google ($25 one-time) |
| Contingency (10%) | — | $38,000–$62,000 | — |
| **Total** | — | **$423,000–$689,000** | — |

**Break-even estimate:** At $0.08 ARPDAU and 20,000 DAU, daily revenue ≈ $1,600, monthly ≈ $48,000. A $500K investment breaks even in ~10–12 months of live service post-launch.

---

*Document version: 1.0 — Release Roadmap*
