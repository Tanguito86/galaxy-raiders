# Galaxy Raiders -- Visual Regression Playtest Checklist

**Version:** 1.2.0
**Stack:** HTML + CSS + vanilla JS (canvas)
**Internal resolution:** 360x640, HiDPI scaled
**Command:** `npm run serve` (starts `http-server www -p 8080 -c-1`)

---

## 1. Setup rapido

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 1.1 | `npm run serve` levanta sin errores | [ ] | http://localhost:8080 |
| 1.2 | El juego carga en **Chrome/Edge desktop** (1280x720+) | [ ] | |
| 1.3 | El juego carga en **modo mobile** (DevTools device toolbar, 375x667) | [ ] | No se corta ni desborda |
| 1.4 | El canvas no pierde el aspect ratio interno | [ ] | 360x640 se mantiene en cualquier viewport |
| 1.5 | Controles tactiles visibles en mobile | [ ] | Joystick + FIRE + Pause + Mute |
| 1.6 | Boton de fullscreen funciona en desktop | [ ] | Icono &#x26F6; cambia al entrar/salir |
| 1.7 | Fullscreen funciona en Android (Chrome) | [ ] | |

---

## 2. Menus

### 2.1 Menu principal (`state = 'menu'`)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 2.1.1 | Titulo "GALAXY" y "RAIDERS" visibles con glow | [ ] | Pulse de color sobre negro |
| 2.1.2 | "INSERT COIN // READY" visible abajo del titulo | [ ] | |
| 2.1.3 | Aliens decorativos animados (2 filas, ondulantes) | [ ] | 5 aliens fila superior, 4 inferior |
| 2.1.4 | Panel centrado con opciones: PLAY / SCORES / OPTIONS / CREDITS | [ ] | |
| 2.1.5 | Seleccion de menu navegable con UP/DOWN (flechas o joystick) | [ ] | Flechas `> <` animadas en opcion activa |
| 2.1.6 | "TOP PILOT" muestra nombre + score global mas alto | [ ] | |
| 2.1.7 | "MODE: NORMAL" / "MODE: HARDCORE" visible si desbloqueado | [ ] | |
| 2.1.8 | "BALANCE: [label]" visible abajo del menu | [ ] | |
| 2.1.9 | "[N] CREDITS" visible abajo | [ ] | |
| 2.1.10 | "UP/DOWN SELECT   FIRE=OK" visible | [ ] | |
| 2.1.11 | Fondo estrellado con parallax (menu) | [ ] | No estatico |
| 2.1.12 | Partículas en fondo visibles | [ ] | |

### 2.2 Options (`state = 'options'`)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 2.2.1 | Panel "OPTIONS" con glow visible | [ ] | |
| 2.2.2 | SOUND: ON / OFF togglea con LEFT/RIGHT | [ ] | Boton mute se sincroniza |
| 2.2.3 | VIBRATION: ON / OFF togglea | [ ] | |
| 2.2.4 | CONTROLS: NORMAL / LARGE cambia el tamano del joystick | [ ] | Visual en pantalla |
| 2.2.5 | DIFFICULTY: NORMAL / HARDCORE (si desbloqueado) | [ ] | Si no, muestra candado y texto |
| 2.2.6 | BALANCE: [label] toggleable | [ ] | |
| 2.2.7 | "RESET ALL SCORES" con estilo rojo/danger | [ ] | Pide FIRE para confirmar |
| 2.2.8 | "VERSION 1.2" visible | [ ] | |
| 2.2.9 | FIRE = BACK desde options | [ ] | Vuelve al menu o estado anterior |

### 2.3 Scores (`state = 'scores'`)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 2.3.1 | Panel "HALL OF FAME" con glow | [ ] | |
| 2.3.2 | Tabs LOCAL / GLOBAL funcionales | [ ] | LEFT/RIGHT cambian tab |
| 2.3.3 | Colores oro/plata/bronce en top 3 | [ ] | #1=#ff0, #2=#ccc/#ddd, #3=#c84 |
| 2.3.4 | Columnas: #, NAME, SCORE visibles y alineadas | [ ] | Global no muestra continues |
| 2.3.5 | Local marca continues usados (xN rojo) | [ ] | |
| 2.3.6 | "YOUR BEST: [score] #[rank]" visible | [ ] | |
| 2.3.7 | "LOADING..." visible brevemente al cargar tab GLOBAL | [ ] | |
| 2.3.8 | FIRE = BACK desde scores | [ ] | |

