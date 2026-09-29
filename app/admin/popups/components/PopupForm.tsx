'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadSection from '@/app/admin/components/ImageUploadSection';
import RichTextEditor from '@/app/admin/components/RichTextEditor';
import { X, ArrowRight, Eye, Layout, Palette, Calendar } from 'lucide-react';
import { AmbientEffectLayer } from '@/components/ui/AmbientEffects';

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
  colorBoton: string;
  colorTextoBoton?: string;
  paginaDestino?: string;
  tamanoTitulo: string;
  efectoVisual?: string;
}

interface PaginaDisponible {
  slug: string;
  titulo: string;
}

export default function PopupForm({
  initialData,
  action,
  paginasDisponibles = [],
}: {
  initialData?: PopupData;
  action: (formData: FormData) => Promise<void>;
  paginasDisponibles?: PaginaDisponible[];
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
    posicion: 'centro-modal',
    estiloImagen: 'encabezado',
    colorFondo: '#ffffff',
    colorTexto: '#111827',
    colorBoton: '#4661F6',
    colorTextoBoton: '#ffffff',
    paginaDestino: '/',
    tamanoTitulo: 'md',
    efectoVisual: 'ninguno',
  };

  // Estados interactivos para el formulario y la Vista Previa en Vivo
  const [titulo, setTitulo] = useState(data.titulo);
  const [contenido, setContenido] = useState(data.contenido);
  const [imagenUrl, setImagenUrl] = useState(data.imagenUrl || '');
  const [tipo, setTipo] = useState(data.tipo);
  const [botonTexto, setBotonTexto] = useState(data.botonTexto || '');
  const [botonUrl, setBotonUrl] = useState(data.botonUrl || '');
  const [posicion, setPosicion] = useState(data.posicion);
  const [estiloImagen, setEstiloImagen] = useState(data.estiloImagen);
  const [tamanoTitulo, setTamanoTitulo] = useState(data.tamanoTitulo);
  const [colorFondo, setColorFondo] = useState(data.colorFondo);
  const [colorTexto, setColorTexto] = useState(data.colorTexto);
  const [colorBoton, setColorBoton] = useState(data.colorBoton || '#4661F6');
  const [colorTextoBoton, setColorTextoBoton] = useState(data.colorTextoBoton || '#ffffff');
  const [efectoVisual, setEfectoVisual] = useState(data.efectoVisual || 'ninguno');
  const [activo, setActivo] = useState(data.activo);
  const [frecuencia, setFrecuencia] = useState(data.frecuencia);
  const [prioridad, setPrioridad] = useState(data.prioridad);

  // Paletas temáticas preconfiguradas en 1 clic (Inspiradas en Poptin)
  const themePresets = [
    {
      name: 'Institucional',
      desc: 'Clásico azul y blanco',
      colorFondo: '#ffffff',
      colorTexto: '#111827',
      colorBoton: '#4661F6',
      colorTextoBoton: '#ffffff',
      efectoVisual: 'ninguno',
      tipo: 'info',
    },
    {
      name: 'Ciencia / Tech',
      desc: 'Modo oscuro con 0 y 1',
      colorFondo: '#0f172a',
      colorTexto: '#f8fafc',
      colorBoton: '#10b981',
      colorTextoBoton: '#ffffff',
      efectoVisual: 'cascada_digital',
      tipo: 'evento',
    },
    {
      name: 'Celebración',
      desc: 'Festivo con confeti',
      colorFondo: '#ffffff',
      colorTexto: '#1e1b4b',
      colorBoton: '#f59e0b',
      colorTextoBoton: '#ffffff',
      efectoVisual: 'confeti',
      tipo: 'matricula',
    },
    {
      name: 'Alerta Urgente',
      desc: 'Aura radiante pulsante',
      colorFondo: '#ffffff',
      colorTexto: '#111827',
      colorBoton: '#ef4444',
      colorTextoBoton: '#ffffff',
      efectoVisual: 'halo_radiante',
      tipo: 'urgente',
    },
    {
      name: 'Noche Fucsia',
      desc: 'Oscuro con glow neón',
      colorFondo: '#18181b',
      colorTexto: '#ffffff',
      colorBoton: '#ff5289',
      colorTextoBoton: '#ffffff',
      efectoVisual: 'halo_radiante',
      tipo: 'info',
    },
  ];

  const applyThemePreset = (preset: (typeof themePresets)[0]) => {
    setColorFondo(preset.colorFondo);
    setColorTexto(preset.colorTexto);
    setColorBoton(preset.colorBoton);
    setColorTextoBoton(preset.colorTextoBoton);
    setEfectoVisual(preset.efectoVisual);
    setTipo(preset.tipo);
  };

  // Gestión de Página Destino (Solo páginas específicas para evitar popups invasivos)
  const standardPages = [
    { value: '/', label: 'Página de Inicio / Portada (/)' },
    { value: '/admision', label: 'Admisión (/admision)' },
    { value: '/descargas', label: 'Descargas y Documentos (/descargas)' },
    { value: '/contacto', label: 'Contacto (/contacto)' },
    { value: '/coordinaciones', label: 'Coordinaciones (/coordinaciones)' },
    { value: '/galeria', label: 'Galería de Fotos (/galeria)' },
    { value: '/journal', label: 'Journal y Noticias (/journal)' },
    { value: '/centro-de-padres', label: 'Centro de Padres (/centro-de-padres)' },
    { value: '/nuestra-historia', label: 'Nuestra Historia (/nuestra-historia)' },
  ];

  const rawDestino = (!data.paginaDestino || data.paginaDestino === 'todas') ? '/' : data.paginaDestino;
  const initialIsStandard = standardPages.some((p) => p.value === rawDestino) ||
    paginasDisponibles.some((p) => p.slug === rawDestino);

  const [selectorPagina, setSelectorPagina] = useState<string>(
    initialIsStandard ? rawDestino : 'custom'
  );
  const [rutaManual, setRutaManual] = useState<string>(
    initialIsStandard ? '' : rawDestino
  );

  const finalPaginaDestino = selectorPagina === 'custom' ? (rutaManual.trim() || '/') : selectorPagina;

  const predefinedColors = [
    { label: 'Blanco', value: '#ffffff' },
    { label: 'Negro', value: '#111827' },
    { label: 'Azul Acrópolis', value: '#4661F6' },
    { label: 'Azul Oscuro', value: '#283B6A' },
    { label: 'Amarillo', value: '#FFBC05' },
    { label: 'Cian', value: '#13C5B5' },
    { label: 'Fucsia', value: '#FF5289' },
  ];

  const titleSizes: Record<string, string> = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const badgeColors: Record<string, string> = {
    info: 'bg-azul-acropolis text-white',
    urgente: 'bg-red-500 text-white',
    matricula: 'bg-emerald-600 text-white',
    evento: 'bg-amber-500 text-white',
  };

  const badgeLabels: Record<string, string> = {
    info: 'Información',
    urgente: 'Urgente',
    matricula: 'Matrícula',
    evento: 'Evento',
  };

  const isUrgent = tipo === 'urgente';
  const isBanner = posicion.includes('banner');
  const previewCtaLabel = botonTexto.trim() || 'Ver más información';

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        formData.set('activo', activo.toString());
        formData.set('contenido', contenido);
        formData.set('paginaDestino', finalPaginaDestino);
        formData.set('colorTextoBoton', colorTextoBoton);
        formData.set('colorBoton', colorBoton);
        formData.set('colorFondo', colorFondo);
        formData.set('colorTexto', colorTexto);
        formData.set('efectoVisual', efectoVisual);
        await action(formData);
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* ==================================================== */}
        {/* COLUMNA IZQUIERDA: FORMULARIO DE CONFIGURACIÓN (7 cols) */}
        {/* ==================================================== */}
        <div className="space-y-8 lg:col-span-7">
          {/* SECCIÓN 1: CONTENIDO Y DESTINO */}
          <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-7">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-azul-soft text-azul-acropolis">
                <Layout size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-negro">Contenido y Destino</h3>
                <p className="text-xs text-gris-texto">Define el mensaje y en qué página se desplegará.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Título */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Título del Popup *
                </label>
                <input
                  name="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  maxLength={80}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                  placeholder="Ej: Suspensión de clases por lluvia"
                />
              </div>

              {/* Selector de Página Objetivo */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Página donde debe mostrarse *
                </label>
                <select
                  value={selectorPagina}
                  onChange={(e) => setSelectorPagina(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                >
                  <optgroup label="General e Institucionales">
                    {standardPages.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </optgroup>

                  {paginasDisponibles.length > 0 && (
                    <optgroup label="Páginas del Page Builder (CMS)">
                      {paginasDisponibles.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.titulo} ({p.slug})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  <option value="custom">Ruta personalizada manual...</option>
                </select>

                {selectorPagina === 'custom' && (
                  <div className="mt-2.5">
                    <label className="mb-1 block text-xs font-semibold text-gris-texto">
                      Ingresa la ruta exacta (ej: /noticias/admision-2026):
                    </label>
                    <input
                      type="text"
                      value={rutaManual}
                      onChange={(e) => setRutaManual(e.target.value)}
                      placeholder="/ruta-especifica"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20 font-mono"
                    />
                  </div>
                )}
                <p className="mt-1.5 text-xs text-gris-texto">
                  El popup solo aparecerá cuando el visitante ingrese a la ruta designada.
                </p>
              </div>

              {/* Contenido con RichTextEditor */}
              <div className="sm:col-span-2">
                <RichTextEditor
                  label="Contenido del Mensaje *"
                  value={contenido}
                  onChange={setContenido}
                  placeholder="Escriba el detalle del mensaje aquí..."
                  rows={4}
                />
              </div>

              {/* Botón CTA - Texto */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Texto del Botón CTA (Opcional)
                </label>
                <input
                  name="botonTexto"
                  value={botonTexto}
                  onChange={(e) => setBotonTexto(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                  placeholder="Ej: Ver más información"
                />
              </div>

              {/* Botón CTA - URL */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  URL del Botón CTA (Opcional)
                </label>
                <input
                  name="botonUrl"
                  type="text"
                  value={botonUrl}
                  onChange={(e) => setBotonUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                  placeholder="/admision o https://..."
                />
              </div>

              {/* Imagen del Popup */}
              <div className="sm:col-span-2">
                <ImageUploadSection
                  fieldName="imagenUrl"
                  label="Imagen / Afiche del Popup (Opcional)"
                  currentUrl={data.imagenUrl}
                  value={imagenUrl}
                  onChange={(url) => setImagenUrl(url)}
                  onPreviewChange={(preview) => setImagenUrl(preview)}
                  width={450}
                  height={700}
                  maxSize="500 KB"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: APARIENCIA Y ESTILO */}
          <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-7">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cian-soft text-cian">
                <Palette size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-negro">Apariencia y Colores</h3>
                <p className="text-xs text-gris-texto">Personaliza la presentación y garantiza legibilidad.</p>
              </div>
            </div>

            {/* Presets Temáticos en 1 Clic (Inspirados en Poptin) */}
            <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gris-texto">
                Paletas Temáticas en 1 Clic (Inspiradas en Poptin)
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {themePresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyThemePreset(preset)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-2.5 text-center transition-all hover:border-azul-acropolis hover:shadow-sm"
                  >
                    <div
                      className="flex h-5 w-full items-center justify-center rounded-lg gap-1.5 px-2 border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.colorFondo }}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: preset.colorBoton }} />
                      <span className="text-[10px] font-bold" style={{ color: preset.colorTexto }}>Aa</span>
                    </div>
                    <span className="text-xs font-semibold text-negro leading-tight">{preset.name}</span>
                    <span className="text-[10px] text-gris-texto leading-none">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Posición */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Posición en Pantalla *
                </label>
                <select
                  name="posicion"
                  value={posicion}
                  onChange={(e) => setPosicion(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                >
                  <option value="centro-modal">Modal Central (Para Urgencias y Afiches)</option>
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
                  value={estiloImagen}
                  onChange={(e) => setEstiloImagen(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                >
                  <option value="encabezado">Encabezado (Sobre el texto)</option>
                  <option value="solo-imagen">Solo Imagen (Afiche completo)</option>
                  <option value="fondo">Como Fondo (Cubre toda la tarjeta)</option>
                  <option value="oculta">Ocultar Imagen</option>
                </select>
              </div>

              {/* Tamaño del Título */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Tamaño del Título *
                </label>
                <select
                  name="tamanoTitulo"
                  value={tamanoTitulo}
                  onChange={(e) => setTamanoTitulo(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                >
                  <option value="sm">Pequeño</option>
                  <option value="md">Mediano (Normal)</option>
                  <option value="lg">Grande</option>
                  <option value="xl">Extra Grande</option>
                </select>
              </div>

              {/* Clasificación (Badge) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Clasificación (Badge) *
                </label>
                <select
                  name="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                >
                  <option value="info">Información</option>
                  <option value="urgente">Urgente</option>
                  <option value="matricula">Matrícula</option>
                  <option value="evento">Evento</option>
                </select>
              </div>

              {/* Color Fondo */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Color de Fondo de Tarjeta *
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={predefinedColors.find((c) => c.value === colorFondo) ? colorFondo : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setColorFondo(e.target.value);
                    }}
                    className="w-2/3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                  >
                    {predefinedColors.map((c) => (
                      <option key={`bg-${c.value}`} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                    <option value="custom">Personalizado...</option>
                  </select>
                  <input
                    type="color"
                    name="colorFondo"
                    value={colorFondo}
                    onChange={(e) => setColorFondo(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border-0 p-0 shadow-sm"
                    title="Elige un color personalizado"
                  />
                </div>
              </div>

              {/* Color Texto General */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Color de Texto Principal *
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={predefinedColors.find((c) => c.value === colorTexto) ? colorTexto : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setColorTexto(e.target.value);
                    }}
                    className="w-2/3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                  >
                    {predefinedColors.map((c) => (
                      <option key={`txt-${c.value}`} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                    <option value="custom">Personalizado...</option>
                  </select>
                  <input
                    type="color"
                    name="colorTexto"
                    value={colorTexto}
                    onChange={(e) => setColorTexto(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border-0 p-0 shadow-sm"
                    title="Elige un color personalizado"
                  />
                </div>
              </div>

              {/* Color Botón CTA */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Color de Fondo del Botón *
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={predefinedColors.find((c) => c.value === colorBoton) ? colorBoton : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setColorBoton(e.target.value);
                    }}
                    className="w-2/3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                  >
                    {predefinedColors.map((c) => (
                      <option key={`btn-${c.value}`} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                    <option value="custom">Personalizado...</option>
                  </select>
                  <input
                    type="color"
                    name="colorBoton"
                    value={colorBoton}
                    onChange={(e) => setColorBoton(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border-0 p-0 shadow-sm"
                    title="Elige un color personalizado"
                  />
                </div>
              </div>

              {/* Color Texto del Botón CTA */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Color del Texto del Botón *
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={predefinedColors.find((c) => c.value === colorTextoBoton) ? colorTextoBoton : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setColorTextoBoton(e.target.value);
                    }}
                    className="w-2/3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                  >
                    {predefinedColors.map((c) => (
                      <option key={`btn-txt-${c.value}`} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                    <option value="custom">Personalizado...</option>
                  </select>
                  <input
                    type="color"
                    name="colorTextoBoton"
                    value={colorTextoBoton}
                    onChange={(e) => setColorTextoBoton(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border-0 p-0 shadow-sm"
                    title="Elige un color personalizado"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gris-texto">
                  Define el contraste para que las letras sobre el botón se lean con total nitidez.
                </p>
              </div>

              {/* Efecto Ambiental Perimetral */}
              <div className="sm:col-span-2 pt-3 border-t border-gray-100">
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Efecto Ambiental Perimetral (Inspirado en Poptin) *
                </label>
                <select
                  name="efectoVisual"
                  value={efectoVisual}
                  onChange={(e) => setEfectoVisual(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                >
                  <option value="ninguno">Ninguno (Sobrio y formal)</option>
                  <option value="cascada_digital">Cascada Digital (Lluvia de 0 y 1 / Matrix tech)</option>
                  <option value="confeti">Confeti Festivo (Celebración, bienvenida o matrícula)</option>
                  <option value="halo_radiante">Halo Radiante Pulsante (Aura luminosa alrededor de la tarjeta)</option>
                </select>
                <p className="mt-1 text-xs text-gris-texto">
                  Agrega una animación envolvente perimetral que acompaña la aparición del popup para cautivar la atención.
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: REGLAS DE VISUALIZACIÓN */}
          <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-7">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amarillo-soft text-amarillo-hover">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-negro">Vigencia y Frecuencia</h3>
                <p className="text-xs text-gris-texto">Configura el calendario y repetición del mensaje.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Frecuencia */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Frecuencia de visualización *
                </label>
                <select
                  name="frecuencia"
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                >
                  <option value="una_vez">Solo una vez por usuario (Recomendado)</option>
                  <option value="una_vez_por_dia">Una vez al día por usuario</option>
                  <option value="siempre">Siempre (cada vez que visita la página)</option>
                </select>
              </div>

              {/* Prioridad */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-negro">
                  Prioridad (1-10, mayor gana) *
                </label>
                <input
                  name="prioridad"
                  type="number"
                  min={1}
                  max={10}
                  value={prioridad}
                  onChange={(e) => setPrioridad(parseInt(e.target.value, 10) || 5)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                />
              </div>

              {/* Fecha Inicio */}
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

              {/* Fecha Fin */}
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

              {/* Switch Activo */}
              <div className="sm:col-span-2 pt-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-azul-acropolis focus:ring-azul-acropolis"
                  />
                  <span className="text-sm font-semibold text-negro">
                    Popup Activo (Habilitado para mostrarse a los visitantes)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Guardando cambios...' : 'Guardar Popup'}
            </button>
            <Link
              href="/admin/popups"
              className="rounded-[var(--radius-button)] bg-gris-claro px-8 py-3.5 text-sm font-semibold text-negro transition-colors hover:bg-gray-200"
            >
              Cancelar
            </Link>
          </div>
        </div>

        {/* ==================================================== */}
        {/* COLUMNA DERECHA: VISTA PREVIA EN VIVO (5 cols) */}
        {/* ==================================================== */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] border border-gray-100">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-azul-acropolis" />
                <h3 className="text-sm font-bold text-negro">Vista Previa en Vivo</h3>
              </div>
              <span className="rounded-full bg-azul-soft px-2.5 py-0.5 text-[11px] font-mono font-semibold text-azul-acropolis">
                {finalPaginaDestino}
              </span>
            </div>

            {/* Simulación visual de navegador web */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
              {/* Barra de título del navegador simulado */}
              <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gris-texto">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[10px] text-gray-500 truncate">
                  colegioacropolis.net{finalPaginaDestino}
                </span>
              </div>

              {/* Área de renderizado del popup */}
              <div className="relative min-h-[400px] p-4 flex flex-col justify-center items-center bg-gray-200/60 overflow-hidden">
                {/* Fondo ficticio del sitio */}
                <div className="absolute inset-0 p-4 opacity-15 pointer-events-none text-xs text-gray-400 space-y-2 select-none">
                  <div className="h-4 bg-gray-400 rounded w-1/3" />
                  <div className="h-3 bg-gray-300 rounded w-full" />
                  <div className="h-3 bg-gray-300 rounded w-5/6" />
                  <div className="h-3 bg-gray-300 rounded w-4/6" />
                  <div className="h-20 bg-gray-300 rounded w-full mt-4" />
                </div>

                {/* Backdrop simulado para modales centrales con soporte de Efecto Ambiental */}
                {!isBanner && posicion === 'centro-modal' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0 pointer-events-none overflow-hidden">
                    <AmbientEffectLayer efectoVisual={efectoVisual} />
                  </div>
                )}

                {/* Renderizado interactivo según posición y estilo */}
                {isBanner ? (
                  <div
                    className="w-full rounded-xl p-3.5 shadow-lg border border-black/10 z-10 transition-all"
                    style={{
                      backgroundColor: colorFondo,
                      color: colorTexto,
                      boxShadow:
                        efectoVisual === 'halo_radiante'
                          ? '0 0 20px 3px rgba(70, 97, 246, 0.6), 0 0 40px 10px rgba(147, 51, 234, 0.4)'
                          : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        {isUrgent ? (
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                          </span>
                        ) : null}
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badgeColors[tipo] || badgeColors.info}`}>
                          {badgeLabels[tipo] || 'Aviso'}
                        </span>
                        <span className="font-bold truncate max-w-[150px]">{titulo || 'Título del Popup'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {botonUrl && (
                          <span
                            className="rounded-lg px-3 py-1 text-[11px] font-bold shadow-sm"
                            style={{ backgroundColor: colorBoton, color: colorTextoBoton }}
                          >
                            {previewCtaLabel}
                          </span>
                        )}
                        <span className="p-1 text-gray-400">
                          <X size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : estiloImagen === 'solo-imagen' ? (
                  /* Estilo: Solo Imagen (Afiche completo 1:1 con el sitio real) */
                  <div
                    className="w-full max-w-[320px] rounded-2xl shadow-2xl border border-black/5 z-10 overflow-hidden relative transition-all"
                    style={{
                      backgroundColor: colorFondo,
                      boxShadow:
                        efectoVisual === 'halo_radiante'
                          ? '0 0 25px 4px rgba(70, 97, 246, 0.65), 0 0 50px 14px rgba(147, 51, 234, 0.45)'
                          : undefined,
                    }}
                  >
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md shadow-md">
                      <X size={14} />
                    </span>

                    {imagenUrl ? (
                      <img
                        src={imagenUrl}
                        alt={titulo || 'Afiche'}
                        className="w-full h-auto object-contain max-h-[320px]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 text-gris-texto text-xs text-center border-2 border-dashed border-gray-300 rounded-xl m-3">
                        <Eye size={24} className="mb-2 text-gray-400" />
                        <span>Pega o sube un afiche para visualizar la vista previa completa</span>
                      </div>
                    )}

                    {botonUrl && (
                      <div className="p-3" style={{ backgroundColor: colorFondo }}>
                        <div
                          className="flex items-center justify-center gap-1.5 w-full rounded-xl py-2.5 text-center text-xs font-bold shadow-md transition-transform"
                          style={{
                            backgroundColor: colorBoton,
                            color: colorTextoBoton,
                          }}
                        >
                          <span>{previewCtaLabel}</span>
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Estilo Estándar (Encabezado, Fondo o Sin Imagen) */
                  <div
                    className="w-full max-w-[320px] rounded-2xl shadow-xl border border-black/5 z-10 overflow-hidden transition-all relative"
                    style={{
                      backgroundColor: estiloImagen !== 'fondo' ? colorFondo : undefined,
                      color: colorTexto,
                      boxShadow:
                        efectoVisual === 'halo_radiante'
                          ? '0 0 25px 4px rgba(70, 97, 246, 0.65), 0 0 50px 14px rgba(147, 51, 234, 0.45)'
                          : undefined,
                    }}
                  >
                    {/* Estilo Fondo */}
                    {estiloImagen === 'fondo' && imagenUrl && (
                      <div className="absolute inset-0 z-0">
                        <img src={imagenUrl} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0" style={{ backgroundColor: colorFondo, opacity: 0.85 }} />
                      </div>
                    )}

                    {/* Estilo Encabezado */}
                    {estiloImagen === 'encabezado' && imagenUrl && (
                      <div className="relative w-full max-h-36 overflow-hidden bg-black/5 flex items-center justify-center">
                        <img src={imagenUrl} alt="Preview" className="w-full object-contain max-h-36" />
                      </div>
                    )}

                    <div className="p-4 sm:p-5 relative z-10">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          {isUrgent ? (
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                            </span>
                          ) : null}
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColors[tipo] || badgeColors.info}`}>
                            {badgeLabels[tipo] || 'Aviso'}
                          </span>
                        </div>
                        <span className="rounded-full bg-black/5 p-1 text-gray-400">
                          <X size={14} />
                        </span>
                      </div>

                      <h4 className={`${titleSizes[tamanoTitulo] || titleSizes.md} font-bold leading-tight mb-2`}>
                        {titulo || 'Título del Popup'}
                      </h4>

                      <div
                        className="text-xs leading-relaxed opacity-85 max-h-28 overflow-y-auto mb-3 [&_p]:mb-1 [&_strong]:font-bold"
                        dangerouslySetInnerHTML={{ __html: contenido || '<p>Contenido del mensaje...</p>' }}
                      />

                      {/* Botón CTA con alto contraste */}
                      {botonUrl && (
                        <div
                          className="flex items-center justify-center gap-1.5 w-full rounded-xl py-2.5 text-center text-xs font-bold shadow-sm transition-transform"
                          style={{
                            backgroundColor: colorBoton,
                            color: colorTextoBoton,
                          }}
                        >
                          <span>{previewCtaLabel}</span>
                          <ArrowRight size={13} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resumen de configuración del popup */}
            <div className="mt-4 rounded-xl bg-gray-50 p-3.5 text-xs text-gris-texto space-y-1.5 border border-gray-100">
              <div className="flex justify-between">
                <span>Destino:</span>
                <strong className="text-negro font-mono">{finalPaginaDestino}</strong>
              </div>
              <div className="flex justify-between">
                <span>Posición:</span>
                <strong className="text-negro capitalize">{posicion.replace('-', ' ')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Frecuencia:</span>
                <strong className="text-negro capitalize">{frecuencia.replace(/_/g, ' ')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Efecto Ambiental:</span>
                <strong className="text-negro capitalize">{efectoVisual.replace(/_/g, ' ')}</strong>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                <span>Muestra de Botón:</span>
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-bold"
                  style={{ backgroundColor: colorBoton, color: colorTextoBoton }}
                >
                  Texto Botón
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
