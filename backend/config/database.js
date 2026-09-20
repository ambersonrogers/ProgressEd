const { Pool } = require('pg');
require('dotenv').config();
const localDb = require('./localDb');

let pool = null;
let useLocalDb = false;
let checkDone = false;

// Se não houver DATABASE_URL ou se for explicitamente forçado local
if (!process.env.DATABASE_URL || process.env.USE_LOCAL_DB === 'true') {
    useLocalDb = true;
    checkDone = true;
    console.log('⚡ ProgressEd Backend: Utilizando Banco de Dados Local Resiliente (110 desafios BNCC carregados).');
} else {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 3500
        });

        // Teste inicial rápido de conexão
        pool.query('SELECT NOW()')
            .then(() => {
                checkDone = true;
                console.log('✅ Conexão com PostgreSQL / Supabase na nuvem estabelecida com sucesso!');
            })
            .catch((err) => {
                useLocalDb = true;
                checkDone = true;
                console.warn('\n=============================================================');
                console.warn('⚠️  AVISO DE CONEXÃO COM BANCO REMOTO:');
                console.warn('   Não foi possível conectar ao Supabase / PostgreSQL:');
                console.warn(`   Motivo: ${err.message}`);
                console.warn('   (Isso ocorre quando o Supabase está pausado por inatividade ou Railway expirou)');
                console.warn('🚀 ATIVANDO AUTOMATICAMENTE O BANCO LOCAL RESILIENTE!');
                console.warn('   - 110 desafios BNCC disponíveis');
                console.warn('   - Login imediato: aluno@progressed.com (senha: 123456)');
                console.warn('   - Login professor: professor@progressed.com (senha: 123456)');
                console.warn('=============================================================\n');
            });
    } catch (e) {
        useLocalDb = true;
        checkDone = true;
    }
}

// Adaptador compatível com pg.Pool que nunca deixa a aplicação falhar
const dbAdapter = {
    async query(text, params = []) {
        if (useLocalDb) {
            return await localDb.query(text, params);
        }

        try {
            return await pool.query(text, params);
        } catch (error) {
            console.warn(`⚠️ Falha na query remota (${error.code || error.message}). Redirecionando para banco local.`);
            useLocalDb = true; // Alterna para local se a nuvem cair
            return await localDb.query(text, params);
        }
    },

    async end() {
        if (pool) {
            try {
                await pool.end();
            } catch (_) {}
        }
        await localDb.end();
    }
};

module.exports = dbAdapter;