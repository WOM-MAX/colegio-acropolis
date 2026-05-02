'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { popups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createPopup(formData: FormData) {
  await requireAdmin();
  const titulo = formData.get('titulo') as string;
  const contenido = formData.get('contenido') as string;
  const tipo = formData.get('tipo') as string;
  const botonTexto = formData.get('botonTexto') as string | null;
  const botonUrl = formData.get('botonUrl') as string | null;
  const fechaInicio = formData.get('fechaInicio') as string;
  const fechaFin = formData.get('fechaFin') as string;
  const activo = formData.get('activo') === 'true';
  const frecuencia = formData.get('frecuencia') as string;
  const prioridad = parseInt(formData.get('prioridad') as string, 10);

  const posicion = formData.get('posicion') as string;
  const estiloImagen = formData.get('estiloImagen') as string;
  const colorFondo = formData.get('colorFondo') as string;
  const colorTexto = formData.get('colorTexto') as string;
  const colorBoton = (formData.get('colorBoton') as string) || '#4661F6';
  const tamanoTitulo = formData.get('tamanoTitulo') as string;

  let imagenUrl = formData.get('imagenUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    imagenUrl = await saveUploadedFile(file);
  }

  await db.insert(popups).values({
    titulo,
    contenido,
    imagenUrl: imagenUrl || null,
    tipo,
    botonTexto: botonTexto || null,
    botonUrl: botonUrl || null,
    posicion,
    estiloImagen,
    colorFondo,
    colorTexto,
    colorBoton,
    tamanoTitulo,
    fechaInicio,
    fechaFin,
    activo,
    frecuencia,
    prioridad,
  });

  revalidatePath('/admin/popups');
  revalidatePath('/');
  redirect('/admin/popups');
}

export async function updatePopup(id: number, formData: FormData) {
  await requireAdmin();
  const titulo = formData.get('titulo') as string;
  const contenido = formData.get('contenido') as string;
  const tipo = formData.get('tipo') as string;
  const botonTexto = formData.get('botonTexto') as string | null;
  const botonUrl = formData.get('botonUrl') as string | null;
  const fechaInicio = formData.get('fechaInicio') as string;
  const fechaFin = formData.get('fechaFin') as string;
  const activo = formData.get('activo') === 'true';
  const frecuencia = formData.get('frecuencia') as string;
  const prioridad = parseInt(formData.get('prioridad') as string, 10);

  const posicion = formData.get('posicion') as string;
  const estiloImagen = formData.get('estiloImagen') as string;
  const colorFondo = formData.get('colorFondo') as string;
  const colorTexto = formData.get('colorTexto') as string;
  const colorBoton = (formData.get('colorBoton') as string) || '#4661F6';
  const tamanoTitulo = formData.get('tamanoTitulo') as string;

  let imagenUrl = formData.get('imagenUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;
  if (file && file.size > 0) {
    imagenUrl = await saveUploadedFile(file);
  }

  await db
    .update(popups)
    .set({
      titulo,
      contenido,
      imagenUrl: imagenUrl || null,
      tipo,
      botonTexto: botonTexto || null,
      botonUrl: botonUrl || null,
      posicion,
      estiloImagen,
      colorFondo,
      colorTexto,
      colorBoton,
      tamanoTitulo,
      fechaInicio,
      fechaFin,
      activo,
      frecuencia,
      prioridad,
      updatedAt: new Date(),
    })
    .where(eq(popups.id, id));

  revalidatePath('/admin/popups');
  revalidatePath('/');
  redirect('/admin/popups');
}

export async function deletePopup(id: number) {
  await requireAdmin();
  await db.delete(popups).where(eq(popups.id, id));
  revalidatePath('/admin/popups');
  revalidatePath('/');
}

export async function togglePopupActivo(id: number, activo: boolean) {
  await requireAdmin();
  await db.update(popups).set({ activo, updatedAt: new Date() }).where(eq(popups.id, id));
  revalidatePath('/admin/popups');
  revalidatePath('/');
}
