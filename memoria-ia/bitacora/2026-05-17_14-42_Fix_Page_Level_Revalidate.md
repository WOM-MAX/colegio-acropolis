# Arreglo: Export Const Revalidate a Nivel de Página
**Fecha:** 17 de Mayo de 2026
**Hora:** 14:42 GMT-4

## Problema Detectado
Después de aplicar el fix de `unstable_cache` TTL 24h y el warm-up script, la BD seguía despertando cada 5-15 minutos. El patrón era idéntico al heartbeat original.

## Hipótesis Descartadas
1. ❌ Cache misses de crawlers → El warmup llenó todas las cachés
2. ❌ Client-side fetches → No hay polling periódico
3. ❌ Rutas force-dynamic públicas → Solo están en admin y exportar

## Causa Raíz
**10 páginas públicas** tenían `export const revalidate = 3600` a nivel de PÁGINA, separado del `revalidate: 86400` dentro del `unstable_cache`.

Son **DOS capas de caché diferentes en Next.js**:
- **Capa 1 (Full Route Cache):** `export const revalidate = N` → controla ISR (re-renderizado de la página completa)
- **Capa 2 (Data Cache):** `unstable_cache({ revalidate: N })` → controla el TTL de los datos

En el arreglo anterior solo se corrigió la Capa 2. La Capa 1 seguía en 3600 (1 hora), causando que Next.js re-renderizara cada página cada hora, lo que iniciaba conexiones a Neon incluso si los datos venían del cache.

## Solución Implementada
Cambiar TODOS los `export const revalidate` de 3600 a 86400 en las 10 páginas afectadas.

### Archivos modificados:
1. `app/(public)/centro-de-padres/page.tsx`
2. `app/(public)/journal/[slug]/page.tsx`
3. `app/(public)/[slug]/page.tsx`
4. `app/(public)/journal/page.tsx`
5. `app/(public)/nuestra-historia/page.tsx`
6. `app/(public)/galeria/page.tsx`
7. `app/(public)/descargas/page.tsx`
8. `app/(public)/galeria/[id]/page.tsx`
9. `app/(public)/coordinaciones/page.tsx`
10. `app/(public)/admision/page.tsx`

## Verificación Post-Fix
- Búsqueda de `revalidate = 3600` en todo `/app`: 0 resultados ✅
- System Operations: después del deploy+warmup, NO debe haber Start/Suspend adicionales

## Lección Aprendida
Next.js tiene MÚLTIPLES capas de caché. Siempre verificar AMBAS:
- `export const revalidate` (page/layout level)
- `unstable_cache({ revalidate })` (data level)
Ambas deben estar alineadas para evitar despertares de la BD.

## Próximos Pasos si Falla
1. Buscar `revalidate` con valores menores a 86400 en cualquier archivo
2. Revisar si hay `generateStaticParams` que fuerce re-renders
3. Verificar que no haya middleware haciendo queries
