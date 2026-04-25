'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';

interface DirectivaData {
  id?: number;
  nombre: string;
  cargo: string;
  fotoUrl: string | null;
  email: string | null;
  periodo: string | null;
  orden: number;
}

export default function DirectivaForm({
  initialData,
  action,
}: {
  initialData?: DirectivaData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const data = initialData || {
    nombre: '',
    cargo: '',
    fotoUrl: '',
    email: '',
    periodo: '',
    orden: 0,
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
            Nombre Completo *
          </label>
          <input
            name="nombre"
            defaultValue={data.nombre}
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        {/* Cargo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Cargo *
          </label>
          <input
            name="cargo"
            defaultValue={data.cargo}
            required
            maxLength={80}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Presidente"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Email de Contacto (Opcional)
          </label>
          <input
            name="email"
            type="email"
            defaultValue={data.email || ''}
            maxLength={255}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: juan@cepa.cl"
          />
        </div>

        {/* Periodo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Período (Opcional)
          </label>
          <input
            name="periodo"
            defaultValue={data.periodo || ''}
            maxLength={20}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: 2025-2026"
          />
        </div>

        {/* Fotografía del Miembro */}
        <ImageUploadSection
          fieldName="fotoUrl"
          label="Fotografía del Miembro"
          currentUrl={data.fotoUrl}
          width={400}
          height={400}
          maxSize="200 KB"
        />

        {/* Orden */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Orden de aparición *
          </label>
          <input
            name="orden"
            type="number"
            defaultValue={data.orden}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="0"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Directiva'}
        </button>
        <Link
          href="/admin/centro-de-padres"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
