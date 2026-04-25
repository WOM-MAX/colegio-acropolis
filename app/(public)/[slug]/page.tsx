import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { paginas, paginaSecciones } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import BlockRenderer from '@/components/renderer/BlockRenderer';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const [pagina] = await db
    .select({ titulo: paginas.titulo, seoDescription: paginas.seoDescription })
    .from(paginas)
    .where(eq(paginas.slug, `/${decodedSlug}`))
    .limit(1);

  if (!pagina) return {};

  return {
    title: `${pagina.titulo} - Colegio Acrópolis`,
    description: pagina.seoDescription || `Página oficial de ${pagina.titulo} del Colegio Acrópolis.`,
  };
}

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const dbSlug = `/${decodedSlug}`;

  // Buscar la página
  const [pagina] = await db
    .select()
    .from(paginas)
    .where(eq(paginas.slug, dbSlug))
    .limit(1);

  // Si no existe, lanza un 404
  if (!pagina) {
    notFound();
  }

  // Si existe pero está apagada, redirige al inicio por seguridad
  if (!pagina.activo) {
    redirect('/');
  }

  // Obtener las secciones de la página
  const secciones = await db
    .select()
    .from(paginaSecciones)
    .where(and(eq(paginaSecciones.paginaId, pagina.id), eq(paginaSecciones.estadoActivo, true)))
    .orderBy(asc(paginaSecciones.orden));

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
