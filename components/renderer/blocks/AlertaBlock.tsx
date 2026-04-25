'use client';

import React from 'react';
import Link from 'next/link';
import { Megaphone, AlertTriangle, Bell, ArrowRight } from 'lucide-react';

type AlertaConfig = {
  mensaje: string;
  tipo?: string; // 'info' (azul), 'warning' (amarillo), 'error' (rojo oscuro)
  textoEnlace?: string;
  enlaceUrl?: string;
  estiloAlerta?: 'estandar' | 'marquesina';
};

export default function AlertaBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as AlertaConfig;
  
  if (!config.mensaje) return null;

  const isMarquesina = config.estiloAlerta === 'marquesina';

  const styles: Record<string, {
    bg: string;
    border: string;
    iconBg: string;
    text: string;
    btnClass: string;
    icon: React.ReactNode;
  }> = {
    info: {
      bg: 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50',
      border: 'border-l-4 border-azul-acropolis',
      iconBg: 'bg-azul-acropolis',
      text: 'text-azul-acropolis',
      btnClass: 'bg-azul-acropolis text-white hover:bg-azul-hover shadow-azul-acropolis/25',
      icon: <Megaphone className="w-5 h-5 text-white" />,
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50',
      border: 'border-l-4 border-amarillo-acropolis',
      iconBg: 'bg-amarillo-acropolis',
      text: 'text-amber-800',
      btnClass: 'bg-amarillo-acropolis text-azul-acropolis hover:bg-yellow-400 shadow-yellow-400/25',
      icon: <AlertTriangle className="w-5 h-5 text-azul-acropolis" />,
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 via-rose-50 to-red-50',
      border: 'border-l-4 border-red-500',
      iconBg: 'bg-red-500',
      text: 'text-red-800',
      btnClass: 'bg-red-500 text-white hover:bg-red-600 shadow-red-400/25',
      icon: <Bell className="w-5 h-5 text-white" />,
    },
  };

  const s = styles[config.tipo || 'info'] || styles.info;

  // ────── Marquesina (CNN-style ticker) ──────
  if (isMarquesina) {
    const tickerBg = config.tipo === 'warning'
      ? 'bg-gradient-to-r from-amarillo-acropolis to-yellow-400'
      : config.tipo === 'error'
      ? 'bg-gradient-to-r from-red-600 to-red-500'
      : 'bg-gradient-to-r from-azul-acropolis to-blue-700';
    
    const tickerText = config.tipo === 'warning' ? 'text-azul-acropolis' : 'text-white';

    return (
      <div className={`w-full py-3 px-4 ${tickerBg} shadow-md overflow-hidden relative`}>
        <div className="flex whitespace-nowrap animate-marquee items-center gap-8">
          {/* Repeat content 3x for seamless loop */}
          {[0, 1, 2].map((rep) => (
            <React.Fragment key={rep}>
              <div className={`flex items-center gap-3 font-semibold text-[15px] ${tickerText} flex-shrink-0`}>
                <span className="opacity-60">●</span>
                <span>{config.mensaje}</span>
                {config.textoEnlace && config.enlaceUrl && (
                  <Link href={config.enlaceUrl} className={`underline underline-offset-2 font-bold ${tickerText}`}>
                    {config.textoEnlace} →
                  </Link>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
      </div>
    );
  }

  // ────── Estándar (card-style alert) ──────
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-5xl mx-auto rounded-2xl ${s.bg} ${s.border} shadow-sm overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
          {/* Icon badge */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg`}>
            {s.icon}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className={`text-[15px] font-semibold leading-relaxed ${s.text}`}>
              {config.mensaje}
            </p>
          </div>

          {/* CTA Button */}
          {config.textoEnlace && config.enlaceUrl && (
            <Link
              href={config.enlaceUrl}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${s.btnClass}`}
            >
              {config.textoEnlace}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
