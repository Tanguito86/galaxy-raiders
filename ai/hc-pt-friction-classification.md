# HC-PT-03 — Friction Classification System

**Phase:** HC-PT  
**Status:** Active (classification established)  
**Date:** 2026-05-22  
**Dependency:** HC-PT-02 (feel taxonomy), HC-PT-01A (framework)

---

## 1. Friction System Philosophy

### What is "Hardcore Friction"?

Friction is any resistance the player feels against their enjoyment, engagement, or motivation. In hardcore games, **some friction is essential** — it creates the weight of decisions, the cost of mistakes, and the satisfaction of mastery.

**The goal is not zero friction. The goal is productive friction.**

### Productive vs Destructive Friction

| Productive (healthy) | Destructive (toxic) |
|---------------------|-------------------|
| "That death was my fault" | "That death was random" |
| "I need to practice that pattern" | "I can't learn this, it's nonsense" |
| "One more run" | "I'm done" |
| Tension that breathes | Tension that suffocates |
| Recovery that empowers | Recovery that demoralizes |
| Greed that tempts | Greed that punishes |

### Why Hardcore Needs Friction

Without friction:
- Victories feel hollow
- Score becomes meaningless
- Routing loses tension
- Patterns become memorization exercises
- "One more run" dies

With **productive** friction:
- Every dodge feels earned
- Score temptations create micro-dramas
- Death hurts but teaches
- Recovery builds confidence
- Mastery creates obsession

### When Friction Destroys "One More Run"

The moment friction shifts from **"I can overcome this"** to **"this isn't worth it"**, the game fails.

**Break point signals:**
- Player blames the game, not themselves
- Player can't identify what they learned from a death
- Player feels drained, not energized, after a session
- Scoring systems feel oppressive, not tempting
- Recovery feels like punishment, not opportunity

---

## 2. Official Friction Categories

---

### 2.1 FAIR-HARD

**Definition:** High difficulty that feels earned. Player knows why they died and what to do differently.

| Aspect | Value |
|--------|-------|
| Psychological effect | Determination, respect for the game |
| Typical causes | Well-telegraphed dense patterns, fast but predictable boss attacks |
| Visible symptoms | Player leans in, focus intensifies |
| Gameplay symptoms | Retry count increases, but death count per section decreases over time |
| Emotional outcome | "I can do this" |
| Escalation pattern | None — this is the target state |
| Recovery possibility | N/A — this is healthy |
| Severity tendency | N/A — GOOD state |
| Detectable during playtest | Player is engaged, not frustrated |

**GOOD variant:** Level 17 survival corridor with HC-RD clarity — bullets are fast and dense but readable.
**BAD variant:** N/A — Fair-Hard is never bad.

---

### 2.2 CHEAP

**Definition:** Death or damage that feels random, unexpected, or unavoidable. Player attributes fault to the game, not themselves.

| Aspect | Value |
|--------|-------|
| Psychological effect | Anger, betrayal, learned helplessness |
| Typical causes | Un-telegraphed attacks, offscreen spawns, hitbox mismatch, background camouflage |
| Visible symptoms | Player flinches, exclaims "what?!", physically recoils |
| Gameplay symptoms | Deaths concentrated in specific sections, zero adaptation between attempts |
| Emotional outcome | "This is unfair" |
| Escalation pattern | CHEAP → FRUSTRATION → RAGE QUIT |
| Recovery possibility | Requires fix — not recoverable by player adaptation |
| Severity tendency | HIGH or CRITICAL |
| Detectable during playtest | Player verbalizes "cheap", "unfair", "where did that come from" |

**GOOD variant:** None. Cheap is never acceptable.
**BAD variant:** EMPERADOR 0-frame teleport shockwave (pre-HC-BD mitigation).

---

### 2.3 NOISY

**Definition:** Visual or cognitive overload where threats exist but can't be parsed. Player sees "wall of noise" not individual threats.

