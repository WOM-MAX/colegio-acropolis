# Bitácora de Sesión: Rediseño Integral 3D del Módulo de Calendarios de Evaluaciones

**Fecha:** 2026-09-02 11:52  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/home/CalendariosTabsClient.tsx`

---

## 📌 1. Diagnóstico de los 3 Estados (Parvularia, Básica y Media)

1. **Problema de "Blanco sobre Blanco" y Falta de Profundidad:**
   - La cabecera anterior era casi transparente y el fondo interior era blanco, eliminando el contraste con las tarjetas.
2. **Píldoras Simples vs Tarjetas 3D:**
   - Los cursos eran botones genéricos tipo lista.
3. **Desolación en Parvularia:**
   - Cuando había 1 curso (Kinder A), quedaba como un elemento solitario y desolado en una caja gigante.

---

## 🛠️ 2. Solución Implementada en `CalendariosTabsClient.tsx`

1. **Cabecera Vibrante 3D por Ciclo:**
   - Banner superior con gradiente institucional enriquecido (Dorado para Parvularia, Fucsia para Básica, Azul Acrópolis para Media), icono 3D con *glassmorphism* (`bg-white/15 backdrop-blur-md`), insignia de nivel escolar y tipografía nítida blanca con sombra.

2. **Bandeja de Cursos en Slate (`#F1F4F9`):**
   - Ofrece un contraste perimetral de 360° para que las tarjetas blancas de los cursos se eleven con fuerza tridimensional.

3. **Tarjetas de Cursos 3D Tipo Pasaporte:**
   - Barra superior de color de acento temático.
   - Icono de calendario en marco interactivo.
   - Tipografía en tinta oscura (`text-slate-900`) con subtítulo editorial.
   - Botón de acción con flecha animada y elevación reactiva (`hover:-translate-y-1.5 hover:shadow-xl`).

4. **Tarjeta Destacada de Parvularia (Featured Card):**
   - Cuando hay 1 o 2 cursos, se presenta un layout horizontal destacado de alta definición con badge de nivel, descripción e icono ampliado, evitando la sensación de vacío.

---

## ✅ 3. Verificación
- `npx tsc --noEmit` completado con 0 errores.
