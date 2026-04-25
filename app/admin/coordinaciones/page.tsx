export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/lib/db';
import { coordinaciones } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { deleteCoordinacion } from './actions';
import { Plus, Edit2 } from 'lucide-react';
import DeleteFormButton from '@/app/admin/components/DeleteFormButton';

export default async function CoordinacionesPage() {
  const unidades = await db.select().from(coordinaciones).orderBy(asc(coordinaciones.orden));

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Coordinaciones
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Administra las unidades organizacionales y los coordinadores.
          </p>
        </div>
        <Link
          href="/admin/coordinaciones/nuevo"
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover"
        >
          <Plus size={18} />
          Nueva Coordinación
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gris-claro text-gris-texto">
              <tr>
                <th className="px-6 py-4 font-semibold">ORDEN</th>
                <th className="px-6 py-4 font-semibold">UNIDAD / COORDINACIÓN</th>
                <th className="px-6 py-4 font-semibold">ENCARGADO(A)</th>
                <th className="px-6 py-4 font-semibold">FOTO</th>
                <th className="px-6 py-4 text-right font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {unidades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gris-texto">
                    No hay coordinaciones ingresadas.
                  </td>
                </tr>
              ) : (
                unidades.map((uni) => (
                  <tr key={uni.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gris-texto">
                      #{uni.orden}
                    </td>
                    <td className="px-6 py-4 font-bold text-negro">
                      {uni.nombreUnidad}
                    </td>
                    <td className="px-6 py-4 text-gris-texto">
                      {uni.encargada}
                    </td>
                    <td className="px-6 py-4">
                      {uni.fotoUrl ? (
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                          <img src={uni.fotoUrl} alt={uni.encargada} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Sin foto</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/coordinaciones/${uni.id}/editar`}
                          className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <DeleteFormButton
                          id={uni.id}
                          action={deleteCoordinacion}
                          confirmMessage="¿Estás seguro de eliminar esta coordinación?"
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