| Aspect | Value |
|--------|-------|
| Psychological effect | Confusion, cognitive shutdown, tunnel vision |
| Typical causes | Bullet density above readability ceiling, overlapping popups, decorative clutter, same-color bullets |
| Visible symptoms | Player stops tracking individual threats, gaze fixates on ship instead of threats |
| Gameplay symptoms | Panic dodging, stops shooting, movement quality degrades |
| Emotional outcome | "I can't see anything" |
| Escalation pattern | NOISY → PANIC-NO-READ → CHEAP-feeling death → FRUSTRATION |
| Recovery possibility | Reposition to clearer area, wait for density to drop |
| Severity tendency | MEDIUM or HIGH |
| Detectable during playtest | Player squints, complains about visibility, "I can't tell what's dangerous" |

**GOOD variant:** Dense wave with clear bullet outlines, color-coded threats, PRIORITY layers — intensity without illegibility.
**BAD variant:** Bullet curtain without outlines, all bullets same color, popup flood masking threats.

---

### 2.4 EMPTY

**Definition:** Section with insufficient engagement. Player is not threatened, not entertained, not motivated. "Why does this section exist?"

| Aspect | Value |
|--------|-------|
| Psychological effect | Boredom, disengagement, clock-watching |
| Typical causes | Empty relief sections, post-boss lulls without content, same formation too many times |
| Visible symptoms | Player looks away from screen, checks phone, posture relaxes |
| Gameplay symptoms | Player stops optimizing, flies in straight lines, ignores medals |
| Emotional outcome | "Is this almost over?" |
| Escalation pattern | EMPTY → FATIGUE → session abandonment |
| Recovery possibility | Add minimal enemy presence, medal routing incentive |
| Severity tendency | LOW or MEDIUM |
| Detectable during playtest | Player checks time, stops engaging, "this part is boring" |

**GOOD variant:** Level 6 collapse curve after boss — lower intensity but still has formation showcase + enemy presence.
**BAD variant:** 12s of completely empty screen during relief — player disengages entirely.

---

### 2.5 OVERLOAD

**Definition:** Sustained maximum intensity without relief. Player cannot mentally recover. Exhaustion accumulates.

| Aspect | Value |
|--------|-------|
| Psychological effect | Exhaustion, dread, desire to stop |
| Typical causes | Back-to-back high-intensity sections, overload curve without breathers, boss chains without pause |
| Visible symptoms | Player's shoulders raise, breathing becomes shallow, micro-expressions of stress |
| Gameplay symptoms | Error rate climbs, dodging becomes sloppy, scoring ignored (survival-only mindset) |
| Emotional outcome | "I just want this to end" |
| Escalation pattern | OVERLOAD → PANIC-NO-READ → FATIGUE → QUIT |
| Recovery possibility | Insert relief section or reduce intensity temporarily |
| Severity tendency | MEDIUM or HIGH |
| Detectable during playtest | Player shows visible exhaustion, error rate spike, verbalizes "too much" |

**GOOD variant:** Level 20 EMPERADOR overload — maximum intensity, but it's the final boss. Appropriate for climax.
**BAD variant:** Levels 16→17→18→19→20 with inadequate recovery between.

---

### 2.6 FATIGUE

**Definition:** Cumulative exhaustion from gameplay. Player CAN continue but doesn't WANT to.

| Aspect | Value |
|--------|-------|
| Psychological effect | Burnout, resentment, avoidance |
| Typical causes | Long sessions without novelty, repetitive wave patterns, insufficient visual palette changes |
| Visible symptoms | Player slumps, stretches excessively, checks clock |
| Gameplay symptoms | Inconsistent performance, shorter sessions over time |
| Emotional outcome | "I need a break" (not "one more run") |
| Escalation pattern | FATIGUE → DRAINING → session abandonment → game avoidance |
| Recovery possibility | Palette change, formation variety, reduce session length expectations |
| Severity tendency | MEDIUM |
| Detectable during playtest | Session length decreases across multiple playtest sessions |

**GOOD variant:** Satisfied exhaustion after a great run — "that was intense, I'll play more tomorrow."
**BAD variant:** "That was exhausting. I don't want to play again."

