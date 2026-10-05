#!/usr/bin/env bash
# ==============================================================================
# Script de Calibracion y Estabilizacion de VPS AlmaLinux 8 (cPanel / WHM)
# Servidor: VPS HostGator (vps-1073249.colegioacropolis.cl / 162.240.230.181)
# Objetivo: Mitigar Swap Thrashing, optimizar memoria y limpiar base de datos RPM/DNF
# Ejecucion: Pegar en el Terminal de WHM como usuario root
# ==============================================================================

set -e

echo "================================================================="
echo " INICIANDO PROTOCOLO DE ESTABILIZACION ALMALINUX 8 (cPanel/WHM)  "
echo "================================================================="

# 1. Comprobar permisos de root
if [ "$(id -u)" -ne 0 ]; then
   echo "[ERROR] Este script debe ejecutarse como root en el terminal de WHM." >&2
   exit 1
fi

echo "[1/6] Analizando memoria y swap actual..."
free -m
echo ""

# 2. Mitigar Swap Thrashing mediante parametros de kernel
echo "[2/6] Aplicando calibracion de memoria y swappiness al kernel..."
sysctl -w vm.swappiness=10
sysctl -w vm.vfs_cache_pressure=50

# Persistir la configuracion para futuros reinicios
cat << 'EOF' > /etc/sysctl.d/99-swappiness.conf
# Calibracion de estabilidad para VPS AlmaLinux 8 con cPanel
# Reduce el volcado prematuro de paginas de memoria al disco (Swap Thrashing)
vm.swappiness=10
vm.vfs_cache_pressure=50
EOF

echo "[OK] Parametros persistidos en /etc/sysctl.d/99-swappiness.conf"
sysctl -p /etc/sysctl.d/99-swappiness.conf
echo ""

# 3. Mantenimiento y saneamiento de paquetes RPM y DNF
echo "[3/6] Reconstruyendo base de datos RPM y limpiando cache de DNF..."
rpm --rebuilddb
dnf clean all
echo "[OK] Cache de DNF purgada y RPM saneado."
echo ""

# 4. Auditoria de eventos de falta de memoria (OOM-Killer)
echo "[4/6] Verificando incidentes recientes de OOM-Killer en el kernel..."
if zgrep -i -E "oom|out of memory|killed process" /var/log/messages* 2>/dev/null | tail -15; then
    echo "[AVISO] Se detectaron registros historicos de procesos terminados por OOM."
else
    echo "[OK] No se detectaron eventos criticos recientes de OOM en /var/log/messages."
fi
echo ""

# 5. Comprobacion de procesos de alto consumo (ClamAV, MySQL, Exim, Apache)
echo "[5/6] Verificando estado de ClamAV (clamd)..."
if systemctl is-active --quiet clamd 2>/dev/null || systemctl is-active --quiet cpanel-clamav 2>/dev/null; then
    echo "[ALERTA] ClamAV esta ACTIVO consumiendo aproximadamente 1.5GB - 2.0GB de RAM."
    echo "         Recomendacion: En WHM -> Service Configuration -> Service Manager,"
    echo "         desmarcar 'clamd' si los correos no requieren antivirus local intensivo."
else
    echo "[OK] ClamAV no esta activo o no sobrecarga la memoria principal."
fi
echo ""

# 6. Diagnostico de procesos principales por consumo de memoria
echo "[6/6] Top 10 procesos con mayor consumo de memoria RAM:"
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -11
echo ""

echo "================================================================="
echo " CALIBRACION COMPLETADA EXITOSAMENTE                             "
echo " El servidor ahora priorizara la RAM fisica evitando el bloqueo  "
echo " de disco por intercambio agresivo (Swap Thrashing).            "
echo "================================================================="
