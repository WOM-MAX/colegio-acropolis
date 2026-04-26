'use server';

import { db } from '@/lib/db';
import { journal } from '@/lib/db/schema';
import { eq, lt } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/utils';

import { uploadToCloudinary } from '@/lib/cloudinary';

export async function createJournalConfig(formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const categoriaId = parseInt(formData.get('categoriaId') as string, 10);
  const autorId = parseInt(formData.get('autorId') as string, 10);
  const extracto = formData.get('extracto') as string;
  const contenido = formData.get('contenido') as string || '';
  const file = formData.get('uploadTarget') as File | null;
  const publicado = formData.get('publicado') === 'true';
  const fechaPublicacion = formData.get('fechaPublicacion') as string;
  const createdAt = fechaPublicacion ? new Date(fechaPublicacion + 'T12:00:00') : new Date();

  let imagenUrl = formData.get('imagenUrl') as string | null;

  if (file && file.size > 0) {
    imagenUrl = await uploadToCloudinary(file);
  }

  let slug = slugify(titulo);
  const existing = await db.select().from(journal).where(eq(journal.slug, slug));
  if (existing.length > 0) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  await db.insert(journal).values({
    titulo,
    slug,
    categoriaId: isNaN(categoriaId) ? null : categoriaId,
    autorId: isNaN(autorId) ? null : autorId,
    extracto,
    contenido,
    imagenUrl: imagenUrl || null,
    publicado,
    createdAt,
  });

  revalidatePath('/admin/journal');
  revalidatePath('/', 'layout');
  revalidatePath('/journal', 'layout');
}

export async function updateJournalConfig(id: number, formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const categoriaId = parseInt(formData.get('categoriaId') as string, 10);
  const autorId = parseInt(formData.get('autorId') as string, 10);
  const extracto = formData.get('extracto') as string;
  const contenido = formData.get('contenido') as string || '';
  const file = formData.get('uploadTarget') as File | null;
  const publicado = formData.get('publicado') === 'true';
  const fechaPublicacion = formData.get('fechaPublicacion') as string;

  let imagenUrl = formData.get('imagenUrl') as string | null;

  if (file && file.size > 0) {
    imagenUrl = await uploadToCloudinary(file);
  }

  const updateData: any = {
    titulo,
    categoriaId: isNaN(categoriaId) ? null : categoriaId,
    autorId: isNaN(autorId) ? null : autorId,
    extracto,
    contenido,
    publicado,
    updatedAt: new Date(),
  };

  if (imagenUrl) {
    updateData.imagenUrl = imagenUrl;
  }
  
  if (fechaPublicacion) {
    updateData.createdAt = new Date(fechaPublicacion + 'T12:00:00');
  }

  await db
    .update(journal)
    .set(updateData)
    .where(eq(journal.id, id));

  revalidatePath('/admin/journal');
  revalidatePath('/', 'layout');
  revalidatePath('/journal', 'layout');
}

export async function deleteJournalConfig(id: number) {
  await db.delete(journal).where(eq(journal.id, id));
  revalidatePath('/admin/journal');
  revalidatePath('/', 'layout');
  revalidatePath('/journal', 'layout');
}

export async function toggleJournalPublicado(id: number, publicado: boolean) {
  await db.update(journal).set({ publicado, updatedAt: new Date() }).where(eq(journal.id, id));
  revalidatePath('/admin/journal');
  revalidatePath('/', 'layout');
  revalidatePath('/journal', 'layout');
}

export async function purgeOldJournal() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Inicio del día

  // Eliminar eventos pasados (noticias de años anteriores o meses anteriores)
  await db.delete(journal).where(lt(journal.createdAt, hoy));
  
  revalidatePath('/admin/journal');
  revalidatePath('/', 'layout');
  revalidatePath('/journal', 'layout');
}
