'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { descargas } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createDescarga(formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const categoria = formData.get('categoria') as string;
  const archivoUrl = formData.get('archivoUrl') as string;
  const version = formData.get('version') as string | null;
  const colorAcento = formData.get('colorAcento') as string || 'azul';

  let imagenUrl = formData.get('imagenUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    imagenUrl = await saveUploadedFile(file);
  }

  await db.insert(descargas).values({
    nombre,
    categoria,
    archivoUrl,
    version: version || null,
    imagenUrl: imagenUrl || null,
    colorAcento,
  });

  revalidatePath('/admin/descargas');
  revalidatePath('/');
  revalidatePath('/descargas');
  redirect('/admin/descargas');
}

export async function updateDescarga(id: number, formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const categoria = formData.get('categoria') as string;
  const archivoUrl = formData.get('archivoUrl') as string;
  const version = formData.get('version') as string | null;
  const colorAcento = formData.get('colorAcento') as string || 'azul';

  let imagenUrl = formData.get('imagenUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    imagenUrl = await saveUploadedFile(file);
  }

  await db
    .update(descargas)
    .set({
      nombre,
      categoria,
      archivoUrl,
      version: version || null,
      imagenUrl: imagenUrl || null,
      colorAcento,
      updatedAt: new Date(),
    })
    .where(eq(descargas.id, id));

  revalidatePath('/admin/descargas');
  revalidatePath('/');
  revalidatePath('/descargas');
  redirect('/admin/descargas');
}

export async function deleteDescarga(id: number) {
  await requireAdmin();
  await db.delete(descargas).where(eq(descargas.id, id));
  revalidatePath('/admin/descargas');
  revalidatePath('/');
  revalidatePath('/descargas');
}
