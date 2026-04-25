import { db } from '@/lib/db';
import { journal, journalCategorias } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listado = await db
      .select({
        id: journal.id,
        titulo: journal.titulo,
        extracto: journal.extracto,
        slug: journal.slug,
        publicado: journal.publicado,
        createdAt: journal.createdAt,
        categoria: journalCategorias.nombre,
      })
      .from(journal)
      .leftJoin(journalCategorias, eq(journal.categoriaId, journalCategorias.id))
      .orderBy(desc(journal.createdAt));

    // Generar contenido CSV
    const cabecera = ['ID', 'Título', 'Categoría', 'Extracto', 'Slug', 'Publicado', 'Creado'];
    const lineas = [cabecera.join(',')];

    for (const post of listado) {
      const linea = [
        post.id,
        `"${post.titulo.replace(/"/g, '""')}"`, // Escapar comillas dobles
        `"${(post.categoria || '').replace(/"/g, '""')}"`,
        `"${post.extracto.replace(/"/g, '""')}"`,
        post.slug,
        post.publicado ? 'Sí' : 'No',
        post.createdAt.toISOString(),
      ];
      lineas.push(linea.join(','));
    }

    const csvContent = lineas.join('\n');

    // Retornar archivo
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="journal_historial.csv"',
      },
    });
  } catch (error) {
    console.error('Error exportando journal:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
