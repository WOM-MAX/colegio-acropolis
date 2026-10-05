# Guia Tecnica: Desacoplamiento DNS y Alta Disponibilidad

**Dominio Primario:** colegioacropolis.cl  
**Dominio Canónico Web:** www.colegioacropolis.net  
**Servidor VPS Correo/WHM:** 162.240.230.181 (HostGator)  
**Servidor Web Produccion:** kmg8flyi.up.railway.app (Railway)  
**Estado:** Guia de Configuracion Oficial  

---

## 1. Contexto y Justificacion Arquitectonica

### Topologia Actual (Vulnerable)
```text
Usuario -> colegioacropolis.cl -> VPS HostGator (Apache) -> Redireccion 301 -> Railway (Next.js)
```
- Vulnerabilidad: Si el VPS colapsa por memoria, cola de correos o ataques, el Apache en HostGator deja de responder y la redireccion falla, haciendo que la pagina web aparezca caida para todos los usuarios.

### Topologia Desacoplada (Resiliente)
```text
Trafico Web:   Usuario -> colegioacropolis.cl -> Borde DNS/Railway -> www.colegioacropolis.net (Railway)
Trafico Mail:  Clientes de Correo -> mail.colegioacropolis.cl -> VPS HostGator (Exim/Dovecot)
```
- Beneficio: Si el VPS de HostGator se satura o se reinicia, la pagina web institucional sigue funcionando al 100% en Railway sin interrupciones.

---

## 2. Inventario de Registros DNS de la Zona colegioacropolis.cl

Para ejecutar el desacoplamiento sin interrumpir las cuentas de correo institucionales, se debe aplicar la siguiente tabla de registros en el proveedor de DNS que gestione `colegioacropolis.cl` (ejemplo: NIC Chile, Cloudflare o el editor de zonas DNS del hosting).

### A. Registros para el Servicio Web (Desacoplados del VPS)

Se presentan dos alternativas para gestionar el trafico web:

#### Alternativa 1: Redireccion en el Borde mediante Cloudflare (Recomendada)
Esta alternativa traslada el 100% del procesamiento de la redireccion a la red global de Cloudflare con costo cero de recursos.
1. Gestionar los servidores DNS de `colegioacropolis.cl` en Cloudflare.
2. Crear registros A ficticios con proxy activado (Nube Naranja):
   - `colegioacropolis.cl` -> A `192.0.2.1` (Proxy activado).
   - `www.colegioacropolis.cl` -> CNAME `colegioacropolis.cl` (Proxy activado).
3. En Cloudflare -> Reglas -> Reglas de Redireccion (Redirect Rules):
   - Nombre de regla: `Redireccion Permanente a Net`.
   - Condicion: `Incoming Request: All incoming requests`.
   - Tipo de redireccion: `Dynamic Redirect` o `Static Redirect`.
   - URL Destino: `https://www.colegioacropolis.net/` (Codigo 301).
   - Preservar query string: Activado.

#### Alternativa 2: Conectar el Dominio Directamente a Railway
Si no se utiliza Cloudflare y se mantiene un editor de zona DNS estándar:
1. En el panel de Railway -> Proyecto Colegio Acropolis -> Settings -> Domains:
   - Agregar el dominio `colegioacropolis.cl`.
   - Agregar el subdominio `www.colegioacropolis.cl`.
2. Railway proveera la direccion de apuntado (registro CNAME o registro A alias).
3. En el editor de zona DNS:
   - Configurar `colegioacropolis.cl` y `www.colegioacropolis.cl` apuntando a los valores dados por Railway.
4. El archivo `middleware.ts` del proyecto ya contiene la regla de normalizacion:
   ```typescript
   if (
     hostname.includes('colegioacropolis.cl') ||
     hostname.includes('www.colegioacropolis.cl')
   ) {
     const newUrl = new URL(request.url);
     newUrl.hostname = 'www.colegioacropolis.net';
     newUrl.port = '';
     return NextResponse.redirect(newUrl, 301);
   }
   ```

---

### B. Registros para el Servicio de Correo y Administracion (Preservados en el VPS)

