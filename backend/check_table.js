const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTableStructure() {
  try {
    const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'challenges' ORDER BY ordinal_position");
    console.log('Colunas da tabela challenges:');
    result.rows.forEach(row => {
      console.log('  -', row.column_name);
    });
  } catch (error) {
    console.log('Erro:', error.message);
  } finally {
    pool.end();
  }
}

checkTableStructure();