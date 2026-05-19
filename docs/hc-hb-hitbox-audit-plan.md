# HC-HB — Hitbox & Collision Audit Plan

> Freeze Target: todas las colisiones documentadas, auditadas y con debug tooling completo.
> Principio: "Si parece que no tocó, no debe matar. Si mata, debe verse claramente por qué."

---

## 0. AUDITORÍA COMPLETA DEL ESTADO ACTUAL

### 0.1 Dimensiones de Entidades

| Entidad | Sprite (px) | Hitbox real (w × h) | Centro | Nota |
|---|---|---|---|---|
| Player | 11×8 ×3 = 33×24 | AABB: 33×24 / Hardcore: círculo r=3 | centro=(x+16.5, y+12) | `factories.js:7-8` |
| UFO | 14×6 ×3 = 42×18 | AABB: 42×21 | — | `factories.js:27-28` |
| Boss default | — | AABB: 90×45 | — | `factories.js:40-41` |
| alien1 | 8×8 ×3 = 24×24 | AABB = sprite (24×24) | — | `state.js:282` |
| alien2 | 11×8 ×3 = 33×24 | AABB = sprite (33×24) | — | `state.js:283` |
| alien3 | 10×8 ×3 = 30×24 | AABB = sprite (30×24) | — | `state.js:285` |
| alien4 | 7×6 ×3 = 21×18 | AABB = sprite (21×18) | — | `state.js:286` |
| alien5 | 7×6 ×3 = 21×18 | AABB = sprite (21×18) | — | `state.js:287` |
| alien6 | 11×8 ×3 = 33×24 | AABB = sprite (33×24) | — | `state.js:288` |
| alien_mini | 4×4 ×3 = 12×12 | AABB = sprite (12×12) | — | `state.js:289` |
| PowerUp | 12×12 | AABB: 12×12 | — | `entities.js:1189` |
| UFO Reward | 16×16 | AABB: 16×16 | — | `entities.js:1244` |
| Mines | — | circle r=12 | — | `update-boss.js:925` |
| Satellites | — | circle r=8 | — | `update-enemies.js:470` |
| Boss minion (emperor) | — | AABB: 24×24 | — | `update-boss.js:754` |

### 0.2 Dimensiones de Balas

| Origen | w × h | Velocidad | Nota |
|---|---|---|---|
| Player normal | 4×10 | vy=-8 | `combat.js:55` |
| Player double | 3×8 | vy=-8 | `combat.js:57` |
| Player spread | 4×8 | vy=-8, vx=±2 | `combat.js:60-62` |
| Player machine | 3×6 | vy=-12 | `combat.js:65` |
| Player laser | 6×24 | vy=-15 | `combat.js:67` |
| Enemy basic | 4×10 | bulletSpeed | `pushEnemyBullet` default |
| Enemy fortress | 3×12 | var | `enemy-attacks.js:124` |
| Enemy split_fan | 4×9 | var | `enemy-attacks.js:237-239` |
| Boss counter | 10×20 | v=7 | `update-boss.js:152-164` |
| Boss crossfire | 6×6 / 8×8 | v=3-4 | `update-boss.js:820-878` |
| Boss crab laser | 5×15 | vy=6 | `update-boss.js:853-858` |
| Boss zigzag fan | 6×15 | vy=4, vx=±5 | `update-boss.js:896-903` |
| Boss zigzag venom | 10×10 | v=2-3 | `update-boss.js:910-917` |
| Boss orbital spiral | 6×6 | v=4 | `update-boss.js:246-253` |
| Boss orbital pulse | 8×8 | v=3 | `update-boss.js:229-237` |
| Boss divebomb aimed | 8×14 | v=3 | `update-boss.js:273-278` |
| Boss divebomb side | 5×10 | vx=±2, vy=3 | `update-boss.js:283-284` |
| Boss divebomb impact | 8×8 | v=4 radial | `update-boss.js:529-535` |
| Boss emperor triple | 6×12 / 8×14 | v=4-5 | `update-boss.js:1018-1081` |
| Boss emperor spread | 6×12 | v=4 | `update-boss.js:1008-1015` |
| Boss emperor imperial | 8×8 | v=2-5 | `update-boss.js:1049-1074` |
| Satellite orb | 6×6 | v=4 aimed | `update-enemies.js:503-510` |

