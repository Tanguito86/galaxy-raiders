# HC-PT-02 — Feel Audit Taxonomy

**Phase:** HC-PT  
**Status:** Active (taxonomy established)  
**Date:** 2026-05-22  
**Dependency:** HC-PT-01A (framework)

---

## 1. Taxonomy Structure

### 1.1 Domains (12 categories)

```
                    ┌─────────────────────────┐
                    │     HARDCORE FEEL        │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
   ┌────▼─────┐           ┌────▼─────┐           ┌─────▼──────┐
   │READABILITY│          │ FAIRNESS │           │  PRESSURE   │
   │  CLUSTER  │          │ CLUSTER  │           │  CLUSTER    │
   └────┬─────┘           └────┬─────┘           └─────┬──────┘
        │                      │                       │
   ┌────▼─────┐           ┌────▼─────┐           ┌─────▼──────┐
   │readability│          │ fairness │           │ pressure    │
   │clarity_   │          │ greed_   │           │ fatigue     │
   │under_     │          │ tension  │           │ panic       │
   │stress     │          │ recovery_│           │             │
   └──────────┘           │satisfact.│           └────────────┘
                          └──────────┘

   ┌────────────┐         ┌────────────┐         ┌────────────┐
   │  EMOTIONAL │         │   SCORE    │         │  MEMORY    │
   │  CLUSTER   │         │  CLUSTER   │         │  CLUSTER   │
   └─────┬──────┘         └─────┬──────┘         └─────┬──────┘
         │                      │                      │
    ┌────▼─────┐           ┌────▼─────┐           ┌────▼─────┐
    │emotional │           │score_    │           │memorability│
    │pacing    │           │engagement│           │flow       │
    │          │           │          │           │           │
    └──────────┘           └──────────┘           └──────────┘
```

### 1.2 Evaluation Priority

| Priority | Category | Why first |
|----------|----------|-----------|
| **P0 (blocking)** | readability | If bullets aren't visible, nothing else matters |
| **P0 (blocking)** | fairness | If deaths feel random, player quits |
| **P1 (high)** | clarity_under_stress | Can player parse danger when it's dense? |
| **P1 (high)** | recovery_satisfaction | Does coming back from death feel good? |
| **P2 (medium)** | emotional_pacing | Do tension curves actually breathe? |
| **P2 (medium)** | score_engagement | Is scoring tempting enough? |
| **P3 (low)** | greed_tension | Is medal routing worth the risk? |
| **P3 (low)** | memorability | Which moments stick? |
| **P4 (polish)** | flow | Does time disappear during play? |
| **P4 (polish)** | fatigue | Can player sustain long sessions? |
| **P4 (polish)** | panic | Is panic productive or destructive? |
| **P4 (polish)** | frustration | Are frustration sources legitimate? |

---

## 2. Official Feel Categories

---

### 2.1 FAIRNESS

**Definition:** Every death must feel like the player's fault. Threats must be telegraphed before they kill.

**Goal:** Zero "random" deaths. Every fatal event must have been avoidable with player knowledge and skill.

**Positive signals:**
- Player can say "I saw that coming, I misread it"
- Death locations cluster (player struggles with SPECIFIC patterns)
- No-hit runs feel achievable, not luck-based

**Negative signals:**
- "Where did that come from?"
- "There was nothing I could do"
- Deaths in first 5 seconds of a new encounter
- Boss attacks with 0-frame telegraph

**Failure modes:**
- Un-telegraphed spawn (enemy appears on top of player)
- Background-colored bullets (no contrast)
- Hitbox larger than visual
- Pattern overlap creating pixel-perfect-only gaps

**GOOD example:** SERPENTRIX delayed trap — green rings appear, 380ms delay, 2 bullets. Player sees it, can react.
**BAD example:** EMPERADOR teleport shockwave — 0-frame reaction needed (noted in HC-BD audit, mitigated by phase transition)

**Detectable symptoms:**
- Deaths in first encounter with new enemy type > 50%
- Player verbalizes "unfair" or "cheap"
- High death concentration in specific level

