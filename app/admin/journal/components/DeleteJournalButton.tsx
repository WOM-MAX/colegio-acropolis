'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import toast from 'react-hot-toast';

export default function DeleteJournalButton({ id, deleteAction }: { id: number, deleteAction: (id: number) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar este artículo?')) {
      startTransition(async () => {
        try {
          await deleteAction(id);
          toast.success('Noticia eliminada correctamente');
        } catch (error) {
          toast.error('Ocurrió un error al eliminar');
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={`rounded-xl p-2 text-gris-texto transition-colors hover:bg-fucsia-soft hover:text-fucsia ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      title="Borrar"
    >
      <Trash2 size={18} />
    </button>
  );
}