### 0.3 Mapa de Colisiones (dónde se resuelve cada par)

| Par | Tipo | Archivo:Línea | Método |
|---|---|---|---|
| Player bullet vs UFO | AABB | `update-enemies.js:87-106` | inline AABB |
| Player bullet vs Boss | AABB | `update-enemies.js:109-143` | inline AABB |
| Player bullet vs Mines | circle | `update-enemies.js:148-163` | distance check |
| Player bullet vs Enemy | AABB | `update-enemies.js:168-251` | inline AABB |
| Enemy bullet vs Player | AABB→circle | `update-enemies.js:324-327` | `checkPlayerCollisionAABB()` |
| Mine vs Player | circle | `update-enemies.js:439` | `checkPlayerCollisionCircle()` |
| Satellite vs Player | circle | `update-enemies.js:516` | `checkPlayerCollisionCircle()` |
| Shmup enemy vs Player | AABB→circle | `update-enemies.js:580-581` | `checkPlayerCollisionAABB()` |
| Diving enemy vs Player | AABB→circle | `update-enemies.js:897-898` | `checkPlayerCollisionAABB()` |
| Boss minion vs Player | AABB→circle | `update-enemies.js:1123-1125` | `checkPlayerCollisionAABB()` |
| PowerUp vs Player | AABB | `update-enemies.js:359` | inline AABB (full rect) |
| UFO Reward vs Player | AABB | `update-enemies.js:377-381` | inline AABB (full rect) |
| Enemy bullet graze | circle | `update-enemies.js:319` | `checkBulletGraze()` r=24 |
| Medal vs Player | AABB | `medals.js` | `rectOverlap()` |

### 0.4 Hallazgos de Auditoría

#### ISSUE HB-01: Pickup usa AABB completo del player en hardcore
- **Archivo**: `update-enemies.js:359` y `377`
- **Problema**: En modo hardcore, el player tiene hitbox r=3, pero los pickups se recogen con el AABB completo de 33x24. Esto no es un bug grave (pickups son generosos), pero es inconsistente y rompe la filosofía de "si tocó, lo recogió".
- **Severidad**: Baja. Afecta percepción de consistencia.

#### ISSUE HB-02: Patrón visual de la nave (33×24) vs hurtbox hardcore (r=3)
- **Archivo**: `hardcore-config.js:312` + `factories.js:7-8`
- **Problema**: La nave se ve de 33×24 pero solo muere si le pegan al centro (radio 3). Esto es INTENCIONAL y está bien diseñado. Pero el debug visual solo muestra el círculo rojo, no el rectángulo del sprite. Sería bueno mostrar ambos en modo debug para que el jugador entienda la diferencia.
- **Severidad**: Baja. Ya está documentado pero el debug es mínimo.

#### ISSUE HB-03: Balas de boss con setTimeout (láser vertical CrabTron)
- **Archivo**: `update-boss.js:850-864`
- **Problema**: El láser vertical del boss crossfire usa `setTimeout` para disparar balas secuenciales. Esto rompe el game loop determinista y puede causar que balas aparezcan después de que el boss muera.
- **Severidad**: Media. Puede causar muertes injustas post-boss-kill.

#### ISSUE HB-04: Tamaños de bala de boss inconsistentes
- **Archivo**: `update-boss.js` (varias líneas)
- **Problema**: Las balas varían entre 6×6, 8×8, 10×10, 5×15, 6×12, 8×14, 10×16 sin una lógica clara. Un jugador no puede predecir el área de peligro real de cada tipo de bala.
- **Severidad**: Media. Afecta la legibilidad ("bullet readability").

