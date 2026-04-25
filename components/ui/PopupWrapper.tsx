'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface Popup {
  id: number;
  titulo: string;
  contenido: string;
  enlaceUrl: string | null;
  enlaceTexto: string | null;
}

export default function PopupWrapper() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [visiblePopups, setVisiblePopups] = useState<number[]>([]);

  useEffect(() => {
    async function fetchPopups() {
      try {
        const res = await fetch('/api/popups');
        if (res.ok) {
          const data = await res.json();
          const p = data?.popup;
          
          if (!p) {
            setPopups([]);
            setVisiblePopups([]);
            return;
          }

          // Format to expected interface if necessary or just use the returned one
          const formattedPopup: Popup = {
            id: p.id,
            titulo: p.titulo,
            contenido: p.contenido,
            enlaceUrl: p.botonUrl || null,
            enlaceTexto: p.botonTexto || null,
          };

          setPopups([formattedPopup]);
          
          const read = localStorage.getItem(`popup_read_${formattedPopup.id}`);
          if (!read) {
            setVisiblePopups([formattedPopup.id]);
          } else {
            setVisiblePopups([]);
          }
        }
      } catch (error) {
        console.error('Error fetching popups:', error);
      }
    }
    
    fetchPopups();
  }, []);

  const handleDismiss = (id: number) => {
    localStorage.setItem(`popup_read_${id}`, 'true');
    setVisiblePopups(prev => prev.filter(popupId => popupId !== id));
  };

  if (visiblePopups.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4 sm:bottom-8 sm:right-8">
      {popups
        .filter(p => visiblePopups.includes(p.id))
        .map(popup => (
          <div 
            key={popup.id} 
            className="animate-slide-up relative w-[320px] overflow-hidden rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5"
          >
            <button 
              onClick={() => handleDismiss(popup.id)}
              className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-negro"
              aria-label="Cerrar alerta"
            >
              <X size={20} />
            </button>
            <h4 className="mb-2 pr-6 font-bold text-negro">{popup.titulo}</h4>
            <p className="mb-4 text-sm leading-relaxed text-gris-texto">
              {popup.contenido}
            </p>
            {popup.enlaceUrl && popup.enlaceTexto && (
              <Link 
                href={popup.enlaceUrl}
                target={popup.enlaceUrl.startsWith('http') ? '_blank' : '_self'}
                className="inline-block text-sm font-semibold text-azul-acropolis underline decoration-2 underline-offset-4 transition-colors hover:text-azul-hover"
              >
                {popup.enlaceTexto}
              </Link>
            )}
          </div>
        ))}
    </div>
  );
}
