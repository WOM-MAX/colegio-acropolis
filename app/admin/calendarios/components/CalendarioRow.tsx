'use client';

import { useState } from 'react';
import { Edit2, Check, X, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleCalendario, updateCalendarioEnlace } from '../actions';
import { useDebouncedCallback } from 'use-debounce';

export default function CalendarioRow({ calendario }: { calendario: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [enlace, setEnlace] = useState(calendario.enlace || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleActivo = async (checked: boolean) => {
    try {
      await toggleCalendario(calendario.id, checked);
      toast.success(checked ? 'Calendario activado' : 'Calendario desactivado');
    } catch (e) {
      toast.error('Error al cambiar el estado');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCalendarioEnlace(calendario.id, enlace);
      setIsEditing(false);
      toast.success('Enlace de calendario guardado');
    } catch (e) {
      toast.error('Error al guardar el enlace');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr className="transition-colors hover:bg-gray-50 group">
      <td className="px-6 py-4 font-medium text-negro whitespace-nowrap">
        {calendario.curso}
      </td>
      <td className="px-6 py-4 text-gris-texto">
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {calendario.ciclo}
        </span>
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <div className="flex w-full items-center gap-2">
            <div className="relative w-full max-w-sm">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="url"
                value={enlace}
                onChange={(e) => setEnlace(e.target.value)}
                placeholder="https://calendar.google.com/..."
                className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-1.5 text-sm outline-none focus:border-azul-acropolis"
                autoFocus
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center rounded-lg bg-green-500 p-1.5 text-white bg-opacity-90 hover:bg-opacity-100 disabled:opacity-50"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEnlace(calendario.enlace || '');
              }}
              disabled={isSaving}
              className="flex items-center justify-center rounded-lg bg-red-500 p-1.5 text-white bg-opacity-90 hover:bg-opacity-100 disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {calendario.enlace ? (
              <a
                href={calendario.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-azul-acropolis hover:underline truncate max-w-xs"
              >
                {calendario.enlace}
              </a>
            ) : (
              <span className="text-sm text-gris-texto italic">Sin enlace configurado</span>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-negro opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <label className="relative inline-flex cursor-pointer items-center justify-end">
          <input
            type="checkbox"
            className="peer sr-only"
            defaultChecked={calendario.activo}
            onChange={(e) => handleToggleActivo(e.target.checked)}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-azul-acropolis peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-azul-acropolis/30"></div>
        </label>
      </td>
    </tr>
  );
}
