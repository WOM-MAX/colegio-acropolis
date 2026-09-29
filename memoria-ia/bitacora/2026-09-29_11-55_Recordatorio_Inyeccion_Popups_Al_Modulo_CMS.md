# Recordatorio Crítico: Inyección de Mejoras de Popups al Módulo CMS Independiente

**Fecha y Hora:** 2026-09-29 11:55  
**Autor:** Antigravity (Pair Programming con Administrador)  
**Estado:** PENDIENTE DE SINCRONIZACIÓN / ALERTA DE CONTINUIDAD  
**Módulo Destino:** CMS como módulo independiente en desarrollo

---

## 1. Contexto del Requerimiento
Durante la sesión del 28 y 29 de septiembre de 2026, el sistema de popups de `colegio-acropolis` experimentó una evolución arquitectónica mayor que no está presente en el módulo CMS independiente que se está construyendo en paralelo. 

**Directiva Mandatoria:** Al reiniciar labores en el CMS o consultar sobre este módulo, el asistente DEBE recordar activamente al desarrollador que se deben portar/inyectar estas modificaciones para evitar divergencias o regresiones de diseño.

---

## 2. Inventario de Modificaciones a Inyectar en el CMS

### A. Capa de Datos (Neon PostgreSQL / Drizzle)
1. **Columna `paginaDestino`:**
   - `varchar('pagina_destino', { length: 255 }).default('/').notNull()`
   - Aislamiento estricto de anuncios por ruta específica (`/`, `/admision`, `/quienes-somos`, etc.).
2. **Columna `colorTextoBoton`:**
   - `varchar('color_texto_boton', { length: 20 }).default('#ffffff').notNull()`
   - Contraste tipográfico independiente para accesibilidad y diseño del CTA.
3. **Columna `efectoVisual`:**
   - `varchar('efecto_visual', { length: 50 }).default('ninguno').notNull()`
   - Opciones: `ninguno`, `cascada_digital`, `confeti`, `halo_radiante`.

### B. Módulo de Efectos Ambientales (`components/ui/AmbientEffects.tsx`)
- Implementación de Canvas 2D ultraligero y CSS Keyframes:
  * `DigitalRainCanvas`: Cascada perimetral de 0 y 1 a 30 FPS optimizado para CPU.
  * `ConfettiCanvas`: Partículas multicolores con balanceo sinusoidal suave.
  * `HaloRadiante`: Aura luminosa pulsante perimetral (`@keyframes haloPulse`).
- Gestión de ciclo de vida con auto-limpieza al desmontar (`cancelAnimationFrame`).

### C. Panel de Administración (`PopupForm.tsx`)
- Paletas de estilo en 1 clic (Institucional, Ciencia / Tech, Celebración, Alerta Urgente, Noche Fucsia).
- Selector de páginas estándar con detección dinámica de páginas y artículos del blog.
- Eliminación de la opción conflictiva "Todas las páginas", estableciendo la portada `/` como default.
- Vista Previa en Vivo 1:1 sincronizada con soporte para modales `solo-imagen` y atmósfera ambiental interactiva en tiempo real.

### D. Renderizado en Cliente (`PopupWrapper.tsx`)
- Soporte multi-popup no conflictivo (1 banner + 1 elemento flotante simultáneos).
- Priorización automática ante colisiones de modales centrales.
- Control de sesión independiente vía `sessionStorage` para frecuencia `siempre` (no reaparece en la misma sesión si el usuario ya lo cerró).
- Persistencia por día o permanente vía `localStorage` para `una_vez_por_dia` y `una_vez`.
- Normalización automática de URLs internas (`normalizeInternalUrl`) para preservar navegación SPA.

---

## 3. Próximo Paso al Reanudar en Colegio Acrópolis / CMS
- Revisar esta bitácora y ejecutar la transferencia de los archivos listados hacia el repositorio o paquete del CMS modular.
