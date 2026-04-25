import { redirect } from 'next/navigation';
import { db } from '../db';
import { paginas } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Verifica si una página estática (hardcoded route) está activa en la base de datos.
 * Si la página está marcada como inactiva (activo: false), redirige al inicio.
 * @param slug La ruta de la página (ej: '/centro-de-padres')
 */
export async function enforcePageActive(slug: string) {
  const [pagina] = await db
    .select({ activo: paginas.activo })
    .from(paginas)
    .where(eq(paginas.slug, slug))
    .limit(1);

  // Si la página existe en la DB y está explícitamente apagada, bloquear acceso.
  if (pagina && !pagina.activo) {
    redirect('/');
  }
}
