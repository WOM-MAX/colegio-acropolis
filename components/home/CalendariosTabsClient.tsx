'use client';

import { useState } from 'react';
import { CalendarRange, ExternalLink, GraduationCap, BookOpen, Baby, FileText, CheckCircle2 } from 'lucide-react';

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
  headerBg: string;
  headerGradient: string;
  tabActiveGradient: string;
  badgeBg: string;
  glowColor: string;
  cardBorderAccent: string;
  bannerBadge: string;
}> = {
  'Educación Parvularia': {
    icon: Baby,
    accentColor: 'text-amber-600',
    headerBg: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700',
    headerGradient: 'from-amber-500 to-amber-700',
    tabActiveGradient: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-[0_4px_16px_rgba(245,158,11,0.4)]',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    glowColor: 'bg-amber-500/10',
    cardBorderAccent: 'border-t-4 border-t-amber-500',
    bannerBadge: 'Iniciación y Parvularia',
  },
  'Enseñanza Básica': {
    icon: BookOpen,
    accentColor: 'text-fucsia',
    headerBg: 'bg-gradient-to-r from-[#FF5289] via-[#E63F73] to-[#B81D5B]',
    headerGradient: 'from-fucsia to-[#B81D5B]',
    tabActiveGradient: 'bg-gradient-to-r from-[#FF5289] to-[#D81B60] text-white shadow-[0_4px_16px_rgba(255,82,137,0.4)]',
    badgeBg: 'bg-pink-100 text-pink-900 border-pink-300',
    glowColor: 'bg-fucsia/10',
    cardBorderAccent: 'border-t-4 border-t-[#FF5289]',
    bannerBadge: '1° Básico a 8° Básico',
  },
  'Enseñanza Media': {
    icon: GraduationCap,
    accentColor: 'text-azul-acropolis',
    headerBg: 'bg-gradient-to-r from-azul-acropolis via-[#3548C8] to-[#1E2E80]',
    headerGradient: 'from-azul-acropolis to-[#1E2E80]',
    tabActiveGradient: 'bg-gradient-to-r from-azul-acropolis to-[#3548C8] text-white shadow-[0_4px_16px_rgba(70,97,246,0.4)]',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    glowColor: 'bg-azul-acropolis/10',
    cardBorderAccent: 'border-t-4 border-t-azul-acropolis',
    bannerBadge: '1° Medio a 4° Medio',
  },
};

