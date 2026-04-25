export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/lib/db';
import { centroPadresDirectiva } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { deleteDirectiva } from './actions';
import { Plus, Edit2 } from 'lucide-react';
import DeleteFormButton from '@/app/admin/components/DeleteFormButton';

export default async function CentroPadresPage() {
  const directiva = await db.select().from(centroPadresDirectiva).orderBy(asc(centroPadresDirectiva.orden));

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Centro de Padres (CEPA)
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Mantén actualizada la directiva del Centro de Padres.
          </p>
        </div>
        <Link
          href="/admin/centro-de-padres/nuevo"
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover"
        >
          <Plus size={18} />
          Nuevo Miembro
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gris-claro text-gris-texto">
              <tr>
                <th className="px-6 py-4 font-semibold">ORDEN</th>
                <th className="px-6 py-4 font-semibold">FOTO</th>
                <th className="px-6 py-4 font-semibold">MIEMBRO</th>
                <th className="px-6 py-4 font-semibold">CARGO</th>
                <th className="px-6 py-4 font-semibold">PERÍODO</th>
                <th className="px-6 py-4 text-right font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {directiva.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gris-texto">
                    No hay miembros de la directiva registrados.
                  </td>
                </tr>
              ) : (
                directiva.map((miembro) => (
                  <tr key={miembro.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gris-texto">
                      #{miembro.orden}
                    </td>
                    <td className="px-6 py-4">
                      {miembro.fotoUrl ? (
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                          <img src={miembro.fotoUrl} alt={miembro.nombre} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                          {miembro.nombre.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-negro">{miembro.nombre}</p>
                      {miembro.email && (
                        <p className="text-xs text-gris-texto">{miembro.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-azul-soft px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-azul-acropolis">
                        {miembro.cargo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gris-texto">
                      {miembro.periodo || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/centro-de-padres/${miembro.id}/editar`}
                          className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <DeleteFormButton
                          id={miembro.id}
                          action={deleteDirectiva}
                          confirmMessage="¿Estás seguro de eliminar a este miembro?"
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
