import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function setAdminPassword() {
  const email = process.argv[2] || 'admin@colegioacropolis.net';
  const password = process.argv[3];

  if (!password) {
    console.error('❌ Error: Debes proporcionar una contraseña.');
    console.error('Uso: npx tsx scripts/set_admin.ts <email> <nueva_contraseña>');
    console.error('Ejemplo: npx tsx scripts/set_admin.ts admin@colegioacropolis.net MiNuevaClaveSegura123');
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL no configurada. Agrega la variable al .env');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  console.log(`🔐 Generando hash para el usuario: ${email}...`);
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const existingUser = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('Usuario encontrado. Actualizando contraseña...');
      await db
        .update(schema.adminUsers)
        .set({ passwordHash })
        .where(eq(schema.adminUsers.email, email));
      console.log('✅ Contraseña actualizada correctamente.');
    } else {
      console.log('Usuario no encontrado. Creando nuevo administrador...');
      await db.insert(schema.adminUsers).values({
        email,
        passwordHash,
      });
      console.log('✅ Administrador creado correctamente.');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar la base de datos:', error);
  }
}

setAdminPassword().catch((err) => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
