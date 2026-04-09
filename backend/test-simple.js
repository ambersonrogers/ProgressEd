const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testar() {
    try {
        const res = await pool.query('SELECT NOW() as hora');
        console.log('✅ CONECTADO COM SUCESSO!');
        console.log('📅 Hora do servidor:', res.rows[0].hora);
        console.log('🎉 ProgressEd está pronto para funcionar!');
    } catch (err) {
        console.log('❌ ERRO:', err.message);
    }
}

testar();