---

### 2.7 FLOW-BREAK

**Definition:** Abrupt interruption of immersion. Player is pulled out of the flow state and becomes aware of the game as a product.

| Aspect | Value |
|--------|-------|
| Psychological effect | Disconnection, annoyance, re-orientation cost |
| Typical causes | Long transition pauses, intrusive UI, forced waits, cinematic interruptions |
| Visible symptoms | Player shifts in seat, checks surroundings, loses focus |
| Gameplay symptoms | Death immediately after flow-break (lost rhythm), takes time to re-enter |
| Emotional outcome | "Why did it stop?" |
| Escalation pattern | FLOW-BREAK → re-entry friction → FATIGUE |
| Recovery possibility | Player can re-enter flow within 5-10 seconds |
| Severity tendency | LOW or MEDIUM |
| Detectable during playtest | Player dies right after a transition, verbalizes frustration with pauses |

**GOOD variant:** Brief 900ms wave transition with banner — clear break between sections, immediate re-entry.
**BAD variant:** 5-second forced pause with unskippable animation — player loses all rhythm.

---

### 2.8 SCORE-DEAD

**Definition:** Scoring system exists but doesn't influence player behavior. Score is accumulated passively, not actively pursued.

| Aspect | Value |
|--------|-------|
| Psychological effect | Indifference, "why does score matter?" |
| Typical causes | Weak feedback, invisible multipliers, safe play dominating scoring, no greed incentives |
| Visible symptoms | Player ignores medals, doesn't change route for score |
| Gameplay symptoms | Score composition identical across runs (no optimization), multiplier stays at ×1.0-1.2 |
| Emotional outcome | "Score doesn't matter" |
| Escalation pattern | SCORE-DEAD → GREEDLESS → game lacks replay depth |
| Recovery possibility | Enhance feedback, increase greed tension, make multiplier visible |
| Severity tendency | MEDIUM |
| Detectable during playtest | Player can't recall their score, doesn't check multiplier HUD, ignores medal chains |

**GOOD variant:** Player routes for medals, checks multiplier number, celebrates FEVER activation.
**BAD variant:** Player finishes run, score is displayed, "oh, didn't notice that."

---

### 2.9 RECOVERY-BAD

**Definition:** Post-hit experience feels punitive. Player doesn't feel they can recover. "Run's dead."

| Aspect | Value |
|--------|-------|
| Psychological effect | Despair, resignation, run abandonment |
| Typical causes | Multiplier full reset on death, recovery too slow, no positive feedback for comeback |
| Visible symptoms | Player resets run after one hit, verbalizes "run's dead" |
| Gameplay symptoms | Run abandonment rate > 50% after first death |
| Emotional outcome | "No point continuing" |
| Escalation pattern | RECOVERY-BAD → run abandonment → "one more run" destroyed |
| Recovery possibility | This IS the recovery problem |
| Severity tendency | HIGH |
| Detectable during playtest | Player restarts after any hit, "that's it for this run" |

**GOOD variant:** HC-SC recovery — multiplier −30% (not reset), rank RECOVERING → unblock, comeback bonus +1500.
**BAD variant:** Instant multiplier reset to ×1.0, rank reset to 0, no recovery bonus.

---

### 2.10 NON-MEMORABLE

**Definition:** Level, boss, or encounter leaves no impression. Player can't distinguish it from adjacent content.

| Aspect | Value |
|--------|-------|
| Psychological effect | Amnesia, interchangeability, "which level was that?" |
| Typical causes | Same formation 4 cycles, no identity differentiation, bosses share mechanics |
| Visible symptoms | Player can't name levels, describes by number not name |
| Gameplay symptoms | No favorite level, no level-specific strategies |
| Emotional outcome | Indifference |
| Escalation pattern | NON-MEMORABLE → STATIC → game lacks personality |
| Recovery possibility | Add identity elements: name, palette, signature enemy, formation gimmick |
| Severity tendency | LOW or MEDIUM |
| Detectable during playtest | Player can only name 2-3 levels, "they all feel the same" |

