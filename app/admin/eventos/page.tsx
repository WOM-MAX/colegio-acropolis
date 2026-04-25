export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/lib/db';
import { eventos } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { formatDateShort } from '@/lib/utils';
import { toggleEventoActivo, deleteEvento, purgeOldEventos } from './actions';
import { Plus, Edit2 } from 'lucide-react';
import ConfirmButton from '@/app/admin/components/ConfirmButton';
import DeleteFormButton from '@/app/admin/descargas/components/DeleteFormButton';

const tipoColors: Record<string, string> = {
  general: 'bg-gris-claro text-gris-texto',
  academico: 'bg-azul-soft text-azul-acropolis',
  deportivo: 'bg-cian-soft text-cian',
  cultural: 'bg-fucsia-soft text-fucsia',
  feriado: 'bg-red-100 text-red-600',
  reunion: 'bg-amarillo-soft text-amarillo-hover',
};

export default async function EventosPage() {
  const listado = await db.select().from(eventos).orderBy(desc(eventos.fecha));

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Eventos
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Administra el calendario de actividades del colegio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/eventos/exportar"
            download
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-gris-texto/20 bg-white px-4 py-2 text-sm font-semibold text-negro shadow-sm transition-all hover:bg-gray-50"
          >
            Exportar Historial (CSV)
          </a>
          <ConfirmButton
            action={purgeOldEventos}
            confirmMessage="¿Estás SEGURO de eliminar todos los eventos con fecha anterior a hoy? Esta acción NO se puede deshacer."
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-100"
          >
            Purgar Eventos Pasados
          </ConfirmButton>
          <Link
            href="/admin/eventos/nuevo"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover"
          >
            <Plus size={18} />
            Nuevo Evento
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gris-claro text-gris-texto">
              <tr>
                <th className="px-6 py-4 font-semibold">NOMBRE DEL EVENTO</th>
                <th className="px-6 py-4 font-semibold">TIPO</th>
                <th className="px-6 py-4 font-semibold">FECHA PROGRAMADA</th>
                <th className="px-6 py-4 font-semibold">ACTIVO</th>
                <th className="px-6 py-4 text-right font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listado.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gris-texto">
                    No hay eventos creados.
                  </td>
                </tr>
              ) : (
                listado.map((evt) => {
                  const bdgColor = tipoColors[evt.tipo] || tipoColors.general;

                  return (
                    <tr key={evt.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-negro">
                        {evt.nombre}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${bdgColor}`}>
                          {evt.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gris-texto">
                        {formatDateShort(evt.fecha)}
                      </td>
                      <td className="px-6 py-4">
                        <form action={toggleEventoActivo.bind(null, evt.id, !evt.activo)}>
                          <button
                            type="submit"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              evt.activo ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                evt.activo ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </form>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/eventos/${evt.id}/editar`}
                            className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <DeleteFormButton
                            id={evt.id}
                            action={deleteEvento}
                            confirmMessage="¿Estás seguro de eliminar este evento?"
                          />
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
