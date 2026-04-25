import React from 'react';
import FadeIn from '@/components/ui/FadeIn';

type TextConfig = {
  titulo?: string;
  contenido: string; // Puede soportar HTML en un futuro
  alineacion?: 'left' | 'center' | 'right';
  padding?: 'small' | 'medium' | 'large';
};

export default function TextBlock({ configuracion }: { configuracion: any }) {
  const config = configuracion as TextConfig;
  const alignClass = config.alineacion === 'center' ? 'text-center mx-auto' : config.alineacion === 'right' ? 'text-right ml-auto' : 'text-left';
  const paddingClass = config.padding === 'small' ? 'py-12' : config.padding === 'large' ? 'py-32' : 'py-20';

  return (
    <section className={`px-6 sm:px-8 bg-white ${paddingClass}`}>
      <div className={`max-w-4xl ${config.alineacion === 'center' ? 'mx-auto' : 'mx-auto'}`}>
        <FadeIn direction="up">
          {config.titulo && (
            <div className={`rich-title mb-8 font-bold tracking-tight text-negro ${alignClass}`}
                dangerouslySetInnerHTML={{ __html: config.titulo }} />
          )}
          
          <div className={`prose prose-lg max-w-none text-gris-texto ${alignClass} prose-headings:text-negro prose-a:text-azul-acropolis whitespace-pre-wrap`}>
            {/* Si enviamos HTML escapado */}
            <div dangerouslySetInnerHTML={{ __html: config.contenido }} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
