'use client';

import { Trash2 } from 'lucide-react';

interface DeleteFormButtonProps {
  id: number;
  action: (id: number) => Promise<any>;
  confirmMessage?: string;
}

export default function DeleteFormButton({ id, action, confirmMessage = '¿Estás seguro?' }: DeleteFormButtonProps) {
  return (
    <button
      onClick={async () => {
        if (confirm(confirmMessage)) {
          await action(id);
        }
      }}
      type="button"
      className="rounded-lg p-2 text-gris-texto transition-colors hover:bg-red-50 hover:text-red-500"
      title="Eliminar"
    >
      <Trash2 size={18} />
    </button>
  );
}
