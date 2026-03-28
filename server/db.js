import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;

// Log successful connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL pool connected');
});

// Log any pool error
pool.on('error', (err) => {
  console.error('❌ Unexpected pool error:', err);
});