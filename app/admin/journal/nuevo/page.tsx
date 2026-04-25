import { createJournalConfig } from '../actions';
import JournalForm from '../components/JournalForm';
import { db } from '@/lib/db';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { journalCategorias, journalAutores } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function NuevoJournalPage() {
  const [categorias, autores] = await Promise.all([
    db.query.journalCategorias.findMany({ orderBy: [desc(journalCategorias.orden)] }),
    db.query.journalAutores.findMany({ orderBy: [desc(journalAutores.createdAt)] })
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Nueva Noticia
          </h1>
          <p className="mt-1 text-gris-texto">
            Redacta un nuevo artículo institucional para el Journal.
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
        action={createJournalConfig} 
        categorias={categorias}
        autores={autores}
      />
    </div>
  );
}
