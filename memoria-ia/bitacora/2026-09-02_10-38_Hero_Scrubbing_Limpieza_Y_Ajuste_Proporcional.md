# Bitácora de Sesión: Limpieza de Fotogramas, Visibilidad 100% de Cielo y Calibración de Scroll en Hero

**Fecha:** 2026-09-02 10:38  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/home/Hero.tsx` / `scripts/clean-watermark.py`

---

## 📌 1. Problema y Diagnóstico

1. **Marca de Agua en Fotogramas Iniciales (0..28):**
   - En la esquina inferior derecha (`x: 1140..1284, y: 630..716`), los primeros 29 fotogramas extraídos presentaban un artefacto/marca residual de edición.
   
2. **Recorte del Cielo Superior:**
   - La restricción de altura fija (`h-[600px]`) en el contenedor provocaba que con `object-cover` se recortaran ~114px superiores del cielo, ocultando la transición lumínica de la noche al amanecer.

3. **Recorrido de Scroll Sobrante / Empalme con Eventos del Mes:**
   - El uso de `h-[110vh]` dejaba espacios muertos o tiempos muertos de scroll una vez completada la reproducción de los 150 fotogramas.

---

## 🛠️ 2. Solución Implementada

### A. Limpieza Digital de Fotogramas (`scripts/clean-watermark.py`):
- Se utilizó la imagen original de noche en ultra alta resolución (`public/images/COELGIO DE NOCHE SIN MARCA DE AGUA.jpeg`).
- Se implementó un algoritmo con OpenCV que:
  - Calcula el factor de escala y calibración lumínica de cada fotograma respecto al entorno limpio adyacente.
  - Aplica un parche difuminado (Gaussian feathering) en los 35 primeros fotogramas.
- Resultado: 0 artefactos detectados en el escaneo automatizado (`Watermark scan result: 0 frames detected`).

### B. Proporción Nativa 1284/716 para Cielo 100% Visible:
- En `components/home/Hero.tsx`, se configuró el contenedor principal con:
  - `min-h-[460px] sm:min-h-0 sm:aspect-[1284/716] max-h-[calc(100vh-175px)]`
- Al coincidir la relación de aspecto del contenedor con la resolución nativa interna del Canvas (`1284×716`), el cielo nocturno y el amanecer se muestran en su totalidad sin ningún recorte en pantalla.

### C. Calibración de la Pista de Scroll:
- Se implementó un cálculo exacto de altura para la sección:
  - Altura = `stickyHeight + scrollDistance` (donde `scrollDistance` es 380px en escritorio y 280px en móvil).
- Al llegar al fotograma 149 (progreso = 1.0), la sección finaliza exactamente y la sección *Eventos del Mes* sube de forma inmediata y continua.

---

## 📂 3. Archivos Modificados / Creados
- `components/home/Hero.tsx` (Contenedor proporcional, cálculo de scroll y transiciones de tarjetas)
- `scripts/clean-watermark.py` (Script de limpieza y mezcla alfa)
- `public/hero-frames/frame_000.webp` a `frame_028.webp` (Fotogramas actualizados sin marca de agua)

---

## ✅ 4. Verificación
- **Escaneo de anomalías/marca de agua:** 0 fotogramas afectados.
- **Compilación TypeScript:** `npx tsc --noEmit` completado exitosamente sin errores.
- **Build de Producción Next.js:** Completado con éxito en Turbopack.
