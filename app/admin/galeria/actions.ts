'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { galeriaAlbumes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createAlbum(formData: FormData) {
  await requireAdmin();
  const titulo = formData.get('titulo') as string;
  const descripcion = formData.get('descripcion') as string | null;
  const fecha = formData.get('fecha') as string | null;
  const activo = formData.get('activo') === 'true';

  // Handle file upload for cover image
  let portadaUrl = formData.get('portadaUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;

  if (file && file.size > 0) {
    portadaUrl = await saveUploadedFile(file);
  }

  await db.insert(galeriaAlbumes).values({
    titulo,
    descripcion: descripcion || null,
    portadaUrl: portadaUrl || null,
    fecha: fecha || null,
    activo,
  });

  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
  redirect('/admin/galeria');
}

export async function updateAlbum(id: number, formData: FormData) {
  await requireAdmin();
  const titulo = formData.get('titulo') as string;
  const descripcion = formData.get('descripcion') as string | null;
  const fecha = formData.get('fecha') as string | null;
  const activo = formData.get('activo') === 'true';

  // Handle file upload for cover image
  let portadaUrl = formData.get('portadaUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;

  if (file && file.size > 0) {
    portadaUrl = await saveUploadedFile(file);
  }

  await db
    .update(galeriaAlbumes)
    .set({
      titulo,
      descripcion: descripcion || null,
      portadaUrl: portadaUrl || null,
      fecha: fecha || null,
      activo,
      updatedAt: new Date(),
    })
    .where(eq(galeriaAlbumes.id, id));

  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
  redirect('/admin/galeria');
}

export async function deleteAlbum(id: number) {
  await requireAdmin();
  await db.delete(galeriaAlbumes).where(eq(galeriaAlbumes.id, id));
  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
}

export async function toggleAlbumActivo(id: number, activo: boolean) {
  await requireAdmin();
  await db.update(galeriaAlbumes).set({ activo, updatedAt: new Date() }).where(eq(galeriaAlbumes.id, id));
  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
}
