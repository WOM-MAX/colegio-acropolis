import React from 'react';
import PageHero from '@/components/ui/PageHero';

type PageHeaderConfig = {
  title?: string;
  highlight?: string;
  description?: string;
};

export default function PageHeaderBlock({ configuracion }: { configuracion: PageHeaderConfig }) {
  // Establecer valores por defecto seguros para evitar que el componente se rompa
  const title = configuracion.title || 'Título vacío';
  const highlight = configuracion.highlight || '';
  const description = configuracion.description || '';

  return (
    <PageHero 
      title={title} 
      highlight={highlight} 
      description={description} 
    />
  );
}
