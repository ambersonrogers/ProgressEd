const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Desafios de exemplo para testar
const sampleChallenges = [
  {
    title: 'Raiz Quadrada Básica',
    description: 'Questão básica de matemática sobre raiz quadrada',
    question: 'Qual é a raiz quadrada de 144?',
    option_a: '10',
    option_b: '11',
    option_c: '12',
    option_d: '13',
    correct_answer: 'C',
    xp_reward: 10,
    difficulty: 1,
    subject: 'Matemática',
    module_id: 1
  },
  {
    title: 'Porcentagem Simples',
    description: 'Cálculo de porcentagem básica',
    question: 'Quanto é 15% de 200?',
    option_a: '25',
    option_b: '30',
    option_c: '35',
    option_d: '40',
    correct_answer: 'B',
    xp_reward: 10,
    difficulty: 1,
    subject: 'Matemática',
    module_id: 1
  },
  {
    title: 'Símbolo do Oxigênio',
    description: 'Conhecimento básico de química',
    question: 'Qual é o símbolo do Oxigênio?',
    option_a: 'O',
    option_b: 'Ox',
    option_c: 'O2',
    option_d: 'O3',
    correct_answer: 'A',
    xp_reward: 10,
    difficulty: 1,
    subject: 'Química',
    module_id: 1
  },
  {
    title: 'Revolução Francesa',
    description: 'Evento histórico importante',
    question: 'Em que ano começou a Revolução Francesa?',
    option_a: '1789',
    option_b: '1776',
    option_c: '1799',
    option_d: '1804',
    correct_answer: 'A',
    xp_reward: 15,
    difficulty: 1,
    subject: 'História',
    module_id: 1
  },
  {
    title: 'Maior Continente',
    description: 'Conhecimento geográfico básico',
    question: 'Qual é o maior continente?',
    option_a: 'África',
    option_b: 'Ásia',
    option_c: 'América',
    option_d: 'Europa',
    correct_answer: 'B',
    xp_reward: 10,
    difficulty: 1,
    subject: 'Geografia',
    module_id: 1
  },
  {
    title: 'Primeira Lei de Newton',
    description: 'Conceito fundamental da física',
    question: 'Qual lei de Newton diz que "ação e reação são iguais e opostas"?',
    option_a: '1ª Lei',
    option_b: '2ª Lei',
    option_c: '3ª Lei',
    option_d: 'Lei da Gravitação',
    correct_answer: 'C',
    xp_reward: 15,
    difficulty: 2,
    subject: 'Física',
    module_id: 1
  },
  {
    title: 'Célula Básica',
    description: 'Conceito fundamental da biologia',
    question: 'Qual é a unidade básica da vida?',
    option_a: 'Átomo',
    option_b: 'Molécula',
    option_c: 'Célula',
    option_d: 'Tecido',
    correct_answer: 'C',
    xp_reward: 10,
    difficulty: 1,
    subject: 'Biologia',
    module_id: 1
  },
  {
    title: 'Tradução Básica',
    description: 'Vocabulário básico em inglês',
    question: 'What is the translation of "casa" in English?',
    option_a: 'House',
    option_b: 'Car',
    option_c: 'Tree',
    option_d: 'Book',
    correct_answer: 'A',
    xp_reward: 10,
    difficulty: 1,
    subject: 'Inglês',
    module_id: 1
  }
];

async function insertSampleChallenges() {
  try {
    console.log('Inserindo desafios de exemplo...');

    for (const challenge of sampleChallenges) {
      await pool.query(`
        INSERT INTO challenges (title, description, question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        challenge.title, challenge.description, challenge.question,
        challenge.option_a, challenge.option_b, challenge.option_c, challenge.option_d,
        challenge.correct_answer, challenge.xp_reward, challenge.difficulty,
        challenge.subject, challenge.module_id
      ]);
    }

    console.log('✅ Desafios inseridos com sucesso!');

    const result = await pool.query('SELECT COUNT(*) as total FROM challenges');
    console.log('Total de desafios:', result.rows[0].total);

    const subjects = await pool.query('SELECT subject, COUNT(*) as count FROM challenges GROUP BY subject ORDER BY subject');
    console.log('Desafios por matéria:');
    subjects.rows.forEach(row => {
      console.log(`  ${row.subject}: ${row.count}`);
    });

  } catch (error) {
    console.log('❌ Erro:', error.message);
  } finally {
    pool.end();
  }
}

insertSampleChallenges();