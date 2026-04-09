const pool = require('./config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('senha123', 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, xp, level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      ['João Teste', 'joao@test.com', hashedPassword, 'student', 250, 1]
    );
    console.log('✅ Usuário criado com ID:', result.rows[0].id);
  } catch (error) {
    if (error.code === '23505') {
      console.log('⚠️ Usuário já existe');
    } else {
      console.error('❌ Erro:', error.message);
    }
  } finally {
    await pool.end();
  }
}

createTestUser();
