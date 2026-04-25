'use server';

import { db } from '@/lib/db';
import { centroPadresDirectiva } from '@/lib/db/schema';
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

export async function createDirectiva(formData: FormData) {
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
  await db.delete(centroPadresDirectiva).where(eq(centroPadresDirectiva.id, id));
  revalidatePath('/admin/centro-de-padres');
  revalidatePath('/');
  revalidatePath('/centro-de-padres');
}