### 2.4 Credits (`state = 'credits'`)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 2.4.1 | Panel "CREDITS" con glow magenta | [ ] | |
| 2.4.2 | Texto "A TRIBUTE TO THE ARCADE GAMES..." | [ ] | |
| 2.4.3 | "SPACE INVADERS", "GALAGA - GALAXIAN" referenciados | [ ] | |
| 2.4.4 | "MADE WITH &#9829;" y "BY TANGUITO STUDIO & FLIA" | [ ] | |
| 2.4.5 | "LIKE IT? BUY A TOKEN TO SUPPORT THE DEV!" | [ ] | |
| 2.4.6 | "&#169; 2025" visible | [ ] | |
| 2.4.7 | FIRE = BACK desde credits | [ ] | |

### 2.5 Name entry (`state = 'entering_name'`)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 2.5.1 | "HIGH SCORE!" titulo visible | [ ] | |
| 2.5.2 | "SCORE: [n]" visible | [ ] | |
| 2.5.3 | Letra actual grande con &#9650;/&#9660; para UP/DOWN | [ ] | Navegable con joystick |
| 2.5.4 | Nombre actual + cursor parpadeante (_) | [ ] | |
| 2.5.5 | "FIRE: ADD LETTER", "MUTE: DELETE", "PAUSE: CONFIRM" | [ ] | |

### 2.6 Continue (`state = 'continue'`)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 2.6.1 | "CONTINUE?" titulo con glow amarillo | [ ] | |
| 2.6.2 | Countdown numerico grande centrado | [ ] | Se pone rojo cuando <= 2s |
| 2.6.3 | "SCORE: [n]" y "LEVEL: [n]" visibles | [ ] | |
| 2.6.4 | "FIRE TO CONTINUE" parpadeante | [ ] | |
| 2.6.5 | "3 LIVES - 1 CREDIT" indicado | [ ] | |
| 2.6.6 | "CONTINUES USED: [n]" visible si > 0 | [ ] | |
| 2.6.7 | "&#128266; = EXIT TO MENU" visible | [ ] | Boton Mute = declinar continue |

---

## 3. Gameplay normal (`state = 'playing'`)

### 3.1 HUD

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.1.1 | Panel SCORE (izquierda): texto "SCORE" + valor | [ ] | Actualiza al ganar puntos |
| 3.1.2 | Panel SCORE: texto "LEVEL" + valor | [ ] | Avanza al completar nivel |
| 3.1.3 | Panel HI (derecha): "HI", "CHAIN", "NEXT" con valores | [ ] | |
| 3.1.4 | Panel HI: HI muestra bestScore | [ ] | |
| 3.1.5 | Panel HI: CHAIN muestra medalChain | [ ] | |
| 3.1.6 | Panel HI: NEXT muestra medalValue | [ ] | |
| 3.1.7 | Vidas dibujadas abajo a la izquierda (rectangulos) | [ ] | Color de currentPalette[0] |
| 3.1.8 | Power-up timer bar abajo derecha (cuando arma != normal) | [ ] | Color segun tipo de arma, label |
| 3.1.9 | Power-up timer parpadea en rojo cuando < 1200ms | [ ] | |
| 3.1.10 | Label "TOUR" visible si balance modo tournament | [ ] | |

### 3.2 Player ship

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.2.1 | Nave visible (sprite 11x8, escala 3) | [ ] | |
| 3.2.2 | Animacion de 2 frames (player_a / player_b) | [ ] | Cambia cada 500ms |
| 3.2.3 | Inclinacion al moverse lateralmente | [ ] | Tilt izquierda/derecha sutil |
| 3.2.4 | Estela de propulsion (fuego abajo) | [ ] | Mas intensa al moverse arriba |
| 3.2.5 | Glow al disparar (color segun arma) | [ ] | Distintos colores: normal, double, spread, machine, laser |
| 3.2.6 | Escudo invencibilidad: elipse azul pulsante + parpadeo una vez muerta | [ ] | Visible tras continue o inicio de nivel |
| 3.2.7 | Parpadeo intermitente durante invencibilidad | [ ] | |

### 3.3 Controles moviles

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.3.1 | Joystick virtual responde a touch/drag | [ ] | |
| 3.3.2 | Boton FIRE responde a touch | [ ] | |
| 3.3.3 | Boton PAUSE pausa el juego | [ ] | Icono &#10074;&#10074; |
| 3.3.4 | Boton MUTE silencia/activa audio | [ ] | Icono cambia &#128264;/&#128263; |
| 3.3.5 | Controles se atenuan en menus (opacity 0.22, saturate) | [ ] | |
| 3.3.6 | Controles se suavizan en paused/gameover (opacity 0.34) | [ ] | |
| 3.3.7 | Controles normales durante playing | [ ] | Sin filter, sin opacity alterada |
| 3.3.8 | Joystick LARGE vs NORMAL se aplica visualmente | [ ] | Cambia el tamano en tiempo real |
| 3.3.9 | Los controles no tapan el area de juego util | [ ] | |

