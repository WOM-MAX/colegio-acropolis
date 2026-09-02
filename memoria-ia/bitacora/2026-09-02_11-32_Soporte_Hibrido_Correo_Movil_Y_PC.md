# Bitácora de Sesión: Optimización Híbrida de Contacto por Correo (Móvil y Escritorio)

**Fecha:** 2026-09-02 11:32  
**Proyecto:** Colegio Acrópolis  
**Área:** `components/renderer/blocks/DirectivoEmailButton.tsx`

---

## 📌 1. Diagnóstico de Experiencia Multi-dispositivo

- **Celulares (Android / iOS):**
  - Los dispositivos móviles tienen clientes nativos de correo integrados (Gmail en Android, Mail en iPhone, Outlook móvil). Al tocar un correo, el usuario espera que se abra directamente su aplicación sin fricción.
- **Computadores de Escritorio (Windows / macOS):**
  - Muchos usuarios no tienen un cliente de escritorio configurado (evitando el diálogo de Windows). Prefieren copiar al portapapeles o abrir directamente en Gmail Web / Outlook Web.

---

## 🛠️ 2. Solución Implementada en `DirectivoEmailButton.tsx`

Se programó detección inteligente del entorno:

1. **📱 En Celular / Tablet:**
   - Al tocar el botón del correo, se ejecuta el protocolo nativo `mailto:`, abriendo **de inmediato la app de correo del teléfono** (Gmail o Mail de Apple) con el destinatario listo.
   
2. **💻 En Computador (PC / Mac):**
   - Al hacer clic, **copia la dirección automáticamente al portapapeles** con confirmación visual en verde (`✓ ¡Correo copiado!`).
   - La flecha desplegable permite abrir en 1 clic **Gmail Web** o **Outlook Web** en una pestaña nueva sin pasar por los diálogos del sistema operativo.

---

## ✅ 3. Verificación
- `npx tsc --noEmit` completado con 0 errores.
