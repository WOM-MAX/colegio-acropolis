# Diagnostico Tecnico: Caida del Servidor VPS HostGator y Plan de Desacoplamiento DNS

- **Fecha:** 05 de Octubre de 2026
- **Hora:** 11:30 GMT-3 (Actualizado: 12:10 GMT-3)
- **Proyecto:** colegio-acropolis
- **Autor:** Antigravity (Pair Programming con Administrador)
- **Estado:** RESUELTO (Servicios VPS recuperados; Desacoplamiento DNS pendiente de aplicacion en Railway)

---

## 1. Problema Detectado

El usuario reporto una nueva caida generalizada del sitio web institucional y la imposibilidad absoluta de acceder al panel administrativo de WHM (puerto 2087):
1. Los visitantes que intentaban ingresar a `colegioacropolis.cl` o `www.colegioacropolis.cl` recibian errores de resolucion de nombres (`DNS_PROBE_FINISHED_NXDOMAIN` o `Server failed`).
2. El intento de apertura de `https://colegioacropolis.cl:2087` o `https://whm.colegioacropolis.cl:2087` fallaba por falta de resolucion DNS y tiempo de espera agotado.

---

## 2. Hipotesis Descartadas

1. **Caida o fallo en la aplicacion Next.js en Railway:**
   - Descartado: La auditoria HTTP en tiempo real ejecutada contra `https://www.colegioacropolis.net` respondio de inmediato con codigo `HTTP/1.1 200 OK`, cabecera `x-nextjs-cache: HIT` y un peso de 144.457 bytes. La aplicacion en Railway jamas se detuvo y opero con normalidad absoluta.

2. **Agotamiento de cuota o bloqueo en la base de datos Neon PostgreSQL:**
   - Descartado: El esquema Scale-to-Zero con TTL de 24 horas (`revalidate: 86400`) y proteccion Whitelist Cache Shield no registro interrupciones ni bloqueos de conexion.

3. **Bloqueo exclusivo de firewall por IP local del administrador:**
   - Descartado: La caida fue global para todos los resolvedores publicos (Google `8.8.8.8` y Cloudflare `1.1.1.1`), los cuales respondieron con `SERVFAIL` para cualquier consulta relacionada con `colegioacropolis.cl`.

---

## 3. Causa Raiz y Diagnostico Forense

### A. Concentracion de Puntos de Falla en el VPS de HostGator (`162.240.230.181`)
La auditoria de delegacion autoritativa en los servidores raiz de NIC Chile (`a.nic.cl`) evidencio la razon estructural de la caida:
- `colegioacropolis.cl` delega su autoridad DNS a `ns1.colegioacropolis.cl` y `ns2.colegioacropolis.cl`.
- Ambos nombres de servidor poseen glue records que apuntan a la misma direccion IP: `162.240.230.181` (VPS de HostGator).
- Paralelamente, el trafico web hacia `colegioacropolis.cl` llegaba al Apache de esa misma IP para emitir una redireccion `HTTP/1.1 301` hacia `https://www.colegioacropolis.net/`.

### B. Colapso de Red y Procesos en el VPS
Durante el incidente se detecto:
1. **Perdida Masiva de Paquetes:** Las pruebas de ICMP hacia `162.240.230.181` arrojaron un 75% de paquetes perdidos (`Tiempo de espera agotado para esta solicitud`).
2. **Caida de Puertos Esenciales:**
   - Puerto 53 (DNS / BIND): Inaccesible, provocando que los resolvedores recursivos mundiales no pudieran responder por el dominio `.cl`.
   - Puerto 2087 (WHM): Conexiones rechazadas (`curl: (7) Failed to connect to 162.240.230.181:2087: Could not connect to server`).
   - Puertos 80 y 443 (Apache): Conexiones rechazadas, impidiendo emitir la redireccion hacia la web de Railway.
