'use client';

import React, { useState, useEffect, useRef } from 'react';

type Noticia = {
  texto: string;
  etiqueta?: string;
};

type CintaNoticiasConfig = {
  noticias?: Noticia[];
  velocidad?: 'lenta' | 'normal' | 'rapida';
  colorFondo?: string;
  colorTexto?: string;
  colorEtiqueta?: string;
  etiquetaPrincipal?: string;
  mostrarIconoLive?: boolean;
};

export default function CintaNoticiasBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as CintaNoticiasConfig;
  const noticias = config.noticias || [];
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerWidth, setTickerWidth] = useState(0);

  if (noticias.length === 0) return null;

  const speedMap: Record<string, number> = { lenta: 50, normal: 30, rapida: 18 };
  const duration = speedMap[config.velocidad || 'normal'] || 30;

  const bgColor = config.colorFondo || '#0f172a';
  const textColor = config.colorTexto || '#e2e8f0';
  const labelColor = config.colorEtiqueta || '#FF5289';
  const mainLabel = config.etiquetaPrincipal || 'NOTICIAS';
  const showLive = config.mostrarIconoLive !== false;

  // Rotate the top headline every 5 seconds
  useEffect(() => {
    if (noticias.length <= 1) return;
    const interval = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((prev) => (prev + 1) % noticias.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [noticias.length, isPaused]);

  // Measure the single set width for seamless scrolling
  useEffect(() => {
    if (tickerRef.current) {
      const firstSet = tickerRef.current.querySelector('[data-ticker-set="0"]') as HTMLElement;
      if (firstSet) {
        setTickerWidth(firstSet.offsetWidth);
      }
    }
  }, [noticias]);

  const currentNoticia = noticias[activeIndex];

  // Build the separator + news items for the ticker
  const tickerItems = noticias.map((n, i) => (
    <span key={i} className="inline-flex items-center shrink-0">
      {i > 0 && (
        <span className="mx-4 inline-block h-1.5 w-1.5 rounded-full opacity-70" style={{ backgroundColor: textColor }} />
      )}
      {n.etiqueta && (
        <span
          className="mr-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: labelColor, color: '#fff' }}
        >
          {n.etiqueta}
        </span>
      )}
      <span className="tracking-wide">{n.texto}</span>
    </span>
  ));

  return (
    <div className="w-full relative shadow-md mb-8 mt-0" style={{ fontFamily: "'Inter', Arial, sans-serif" }}>

      {/* ═══ TOP BAR: Badge + Rotating Headline ═══ */}
      <div
        className="relative w-full overflow-hidden flex flex-col sm:flex-row sm:items-stretch"
        style={{ backgroundColor: bgColor }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* LEFT BADGE */}
        <div
          className="cinta-badge relative z-20 flex items-center justify-center gap-2 px-4 py-2.5 sm:justify-start sm:min-w-[180px] sm:px-5 sm:py-2"
          style={{
            backgroundColor: labelColor,
          }}
        >
          {showLive && (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          )}
          <span className="font-black text-sm sm:text-base uppercase tracking-tight text-white leading-none">
            {mainLabel}
          </span>
        </div>

        {/* RIGHT: Rotating headline */}
        <div className="flex-1 relative flex items-center px-4 py-2.5 sm:px-6 sm:py-0 z-10 overflow-hidden min-h-[54px] sm:min-h-0">
          <div className="relative w-full h-[38px] sm:h-[24px] overflow-hidden">
            {noticias.map((noticia, idx) => (
              <div
                key={idx}
                className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out"
                style={{
                  opacity: idx === activeIndex ? 1 : 0,
                  transform: idx === activeIndex ? 'translateY(0)' : 'translateY(100%)',
                }}
              >
                {noticia.etiqueta && (
                  <span
                    className="mr-3 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0"
                    style={{ backgroundColor: `${labelColor}33`, color: labelColor }}
                  >
                    {noticia.etiqueta}
                  </span>
                )}
                <p
                  className="font-medium text-xs sm:text-base m-0 truncate flex-1"
                  style={{ color: textColor }}
                >
                  {noticia.texto}
                </p>
              </div>
            ))}
          </div>

          {/* News counter */}
          {noticias.length > 1 && (
            <div className="ml-auto flex items-center gap-1.5 shrink-0 pl-4">
              {noticias.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: idx === activeIndex ? '16px' : '6px',
                    height: '6px',
                    backgroundColor: idx === activeIndex ? labelColor : `${textColor}44`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ BOTTOM TICKER: Seamless scrolling ribbon ═══ */}
      <div
        className="w-full relative py-2.5 sm:py-2 flex items-center overflow-hidden"
        style={{ backgroundColor: labelColor }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={tickerRef}
          className="flex whitespace-nowrap items-center text-white font-medium text-xs sm:text-sm leading-normal"
          style={{
            animation: `cinta-scroll ${duration * noticias.length}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {/* Two identical sets for seamless looping */}
          <span data-ticker-set="0" className="inline-flex items-center shrink-0 px-4">
            {tickerItems}
          </span>
          <span className="mx-4 inline-block h-1.5 w-1.5 rounded-full bg-white/70 shrink-0" />
          <span data-ticker-set="1" className="inline-flex items-center shrink-0 px-4">
            {tickerItems}
          </span>
          <span className="mx-4 inline-block h-1.5 w-1.5 rounded-full bg-white/70 shrink-0" />
        </div>
      </div>

      {/* Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cinta-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (min-width: 640px) {
          .cinta-badge {
            clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          }
        }
      `}} />
    </div>
  );
}
