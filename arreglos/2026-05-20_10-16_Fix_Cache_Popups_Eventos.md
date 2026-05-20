# Arreglo: Invalidación de Caché (revalidateTag) en Popups y Eventos
**Fecha:** 20 de Mayo de 2026
**Hora:** 10:16 GMT-4
**Proyecto:** colegio-acropolis

## Problema Detectado
Al publicar un nuevo popup desde el panel de administración, este no aparecía reflejado en la página web pública.

## Hipótesis Anterior Descartada
Se descartó que el problema fuera un fallo en la base de datos o en el formulario de guardado, ya que los datos se almacenaban correctamente en Neon. 

## Causa Raíz Real
En el arreglo del 17 de mayo, se incrementó el TTL de las consultas a 24 horas (`revalidate: 86400`) para que Neon entrara en Scale-to-Zero. Sin embargo, las funciones `unstable_cache` en las rutas de API de popups y eventos no incluían la opción `tags`, y el panel de administración no emitía un comando para invalidar dicha etiqueta. Como resultado, la web servía el caché antiguo de 24 horas a pesar de que el administrador hiciera cambios en la base de datos.

## Solución Implementada
Se agregó la invalidación por etiquetas (`tags`) a los cachés para asegurar frescura de datos al instante, sin romper el TTL de 24 horas.

### Archivos modificados:
1. `app/api/popups/route.ts`: Se añadió `tags: ['popups']` a las opciones de `unstable_cache`.
2. `app/api/eventos/route.ts`: Se añadió `tags: ['eventos']` a las opciones de `unstable_cache`.
3. `app/admin/popups/actions.ts`: Se importó `revalidateTag` y se agregó `revalidateTag('popups')` a las acciones de crear, editar, eliminar y toggle.
4. `app/admin/eventos/actions.ts`: Se importó `revalidateTag` y se agregó `revalidateTag('eventos')` a las acciones correspondientes.

## Por qué NO afecta a la base de datos (Scale-to-Zero)
Este cambio **no altera en absoluto** el arreglo previo de la base de datos. La base de datos seguirá durmiendo felizmente sus 24 horas. La única diferencia es que ahora, de manera completamente excepcional y **solo cuando el administrador hace clic en "Guardar"**, el sistema web va a despertar a la base de datos durante 5 minutos para ir a buscar la versión más nueva de los datos. Luego de esos 5 minutos, la base de datos volverá a dormirse por completo. El resto del tiempo la web sigue usando el caché.

## Resultado Esperado
Los popups y eventos recién creados o modificados aparecen de inmediato en la web. La base de datos mantiene su bajo consumo (Neon inactivo la mayor parte del tiempo).

## Próximos Pasos si Falla
- Verificar si alguna otra entidad administrable (ej. Noticias/Journal) sufre el mismo problema de caché retenido y aplicar `revalidateTag` si es necesario.
