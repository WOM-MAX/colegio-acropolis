'use server';
import { requireAdmin } from '@/lib/auth-guard';
import { db } from '@/lib/db';
import { paginaSecciones, paginas } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';

function revalidarCaches(slug?: string) {
  try {
    revalidateTag('home-secciones', 'max');
    revalidateTag('pagina-secciones', 'max');
    revalidateTag('paginas', 'max');
    revalidatePath('/', 'layout');
    if (slug) {
      revalidatePath(slug, 'page');
    }
  } catch (err) {
    console.error('Error revalidando tags de caché:', err);
  }
}

export async function addSeccion(
  paginaId: number,
  tipoBloque: string,
  orden: number,
  configuracion: any,
  insertAtIndex?: number
) {
  await requireAdmin();
  try {
    const targetOrder = insertAtIndex !== undefined ? insertAtIndex : orden;

    if (insertAtIndex !== undefined) {
      // Desplazar los bloques existentes a partir del índice de inserción
      const existentes = await db
        .select()
        .from(paginaSecciones)
        .where(eq(paginaSecciones.paginaId, paginaId))
        .orderBy(asc(paginaSecciones.orden));

      const updates = existentes
        .filter((s) => s.orden >= insertAtIndex)
        .map((s) =>
          db
            .update(paginaSecciones)
            .set({ orden: s.orden + 1 })
            .where(eq(paginaSecciones.id, s.id))
        );

      if (updates.length > 0) {
        await Promise.all(updates);
      }
    }

    const [nueva] = await db
      .insert(paginaSecciones)
      .values({
        paginaId,
        tipoBloque,
        orden: targetOrder,
        configuracion,
      })
      .returning();

    revalidarCaches();
    return { success: true, data: nueva };
  } catch (error) {
    console.error('Error añadiendo sección:', error);
    return { success: false, error: 'No se pudo añadir el bloque.' };
  }
}

export async function updateSeccionConfig(id: number, configuracion: any) {
  await requireAdmin();
  try {
    await db
      .update(paginaSecciones)
      .set({ configuracion, updatedAt: new Date() })
      .where(eq(paginaSecciones.id, id));

    revalidarCaches();
    return { success: true };
  } catch (error) {
    console.error('Error actualizando sección:', error);
    return { success: false, error: 'No se pudo guardar la configuración.' };
  }
}

export async function deleteSeccion(id: number) {
  await requireAdmin();
  try {
    await db.delete(paginaSecciones).where(eq(paginaSecciones.id, id));
    revalidarCaches();
    return { success: true };
  } catch (error) {
    console.error('Error borrando sección:', error);
    return { success: false, error: 'No se pudo eliminar el bloque.' };
  }
}

export async function updateOrdenSecciones(ordenajes: { id: number; orden: number }[]) {
  await requireAdmin();
  try {
    await Promise.all(
      ordenajes.map((item) =>
        db
          .update(paginaSecciones)
          .set({ orden: item.orden, updatedAt: new Date() })
          .where(eq(paginaSecciones.id, item.id))
      )
    );
    revalidarCaches();
    return { success: true };
  } catch (error) {
    console.error('Error actualizando orden:', error);
    return { success: false, error: 'No se pudo reordenar.' };
  }
}

export async function updateSeccionActiva(id: number, estadoActivo: boolean) {
  await requireAdmin();
  try {
    await db
      .update(paginaSecciones)
      .set({ estadoActivo, updatedAt: new Date() })
      .where(eq(paginaSecciones.id, id));

    revalidarCaches();
    return { success: true };
  } catch (error) {
    console.error('Error actualizando estado:', error);
    return { success: false, error: 'No se pudo actualizar el estado del bloque.' };
  }
}

export async function updatePaginaSeo(id: number, titulo: string, seoDescription: string) {
  await requireAdmin();
  try {
    const [pagina] = await db
      .update(paginas)
      .set({ titulo, seoDescription, updatedAt: new Date() })
      .where(eq(paginas.id, id))
      .returning();

    revalidarCaches(pagina?.slug);
    return { success: true };
  } catch (error) {
    console.error('Error actualizando SEO de la página:', error);
    return { success: false, error: 'No se pudo guardar la configuración SEO.' };
  }
}

export async function inicializarEstructuraInicio(paginaId: number) {
  await requireAdmin();
  try {
    // 1. Obtener secciones actuales
    const actuales = await db
      .select()
      .from(paginaSecciones)
      .where(eq(paginaSecciones.paginaId, paginaId))
      .orderBy(asc(paginaSecciones.orden));

    // Filtrar cualquier bloque previo no-sistema (ej: Cinta de Noticias previa)
    const customPrevios = actuales.filter((s) => !s.tipoBloque.startsWith('HOME_'));

    // 2. Eliminar secciones HOME_* previas si las hubiera para evitar duplicados
    await db.delete(paginaSecciones).where(eq(paginaSecciones.paginaId, paginaId));

    // 3. Crear lista estándar con los bloques nativos del sistema
    const standardHome = [
      { tipoBloque: 'HOME_HERO', configuracion: { titulo: 'Hero Principal (Frente del Colegio)' } },
      { tipoBloque: 'HOME_EVENTOS', configuracion: { titulo: 'Carrusel de Eventos y Efemérides' } },
      { tipoBloque: 'HOME_JOURNAL', configuracion: { titulo: 'Últimas Noticias (Journal)' } },
      { tipoBloque: 'HOME_CALENDARIOS', configuracion: { titulo: 'Calendarios de Evaluaciones' } },
      { tipoBloque: 'HOME_DESCARGAS', configuracion: { titulo: 'Zona de Descargas Rápidas' } },
      { tipoBloque: 'HOME_BANNER_CTA', configuracion: { titulo: 'Banner de Admisión y Matrícula' } },
    ];

    // Reinsertar bloques personalizados previos al inicio (ej: CINTA_NOTICIAS) + bloques HOME
    let orderIndex = 0;
    const aInsertar = [];

    for (const c of customPrevios) {
      aInsertar.push({
        paginaId,
        tipoBloque: c.tipoBloque,
        orden: orderIndex++,
        configuracion: c.configuracion,
        estadoActivo: c.estadoActivo,
      });
    }

    for (const h of standardHome) {
      aInsertar.push({
        paginaId,
        tipoBloque: h.tipoBloque,
        orden: orderIndex++,
        configuracion: h.configuracion,
        estadoActivo: true,
      });
    }

    const inserted = await db.insert(paginaSecciones).values(aInsertar).returning();

    revalidarCaches('/');
    return { success: true, data: inserted };
  } catch (error) {
    console.error('Error inicializando estructura del inicio:', error);
    return { success: false, error: 'No se pudo inicializar la estructura.' };
  }
}
