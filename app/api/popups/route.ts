import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { popups } from '@/lib/db/schema';
import { eq, and, lte, gte, desc } from 'drizzle-orm';

// Evitar cache de Next.js — siempre datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/popups
 * Retorna el popup activo de mayor prioridad vigente a la fecha actual.
 */
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('[Popups API] Buscando popups para fecha:', today);

    const activePopups = await db
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
        tamanoTitulo: popups.tamanoTitulo,
      })
      .from(popups)
      .where(
        and(
          eq(popups.activo, true),
          lte(popups.fechaInicio, today),
          gte(popups.fechaFin, today)
        )
      )
      .orderBy(desc(popups.prioridad))
      .limit(1);

    console.log('[Popups API] Resultados:', activePopups.length, activePopups.length > 0 ? JSON.stringify(activePopups[0]) : 'ninguno');

    if (activePopups.length === 0) {
      return NextResponse.json({ popup: null });
    }

    return NextResponse.json({ popup: activePopups[0] });
  } catch (error) {
    console.error('[Popups API] Error al obtener popup:', error);
    return NextResponse.json({ popup: null });
  }
}
