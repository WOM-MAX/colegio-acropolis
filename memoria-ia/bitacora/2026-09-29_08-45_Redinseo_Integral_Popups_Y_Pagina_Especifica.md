# Arreglo y Rediseño Integral de Popups y Asignación por Página Específica

- **Fecha:** 29 de Septiembre de 2026
- **Hora:** 08:45 GMT-3
- **Proyecto:** colegio-acropolis
- **Autor:** Antigravity AI

---

## 1. Problema Detectado
1. **Falta de Segmentación por Página:** Los popups configurados en el panel de administración se desplegaban de manera global en todas las páginas del sitio web, sin posibilidad de restringir su visibilidad a una URL determinada (por ejemplo, exclusivamente en la portada `/` o en `/admision`).
2. **Deficiencias de Contraste y Diseño:**
   - El color de las letras del botón CTA estaba forzado a `colorTexto` (el color del texto general del cuerpo), lo que provocaba combinaciones ilegibles como texto negro sobre botón azul oscuro.
   - En el estilo de imagen "Encabezado", se aplicaba un recorte agresivo (`maxHeight: '320px'` con `object-cover`) y un gradiente inferior que tapaba los textos de afiches y circulares escolares verticales.
   - En el estilo "Solo Imagen", si no existía imagen o fallaba su carga, se renderizaba una tarjeta vacía y transparente.
   - El clic sobre el enlace CTA no registraba la lectura del popup en `localStorage`, provocando que la ventana volviera a abrirse en la página de destino o al recargar.
   - La presencia de `whitespace-pre-line` generaba espaciados dobles o triples con el HTML generado por el `RichTextEditor`.
   - En monitores de escritorio, el ancho máximo del modal central (420px) resultaba excesivamente estrecho para comunicados y afiches.
   - En el panel de administración no existía una vista previa en tiempo real para evaluar el diseño antes de guardar.

## 2. Hipótesis Descartadas
1. **Filtrar por ruta en el servidor Neon:** Se descartó realizar consultas por ruta directamente a la base de datos o usar `searchParams` dinámicos que causaran continuos *cache misses*, ya que esto despertaría constantemente a Neon violando la directiva de Scale-to-Zero.

## 3. Causa Raíz
1. La tabla `popups` carecía de los campos `pagina_destino` y `color_texto_boton`.
2. El endpoint `/api/popups` limitaba los resultados a 1 solo registro (`.limit(1)`), impidiendo que el cliente recibiera popups de menor prioridad asignados a otras páginas.
3. El componente `PopupWrapper.tsx` no evaluaba el `pathname` actual ni desligaba el color de texto del botón del color de texto general.

## 4. Solución Implementada

### A. Base de Datos y Drizzle ORM
1. Se añadieron las columnas en `lib/db/schema.ts`:
   - `paginaDestino: varchar('pagina_destino', { length: 150 }).default('todas').notNull()`
   - `colorTextoBoton: varchar('color_texto_boton', { length: 50 }).default('#ffffff').notNull()`
2. Se generó y aplicó la migración SQL `drizzle/0002_giant_the_watchers.sql` con `ADD COLUMN IF NOT EXISTS` directamente en la base de datos Neon PostgreSQL.

### B. Endpoint API y Scale-to-Zero (`app/api/popups/route.ts`)
1. Se mantuvo `dynamic = 'force-dynamic'` y la función `unstable_cache` con TTL de 24 horas (`revalidate: 86400`) y etiqueta `tags: ['popups']`.
2. Se aumentaron los resultados a `.limit(10)` y se incluyeron los nuevos campos, retornando tanto `{ popup, popups }` para permitir el filtrado en el cliente sin costo adicional sobre la base de datos.

### C. Visualización y Renderizado (`components/ui/PopupWrapper.tsx`)
1. **Filtrado Reactivo:** Se implementó `usePathname()` para comparar la ruta actual contra `paginaDestino` (`'todas'` o coincidencia de ruta), ordenando por prioridad.
2. **Contraste de Botón:** Se aplicó `colorTextoBoton` con fallback a `#ffffff` para que los botones tengan tipografía nítida y legible.
3. **Persistencia en Clic:** Al hacer clic en el botón CTA o en la imagen enlazada se invoca `handleDismiss()`, marcando el popup como leído en `localStorage` antes de la navegación.
4. **Fallback de Imagen:** Si se escoge "Solo Imagen" sin archivo, se degrada elegantemente a presentación con texto en lugar de mostrar una caja vacía.
5. **Afiches y Encabezados:** Se ajustó la imagen a `max-h-[360px] object-contain sm:object-cover` sin gradientes destructivos que tapen información.
6. **Modal Central:** Se amplió el ancho a `max-w-[480px] sm:max-w-[540px] lg:max-w-[580px]`.
7. **Limpieza de Espaciado:** Se eliminó `whitespace-pre-line`, adoptando estilos enriquecidos estándar para el HTML.

### D. Panel de Administración y Live Preview
1. En `nuevo/page.tsx` y `[id]/editar/page.tsx` se obtienen las páginas del CMS desde la tabla `paginas` y se envían como opciones a `PopupForm`.
2. En `PopupForm.tsx` se agregaron:
   - Selector de Página Objetivo (Global, Portada `/`, rutas institucionales fijas, páginas del Page Builder y opción de ruta manual).
   - Selector de Color de Texto del Botón con paleta predefinida y color picker.
   - Panel de **Vista Previa en Vivo (Live Preview)** que refleja en tiempo real la combinación de colores, textos, afiches y contraste en una simulación de navegador.
3. En `actions.ts` se actualizó la persistencia de `paginaDestino` y `colorTextoBoton` con `revalidateTag('popups', 'max')`.
4. En `app/admin/popups/page.tsx` se incorporó la columna `DESTINO` en la tabla de gestión.

## 5. Archivos Modificados
- `lib/db/schema.ts`
- `drizzle/0002_giant_the_watchers.sql`
- `app/api/popups/route.ts`
- `components/ui/PopupWrapper.tsx`
- `app/admin/popups/nuevo/page.tsx`
- `app/admin/popups/[id]/editar/page.tsx`
- `app/admin/popups/components/PopupForm.tsx`
- `app/admin/popups/actions.ts`
- `app/admin/popups/page.tsx`

## 6. Resultado Esperado
- El administrador puede definir libremente si un popup aparece en todo el sitio o solo en una página particular.
- El diseño es nítido, sin textos cortados, sin degradados que tapen afiches y con alto contraste en botones.
- La interacción con el botón CTA no reabre el popup en la página siguiente.
- La base de datos Neon conserva su ciclo de reposo (Scale-to-Zero) bajo el TTL de 24 horas y revalidación bajo demanda.

## 7. Próximos Pasos si Falla
- Si se agregan nuevas rutas públicas estáticas en el futuro, incluirlas en el listado desplegable de `PopupForm.tsx` para mayor comodidad del administrador.
