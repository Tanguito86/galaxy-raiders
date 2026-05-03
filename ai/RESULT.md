Archivo recomendado: `index.html` (insertar un div overlay) y la hoja de estilos CSS asociada.  
Resumen del cambio: Agregar un elemento `<div id="marca-automatica">` justo antes del cierre de `</body>`, con la marca deseada (texto/imagen). En el CSS, posicionarlo de forma fija sobre el canvas (`position: fixed; top: 10px; right: 10px; z-index: 100; pointer-events: none; opacity: 0.7;`). Esto muestra la marca sin interferir con los eventos del juego (pointer-events: none) y sin alterar la lógica del canvas.  
Riesgos:  
- Si el juego usa capas UI sobre el canvas, la marca podría solapar elementos importantes; se mitiga ajustando posición y tamaño.  
- Si la marca ocupa demasiada área activa, aunque con `pointer-events: none` no bloquea clics, podría distraer o afectar la experiencia visual.  
- Cualquier modificación en el HTML no rompe el gameplay mientras no se modifiquen los scripts del canvas.