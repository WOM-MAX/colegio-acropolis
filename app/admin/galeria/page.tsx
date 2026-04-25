export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/lib/db';
import { galeriaAlbumes } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { toggleAlbumActivo, deleteAlbum } from './actions';
import { Plus, Edit2, Camera } from 'lucide-react';
import DeleteFormButton from '@/app/admin/components/DeleteFormButton';
import { formatDateShort } from '@/lib/utils';

export default async function GaleriaPage() {
  const albumes = await db.select().from(galeriaAlbumes).orderBy(desc(galeriaAlbumes.createdAt));

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Galería Institucional
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Organiza los álbumes de fotografías del establecimiento.
          </p>
        </div>
        <Link
          href="/admin/galeria/nuevo"
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover"
        >
          <Plus size={18} />
          Nuevo Álbum
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gris-claro text-gris-texto">
              <tr>
                <th className="px-6 py-4 font-semibold">FECHA</th>
                <th className="px-6 py-4 font-semibold">PORTADA</th>
                <th className="px-6 py-4 font-semibold">ÁLBUM</th>
                <th className="px-6 py-4 font-semibold">ACTIVO</th>
                <th className="px-6 py-4 text-right font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {albumes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gris-texto">
                    No hay álbumes creados.
                  </td>
                </tr>
              ) : (
                albumes.map((alb) => (
                  <tr key={alb.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gris-texto">
                      {alb.fecha ? formatDateShort(alb.fecha) : formatDateShort(alb.createdAt.toISOString().split('T')[0])}
                    </td>
                    <td className="px-6 py-4">
                      {alb.portadaUrl ? (
                        <div className="h-12 w-16 overflow-hidden rounded-xl border border-gray-200">
                          <img src={alb.portadaUrl} alt={alb.titulo} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                          <Camera size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-negro">{alb.titulo}</p>
                      <p className="text-xs text-gris-texto">
                        Creado el {formatDateShort(alb.createdAt.toISOString().split('T')[0])}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <form action={toggleAlbumActivo.bind(null, alb.id, !alb.activo)}>
                        <button
                          type="submit"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            alb.activo ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              alb.activo ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/galeria/${alb.id}/items`}
                          className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                          title="Gestionar Fotos y Videos"
                        >
                          <Camera size={18} />
                        </Link>
                        <Link
                          href={`/admin/galeria/${alb.id}/editar`}
                          className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                          title="Editar Álbum"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <DeleteFormButton
                          id={alb.id}
                          action={deleteAlbum}
                          confirmMessage="¿Estás seguro de eliminar este álbum?"
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
