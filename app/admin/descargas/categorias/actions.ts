'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { descargasCategorias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategoria(formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const orden = parseInt((formData.get('orden') as string) || '0', 10);

  await db.insert(descargasCategorias).values({
    nombre,
    orden,
  });

  revalidatePath('/admin/descargas/categorias');
  revalidatePath('/admin/descargas');
  revalidatePath('/descargas');
  revalidatePath('/');
  redirect('/admin/descargas/categorias');
}

export async function updateCategoria(id: number, formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const orden = parseInt((formData.get('orden') as string) || '0', 10);

  await db
    .update(descargasCategorias)
    .set({
      nombre,
      orden,
    })
    .where(eq(descargasCategorias.id, id));

  revalidatePath('/admin/descargas/categorias');
  revalidatePath('/admin/descargas');
  revalidatePath('/descargas');
  revalidatePath('/');
  redirect('/admin/descargas/categorias');
}

export async function deleteCategoria(id: number) {
  await requireAdmin();
  await db.delete(descargasCategorias).where(eq(descargasCategorias.id, id));
  revalidatePath('/admin/descargas/categorias');
  revalidatePath('/admin/descargas');
  revalidatePath('/descargas');
  revalidatePath('/');
}