Estos registros DEBEN seguir apuntando estrictamente a la IP del VPS de HostGator (`162.240.230.181`) para garantizar que el correo electronico, Webmail y WHM sigan operando con normalidad.

| Tipo de Registro | Nombre / Host | Valor / Destino | Prioridad / TTL | Proposito |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `mail.colegioacropolis.cl` | `162.240.230.181` | 14400 | Servidor de correo entrante/saliente |
| **MX** | `colegioacropolis.cl` | `mail.colegioacropolis.cl` | Prioridad 0 o 10 | Enrutamiento de correos al VPS |
| **A** | `webmail.colegioacropolis.cl` | `162.240.230.181` | 14400 | Acceso web a Roundcube / Webmail |
| **A** | `cpanel.colegioacropolis.cl` | `162.240.230.181` | 14400 | Acceso directo al panel cPanel |
| **A** | `whm.colegioacropolis.cl` | `162.240.230.181` | 14400 | Acceso administrativo a WHM |
| **TXT** | `colegioacropolis.cl` | `"v=spf1 ip4:162.240.230.181 +a +mx ~all"` | 14400 | Validacion SPF de correos institucionales |
| **TXT** | `default._domainkey` | `(Clave DKIM provista por cPanel)` | 14400 | Firma criptografica DKIM |
| **TXT** | `_dmarc.colegioacropolis.cl` | `"v=DMARC1; p=none; sp=none;"` | 14400 | Politica DMARC |

---

## 3. Protocolo de Inspeccion Inmediata en WHM

Para prevenir nuevos bloqueos en el VPS mientras se aplica el desacoplamiento DNS, el administrador debe ejecutar la siguiente rutina de revision en WHM:

### Paso 1: Inspeccionar la Cola de Correos
1. Ingresar a WHM (`https://162.240.230.181:2087`).
2. Navegar a **Email -> Mail Queue Manager**.
3. Verificar la cantidad de mensajes en cola:
   - Normal: Menos de 50 mensajes en transito.
   - Anomalo: Mas de 500 mensajes retenidos (indica posible spam saliente o ataque de rebotes).
   - Accion correctiva si hay spam masivo: Seleccionar todos los correos sospechosos y eliminarlos (`Delete All`). Identificar la cuenta de correo remitente comprometida y cambiar inmediatamente su contraseña desde cPanel.

### Paso 2: Revisar Uso de Recursos en Tiempo Real
1. Navegar a **System Health -> Process Manager**.
2. Observar el `Load Average`:
   - Menor a 2.0: Carga normal.
   - Mayor a 8.0: Sobrecarga severa.
3. Identificar si hay procesos de Apache (`httpd`), PHP o Exim consumiendo mas del 50% de CPU de manera sostenida.

### Paso 3: Verificar Espacio en Disco
1. Navegar a **System Health -> Show Current Disk Usage**.
2. Validar que ninguna particion (`/`, `/var`, `/tmp`, `/home`) supere el 85% de capacidad.
3. Si `/var` o `/tmp` estan al 100%, purgar logs antiguos en `/var/log/` o temporales de sesiones en `/tmp`.

---

## 4. Pruebas de Verificacion Post-Configuracion

Una vez aplicados los cambios DNS, ejecutar las siguientes comprobaciones en consola local:

1. **Verificar resolucion del servicio web:**
   ```powershell
   nslookup colegioacropolis.cl
   curl.exe -I https://colegioacropolis.cl
   ```
   *Criterio de exito:* No debe devolver la IP `162.240.230.181` para el trafico web, sino la IP del proxy de borde o de Railway, respondiendo con redireccion 301 instantanea.

2. **Verificar resolucion de correo:**
   ```powershell
   nslookup -type=MX colegioacropolis.cl
   nslookup mail.colegioacropolis.cl
   ```
   *Criterio de exito:* El registro MX debe apuntar a `mail.colegioacropolis.cl` y este ultimo debe resolver a `162.240.230.181`.

3. **Verificar acceso a Webmail y WHM:**
   - Webmail: `https://webmail.colegioacropolis.cl:2096`
   - WHM: `https://162.240.230.181:2087` o `https://whm.colegioacropolis.cl:2087`
