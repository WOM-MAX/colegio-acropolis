'use server';

import { db } from '@/lib/db';
import { paginaSecciones, paginas } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addSeccion(paginaId: number, tipoBloque: string, orden: number, configuracion: any) {
  try {
    const [nueva] = await db.insert(paginaSecciones).values({
      paginaId,
      tipoBloque,
      orden,
      configuracion
    }).returning();
    
    revalidatePath('/', 'layout');
    return { success: true, data: nueva };
  } catch (error) {
    console.error('Error añadiendo sección:', error);
    return { success: false, error: 'No se pudo añadir el bloque.' };
  }
}

export async function updateSeccionConfig(id: number, configuracion: any) {
  try {
    await db.update(paginaSecciones)
      .set({ configuracion, updatedAt: new Date() })
      .where(eq(paginaSecciones.id, id));
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error actualizando sección:', error);
    return { success: false, error: 'No se pudo guardar la configuración.' };
  }
}

export async function deleteSeccion(id: number) {
  try {
    await db.delete(paginaSecciones).where(eq(paginaSecciones.id, id));
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error borrando sección:', error);
    return { success: false, error: 'No se pudo eliminar el bloque.' };
  }
}

export async function updateOrdenSecciones(ordenajes: { id: number; orden: number }[]) {
  try {
    // Para simplificar, sin transacciones complejas, despachamos updates paralelos.
    await Promise.all(ordenajes.map(item => 
      db.update(paginaSecciones)
        .set({ orden: item.orden })
        .where(eq(paginaSecciones.id, item.id))
    ));
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error actualizando orden:', error);
    return { success: false, error: 'No se pudo reordenar.' };
  }
}

export async function updateSeccionActiva(id: number, estadoActivo: boolean) {
  try {
    await db.update(paginaSecciones)
      .set({ estadoActivo, updatedAt: new Date() })
      .where(eq(paginaSecciones.id, id));
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error actualizando estado:', error);
    return { success: false, error: 'No se pudo actualizar el estado del bloque.' };
  }
}

export async function updatePaginaSeo(id: number, titulo: string, seoDescription: string) {
  try {
    await db.update(paginas)
      .set({ titulo, seoDescription, updatedAt: new Date() })
      .where(eq(paginas.id, id));
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error actualizando SEO de la página:', error);
    return { success: false, error: 'No se pudo guardar la configuración SEO.' };
  }
}
