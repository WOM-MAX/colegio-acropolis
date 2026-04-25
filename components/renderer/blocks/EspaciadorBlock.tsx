import React from 'react';

type EspaciadorConfig = {
  altura?: string; // 'pequeno' (32px), 'mediano' (64px), 'grande' (128px)
  mostrarLinea?: boolean;
};

export default function EspaciadorBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as EspaciadorConfig;
  
  const getPadding = () => {
    switch (config.altura) {
      case 'pequeno': return 'py-4 md:py-8';
      case 'grande': return 'py-16 md:py-32';
      case 'mediano':
      default:
        return 'py-8 md:py-16';
    }
  };

  return (
    <div className={`w-full ${getPadding()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        {config.mostrarLinea && (
          <div className="w-2/3 h-px bg-gray-200"></div>
        )}
      </div>
    </div>
  );
}
