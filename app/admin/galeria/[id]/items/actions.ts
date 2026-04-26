'use server';

import { db } from '@/lib/db';
import { galeriaFotos } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

export async function createGaleriaItem(albumId: number, formData: FormData) {
  const tipo = formData.get('tipo') as string || 'imagen';
  const videoUrl = formData.get('videoUrl') as string | null;
  const caption = formData.get('caption') as string;

  // Handle file upload
  let imagenUrl = formData.get('imagenUrl') as string | null;
  const file = formData.get('uploadTarget') as File | null;

  if (file && file.size > 0) {
    imagenUrl = await saveUploadedFile(file);
  }

  if (!imagenUrl) {
    throw new Error('La imagen (o miniatura) es obligatoria.');
  }
  if (tipo === 'video' && !videoUrl) {
    throw new Error('La URL del video es obligatoria al seleccionar tipo "video".');
  }

  await db.insert(galeriaFotos).values({
    albumId,
    tipo,
    imagenUrl,
    videoUrl: tipo === 'video' ? videoUrl : null,
    caption: caption || null,
  });

  revalidatePath(`/admin/galeria/${albumId}/items`);
  revalidatePath('/galeria');
}

// Subida masiva de múltiples imágenes a la vez
export async function createMultipleGaleriaItems(albumId: number, formData: FormData) {
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    throw new Error('Selecciona al menos un archivo.');
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  for (const file of files) {
    if (file.size === 0) continue;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    const imagenUrl = `/uploads/${fileName}`;

    await db.insert(galeriaFotos).values({
      albumId,
      tipo: 'imagen',
      imagenUrl,
      caption: null,
    });
  }

  revalidatePath(`/admin/galeria/${albumId}/items`);
  revalidatePath('/galeria');
}

export async function deleteGaleriaItem(albumId: number, itemId: number) {
  await db.delete(galeriaFotos).where(eq(galeriaFotos.id, itemId));
  revalidatePath(`/admin/galeria/${albumId}/items`);
  revalidatePath('/galeria');
}
