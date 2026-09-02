# Hero Interactivo con Scrubbing de Fotogramas en Canvas HTML5 (Transición Noche a Día)

**Fecha:** 1 de Septiembre de 2026  
**Hora:** 10:05 GMT-4  
**Proyecto:** colegio-acropolis  

## Problema Detectado
El scrubbing anterior basado en cross-fade de dos imágenes fijas (noche y día) no brindaba una sensación cinematográfica fluida y permitía que el usuario scrolleara rápidamente hacia abajo sin apreciar la transición completa del amanecer.

## Hipótesis Descartadas
1. ❌ **Scrubbing directo sobre elemento `<video>` HTML5 (`video.currentTime = progress * duration`):** Descartado debido a latencias inherentes a la decodificación de video en el navegador al manipular `currentTime` rápidamente, lo que genera saltos y artefactos visuales notorios.
2. ❌ **Pista de scroll corta (`150vh`):** Descartada porque provocaba que el usuario saliera del Hero antes de observar la iluminación progresiva del frontis.

## Causa Raíz
Para lograr un efecto de scrubbing instantáneo y fluido (tipo Apple / Canvas Scroll), es indispensable desacoplar el video en una secuencia discreta de fotogramas precargados en memoria y dibujados cuadro a cuadro en un `<canvas>` acelerado por hardware sincronizado con `requestAnimationFrame`.

## Solución Implementada
1. **Extracción y Optimización de Fotogramas:**
   - Se creó el script `scripts/extract-hero-frames.py` que procesó `public/VIDEO NUEVO HERO/VIDEO NUEVO HERO.mp4` (121 fotogramas a 24 fps, 864x496) y generó la secuencia `public/hero-frames/frame_000.webp` hasta `frame_120.webp` con compresión WebP optimizada.
2. **Motor de Renderizado en Canvas HTML5 (`components/home/Hero.tsx`):**
   - Carga y renderizado inmediato del primer fotograma (`frame_000.webp`) garantizando un LCP óptimo sin pantallas en blanco.
   - Pre-carga en buffer de memoria de los 120 fotogramas restantes.
   - Escalado responsivo `object-fit: cover` adaptado al `devicePixelRatio` para máxima nitidez en cualquier resolución de pantalla.
   - Desacoplamiento de eventos de scroll mediante `requestAnimationFrame` y fallback dinámico al fotograma más cercano si aún se encuentra cargando.
3. **Integración de Video Versión 2 en Alta Definición (150 Fotogramas):**
   - Se procesó `VIDEO NUEVO HERO-VERSIÓN 2.mp4` (150 fotogramas a 30 fps, 1284x716) generando la secuencia completa en `public/hero-frames/frame_000.webp` hasta `frame_149.webp`.
4. **Restauración de las Dimensiones y Tarjeta de Cristal Original:**
   - Se reincorporó la estructura de dimensiones aprobada: `h-[480px] sm:h-[550px] lg:h-[600px]` en `max-w-7xl` con `rounded-3xl` y sombras profundas.
   - Posición vertical con margen holgado `pt-6 sm:pt-10` idéntico a la web actual.
   - Tarjeta de cristal flotante original: `bg-azul-acropolis/40 p-5 sm:p-6 lg:p-8 backdrop-blur-2xl border border-white/30` con títulos en amarillo dorado `text-amarillo` y botones originales en cyan y cristal.
   - **Redacción Atemporal:** La segunda tarjeta muestra *"Fundado en 2003"* y *"Más de dos décadas construyendo el futuro de Puente Alto con dedicación, valores y excelencia valórica"*, quedando general y sin requerir mantenimiento periódico.
5. **Scrubbing Compacto sin Espacio Muerto:**
   - Pista de desplazamiento calibrada a `h-[105vh] sm:h-[110vh]`, logrando que al completarse el amanecer, la sección *Eventos del Mes* continúe de forma inmediata y continua sin ningún vacío inferior.
6. **Diseño de Tarjetas Glassmorphism Premium:**
   - Tarjetas estilizadas con tipografía limpia, micro-badges dorados y botones con interactividad moderna.

### Archivos Creados y Modificados:
- [scripts/extract-hero-frames.py](file:///c:/Proyectos/colegio-acropolis/scripts/extract-hero-frames.py) [NUEVO]
- [public/hero-frames/](file:///c:/Proyectos/colegio-acropolis/public/hero-frames/) [NUEVO - 121 fotogramas WebP]
- [components/home/Hero.tsx](file:///c:/Proyectos/colegio-acropolis/components/home/Hero.tsx) [MODIFICADO]

## Resultado Esperado
Al ingresar a la página de inicio, el usuario visualiza de inmediato el frontis nocturno. Al hacer scroll hacia abajo, la vista permanece anclada en el Hero mientras los 121 fotogramas reproducen suavemente el amanecer cuadro a cuadro a 60/120 fps. Solo cuando el frontis se ilumina por completo con la luz del día, el scroll desciende de forma continua hacia las secciones de eventos, journal y calendarios.

## Próximos Pasos si Falla
- Si se desea ajustar la velocidad o longitud del recorrido de scroll, modificar la clase `h-[280vh] sm:h-[320vh]` en el contenedor raíz de `Hero.tsx`.
