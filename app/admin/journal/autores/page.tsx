import { db } from '@/lib/db';
import { journalAutores } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus, Pencil, User } from 'lucide-react';
import { deleteAutor } from './actions';
import DeleteFormButton from '../../components/DeleteFormButton';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function JournalAutoresPage() {
  const autores = await db.query.journalAutores.findMany({
    orderBy: [desc(journalAutores.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro sm:text-3xl">
            Autores del Journal
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Gestiona los perfiles de los autores institucionales para las noticias.
          </p>
        </div>
        <Link
          href="/admin/journal/autores/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg"
        >
          <Plus size={18} />
          Nuevo Autor
        </Link>
      </div>

      <div className="flex items-center gap-2 text-sm text-gris-texto mb-2">
         <Link href="/admin/journal" className="hover:text-azul-acropolis underline">Volver al Journal</Link>
      </div>

      <div className="rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 font-semibold text-negro">Autor</th>
                <th className="px-6 py-4 font-semibold text-negro">Cargo</th>
                <th className="px-6 py-4 text-right font-semibold text-negro">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {autores.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gris-texto">
                    No hay autores registrados.
                  </td>
                </tr>
              ) : (
                autores.map((autor) => (
                  <tr
                    key={autor.id}
                    className="group transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-400">
                          {autor.fotoUrl ? (
                            <Image 
                              src={autor.fotoUrl}
                              alt={autor.nombre}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-negro">{autor.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-gris-texto">
                         {autor.cargo}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/journal/autores/${autor.id}/editar`}
                          className="rounded-lg p-2 text-gris-texto transition-colors hover:bg-gray-100 hover:text-negro"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteFormButton 
                          id={autor.id} 
                          action={deleteAutor} 
                          confirmMessage="¿Estás seguro de eliminar este autor? Las noticias asociadas quedarán como autores anónimos (sin autor)." 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