#### ISSUE HB-05: Tunneling potencial en balas rápidas
- **Archivo**: `update-enemies.js:76-78` + `310-316`
- **Problema**: Las balas se mueven con `step` (16.67ms nominal). La bala más rápida es la laser del player (vy=-15) con `step` de ~1.0 recorre unos 15px/frame. Si una entidad tiene altura <15px, el láser podría atravesarla sin colisionar.
- **Severidad**: Media para player láser (ya verificado que es piercing y usa AABB que cubre el gap). Baja para balas enemigas (vy máximo ~6-7, step~1 → 7px/frame, entidades mín 12px alto).

#### ISSUE HB-06: Minas con vida fija (14s) vs colisión con el player
- **Archivo**: `update-boss.js:921-928`, `update-enemies.js:420-458`
- **Problema**: Las minas del boss Serpentrix tienen vida=14000ms y radio=12. La colisión se verifica con `checkPlayerCollisionCircle(m, radius=12, normalPlayerRadius=15)`. Radio combinado = 12+15=27 (normal) o 12+3=15 (hardcore). Pero visualmente la mina parece más pequeña que su hitbox.
- **Severidad**: Baja. El radio visual no está definido, pero la función de draw no fue auditada.

#### ISSUE HB-07: Sin protección de spawn
- **Archivo**: `entities.js:567-592` (createEnemy), `update-boss.js:751-762` (emperor minions)
- **Problema**: Los enemigos pueden spawnear en posiciones cercanas al jugador sin distancia mínima. Los minions del Emperador spawnean en `boss.y + boss.h + 10` que podría estar cerca del jugador.
- **Severidad**: Media. Un spawn sobre el jugador es muerte instantánea injusta.

#### ISSUE HB-08: Colisión de body con enemigos en formación vs diving
- **Archivo**: `update-enemies.js:579-582` y `896-899`
- **Problema**: Ambos usan `checkPlayerCollisionAABB(e.x, e.y, e.w, e.h)` con el AABB completo del enemigo. En hardcore esto ya se reduce a círculo r=3, pero si hardcore está desactivado, la colisión usa el rectángulo completo. Los sprites de alienígenas tienen "huecos" visuales (píxeles 0) que el rectángulo cubre.
- **Severidad**: Baja-Media. En modo normal, el jugador puede morir por tocar "el aire" alrededor de un alien.

#### ISSUE HB-09: Graze con radio 24 es muy generoso
- **Archivo**: `hardcore-config.js:9` (default), `update-enemies.js:319`
- **Problema**: El graze se activa a 24px del centro del jugador. Para balas de 4×10, esto significa que el borde más cercano de la bala puede estar a 20px y aún cuenta como graze. Esto es intencional (recompensa juego cercano) pero debería documentarse.
- **Severidad**: Informativo. Es funcionalidad, no bug.

#### ISSUE HB-10: VFX de explosiones usan el mismo color que balas letales
- **Archivo**: `entities.js:47-100` (createExplosion), `update-enemies.js` (varias líneas)
- **Problema**: Las explosiones de muerte de enemigos pueden tener colores similares a balas enemigas (rojo, naranja, cian). El jugador podría confundir una partícula de explosión con una bala.
- **Severidad**: Media. HC-RD ya tiene políticas de alpha para esto, pero no hay separación explícita VFX vs colisiones letales.

---

## 1. PLAN POR FASES

### FASE 1: CONFIG CENTRALIZADA (`hc-hitbox-config.js`)
**Objetivo**: Un solo archivo con TODAS las dimensiones de hitbox/hurtbox.

