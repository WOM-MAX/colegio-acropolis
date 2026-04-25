import CategoriaForm from '../../components/CategoriaForm';
import { updateCategoria } from '../../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { descargasCategorias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const categoria = await db.query.descargasCategorias.findFirst({
    where: eq(descargasCategorias.id, parseInt(resolvedParams.id, 10)),
  });

  if (!categoria) {
    notFound();
  }

  // Pre-bind the ID to the server action
  const updateCategoriaWithId = updateCategoria.bind(null, categoria.id);

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
            Editar Categoría
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Modifica el nombre o el orden de la categoría.
          </p>
        </div>
      </div>

      {/* Form */}
      <CategoriaForm initialData={categoria} action={updateCategoriaWithId} />
    </div>
  );
}
