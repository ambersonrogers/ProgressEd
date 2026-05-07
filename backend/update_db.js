const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

async function updateDb() {
    console.log('📡 Conectando ao banco para atualizar questões...');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const sql = fs.readFileSync('populate_challenges.sql', 'utf8');
        await pool.query(sql);
        console.log('✅ Banco de dados atualizado com sucesso!');
    } catch (err) {
        console.log('❌ ERRO:', err.message);
    } finally {
        await pool.end();
    }
}

updateDb();
