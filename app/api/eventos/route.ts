import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eventos } from '@/lib/db/schema';
import { eq, asc, and, gte, lte } from 'drizzle-orm';

/**
 * GET /api/eventos
 * Retorna solo los eventos activos del MES EN CURSO,
 * ordenados por fecha ascendente.
 * Los eventos de meses pasados/futuros se conservan en la DB
 * pero no se muestran — el admin nunca necesita borrarlos.
 */
export async function GET() {
  try {
    // Calcular primer y último día del mes actual (zona horaria Chile)
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' })
    );
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    // Formato YYYY-MM-DD para comparación con columna date
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0); // Último día del mes
    const lastDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

    const activeEventos = await db
      .select({
        id: eventos.id,
        nombre: eventos.nombre,
        fecha: eventos.fecha,
        descripcion: eventos.descripcion,
        tipo: eventos.tipo,
        imagenUrl: eventos.imagenUrl,
      })
      .from(eventos)
      .where(
        and(
          eq(eventos.activo, true),
          gte(eventos.fecha, firstDay),
          lte(eventos.fecha, lastDayStr)
        )
      )
      .orderBy(asc(eventos.fecha));

    return NextResponse.json({ eventos: activeEventos });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return NextResponse.json({ eventos: [] }, { status: 500 });
  }
}
