import { db } from '@/lib/db';
import { journalCategorias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import CategoriaForm from '../../components/CategoriaForm';

// Definir los parámetros de forma síncrona/dinámica
type EditCategoriaParams = {
  params: Promise<{ id: string }>;
};

export default async function EditarCategoriaPage({ params }: EditCategoriaParams) {
  const { id } = await params;
  const categoriaId = parseInt(id, 10);
  
  if (isNaN(categoriaId)) {
    notFound();
  }

  const categoria = await db.query.journalCategorias.findFirst({
    where: eq(journalCategorias.id, categoriaId),
  });

  if (!categoria) {
    notFound();
  }

  return <CategoriaForm initialData={categoria} />;
}