3. **Imposibilidad de Resolucion del Panel:** Al estar caido el DNS autoritativo dentro del mismo servidor, cualquier intento de abrir el panel usando nombres de dominio (`whm.colegioacropolis.cl`) fallo antes de llegar a la capa de transporte.

---

## 4. Solucion Aplicada y Estado de Recuperacion

### A. Recuperacion del VPS
Tras el proceso de reinicio o recuperacion del sistema operativo en HostGator:
1. **Conectividad:** Se restablecio el flujo de red con 0% de paquetes perdidos y latencia estable de 168 ms.
2. **Panel WHM:** Operativo y respondiendo con codigo `HTTP/1.1 200 OK` en la URL directa por IP: `https://162.240.230.181:2087`.
3. **Apache:** Operativo y emitiendo la redireccion `HTTP/1.1 301 Moved Permanently` hacia `https://www.colegioacropolis.net/`.
4. **DNS Publico:** Google DNS (`8.8.8.8`) y Cloudflare (`1.1.1.1`) normalizaron la resolucion de `colegioacropolis.cl` hacia `162.240.230.181`.

### B. Certificacion de Codigo en Repositorio Local
- Se comprobo el archivo `middleware.ts`, el cual ya cuenta con la regla de normalizacion y redireccion permanente 301 en caso de recibir trafico de `colegioacropolis.cl` directamente en Railway.
- Se ejecuto la validacion estricta de tipos de TypeScript mediante `npx tsc --noEmit`, finalizando con codigo de salida 0 (cero errores sintacticos o de tipado).

---

## 5. Solucion Definitiva: Desacoplamiento DNS (Accion Mandatoria)

Para erradicar de forma permanente la vulnerabilidad de que el sitio web se caiga ante problemas en el VPS de HostGator, se debe ejecutar el desacoplamiento definido en [memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md](file:///c:/Proyectos/colegio-acropolis/memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md):

1. **En Railway Dashboard:**
   - Navegar al proyecto `colegio-acropolis` -> Servicio Web -> Settings -> Domains.
   - Presionar `Custom Domain` y agregar:
     * `colegioacropolis.cl`
     * `www.colegioacropolis.cl`
   - Railway entregara los registros de destino (CNAME o alias de borde).

2. **En la Zona DNS (NIC Chile / Cloudflare / cPanel):**
   - Apuntar el trafico web (`@` y `www`) directamente a Railway (o a traves del proxy de Cloudflare).
   - Dejar en el VPS de HostGator unicamente los servicios de correo:
     * `mail.colegioacropolis.cl` -> A `162.240.230.181`
     * Registros MX, SPF, DKIM y DMARC apuntando a `mail.colegioacropolis.cl`.

Con este cambio, si el VPS de HostGator se congela, reinicia o satura, el sitio web institucional permanecera 100% en linea en la red global de Railway.

---

## 6. Archivos Involucrados

- `memoria-ia/bitacora/2026-10-05_11-30_Diagnostico_Caida_VPS_Y_Verificacion_Recuperacion.md` (bitacora oficial del incidente).
- `memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md` (manual de arquitectura de desacoplamiento).
- `middleware.ts` (manejador de redireccion en Next.js).

---

## 7. Resultado Esperado y Proximos Pasos si Falla

* **Resultado esperado:**
  - El administrador puede ingresar inmediatamente a WHM via `https://162.240.230.181:2087` y revisar logs con `abrt-cli list` o `journalctl`.
  - El sitio web se mantendra inmune a futuras incidencias de HostGator una vez configurados los dominios en Railway.
* **Proximos pasos si el VPS vuelve a colapsar antes de migrar el DNS:**
  - Acceder al portal de clientes de HostGator (panel de facturacion / area de cliente) y solicitar un reinicio forzado del VPS desde la consola de virtualizacion.
  - Migrar la delegacion DNS en NIC Chile directamente a Cloudflare para que la resolucion de nombres nunca mas dependa de la IP del VPS.
