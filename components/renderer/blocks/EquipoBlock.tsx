import React from 'react';
import { Mail } from 'lucide-react';

type EquipoConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  miembros?: {
    nombre: string;
    cargo: string;
    fotoUrl?: string;
    descripcion?: string;
  }[];
};

export default function EquipoBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as EquipoConfig;
  const miembros = config.miembros || [];

  if (miembros.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-gris-fondo border-y border-gray-200/70 relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-azul-acropolis/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-amarillo/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado Principal de Sección */}
        {(config.tituloSeccion || config.subtituloSeccion) && (
          <div className="text-center mb-12 sm:mb-16">
            {config.tituloSeccion && (
              <div
                className="rich-title text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-negro mb-3 leading-tight [&_p]:m-0 [&_h1]:text-3xl sm:[&_h1]:text-4xl [&_h2]:text-3xl sm:[&_h2]:text-4xl [&_h3]:text-2xl sm:[&_h3]:text-3xl"
                dangerouslySetInnerHTML={{ __html: config.tituloSeccion }}
              />
            )}
            {config.subtituloSeccion && (
              <div
                className="text-base sm:text-lg text-gris-texto max-w-2xl mx-auto [&_p]:m-0 mt-2"
                dangerouslySetInnerHTML={{ __html: config.subtituloSeccion }}
              />
            )}
            {/* Línea decorativa Acrópolis */}
            <div className="mt-4 flex justify-center items-center">
              <div className="w-12 h-1 bg-amarillo-acropolis rounded-full" />
              <div className="w-4 h-1 bg-azul-acropolis rounded-full ml-1.5" />
            </div>
          </div>
        )}

        {/* Grilla de Perfiles */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
          {miembros.map((miembro, index) => {
            const emailText = miembro.descripcion ? miembro.descripcion.trim() : '';
            const isEmail = emailText.includes('@') && !emailText.includes(' ');

            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center w-full max-w-[280px] sm:w-72 transition-all duration-300"
              >
                {/* Contenedor de Foto Circular */}
                <div className="relative mb-5">
                  <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-white p-1.5 shadow-md border-2 border-gray-100 transition-transform duration-500 group-hover:scale-105 group-hover:border-azul-acropolis/30">
                    <div className="w-full h-full rounded-full overflow-hidden bg-azul-soft flex items-center justify-center">
                      {miembro.fotoUrl ? (
                        <img
                          src={miembro.fotoUrl}
                          alt={miembro.nombre}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-azul-acropolis to-azul-oscuro text-white">
                          <span className="text-4xl font-bold tracking-tight opacity-90">
                            {miembro.nombre.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tarjeta de Información */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] border border-gray-100/90 w-full flex-1 flex flex-col justify-between transition-all duration-300 group-hover:shadow-[var(--shadow-card-hover)] group-hover:-translate-y-1">
                  <div>
                    {/* Nombre */}
                    <h3 className="text-base sm:text-lg font-extrabold text-negro uppercase tracking-tight mb-1.5 leading-snug">
                      {miembro.nombre}
                    </h3>
                    
                    {/* Cargo unificado en Negro / Grafito Oscuro */}
                    <p className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-slate-800 leading-snug mb-3">
                      {miembro.cargo}
                    </p>
                  </div>

                  {/* Correo o Descripción */}
                  {miembro.descripcion && (
                    <div className="pt-2 border-t border-gray-50">
                      {isEmail ? (
                        <a
                          href={`mailto:${emailText}`}
                          className="inline-flex items-center justify-center gap-1.5 text-xs text-gris-texto hover:text-azul-acropolis transition-colors font-medium break-all"
                          title={`Enviar correo a ${miembro.nombre}`}
                        >
                          <Mail size={13} className="shrink-0 text-azul-acropolis" />
                          <span>{emailText}</span>
                        </a>
                      ) : (
                        <p className="text-xs text-gris-texto leading-relaxed">{miembro.descripcion}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

