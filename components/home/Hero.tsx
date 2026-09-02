'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';

const TOTAL_FRAMES = 150;
const NATIVE_WIDTH = 1284;
const NATIVE_HEIGHT = 716;
const SCROLL_TRAVEL_DESKTOP = 190;
const SCROLL_TRAVEL_MOBILE = 140;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(145);
  const [stickyHeight, setStickyHeight] = useState<number>(0);

  // Detectar altura del Header y dimensiones del sticky para cálculo milimétrico de la pista
  useEffect(() => {
    const updateDimensions = () => {
      const headerEl = document.querySelector('header');
      if (headerEl) {
        setHeaderHeight(headerEl.offsetHeight);
      }
      if (stickyRef.current) {
        setStickyHeight(stickyRef.current.offsetHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    // Un pequeño delay para asegurar renderizado de fuentes y estilos
    const timer = setTimeout(updateDimensions, 200);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // Función de renderizado en Canvas directa 1:1 en resolución HD nativa
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Buscar el fotograma exacto o el más cercano en buffer
    let img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[frameIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.clearRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);
    ctx.drawImage(img, 0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);
  }, []);

  // Inicialización y Pre-carga de fotogramas HD
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    // 1. Cargar inmediatamente el primer fotograma (LCP prioritario)
    const firstImg = new window.Image();
    firstImg.src = '/hero-frames/frame_000.webp';
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      drawFrame(0);
    };

    // 2. Pre-cargar progresivamente los 150 fotogramas en memoria
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = `/hero-frames/frame_${String(i).padStart(3, '0')}.webp`;
      img.onload = () => {
        imagesRef.current[i] = img;
        if (currentFrameRef.current === i) {
          drawFrame(i);
        }
      };
    }
  }, [drawFrame]);

  // Sincronización del Scroll con el Canvas vía requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const topOffset = headerHeight + 16;
      const isMobile = window.innerWidth < 640;
      const scrollDistance = isMobile ? SCROLL_TRAVEL_MOBILE : SCROLL_TRAVEL_DESKTOP;

      const currentScroll = topOffset - rect.top;
      const rawProgress = currentScroll / scrollDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setProgress(clamped);

      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(clamped * (TOTAL_FRAMES - 1)))
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          drawFrame(targetFrame);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawFrame, headerHeight]);

  // Cálculos de animación para las tarjetas flotantes
  const {
    cardWelcomeOpacity,
    cardWelcomeTranslateY,
    storyBadgeOpacity,
    storyBadgeTranslateY,
  } = useMemo(() => {
    // 1. Tarjeta Inicial de Bienvenida (0% -> 35%)
    let cWelcomeOp = 1;
    let cWelcomeY = 0;
    if (progress <= 0.20) {
      cWelcomeOp = 1;
      cWelcomeY = 0;
    } else if (progress <= 0.38) {
      const p = (progress - 0.20) / 0.18;
      cWelcomeOp = 1 - p;
      cWelcomeY = p * 20;
    } else {
      cWelcomeOp = 0;
      cWelcomeY = 20;
    }

    // 2. Tarjeta de Trayectoria (62% -> 85%)
    let sBadgeOp = 0;
    let sBadgeY = 20;
    if (progress < 0.62) {
      sBadgeOp = 0;
      sBadgeY = 20;
    } else if (progress <= 0.82) {
      const p = (progress - 0.62) / 0.20;
      sBadgeOp = p;
      sBadgeY = 20 * (1 - p);
    } else {
      sBadgeOp = 1;
      sBadgeY = 0;
    }

    return {
      cardWelcomeOpacity: cWelcomeOp,
      cardWelcomeTranslateY: cWelcomeY,
      storyBadgeOpacity: sBadgeOp,
      storyBadgeTranslateY: sBadgeY,
    };
  }, [progress]);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  const scrollDistance = isMobile ? SCROLL_TRAVEL_MOBILE : SCROLL_TRAVEL_DESKTOP;
  const sectionHeight = stickyHeight ? stickyHeight + scrollDistance : undefined;

  return (
    <section
      id="hero-scrub-container"
      ref={containerRef}
      className="relative w-full pb-0 mb-0"
      style={{
        height: sectionHeight ? `${sectionHeight}px` : '110vh',
      }}
    >
      {/* Contenedor Sticky calibrado */}
      <div
        ref={stickyRef}
        className="sticky w-full flex items-center justify-center px-4 sm:px-6 pt-4 sm:pt-6 pb-0 overflow-hidden"
        style={{
          top: `${headerHeight + 16}px`,
        }}
      >
        {/* ========================================================= */}
        {/* CONTENEDOR PRINCIPAL: PROPORCIÓN NATIVA 1284/716           */}
        {/* ========================================================= */}
        <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl shadow-2xl bg-azul-oscuro border border-white/15 min-h-[460px] sm:min-h-0 sm:aspect-[1284/716] max-h-[calc(100vh-175px)]">
          
          {/* Canvas de Fotogramas HD 1284x716 con aceleración GPU */}
          <canvas
            ref={canvasRef}
            width={NATIVE_WIDTH}
            height={NATIVE_HEIGHT}
            className="absolute inset-0 w-full h-full block object-cover z-0 will-change-transform"
          />

          {/* Tinte institucional y gradientes de profundidad */}
          <div className="absolute inset-0 bg-azul-acropolis/10 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-oscuro/60 via-transparent to-azul-oscuro/20 pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />

          {/* ========================================================= */}
          {/* TARJETA DE CRISTAL FLOTANTE (GLASSMORPHISM INSTITUCIONAL)  */}
          {/* ========================================================= */}
          
          {/* FASE 1: BIENVENIDOS AL COLEGIO ACRÓPOLIS */}
          <div
            className="absolute z-10 bottom-4 left-4 w-[calc(100%-2rem)] max-w-[290px] rounded-3xl bg-azul-acropolis/40 p-5 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl border border-white/30 sm:bottom-6 sm:left-6 sm:max-w-[340px] lg:bottom-8 lg:left-8 lg:max-w-[360px] lg:p-7 will-change-transform will-change-opacity transition-opacity"
            style={{
              opacity: cardWelcomeOpacity,
              transform: `translateY(${cardWelcomeTranslateY}px)`,
              pointerEvents: cardWelcomeOpacity < 0.1 ? 'none' : 'auto',
            }}
          >
            <h1 className="mb-3 leading-[1.1] tracking-tight lg:leading-[1.15]">
              <span className="mb-1 block text-[17px] font-bold tracking-normal text-white/95 sm:text-2xl">
                Bienvenidos al
              </span>
              <span className="block text-[28px] font-extrabold text-amarillo sm:text-4xl lg:text-[38px] leading-tight">
                Colegio<br />Acrópolis
              </span>
            </h1>

            <p className="mb-5 text-[13px] leading-relaxed text-slate-100 sm:text-base">
              Formando estudiantes íntegros con excelencia académica en el corazón de Puente Alto, Santiago de Chile.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/admision"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-cian px-6 text-[14px] font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-cian/30"
              >
                Proceso de Admisión
              </Link>
              <Link
                href="/nuestra-historia"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/50 bg-transparent px-6 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Conócenos
              </Link>
            </div>
          </div>

          {/* FASE 2: REDACCIÓN ATEMPORAL (Fundado en 2003 · Más de dos décadas) */}
          <div
            className="absolute z-10 bottom-4 left-4 w-[calc(100%-2rem)] max-w-[290px] rounded-3xl bg-azul-acropolis/40 p-5 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl border border-white/30 sm:bottom-6 sm:left-6 sm:max-w-[340px] lg:bottom-8 lg:left-8 lg:max-w-[360px] lg:p-7 will-change-transform will-change-opacity transition-opacity"
            style={{
              opacity: storyBadgeOpacity,
              transform: `translateY(${storyBadgeTranslateY}px)`,
              pointerEvents: storyBadgeOpacity > 0.3 ? 'auto' : 'none',
            }}
          >
            <h2 className="mb-3 leading-[1.1] tracking-tight lg:leading-[1.15]">
              <span className="mb-1 block text-[17px] font-bold tracking-normal text-white/95 sm:text-2xl">
                Fundado en 2003
              </span>
              <span className="block text-[28px] font-extrabold text-amarillo sm:text-4xl lg:text-[38px] leading-tight">
                Colegio<br />Acrópolis
              </span>
            </h2>

            <p className="mb-5 text-[13px] leading-relaxed text-slate-100 sm:text-base">
              Más de dos décadas construyendo el futuro de Puente Alto con dedicación, valores y excelencia valórica.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/admision"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-cian px-6 text-[14px] font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-cian/30"
              >
                Admisión y Matrícula
              </Link>
              <Link
                href="/nuestra-historia"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/50 bg-transparent px-6 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Nuestra Historia
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

