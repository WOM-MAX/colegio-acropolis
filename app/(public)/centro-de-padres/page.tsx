export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { centroPadresDirectiva } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { Mail, Users } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { enforcePageActive } from '@/lib/utils/page-guard';

export const metadata = {
  title: 'Centro de Padres',
  description: 'Directiva oficial del Centro de Padres escolar.',
};

const placeholderData: { id: number; nombre: string; cargo: string; fotoUrl: string | null; email: string | null; periodo: string | null; orden: number }[] = [
  { id: 1, nombre: 'Marcia González', cargo: 'Presidenta', fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', email: null, periodo: '2026', orden: 1 },
  { id: 2, nombre: 'Javier Soto', cargo: 'Secretario', fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', email: null, periodo: '2026', orden: 2 },
  { id: 3, nombre: 'Valeria M.', cargo: 'Tesorera', fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop', email: null, periodo: '2026', orden: 3 },
  { id: 4, nombre: 'Luis F.', cargo: 'Delegado General', fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', email: null, periodo: '2026', orden: 4 },
];

export default async function CentroPadresPage() {
  await enforcePageActive('/centro-de-padres');
  let directiva: typeof placeholderData = [];

  try {
    const result = await db.select().from(centroPadresDirectiva).orderBy(asc(centroPadresDirectiva.orden));
    directiva = result.map(m => ({
      id: m.id,
      nombre: m.nombre,
      cargo: m.cargo,
      fotoUrl: m.fotoUrl,
      email: m.email,
      periodo: m.periodo,
      orden: m.orden,
    }));
  } catch (error) {
    console.error('Error al obtener directiva:', error);
    directiva = placeholderData;
  }

  if (directiva.length === 0) {
    directiva = placeholderData;
  }

  return (
    <>
      <PageHero 
        title="Centro de" 
        highlight="Padres (CEPA)" 
        description="Te presentamos a la mesa directiva actual. Juntos trabajamos para construir la mejor comunidad para nuestras familias."
      />
      <div className="bg-white py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {directiva.map((miembro) => (
            <div 
              key={miembro.id}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full border-4 border-fucsia-soft bg-gris-claro">
                {miembro.fotoUrl ? (
                  <img 
                    src={miembro.fotoUrl} 
                    alt={miembro.nombre} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-3xl font-bold text-gray-400">
                    {miembro.nombre.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <span className="mb-2 inline-block rounded-full bg-fucsia-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-fucsia">
                  {miembro.cargo}
                </span>
                <h3 className="mb-1 text-lg font-bold text-negro">{miembro.nombre}</h3>
                {miembro.periodo && (
                  <p className="mb-4 text-xs font-medium text-gris-texto">Período {miembro.periodo}</p>
                )}
                
                {miembro.email && (
                  <a 
                    href={`mailto:${miembro.email}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gris-claro px-4 py-2 text-sm font-medium text-gris-texto transition-colors hover:bg-negro hover:text-white"
                  >
                    <Mail size={14} />
                    Contacto
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
