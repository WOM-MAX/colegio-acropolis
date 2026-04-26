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
}

export default function PopupWrapper() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function fetchPopups() {
      try {
        const res = await fetch('/api/popups');
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
            posicion: p.posicion || 'inferior-derecha',
            estiloImagen: p.estiloImagen || 'oculta',
            colorFondo: p.colorFondo || '#ffffff',
            colorTexto: p.colorTexto || '#111827',
            tamanoTitulo: p.tamanoTitulo || 'md',
          };
          
          const read = localStorage.getItem(`popup_read_${formattedPopup.id}`);
          if (!read) {
            setPopup(formattedPopup);
            setTimeout(() => setVisible(true), 300); // Pequeño delay para la animación
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
    localStorage.setItem(`popup_read_${popup.id}`, 'true');
    setTimeout(() => setPopup(null), 300); // Espera a la animación para desmontar
  };

  if (!popup) return null;

  // Lógica de posicionamiento
  let containerClasses = '';
  let cardClasses = 'relative overflow-hidden transition-all duration-300 ease-in-out ';
  
  if (popup.posicion === 'centro-modal') {
    containerClasses = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';
    cardClasses += 'w-full max-w-lg rounded-2xl shadow-2xl';
  } else if (popup.posicion === 'inferior-derecha') {
    containerClasses = 'fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8 flex justify-end';
    cardClasses += 'w-full max-w-sm rounded-2xl shadow-2xl ring-1 ring-black/5';
  } else if (popup.posicion === 'inferior-izquierda') {
    containerClasses = 'fixed bottom-4 left-4 z-50 sm:bottom-8 sm:left-8 flex justify-start';
    cardClasses += 'w-full max-w-sm rounded-2xl shadow-2xl ring-1 ring-black/5';
  } else if (popup.posicion === 'banner-superior') {
    containerClasses = 'fixed top-0 left-0 right-0 z-50 flex justify-center';
    cardClasses += 'w-full shadow-md';
  } else if (popup.posicion === 'banner-inferior') {
    containerClasses = 'fixed bottom-0 left-0 right-0 z-50 flex justify-center';
    cardClasses += 'w-full shadow-[0_-4px_24px_rgba(0,0,0,0.1)]';
  }

  // Lógica de Título
  const titleSizes: Record<string, string> = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };
  const titleClass = `${titleSizes[popup.tamanoTitulo] || 'text-xl'} font-bold mb-2 pr-6`;

  // Estilos inline basados en configuracion
  const cardStyle: React.CSSProperties = {
    backgroundColor: popup.estiloImagen !== 'fondo' ? popup.colorFondo : undefined,
    color: popup.colorTexto,
    opacity: visible ? 1 : 0,
    transform: visible 
      ? 'translateY(0) scale(1)' 
      : (popup.posicion.includes('superior') ? 'translateY(-100%)' : 'translateY(20px) scale(0.95)')
  };

  const isBanner = popup.posicion.includes('banner');

  return (
    <div className={containerClasses}>
      <div className={cardClasses} style={cardStyle}>
        
        {/* Imagen como Fondo */}
        {popup.estiloImagen === 'fondo' && popup.imagenUrl && (
          <div className="absolute inset-0 z-0">
            <img src={popup.imagenUrl} alt="Fondo popup" className="h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: popup.colorFondo, opacity: 0.85 }}></div>
          </div>
        )}

        <div className="relative z-10">
          {/* Botón Cerrar */}
          <button 
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1 transition-colors hover:bg-black/10"
            style={{ color: popup.colorTexto }}
            aria-label="Cerrar alerta"
          >
            <X size={20} />
          </button>

          {/* Imagen como Encabezado */}
          {popup.estiloImagen === 'encabezado' && popup.imagenUrl && !isBanner && (
            <div className="w-full">
              <img src={popup.imagenUrl} alt={popup.titulo} className="w-full h-auto object-cover max-h-48" />
            </div>
          )}

          <div className={`p-6 ${isBanner ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-7xl mx-auto' : ''}`}>
            
            {/* Banner Layout Content */}
            <div className={isBanner ? 'flex-1' : ''}>
              <h4 className={titleClass}>{popup.titulo}</h4>
              <p className={`leading-relaxed opacity-90 ${isBanner ? 'text-sm' : 'mb-5 text-sm'}`}>
                {popup.contenido}
              </p>
            </div>

            {/* CTA */}
            {popup.enlaceUrl && popup.enlaceTexto && (
              <div className={isBanner ? 'flex-shrink-0 mt-2 sm:mt-0 mr-6' : 'mt-2'}>
                <Link 
                  href={popup.enlaceUrl}
                  target={popup.enlaceUrl.startsWith('http') ? '_blank' : '_self'}
                  className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: popup.colorTexto, 
                    color: popup.colorFondo,
                  }}
                >
                  {popup.enlaceTexto}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
