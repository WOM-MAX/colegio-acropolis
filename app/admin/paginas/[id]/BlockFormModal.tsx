'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { X, Save, ArrowUp, ArrowDown } from 'lucide-react';
import DirectMediaUpload from '@/app/admin/components/DirectMediaUpload';
import BatchImageUpload from '@/app/admin/components/BatchImageUpload';

const RichTextEditor = lazy(() => import('@/app/admin/components/RichTextEditor'));

type BlockFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tipoBloque: string, config: any) => void;
  initialData?: any; // null if adding new
};

export default function BlockFormModal({ isOpen, onClose, onSave, initialData }: BlockFormModalProps) {
  const [tipoBloque, setTipoBloque] = useState(initialData?.tipoBloque || 'HERO');
  const [config, setConfig] = useState<any>(initialData?.configuracion || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTipoBloque(initialData.tipoBloque);
      setConfig(initialData.configuracion || {});
    } else {
      setTipoBloque('HERO');
      setConfig({});
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSave(tipoBloque, config);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfigChange = (field: string, value: string | boolean | number | any[]) => {
    setConfig({ ...config, [field]: value });
  };

  const moveItem = (field: string, index: number, direction: 'up' | 'down') => {
    const array = [...(config[field] || [])];
    if (direction === 'up' && index > 0) {
      [array[index - 1], array[index]] = [array[index], array[index - 1]];
      handleConfigChange(field, array);
    } else if (direction === 'down' && index < array.length - 1) {
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
      handleConfigChange(field, array);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="z-10 w-full max-w-2xl rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 bg-white z-10">
          <h2 className="text-xl font-bold text-negro">
            {initialData ? 'Editar Bloque' : 'Añadir Nuevo Bloque'}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-negro transition-colors">
             <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto p-6 space-y-6 flex-1">
            {!initialData && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-negro">Tipo de Bloque</label>
                <select 
                  value={tipoBloque} 
                  onChange={(e) => {
                    setTipoBloque(e.target.value);
                    setConfig({}); // Reset config on change
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-azul-acropolis focus:outline-none focus:ring-1 focus:ring-azul-acropolis"
                >
                  <option value="PAGE_HEADER">Encabezado Azul (Título central destacado)</option>
                  <option value="HERO">Cabecera Hero (Imagen + Título gigante)</option>
                  <option value="IMAGEN_TEXTO">Imagen y Texto (Diseño 50/50)</option>
                  <option value="TEXTO">Bloque de Texto Enrich (Párrafos y Títulos)</option>
                  <option value="TARJETAS">Grilla de Tarjetas (Características)</option>
                  <option value="ACORDEON">Acordeón (Preguntas/Documentos)</option>
                  <option value="CTA_BOTONES">Llamado a la Acción (Botones)</option>
                  <option value="TESTIMONIOS">Testimonios (Grilla de citas)</option>
                  <option value="GALERIA_MINI">Galería de Imágenes (Grid)</option>
                  <option value="EQUIPO">Perfiles de Equipo (Directivos/Profesores)</option>
                  <option value="VIDEO">Video Integrado (YouTube/Vimeo)</option>
                  <option value="ESTADISTICAS">Métricas y Estadísticas (Números)</option>
                  <option value="CONTACTO_INFO">Información de Contacto y Mapa</option>
                  <option value="ALERTA">Cintillo de Alerta / Info</option>
                  <option value="CINTA_NOTICIAS">📺 Cinta de Noticias (Ticker CNN)</option>
                  <option value="ESPACIADOR">Espaciador / Línea Divisoria</option>
                </select>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-4">
              <h3 className="font-semibold text-sm text-gris-texto uppercase tracking-wider mb-2">Configuración del {tipoBloque}</h3>
              
              {tipoBloque === 'PAGE_HEADER' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Primera parte del Título (Blanco)</label>
                    <input 
                      type="text" 
                      required
                      value={config.title || ''} 
                      onChange={(e) => handleConfigChange('title', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      placeholder="Ej: Journal"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Segunda parte del Título (Amarillo)</label>
                    <input 
                      type="text" 
                      value={config.highlight || ''} 
                      onChange={(e) => handleConfigChange('highlight', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      placeholder="Ej: Institucional"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Subtítulo Descriptivo</label>
                    <textarea 
                      value={config.description || ''} 
                      onChange={(e) => handleConfigChange('description', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      placeholder="Ej: Últimos comunicados..."
                      rows={2}
                    />
                  </div>
                </>
              )}

              {tipoBloque === 'HERO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal" value={config.titulo || ''} onChange={(html) => handleConfigChange('titulo', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo (Opcional)" value={config.subtitulo || ''} onChange={(html) => handleConfigChange('subtitulo', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <DirectMediaUpload
                      label="Imagen de Fondo (Opcional)"
                      value={config.imagenFondo || ''}
                      onChange={(url) => handleConfigChange('imagenFondo', url)}
                      width={1920}
                      height={1080}
                      maxSize="2 MB"
                    />
                  </div>
                </>
              )}

              {tipoBloque === 'TEXTO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título de Sección (Opcional)" value={config.titulo || ''} onChange={(html) => handleConfigChange('titulo', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor
                        label="Contenido Textual"
                        value={config.contenido || ''}
                        onChange={(html) => handleConfigChange('contenido', html)}
                        placeholder="Escribe los párrafos aquí..."
                        rows={6}
                      />
                    </Suspense>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Alineación</label>
                    <select 
                      value={config.alineacion || 'left'} 
                      onChange={(e) => handleConfigChange('alineacion', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                    >
                      <option value="left">Izquierda</option>
                      <option value="center">Centro</option>
                      <option value="right">Derecha</option>
                    </select>
                  </div>
                </>
              )}

              {tipoBloque === 'IMAGEN_TEXTO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título" value={config.titulo || ''} onChange={(html) => handleConfigChange('titulo', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor
                        label="Contenido"
                        value={config.contenido || ''}
                        onChange={(html) => handleConfigChange('contenido', html)}
                        rows={4}
                      />
                    </Suspense>
                  </div>
                  <div>
                    <DirectMediaUpload
                      label="Imagen Adjunta"
                      value={config.imagenUrl || ''}
                      onChange={(url) => handleConfigChange('imagenUrl', url)}
                      width={800}
                      height={800}
                      maxSize="1 MB"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Posición de Imagen</label>
                    <select 
                      value={config.posicionImagen || 'left'} onChange={(e) => handleConfigChange('posicionImagen', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                    >
                      <option value="left">Izquierda</option>
                      <option value="right">Derecha</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Estilo de Imagen</label>
                      <select 
                        value={config.estiloImagen || 'estandar'} onChange={(e) => handleConfigChange('estiloImagen', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="estandar">Estándar (Esquinas redondeadas)</option>
                        <option value="polaroid">Fotografía Antigua (Polaroid)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Color de Fondo</label>
                      <select 
                        value={config.colorFondo || 'blanco'} onChange={(e) => handleConfigChange('colorFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="blanco">Fondo Blanco</option>
                        <option value="gris">Fondo Gris Claro</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'TARJETAS' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título de la Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo (Opcional)" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Columnas Desktop</label>
                    <select 
                      value={config.columnas || '3'} onChange={(e) => handleConfigChange('columnas', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                    >
                      <option value="2">2 Columnas</option>
                      <option value="3">3 Columnas</option>
                      <option value="4">4 Columnas</option>
                    </select>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="mb-1 block text-sm font-medium text-negro">Tarjetas</label>
                    {(config.tarjetas || []).map((tarjeta: any, index: number) => (
                      <div key={index} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-3 relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('tarjetas', index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('tarjetas', index, 'down')} disabled={index === (config.tarjetas || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => {
                            const newT = [...(config.tarjetas || [])];
                            newT.splice(index, 1);
                            handleConfigChange('tarjetas', newT as any);
                          }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Título tarjeta" value={tarjeta.titulo || ''} onChange={(e) => {
                          const newT = [...(config.tarjetas || [])];
                          newT[index] = { ...newT[index], titulo: e.target.value };
                          handleConfigChange('tarjetas', newT as any);
                        }} />
                        <textarea className="w-full mb-2 border rounded p-2 text-sm" placeholder="Texto tarjeta" value={tarjeta.texto || ''} onChange={(e) => {
                          const newT = [...(config.tarjetas || [])];
                          newT[index] = { ...newT[index], texto: e.target.value };
                          handleConfigChange('tarjetas', newT as any);
                        }} />
                        <div className="mt-2 text-left">
                          <DirectMediaUpload
                            label="Imagen de Tarjeta (Opcional)"
                            value={tarjeta.imagenUrl || ''}
                            onChange={(url) => {
                              const newT = [...(config.tarjetas || [])];
                              newT[index] = { ...newT[index], imagenUrl: url };
                              handleConfigChange('tarjetas', newT as any);
                            }}
                            width={600}
                            height={400}
                            maxSize="500 KB"
                          />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const newT = [...(config.tarjetas || []), { titulo: '', texto: '', imagenUrl: '' }];
                      handleConfigChange('tarjetas', newT as any);
                    }} className="text-sm text-gray-50 bg-azul-acropolis px-3 py-1.5 rounded-lg hover:bg-azul-hover">+ Añadir Tarjeta</button>
                  </div>
                </>
              )}

              {tipoBloque === 'ACORDEON' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Descripción Complementaria" value={config.descripcion || ''} onChange={(html) => handleConfigChange('descripcion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro mt-4">Estilo de Fondo y Tarjetas</label>
                    <select 
                      value={config.estiloFondo || 'blanco'} onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none mb-4"
                    >
                      <option value="blanco">Fondo Blanco (Clásico)</option>
                      <option value="gris">Fondo Gris Claro (Modo Resalte)</option>
                      <option value="azul">Fondo Azul Tenue (Institucional)</option>
                    </select>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="mb-1 block text-sm font-medium text-negro">Filas Desplegables</label>
                    {(config.items || []).map((item: any, index: number) => (
                      <div key={index} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-3 relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('items', index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('items', index, 'down')} disabled={index === (config.items || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => {
                            const newI = [...(config.items || [])];
                            newI.splice(index, 1);
                            handleConfigChange('items', newI as any);
                          }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Título (Pregunta)" value={item.titulo || ''} onChange={(e) => {
                          const newI = [...(config.items || [])];
                          newI[index] = { ...newI[index], titulo: e.target.value };
                          handleConfigChange('items', newI as any);
                        }} />
                        <textarea className="w-full border rounded p-2 text-sm" placeholder="Contenido (Respuesta)" rows={3} value={item.contenido || ''} onChange={(e) => {
                          const newI = [...(config.items || [])];
                          newI[index] = { ...newI[index], contenido: e.target.value };
                          handleConfigChange('items', newI as any);
                        }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const newI = [...(config.items || []), { titulo: '', contenido: '' }];
                      handleConfigChange('items', newI as any);
                    }} className="text-sm text-gray-50 bg-azul-acropolis px-3 py-1.5 rounded-lg hover:bg-azul-hover">+ Añadir Fila</button>
                  </div>
                </>
              )}

              {tipoBloque === 'CTA_BOTONES' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Llamativo" value={config.titulo || ''} onChange={(html) => handleConfigChange('titulo', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Texto Descriptivo" value={config.descripcion || ''} onChange={(html) => handleConfigChange('descripcion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Texto Botón</label>
                      <input 
                        type="text" value={config.textoBoton || ''} onChange={(e) => handleConfigChange('textoBoton', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Enlace URL</label>
                      <input 
                        type="text" value={config.enlaceBoton || ''} onChange={(e) => handleConfigChange('enlaceBoton', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Fondo Primario</label>
                      <select 
                        value={config.colorPrimario || '#4661F6'} onChange={(e) => handleConfigChange('colorPrimario', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="#4661F6">Azul Acrópolis</option>
                        <option value="#FF5289">Fucsia</option>
                        <option value="#13C5B5">Cian</option>
                        <option value="#FFD25E">Amarillo</option>
                        <option value="#ffffff">Blanco</option>
                        <option value="#1e1e1e">Gris Oscuro</option>
                        <option value="#172554">Azul Muy Oscuro</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Fondo Secundario</label>
                      <select 
                        value={config.colorSecundario || '#172554'} onChange={(e) => handleConfigChange('colorSecundario', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="#172554">Azul Muy Oscuro</option>
                        <option value="#4661F6">Azul Acrópolis</option>
                        <option value="#FF5289">Fucsia</option>
                        <option value="#13C5B5">Cian</option>
                        <option value="#FFD25E">Amarillo</option>
                        <option value="#ffffff">Blanco</option>
                        <option value="#1e1e1e">Gris Oscuro</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 flex justify-between text-sm font-medium text-negro">
                      <span>Punto de Mezcla (Transición a Secundario)</span>
                      <span className="text-gray-500">{config.proporcionColor ?? 100}%</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" 
                      value={config.proporcionColor ?? 100} 
                      onChange={(e) => handleConfigChange('proporcionColor', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-azul-acropolis"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Estilo Botón</label>
                      <select 
                        value={config.estiloBoton || 'primario'} onChange={(e) => handleConfigChange('estiloBoton', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="primario">Principal (Claro)</option>
                        <option value="secundario">Secundario (Amarillo)</option>
                        <option value="outline">Sólo Contorno (Transparente)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Alineación</label>
                      <select 
                        value={config.alineacion || 'center'} onChange={(e) => handleConfigChange('alineacion', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="center">Centro</option>
                        <option value="left">Izquierda</option>
                        <option value="right">Derecha</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'TESTIMONIOS' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro mt-4">Color Fondo Tarjetas</label>
                    <select value={config.colorFondoTarjeta || 'white'} onChange={(e) => handleConfigChange('colorFondoTarjeta', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                        <option value="white">Blanco Clásico</option>
                        <option value="blue-50">Azul Pálido Tenue</option>
                        <option value="yellow-50">Amarillo Pálido Tenue</option>
                    </select>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="mb-1 block text-sm font-medium text-negro">Testimonios</label>
                    {(config.testimonios || []).map((t: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-3 relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('testimonios', idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('testimonios', idx, 'down')} disabled={idx === (config.testimonios || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => {
                            const n = [...config.testimonios]; n.splice(idx, 1); handleConfigChange('testimonios', n as any);
                          }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Nombre completo" value={t.nombre || ''} onChange={(e) => { const n=[...config.testimonios]; n[idx].nombre=e.target.value; handleConfigChange('testimonios', n as any); }} />
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Rol (Ej: Apoderado)" value={t.rol || ''} onChange={(e) => { const n=[...config.testimonios]; n[idx].rol=e.target.value; handleConfigChange('testimonios', n as any); }} />
                        <textarea className="w-full mb-2 border rounded p-2 text-sm" placeholder="Texto del testimonio" rows={2} value={t.texto || ''} onChange={(e) => { const n=[...config.testimonios]; n[idx].texto=e.target.value; handleConfigChange('testimonios', n as any); }} />
                        <div className="mt-2 text-left">
                          <DirectMediaUpload
                            label="Foto de Perfil (Opcional)"
                            value={t.avatarUrl || ''}
                            onChange={(url) => { const n=[...config.testimonios]; n[idx].avatarUrl=url; handleConfigChange('testimonios', n as any); }}
                            width={200}
                            height={200}
                            maxSize="200 KB"
                          />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleConfigChange('testimonios', [...(config.testimonios || []), {nombre:'', texto:''}] as any)} className="text-sm bg-azul-acropolis text-white px-3 py-1 rounded">+ Añadir Testimonio</button>
                  </div>
                </>
              )}

              {tipoBloque === 'GALERIA_MINI' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título de Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo Descriptivo (Opcional)" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-negro">Columnas</label>
                    <select value={config.columnas || '3'} onChange={(e) => handleConfigChange('columnas', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                      <option value="2">2 Columnas</option>
                      <option value="3">3 Columnas</option>
                      <option value="4">4 Columnas</option>
                    </select>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="mb-1 block text-sm font-medium text-negro">Imágenes</label>
                    {(config.imagenes || []).map((img: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 mb-3 relative flex gap-2">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('imagenes', idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('imagenes', idx, 'down')} disabled={idx === (config.imagenes || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => {
                            const n = [...config.imagenes]; n.splice(idx, 1); handleConfigChange('imagenes', n as any);
                          }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <div className="w-full">
                          <div className="mb-2 text-left">
                            <DirectMediaUpload
                              label="Archivo de Imagen"
                              value={img.url || ''}
                              onChange={(url) => { const n=[...config.imagenes]; n[idx].url=url; handleConfigChange('imagenes', n as any); }}
                              width={800}
                              height={600}
                              maxSize="1 MB"
                            />
                          </div>
                          <input className="w-full border rounded p-2 text-sm" placeholder="Leyenda / Caption (Opcional)" value={img.caption || ''} onChange={(e) => { const n=[...config.imagenes]; n[idx].caption=e.target.value; handleConfigChange('imagenes', n as any); }} />
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-3">
                      <button type="button" onClick={() => handleConfigChange('imagenes', [...(config.imagenes || []), {url:''}] as any)} className="text-sm bg-azul-acropolis text-white px-3 py-1.5 rounded-lg">+ Añadir Imagen Individual</button>
                      <BatchImageUpload
                        onImagesUploaded={(newImages) => {
                          handleConfigChange('imagenes', [...(config.imagenes || []), ...newImages] as any);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'EQUIPO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="mb-1 block text-sm font-medium text-negro">Miembros</label>
                    {(config.miembros || []).map((m: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-3 relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('miembros', idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('miembros', idx, 'down')} disabled={idx === (config.miembros || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => { const n = [...config.miembros]; n.splice(idx, 1); handleConfigChange('miembros', n as any); }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Nombre" value={m.nombre || ''} onChange={(e) => { const n=[...config.miembros]; n[idx].nombre=e.target.value; handleConfigChange('miembros', n as any); }} />
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Cargo" value={m.cargo || ''} onChange={(e) => { const n=[...config.miembros]; n[idx].cargo=e.target.value; handleConfigChange('miembros', n as any); }} />
                        <textarea className="w-full mb-2 border rounded p-2 text-sm" placeholder="Breve desc." rows={2} value={m.descripcion || ''} onChange={(e) => { const n=[...config.miembros]; n[idx].descripcion=e.target.value; handleConfigChange('miembros', n as any); }} />
                        <div className="mt-2 text-left">
                          <DirectMediaUpload
                            label="Foto de Perfil"
                            value={m.fotoUrl || ''}
                            onChange={(url) => { const n=[...config.miembros]; n[idx].fotoUrl=url; handleConfigChange('miembros', n as any); }}
                            width={400}
                            height={400}
                            maxSize="500 KB"
                          />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleConfigChange('miembros', [...(config.miembros || []), {nombre:'', cargo:''}] as any)} className="text-sm bg-azul-acropolis text-white px-3 py-1 rounded">+ Añadir Miembro</button>
                  </div>
                </>
              )}

              {tipoBloque === 'VIDEO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título (Opcional)" value={config.titulo || ''} onChange={(html) => handleConfigChange('titulo', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Enlace del Video (Youtube o Vimeo)</label>
                    <input type="text" value={config.videoUrl || ''} onChange={(e) => handleConfigChange('videoUrl', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Ej: https://www.youtube.com/watch?v=..." />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Formato</label>
                    <select value={config.anchoRatio || '16/9'} onChange={(e) => handleConfigChange('anchoRatio', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                      <option value="16/9">Panorámico (16:9)</option>
                      <option value="4/3">Tradicional (4:3)</option>
                    </select>
                  </div>
                </>
              )}

              {tipoBloque === 'ESTADISTICAS' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título (Opcional)" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Color de Fondo</label>
                    <select value={config.fondo || 'blanco'} onChange={(e) => handleConfigChange('fondo', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                      <option value="blanco">Blanco</option>
                      <option value="gris">Gris Claro</option>
                      <option value="azul">Azul Institucional</option>
                    </select>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="mb-1 block text-sm font-medium text-negro">Estadísticas/Métricas</label>
                    {(config.estadisticas || []).map((s: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-3 relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('estadisticas', idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('estadisticas', idx, 'down')} disabled={idx === (config.estadisticas || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => { const n = [...config.estadisticas]; n.splice(idx, 1); handleConfigChange('estadisticas', n as any); }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Valor Numérico (Ej: +25, 100%)" value={s.numero || ''} onChange={(e) => { const n=[...config.estadisticas]; n[idx].numero=e.target.value; handleConfigChange('estadisticas', n as any); }} />
                        <input className="w-full mb-2 border rounded p-2 text-sm" placeholder="Título (Ej: Años de Historia)" value={s.texto || ''} onChange={(e) => { const n=[...config.estadisticas]; n[idx].texto=e.target.value; handleConfigChange('estadisticas', n as any); }} />
                        <input className="w-full border rounded p-2 text-sm" placeholder="Subtexto (Opcional)" value={s.subtexto || ''} onChange={(e) => { const n=[...config.estadisticas]; n[idx].subtexto=e.target.value; handleConfigChange('estadisticas', n as any); }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => handleConfigChange('estadisticas', [...(config.estadisticas || []), {numero:'', texto:''}] as any)} className="text-sm bg-azul-acropolis text-white px-3 py-1 rounded">+ Añadir Métrica</button>
                  </div>
                </>
              )}

              {tipoBloque === 'CONTACTO_INFO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Bloque" value={config.titulo || ''} onChange={(html) => handleConfigChange('titulo', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Color Principal del Bloque</label>
                    <select value={config.colorPrincipal || '#4661F6'} onChange={(e) => handleConfigChange('colorPrincipal', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                      <option value="#4661F6">Azul Acrópolis</option>
                      <option value="#1A2952">Azul Oscuro</option>
                      <option value="#FF5289">Fucsia</option>
                      <option value="#13C5B5">Cian</option>
                      <option value="#FFD25E">Amarillo</option>
                      <option value="#4b5563">Gris Profesional</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Dirección Física</label>
                    <textarea rows={2} value={config.direccion || ''} onChange={(e) => handleConfigChange('direccion', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                  </div>

                  {/* ── Teléfonos (múltiples) ── */}
                  <div className="border-t pt-4 mt-4">
                    <label className="mb-2 block text-sm font-semibold text-negro">📞 Teléfonos de Contacto</label>
                    {(config.telefonos || []).map((tel: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-2 relative grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="absolute top-1 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('telefonos', idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('telefonos', idx, 'down')} disabled={idx === (config.telefonos || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => {
                            const n = [...(config.telefonos || [])]; n.splice(idx, 1); handleConfigChange('telefonos', n as any);
                          }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <input className="border rounded p-2 text-sm" placeholder="Etiqueta (Ej: Secretaría)" value={tel.etiqueta || ''} onChange={(e) => {
                          const n = [...(config.telefonos || [])]; n[idx] = { ...n[idx], etiqueta: e.target.value }; handleConfigChange('telefonos', n as any);
                        }} />
                        <input className="border rounded p-2 text-sm" placeholder="+56 2 2269 1234" value={tel.numero || ''} onChange={(e) => {
                          const n = [...(config.telefonos || [])]; n[idx] = { ...n[idx], numero: e.target.value }; handleConfigChange('telefonos', n as any);
                        }} />
                        <select className="border rounded p-2 text-sm" value={tel.tipo || 'fijo'} onChange={(e) => {
                          const n = [...(config.telefonos || [])]; n[idx] = { ...n[idx], tipo: e.target.value }; handleConfigChange('telefonos', n as any);
                        }}>
                          <option value="fijo">📞 Fijo</option>
                          <option value="celular">📱 Celular</option>
                          <option value="whatsapp">💬 WhatsApp</option>
                        </select>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleConfigChange('telefonos', [...(config.telefonos || []), { etiqueta: '', numero: '', tipo: 'fijo' }] as any)} className="text-sm bg-azul-acropolis text-white px-3 py-1 rounded">+ Añadir Teléfono</button>
                  </div>

                  {/* ── Correos electrónicos (múltiples) ── */}
                  <div className="border-t pt-4 mt-2">
                    <label className="mb-2 block text-sm font-semibold text-negro">✉️ Correos Electrónicos</label>
                    {(config.emails || []).map((em: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-2 relative grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="absolute top-1 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('emails', idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('emails', idx, 'down')} disabled={idx === (config.emails || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => {
                            const n = [...(config.emails || [])]; n.splice(idx, 1); handleConfigChange('emails', n as any);
                          }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <input className="border rounded p-2 text-sm" placeholder="Etiqueta (Ej: Contacto)" value={em.etiqueta || ''} onChange={(e) => {
                          const n = [...(config.emails || [])]; n[idx] = { ...n[idx], etiqueta: e.target.value }; handleConfigChange('emails', n as any);
                        }} />
                        <input type="email" className="border rounded p-2 text-sm" placeholder="email@ejemplo.com" value={em.email || ''} onChange={(e) => {
                          const n = [...(config.emails || [])]; n[idx] = { ...n[idx], email: e.target.value }; handleConfigChange('emails', n as any);
                        }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => handleConfigChange('emails', [...(config.emails || []), { etiqueta: '', email: '' }] as any)} className="text-sm bg-fucsia text-white px-3 py-1 rounded">+ Añadir Correo</button>
                  </div>

                  {/* ── Redes Sociales (propias de esta página) ── */}
                  <div className="border-t pt-4 mt-2">
                    <label className="mb-1 block text-sm font-semibold text-negro">🌐 Redes Sociales (propias de esta sección)</label>
                    <p className="text-xs text-gris-texto mb-2">Redes sociales independientes del sitio (Ej: redes del Centro de Padres)</p>
                    {(config.redesSociales || []).map((red: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 pt-8 rounded-xl border border-gray-200 mb-2 relative grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="absolute top-1 right-2 flex items-center gap-1 bg-white rounded-md shadow-sm border border-gray-100 p-0.5 z-10">
                          <button type="button" onClick={() => moveItem('redesSociales', idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveItem('redesSociales', idx, 'down')} disabled={idx === (config.redesSociales || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => {
                            const n = [...(config.redesSociales || [])]; n.splice(idx, 1); handleConfigChange('redesSociales', n as any);
                          }} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                        </div>
                        <select className="border rounded p-2 text-sm" value={red.plataforma || 'facebook'} onChange={(e) => {
                          const n = [...(config.redesSociales || [])]; n[idx] = { ...n[idx], plataforma: e.target.value }; handleConfigChange('redesSociales', n as any);
                        }}>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="youtube">YouTube</option>
                          <option value="twitter">X / Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="otra">Otra</option>
                        </select>
                        <input type="url" className="border rounded p-2 text-sm" placeholder="https://..." value={red.url || ''} onChange={(e) => {
                          const n = [...(config.redesSociales || [])]; n[idx] = { ...n[idx], url: e.target.value }; handleConfigChange('redesSociales', n as any);
                        }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => handleConfigChange('redesSociales', [...(config.redesSociales || []), { plataforma: 'facebook', url: '' }] as any)} className="text-sm bg-cian text-white px-3 py-1 rounded">+ Añadir Red Social</button>
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <label className="mb-1 block text-sm font-medium text-negro">URL o IFRAME de Google Maps</label>
                    <p className="text-xs text-fucsia mb-1 font-semibold">IMPORTANTE: Abre Google Maps → Toca Compartir → "Insertar un mapa" y copia el enlace HTML aquí. No pegues la URL directa del navegador.</p>
                    <textarea rows={3} placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ... >' value={config.mapaEmbedUrl || ''} onChange={(e) => handleConfigChange('mapaEmbedUrl', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                  </div>
                </>
              )}

              {tipoBloque === 'ALERTA' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Mensaje de Alerta</label>
                    <input type="text" value={config.mensaje || ''} onChange={(e) => handleConfigChange('mensaje', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Tipo de Alerta (Color)</label>
                    <select value={config.tipo || 'info'} onChange={(e) => handleConfigChange('tipo', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4">
                      <option value="info">Institucional (Azul)</option>
                      <option value="warning">Advertencia (Amarillo)</option>
                      <option value="error">Urgente/Error (Rojo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Estilo Visual</label>
                    <select value={config.estiloAlerta || 'estandar'} onChange={(e) => handleConfigChange('estiloAlerta', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4">
                      <option value="estandar">Caja Estática Tradicional</option>
                      <option value="marquesina">Cinta de Noticias Deslizante (CNN Style)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Texto Botón (Opcional)</label>
                      <input type="text" value={config.textoEnlace || ''} onChange={(e) => handleConfigChange('textoEnlace', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Enlace (Opcional)</label>
                      <input type="text" value={config.enlaceUrl || ''} onChange={(e) => handleConfigChange('enlaceUrl', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'ESPACIADOR' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Altura de la separación</label>
                    <select value={config.altura || 'mediano'} onChange={(e) => handleConfigChange('altura', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                      <option value="pequeno">Pequeño (32px)</option>
                      <option value="mediano">Normal (64px)</option>
                      <option value="grande">Grande (128px)</option>
                    </select>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="mostrarLinea" 
                      checked={config.mostrarLinea || false} 
                      onChange={(e) => handleConfigChange('mostrarLinea', e.target.checked)} 
                      className="w-4 h-4 text-azul-acropolis"
                    />
                    <label htmlFor="mostrarLinea" className="text-sm text-negro">Mostrar línea divisoria visible</label>
                  </div>
                </>
              )}

              {tipoBloque === 'CINTA_NOTICIAS' && (
                <>
                  {/* Etiqueta principal */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Etiqueta Principal (Badge izquierdo)</label>
                    <input type="text" value={config.etiquetaPrincipal || ''} onChange={(e) => handleConfigChange('etiquetaPrincipal', e.target.value)} placeholder="NOTICIAS" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                    <p className="mt-1 text-xs text-gray-400">Ej: NOTICIAS, EN VIVO, COLEGIO ACRÓPOLIS</p>
                  </div>

                  {/* Velocidad */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-negro">Velocidad de Desplazamiento</label>
                    <select value={config.velocidad || 'normal'} onChange={(e) => handleConfigChange('velocidad', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                      <option value="lenta">🐢 Lenta (lectura cómoda)</option>
                      <option value="normal">⚡ Normal</option>
                      <option value="rapida">🚀 Rápida (flujo informativo)</option>
                    </select>
                  </div>

                  {/* Colores */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-negro">Color Fondo</label>
                      <select value={config.colorFondo || '#0f172a'} onChange={(e) => handleConfigChange('colorFondo', e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs">
                        <option value="#0f172a">Azul Oscuro (Navy)</option>
                        <option value="#4661F6">Azul Acrópolis</option>
                        <option value="#1A2952">Azul Profundo</option>
                        <option value="#18181b">Negro</option>
                        <option value="#ffffff">Blanco</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-negro">Color Texto</label>
                      <select value={config.colorTexto || '#e2e8f0'} onChange={(e) => handleConfigChange('colorTexto', e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs">
                        <option value="#e2e8f0">Blanco Suave</option>
                        <option value="#ffffff">Blanco Puro</option>
                        <option value="#FFD25E">Amarillo Acrópolis</option>
                        <option value="#1A2952">Azul Oscuro</option>
                        <option value="#18181b">Negro</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-negro">Color Etiqueta</label>
                      <select value={config.colorEtiqueta || '#FF5289'} onChange={(e) => handleConfigChange('colorEtiqueta', e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs">
                        <option value="#FF5289">Fucsia</option>
                        <option value="#ef4444">Rojo Alerta</option>
                        <option value="#FFD25E">Amarillo Acrópolis</option>
                        <option value="#13C5B5">Cian</option>
                        <option value="#4661F6">Azul Acrópolis</option>
                      </select>
                    </div>
                  </div>

                  {/* Mostrar icono LIVE */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="mostrarIconoLive" checked={config.mostrarIconoLive !== false} onChange={(e) => handleConfigChange('mostrarIconoLive', e.target.checked)} className="w-4 h-4 text-azul-acropolis" />
                    <label htmlFor="mostrarIconoLive" className="text-sm text-negro">Mostrar indicador pulsante (●) en el badge</label>
                  </div>

                  {/* Lista de noticias */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-negro">Noticias del Ticker</label>
                      <button type="button" onClick={() => handleConfigChange('noticias', [...(config.noticias || []), { texto: '', etiqueta: '' }])} className="rounded-lg bg-azul-acropolis/10 text-azul-acropolis px-3 py-1 text-xs font-medium hover:bg-azul-acropolis/20 transition-colors">+ Añadir Noticia</button>
                    </div>

                    {(config.noticias || []).length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-400">No hay noticias aún. Añade al menos una.</p>
                      </div>
                    )}

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {(config.noticias || []).map((noticia: any, index: number) => (
                        <div key={index} className="flex gap-2 items-start bg-white rounded-lg border border-gray-200 p-3">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={noticia.etiqueta || ''}
                              onChange={(e) => {
                                const updated = [...(config.noticias || [])];
                                updated[index] = { ...updated[index], etiqueta: e.target.value };
                                handleConfigChange('noticias', updated);
                              }}
                              placeholder="Etiqueta (ej: DEPORTES, URGENTE)"
                              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs"
                            />
                            <input
                              type="text"
                              value={noticia.texto || ''}
                              onChange={(e) => {
                                const updated = [...(config.noticias || [])];
                                updated[index] = { ...updated[index], texto: e.target.value };
                                handleConfigChange('noticias', updated);
                              }}
                              placeholder="Texto de la noticia..."
                              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => moveItem('noticias', index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={14} /></button>
                            <button type="button" onClick={() => moveItem('noticias', index, 'down')} disabled={index === (config.noticias || []).length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={14} /></button>
                            <button type="button" onClick={() => {
                              const updated = (config.noticias || []).filter((_: any, i: number) => i !== index);
                              handleConfigChange('noticias', updated);
                            }} className="rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors text-xs">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-gris-texto hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-azul-acropolis px-5 py-2.5 text-sm font-medium text-white hover:bg-azul-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSubmitting ? 'Guardando...' : 'Guardar Bloque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
