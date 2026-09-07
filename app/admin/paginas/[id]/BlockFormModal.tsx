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
                  <optgroup label="📢 Contenido y Elementos Dinámicos">
                    <option value="CINTA_NOTICIAS">📺 Cinta de Noticias (Ticker CNN)</option>
                    <option value="ALERTA">Cintillo de Alerta / Info</option>
                    <option value="PAGE_HEADER">Encabezado Azul (Título central destacado)</option>
                    <option value="HERO">Cabecera Hero Personalizada (Imagen + Título)</option>
                    <option value="IMAGEN_TEXTO">Imagen y Texto (Diseño 50/50)</option>
                    <option value="TEXTO">Bloque de Texto Enrich (Párrafos y Títulos)</option>
                    <option value="TARJETAS">Grilla de Tarjetas (Características)</option>
                    <option value="DOCUMENTOS_LISTA">📄 Lista de Documentos Descargables (PDFs/Circulares)</option>
                    <option value="PASOS_PROCESO">🔢 Pasos y Proceso / Línea de Tiempo (Admisión)</option>
                    <option value="TABS_CONTENIDO">📑 Pestañas de Contenido (Niveles / Misión)</option>
                    <option value="HORARIOS_JORNADA">⏰ Horarios y Jornadas Escolares (Entrada/Salida)</option>
                    <option value="LOGOS_CONVENIOS">🏛️ Logos y Convenios Institucionales (Alianzas)</option>
                    <option value="ACORDEON">Acordeón (Preguntas/Documentos)</option>
                    <option value="CTA_BOTONES">Llamado a la Acción (Botones)</option>
                    <option value="TESTIMONIOS">Testimonios (Grilla de citas)</option>
                    <option value="GALERIA_MINI">Galería de Imágenes (Grid)</option>
                    <option value="EQUIPO">👥 Correos Institucionales / Equipo Directivo</option>
                    <option value="VIDEO">Video Integrado (YouTube/Vimeo)</option>
                    <option value="ESTADISTICAS">Métricas y Estadísticas (Números)</option>
                    <option value="CONTACTO_INFO">Información de Contacto y Mapa</option>
                    <option value="ESPACIADOR">Espaciador / Línea Divisoria</option>
                  </optgroup>
                  <optgroup label="⚡ Secciones del Sistema (Página de Inicio)">
                    <option value="HOME_HERO">🏫 Hero Principal Institucional (Frontis Acrópolis)</option>
                    <option value="HOME_EVENTOS">📅 Carrusel de Eventos y Efemérides</option>
                    <option value="HOME_JOURNAL">📰 Grid de Noticias (Journal Institucional)</option>
                    <option value="HOME_CALENDARIOS">📆 Calendarios de Evaluaciones</option>
                    <option value="HOME_DESCARGAS">📂 Zona de Descargas Rápidas</option>
                    <option value="HOME_BANNER_CTA">🎓 Banner de Admisión y Matrícula</option>
                  </optgroup>
                </select>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-4">
              <h3 className="font-semibold text-sm text-gris-texto uppercase tracking-wider mb-2">Configuración del {tipoBloque}</h3>

              {tipoBloque.startsWith('HOME_') && (
                <div className="rounded-xl border border-azul-acropolis/20 bg-azul-soft/50 p-4 text-sm">
                  <div className="flex items-center gap-2 font-bold text-azul-acropolis mb-1">
                    <span>⚡ Sección Institucional del Sistema</span>
                  </div>
                  <p className="text-gris-texto text-xs leading-relaxed">
                    Esta sección es un módulo nativo del Colegio Acrópolis. Renderiza automáticamente sus datos desde la base de datos o componentes institucionales. Puedes colocarla en cualquier posición de la página o intercalar otros bloques a su alrededor.
                  </p>
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-semibold text-negro">Etiqueta de Referencia en el CMS</label>
                    <input 
                      type="text" 
                      value={config.titulo || ''} 
                      onChange={(e) => handleConfigChange('titulo', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      placeholder="Ej: Hero Principal Institucional"
                    />
                  </div>
                </div>
              )}
              
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
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Alineación</label>
                      <select 
                        value={config.alineacion || 'left'} 
                        onChange={(e) => handleConfigChange('alineacion', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Color de Fondo</label>
                      <select 
                        value={config.estiloFondo || 'blanco'} 
                        onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="blanco">Fondo Blanco Puro (#FFFFFF)</option>
                        <option value="gris">Fondo Gris Claro (#F5F5F5)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
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
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Columnas Desktop</label>
                      <select 
                        value={config.columnas || '3'} onChange={(e) => handleConfigChange('columnas', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="2">2 Columnas</option>
                        <option value="3">3 Columnas</option>
                        <option value="4">4 Columnas</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Color de Fondo</label>
                      <select 
                        value={config.estiloFondo || 'gris'} onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="gris">Fondo Gris Claro (#F5F5F5 - Portada)</option>
                        <option value="blanco">Fondo Blanco Puro (#FFFFFF)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Modo de Visualización</label>
                      <select
                        value={config.modoVisualizacion || 'carrusel'}
                        onChange={(e) => handleConfigChange('modoVisualizacion', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="carrusel">🎠 Carrusel Interactivo (Ahorra espacio)</option>
                        <option value="grilla">▦ Grilla Estática Tradicional</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-negro">Color de Fondo</label>
                      <select
                        value={config.estiloFondo || 'gris'}
                        onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="gris">Fondo Gris Claro (#F5F5F5 - Portada)</option>
                        <option value="blanco">Fondo Blanco Puro (#FFFFFF)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
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

              {tipoBloque === 'DOCUMENTOS_LISTA' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal de la Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo / Instrucciones (Opcional)" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Diseño Visual</label>
                      <select
                        value={config.disenoVisual || 'lista'}
                        onChange={(e) => handleConfigChange('disenoVisual', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="lista">Fichas en Lista Horizontal (Recomendado)</option>
                        <option value="grilla">Tarjetas en Cuadrícula (Grilla)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Columnas (si es Grilla)</label>
                      <select
                        value={config.columnas || '3'}
                        onChange={(e) => handleConfigChange('columnas', e.target.value)}
                        disabled={config.disenoVisual === 'lista'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none disabled:opacity-50"
                      >
                        <option value="2">2 Columnas</option>
                        <option value="3">3 Columnas (Estándar)</option>
                        <option value="4">4 Columnas</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Estilo de Fondo</label>
                      <select
                        value={config.estiloFondo || 'gris'}
                        onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="gris">Fondo Gris Claro (#F5F5F5)</option>
                        <option value="blanco">Fondo Blanco (#FFFFFF)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-negro">Documentos y Archivos</label>
                        <p className="text-xs text-gris-texto">Sube archivos directos (PDF, Word, Excel, ZIP hasta 15MB) o ingresa enlaces.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(config.documentos || []), {
                            titulo: '',
                            descripcion: '',
                            archivoUrl: '',
                            categoria: 'Documentos Oficiales',
                            peso: '',
                            formato: 'pdf',
                            destacado: false,
                            fechaActualizacion: ''
                          }];
                          handleConfigChange('documentos', updated);
                        }}
                        className="rounded-lg bg-azul-acropolis text-white px-3 py-1.5 text-xs font-semibold hover:bg-azul-hover transition-colors shadow-2xs"
                      >
                        + Añadir Documento
                      </button>
                    </div>

                    {(!config.documentos || config.documentos.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                        <p className="text-sm text-gray-400">No hay documentos registrados. Haz clic en "+ Añadir Documento".</p>
                      </div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {(config.documentos || []).map((doc: any, index: number) => (
                        <div key={index} className="bg-white p-4 pt-7 rounded-xl border border-gray-200 shadow-2xs relative space-y-3">
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-2xs border border-gray-200 p-0.5 z-10">
                            <button
                              type="button"
                              onClick={() => moveItem('documentos', index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Subir"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('documentos', index, 'down')}
                              disabled={index === (config.documentos || []).length - 1}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Bajar"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (config.documentos || []).filter((_: any, i: number) => i !== index);
                                handleConfigChange('documentos', updated);
                              }}
                              className="p-1 hover:bg-red-50 rounded text-red-500"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Título del Documento *</label>
                              <input
                                type="text"
                                value={doc.titulo || ''}
                                onChange={(e) => {
                                  const updated = [...(config.documentos || [])];
                                  updated[index] = { ...updated[index], titulo: e.target.value };
                                  handleConfigChange('documentos', updated);
                                }}
                                placeholder="Ej: Reglamento Interno de Convivencia Escolar 2026"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Categoría / Etiqueta</label>
                              <input
                                type="text"
                                value={doc.categoria || ''}
                                onChange={(e) => {
                                  const updated = [...(config.documentos || [])];
                                  updated[index] = { ...updated[index], categoria: e.target.value };
                                  handleConfigChange('documentos', updated);
                                }}
                                placeholder="Ej: Reglamentos, Circulares, Listas de Útiles"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-negro">Descripción Breve</label>
                            <input
                              type="text"
                              value={doc.descripcion || ''}
                              onChange={(e) => {
                                const updated = [...(config.documentos || [])];
                                updated[index] = { ...updated[index], descripcion: e.target.value };
                                handleConfigChange('documentos', updated);
                              }}
                              placeholder="Ej: Normativa vigente aprobada por el Consejo Escolar."
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                            />
                          </div>

                          <div>
                            <DirectMediaUpload
                              label="Archivo Descargable (PDF, Word, Excel, ZIP o URL externa)"
                              value={doc.archivoUrl || ''}
                              onChange={(url) => {
                                const updated = [...(config.documentos || [])];
                                updated[index] = { ...updated[index], archivoUrl: url };
                                handleConfigChange('documentos', updated);
                              }}
                              maxSize="15 MB"
                              formats=".pdf · .doc/.docx · .xls/.xlsx · .zip"
                              placeholder="https://..."
                            />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end pt-1">
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Formato</label>
                              <select
                                value={doc.formato || 'pdf'}
                                onChange={(e) => {
                                  const updated = [...(config.documentos || [])];
                                  updated[index] = { ...updated[index], formato: e.target.value };
                                  handleConfigChange('documentos', updated);
                                }}
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white focus:border-azul-acropolis focus:outline-none"
                              >
                                <option value="pdf">PDF</option>
                                <option value="word">Word (DOC)</option>
                                <option value="excel">Excel (XLS)</option>
                                <option value="zip">ZIP / Archivo</option>
                                <option value="general">General</option>
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Peso (Opcional)</label>
                              <input
                                type="text"
                                value={doc.peso || ''}
                                onChange={(e) => {
                                  const updated = [...(config.documentos || [])];
                                  updated[index] = { ...updated[index], peso: e.target.value };
                                  handleConfigChange('documentos', updated);
                                }}
                                placeholder="Ej: 2.4 MB"
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Fecha (Opcional)</label>
                              <input
                                type="text"
                                value={doc.fechaActualizacion || ''}
                                onChange={(e) => {
                                  const updated = [...(config.documentos || [])];
                                  updated[index] = { ...updated[index], fechaActualizacion: e.target.value };
                                  handleConfigChange('documentos', updated);
                                }}
                                placeholder="Ej: Marzo 2026"
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div className="flex items-center pb-2">
                              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-negro">
                                <input
                                  type="checkbox"
                                  checked={!!doc.destacado}
                                  onChange={(e) => {
                                    const updated = [...(config.documentos || [])];
                                    updated[index] = { ...updated[index], destacado: e.target.checked };
                                    handleConfigChange('documentos', updated);
                                  }}
                                  className="w-4 h-4 rounded text-azul-acropolis border-gray-300 focus:ring-azul-acropolis"
                                />
                                <span>Destacado ⭐</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'PASOS_PROCESO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal de la Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo / Instrucciones (Opcional)" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Diseño de la Secuencia</label>
                      <select
                        value={config.disenoVisual || 'timeline'}
                        onChange={(e) => handleConfigChange('disenoVisual', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="timeline">Línea de Tiempo Vertical (Conectores Centrales)</option>
                        <option value="tarjetas_conectadas">Tarjetas Horizontales Enlazadas con Flechas</option>
                        <option value="cuadricula_numerada">Cuadrícula con Grandes Números de Marca de Agua</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Estilo de Fondo</label>
                      <select
                        value={config.estiloFondo || 'gris'}
                        onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="gris">Fondo Gris Claro (#F5F5F5)</option>
                        <option value="blanco">Fondo Blanco (#FFFFFF)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-negro">Hitos / Pasos del Proceso</label>
                        <p className="text-xs text-gris-texto">Define las etapas, fechas y enlaces de acción en orden secuencial.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentCount = (config.pasos || []).length;
                          const updated = [...(config.pasos || []), {
                            numero: `${currentCount + 1}`.padStart(2, '0'),
                            subtitulo: '',
                            titulo: '',
                            descripcion: '',
                            badgeEstado: '',
                            colorEstado: 'azul',
                            enlaceUrl: '',
                            enlaceTexto: 'Más Información'
                          }];
                          handleConfigChange('pasos', updated);
                        }}
                        className="rounded-lg bg-azul-acropolis text-white px-3 py-1.5 text-xs font-semibold hover:bg-azul-hover transition-colors shadow-2xs"
                      >
                        + Añadir Paso
                      </button>
                    </div>

                    {(!config.pasos || config.pasos.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                        <p className="text-sm text-gray-400">No hay pasos registrados. Haz clic en "+ Añadir Paso".</p>
                      </div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {(config.pasos || []).map((paso: any, index: number) => (
                        <div key={index} className="bg-white p-4 pt-7 rounded-xl border border-gray-200 shadow-2xs relative space-y-3">
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-2xs border border-gray-200 p-0.5 z-10">
                            <button
                              type="button"
                              onClick={() => moveItem('pasos', index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Subir"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('pasos', index, 'down')}
                              disabled={index === (config.pasos || []).length - 1}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Bajar"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (config.pasos || []).filter((_: any, i: number) => i !== index);
                                handleConfigChange('pasos', updated);
                              }}
                              className="p-1 hover:bg-red-50 rounded text-red-500"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Número o Año *</label>
                              <input
                                type="text"
                                value={paso.numero || ''}
                                onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], numero: e.target.value };
                                  handleConfigChange('pasos', updated);
                                }}
                                placeholder="Ej: 01, Paso 1, 2026"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="mb-1 block text-xs font-semibold text-negro">Subtítulo / Período de Fecha</label>
                              <input
                                type="text"
                                value={paso.subtitulo || ''}
                                onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], subtitulo: e.target.value };
                                  handleConfigChange('pasos', updated);
                                }}
                                placeholder="Ej: Agosto - Septiembre | Etapa Inicial"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-negro">Título del Paso *</label>
                            <input
                              type="text"
                              value={paso.titulo || ''}
                              onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], titulo: e.target.value };
                                  handleConfigChange('pasos', updated);
                              }}
                              placeholder="Ej: Postulación en la plataforma del Sistema de Admisión Escolar"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-negro">Descripción / Detalle</label>
                            <textarea
                              rows={2}
                              value={paso.descripcion || ''}
                              onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], descripcion: e.target.value };
                                  handleConfigChange('pasos', updated);
                              }}
                              placeholder="Describe las instrucciones clave, requisitos o antecedentes a presentar..."
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Badge de Estado / Énfasis (Opcional)</label>
                              <input
                                type="text"
                                value={paso.badgeEstado || ''}
                                onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], badgeEstado: e.target.value };
                                  handleConfigChange('pasos', updated);
                                }}
                                placeholder="Ej: En Curso, Requisito, Próximamente"
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Color del Badge</label>
                              <select
                                value={paso.colorEstado || 'azul'}
                                onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], colorEstado: e.target.value };
                                  handleConfigChange('pasos', updated);
                                }}
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white focus:border-azul-acropolis focus:outline-none"
                              >
                                <option value="azul">Azul Institucional</option>
                                <option value="amarillo">Amarillo Acrópolis</option>
                                <option value="verde">Verde Éxito</option>
                                <option value="fucsia">Fucsia Llamativo</option>
                                <option value="gris">Gris Neutro</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Enlace / Botón (Opcional)</label>
                              <input
                                type="text"
                                value={paso.enlaceUrl || ''}
                                onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], enlaceUrl: e.target.value };
                                  handleConfigChange('pasos', updated);
                                }}
                                placeholder="https://..."
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Texto del Botón</label>
                              <input
                                type="text"
                                value={paso.enlaceTexto || ''}
                                onChange={(e) => {
                                  const updated = [...(config.pasos || [])];
                                  updated[index] = { ...updated[index], enlaceTexto: e.target.value };
                                  handleConfigChange('pasos', updated);
                                }}
                                placeholder="Ej: Ir al portal SAE, Descargar Ficha"
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'TABS_CONTENIDO' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal de la Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo / Introducción (Opcional)" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Estilo de Navegación de Pestañas</label>
                      <select
                        value={config.estiloTabs || 'acropolis_3d'}
                        onChange={(e) => handleConfigChange('estiloTabs', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="acropolis_3d">Contenedor 3D Acrópolis (Elegante y Elevado)</option>
                        <option value="pills">Píldoras Redondeadas (Pills)</option>
                        <option value="subrayado">Línea Inferior Activa (Minimalista)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Estilo de Fondo de Sección</label>
                      <select
                        value={config.estiloFondo || 'blanco'}
                        onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="blanco">Fondo Blanco Puro (#FFFFFF)</option>
                        <option value="gris">Fondo Gris Claro (#F5F5F5)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-negro">Pestañas / Niveles Educativos</label>
                        <p className="text-xs text-gris-texto">Añade cada pestaña interactiva con su texto, imagen y puntos clave.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(config.tabs || []), {
                            etiqueta: '',
                            subetiqueta: '',
                            iconoEmoji: '🎓',
                            tituloPanel: '',
                            contenidoHtml: '',
                            imagenUrl: '',
                            posicionImagen: 'derecha',
                            puntosClave: ['', ''],
                            botonTexto: '',
                            botonUrl: ''
                          }];
                          handleConfigChange('tabs', updated);
                        }}
                        className="rounded-lg bg-azul-acropolis text-white px-3 py-1.5 text-xs font-semibold hover:bg-azul-hover transition-colors shadow-2xs"
                      >
                        + Añadir Pestaña
                      </button>
                    </div>

                    {(!config.tabs || config.tabs.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                        <p className="text-sm text-gray-400">No hay pestañas creadas. Haz clic en "+ Añadir Pestaña".</p>
                      </div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {(config.tabs || []).map((tab: any, index: number) => (
                        <div key={index} className="bg-white p-4 pt-7 rounded-xl border border-gray-200 shadow-2xs relative space-y-3">
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-2xs border border-gray-200 p-0.5 z-10">
                            <button
                              type="button"
                              onClick={() => moveItem('tabs', index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Subir"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('tabs', index, 'down')}
                              disabled={index === (config.tabs || []).length - 1}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Bajar"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (config.tabs || []).filter((_: any, i: number) => i !== index);
                                handleConfigChange('tabs', updated);
                              }}
                              className="p-1 hover:bg-red-50 rounded text-red-500"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-2">
                              <label className="mb-1 block text-xs font-semibold text-negro">Ícono / Emoji</label>
                              <input
                                type="text"
                                value={tab.iconoEmoji || ''}
                                onChange={(e) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], iconoEmoji: e.target.value };
                                  handleConfigChange('tabs', updated);
                                }}
                                placeholder="Ej: 🎨, 🔬"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-center focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-6">
                              <label className="mb-1 block text-xs font-semibold text-negro">Nombre Pestaña *</label>
                              <input
                                type="text"
                                value={tab.etiqueta || ''}
                                onChange={(e) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], etiqueta: e.target.value };
                                  handleConfigChange('tabs', updated);
                                }}
                                placeholder="Ej: Educación Parvularia"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="mb-1 block text-xs font-semibold text-negro">Subetiqueta (Opcional)</label>
                              <input
                                type="text"
                                value={tab.subetiqueta || ''}
                                onChange={(e) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], subetiqueta: e.target.value };
                                  handleConfigChange('tabs', updated);
                                }}
                                placeholder="Ej: Pre-Kínder a Kínder"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-negro">Título Interior del Panel</label>
                            <input
                              type="text"
                              value={tab.tituloPanel || ''}
                              onChange={(e) => {
                                const updated = [...(config.tabs || [])];
                                updated[index] = { ...updated[index], tituloPanel: e.target.value };
                                handleConfigChange('tabs', updated);
                              }}
                              placeholder="Ej: Estimulando el aprendizaje temprano a través del juego"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                            />
                          </div>

                          <div>
                            <Suspense fallback={<div className="h-20 animate-pulse rounded-xl bg-gray-100" />}>
                              <RichTextEditor
                                label="Contenido del Panel"
                                value={tab.contenidoHtml || ''}
                                onChange={(html) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], contenidoHtml: html };
                                  handleConfigChange('tabs', updated);
                                }}
                                placeholder="Detalles pedagógicos, enfoques curriculares..."
                                rows={4}
                              />
                            </Suspense>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                            <div>
                              <DirectMediaUpload
                                label="Imagen Complementaria (Opcional)"
                                value={tab.imagenUrl || ''}
                                onChange={(url) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], imagenUrl: url };
                                  handleConfigChange('tabs', updated);
                                }}
                                width={800}
                                height={600}
                                maxSize="2 MB"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Posición de Imagen</label>
                              <select
                                value={tab.posicionImagen || 'derecha'}
                                onChange={(e) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], posicionImagen: e.target.value };
                                  handleConfigChange('tabs', updated);
                                }}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                              >
                                <option value="derecha">A la Derecha del Texto</option>
                                <option value="izquierda">A la Izquierda del Texto</option>
                                <option value="sin_imagen">Sin Imagen (Sólo Texto)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-negro">Puntos Clave / Sellos (Separados por coma)</label>
                            <input
                              type="text"
                              value={(tab.puntosClave || []).join(', ')}
                              onChange={(e) => {
                                const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                const updated = [...(config.tabs || [])];
                                updated[index] = { ...updated[index], puntosClave: arr };
                                handleConfigChange('tabs', updated);
                              }}
                              placeholder="Ej: Inglés desde Pre-Kínder, Sala de psicomotricidad, Acompañamiento fonoaudiológico"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Enlace / Botón del Panel (Opcional)</label>
                              <input
                                type="text"
                                value={tab.botonUrl || ''}
                                onChange={(e) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], botonUrl: e.target.value };
                                  handleConfigChange('tabs', updated);
                                }}
                                placeholder="https://..."
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-negro">Texto del Botón</label>
                              <input
                                type="text"
                                value={tab.botonTexto || ''}
                                onChange={(e) => {
                                  const updated = [...(config.tabs || [])];
                                  updated[index] = { ...updated[index], botonTexto: e.target.value };
                                  handleConfigChange('tabs', updated);
                                }}
                                placeholder="Ej: Conocer más sobre Parvularia"
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'HORARIOS_JORNADA' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal de la Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo / Instrucciones (Opcional)" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Columnas de Tarjetas</label>
                      <select
                        value={config.columnas || '3'}
                        onChange={(e) => handleConfigChange('columnas', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="2">2 Columnas (Recomendado para 2 niveles)</option>
                        <option value="3">3 Columnas (Estándar para Parvularia/Básica/Media)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Estilo de Fondo</label>
                      <select
                        value={config.estiloFondo || 'gris'}
                        onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="gris">Fondo Gris Claro (#F5F5F5)</option>
                        <option value="blanco">Fondo Blanco (#FFFFFF)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-negro">Aviso General de Seguridad / Puntualidad (Opcional)</label>
                    <textarea
                      rows={2}
                      value={config.avisoGeneral || ''}
                      onChange={(e) => handleConfigChange('avisoGeneral', e.target.value)}
                      placeholder="Ej: Se recuerda a los apoderados que las puertas se cierran a las 08:15 hrs. La puntualidad es parte de nuestra formación valórica."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-negro">Tarjetas de Jornadas por Nivel</label>
                        <p className="text-xs text-gris-texto">Añade cada nivel educativo con sus horarios de entrada, almuerzo y salida.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(config.jornadas || []), {
                            tituloNivel: '',
                            subtituloJornada: 'Jornada Escolar Completa (JEC)',
                            iconoEmoji: '🎒',
                            colorBorde: 'azul',
                            notaPie: '',
                            filas: [
                              { diaOPeriodo: 'Lunes a Jueves', entrada: '08:00 hrs', salida: '15:30 hrs', recreoAlmuerzo: '13:00 - 13:45 hrs', observacion: '' },
                              { diaOPeriodo: 'Viernes', entrada: '08:00 hrs', salida: '13:00 hrs', recreoAlmuerzo: '', observacion: 'Talleres opcionales hasta 15:00 hrs' }
                            ]
                          }];
                          handleConfigChange('jornadas', updated);
                        }}
                        className="rounded-lg bg-azul-acropolis text-white px-3 py-1.5 text-xs font-semibold hover:bg-azul-hover transition-colors shadow-2xs"
                      >
                        + Añadir Nivel
                      </button>
                    </div>

                    {(!config.jornadas || config.jornadas.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                        <p className="text-sm text-gray-400">No hay jornadas configuradas. Haz clic en "+ Añadir Nivel".</p>
                      </div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {(config.jornadas || []).map((jornada: any, index: number) => (
                        <div key={index} className="bg-white p-4 pt-7 rounded-xl border border-gray-200 shadow-2xs relative space-y-3">
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-2xs border border-gray-200 p-0.5 z-10">
                            <button
                              type="button"
                              onClick={() => moveItem('jornadas', index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Subir"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('jornadas', index, 'down')}
                              disabled={index === (config.jornadas || []).length - 1}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Bajar"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (config.jornadas || []).filter((_: any, i: number) => i !== index);
                                handleConfigChange('jornadas', updated);
                              }}
                              className="p-1 hover:bg-red-50 rounded text-red-500"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-2">
                              <label className="mb-1 block text-xs font-semibold text-negro">Ícono / Emoji</label>
                              <input
                                type="text"
                                value={jornada.iconoEmoji || ''}
                                onChange={(e) => {
                                  const updated = [...(config.jornadas || [])];
                                  updated[index] = { ...updated[index], iconoEmoji: e.target.value };
                                  handleConfigChange('jornadas', updated);
                                }}
                                placeholder="Ej: 🎒, ⏰"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-center focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-6">
                              <label className="mb-1 block text-xs font-semibold text-negro">Nivel Educativo *</label>
                              <input
                                type="text"
                                value={jornada.tituloNivel || ''}
                                onChange={(e) => {
                                  const updated = [...(config.jornadas || [])];
                                  updated[index] = { ...updated[index], tituloNivel: e.target.value };
                                  handleConfigChange('jornadas', updated);
                                }}
                                placeholder="Ej: Educación Básica (1° a 6° Básico)"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="mb-1 block text-xs font-semibold text-negro">Color del Borde Superior</label>
                              <select
                                value={jornada.colorBorde || 'azul'}
                                onChange={(e) => {
                                  const updated = [...(config.jornadas || [])];
                                  updated[index] = { ...updated[index], colorBorde: e.target.value };
                                  handleConfigChange('jornadas', updated);
                                }}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                              >
                                <option value="azul">Azul Acrópolis</option>
                                <option value="amarillo">Amarillo Acrópolis</option>
                                <option value="fucsia">Fucsia</option>
                                <option value="verde">Verde Esmeralda</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Subtítulo de Jornada</label>
                              <input
                                type="text"
                                value={jornada.subtituloJornada || ''}
                                onChange={(e) => {
                                  const updated = [...(config.jornadas || [])];
                                  updated[index] = { ...updated[index], subtituloJornada: e.target.value };
                                  handleConfigChange('jornadas', updated);
                                }}
                                placeholder="Ej: Jornada Escolar Completa (JEC)"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Nota al Pie de Tarjeta (Opcional)</label>
                              <input
                                type="text"
                                value={jornada.notaPie || ''}
                                onChange={(e) => {
                                  const updated = [...(config.jornadas || [])];
                                  updated[index] = { ...updated[index], notaPie: e.target.value };
                                  handleConfigChange('jornadas', updated);
                                }}
                                placeholder="Ej: Talleres deportivos hasta 16:30 hrs"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Filas de Horarios por Día */}
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-negro">Horarios por Día / Período</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const filas = [...(jornada.filas || []), { diaOPeriodo: '', entrada: '08:00 hrs', salida: '15:30 hrs', recreoAlmuerzo: '', observacion: '' }];
                                  const updated = [...(config.jornadas || [])];
                                  updated[index] = { ...updated[index], filas };
                                  handleConfigChange('jornadas', updated);
                                }}
                                className="text-[11px] font-bold text-azul-acropolis hover:underline"
                              >
                                + Añadir Fila
                              </button>
                            </div>

                            {(jornada.filas || []).map((fila: any, fIdx: number) => (
                              <div key={fIdx} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-white p-2.5 rounded-md border border-gray-200 text-xs items-center">
                                <div className="md:col-span-3">
                                  <input
                                    type="text"
                                    value={fila.diaOPeriodo || ''}
                                    onChange={(e) => {
                                      const filas = [...(jornada.filas || [])];
                                      filas[fIdx] = { ...filas[fIdx], diaOPeriodo: e.target.value };
                                      const updated = [...(config.jornadas || [])];
                                      updated[index] = { ...updated[index], filas };
                                      handleConfigChange('jornadas', updated);
                                    }}
                                    placeholder="Día (ej: Lunes a Jueves)"
                                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <input
                                    type="text"
                                    value={fila.entrada || ''}
                                    onChange={(e) => {
                                      const filas = [...(jornada.filas || [])];
                                      filas[fIdx] = { ...filas[fIdx], entrada: e.target.value };
                                      const updated = [...(config.jornadas || [])];
                                      updated[index] = { ...updated[index], filas };
                                      handleConfigChange('jornadas', updated);
                                    }}
                                    placeholder="Entrada: 08:00"
                                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <input
                                    type="text"
                                    value={fila.salida || ''}
                                    onChange={(e) => {
                                      const filas = [...(jornada.filas || [])];
                                      filas[fIdx] = { ...filas[fIdx], salida: e.target.value };
                                      const updated = [...(config.jornadas || [])];
                                      updated[index] = { ...updated[index], filas };
                                      handleConfigChange('jornadas', updated);
                                    }}
                                    placeholder="Salida: 15:30"
                                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                                  />
                                </div>
                                <div className="md:col-span-4">
                                  <input
                                    type="text"
                                    value={fila.recreoAlmuerzo || ''}
                                    onChange={(e) => {
                                      const filas = [...(jornada.filas || [])];
                                      filas[fIdx] = { ...filas[fIdx], recreoAlmuerzo: e.target.value };
                                      const updated = [...(config.jornadas || [])];
                                      updated[index] = { ...updated[index], filas };
                                      handleConfigChange('jornadas', updated);
                                    }}
                                    placeholder="Almuerzo: 13:00 - 13:45"
                                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                                  />
                                </div>
                                <div className="md:col-span-1 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filas = (jornada.filas || []).filter((_: any, i: number) => i !== fIdx);
                                      const updated = [...(config.jornadas || [])];
                                      updated[index] = { ...updated[index], filas };
                                      handleConfigChange('jornadas', updated);
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tipoBloque === 'LOGOS_CONVENIOS' && (
                <>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Título Principal de la Sección" value={config.tituloSeccion || ''} onChange={(html) => handleConfigChange('tituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>
                  <div>
                    <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-gray-100" />}>
                      <RichTextEditor label="Subtítulo / Descripción (Opcional)" value={config.subtituloSeccion || ''} onChange={(html) => handleConfigChange('subtituloSeccion', html)} rows={2} />
                    </Suspense>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Diseño de Visualización</label>
                      <select
                        value={config.disenoVisual || 'grilla_elegante'}
                        onChange={(e) => handleConfigChange('disenoVisual', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="grilla_elegante">Cuadrícula con Fichas Limpias (Recomendado)</option>
                        <option value="cinta_continua">Fila Continua de Logos (Ticker horizontal)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-negro">Estilo de Fondo</label>
                      <select
                        value={config.estiloFondo || 'blanco'}
                        onChange={(e) => handleConfigChange('estiloFondo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-azul-acropolis focus:outline-none"
                      >
                        <option value="blanco">Fondo Blanco Puro (#FFFFFF)</option>
                        <option value="gris">Fondo Gris Claro (#F5F5F5)</option>
                        <option value="azul">Fondo Azul Tenue (Institucional)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="escalaGrisesCheck"
                      checked={config.escalaGrises !== false}
                      onChange={(e) => handleConfigChange('escalaGrises', e.target.checked)}
                      className="w-4 h-4 rounded text-azul-acropolis border-gray-300 focus:ring-azul-acropolis"
                    />
                    <label htmlFor="escalaGrisesCheck" className="text-xs font-medium text-negro cursor-pointer">
                      Modo Escala de Grises (logos sobrios en gris que recuperan color original al pasar el cursor)
                    </label>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-negro">Logos de Instituciones y Convenios</label>
                        <p className="text-xs text-gris-texto">Añade convenios universitarios, ministeriales, deportivos o de certificación.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(config.logos || []), {
                            nombre: '',
                            logoUrl: '',
                            categoria: 'Convenio Universitario',
                            descripcionCorta: '',
                            enlaceUrl: ''
                          }];
                          handleConfigChange('logos', updated);
                        }}
                        className="rounded-lg bg-azul-acropolis text-white px-3 py-1.5 text-xs font-semibold hover:bg-azul-hover transition-colors shadow-2xs"
                      >
                        + Añadir Logo
                      </button>
                    </div>

                    {(!config.logos || config.logos.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                        <p className="text-sm text-gray-400">No hay logos registrados. Haz clic en "+ Añadir Logo".</p>
                      </div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {(config.logos || []).map((item: any, index: number) => (
                        <div key={index} className="bg-white p-4 pt-7 rounded-xl border border-gray-200 shadow-2xs relative space-y-3">
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-md shadow-2xs border border-gray-200 p-0.5 z-10">
                            <button
                              type="button"
                              onClick={() => moveItem('logos', index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Subir"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('logos', index, 'down')}
                              disabled={index === (config.logos || []).length - 1}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                              title="Bajar"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (config.logos || []).filter((_: any, i: number) => i !== index);
                                handleConfigChange('logos', updated);
                              }}
                              className="p-1 hover:bg-red-50 rounded text-red-500"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Nombre de la Institución *</label>
                              <input
                                type="text"
                                value={item.nombre || ''}
                                onChange={(e) => {
                                  const updated = [...(config.logos || [])];
                                  updated[index] = { ...updated[index], nombre: e.target.value };
                                  handleConfigChange('logos', updated);
                                }}
                                placeholder="Ej: Pontificia Universidad Católica de Chile"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Categoría / Tipo de Alianza</label>
                              <input
                                type="text"
                                value={item.categoria || ''}
                                onChange={(e) => {
                                  const updated = [...(config.logos || [])];
                                  updated[index] = { ...updated[index], categoria: e.target.value };
                                  handleConfigChange('logos', updated);
                                }}
                                placeholder="Ej: Convenio Universitario, Acreditación, Deportes"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Descripción Corta / RBD (Opcional)</label>
                              <input
                                type="text"
                                value={item.descripcionCorta || ''}
                                onChange={(e) => {
                                  const updated = [...(config.logos || [])];
                                  updated[index] = { ...updated[index], descripcionCorta: e.target.value };
                                  handleConfigChange('logos', updated);
                                }}
                                placeholder="Ej: Cupos directos PACE / Bachillerato"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-negro">Enlace Web Oficial (Opcional)</label>
                              <input
                                type="text"
                                value={item.enlaceUrl || ''}
                                onChange={(e) => {
                                  const updated = [...(config.logos || [])];
                                  updated[index] = { ...updated[index], enlaceUrl: e.target.value };
                                  handleConfigChange('logos', updated);
                                }}
                                placeholder="https://..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <DirectMediaUpload
                              label="Imagen del Logo (PNG transparente o SVG recomendado)"
                              value={item.logoUrl || ''}
                              onChange={(url) => {
                                const updated = [...(config.logos || [])];
                                updated[index] = { ...updated[index], logoUrl: url };
                                handleConfigChange('logos', updated);
                              }}
                              width={400}
                              height={200}
                              maxSize="1 MB"
                            />
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
