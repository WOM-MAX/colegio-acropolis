import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      // Se eliminó la validación de la base de datos en el health check 
      // para evitar que la base de datos de Neon esté activa 24/7 y consuma CU hours.
    },
  };

  return NextResponse.json(diagnostics, {
    status: 200,
  });
}
