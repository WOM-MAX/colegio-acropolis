'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DirectivoEmailButton from './DirectivoEmailButton';

type Miembro = {
  nombre: string;
  cargo: string;
  fotoUrl?: string;
  descripcion?: string;
};

type EquipoConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  modoVisualizacion?: 'carrusel' | 'grilla';
  estiloFondo?: 'gris' | 'blanco' | 'azul';
  miembros?: Miembro[];
};

export default function EquipoBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as EquipoConfig;
  const miembros = config.miembros || [];
  const modoVisualizacion = config.modoVisualizacion || 'carrusel';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Soporte para gestos táctiles (Swipe en móviles)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else if (w < 1280) setVisibleCount(3);
      else setVisibleCount(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, miembros.length - visibleCount);

  // Ajustar el índice si el tamaño de pantalla cambia y deja un índice fuera de rango
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Deslizamiento automático suave cada 5 segundos, pausado al pasar el ratón o interactuar
  useEffect(() => {
    if (modoVisualizacion !== 'carrusel') return;
    if (isHovered || miembros.length <= visibleCount) return;

    intervalRef.current = setInterval(goNext, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, goNext, miembros.length, visibleCount, modoVisualizacion]);

  // Gestos táctiles para dispositivos móviles
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      goNext();
    } else if (distance < -minSwipeDistance) {
      goPrev();
    }
  };

  if (miembros.length === 0) return null;

  const gapPx = 24; // Separación entre tarjetas en px
  const cardWidthPercent = 100 / visibleCount;
  const showControls = modoVisualizacion === 'carrusel' && miembros.length > visibleCount;

  // Renderizar tarjeta individual de Directivo / Miembro
  const renderCard = (miembro: Miembro, index: number) => {
    const emailText = miembro.descripcion ? miembro.descripcion.trim() : '';
    const isEmail = emailText.includes('@') && !emailText.includes(' ');

    return (
      <div
        key={index}
        className="group relative flex flex-col h-full w-full bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] border border-gray-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(70,97,246,0.12),0_4px_12px_rgba(0,0,0,0.05)] hover:border-azul-acropolis/40 focus-within:z-30 justify-between text-center select-none"
      >
        <div>
          {/* Marco de Imagen / Insignia integrado dentro de la tarjeta */}
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 flex items-center justify-center p-2">
            {miembro.fotoUrl ? (
              <img
                src={miembro.fotoUrl}
                alt={miembro.nombre}
                loading="lazy"
                className="h-full w-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              />
            ) : (
              <div className="w-full h-full rounded-lg flex items-center justify-center bg-gradient-to-br from-azul-acropolis to-azul-oscuro text-white">
                <span className="text-4xl font-bold tracking-tight opacity-90">
                  {miembro.nombre.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Nombre Nítido en Tinta Oscura */}
          <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight mb-1.5 leading-snug group-hover:text-azul-acropolis transition-colors subpixel-antialiased">
            {miembro.nombre}
          </h3>

          {/* Cargo en Fucsia de Alto Contraste y Nitidez (WCAG AAA) */}
          <p className="text-xs font-semibold text-[#B81D5B] tracking-wide leading-relaxed mb-3.5 subpixel-antialiased line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
            {miembro.cargo}
          </p>
        </div>

        {/* Botón de Correo Interactivo en la Base */}
        {miembro.descripcion && (
          <div className="pt-3 border-t border-slate-100 w-full">
            {isEmail ? (
              <DirectivoEmailButton
                email={emailText}
                nombre={miembro.nombre}
              />
            ) : (
              <p className="text-xs text-gris-texto leading-relaxed line-clamp-2">{miembro.descripcion}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const bgClasses: Record<string, string> = {
    gris: 'bg-gris-claro border-y border-gray-200/80',
    blanco: 'bg-white border-y border-gray-100',
    azul: 'bg-azul-soft/50 border-y border-azul-acropolis/20',
  };
  const sectionBg = bgClasses[config.estiloFondo || 'gris'] || bgClasses.gris;

  return (
    <section className={`py-12 sm:py-16 ${sectionBg} relative overflow-hidden`}>
      {/* Elementos de luz ambiental sutiles */}
      <div className="absolute top-12 right-0 w-80 h-80 bg-azul-acropolis/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-0 w-80 h-80 bg-amarillo/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Encabezado con Controles de Carrusel Integrados */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-center sm:text-left">
            {config.tituloSeccion && (
              <div
                className="text-2xl sm:text-3xl font-bold tracking-tight text-negro mb-2 leading-tight [&_*]:text-2xl sm:[&_*]:text-3xl [&_*]:font-bold [&_*]:tracking-tight [&_*]:text-negro [&_*]:m-0 [&_*]:leading-tight"
                dangerouslySetInnerHTML={{ __html: config.tituloSeccion }}
              />
            )}
            {config.subtituloSeccion && (
              <div
                className="text-sm sm:text-base text-gris-texto max-w-xl [&_p]:m-0 mt-1.5"
                dangerouslySetInnerHTML={{ __html: config.subtituloSeccion }}
              />
            )}
            {/* Línea decorativa Acrópolis */}
            <div className="mt-3 flex justify-center sm:justify-start items-center">
              <div className="w-10 h-1 bg-amarillo rounded-full" />
              <div className="w-3.5 h-1 bg-azul-acropolis rounded-full ml-1.5" />
            </div>
          </div>

          {/* Flechas de Navegación en Escritorio */}
          {showControls && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Directivo anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-sm transition-all hover:scale-110 hover:shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Siguiente directivo"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-sm transition-all hover:scale-110 hover:shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Visualización: Carrusel o Grilla Tradicional */}
        {modoVisualizacion === 'carrusel' ? (
          <div
            className="relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Contenedor del Slider con margen para sombras y menús */}
            <div className="overflow-hidden py-3 -my-3 px-1 -mx-1">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${currentIndex * cardWidthPercent}% - ${currentIndex * (gapPx / visibleCount)}px))`,
                  gap: `${gapPx}px`,
                }}
              >
                {miembros.map((miembro, index) => (
                  <div
                    key={index}
                    className="shrink-0 flex"
                    style={{
                      width: `calc(${cardWidthPercent}% - ${(gapPx * (visibleCount - 1)) / visibleCount}px)`,
                    }}
                  >
                    {renderCard(miembro, index)}
                  </div>
                ))}
              </div>
            </div>

            {/* Controles en Móvil (Flechas + Dots) */}
            {showControls && (
              <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-md"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                {/* Dots indicadores */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-6 bg-azul-acropolis' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Ir a grupo ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-md"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Dots Indicadores en Escritorio */}
            {showControls && (
              <div className="mt-6 hidden items-center justify-center gap-1.5 sm:flex">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentIndex ? 'w-6 bg-azul-acropolis' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir a grupo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Modo Grilla Alternativo */
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {miembros.map((miembro, index) => (
              <div key={index} className="w-full max-w-[300px] sm:max-w-[280px] flex">
                {renderCard(miembro, index)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