**GOOD variant:** PINCER ASSAULT — memorable name, symmetric formation, alien3 anchor.
**BAD variant:** "Level 6? Was that the one with the... no, wait, that was level 8."

---

### 2.11 ROUTE-LOCK

**Definition:** Scoring optimization forces a single correct route. No player expression, no tactical variety.

| Aspect | Value |
|--------|-------|
| Psychological effect | Rigidity, constraint, "there's only one way to play" |
| Typical causes | Dominant scoring source, safe route too rewarding, greed route too punishing |
| Visible symptoms | All high scores use identical strategies |
| Gameplay symptoms | Medal routing always identical, aggression level never varies |
| Emotional outcome | "Why would I play differently?" |
| Escalation pattern | ROUTE-LOCK → STATIC → replayability dies |
| Recovery possibility | Balance scoring sources, make multiple routes viable |
| Severity tendency | MEDIUM |
| Detectable during playtest | Score composition identical across all skilled players |

**GOOD variant:** Elite player can choose: aggressive near-kill routing OR safe medal farming OR graze-heavy play — all viable.
**BAD variant:** One strategy dominates so hard that alternatives are strictly inferior.

---

### 2.12 GREEDLESS

**Definition:** Optional scoring systems exist but don't tempt the player. No internal conflict between safety and greed.

| Aspect | Value |
|--------|-------|
| Psychological effect | Apathy, "why risk it?" |
| Typical causes | Graze score too low, medal collection too safe, close-range bonus too small |
| Visible symptoms | Player stays at safe distance always, never risks a medal |
| Gameplay symptoms | Graze count near zero, medal chain never exceeds tier 1, aggression bonuses never trigger |
| Emotional outcome | "No reason to take risks" |
| Escalation pattern | GREEDLESS → SCORE-DEAD → game is survival-only |
| Recovery possibility | Increase greed incentives, make risk/reward ratio tempting |
| Severity tendency | MEDIUM |
| Detectable during playtest | Player graze count = 0-1 per run, aggression % < 5%, medal chain < 5 |

**GOOD variant:** Player hesitates before a medal, sees ×1.75 near-kill bonus, decides to dive in.
**BAD variant:** Player never grazes, never close-range kills, never chases medals — all safe, all boring.

---

### 2.13 PANIC-NO-READ

**Definition:** Player enters panic state where threat parsing stops. Movement becomes random, shooting stops. "I can't think."

| Aspect | Value |
|--------|-------|
| Psychological effect | Fight-or-flight override, cognitive shutdown |
| Typical causes | NOISY + OVERLOAD combination, unexpected density spike, boss pattern overlap |
| Visible symptoms | Rapid random movement, gaze fixation on ship, stops shooting |
| Gameplay symptoms | Bullet collisions within 500ms of panic onset, no recovery |
| Emotional outcome | "I couldn't do anything" |
| Escalation pattern | PANIC-NO-READ → death → frustration |
| Recovery possibility | Reduce density, insert brief breather, improve threat readability |
| Severity tendency | HIGH |
| Detectable during playtest | Player movement becomes erratic, stops firing, dies rapidly |

**GOOD variant:** "Good panic" — heart rate up, still parsing, survived barely, "that was intense!"
**BAD variant:** "Blind panic" — no parsing, no decisions, random death, "what just happened?"

---

### 2.14 VISUAL-CONFLICT

**Definition:** Game elements visually compete for attention. Decorative elements masquerade as threats. Player can't distinguish signal from noise.

| Aspect | Value |
|--------|-------|
| Psychological effect | Distrust of visuals, constant vigilance fatigue |
| Typical causes | Background particles look like bullets, HUD overlaps danger zone, explosions mask threats |
| Visible symptoms | Player reacts to non-threats, ignores real threats |
| Gameplay symptoms | Deaths where player dodged the wrong thing |
| Emotional outcome | "I can't trust what I see" |
| Escalation pattern | VISUAL-CONFLICT → CHEAP-feeling deaths → FRUSTRATION |
| Recovery possibility | HC-RD enforcement: priority layers, alpha floors, color language |
| Severity tendency | MEDIUM |
| Detectable during playtest | Player dodges stars/particles, gets hit by bullets they didn't see |

