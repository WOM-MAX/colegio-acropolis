# Reporte de Sellado de Rutas y Análisis de Vulnerabilidad (Scale to Zero)
**Fecha:** 16 de Mayo de 2026
**Hora:** 19:15 GMT-4
**Proyecto:** colegio-acropolis

## 1. Análisis Exhaustivo de Vulnerabilidades (Bot Scanning)
Se realizó un análisis completo del enrutamiento de la aplicación (`app/`) para identificar todas las rutas que interactúan con la base de datos (Neón) y evaluar si podían ser despertadas por tráfico no autorizado (bots, crawlers, scripts automatizados).

### Hallazgos:
1.  **Rutas Dinámicas Públicas sin Escudo:** 
    Las rutas dinámicas basadas en parámetros (como `[slug]` o `[id]`) son altamente vulnerables. Un bot puede intentar URLs aleatorias (ej. `/wp-admin`, `/journal/test-123`, `/galeria/999`) y, al no existir en la caché, Next.js ejecuta la función de búsqueda en la BD para generar un 404, **despertando a Neón**.
    *   `app/(public)/[slug]/page.tsx` (Ruta general de páginas)
    *   `app/(public)/journal/[slug]/page.tsx` (Ruta de noticias)
    *   `app/(public)/galeria/[id]/page.tsx` (Ruta de galerías)
2.  **Rutas API (Endpoints):**
    *   `/api/eventos` y `/api/popups`: Utilizan caché diaria o por horas. Solo despiertan la BD la primera vez que se solicitan en ese intervalo. Son seguras frente a escaneos repetitivos.
    *   `/api/health`: Se eliminó la conexión a BD en arreglos anteriores. Segura.
    *   `/api/upload` y `/api/*/exportar`: Protegidas por autenticación de sesión. Seguras.
3.  **Rutas de Administración (`/admin/*`):**
    *   Todas estas rutas tienen configurado `export const dynamic = 'force-dynamic'`, lo que normalmente forzaría una lectura de la BD en cada carga.
    *   **PERO**, están detrás del `middleware.ts`, el cual valida el token JWT (`jose`) de la cookie de sesión *antes* de cargar la página.
    *   La validación del token no toca la base de datos. Si un bot entra a `/admin/*`, es rechazado en el middleware (memoria pura) y redirigido al login. Son seguras.
    *   La página `/admin/login` es estática de cliente. El POST a `/api/auth/login` sí toca la BD, pero es el comportamiento esperado para intentar loguearse.

## 2. Soluciones Implementadas
Se implementó el patrón arquitectónico de **"Escudo de Lista Blanca en Memoria" (Whitelist Cache Shield)** en las 3 rutas dinámicas vulnerables:

1.  **En `/[slug]`:** Creación de `getValidSlugs()`
2.  **En `/journal/[slug]`:** Creación de `getValidJournalSlugs()`
3.  **En `/galeria/[id]`:** Creación de `getValidGaleriaIds()`

### Cómo funciona el escudo:
Cada vez que se recompila la caché (cada 1 hora), el servidor guarda un array simple de strings con todos los slugs/IDs válidos que existen en la BD.
Cuando entra una petición (ej. bot solicitando `/journal/hack-intento`), el código revisa si `hack-intento` existe en el array. Como no existe, dispara un `notFound() (Error 404)` **inmediatamente**. La consulta pesada a la base de datos que trae el contenido del artículo NUNCA se ejecuta.

## 3. Conclusión y Estado Actual
Toda la superficie de ataque público está sellada y cacheada. Ningún bot escaneando URLs aleatorias debería ser capaz de generar consultas SQL y despertar a la base de datos Neón. 
La aplicación ahora está estructuralmente preparada para mantener su estado "Inactivo (Scale to Zero)" durante los periodos donde no haya administración activa ni expiración de cachés.

## 4. Próximos Pasos (Memoria Auxiliar)
*   Si Neón sigue despertando, el problema ya no está en el tráfico web público, sino posiblemente en conexiones persistentes de herramientas de desarrollo locales abiertas (Drizzle Studio, conexiones desde el IDE local del usuario, etc.) o tareas programadas externas (cron jobs).
*   Antes de hacer más refactorización de rutas, se debe verificar rigurosamente que el entorno local de desarrollo esté cerrado.
