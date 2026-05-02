'use server';
import { requireAdmin } from '@/lib/auth-guard';


import { db } from '@/lib/db';
import { matriculaConfig } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateMatriculaConfig(formData: FormData) {
  await requireAdmin();
  const activo = formData.get('activo') === 'true';
  const periodoNuevosInicio = formData.get('periodoNuevosInicio') as string || null;
  const periodoNuevosFin = formData.get('periodoNuevosFin') as string || null;
  const periodoAntiguosInicio = formData.get('periodoAntiguosInicio') as string || null;
  const periodoAntiguosFin = formData.get('periodoAntiguosFin') as string || null;
  const enlaceFormularioNuevos = formData.get('enlaceFormularioNuevos') as string || null;
  const enlaceFormularioAntiguos = formData.get('enlaceFormularioAntiguos') as string || null;
  const mensajeInformativo = formData.get('mensajeInformativo') as string || null;
  const rawAntiguos = formData.get('mensajesAntiguos') as string || '';
  const mensajesAntiguos = rawAntiguos.split('\n').map(s => s.trim()).filter(Boolean);
  const rawNuevos = formData.get('mensajesNuevos') as string || '';
  const mensajesNuevos = rawNuevos.split('\n').map(s => s.trim()).filter(Boolean);

  // Actualizamos el registro id 1 (siempre existirá solo este o lo creamos si no existe)
  const existing = await db.select().from(matriculaConfig).where(eq(matriculaConfig.id, 1));
  
  if (existing.length === 0) {
    await db.insert(matriculaConfig).values({
      id: 1,
      activo,
      periodoNuevosInicio,
      periodoNuevosFin,
      periodoAntiguosInicio,
      periodoAntiguosFin,
      enlaceFormularioNuevos,
      enlaceFormularioAntiguos,
      mensajeInformativo,
      mensajesAntiguos,
      mensajesNuevos,
    });
  } else {
    await db
      .update(matriculaConfig)
      .set({
        activo,
        periodoNuevosInicio,
        periodoNuevosFin,
        periodoAntiguosInicio,
        periodoAntiguosFin,
        enlaceFormularioNuevos,
        enlaceFormularioAntiguos,
        mensajeInformativo,
        mensajesAntiguos,
        mensajesNuevos,
        updatedAt: new Date(),
      })
      .where(eq(matriculaConfig.id, 1));
  }

  revalidatePath('/admin/matricula');
  revalidatePath('/');
  revalidatePath('/admision');
  revalidatePath('/matricula');
}
