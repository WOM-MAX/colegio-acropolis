'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface DirectMediaUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  width?: number | string;
  height?: number | string;
  maxSize?: string;
  formats?: string;
  placeholder?: string;
}

export default function DirectMediaUpload({
  label,
  value,
  onChange,
  width = 'Variable',
  height = 'Variable',
  maxSize = '1 MB',
  formats = '.webp · .jpg · .png',
  placeholder = 'https://',
}: DirectMediaUploadProps) {
  const [useUpload, setUseUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al subir el archivo');
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        // Pequeño delay de transición
        setTimeout(() => setIsUploading(false), 500); 
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'Hubo un error inesperado al subir.');
      setIsUploading(false);
    }
  };

  return (
    <div className="md:col-span-2 w-full">
      <label className="mb-1.5 block text-sm font-medium text-negro">
        {label}
      </label>

      {/* Tarjeta de Especificaciones Técnicas */}
      <div className="mb-3 flex flex-wrap gap-2 md:gap-4 rounded-xl border border-azul-acropolis/20 bg-azul-soft/30 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-azul-acropolis/10 text-[10px] font-bold text-azul-acropolis">📐</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gris-texto leading-none">Dimensiones</p>
            <p className="text-xs font-bold text-negro leading-tight">{width} × {height} px</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-l border-azul-acropolis/10 pl-2 md:pl-4">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-azul-acropolis/10 text-[10px] font-bold text-azul-acropolis">⚖️</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gris-texto leading-none">Peso máximo</p>
            <p className="text-xs font-bold text-negro leading-tight">{maxSize}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-l border-azul-acropolis/10 pl-2 md:pl-4">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-azul-acropolis/10 text-[10px] font-bold text-azul-acropolis">🖼️</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gris-texto leading-none">Formatos</p>
            <p className="text-xs font-bold text-negro leading-tight">{formats}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        {/* Pestañas de Selección de Modo */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-negro">Método de ingreso:</h4>
          <div className="flex gap-1 bg-gray-200/60 p-1 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setUseUpload(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!useUpload ? 'bg-white text-azul-acropolis shadow-sm' : 'text-gris-texto hover:text-negro'}`}
            >
              URL Externa
            </button>
            <button
              type="button"
              onClick={() => setUseUpload(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${useUpload ? 'bg-white text-azul-acropolis shadow-sm' : 'text-gris-texto hover:text-negro'}`}
            >
              Subir Archivo
            </button>
          </div>
        </div>

        {/* Muestra imagen actual/preview miniatura */}
        {value && !useUpload && (
           <div className="mb-3 flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-2">
             <div className="relative h-12 w-16 overflow-hidden rounded border border-gray-100 bg-gray-50 shrink-0">
                {/* Intentamos mostrar imagen, en videos el onerror lo manejará */}
                <img src={value} className="h-full w-full object-cover" alt="Media Preview" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2JjYmNiIiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiLz48L3N2Zz4=';
                }}/>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-[10px] font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={12}/> Enlace detectado</p>
               <p className="truncate text-[11px] text-gris-texto font-mono">{value}</p>
             </div>
           </div>
        )}

        <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Capa de Loading */}
          {isUploading && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-azul-acropolis animate-spin" />
                <span className="text-xs font-semibold text-azul-acropolis">Subiendo y procesando...</span>
             </div>
          )}

          {!useUpload ? (
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gris-texto">
                Introduce el enlace directo al recurso multimedia
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-negro outline-none transition-all focus:border-azul-acropolis"
                placeholder={placeholder}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-azul-soft text-azul-acropolis">
                  <UploadCloud size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,video/mp4"
                    disabled={isUploading}
                    className="block w-full text-xs text-gris-texto file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-azul-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-azul-acropolis hover:file:bg-azul-100 focus:outline-none file:transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
              
              {/* Éxito / Error Mensajes */}
              {errorStatus && (
                <div className="mt-2 text-[11px] text-red-500 flex items-center gap-1">
                   <AlertCircle size={12} /> {errorStatus}
                </div>
              )}

              {value && useUpload && (
                <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-2 flex items-center gap-2">
                   <div className="h-8 w-12 rounded overflow-hidden shrink-0">
                     <img src={value} className="w-full h-full object-cover" alt="Uploaded preview" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-green-700 font-bold truncate">¡Subida exitosa!</p>
                      <p className="text-[9px] text-green-600 truncate">{value.split('/').pop()}</p>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
