'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';
import RichTextEditor from '@/app/admin/components/RichTextEditor';

interface JournalData {
  id?: number;
  titulo: string;
  categoriaId: number | null;
  autorId: number | null;
  extracto: string;
  contenido: string;
  imagenUrl: string | null;
  publicado: boolean;
  createdAt?: string | Date;
}

export default function JournalForm({
  initialData,
  autores = [],
  categorias = [],
  action,
}: {
  initialData?: JournalData;
  autores?: { id: number; nombre: string; cargo: string }[];
  categorias?: { id: number; nombre: string }[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const data = initialData || {
    titulo: '',
    categoriaId: categorias.length > 0 ? categorias[0].id : null,
    autorId: autores.length > 0 ? autores[0].id : null,
    extracto: '',
    contenido: '',
    imagenUrl: '',
    publicado: false,
    createdAt: new Date(),
  };

  const router = useRouter();
  const [publicado, setPublicado] = useState(data.publicado);
  const [contenido, setContenido] = useState(data.contenido);

  const formattedDate = data.createdAt 
    ? new Date(data.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];



  return (
    <form
      action={async (formData) => {
        setLoading(true);
        try {
          formData.set('publicado', publicado.toString());
          formData.set('contenido', contenido);
          await action(formData);
          toast.success(data.id ? '¡Noticia actualizada exitosamente!' : '¡Noticia creada exitosamente!');
          router.push('/admin/journal');
          router.refresh();
        } catch (error) {
          toast.error('Ocurrió un error guardando la noticia.');
          setLoading(false);
        }
      }}
      className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Título */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Título de la Noticia *
          </label>
          <input
            name="titulo"
            defaultValue={data.titulo}
            required
            maxLength={120}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Ceremonia de Titulación 2026"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Categoría *
          </label>
          <select
            name="categoriaId"
            defaultValue={data.categoriaId?.toString()}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="">Selecciona una categoría...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Autor */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Autor *
          </label>
          <select
            name="autorId"
            defaultValue={data.autorId?.toString()}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="">Selecciona un autor...</option>
            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>
                {autor.nombre} ({autor.cargo})
              </option>
            ))}
          </select>
        </div>
        
        {/* Fecha de Publicación */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Fecha de Publicación
          </label>
          <input
            type="date"
            name="fechaPublicacion"
            defaultValue={formattedDate}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20 md:w-1/2"
          />
        </div>

        {/* Imagen de Portada */}
        <ImageUploadSection
          fieldName="imagenUrl"
          label="Imagen de Portada"
          currentUrl={data.imagenUrl}
          width={1200}
          height={630}
          maxSize="500 KB"
        />

        {/* Extracto */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Extracto Breve * (Max 200 caracteres)
          </label>
          <textarea
            name="extracto"
            defaultValue={data.extracto}
            required
            maxLength={200}
            rows={2}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Resumen corto para la tarjeta en la página principal..."
          />
        </div>

        {/* Contenido (Rich Text) */}
        <div className="md:col-span-2">
          <RichTextEditor
            label="Contenido Completo *"
            value={contenido}
            onChange={setContenido}
            placeholder="Redacta la noticia completa aquí. Usa las herramientas para alinear o resaltar textos."
            rows={14}
          />
        </div>

        {/* Publicado Toggle */}
        <div className="flex items-center pt-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={publicado}
              onChange={(e) => setPublicado(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-azul-acropolis focus:ring-azul-acropolis"
            />
            <span className="text-sm font-medium text-negro">
              Publicar inmediatamente
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading || !contenido.trim() || contenido === '<p><br></p>'}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Artículo'}
        </button>
        <Link
          href="/admin/journal"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
