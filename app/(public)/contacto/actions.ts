'use server';

import { db } from '@/lib/db';
import { mensajesContacto } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

// ── Rate Limiting en Memoria (por IP, reinicia al reiniciar servidor) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;         // Máximo 3 mensajes
const RATE_LIMIT_WINDOW = 600000; // En 10 minutos (ms)

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function sendContactMessage(prevState: any, formData: FormData) {
  try {
    // ── 1. Honeypot Anti-Bot ──────────────────────────────────
    // Campo oculto que los bots llenan automáticamente
    const honeypot = formData.get('website') as string;
    if (honeypot) {
      // Bot detectado: simular éxito para no revelar la protección
      return { error: null, success: true };
    }

    // ── 2. Rate Limiting por IP ──────────────────────────────
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return { error: 'Has enviado demasiados mensajes. Intenta de nuevo en unos minutos.', success: false };
    }

    // ── 3. Validación de campos ──────────────────────────────
    const nombre = (formData.get('nombre') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const asunto = (formData.get('asunto') as string)?.trim();
    const mensaje = (formData.get('contenido') as string)?.trim();

    if (!nombre || !email || !asunto || !mensaje) {
      return { error: 'Por favor completa todos los campos', success: false };
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Por favor ingresa un correo electrónico válido.', success: false };
    }

    // Validación de longitud máxima
    if (nombre.length > 100 || email.length > 255 || asunto.length > 200 || mensaje.length > 5000) {
      return { error: 'Uno o más campos superan la longitud máxima permitida.', success: false };
    }

    // ── 4. Insertar en la base de datos ──────────────────────
    await db.insert(mensajesContacto).values({
      nombre,
      email,
      asunto,
      mensaje,
    });

    revalidatePath('/admin/mensajes');
    return { error: null, success: true };
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return { error: 'Ocurrió un error inesperado al mandar tu mensaje.', success: false };
  }
}
