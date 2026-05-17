<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reglas del Proyecto Colegio Acrópolis

## 📋 Documentación Obligatoria de Arreglos

Cada vez que se realice un arreglo, optimización o cambio arquitectónico importante:

1. **ANTES de proponer cambios:** Leer TODOS los archivos en `arreglos/` para entender qué se ha intentado antes y no repetir trabajo.
2. **DESPUÉS de implementar:** Crear un archivo markdown en `arreglos/` con el formato:
   - Nombre: `YYYY-MM-DD_HH-MM_Descripcion_Breve.md`
   - Contenido: Problema detectado, hipótesis descartadas, causa raíz, solución implementada, archivos modificados, resultado esperado, próximos pasos si falla.
3. **Si un arreglo anterior tiene "Próximos Pasos":** Evaluar si aplican al problema actual antes de investigar desde cero.

## 🗄️ Arquitectura Neon (Scale-to-Zero)

- **Base de datos:** Neon PostgreSQL (Plan Hobby/Free — 191.9 compute hours/mes)
- **Autosuspend:** 5 minutos de inactividad → la BD se duerme
- **Estrategia de caché:** `unstable_cache` con TTL de 24h (`revalidate: 86400`) en TODAS las rutas públicas
- **Frescura de datos:** Controlada por `revalidatePath()` / `revalidateTag()` en las server actions del admin (invalidación on-demand)
- **NUNCA usar `revalidate: 3600`** ni TTLs cortos en rutas públicas — causa despertares periódicos que impiden scale-to-zero
- **Rutas dinámicas:** Protegidas con patrón "Whitelist Cache Shield" (ver arreglo del 16/05/2026)
