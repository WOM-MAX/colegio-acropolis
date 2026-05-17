# Arreglo: Warmup Script Ignorado por Docker
**Fecha:** 17 de Mayo de 2026
**Hora:** 19:40 GMT-4

## Problema Detectado
Tras alinear todos los TTLs de la caché a 24 horas, las gráficas de Neon mostraban que la base de datos seguía despertando intermitentemente (cada 10 a 20 minutos). Al revisar los logs de Railway, se observó el siguiente patrón:

1. Se ejecutaban consultas a la base de datos para obtener metadata de la página `journal` (`"nombre" from "journal_categorias"`).
2. Se ejecutaban consultas para artículos individuales (ej. `"olimpidas-deportivas"`, `"reunion-de-apoderdos"`).

Esto ocurría porque los web crawlers (como Googlebot) u otros usuarios exploraban rutas dinámicas de los artículos. Aunque las rutas utilizan `unstable_cache`, la caché estaba **vacía** tras cada despliegue.

## Hipótesis
Existía un script `scripts/warmup.mjs` diseñado explícitamente para leer el `sitemap.xml` y hacer peticiones "en frío" a absolutamente todas las páginas y artículos del sitio inmediatamente después del despliegue, poblando así toda la caché de forma centralizada y permitiendo que Neon se durmiera tranquilamente durante las siguientes 24 horas.

Sin embargo, al revisar los logs de inicio de Railway, **no había ningún registro** (`[warmup] ...`) del script.

## Causa Raíz
El archivo `railway.json` tenía la siguiente instrucción:
```json
"deploy": {
  "startCommand": "node server.js & sleep 10 && node scripts/warmup.mjs; wait"
}
```
Pero en el mismo archivo `railway.json` se especificaba:
```json
"build": {
  "builder": "DOCKERFILE"
}
```
Cuando Railway usa Docker como constructor (builder), **ignora por completo el `startCommand` de `railway.json`** y confía exclusivamente en el `CMD` del `Dockerfile`.
Y el `CMD` en el `Dockerfile` era:
```dockerfile
CMD ["node", "server.js"]
```
Por lo tanto, el script de warmup *jamás* se ejecutó en producción, dejando la caché de los artículos completamente vulnerable al tráfico orgánico. Cada visita nueva despertaba a Neon.

## Solución Implementada
Se modificó el `CMD` en el `Dockerfile` para encadenar el proceso de servidor con el script de warmup de manera concurrente:

```dockerfile
CMD ["sh", "-c", "node server.js & sleep 10 && node scripts/warmup.mjs & wait"]
```

Con esto, el contenedor de Docker levantará Next.js, esperará 10 segundos a que esté listo y ejecutará el script de warmup, cerrando por completo el embudo de consultas a la base de datos y sellando la caché de los artículos dinámicos.

## Próximos Pasos (Si falla)
- Revisar los próximos logs de inicio de Railway para confirmar que aparezcan los mensajes de `[warmup] ✅ Server is ready` y `[warmup] 🏁 Complete!`.
- Si las métricas de Neon aún no se estabilizan, verificar si los componentes con `searchParams` (como la paginación `/journal?page=2`) están generando fugas no contempladas en el sitemap.
