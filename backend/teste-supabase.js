const { Pool } = require('pg');
require('dotenv').config();

async function testar() {
    console.log('📡 Testando conexao...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        const res = await pool.query('SELECT NOW() as hora');
        console.log('✅ CONECTADO!', res.rows[0].hora);
    } catch (err) {
        console.log('❌ ERRO:', err.message);
    }
}

testar();