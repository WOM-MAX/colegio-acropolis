'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';

interface EventoData {
  id?: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  tipo: string;
  imagenUrl: string | null;
  activo: boolean;
}

export default function EventoForm({
  initialData,
  action,
}: {
  initialData?: EventoData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const defaultDate = new Date().toISOString().split('T')[0];

  const data = initialData || {
    nombre: '',
    fecha: defaultDate,
    descripcion: '',
    tipo: 'general',
    imagenUrl: '',
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
        {/* Nombre Evento */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Nombre del Evento *
          </label>
          <input
            name="nombre"
            defaultValue={data.nombre}
            required
            maxLength={150}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Reunión de Apoderados"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Fecha del Evento *
          </label>
          <input
            name="fecha"
            type="date"
            defaultValue={data.fecha}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Tipo *
          </label>
          <select
            name="tipo"
            defaultValue={data.tipo}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="general">General</option>
            <option value="academico">Académico</option>
            <option value="deportivo">Deportivo</option>
            <option value="cultural">Cultural</option>
            <option value="feriado">Feriado o Suspensión</option>
            <option value="reunion">Reunión</option>
          </select>
        </div>

        {/* Descripcion */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Descripción Breve *
          </label>
          <textarea
            name="descripcion"
            defaultValue={data.descripcion}
            required
            rows={3}
            maxLength={200}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Detalles sobre el lugar, hora, asistentes (máx 200 caracteres)..."
          />
        </div>

        {/* Imagen del Evento */}
        <ImageUploadSection
          fieldName="imagenUrl"
          label="Imagen del Evento"
          currentUrl={data.imagenUrl}
          width={400}
          height={400}
          maxSize="500 KB"
        />

        <div className="flex items-center pt-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-azul-acropolis focus:ring-azul-acropolis"
            />
            <span className="text-sm font-medium text-negro">
              Evento Activo (visible en la web)
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
          {loading ? 'Guardando...' : 'Guardar Evento'}
        </button>
        <Link
          href="/admin/eventos"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
