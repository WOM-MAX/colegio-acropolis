import React from 'react';
import Image from 'next/image';

type Tarjeta = {
  titulo: string;
  texto: string;
  imagenUrl?: string; // Optativo
};

type TarjetasConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  columnas?: '2' | '3' | '4';
  tarjetas?: Tarjeta[];
};

export default function TarjetasBlock({ configuracion }: { configuracion: TarjetasConfig }) {
  const {
    tituloSeccion = '',
    subtituloSeccion = '',
    columnas = '3',
    tarjetas = [],
  } = configuracion;

  if (!tarjetas || tarjetas.length === 0) return null;

  const colsClass = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }[columnas] || 'md:grid-cols-3';

  return (
    <section className="py-16 sm:py-24 bg-gris-fondo">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(tituloSeccion || subtituloSeccion) && (
          <div className="mx-auto max-w-3xl text-center mb-16">
            {tituloSeccion && (
              <div className="rich-title font-bold tracking-tight text-negro"
                  dangerouslySetInnerHTML={{ __html: tituloSeccion }} />
            )}
            {subtituloSeccion && (
              <div className="mt-4 text-lg leading-8 text-gris-texto [&_p]:m-0"
                   dangerouslySetInnerHTML={{ __html: subtituloSeccion }} />
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 gap-8 ${colsClass}`}>
          {tarjetas.map((tarjeta, index) => (
            <div key={index} className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden transition-all hover:shadow-md">
              {tarjeta.imagenUrl && (
                <div className="relative aspect-video w-full bg-gray-100">
                  <Image 
                    src={tarjeta.imagenUrl} 
                    alt={tarjeta.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-negro mb-3">{tarjeta.titulo}</h3>
                <p className="text-base text-gris-texto leading-relaxed flex-1">
                  {tarjeta.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
