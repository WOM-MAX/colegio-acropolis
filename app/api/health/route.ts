import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    status: 'starting',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length ?? 0,
      // Show host part only (no password)
      DATABASE_HOST: process.env.DATABASE_URL
        ? new URL(process.env.DATABASE_URL).hostname
        : 'NOT_SET',
    },
  };

  // Test database connection with timeout
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB query timed out after 10s')), 10000)
    );

    const queryPromise = sql`SELECT 1 as ok, NOW() as server_time`;

    const result = await Promise.race([queryPromise, timeoutPromise]) as any;

    diagnostics.database = {
      connected: true,
      serverTime: result[0]?.server_time,
    };
    diagnostics.status = 'healthy';
  } catch (err: any) {
    diagnostics.database = {
      connected: false,
      error: err.message,
      code: err.code,
    };
    diagnostics.status = 'unhealthy';
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.status === 'healthy' ? 200 : 503,
  });
}
