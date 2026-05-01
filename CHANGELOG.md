# Changelog

## Unreleased

- Se define `www/` como fuente unica editable/publicable del juego.
- Se archiva la version monolitica anterior de raiz en `legacy-root-v1/`.
- Se agregan scripts npm para servir, sincronizar y compilar Android con Capacitor.

## 1.2.0 - 2026-02-14

- Nuevo perfil global de balance: `ARCADE` / `TOURNAMENT` (persistente desde `Options`).
- Set-pieces mejorados con telegraphs y patrones avanzados:
  - `imperial_guard`: crossfire en fases con avisos A/B.
  - `fortress`: aviso de fila antes de barrages.
  - `split_storm`: aviso lateral antes de fan burst.
- Identidad visual de balas enemigas por tipo de amenaza.
- Curva de dificultad 1-20 recalibrada y suavizada.
- Economía de powerups y recompensas de endgame ajustada (`L18-L20`).
- Score por riesgo: bonus por diving, set-piece y kills cercanas.
- HUD: indicador `TOUR` durante gameplay cuando el perfil es torneo.
- Instrumentación QA de runs (snapshots en `localStorage` y resumen por `F4`).
- Limpieza de logs de debug para build de producción.
- Versión visible en opciones actualizada a `VERSION 1.2`.
