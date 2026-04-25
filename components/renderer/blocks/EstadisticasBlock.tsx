import React from 'react';

type EstadisticasConfig = {
  tituloSeccion?: string;
  fondo?: string; // 'blanco', 'azul', 'gris'
  estadisticas?: {
    numero: string;
    texto: string;
    subtexto?: string;
  }[];
};

export default function EstadisticasBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as EstadisticasConfig;
  const estadisticas = config.estadisticas || [];

  if (estadisticas.length === 0) return null;

  const getBgClass = () => {
    if (config.fondo === 'azul') return 'bg-azul-acropolis text-white';
    if (config.fondo === 'gris') return 'bg-gray-50 text-azul-acropolis';
    return 'bg-white text-azul-acropolis border-y border-gray-100'; // Default Blanco
  };

  const getSubtextClass = () => {
    if (config.fondo === 'azul') return 'text-gray-200';
    return 'text-gray-500';
  };

  return (
    <section className={`py-12 md:py-20 ${getBgClass()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {config.tituloSeccion && (
          <div className={`rich-title font-bold mb-12 text-center ${config.fondo === 'azul' ? '[&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_p]:text-white' : '[&_h2]:text-azul-acropolis [&_h3]:text-azul-acropolis [&_h4]:text-azul-acropolis [&_p]:text-azul-acropolis'}`}
              dangerouslySetInnerHTML={{ __html: config.tituloSeccion }} />
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:divide-x sm:divide-opacity-20 sm:divide-current">
          {estadisticas.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4">
              <span className={`text-3xl sm:text-5xl md:text-6xl font-extrabold mb-2 ${config.fondo === 'azul' ? 'text-amarillo-acropolis' : 'text-azul-acropolis'}`}>
                {stat.numero}
              </span>
              <span className="text-sm sm:text-lg font-bold uppercase tracking-wider mb-1">{stat.texto}</span>
              {stat.subtexto && (
                <span className={`text-sm ${getSubtextClass()}`}>{stat.subtexto}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
