import { db } from '@/lib/db';
import { descargasCategorias } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus, Pencil, Tag } from 'lucide-react';
import { deleteCategoria } from './actions';
import DeleteFormButton from '../components/DeleteFormButton';

export const dynamic = 'force-dynamic';

export default async function CategoriasDescargasPage() {
  const categorias = await db.query.descargasCategorias.findMany({
    orderBy: [desc(descargasCategorias.orden)],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro sm:text-3xl">
            Categorías de Descargas
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Gestiona las secciones en las que se agrupan los documentos.
          </p>
        </div>
        <Link
          href="/admin/descargas/categorias/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg"
        >
          <Plus size={18} />
          Nueva Categoría
        </Link>
      </div>

      <div className="flex items-center gap-2 text-sm text-gris-texto mb-2">
         <Link href="/admin/descargas" className="hover:text-azul-acropolis underline">Volver a Descargas</Link>
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 font-semibold text-negro">Categoría</th>
                <th className="px-6 py-4 font-semibold text-negro text-center">Orden</th>
                <th className="px-6 py-4 text-right font-semibold text-negro">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gris-texto">
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr
                    key={cat.id}
                    className="group transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-azul-acropolis/10 text-azul-acropolis">
                          <Tag size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-negro">{cat.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                         {cat.orden}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/descargas/categorias/${cat.id}/editar`}
                          className="rounded-lg p-2 text-gris-texto transition-colors hover:bg-gray-100 hover:text-negro"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteFormButton 
                          id={cat.id} 
                          action={deleteCategoria} 
                          confirmMessage="¿Estás seguro de eliminar esta categoría? Las descargas asociadas no tendrán categoría visible." 
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
