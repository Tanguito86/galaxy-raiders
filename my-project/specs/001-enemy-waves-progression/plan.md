# Implementation Plan: Enemy Waves Progression

**Branch**: `001-enemy-waves-progression` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-enemy-waves-progression/spec.md`

## Summary

Enhance the existing level/wave system in Galaxy Raiders with explicit wave number
display during transitions, milestone wave announcements for boss and set-piece
levels, and recovery rewards between waves. The codebase already has level
progression (1-20), boss levels (5, 10, 15, 19, 20), set-piece formations (3, 7,
12, 16, 18), difficulty scaling via `DIFFICULTY_TABLE`, and run stat tracking.
This implementation adds the missing communication layer and recovery pacing.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES5+) running in browser / Capacitor WebView
**Primary Dependencies**: None beyond browser APIs (Canvas 2D, localStorage, requestAnimationFrame)
**Storage**: localStorage for high scores, run telemetry, balance profile
**Testing**: `npm run validate` (Node syntax check on all `www/*.js`), manual browser smoke test
**Target Platform**: Web (mobile-first) + Capacitor Android
**Project Type**: Web game packaged with Capacitor
**Performance Goals**: 60 FPS stable, no frame-loop overhead from new additions
**Constraints**: Offline-capable, mobile touch + keyboard, <100ms transition display
**Scale/Scope**: 20 waves/levels, 5 boss milestones, 5 set-piece milestones

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Mobile-first arcade feel**: Wave announcements use centered, large text with
  glow effects legible on small screens. Transitions are fast (<2s) and don't
  block controls. Touch pause/mute/fullscreen remain functional during transitions.
- **Gameplay source of truth**: All changes are within `www/`. No `android/` or
  asset changes needed. The warp transition and level system already live in `www/`.
- **Performance is gameplay**: Wave announcements render as simple text overlays
  with canvas draw calls (no DOM manipulation during gameplay). Recovery rewards
  use existing power-up/life systems with zero new allocation per frame.
  No network dependency during wave progression.
- **Assets serve clarity**: No new visual/audio assets. Wave text uses existing
  font ("Press Start 2P") and glow helpers (`drawGlowText`). Milestone warnings
  reuse existing `setPieceBannerText` pattern. Rewards are distinguishable
  score popups.
- **Quality gates before release**: `npm run validate` checks JS syntax.
  Manual smoke test verifies wave 1→5 progression, milestone recognition,
  touch control responsiveness. `npm run cap:sync` before Android verification.

## Project Structure

### Documentation (this feature)

```text
specs/001-enemy-waves-progression/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
www/
├── game.js              # State variables for wave announcements & rewards
├── update.js            # Wave transition logic (announcements, milestones, rewards)
├── draw.js              # Wave announcement rendering (HUD overlay text)
├── progression.js       # Recovery reward functions (life/score/weapon bonuses)
├── state.js             # Existing: ENEMY_TYPES, getDifficultySettings, DIFFICULTY_TABLE
├── entities.js          # Existing: startLevel, initEnemies, initBoss, formations
├── flow.js              # Existing: endGame, safeEndGame
├── reset.js             # Existing: startNewGameRun, resetProgressionState
├── balance.js           # Existing: DIFFICULTY_TABLE, powerup balance
└── config.js            # Existing: EXTRA_LIFE_SCORES, MAX_LIVES
```

**Structure Decision**: All gameplay code lives in `www/` per Constitution Principle II.
No new files needed. Changes are limited to the files listed above.

## Complexity Tracking

No Constitution Check violations. All changes respect existing architecture:
- Wave announcements reuse the existing `pendingNextLevel`/`levelClearTimer` warp path
- Milestone detection reuses `BOSS_LEVELS` array and `getSetPieceForLevel()`
- Recovery rewards extend `awardExtraLife()` and `addScore()` already in `progression.js`
- Rendering inserts into the existing `draw()` function where HUD and banner text already render
