'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';

interface AlbumData {
  id?: number;
  titulo: string;
  descripcion: string | null;
  portadaUrl: string | null;
  fecha: string | null;
  orden: number;
  activo: boolean;
}

export default function AlbumForm({
  initialData,
  action,
}: {
  initialData?: AlbumData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const data = initialData || {
    titulo: '',
    descripcion: '',
    portadaUrl: '',
    fecha: new Date().toISOString().split('T')[0],
    orden: 0,
    activo: true,
  };

  const [activo, setActivo] = useState(data.activo);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        formData.set('activo', activo.toString());
        await action(formData);
      }}
      className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Titulo */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Título del Álbum *
          </label>
          <input
            name="titulo"
            defaultValue={data.titulo}
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Licenciatura Cuarto Medio 2026"
          />
        </div>

        {/* Imagen de Portada del Álbum */}
        <ImageUploadSection
          fieldName="portadaUrl"
          label="Imagen de Portada del Álbum"
          currentUrl={data.portadaUrl}
          width={1200}
          height={800}
          maxSize="500 KB"
        />

        {/* Descripcion */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Descripción Breve (Opcional)
          </label>
          <textarea
            name="descripcion"
            defaultValue={data.descripcion || ''}
            rows={3}
            maxLength={300}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Describe este álbum..."
          />
        </div>

        {/* Fecha del álbum */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Fecha del Álbum *
          </label>
          <input
            name="fecha"
            type="date"
            defaultValue={data.fecha || new Date().toISOString().split('T')[0]}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          />
          <p className="mt-1 text-xs text-gris-texto">
            Los álbumes se ordenan automáticamente del más reciente al más antiguo.
          </p>
        </div>

        {/* Activo Toggle */}
        <div className="flex items-center pt-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-azul-acropolis focus:ring-azul-acropolis"
            />
            <span className="text-sm font-medium text-negro">
              Álbum Activo / Visible
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Álbum'}
        </button>
        <Link
          href="/admin/galeria"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
