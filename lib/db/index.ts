import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Conexión lazy a Neon PostgreSQL.
 * Usar Connection Pooling (puerto 6543) obligatoriamente para Railway.
 * La conexión se crea bajo demanda para evitar errores en build sin DATABASE_URL.
 */
function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL no está configurado. Configúralo en las variables de entorno.'
    );
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

// Singleton para reutilizar la conexión
let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// Exportación por conveniencia (se usa en runtime, no en build)
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
