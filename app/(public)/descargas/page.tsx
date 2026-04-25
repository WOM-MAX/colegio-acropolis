export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { descargas } from '@/lib/db/schema';
import { FileText, BookOpen, Clock, Shield, Download } from 'lucide-react';

const categoriaConfig: Record<string, { icon: React.ReactNode; gradient: string; iconBg: string }> = {
  'Útiles Escolares': {
    icon: <BookOpen size={28} strokeWidth={1.8} />,
    gradient: 'from-blue-500 to-blue-700',
    iconBg: 'bg-blue-50 text-blue-600',
  },
  'Horarios': {
    icon: <Clock size={28} strokeWidth={1.8} />,
    gradient: 'from-teal-500 to-teal-700',
    iconBg: 'bg-teal-50 text-teal-600',
  },
  'RIE': {
    icon: <FileText size={28} strokeWidth={1.8} />,
    gradient: 'from-pink-500 to-pink-700',
    iconBg: 'bg-pink-50 text-pink-600',
  },
  'Reglamento Interno': {
    icon: <Shield size={28} strokeWidth={1.8} />,
    gradient: 'from-amber-500 to-amber-700',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  'Reglamento de Evaluación': {
    icon: <FileText size={28} strokeWidth={1.8} />,
    gradient: 'from-violet-500 to-violet-700',
    iconBg: 'bg-violet-50 text-violet-600',
  },
};

const defaultConfig = {
  icon: <FileText size={28} strokeWidth={1.8} />,
  gradient: 'from-gray-500 to-gray-700',
  iconBg: 'bg-gray-50 text-gray-600',
};

export const metadata = {
  title: 'Descargas y Documentos',
  description: 'Descarga reglamentos, horarios, y listas de útiles.',
};

const placeholderDocs = [
  { id: 1, nombre: 'Lista de Útiles 2026', categoria: 'Útiles Escolares', archivoUrl: '#' },
  { id: 2, nombre: 'Horarios 1er Semestre', categoria: 'Horarios', archivoUrl: '#' },
  { id: 3, nombre: 'Reglamento Interno', categoria: 'Reglamento Interno', archivoUrl: '#' },
  { id: 4, nombre: 'Reglamento de Evaluación', categoria: 'Reglamento de Evaluación', archivoUrl: '#' },
];

export default async function DescargasPage() {
  let docs: typeof placeholderDocs = [];

  try {
    const result = await db.select().from(descargas);
    docs = result.map(d => ({
      id: d.id,
      nombre: d.nombre,
      categoria: d.categoria,
      archivoUrl: d.archivoUrl,
    }));
  } catch (error) {
    console.error('Error al obtener descargas:', error);
    docs = placeholderDocs;
  }

  if (docs.length === 0) {
    docs = placeholderDocs;
  }

  return (
    <div className="bg-white py-16 px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight text-negro sm:text-5xl">
            Documentos y <span className="text-cian">Descargas</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gris-texto">
            Todos los recursos institucionales oficiales a tu alcance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((doc) => {
            const cfg = categoriaConfig[doc.categoria] || defaultConfig;

            return (
              <div
                key={doc.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient}`} />
                <div className="flex flex-1 flex-col items-center p-6 text-center">
                  <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${cfg.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    {cfg.icon}
                  </div>
                  <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gris-texto/60">
                    {doc.categoria}
                  </span>
                  <h3 className="mb-4 text-sm font-bold leading-snug text-negro">
                    {doc.nombre}
                  </h3>
                </div>
                <a
                  href={doc.archivoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.gradient} px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90`}
                >
                  <Download size={14} />
                  Descargar PDF
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
