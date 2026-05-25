# Arreglo: Warm-up Script Post-Despliegue
**Fecha:** 17 de Mayo de 2026
**Hora:** 12:38 GMT-4

## Problema Detectado
Después del despliegue de los TTLs de 24h (arreglo anterior), la BD seguía despertando esporádicamente por **cache misses**: cada página no visitada desde el deploy genera un query a la BD cuando un crawler o visitante la toca por primera vez.

## Causa Raíz
Cada deploy en Railway crea un contenedor nuevo con cachés vacías. Los ~30 URLs del sitio se cachean de forma escalonada conforme crawlers/usuarios los visitan, causando múltiples despertares dispersos durante horas.

Segundo problema: las cachés expiran también de forma escalonada (cada una 24h después de haber sido llenada), perpetuando el patrón.

## Solución Implementada
Warm-up script (`scripts/warmup.mjs`) que se ejecuta automáticamente después de cada despliegue:

1. Espera a que el servidor esté listo (polling a `/api/health`)
2. Fase 1: Fetch de 10 rutas estáticas conocidas
3. Fase 2: Fetch de `/sitemap.xml`, parsea URLs dinámicas
4. Fase 3: Fetch de cada URL dinámica del sitemap
5. Todas las cachés se llenan en ~30 segundos

### Archivos modificados:
1. `scripts/warmup.mjs` — Script de warm-up (NUEVO)
2. `Dockerfile` — Agrega COPY del script al contenedor
3. `railway.json` — Cambia startCommand para ejecutar warmup después del servidor

### Comando de arranque:
```sh
node server.js & sleep 10 && node scripts/warmup.mjs; wait
```

## Resultado Esperado
- UN solo despertar concentrado al desplegar (~2-3 min)
- Todas las cachés expiran al mismo tiempo (24h después)
- UN solo despertar al expirar → ciclo repetible y predecible
- Consumo estimado: ~0.02 CU-h/día vs ~0.3 CU-h/día sin warmup

## Verificación
- Revisar logs de Railway: buscar `[warmup]` en stdout
- System Operations: después del cold-start, NO debe haber más Start/Suspend
- Gráfica nocturna: completamente plana

## Próximos Pasos si Falla
1. Verificar que `scripts/warmup.mjs` existe en el contenedor: logs dirán si el archivo no se encuentra
2. Si el warmup crashea, el servidor sigue corriendo (exit code 0)
3. Si las URLs del sitemap causan errores 404, revisar sitemap.ts
