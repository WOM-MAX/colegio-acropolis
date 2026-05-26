# Arreglo: Cache de Galería no se invalida al agregar/borrar items
**Fecha:** 26 de Mayo de 2026
**Hora:** 18:40 GMT-4

## Problema Detectado
Se agregaron 16 videos al álbum "Booktubers 2026" desde el panel de admin y se eliminó 1. La web pública seguía mostrando el video eliminado y no mostraba los 16 nuevos. El admin mostraba correctamente los 16 videos (porque usa `force-dynamic`).

## Hipótesis Evaluadas
1. ~~Problema con las server actions~~ → Descartado: las actions sí llaman `revalidateTag('galeria')` correctamente.
2. ~~Problema con `revalidatePath`~~ → Descartado: `revalidatePath('/galeria', 'layout')` no invalida `unstable_cache`.
3. **Tags faltantes en `unstable_cache`** → ✅ CAUSA RAÍZ CONFIRMADA.

## Causa Raíz
Las 3 funciones de `unstable_cache` en la galería pública no tenían `tags: ['galeria']`:
- `getCachedGaleriaAlbum` — sin tags
- `getCachedGaleriaFotos` — sin tags
- `getCachedGaleriaData` — sin tags

Solo `getValidGaleriaIds` (la whitelist shield) tenía el tag correcto.

Sin tags, `revalidateTag('galeria')` no puede invalidar esas entradas de caché. Solo se renovaban por TTL (24 horas).

## Solución Implementada
Se agregó `tags: ['galeria']` a las 3 funciones de caché faltantes.

### Archivos Modificados
1. `app/(public)/galeria/[id]/page.tsx` — `getCachedGaleriaAlbum` y `getCachedGaleriaFotos`
2. `app/(public)/galeria/page.tsx` — `getCachedGaleriaData`

## Resultado Esperado
Al agregar/borrar items desde el admin, `revalidateTag('galeria')` ahora invalida **todas** las entradas de caché de la galería pública, reflejando los cambios inmediatamente.

## Impacto en Scale-to-Zero
Ninguno. El TTL sigue en 86400 (24h). Solo se habilitó la invalidación on-demand que ya estaba prevista.

## Próximos Pasos si Falla
- Verificar que el deploy reconstruyó correctamente la app (no usar caché de build vieja).
- Si persiste, verificar con `curl -I` los headers de caché del CDN/Railway.
