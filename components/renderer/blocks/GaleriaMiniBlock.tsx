import React from 'react';

type GaleriaConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  columnas?: string; // '2', '3', '4'
  imagenes?: {
    url: string;
    caption?: string;
  }[];
};

export default function GaleriaMiniBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as GaleriaConfig;
  const imagenes = config.imagenes || [];
  const colClass = config.columnas === '4' ? 'grid-cols-2 md:grid-cols-4' : 
                   config.columnas === '2' ? 'grid-cols-1 md:grid-cols-2' : 
                   'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

  if (imagenes.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {config.tituloSeccion && (
          <div className="rich-title font-bold text-azul-acropolis mb-4 text-center"
              dangerouslySetInnerHTML={{ __html: config.tituloSeccion }} />
        )}
        {config.subtituloSeccion && (
          <div className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-8 [&_p]:m-0"
               dangerouslySetInnerHTML={{ __html: config.subtituloSeccion }} />
        )}
        
        <div className={`grid ${colClass} gap-4`}>
          {imagenes.map((img, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100">
              <img 
                src={img.url} 
                alt={img.caption || `Imagen ${index + 1}`} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4 text-sm font-medium">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
