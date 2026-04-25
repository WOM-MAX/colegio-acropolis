import { db } from '@/lib/db';
import { descargas, descargasCategorias } from '@/lib/db/schema';
import { Download } from 'lucide-react';

const colorConfig: Record<string, { bg: string; badgeText: string; badgeBg: string; buttonHover: string }> = {
  azul: { bg: 'bg-azul-acropolis', badgeText: 'text-azul-acropolis', badgeBg: 'bg-azul-acropolis/10', buttonHover: 'hover:bg-azul-hover' },
  cian: { bg: 'bg-cian', badgeText: 'text-cian', badgeBg: 'bg-cian/10', buttonHover: 'hover:opacity-90' },
  fucsia: { bg: 'bg-fucsia', badgeText: 'text-fucsia', badgeBg: 'bg-fucsia/10', buttonHover: 'hover:opacity-90' },
  amarillo: { bg: 'bg-amarillo', badgeText: 'text-amarillo', badgeBg: 'bg-amarillo/20', buttonHover: 'hover:bg-amarillo-brillante' },
};

const defaultConfig = colorConfig['azul'];

// Placeholder data for when DB is unavailable or empty
const placeholderDocs = [
  { id: 1, nombre: 'Lista de Útiles 2026', categoria: 'Útiles Escolares', archivoUrl: '#', imagenUrl: 'https://images.unsplash.com/photo-1456730602324-6048d08cb52c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', colorAcento: 'azul' },
  { id: 2, nombre: 'Horarios 1er Semestre', categoria: 'Horarios', archivoUrl: '#', imagenUrl: 'https://images.unsplash.com/photo-1506784951209-4bf743b5e40e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', colorAcento: 'cian' },
  { id: 3, nombre: 'Reglamento Interno', categoria: 'Reglamento Interno', archivoUrl: '#', imagenUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', colorAcento: 'fucsia' },
  { id: 4, nombre: 'Reglamento de Evaluación', categoria: 'Reglamento de Evaluación', archivoUrl: '#', imagenUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', colorAcento: 'amarillo' },
];

export default async function DownloadsGrid() {
  let docs: typeof placeholderDocs = [];
  let usingPlaceholder = false;

  try {
    const categories = await db.select().from(descargasCategorias);
    const catMap = Object.fromEntries(categories.map(c => [c.id.toString(), c.nombre]));

    const results = await db
      .select({
        id: descargas.id,
        nombre: descargas.nombre,
        categoria: descargas.categoria,
        archivoUrl: descargas.archivoUrl,
        imagenUrl: descargas.imagenUrl,
        colorAcento: descargas.colorAcento,
      })
      .from(descargas);
    
    docs = results.map(doc => ({
      ...doc,
      categoria: catMap[doc.categoria] || doc.categoria,
      imagenUrl: doc.imagenUrl || null,
      colorAcento: doc.colorAcento || 'azul',
    })) as typeof placeholderDocs;
  } catch (error) {
    console.error('Error al obtener descargas:', error);
    docs = placeholderDocs;
    usingPlaceholder = true;
  }

  if (docs.length === 0) {
    docs = placeholderDocs;
    usingPlaceholder = true;
  }

  return (
    <section id="descargas" className="bg-white py-16 px-6 relative z-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-negro">
            Documentos y Descargas
          </h2>
          <p className="mt-2 text-gris-texto">
            Recursos importantes para nuestra comunidad escolar
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((doc) => {
            const cfg = colorConfig[doc.colorAcento] || defaultConfig;
            const fallbackImage = 'https://images.unsplash.com/photo-1546410531-ea4cea477149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={doc.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-card)] ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                {/* Responsive Cover Image */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
                  <img 
                    src={doc.imagenUrl || fallbackImage} 
                    alt={`Portada de ${doc.nombre}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle overlay to make it look premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="flex flex-1 flex-col p-6 pt-5">
                  {/* Category Badge */}
                  <div className="mb-3 flex">
                    <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cfg.badgeBg} ${cfg.badgeText}`}>
                      {doc.categoria.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Document Name */}
                  <h3 className="mb-6 flex-1 text-[15px] font-medium leading-snug text-negro group-hover:underline decoration-1 underline-offset-4 decoration-gray-200">
                    {doc.nombre}
                  </h3>

                  {/* Download Pill Button */}
                  <a
                    href={usingPlaceholder ? '#' : doc.archivoUrl}
                    download={!usingPlaceholder}
                    className={`flex w-full items-center justify-center gap-2 rounded-full ${cfg.bg} px-4 py-3 text-sm font-bold text-white transition-all ${cfg.buttonHover}`}
                  >
                    <Download size={16} strokeWidth={2.5} />
                    Descargar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
