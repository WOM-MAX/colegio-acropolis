import { redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { db } from '../db';
import { paginas } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Verifica si una página estática (hardcoded route) está activa en la base de datos.
 * Si la página está marcada como inactiva (activo: false), redirige al inicio.
 * @param slug La ruta de la página (ej: '/centro-de-padres')
 */
export async function enforcePageActive(slug: string) {
  const getCachedPaginaStatus = unstable_cache(
    async (s: string) => {
      const [pagina] = await db
        .select({ activo: paginas.activo })
        .from(paginas)
        .where(eq(paginas.slug, s))
        .limit(1);
      return pagina;
    },
    ['enforce-page-active'],
    { revalidate: 86400 }
  );

  const pagina = await getCachedPaginaStatus(slug);

  // Si la página existe en la DB y está explícitamente apagada, bloquear acceso.
  if (pagina && !pagina.activo) {
    redirect('/');
  }
}
