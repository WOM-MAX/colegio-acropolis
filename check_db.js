const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql`SELECT datname, usename, client_addr, application_name, state, query, backend_type FROM pg_stat_activity WHERE state IS NOT NULL AND backend_type = 'client backend'`
  .then(console.log)
  .catch(console.error);
