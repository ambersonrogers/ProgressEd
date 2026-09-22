const fs = require('fs');
const path = require('path');
const os = require('os');

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join(os.tmpdir(), 'progressed_data') : path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'local_db.json');
const SQL_SEED_FILE = path.join(__dirname, '../populate_challenges.sql');

function parseChallengesFromSql(sql) {
  const challenges = [];
  const blocks = sql.split(/INSERT INTO challenges\s*\(([^)]+)\)\s*VALUES/i);
  let id = 1;
  for (let i = 1; i < blocks.length; i += 2) {
    const cols = blocks[i].split(',').map(c => c.trim().toLowerCase());
    const valBlock = blocks[i + 1];
    const valRegex = /\(([\s\S]*?)\)(?:,|\s*;)/g;
    let m;
    while ((m = valRegex.exec(valBlock)) !== null) {
      const rawValues = m[1];
      const parsed = [];
      let cur = '', inQuote = false, quoteChar = '';
      for (let j = 0; j < rawValues.length; j++) {
        const ch = rawValues[j];
        if (!inQuote && (ch === "'" || ch === '"')) {
          inQuote = true;
          quoteChar = ch;
        } else if (inQuote && ch === quoteChar) {
          if (rawValues[j + 1] === quoteChar) {
            cur += quoteChar;
            j++;
          } else {
            inQuote = false;
          }
        } else if (!inQuote && ch === ',') {
          parsed.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      parsed.push(cur.trim());

      const item = { id: id++ };
      cols.forEach((col, idx) => {
        let val = parsed[idx] || '';
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        }
        if (col === 'xp_reward' || col === 'difficulty' || col === 'module_id') {
          item[col] = parseInt(val, 10) || 1;
        } else {
          item[col] = val;
        }
      });
      if (!item.title) item.title = (item.subject || 'Geral') + ' #' + item.id;
      if (!item.description) item.description = 'Questão de ' + (item.subject || 'Conhecimentos Gerais');
      
      // Explicação pedagógica detalhada
      item.explanation = generateExplanation(item);
      challenges.push(item);
    }
  }
  return challenges;
}

function generateExplanation(item) {
  const correct = (item.correct_answer || 'A').toUpperCase();
  const optionMap = {
    'A': item.option_a,
    'B': item.option_b,
    'C': item.option_c,
    'D': item.option_d
  };
  const correctText = optionMap[correct] || '';
  return `A alternativa correta é a (${correct}): "${correctText}". Esta questão avalia as habilidades fundamentais da BNCC na disciplina de ${item.subject || 'Conhecimentos Gerais'}. Compreender este conceito é essencial para consolidar a base teórica e resolver problemas contextualizados.`;
}

