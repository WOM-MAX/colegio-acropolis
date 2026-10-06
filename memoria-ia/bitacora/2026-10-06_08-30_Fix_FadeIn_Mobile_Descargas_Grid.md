# Arreglo Tecnico: Correccion de Visibilidad Mobile en Seccion Descargas (Framer Motion FadeIn)

- **Fecha:** 06 de Octubre de 2026
- **Hora:** 08:30 GMT-3
- **Proyecto:** colegio-acropolis
- **Area:** Componentes UI / Responsive Mobile / Framer Motion
- **Autor:** Antigravity (Pair Programming con Administrador)
- **Estado:** RESUELTO

---

## 1. Problema Detectado

Tras añadir un nuevo bloque en el CMS de la pagina de inicio (bloque de tipo `IMAGEN_TEXTO`: "Canal de Denuncias") ubicado inmediatamente despues de la seccion institucional "Zona de Descargas Rapidas" (`HOME_DESCARGAS`), en dispositivos moviles (celulares) ocurria la siguiente anomalia visual:
1. La seccion de "Zona de Descargas Rapidas" desaparecia por completo de la pantalla, volviendose invisible.
2. En su lugar quedaba un espacio en blanco de gran altura (mas de 3.000 pixeles de vacio blanco) entre la seccion anterior (Calendarios de Evaluaciones) y la seccion nueva (Canal de Denuncias).
3. En computadores (desktop) la seccion de descargas se visualizaba con normalidad.

---

## 2. Hipotesis Descartadas

1. **Error de consulta o datos vacios en la base de datos Neon PostgreSQL:**
   - Descartado: La auditoria del HTML server-side renderizado demostro que los 6 documentos oficiales (Horarios, Reglamento Interno, Higiene y Seguridad, Evaluacion, Uniforme, Utiles 2026) con sus URLs de Cloudinary y enlaces de descarga estaban 100% presentes en el arbol DOM generado por el servidor.
2. **Conflicto de CSS, clases `hidden` o colapso de flex/grid:**
   - Descartado: El contenedor de `DownloadsGrid.tsx` utiliza `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` con dimensiones de tarjetas estandar (`aspect-square` y `rounded-3xl`).
3. **Interferencia o solapamiento del nuevo bloque `ImagenTextoBlock.tsx`:**
   - Descartado: El bloque de Canal de Denuncias tiene flujo estatico normal en el DOM y se renderizaba correctamente con su imagen y tipografia sin margenes negativos.

---

## 3. Causa Raiz

La falla radicaba en la configuracion del componente contenedor de animacion `components/ui/FadeIn.tsx`:

```tsx
// Valor previo causante del error:
viewportAmount = 0.2;
...
viewport={{ once: true, amount: viewportAmount as any }}
```

### Explicacion Matematica del Fallo en Dispositivos Moviles:
1. **Altura de la seccion en Desktop vs Mobile:**
   - En desktop, los 6 documentos se distribuyen en 4 columnas (2 filas), alcanzando una altura aproximada de ~850px.
   - En dispositivos moviles (< 640px), los 6 documentos se apilan verticalmente en una sola columna (`grid-cols-1`). Cada tarjeta mide ~530px (imagen 1:1 + textos + botones). Sumando la cabecera y paddings, la seccion alcanza una altura total de **~3.428px**.
2. **El calculo del umbral (`threshold`) en IntersectionObserver:**
   - La propiedad `amount: 0.2` de Framer Motion exige que al menos el **20% de la altura total del elemento** este visible simultaneamente dentro de la ventana de visualizacion (`viewport`).
   - El 20% de 3.428px equivale a **685,6px**.
   - La mayoria de las pantallas de celulares (excluyendo la barra de navegacion superior e inferior del navegador movil) disponen de un viewport util de entre **600px y 660px**.
   - Por lo tanto, la proporcion de interseccion maxima que el elemento podia alcanzar al cubrir la pantalla completa era `640 / 3428 = 0,186` (18,6%).
   - Como 18,6% es menor al 20% (0,20) exigido, la condicion de Framer Motion **NUNCA se cumplia en el telefono**.
3. **El estado visual resultante:**
   - Al no dispararse `whileInView`, el contenedor `<motion.div>` permanecia indefinidamente bloqueado en su estado inicial: `style="opacity: 0; transform: translateY(40px);"`.
   - Al tener `opacity: 0`, los 3.428px de altura de las 6 tarjetas ocupaban espacio en el flujo pero eran 100% transparentes, mostrando el fondo blanco de la pagina y generando un enorme espacio vacio visible de mas de 3.000px.

---

## 4. Solucion Implementada

1. **Ajuste del umbral por defecto en `components/ui/FadeIn.tsx`:**
   - Se modifico el parametro por defecto `viewportAmount` de `0.2` a `'some'`.
   - En Framer Motion, `amount: 'some'` utiliza deteccion de interseccion inmediata (cualquier pixel del elemento visible en pantalla dispara la animacion).
   - Esto garantiza que tanto en celulares como en pantallas pequeñas, cualquier seccion (sin importar si mide 500px o 5.000px) active suavemente su transicion a `opacity: 1` tan pronto como su borde superior ingresa al campo visual del usuario.
2. **Limpieza de tipado TypeScript:**
   - Se removio el casteo inseguro `as any` en `FadeIn.tsx` al estar tipado como `number | 'some' | 'all'`.

---

## 5. Archivos Modificados

- `components/ui/FadeIn.tsx`: Parametro por defecto `viewportAmount = 'some'` y tipado estricto.

---

## 6. Resultado Esperado

- En celulares, la seccion "Documentos y Descargas" se hace visible de manera inmediata y fluida tan pronto el usuario llega a ella tras revisar Calendarios de Evaluaciones.
- Se elimina el espacio vacio en blanco entre Calendarios y Canal de Denuncias.
- No se afecta el rendimiento ni el comportamiento en computadores de escritorio.

---

## 7. Proximos Pasos si Falla

- Si en algun dispositivo de gama muy baja con JavaScript desactivado se desea garantizar visibilidad sin depender del ciclo de Framer Motion, desacoplar el wrapper `<FadeIn>` de `HOME_DESCARGAS` en `BlockRenderer.tsx`, renderizando `<DownloadsGrid />` de forma nativa sin opacidad inicial.
