'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { journalCategorias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategoria(formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const orden = parseInt(formData.get('orden') as string) || 0;

  await db.insert(journalCategorias).values({
    nombre,
    orden,
  });

  revalidatePath('/admin/journal/categorias');
  revalidatePath('/admin/journal/nuevo');
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  redirect('/admin/journal/categorias');
}

export async function updateCategoria(id: number, formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const orden = parseInt(formData.get('orden') as string) || 0;

  await db
    .update(journalCategorias)
    .set({
      nombre,
      orden,
    })
    .where(eq(journalCategorias.id, id));

  revalidatePath('/admin/journal/categorias');
  revalidatePath('/admin/journal/nuevo');
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  redirect('/admin/journal/categorias');
}

export async function deleteCategoria(id: number) {
  await requireAdmin();
  await db.delete(journalCategorias).where(eq(journalCategorias.id, id));
  revalidatePath('/admin/journal/categorias');
  revalidatePath('/admin/journal/nuevo');
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
}
