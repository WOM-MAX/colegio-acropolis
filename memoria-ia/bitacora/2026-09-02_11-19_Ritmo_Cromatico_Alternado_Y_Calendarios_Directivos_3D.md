# Bitácora de Sesión: Ritmo Cromático Alternado de Portada, Rediseño 3D de Calendarios y Tarjetas de Directivos

**Fecha:** 2026-09-02 11:19  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/renderer/blocks/EquipoBlock.tsx`, `components/home/CalendariosTabsClient.tsx`, `components/home/DownloadsGrid.tsx`

---

## 📌 1. Diagnóstico y Requerimientos

1. **Ritmo Cromático Desalineado en Portada:**
   - La alternancia de fondos entre secciones tenía inconsistencias (dos secciones contiguas con fondo gris o variaciones no estándar de color).
   - Solución: Estandarizar la secuencia completa con el color oficial `bg-gris-claro` (`#F5F5F5`):
     `Hero (Blanco) → Eventos (Gris) → Noticias (Blanco) → Directivos (Gris) → Calendarios (Blanco) → Descargas (Gris) → Banner CTA (Fucsia)`.

2. **Diseño de Tarjetas de Directivos:**
   - La foto circular flotaba separada afuera de la tarjeta, rompiendo la unidad visual.
   - El cargo utilizaba un contenedor tipo píldora que se confundía con un falso botón.
   - Solución: Tarjeta unificada monolítica con marco de foto/insignia integrado en el tercio superior, cargo como texto editorial nítido y un único botón interactivo de correo.

3. **Falta de Relieve 3D y Movimiento en Calendarios:**
   - La sección tenía ondas SVG estáticas y tarjetas de curso pequeñas sin dinamismo.
   - Solución: Fondo blanco limpio (`bg-white`), barra de tabs 3D flotante con badges de cursos, contenedor principal con cabecera de gradiente temático según el ciclo, y tarjetas de cursos con elevación reactiva (`hover:-translate-y-1.5`) y micro-animaciones.

---

## 🛠️ 2. Solución Implementada

- **`EquipoBlock.tsx`**:
  - Fondo `bg-gris-claro`.
  - Tarjeta unificada (`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80`) con marco interior `aspect-square` para foto/insignia, tipografía de cargo en texto azul institucional y botón de correo limpio con `truncate`.
- **`CalendariosTabsClient.tsx`**:
  - Fondo `bg-white` sin ondas SVG.
  - Tabs 3D con indicador activo temático (Amarillo/Fucsia/Azul) y contador numérico.
  - Tarjetas de curso con sombra volumétrica y elevación en hover.
- **`DownloadsGrid.tsx`**:
  - Fondo `bg-gris-claro border-t border-gray-200/60`, logrando que las tarjetas blancas resalten con 100% de contraste perimetral.

---

## ✅ 3. Verificación
- `npx tsc --noEmit` completado con 0 errores.
