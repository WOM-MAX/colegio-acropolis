# Bitácora de Sesión: Optimización de Espaciado Hero, Tipografía de Directivos y Alto Contraste de Etiquetas

**Fecha:** 2026-09-02 10:54  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/home/Hero.tsx`, `components/home/EventSlider.tsx`, `components/renderer/blocks/EquipoBlock.tsx`, `components/home/DownloadsGrid.tsx`, `components/home/JournalGrid.tsx`, `lib/utils.ts`

---

## 📌 1. Problema y Diagnóstico

A partir de la grabación en video enviada por el usuario (`Grabación 2026-09-02 104210.mp4`), se detectaron 3 aspectos a mejorar:

1. **Espacio en blanco sobrante bajo el Hero:**
   - La pista de scroll de 380px dejaba una holgura blanca visible al pie del Hero en el estado inicial antes de hacer scroll, y el padding `py-16` de *Eventos del Mes* aumentaba la separación.
   
2. **Jerarquía Tipográfica en Directivos:**
   - En `EquipoBlock.tsx`, el título "Correos Institucionales Directivos" utilizaba estilos sobredimensionados (`lg:text-[40px] font-extrabold`) mayores que los títulos estándar de la página de inicio (*Últimas Noticias*, *Calendarios de Evaluaciones*, *Documentos y Descargas*).

3. **Bajo Contraste en Etiquetas (Badges):**
   - En *Documentos y Descargas* y *Noticias*, las etiquetas de categorías utilizaban fondos al 10% de opacidad y texto claro (`bg-cian/10 text-cian`, `bg-amarillo/20 text-amarillo`, etc.), lo que resultaba en bajo contraste sobre fondos blancos/claros.

---

## 🛠️ 2. Solución Implementada

### A. Compactación del Hero y Eventos del Mes:
- **`Hero.tsx`**: Se redujo `SCROLL_TRAVEL_DESKTOP` de 380px a 190px (y móvil a 140px). La transición del amanecer ahora responde al instante con un scroll ágil y se eliminó el espacio muerto inferior.
- **`EventSlider.tsx`**: Se ajustó el padding a `pt-6 sm:pt-8 pb-14`, logrando un empalme estrecho, limpio y elegante con el Hero.

### B. Estandarización de Tipografía en Directivos (`EquipoBlock.tsx`):
- Se unificó el encabezado con el estándar del sitio: `text-3xl sm:text-4xl font-bold tracking-tight text-negro`.
- Se mejoró la tarjeta de directivo: cargo en píldora de alto contraste (`bg-slate-100 text-slate-900 border border-slate-200`) y botón de correo institucional estilizado con fondo y hover accesible.

### C. Sistema de Etiquetas con Alto Contraste:
- **`DownloadsGrid.tsx`**: Se actualizaron los acentos (Azul, Cian, Fucsia, Amarillo) con fondos sutiles pero definidos, bordes estructurados y texto en tonalidades profundas y ultra legibles (`font-extrabold` / `font-black`).
- **`lib/utils.ts` & `JournalGrid.tsx`**: Se reescribió `getCategoryColor` con combinaciones de alto contraste (WCAG AAA) para todas las categorías (`Dirección`, `Académico`, `Convivencia`, `Institucional`, `Extraescolar`, `General`).

---

## 📂 3. Archivos Modificados
- `components/home/Hero.tsx`
- `components/home/EventSlider.tsx`
- `components/renderer/blocks/EquipoBlock.tsx`
- `components/renderer/blocks/TarjetasBlock.tsx`
- `components/home/DownloadsGrid.tsx`
- `components/home/JournalGrid.tsx`
- `lib/utils.ts`

---

## ✅ 4. Verificación
- **TypeScript:** `npx tsc --noEmit` completado con 0 errores.
- **Dev Server:** Activo y corriendo en `http://localhost:3000`.