### 3.4 Enemigos

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.4.1 | alien1 visible (8x8, color palette index 2) | [ ] | Animacion 2 frames |
| 3.4.2 | alien2 visible (11x8, color palette index 1) | [ ] | Animacion 2 frames |
| 3.4.3 | alien3 "Tanque" visible (10x8, color palette index 3) | [ ] | HP bar visible cuando danado |
| 3.4.4 | alien4 "Veloz" visible (7x6, color palette index 0) | [ ] | Mas rapido |
| 3.4.5 | alien5 "Kamikaze" visible (7x6, color palette index 3) | [ ] | Persigue al jugador al hacer dive |
| 3.4.6 | alien6 "Splitter" visible (11x8, color palette index 2) | [ ] | Se divide en alien_mini al morir |
| 3.4.7 | alien_mini visible (4x4, escala 2) | [ ] | Spawnea del splitter |
| 3.4.8 | Enemigos en dive se ponen rojos | [ ] | `color = '#f00'` |
| 3.4.9 | Spawn flash de enemigos nuevos | [ ] | Rectangulo de glow + fade-in al aparecer |
| 3.4.10 | Hit flash de enemigos (blanco/rosado) cuando reciben dano | [ ] | Parpadeo momentaneo al ser golpeado |
| 3.4.11 | Enemigos se distinguen claramente del fondo | [ ] | |

### 3.5 Balas (player)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.5.1 | Balas normales visibles, color blanco con glow asignado | [ ] | |
| 3.5.2 | Trail visible en balas que lo generan | [ ] | Color de trail segun tipo |
| 3.5.3 | Laser visiblemente distinto (mas largo, core blanco) | [ ] | |
| 3.5.4 | Las balas no se confunden con powerups | [ ] | Diferentes formas/colores |

### 3.6 Balas (enemy)

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.6.1 | Balas enemigas se distinguen de las del jugador | [ ] | |
| 3.6.2 | Balas enemigas visibles sobre cualquier fondo | [ ] | |
| 3.6.3 | Minas flotantes (Serpentrix) visibles: circulo verde pulsante | [ ] | Parpadean cuando poca vida |
| 3.6.4 | Satelites orbitantes (Orbital) visibles: linea + circulos cyan | [ ] | |

### 3.7 Powerups

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.7.1 | Powerup visible como cuadrado con letra mayuscula | [ ] | D=double, S=spread, M=machine, L=laser |
| 3.7.2 | Aura exterior pulsante alrededor del powerup | [ ] | Color segun tipo de arma |
| 3.7.3 | Letra legible dentro del powerup | [ ] | |
| 3.7.4 | Powerup cae hacia abajo al spawnear | [ ] | |

### 3.8 UFO y recompensas

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.8.1 | UFO visible (sprite propio, escala 3) | [ ] | |
| 3.8.2 | UFO reward drops visibles (cuadrado con "?") | [ ] | Dorado si es raro, cyan si es comun |

### 3.9 Explosiones y particulas

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.9.1 | Particulas de explosion visibles (cuadrados de colores) | [ ] | |
| 3.9.2 | Anillos expansivos visibles en explosiones grandes | [ ] | |
| 3.9.3 | Chispas con trail visibles | [ ] | |
| 3.9.4 | Particulas no persisten indefinidamente | [ ] | life decrece, se eliminan |

### 3.10 Medallas y popups

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.10.1 | Medallas visibles (cruz dorada pulsante) | [ ] | |
| 3.10.2 | Popups de score visibles (texto flotando arriba) | [ ] | Alpha decrece, suben |

### 3.11 Set Pieces / Formaciones

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.11.1 | "WARNING" banner al iniciar set piece | [ ] | Texto rojo pulsante, label de formacion |
| 3.11.2 | "HOSTILE FORMATION" u otro texto contextual visible | [ ] | |
| 3.11.3 | Crossfire telegraph: lineas verticales rojas/naranjas a los costados | [ ] | "CROSSFIRE A" / "CROSSFIRE B" |
| 3.11.4 | Fortress telegraph: banda horizontal naranja sobre una fila | [ ] | "ROW N BARRAGE" |
| 3.11.5 | Split storm telegraph: banda verde al costado | [ ] | "FAN BURST" |
| 3.11.6 | Set piece banner dura lo suficiente para leerse | [ ] | |

