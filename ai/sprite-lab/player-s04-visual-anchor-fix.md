# Player S04 Visual Anchor Fix

## Screenshot Issue

Runtime validation showed the S04 Wedge sprite drawn to the side of the player shield. The shield was centered on the correct player gameplay position, while the S04 visual appeared offset from that true center.

## Root Cause

`drawS04WedgePlayer` passed a manually adjusted top-left position into `drawSpriteFrame` and forced `anchorX: 0`, `anchorY: 0`.

Before:

```js
dx = player.x - 47
dy = player.y - 52
anchorX = 0
anchorY = 0
```

That made the 128x128 S04 frame draw relative to a top-left coordinate while the shield and hitbox use the player center.

## Anchor Math After

S04 now uses the same center point as the shield and hitbox:

```js
playerCenterX = player.x + player.width / 2
playerCenterY = player.y + player.height / 2
```

The sprite anchor comes from metadata pivot when available. If no pivot exists, it falls back to the frame center:

```js
pivotX = frameWidth / 2
pivotY = frameHeight / 2
anchorX = pivotX / frameWidth
anchorY = pivotY / frameHeight
```

For the current 128x128 S04 frame, the fallback center anchor is `0.5, 0.5`.

## Files Touched

- `www/draw.js`
- `ai/sprite-lab/player-s04-visual-anchor-fix.md`

## Gameplay Scope

No gameplay position, hitbox, collision, shield logic, movement, player state, rank, balance, or input code was changed. This is a visual draw anchor fix only.
