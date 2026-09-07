# Bitácora de Sesión: Transformación de Correos Institucionales a Carrusel Interactivo 3D

**Fecha:** 2026-09-07 07:45  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/renderer/blocks/EquipoBlock.tsx`, `app/admin/paginas/[id]/BlockFormModal.tsx`

---

## 📌 1. Problema y Diagnóstico

1. **Uso Excesivo de Espacio Vertical:**
   - La sección de correos institucionales de directivos (`EquipoBlock`) renderizaba las tarjetas en una grilla estática multi-fila (`flex flex-wrap`).
   - Con 6 a 10 directivos o coordinadores, la sección ocupaba entre 700px y 1.200px de altura vertical, desplazando secciones prioritarias como Calendarios de Evaluaciones y Documentos de Descarga muy abajo en la página de inicio.
2. **Experiencia en Dispositivos Móviles:**
   - En pantallas pequeñas, requería un desplazamiento vertical continuo y monótono por múltiples tarjetas consecutivas.
3. **Falta de Dinamismo:**
   - No contaba con interacción visual horizontal ni gestos táctiles (*swipe*).

---

## 🛠️ 2. Solución Implementada

1. **Arquitectura de Carrusel Responsivo (`EquipoBlock.tsx`):**
   - Se convirtió a componente `'use client'` con control dinámico de elementos visibles según viewport:
     - **≥ 1280px:** 4 tarjetas por vista.
     - **1024px – 1279px:** 3 tarjetas por vista.
     - **640px – 1023px:** 2 tarjetas por vista.
     - **< 640px:** 1 tarjeta centrada por vista.
   - Pista deslizante fluida con `transition-transform duration-500 ease-out` y cálculo exacto de compensación proporcional por anchos y gaps (`24px`).
   - Deslizamiento automático suave (cada 5 segundos) con pausa inteligente al pasar el cursor (`onMouseEnter` / `onMouseLeave`).
   - Soporte completo para gestos táctiles móviles (*swipe*) mediante `onTouchStart`, `onTouchMove` y `onTouchEnd`.
   - Controles institucionales Acrópolis: botones circulares amarillos con chevron azul en la cabecera (escritorio) y en la base junto con *dots* indicadores (móvil).
   - Ocultamiento automático de controles si la cantidad de miembros es menor o igual a las tarjetas visibles.

2. **Preservación Total del Botón de Correo (`DirectivoEmailButton`):**
   - Se configuró `focus-within:z-30` en las tarjetas para asegurar que el menú flotante desplegable hacia arriba (Gmail Web, Outlook Web, Copiar dirección, Mailto) se superponga con total nitidez y sin recortes perimetrales ni interferencia de tarjetas adyacentes.

3. **Flexibilidad en el Administrador CMS (`BlockFormModal.tsx`):**
   - Se incorporó un selector de *Modo de Visualización* en el modal de edición del bloque `EQUIPO`, permitiendo alternar entre "Carrusel Interactivo (Recomendado)" y "Grilla Estática Tradicional", garantizando 100% de compatibilidad hacia atrás.

---

## 📂 3. Archivos Modificados

- `components/renderer/blocks/EquipoBlock.tsx`
- `app/admin/paginas/[id]/BlockFormModal.tsx`

---

## ✅ 4. Resultado Esperado

- Reducción de más del 60% del espacio vertical en la página de inicio.
- Navegación ágil, táctil y visualmente atractiva con diseño 3D coherente con la identidad visual de Colegio Acrópolis.
- Compatibilidad absoluta con scale-to-zero y caching estático de Next.js sin afectar el rendimiento ni despertar innecesariamente la base de datos Neon.
