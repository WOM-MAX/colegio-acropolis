'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CategoriaData {
  id?: number;
  nombre: string;
  orden: number;
}

export default function CategoriaForm({
  initialData,
  action,
}: {
  initialData?: CategoriaData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const data = initialData || {
    nombre: '',
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
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Nombre de la Categoría *
          </label>
          <input
            name="nombre"
            defaultValue={data.nombre}
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Documentos Oficiales"
          />
        </div>

        {/* Orden */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Orden de aparición (número)
          </label>
          <input
            name="orden"
            type="number"
            defaultValue={data.orden}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="0"
          />
          <p className="mt-1 flex gap-1 text-xs text-gris-texto">
            Determina en qué orden aparecerá esta categoría en la web (0 es primero).
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Categoría'}
        </button>
        <Link
          href="/admin/descargas/categorias"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
