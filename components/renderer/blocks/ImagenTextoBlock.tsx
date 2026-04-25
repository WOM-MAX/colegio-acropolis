import React from 'react';
import Image from 'next/image';

type ImagenTextoConfig = {
  titulo?: string;
  contenido?: string;
  imagenUrl?: string;
  posicionImagen?: 'left' | 'right';
  estiloImagen?: 'estandar' | 'polaroid';
  colorFondo?: 'blanco' | 'gris';
};

export default function ImagenTextoBlock({ configuracion }: { configuracion: ImagenTextoConfig }) {
  const {
    titulo = '',
    contenido = '',
    imagenUrl = '',
    posicionImagen = 'left',
    estiloImagen = 'estandar',
    colorFondo = 'blanco',
  } = configuracion;

  const isGris = colorFondo === 'gris';
  const isPolaroid = estiloImagen === 'polaroid';

  return (
    <section className={`relative overflow-hidden ${isGris ? 'bg-gris-claro' : 'bg-white'}`}>
      
      {/* ── Top Wave divider if background is gris ── */}
      {isGris && (
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-0">
          <svg
            viewBox="0 0 1440 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-auto text-white"
            preserveAspectRatio="none"
          >
            <path
              d="M0 56C240 24 480 24 720 40C960 56 1200 80 1440 72V0H0V56Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}

      <div className={`relative z-10 py-16 sm:py-24 mx-auto max-w-7xl px-6 lg:px-8 ${isGris ? 'pt-24 lg:pt-32' : ''}`}>
        <div className={`mx-auto flex flex-col gap-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center ${posicionImagen === 'right' ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Columna de Imagen */}
          <div className="lg:w-1/2 lg:max-w-lg lg:flex-shrink-0 perspective-1000">
            {imagenUrl ? (
              isPolaroid ? (
                /* Polaroid Style */
                <div className="relative mx-auto max-w-md">
                  <div className="bg-white p-4 pb-16 sm:p-5 sm:pb-20 shadow-2xl rotate-[-3deg] transition-all duration-500 ease-out hover:rotate-[-1deg] hover:scale-[1.02] hover:shadow-3xl border border-gray-100 rounded-sm">
                    {/* Tape effect on top */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/50 backdrop-blur-md rotate-2 border border-white/20 shadow-sm z-20 opacity-80 mix-blend-overlay"></div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900 border border-gray-200">
                      <Image
                        src={imagenUrl}
                        alt={titulo || 'Imagen histórica'}
                        fill
                        className="object-cover sepia-[0.3] contrast-125 hover:sepia-0 transition-all duration-700"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Style */
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl border border-gray-100/50">
                  <Image
                    src={imagenUrl}
                    alt={titulo || 'Imagen de la sección'}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              )
            ) : (
              <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl flex items-center justify-center ${isGris ? 'bg-white' : 'bg-gray-100'}`}>
                <span className="text-gray-400 font-medium">Sin imagen</span>
              </div>
            )}
          </div>
          
          {/* Columna de Texto */}
          <div className="lg:w-1/2 relative z-10">
            {/* Optional decorative blobs behind text if needed */}
            {isGris && isPolaroid && (
               <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-amarillo-soft/20 blur-3xl pointer-events-none" />
            )}
            
            <div className="max-w-xl relative">
              {titulo && (
                <div className="rich-title mb-6 font-bold tracking-tight text-negro"
                    dangerouslySetInnerHTML={{ __html: titulo }} />
              )}
              {contenido && (
                <div 
                  className={`prose prose-lg prose-blue ${isGris ? 'text-gray-700' : 'text-gris-texto'}`}
                  dangerouslySetInnerHTML={{ __html: contenido.replace(/\n/g, '<br />') }}
                />
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* ── Bottom Wave divider if background is gris ── */}
      {isGris && (
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0 translate-y-[1px]">
          <svg
            viewBox="0 0 1440 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-auto text-white"
            preserveAspectRatio="none"
          >
            <path
              d="M0 24C240 56 480 56 720 40C960 24 1200 0 1440 8V56H0V24Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </section>
  );
}
