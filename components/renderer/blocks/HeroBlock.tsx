import React from 'react';
import FadeIn from '@/components/ui/FadeIn';

type HeroConfig = {
  titulo: string;
  subtitulo?: string;
  imagenFondo?: string;
  colorOverlay?: string; // ej: 'bg-azul-acropolis/80'
};

export default function HeroBlock({ configuracion }: { configuracion: any }) {
  const config = configuracion as HeroConfig;
  const bgImage = config.imagenFondo || '/images/colegio-fachada.jpg';
  
  return (
    <div className="relative flex min-h-[40vh] sm:min-h-[50vh] flex-col items-center justify-center overflow-hidden bg-negro">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={config.titulo || "Hero acropolis"}
          fetchPriority="high"
          className="h-full w-full object-cover object-center opacity-80"
        />
        {/* Overlay gradient para asegurar legibilidad */}
        <div className={`absolute inset-0 ${config.colorOverlay || 'bg-gradient-to-t from-negro/90 via-negro/60 to-negro/40'}`} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <FadeIn direction="up">
          <div className="rich-title mb-4 font-bold tracking-tight text-white [&_h2]:text-4xl [&_h2]:sm:text-5xl [&_h2]:md:text-6xl [&_h3]:text-3xl [&_h3]:sm:text-4xl [&_h3]:md:text-5xl [&_h4]:text-2xl [&_h4]:sm:text-3xl [&_h4]:md:text-4xl [&_p]:text-4xl [&_p]:sm:text-5xl [&_p]:md:text-6xl"
              dangerouslySetInnerHTML={{ __html: config.titulo || 'Sin Título' }} />
          {config.subtitulo && (
            <div className="mx-auto mt-4 max-w-2xl text-lg text-gris-claro sm:text-xl [&_p]:m-0"
                 dangerouslySetInnerHTML={{ __html: config.subtitulo }} />
          )}
        </FadeIn>
      </div>
    </div>
  );
}
