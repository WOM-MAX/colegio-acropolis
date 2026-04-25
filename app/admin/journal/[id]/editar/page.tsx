import { db } from '@/lib/db';
import Link from 'next/link';
import { journal, journalCategorias, journalAutores } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { updateJournalConfig } from '../../actions';
import JournalForm from '../../components/JournalForm';
import { notFound } from 'next/navigation';

export default async function EditarJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const journalId = parseInt(id, 10);

  let articulo;
  try {
    const result = await db.select().from(journal).where(eq(journal.id, journalId));
    articulo = result[0];
  } catch (error) {
    console.error(error);
  }

  if (!articulo) {
    notFound();
  }

  const [categorias, autores] = await Promise.all([
    db.query.journalCategorias.findMany({ orderBy: [desc(journalCategorias.orden)] }),
    db.query.journalAutores.findMany({ orderBy: [desc(journalAutores.createdAt)] })
  ]);

  const updateJournalWithId = updateJournalConfig.bind(null, articulo.id);

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Editar Noticia
          </h1>
          <p className="mt-1 text-gris-texto">
            Modifica la información del artículo existente.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/journal/categorias"
            className="text-sm font-semibold text-azul-acropolis hover:underline"
          >
            Gestionar Categorías
          </Link>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <Link
            href="/admin/journal/autores"
            className="text-sm font-semibold text-azul-acropolis hover:underline"
          >
            Gestionar Autores
          </Link>
        </div>
      </div>

      <JournalForm 
        initialData={articulo} 
        action={updateJournalWithId}
        categorias={categorias}
        autores={autores} 
      />
    </div>
  );
}