---

## 4. Boss

### 4.1 Boss Warning

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 4.1.1 | "WARNING" banner animado en la parte superior | [ ] | Franja roja con texto pulsante |
| 4.1.2 | Nombre del boss visible debajo del WARNING | [ ] | CRABTRON, SERPENTRIX, ORBITAL, TENIENTE, EMPERADOR |
| 4.1.3 | Stripes diagonales en el fondo del banner | [ ] | |

### 4.2 Boss Bar

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 4.2.1 | HP bar visible (200x8 px) debajo del WARNING | [ ] | |
| 4.2.2 | Color de barra: color boss (>66%), naranja (33-66%), rojo (<33%) | [ ] | |
| 4.2.3 | Brillo interno blanco en la barra | [ ] | |
| 4.2.4 | Segmentos verticales en la barra llena | [ ] | |
| 4.2.5 | Pulso rojo cuando HP < 33% | [ ] | |
| 4.2.6 | Nombre del boss junto a la barra | [ ] | O "MOTHERSHIP" como fallback |

### 4.3 Boss Sprite

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 4.3.1 | Sprite de boss visible y a escala 5 | [ ] | |
| 4.3.2 | Cada boss tiene su sprite unico | [ ] | CrabTron, Serpentrix, Orbital, Teniente, Emperador |
| 4.3.3 | Glow alrededor del boss (offset) | [ ] | |
| 4.3.4 | Sombra oscura detras del boss | [ ] | |

### 4.4 Boss Hit Flash

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 4.4.1 | Flash rosa claro al recibir dano | [ ] | `boss.flashTimer` activa flicker |
| 4.4.2 | El flash no tapa completamente al boss | [ ] | alpha ~0.25-0.45 |

### 4.5 Boss Bullets / Ataques

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 4.5.1 | Balas de boss se distinguen de balas normales de enemigos | [ ] | |
| 4.5.2 | Cada patron de boss es visualmente identificable | [ ] | crossfire, zigzag, rotate, divebomb, supreme |
| 4.5.3 | CrabTron: dash lateral visible | [ ] | Movimiento rapido horizontal |
| 4.5.4 | Serpentrix: minas flotantes verdes visibles | [ ] | |
| 4.5.5 | Orbital: satelites orbitando + pulso expansivo | [ ] | |
| 4.5.6 | Teniente: divebomb/embestida con telegraph | [ ] | |
| 4.5.7 | Emperador: teletransporte con flash + onda de choque | [ ] | |
| 4.5.8 | Emperador: invocacion de minions visibles | [ ] | |

### 4.6 Boss Death

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 4.6.1 | Explosion en cadena del boss (victory phase 1) | [ ] | |
| 4.6.2 | BOOM final gigante visible | [ ] | Flash blanco + explosion grande |
| 4.6.3 | Transicion a victory sin artifacts | [ ] | |

---

## 5. Transiciones

### 5.1 Level Clear

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 5.1.1 | Overlay oscuro con "LEVEL CLEAR" visible | [ ] | |
| 5.1.2 | "WARPING" con puntos animados | [ ] | |
| 5.1.3 | Efecto de warp (scanlines, aceleracion de estrellas) | [ ] | |
| 5.1.4 | Brackets decorativos en las esquinas | [ ] | Lineas cyan en las esquinas del overlay |
| 5.1.5 | El fondo se oscurece durante warp | [ ] | `drawBackgroundMood` con cyan wash |
| 5.1.6 | Pantalla vuelve a gameplay normal tras la transicion | [ ] | |

### 5.2 Pause

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 5.2.1 | Overlay "PAUSED" con glow | [ ] | |
| 5.2.2 | Stats visibles: SCORE, HI-SCORE, LEVEL, LIVES, WEAPON | [ ] | |
| 5.2.3 | Opciones: RESUME / OPTIONS / QUIT navegables | [ ] | |
| 5.2.4 | El gameplay se congela completamente | [ ] | |
| 5.2.5 | RESUME vuelve sin artifacts visuales | [ ] | |

### 5.3 Game Over

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 5.3.1 | Muerte del jugador: explosion + flash | [ ] | |
| 5.3.2 | Si quedan vidas: respawn con invencibilidad | [ ] | Escudo azul visible |
| 5.3.3 | Si no quedan vidas: transicion a continue screen | [ ] | |
| 5.3.4 | "CONTINUE?" aparece correctamente | [ ] | Ver seccion 2.6 |
| 5.3.5 | Si se declina y no es high score: vuelta al menu limpia | [ ] | |
| 5.3.6 | Si se declina y es high score: name entry screen | [ ] | Ver seccion 2.5 |
| 5.3.7 | "TRY AGAIN" overlay en estado gameover | [ ] | Panel rojo con "PRESS FIRE" |
| 5.3.8 | Tras TRY AGAIN, se vuelve al menu sin artifacts | [ ] | |

