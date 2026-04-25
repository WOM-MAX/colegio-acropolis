export const revalidate = 3600;
import { db } from '@/lib/db';
import { journal, journalCategorias, journalAutores } from '@/lib/db/schema';
import { eq, and, not, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { formatDateShort, getCategoryColor } from '@/lib/utils';
import { ArrowLeft, Mail, Newspaper, User, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const result = await db.select().from(journal).where(eq(journal.slug, slug));
  const post = result[0];

  if (!post) {
    return { title: 'Noticia no encontrada' };
  }

  return {
    title: post.titulo || 'Noticia',
    description: post.extracto || '',
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const result = await db
    .select({
      id: journal.id,
      titulo: journal.titulo,
      slug: journal.slug,
      extracto: journal.extracto,
      contenido: journal.contenido,
      imagenUrl: journal.imagenUrl,
      publicado: journal.publicado,
      createdAt: journal.createdAt,
      categoriaId: journal.categoriaId,
      categoria: journalCategorias.nombre,
      autorNombre: journalAutores.nombre,
      autorCargo: journalAutores.cargo,
      autorCorreo: journalAutores.correoInstitucional,
      autorImagen: journalAutores.fotoUrl,
    })
    .from(journal)
    .leftJoin(journalCategorias, eq(journal.categoriaId, journalCategorias.id))
    .leftJoin(journalAutores, eq(journal.autorId, journalAutores.id))
    .where(eq(journal.slug, slug));
    
  const post = result[0];

  if (!post || !post.publicado) {
    notFound();
  }

  // Prevenir inyección de forma básica para React si se usa HTML
  // Y reemplazar espacios duros (nbsp) por espacios normales para permitir el salto de línea 
  // cuando los usuarios pegan texto desde Word o PDFs.
  const rawHtml = typeof post.contenido === 'string' ? post.contenido : '';
  const safeHtml = rawHtml.replace(/&nbsp;/g, ' ');
  const contenidoHTML = { __html: safeHtml };

  // Calculate read time
  const words = safeHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  // Fetch related articles
  const relatedArticles = post.categoriaId ? await db
    .select({
      id: journal.id,
      titulo: journal.titulo,
      slug: journal.slug,
      imagenUrl: journal.imagenUrl,
      createdAt: journal.createdAt,
    })
    .from(journal)
    .where(
      and(
        eq(journal.publicado, true),
        eq(journal.categoriaId, post.categoriaId),
        not(eq(journal.id, post.id))
      )
    )
    .orderBy(desc(journal.createdAt))
    .limit(3) : [];

  // Manejo seguro de fecha
  let formattedDate = '';
  try {
    const d = Object.prototype.toString.call(post.createdAt) === '[object Date]' 
              ? (post.createdAt as Date) 
              : new Date(post.createdAt as unknown as string | number);
              
    formattedDate = formatDateShort(d.toISOString().split('T')[0]);
  } catch (e) {
    formattedDate = 'Fecha desconocida';
  }

  return (
    <article className="py-16 px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link 
            href="/journal" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-azul-acropolis transition-colors hover:text-azul-hover"
          >
            <ArrowLeft size={16} />
            Volver a noticias
          </Link>
        </div>

        <header className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${getCategoryColor(post.categoria ?? 'General')}`}>
              {post.categoria ?? 'General'}
            </span>
            <span className="text-sm font-medium text-gris-texto">
              {formattedDate}
            </span>
            <span className="text-sm font-medium text-gris-texto flex items-center gap-1.5">
              <Clock size={14} /> {readTime} min de lectura
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-negro sm:text-5xl md:leading-tight">
            {post.titulo ?? 'Sin título'}
          </h1>
          <p className="mx-auto mt-6 text-xl leading-relaxed text-gris-texto">
            {post.extracto ?? ''}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-4">
              {post.autorImagen ? (
                <img src={post.autorImagen} alt={post.autorNombre || 'Autor'} className="h-12 w-12 rounded-full object-cover shadow-sm bg-gray-100" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 shadow-sm">
                  <User size={24} />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-negro">{post.autorNombre || 'Equipo Acrópolis'}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gris-texto">{post.autorCargo || 'Comunicaciones'}</p>
                  {post.autorCorreo && (
                    <a
                      href={`mailto:${post.autorCorreo}`}
                      title={`Contactar a ${post.autorNombre || 'autor'}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-cian hover:text-cian-hover transition-colors"
                    >
                      <Mail size={12} /> Contactar
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gris-texto flex items-center gap-1"><Share2 size={14}/> Compartir:</span>
              <a href={`https://wa.me/?text=Mira esta noticia: https://colegioacropolis.net/journal/${post.slug}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-[#25D366] hover:text-white transition-colors" title="Compartir en WhatsApp">
                {/* SVG from simpleicons for WhatsApp */}
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://colegioacropolis.net/journal/${post.slug}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-[#1877F2] hover:text-white transition-colors" title="Compartir en Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
        </header>
      </div>

      {post.imagenUrl ? (
        <div className="mx-auto mb-16 max-w-5xl overflow-hidden rounded-3xl shadow-xl">
          <img 
            src={post.imagenUrl} 
            alt={post.titulo || 'Imagen'} 
            className="h-auto w-full max-h-[600px] object-cover"
          />
        </div>
      ) : (
        <div className="mx-auto mb-16 flex max-w-5xl items-center justify-center rounded-3xl bg-azul-soft py-24">
          <Newspaper size={64} className="text-azul-acropolis/30" />
        </div>
      )}

      <div className="mx-auto max-w-3xl mb-24">
        <div 
          className="prose prose-lg prose-blue max-w-none text-negro whitespace-pre-wrap"
          dangerouslySetInnerHTML={contenidoHTML}
        />
      </div>

      {/* Artículos Relacionados */}
      {relatedArticles.length > 0 && (
        <div className="bg-gris-fondo py-16 px-6 rounded-3xl mx-4 mb-16">
          <div className="mx-auto max-w-5xl">
            <h3 className="mb-8 text-2xl font-bold text-negro text-center">Te podría interesar</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((related) => {
                let relatedDate = '';
                try {
                  const rd = Object.prototype.toString.call(related.createdAt) === '[object Date]' 
                    ? (related.createdAt as Date) 
                    : new Date(related.createdAt as unknown as string | number);
                  relatedDate = formatDateShort(rd.toISOString().split('T')[0]);
                } catch(e) {
                  relatedDate = '';
                }

                return (
                  <Link 
                    key={related.id} 
                    href={`/journal/${related.slug}`}
                    className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gris-claro relative">
                      {related.imagenUrl ? (
                        <img src={related.imagenUrl} alt={related.titulo || 'Relacionado'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-azul-soft">
                          <Newspaper size={24} className="text-azul-acropolis/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-medium text-gris-texto mb-2">{relatedDate}</p>
                      <h4 className="font-semibold text-negro line-clamp-2 leading-tight group-hover:text-azul-acropolis transition-colors">
                        {related.titulo}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