Entregables:
- `www/hc-hitbox-config.js`
  - `window.HC_HITBOX` objeto maestro con:
    - `player.hurtbox` (normal AABB, hardcore radius)
    - `enemies[type].hitbox` (w, h por tipo)
    - `boss[pattern].hitbox` (w, h por boss)
    - `bullets.player[weapon]` (w, h, vx, vy por tipo)
    - `bullets.enemy[kind]` (w, h por kind)
    - `bullets.boss[pattern][attack]` (por ataque de boss)
    - `pickups.powerup` (w, h)
    - `pickups.ufoReward` (w, h)
    - `graze.radius`
    - `spawn.safetyRadius` (distancia mínima al player)
    - `fairness.tunnelingThreshold` (velocidad máxima sin sweep)
  - Schemas de validación
  - Documentación inline de cada valor

- Wire en `game-config.js:debug`:
  - `showHitboxPlayer: false`
  - `showHitboxEnemy: false`
  - `showHitboxBossBullet: false`
  - `showHitboxEnemyBullet: false`
  - `showHitboxPickup: false`
  - `showHitboxLaser: false`
  - `debugHitboxMode: 'none'` // none | player | enemy | boss | bullet | all

Tareas:
1. Crear `hc-hitbox-config.js`
2. Auditar y documentar cada dimensión en el nuevo archivo
3. Agregar toggles en `game-config.js`
4. NO migrar lógica de colisión aún — solo documentar

### FASE 2: DEBUG OVERLAY VISUAL (`hc-hitbox-debug.js`)
**Objetivo**: Sistema de visualización on/off para cada tipo de hitbox.

Entregables:
- `www/hc-hitbox-debug.js`
  - `drawAllHitboxDebug(ctx)` — dispatcher
  - `drawPlayerHurtboxDebug(ctx)` — círculo r=3 + rect del sprite
  - `drawEnemyHitboxDebug(ctx)` — rectángulos de cada enemigo vivo
  - `drawBossHitboxDebug(ctx)` — rectángulo del boss activo
  - `drawEnemyBulletHitboxDebug(ctx)` — círculo/rect de cada bala enemiga
  - `drawBossBulletHitboxDebug(ctx)` — igual pero distinguible
  - `drawPickupRadiusDebug(ctx)` — rectángulos de powerups/ufo rewards
  - `drawLaserCollisionDebug(ctx)` — zona de colisión del láser
  - `drawGrazeRadiusDebug(ctx)` — círculo de graze alrededor del player
  - `drawSpawnSafetyDebug(ctx)` — overlay en zonas de spawn recientes

