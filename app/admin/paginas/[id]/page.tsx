import { db } from '@/lib/db';
import { paginas, paginaSecciones } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import PageEditor from './PageEditor';

export const metadata = {
  title: 'Constructor de Páginas | Admin Acrópolis'
};

export default async function CMSPageBuilder({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) return notFound();

  // Traer página
  const [pagina] = await db.select().from(paginas).where(eq(paginas.id, id)).limit(1);
  if (!pagina) return notFound();

  // Traer bloques (secciones)
  const secciones = await db
    .select()
    .from(paginaSecciones)
    .where(eq(paginaSecciones.paginaId, id))
    .orderBy(asc(paginaSecciones.orden));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-negro">
            Constructor de: <span className="text-azul-acropolis">{pagina.titulo}</span>
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Arrastra, edita y organiza los bloques de esta página. Ruta pública: <a href={pagina.slug} target="_blank" className="underline hover:text-azul-acropolis">{pagina.slug}</a>
          </p>
        </div>
      </div>

      <PageEditor pagina={pagina} initialSecciones={secciones} />
    </div>
  );
}