**GOOD variant:** HC-RD-compliant: bullets have dark outlines, background alpha-capped, nothing decorative looks dangerous.
**BAD variant:** White bullets on nebula background, explosion particles same color as enemy bullets.

---

### 2.15 CLIMAX-WEAK

**Definition:** Boss fight or set piece that should be a peak feels like a plateau. No emotional payoff.

| Aspect | Value |
|--------|-------|
| Psychological effect | Disappointment, "that's it?" |
| Typical causes | No buildup, boss too easy, climax identical to normal section, weak death sequence |
| Visible symptoms | Player doesn't react to boss death, no celebration |
| Gameplay symptoms | Boss fight feels like regular wave, no strategy change |
| Emotional outcome | "That was the boss?" |
| Escalation pattern | CLIMAX-WEAK → NON-MEMORABLE → game lacks peaks |
| Recovery possibility | Better prelude, boss-specific mechanics, dramatic death sequence, score popup |
| Severity tendency | MEDIUM |
| Detectable during playtest | Player doesn't realize they just killed a boss, "was that it?" |

**GOOD variant:** EMPERADOR death — explosion, medal rain, score popup, victory screen.
**BAD variant:** CRABTRON fight feels identical to wave 4 tank section.

---

### 2.16 DRAINING

**Definition:** Gameplay that consumes energy faster than it generates engagement. Net negative emotional experience.

| Aspect | Value |
|--------|-------|
| Psychological effect | Depletion, avoidance, "I don't want to play" |
| Typical causes | OVERLOAD + FATIGUE + RECOVERY-BAD combination |
| Visible symptoms | Player stops session early, shorter sessions over time, eventually stops playing |
| Gameplay symptoms | Performance degrades over session, errors compound |
| Emotional outcome | "This game is exhausting" |
| Escalation pattern | DRAINING → reduced play frequency → abandonment |
| Recovery possibility | Systemic: fix overload pacing + improve recovery + reduce fatigue |
| Severity tendency | HIGH |
| Detectable during playtest | Session length trending downward across multiple sessions |

**GOOD variant:** Energized after a session — "I want to go again tomorrow."
**BAD variant:** "I need a day off from this game" after every session.

---

### 2.17 STATIC

**Definition:** No variation across runs. Identical patterns, identical routing, identical outcome.

| Aspect | Value |
|--------|-------|
| Psychological effect | Predictability, staleness, "why play again?" |
| Typical causes | Fixed formations, deterministic patterns, no rank scaling, no procedural variance |
| Visible symptoms | Player can predict exact enemy positions, autopilots |
| Gameplay symptoms | Identical performance across runs, no learning/improvement |
| Emotional outcome | "I've seen this before" |
| Escalation pattern | STATIC → NON-MEMORABLE → replayability dies |
| Recovery possibility | Rank system adds variance, score system creates routing choices |
| Severity tendency | MEDIUM |
| Detectable during playtest | Player describes content as "the same as last time" |

**GOOD variant:** Rank changes bullet speed, scoring changes routing, stage plans vary per level — different each run.
**BAD variant:** Every run identical — same enemies, same timing, same score.

---

### 2.18 SPIKE-BAD

**Definition:** Sudden, unexpected difficulty spike without buildup. Player is caught off guard.

| Aspect | Value |
|--------|-------|
| Psychological effect | Shock, resentment, "why is this suddenly impossible?" |
| Typical causes | Ambush without warning, boss enters with 0-frame attack, rank jumps 2 levels instantly |
| Visible symptoms | Player dies within 2 seconds of section start, "what?!" |
| Gameplay symptoms | Death cluster at spike points, player avoids those sections mentally |
| Emotional outcome | "That came out of nowhere" |
| Escalation pattern | SPIKE-BAD → CHEAP perception → FRUSTRATION |
| Recovery possibility | Add buildup/telegraph, smooth rank transitions |
| Severity tendency | HIGH |
| Detectable during playtest | Death within first encounter with new section type |

