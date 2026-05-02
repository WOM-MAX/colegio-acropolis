'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { coordinaciones } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createCoordinacion(formData: FormData) {
  await requireAdmin();
  const nombreUnidad = formData.get('nombreUnidad') as string;
  const encargada = formData.get('encargada') as string;
  const tituloProfesional = formData.get('tituloProfesional') as string | null;
  const resenaProfesional = formData.get('resenaProfesional') as string | null;
  const correoInstitucional = formData.get('correoInstitucional') as string | null;
  const funciones = formData.get('funciones') as string;
  const orden = parseInt(formData.get('orden') as string, 10);

  let fotoUrl = formData.get('fotoUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    fotoUrl = await saveUploadedFile(file);
  }

  await db.insert(coordinaciones).values({
    nombreUnidad,
    encargada,
    tituloProfesional: tituloProfesional || null,
    resenaProfesional: resenaProfesional || null,
    correoInstitucional: correoInstitucional || null,
    fotoUrl: fotoUrl || null,
    funciones,
    orden,
  });

  revalidatePath('/admin/coordinaciones');
  revalidatePath('/');
  revalidatePath('/coordinaciones');
  redirect('/admin/coordinaciones');
}

export async function updateCoordinacion(id: number, formData: FormData) {
  await requireAdmin();
  const nombreUnidad = formData.get('nombreUnidad') as string;
  const encargada = formData.get('encargada') as string;
  const tituloProfesional = formData.get('tituloProfesional') as string | null;
  const resenaProfesional = formData.get('resenaProfesional') as string | null;
  const correoInstitucional = formData.get('correoInstitucional') as string | null;
  const funciones = formData.get('funciones') as string;
  const orden = parseInt(formData.get('orden') as string, 10);

  let fotoUrl = formData.get('fotoUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    fotoUrl = await saveUploadedFile(file);
  }

  await db
    .update(coordinaciones)
    .set({
      nombreUnidad,
      encargada,
      tituloProfesional: tituloProfesional || null,
      resenaProfesional: resenaProfesional || null,
      correoInstitucional: correoInstitucional || null,
      fotoUrl: fotoUrl || null,
      funciones,
      orden,
      updatedAt: new Date(),
    })
    .where(eq(coordinaciones.id, id));

  revalidatePath('/admin/coordinaciones');
  revalidatePath('/');
  revalidatePath('/coordinaciones');
  redirect('/admin/coordinaciones');
}

export async function deleteCoordinacion(id: number) {
  await requireAdmin();
  await db.delete(coordinaciones).where(eq(coordinaciones.id, id));
  revalidatePath('/admin/coordinaciones');
  revalidatePath('/');
  revalidatePath('/coordinaciones');
}
