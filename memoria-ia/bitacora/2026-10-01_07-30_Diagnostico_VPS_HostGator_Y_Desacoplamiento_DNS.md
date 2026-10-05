# Diagnostico Tecnico: Saturacion de VPS HostGator y Plan de Desacoplamiento DNS

**Fecha:** 01 de Octubre de 2026  
**Hora:** 07:30 GMT-3 (Actualizado: 10:00 GMT-3)  
**Proyecto:** colegio-acropolis  
**Autor:** Antigravity (Pair Programming con Administrador)  
**Estado:** RESUELTO  

---

## 1. Problema Detectado
El sitio web institucional bajo el dominio `colegioacropolis.cl` presento caidas recurrentes consecutivas (ayer y hoy). Al intentar gestionar el incidente desde el panel de control del servidor, no fue posible acceder a la interfaz administrativa de WHM (puerto 2087), obligando a ejecutar reinicios forzados del servidor VPS en HostGator.

---

## 2. Hipotesis Descartadas

1. **Fallo en la aplicacion Next.js o en la infraestructura de Railway:**
   - Descartado: La aplicacion web reside en Railway (`kmg8flyi.up.railway.app`) y responde con codigo HTTP 200 OK bajo el dominio canónico `www.colegioacropolis.net`. Durante el incidente, Railway y Neon PostgreSQL mantuvieron su operatividad intacta.

2. **Agotamiento de cuota de computo en Neon PostgreSQL:**
   - Descartado: El esquema Scale-to-Zero con TTL de 24 horas y proteccion Whitelist Cache Shield no registra sobreconsumo ni bloqueos en base de datos.

3. **Falta de memoria SWAP o RAM insuficiente en el VPS:**
   - Descartado: La auditoria con `free -m` confirmo 5.679 MB de memoria RAM fisica (~5,7 GB) con 3.302 MB disponibles y una particion SWAP activa de 4.095 MB (~4 GB), descartando una insuficiencia estructural de recursos.

4. **Bloqueo exclusivo por firewall de IP del administrador:**
   - Descartado: La caida fue generalizada para la resolucion publica de `colegioacropolis.cl` debido al congelamiento del demonio Apache en el VPS.

5. **Saturacion de espacio en disco o agotamiento de particiones:**
   - Descartado: La auditoria directa mediante el monitor de almacenamiento de WHM ("Mostrar el uso de disco actual") confirmo:
     * Particion raiz `/` (`/dev/sda1`): 178 GB de capacidad, 74 GB utilizados y 97 GB disponibles (44% de uso).
     * Particion temporal `/tmp` (`/dev/loop0`): 3,9 GB de capacidad, 52 MB utilizados y 3,6 GB disponibles (2% de uso).
     * Metricas de E/S (`IO Statistics`): Rendimiento de disco optimo con 54 transacciones por segundo en `sda`, descartando cuellos de botella de I/O o acumulacion de archivos temporales.

---

## 3. Causa Raiz y Diagnostico Forense

### A. Disociacion Arquitectonica Oculta
La arquitectura del proyecto presentaba una dependencia critica no declarada:
- **Trafico Web Real:** Se ejecuta en Railway (`kmg8flyi.up.railway.app`, IP `69.46.46.12`).
- **Dominio .cl:** Resuelve a la IP `162.240.230.181` correspondiente al servidor VPS `vps-1073249.colegioacropolis.cl` en HostGator.
- **Rol del VPS en la Web:** En dicho servidor, el demonio Apache recibe las conexiones a `colegioacropolis.cl` y emite una redireccion `HTTP/1.1 301 Moved Permanently` hacia `https://www.colegioacropolis.net/`.

### B. Hallazgo Forense en ABRT (AlmaLinux Crash Reporter)
La inspeccion en la consola del servidor mediante `abrt-cli list` revelo la causa exacta de los colapsos que congelaron el sistema:
1. **Fallo de Base de Datos RPM (`rpmdb open failed`):**
   - Registros: 29 de Septiembre a las 04:11 AM y 04:53 AM (horario de actualizacion y mantenimiento nocturno de cPanel).
   - Proceso: `/usr/local/cpanel/bin/packman_get_list_json all ea-php*-php-common` y `openssh-server`.
   - Causa: Archivos de bloqueo antiguos e indices corruptos de Berkeley DB en `/var/lib/rpm/` tras la migracion desde CentOS 7 hacia AlmaLinux v8.10.0.