**GOOD variant:** Ambush section with brief telegraph — "AMBUSH" banner, 1s warning, THEN intensity spike.
**BAD variant:** Boss teleports on top of player and fires instantly — no reaction time.

---

### 2.19 SAFE-BORING

**Definition:** Optimal play is the safest play. Risk-taking is actively punished. No incentive for aggression.

| Aspect | Value |
|--------|-------|
| Psychological effect | Complacency, lack of excitement, "why bother?" |
| Typical causes | Safe-distance kills 100% effective, graze score trivial, close-range bonus too low |
| Visible symptoms | Player stays at screen bottom, never moves toward enemies |
| Gameplay symptoms | Score composition: kills 70%+, aggression < 5%, graze < 1% |
| Emotional outcome | "This works, why change?" |
| Escalation pattern | SAFE-BORING → GREEDLESS → SCORE-DEAD |
| Recovery possibility | Increase greed incentives, make safe play less rewarding per unit time |
| Severity tendency | MEDIUM |
| Detectable during playtest | Player's ship never enters top half of screen, never near enemies |

**GOOD variant:** Player is tempted to dive for ×1.75 near-kill bonus but must dodge to survive.
**BAD variant:** "Why would I ever get close? It's suicide and gives nothing."

---

### 2.20 SCORE-OPPRESSIVE

**Definition:** Scoring system creates anxiety rather than excitement. Multiplier maintenance feels like a burden, not a reward.

| Aspect | Value |
|--------|-------|
| Psychological effect | Anxiety, dread, "I can't lose my multiplier" |
| Typical causes | Full multiplier reset on hit, decay too fast, chain break too punishing |
| Visible symptoms | Player plays hyper-cautiously to protect multiplier, avoids all risk |
| Gameplay symptoms | Multiplier dominates all decisions, player resets if multiplier drops |
| Emotional outcome | "I'm scared to play" |
| Escalation pattern | SCORE-OPPRESSIVE → SAFE-BORING → ROUTE-LOCK |
| Recovery possibility | Partial penalty (not full reset), recovery bonus, shorter rebuild time |
| Severity tendency | HIGH |
| Detectable during playtest | Player verbalizes anxiety about losing multiplier, resets run after multiplier drops |

**GOOD variant:** Multiplier −30% on death, rebuilds in 10-15 kills. Feels like a setback, not a reset.
**BAD variant:** Multiplier full reset to ×1.0 on any hit. Player abandons run if multiplier drops.

---

## 3. Friction Escalation Model

```
Small problems → Accumulated issues → Run abandonment → Game abandonment

CHEAP death
  → "That was unfair"
  → Trust lost
  → VIGILANCE (player is hyper-aware, stressed)
  → FATIGUE
  → Next CHEAP death = CRITICAL FRUSTRATION
  → QUIT

OVERLOAD without relief
  → PANIC-NO-READ
  → Death
  → RECOVERY-BAD (multiplier reset)
  → "Run's dead"
  → RESTART or QUIT

SCORE-OPPRESSIVE
  → SAFE-BORING
  → GREEDLESS
  → SCORE-DEAD
  → NON-MEMORABLE
  → STATIC
  → Player stops playing (silent abandonment)

NOISY wave
  → VISUAL-CONFLICT
  → PANIC-NO-READ
  → CHEAP-feeling death
  → FRUSTRATION
  → DRAINING
  → Session ends early
```

### The Death Spiral
```
Initial friction → Cognitive load increases → Error rate rises → More friction → Overload → Panic → Death → Recovery fails → Frustration → Quit
```

**Break the spiral at any point:**
- Reduce friction (readability fix)
- Insert relief (pacing fix)
- Improve recovery (scoring fix)
- Make death educational (fairness fix)

---

## 4. Healthy vs Toxic Hardcore