class LocalDb {
  constructor() {
    this.data = {
      users: [],
      challenges: [],
      user_progress: [],
      student_submissions: []
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (_) {}

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.student_submissions || this.data.student_submissions.length === 0) {
          this.seedSubmissions();
        }
      } catch (err) {
        console.warn('⚠️ Erro ao ler local_db.json, gerando novo banco:', err.message);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  seedInitialData() {
    const hash123456 = '$2b$10$IdQY3YSs7SFqajcAKseJheQ8zEgENni.9TPIJcroEhx0jHUIfSR8S';
    const hashSenha123 = '$2b$10$j8OUTvMZrwSpjxwoC07c1OqNNqvcH1efeW3hfFN91wxINch8Nx9zC';

    this.data.users = [
      {
        id: 1,
        name: 'Amberson Rogers (Aluno)',
        email: 'aluno@progressed.com',
        password: hash123456,
        role: 'student',
        xp: 420,
        level: 4
      },
      {
        id: 2,
        name: 'Prof. Pedro Brandão',
        email: 'professor@progressed.com',
        password: hash123456,
        role: 'teacher',
        xp: 0,
        level: 1
      },
      {
        id: 3,
        name: 'João Silva',
        email: 'joao@test.com',
        password: hashSenha123,
        role: 'student',
        xp: 280,
        level: 3
      },
      {
        id: 4,
        name: 'Maria Santos',
        email: 'maria@test.com',
        password: hashSenha123,
        role: 'student',
        xp: 310,
        level: 3
      },
      {
        id: 5,
        name: 'Pedro Costa',
        email: 'pedro@test.com',
        password: hashSenha123,
        role: 'student',
        xp: 150,
        level: 2
      },
      {
        id: 6,
        name: 'Kelly Lorrany',
        email: 'kelly@escola.com',
        password: hashSenha123,
        role: 'student',
        xp: 520,
        level: 5
      },
      {
        id: 7,
        name: 'Weldes Reis',
        email: 'weldes@escola.com',
        password: hashSenha123,
        role: 'student',
        xp: 380,
        level: 4
      },
      {
        id: 8,
        name: 'Ana Beatriz Sousa',
        email: 'ana.beatriz@escola.com',
        password: hashSenha123,
        role: 'student',
        xp: 260,
        level: 3
      }
    ];

    let challenges = [];
    if (fs.existsSync(SQL_SEED_FILE)) {
      try {
        const sql = fs.readFileSync(SQL_SEED_FILE, 'utf8');
        challenges = parseChallengesFromSql(sql);
      } catch (e) {
        console.warn('⚠️ Não foi possível ler populate_challenges.sql, usando fallback padrão');
      }
    }

    if (challenges.length === 0) {
      challenges = [
        {
          id: 1,
          title: 'Raiz Quadrada',
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
          module_id: 1,
          explanation: 'A raiz quadrada de 144 é 12, pois 12 × 12 = 144.'
        }
      ];
    }
    this.data.challenges = challenges;

    this.data.user_progress = [
      { id: 1, user_id: 1, challenge_id: 1, completed: true, score: 10, completed_at: new Date().toISOString() },
      { id: 2, user_id: 1, challenge_id: 2, completed: true, score: 10, completed_at: new Date().toISOString() },
      { id: 3, user_id: 3, challenge_id: 1, completed: true, score: 10, completed_at: new Date().toISOString() },
      { id: 4, user_id: 4, challenge_id: 1, completed: true, score: 10, completed_at: new Date().toISOString() }
    ];

    this.seedSubmissions();
    this.persist();
  }

  seedSubmissions() {
    // Popula submissões com dados realistas da turma para gerar o Mapa de Defasagens
    const sampleSubmissions = [
      // Amberson Rogers (Aluno ID 1): Erros em Física e Matemática, acertos em Humanas e Linguagens
      { id: 1, user_id: 1, challenge_id: 25, question: 'Qual é a unidade de força no SI?', subject: 'Física', topic: 'Dinâmica e Leis de Newton', selected_answer: 'B', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T10:15:00.000Z' },
      { id: 2, user_id: 1, challenge_id: 26, question: 'Quanto é a aceleração da gravidade na Terra?', subject: 'Física', topic: 'Gravitação e Cinemática', selected_answer: 'B', correct_answer: 'B', is_correct: true, answered_at: '2026-09-18T10:18:00.000Z' },
      { id: 3, user_id: 1, challenge_id: 32, question: 'Qual é a lei de Ohm?', subject: 'Física', topic: 'Eletrodinâmica', selected_answer: 'C', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T10:22:00.000Z' },
      { id: 4, user_id: 1, challenge_id: 17, question: 'Quanto é a derivada de x²?', subject: 'Matemática', topic: 'Cálculo e Funções', selected_answer: 'A', correct_answer: 'B', is_correct: false, answered_at: '2026-09-18T10:25:00.000Z' },
      { id: 5, user_id: 1, challenge_id: 20, question: 'Qual é a solução de x² - 4 = 0?', subject: 'Matemática', topic: 'Equações Quadráticas', selected_answer: 'B', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T10:28:00.000Z' },
      { id: 6, user_id: 1, challenge_id: 12, question: 'Qual é a raiz quadrada de 144?', subject: 'Matemática', topic: 'Aritmética Básica', selected_answer: 'C', correct_answer: 'C', is_correct: true, answered_at: '2026-09-18T10:30:00.000Z' },
      { id: 7, user_id: 1, challenge_id: 64, question: 'Em que ano começou a Revolução Francesa?', subject: 'História', topic: 'Idade Moderna e Revoluções', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T10:35:00.000Z' },
      { id: 8, user_id: 1, challenge_id: 67, question: 'Quando terminou a Segunda Guerra Mundial?', subject: 'História', topic: 'Século XX e Conflitos Mundiais', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T10:38:00.000Z' },
      { id: 9, user_id: 1, challenge_id: 79, question: 'Qual é a capital do Brasil?', subject: 'Geografia', topic: 'Geografia Política Brasileira', selected_answer: 'C', correct_answer: 'C', is_correct: true, answered_at: '2026-09-18T10:40:00.000Z' },
      { id: 10, user_id: 1, challenge_id: 90, question: 'Qual é a classe gramatical de "casa"?', subject: 'Português', topic: 'Morfologia e Classes Gramaticais', selected_answer: 'B', correct_answer: 'B', is_correct: true, answered_at: '2026-09-18T10:43:00.000Z' },
      { id: 11, user_id: 1, challenge_id: 41, question: 'O que é um ácido?', subject: 'Química', topic: 'Funções Inorgânicas e pH', selected_answer: 'A', correct_answer: 'C', is_correct: false, answered_at: '2026-09-18T10:45:00.000Z' },
      { id: 12, user_id: 1, challenge_id: 40, question: 'Qual é a fórmula da água?', subject: 'Química', topic: 'Química Geral e Moléculas', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T10:48:00.000Z' },

      // João Silva (Aluno ID 3): Erros em Matemática e Química
      { id: 13, user_id: 3, challenge_id: 25, question: 'Qual é a unidade de força no SI?', subject: 'Física', topic: 'Dinâmica e Leis de Newton', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T11:00:00.000Z' },
      { id: 14, user_id: 3, challenge_id: 32, question: 'Qual é a lei de Ohm?', subject: 'Física', topic: 'Eletrodinâmica', selected_answer: 'B', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T11:04:00.000Z' },
      { id: 15, user_id: 3, challenge_id: 17, question: 'Quanto é a derivada de x²?', subject: 'Matemática', topic: 'Cálculo e Funções', selected_answer: 'C', correct_answer: 'B', is_correct: false, answered_at: '2026-09-18T11:08:00.000Z' },
      { id: 16, user_id: 3, challenge_id: 20, question: 'Qual é a solução de x² - 4 = 0?', subject: 'Matemática', topic: 'Equações Quadráticas', selected_answer: 'C', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T11:12:00.000Z' },
      { id: 17, user_id: 3, challenge_id: 41, question: 'O que é um ácido?', subject: 'Química', topic: 'Funções Inorgânicas e pH', selected_answer: 'B', correct_answer: 'C', is_correct: false, answered_at: '2026-09-18T11:15:00.000Z' },
      { id: 18, user_id: 3, challenge_id: 64, question: 'Em que ano começou a Revolução Francesa?', subject: 'História', topic: 'Idade Moderna e Revoluções', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T11:20:00.000Z' },

      // Maria Santos (Aluno ID 4): Erros em Física e Biologia
      { id: 19, user_id: 4, challenge_id: 25, question: 'Qual é a unidade de força no SI?', subject: 'Física', topic: 'Dinâmica e Leis de Newton', selected_answer: 'C', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T13:00:00.000Z' },
      { id: 20, user_id: 4, challenge_id: 54, question: 'O que é fotossíntese?', subject: 'Biologia', topic: 'Bioenergética e Metabolismo', selected_answer: 'B', correct_answer: 'C', is_correct: false, answered_at: '2026-09-18T13:05:00.000Z' },
      { id: 21, user_id: 4, challenge_id: 20, question: 'Qual é a solução de x² - 4 = 0?', subject: 'Matemática', topic: 'Equações Quadráticas', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T13:10:00.000Z' },
      { id: 22, user_id: 4, challenge_id: 91, question: 'O que é uma metáfora?', subject: 'Português', topic: 'Figuras de Linguagem', selected_answer: 'B', correct_answer: 'B', is_correct: true, answered_at: '2026-09-18T13:15:00.000Z' },

      // Pedro Costa (Aluno ID 5): Dificuldades gerais em Exatas
      { id: 23, user_id: 5, challenge_id: 25, question: 'Qual é a unidade de força no SI?', subject: 'Física', topic: 'Dinâmica e Leis de Newton', selected_answer: 'B', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T14:00:00.000Z' },
      { id: 24, user_id: 5, challenge_id: 32, question: 'Qual é a lei de Ohm?', subject: 'Física', topic: 'Eletrodinâmica', selected_answer: 'D', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T14:05:00.000Z' },
      { id: 25, user_id: 5, challenge_id: 17, question: 'Quanto é a derivada de x²?', subject: 'Matemática', topic: 'Cálculo e Funções', selected_answer: 'C', correct_answer: 'B', is_correct: false, answered_at: '2026-09-18T14:10:00.000Z' },
      { id: 26, user_id: 5, challenge_id: 41, question: 'O que é um ácido?', subject: 'Química', topic: 'Funções Inorgânicas e pH', selected_answer: 'A', correct_answer: 'C', is_correct: false, answered_at: '2026-09-18T14:15:00.000Z' },
      { id: 27, user_id: 5, challenge_id: 79, question: 'Qual é a capital do Brasil?', subject: 'Geografia', topic: 'Geografia Política Brasileira', selected_answer: 'C', correct_answer: 'C', is_correct: true, answered_at: '2026-09-18T14:20:00.000Z' },

      // Kelly Lorrany (Aluno ID 6): Alta proficiência geral, erro pontual em Física
      { id: 28, user_id: 6, challenge_id: 25, question: 'Qual é a unidade de força no SI?', subject: 'Física', topic: 'Dinâmica e Leis de Newton', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T15:00:00.000Z' },
      { id: 29, user_id: 6, challenge_id: 32, question: 'Qual é a lei de Ohm?', subject: 'Física', topic: 'Eletrodinâmica', selected_answer: 'B', correct_answer: 'A', is_correct: false, answered_at: '2026-09-18T15:05:00.000Z' },
      { id: 30, user_id: 6, challenge_id: 12, question: 'Qual é a raiz quadrada de 144?', subject: 'Matemática', topic: 'Aritmética Básica', selected_answer: 'C', correct_answer: 'C', is_correct: true, answered_at: '2026-09-18T15:10:00.000Z' },
      { id: 31, user_id: 6, challenge_id: 64, question: 'Em que ano começou a Revolução Francesa?', subject: 'História', topic: 'Idade Moderna e Revoluções', selected_answer: 'A', correct_answer: 'A', is_correct: true, answered_at: '2026-09-18T15:15:00.000Z' },
      { id: 32, user_id: 6, challenge_id: 90, question: 'Qual é a classe gramatical de "casa"?', subject: 'Português', topic: 'Morfologia e Classes Gramaticais', selected_answer: 'B', correct_answer: 'B', is_correct: true, answered_at: '2026-09-18T15:20:00.000Z' }
    ];

    this.data.student_submissions = sampleSubmissions;
  }

  recordSubmission({ userId, challengeId, question, subject, topic, selectedAnswer, correctAnswer, isCorrect }) {
    const nextId = (this.data.student_submissions || []).reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1;
    const newSub = {
      id: nextId,
      user_id: Number(userId),
      challenge_id: Number(challengeId),
      question: question || `Desafio #${challengeId}`,
      subject: subject || 'Geral',
      topic: topic || 'Conteúdo Curricular BNCC',
      selected_answer: (selectedAnswer || '').toUpperCase(),
      correct_answer: (correctAnswer || '').toUpperCase(),
      is_correct: Boolean(isCorrect),
      answered_at: new Date().toISOString()
    };
    if (!this.data.student_submissions) this.data.student_submissions = [];
    this.data.student_submissions.push(newSub);
    this.persist();
    return newSub;
  }

  getClassAnalytics() {
    const subs = this.data.student_submissions || [];
    const subjectsMap = {};

    subs.forEach(s => {
      const subj = s.subject || 'Geral';
      if (!subjectsMap[subj]) {
        subjectsMap[subj] = { subject: subj, total: 0, correct: 0, wrong: 0 };
      }
      subjectsMap[subj].total += 1;
      if (s.is_correct) {
        subjectsMap[subj].correct += 1;
      } else {
        subjectsMap[subj].wrong += 1;
      }
    });

    const subjectProficiency = Object.values(subjectsMap).map(item => {
      const accuracyRate = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
      let status = 'bom';
      if (accuracyRate < 50) status = 'critico';
      else if (accuracyRate <= 70) status = 'atencao';
      else status = 'excelente';

      return {
        ...item,
        accuracyRate,
        status
      };
    }).sort((a, b) => a.accuracyRate - b.accuracyRate); // Ordena das matérias mais críticas para as melhores

    // Tópicos mais errados na turma
    const topicMap = {};
    subs.forEach(s => {
      if (!s.is_correct) {
        const key = `${s.topic || s.question} (${s.subject})`;
        if (!topicMap[key]) {
          topicMap[key] = { topic: s.topic || 'Conceito Fundamental', subject: s.subject, wrongCount: 0 };
        }
        topicMap[key].wrongCount += 1;
      }
    });

    const criticalTopics = Object.values(topicMap)
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 6);

    const totalAnswers = subs.length;
    const totalCorrect = subs.filter(s => s.is_correct).length;
    const classAverageAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

    return {
      totalSubmissions: totalAnswers,
      totalCorrect,
      totalWrong: totalAnswers - totalCorrect,
      classAverageAccuracy,
      subjectProficiency,
      criticalTopics
    };
  }

  getStudentDiagnosis(studentId) {
    const sId = Number(studentId);
    const student = this.data.users.find(u => Number(u.id) === sId);
    if (!student) return null;

    const subs = (this.data.student_submissions || []).filter(s => Number(s.user_id) === sId);
    const totalAnswers = subs.length;
    const totalCorrect = subs.filter(s => s.is_correct).length;
    const totalWrong = totalAnswers - totalCorrect;
    const accuracyRate = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

    // Proficiência por matéria
    const subjectsMap = {};
    subs.forEach(s => {
      const subj = s.subject || 'Geral';
      if (!subjectsMap[subj]) {
        subjectsMap[subj] = { subject: subj, total: 0, correct: 0, wrong: 0 };
      }
      subjectsMap[subj].total += 1;
      if (s.is_correct) subjectsMap[subj].correct += 1;
      else subjectsMap[subj].wrong += 1;
    });

    const subjectProficiency = Object.values(subjectsMap).map(item => {
      const acc = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
      let status = 'bom';
      if (acc < 50) status = 'critico';
      else if (acc <= 70) status = 'atencao';
      else status = 'excelente';
      return { ...item, accuracyRate: acc, status };
    }).sort((a, b) => a.accuracyRate - b.accuracyRate);

    // Lista detalhada dos erros do aluno
    const recentErrors = subs.filter(s => !s.is_correct).map(s => ({
      id: s.id,
      challenge_id: s.challenge_id,
      question: s.question,
      subject: s.subject,
      topic: s.topic,
      selected_answer: s.selected_answer,
      correct_answer: s.correct_answer,
      answered_at: s.answered_at
    }));

    // Geração automática do Parecer Pedagógico
    const criticalSubjects = subjectProficiency.filter(s => s.status === 'critico').map(s => s.subject);
    const strongSubjects = subjectProficiency.filter(s => s.status === 'excelente').map(s => s.subject);
    
    let recommendation = '';
    if (criticalSubjects.length > 0) {
      recommendation += `⚠️ Alerta de Defasagem: O estudante apresenta maior índice de dificuldade em ${criticalSubjects.join(' e ')}. `;
      recommendation += `Recomenda-se reforço metodológico focado na resolução comentada de exercícios práticos nestas áreas. `;
    } else {
      recommendation += `✅ Desempenho equilibrado com boa absorção dos conteúdos nas trilhas gerais. `;
    }

    if (strongSubjects.length > 0) {
      recommendation += `🏆 Destaque positivo em ${strongSubjects.join(' e ')}, onde o discente mantém excelente domínio e aproveitamento superior a 75%.`;
    }

    return {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        xp: student.xp || 0,
        level: student.level || 1,
        role: student.role
      },
      totalAnswers,
      totalCorrect,
      totalWrong,
      accuracyRate,
      subjectProficiency,
      recentErrors,
      pedagogicalSummary: recommendation
    };
  }

  persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.warn('⚠️ Aviso ao persistir dados locais:', err.message);
    }
  }

  async query(sqlText, params = []) {
    const cleanSql = sqlText.trim().replace(/\s+/g, ' ');

    // 1. SELECT * FROM users WHERE email = $1
    if (/SELECT \* FROM users WHERE email =/i.test(cleanSql)) {
      const emailTarget = (params[0] || '').toLowerCase().trim();
      const user = this.data.users.find(u => u.email.toLowerCase() === emailTarget);
      return { rows: user ? [{ ...user }] : [] };
    }

    // 2. INSERT INTO users ... RETURNING id, email, name, role, xp, level
    if (/INSERT INTO users/i.test(cleanSql)) {
      const nextId = this.data.users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1;
      const newUser = {
        id: nextId,
        email: params[0],
        password: params[1],
        name: params[2],
        role: params[3] || 'student',
        xp: 0,
        level: 1
      };
      this.data.users.push(newUser);
      this.persist();
      return {
        rows: [{
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          xp: newUser.xp,
          level: newUser.level
        }]
      };
    }

    // 3. SELECT id, name, email, role, xp, level FROM users WHERE id = $1
    if (/SELECT .* FROM users WHERE id =/i.test(cleanSql)) {
      const userId = params[0];
      const user = this.data.users.find(u => String(u.id) === String(userId));
      if (!user) return { rows: [] };
      return {
        rows: [{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp,
          level: user.level
        }]
      };
    }

    // 4. SELECT * FROM challenges ORDER BY module_id, difficulty
    if (/SELECT \* FROM challenges/i.test(cleanSql) && /ORDER BY/i.test(cleanSql)) {
      const sorted = [...this.data.challenges].sort((a, b) => {
        if (a.module_id !== b.module_id) return a.module_id - b.module_id;
        return a.difficulty - b.difficulty;
      });
      return { rows: sorted };
    }

    // 5. SELECT * FROM challenges WHERE id = $1
    if (/SELECT \* FROM challenges WHERE id =/i.test(cleanSql)) {
      const cId = params[0];
      const ch = this.data.challenges.find(c => String(c.id) === String(cId));
      return { rows: ch ? [{ ...ch }] : [] };
    }

    // 6. SELECT * FROM user_progress WHERE user_id = $1 AND challenge_id = $2
    if (/SELECT \* FROM user_progress WHERE user_id =/i.test(cleanSql)) {
      const uId = params[0];
      const cId = params[1];
      const prog = this.data.user_progress.find(p => String(p.user_id) === String(uId) && String(p.challenge_id) === String(cId));
      return { rows: prog ? [{ ...prog }] : [] };
    }

    // 7. INSERT INTO user_progress
    if (/INSERT INTO user_progress/i.test(cleanSql)) {
      const nextId = this.data.user_progress.length + 1;
      const newProg = {
        id: nextId,
        user_id: params[0],
        challenge_id: params[1],
        completed: true,
        score: params[2] || 0,
        completed_at: new Date().toISOString()
      };
      this.data.user_progress.push(newProg);
      this.persist();
      return { rows: [newProg] };
    }

    // 8. UPDATE users SET xp = xp + $1, level = FLOOR((xp + $1) / 100) + 1 WHERE id = $2
    if (/UPDATE users SET xp =/i.test(cleanSql)) {
      const xpReward = Number(params[0]) || 0;
      const userId = params[1];
      const user = this.data.users.find(u => String(u.id) === String(userId));
      if (user) {
        user.xp = (user.xp || 0) + xpReward;
        user.level = Math.floor(user.xp / 100) + 1;
        this.persist();
      }
      return { rows: [] };
    }

    // 9. SELECT id, name, xp, level FROM users WHERE role = 'student' ORDER BY xp DESC LIMIT 10
    if (/WHERE role = 'student' ORDER BY xp DESC/i.test(cleanSql)) {
      const students = this.data.users
        .filter(u => u.role === 'student')
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .slice(0, 10)
        .map(u => ({ id: u.id, name: u.name, xp: u.xp || 0, level: u.level || 1 }));
      return { rows: students };
    }

    // 10. Teacher students query
    if (/FROM users u.*LEFT JOIN user_progress/i.test(cleanSql) || /COUNT\(up\.id\) as completed_challenges/i.test(cleanSql)) {
      const students = this.data.users.filter(u => u.role === 'student');
      const totalChallenges = this.data.challenges.length;
      const rows = students.map(s => {
        const studentSubs = (this.data.student_submissions || []).filter(sub => Number(sub.user_id) === Number(s.id));
        const totalAnswers = studentSubs.length;
        const totalCorrect = studentSubs.filter(sub => sub.is_correct).length;
        const accuracyRate = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
        const completed = this.data.user_progress.filter(p => String(p.user_id) === String(s.id) && p.completed).length;

        return {
          id: s.id,
          name: s.name,
          email: s.email,
          xp: s.xp || 0,
          level: s.level || 1,
          completed_challenges: completed || totalCorrect,
          total_challenges: totalChallenges,
          total_answers: totalAnswers,
          accuracy_rate: accuracyRate
        };
      }).sort((a, b) => b.xp - a.xp);
      return { rows };
    }

    // 11. Teacher stats query
    if (/totalStudents/i.test(cleanSql) || (/COUNT\(\*\).*avgXp/i.test(cleanSql))) {
      const students = this.data.users.filter(u => u.role === 'student');
      const totalStudents = students.length;
      const sumXp = students.reduce((sum, s) => sum + (s.xp || 0), 0);
      const sumLevel = students.reduce((sum, s) => sum + (s.level || 1), 0);
      const totalCompleted = this.data.user_progress.filter(p => p.completed).length;
      return {
        rows: [{
          totalstudents: totalStudents,
          avgxp: totalStudents > 0 ? (sumXp / totalStudents).toFixed(1) : 0,
          avglevel: totalStudents > 0 ? (sumLevel / totalStudents).toFixed(1) : 1,
          totalcompleted: totalCompleted
        }]
      };
    }

    // 12. Health check
    if (/SELECT NOW\(\)|SELECT 1|SELECT COUNT/i.test(cleanSql)) {
      return {
        rows: [{
          hora: new Date(),
          total: this.data.challenges.length,
          total_challenges: this.data.challenges.length
        }]
      };
    }

    if (/challenges/i.test(cleanSql)) {
      return { rows: this.data.challenges };
    }

    return { rows: [] };
  }

  async end() {
    this.persist();
  }
}

const localDbInstance = new LocalDb();
module.exports = localDbInstance;
