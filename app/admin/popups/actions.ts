'use server';

import { db } from '@/lib/db';
import { popups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import pkg from 'fs';
const { promises: fs } = pkg;
import path from 'path';

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function createPopup(formData: FormData) {
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
  await db.delete(popups).where(eq(popups.id, id));
  revalidatePath('/admin/popups');
  revalidatePath('/');
}

export async function togglePopupActivo(id: number, activo: boolean) {
  await db.update(popups).set({ activo, updatedAt: new Date() }).where(eq(popups.id, id));
  revalidatePath('/admin/popups');
  revalidatePath('/');
}
