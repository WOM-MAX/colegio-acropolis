'use client';

import { useState } from 'react';
import { UploadCloud, ImageIcon } from 'lucide-react';

interface ImageUploadSectionProps {
  /** Form field name for the URL input */
  fieldName: string;
  /** Label text */
  label: string;
  /** Current image URL (for edit preview) */
  currentUrl?: string | null;
  /** Recommended width in px */
  width: number;
  /** Recommended height in px */
  height: number;
  /** Max file size label */
  maxSize: string;
}

export default function ImageUploadSection({
  fieldName,
  label,
  currentUrl,
  width,
  height,
  maxSize,
}: ImageUploadSectionProps) {
  const [useUpload, setUseUpload] = useState(false);

  return (
    <div className="md:col-span-2">
      <label className="mb-1.5 block text-sm font-medium text-negro">
        {label}
      </label>

      {/* Specs Card — siempre visible */}
      <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-azul-acropolis/20 bg-azul-soft/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-azul-acropolis/10 text-xs font-bold text-azul-acropolis">📐</span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gris-texto">Dimensiones</p>
            <p className="text-sm font-bold text-negro">{width} × {height} px</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-azul-acropolis/10 text-xs font-bold text-azul-acropolis">⚖️</span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gris-texto">Peso máximo</p>
            <p className="text-sm font-bold text-negro">{maxSize}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-azul-acropolis/10 text-xs font-bold text-azul-acropolis">🖼️</span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gris-texto">Formatos</p>
            <p className="text-sm font-bold text-negro">.webp · .jpg · .png</p>
          </div>
        </div>
      </div>

      {/* Panel principal */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-bold text-negro">Origen de la imagen</h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUseUpload(false)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${!useUpload ? 'bg-azul-acropolis text-white' : 'bg-gray-200 text-gris-texto hover:bg-gray-300'}`}
            >
              URL Externa
            </button>
            <button
              type="button"
              onClick={() => setUseUpload(true)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${useUpload ? 'bg-azul-acropolis text-white' : 'bg-gray-200 text-gris-texto hover:bg-gray-300'}`}
            >
              Subir Archivo
            </button>
          </div>
        </div>

        {/* Preview de imagen actual */}
        {currentUrl && (
          <div className="mb-4 flex items-center gap-4 rounded-lg border border-dashed border-gray-300 bg-white p-3">
            <img
              src={currentUrl}
              alt="Preview"
              className="h-16 w-24 rounded-lg object-cover border border-gray-200"
            />
            <div>
              <p className="text-xs font-semibold text-negro">Imagen actual</p>
              <p className="max-w-xs truncate text-[11px] text-gris-texto">{currentUrl}</p>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          {!useUpload ? (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gris-texto">
                Pega el enlace web de la imagen (debe empezar con http:// o https://)
              </label>
              <input
                name={fieldName}
                type="text"
                defaultValue={currentUrl || ''}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <p className="mt-2 text-[11px] text-gris-texto leading-relaxed">
                💡 Sube tu imagen a Google Drive, Imgur o Cloudinary y pega el enlace público aquí.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-azul-soft text-azul-acropolis">
                  <UploadCloud size={24} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-negro mb-1">
                    Selecciona un archivo desde tu equipo
                  </label>
                  <input
                    type="file"
                    name="uploadTarget"
                    accept="image/jpeg,image/png,image/webp"
                    className="block w-full text-sm text-gris-texto file:mr-4 file:rounded-full file:border-0 file:bg-azul-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-azul-acropolis hover:file:bg-azul-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
