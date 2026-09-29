import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import { popups } from '@/lib/db/schema';
import { eq, and, lte, gte, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const getCachedPopups = unstable_cache(
  async (todayStr: string) => {
    return await db
      .select({
        id: popups.id,
        titulo: popups.titulo,
        contenido: popups.contenido,
        imagenUrl: popups.imagenUrl,
        tipo: popups.tipo,
        botonTexto: popups.botonTexto,
        botonUrl: popups.botonUrl,
        frecuencia: popups.frecuencia,
        prioridad: popups.prioridad,
        posicion: popups.posicion,
        estiloImagen: popups.estiloImagen,
        colorFondo: popups.colorFondo,
        colorTexto: popups.colorTexto,
        colorBoton: popups.colorBoton,
        colorTextoBoton: popups.colorTextoBoton,
        paginaDestino: popups.paginaDestino,
        tamanoTitulo: popups.tamanoTitulo,
        efectoVisual: popups.efectoVisual,
      })
      .from(popups)
      .where(
        and(
          eq(popups.activo, true),
          lte(popups.fechaInicio, todayStr),
          gte(popups.fechaFin, todayStr)
        )
      )
      .orderBy(desc(popups.prioridad))
      .limit(10);
  },
  ['api-popups-today'],
  { revalidate: 86400, tags: ['popups'] }
);

/**
 * GET /api/popups
 * Retorna la lista de popups activos vigentes ordenados por prioridad.
 */
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const activePopups = await getCachedPopups(today);

    return NextResponse.json({
      popup: activePopups.length > 0 ? activePopups[0] : null,
      popups: activePopups,
    });
  } catch (error) {
    console.error('[Popups API] Error al obtener popups:', error);
    return NextResponse.json({ popup: null, popups: [] });
  }
}
