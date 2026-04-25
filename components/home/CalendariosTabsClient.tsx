'use client';

import { useState } from 'react';
import { CalendarRange, ExternalLink, GraduationCap, BookOpen, Baby } from 'lucide-react';

interface CalItem {
  id: number;
  curso: string;
  enlace: string | null;
  ciclo: string;
}

interface CicloGroup {
  nombre: string;
  cursos: CalItem[];
}

const cicloConfig: Record<string, {
  icon: typeof GraduationCap;
  accentColor: string;
  accentBg: string;
  accentSoft: string;
  accentBorder: string;
}> = {
  'Educación Parvularia': {
    icon: Baby,
    accentColor: 'text-amarillo-hover',
    accentBg: 'bg-amarillo',
    accentSoft: 'bg-amarillo-soft',
    accentBorder: 'border-amarillo/20',
  },
  'Enseñanza Básica': {
    icon: BookOpen,
    accentColor: 'text-fucsia-hover',
    accentBg: 'bg-fucsia',
    accentSoft: 'bg-fucsia-soft',
    accentBorder: 'border-fucsia/20',
  },
  'Enseñanza Media': {
    icon: GraduationCap,
    accentColor: 'text-azul-acropolis',
    accentBg: 'bg-azul-acropolis',
    accentSoft: 'bg-azul-soft',
    accentBorder: 'border-azul-acropolis/20',
  },
};

export default function CalendariosTabsClient({ grupos }: { grupos: CicloGroup[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const activeGroup = grupos[activeTab];
  const config = cicloConfig[activeGroup.nombre] || cicloConfig['Enseñanza Media'];
  const IconComponent = config.icon;

  return (
    <section className="relative overflow-hidden">
      {/* ── Wave divider: white → gris-claro ── */}
      <div className="bg-white">
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-auto text-gris-claro"
          preserveAspectRatio="none"
        >
          <path
            d="M0 24C240 56 480 56 720 40C960 24 1200 0 1440 8V56H0V24Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── Main content area ── */}
      <div className="bg-gris-claro pt-12 pb-16 lg:pt-16 lg:pb-24 relative">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-azul-soft/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-amarillo-soft/30 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            {/* Decorative line with badge centered */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-sm ring-1 ring-gray-100">
                <CalendarRange size={16} className="text-azul-acropolis" />
                <span className="text-xs font-bold uppercase tracking-widest text-azul-acropolis">
                  Coordinación Académica
                </span>
              </div>
            </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-negro leading-tight">
            Calendarios de{' '}
            <span className="text-azul-acropolis">Evaluaciones</span>
          </h2>
          <p className="mt-4 text-lg text-gris-texto max-w-2xl mx-auto leading-relaxed text-pretty">
            Accede a la programación detallada de exámenes, trabajos y fechas importantes para cada nivel educativo.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-10 px-4">
          <div className="flex w-full max-w-lg overflow-x-auto rounded-2xl bg-white p-1.5 shadow-[var(--shadow-card)] ring-1 ring-gray-100 scrollbar-hide sm:inline-flex sm:w-auto sm:overflow-visible">
            {grupos.map((grupo, index) => {
              const tabConfig = cicloConfig[grupo.nombre] || cicloConfig['Enseñanza Media'];
              const TabIcon = tabConfig.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={grupo.nombre}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? `${tabConfig.accentBg} text-white shadow-md`
                      : 'text-gris-texto hover:text-negro hover:bg-gray-50'
                  }`}
                >
                  <TabIcon size={16} />
                  <span className="hidden sm:inline">{grupo.nombre}</span>
                  <span className="sm:hidden">
                    {grupo.nombre === 'Educación Parvularia' ? 'Parvularia' :
                     grupo.nombre === 'Enseñanza Básica' ? 'Básica' : 'Media'}
                  </span>
                  {isActive && (
                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold">
                      {grupo.cursos.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white shadow-[var(--shadow-card)] ring-1 ring-gray-100 overflow-hidden">
            {/* Content Header */}
            <div className={`px-8 py-6 ${config.accentSoft} border-b ${config.accentBorder}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <IconComponent size={24} className={config.accentColor} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-negro">{activeGroup.nombre}</h3>
                  <p className="text-sm text-gris-texto">
                    {activeGroup.cursos.length} curso{activeGroup.cursos.length !== 1 ? 's' : ''} disponible{activeGroup.cursos.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeGroup.cursos.map((cal) => (
                  <CourseCard
                    key={cal.id}
                    cal={cal}
                    cicloNombre={activeGroup.nombre}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ── Wave divider bottom: gris-claro → white ── */}
      <div className="bg-gris-claro">
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-auto text-white"
          preserveAspectRatio="none"
          style={{ transform: 'scaleX(-1)' }}
        >
          <path
            d="M0 24C240 56 480 56 720 40C960 24 1200 0 1440 8V56H0V24Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}

/* ── Subcomponent for each course card with proper hover ── */
function CourseCard({ cal, cicloNombre }: { cal: CalItem; cicloNombre: string }) {
  const [hovered, setHovered] = useState(false);
  const config = cicloConfig[cicloNombre] || cicloConfig['Enseñanza Media'];

  return (
    <a
      href={cal.enlace || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-4 shadow-sm transition-all duration-300 ${
        hovered
          ? '-translate-y-0.5 shadow-md border-gray-200 ring-1 ring-gray-200/50'
          : 'border-gray-100'
      }`}
    >
      {/* Left: icon + name */}
      <div className="flex items-center gap-3.5">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.accentSoft} transition-all duration-300 ${hovered ? 'scale-105' : ''}`}>
          <CalendarRange size={18} className={`${config.accentColor} transition-colors`} />
        </div>
        <span className="font-semibold text-sm text-negro transition-colors">
          {cal.curso}
        </span>
      </div>

      {/* Right: arrow */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
        hovered ? `${config.accentBg} text-white` : config.accentSoft
      }`}>
        <ExternalLink size={14} className={`transition-all duration-300 ${
          hovered ? 'text-white' : config.accentColor
        }`} />
      </div>
    </a>
  );
}
