# Guia Tecnica: Analisis de Estabilidad CentOS 7 vs AlmaLinux 8 y Calibracion de Recursos del VPS

- **Servidor:** VPS HostGator (IP: `162.240.230.181`, Hostname: `vps-1073249.colegioacropolis.cl`)
- **Sistema Operativo:** AlmaLinux v8.10.0 (Migrado desde CentOS 7 via cPanel ELevate)
- **Fecha:** 05 de Octubre de 2026
- **Proyecto:** colegio-acropolis
- **Estado:** Guia Oficial de Estabilizacion y Diagnostico

---

## 1. Contexto Tecnico: ¿Por que en CentOS 7 no habia caidas y en AlmaLinux 8 si?

La migracion desde CentOS 7 hacia AlmaLinux 8 introdujo cambios arquitectonicos estructurales en la gestion de memoria y dependencias del sistema operativo que impactan directamente en servidores VPS con recursos limitados (5.7 GB RAM):

### A. Sustitucion de YUM por DNF (Explosion de Huella de Memoria)
- **En CentOS 7:** El gestor `yum` consumia entre 80 MB y 150 MB de memoria RAM durante la sincronizacion y comprobacion de repositorios.
- **En AlmaLinux 8:** El gestor `dnf` carga arboles de dependencias XML completos directamente en la memoria RAM, requiriendo entre 800 MB y 1.200 MB de memoria fisica cada vez que se invoca.
- **Impacto en cPanel:** Las tareas cron nocturnas de cPanel (`/usr/local/cpanel/scripts/upcp`) y las llamadas de validacion de paquetes (`/usr/local/cpanel/bin/packman`) consumen picos repentinos de memoria que saturan la RAM disponible.

### B. Huella de Memoria Basal del Sistema Operativo
- **CentOS 7:** Kernel 3.10 con systemd ligero. Consumo basal en reposo: ~500 MB a 700 MB.
- **AlmaLinux 8:** Kernel 4.18 con systemd moderno, cgroups y servicios de monitoreo actualizados de cPanel. Consumo basal en reposo: ~1.8 GB a 2.4 GB de RAM antes de procesar un solo correo o peticion web.

### C. Fenomeno de Swap Thrashing (Congelamiento de Disco)
- En AlmaLinux 8, el parametro por defecto `vm.swappiness=60` es altamente agresivo.
- Cuando la memoria RAM supera el 85-90% de uso, el kernel comienza a intercambiar masivamente paginas de memoria hacia el disco (SWAP).
- En entornos VPS con almacenamiento compartido de hosting, la tasa de I/O se bloquea al 100%, el procesador se queda en estado `iowait` (esperando al disco), el subsistema de red deja de responder paquetes (75% a 100% de perdida de pings) y los demonios esenciales (Apache, BIND, WHM) dejan de atender peticiones sin reiniciarse, simulando una caida total del servidor.

### D. Formato de Base de Datos RPM (SQLite vs Berkeley DB)
- CentOS 7 usaba Berkeley DB (`/var/lib/rpm/__db*`).
- AlmaLinux 8 utiliza SQLite (NDB). Migraciones incompletas de cPanel ELevate dejan indices hibridos o archivos de bloqueo que provocan que procesos de RPM queden colgados indefinidamente consumiendo ciclos de CPU.

---

## 2. Protocolo de Diagnostico en el Terminal de WHM

Para verificar que proceso exacto provoco el colapso, ingresar a WHM via IP directa `https://162.240.230.181:2087` y en la terminal como `root` ejecutar:

```bash
# 1. Identificar la hora exacta del ultimo reinicio
last reboot -F | head -5

# 2. Consultar los ultimos 50 logs del sistema previo al congelamiento
journalctl -b -1 -e -n 50

# 3. Comprobar si el kernel activo el OOM-Killer para matar procesos por falta de RAM
zgrep -i -E "oom|out of memory|killed process" /var/log/messages* | tail -30

# 4. Inspeccionar el monitor de colapsos ABRT
abrt-cli list
```

---

## 3. Plan de Accion para Estabilizar el VPS

El servidor **si puede estabilizarse** aplicando los siguientes ajustes tecnicos:

### Paso 1: Evitar el Congelamiento por Disco (Swap Thrashing)
Reducir la agresividad con la que el kernel utiliza el disco swap y liberar memoria de inodos:
```bash
# Aplicar inmediatamente en memoria
sysctl vm.swappiness=10
sysctl vm.vfs_cache_pressure=50

# Persistir para todos los reinicios futuros
cat << 'EOF' > /etc/sysctl.d/99-swappiness.conf
vm.swappiness=10
vm.vfs_cache_pressure=50
EOF
```

### Paso 2: Desactivar Servicios Devoradores de RAM en WHM
En WHM -> **Service Configuration -> Service Manager**:
1. **ClamAV (`clamd`):** Si esta habilitado, consume entre 1.2 GB y 2.0 GB de memoria RAM permanente. Si los correos ya cuentan con filtros externos, desactivar este servicio ahorra un tercio de la RAM total del VPS.
2. **cPanel Analytics (`cpanellogd`):** Configurar para que procese logs exclusivamente en horarios nocturnos de bajo trafico.
3. **cPHulk Brute Force Protection:** Asegurar que la base de datos de cPHulk este depurada para no sobrecargar MySQL en el arranque.

### Paso 3: Limpieza y Mantenimiento de la Base de Datos RPM/DNF
Ejecutar una vez al mes para evitar corrupcion de paquetes:
```bash
rpm --rebuilddb
dnf clean all
```

---

## 4. Estrategia Complementaria: Desacoplamiento DNS

Independiente de la estabilizacion del VPS para correos, se debe desacoplar el trafico web hacia Railway conforme a [memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md](file:///c:/Proyectos/colegio-acropolis/memoria-ia/arquitectura/guia_desacoplamiento_dns_colegioacropolis.md):
- Si el VPS se reinicia por mantenimiento de cPanel, la pagina web institucional en Railway (`www.colegioacropolis.net`) no se vera afectada en ningun momento.