export default function CalendariosTabsClient({ grupos }: { grupos: CicloGroup[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const activeGroup = grupos[activeTab] || grupos[0];
  const config = cicloConfig[activeGroup.nombre] || cicloConfig['Enseñanza Media'];
  const IconComponent = config.icon;

  return (
    <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      {/* Elementos de luz ambiental 3D */}
      <div className={`absolute top-16 right-0 w-96 h-96 rounded-full ${config.glowColor} blur-3xl pointer-events-none transition-colors duration-700`} />
      <div className="absolute bottom-12 left-0 w-96 h-96 rounded-full bg-azul-acropolis/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header de Sección con Tamaño Estandarizado */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200/90 px-4 py-1.5 shadow-2xs mb-3.5">
            <CalendarRange size={14} className="text-azul-acropolis" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-azul-acropolis">
              Coordinación Académica
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-negro leading-tight">
            Calendarios de <span className="text-azul-acropolis">Evaluaciones</span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-gris-texto max-w-xl mx-auto leading-relaxed">
            Accede a la programación detallada de exámenes, trabajos y fechas importantes para cada nivel educativo.
          </p>
        </div>

        {/* Tabs de Navegación 3D Responsivas */}
        <div className="flex justify-center mb-8 sm:mb-10 px-0 sm:px-2">
          <div className="flex w-full sm:w-auto max-w-full sm:max-w-none overflow-x-auto justify-start sm:justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] scrollbar-hide">
            {grupos.map((grupo, index) => {
              const tabConfig = cicloConfig[grupo.nombre] || cicloConfig['Enseñanza Media'];
              const TabIcon = tabConfig.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={grupo.nombre}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-center shrink-0 sm:shrink gap-2 sm:gap-2.5 rounded-xl px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? `${tabConfig.tabActiveGradient} scale-[1.02] -translate-y-0.5`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <TabIcon size={15} className="shrink-0" />
                  <span className="hidden md:inline">{grupo.nombre}</span>
                  <span className="md:hidden">
                    {grupo.nombre === 'Educación Parvularia' ? 'Parvularia' :
                     grupo.nombre === 'Enseñanza Básica' ? 'Básica' : 'Media'}
                  </span>
                  <span className={`ml-0.5 sm:ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold ${
                    isActive ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {grupo.cursos.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master Container 3D con Alto Contraste */}
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl sm:rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,32,96,0.09),0_4px_16px_rgba(0,0,0,0.04)] border border-slate-200/90 overflow-hidden transition-all duration-500">
            
            {/* Cabecera Vibrante 3D del Ciclo */}
            <div className={`${config.headerBg} p-5 sm:p-8 text-white relative overflow-hidden transition-all duration-500`}>
              {/* Luces decorativas en cabecera */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 left-1/3 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Icono con Efecto Glassmorphism 3D */}
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 shadow-lg shrink-0">
                    <IconComponent size={24} className="text-white drop-shadow-sm sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs leading-snug">
                      {activeGroup.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 mt-0.5 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="text-white/80 shrink-0" />
                      <span>{activeGroup.cursos.length} curso{activeGroup.cursos.length !== 1 ? 's' : ''} disponibles</span>
                    </p>
                  </div>
                </div>

                {/* Badge de Nivel */}
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white self-start sm:self-auto">
                  <FileText size={12} className="text-white/80" />
                  <span>{config.bannerBadge}</span>
                </div>
              </div>
            </div>

            {/* Bandeja de Cursos con Fondo Slate de Alto Contraste */}
            <div className="p-4 sm:p-8 sm:py-10 bg-[#F1F4F9] border-t border-slate-200/50">
              
              {/* Si hay 1 o 2 cursos (ej. Parvularia), diseño destacado */}
              {activeGroup.cursos.length <= 2 ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-full max-w-lg">
                    {activeGroup.cursos.map((cal) => (
                      <FeaturedCourseCard
                        key={cal.id}
                        cal={cal}
                        cicloNombre={activeGroup.nombre}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Grilla de Cursos 3D (3 columnas en desktop) */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeGroup.cursos.map((cal) => (
                    <CourseCard
                      key={cal.id}
                      cal={cal}
                      cicloNombre={activeGroup.nombre}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Tarjeta de Curso 3D con Alto Relieve ── */
function CourseCard({ cal, cicloNombre }: { cal: CalItem; cicloNombre: string }) {
  const config = cicloConfig[cicloNombre] || cicloConfig['Enseñanza Media'];

  return (
    <a
      href={cal.enlace || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col justify-between rounded-2xl bg-white p-4.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,32,96,0.12),0_4px_12px_rgba(0,0,0,0.04)] hover:border-azul-acropolis/40 ${config.cardBorderAccent}`}
    >
      {/* Cabecera de la tarjeta: Icono + Nombre */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs group-hover:scale-105 group-hover:bg-azul-soft group-hover:border-azul-acropolis/30 transition-all duration-300">
            <CalendarRange size={18} className="text-azul-acropolis" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-[15px] text-slate-900 group-hover:text-azul-acropolis transition-colors leading-snug">
              {cal.curso}
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Calendario Oficial</span>
          </div>
        </div>
      </div>

      {/* Pie de la tarjeta: Botón de acción */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-azul-acropolis">
        <span>Ver evaluaciones</span>
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-azul-soft group-hover:bg-azul-acropolis group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
          <ExternalLink size={12} />
        </div>
      </div>
    </a>
  );
}

/* ── Tarjeta Destacada para Nivel Parvularia (1 o 2 cursos) ── */
function FeaturedCourseCard({ cal, cicloNombre }: { cal: CalItem; cicloNombre: string }) {
  const config = cicloConfig[cicloNombre] || cicloConfig['Educación Parvularia'];

  return (
    <a
      href={cal.enlace || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(245,158,11,0.18)] hover:border-amber-400 ${config.cardBorderAccent}`}
    >
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 shadow-sm group-hover:scale-105 group-hover:bg-amber-100 transition-all duration-300 mx-auto sm:mx-0">
          <Baby size={28} className="text-amber-600" />
        </div>
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider mb-1">
            Nivel Parvulario
          </span>
          <h4 className="font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors leading-tight">
            {cal.curso}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de hitos, evaluaciones formativas y fechas oficiales
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md group-hover:bg-amber-600 group-hover:shadow-lg transition-all duration-300 shrink-0 group-hover:scale-105">
        <span>Abrir Calendario</span>
        <ExternalLink size={13} />
      </div>
    </a>
  );
}


