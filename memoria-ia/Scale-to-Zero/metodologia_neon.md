# Metodología de Optimización: Neon Scale-to-Zero

## 🎯 Objetivo Principal
Lograr que la base de datos Neon PostgreSQL (Plan Hobby/Free) pase a un estado inactivo (`Idle` / "dormida") y detenga el consumo de horas de cómputo durante períodos sin solicitudes reales. Esto permite operar cómodamente dentro de las 191.9 horas mensuales gratuitas.

## 🧠 Conceptos Clave
- **Autosuspend Delay:** Configuración en Neon (típicamente 5 minutos). Si la BD no recibe consultas durante este tiempo, se suspende.
- **Rutas Públicas Dinámicas:** Por defecto, Next.js reevalúa o ejecuta consultas si los parámetros dinámicos cambian o si hay fetches sin cache, lo que despierta la BD constantemente.
- **Whitelist Cache Shield:** Patrón arquitectónico que consiste en encapsular TODAS las consultas a la base de datos desde rutas públicas dentro de un caché a largo plazo (`unstable_cache` en Next.js), de modo que el tráfico web no requiera contactar la BD.

## 🛠️ Reglas de Implementación (Paso a Paso)

### 1. Eliminar Revalidaciones por Tiempo Corto
- **NUNCA** usar `export const revalidate = 3600` (o tiempos similares como 60, 300) en páginas o layouts (ej. `page.tsx`, `layout.tsx`).
- Las revalidaciones por tiempo (Time-based Revalidation) despiertan la BD de forma periódica en background cada vez que un usuario entra después del TTL.
- **Regla:** Eliminar todos los `export const revalidate` a nivel de archivo en rutas de acceso público.

### 2. Implementar "Whitelist Cache Shield" (unstable_cache)
- Todas las funciones en `lib/actions/` o `lib/db/` que obtienen datos para consumo público deben estar envueltas en `unstable_cache`.
- Usar un TTL larguísimo (ej. 24 horas `revalidate: 86400`) o idealmente sin TTL, confiando únicamente en la invalidación bajo demanda.
- **Ejemplo Correcto:**
  ```typescript
  export const getPublicEvents = unstable_cache(
    async () => {
      // Consulta a la DB (Drizzle, Prisma, etc.)
      return await db.query.events.findMany({...});
    },
    ['public-events-key'], // Cache Key
    {
      tags: ['events'],    // Cache Tag para invalidación
      revalidate: 86400    // TTL de respaldo (24h)
    }
  );
  ```

### 3. Invalidación Bajo Demanda (On-Demand Invalidation)
- Para mantener los datos frescos, la caché SÓLO debe invalidarse cuando un administrador hace un cambio.
- Dentro de las Server Actions del panel de administración (ej. crear un evento, editar un ajuste, borrar un registro), llamar a `revalidateTag()` o `revalidatePath()` según corresponda.
- **Ejemplo Correcto (en Server Action de Admin):**
  ```typescript
  export async function createEvent(data) {
    await db.insert(events).values(data);
    revalidateTag('events'); // Invalida el caché instantáneamente
  }
  ```

### 4. Erradicar Leaks de Conexión y Polling
- Evitar el uso de `setInterval` o llamadas recurrentes en Client Components que consulten indirectamente a la base de datos (e.g. componentes tipo "Ticker" o "Live News").
- Si hay un componente tipo "Ticker", este debe nutrirse de datos cacheados y **no** hacer fetch continuo al servidor sin una capa de caché robusta intermedia.

### 5. Warm-up Post-Deploy (Opcional pero Recomendado)
- Al hacer deploy (por ejemplo, en Railway/Vercel), Next.js podría no cachear ciertas rutas estáticas de inmediato si la BD tarda en despertar.
- Implementar un script (ej. `Warmup_Script_Post_Deploy`) que tras el despliegue visite programáticamente las rutas principales del sitio.
- Esto generará la caché inicial. Tras eso, el tráfico público leerá de la caché, y la BD se irá a dormir 5 minutos después.

## 🚦 Criterios de Aceptación (Verificación en Neon)
1. **Pestaña Metrics:** Las gráficas de CPU y RAM deben mostrar amplios valles marcados como `ENDPOINT INACTIVE`.
2. **Pestaña System Operations:** Deben observarse pares de eventos `Start compute` y `Suspend compute`.
3. **Duración:** La diferencia de tiempo entre un `Start` y un `Suspend` no provocado por admin debe ser exactamente igual al *Autosuspend delay* (ej. 5 minutos). Si es mayor a 6-10 minutos constantemente de manera autónoma, hay una fuga o leak que no está permitiendo la inactividad.

---
*Documento autogenerado para el entrenamiento e inicialización de futuros agentes de IA.*
