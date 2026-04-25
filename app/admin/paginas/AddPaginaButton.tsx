'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { addPaginaNueva } from './actions';
import { useRouter } from 'next/navigation';

export default function AddPaginaButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    const titulo = prompt('Ingresa el título de la nueva página (ej: Proyecto Tecnológico):');
    if (!titulo) return;
    
    // Generar un slug simple
    const slug = '/' + titulo.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const confirmedSlug = prompt('Slug generado. Puedes editarlo si deseas:', slug);
    if (!confirmedSlug) return;

    setLoading(true);
    const result = await addPaginaNueva(titulo, confirmedSlug);
    
    if (result.success) {
      toast.success('Página creada exitosamente');
      router.refresh(); // Refresh para que aparezca en la tabla
    } else {
      toast.error(result.error || 'Error al crear');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-azul-acropolis px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-azul-hover disabled:opacity-50"
    >
      <Plus size={18} />
      Nueva Página
    </button>
  );
}
