'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface PopupData {
  id: number;
  titulo: string;
  contenido: string;
  imagenUrl: string | null;
  tipo: string;
  botonTexto: string | null;
  botonUrl: string | null;
  frecuencia: string;
}

const tipoBorderColor: Record<string, string> = {
  info: 'var(--color-azul-acropolis)',
  urgente: 'var(--color-fucsia)',
  matricula: 'var(--color-cian)',
  evento: 'var(--color-amarillo)',
};

const tipoBadgeStyle: Record<string, { bg: string; text: string }> = {
  info: { bg: 'var(--color-azul-soft)', text: 'var(--color-azul-acropolis)' },
  urgente: { bg: 'var(--color-fucsia-soft)', text: 'var(--color-fucsia)' },
  matricula: { bg: 'var(--color-cian-soft)', text: 'var(--color-cian)' },
  evento: { bg: 'var(--color-amarillo-soft)', text: 'var(--color-amarillo-hover)' },
};

function shouldShowPopup(popup: PopupData): boolean {
  const key = `popup_seen_${popup.id}`;
  const stored = localStorage.getItem(key);

  if (popup.frecuencia === 'siempre') return true;

  if (popup.frecuencia === 'una_vez') {
    return !stored;
  }

  if (popup.frecuencia === 'una_vez_por_dia') {
    const today = new Date().toISOString().split('T')[0];
    return stored !== today;
  }

  return true;
}

function markPopupSeen(popup: PopupData): void {
  const key = `popup_seen_${popup.id}`;

  if (popup.frecuencia === 'una_vez') {
    localStorage.setItem(key, 'seen');
  } else if (popup.frecuencia === 'una_vez_por_dia') {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(key, today);
  }
}

export default function PopupModal() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function fetchPopup() {
      try {
        const res = await fetch('/api/popups');
        const data = await res.json();
        if (data.popup && shouldShowPopup(data.popup)) {
          setPopup(data.popup);
          // Pequeño delay para que la animación se note
          setTimeout(() => setVisible(true), 300);
        }
      } catch {
        // Fail silently — los popups no deben romper la experiencia
      }
    }

    fetchPopup();
  }, []);

  function handleClose() {
    setVisible(false);
    if (popup) {
      markPopupSeen(popup);
    }
    // Esperar a que termine la animación de salida
    setTimeout(() => setPopup(null), 300);
  }

  if (!popup) return null;

  const borderColor = tipoBorderColor[popup.tipo] || tipoBorderColor.info;
  const badge = tipoBadgeStyle[popup.tipo] || tipoBadgeStyle.info;

  return (
    <div
      className={`popup-overlay ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{ transition: 'opacity 0.3s ease' }}
    >
      <div
        className="popup-content relative mx-4 w-full max-w-lg rounded-[var(--radius-popup)] bg-white p-0 shadow-[var(--shadow-popup)]"
        style={{
          borderTop: `4px solid ${borderColor}`,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gris-texto transition-colors hover:bg-gris-claro hover:text-negro"
          aria-label="Cerrar ventana emergente"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Badge de tipo */}
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {popup.tipo}
          </span>

          {/* Título */}
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-negro">
            {popup.titulo}
          </h2>

          {/* Imagen opcional */}
          {popup.imagenUrl && (
            <div className="mb-4 overflow-hidden rounded-xl">
              <img
                src={popup.imagenUrl}
                alt={popup.titulo}
                className="h-auto w-full object-cover"
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}

          {/* Contenido */}
          <div className="mb-6 leading-relaxed text-gris-texto" style={{ whiteSpace: 'pre-line' }}>
            {popup.contenido}
          </div>

          {/* Botón CTA */}
          {popup.botonTexto && popup.botonUrl && (
            <a
              href={popup.botonUrl}
              target={popup.botonUrl.startsWith('http') ? '_blank' : '_self'}
              rel={popup.botonUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex w-full items-center justify-center rounded-[var(--radius-button)] py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: borderColor }}
            >
              {popup.botonTexto}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
