# Bitácora de Sesión: Estado del Hero Scrubbing y Próximos Pasos para Retomar

**Fecha:** 2026-09-01 14:05  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/home/Hero.tsx` / Scrubbing de Fotogramas del Amanecer

---

## 📌 1. Resumen de lo Realizado y Estado Actual

1. **Extracción y Optimización de Fotogramas HD:**
   - Se procesó `VIDEO NUEVO HERO-VERSIÓN 2.mp4` (1284×716 a 30 fps, 150 fotogramas) generando `public/hero-frames/frame_000.webp` hasta `frame_149.webp`.
   - Sistema de precarga progresiva en memoria (`imagesRef`) y renderizado directo sobre `<canvas>` con aceleración gráfica GPU.

2. **Resolución Nativa y Eliminación del Efecto Lupa:**
   - Se fijó la resolución interna del canvas en `1284 × 716` eliminando el tamaño por defecto de 300×150 de HTML5 que provocaba pixelación y distorsión.

3. **Restauración de la Tarjeta de Cristal (Glassmorphism):**
   - Se restauró la estética exacta de producción (`bg-azul-acropolis/40`, `backdrop-blur-2xl`, `border-white/30`).
   - Títulos en dorado brillante `text-amarillo` y botones en cyan y cristal.
   - **Redacción atemporal** configurada para la segunda fase: *"Fundado en 2003 · Más de dos décadas construyendo el futuro de Puente Alto con dedicación, valores y excelencia valórica"*.

---

## 🔍 2. Hallazgos Técnicos y Diagnóstico de Puntos Pendientes

### A. Visibilidad 100% del Cielo Superior:
- **Causa:** El video es panorámico 16:9 (`1284×716`), donde los primeros 120px superiores corresponden al cielo (de noche a amanecer). Al limitar con `h-[600px]`, se recortaban más de 114px superiores.
- **Solución lista para aplicar:** Usar el contenedor con su proporción natural `aspect-[1284/716]` en `max-w-7xl` para que el cielo completo sea visible durante todo el ciclo de luz.

### B. Conexión Compacta con *Eventos del Mes* (Sin Espacios Muertos):
- **Causa:** El uso de `h-[110vh]` / `h-[135vh]` dejaba un recorrido vertical sobrante tras finalizar la animación del Hero.
- **Solución lista para aplicar:** Calibrar la pista a la altura de la tarjeta + 280px de scroll exactos, logrando que *Eventos del Mes* suba de forma inmediata al finalizar el fotograma 149.

### C. Limpieza de Marca de Agua en la Esquina Inferior Derecha:
- **Detección:** En los fotogramas iniciales (del 0 al 28), se detectó un rectángulo oscuro residual con un triángulo blanco en las coordenadas `y: 561..715, x: 870..1280`.
- **Solución lista para aplicar:** Ejecutar script con OpenCV para limpiar/inpaint de forma imperceptible la zona del pavimento en los primeros fotogramas afectados.

---

## 🚀 3. Hoja de Ruta para Retomar Mañana

1. **Paso 1:** Ejecutar script de remoción/inpaint de la marca de agua en la secuencia `public/hero-frames/frame_000.webp` a `frame_028.webp`.
2. **Paso 2:** Aplicar en `components/home/Hero.tsx` el contenedor `aspect-[1284/716]` con cielo 100% visible y la pista de scroll compacta.
3. **Paso 3:** Verificar en navegador la fluidez completa del amanecer, la nitidez de las tarjetas y la conexión directa con *Eventos del Mes*.
