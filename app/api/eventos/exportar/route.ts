import { db } from '@/lib/db';
import { eventos } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listado = await db.select().from(eventos).orderBy(desc(eventos.fecha));

    // Generar contenido CSV
    const cabecera = ['ID', 'Nombre', 'Fecha', 'Tipo', 'Descripción', 'Activo', 'Creado'];
    const lineas = [cabecera.join(',')];

    for (const evt of listado) {
      const linea = [
        evt.id,
        `"${evt.nombre.replace(/"/g, '""')}"`, // Escapar comillas dobles
        evt.fecha,
        evt.tipo,
        `"${evt.descripcion.replace(/"/g, '""')}"`,
        evt.activo ? 'Sí' : 'No',
        evt.createdAt.toISOString(),
      ];
      lineas.push(linea.join(','));
    }

    const csvContent = lineas.join('\n');

    // Retornar archivo
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="eventos_historial.csv"',
      },
    });
  } catch (error) {
    console.error('Error exportando eventos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
