# Bitácora de Arreglo: Eliminación de Opción Global y Fidelidad 1:1 en Vista Previa de Popups

- **Fecha y Hora**: 2026-09-29 10:55
- **Módulo**: `app/admin/popups/components/PopupForm.tsx` y `app/admin/components/ImageUploadSection.tsx`
- **Autor**: Asistente de IA (Protocolo SDD / AGENTS.md)

---

## 1. Problema Detectado

1. **Persistencia de la opción "Global" en el menú**:
   En el formulario de administración continuaba presente la opción *"Todas las páginas del sitio web (Global)"*, lo cual inducía a crear avisos intrusivos que perseguían a los visitantes por todas las páginas.
2. **Inconsistencia de la Vista Previa en Vivo**:
   Al configurar un afiche en formato **"Solo Imagen"** (el más utilizado por el colegio, ej: "Ajuste de Horario"), la vista previa lateral mostraba una tarjeta blanca genérica con el título y texto repetidos, sin mostrar el afiche real ni su composición con el botón CTA inferior. Además, la vista previa dependía de una propiedad estática (`data.imagenUrl`) en lugar de responder inmediatamente a cambios o cargas de imagen.

---

## 2. Diagnóstico y Causa Raíz

1. **`standardPages` con opción global**:
   En `PopupForm.tsx`, la lista de páginas estándar incluía `{ value: 'todas', label: 'Todas las páginas del sitio web (Global)' }`. Al ser el primer elemento, quedaba seleccionada por defecto en nuevos popups.
2. **Ausencia del caso `solo-imagen` en el renderizado de previsualización**:
   La vista previa solo implementaba los casos `isBanner`, `estiloImagen === 'fondo'` y `estiloImagen === 'encabezado'`. El estilo `solo-imagen` no estaba contemplado y caía en el renderizado por defecto de una tarjeta de texto.
3. **Desconexión reactiva de `ImageUploadSection`**:
   El componente de carga de imágenes no exponía eventos `onChange` ni `onPreviewChange`, por lo que el formulario padre no se enteraba en tiempo real cuando el usuario pegaba un enlace o seleccionaba un archivo.

---

## 3. Solución Implementada

1. **Retiro de la opción Global**:
   - En `PopupForm.tsx`, se removió la opción `todas` de `standardPages`.
   - Se estableció **`Página de Inicio / Portada (/)`** como la opción predeterminada.
   - Cualquier popup existente con `todas` migra automáticamente en la interfaz a `/`.
2. **Sincronización Reactiva de Imágenes**:
   - Se actualizaron las propiedades de [app/admin/components/ImageUploadSection.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/components/ImageUploadSection.tsx) para emitir `onChange` y `onPreviewChange` (vía `URL.createObjectURL(file)`).
   - En `PopupForm.tsx`, se conectó el estado `imagenUrl` para alimentar inmediatamente el panel de vista previa.
3. **Fidelidad 1:1 en Vista Previa (`solo-imagen` y `centro-modal`)**:
   - Se implementó en la vista previa el renderizado de **`solo-imagen`** exactamente igual que en [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx): afiche vertical completo, botón cerrar "X" y botón de acción estilizado con `colorBoton` y `colorTextoBoton`.
   - Se agregó simulación de fondo oscurecido (`backdrop-blur`) para modales centrales.

---

## 4. Archivos Modificados

* [app/admin/popups/components/PopupForm.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/components/PopupForm.tsx): Retiro de opción global, conexión de `imagenUrl` y renderizado fidedigno de `solo-imagen`.
* [app/admin/components/ImageUploadSection.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/components/ImageUploadSection.tsx): Soporte para eventos interactivos `onChange` y `onPreviewChange`.

---

## 5. Resultado y Criterios de Aceptación

* El menú desplegable solo ofrece páginas específicas (`/`, `/admision`, `/descargas`, etc.), eliminando la opción de crear popups globales invasivos.
* La vista previa lateral refleja idénticamente la apariencia del afiche real en vivo con su botón CTA en alto contraste.
* Compilación limpia con TypeScript (`npx tsc --noEmit` exitoso sin errores).
