# Galaxy Raiders

Juego web empaquetado con Capacitor para Android / Google Play.

## Fuente unica

La fuente editable y publicable del juego es `www/`.

No editar archivos de gameplay en la raiz del proyecto. La version monolitica anterior quedo archivada en `legacy-root-v1/` solo como referencia historica.

Capacitor usa esta carpeta porque `capacitor.config.json` define:

```json
{
  "webDir": "www"
}
```

## Flujo diario

```bash
npm run serve
```

Abre el juego web desde `www/` para probar cambios en navegador.

```bash
npm run cap:sync
```

Copia `www/` al proyecto Android de Capacitor.

```bash
npm run cap:open
```

Abre el proyecto Android.

```bash
npm run android:debug
```

Genera una build debug Android.

```bash
npm run android:bundle
```

Genera un bundle release. Antes de subir a Google Play, verificar firma, `versionCode` y `versionName`.

## Requisitos Android

- JDK 21 activo en `JAVA_HOME` y en el `PATH`.
- Android Studio / SDK configurado.
- Capacitor sincronizado con `npm run cap:sync` antes de abrir o compilar Android.

Si `npm run android:debug` falla con `invalid source release: 21`, el JDK activo no es 21.

## Reglas para evolucionar sin romper

- Cambios de juego: solo en `www/`.
- Cambios Android: solo en `android/` cuando sean necesarios para Capacitor, permisos, versionado o firma.
- Antes de publicar: correr `npm run cap:sync`.
- Para Google Play: mantener el mismo `applicationId` y subir siempre un `versionCode` mayor.
- No editar `android/app/src/main/assets/public/` a mano; se regenera desde `www/`.

## Checklist manual

- Carga la pantalla inicial.
- START funciona con teclado y touch.
- Movimiento y disparo funcionan.
- Pausa, mute y fullscreen funcionan.
- Audio se desbloquea tras la primera interaccion.
- Los niveles avanzan.
- Boss y victoria/game over funcionan.
- Scores/Firebase no bloquean la partida si no hay red.
- Android abre despues de `npm run cap:sync`.
