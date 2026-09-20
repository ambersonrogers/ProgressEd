const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
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
      if (!item.title) item.title = item.subject + ' #' + item.id;
      if (!item.description) item.description = 'Questão de ' + item.subject;
      challenges.push(item);
    }
  }
  return challenges;
}

class LocalDb {
  constructor() {
    this.data = {
      users: [],
      challenges: [],
      user_progress: []
    };
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
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
        xp: 350,
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
        xp: 210,
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
          module_id: 1
        },
        {
          id: 2,
          title: 'Porcentagem',
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

    this.persist();
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Erro ao salvar local_db.json:', err.message);
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
      // params: [email, hashedPassword, name, role]
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
      // params: [userId, challengeId, score]
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
        const completed = this.data.user_progress.filter(p => String(p.user_id) === String(s.id) && p.completed).length;
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          xp: s.xp || 0,
          level: s.level || 1,
          completed_challenges: completed,
          total_challenges: totalChallenges
        };
      }).sort((a, b) => b.xp - a.xp);
      return { rows };
    }

    // 11. Teacher stats query: SELECT COUNT(*) as totalStudents, AVG(xp) as avgXp ...
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

    // 12. Health check / SELECT NOW() / SELECT 1
    if (/SELECT NOW\(\)|SELECT 1|SELECT COUNT/i.test(cleanSql)) {
      return {
        rows: [{
          hora: new Date(),
          total: this.data.challenges.length,
          total_challenges: this.data.challenges.length
        }]
      };
    }

    // Fallback genérico para SELECT de challenges
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
