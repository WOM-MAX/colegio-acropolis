import { getSession } from './auth';

/**
 * Verifica si existe una sesión válida de administrador.
 * Lanza un error si no hay sesión, lo que detiene la ejecución de la Server Action.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
