'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { centroPadresDirectiva } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createDirectiva(formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const cargo = formData.get('cargo') as string;
  const email = formData.get('email') as string | null;
  const periodo = formData.get('periodo') as string | null;
  const orden = parseInt(formData.get('orden') as string, 10);

  let fotoUrl = formData.get('fotoUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    fotoUrl = await saveUploadedFile(file);
  }

  await db.insert(centroPadresDirectiva).values({
    nombre,
    cargo,
    fotoUrl: fotoUrl || null,
    email: email || null,
    periodo: periodo || null,
    orden,
  });

  revalidatePath('/admin/centro-de-padres');
  revalidatePath('/');
  revalidatePath('/centro-de-padres');
  redirect('/admin/centro-de-padres');
}

export async function updateDirectiva(id: number, formData: FormData) {
  await requireAdmin();
  const nombre = formData.get('nombre') as string;
  const cargo = formData.get('cargo') as string;
  const email = formData.get('email') as string | null;
  const periodo = formData.get('periodo') as string | null;
  const orden = parseInt(formData.get('orden') as string, 10);

  let fotoUrl = formData.get('fotoUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    fotoUrl = await saveUploadedFile(file);
  }

  await db
    .update(centroPadresDirectiva)
    .set({
      nombre,
      cargo,
      fotoUrl: fotoUrl || null,
      email: email || null,
      periodo: periodo || null,
      orden,
      updatedAt: new Date(),
    })
    .where(eq(centroPadresDirectiva.id, id));

  revalidatePath('/admin/centro-de-padres');
  revalidatePath('/');
  revalidatePath('/centro-de-padres');
  redirect('/admin/centro-de-padres');
}

export async function deleteDirectiva(id: number) {
  await requireAdmin();
  await db.delete(centroPadresDirectiva).where(eq(centroPadresDirectiva.id, id));
  revalidatePath('/admin/centro-de-padres');
  revalidatePath('/');
  revalidatePath('/centro-de-padres');
}
