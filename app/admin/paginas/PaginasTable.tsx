'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { updatePaginaStatus, updatePaginaMenuStatus } from './actions';
import { FileText, Eye, EyeOff, LayoutTemplate } from 'lucide-react';

type Pagina = {
  id: number;
  titulo: string;
  slug: string;
  activo: boolean;
  mostrarEnMenu: boolean;
  ordenMenu: number;
};

export default function PaginasTable({ initialPaginas }: { initialPaginas: Pagina[] }) {
  const [paginas, setPaginas] = useState<Pagina[]>(initialPaginas);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    setLoadingId(id);
    const newStatus = !currentStatus;
    const result = await updatePaginaStatus(id, newStatus);
    
    if (result.success) {
      setPaginas(paginas.map(p => p.id === id ? { ...p, activo: newStatus } : p));
      toast.success(newStatus ? 'Página Activada.' : 'Página Desactivada. Ya no será accesible por URL.', {
        position: 'bottom-center'
      });
    } else {
      toast.error(result.error || 'Error al actualizar');
    }
    setLoadingId(null);
  };

  const toggleMenu = async (id: number, currentMenu: boolean) => {
    setLoadingId(id);
    const newMenu = !currentMenu;
    const result = await updatePaginaMenuStatus(id, newMenu);
    
    if (result.success) {
      setPaginas(paginas.map(p => p.id === id ? { ...p, mostrarEnMenu: newMenu } : p));
      toast.success(newMenu ? 'Página mostrada en el menú.' : 'Página oculta del menú.', {
        position: 'bottom-center'
      });
    } else {
      toast.error(result.error || 'Error al actualizar');
    }
    setLoadingId(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-gris-fondo text-gris-texto">
            <tr>
              <th className="px-6 py-4 font-semibold">Página / URL</th>
              <th className="px-6 py-4 font-semibold text-center w-32">Interruptor Maestro</th>
              <th className="px-6 py-4 font-semibold text-center w-32">Mostrar Menú</th>
              <th className="px-6 py-4 font-semibold text-center w-32">Constructor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginas.map((pagina) => (
              <tr key={pagina.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-azul-soft text-azul-acropolis">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-negro">{pagina.titulo}</p>
                      <p className="text-xs text-gris-texto mt-0.5">{pagina.slug}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={pagina.activo}
                        disabled={loadingId === pagina.id}
                        onChange={() => toggleStatus(pagina.id, pagina.activo)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-azul-acropolis peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-azul-acropolis/30 disabled:opacity-50"></div>
                    </label>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleMenu(pagina.id, pagina.mostrarEnMenu)}
                      disabled={loadingId === pagina.id || !pagina.activo}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                        !pagina.activo 
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : pagina.mostrarEnMenu 
                            ? 'bg-azul-soft text-azul-acropolis hover:bg-azul-acropolis hover:text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={pagina.mostrarEnMenu ? "Ocultar del menú" : "Mostrar en menú"}
                    >
                      {pagina.mostrarEnMenu ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <Link
                      href={`/admin/paginas/${pagina.id}`}
                      className="flex gap-2 items-center rounded-lg bg-azul-acropolis px-3 py-2 text-xs font-semibold text-white hover:bg-azul-hover transition-colors"
                      title="Editar Secciones (Bloques) de esta página"
                    >
                      <LayoutTemplate size={14} />
                      Constructor
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