- Colores debug estandarizados:
  - Player hurtbox: rojo (#ff4444)
  - Enemy body hitbox: verde (#44ff44)
  - Enemy bullet hitbox: naranja (#ff8844)
  - Boss bullet hitbox: rojo oscuro (#cc2222)
  - Boss body hitbox: amarillo (#ffdd44)
  - Pickup radius: cian (#44ffff)
  - Laser: magenta (#ff44ff)
  - Graze: azul tenue (#4488ff)
  - Spawn safety: blanco semi-transparente

- Key bindings:
  - F3: ciclo modos de debug hitbox (none → player → enemy → bullet → all)
  - Shift+F3: toggle graze radius
  - Ctrl+F3: toggle spawn safety zones

- Wire en `draw.js` después de `drawHardcorePlayerHitbox(ctx)`

Tareas:
1. Crear `hc-hitbox-debug.js`
2. Implementar todas las funciones de dibujo
3. Agregar key bindings en `input-keyboard.js`
4. Wire en `draw.js` y `index.html`
5. Verificar que no afecta FPS en modo all (usar globalAlpha bajo)

### FASE 3: REGLAS DE FAIRNESS (`hc-hitbox-fairness.js`)
**Objetivo**: Documentar y aplicar reglas formales de justicia en colisiones.

Reglas hardcore:
1. **RULE_HURTBOX_CENTER**: La hurtbox del jugador es SIEMPRE el centro de su sprite. Nunca los bordes.
   - Hardcore ON: círculo r=3 en (player.x+16.5, player.y+12)
   - Hardcore OFF: AABB 33×24 (ya cumple, es el sprite exacto)

2. **RULE_BULLET_VISUAL_MATCH**: El hitbox de una bala NUNCA debe exceder su representación visual.
   - Toda bala debe tener su w,h documentado en HC_HITBOX
   - Si una bala se dibuja más grande que su hitbox, es aceptable (favor player)
   - Si una bala tiene hitbox mayor que su draw, es bug

3. **RULE_SPAWN_CLEARANCE**: Ningún enemigo, boss o projectile hostil puede spawnear a menos de `spawn.safetyRadius` píxeles del centro del jugador.
   - Default: 80px (más que el graze radius 24, margen seguro)
   - Aplica a: createEnemy, initBoss, emperor minions, set piece entry

4. **RULE_TUNNELING_PREVENTION**: Si una entidad se mueve más rápido que su propia altura en un frame, se debe usar sweep test.
   - Umbral: si abs(vy * step) > min(entity.h, target.h), activar sweep
   - Actualmente solo el laser del player podría necesitarlo en teoría (15px/frame, target mínimo 12px alien_mini), pero el laser es piercing así que no hay problema real.

5. **RULE_VFX_SEPARATION**: Ningún efecto visual no-letal debe compartir color, forma o timing con amenazas letales.
   - Las explosiones deben tener alpha < amenazas letales (ya cubierto por HC-RD)
   - Las partículas deben ser circulares, las balas rectangulares (ya se cumple)
   - Los spawn flash deben ser distinguibles de balas (ya se cumple, usan blanco/alpha)

6. **RULE_NEAR_MISS_CLARITY**: Cuando una bala pasa a menos de `graze.radius` del player sin matarlo, debe ser visualmente claro que fue un near-miss, no un bug.
   - El graze spark ya existe (`registerGraze` crea explosión cyan)
   - Agregar ghost trail de 1 frame en la bala que hizo graze

7. **RULE_PICKUP_FAIRNESS**: Los pickups deben usar la misma hurtbox que las colisiones letales.
   - Hardcore ON: pickups usan círculo r=3 (o r=6 para ser generosos pero justos)
   - Hardcore OFF: AABB completo como ahora

8. **RULE_DEATH_CLARITY**: Cuando el jugador muere, el frame de la muerte debe mostrar claramente qué lo mató.
   - Highlight de la bala/enemigo que causó la muerte (flash blanco breve)
   - Hitstop ya existe y es efectivo

Tareas:
1. Crear `hc-hitbox-fairness.js`
2. Implementar `window.HC_FAIRNESS_RULES` como constantes documentadas
3. Agregar `checkSpawnSafety(x, y, w, h)` — retorna true si es seguro spawnear
4. Aplicar RULE_SPAWN_CLEARANCE en createEnemy, initBoss, emperor minions
5. Aplicar RULE_PICKUP_FAIRNESS en la colección de powerups/ufo rewards
6. NO modificar daño ni balance

### FASE 4: APLICACIÓN DE REGLAS
**Objetivo**: Implementar las reglas en el código de colisión existente.

Tareas:
1. Mover TODAS las dimensiones de `HC_HITBOX` a las funciones de colisión
   - update-enemies.js: usar HC_HITBOX en lugar de números mágicos
   - update-boss.js: mismo tratamiento
   - combat.js: mismo tratamiento

2. Fix ISSUE HB-03: reemplazar setTimeout en boss láser por timer basado en dt
   - Agregar `boss._crabLaserTimer` y `boss._crabLaserShots`
   - Usar el game loop, no setTimeout

3. Fix ISSUE HB-07: agregar spawn safety checks
   - `createEnemy`: si x,y está a <80px del player, ajustar
   - `initBoss`: asegurar que el boss no spawnea sobre el player
   - Emperor minions: spawnear con offset mínimo

4. Fix ISSUE HB-08: documentar que la colisión en modo normal usa AABB completo y es intencional. Agregar opción `player.fairHitbox` en game-config para modo normal con hitbox reducida.

5. NO modificar ISSUE HB-09 (graze radius), ISSUE HB-04 (tamaños de bala), ISSUE HB-06 (mina radius) — son balance, no fairness.

### FASE 5: VERIFICACIÓN Y FREEZE
**Objetivo**: Validar que todas las reglas se cumplen.

Tareas:
1. Playtest con debug overlay ALL activado
2. Verificar cada ISSUE listada
3. Verificar que no hay regresiones
4. Documentar hallazgos finales

---

## 2. FREEZE CRITERIA HC-HB

El bloque se considera **Freeze Candidate** cuando:

- [ ] `HC_HITBOX` documenta todas las dimensiones de colisión
- [ ] El debug overlay muestra correctamente todos los tipos de hitbox
- [ ] F3 toggles funcionan sin afectar FPS (<1ms en modo all)
- [ ] `RULE_SPAWN_CLEARANCE` implementada y verificada
- [ ] `RULE_PICKUP_FAIRNESS` implementada (pickups usan hurtbox, no AABB completo)
- [ ] `RULE_DEATH_CLARITY` verificada (el frame de muerte es legible)
- [ ] ISSUE HB-03 (setTimeout boss láser) resuelto
- [ ] ISSUE HB-07 (spawn safety) resuelto
- [ ] ISSUE HB-08 (body collision fairness) documentado con opción config
- [ ] 0 regresiones en colisiones existentes
- [ ] 0 cambios de daño, balance o dificultad
- [ ] Todos los archivos nuevos listados en index.html
- [ ] Documentación inline en cada nuevo archivo

---

## 3. ARCHIVOS NUEVOS REQUERIDOS

| Archivo | Fase | Descripción |
|---|---|---|
| `www/hc-hitbox-config.js` | 1 | Dimensiones centralizadas |
| `www/hc-hitbox-debug.js` | 2 | Debug overlay visual |
| `www/hc-hitbox-fairness.js` | 3 | Reglas de fairness + helpers |
| `docs/hc-hb-freeze-checklist.md` | 5 | Checklist de freeze |

---

## 4. ARCHIVOS A MODIFICAR

| Archivo | Cambio | Fase |
|---|---|---|
| `www/game-config.js` | Nuevos toggles debug hitbox | 1 |
| `www/hardcore-config.js` | Leer dimensiones de HC_HITBOX | 4 |
| `www/update-enemies.js` | Usar HC_HITBOX, spawn safety, pickup fairness | 4 |
| `www/update-boss.js` | Reemplazar setTimeout, usar HC_HITBOX | 4 |
| `www/combat.js` | Usar HC_HITBOX para player bullets | 4 |
| `www/enemy-attacks.js` | Usar HC_HITBOX para enemy bullets | 4 |
| `www/entities.js` | Spawn safety en createEnemy | 4 |
| `www/draw.js` | Wire debug overlay | 2 |
| `www/input-keyboard.js` | F3 bindings para debug overlay | 2 |
| `www/index.html` | Nuevos <script> tags | 1-3 |
| `docs/hc-hb-hitbox-audit-plan.md` | Este documento | 0 |

---

## 5. RESTRICCIONES CUMPLIDAS

- [x] NO aumentar dificultad artificialmente
- [x] NO agregar daño nuevo
- [x] NO tocar balance salvo injusticias claras (HB-03, HB-07, HB-08)
- [x] NO migrar engine
- [x] NO frameworks
- [x] NO ES modules
- [x] NO Android
- [x] NO refactors masivos fuera del scope

---

## 6. SPRINTS SUGERIDOS

| Sprint | Fase | Duración estimada | Entregables |
|---|---|---|---|
| HB-01 | Fase 1 | 1 sesión | Config centralizada, toggles en game-config |
| HB-02 | Fase 2 | 2 sesiones | Debug overlay completo con key bindings |
| HB-03 | Fase 3 | 1 sesión | Reglas de fairness documentadas e implementadas |
| HB-04 | Fase 4 | 2 sesiones | Aplicación de reglas, fixes de bugs |
| HB-05 | Fase 5 | 1 sesión | Verificación, playtest, freeze |
