# Bitácora de Sesión: Mejoras en el Constructor de Páginas (Fase 1: Duplicación, Resúmenes Visuales y Ritmo Cromático)

**Fecha:** 2026-09-07 10:32  
**Proyecto:** Colegio Acrópolis  
**Área:** `app/admin/paginas/[id]/actions.ts`, `app/admin/paginas/[id]/PageEditor.tsx`, `app/admin/paginas/[id]/BlockFormModal.tsx`, `components/renderer/blocks/`

---

## 📌 1. Problema y Diagnóstico

1. **Reutilización Lenta de Bloques Complejos:**
   - Para replicar una sección ya configurada (por ejemplo, una grilla de tarjetas o un acordeón institucional), el administrador debía crear un bloque nuevo y volver a rellenar manualmente todos los campos.
2. **Falta de Información en la Lista del Constructor:**
   - La lista de bloques en `PageEditor.tsx` mostraba textos genéricos como `(Configuración activa)` en lugar del extracto real del contenido, dificultando la identificación rápida de bloques similares.
3. **Inconsistencia en el Ritmo Cromático de Secciones:**
   - La portada y las páginas CMS requerían alternancia cromática (`bg-white` vs `bg-gris-claro` #F5F5F5), pero bloques clave (`TARJETAS`, `TEXTO`, `EQUIPO`) tenían fondos fijos o carecían de selector en el modal de edición.

---

## 🛠️ 2. Solución Implementada (Fase 1)

1. **Server Action `duplicarSeccion` ([actions.ts](file:///c:/Proyectos/colegio-acropolis/app/admin/paginas/[id]/actions.ts)):**
   - Acción de servidor protegida (`requireAdmin()`) que localiza el bloque original, desplaza en +1 el orden de todas las secciones posteriores e inserta una copia exacta de la configuración (`structuredClone` / JSON), revalidando de inmediato las etiquetas de caché (`revalidateTag`).
2. **Botón Interactivo de Duplicación en 1 Clic ([PageEditor.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/paginas/[id]/PageEditor.tsx)):**
   - Nuevo botón con icono `Copy` en la botonera de cada bloque, con feedback optimista e inserción inmediata debajo del bloque original.
3. **Resúmenes Visuales y Badges Contextuales ([PageEditor.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/paginas/[id]/PageEditor.tsx)):**
   - Implementación de `getBlockSummary(seccion)` para extraer el texto y propósito de los 16 tipos de bloques sin tags HTML sucios.
   - Badges de cantidad de elementos (`X tarjetas`, `X pestañas`, `X fotos`, `X directivos`, `X citas`) y etiquetas visuales de color de fondo (`🎨 Fondo gris`, `🎨 Fondo azul`).
4. **Control de Ritmo Cromático Unificado ([BlockFormModal.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/paginas/[id]/BlockFormModal.tsx)):**
   - Selectores de `Color de Fondo` estandarizados en `TARJETAS`, `TEXTO`, `EQUIPO`, `ACORDEON` e `IMAGEN_TEXTO` (`gris-claro` #F5F5F5, `blanco` #FFFFFF, `azul` tenue).
   - Conexión dinámica de los fondos en los componentes de renderizado correspondientes ([TarjetasBlock.tsx](file:///c:/Proyectos/colegio-acropolis/components/renderer/blocks/TarjetasBlock.tsx), [TextBlock.tsx](file:///c:/Proyectos/colegio-acropolis/components/renderer/blocks/TextBlock.tsx), [EquipoBlock.tsx](file:///c:/Proyectos/colegio-acropolis/components/renderer/blocks/EquipoBlock.tsx), [AcordeonBlock.tsx](file:///c:/Proyectos/colegio-acropolis/components/renderer/blocks/AcordeonBlock.tsx)).

---

## 📂 3. Archivos Modificados

- `app/admin/paginas/[id]/actions.ts`
- `app/admin/paginas/[id]/PageEditor.tsx`
- `app/admin/paginas/[id]/BlockFormModal.tsx`
- `components/renderer/blocks/TarjetasBlock.tsx`
- `components/renderer/blocks/TextBlock.tsx`
- `components/renderer/blocks/EquipoBlock.tsx`
- `components/renderer/blocks/AcordeonBlock.tsx`

---

## ✅ 4. Verificación y Resultados

- **TypeScript:** `npx tsc --noEmit` completado con **0 errores**.
- **Duplicación:** Los bloques se clonan inmediatamente manteniendo orden e integridad de datos.
- **Rendimiento:** Cero impacto en scale-to-zero de Neon gracias a la invalidación controlada.
