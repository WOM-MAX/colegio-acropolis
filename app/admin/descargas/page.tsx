export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/lib/db';
import { descargas } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { formatDateShort } from '@/lib/utils';
import { deleteDescarga } from './actions';
import { Plus, Edit2, Download } from 'lucide-react';
import DeleteFormButton from './components/DeleteFormButton';

import { descargasCategorias } from '@/lib/db/schema';

// Color map genérico si se necesita fallback, pero usamos arc.colorAcento para el color real.
const fallbackColor = 'bg-gray-100 text-gray-600';

export default async function DescargasPage() {
  const archivos = await db.select().from(descargas).orderBy(desc(descargas.createdAt));
  const categorias = await db.query.descargasCategorias.findMany();
  
  const categoriaLabels = categorias.reduce((acc, cat) => {
    acc[cat.id.toString()] = cat.nombre;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro sm:text-3xl">Documentos y Descargas</h1>
          <p className="mt-1 text-sm text-gris-texto">
            Administra los documentos y archivos compartidos con la comunidad.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/descargas/exportar"
            download
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-gris-texto/20 bg-white px-4 py-2 text-sm font-semibold text-negro shadow-sm transition-all hover:bg-gray-50"
          >
            <Download size={18} />
            Exportar a Excel
          </a>
          <Link
            href="/admin/descargas/categorias"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-gris-texto/20 bg-white px-4 py-2 text-sm font-semibold text-negro shadow-sm transition-all hover:bg-gray-50"
          >
            Editar Categorías
          </Link>
          <Link
            href="/admin/descargas/nuevo"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover"
          >
            <Plus size={18} />
            Nuevo Documento
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre del Archivo</th>
                <th className="px-6 py-4 font-semibold">Categoría</th>
                <th className="px-6 py-4 font-semibold">Versión</th>
                <th className="px-6 py-4 font-semibold">Fecha de Subida</th>
                <th className="px-6 py-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {archivos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gris-texto">
                    No hay documentos en el sistema.
                  </td>
                </tr>
              ) : (
                archivos.map((arc) => {
                  const lbl = categoriaLabels[arc.categoria] || arc.categoria;
                  
                  // Generamos el badge dinámico según arc.colorAcento (azul, cian, fucsia, amarillo)
                  let bdgColor = fallbackColor;
                  switch(arc.colorAcento) {
                    case 'azul': bdgColor = 'bg-azul-soft text-azul-acropolis'; break;
                    case 'cian': bdgColor = 'bg-cian-soft text-cian'; break;
                    case 'fucsia': bdgColor = 'bg-fucsia-soft text-fucsia'; break;
                    case 'amarillo': bdgColor = 'bg-amarillo-soft text-amarillo-hover'; break;
                  }

                  return (
                    <tr key={arc.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-negro">
                        <a href={arc.archivoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-azul-acropolis hover:underline">
                          <Download size={16} className="shrink-0" />
                          {arc.nombre}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${bdgColor}`}>
                          {lbl}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gris-texto">
                        {arc.version || '-'}
                      </td>
                      <td className="px-6 py-4 text-gris-texto">
                        {formatDateShort(arc.createdAt.toISOString().split('T')[0])}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/descargas/${arc.id}/editar`}
                            className="rounded-xl p-2 text-gris-texto transition-colors hover:bg-azul-soft hover:text-azul-acropolis"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <DeleteFormButton 
                            id={arc.id} 
                            action={deleteDescarga} 
                            confirmMessage="¿Estás seguro de eliminar este documento?" 
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
