**Archivo recomendado:** `index.html` (agregar elemento) y `styles.css` (estilizar).

**Resumen del cambio:**  
Insertar un `div` fijo con la marca de agua (texto o imagen) sobre el contenedor del canvas. En CSS, usar `position: absolute` (o `fixed`), `pointer-events: none`, `opacity: 0.5` y `z-index` alto. Así se muestra sin capturar clics ni toques.

**Riesgos:**  
- Cero impacto en gameplay si se aplica `pointer-events: none`.  
- Navegadores muy antiguos podrían no reconocer la propiedad, bloqueando interacción accidentalmente (riesgo bajo).  
- Asegurarse de que el `div` no tape elementos importantes del HUD (es solo cosmético).