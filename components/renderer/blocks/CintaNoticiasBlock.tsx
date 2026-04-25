'use client';

import React, { useRef, useEffect, useState } from 'react';

type Noticia = {
  texto: string;
  etiqueta?: string; // e.g. "HEADLINE", "LIVE STREAM"
};

type CintaNoticiasConfig = {
  noticias?: Noticia[];
  velocidad?: 'lenta' | 'normal' | 'rapida';
  colorFondo?: string;  // Usually red #E3000F
  colorTexto?: string;
  etiquetaPrincipal?: string; // "BREAKING NEWS"
};

export default function CintaNoticiasBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as CintaNoticiasConfig;
  const noticias = config.noticias || [];
  const [isPaused, setIsPaused] = useState(false);

  if (noticias.length === 0) return null;

  // Timings
  const speedMap: Record<string, number> = { lenta: 40, normal: 25, rapida: 14 };
  const duration = speedMap[config.velocidad || 'normal'] || 25;

  // Colors mapping (based on the reference image)
  const redColor = config.colorFondo || '#de0a0a';
  const mainLabel = config.etiquetaPrincipal || 'BREAKING NEWS';
  
  // Build ticker content - repeated for seamless running
  const tickerContent = [...noticias, ...noticias, ...noticias, ...noticias];

  return (
    <div className="w-full relative shadow-md bg-[#e2e2e2] mb-16 mt-0" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* MAIN WRAPPER: Grey title bar and Badge */}
      <div className="relative w-full overflow-hidden flex items-stretch min-h-[64px] bg-gradient-to-b from-[#fdfdfd] to-[#cccccc] border-b-[5px] border-[#a0a0a0]">
        
        {/* LEFT BADGE (BREAKING NEWS) */}
        <div 
          className="relative z-20 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[200px] px-4 sm:px-6 py-2 text-white"
          style={{
            background: `linear-gradient(to bottom, #ff1a1a, ${redColor})`,
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
            boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)'
          }}
        >
          {mainLabel.split(' ').length > 1 ? (
            <>
              <span className="font-bold text-[11px] tracking-widest uppercase opacity-90 mb-0.5">
                {mainLabel.split(' ')[0]}
              </span>
              <span className="font-black text-lg sm:text-2xl uppercase tracking-tighter leading-none text-center">
                {mainLabel.split(' ').slice(1).join(' ')}
              </span>
            </>
          ) : (
            <span className="font-black text-xl uppercase tracking-tighter leading-none">
              {mainLabel}
            </span>
          )}
        </div>

        {/* RIGHT METADATA (HEADLINE text in the middle) */}
        <div className="flex-1 relative flex flex-col justify-center px-8 z-10 py-2">
           {/* Static text display for the main news (can just take the first news to display here as title) */}
           {noticias[0]?.etiqueta && (
             <h2 className="text-[#a00000] font-black text-xl sm:text-3xl m-0 leading-none tracking-tight uppercase" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.7)'}}>
               {noticias[0].etiqueta}
             </h2>
           )}
           <p className="text-[#444] font-medium text-sm mt-1 max-w-4xl truncate">
             {noticias[0]?.texto}
           </p>

           {/* Inner light glare effect for 3D metallic feel */}
           <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 pointer-events-none" />
        </div>
      </div>

      {/* BOTTOM TICKER RIBBON (Small Red running text) */}
      <div 
        className="w-full relative h-[25px] flex items-center overflow-hidden border-b-2 border-[#7a0000]"
        style={{ background: `linear-gradient(to bottom, #ff1a1a, ${redColor})` }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
         <div
          className="flex whitespace-nowrap items-center h-full text-white font-medium text-sm px-4"
          style={{
            animation: `ticker-scroll ${duration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {tickerContent.map((noticia, index) => (
            <React.Fragment key={index}>
              {/* Dot separator */}
              {index > 0 && <span className="mx-3 rounded-full bg-white h-1.5 w-1.5 opacity-80" />}
              <span className="tracking-wide">
                {noticia.texto}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Scrolling Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
