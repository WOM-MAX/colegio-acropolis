# Bitácora de Implementación: Bloque DOCUMENTOS_LISTA y Carga de Archivos

- **Fecha y Hora:** 2026-09-07 11:28
- **Autor / Agente:** Antigravity AI
- **Contexto:** Expansión del constructor de páginas (CMS) con el primer bloque priorizado: `DOCUMENTOS_LISTA` (Descargas de reglamentos, circulares, listas de útiles, formularios y becas).

---

## 1. Problema y Necesidad
El colegio requería publicar documentos descargables (reglamentos internos, listas de útiles, circulares ministeriales, autorizaciones) de forma ágil desde el CMS. Anteriormente, el editor sólo permitía enlaces planos en texto enriquecido o acordeones básicos, y el endpoint `/api/upload` bloqueaba la subida de PDFs, planillas y documentos Word con un error de tipo MIME o límite estricto de 5MB para imágenes.

## 2. Solución Implementada
1. **Endpoint de Carga (`app/api/upload/route.ts`):**
   - Habilitados tipos MIME para documentos educativos: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX), `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX), `application/zip`, `application/x-zip-compressed`.
   - Límite de carga incrementado de 5MB a 15MB para soportar manuales y balances completos.

2. **Componente de Renderizado (`components/renderer/blocks/DocumentosListaBlock.tsx`):**
   - Soporte para dos modalidades visuales:
     - `lista`: Fichas horizontales con badge de formato, categoría, fecha, peso, botón de descarga directa y apertura en pestaña nueva.
     - `grilla`: Tarjetas 3D elevadas con hover y jerarquía visual.
   - Detección automática inteligente del tipo de archivo (PDF, DOC, XLS, ZIP) con sus respectivos íconos Lucide, fondos cromáticos y badges de resalte ("⭐ Destacado").
   - Integración de alternancia de ritmo cromático de fondo (`estiloFondo`: blanco `#FFFFFF`, gris `#F5F5F5`, azul tenue).

3. **Integración en BlockRenderer (`components/renderer/BlockRenderer.tsx`):**
   - Agregado el caso `DOCUMENTOS_LISTA`.

4. **Constructor y Editor (`BlockFormModal.tsx` & `PageEditor.tsx`):**
   - Selector de bloque en el modal con la opción `DOCUMENTOS_LISTA`.
   - Formulario completo con subida directa mediante `DirectMediaUpload` (15MB), selector de diseño, columnas, y repetidor de documentos con ordenación (subir/bajar) y borrado seguro.
   - En `PageEditor.tsx`: Resumen inteligente (`getBlockSummary`), metadatos (`getBlockMeta`) y badges contextuales con conteo de archivos.

## 3. Archivos Modificados / Creados
- `app/api/upload/route.ts` (Modificado)
- `components/renderer/blocks/DocumentosListaBlock.tsx` (Nuevo)
- `components/renderer/BlockRenderer.tsx` (Modificado)
- `app/admin/paginas/[id]/BlockFormModal.tsx` (Modificado)
- `app/admin/paginas/[id]/PageEditor.tsx` (Modificado)

## 4. Validación
- `npx tsc --noEmit` completado exitosamente con 0 errores.
- Compatibilidad total con la arquitectura Neon Scale-to-Zero (los bloques se almacenan dentro del JSONB `configuracion` sin requerir migraciones de BD).
