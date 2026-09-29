# Bitácora y Plan de Implementación: Popups por Página Específica

- **Fecha y Hora:** 2026-09-28 13:46 GMT-3
- **Autor / Agente:** Antigravity AI
- **Contexto:** Planificación técnica para permitir la asignación de ventanas emergentes (popups) a páginas específicas (ej. Página de inicio `/`, `/admision`, `/descargas` o páginas del CMS), en lugar de desplegarse globalmente en todo el sitio web.

---

## 1. Problema Detectado y Necesidad
Actualmente, los popups configurados en el panel de administración se muestran de forma indiscriminada en todas las páginas públicas del sitio web. El usuario requiere la capacidad de elegir en qué página particular debe mostrarse cada popup (por ejemplo, exclusivamente en la página de inicio `/` o en alguna página interior seleccionada).

## 2. Análisis del Estado Actual
1. **Base de datos (`lib/db/schema.ts`):** La tabla `popups` no posee ninguna columna para registrar la página de destino (`pagina_destino`).
2. **Componente de visualización (`components/ui/PopupWrapper.tsx`):** Se encuentra montado en el layout raíz público (`app/(public)/layout.tsx`), consumiendo `/api/popups` sin verificar la ruta o URL actual.
3. **Endpoint API (`app/api/popups/route.ts`):** Filtra por fecha y estado activo, retornando únicamente el registro de mayor prioridad con `.limit(1)`.
4. **Panel Administrador (`app/admin/popups/components/PopupForm.tsx`):** No ofrece un selector de página objetivo.

## 3. Arquitectura y Restricción Scale-to-Zero (Neon PostgreSQL)
Para respetar las directivas de Scale-to-Zero de la base de datos Neon:
- No se deben realizar consultas a la base de datos diferenciadas por ruta desde el servidor.
- La API `/api/popups` continuará operando bajo `unstable_cache` con TTL de 24 horas (`revalidate: 86400`) y etiqueta `tags: ['popups']`.
- La API devolverá la colección de popups vigentes activos.
- El filtrado por página se ejecutará en el cliente dentro de `PopupWrapper.tsx` mediante el hook `usePathname()`. De esta forma, el consumo sobre Neon se mantiene en una sola consulta diaria para todo el sitio.

## 4. Plan de Implementación Detallado

### Fase 1: Esquema de Base de Datos y Migración
1. Modificar [lib/db/schema.ts](file:///c:/Proyectos/colegio-acropolis/lib/db/schema.ts) agregando la columna `paginaDestino`:
   ```ts
   paginaDestino: varchar('pagina_destino', { length: 150 }).default('todas').notNull(),
   ```
2. Generar el archivo de migración SQL en `drizzle/` y aplicarlo sobre la base de datos Neon.

### Fase 2: Ajuste de la API Pública
1. Modificar [app/api/popups/route.ts](file:///c:/Proyectos/colegio-acropolis/app/api/popups/route.ts):
   - Incluir `paginaDestino` en el `select`.
   - Ajustar el límite a una cantidad razonable (ej. `.limit(10)`) para entregar los popups activos del período.
   - Retornar `{ popups: activePopups }` (o mantener compatibilidad con `{ popup: null, popups: [...] }`).

### Fase 3: Filtrado Reactivo en Frontend
1. Modificar [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx):
   - Importar `usePathname` desde `next/navigation`.
   - Filtrar los popups recibidos para encontrar aquellos aplicables a la ruta actual (`p.paginaDestino === 'todas' || p.paginaDestino === pathname`).
   - Seleccionar el de mayor prioridad correspondiente a dicha ruta y evaluar la frecuencia en `localStorage`.

### Fase 4: Panel Administrador
1. Modificar [app/admin/popups/nuevo/page.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/nuevo/page.tsx) y [app/admin/popups/[id]/editar/page.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/[id]/editar/page.tsx):
   - Obtener la lista de páginas creadas desde la tabla `paginas` para enviarlas como opciones al formulario.
2. Modificar [app/admin/popups/components/PopupForm.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/components/PopupForm.tsx):
   - Añadir selector con opciones:
     - "Todas las páginas" (`todas`)
     - "Página de Inicio" (`/`)
     - Páginas institucionales fijas (`/admision`, `/contacto`, `/coordinaciones`, `/descargas`, `/galeria`, `/journal`, `/nuestra-historia`, `/centro-de-padres`)
     - Páginas dinámicas del Page Builder
     - Opción de ruta manual personalizada
3. Modificar [app/admin/popups/actions.ts](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/actions.ts):
   - Capturar y persistir `paginaDestino` en `createPopup` y `updatePopup`.
   - Mantener la invalidación `revalidateTag('popups', 'max')`.
4. Modificar [app/admin/popups/page.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/page.tsx):
   - Agregar columna visual que indique en qué página se muestra cada popup.

## 5. Archivos Involucrados
- [lib/db/schema.ts](file:///c:/Proyectos/colegio-acropolis/lib/db/schema.ts)
- [app/api/popups/route.ts](file:///c:/Proyectos/colegio-acropolis/app/api/popups/route.ts)
- [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx)
- [app/admin/popups/components/PopupForm.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/components/PopupForm.tsx)
- [app/admin/popups/actions.ts](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/actions.ts)
- [app/admin/popups/page.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/page.tsx)
- [app/admin/popups/nuevo/page.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/nuevo/page.tsx)
- [app/admin/popups/[id]/editar/page.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/[id]/editar/page.tsx)

## 6. Resultado Esperado
- El administrador podrá definir si un popup aparece en todo el sitio, únicamente en la portada o en una página específica.
- Los visitantes solo verán el popup cuando se encuentren en la ruta designada.
- No habrá impacto negativo en el consumo de Neon PostgreSQL, preservando el estado de reposo (Scale-to-Zero).

## 7. Próximos Pasos para la Sesión de Implementación
1. Confirmar con el usuario el inicio de la Fase 1.
2. Aplicar los cambios en el orden especificado.
3. Ejecutar comprobación con `npx tsc --noEmit`.
