<!--
Sync Impact Report
Version change: N/A -> 1.0.0
Modified principles:
- Template placeholders -> I. Mobile-First Arcade Feel
- Template placeholders -> II. Gameplay Source of Truth
- Template placeholders -> III. Performance Is Gameplay
- Template placeholders -> IV. Assets Serve Clarity
- Template placeholders -> V. Quality Gates Before Release
Added sections:
- Platform & Runtime Constraints
- Development Workflow
Removed sections:
- None
Templates requiring updates:
- UPDATED .specify/templates/plan-template.md
- UPDATED .specify/templates/spec-template.md
- UPDATED .specify/templates/tasks-template.md
- UPDATED AGENTS.md
Follow-up TODOs:
- None
-->
# Galaxy Raiders Constitution

## Core Principles

### I. Mobile-First Arcade Feel
Galaxy Raiders MUST feel immediate, readable, and responsive on mobile before
desktop polish is considered complete. Core movement, shooting, pause, mute,
fullscreen, start, game over, victory, and restart flows MUST work with touch and
keyboard. Any gameplay change MUST preserve fast arcade pacing, clear player
feedback, and short recovery time after failure.

Rationale: the game is distributed through Android/Google Play via Capacitor,
so mobile playability is not an afterthought.

### II. Gameplay Source of Truth
Editable gameplay code, screens, state, and assets MUST live under `www/` unless
a feature explicitly requires Capacitor or native Android changes. Generated
Android assets under `android/app/src/main/assets/public/` MUST NOT be edited by
hand. The archived `legacy-root-v1/` tree is historical reference only.

Rationale: a single source of truth prevents browser and Android builds from
drifting apart.

### III. Performance Is Gameplay
Every feature that affects the play loop MUST define performance expectations
before implementation. The default target is stable 60 FPS on typical Android
devices, with no avoidable work in the frame loop, no blocking network dependency
during play, and no asset loading pattern that causes visible stalls after a run
has started.

Rationale: frame drops, input lag, and stalled audio/asset loading are player
experience bugs in an arcade game.

### IV. Assets Serve Clarity
Visual, audio, and generated assets MUST improve gameplay readability or player
feedback. Asset additions MUST use stable paths, reasonable file sizes, and clear
ownership. UI text and controls MUST remain legible on small screens, and effects
MUST NOT obscure bullets, enemies, the player ship, boss attacks, score, lives,
or critical state.

Rationale: spectacle is useful only when it makes the game easier to understand
or more satisfying to play.

### V. Quality Gates Before Release
Any change intended for release MUST pass the project validation command and a
manual smoke test of the primary gameplay loop. Android release work MUST run
Capacitor sync before opening, debugging, or bundling Android. Google Play
releases MUST preserve `applicationId` and use a strictly increasing
`versionCode`.

Rationale: the project has browser and Android surfaces, so release confidence
requires both automated checks and hands-on gameplay verification.

## Platform & Runtime Constraints

The project is a web game packaged with Capacitor for Android. The editable game
runtime is `www/`; Capacitor consumes that folder through `webDir`. Android
changes are limited to platform integration, permissions, signing, versioning,
and Capacitor configuration.

The expected local commands are:

- `npm run serve` for browser playtesting.
- `npm run validate` for project validation.
- `npm run cap:sync` before Android builds or native inspection.
- `npm run android:debug` for debug builds.
- `npm run android:bundle` for Google Play release bundles.

Firebase, networked score features, AI helpers, or any remote dependency MUST
degrade gracefully when offline or unavailable and MUST NOT block the player from
starting or completing a local run.

## Development Workflow

Feature work MUST begin with a spec that defines player-facing behavior,
acceptance scenarios, mobile controls, edge cases, and measurable success
criteria. Plans MUST identify touched `www/`, `android/`, `docs/`, and asset
paths before implementation. Tasks MUST be small enough to validate independently
and MUST include browser and Android validation steps when the feature can affect
both surfaces.

Commits SHOULD group one coherent behavior change or documentation update at a
time. Generated files and build outputs SHOULD remain out of commits unless the
repository already treats them as source. Existing user edits MUST be preserved
and worked with, not overwritten.

## Governance

This constitution supersedes ad hoc project habits and applies to specs, plans,
tasks, implementation, reviews, and release preparation. Amendments require a
documented reason, an updated Sync Impact Report, and review of dependent
templates. Versioning follows semantic rules: MAJOR for incompatible governance
or principle redefinitions, MINOR for new principles or materially expanded
sections, and PATCH for wording or clarification only.

Every feature plan MUST include a Constitution Check. Any violation MUST be
listed with the reason, the simpler rejected alternative, and the validation work
that will reduce risk. Release candidates MUST be reviewed against the manual
checklist in the repository README and the commands listed in Platform & Runtime
Constraints.

**Version**: 1.0.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-10
