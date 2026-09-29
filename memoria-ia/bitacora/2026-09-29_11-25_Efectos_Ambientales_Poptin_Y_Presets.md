# Bitácora de Implementación: Efectos Ambientales Perimetrales (Estilo Poptin) y Presets de Estilo

**Fecha y Hora:** 2026-09-29 11:25  
**Autor:** Antigravity (Pair Programming con Administrador)  
**Módulo:** Popups del Sistema Escolar (`colegio-acropolis`)

---

## 1. Problema Detectado
Los popups del colegio contaban con soporte por página específica, modales de solo imagen y control de sesión, pero su estética era estándar y carecía de dinamismo perimetral envolvente. Plataformas líderes de captación como Poptin destacan por utilizar micro-efectos ambientales perimetrales (ej. cascada digital de ceros y unos, confeti festivo y halos radiantes) que dirigen la mirada del visitante al modal sin generar sobrecarga visual ni entorpecer la lectura del comunicado. Además, se requería una forma ágil de configurar paletas cromáticas armoniosas en 1 solo clic.

---

## 2. Hipótesis Descartadas
1. **Librerías pesadas de partículas externas (ej. `tsparticles` o `canvas-confetti`):**  
   *Descartada:* Incrementaría el peso del bundle JavaScript innecesariamente y podría perjudicar la métrica LCP/FID del sitio y la arquitectura Scale-to-Zero.
2. **Efectos renderizados únicamente mediante imágenes GIF o WebP de fondo:**  
   *Descartada:* Los GIFs consumen ancho de banda, se ven pixelados en pantallas Retina y no se adaptan de forma reactiva al tamaño de pantalla del visitante.
3. **Efectos ejecutados sin aislamiento de ciclo de vida (sin auto-limpieza):**  
   *Descartada:* Si los bucles `requestAnimationFrame` no se cancelan al desmontar el popup, se generaría consumo persistente de CPU.

---

## 3. Causa Raíz / Justificación
Se requería una solución nativa ultraligera escrita en Canvas 2D y CSS Keyframes con consumo 0 KB de dependencias externas, encapsulada de manera que:
- Solo se active cuando el popup sea visible.
- Cancele automáticamente sus bucles de animación al cerrar el modal o cambiar de página.
- Esté integrada en Neon PostgreSQL, la API pública `/api/popups`, el panel de administración con selector y presets de 1 clic, y la Vista Previa en Vivo en tiempo real.

---

## 4. Solución Implementada

