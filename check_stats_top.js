const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const res = await sql`SELECT query, calls FROM pg_stat_statements ORDER BY calls DESC LIMIT 10`;
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
}
check();
