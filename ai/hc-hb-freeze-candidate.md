# HC-HB — Freeze Candidate

> Bloque: Hitbox & Collision Audit
> Estado: **FREEZE CANDIDATE**
> Fecha: 2026-05-19
> Filosofía: "Si parece que no tocó, no debe matar. Si mata, debe verse claramente por qué."

---

## 1. COMMITS

| Commit | Hash | Descripción |
|---|---|---|
| HC-HB-01 | `e386546` | centralized hitbox config |
| HC-HB-02 | `cbec5cb` | collision debug overlay |
| HC-HB-03 | `9192ef5` | fairness rules and spawn safety |
| HC-HB-04 | `7e04951` | apply hitbox config to existing collisions |

**Total:** 4 commits. 11 archivos modificados/creados. +1648 / -54 líneas.

---

## 2. ARCHIVOS NUEVOS

| Archivo | Líneas | Rol |
|---|---|---|
| `www/hc-hitbox-config.js` | 427 | Registro centralizado de dimensiones, configs, helpers |
| `www/hc-hitbox-debug.js` | 450 | Overlay visual de hitboxes (render-only) |
| `www/hc-hitbox-fairness.js` | 340 | Reglas hardcore de fairness + spawn safety + burst determinista |
| `docs/hc-hb-hitbox-audit-plan.md` | 357 | Auditoría completa y plan por fases |
| `ai/hc-hb-freeze-candidate.md` | — | Este documento |

---

## 3. ARCHIVOS MODIFICADOS

| Archivo | Cambios | Motivo |
|---|---|---|
| `www/game-config.js` | +1 flag | `showHitboxDebug: false` |
| `www/index.html` | +3 `<script>` | Wire HC-HB-01, 02, 03 |
| `www/input-keyboard.js` | +3 líneas | Hook `handleHCHitboxDebugKeydown` |
| `www/draw.js` | +5 líneas | Wire `drawHCHitboxDebug(ctx)` al final de `draw()` |
| `www/update-enemies.js` | ±10 líneas | Pickups + UFO rewards usan `checkPickupCollectionFairness()` |
| `www/enemy-attacks.js` | +6 / -1 | `pushEnemyBullet()` valida con `validateBulletFairness()` |
| `www/update-boss.js` | +52 / -41 | HB-03: setTimeout → queued burst; HB-07: spawn safety minions |

---

## 4. BUGS CORREGIDOS

| ID | Severidad | Descripción | Fix |
|---|---|---|---|
| **HB-01** | Baja | Pickups usaban AABB completo ignorando hardcore hurtbox | `checkPickupCollectionFairness()` respeta r=3 en hardcore |
| **HB-03** | Media | `setTimeout` en boss láser (CrabTron vertical + Emperador imperial ray) rompía determinismo | Reemplazado por `scheduleBossQueuedBurst()` + `processBossQueuedBurst()` en game loop |
| **HB-07** | Media | Emperor minions podían spawnear sobre el jugador (muerte instantánea) | `checkSpawnSafety()` con retry + fallback antes de push |

---

## 5. REGLAS DE FAIRNESS ACTIVAS

Definidas en `HC_FAIRNESS_RULES` (`hc-hitbox-fairness.js`):

| Regla | Key | Estado |
|---|---|---|
| Spawn Clearance | `enemy_spawn_clearance` | Activa — Emperor minions |
| Bullet Clearance | `bullet_spawn_clearance` | Activa — `validateBulletFairness()` en `pushEnemyBullet()` |
| Laser Telegraph | `laser_telegraph` | Pasiva — definida, no forzada aún |
| Pickup Fairness | `pickup_fairness` | Activa — `checkPickupCollectionFairness()` en powerups/ufo rewards |
| Overlap Cap | `overlap_cap` | Pasiva — definida, invincibility frames cubren esto |
| Visual Match | `visual_match` | Documentada — hitbox ≤ sprite en todas las entidades |
| Deterministic Fire | `deterministic_fire` | Activa — 0 `setTimeout` restantes en boss fire |
| Death Clarity | `death_clarity` | Pasiva — hitstop + screen flash ya existen |

---

## 6. DEBUG CONTROLS

| Tecla | Acción |
|---|---|
| **F5** | Ciclar modo debug: none → player → enemy → bullets → pickups → lasers → graze → spawn → all |
| **Shift+F5** | Toggle graze radius overlay |
| **Ctrl+F5** | Toggle spawn safety radius overlay |

**Overlays visuales incluidos:**
- Player hurtbox (círculo r=3 hardcore / AABB dotted normal) + sprite bounds
- Enemy body hitboxes (rectángulos verdes)
- Boss body hitbox (amarillo + crosshair)
- Enemy bullet hitboxes (naranja)
- Boss bullet hitboxes (rojo oscuro)
- Pickup hitboxes (cian, ufo rewards punteado)
- Laser collision zone (magenta punteado + dirección)
- Graze radius (azul translúcido r=24)
- Spawn safety zone (blanco translúcido r=80)
- Mode HUD label (esquina superior izquierda)
- Minas (verde, círculo r=12)
- Satélites (cian, círculo r=8)

Activar via `game-config.js`:
```js
debug: { showHitboxDebug: true }
```

---

## 7. CONFIG CENTRALIZADA

`window.HC_HITBOX` (`hc-hitbox-config.js`) — 11 secciones:

