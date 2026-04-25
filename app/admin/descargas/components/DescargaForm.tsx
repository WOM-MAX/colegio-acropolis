'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';

interface DescargaData {
  id?: number;
  nombre: string;
  categoria: string;
  archivoUrl: string;
  version: string | null;
  imagenUrl: string | null;
  colorAcento: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

export default function DescargaForm({
  initialData,
  categorias,
  action,
}: {
  initialData?: DescargaData;
  categorias: Categoria[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const data = initialData || {
    nombre: '',
    categoria: 'documentos_oficiales',
    archivoUrl: '',
    version: '',
    imagenUrl: '',
    colorAcento: 'azul',
  };

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        await action(formData);
      }}
      className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Nombre del Archivo *
          </label>
          <input
            name="nombre"
            defaultValue={data.nombre}
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Proyecto Educativo Institucional"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Categoría *
          </label>
          <select
            name="categoria"
            defaultValue={data.categoria}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            {categorias.length === 0 ? (
              <option value="">Primero debes crear categorías</option>
            ) : (
              categorias.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.nombre}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Archivo URL */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            URL del Archivo (PDF, DOCX, etc) *
          </label>
          <input
            name="archivoUrl"
            type="url"
            defaultValue={data.archivoUrl}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="https://ejemplo.com/archivo.pdf"
          />
          <p className="mt-1 flex gap-1 text-xs text-gris-texto">
            Sube el archivo a Google Drive o similar y pega aquí el enlace directo.
          </p>
        </div>

        {/* Version */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Versión o Año (Opcional)
          </label>
          <input
            name="version"
            defaultValue={data.version || ''}
            maxLength={20}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: V2.1 o 2026"
          />
        </div>

        {/* Imagen Portada */}
        <ImageUploadSection
          fieldName="imagenUrl"
          label="Imagen de Portada de la Descarga"
          currentUrl={data.imagenUrl}
          width={300}
          height={300}
          maxSize="200 KB"
        />

        {/* Color de Acento */}
        <div className="md:col-span-2">
          <label className="mb-3 block text-sm font-medium text-negro">
            Color de Acento *
          </label>
          <div className="flex gap-4">
             {['azul', 'cian', 'fucsia', 'amarillo'].map((color) => (
               <label key={color} className="flex cursor-pointer items-center gap-2">
                 <input
                   type="radio"
                   name="colorAcento"
                   value={color}
                   defaultChecked={data.colorAcento === color}
                   className="hidden peer"
                 />
                 <div className={`h-8 w-8 rounded-full border-2 border-transparent peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-negro flex items-center justify-center transition-all ${
                    color === 'azul' ? 'bg-azul-acropolis hover:bg-azul-hover' :
                    color === 'cian' ? 'bg-cian hover:bg-cian/80' :
                    color === 'fucsia' ? 'bg-fucsia hover:bg-fucsia/80' :
                    'bg-amarillo hover:bg-amarillo-brillante'
                 }`}>
                 </div>
                 <span className="text-sm capitalize text-negro">{color}</span>
               </label>
             ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Archivo'}
        </button>
        <Link
          href="/admin/descargas"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
