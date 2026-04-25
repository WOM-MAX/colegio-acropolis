import { db } from '@/lib/db';
import { descargas, descargasCategorias } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listado = await db.select().from(descargas).orderBy(desc(descargas.createdAt));
    const categorias = await db.query.descargasCategorias.findMany();
    
    // Crear un mapa para etiquetas de categoría
    const categoriaMap: Record<string, string> = {};
    categorias.forEach(cat => {
      categoriaMap[cat.id.toString()] = cat.nombre;
    });

    // Generar contenido CSV
    const cabecera = ['ID', 'Nombre Archivo', 'Categoría', 'Versión', 'Color Acento', 'URL Archivo', 'Creado'];
    const lineas = [cabecera.join(',')];

    for (const arc of listado) {
      const nombreCat = categoriaMap[arc.categoria] || arc.categoria; // Usa el ID textual u original si no hay match
      
      const linea = [
        arc.id,
        `"${arc.nombre.replace(/"/g, '""')}"`, // Escapar comillas dobles
        `"${nombreCat.replace(/"/g, '""')}"`,
        `"${(arc.version || '').replace(/"/g, '""')}"`,
        arc.colorAcento,
        arc.archivoUrl,
        arc.createdAt.toISOString(),
      ];
      lineas.push(linea.join(','));
    }

    const csvContent = lineas.join('\n');

    // Retornar archivo
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="descargas_historial.csv"',
      },
    });
  } catch (error) {
    console.error('Error exportando descargas:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
