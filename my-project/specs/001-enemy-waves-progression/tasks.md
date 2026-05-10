# Tasks: Enemy Waves Progression

**Input**: Design documents from `/specs/001-enemy-waves-progression/`
**Prerequisites**: plan.md, spec.md

**Tests**: Manual smoke test only (no automated test framework in project).

**Organization**: Tasks grouped by user story. Each story independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing infrastructure and baseline validation

- [ ] T001 Verify `npm run validate` passes on current codebase before any changes
- [ ] T002 [P] Confirm touched paths respect `www/` as the gameplay source of truth

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state and rendering infrastructure for all wave announcements

- [ ] T003 [P] Add wave announcement state variables in `www/game.js` (waveAnnounceText, waveAnnounceTimer, waveAnnouncePhase, waveRewardText, waveRewardTimer, milestoneRewardsGranted)
- [ ] T004 [P] Add recovery reward helper functions in `www/progression.js` (awardWaveCompletionBonus, grantMilestoneRecovery, getWaveRewardForLevel)
- [ ] T005 Add wave announcement rendering in `www/draw.js` (drawWaveAnnouncement function called during state === 'playing')

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Survive Progressive Enemy Waves (Priority: P1)

**Goal**: Each wave transition displays the wave number clearly before enemies spawn

**Independent Test**: Start a run, defeat all enemies in wave 1. Verify "WAVE 2" text appears during the warp transition before wave 2 enemies appear.

### Implementation for User Story 1

- [ ] T006 [US1] Modify wave transition in `www/update.js` to set waveAnnounceText and waveAnnounceTimer when pendingNextLevel triggers
- [ ] T007 [US1] Ensure wave announcement clears when startLevel() is called in `www/entities.js`
- [ ] T008 [US1] Verify FR-003: wave advances to next numbered wave after all enemies defeated (already works, verify)
- [ ] T009 [US1] Verify FR-005: difficulty increases over time (already works via DIFFICULTY_TABLE, verify)

**Checkpoint**: Wave number display visible during every level transition

---

## Phase 4: User Story 2 - Recognize Wave Milestones (Priority: P2)

**Goal**: Boss levels and set-piece levels are clearly announced with distinct text

**Independent Test**: Advance to wave 5 and verify "BOSS INCOMING" or similar text appears before or during the boss spawn.

### Implementation for User Story 2

- [ ] T010 [US2] Add milestone announcement text in `www/update.js` when next level is a boss level (BOSS_LEVELS check)
- [ ] T011 [US2] Add milestone announcement for set-piece levels (3, 7, 12, 16, 18) reusing setPieceBannerText
- [ ] T012 [US2] Render milestone warnings with distinct color/glow in `www/draw.js`
- [ ] T013 [US2] Verify FR-008: milestone waves are identifiable before/as they begin

**Checkpoint**: Boss and set-piece milestones clearly announced to player

---

## Phase 5: User Story 3 - Earn Timely Recovery Opportunities (Priority: P3)

**Goal**: Players receive score bonuses and occasional life recovery after completing waves

**Independent Test**: Complete wave 5 (boss), verify a recovery reward message appears (score bonus or life recovery).

### Implementation for User Story 3

- [ ] T014 [US3] Implement wave completion score bonus in `www/progression.js` (awardWaveCompletionBonus)
- [ ] T015 [US3] Implement life recovery at milestone waves (every 5 waves) in `www/progression.js`
- [ ] T016 [US3] Trigger recovery rewards during warp transition in `www/update.js`
- [ ] T017 [US3] Show reward text during transition in `www/draw.js`

**Checkpoint**: Recovery rewards granted at wave completion milestones

---

## Phase 6: Edge Cases & Polish

**Purpose**: Handle edge cases from spec and ensure robustness

- [ ] T018 Handle player pause during wave transition (announcement timer should freeze during pause)
- [ ] T019 Handle bullets on screen during transition (already cleared in startLevel, verify)
- [ ] T020 Handle simultaneous player death and last enemy kill (safeEndGame already guard with isEnding flag)
- [ ] T021 Handle restart before wave transition completes (resetProgressionState clears pendingNextLevel)
- [ ] T022 Verify FR-012: new run always starts at wave 1 (startNewGameRun sets level=1)

---

## Phase 7: Validation & Release

**Purpose**: Quality gates per Constitution Principle V

- [ ] T023 Run `npm run validate` and fix any syntax errors
- [ ] T024 Run browser smoke test: start game, reach wave 5, verify wave numbers and milestone
- [ ] T025 Test with mobile-sized viewport to verify touch controls during transitions
- [ ] T026 Test offline: disable network, verify wave progression continues
- [ ] T027 Run `npm run cap:sync` before Android verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational (can run in parallel with US1)
- **User Story 3 (Phase 5)**: Depends on Foundational (can run in parallel with US1, US2)
- **Edge Cases (Phase 6)**: Depends on all user stories
- **Validation (Phase 7)**: Depends on Edge Cases completion

### Parallel Opportunities

- T001, T002 can run in parallel
- T003, T004 can run in parallel (different files)
- US1, US2, US3 can start in parallel after Foundational phase
- T023-T027 run sequentially after implementation

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1-2 (Setup + Foundational)
2. Complete Phase 3 (US1): Wave number display
3. **STOP and VALIDATE**: Verify wave numbers show during transitions
4. If viable, continue to US2 and US3

### Incremental Delivery

1. US1: Wave numbers visible → value delivered
2. US2: Milestone announcements → prestige feel added
3. US3: Recovery rewards → better pacing for longer runs
