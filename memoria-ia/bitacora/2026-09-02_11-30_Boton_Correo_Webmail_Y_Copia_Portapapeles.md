# Bitácora de Sesión: Botón Interactivo de Correo con Copia Rápida y Enlaces Directos a Gmail y Outlook Web

**Fecha:** 2026-09-02 11:30  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/renderer/blocks/DirectivoEmailButton.tsx`, `components/renderer/blocks/EquipoBlock.tsx`

---

## 📌 1. Problema y Diagnóstico

- **Ventana Emergente de Windows:** Al hacer clic en un enlace HTML estándar `mailto:`, el sistema operativo Windows abre un modal pidiendo asociar una aplicación predeterminada (Outlook de escritorio, Edge, Chrome), lo cual falla o interrumpe la experiencia cuando el usuario utiliza correo web (Gmail, Outlook.com, etc.) y no tiene un cliente de escritorio instalado.

---

## 🛠️ 2. Solución Implementada

Se implementó el componente interactivo [DirectivoEmailButton.tsx](file:///c:/Proyectos/colegio-acropolis/components/renderer/blocks/DirectivoEmailButton.tsx):

1. **Copia Inmediata al Portapapeles (1 Clic):**
   - Al hacer clic en el botón, la dirección se copia instantáneamente al portapapeles y el botón muestra un feedback visual en verde: `✓ ¡Correo copiado!`.

2. **Menú de Redacción Directa (Webmail):**
   - Incorpora un menú desplegable con opciones directas para componer sin pasar por el sistema operativo:
     - 🚀 **Abrir en Gmail Web** (`https://mail.google.com/mail/?view=cm&fs=1&to=...`)
     - 📧 **Abrir en Outlook Web** (`https://outlook.office.com/mail/deeplink/compose?to=...`)
     - 📋 **Copiar dirección**
     - ✉️ **Usar app de correo instalada** (`mailto:...`)

---

## ✅ 3. Verificación
- `npx tsc --noEmit` completado con 0 errores.