### A. Base de Datos y Persistencia Neon (PostgreSQL)
1. Modificación de [lib/db/schema.ts](file:///c:/Proyectos/colegio-acropolis/lib/db/schema.ts): Agregada columna `efectoVisual` (`varchar(50).default('ninguno').notNull()`).
2. Script de migración idempotente [drizzle/0003_efecto_visual.sql](file:///c:/Proyectos/colegio-acropolis/drizzle/0003_efecto_visual.sql) ejecutado exitosamente en Neon PostgreSQL:
   ```sql
   ALTER TABLE "popups" ADD COLUMN IF NOT EXISTS "efecto_visual" varchar(50) DEFAULT 'ninguno' NOT NULL;
   ```
3. Actualización de API y Server Actions:
   - [app/api/popups/route.ts](file:///c:/Proyectos/colegio-acropolis/app/api/popups/route.ts): Exposición de `efectoVisual: popups.efectoVisual`.
   - [app/admin/popups/actions.ts](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/actions.ts): Persistencia de `efectoVisual` en `createPopup` y `updatePopup`.

### B. Módulo de Efectos Ambientales Ultraligero
Creación de [components/ui/AmbientEffects.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/AmbientEffects.tsx):
- **Cascada Digital (`cascada_digital`):** Canvas 2D que simula caída de caracteres binarios ('0' y '1') con rastro de desvanecimiento suave (`rgba(10, 15, 29, 0.18)`) y partículas de brillo esmeralda/blanco, limitado a 30 FPS para máximo rendimiento de CPU y batería.
- **Confeti Festivo (`confeti`):** Sistema de 40 a 65 piezas poligonales de confeti flotante multicolor con balanceo sinusoidal suave y rotación fluida, ideal para matrículas, aniversarios y bienvenidas.
- **Halo Radiante (`halo_radiante`):** Aura luminosa perimetral dual (azul institucional y violeta radiante) animada mediante pulsaciones CSS `@keyframes haloPulse`.
- Auto-limpieza completa mediante `cancelAnimationFrame` y remoción de `resize` listeners al desmontar el componente.

### C. Panel de Administración y Vista Previa en Vivo
Actualización de [app/admin/popups/components/PopupForm.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/components/PopupForm.tsx):
- Selector de **Efecto Ambiental Perimetral** con opciones:
  * `ninguno`: Sobrio y formal.
  * `cascada_digital`: Lluvia binaria tech / Matrix.
  * `confeti`: Confeti festivo de bienvenida o matrícula.
  * `halo_radiante`: Aura luminosa pulsante alrededor del popup.
- Paletas de color temáticas en 1 clic:
  * **Institucional:** Fondo blanco, texto oscuro, botón azul Acrópolis.
  * **Ciencia / Tech:** Modo oscuro `#0f172a`, botón esmeralda `#10b981`, cascada digital.
  * **Celebración:** Fondo claro, botón naranja festivo, confeti ambiental.
  * **Alerta Urgente:** Fondo carmesí oscuro `#450a0a`, botón rojo brillante, halo radiante.
  * **Noche Fucsia:** Fondo índigo oscuro, botón fucsia, halo radiante.
- Integración en la **Vista Previa en Vivo**:
  * Simulación del backdrop del navegador con `<AmbientEffectLayer>` activo en tiempo real.
  * Reflejo inmediato del halo radiante en la tarjeta (`box-shadow` pulsante perimetral).
  * Fila descriptiva en la tabla resumen inferior: `Efecto Ambiental: [efecto]`.

### D. Renderizado en Cliente Final
Actualización de [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx):
- Mapeo de `efectoVisual` en `fetchPopups`.
- Inyección de `<AmbientEffectLayer efectoVisual={popup.efectoVisual} />` en el backdrop perimetral de modales.
- Aplicación de la clase `popup-halo-radiante` en la tarjeta modal para generar el aura pulsante.
- Inyección de estilos `@keyframes haloPulse` en `<style jsx global>`.

---

## 5. Archivos Modificados / Creados
- [lib/db/schema.ts](file:///c:/Proyectos/colegio-acropolis/lib/db/schema.ts)
- [drizzle/0003_efecto_visual.sql](file:///c:/Proyectos/colegio-acropolis/drizzle/0003_efecto_visual.sql)
- [app/api/popups/route.ts](file:///c:/Proyectos/colegio-acropolis/app/api/popups/route.ts)
- [app/admin/popups/actions.ts](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/actions.ts)
- [components/ui/AmbientEffects.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/AmbientEffects.tsx) *(Nuevo)*
- [components/ui/PopupWrapper.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/PopupWrapper.tsx)
- [app/admin/popups/components/PopupForm.tsx](file:///c:/Proyectos/colegio-acropolis/app/admin/popups/components/PopupForm.tsx)

---

## 6. Resultado Esperado y Verificación
- `npx tsc --noEmit` ejecuta con **código de salida 0 (cero errores)**.
- La llamada a `http://localhost:3000/api/popups` entrega la propiedad `efectoVisual: "ninguno"` o el efecto configurado.
- En el formulario de administración (`/admin/popups/nuevo` y `/admin/popups/[id]/editar`), al presionar un preset temático o cambiar el selector de efecto ambiental, la columna de Vista Previa en Vivo actualiza la atmósfera visual en tiempo real.
- En el sitio público, cuando se despliega un popup con efecto configurado, las partículas o halos se renderizan suavemente en el perímetro del modal sin bloquear clicks ni afectar el rendimiento.

---

## 7. Próximos Pasos si Falla
- Si en un dispositivo de muy bajos recursos el Canvas de lluvia digital experimenta caídas de frames, se puede reducir la densidad de columnas ajustando `fontSize` de 14 a 18 en `DigitalRainCanvas`.
- Si se desea agregar efectos adicionales en el futuro (ej. copos de nieve de invierno o fuegos artificiales de año nuevo), se pueden incorporar como nuevos casos dentro de [components/ui/AmbientEffects.tsx](file:///c:/Proyectos/colegio-acropolis/components/ui/AmbientEffects.tsx) sin tocar la base de datos más que añadiendo el nombre del identificador.
