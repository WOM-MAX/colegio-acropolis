import { db } from '@/lib/db';
import { journalAutores } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AutorForm from '../../components/AutorForm';

// Definir los parámetros de forma síncrona/dinámica
type EditAutorParams = {
  params: Promise<{ id: string }>;
};

export default async function EditarAutorPage({ params }: EditAutorParams) {
  const { id } = await params;
  const autorId = parseInt(id, 10);
  
  if (isNaN(autorId)) {
    notFound();
  }

  const autor = await db.query.journalAutores.findFirst({
    where: eq(journalAutores.id, autorId),
  });

  if (!autor) {
    notFound();
  }

  return <AutorForm initialData={autor} />;
}
