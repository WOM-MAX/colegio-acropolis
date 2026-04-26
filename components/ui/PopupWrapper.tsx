'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface Popup {
  id: number;
  titulo: string;
  contenido: string;
  imagenUrl: string | null;
  enlaceUrl: string | null;
  enlaceTexto: string | null;
  posicion: string;
  estiloImagen: string;
  colorFondo: string;
  colorTexto: string;
  tamanoTitulo: string;
  tipo: string;
  frecuencia: string;
}

export default function PopupWrapper() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function fetchPopups() {
      try {
        const res = await fetch('/api/popups', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const p = data?.popup;

          if (!p) {
            setPopup(null);
            setVisible(false);
            return;
          }

          const formattedPopup: Popup = {
            id: p.id,
            titulo: p.titulo,
            contenido: p.contenido,
            imagenUrl: p.imagenUrl,
            enlaceUrl: p.botonUrl || null,
            enlaceTexto: p.botonTexto || null,
            posicion: p.posicion || 'centro-modal',
            estiloImagen: p.estiloImagen || 'encabezado',
            colorFondo: p.colorFondo || '#ffffff',
            colorTexto: p.colorTexto || '#111827',
            tamanoTitulo: p.tamanoTitulo || 'md',
            tipo: p.tipo || 'info',
            frecuencia: p.frecuencia || 'una_vez',
          };

          const readValue = localStorage.getItem(`popup_read_${formattedPopup.id}`);
          let shouldShow = false;

          if (formattedPopup.frecuencia === 'siempre') {
            shouldShow = true;
          } else if (formattedPopup.frecuencia === 'una_vez_por_dia') {
            const today = new Date().toISOString().split('T')[0];
            shouldShow = readValue !== today;
          } else {
            shouldShow = !readValue;
          }

          if (shouldShow) {
            setPopup(formattedPopup);
            setTimeout(() => setVisible(true), 100);
          }
        }
      } catch (error) {
        console.error('Error fetching popups:', error);
      }
    }

    fetchPopups();
  }, []);

  const handleDismiss = () => {
    if (!popup) return;
    setVisible(false);

    if (popup.frecuencia === 'una_vez_por_dia') {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`popup_read_${popup.id}`, today);
    } else if (popup.frecuencia !== 'siempre') {
      localStorage.setItem(`popup_read_${popup.id}`, 'true');
    }

    setTimeout(() => setPopup(null), 500);
  };

  if (!popup) return null;

  const isUrgent = popup.tipo === 'urgente';

  // Tamaño del título
  const titleSizes: Record<string, string> = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };
  const titleClass = titleSizes[popup.tamanoTitulo] || titleSizes.md;

  // Badge de tipo
  const badgeColors: Record<string, string> = {
    info: 'bg-blue-500',
    urgente: 'bg-red-500',
    matricula: 'bg-emerald-500',
    evento: 'bg-amber-500',
  };
  const badgeLabels: Record<string, string> = {
    info: 'Información',
    urgente: 'Urgente',
    matricula: 'Matrícula',
    evento: 'Evento',
  };

  const isBanner = popup.posicion.includes('banner');

  // ============================================
  // RENDER: BANNER (superior o inferior)
  // ============================================
  if (isBanner) {
    const posClass =
      popup.posicion === 'banner-superior'
        ? 'fixed top-0 left-0 right-0 z-50'
        : 'fixed bottom-0 left-0 right-0 z-50';

    const slideFrom =
      popup.posicion === 'banner-superior'
        ? 'translateY(-100%)'
        : 'translateY(100%)';

    return (
      <div className={posClass}>
        <div
          className="w-full shadow-lg transition-all duration-500 ease-out"
          style={{
            backgroundColor: popup.colorFondo,
            color: popup.colorTexto,
            transform: visible ? 'translateY(0)' : slideFrom,
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
              {isUrgent && (
                <span className="popup-pulse-dot relative flex h-3 w-3 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
              )}
              <p className="text-sm font-medium">
                <strong>{popup.titulo}</strong> — {popup.contenido}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {popup.enlaceUrl && popup.enlaceTexto && (
                <Link
                  href={popup.enlaceUrl}
                  target={popup.enlaceUrl.startsWith('http') ? '_blank' : '_self'}
                  className="flex-shrink-0 rounded-lg px-4 py-1.5 text-xs font-bold transition-transform hover:scale-105"
                  style={{ backgroundColor: popup.colorTexto, color: popup.colorFondo }}
                >
                  {popup.enlaceTexto}
                </Link>
              )}
              <button
                onClick={handleDismiss}
                className="rounded-full p-1 transition-colors hover:bg-black/10"
                style={{ color: popup.colorTexto }}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MODAL / ESQUINA (diseño vertical)
  // ============================================
  const isModal = popup.posicion === 'centro-modal';

  // Contenedor exterior
  let containerClass = 'fixed z-50 ';
  if (isModal) {
    containerClass += 'inset-0 flex items-center justify-center p-4';
  } else if (popup.posicion === 'inferior-derecha') {
    containerClass += 'bottom-4 right-4 sm:bottom-6 sm:right-6';
  } else if (popup.posicion === 'inferior-izquierda') {
    containerClass += 'bottom-4 left-4 sm:bottom-6 sm:left-6';
  }

  // Card sizing
  const cardWidth = isModal
    ? 'w-full max-w-[380px] sm:max-w-[420px]'
    : 'w-[320px] sm:w-[360px]';

  return (
    <>
      {/* ===== CSS Animations ===== */}
      <style jsx global>{`
        @keyframes popupSlideUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.92); }
          60% { opacity: 1; transform: translateY(-8px) scale(1.01); }
          80% { transform: translateY(3px) scale(0.995); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popupFadeOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(30px) scale(0.9); }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.1); }
          50% { box-shadow: 0 0 16px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.2); }
        }
        .popup-card-enter {
          animation: popupSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .popup-card-exit {
          animation: popupFadeOut 0.4s ease-in forwards;
        }
        .popup-backdrop-enter {
          animation: backdropFadeIn 0.4s ease-out forwards;
        }
        .popup-backdrop-exit {
          animation: backdropFadeOut 0.3s ease-in forwards;
        }
        .popup-shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .popup-shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }
        .popup-glow-urgent {
          animation: glowPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Backdrop para modal */}
      {isModal && (
        <div
          className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm ${
            visible ? 'popup-backdrop-enter' : 'popup-backdrop-exit'
          }`}
          onClick={handleDismiss}
        />
      )}

      {/* Contenedor del popup */}
      <div className={containerClass} style={{ zIndex: 51 }}>
        <div
          className={`
            ${cardWidth}
            ${visible ? 'popup-card-enter' : 'popup-card-exit'}
            ${isUrgent ? 'popup-glow-urgent' : ''}
            relative overflow-hidden rounded-2xl shadow-2xl
          `}
          style={{
            backgroundColor: popup.estiloImagen !== 'fondo' ? popup.colorFondo : undefined,
            color: popup.colorTexto,
          }}
        >
          {/* === Imagen de fondo (cubre toda la tarjeta) === */}
          {popup.estiloImagen === 'fondo' && popup.imagenUrl && (
            <div className="absolute inset-0 z-0">
              <img
                src={popup.imagenUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: popup.colorFondo, opacity: 0.8 }}
              />
            </div>
          )}

          {/* === Contenido principal (z-10) === */}
          <div className="relative z-10 flex flex-col">
            {/* Botón cerrar */}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-3 z-20 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-110"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            {/* Badge urgente pulsante */}
            {isUrgent && (
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Urgente
              </div>
            )}

            {/* Imagen como encabezado */}
            {popup.estiloImagen === 'encabezado' && popup.imagenUrl && (
              <div className="relative w-full overflow-hidden">
                <img
                  src={popup.imagenUrl}
                  alt={popup.titulo}
                  className="w-full object-cover"
                  style={{ maxHeight: '320px' }}
                />
                {/* Gradiente inferior para fusionar con contenido */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-16"
                  style={{
                    background: `linear-gradient(to top, ${popup.colorFondo}, transparent)`,
                  }}
                />
              </div>
            )}

            {/* Contenido de texto */}
            <div className="flex flex-col gap-3 p-5 sm:p-6">
              {/* Badge de tipo (no urgente) */}
              {!isUrgent && (
                <span
                  className={`${badgeColors[popup.tipo] || badgeColors.info} w-fit rounded-full px-3 py-0.5 text-xs font-semibold text-white`}
                >
                  {badgeLabels[popup.tipo] || 'Aviso'}
                </span>
              )}

              <h3 className={`${titleClass} font-bold leading-tight`}>
                {popup.titulo}
              </h3>

              <p className="text-sm leading-relaxed opacity-85">
                {popup.contenido}
              </p>

              {/* Botón CTA con shimmer */}
              {popup.enlaceUrl && popup.enlaceTexto && (
                <Link
                  href={popup.enlaceUrl}
                  target={popup.enlaceUrl.startsWith('http') ? '_blank' : '_self'}
                  className="popup-shimmer-btn mt-2 block w-full rounded-xl py-3 text-center text-sm font-bold tracking-wide transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: popup.colorTexto,
                    color: popup.colorFondo,
                  }}
                >
                  {popup.enlaceTexto}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
