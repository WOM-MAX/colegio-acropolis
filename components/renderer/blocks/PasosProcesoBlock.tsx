import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type PasoItem = {
  numero?: string;
  subtitulo?: string;
  titulo: string;
  descripcion?: string;
  badgeEstado?: string;
  colorEstado?: 'azul' | 'amarillo' | 'fucsia' | 'verde' | 'gris';
  enlaceUrl?: string;
  enlaceTexto?: string;
};

export type PasosProcesoConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  disenoVisual?: 'timeline' | 'tarjetas_conectadas' | 'cuadricula_numerada';
  estiloFondo?: 'gris' | 'blanco' | 'azul';
  pasos?: PasoItem[];
};

export default function PasosProcesoBlock({ configuracion }: { configuracion: PasosProcesoConfig }) {
  const {
    tituloSeccion = '',
    subtituloSeccion = '',
    disenoVisual = 'timeline',
    estiloFondo = 'gris',
    pasos = [],
  } = configuracion;

  if (!pasos || pasos.length === 0) return null;

  const bgClasses: Record<string, string> = {
    gris: 'bg-gris-claro border-y border-gray-200/80',
    blanco: 'bg-white border-y border-gray-100',
    azul: 'bg-azul-soft/50 border-y border-azul-acropolis/20',
  };
  const sectionBg = bgClasses[estiloFondo] || bgClasses.gris;

  const getBadgeClasses = (color?: string) => {
    switch (color) {
      case 'amarillo':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'fucsia':
        return 'bg-pink-100 text-pink-900 border-pink-300';
      case 'verde':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'gris':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'azul':
      default:
        return 'bg-azul-soft text-azul-acropolis border-blue-200';
    }
  };

  return (
    <section className={`py-14 sm:py-20 transition-colors ${sectionBg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Cabecera de la sección */}
        {(tituloSeccion || subtituloSeccion) && (
          <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
            {tituloSeccion && (
              <div
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-negro tracking-tight mb-3 font-outfit [&>p]:m-0"
                dangerouslySetInnerHTML={{ __html: tituloSeccion }}
              />
            )}
            {subtituloSeccion && (
              <div
                className="text-base sm:text-lg text-gris-texto leading-relaxed [&>p]:m-0"
                dangerouslySetInnerHTML={{ __html: subtituloSeccion }}
              />
            )}
            <div className="mt-4 flex justify-center">
              <div className="h-1.5 w-16 rounded-full bg-linear-to-r from-azul-acropolis via-amarillo-acropolis to-fucsia" />
            </div>
          </div>
        )}

        {/* Modalidad 1: TIMELINE VERTICAL */}
        {disenoVisual === 'timeline' && (
          <div className="relative max-w-4xl mx-auto">
            {/* Línea conectora central/lateral */}
            <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 -ml-0.5 bg-linear-to-b from-azul-acropolis via-blue-200 to-azul-acropolis/40 rounded-full" />

            <div className="space-y-8 sm:space-y-12">
              {pasos.map((paso, idx) => {
                const isEven = idx % 2 === 0;
                const stepNumber = paso.numero || `${idx + 1}`.padStart(2, '0');

                return (
                  <div key={idx} className="relative flex flex-col sm:flex-row items-start sm:items-center group">
                    {/* Contenido Izquierda (en desktop para pares) */}
                    <div className={`hidden sm:block sm:w-1/2 ${isEven ? 'sm:pr-12 text-right' : 'sm:order-2 sm:pl-12 text-left'}`}>
                      <div className="p-6 bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-azul-acropolis/40 transition-all duration-300">
                        {paso.subtitulo && (
                          <span className="inline-block text-xs font-bold uppercase tracking-wider text-azul-acropolis mb-1">
                            {paso.subtitulo}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-negro mb-2 group-hover:text-azul-acropolis transition-colors font-outfit">
                          {paso.titulo}
                        </h3>
                        {paso.descripcion && (
                          <p className="text-sm text-gris-texto leading-relaxed mb-4">
                            {paso.descripcion}
                          </p>
                        )}
                        <div className={`flex items-center gap-3 flex-wrap ${isEven ? 'justify-end' : 'justify-start'}`}>
                          {paso.badgeEstado && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeClasses(paso.colorEstado)}`}>
                              <Sparkles size={12} /> {paso.badgeEstado}
                            </span>
                          )}
                          {paso.enlaceUrl && (
                            <a
                              href={paso.enlaceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-azul-acropolis hover:text-azul-hover transition-colors bg-azul-soft/70 hover:bg-azul-soft px-3 py-1.5 rounded-lg border border-azul-acropolis/20"
                            >
                              <span>{paso.enlaceTexto || 'Más Información'}</span>
                              <ArrowRight size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nodo Central (Badge Circular 3D con Número) */}
                    <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center">
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-azul-acropolis to-azul-oscuro text-white font-extrabold text-sm shadow-md border-4 border-white group-hover:scale-110 group-hover:shadow-azul-acropolis/30 transition-transform duration-300">
                        {stepNumber}
                      </div>
                    </div>

                    {/* Contenido Móvil (siempre a la derecha del nodo) */}
                    <div className="sm:hidden pl-16 w-full">
                      <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all">
                        {paso.subtitulo && (
                          <span className="inline-block text-xs font-bold uppercase tracking-wider text-azul-acropolis mb-1">
                            {paso.subtitulo}
                          </span>
                        )}
                        <h3 className="text-base font-bold text-negro mb-1 font-outfit">
                          {paso.titulo}
                        </h3>
                        {paso.descripcion && (
                          <p className="text-xs text-gris-texto leading-relaxed mb-3">
                            {paso.descripcion}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {paso.badgeEstado && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeClasses(paso.colorEstado)}`}>
                              {paso.badgeEstado}
                            </span>
                          )}
                          {paso.enlaceUrl && (
                            <a
                              href={paso.enlaceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-azul-acropolis bg-azul-soft px-2.5 py-1 rounded-md"
                            >
                              <span>{paso.enlaceTexto || 'Ver enlace'}</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contenido Derecha (en desktop para impares) */}
                    <div className={`hidden sm:block sm:w-1/2 ${!isEven ? 'sm:pl-12 text-left' : 'sm:order-1 sm:pr-12 text-right'}`}>
                      {!isEven ? (
                        <div className="p-6 bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-azul-acropolis/40 transition-all duration-300">
                          {paso.subtitulo && (
                            <span className="inline-block text-xs font-bold uppercase tracking-wider text-azul-acropolis mb-1">
                              {paso.subtitulo}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-negro mb-2 group-hover:text-azul-acropolis transition-colors font-outfit">
                            {paso.titulo}
                          </h3>
                          {paso.descripcion && (
                            <p className="text-sm text-gris-texto leading-relaxed mb-4">
                              {paso.descripcion}
                            </p>
                          )}
                          <div className="flex items-center gap-3 flex-wrap justify-start">
                            {paso.badgeEstado && (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeClasses(paso.colorEstado)}`}>
                                <Sparkles size={12} /> {paso.badgeEstado}
                              </span>
                            )}
                            {paso.enlaceUrl && (
                              <a
                                href={paso.enlaceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-azul-acropolis hover:text-azul-hover transition-colors bg-azul-soft/70 hover:bg-azul-soft px-3 py-1.5 rounded-lg border border-azul-acropolis/20"
                              >
                                <span>{paso.enlaceTexto || 'Más Información'}</span>
                                <ArrowRight size={13} />
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Espacio vacío para equilibrar
                        <div />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modalidad 2: TARJETAS CONECTADAS */}
        {disenoVisual === 'tarjetas_conectadas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {pasos.map((paso, idx) => {
              const stepNumber = paso.numero || `${idx + 1}`.padStart(2, '0');
              const isLast = idx === pasos.length - 1;

              return (
                <div key={idx} className="relative flex flex-col">
                  <div className="flex-1 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-azul-acropolis/50 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-azul-soft text-azul-acropolis font-extrabold text-sm border border-azul-acropolis/20">
                          {stepNumber}
                        </span>
                        {paso.badgeEstado && (
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeClasses(paso.colorEstado)}`}>
                            {paso.badgeEstado}
                          </span>
                        )}
                      </div>

                      {paso.subtitulo && (
                        <span className="block text-xs font-semibold text-azul-acropolis/80 uppercase tracking-wider mb-1">
                          {paso.subtitulo}
                        </span>
                      )}

                      <h3 className="text-base font-bold text-negro mb-2 font-outfit leading-snug">
                        {paso.titulo}
                      </h3>

                      {paso.descripcion && (
                        <p className="text-xs sm:text-sm text-gris-texto leading-relaxed mb-4">
                          {paso.descripcion}
                        </p>
                      )}
                    </div>

                    {paso.enlaceUrl && (
                      <div className="pt-3 border-t border-gray-100 mt-2">
                        <a
                          href={paso.enlaceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-azul-acropolis hover:text-azul-hover transition-colors"
                        >
                          <span>{paso.enlaceTexto || 'Ver detalle'}</span>
                          <ChevronRight size={14} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Flecha conectora para desktop */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-xs items-center justify-center text-azul-acropolis">
                      <ChevronRight size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modalidad 3: CUADRÍCULA NUMERADA CON MARCA DE AGUA */}
        {disenoVisual === 'cuadricula_numerada' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pasos.map((paso, idx) => {
              const stepNumber = paso.numero || `${idx + 1}`.padStart(2, '0');

              return (
                <div
                  key={idx}
                  className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-azul-acropolis/40 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Número Gigante de Fondo (Watermark) */}
                  <span className="absolute -right-2 -bottom-4 text-7xl sm:text-8xl font-black text-gray-100 select-none pointer-events-none font-outfit">
                    {stepNumber}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-azul-soft text-azul-acropolis text-xs font-bold border border-azul-acropolis/20">
                        Etapa {stepNumber}
                      </span>
                      {paso.badgeEstado && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeClasses(paso.colorEstado)}`}>
                          {paso.badgeEstado}
                        </span>
                      )}
                    </div>

                    {paso.subtitulo && (
                      <p className="text-xs font-semibold text-azul-acropolis uppercase tracking-wider mb-1">
                        {paso.subtitulo}
                      </p>
                    )}

                    <h3 className="text-lg font-bold text-negro mb-2.5 font-outfit leading-snug">
                      {paso.titulo}
                    </h3>

                    {paso.descripcion && (
                      <p className="text-sm text-gris-texto leading-relaxed mb-4">
                        {paso.descripcion}
                      </p>
                    )}
                  </div>

                  {paso.enlaceUrl && (
                    <div className="relative z-10 pt-4 border-t border-gray-100 mt-2">
                      <a
                        href={paso.enlaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-azul-acropolis hover:text-azul-hover transition-colors"
                      >
                        <span>{paso.enlaceTexto || 'Acceder al paso'}</span>
                        <ArrowRight size={13} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
