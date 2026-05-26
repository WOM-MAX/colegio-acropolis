# Arreglo Integral: Módulo de Galería — Cache + Items Huérfanos
**Fecha:** 26 de Mayo de 2026
**Hora:** 18:35 — 18:53 GMT-4
**Commits:** `4f442c1`, `ec066e2`

---

## Contexto
El usuario reportó que agregó 16 videos al álbum "Booktubers 2026" desde el panel de admin y borró 1. En la web pública seguía apareciendo el video borrado y los 16 nuevos no aparecían. El admin mostraba todo correctamente (usa `force-dynamic`).

---

## Problema 1: Cache no se invalida al agregar/borrar items (🔴 Alta)

### Síntoma
Los cambios hechos desde el admin (agregar/borrar fotos y videos) no se reflejaban en la web pública hasta que expirara el TTL de 24 horas.

### Hipótesis Descartadas
1. ~~Server actions mal configuradas~~ → Las actions sí llaman `revalidateTag('galeria')` correctamente.
2. ~~`revalidatePath` insuficiente~~ → `revalidatePath('/galeria', 'layout')` no invalida entradas de `unstable_cache` sin tags.

### Causa Raíz
Las 3 funciones de `unstable_cache` en la galería pública **no tenían `tags: ['galeria']`**:

| Función | Cache Key | Tags (ANTES) | Tags (DESPUÉS) |
|---|---|---|---|
| `getCachedGaleriaAlbum` | `['galeria-album']` | ❌ Ninguno | ✅ `['galeria']` |
| `getCachedGaleriaFotos` | `['galeria-fotos']` | ❌ Ninguno | ✅ `['galeria']` |
| `getCachedGaleriaData` | `['galeria-albumes']` | ❌ Ninguno | ✅ `['galeria']` |

Solo `getValidGaleriaIds` (whitelist shield) tenía el tag correcto.

Sin tags, `revalidateTag('galeria')` ejecutado desde las server actions del admin **no podía invalidar esas entradas**. Los datos stale se servían hasta que expiraba el TTL de 86400 segundos.

### Solución
Agregar `tags: ['galeria']` a las 3 funciones de caché.

### Archivos Modificados
1. `app/(public)/galeria/[id]/page.tsx` — líneas 18 y 58
2. `app/(public)/galeria/page.tsx` — línea 43

### Impacto en Scale-to-Zero
Ninguno. El TTL sigue en 86400 (24h). Solo se habilitó la invalidación on-demand vía `revalidateTag`.

---

## Problema 2: deleteAlbum no borra items huérfanos (🟡 Media)

### Síntoma
Al eliminar un álbum, las filas de `galeria_fotos` asociadas quedaban huérfanas en la base de datos.

### Causa Raíz
- `deleteAlbum()` solo ejecutaba `db.delete(galeriaAlbumes)` sin borrar primero los items.
- El esquema de `galeria_fotos.albumId` no tiene `foreign key` con `onDelete: 'cascade'` (a diferencia de otras tablas como `paginaSecciones.paginaId` que sí lo tienen).

### Solución
Agregar una línea de borrado de items antes de borrar el álbum:

```typescript
// ANTES
await db.delete(galeriaAlbumes).where(eq(galeriaAlbumes.id, id));

// DESPUÉS
await db.delete(galeriaFotos).where(eq(galeriaFotos.albumId, id));
await db.delete(galeriaAlbumes).where(eq(galeriaAlbumes.id, id));
```

También se agregó `galeriaFotos` al import del archivo.

### Archivos Modificados
1. `app/admin/galeria/actions.ts` — líneas 6 y 81

---

## Auditoría Adicional Realizada

Se auditaron los 10 archivos del módulo completo. Resultados:

| Aspecto | Estado |
|---|---|
| Cache tags (arreglado) | ✅ |
| Invalidación desde admin | ✅ |
| Seguridad (`requireAdmin()`) | ✅ |
| Whitelist Shield rutas dinámicas | ✅ |
| Scale-to-Zero (TTL 86400) | ✅ |
| Admin `force-dynamic` | ✅ |
| GaleriaViewer (lightbox, teclado, YouTube/Vimeo) | ✅ |
| Drag & Drop multi-upload | ✅ |
| Validación formulario video | ✅ |
| Items huérfanos (arreglado) | ✅ |

### Pendientes Opcionales (no críticos)
- FK con `onDelete: 'cascade'` en `galeria_fotos.albumId` (requiere migración de BD)
- `URL.revokeObjectURL()` en previews del formulario de fotos (memory leak menor)

---

## Resultado
Los 16 videos ahora aparecen correctamente en la web pública. El video borrado ya no se muestra. Los cambios futuros desde el admin se reflejarán inmediatamente.
