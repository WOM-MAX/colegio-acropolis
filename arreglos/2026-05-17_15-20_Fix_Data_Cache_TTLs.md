# Arreglo: Alineación de TTLs (unstable_cache y fetch)
**Fecha:** 17 de Mayo de 2026
**Hora:** 15:20 GMT-4

## Problema Detectado
A pesar del arreglo anterior (page-level revalidate a 86400), la base de datos Neon seguía despertando cada 5 a 13 minutos. 

## Análisis Profundo
Next.js maneja caché en 3 capas distintas que deben estar alineadas. Habíamos arreglado la capa de página, pero quedaban fugas en la capa de datos:

1. **`unstable_cache` a 3600 (1 hora):**
   Varios componentes de servidor en la página de inicio y el layout público estaban usando `revalidate: 3600`.
   - `JournalGrid.tsx`
   - `DownloadsGrid.tsx`
   - `CalendariosSection.tsx`
   - `ContactoInfoBlock.tsx`
   - `lib/utils/page-guard.ts`
   
2. **`fetch` a 300 (5 minutos):**
   El componente cliente `PopupWrapper.tsx`, que se renderiza en **todas las páginas** a través del `PublicLayout`, hacía una petición a `/api/popups` con la opción `{ next: { revalidate: 300 } }`.
   Durante el pre-renderizado del servidor (SSR) de Next.js, esto instruía al servidor a revalidar ese fragmento de datos cada 5 minutos.
   
**El Patrón de 5 minutos:**
Cualquier ping de UptimeRobot, Railway Healthcheck, o bots de Google que visitaran la web disparaba el motor de Next.js. Si habían pasado más de 5 minutos, el caché de `PopupWrapper` expiraba, forzando una llamada a `/api/popups`, lo que a su vez despertaba a Neon.

## Solución Implementada
Se realizó una búsqueda global en todo el código de las cadenas `revalidate: 3600` y `revalidate: 300` y se reemplazaron por `revalidate: 86400` (24 horas).

### Archivos modificados:
1. `components/ui/PopupWrapper.tsx`
2. `components/home/JournalGrid.tsx`
3. `components/home/DownloadsGrid.tsx`
4. `components/home/CalendariosSection.tsx`
5. `components/renderer/blocks/ContactoInfoBlock.tsx`
6. `components/home/BannerCTA.tsx`
7. `lib/utils/page-guard.ts`

## Comprobación
Se hizo un último `grep` global para asegurarse de que no quede ningún `3600` ni `300` relacionado a revalidación en el código. Los únicos que quedaron fueron en los comentarios.

## Próximos Pasos
Monitorear las métricas de Neon Operations en los próximos 30 minutos. Con esto, absolutamente **todas** las capas de caché de Next.js (Page, Data, Fetch) están unificadas en un TTL estricto de 24 horas. El Scale-to-Zero debería funcionar ininterrumpidamente.
