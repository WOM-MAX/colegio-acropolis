import React from 'react';

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

  // Accent colors for cards without photos
  const accentColors = ['#243A73', '#E91E63', '#00BCD4', '#F2B90F', '#1A2952', '#4CAF50'];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-azul-acropolis/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-amarillo/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {(config.tituloSeccion || config.subtituloSeccion) && (
          <div className="text-center mb-16">
            {config.tituloSeccion && (
              <div className="rich-title font-bold text-azul-acropolis mb-4"
                  dangerouslySetInnerHTML={{ __html: config.tituloSeccion }} />
            )}
            {config.subtituloSeccion && (
              <div className="text-lg text-gray-500 max-w-2xl mx-auto [&_p]:m-0"
                   dangerouslySetInnerHTML={{ __html: config.subtituloSeccion }} />
            )}
            {/* Decorative line */}
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-1 bg-amarillo-acropolis rounded-full" />
              <div className="w-4 h-1 bg-azul-acropolis rounded-full ml-1" />
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-10">
          {miembros.map((miembro, index) => {
            const accent = accentColors[index % accentColors.length];
            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center w-full max-w-[288px] sm:w-72 transition-all duration-500"
              >
                {/* Photo container with ring animation */}
                <div className="relative mb-6">
                  {/* Animated ring on hover */}
                  <div
                    className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `conic-gradient(from 0deg, ${accent}, transparent 60%, ${accent})`,
                      filter: 'blur(1px)',
                    }}
                  />
                  <div className="relative w-44 h-44 rounded-full overflow-hidden bg-white p-1">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                      {miembro.fotoUrl ? (
                        <img
                          src={miembro.fotoUrl}
                          alt={miembro.nombre}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white"
                          style={{
                            background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
                          }}
                        >
                          <span className="text-5xl font-bold opacity-80">
                            {miembro.nombre.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info card */}
                <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 w-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{miembro.nombre}</h3>
                  <p
                    className="text-sm font-semibold tracking-wide uppercase mb-3"
                    style={{ color: accent }}
                  >
                    {miembro.cargo}
                  </p>
                  {miembro.descripcion && (
                    <p className="text-sm text-gray-500 leading-relaxed">{miembro.descripcion}</p>
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
