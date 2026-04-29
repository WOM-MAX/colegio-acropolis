'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';
import RichTextEditor from '@/app/admin/components/RichTextEditor';

interface CoordinacionData {
  id?: number;
  nombreUnidad: string;
  encargada: string;
  tituloProfesional?: string | null;
  resenaProfesional?: string | null;
  correoInstitucional: string | null;
  fotoUrl: string | null;
  funciones: string;
  orden: number;
}

export default function CoordinacionForm({
  initialData,
  action,
}: {
  initialData?: CoordinacionData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [funciones, setFunciones] = useState(initialData?.funciones || '');
  const [resenaProfesional, setResenaProfesional] = useState(initialData?.resenaProfesional || '');

  const data = initialData || {
    nombreUnidad: '',
    encargada: '',
    tituloProfesional: '',
    resenaProfesional: '',
    correoInstitucional: '',
    fotoUrl: '',
    funciones: '',
    orden: 0,
  };

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        formData.set('funciones', funciones);
        formData.set('resenaProfesional', resenaProfesional);
        await action(formData);
      }}
      className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre Unidad */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Nombre de la Unidad / Coordinación *
          </label>
          <input
            name="nombreUnidad"
            defaultValue={data.nombreUnidad}
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Coordinación Académica"
          />
        </div>

        {/* Encargada */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Nombre del Encargado(a) *
          </label>
          <input
            name="encargada"
            defaultValue={data.encargada}
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: María José Pérez"
          />
        </div>

        {/* Título Profesional */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Título Profesional / Grados
          </label>
          <input
            name="tituloProfesional"
            defaultValue={data.tituloProfesional || ''}
            maxLength={150}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: Magíster en Educación, Universidad de Chile"
          />
        </div>

        {/* Correo Institucional */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Correo Electrónico Institucional
          </label>
          <input
            name="correoInstitucional"
            type="email"
            defaultValue={data.correoInstitucional || ''}
            maxLength={255}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ej: inspectoria@colegioacropolis.cl"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Por seguridad y privacidad, usar solo correos institucionales (no @gmail o @hotmail).
          </p>
        </div>

        {/* Fotografía del Encargado */}
        <ImageUploadSection
          fieldName="fotoUrl"
          label="Fotografía del Encargado(a)"
          currentUrl={data.fotoUrl}
          width={800}
          height={600}
          maxSize="300 KB"
        />

        {/* Funciones */}
        <div className="md:col-span-2">
          <RichTextEditor
            label="Funciones / Objetivos de la Coordinación *"
            value={funciones}
            onChange={setFunciones}
            placeholder="Describe las responsabilidades principales..."
            rows={5}
          />
        </div>

        {/* Reseña Profesional */}
        <div className="md:col-span-2">
          <RichTextEditor
            label="Reseña Profesional (Currículum)"
            value={resenaProfesional}
            onChange={setResenaProfesional}
            placeholder="Breve biografía profesional de 1 o 2 párrafos..."
            rows={4}
          />
        </div>

        {/* Orden */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Orden de visualización (menor a mayor) *
          </label>
          <input
            name="orden"
            type="number"
            defaultValue={data.orden}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Unidad'}
        </button>
        <Link
          href="/admin/coordinaciones"
          className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
