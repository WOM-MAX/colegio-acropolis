# Arreglo: Segmentación por Fechas en Caché de Eventos y Popups y Compatibilidad con Next.js 16

**Fecha:** 1 de Junio de 2026
**Hora:** 17:01 GMT-4
**Proyecto:** colegio-acropolis

## Problema Detectado
Los eventos de junio no aparecían publicados en la página web pública (sección "Eventos del Mes") y los de mayo seguían mostrándose, a pesar de haber transcurrido más de 16 horas desde el inicio del mes de junio. Además, se detectó que el mismo problema de retención de caché por fecha afectaba a los popups.

## Hipótesis Descartadas
1. ❌ **Fallo en la base de datos o formulario:** Se descartó porque los eventos de junio se crearon, configuraron como activos y se guardaron correctamente en Neon (verificado en la base de datos y en el panel administrador).
2. ❌ **Falta de invalidación manual:** Al cambiar el mes no hay una interacción obligatoria del administrador, por lo que la caché de ruta persistía con los datos antiguos de mayo.

## Causa Raíz
1. **Full Route Cache Estática:** Los archivos `app/api/eventos/route.ts` y `app/api/popups/route.ts` utilizaban `export const revalidate = 86400` y no contenían funciones dinámicas (cookies, headers, searchParams). Next.js optimizaba la ruta como estática en la primera solicitud (en mayo). El cálculo `new Date()` y las consultas SQL no se volvían a ejecutar al entrar en junio porque Next.js servía el JSON directamente del cache de la ruta.
2. **Definición Interna de `unstable_cache`:** Ambas rutas definían `unstable_cache` dentro del manejador `GET()`. Al instanciarse dentro de la función y poseer claves estáticas (`api-eventos-mes` y `api-popups-today`), Next.js no podía realizar una correcta segmentación de la caché cuando las firmas de parámetros cambiaban dinámicamente.
3. **Incompatibilidad de Next.js 16 con `revalidateTag`:** Next.js 16 introdujo una firma obligatoria de 2 argumentos para `revalidateTag(tag, profile)`, lo que causaba fallos de compilación generalizados en TypeScript.

## Solución Implementada
1. **Rutas Dinámicas:** Se eliminó `export const revalidate` en `app/api/eventos/route.ts` y `app/api/popups/route.ts`, agregando en su lugar `export const dynamic = 'force-dynamic'`. Esto obliga a Next.js a ejecutar la función `GET()` en cada solicitud, calculando las fechas correctas en tiempo real (CPU, costo $0).
2. **Refactorización de `unstable_cache`:** Se movieron las funciones `getCachedActiveEventos` y `getCachedPopups` al scope global del módulo. Al pasar los parámetros dinámicos (`firstDay`/`lastDayStr` y `todayStr`) como argumentos, Next.js serializa las firmas y segmenta la caché por fecha/mes.
   - *Impacto en Neon:* El primer usuario del día/mes provoca un *cache miss*, despierta a Neon por 5 minutos para buscar los datos actualizados, y luego se almacena en el Data Cache de Next.js por 24 horas. Las consultas siguientes usan la caché sin tocar Neon, protegiendo el *Scale-to-Zero*.
3. **Corrección de Firmas `revalidateTag`:** Se actualizaron todas las llamadas a `revalidateTag(tag)` en las Server Actions del panel administrador para pasar el perfil `'max'` como segundo argumento (`revalidateTag(tag, 'max')`), cumpliendo con la API de Next.js 16.
4. **Corrección de Tipos Menores:** Se ajustaron los tipos en `next.config.ts` (casteo a `any` para evitar error de ESLint en Next.js 16) y `test_query.ts` (validación de variable de entorno).

### Archivos modificados:
- [app/api/eventos/route.ts](file:///e:/Proyectos/colegio-acropolis/app/api/eventos/route.ts)
- [app/api/popups/route.ts](file:///e:/Proyectos/colegio-acropolis/app/api/popups/route.ts)
- [app/admin/eventos/actions.ts](file:///e:/Proyectos/colegio-acropolis/app/admin/eventos/actions.ts)
- [app/admin/popups/actions.ts](file:///e:/Proyectos/colegio-acropolis/app/admin/popups/actions.ts)
- [app/admin/galeria/actions.ts](file:///e:/Proyectos/colegio-acropolis/app/admin/galeria/actions.ts)
- [app/admin/galeria/[id]/items/actions.ts](file:///e:/Proyectos/colegio-acropolis/app/admin/galeria/[id]/items/actions.ts)
- [next.config.ts](file:///e:/Proyectos/colegio-acropolis/next.config.ts)
- [test_query.ts](file:///e:/Proyectos/colegio-acropolis/test_query.ts)

## Resultado Esperado
Los eventos de junio se mostrarán inmediatamente, y los de mayo desaparecerán sin necesidad de intervención manual o de esperar el vencimiento del TTL antiguo. Los popups se actualizarán de igual forma diariamente de forma instantánea.

## Próximos Pasos si Falla
- Si algún otro listado (ej. Noticias/Journal) experimenta el mismo comportamiento estático al cambiar de fecha, aplicar la misma refactorización (mover `unstable_cache` al módulo exterior y asegurar la ruta dinámica si calcula fechas en tiempo real).
