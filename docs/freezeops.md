# FreezeOps @ Galaxy Raiders

Galaxy Raiders uses [FreezeOps](https://github.com/Tanguito86/freezeops)
to protect gameplay, audio DSP, and scoring from accidental changes —
especially those made by AI coding tools.

---

## Why FreezeOps?

Galaxy Raiders is a Canvas2D shoot-em-up with 70+ JavaScript files
and a frozen runtime. The CLAUDE.md explicitly forbids modifying:

- **Hitboxes** — `www/collisions.js`
- **Difficulty** — `www/balance.js`, `www/game-config.js`
- **Patterns** — `www/boss-patterns.js`, `www/enemy-pattern-hooks.js`
- **Score/Rank** — `www/hardcore-rank.js`, `www/hardcore-combo.js`
- **Bosses** — `www/boss-ai-movement.js`, `www/update-boss.js`

Plus the **audio DSP runtime** (`www/audio-engine.js`, `www/audio-bus.js`)
is frozen under an MCP-SB-FREEZE directive — no changes to audio
processing without explicit approval.

AI coding tools don't read CLAUDE.md. FreezeOps does — and enforces
it deterministically on every PR.

---

## Protected Zones

| Zone | Files | Why frozen |
|---|---|---|
| Core gameplay | `game-loop.js`, `collisions.js`, `update.js`, `combat.js`, `entities.js` | Frame timing, hitboxes, combat math |
| Balance | `balance.js`, `game-config.js` | Difficulty tuning |
| Bosses | `boss-patterns.js`, `boss-ai-movement.js`, `update-boss.js`, `enemy-pattern-hooks.js` | Attack sequences, movement |
| Scoring | `hardcore-rank.js`, `hardcore-combo.js` | Rank/score integrity |
| Audio DSP | `audio-engine.js`, `audio-bus.js` | Web Audio API engine |

**Safe to edit:** UI (`menus.js`, `ui.js`, `options.js`), input,
parallax backgrounds, visual assets, styles.

---

## Running Locally

```bash
# Clone FreezeOps
git clone https://github.com/Tanguito86/freezeops.git /tmp/freezeops
cd /tmp/freezeops
npm install && npm run build

# Run against Galaxy Raiders
cd /path/to/galaxy-raiders
node /tmp/freezeops/packages/cli/dist/index.js check --config freezeops.yml
```

**Expected:** `FreezeOps check PASS` on a clean working tree.

---

## What Happens on a PR

1. Developer (or AI tool) opens a PR
2. FreezeOps runs in CI:
   - Checks changed files against protected paths
   - Scans added lines for forbidden patterns (`setInterval`, `Math.random(`, `TODO_THROWAWAY`)
   - Verifies diff size is under 200 lines
3. If any violation → PR blocked with inline annotations
4. If clean → passes silently

---

## Philosophy

> "Render-only changes. No gameplay drift."

Galaxy Raiders is a finished game. The only changes allowed are
visual, UI, and tooling. FreezeOps makes this policy machine-enforceable
instead of relying on CLAUDE.md comments that AI tools ignore.
