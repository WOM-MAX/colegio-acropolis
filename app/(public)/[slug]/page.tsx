import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { paginas, paginaSecciones } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import BlockRenderer from '@/components/renderer/BlockRenderer';

export const revalidate = 3600;
import { unstable_cache } from 'next/cache';



const getValidSlugs = unstable_cache(
  async () => {
    try {
      const res = await db.select({ slug: paginas.slug }).from(paginas);
      return res.map((p) => p.slug);
    } catch (e) {
      return [];
    }
  },
  ['all-valid-slugs-list'],
  { revalidate: 86400, tags: ['paginas'] }
);

const getCachedMetadata = unstable_cache(
  async (slug: string) => {
    return db
      .select({ titulo: paginas.titulo, seoDescription: paginas.seoDescription })
      .from(paginas)
      .where(eq(paginas.slug, slug))
      .limit(1);
  },
  ['pagina-metadata-slug'],
  { revalidate: 86400 }
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const dbSlug = `/${decodedSlug}`;

  // Validar contra la lista de slugs en caché (bloqueo absoluto de 404 bots sin despertar BD)
  const validSlugs = await getValidSlugs();
  if (!validSlugs.includes(dbSlug)) {
    return {};
  }

  const [pagina] = await getCachedMetadata(dbSlug);

  if (!pagina) return {};

  return {
    title: `${pagina.titulo} - Colegio Acrópolis`,
    description: pagina.seoDescription || `Página oficial de ${pagina.titulo} del Colegio Acrópolis.`,
  };
}

const getCachedPageBySlug = unstable_cache(
  async (slug: string) => {
    return db.select().from(paginas).where(eq(paginas.slug, slug)).limit(1);
  },
  ['pagina-data-slug'],
  { revalidate: 86400 }
);

const getCachedSecciones = unstable_cache(
  async (paginaId: number) => {
    return db
      .select()
      .from(paginaSecciones)
      .where(and(eq(paginaSecciones.paginaId, paginaId), eq(paginaSecciones.estadoActivo, true)))
      .orderBy(asc(paginaSecciones.orden));
  },
  ['pagina-secciones'],
  { revalidate: 86400 }
);

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const dbSlug = `/${decodedSlug}`;

  // Validar contra la lista de slugs en caché
  // Si el bot pide una URL que no existe en el CMS, retorna 404 instantáneo SIN despertar Neon
  const validSlugs = await getValidSlugs();
  if (!validSlugs.includes(dbSlug)) {
    notFound();
  }

  // Si pasa el filtro, buscar la página (usualmente ya cacheada)
  const [pagina] = await getCachedPageBySlug(dbSlug);

  // Si no existe, lanza un 404
  if (!pagina) {
    notFound();
  }

  // Si existe pero está apagada, redirige al inicio por seguridad
  if (!pagina.activo) {
    redirect('/');
  }

  // Obtener las secciones de la página
  const secciones = await getCachedSecciones(pagina.id);

  // Si no hay secciones, mostrar un mensaje de "En construcción" (útil mientras editan)
  if (secciones.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gris-fondo px-6 text-center">
        <h1 className="text-4xl font-bold text-negro">{pagina.titulo}</h1>
        <p className="mt-4 max-w-xl text-lg text-gris-texto">
          Esta página está en proceso de construcción. Vuelve pronto para ver nuestras novedades.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {secciones.map((seccion) => (
        <BlockRenderer key={seccion.id} seccion={seccion} />
      ))}
    </div>
  );
}
