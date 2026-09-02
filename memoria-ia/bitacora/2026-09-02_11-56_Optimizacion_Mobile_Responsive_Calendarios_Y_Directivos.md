# Bitácora de Sesión: Optimización Mobile-First en Calendarios de Evaluaciones y Directivos

**Fecha:** 2026-09-02 11:56  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/home/CalendariosTabsClient.tsx`, `components/renderer/blocks/EquipoBlock.tsx`, `components/renderer/blocks/DirectivoEmailButton.tsx`

---

## 📌 1. Diagnóstico de Pantallas Móviles (360px a 430px)

1. **Tabs de Ciclos:**
   - En pantallas estrechas, los 3 botones de ciclo podían sufrir quiebres de línea no deseados.
   - Solución: Contenedor con `overflow-x-auto`, `shrink-0` y nombres adaptativos (`Parvularia` / `Básica` / `Media` en móviles).

2. **Master Container y Bandeja Slate:**
   - Reducción del padding en móviles a `p-4` / `p-5` para aprovechar el 100% del ancho de pantalla sin perder los bordes 3D redondeados.

3. **Tarjetas de Cursos y Directivos:**
   - Directivos: Ancho `max-w-[300px]` centrado con áreas táctiles amplias (>= 48px de alto).
   - Calendarios: Tarjetas en 1 columna en móvil y 3 columnas en desktop, con botones táctiles cómodos para el pulgar.
   - Correo: Apertura nativa de Gmail / Apple Mail en celulares sin diálogos de error.

---

## ✅ 2. Verificación
- `npx tsc --noEmit` completado con 0 errores.
