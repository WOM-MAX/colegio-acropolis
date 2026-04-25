import { db } from '@/lib/db';
import { paginas, paginaSecciones } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import BlockRenderer from '@/components/renderer/BlockRenderer';
import { enforcePageActive } from '@/lib/utils/page-guard';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nuestra Historia - Colegio Acrópolis',
  description: 'Conoce los valores, la visión y la historia del Colegio Acrópolis en Puente Alto.',
};

export default async function NuestraHistoriaPage() {
  // Asegura que la página esté activa en la DB o redirige al inicio
  await enforcePageActive('/nuestra-historia');

  // Buscar el ID de la página para cargar sus secciones
  const [pagina] = await db
    .select()
    .from(paginas)
    .where(eq(paginas.slug, '/nuestra-historia'))
    .limit(1);

  if (!pagina) {
    notFound();
  }

  // Obtener las secciones inyectadas por el constructor
  const secciones = await db
    .select()
    .from(paginaSecciones)
    .where(and(eq(paginaSecciones.paginaId, pagina.id), eq(paginaSecciones.estadoActivo, true)))
    .orderBy(asc(paginaSecciones.orden));

  // Si aún no hay bloques insertados, mostramos el estado vacío
  if (secciones.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gris-fondo px-6 text-center">
        <h1 className="text-4xl font-bold text-negro">Nuestra Historia</h1>
        <p className="mt-4 max-w-xl text-lg text-gris-texto">
          Estamos preparando contenido increíble. Vuelve pronto para conocer nuestro legado.
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
