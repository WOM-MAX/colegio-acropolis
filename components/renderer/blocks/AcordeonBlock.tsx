'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type AcordeonItem = {
  titulo: string;
  contenido: string;
};

type AcordeonConfig = {
  tituloSeccion?: string;
  descripcion?: string;
  estiloFondo?: 'blanco' | 'gris' | 'azul';
  items?: AcordeonItem[];
};

export default function AcordeonBlock({ configuracion }: { configuracion: AcordeonConfig }) {
  const {
    tituloSeccion = '',
    descripcion = '',
    estiloFondo = 'blanco',
    items = [],
  } = configuracion;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const bgClasses: Record<string, string> = {
    blanco: 'bg-white',
    gris: 'bg-gray-50',
    azul: 'bg-blue-50'
  };

  const itemClasses: Record<string, string> = {
    blanco: 'bg-white border-gray-100 shadow-sm hover:shadow-md',
    gris: 'bg-white border-gray-100 shadow-sm hover:shadow-md',
    azul: 'bg-white border-blue-100 shadow-sm hover:shadow-md'
  };

  return (
    <section className={`py-16 sm:py-24 ${bgClasses[estiloFondo]}`}>
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {(tituloSeccion || descripcion) && (
          <div className="text-center mb-12">
            {tituloSeccion && (
              <div className="rich-title font-bold tracking-tight text-negro"
                  dangerouslySetInnerHTML={{ __html: tituloSeccion }} />
            )}
            {descripcion && (
              <div className="mt-4 text-lg leading-8 text-gris-texto [&_p]:m-0"
                   dangerouslySetInnerHTML={{ __html: descripcion }} />
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${itemClasses[estiloFondo]} ${isOpen ? 'ring-2 ring-azul-acropolis/20' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left focus:outline-none p-6"
                >
                  <span className="text-lg font-semibold text-negro">
                    {item.titulo}
                  </span>
                  <span className="ml-6 flex h-7 items-center text-azul-acropolis">
                    <ChevronDown
                      className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                      aria-hidden="true"
                    />
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-6 text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {item.contenido}
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
