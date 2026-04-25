'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAutor, updateAutor } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUploadSection from '../../../components/ImageUploadSection';

type Autor = {
  id?: number;
  nombre: string;
  cargo: string;
  correoInstitucional?: string | null;
  fotoUrl?: string | null;
};

interface AutorFormProps {
  initialData?: Autor;
}

export default function AutorForm({ initialData }: AutorFormProps) {
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
        await updateAutor(initialData.id, formData);
      } else {
        await createAutor(formData);
      }
    } catch (err) {
      setError('Ocurrió un error al guardar el autor. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/journal/autores"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gris-texto shadow-sm transition-colors hover:bg-gray-50 hover:text-negro"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-negro">
              {initialData ? 'Editar Autor' : 'Nuevo Autor'}
            </h1>
            <p className="text-sm text-gris-texto">
              {initialData
                ? 'Modifica los datos del autor institucional.'
                : 'Añade un perfil de autor para las noticias.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/journal/autores"
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
        <div className="grid gap-6 md:grid-cols-2">
          
          <div className="md:col-span-2">
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-negro">
              Nombre o Entidad *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              defaultValue={initialData?.nombre}
              required
              placeholder="Ej: Patricia González Álvarez o Centro de Padres"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:bg-white focus:ring-4 focus:ring-azul-acropolis/10"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="cargo" className="mb-2 block text-sm font-medium text-negro">
              Cargo / Rol *
            </label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              defaultValue={initialData?.cargo}
              required
              placeholder="Ej: Directora, Centro de Alumnos, Profesor de Música..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:bg-white focus:ring-4 focus:ring-azul-acropolis/10"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="correoInstitucional" className="mb-2 block text-sm font-medium text-negro">
              Correo Electrónico Institucional
            </label>
            <input
              type="email"
              id="correoInstitucional"
              name="correoInstitucional"
              defaultValue={initialData?.correoInstitucional || ''}
              placeholder="Ej: comunicaciones@colegioacropolis.cl"
              maxLength={255}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:bg-white focus:ring-4 focus:ring-azul-acropolis/10"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Por seguridad y privacidad, usar solo correos institucionales (no @gmail o @hotmail). Este correo se mostrará a los apoderados como canal de contacto.
            </p>
          </div>

          <ImageUploadSection
            fieldName="fotoUrl"
            label="Foto de Perfil del Autor (Opcional)"
            currentUrl={initialData?.fotoUrl}
            width={400}
            height={400}
            maxSize="200 KB"
          />

        </div>
      </div>
    </form>
  );
}
