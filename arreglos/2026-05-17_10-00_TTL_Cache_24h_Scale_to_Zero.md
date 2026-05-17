# Arreglo: TTL de Cachés 1h → 24h (Scale to Zero Definitivo)
**Fecha:** 17 de Mayo de 2026
**Hora:** 10:00 GMT-4
**Proyecto:** colegio-acropolis

## Problema Detectado
A pesar del sellado de rutas dinámicas (arreglo del 16/05), la BD Neon seguía despertando periódicamente durante la noche (patrón heartbeat en System Operations: Start/Suspend cada 5-10 min desde las 3:42 AM hasta las 9:31 AM).

## Hipótesis Anterior Descartada
El informe anterior sugería que podían ser conexiones locales (Drizzle Studio, IDE). Se descarta porque:
- Una conexión persistente mantendría la BD activa SIN pausas — no produciría Start/Suspend cíclico.
- Las capturas son de madrugada (3:42 AM - 9:08 AM), el usuario dormía.
- El patrón es de "heartbeat" regular, no aleatorio.

## Causa Raíz Real
Las **21 funciones `unstable_cache`** tenían TTL de `3600` (1 hora). Cuando cada caché expira, Next.js ejecuta la revalidación en background conectando a la BD. Con ~21 cachés escalonadas, la BD se despertaba constantemente.

## Solución Implementada
Se cambió TODOS los TTL de `revalidate: 3600` a `revalidate: 86400` (24 horas) en 16 archivos:

### Archivos modificados:
1. `app/layout.tsx` — root-layout-configuracion
2. `app/(public)/layout.tsx` — layout-paginas, layout-configuracion
3. `app/(public)/page.tsx` — home-secciones
4. `app/(public)/[slug]/page.tsx` — paginas, metadata, page, secciones (4 cachés)
5. `app/(public)/journal/[slug]/page.tsx` — journal post, slugs, detail, related (4 cachés)
6. `app/(public)/journal/page.tsx` — journal grid
7. `app/(public)/galeria/[id]/page.tsx` — album, ids, fotos (3 cachés)
8. `app/(public)/galeria/page.tsx` — galería grid
9. `app/(public)/descargas/page.tsx` — descargas
10. `app/(public)/coordinaciones/page.tsx` — coordinaciones
11. `app/(public)/centro-de-padres/page.tsx` — directiva
12. `app/(public)/admision/page.tsx` — matrícula
13. `app/(public)/nuestra-historia/page.tsx` — historia
14. `app/api/eventos/route.ts` — eventos mes
15. `app/api/popups/route.ts` — popups activos
16. `app/sitemap.ts` — sitemap data

## Por qué es Seguro
- Todas las server actions del admin ya llaman `revalidatePath()` / `revalidateTag()` al guardar cambios → la caché se invalida AL INSTANTE.
- El TTL de 24h es solo un fallback de seguridad, no el mecanismo principal de frescura.
- El contenido de un colegio no cambia cada hora.

## Resultado Esperado
- BD despierta solo en cold-start (despliegue) y cuando el admin guarda cambios.
- En periodos sin actividad admin, la BD debe dormir **~24 horas continuas**.

## Verificación
Monitorear System Operations durante 3+ horas nocturnas:
- ✅ Éxito: Solo 1 Start al principio, luego silencio.
- ❌ Si persiste: El origen está fuera de la app (health checks de Railway, cron externo).

## Próximos Pasos si Falla
1. Revisar si Railway tiene health checks configurados que golpeen rutas con BD.
2. Verificar si hay crawlers (Google, Bing) disparando revalidaciones ISR.
3. Considerar `export const dynamic = 'force-static'` en rutas puramente estáticas.
