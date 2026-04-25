'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface GaleriaItem {
  id: number;
  tipo: string;
  imagenUrl: string;
  videoUrl: string | null;
  caption: string | null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  // Matches youtube.com/watch?v=ID, youtu.be/ID and youtube.com/embed/ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
  return null;
}

function getEmbedUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url) || url;
}

export default function GaleriaViewer({ items }: { items: GaleriaItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % items.length);
    }
  }, [lightboxIndex, items.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
    }
  }, [lightboxIndex, items.length]);

  // Soporte para teclado (Accesibilidad Premium)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Evitar que el fondo (body) haga scroll cuando el Lightbox está abierto
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, goNext, goPrev]);

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      {/* Diseño Masonry (Mosaico Fluido) */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-azul-acropolis focus:ring-offset-2"
          >
            <img
              src={item.imagenUrl}
              alt={item.caption || 'Galería'}
              loading="lazy"
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Video badge */}
            {item.tipo === 'video' && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-azul-acropolis shadow-xl transition-transform duration-500 group-hover:scale-110">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
            )}

            {/* Caption */}
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 opacity-0 p-5 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-left text-sm font-medium text-white drop-shadow-lg line-clamp-3">
                  {item.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-opacity duration-300"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20 hover:scale-105"
            title="Cerrar (Esc)"
          >
            <X size={24} />
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-105 hidden sm:block"
              title="Anterior (Flecha Izquierda)"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-105 hidden sm:block"
              title="Siguiente (Flecha Derecha)"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Content */}
          <div
            key={currentItem.id} // Forza re-render para que se aplique la transición natural de la imagen
            className="relative flex max-h-[90vh] max-w-5xl w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.tipo === 'video' && currentItem.videoUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
                <iframe
                  src={getEmbedUrl(currentItem.videoUrl) || ''}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={currentItem.imagenUrl}
                alt={currentItem.caption || 'Galería'}
                className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl ring-1 ring-white/10 transition-opacity duration-300"
              />
            )}

            {/* Caption */}
            {currentItem.caption && (
              <p className="mt-4 text-center text-sm font-medium text-white/80">
                {currentItem.caption}
              </p>
            )}

            {/* Counter */}
            <p className="mt-2 text-center text-xs text-white/50">
              {lightboxIndex! + 1} / {items.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
