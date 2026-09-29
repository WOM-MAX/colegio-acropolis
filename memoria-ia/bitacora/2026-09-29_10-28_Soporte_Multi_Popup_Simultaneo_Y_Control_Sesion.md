# Bitácora de Arreglo: Soporte Multi-Popup Simultáneo No Conflictivo y Control de Sesión

- **Fecha y Hora**: 2026-09-29 10:28
- **Módulo**: `components/ui/PopupWrapper.tsx`
- **Autor**: Asistente de IA (Protocolo SDD / AGENTS.md)

---

## 1. Problema y Necesidad del Negocio

1. **Mono-popup limitante**:
   El componente `PopupWrapper` utilizaba `matching.find()`, limitando el renderizado a un solo popup activo en toda la pantalla. Si la institución necesitaba tener un aviso urgente en la cabecera (banner) y al mismo tiempo un recordatorio de admisiones o un afiche modal, uno canibalizaba al otro.
2. **Reaparición invasiva en navegación SPA vs. Nuevas Sesiones**:
   Se requería distinguir claramente entre dos estados:
   - **Durante la misma sesión**: Si el usuario ya vio o cerró un popup en una página, no debe volver a molestarlo mientras navega por otras secciones del sitio (`/`, `/admision`, `/contacto`).
   - **En una nueva visita**: Si el usuario cierra el navegador o la pestaña y regresa horas o días después (nueva sesión), los popups con frecuencia "Siempre" deben volver a darle la bienvenida.

---

## 2. Diagnóstico y Arquitectura de Solución

1. **Desacoplamiento con Arquitectura de Componente `PopupItem`**:
   Se modularizó el renderizado individual en un subcomponente `PopupItem`. Cada popup gestiona de forma autónoma:
   - Su propio estado de visibilidad (`visible`).
   - Su propio temporizador de entrada suave (200ms) y de salida (350ms).
   - El descarte de un banner no afecta ni altera la animación de un modal o esquina que coexista en pantalla.

2. **Asignación de Slots No Conflictivos**:
   Para evitar colisiones visuales destructivas (como dos modales centrales solapándose con fondos oscuros superpuestos), se diseñó un algoritmo de selección por slots:
   - **Slot A (Banners)**: Hasta 1 banner (`banner-superior` o `banner-inferior`).
   - **Slot B (Elementos Flotantes)**: Hasta 1 elemento flotante. El modal central (`centro-modal`) tiene precedencia sobre las esquinas (`inferior-derecha` / `inferior-izquierda`) para mantener la jerarquía de atención.
   - Resultado: Hasta dos popups simultáneos (1 banner + 1 tarjeta/modal), perfectamente armónicos.

3. **Ciclo de Vida de Sesión con `sessionStorage`**:
   - Popups con frecuencia **"Siempre"**: Al descartarse, guardan `popup_session_dismissed_<id>` en `sessionStorage`. El navegador mantiene esta memoria durante toda la navegación interna entre rutas y la elimina automáticamente cuando el usuario cierra la pestaña o finaliza la sesión.
   - Popups con frecuencia **"Una vez al día"**: Se mantiene `localStorage` con clave por fecha (`YYYY-MM-DD`).
   - Popups con frecuencia **"Solo una vez"**: Se mantiene `localStorage` permanente (`true`).

4. **Aislamiento Estricto por Ruta**:
   Cada popup evalúa de forma independiente su `paginaDestino`. Si un popup está configurado para `/`, solo se renderiza en la portada; si otro popup banner está configurado como `todas`, se despliega en todas las páginas sin interferir con el primero.

---

## 3. Archivos Modificados

* [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx): Implementación completa de `PopupItem`, slots no conflictivos y helpers `isPopupDismissed` / `markPopupDismissed` con `sessionStorage`.

---

## 4. Resultado y Criterios de Aceptación

* Soporte para desplegar simultáneamente un banner y un modal o tarjeta de esquina.
* Cero solapamiento entre múltiples modales o múltiples banners (gana el de mayor prioridad).
* En una misma sesión, cerrar un popup garantiza que no vuelva a aparecer en las demás páginas que el usuario visite.
* Al abrir una pestaña nueva (nueva sesión), los popups con frecuencia "Siempre" vuelven a mostrarse.
* Validación TypeScript con 0 errores (`npx tsc --noEmit`).
