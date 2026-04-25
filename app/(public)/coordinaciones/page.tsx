export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { coordinaciones } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import PageHero from '@/components/ui/PageHero';

export const metadata = {
  title: 'Coordinaciones Institucionales',
  description: 'Conoce al equipo de coordinación académica y convivencia de Colegio Acrópolis.',
};

type CoordinacionPublic = {
  id: number;
  nombreUnidad: string;
  encargada: string;
  tituloProfesional: string | null;
  resenaProfesional: string | null;
  correoInstitucional: string | null;
  fotoUrl: string | null;
  funciones: string;
  orden: number;
};

const placeholderData: CoordinacionPublic[] = [
  { id: 1, nombreUnidad: 'Coordinación Académica', encargada: 'María José G.', tituloProfesional: 'Magíster en Educación', resenaProfesional: 'Amplia experiencia en desarrollo curricular y liderazgo educativo. Ha trabajado por más de 15 años impulsando la calidad educativa.', correoInstitucional: 'academica@colegioacropolis.cl', fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', funciones: 'Supervisión curricular, planificación de clases y evaluación de aprendizajes.', orden: 1 },
  { id: 2, nombreUnidad: 'Coordinación de Convivencia', encargada: 'Carlos A.', tituloProfesional: 'Psicólogo Educacional', resenaProfesional: 'Especialista en clima escolar y mediación de conflictos. Comprometido con el bienestar socioemocional de toda la comunidad estudiantil.', correoInstitucional: 'convivencia@colegioacropolis.cl', fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop', funciones: 'Promoción del buen trato, mediación escolar y prevención de conflictos.', orden: 2 },
  { id: 3, nombreUnidad: 'Coordinación Extraescolar', encargada: 'Ana Silva', tituloProfesional: 'Profesora de Educación Física', resenaProfesional: 'Coordinadora de programas deportivos y artísticos con enfoque en el desarrollo integral y trabajo en equipo.', correoInstitucional: null, fotoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=600&auto=format&fit=crop', funciones: 'Talleres, actividades deportivas, artísticas y recreativas del colegio.', orden: 3 },
];

export default async function CoordinacionesPage() {
  let coordinadores: CoordinacionPublic[] = [];

  try {
    const result = await db.select().from(coordinaciones).orderBy(asc(coordinaciones.orden));
    coordinadores = result.map(c => ({
      id: c.id,
      nombreUnidad: c.nombreUnidad,
      encargada: c.encargada,
      tituloProfesional: c.tituloProfesional,
      resenaProfesional: c.resenaProfesional,
      correoInstitucional: c.correoInstitucional,
      fotoUrl: c.fotoUrl,
      funciones: c.funciones,
      orden: c.orden,
    }));
  } catch (error) {
    console.error('Error al obtener coordinaciones:', error);
    coordinadores = placeholderData;
  }

  if (coordinadores.length === 0) {
    coordinadores = placeholderData;
  }

  return (
    <>
      <PageHero 
        title="Coordinaciones" 
        highlight="Institucionales" 
        description="Nuestro equipo de liderazgo y coordinación está dedicado a brindar la mejor experiencia educativa y formativa para todos nuestros estudiantes."
      />
      <div className="bg-white py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-20">
            {coordinadores.map((coord, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={coord.id}
                  className={`flex flex-col gap-8 lg:gap-16 lg:items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Contenedor de Imagen */}
                  <div className="w-full sm:w-3/4 sm:mx-auto md:w-1/2 lg:w-1/3 lg:mx-0 shrink-0">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-md border border-gray-100">
                      {coord.fotoUrl ? (
                        <img 
                          src={coord.fotoUrl} 
                          alt={coord.encargada} 
                          className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-azul-acropolis">
                          {/* Luces sutiles de fondo (Mesh/Glow effect) */}
                          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amarillo/20 blur-3xl"></div>
                          
                          {/* Monograma estilo Glassmorphism */}
                          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-2xl backdrop-blur-md">
                            <span className="text-5xl font-light text-white">
                              {coord.encargada.charAt(0)}
                            </span>
                          </div>
                          
                          {/* Detalle decorativo en la base */}
                          <div className="absolute bottom-8 flex flex-col items-center gap-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amarillo to-transparent opacity-70"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                              Colegio Acrópolis
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  {/* Contenido */}
                  <div className="w-full lg:w-2/3 space-y-5">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-amarillo mb-1.5">
                        {coord.nombreUnidad}
                      </p>
                      <h2 className="text-2xl font-bold text-azul-acropolis md:text-3xl">
                        {coord.encargada}
                      </h2>
                      {coord.tituloProfesional && (
                        <p className="mt-2 text-lg font-medium text-gris-oscuro">
                          {coord.tituloProfesional}
                        </p>
                      )}
                    </div>
                    
                    {coord.resenaProfesional && (
                      <div className="prose prose-base text-gris-texto">
                        <p className="leading-relaxed">{coord.resenaProfesional}</p>
                      </div>
                    )}

                    <div className="bg-gris-claro/50 rounded-2xl p-5 border border-gray-100 mt-2">
                      <h3 className="text-base font-bold text-negro mb-2">Funciones Principales</h3>
                      <p className="text-sm leading-relaxed text-gris-texto whitespace-pre-wrap">
                        {coord.funciones}
                      </p>
                    </div>

                    {coord.correoInstitucional && (
                      <div className="pt-2">
                        <a
                          href={`mailto:${coord.correoInstitucional}`}
                          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-cian-soft px-6 py-3 text-base font-semibold text-cian transition-all duration-300 hover:bg-cian hover:text-white hover:shadow-lg hover:-translate-y-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                            <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                            <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                          </svg>
                          Contactar a {coord.encargada.split(' ')[0]}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
