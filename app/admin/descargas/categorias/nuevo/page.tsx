import CategoriaForm from '../components/CategoriaForm';
import { createCategoria } from '../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NuevaCategoriaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/descargas/categorias"
          className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-white hover:text-negro"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro sm:text-3xl">
            Nueva Categoría
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Crea una nueva categoría para agrupar documentos.
          </p>
        </div>
      </div>

      {/* Form */}
      <CategoriaForm action={createCategoria} />
    </div>
  );
}
