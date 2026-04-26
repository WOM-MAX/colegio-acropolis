'use server';

import { db } from '@/lib/db';
import { journalAutores } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createAutor(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const cargo = formData.get('cargo') as string;
  const correoInstitucional = formData.get('correoInstitucional') as string | null;
  let fotoUrl = formData.get('fotoUrl') as string | null;

  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    fotoUrl = await saveUploadedFile(file);
  }

  await db.insert(journalAutores).values({
    nombre,
    cargo,
    correoInstitucional: correoInstitucional || null,
    fotoUrl: fotoUrl || null
  });

  revalidatePath('/admin/journal/autores');
  revalidatePath('/admin/journal/nuevo');
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  redirect('/admin/journal/autores');
}

export async function updateAutor(id: number, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const cargo = formData.get('cargo') as string;
  const correoInstitucional = formData.get('correoInstitucional') as string | null;
  let fotoUrl = formData.get('fotoUrl') as string | null;

  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    fotoUrl = await saveUploadedFile(file);
  }

  await db
    .update(journalAutores)
    .set({
      nombre,
      cargo,
      correoInstitucional: correoInstitucional || null,
      fotoUrl: fotoUrl || null
    })
    .where(eq(journalAutores.id, id));

  revalidatePath('/admin/journal/autores');
  revalidatePath('/admin/journal/nuevo');
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  redirect('/admin/journal/autores');
}

export async function deleteAutor(id: number) {
  await db.delete(journalAutores).where(eq(journalAutores.id, id));
  revalidatePath('/admin/journal/autores');
  revalidatePath('/admin/journal/nuevo');
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
}
