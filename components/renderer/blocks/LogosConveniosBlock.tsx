import React from 'react';
import Image from 'next/image';
import { ExternalLink, Award, Building2 } from 'lucide-react';

export type LogoItem = {
  nombre: string;
  logoUrl: string;
  enlaceUrl?: string;
  descripcionCorta?: string;
  categoria?: string;
};

export type LogosConveniosConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  disenoVisual?: 'grilla_elegante' | 'cinta_continua';
  escalaGrises?: boolean;
  estiloFondo?: 'gris' | 'blanco' | 'azul';
  logos?: LogoItem[];
};

export default function LogosConveniosBlock({ configuracion }: { configuracion: LogosConveniosConfig }) {
  const {
    tituloSeccion = '',
    subtituloSeccion = '',
    disenoVisual = 'grilla_elegante',
    escalaGrises = true,
    estiloFondo = 'blanco',
    logos = [],
  } = configuracion;

  if (!logos || logos.length === 0) return null;

  const bgClasses: Record<string, string> = {
    gris: 'bg-gris-claro border-y border-gray-200/80',
    blanco: 'bg-white border-y border-gray-100',
    azul: 'bg-azul-soft/50 border-y border-azul-acropolis/20',
  };
  const sectionBg = bgClasses[estiloFondo] || bgClasses.blanco;

  const logoEffects = escalaGrises
    ? 'grayscale hover:grayscale-0 opacity-75 hover:opacity-100 contrast-125 hover:contrast-100 transition-all duration-300'
    : 'transition-transform duration-300 hover:scale-105';

  return (
    <section className={`py-12 sm:py-16 transition-colors ${sectionBg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Cabecera de la sección */}
        {(tituloSeccion || subtituloSeccion) && (
          <div className="mb-10 text-center max-w-3xl mx-auto">
            {tituloSeccion && (
              <div
                className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-negro tracking-tight mb-2 font-outfit [&>p]:m-0"
                dangerouslySetInnerHTML={{ __html: tituloSeccion }}
              />
            )}
            {subtituloSeccion && (
              <div
                className="text-sm sm:text-base text-gris-texto leading-relaxed [&>p]:m-0"
                dangerouslySetInnerHTML={{ __html: subtituloSeccion }}
              />
            )}
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-12 rounded-full bg-linear-to-r from-azul-acropolis via-amarillo-acropolis to-fucsia" />
            </div>
          </div>
        )}

        {/* Modalidad 1: GRILLA ELEGANTE */}
        {disenoVisual === 'grilla_elegante' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
            {logos.map((item, idx) => {
              const CardContent = (
                <div className="h-full flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-azul-acropolis/30 transition-all duration-300 group text-center">
                  <div className="relative w-full h-16 sm:h-20 mb-3 flex items-center justify-center">
                    {item.logoUrl ? (
                      <Image
                        src={item.logoUrl}
                        alt={item.nombre}
                        fill
                        className={`object-contain ${logoEffects}`}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    ) : (
                      <Building2 size={32} className="text-gray-300" />
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-negro group-hover:text-azul-acropolis transition-colors line-clamp-2">
                    {item.nombre}
                  </h4>

                  {item.descripcionCorta && (
                    <p className="text-[11px] text-gris-texto mt-1 line-clamp-1">
                      {item.descripcionCorta}
                    </p>
                  )}

                  {item.categoria && (
                    <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-azul-acropolis bg-azul-soft px-2 py-0.5 rounded-md">
                      {item.categoria}
                    </span>
                  )}
                </div>
              );

              if (item.enlaceUrl) {
                return (
                  <a
                    key={idx}
                    href={item.enlaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full transition-transform hover:-translate-y-1"
                    title={`Visitar ${item.nombre}`}
                  >
                    {CardContent}
                  </a>
                );
              }

              return (
                <div key={idx} className="h-full">
                  {CardContent}
                </div>
              );
            })}
          </div>
        )}

        {/* Modalidad 2: CINTA CONTINUA (Ticker horizontal elegante) */}
        {disenoVisual === 'cinta_continua' && (
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 py-4">
            {logos.map((item, idx) => {
              const LogoElement = (
                <div className="flex flex-col items-center group">
                  <div className="relative w-28 sm:w-36 h-14 sm:h-16 flex items-center justify-center">
                    {item.logoUrl ? (
                      <Image
                        src={item.logoUrl}
                        alt={item.nombre}
                        fill
                        className={`object-contain ${logoEffects}`}
                        sizes="150px"
                      />
                    ) : (
                      <Building2 size={28} className="text-gray-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-gris-texto group-hover:text-azul-acropolis transition-colors mt-1 max-w-32 text-center truncate">
                    {item.nombre}
                  </span>
                </div>
              );

              if (item.enlaceUrl) {
                return (
                  <a
                    key={idx}
                    href={item.enlaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.nombre}
                    className="transition-transform hover:scale-105"
                  >
                    {LogoElement}
                  </a>
                );
              }

              return <div key={idx}>{LogoElement}</div>;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
