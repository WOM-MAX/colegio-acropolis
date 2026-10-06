# Arreglo Tecnico: Soporte de Boton de Accion (CTA) Opcional en Bloque IMAGEN_TEXTO

- **Fecha:** 06 de Octubre de 2026
- **Hora:** 08:48 GMT-3
- **Proyecto:** colegio-acropolis
- **Area:** CMS / Constructor de Paginas / Bloques Dinamicos
- **Autor:** Antigravity (Pair Programming con Administrador)
- **Estado:** RESUELTO

---

## 1. Problema Detectado / Requerimiento

El equipo administrativo del colegio requeria publicar secciones de comunicados o anuncios en la web institucional que combinaran:
- Imagen o afiche representativo.
- Titulo y texto explicativo enriquecido.
- Un boton de llamado a la accion (CTA) que redirija a los usuarios a un enlace o formulario externo (por ejemplo: formularios de Google Forms para inscripcion a cursos/talleres ACLE, postulacion a becas, encuestas institucionales o rutas internas de admision).

El CMS disponia del bloque `IMAGEN_TEXTO` (diseno 50/50), pero este carecia de soporte para botones de accion, obligando a insertar links manuales dentro del parrafo de texto con menor visibilidad y menor tasa de conversion.

---

## 2. Hipotesis Descartadas

1. **Crear un nuevo tipo de bloque (`ANUNCIO_CON_BOTON` o similar):**
   - Descartado: Generaria fragmentacion y duplicidad de opciones en el modal de seleccion del CMS, sobrecargando la curva de aprendizaje de los administradores.
2. **Utilizar el bloque `CTA_BOTONES`:**
   - Descartado: Dicho bloque es un banner horizontal estilizado con fondo degradado pero no cuenta con soporte para imagenes o afiches adjuntos.

---

## 3. Causa Raiz

El bloque `IMAGEN_TEXTO` original habia sido modelado unicamente para contenido estatico (diseno 50/50 con imagen a un lado y texto al otro), sin exponer campos para `textoBoton`, `enlaceBoton`, `estiloBoton` o control de apertura en pestana nueva en su esquema de configuracion.

---

## 4. Solucion Implementada

1. **Ampliacion de Configuracion en `components/renderer/blocks/ImagenTextoBlock.tsx`:**
   - Se extendio la interfaz `ImagenTextoConfig` agregando:
     * `textoBoton?: string`
     * `enlaceBoton?: string`
     * `abrirEnNuevaPestana?: boolean`
     * `estiloBoton?: 'azul' | 'amarillo' | 'outline'`
   - Se implemento la logica de renderizado condicional: si `textoBoton` y `enlaceBoton` estan definidos, se renderiza un boton estilizado de alto impacto al pie de la columna de texto.
   - Soporte inteligente para enlaces externos (`http://`, `https://` o `//`), abriendo de forma segura con `target="_blank"` y `rel="noopener noreferrer"`.
   - Paleta integrada con los estilos del colegio (Azul Acropolis con hover interactivo, Amarillo Dorado con tipografia negra o estilo Outline con borde).
   - Preservacion de retrocompatibilidad: si no se configuran datos de boton, el bloque se visualiza exactamente igual que antes (como ocurre en la seccion de Canal de Denuncias).

2. **Formulario Administrativo en `app/admin/paginas/[id]/BlockFormModal.tsx`:**
   - Se anadio una tarjeta de configuracion dentro del formulario de `IMAGEN_TEXTO`: "Boton de Accion / Enlace (Opcional)".
   - Campos incorporados:
     * Input de texto para etiqueta del boton (con placeholder guiado).
     * Input de texto para URL o enlace de destino (ej: Google Forms o enlaces internos).
     * Selector de estilo visual del boton (Azul Acropolis, Amarillo Dorado, Borde Azul).
     * Checkbox para activar/desactivar la apertura en nueva pestana.

3. **Resumen Informativo en `app/admin/paginas/[id]/PageEditor.tsx`:**
   - Se actualizo la funcion `getBlockSummary` para indicar en la lista del constructor cuando un bloque `IMAGEN_TEXTO` posee un boton configurado.

---

## 5. Archivos Modificados

- `components/renderer/blocks/ImagenTextoBlock.tsx`: Tipado, logica de enlaces seguros y renderizado visual del boton.
- `app/admin/paginas/[id]/BlockFormModal.tsx`: Inputs de configuracion para boton, URL, estilo y apertura en nueva pestana.
- `app/admin/paginas/[id]/PageEditor.tsx`: Resumen en la lista de bloques del administrador.

---

## 6. Resultado Esperado

- Los administradores ahora pueden crear anuncios completos con imagen, texto y boton directo hacia formularios externos o paginas del colegio.
- Los bloques preexistentes (como Canal de Denuncias) se mantienen intactos sin sufrir alteraciones visuales.
- El build y la comprobacion de tipos de TypeScript finalizan con codigo 0.

---

## 7. Proximos Pasos si Falla

- Si se requiere integrar envio directo de datos sin salir del sitio, evaluar en una fase posterior un bloque nativo de formulario embebido tipo iframe o modal interactivo.