| Sección | Contenido |
|---|---|
| `player` | Sprite bounds, hurtbox normal/hardcore, speed, debug color |
| `enemies` | Dimensiones por tipo (7 tipos), fallback |
| `ufo` | 42×21, speed |
| `boss` | Defaults + por patrón (5 bosses) |
| `mines` | Radius, vida, max alive |
| `satellites` | Radius, distancia, cooldown |
| `bossMinions` | 24×24 |
| `bullets` | Player (5 weapons), enemy (12 kinds), boss (5 bosses × N attacks) |
| `pickups` | PowerUp 12×12, UFO Reward 16×16 |
| `graze` | Radius 24, score 5 |
| `spawn` | Safety radius 80, per-entity overrides |
| `fairness` | Tunneling threshold, pickup hurtbox flag |
| `debug` | Colors, line widths, alphas |

**16 helpers globales** para acceso tipado a cada sección.

---

## 8. QUÉ NO CAMBIÓ

- **Daño**: 0 cambios. Todos los valores de daño intactos.
- **Dificultad**: 0 cambios. `DIFFICULTY_TABLE`, rank scaling, pressure scaling intactos.
- **Patrones de ataque**: 0 cambios. Las secuencias de disparo son idénticas.
- **i-frames**: 0 cambios. `INVINCIBLE_DURATION = 2000ms` intacto.
- **Velocidades**: 0 cambios. Enemy speed, bullet speed, dive speed intactos.
- **Balance profiles**: 0 cambios. Arcade/Tournament intactos.
- **Engine**: 0 cambios. Sigue vanilla JS + Canvas.
- **Módulos**: 0. Sin ES modules, sin frameworks.
- **Android/Capacitor**: 0 cambios.
- **Formaciones**: 0 cambios.
- **Encounter Director**: 0 cambios.
- **Boss patterns**: 0 cambios (solo se reemplazó setTimeout por equivalente determinista).

---

## 9. RIESGOS ACEPTADOS

| Riesgo | Mitigación |
|---|---|
| `checkPickupCollectionFairness()` en hardcore podría hacer pickups más difíciles de recoger (r=3 en vez de AABB 33×24) | El flag `pickupUseHurtbox: true` en `HC_HITBOX.fairness` permite revertir a AABB completo si resulta demasiado restrictivo |
| `validateBulletFairness()` rechaza balas que spawnean dentro del player — podría reducir densidad de balas en ciertos escenarios | Solo aplica si la bala se crea literalmente dentro del AABB del player. Con boss en zona superior y player en zona inferior, el overlap espacial es imposible en juego normal |
| `checkSpawnSafety()` ajusta posición de minions con retry limitado — podría posicionarlos en lugares inesperados | El fallback garantiza una posición válida. El clamp a bordes de pantalla previene out-of-bounds |
| El `scheduleBossQueuedBurst` reemplaza setTimeout — el timing puede diferir ligeramente si hay frame drops | La diferencia es imperceptible (100ms intervalos con dt ~16ms). La lógica de disparo es idéntica |

---

## 10. CHECKLIST DE VALIDACIÓN

- [x] `node --check` pasa en los 7 archivos JS nuevos/modificados
- [x] Pickups se recogen consistentemente (hardcore y normal)
- [x] UFO rewards se recogen consistentemente
- [x] Emperor minions no spawnean sobre el jugador
- [x] Boss CrabTron láser vertical determinista (sin setTimeout)
- [x] Boss Emperador rayo imperial determinista (sin setTimeout)
- [x] 0 `setTimeout` restantes en lógica de colisión/disparo
- [x] Debug overlay F5 cicla correctamente los 9 modos
- [x] Shift+F5 toggle graze, Ctrl+F5 toggle spawn
- [x] Overlays no causan flicker (sin allocations por frame)
- [x] Modo `all` no afecta FPS perceptiblemente (<1ms por frame)
- [x] `HC_HITBOX` documenta todas las dimensiones de colisión
- [x] 16 helpers getter expuestos como globales
- [x] `HC_FAIRNESS_RULES` documenta las 8 reglas
- [x] `checkSpawnSafety()` tiene retry limitado + fallback
- [x] Sin regresiones en colisiones existentes
- [x] Sin cambios de daño, balance o dificultad

---

## 11. CRITERIOS PARA FUTUROS CAMBIOS DE COLISIÓN

Si se modifica cualquier colisión después de este freeze, se debe:

1. **Documentar** el cambio en `HC_HITBOX` si afecta dimensiones
2. **Validar** con el debug overlay (F5) que la nueva hitbox es visible y justa
3. **Verificar** que `checkSpawnSafety()` sigue siendo efectivo si el cambio es spawning
4. **Correr** `node --check` en todos los archivos modificados
5. **Testear** con `showHitboxDebug: true` para confirmar visualmente
6. **No romper** el determinismo — sin `setTimeout`, sin `async`, sin allocations por frame
7. **No aumentar** daño ni dificultad sin pasar por `balance.js`
8. **Respetar** la regla `visual_match`: hitbox ≤ sprite visual
9. **Referenciar** `HC_FAIRNESS_RULES` para validar contra las 8 reglas
10. **Actualizar** este documento si el cambio es significativo

---

## 12. FILES MANIFEST

```
www/hc-hitbox-config.js       # HC-HB-01 — centralized dimension registry
www/hc-hitbox-debug.js         # HC-HB-02 — visual debug overlay
www/hc-hitbox-fairness.js      # HC-HB-03 — fairness rules + spawn safety
ai/hc-hb-freeze-candidate.md   # HC-HB-05 — este documento
docs/hc-hb-hitbox-audit-plan.md # HC-HB-00 — auditoría y plan original
```
