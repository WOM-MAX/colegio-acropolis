# Inserción y Posicionamiento Flexible de Bloques en el Constructor de Páginas (CMS)

**Fecha:** 31 de Agosto de 2026  
**Hora:** 10:26 GMT-4  
**Proyecto:** colegio-acropolis  

## Problema Detectado
En el Constructor de Páginas (`/admin/paginas/[id]`), los bloques dinámicos del CMS solo se renderizaban en la parte superior absoluta de la página de inicio (antes del Hero), debido a que las secciones institucionales (`Hero`, `EventSlider`, `JournalGrid`, `CalendariosSection`, `DownloadsGrid`, `BannerCTA`) se encontraban codificadas de forma fija en `app/(public)/page.tsx`. Además, en el editor no existía una forma ágil de insertar un bloque en una posición intermedia específica (solo se podía añadir al final y mover con flechas).

## Hipótesis Descartadas
1. ❌ **Reemplazar componentes del inicio por bloques puramente HTML/Texto:** Descartado porque las secciones institucionales del colegio cuentan con lógica dinámica avanzada (lectura de eventos en DB, journal, carruseles optimizados, animaciones con Framer Motion / FadeIn). Debían conservarse íntegras.
2. ❌ **Campos de posición estáticos tipo slot (`ANTES_HERO`, `DESPUES_HERO`):** Descartado por ser rígido y requerir constantes migraciones de base de datos cada vez que se cree una sección nueva.

## Causa Raíz
La página de inicio no trataba las secciones institucionales como bloques reconocidos por el motor de renderizado de bloques (`BlockRenderer`), sino como un layout rígido con un array de bloques CMS incrustado arriba.

## Solución Implementada
1. **Registro de Módulos Nativos del Sistema:** Se crearon los tipos de bloque `HOME_HERO`, `HOME_EVENTOS`, `HOME_JOURNAL`, `HOME_CALENDARIOS`, `HOME_DESCARGAS` y `HOME_BANNER_CTA` en `BlockRenderer.tsx`, encapsulando los componentes con sus respectivas animaciones institucionales.
2. **Renderizado Dinámico Unificado en Inicio:** Se actualizó `app/(public)/page.tsx` para renderizar el orden exacto dictado por `paginaSecciones`. Si la base de datos aún no tiene las secciones registradas (estado inicial o retrocompatibilidad), opera con fallback automático sin interrupciones.
3. **Inserción Contextual ("+ Insertar bloque aquí"):** Se implementó en `PageEditor.tsx` y en la server action `addSeccion` la capacidad de insertar bloques en cualquier posición intermedia (`insertAtIndex`), desplazando automáticamente los índices sucesivos.
4. **Plantilla de Estructura Institucional:** Se agregó la función `inicializarEstructuraInicio` que permite cargar con 1 clic todos los módulos nativos del inicio en el CMS para comenzar a intercalar bloques inmediatamente.
5. **Compatibilidad Scale-to-Zero & Next.js 16:** Se mantuvieron todas las directivas de `unstable_cache` con TTL de 24h (`revalidate: 86400`) y se implementó la firma de 2 argumentos para `revalidateTag(tag, 'max')`.

### Archivos Modificados:
- [components/renderer/BlockRenderer.tsx](file:///c:/Proyectos/colegio-acropolis/components/renderer/BlockRenderer.tsx)
- [app/(public)/page.tsx](file:///c:/Proyectos/colegio-acropolis/app/(public)/page.tsx)
- [app/admin/paginas/[id]/actions.ts](file:///c:/Proyectos/colegio-acropolis/app/admin/paginas/[id]/actions.ts)
- [app/admin/paginas/[id]/BlockFormModal.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/paginas/[id]/BlockFormModal.tsx)
- [app/admin/paginas/[id]/PageEditor.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/paginas/[id]/PageEditor.tsx)

## Resultado Esperado
El administrador puede entrar a la página de inicio en el CMS, inicializar la estructura institucional y posicionar cualquier bloque (ej: una Alerta, Video, Testimonios, Texto o Imagen) en cualquier lugar de la página (entre el Hero y Eventos, entre Journal y Calendarios, etc.), así como reordenar u ocultar secciones nativas.

## Próximos Pasos si Falla
- Si alguna otra página personalizada requiere modularizar sus componentes fijos, seguir el mismo patrón de registrar sus componentes nativos en `BlockRenderer`.
