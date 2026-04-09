const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkFullStructure() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'challenges'
      ORDER BY ordinal_position
    `);
    console.log('Estrutura completa da tabela challenges:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable}) default: ${row.column_default}`);
    });
  } catch (error) {
    console.log('Erro:', error.message);
  } finally {
    pool.end();
  }
}

checkFullStructure();