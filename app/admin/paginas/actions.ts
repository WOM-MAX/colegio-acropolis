'use server';

import { db } from '@/lib/db';
import { paginas } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updatePaginaStatus(id: number, activo: boolean) {
  try {
    await db
      .update(paginas)
      .set({ activo })
      .where(eq(paginas.id, id));

    // Revalidate paths affected
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating pagina status:', error);
    return { success: false, error: 'Hubo un error al actualizar el estado de la página.' };
  }
}

export async function updatePaginaMenuStatus(id: number, mostrarEnMenu: boolean) {
  try {
    await db
      .update(paginas)
      .set({ mostrarEnMenu })
      .where(eq(paginas.id, id));

    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating menu status:', error);
    return { success: false, error: 'Hubo un error al actualizar la visibilidad en el menú.' };
  }
}

export async function addPaginaNueva(titulo: string, slug: string) {
  try {
    const dbSlug = slug.startsWith('/') ? slug : `/${slug}`;
    
    await db.insert(paginas).values({
      titulo,
      slug: dbSlug,
      activo: true, // Nacen disponibles para editar (si no muestran menu, ok. Pueden apagarlas luego)
      mostrarEnMenu: false, // Nacen escondidas del menu por defecto
      ordenMenu: 99
    });
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error creando nueva pagina:', error);
    if (error.code === '23505') { // Postgres unique violation handling mostly
      return { success: false, error: 'La ruta (slug) ya existe. Intenta con otra.' };
    }
    return { success: false, error: 'Error interno guardando la página.' };
  }
}
