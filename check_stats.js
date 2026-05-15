const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS pg_stat_statements;`;
    const res = await sql`SELECT query, calls FROM pg_stat_statements ORDER BY calls DESC LIMIT 20`;
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
}
check();
