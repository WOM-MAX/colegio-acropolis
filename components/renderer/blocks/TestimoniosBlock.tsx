import React from 'react';

type TestimoniosConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  testimonios?: {
    nombre: string;
    rol?: string;
    texto: string;
    avatarUrl?: string;
  }[];
  colorFondoTarjeta?: string;
};

export default function TestimoniosBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as TestimoniosConfig;
  const testimonios = config.testimonios || [];

  if (testimonios.length === 0) return null;

  // Color accent per card for visual variety
  const accentColors = [
    { border: '#243A73', bg: 'rgba(36,58,115,0.08)', text: '#243A73', avatar: '#243A73' },
    { border: '#E91E63', bg: 'rgba(233,30,99,0.06)', text: '#E91E63', avatar: '#E91E63' },
    { border: '#00BCD4', bg: 'rgba(0,188,212,0.06)', text: '#00BCD4', avatar: '#00BCD4' },
    { border: '#F2B90F', bg: 'rgba(242,185,15,0.08)', text: '#b8860b', avatar: '#F2B90F' },
  ];

  const getBaseBgColor = () => {
    switch (config.colorFondoTarjeta) {
      case 'blue-50': return '#eff6ff'; // Tailwind blue-50
      case 'yellow-50': return '#fefce8'; // Tailwind yellow-50
      case 'white':
      default: return 'white';
    }
  };
  const baseBg = getBaseBgColor();

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-azul-acropolis/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fucsia/5 rounded-full blur-[120px] pointer-events-none" />

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
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonios.map((testimonio, index) => {
            const accent = accentColors[index % accentColors.length];

            return (
              <div
                key={index}
                className="group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  backgroundColor: baseBg,
                  backgroundImage: `linear-gradient(135deg, ${baseBg} 0%, ${accent.bg} 100%)`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                  borderLeft: `4px solid ${accent.border}`,
                }}
              >
                {/* Decorative quote */}
                <div className="absolute top-5 right-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                  <svg className="w-16 h-16" fill={accent.border} viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>

                {/* Star rating decoration */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill={accent.border} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 text-[15px] leading-relaxed mb-8 relative z-10 min-h-[80px]">
                  &ldquo;{testimonio.texto}&rdquo;
                </p>

                {/* Author info */}
                <div className="flex items-center mt-auto pt-6 border-t border-gray-100">
                  {testimonio.avatarUrl ? (
                    <img
                      src={testimonio.avatarUrl}
                      alt={testimonio.nombre}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md mr-4"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md ring-2 ring-white"
                      style={{ backgroundColor: accent.avatar }}
                    >
                      {testimonio.nombre.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">{testimonio.nombre}</h4>
                    {testimonio.rol && (
                      <p className="text-xs font-medium tracking-wide uppercase" style={{ color: accent.text }}>
                        {testimonio.rol}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