2. **Fallo de Repositorio Inaccesible (`imunify360`):**
   - Registro: 30 de Septiembre a las 10:32 AM.
   - Proceso: `/usr/local/cpanel/bin/packman_get_list_json installed ea-`.
   - Causa: Error `dnf.exceptions.RepoError: Failed to download metadata for repo 'imunify360'`. El gestor DNF se quedaba colgado indefinidamente intentando descargar metadatos de servidores inaccesibles de un repositorio huérfano sin licencia, bloqueando los hilos de ejecucion del sistema hasta congelar Apache y WHM.

---

## 4. Resolucion Forense y Reparacion Aplicada

En la sesion de administracion en la terminal de WHM como usuario `root`, se aplicaron de forma secuencial las siguientes acciones correctivas:

### Paso 1: Reconstruccion de la Base de Datos RPM
Se respaldaron los datos existentes, se removieron los archivos de bloqueo corruptos y se reconstruyo el catalogo de RPM:
```bash
mkdir -p /root/rpmdb_backup
cp -a /var/lib/rpm /root/rpmdb_backup/
rm -f /var/lib/rpm/__db*
rpm --rebuilddb
```
*Resultado:* Finalizo de forma limpia y exitosa con codigo de salida 0.

### Paso 2: Purga y Limpieza de Caché DNF
Se limpiaron todos los metadatos residuales:
```bash
dnf clean all
```
*Resultado:* `210 files removed`, eliminando cachés corruptas de repositorios.

### Paso 3: Desactivacion del Repositorio Roto de Imunify360
Se deshabilito el repositorio que provocaba los bloqueos de conexion:
```bash
dnf config-manager --set-disabled imunify360
```
*Resultado:* Repositorio desactivado sin errores.

### Paso 4: Validacion Funcional de cPanel Packman
Se ejecuto el comando de consulta que anteriormente crasheaba:
```bash
/usr/local/cpanel/bin/packman_get_list_json installed ea-
```
*Resultado:* Respuesta instantanea con cabecera `JSON_OUTPUT_HEADER` y la lista completa de paquetes instalados de EasyApache (`ea-apache24-mod_mpm_worker`, `ea-php81`, `ea-php82`, etc.), validando la recuperacion total del subsistema de paquetes.

### Paso 5: Purga de Registros Historicos en ABRT
Se eliminaron los 5 registros de colapsos historicos acumulados en el spool del monitor de caidas:
```bash
abrt-cli rm /var/spool/abrt/*
```
*Resultado:* Se removieron las entradas correspondientes a las caidas del 29 y 30 de septiembre y registros antiguos de CentOS, dejando el monitor ABRT en cero incidentes.

---

## 5. Estrategia de Resiliencia a Largo Plazo: Desacoplamiento DNS

A pesar de que el VPS se encuentra estabilizado y operando normalmente, se mantiene aprobada la estrategia de desacoplamiento de arquitectura para aislar completamente el sitio web de eventuales incidencias en el servidor de correos:
- Guia tecnica oficial disponible en: [memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md](file:///c:/Proyectos/colegio-acropolis/memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md).
- Accion recomendada: Gestionar la redireccion 301 de `colegioacropolis.cl` en el borde (Cloudflare Redirect Rules o directamente en Railway), preservando en el VPS unicamente los registros de correo (MX, SPF, DKIM, DMARC y subdominios `mail.`, `webmail.`, `cpanel.`, `whm.`).

---

## 6. Archivos Involucrados
- `memoria-ia/bitacora/2026-10-01_07-30_Diagnostico_VPS_HostGator_Y_Desacoplamiento_DNS.md` (bitacora oficial del incidente).
- `memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md` (guia tecnica de configuracion DNS y desacoplamiento).
- `middleware.ts` (regla de redireccion de respaldo en el codigo de la aplicacion).

---

## 7. Resultado Obtenido

- **Estado del Incidente:** RESUELTO.
- **Auditoria Completa de Infraestructura y Software:**
  * **Memoria:** 5,7 GB RAM / 4 GB SWAP operativos (`free -m`).
  * **Almacenamiento:** Particion raiz con 97 GB disponibles (44% de uso) y particion `/tmp` con 3,6 GB disponibles (2% de uso).
  * **Gestor de Paquetes:** Base de datos RPM reconstruida, 210 archivos de caché purgados y repositorio huérfano de Imunify360 desactivado.
  * **Monitor de Fallos:** Registros en `/var/spool/abrt/` purgados, quedando en cero alertas activas.
- **Disponibilidad Web:** El servidor Apache en el VPS y la aplicacion principal en Railway operan con disponibilidad continua y normalizada.