| Category | Healthy | Toxic |
|----------|---------|-------|
| **Pressure** | Heart rate elevated, still parsing, "intense!" | Cognitive shutdown, random dodging, "I can't!" |
| **Punishment** | Multiplier −30%, rank −8, rebuildable | Multiplier reset to ×1.0, rank 0, "run's dead" |
| **Greed** | "Should I risk it? The bonus is tempting..." | "If I don't play perfectly, my score is worthless" |
| **Difficulty** | "I need to practice that pattern" | "That pattern is impossible" |
| **Recovery** | "I can still pull this off" | "There's no point continuing" |
| **Mastery** | "I'm getting better every run" | "I'm not improving, this is random" |

---

## 5. Retry Psychology

### What Generates "One More Run"

| Trigger | Mechanism |
|---------|-----------|
| **Death that teaches** | "I know what I did wrong. Next time I'll dodge left." |
| **Near-miss** | "I almost had it. I was so close." |
| **Score temptation** | "I could have had ×2.0 multiplier if I didn't die there." |
| **Chain regret** | "My medal chain was at 18. So close to FEVER." |
| **New knowledge** | "Now I know that boss has a safe spot in the corner." |

### What Destroys Retry Motivation

| Trigger | Mechanism |
|---------|-----------|
| **Unfair death** | "That wasn't my fault. The game cheated." |
| **Full reset** | "Everything I earned is gone. No point." |
| **Exhaustion** | "I'm too tired to try again." |
| **Monotony** | "It'll just be the same thing again." |
| **Anxiety** | "I'm stressed just thinking about that section." |

### What Produces Silent Abandonment
- Player doesn't rage quit — they just stop launching the game
- "I'll play later" → never plays again
- No explicit complaint — just indifference
- **Cause:** DRAINING + STATIC + NON-MEMORABLE combination

### What Produces Rage Quit
- Player slams something, vocalizes anger, closes game immediately
- "This is impossible / unfair / broken"
- **Cause:** CHEAP or SPIKE-BAD

### What Produces Positive Obsession
- Player dreams about patterns
- Player thinks about strategies when not playing
- "I need to try that boss again"
- **Cause:** FAIR-HARD difficulty + SCORE ENGAGEMENT + MEMORABLE content

---

## 6. Flow-Break Analysis

| Type | Definition | Example |
|------|-----------|---------|
| **Visual flow-break** | Screen element breaks attention | Intrusive UI, giant medal popup, screen flash during dense pattern |
| **Emotional flow-break** | Emotional state disrupted | Triumph → frustration, engagement → boredom |
| **Pacing flow-break** | Rhythm interrupted | Overload section without preceding relief, boss starts without prelude |
| **Score flow-break** | Scoring engagement lost | Multiplier disappears, chain breaks, no feedback |
| **Control flow-break** | Player agency removed | Forced movement, cinematic lock, invincibility taking control |

---

## 7. Playtest Detection Rules

### Observable Signals (what to watch)

| Signal | Indicates |
|--------|-----------|
| Player leans back, posture relaxes | EMPTY / BOREDOM |
| Player leans forward, tense shoulders | PRESSURE / OVERLOAD |
| Player recoils, flinches | CHEAP / SPIKE-BAD |
| Player squints, tilts head | NOISY / VISUAL-CONFLICT |
| Player checks clock/phone | EMPTY / FATIGUE |
| Player verbalizes "what?!" | CHEAP |
| Player verbalizes "nice!" / "yes!" | SCORE ENGAGEMENT / FAIR-HARD |
| Player verbalizes "one more" after death | HEALTHY RETRY PSYCHOLOGY |
| Player silent after death | RECOVERY-BAD / DRAINING |

### Audit Language — Phrases to Use

| ✅ Specific (GOOD) | ❌ Ambiguous (BAD) |
|-------------------|-------------------|
| "HIGH CHEAP detected: death at level 7 with no telegraph" | "This feels weird" |
| "MEDIUM NOISY: level 17 survival corridor exceeds readability at rank 5" | "Too many bullets" |
| "LOW EMPTY: level 6 relief section has no enemies for 12s" | "Kinda boring" |
| "MEDIUM GREEDLESS: player never risks medals, graze count = 0" | "Scoring doesn't matter" |