### 5.4 Victory

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 5.4.1 | Fase 1: "EMPEROR DESTROYED" parpadeante | [ ] | |
| 5.4.2 | Fase 2: "VICTORY!" + nave subiendo con estela | [ ] | |
| 5.4.3 | Fase 2: fuegos artificiales aleatorios | [ ] | |
| 5.4.4 | Fase 3: "VICTORY!" + grado gigante (S/A/B/C) | [ ] | |
| 5.4.5 | Fase 3: descripcion del grado | [ ] | |
| 5.4.6 | Fase 3: stats completos (score, time, enemies, accuracy, powerups, continues) | [ ] | |
| 5.4.7 | Fase 3: "&#9733; HARDCORE UNLOCKED &#9733;" parpadeante | [ ] | |
| 5.4.8 | Fase 3: trofeo animado (bob) | [ ] | |
| 5.4.9 | Fase 3: "PRESS FIRE" parpadeante | [ ] | |
| 5.4.10 | Confetti continuo en fases 2+ | [ ] | |
| 5.4.11 | Tras FIRE, vuelta al menu limpia | [ ] | |

---

## 6. Checklist de problemas a buscar

| # | Problema | Descripcion | Check |
|---|----------|-------------|-------|
| 6.1 | Textos encimados | HUD se solapa a si mismo o con otros elementos | [ ] |
| 6.2 | Alpha contaminado | Flickers, parpadeos incorrectos al acumular transparencias | [ ] |
| 6.3 | HUD tapado por otros elementos | El HUD de gameplay queda detras de enemigos, balas o efectos | [ ] |
| 6.4 | Controles demasiado invasivos | Joystick o botones tapan area de juego en mobile | [ ] |
| 6.5 | Balas confundidas con powerups | Player bullets vs enemy bullets vs powerups indistinguibles | [ ] |
| 6.6 | caida de FPS visible | Lag o stuttering en dispositivos target (especialmente mobile) | [ ] |
| 6.7 | Artifacts al cambiar de estado | Restos graficos de una pantalla en la siguiente | [ ] |
| 6.8 | Estrellas/parallax roto | Estrellas estaticas, posiciones incorrectas, no hacen wrap | [ ] |
| 6.9 | Screen shake excesivo | Temblor que dificulta leer el HUD o identificar elementos | [ ] |
| 6.10 | Flash screen residual | Flash blanco/rojo que no se disipa correctamente | [ ] |
| 6.11 | Z-order incorrecto | Elementos dibujados en orden incorrecto (ej: HUD bajo explosiones) | [ ] |
| 6.12 | Boss bar no se actualiza | HP bar no refleja el dano real | [ ] |
| 6.13 | Weapon timer bar no se actualiza | Barra de power-up no decrece o parpadea incorrectamente | [ ] |
| 6.14 | Canvas no se limpia entre frames | Ghosting de frames anteriores | [ ] |
| 6.15 | Pause no congela animaciones | Enemigos/balas se siguen moviendo en pause (visible al resumir) | [ ] |
| 6.16 | Fuente "Press Start 2P" no carga | Texto con fuente fallback (generalmente serif) | [ ] |

---

## 7. Criterio de aprobacion RC Visual

Para considerar el Release Candidate visualmente aprobado, se debe cumplir:

- [ ] **Todos** los items de las secciones 2, 3, 4, y 5 marcados como **Pass**.
- [ ] **Ninguno** de los problemas de la seccion 6 presentes.
- [ ] El juego se ve correctamente en:
  - [ ] Chrome desktop (windowed + fullscreen)
  - [ ] Chrome Android (modo portrait, Chrome DevTools mobile view aceptable como proxy)
- [ ] No hay texto cortado, desbordado ni fuera del viewport.
- [ ] La paleta de colores es consistente entre estados (no hay cambios bruscos de tono no intencionados).
- [ ] El rendimiento visual es fluido (sin stuttering visible) durante al menos **5 minutos continuos** de gameplay.
- [ ] Los 5 bosses se renderizan correctamente con sus sprites y barras.
- [ ] Las transiciones entre estados son limpias, sin artifacts de frames anteriores.
- [ ] Los controles tactiles no obstruyen informacion critica del HUD.
