export const revalidate = 3600;
import Link from 'next/link';
import { db } from '@/lib/db';
import { journal, journalCategorias, journalAutores } from '@/lib/db/schema';
import { eq, desc, asc, ilike, and, or, count } from 'drizzle-orm';
import { formatDateShort, getCategoryColor } from '@/lib/utils';
import { Newspaper, User, Clock } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import JournalFilters from './components/JournalFilters';
import Pagination from './components/Pagination';

const ARTICLES_PER_PAGE = 9;

export const metadata = {
  title: 'Noticias / Journal',
  description: 'Enterate de las últimas noticias, circulares y comunicados.',
};

function calculateReadTime(htmlContent: string | null): number {
  if (!htmlContent) return 1;
  const text = htmlContent.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const placeholderArticulos = [
  { id: 1, titulo: 'Ceremonia de Reconocimiento al Mérito Académico Primer Semestre', slug: 'reconocimiento-academico', categoria: 'Académico', autorNombre: 'Walter Gómez', autorCargo: 'Director', autorImagen: null as string | null, extracto: 'Felicitamos a todos nuestros estudiantes que han destacado por su esfuerzo y dedicación.', imagenUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop', createdAt: new Date(), readTime: 3 },
  { id: 2, titulo: 'Inauguración de Nuevos Espacios de Convivencia Escolar', slug: 'nuevos-espacios', categoria: 'Convivencia', autorNombre: 'María Rivera', autorCargo: 'Coordinadora de Convivencia', autorImagen: null as string | null, extracto: 'Con mucho orgullo presentamos las nuevas áreas recreativas diseñadas para el bienestar estudiantil.', imagenUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop', createdAt: new Date(), readTime: 2 },
];

export default async function JournalPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}) {
  let articulos: typeof placeholderArticulos = [];
  let distinctCategorias: string[] = [];
  let totalArticulos = 0;

  // Parse search params dynamically to support both Next.js 14 and 15+
  let resolvedParams: any = props.searchParams || {};
  if (resolvedParams instanceof Promise) {
    resolvedParams = await resolvedParams;
  }
  
  const qStr = resolvedParams.q ? String(resolvedParams.q).toLowerCase() : '';
  const categoriaStr = resolvedParams.categoria ? String(resolvedParams.categoria) : '';
  const ordenStr = resolvedParams.orden ? String(resolvedParams.orden) : 'desc';
  const pageStr = resolvedParams.page ? String(resolvedParams.page) : '1';
  const currentPage = Math.max(1, parseInt(pageStr, 10) || 1);

  try {
    // 1. Get unique categories to populate pills from journal_categorias
    const allCat = await db.select({ nombre: journalCategorias.nombre }).from(journalCategorias);
    distinctCategorias = allCat.map(c => c.nombre).sort();

    // 2. Build conditional where clauses
    const conditions = [eq(journal.publicado, true)];

    if (qStr) {
      conditions.push(
        or(
          ilike(journal.titulo, `%${qStr}%`),
          ilike(journal.extracto, `%${qStr}%`)
        )!
      );
    }

    if (categoriaStr) {
      // Find the tag ID based on its name
      const catMatches = await db.select({id: journalCategorias.id}).from(journalCategorias).where(eq(journalCategorias.nombre, categoriaStr));
      if(catMatches.length > 0) {
        conditions.push(eq(journal.categoriaId, catMatches[0].id));
      } else {
        // Force no results if category not found
        conditions.push(eq(journal.id, -1));
      }
    }

    // 3. Count total matching articles for pagination
    const countResult = await db
      .select({ total: count() })
      .from(journal)
      .where(and(...conditions));
    totalArticulos = countResult[0]?.total ?? 0;

    // 4. Build query with JOINs, LIMIT, and OFFSET
    const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

    const result = await db
      .select({
        id: journal.id,
        titulo: journal.titulo,
        slug: journal.slug,
        extracto: journal.extracto,
        contenido: journal.contenido,
        imagenUrl: journal.imagenUrl,
        createdAt: journal.createdAt,
        categoria: journalCategorias.nombre,
        autorNombre: journalAutores.nombre,
        autorCargo: journalAutores.cargo,
        autorImagen: journalAutores.fotoUrl,
      })
      .from(journal)
      .leftJoin(journalCategorias, eq(journal.categoriaId, journalCategorias.id))
      .leftJoin(journalAutores, eq(journal.autorId, journalAutores.id))
      .where(and(...conditions))
      .orderBy(ordenStr === 'asc' ? asc(journal.createdAt) : desc(journal.createdAt))
      .limit(ARTICLES_PER_PAGE)
      .offset(offset);
    
    articulos = result.map(a => ({
      id: a.id,
      titulo: a.titulo,
      slug: a.slug,
      categoria: a.categoria || 'General',
      autorNombre: a.autorNombre || 'Equipo Acrópolis',
      autorCargo: a.autorCargo || 'Comunicaciones',
      autorImagen: a.autorImagen || null,
      extracto: a.extracto,
      imagenUrl: a.imagenUrl || '',
      createdAt: Object.prototype.toString.call(a.createdAt) === '[object Date]' ? a.createdAt as Date : new Date(a.createdAt!),
      readTime: calculateReadTime(a.contenido as string | null),
    }));
  } catch (error) {
    console.error('Error al obtener journal:', error);
    articulos = placeholderArticulos;
    totalArticulos = placeholderArticulos.length;
  }

  // If there are exactly 0 results AFTER A FILTER was applied (not the default case), 
  // we want to show an empty state, not placeholders.
  const hasFilters = Boolean(qStr || categoriaStr);

  const totalPages = Math.max(1, Math.ceil(totalArticulos / ARTICLES_PER_PAGE));

  const isFirstPageDefault = currentPage === 1 && !hasFilters;
  const showHeroPost = isFirstPageDefault && articulos.length > 0;
  
  const heroPost = showHeroPost ? articulos[0] : null;
  const gridArticulos = showHeroPost ? articulos.slice(1) : articulos;

  return (
    <>
      <PageHero 
        title="Journal" 
        highlight="Institucional" 
        description="Últimos comunicados, noticias, eventos y actualizaciones del colegio."
      />
      
      <div className="bg-gris-fondo py-12 px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          
          <JournalFilters categorias={distinctCategorias} />

          {articulos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Newspaper className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-negro">No se encontraron noticias</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                No hay resultados que coincidan con tu búsqueda actual. Intenta probar con otros términos o seleccionando otra categoría.
              </p>
              <Link 
                href="/journal" 
                className="mt-6 rounded-full bg-azul-acropolis px-6 py-2.5 text-sm font-medium text-white transition hover:bg-azul-hover"
              >
                Limpiar Filtros
              </Link>
            </div>
          ) : (
            <>
              {heroPost && (
                <div className="mb-12">
                   <Link href={`/journal/${heroPost.slug}`} className="group flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
                      <div className="relative md:w-[60%] aspect-[16/10] md:aspect-auto overflow-hidden bg-gris-claro">
                        {heroPost.imagenUrl ? (
                          <img src={heroPost.imagenUrl} alt={heroPost.titulo} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-azul-soft">
                             <Newspaper size={64} className="text-azul-acropolis/40" />
                          </div>
                        )}
                      </div>
                      <div className="relative md:w-[40%] p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getCategoryColor(heroPost.categoria)}`}>
                            {heroPost.categoria}
                          </span>
                          <span className="text-sm font-medium text-gris-texto flex items-center gap-1.5">
                             <Clock size={14} /> {heroPost.readTime} min de lectura
                          </span>
                        </div>
                        <h2 className="mb-4 text-2xl md:text-3xl font-bold leading-tight text-negro group-hover:text-azul-acropolis transition-colors">
                          {heroPost.titulo}
                        </h2>
                        <p className="mb-6 text-base leading-relaxed text-gris-texto line-clamp-4">
                          {heroPost.extracto}
                        </p>
                        <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-6">
                           <div className="flex h-12 w-12 overflow-hidden items-center justify-center rounded-full bg-azul-soft text-azul-acropolis">
                             {heroPost.autorImagen ? (
                               <img src={heroPost.autorImagen} alt={heroPost.autorNombre} className="h-full w-full object-cover" />
                             ) : (
                               <User size={20} />
                             )}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-negro">{heroPost.autorNombre}</p>
                             <p className="text-xs text-gris-texto">{formatDateShort(heroPost.createdAt.toISOString().split('T')[0])}</p>
                           </div>
                        </div>
                      </div>
                   </Link>
                </div>
              )}

              {gridArticulos.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {gridArticulos.map((art, i) => {
                    const badgeClass = getCategoryColor(art.categoria);
                    
                    return (
                      <Link
                        key={art.id}
                        href={`/journal/${art.slug}`}
                        className="group block overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-gris-claro">
                          {art.imagenUrl ? (
                            <img
                              src={art.imagenUrl}
                              alt={art.titulo}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-azul-soft">
                              <Newspaper size={40} className="text-azul-acropolis/40" />
                            </div>
                          )}
                        </div>
                        
                        <div className="-mt-6 relative mx-4 rounded-xl bg-white p-5 shadow-sm border border-gray-50/50">
                          <div className="mb-3 flex flex-wrap items-center gap-3">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
                              {art.categoria}
                            </span>
                            <span className="text-xs text-gris-texto flex items-center gap-1">
                              <Clock size={12} /> {art.readTime} min
                            </span>
                          </div>
                          <h3 className="mb-2 text-lg font-semibold leading-snug text-negro line-clamp-2">
                            {art.titulo}
                          </h3>
                          <p className="mb-4 text-sm leading-relaxed text-gris-texto line-clamp-3">
                            {art.extracto}
                          </p>
                          
                          <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                            <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-full bg-azul-soft text-azul-acropolis">
                              {art.autorImagen ? (
                                <img src={art.autorImagen} alt={art.autorNombre} className="h-full w-full object-cover" />
                              ) : (
                                <User size={14} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-negro">{art.autorNombre}</span>
                              <span className="text-[10px] text-gris-texto">{formatDateShort(art.createdAt.toISOString().split('T')[0])}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              <Pagination currentPage={currentPage} totalPages={totalPages} />

              {/* Page info */}
              {totalPages > 1 && (
                <p className="mt-4 text-center text-xs text-gris-texto">
                  Mostrando {((currentPage - 1) * ARTICLES_PER_PAGE) + 1}–{Math.min(currentPage * ARTICLES_PER_PAGE, totalArticulos)} de {totalArticulos} noticias
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
