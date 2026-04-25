'use server';

import { db } from '@/lib/db';
import { mensajesContacto } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleMensajeLeido(id: number, leido: boolean) {
  await db.update(mensajesContacto).set({ leido }).where(eq(mensajesContacto.id, id));
  revalidatePath('/admin/mensajes');
  revalidatePath('/admin');
}

export async function deleteMensaje(id: number) {
  await db.delete(mensajesContacto).where(eq(mensajesContacto.id, id));
  revalidatePath('/admin/mensajes');
  revalidatePath('/admin');
}
