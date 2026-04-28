import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    try {
      const users = await db
        .select({
          id: adminUsers.id,
          email: adminUsers.email,
          passwordHash: adminUsers.passwordHash,
        })
        .from(adminUsers)
        .where(eq(adminUsers.email, email))
        .limit(1);

      if (users.length > 0) {
        const user = users[0];
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (isValid) {
          const token = await createSession({ userId: user.id, email: user.email });
          await setSessionCookie(token);
          return NextResponse.json({ success: true });
        }
      }
    } catch (e) {
      console.warn("DB login falló, usando mock", e);
    }



    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
