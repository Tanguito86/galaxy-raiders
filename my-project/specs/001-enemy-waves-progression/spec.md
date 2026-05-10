# Feature Specification: Enemy Waves Progression

**Feature Branch**: `001-enemy-waves-progression`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "Sistema de progresion por oleadas enemigas para Galaxy Raiders."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Survive Progressive Enemy Waves (Priority: P1)

As a player, I want each run to advance through increasingly challenging enemy
waves so that gameplay feels structured, escalating, and rewarding instead of
random or flat.

**Why this priority**: Wave progression is the core loop that gives the run a
clear sense of momentum and challenge.

**Independent Test**: Start a new run and play through the first several waves;
the player should see each wave complete, the next wave begin, and challenge
increase without needing any other new feature.

**Acceptance Scenarios**:

1. **Given** a new run has started, **When** all enemies in the current wave are
   defeated, **Then** the next wave begins after a brief readable transition.
2. **Given** the player reaches later waves, **When** a new wave starts, **Then**
   enemy count, movement, attack pressure, or composition increases in a
   noticeable but playable way.
3. **Given** the player loses all lives during a wave, **When** the run ends,
   **Then** the game shows the final wave reached and returns cleanly to the
   restart flow.

---

### User Story 2 - Recognize Wave Milestones (Priority: P2)

As a player, I want special milestone waves to feel distinct so that progress
through the run has memorable peaks.

**Why this priority**: Milestones make progression more satisfying and help the
player understand long-term run structure.

**Independent Test**: Advance to a milestone wave and verify that it is clearly
announced, visually distinct, and resolved before normal wave progression
continues.

**Acceptance Scenarios**:

1. **Given** the player reaches a configured milestone, **When** the milestone
   wave begins, **Then** the game communicates that the wave is special before
   enemies become dangerous.
2. **Given** a milestone wave is completed, **When** progression continues,
   **Then** the next regular wave resumes with difficulty appropriate to the
   player's current progress.

---

### User Story 3 - Earn Timely Recovery Opportunities (Priority: P3)

As a player, I want occasional rewards or recovery opportunities between or
during waves so that difficult runs feel fair without removing tension.

**Why this priority**: Recovery pacing supports longer sessions and gives the
player a reason to keep pushing after difficult waves.

**Independent Test**: Complete enough waves to trigger reward opportunities and
verify that rewards appear at readable moments without blocking combat or
obscuring hazards.

**Acceptance Scenarios**:

1. **Given** the player completes a demanding wave, **When** a reward opportunity
   is due, **Then** the game presents it in a way that is visible and safe to
   understand.
2. **Given** a reward appears during active combat, **When** enemies, bullets,
   and effects are also present, **Then** the reward remains distinguishable
   without hiding threats.

### Edge Cases

- The player defeats the last enemy while enemy bullets or hazards are still on
  screen.
- The player dies at the same moment the final enemy of a wave is defeated.
- The player pauses, mutes, or exits fullscreen during a wave transition.
- The player is on a small Android screen with touch controls active.
- A reward or milestone is due while the game is offline or score services are
  unavailable.
- Audio or image assets are delayed or unavailable when a new wave starts.
- The player restarts immediately after game over before the next wave state is
  fully visible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST organize enemies into numbered waves during a run.
- **FR-002**: The game MUST start wave 1 when a new run begins.
- **FR-003**: The game MUST advance to the next numbered wave after all required
  enemies in the current wave are defeated.
- **FR-004**: Each wave transition MUST communicate the new wave number clearly
  without interrupting basic player control longer than necessary.
- **FR-005**: Wave difficulty MUST increase over time through enemy count,
  enemy mix, movement pressure, attack pressure, or another player-visible
  challenge factor.
- **FR-006**: The progression curve MUST avoid sudden unavoidable difficulty
  spikes during the first three waves.
- **FR-007**: The game MUST support distinct milestone waves at predictable
  intervals.
- **FR-008**: Milestone waves MUST be identifiable to the player before or as
  they begin.
- **FR-009**: The game MUST continue local wave progression when networked
  score or remote services are unavailable.
- **FR-010**: The game MUST preserve responsive keyboard and touch controls
  during active waves and transitions.
- **FR-011**: The game MUST keep rewards, enemies, bullets, player state, score,
  lives, wave number, and critical warnings visually distinguishable on small
  screens.
- **FR-012**: The game MUST reset wave progression cleanly when the player starts
  a new run after victory or game over.
- **FR-013**: The game MUST record the highest wave reached for the completed
  run summary.
- **FR-014**: If a wave cannot load its intended assets, the game MUST continue
  with a readable fallback presentation.

### Key Entities *(include if feature involves data)*

- **Wave**: A numbered stage of a run with a defined enemy composition,
  difficulty level, reward timing, and completion condition.
- **Enemy Group**: A set of enemies that appears as part of a wave and shares
  timing or behavior expectations.
- **Difficulty Profile**: The intended pacing curve that determines how pressure
  changes as wave numbers increase.
- **Milestone Wave**: A special wave that marks progress and may include a boss,
  unusual formation, or heightened reward.
- **Reward Opportunity**: A power-up, recovery chance, or other benefit offered
  at a controlled moment in the wave progression.
- **Run Progress**: The player's current wave, highest wave reached, run state,
  and completion outcome.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A player can start a run and reach wave 5 within 5 minutes during
  normal play without encountering a stalled transition.
- **SC-002**: 100% of completed wave transitions display the correct next wave
  number before new enemy pressure begins.
- **SC-003**: The first three waves can be completed by an experienced tester in
  at least 8 of 10 attempts without losing all lives.
- **SC-004**: At least one milestone wave is reached and clearly recognized by
  the player by wave 5.
- **SC-005**: During mobile-sized manual testing, touch controls remain
  responsive throughout active waves and transitions.
- **SC-006**: The game remains playable through at least 10 waves when networked
  score or remote services are unavailable.
- **SC-007**: After game over or victory, starting a new run always begins again
  at wave 1.

## Assumptions

- The first implementation focuses on the local single-player run loop.
- Milestone waves default to every fifth wave unless a later design chooses a
  different cadence.
- Rewards are optional per wave but should appear often enough to support longer
  runs.
- Existing start, pause, mute, fullscreen, score, lives, victory, and game-over
  flows remain part of the experience.
- Browser and Android builds are both target surfaces for validation.
