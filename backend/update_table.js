const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateTableStructure() {
  try {
    console.log('Adicionando coluna subject...');
    await pool.query('ALTER TABLE challenges ADD COLUMN IF NOT EXISTS subject VARCHAR(50)');

    console.log('✅ Coluna subject adicionada com sucesso!');
    console.log('Agora você pode executar o script populate_challenges.sql no Supabase SQL Editor');

  } catch (error) {
    console.log('❌ Erro:', error.message);
  } finally {
    pool.end();
  }
}

updateTableStructure();