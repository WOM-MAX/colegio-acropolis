'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';

interface PopupData {
  id?: number;
  titulo: string;
  contenido: string;
  imagenUrl: string | null;
  tipo: string;
  botonTexto: string | null;
  botonUrl: string | null;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  frecuencia: string;
  prioridad: number;
}

export default function PopupForm({
  initialData,
  action,
}: {
  initialData?: PopupData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const defaultStartDate = new Date().toISOString().split('T')[0];
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 7);
  const defaultEndDateStr = defaultEndDate.toISOString().split('T')[0];

  const data = initialData || {
    titulo: '',
    contenido: '',
    imagenUrl: '',
    tipo: 'info',
    botonTexto: '',
    botonUrl: '',
    fechaInicio: defaultStartDate,
    fechaFin: defaultEndDateStr,
    activo: true,
    frecuencia: 'una_vez',
    prioridad: 5,
  };

  const [activo, setActivo] = useState(data.activo);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        formData.set('activo', activo.toString());
        await action(formData);
      }}
      className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Título */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Título del Popup *
          </label>
          <input
            name="titulo"
            defaultValue={data.titulo}
            required
            maxLength={80}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Suspensión de clases por lluvia"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Tipo *
          </label>
          <select
            name="tipo"
            defaultValue={data.tipo}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="info">Información (Azul)</option>
            <option value="urgente">Urgente (Fucsia)</option>
            <option value="matricula">Matrícula (Cian)</option>
            <option value="evento">Evento (Amarillo)</option>
          </select>
        </div>

        {/* Frecuencia */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Frecuencia de visualización *
          </label>
          <select
            name="frecuencia"
            defaultValue={data.frecuencia}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="siempre">Siempre (cada vez que visita)</option>
            <option value="una_vez">Solo una vez por usuario</option>
            <option value="una_vez_por_dia">Una vez al día por usuario</option>
          </select>
        </div>

        {/* Fechas */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Fecha de Inicio *
          </label>
          <input
            name="fechaInicio"
            type="date"
            defaultValue={data.fechaInicio}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Fecha de Fin *
          </label>
          <input
            name="fechaFin"
            type="date"
            defaultValue={data.fechaFin}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          />
        </div>

        {/* Contenido */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Contenido del Mensaje *
          </label>
          <textarea
            name="contenido"
            defaultValue={data.contenido}
            required
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Escriba el detalle del mensaje aquí..."
          />
        </div>

        {/* Imagen del Popup */}
        <ImageUploadSection
          fieldName="imagenUrl"
          label="Imagen del Popup (Opcional)"
          currentUrl={data.imagenUrl}
          width={800}
          height={450}
          maxSize="300 KB"
        />

        {/* CTA */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Texto del Botón CTA (Opcional)
          </label>
          <input
            name="botonTexto"
            defaultValue={data.botonTexto || ''}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Ver más detalles"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            URL del Botón CTA (Opcional)
          </label>
          <input
            name="botonUrl"
            type="url"
            defaultValue={data.botonUrl || ''}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="https://colegioacropolis.net/noticias/1"
          />
        </div>

        {/* Prioridad y Activo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Prioridad (1-10, mayor gana) *
          </label>
          <input
            name="prioridad"
            type="number"
            min={1}
            max={10}
            defaultValue={data.prioridad}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          />
        </div>

        <div className="flex items-center pt-8">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-azul-acropolis focus:ring-azul-acropolis"
            />
            <span className="text-sm font-medium text-negro">
              Popup Activo
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Popup'}
        </button>
        <Link
          href="/admin/popups"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