---

### 2.2 READABILITY

**Definition:** All threats must be visually distinguishable from background, other threats, and decorative elements.

**Goal:** Player's eyes can instantly parse what's dangerous and what's not.

**Positive signals:**
- Bullets have clear outlines against all backgrounds
- Telegraphs use distinct colors per threat type
- Player bullets are visually distinct from enemy bullets
- No decorative element masquerades as a threat

**Negative signals:**
- "I couldn't see the bullet"
- Background stars look like bullets
- Explosion particles obscure incoming threats
- HUD elements overlap danger zones

**Failure modes:**
- Bullet color matches background theme
- Decorative nebula/dust particles resemble small bullets
- Telegraph alpha too low during intense moments
- Medal/score popups mask incoming bullets

**GOOD example:** HC-RD bullet clarity — dark outlines (#050308) around all bullets, alpha floors, PRIORITY layers
**BAD example:** White bullets on snow/nebula background without outline

**Detectable symptoms:**
- Player squinting or leaning forward
- Deaths where bullet was on screen but player didn't react
- "I thought that was a star"

---

### 2.3 PRESSURE

**Definition:** The sensation of being actively threatened. Distinct from difficulty — pressure is emotional, not mechanical.

**Goal:** Player feels engaged, alert, and alive. Not overwhelmed, not bored.

**Positive signals:**
- Heart rate elevated but controlled
- Player is breathing actively
- Player is making rapid decisions
- "This is intense" (not "this is impossible")

**Negative signals:**
- Player stops moving (paralysis)
- Player starts panic-dodging (random movement)
- Player stops shooting (overwhelmed)
- "I can't keep up"

**Failure modes:**
- Constant pressure with no relief → fatigue
- Sudden pressure spike without warning → panic
- Pressure that stays flat → boredom
- Pressure that only intensifies → exhaustion

**GOOD example:** Sawtooth curve — peaks rise, valleys rise, player feels escalation with breathing room
**BAD example:** Level 19→20 back-to-back bosses with 900ms pause — no relief, exhaustion

**Detectable symptoms:**
- Player verbalizes stress complaints
- Player takes longer between runs
- Error rate spikes during specific sections
- Player stops collecting medals (opts out of greed to survive)

---

### 2.4 FATIGUE

**Definition:** Mental and physical exhaustion from sustained gameplay. Distinct from difficulty — the player could clear the section, but doesn't want to.

**Goal:** Player finishes a session wanting more, not needing a break.

**Positive signals:**
- "One more run" after a 30-minute session
- Player voluntarily extends session
- Player starts immediately after game over

**Negative signals:**
- Player puts down the game mid-session
- "I need a break" after 10 minutes
- Same section feels harder on repeat (fatigue, not scaling)
- Player stops engaging with optional systems (medals, graze)

**Failure modes:**
- Overload curve too long (>45s without relief)
- Back-to-back bosses without breather
- Repetitive wave patterns (same formation 4 cycles)
- No visual palette change (monotony fatigue)

**GOOD example:** Level 5 boss → Level 6 collapse curve (relief after climax, lower intensity)
**BAD example:** Level 16 set piece → Level 17 survival corridor → Level 18 set piece → Level 19 boss → Level 20 boss (4 consecutive high-intensity sections)

**Detectable symptoms:**
- Death rate increases in late-game independent of difficulty scaling
- Player stops collecting medals in later waves
- Shorter sessions over multiple plays (vs one long session)

---

### 2.5 EMOTIONAL PACING

**Definition:** The macro-level rhythm of tension across a level or full run. Must alternate between engagement and recovery.

**Goal:** Tension curve feels authored — like a story with chapters, not a flat line.

**Positive signals:**
- Player can identify "that was the hard part"
- Relief sections feel like earned breathing room
- Preludes build genuine anticipation
- Climax feels like a peak, not just another section

**Negative signals:**
- "Every level feels the same"
- Can't identify where tension peaks
- No sense of buildup before boss
- Post-boss section feels pointless

**Failure modes:**
- Flat tension curve (all sections at same intensity)
- Missing relief (consecutive high-pressure sections)
- Ineffective prelude (boss appears without buildup)
- Anti-climactic ending (final boss feels like regular enemy)

**GOOD example:** Level 14 War Zone — sawtooth with proper relief, prelude, climax buildup to ORBITAL
**BAD example:** Level 6 post-CRABTRON — collapse curve (start high, slowly release) feels anticlimactic and empty

**Detectable symptoms:**
- Player can't recall specific level identities
- "Which level was that?" (interchangeable)
- Player skips levels mentally (no memorable moments)

---

### 2.6 RECOVERY SATISFACTION

**Definition:** The emotional experience of coming back after taking damage. Must feel hopeful, not despairing.

**Goal:** Player thinks "I can still pull this off" after a hit, not "run's dead."

**Positive signals:**
- Player continues playing aggressively after recovery
- Player uses recovery window to re-route medal collection
- Recovery bonus feels like a reward for resilience

**Negative signals:**
- Player resets run after one hit
- "Run's dead" mentality
- Recovery period feels like punishment
- Player plays passively after recovery (traumatized)

**Failure modes:**
- Multiplier penalty too harsh (full reset)
- Recovery window too short (can't mentally reset)
- No positive feedback for recovery
- Invincibility too short to reposition

**GOOD example:** HC-SC recovery — multiplier −30% (not reset), +1500 bonus on comeback, rank RECOVERING for 4s then unblocks
**BAD example:** Instant multiplier reset to ×1.0 on hit — player feels run is worthless

**Detectable symptoms:**
- Player restarts after any death (run-abandonment rate > 50%)
- Player verbalizes "that's it" after a hit
- Score curve shows sharp drops without recovery

---

### 2.7 SCORE ENGAGEMENT

**Definition:** How much the scoring system drives player decisions and creates satisfaction.

**Goal:** Player makes tactical choices based on scoring, not just survival.

**Positive signals:**
- Player routes for medals even when dangerous
- Player grazes intentionally, not accidentally
- Multiplier number feels satisfying to see increase
- Score popups generate small dopamine hits

**Negative signals:**
- Player ignores score entirely (survival-only mindset)
- Scoring systems feel disconnected from gameplay
- Multiplier doesn't create tension
- "Score doesn't matter"

**Failure modes:**
- Safe play dominates scoring (no reason to take risks)
- Score feedback invisible (no popups, no HUD indicators)
- Multiplier decay undermines aggressive play
- Scoring rewards emphasize grinding over mastery

**GOOD example:** ×2.50 multiplier glow + chain tier popup + FEVER activation — multiple layers of score feedback
**BAD example:** Score only visible at game over — no moment-to-moment engagement

**Detectable symptoms:**
- Player cannot recall their score after a run
- Player doesn't know what multiplier they had
- Scoring strategies are not discussed/optimized

---

### 2.8 MEMORABILITY

**Definition:** How distinctly a level, boss, or moment stays with the player after the session.

**Goal:** Player can describe specific moments days later.

**Positive signals:**
- "Remember the KAMIKAZE RUSH at level 12?"
- Player has a favorite level and can explain why
- Set pieces are recalled by name
- Bosses have distinct personalities beyond sprite

**Negative signals:**
- Can't distinguish level 6 from level 8
- "All levels feel the same"
- Boss is remembered by "the blue one" not by name/mechanic

**Failure modes:**
- Interchangeable wave compositions
- Repetitive formations (4-cycle without variation)
- Bosses that share attack patterns
- No visual/thematic progression between levels

**GOOD example:** PINCER ASSAULT — first formation change, symmetric attack, alien3 anchor — unforgettable
**BAD example:** Levels 8 and 9 — both normal waves between set pieces, indistinguishable in memory

**Detectable symptoms:**
- Player can only name 2-3 levels out of 20
- After a run, player can't recall which level had which set piece
- Bosses are described by color, not mechanic

---

### 2.9 FLOW

**Definition:** The psychological state of complete immersion where time disappears and the player acts without conscious deliberation.

**Goal:** Player enters flow state during gameplay and loses track of time.

**Positive signals:**
- "I didn't realize 30 minutes passed"
- Player stops checking HUD / score during intense sections
- Automatic dodging — player reacts without thinking

**Negative signals:**
- Player checks clock frequently
- Player gets distracted by UI elements
- Deaths break immersion for > 10 seconds

**Failure modes:**
- HUD overload breaks attention
- Pacing interruptions (cinematics, forced pauses)
- Inconsistent difficulty causing constant readjustment
- Game over screen too jarring

**GOOD example:** Wave 12 KAMIKAZE RUSH — high speed, clear patterns, player enters pure dodge-shoot rhythm
**BAD example:** Level transition pauses too long, immersion breaks, player checks phone

**Detectable symptoms:**
- Player looks away from screen between waves
- Session length is dictated by external factors, not engagement
- "Let me just finish this wave" never happens

---

### 2.10 GREED TENSION

**Definition:** The internal conflict between safety and scoring. "Should I go for that medal or stay safe?"

**Goal:** Player feels the pull of scoring opportunities but can resist when necessary.

**Positive signals:**
- Player visibly hesitates before a medal pickup
- Player celebrates a risky medal grab
- Player adjusts route to maximize medal chain

**Negative signals:**
- Medals are always collected safely (no tension)
- Medals are never collected (ignored system)
- Greed always results in death (punitive, not tempting)

**Failure modes:**
- Medals too easy to collect (no decision)
- Medals too punishing to miss (incentivizes over-cautious play)
- No FEVER or chain bonus (no greed incentive)
- Medal magnet radius too generous (removes routing decisions)

**GOOD example:** Medal chain at tier 4 (2000 value), FEVER about to activate, 3 medals on screen near bullet stream — player must choose
**BAD example:** Magnet radius 60px collects all medals automatically — no routing decision

**Detectable symptoms:**
- Player never skips a medal (too safe/easy)
- Player never goes for a medal (too dangerous)
- Player doesn't know medal chain tier exists

---

### 2.11 CLARITY UNDER STRESS

**Definition:** The player's ability to continue parsing threats and making decisions as density increases.

**Goal:** Even at maximum bullet count, the player can see threats, plan movement, and execute.

**Positive signals:**
- Player maintains aimed movement (not random dodging)
- Player continues shooting during dense patterns
- Player can distinguish bullet types at high density

**Negative signals:**
- Player stops shooting (overwhelmed)
- Panic dodging (random rapid movement)
- Player can't track which bullets are closest/most dangerous

**Failure modes:**
- Bullet density exceeds readability floor
- Bullet trails overlap creating solid walls
- Popup/particle flood masks threats
- Boss patterns overlap with enemy bullets

**GOOD example:** Level 17 survival corridor with HC-RD clarity — bullets have outlines, alpha floors, trails, distinguishable by type
**BAD example:** Dense wave without bullet outlines, all bullets same color, player sees "wall of color" not individual threats

**Detectable symptoms:**
- Player movement becomes random/erratic
- "I can't see anything"
- Player stops shooting at high density

---

### 2.12 FRUSTRATION

**Definition:** Negative emotional response to gameplay. Must be distinguished from legitimate difficulty.

**Goal:** Player frustration comes from their own mistakes, not from the game being unfair or unclear.

**Positive frustration (healthy):**
- "I messed up that dodge, I know what to do next time"
- Player immediately retries after death

**Negative frustration (unhealthy):**
- "This is impossible"
- "That was cheap"
- Player puts down the game after a death
- Blaming "bad design" not personal error

**Failure modes:**
- Unreadable deaths (frustration at game, not self)
- Punishment too harsh (multiplier full reset)
- No clarity on what went wrong
- Identical death repeated without learning opportunity

**GOOD example:** Death to SERPENTRIX trap — player sees green rings, knows they were warned, accepts fault
**BAD example:** Death to offscreen bullet with no telegraph — player blames game, feels cheated

**Detectable symptoms:**
- Player blames game, not self
- Death → quit, not death → retry
- Identical deaths within same section
- Score: "This game is unfair" vs "I need to get better"

---

## 3. Cross-Category Interactions

| Interaction | Mechanism | Risk |
|------------|-----------|------|
| **pressure ⚡ readability** | High density reduces visual clarity | HIGH — if pressure exceeds readability ceiling, player enters panic |
| **greed ⚡ fairness** | Scoring temptation must not lead to unfair deaths | MEDIUM — medal positions must be dodgeable |
| **fatigue ⚡ pacing** | Poor pacing causes fatigue; fatigue worsens pacing perception | HIGH — positive feedback loop |
| **score ⚡ recovery** | Multiplier penalty on death affects recovery satisfaction | MEDIUM — penalty must be felt but not crushing |
| **panic ⚡ clarity** | Panic reduces parsing ability; reduced clarity increases panic | HIGH — death spiral |
| **memorability ⚡ flow** | Memorable moments create flow anchors; flow state creates memories | POSITIVE — mutually reinforcing |
| **frustration ⚡ fairness** | Unfair deaths generate frustration; frustration colors fairness perception | HIGH — one unfair death poisons perception of whole level |
| **pressure ⚡ greed** | High pressure discourages greed; high greed increases pressure | BALANCED — natural tension |

### How One Category Can Degrade Another

```
poor readability → unfair-feeling deaths → frustration → "game is broken" perception
missing relief → sustained pressure → fatigue → player quits session early
weak score feedback → no greed tension → safe play only → memorability drops
punitive multiplier reset → recovery despair → run abandonment → "one more run" dies
```

---

## 4. Severity Interpretation

### 4.1 Classification Guide

| Label | Criteria | Action |
|-------|----------|--------|
| **CRITICAL** | Game-breaking. Crashes, softlocks, unplayable states. | Reopen freeze, fix immediately. |
| **HIGH** | Unfair or unreadable. Deaths feel random. Threats invisible. | Reopen freeze, apply minimal fix. |
| **MEDIUM** | Emotional pacing broken. Relief feels fake. Overload constant. | Tune SAFE params with justification. |
| **LOW** | Cosmetic. Display clarity. Popup density. | Tune or defer. |
| **OBSERVATION** | Noted. No action. Documented for future. | No action. |

### 4.2 How to Distinguish "Hard" from "Broken"

| "Hard" (GOOD) | "Broken" (BAD) |
|---------------|----------------|
| Player can identify what went wrong | Player has no idea why they died |
| Pattern is learnable with practice | Pattern has no consistent solution |
| Death teaches something | Death teaches nothing |
| Player restarts immediately | Player quits |
| "I need to git gud" | "This is unfair" |

### 4.3 "Good Panic" vs "Unreadable Chaos"

| Good Panic | Unreadable Chaos |
|------------|-----------------|
| Heart rate up but still parsing | Vision blurred, no threat tracking |
| Fast decisions, some wrong | No decisions, random movement |
| Survived but nearly died | Didn't survive |
| "That was intense!" | "What just happened?" |
| Recovers after section ends | Traumatized, plays passively afterwards |

---

## 5. Emotional Interpretation Layer

| Category | Emotion triggered (healthy) | Emotion triggered (broken) |
|----------|---------------------------|--------------------------|
| fairness | Determination, confidence | Frustration, helplessness |
| readability | Control, clarity | Confusion, blindness |
| pressure | Alertness, engagement | Panic, paralysis |
| fatigue | Satisfied exhaustion | Burnout, resentment |
| emotional_pacing | Anticipation, release | Flatness, boredom |
| recovery_satisfaction | Hope, resilience | Despair, resignation |
| score_engagement | Greed, satisfaction | Indifference |
| memorability | Nostalgia, attachment | Amnesia, interchangeability |
| flow | Immersion, time-loss | Distraction, clock-watching |
| greed_tension | Temptation, thrill | Apathy, avoidance |
| clarity_under_stress | Mastery, control | Chaos, helplessness |
| frustration | Motivation to improve | Desire to quit |

---

## 6. Audit Usage Rules

### How to Use This Taxonomy

1. **During playtest:** Note emotional response per section. Don't analyze yet.
2. **After session:** Map each observation to a taxonomy category.
3. **Assign severity:** Use classification guide. Justify with evidence.
4. **Identify cross-category effects:** Does a readability issue cause a fairness perception?
5. **Propose action:** Tune SAFE param, defer, or escalate to freeze reopen.

### How to Avoid Ambiguous Feedback

| Ambiguous | Specific |
|-----------|----------|
| "This level is bad" | "Level 6 has no memorable moments, feels interchangeable with level 8, pacing curve is flat" |
| "Too hard" | "Bullets at rank 5 are unreadable at level 20 density — clarity_under_stress failure" |
| "Boring" | "Relief section is empty screen for 12s with no activity — fatigue trigger, not recovery" |

### Separating Preference from Issue

| Preference | Issue |
|-----------|-------|
| "I don't like fast bullets" | "Bullets exceed readability ceiling" |
| "I prefer slow pacing" | "Tension curve is flat for 30s, no relief" |
| "Grazing is not fun" | "Graze score is too low to incentivize risk" |

**Rule:** An issue exists when the DESIGN GOAL is not met, not when personal taste differs.

---

## 7. Hardcore Calibration Notes

### Cave/Garegga/DOJ Philosophy Applied

| Philosophy | Galaxy Raiders implementation |
|-----------|------------------------------|
| **Readable density** (Cave) | HC-RD bullet outlines, alpha floors, PRIORITY layers |
| **Rank volatility** (Garegga) | HC-RK dynamic rank, +8 sources, decay, recovery protection |
| **Boss mastery** (DOJ) | HC-BD signature hooks, HC-SC phase efficiency, anti-milk |
| **Score temptation** (all) | HC-SC multiplier, medal chains, aggression bonuses, graze economy |
| **Recovery psychology** (all) | HC-SC recovery bonus, HC-RK governor, partial penalties (never full reset) |
| **Replay motivation** (all) | Grade system, high scores, medal chains, "one more run" feedback loop |

---

## 8. Evaluation Examples

### GOOD Hardcore Feel

| Example | Categories satisfied |
|---------|---------------------|
| "Alta presión pero lectura clara" — Level 17 survival corridor, HC-RD outlines, player sees every bullet | readability ✅ pressure ✅ clarity_under_stress ✅ |
| "Greed opcional pero tentador" — Medal chain at tier 4 near bullet stream, player hesitates, goes for it, survives | greed_tension ✅ score_engagement ✅ recovery_satisfaction ✅ |
| "Recovery que da esperanza" — Hit during boss, multiplier drops but recovers, rank governor unblocks, comeback bonus triggers | recovery_satisfaction ✅ fairness ✅ |
| "Buildup épico antes del boss" — Level 18 IMPERIAL GUARD set piece, then prelude cleanup, then TENIENTE entry | emotional_pacing ✅ memorability ✅ |

### BAD Hardcore Feel

| Example | Categories failed |
|---------|------------------|
| "Panic sin parsing" — Dense wave, no relief, player stops shooting, random movement | clarity_under_stress ❌ pressure ❌ fatigue ❌ |
| "Fatiga acumulativa sin relief" — Levels 16→17→18→19→20 without proper breathers | fatigue ❌ emotional_pacing ❌ recovery_satisfaction ❌ |
| "Boss memorable visualmente pero emocionalmente plano" — CRABTRON looks great but fight feels identical to regular wave | memorability ❌ emotional_pacing ❌ |
| "Score invisible" — Player finishes run, has no idea what multiplier was or how medals contributed | score_engagement ❌ greed_tension ❌ |
| "Muerte injusta repetida" — Player dies 3 times to same un-telegraphed attack, quits | fairness ❌ frustration ❌ readability ❌ |
