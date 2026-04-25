'use server';

import { db } from '@/lib/db';
import { configuracionSitio } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ── Types ──────────────────────────────────────────────────
export type RedSocial = {
  plataforma: string;
  url: string;
  mostrarEn: 'header' | 'footer' | 'ambos';
  orden: number;
};

export type Telefono = {
  etiqueta: string;
  numero: string;
  tipo: 'fijo' | 'celular' | 'whatsapp';
};

export type Email = {
  etiqueta: string;
  email: string;
};

export type SiteConfig = {
  id?: number;
  redesSociales: RedSocial[];
  telefonos: Telefono[];
  emails: Email[];
  direccion: string;
  mapaEmbedUrl: string;
};

// ── GET ────────────────────────────────────────────────────
export async function getConfiguracion(): Promise<SiteConfig> {
  const rows = await db.select().from(configuracionSitio).limit(1);

  if (rows.length === 0) {
    return {
      redesSociales: [
        { plataforma: 'facebook', url: 'https://facebook.com/colegioacropolispuentealto', mostrarEn: 'ambos', orden: 1 },
        { plataforma: 'instagram', url: 'https://instagram.com/colegio_acropolis_oficial', mostrarEn: 'ambos', orden: 2 },
      ],
      telefonos: [{ etiqueta: 'Principal', numero: '+56 2 2269 1234', tipo: 'fijo' }],
      emails: [{ etiqueta: 'Contacto', email: 'contacto@colegioacropolis.net' }],
      direccion: 'Puente Alto, Santiago, Chile',
      mapaEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.513575971932!2d-70.58434692430852!3d-33.59196340408544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d73fc9ba3bc7%3A0xc3b0704443a75!2sColegio%20Acr%C3%B3polis!5e0!3m2!1ses-419!2scl!4v1713180415250!5m2!1ses-419!2scl',
    };
  }

  const row = rows[0];
  return {
    id: row.id,
    redesSociales: (row.redesSociales as RedSocial[]) || [],
    telefonos: (row.telefonos as Telefono[]) || [],
    emails: (row.emails as Email[]) || [],
    direccion: row.direccion || '',
    mapaEmbedUrl: row.mapaEmbedUrl || '',
  };
}

// ── SAVE (upsert) ──────────────────────────────────────────
export async function saveConfiguracion(data: SiteConfig) {
  try {
    const cleanData = {
      ...data,
      direccion: data.direccion.trim(),
      mapaEmbedUrl: data.mapaEmbedUrl.trim(),
      redesSociales: data.redesSociales.map(r => ({ ...r, url: r.url.trim() })),
      telefonos: data.telefonos.map(t => ({ ...t, etiqueta: t.etiqueta.trim(), numero: t.numero.trim() })),
      emails: data.emails.map(e => ({ ...e, etiqueta: e.etiqueta.trim(), email: e.email.trim() })),
    };

    const existing = await db.select({ id: configuracionSitio.id }).from(configuracionSitio).limit(1);

    if (existing.length > 0) {
      await db
        .update(configuracionSitio)
        .set({
          redesSociales: cleanData.redesSociales,
          telefonos: cleanData.telefonos,
          emails: cleanData.emails,
          direccion: cleanData.direccion,
          mapaEmbedUrl: cleanData.mapaEmbedUrl,
          updatedAt: new Date(),
        })
        .where(eq(configuracionSitio.id, existing[0].id));
    } else {
      await db.insert(configuracionSitio).values({
        redesSociales: cleanData.redesSociales,
        telefonos: cleanData.telefonos,
        emails: cleanData.emails,
        direccion: cleanData.direccion,
        mapaEmbedUrl: cleanData.mapaEmbedUrl,
      });
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