### How to Report Friction Correctly

1. **Category + Severity** — "MEDIUM OVERLOAD at levels 16-20"
2. **Specific evidence** — "Player error rate tripled, stopped collecting medals, verbalized exhaustion"
3. **Root cause hypothesis** — "Four consecutive high-intensity sections without adequate recovery"
4. **Proposed action** — "Insert relief between levels 18 and 19, extend boss prelude for TENIENTE"

---

## 8. Friction Interaction Matrix

```
OVERLOAD    ──→ PANIC-NO-READ ──→ CHEAP death ──→ FRUSTRATION
FATIGUE     ──→ FLOW-BREAK    ──→ DRAINING    ──→ ABANDONMENT
SCORE-OPPRESSIVE ──→ RECOVERY-BAD ──→ RUN ABANDONMENT
NOISY       ──→ VISUAL-CONFLICT ──→ CLARITY collapse
EMPTY       ──→ NON-MEMORABLE ──→ STATIC ──→ SILENT ABANDONMENT
SPIKE-BAD   ──→ CHEAP perception ──→ RAGE QUIT
SAFE-BORING ──→ GREEDLESS ──→ SCORE-DEAD ──→ DRAINING
CLIMAX-WEAK ──→ NON-MEMORABLE ──→ "why replay?"
RECOVERY-BAD ──→ SCORE-OPPRESSIVE ──→ FEEDBACK LOOP
```

---

## 9. Hardcore Arcade Calibration Notes

### Cave Readability Philosophy
- **Every bullet must be visible against every background.**
- Priority layers: threats → telegraphs → enemies → feedback → ambient.
- Dark outlines on all bullets regardless of color.

### Garegga Pressure Layering
- Rank adds complexity, not just speed.
- Higher rank = more bullet sources, not just faster bullets.
- Recovery must counteract rank's upward pressure.

### DOJ Panic Management
- Panic is a gameplay mechanic, not a failure state.
- "Hyper" system rewards panic-level proximity.
- But only if threats remain readable during panic.

### Arcade Retry Psychology
- Death must feel like a lesson, not a punishment.
- Continue screen must invite, not mock.
- Score must persist through death (partial loss, not reset).

### Score Temptation Architecture
- Every optional system must have a visible reward.
- Greed must feel dangerous but worth it.
- No single scoring source should dominate.

---

## 10. Evaluation Examples

### GOOD Hardcore

| Example | Categories |
|---------|-----------|
| "Brutal pero entendible" — Level 17 survival corridor, HC-RD clarity, player dies but knows why | FAIR-HARD ✅ |
| "Greed opcional" — Medal chain at tier 4 near bullets, player hesitates, goes for it, celebrates | GREED-TENSION ✅ (healthy) |
| "Panic legible" — Dense wave, heart rate up, still parsing, survived barely, "that was intense!" | GOOD PANIC ✅ |
| "Comeback motivador" — Hit during boss, multiplier drops but recovers, comeback bonus triggers, run saved | RECOVERY ✅ (healthy) |

### BAD Hardcore

| Example | Categories |
|---------|-----------|
| "Densidad ilegible" — Bullet curtain without outlines, all same color, player can't parse threats | NOISY + PANIC-NO-READ ❌ |
| "Score obligatorio tóxico" — Multiplier full reset on hit, player abandons run | SCORE-OPPRESSIVE + RECOVERY-BAD ❌ |
| "Fatiga sin relief" — Four consecutive high-intensity sections, player exhausted | OVERLOAD + FATIGUE + DRAINING ❌ |
| "Boss sin payoff emocional" — CRABTRON fight feels identical to tank wave, no climax feeling | CLIMAX-WEAK + NON-MEMORABLE ❌ |
| "Frustración acumulativa silenciosa" — Player stops launching game, no explicit complaint, just indifference | STATIC + DRAINING + SILENT ABANDONMENT ❌ |
