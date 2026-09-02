import React from 'react';
import DirectivoEmailButton from './DirectivoEmailButton';

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
    <section className="py-16 sm:py-20 bg-gris-claro border-y border-gray-200/80 relative overflow-hidden">
      {/* Elementos de luz ambiental sutiles */}
      <div className="absolute top-12 right-0 w-80 h-80 bg-azul-acropolis/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-0 w-80 h-80 bg-amarillo/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado Principal de Sección con tamaño proporcional (24px - 30px) */}
        {(config.tituloSeccion || config.subtituloSeccion) && (
          <div className="text-center mb-10 sm:mb-12">
            {config.tituloSeccion && (
              <div
                className="text-2xl sm:text-3xl font-bold tracking-tight text-negro mb-2 leading-tight [&_*]:text-2xl sm:[&_*]:text-3xl [&_*]:font-bold [&_*]:tracking-tight [&_*]:text-negro [&_*]:m-0 [&_*]:leading-tight"
                dangerouslySetInnerHTML={{ __html: config.tituloSeccion }}
              />
            )}
            {config.subtituloSeccion && (
              <div
                className="text-sm sm:text-base text-gris-texto max-w-xl mx-auto [&_p]:m-0 mt-1.5"
                dangerouslySetInnerHTML={{ __html: config.subtituloSeccion }}
              />
            )}
            {/* Línea decorativa Acrópolis */}
            <div className="mt-3.5 flex justify-center items-center">
              <div className="w-10 h-1 bg-amarillo rounded-full" />
              <div className="w-3.5 h-1 bg-azul-acropolis rounded-full ml-1.5" />
            </div>
          </div>
        )}

        {/* Grilla de Perfiles con Tarjetas Unificadas 3D */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {miembros.map((miembro, index) => {
            const emailText = miembro.descripcion ? miembro.descripcion.trim() : '';
            const isEmail = emailText.includes('@') && !emailText.includes(' ');

            return (
              <div
                key={index}
                className="group flex flex-col w-full max-w-[300px] sm:max-w-[280px] bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] border border-gray-200/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(70,97,246,0.12),0_4px_12px_rgba(0,0,0,0.05)] hover:border-azul-acropolis/40 justify-between text-center"
              >
                <div>
                  {/* Marco de Imagen / Insignia integrado dentro de la tarjeta */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 flex items-center justify-center p-2">
                    {miembro.fotoUrl ? (
                      <img
                        src={miembro.fotoUrl}
                        alt={miembro.nombre}
                        loading="lazy"
                        className="h-full w-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
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
                  <p className="text-xs font-semibold text-[#B81D5B] tracking-wide leading-relaxed mb-3.5 subpixel-antialiased">
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
                      <p className="text-xs text-gris-texto leading-relaxed">{miembro.descripcion}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

