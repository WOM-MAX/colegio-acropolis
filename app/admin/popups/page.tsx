export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/lib/db';
import { popups } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { formatDateShort } from '@/lib/utils';
import { togglePopupActivo, deletePopup } from './actions';
import { Plus, Edit2 } from 'lucide-react';
import DeleteFormButton from '@/app/admin/components/DeleteFormButton';

const tipoColors: Record<string, string> = {
  info: 'bg-azul-soft text-azul-acropolis',
  urgente: 'bg-fucsia-soft text-fucsia',
  matricula: 'bg-cian-soft text-cian',
  evento: 'bg-amarillo-soft text-amarillo-hover',
};

export default async function PopupsPage() {
  const popupList = await db.select().from(popups).orderBy(desc(popups.createdAt));

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            Ventanas Emergentes (Popups)
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Gestiona los mensajes importantes que aparecen al ingresar al sitio.
          </p>
        </div>
        <Link
          href="/admin/popups/nuevo"
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover"
        >
          <Plus size={18} />
          Nuevo Popup
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gris-claro text-gris-texto">
              <tr>
                <th className="px-6 py-4 font-semibold">TÍTULO</th>
                <th className="px-6 py-4 font-semibold">TIPO</th>
                <th className="px-6 py-4 font-semibold">VIGENCIA</th>
                <th className="px-6 py-4 font-semibold">PRIORIDAD</th>
                <th className="px-6 py-4 font-semibold">ESTADO</th>
                <th className="px-6 py-4 text-right font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {popupList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gris-texto">
                    No hay popups configurados.
                  </td>
                </tr>
              ) : (
                popupList.map((popup) => {
                  const isVigente = popup.fechaInicio <= today && popup.fechaFin >= today;
                  const bdgColor = tipoColors[popup.tipo] || tipoColors.info;

                  return (
                    <tr key={popup.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-negro">
                        {popup.titulo}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${bdgColor}`}>
                          {popup.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gris-texto">
                        {formatDateShort(popup.fechaInicio)} - {formatDateShort(popup.fechaFin)}
                        <br />
                        {isVigente ? (
                          <span className="text-xs text-green-600 font-medium">Vigente hoy</span>
                        ) : (
                          <span className="text-xs text-fucsia font-medium">Fuera de plazo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gris-texto">
                        {popup.prioridad} / 10
                      </td>
                      <td className="px-6 py-4">
                        <form action={togglePopupActivo.bind(null, popup.id, !popup.activo)}>
                          <button
                            type="submit"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              popup.activo ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                popup.activo ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </form>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/popups/${popup.id}/editar`}
                            className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <DeleteFormButton
                            id={popup.id}
                            action={deletePopup}
                            confirmMessage="¿Estás seguro de eliminar este popup?"
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
