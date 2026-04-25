import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { journal, journalCategorias, journalAutores } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { truncate, formatDateShort } from '@/lib/utils';
import { Newspaper, User } from 'lucide-react';

const categoriaBadgeColors: Record<string, string> = {
  Dirección: 'bg-azul-soft text-azul-acropolis',
  Académico: 'bg-cian-soft text-cian',
  Convivencia: 'bg-fucsia-soft text-fucsia',
  Extraescolar: 'bg-amarillo-soft text-amarillo-hover',
  General: 'bg-gris-claro text-gris-texto',
};

// Placeholder data for when DB is unavailable
const placeholderArticulos = [
  { id: 1, titulo: 'Ceremonia de Reconocimiento al Mérito Académico Primer Semestre', slug: 'reconocimiento-academico', categoria: 'Académico', extracto: 'Felicitamos a todos nuestros estudiantes que han destacado por su esfuerzo y dedicación.', imagenUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop', createdAt: new Date() },
  { id: 2, titulo: 'Inauguración de Nuevos Espacios de Convivencia Escolar', slug: 'nuevos-espacios', categoria: 'Convivencia', extracto: 'Con mucho orgullo presentamos las nuevas áreas recreativas diseñadas para el bienestar estudiantil.', imagenUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop', createdAt: new Date() },
  { id: 3, titulo: 'Destacada Participación en Torneo Comunal de Debates', slug: 'torneo-debates', categoria: 'Extraescolar', extracto: 'Nuestros representantes de Enseñanza Media obtuvieron el segundo lugar en la comuna de Puente Alto.', imagenUrl: 'https://images.unsplash.com/photo-1546410531-ea4cea477149?q=80&w=800&auto=format&fit=crop', createdAt: new Date() },
];

export default async function JournalGrid() {
  let articulos: {
    id: number;
    titulo: string;
    slug: string;
    categoria: string;
    extracto: string;
    imagenUrl: string | null;
    createdAt: Date;
  }[] = [];

  let usingPlaceholder = false;

  try {
    articulos = await db
      .select({
        id: journal.id,
        titulo: journal.titulo,
        slug: journal.slug,
        categoria: journalCategorias.nombre,
        extracto: journal.extracto,
        imagenUrl: journal.imagenUrl,
        createdAt: journal.createdAt,
      })
      .from(journal)
      .leftJoin(journalCategorias, eq(journal.categoriaId, journalCategorias.id))
      .where(eq(journal.publicado, true))
      .orderBy(desc(journal.createdAt))
      .limit(3) as any;
  } catch (error) {
    console.error('Error al obtener noticias para JournalGrid:', error);
    articulos = placeholderArticulos;
    usingPlaceholder = true;
  }

  if (articulos.length === 0) {
    articulos = placeholderArticulos;
    usingPlaceholder = true;
  }

  return (
    <section id="journal" className="pt-16 pb-8 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-negro">
            Últimas Noticias
          </h2>
          <p className="mt-2 text-gris-texto">
            Mantente informado con nuestro Journal
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articulos.map((art, i) => {
            const badgeClass = categoriaBadgeColors[art.categoria] || categoriaBadgeColors.General;
            return (
              <Link
                key={art.id}
                href={usingPlaceholder ? '#' : `/journal/${art.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Imagen */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gris-claro">
                  {art.imagenUrl ? (
                    <Image
                      src={art.imagenUrl}
                      alt={art.titulo}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-azul-soft">
                      <Newspaper size={40} className="text-azul-acropolis/40" />
                    </div>
                  )}
                </div>

                {/* Contenido con margen negativo de profundidad */}
                <div className="-mt-6 relative mx-4 rounded-xl bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
                      {art.categoria}
                    </span>
                    <span className="text-xs text-gris-texto">
                      {formatDateShort(art.createdAt.toISOString().split('T')[0])}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold leading-snug text-negro line-clamp-2">
                    {art.titulo}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gris-texto line-clamp-3">
                    {truncate(art.extracto, 120)}
                  </p>
                  
                  <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-azul-soft text-azul-acropolis">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-medium text-gris-texto">{(art as any).autorNombre || 'Administración'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/journal"
            className="inline-flex items-center rounded-[var(--radius-button)] border-2 border-cian bg-cian px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-cian-hover hover:border-cian-hover shadow-sm"
          >
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  );
}
