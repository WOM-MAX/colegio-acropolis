'use server';

import { db } from '@/lib/db';
import { eventos } from '@/lib/db/schema';
import { eq, lt } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createEvento(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const fecha = formData.get('fecha') as string;
  const descripcion = formData.get('descripcion') as string;
  const tipo = formData.get('tipo') as string;
  const activo = formData.get('activo') === 'true';

  let imagenUrl = (formData.get('imagenUrl') as string) || null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    imagenUrl = await saveUploadedFile(file);
  }

  await db.insert(eventos).values({
    nombre,
    fecha,
    descripcion,
    tipo,
    imagenUrl,
    activo,
  });

  revalidatePath('/admin/eventos');
  revalidatePath('/');
  revalidatePath('/api/eventos');
  redirect('/admin/eventos');
}

export async function updateEvento(id: number, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const fecha = formData.get('fecha') as string;
  const descripcion = formData.get('descripcion') as string;
  const tipo = formData.get('tipo') as string;
  const activo = formData.get('activo') === 'true';

  let imagenUrl = (formData.get('imagenUrl') as string) || null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    imagenUrl = await saveUploadedFile(file);
  }

  await db
    .update(eventos)
    .set({
      nombre,
      fecha,
      descripcion,
      tipo,
      imagenUrl,
      activo,
      updatedAt: new Date(),
    })
    .where(eq(eventos.id, id));

  revalidatePath('/admin/eventos');
  revalidatePath('/');
  revalidatePath('/api/eventos');
  redirect('/admin/eventos');
}

export async function deleteEvento(id: number) {
  await db.delete(eventos).where(eq(eventos.id, id));
  revalidatePath('/admin/eventos');
  revalidatePath('/');
  revalidatePath('/api/eventos');
}

export async function toggleEventoActivo(id: number, activo: boolean) {
  await db.update(eventos).set({ activo, updatedAt: new Date() }).where(eq(eventos.id, id));
  revalidatePath('/admin/eventos');
  revalidatePath('/');
  revalidatePath('/api/eventos');
}

export async function purgeOldEventos() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const hoyString = hoy.toISOString().split('T')[0];

  await db.delete(eventos).where(lt(eventos.fecha, hoyString));
  
  revalidatePath('/admin/eventos');
  revalidatePath('/');
  revalidatePath('/api/eventos');
}
