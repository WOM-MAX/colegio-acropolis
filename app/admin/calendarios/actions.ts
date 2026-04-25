'use server';

import { db } from '@/lib/db';
import { calendariosEvaluaciones } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleCalendario(id: number, activo: boolean) {
  await db
    .update(calendariosEvaluaciones)
    .set({ activo })
    .where(eq(calendariosEvaluaciones.id, id));
  
  revalidatePath('/admin/calendarios');
  revalidatePath('/');
}

export async function updateCalendarioEnlace(id: number, enlace: string) {
  await db
    .update(calendariosEvaluaciones)
    .set({ enlace, activo: enlace.trim() !== '' }) // Activar automáticamente si ponen enlace
    .where(eq(calendariosEvaluaciones.id, id));
  
  revalidatePath('/admin/calendarios');
  revalidatePath('/');
}
