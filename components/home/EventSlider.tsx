'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  imagenUrl?: string;
}

function SkeletonCard() {
  return (
    <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl bg-fucsia/30">
      <div className="relative w-full aspect-square bg-fucsia/20 animate-pulse" />
      <div className="flex flex-col items-center p-6">
        <div className="mb-3 h-5 w-3/4 rounded bg-fucsia/20 animate-pulse" />
        <div className="h-10 w-full rounded bg-fucsia/20 animate-pulse" />
      </div>
    </div>
  );
}

export default function EventSlider() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Number of visible cards based on screen size
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else setVisibleCount(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const res = await fetch('/api/eventos');
        const data = await res.json();
        setEventos(data.eventos || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchEventos();
  }, []);

  const maxIndex = Math.max(0, eventos.length - visibleCount);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide every 4 seconds, paused on hover
  useEffect(() => {
    if (isHovered || eventos.length <= visibleCount) return;

    intervalRef.current = setInterval(goNext, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, goNext, eventos.length, visibleCount]);

  if (error) return null;

  if (!loading && eventos.length === 0) {
    return (
      <section className="bg-gris-claro py-16 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gris-texto" />
          <p className="text-gris-texto">
            No hay eventos programados para {new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(new Date())}
          </p>
        </div>
      </section>
    );
  }

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const formatter = new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Calculate percentage offset for smooth sliding
  const cardWidthPercent = 100 / visibleCount;
  const gapPx = 20; // gap between cards in px
  const translateX = currentIndex * cardWidthPercent;

  return (
    <section id="eventos" className="bg-gris-claro px-6 py-16">
      <div
        className="relative mx-auto max-w-7xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-negro">
              Eventos del Mes
            </h2>
            <p className="mt-1 text-gris-texto">Actividades y fechas importantes</p>
          </div>

          {/* Nav arrows - desktop */}
          {!loading && eventos.length > visibleCount && (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={goPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-md transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Eventos anteriores"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-md transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Más eventos"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel container */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${translateX}%)`,
              gap: `${gapPx}px`,
            }}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0"
                    style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (visibleCount - 1) / visibleCount}px)` }}
                  >
                    <SkeletonCard />
                  </div>
                ))
              : eventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="shrink-0"
                    style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (visibleCount - 1) / visibleCount}px)` }}
                  >
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-fucsia shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                      {/* Image */}
                      <div className="relative aspect-square w-full bg-gris-claro">
                        {evento.imagenUrl ? (
                          <Image
                            src={evento.imagenUrl}
                            alt={evento.nombre}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <Calendar size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex flex-1 flex-col items-center justify-start p-6 text-center text-white">
                        <h3 className="mb-2 text-base font-extrabold sm:text-lg">
                          {formatFullDate(evento.fecha)}
                        </h3>
                        <p className="text-sm font-medium leading-relaxed text-white/90">
                          {evento.nombre}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Mobile arrows */}
        {!loading && eventos.length > visibleCount && (
          <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
            <button
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-md"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-6 bg-azul-acropolis' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Ir a grupo ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-amarillo text-azul-acropolis shadow-md"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Desktop dots indicator */}
        {!loading && eventos.length > visibleCount && (
          <div className="mt-6 hidden items-center justify-center gap-1.5 sm:flex">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-azul-acropolis' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Ir a grupo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
