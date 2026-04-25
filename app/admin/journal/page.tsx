export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/lib/db';
import { journal, journalCategorias } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { formatDateShort } from '@/lib/utils';
import { toggleJournalPublicado, deleteJournalConfig, purgeOldJournal } from './actions';
import { Plus, Edit2 } from 'lucide-react';
import DeleteJournalButton from './components/DeleteJournalButton';
import ConfirmButton from '@/app/admin/components/ConfirmButton';

const categoriaColors: Record<string, string> = {
  'Dirección': 'bg-azul-soft text-azul-acropolis',
  'Académico': 'bg-cian-soft text-cian',
  'Convivencia': 'bg-fucsia-soft text-fucsia',
  'Extraescolar': 'bg-amarillo-soft text-amarillo-hover',
  'General': 'bg-gris-claro text-gris-texto',
};

export default async function JournalPage() {
  const articulos = await db
    .select({
      id: journal.id,
      titulo: journal.titulo,
      slug: journal.slug,
      categoria: journalCategorias.nombre,
      categoriaId: journal.categoriaId,
      publicado: journal.publicado,
      createdAt: journal.createdAt,
    })
    .from(journal)
    .leftJoin(journalCategorias, eq(journal.categoriaId, journalCategorias.id))
    .orderBy(desc(journal.createdAt));

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Noticias y Comunicados (Journal)
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Administra los artículos del portal institucional.
          </p>
          <div className="mt-4 flex gap-3">
             <Link
              href="/admin/journal/categorias"
              className="text-sm font-semibold text-azul-acropolis hover:underline"
            >
              Gestionar Categorías
            </Link>
            <span className="text-gray-300">|</span>
             <Link
              href="/admin/journal/autores"
              className="text-sm font-semibold text-azul-acropolis hover:underline"
            >
              Gestionar Autores
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/journal/exportar"
            download
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-gris-texto/20 bg-white px-4 py-2 text-sm font-semibold text-negro shadow-sm transition-all hover:bg-gray-50"
          >
            Exportar Historial
          </a>
          <ConfirmButton
            action={purgeOldJournal}
            confirmMessage="¿Estás SEGURO de eliminar todas las noticias que sean de AÑOS anteriores? Esta acción NO se puede deshacer."
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-100"
          >
            Purgar Pasadas
          </ConfirmButton>
          <Link
            href="/admin/journal/nuevo"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover"
          >
            <Plus size={18} />
            Nueva Noticia
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gris-claro text-gris-texto">
              <tr>
                <th className="px-6 py-4 font-semibold">TÍTULO</th>
                <th className="px-6 py-4 font-semibold">CATEGORÍA</th>
                <th className="px-6 py-4 font-semibold">FECHA</th>
                <th className="px-6 py-4 font-semibold">PUBLICADO</th>
                <th className="px-6 py-4 text-right font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articulos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gris-texto">
                    No hay noticias creadas.
                  </td>
                </tr>
              ) : (
                articulos.map((art) => {
                  const categoriaNombre = art.categoria || 'Sin Categoría';
                  const bdgColor = categoriaColors[categoriaNombre] || categoriaColors.General;

                  return (
                    <tr key={art.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-negro">
                        {art.titulo}
                        <br />
                        <span className="text-xs font-normal text-gray-400">/{art.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${bdgColor}`}>
                          {categoriaNombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gris-texto">
                        {formatDateShort(art.createdAt.toISOString().split('T')[0])}
                      </td>
                      <td className="px-6 py-4">
                        <form action={toggleJournalPublicado.bind(null, art.id, !art.publicado)}>
                          <button
                            type="submit"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              art.publicado ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                art.publicado ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </form>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/journal/${art.id}/editar`}
                            className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <DeleteJournalButton id={art.id} deleteAction={deleteJournalConfig} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
