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
  posicion: string;
  estiloImagen: string;
  colorFondo: string;
  colorTexto: string;
  tamanoTitulo: string;
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
    posicion: 'inferior-derecha',
    estiloImagen: 'encabezado',
    colorFondo: '#ffffff',
    colorTexto: '#111827',
    tamanoTitulo: 'md',
  };

  const [activo, setActivo] = useState(data.activo);
  
  // Custom colors state
  const [colorFondo, setColorFondo] = useState(data.colorFondo);
  const [colorTexto, setColorTexto] = useState(data.colorTexto);

  const predefinedColors = [
    { label: 'Blanco', value: '#ffffff' },
    { label: 'Negro', value: '#111827' },
    { label: 'Azul Acrópolis', value: '#4661F6' },
    { label: 'Azul Oscuro', value: '#283B6A' },
    { label: 'Amarillo', value: '#FFBC05' },
    { label: 'Cian', value: '#13C5B5' },
    { label: 'Fucsia', value: '#FF5289' },
  ];

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        formData.set('activo', activo.toString());
        await action(formData);
      }}
      className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-negro border-b pb-2">Contenido Principal</h3>
        </div>

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
          width={450}
          height={700}
          maxSize="500 KB"
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
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-negro border-b pb-2">Apariencia y Posicionamiento</h3>
        </div>

        {/* Posicion */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Posición en Pantalla *
          </label>
          <select
            name="posicion"
            defaultValue={data.posicion}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="centro-modal">Modal Central (Para Urgencias)</option>
            <option value="inferior-derecha">Inferior Derecha (Discreto)</option>
            <option value="inferior-izquierda">Inferior Izquierda</option>
            <option value="banner-superior">Banner Superior</option>
            <option value="banner-inferior">Banner Inferior</option>
          </select>
        </div>

        {/* Estilo de Imagen */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Estilo de Imagen *
          </label>
          <select
            name="estiloImagen"
            defaultValue={data.estiloImagen}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="encabezado">Encabezado (Sobre el texto)</option>
            <option value="fondo">Como Fondo (Cubre toda la tarjeta)</option>
            <option value="oculta">Ocultar Imagen</option>
          </select>
        </div>

        {/* Tamaño Título */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Tamaño del Título *
          </label>
          <select
            name="tamanoTitulo"
            defaultValue={data.tamanoTitulo}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="sm">Pequeño</option>
            <option value="md">Mediano (Normal)</option>
            <option value="lg">Grande</option>
            <option value="xl">Extra Grande</option>
          </select>
        </div>

        <div></div>

        {/* Color Fondo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Color de Fondo *
          </label>
          <div className="flex items-center gap-3">
            <select
              value={predefinedColors.find(c => c.value === colorFondo) ? colorFondo : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') setColorFondo(e.target.value);
              }}
              className="w-2/3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            >
              {predefinedColors.map(c => (
                <option key={`bg-${c.value}`} value={c.value}>{c.label}</option>
              ))}
              <option value="custom">Color Personalizado...</option>
            </select>
            <input
              type="color"
              name="colorFondo"
              value={colorFondo}
              onChange={(e) => setColorFondo(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border-0 p-0"
              title="Elige un color personalizado"
            />
          </div>
        </div>

        {/* Color Texto */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Color del Texto *
          </label>
          <div className="flex items-center gap-3">
            <select
              value={predefinedColors.find(c => c.value === colorTexto) ? colorTexto : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') setColorTexto(e.target.value);
              }}
              className="w-2/3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            >
              {predefinedColors.map(c => (
                <option key={`txt-${c.value}`} value={c.value}>{c.label}</option>
              ))}
              <option value="custom">Color Personalizado...</option>
            </select>
            <input
              type="color"
              name="colorTexto"
              value={colorTexto}
              onChange={(e) => setColorTexto(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border-0 p-0"
              title="Elige un color personalizado"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-negro border-b pb-2">Configuración Lógica</h3>
        </div>

        {/* Tipo (para lógica antigua si se requiere, o color de border fallback) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Clasificación (Badge) *
          </label>
          <select
            name="tipo"
            defaultValue={data.tipo}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
          >
            <option value="info">Información</option>
            <option value="urgente">Urgente</option>
            <option value="matricula">Matrícula</option>
            <option value="evento">Evento</option>
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
