# Bitácora de Arreglo: Reinicio de Descarte de Popups Globales en Navegación SPA

- **Fecha y Hora**: 2026-09-29 10:15
- **Módulo**: `components/ui/PopupWrapper.tsx`
- **Autor**: Asistente de IA (Protocolo SDD / AGENTS.md)

---

## 1. Problema Detectado

Al configurar un popup con destino **Global ("Todas las páginas del sitio web")** y frecuencia **"Siempre"**, el popup se mostraba correctamente al cargar la primera página (ej. `/`). No obstante, si el usuario cerraba el popup pulsando la "X" o el botón de acción y posteriormente navegaba a otra página a través del menú (por ejemplo `/admision` o `/contacto`), el popup no volvía a desplegarse en las siguientes páginas durante la misma sesión de navegación.

---

## 2. Diagnóstico y Causa Raíz

1. **Persistencia del Root Layout en Next.js SPA**:
   `PopupWrapper` está montado en `app/layout.tsx`. En la arquitectura App Router de Next.js, las navegaciones entre páginas del lado del cliente (`Link`, `useRouter`) no desmontan el Root Layout, manteniendo intacto el estado local de React.

2. **Bloqueo por `dismissedId` en memoria**:
   Al descartar el popup, la función `handleDismiss()` ejecutaba:
   ```typescript
   setDismissedId(activePopup.id);
   ```
   Esa variable `dismissedId` quedaba fijada con el ID del popup cerrado (ej. `11`).

3. **Filtrado Permanente en Transiciones**:
   Al cambiar de página (`pathname`), el selector reactivo `activePopup` (`useMemo`) volvía a ejecutarse pero encontraba:
   ```typescript
   if (dismissedId === p.id) return false;
   ```
   Esto bloqueaba permanentemente el popup en toda la sesión SPA, impidiendo que los popups configurados con frecuencia **"Siempre"** cumplieran con su propósito de advertir al usuario en cada página visitada.

4. **Condición de carrera en timeouts de descarte**:
   Si el usuario cerraba el popup y rápidamente hacía clic en un enlace de navegación antes de cumplirse los 400ms de animación de salida, el temporizador pendiente de `setTimeout` podía dispararse en la nueva ruta e invalidar la visibilidad.

---

## 3. Solución Implementada

En [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx):

1. **Reinicio de descarte por `pathname`**:
   Se introdujo un efecto sincronizado con `pathname` que limpia cualquier temporizador de descarte pendiente y restablece `dismissedId` a `null` al cambiar de ruta:
   ```typescript
   const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
     if (dismissTimerRef.current) {
       clearTimeout(dismissTimerRef.current);
       dismissTimerRef.current = null;
     }
     setDismissedId(null);
   }, [pathname]);
   ```

2. **Control de visibilidad y animación re-entrante**:
   Se agregó `pathname` a las dependencias del efecto de visibilidad para que, al transicionar a una página donde el popup sea elegible, se dispare de forma controlada la animación de entrada tras 200ms:
   ```typescript
   useEffect(() => {
     if (activePopup) {
       const timer = setTimeout(() => {
         setVisible(true);
       }, 200);
       return () => {
         clearTimeout(timer);
         setVisible(false);
       };
     } else {
       setVisible(false);
     }
   }, [activePopup, pathname]);
   ```

3. **Protección de persistencia en `localStorage`**:
   * Si la frecuencia es **"Siempre"**: No escribe en `localStorage`. Al navegar a otra página, `dismissedId` se limpia y el popup vuelve a aparecer en la nueva vista.
   * Si la frecuencia es **"Una vez al día"** o **"Una vez por sesión"**: Se mantiene el registro en `localStorage` (`popup_read_<id>`), por lo que el popup no vuelve a mostrarse en ninguna otra página aunque se cambie de ruta.

---

## 4. Archivos Modificados

* [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx): Manejo reactivo de descarte por cambio de ruta y temporizador seguro con `useRef`.
* [AGENTS.md](file:///c:/Proyectos/colegio-acropolis/AGENTS.md): Registro obligatorio de protocolo de respuesta (Analizar, Planificar, Prompt con `/goal`).

---

## 5. Resultado Esperado y Criterios de Aceptación

* Popups globales con frecuencia "Siempre" aparecen en cada ruta navegada, aun cuando el usuario los haya cerrado en la página anterior.
* Popups con frecuencia "Una vez" o "Una vez al día" quedan descartados definitivamente tras su primer cierre.
* Transiciones suaves sin saltos bruscos ni condiciones de carrera al navegar rápidamente entre páginas.
* Compilación TypeScript impecable (`npx tsc --noEmit` sin errores).
