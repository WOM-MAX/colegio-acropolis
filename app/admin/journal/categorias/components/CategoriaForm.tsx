'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategoria, updateCategoria } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type Categoria = {
  id?: number;
  nombre: string;
  orden: number;
};

interface CategoriaFormProps {
  initialData?: Categoria;
}

export default function CategoriaForm({ initialData }: CategoriaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      if (initialData?.id) {
        await updateCategoria(initialData.id, formData);
      } else {
        await createCategoria(formData);
      }
    } catch (err) {
      setError('Ocurrió un error al guardar la categoría. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/journal/categorias"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gris-texto shadow-sm transition-colors hover:bg-gray-50 hover:text-negro"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-negro">
              {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
            </h1>
            <p className="text-sm text-gris-texto">
              {initialData
                ? 'Modifica los detalles de la categoría seleccionada.'
                : 'Añade una nueva categoría para organizar las noticias.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/journal/categorias"
            className="rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium text-gris-texto transition-colors hover:bg-gray-100 hover:text-negro"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form Content */}
      <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-negro">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              defaultValue={initialData?.nombre}
              required
              placeholder="Ej: Institucional, Académico..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:bg-white focus:ring-4 focus:ring-azul-acropolis/10"
            />
          </div>

          <div>
            <label htmlFor="orden" className="mb-2 block text-sm font-medium text-negro">
              Orden de visualización
            </label>
            <input
              type="number"
              id="orden"
              name="orden"
              defaultValue={initialData?.orden ?? 0}
              required
              min="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:bg-white focus:ring-4 focus:ring-azul-acropolis/10"
            />
            <p className="mt-2 text-xs text-gris-texto">
              Un número mayor aparecerá primero en las listas o filtros (opcional si deseas personalizar el orden).
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
