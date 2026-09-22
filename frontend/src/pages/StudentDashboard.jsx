import { useState, useEffect, useMemo } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import api from '../services/api';
import { DEFAULT_CHALLENGES, DEFAULT_RANKING } from '../data/defaultChallenges';
import { playClickSound, playLevelUpSound } from '../utils/soundEffects';
import './StudentDashboard.css';

// --------------------------------------------------------------------------
// DISCIPLINAS DA BASE DO ENSINO MÉDIO INTEGRAL (BNCC)
// --------------------------------------------------------------------------
const BNCC_AREAS = [
  {
    id: 1,
    key: 'linguagens',
    name: 'Linguagens & Tecnologias',
    shortName: 'Linguagens',
    subtitle: 'Português • Redação • Literatura • Inglês • Artes',
    icon: '📝',
    color: '#8b5cf6',
    borderClass: 'border-violet-500/40',
    bgGradient: 'from-violet-600/20 to-indigo-900/40',
    competence: 'EM13LGG101 / EM13LGG302'
  },
  {
    id: 2,
    key: 'matematica',
    name: 'Matemática & Tecnologias',
    shortName: 'Matemática',
    subtitle: 'Álgebra • Geometria • Funções • Estatística',
    icon: '📐',
    color: '#d946ef',
    borderClass: 'border-fuchsia-500/40',
    bgGradient: 'from-fuchsia-600/20 to-pink-900/40',
    competence: 'EM13MAT103 / EM13MAT301'
  },
  {
    id: 3,
    key: 'natureza',
    name: 'Ciências da Natureza',
    shortName: 'Natureza',
    subtitle: 'Física • Química • Biologia',
    icon: '🧪',
    color: '#10b981',
    borderClass: 'border-emerald-500/40',
    bgGradient: 'from-emerald-600/20 to-teal-900/40',
    competence: 'EM13CNT102 / EM13CNT203'
  },
  {
    id: 4,
    key: 'humanas',
    name: 'Ciências Humanas & Sociais',
    shortName: 'Humanas',
    subtitle: 'História • Geografia • Filosofia • Sociologia',
    icon: '📜',
    color: '#f59e0b',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-600/20 to-orange-900/40',
    competence: 'EM13CHS101 / EM13CHS502'
  },
  {
    id: 5,
    key: 'simulado',
    name: 'Simulado Geral ENEM',
    shortName: 'Simulado ENEM',
    subtitle: 'Multidisciplinar • Matriz de Referência ENEM',
    icon: '🎯',
    color: '#38bdf8',
    borderClass: 'border-sky-500/40',
    bgGradient: 'from-sky-600/20 to-blue-900/40',
    competence: 'Matriz Completa ENEM'
  }
];

const LEVEL_XP = 500;

// --------------------------------------------------------------------------
// INFERÊNCIA INTELIGENTE DE DISCIPLINAS DO BANCO DE DADOS
// --------------------------------------------------------------------------
function inferSubject(raw) {
  if (raw.subject && typeof raw.subject === 'string' && raw.subject.trim() !== '') {
    const s = raw.subject.toLowerCase();
    if (s.includes('portugu') || s.includes('lingua') || s.includes('literat') || s.includes('ingl') || s.includes('arte')) return 'Linguagens';
    if (s.includes('matem') || s.includes('algeb') || s.includes('geometr')) return 'Matemática';
    if (s.includes('físic') || s.includes('fisic') || s.includes('químic') || s.includes('quimic') || s.includes('biolog')) return 'Ciências da Natureza';
    if (s.includes('histór') || s.includes('histor') || s.includes('geograf') || s.includes('filosof') || s.includes('sociol')) return 'Ciências Humanas';
    return raw.subject;
  }

  const text = `${raw.title || ''} ${raw.question || ''} ${raw.description || ''}`.toLowerCase();
  if (text.match(/ortografia|concordância|verbo|poema|texto|leitura|discurso|gramática|figura de linguagem|palavra/)) {
    return 'Linguagens';
  }
  if (text.match(/porcentagem|equação|função|f\(x\)|matriz|cálculo|geometria|triângulo|número|probabilidade/)) {
    return 'Matemática';
  }
  if (text.match(/newton|velocidade|força|energia|átomo|reação|química|ph|biologia|célula|dna|genética|física/)) {
    return 'Ciências da Natureza';
  }
  if (text.match(/guerra|revolução|século|história|brasil|geografia|relevo|clima|filosofia|ética|sociologia|cidadania/)) {
    return 'Ciências Humanas';
  }

  // Fallback por moduleId
  const mod = Number(raw.module_id || raw.moduleId || 1);
  if (mod === 1) return 'Linguagens';
  if (mod === 2) return 'Matemática';
  if (mod === 3) return 'Ciências da Natureza';
  if (mod === 4) return 'Ciências Humanas';
  return 'Linguagens';
}

function normalizeChallenge(c) {
  const subject = inferSubject(c);
  return {
    id: c.id,
    moduleId: Number(c.moduleId || c.module_id || 1),
    subject,
    title: c.title || `${subject} #${c.id}`,
    question: c.question || c.text || '',
    optionA: c.optionA ?? c.option_a ?? '',
    optionB: c.optionB ?? c.option_b ?? '',
    optionC: c.optionC ?? c.option_c ?? '',
    optionD: c.optionD ?? c.option_d ?? '',
    correctAnswer: (c.correctAnswer || c.correct_answer || 'A').toUpperCase(),
    difficulty: Number(c.difficulty || 2),
    xpReward: Number(c.xpReward || c.xp_reward || 15),
    explanation: c.explanation || c.description ||
      `A alternativa correta é a (${(c.correctAnswer || c.correct_answer || 'A').toUpperCase()}). Compreender este conceito consolida as competências essenciais da BNCC em ${subject}.`
  };
}

// Notificações escolares iniciais
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Nova Lista de Exercícios em Física',
    message: 'Prof. Pedro Brandão disponibilizou desafios práticos sobre Circuitos Elétricos e 1ª Lei de Ohm.',
    time: 'Há 25 min',
    icon: '⚡',
    unread: true
  },
  {
    id: 2,
    title: 'Sequência de Estudos Mantida! 🔥',
    message: 'Parabéns! Você completou 7 dias consecutivos de estudos no Centro Educa Mais Paulo Freire.',
    time: 'Hoje, 09:30',
    icon: '🔥',
    unread: true
  },
  {
    id: 3,
    title: 'Simulado Multidisciplinar ENEM Liberado',
    message: 'Teste seus limites no novo Simulado Geral de 10 questões com nota estimada de 0 a 1000.',
    time: 'Ontem',
    icon: '🏆',
    unread: true
  },
  {
    id: 4,
    title: 'Avanço de Nível Registrado',
    message: 'Você atingiu o Nível 5 com 2.450 XP acumulados! Continue praticando.',
    time: '2 dias atrás',
    icon: '⭐',
    unread: false
  }
];

function StudentDashboard({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || { name: 'Amberson Rogers', level: 5, xp: 2450 });
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(DEFAULT_RANKING);

  // --------------------------------------------------------------------------
  // CONTROLE DE TELAS & NAVEGAÇÃO REATIVA
  // --------------------------------------------------------------------------
  const [sidebarTab, setSidebarTab] = useState('trilhas'); // 'trilhas' | 'ranking' | 'perfil'
  const [viewMode, setViewMode] = useState('hub'); // 'hub' | 'quiz' | 'simulado_result'
  const [selectedAreaKey, setSelectedAreaKey] = useState('natureza'); // área ativa da BNCC
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Filtros da tela de ranking
  const [rankingScope, setRankingScope] = useState('escola'); // 'global' | 'escola'
  const [rankingSearch, setRankingSearch] = useState('');

  // Seletor de Avatar do Perfil
  const [selectedAvatarEmoji, setSelectedAvatarEmoji] = useState('🎓');

  // Estados do Quiz
  const [quizMode, setQuizMode] = useState('track'); // 'track' | 'simulado'
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeQuizList, setActiveQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Estatísticas da sessão
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    xpGained: 0,
    answers: []
  });

  useEffect(() => {
    loadUserProfile();
    loadChallenges();
    loadRanking();
  }, []);

  // Temporizador do Quiz
  useEffect(() => {
    if (viewMode !== 'quiz' || timerPaused) return;

    if (timeLeft <= 0) {
      setTimeExpired(true);
      setTimerPaused(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, timerPaused, timeLeft]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data) {
        setCurrentUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.warn('Perfil local ativo:', error.message);
    }
  };

  const loadChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setChallenges(response.data.map(normalizeChallenge));
      } else {
        setChallenges(DEFAULT_CHALLENGES.map(normalizeChallenge));
      }
    } catch (error) {
      setChallenges(DEFAULT_CHALLENGES.map(normalizeChallenge));
    } finally {
      setLoading(false);
    }
  };

  const loadRanking = async () => {
    try {
      const response = await api.get('/ranking');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setRanking(response.data);
      } else {
        setRanking(DEFAULT_RANKING);
      }
    } catch (error) {
      setRanking(DEFAULT_RANKING);
    }
  };

  // --------------------------------------------------------------------------
  // CONTROLE DE NAVEGAÇÃO & HOME
  // --------------------------------------------------------------------------
  const handleGoHome = () => {
    playClickSound();
    setSidebarTab('trilhas');
    setViewMode('hub');
    setShowNotifications(false);
  };

  const handleToggleNotifications = () => {
    playClickSound();
    setShowNotifications(!showNotifications);
  };

  const handleClearNotifications = () => {
    playClickSound();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // --------------------------------------------------------------------------
  // INICIALIZAÇÃO DE DESAFIOS (DUOLINGO & PERGUNTADOS)
  // --------------------------------------------------------------------------
  const handleStartAreaQuiz = (areaKey, nodeIndex = 1) => {
    playClickSound();
    let filtered = [];

    if (areaKey === 'simulado') {
      filtered = [...challenges].sort(() => 0.5 - Math.random()).slice(0, 10);
      setCurrentTrack({ name: 'Simulado Geral BNCC (ENEM)', icon: '🎯', subtitle: '10 Questões Multidisciplinares' });
      setQuizMode('simulado');
    } else {
      const currentArea = BNCC_AREAS.find(a => a.key === areaKey);
      filtered = challenges.filter(c => {
        if (areaKey === 'natureza') return c.subject === 'Ciências da Natureza' || c.subject === 'Física' || c.subject === 'Química' || c.subject === 'Biologia';
        if (areaKey === 'linguagens') return c.subject === 'Linguagens' || c.subject === 'Português' || c.subject === 'Inglês' || c.subject === 'Literatura';
        if (areaKey === 'matematica') return c.subject === 'Matemática';
        if (areaKey === 'humanas') return c.subject === 'Ciências Humanas' || c.subject === 'História' || c.subject === 'Geografia';
        return true;
      });

      if (filtered.length === 0) {
        filtered = challenges.slice(0, 5);
      }

      setCurrentTrack({
        name: `${currentArea?.name || 'Trilha'} - Missão #${nodeIndex}`,
        icon: currentArea?.icon || '📖',
        subtitle: currentArea?.subtitle || 'Competências Curriculares BNCC'
      });
      setQuizMode('track');
    }

    setActiveQuizList(filtered.slice(0, 5));
    setCurrentIndex(0);
    setTimeLeft(30);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setViewMode('quiz');
  };

  // Botão Roleta / Desafio Relâmpago estilo Perguntados
  const handleRandomQuickChallenge = () => {
    playClickSound();
    if (challenges.length === 0) return;

    const randomQ = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentTrack({
      name: '⚡ Desafio Relâmpago (Perguntados)',
      icon: '⚡',
      subtitle: `Questão Surpresa em ${randomQ.subject} • +20 XP Bônus`
    });
    setQuizMode('track');
    setActiveQuizList([randomQ]);
    setCurrentIndex(0);
    setTimeLeft(20);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setViewMode('quiz');
  };

  // Submissão de Desafio
  const handleChallengeSubmit = async (challengeId, answer) => {
    setTimerPaused(true);
    setDisabled(true);

    const currentQ = activeQuizList[currentIndex];
    const isCorrect = currentQ && (answer || '').toUpperCase() === currentQ.correctAnswer;
    const xpReward = currentQ ? currentQ.xpReward : 15;

    setSessionStats(prev => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrong: !isCorrect ? prev.wrong + 1 : prev.wrong,
      xpGained: isCorrect ? prev.xpGained + xpReward : prev.xpGained,
      answers: [...prev.answers, { challengeId, selected: answer, isCorrect, subject: currentQ?.subject }]
    }));

    try {
      const response = await api.post(`/challenges/${challengeId}/submit`, { answer });
      if (response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (isCorrect) {
        const newXp = (currentUser.xp || 2450) + xpReward;
        const newLevel = Math.floor(newXp / LEVEL_XP) + 1;
        const updated = { ...currentUser, xp: newXp, level: newLevel };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } finally {
      setDisabled(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < activeQuizList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(30);
      setTimeExpired(false);
      setTimerPaused(false);
      setDisabled(false);
    } else {
      playLevelUpSound();
      if (quizMode === 'simulado') {
        setViewMode('simulado_result');
      } else {
        alert('🎉 Missão da Trilha Concluída com Sucesso! Você dominou esta competência da BNCC.');
        setViewMode('hub');
      }
    }
  };

  // Níveis e Metas
  const currentLevel = currentUser?.level || 5;
  const currentXp = currentUser?.xp || 2450;
  const targetXp = currentLevel * LEVEL_XP + 1000;
  const xpNeeded = Math.max(0, targetXp - currentXp);
  const progressPercent = Math.min(100, Math.round((currentXp / targetXp) * 100));

  // Lista consolidada de ranking
  const studentRankingList = useMemo(() => {
    const list = [
      { id: 101, name: 'Lucas Mendes', level: 8, xp: 3250, school: 'CE Paulo Freire', accuracy: 94 },
      { id: 102, name: 'Mariana Silva', level: 7, xp: 2980, school: 'CE Paulo Freire', accuracy: 91 },
      { id: 103, name: 'Pedro Henrique', level: 7, xp: 2750, school: 'CE Paulo Freire', accuracy: 88 },
      { id: 104, name: 'Beatriz Oliveira', level: 6, xp: 2450, school: 'CE Paulo Freire', accuracy: 85 },
      { id: 105, name: currentUser.name || 'Amberson Rogers', level: currentLevel, xp: currentXp, school: 'CE Paulo Freire', accuracy: 82, isCurrent: true },
      { id: 106, name: 'Weldes Reis', level: 5, xp: 2100, school: 'CE Paulo Freire', accuracy: 79 },
      { id: 107, name: 'Kelly Lorrany', level: 5, xp: 1950, school: 'CE Paulo Freire', accuracy: 76 },
      { id: 108, name: 'Ana Beatriz Sousa', level: 4, xp: 1600, school: 'CE Paulo Freire', accuracy: 72 }
    ];

    if (!rankingSearch) return list;
    return list.filter(item => item.name.toLowerCase().includes(rankingSearch.toLowerCase()));
  }, [currentUser, currentLevel, currentXp, rankingSearch]);

  // Contagem de questões por disciplina
  const countsByArea = useMemo(() => {
    return {
      linguagens: challenges.filter(c => c.subject === 'Linguagens' || c.subject === 'Português' || c.subject === 'Inglês').length || 28,
      matematica: challenges.filter(c => c.subject === 'Matemática').length || 32,
      natureza: challenges.filter(c => c.subject === 'Ciências da Natureza' || c.subject === 'Física' || c.subject === 'Química' || c.subject === 'Biologia').length || 35,
      humanas: challenges.filter(c => c.subject === 'Ciências Humanas' || c.subject === 'História' || c.subject === 'Geografia').length || 26,
      simulado: 10
    };
  }, [challenges]);

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO: QUIZ / DESAFIO ATIVO
  // --------------------------------------------------------------------------
  if (viewMode === 'quiz' && activeQuizList[currentIndex]) {
    const currentQ = activeQuizList[currentIndex];
    return (
      <div className="quiz-page-container min-h-screen bg-[#030712] text-white p-4 sm:p-6 lg:p-8">
        <ChallengeCard
          challenge={currentQ}
          currentIndex={currentIndex}
          totalQuestions={activeQuizList.length}
          timeLeft={timeLeft}
          timerPaused={timerPaused}
          onSubmit={handleChallengeSubmit}
          onNext={handleNextQuestion}
          onExit={handleGoHome}
          isLastQuestion={currentIndex >= activeQuizList.length - 1}
          disabled={disabled}
          timeExpired={timeExpired}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO: RESULTADO DO SIMULADO
  // --------------------------------------------------------------------------
  if (viewMode === 'simulado_result') {
    const totalQ = sessionStats.correct + sessionStats.wrong || 1;
    const accuracy = Math.round((sessionStats.correct / totalQ) * 100);
    const enemScore = Math.min(1000, Math.round(340 + (accuracy * 6.2) + (sessionStats.xpGained * 0.4)));

    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-3xl border border-sky-500/30 bg-[#0b1120] p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-4xl shadow-glow">
            🏆
          </div>
          <h2 className="text-3xl font-extrabold text-white">Simulado BNCC Concluído!</h2>
          <p className="text-slate-300 text-sm">Desempenho consolidado com base na matriz curricular do Ensino Médio.</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400">Nota Estimada</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{enemScore}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400">Taxa de Acertos</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{accuracy}%</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400">XP Ganho</p>
              <p className="text-2xl font-bold text-sky-400 mt-1">+{sessionStats.xpGained}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleStartAreaQuiz('simulado')}
              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-white transition shadow-lg"
            >
              🔄 Repetir Simulado
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 transition"
            >
              🏠 Voltar ao Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // HUB PRINCIPAL DO ESTUDANTE
  // --------------------------------------------------------------------------
  return (
    <div className="student-dashboard-layout">
      {/* 1. BARRA LATERAL ESQUERDA (Navegação Reativa) */}
      <aside className="student-sidebar">
        {/* Logotipo que volta ao Início */}
        <button className="sidebar-logo" onClick={handleGoHome} title="Ir para a Tela Inicial">
          <div className="sidebar-logo-icon">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <path d="M12 8H24C28.4183 8 32 11.5817 32 16C32 20.4183 28.4183 24 24 24H18V32H12V8Z" fill="white" />
              <path d="M18 14H24C25.1046 14 26 14.8954 26 16C26 17.1046 25.1046 18 24 18H18V14Z" fill="#0284c7" />
            </svg>
          </div>
          <div className="sidebar-logo-text">Progress<span>Ed</span></div>
        </button>

        {/* Itens de Navegação que trocam a tela dinamicamente */}
        <nav className="sidebar-nav">
          <button
            className={`nav-item-btn ${sidebarTab === 'trilhas' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setSidebarTab('trilhas');
              setViewMode('hub');
            }}
            title="Trilhas Curriculares e Missões"
          >
            <span className="nav-icon">🗺️</span>
            <span>Trilhas</span>
          </button>

          <button
            className={`nav-item-btn ${sidebarTab === 'ranking' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setSidebarTab('ranking');
              setViewMode('hub');
            }}
            title="Classificação Geral da Escola"
          >
            <span className="nav-icon">🏆</span>
            <span>Ranking</span>
          </button>

          <button
            className={`nav-item-btn ${sidebarTab === 'perfil' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setSidebarTab('perfil');
              setViewMode('hub');
            }}
            title="Meu Perfil e Medalhas"
          >
            <span className="nav-icon">👤</span>
            <span>Perfil</span>
          </button>
        </nav>

        {/* Card Sequência de 7 Dias */}
        <div className="sidebar-streak-card">
          <div className="streak-top-row">
            <span>🔥</span>
            <span>Sequência atual</span>
          </div>
          <div className="streak-days-count">7 dias</div>
          <div className="streak-week-dots">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => (
              <div key={idx} className={`week-day-dot ${idx < 6 ? 'done' : 'today'}`}>
                ✓
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. VIEWPORT PRINCIPAL */}
      <main className="student-viewport">
        {/* Top Header */}
        <header className="student-top-header">
          <div>
            <h1 className="greeting-title">
              Olá, {currentUser.name || 'Amberson'}! <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="greeting-subtitle">
              {sidebarTab === 'ranking'
                ? 'Confira o pódio e a classificação da sua turma no Centro Educa Mais Paulo Freire.'
                : sidebarTab === 'perfil'
                ? 'Acompanhe seu avanço curricular, conquistas e proficiência por área da BNCC.'
                : 'Trilhas do Ensino Médio Integral • Conquiste XP e avance nos níveis da BNCC!'}
            </p>
          </div>

          <div className="top-header-widgets">
            <div className="energy-badge" title="Energia / Pontos de Ação">
              <span>⚡</span>
              <span>150</span>
            </div>

            {/* Sino de Notificações com Drawer Retrátil */}
            <button
              className={`bell-button ${showNotifications ? 'active' : ''}`}
              onClick={handleToggleNotifications}
              title="Notificações Escolares"
            >
              <span>🔔</span>
              {unreadCount > 0 && <span className="bell-badge-count">{unreadCount}</span>}
            </button>

            {/* Dropdown de Notificações */}
            {showNotifications && (
              <div className="notifications-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="notifications-header-bar">
                  <h4>
                    <span>🔔</span>
                    <span>Recados & Alertas</span>
                  </h4>
                  {unreadCount > 0 && (
                    <button className="btn-clear-notifications" onClick={handleClearNotifications}>
                      Marcar lidas
                    </button>
                  )}
                </div>

                <div className="notifications-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item-card ${n.unread ? 'unread' : ''}`}
                      onClick={() => {
                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                        if (n.title.includes('Física')) handleStartAreaQuiz('natureza', 5);
                        if (n.title.includes('Simulado')) handleStartAreaQuiz('simulado');
                      }}
                    >
                      <span className="notif-icon-box">{n.icon}</span>
                      <div className="notif-content-text">
                        <h6>{n.title}</h6>
                        <p>{n.message}</p>
                        <span className="notif-time-tag">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfil Rápido */}
            <div
              className="user-profile-pill"
              onClick={() => {
                playClickSound();
                setSidebarTab('perfil');
              }}
              title="Ir para o Perfil"
            >
              <div className="user-avatar-circle">
                {selectedAvatarEmoji}
              </div>
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                {currentUser.name?.split(' ')[0] || 'Aluno'}
              </span>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* ABA 1: TRILHAS CURRICULARES (DUOLINGO & PERGUNTADOS GAMIFIED)     */}
        {/* ================================================================ */}
        {sidebarTab === 'trilhas' && (
          <div>
            {/* Banner Nível 5 & XP */}
            <div className="level-banner-card">
              <div className="gold-hexagon-badge">
                <span className="hexagon-number">{currentLevel}</span>
              </div>
              <div className="level-info-content">
                <div className="level-top-status">
                  <div>
                    <span className="level-badge-title">NÍVEL ATUAL</span>
                    <h2 className="level-name-display">Nível {currentLevel} • Explorador BNCC</h2>
                  </div>
                  <div className="xp-ratio-text">
                    XP: <span>{currentXp}</span>/{targetXp}
                  </div>
                </div>

                <div className="level-progress-bar-container">
                  <div className="level-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                <p className="level-progress-subtext">Faltam {xpNeeded} XP para o próximo nível</p>
              </div>
            </div>

            {/* SELETOR DE DISCIPLINAS BNCC (ESTILO PERGUNTADOS / TRIVIA CRACK) */}
            <section className="perguntados-category-bar">
              <div className="category-bar-header">
                <h3>
                  <span>🎯</span>
                  <span>Áreas do Conhecimento (Ensino Médio Integral)</span>
                </h3>
                {/* Botão Roleta / Desafio Relâmpago */}
                <button
                  type="button"
                  className="btn-random-wheel"
                  onClick={handleRandomQuickChallenge}
                  title="Gira a roleta e responde a uma questão aleatória com bônus de XP!"
                >
                  <span>⚡</span>
                  <span>Roleta / Desafio Relâmpago</span>
                </button>
              </div>

              {/* Grid das 5 Grandes Áreas */}
              <div className="disciplines-cards-scroll">
                {BNCC_AREAS.map((area) => {
                  const isActive = selectedAreaKey === area.key;
                  const count = countsByArea[area.key] || 25;

                  return (
                    <div
                      key={area.key}
                      className={`discipline-card-pill ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        playClickSound();
                        setSelectedAreaKey(area.key);
                      }}
                    >
                      <div>
                        <span className="card-top-icon">{area.icon}</span>
                        <h5>{area.shortName}</h5>
                        <p>{area.subtitle}</p>
                      </div>
                      <span className="question-counter-badge">
                        {count} desafios disponíveis
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CAMINHO EM ZIGUE-ZAGUE ESTILO DUOLINGO */}
            <section className="duolingo-trail-section">
              <div className="trail-section-header">
                <div>
                  <h4>
                    Trilha: {BNCC_AREAS.find(a => a.key === selectedAreaKey)?.name}
                  </h4>
                  <p>
                    {BNCC_AREAS.find(a => a.key === selectedAreaKey)?.subtitle} • Habilidade: {BNCC_AREAS.find(a => a.key === selectedAreaKey)?.competence}
                  </p>
                </div>
                <button
                  className="btn-view-available-trails"
                  onClick={() => handleStartAreaQuiz(selectedAreaKey, 5)}
                >
                  <span>🚀 Continuar Jornada</span>
                </button>
              </div>

              {/* Nós Conectados em zigue-zague */}
              <div className="winding-path-container">
                {/* Nó 1: Concluído */}
                <div
                  className="duolingo-level-node completed offset-center"
                  onClick={() => handleStartAreaQuiz(selectedAreaKey, 1)}
                  title="Missão 1: Conceitos Iniciais"
                >
                  <div className="node-circle-button">✓</div>
                  <span className="node-title-badge">1. Fundamentos</span>
                  <div className="node-stars-row">⭐⭐⭐</div>
                </div>

                {/* Nó 2: Concluído */}
                <div
                  className="duolingo-level-node completed offset-left"
                  onClick={() => handleStartAreaQuiz(selectedAreaKey, 2)}
                  title="Missão 2: Interpretação & Lógica"
                >
                  <div className="node-circle-button">✓</div>
                  <span className="node-title-badge">2. Leitura Crítica</span>
                  <div className="node-stars-row">⭐⭐⭐</div>
                </div>

                {/* Nó 3: Concluído */}
                <div
                  className="duolingo-level-node completed offset-right"
                  onClick={() => handleStartAreaQuiz(selectedAreaKey, 3)}
                  title="Missão 3: Aplicação Prática"
                >
                  <div className="node-circle-button">✓</div>
                  <span className="node-title-badge">3. Estruturas</span>
                  <div className="node-stars-row">⭐⭐⭐</div>
                </div>

                {/* Nó 4: Concluído */}
                <div
                  className="duolingo-level-node completed offset-left"
                  onClick={() => handleStartAreaQuiz(selectedAreaKey, 4)}
                  title="Missão 4: Análise Conceitual"
                >
                  <div className="node-circle-button">✓</div>
                  <span className="node-title-badge">4. Métodos</span>
                  <div className="node-stars-row">⭐⭐⭐</div>
                </div>

                {/* Nó 5: NÓ ATIVO ONDE O ALUNO ESTÁ POSICIONADO! */}
                <div
                  className="duolingo-level-node active offset-center"
                  onClick={() => handleStartAreaQuiz(selectedAreaKey, 5)}
                  title="Clique para iniciar o desafio atual!"
                >
                  {/* Pin do Aluno em pé sobre o nó */}
                  <div className="active-student-pin">
                    <span>{selectedAvatarEmoji}</span>
                    <span>VOCÊ ESTÁ AQUI</span>
                  </div>
                  <div className="node-circle-button">
                    🧠
                  </div>
                  <span className="node-title-badge font-bold text-sky-300">5. Missão Atual (Desafios do Banco)</span>
                  <span className="text-[10px] text-sky-400 font-extrabold mt-1 tracking-wider">CLIQUE PARA JOGAR</span>
                </div>

                {/* Nó 6: Baú de Tesouro / Recompensa Milestone */}
                <div
                  className="duolingo-level-node chest offset-right"
                  onClick={() => alert('🎁 Baú de Recompensa: Complete a Missão 5 para abrir e receber +100 XP e dicas exclusivas da BNCC!')}
                  title="Baú de Tesouro BNCC"
                >
                  <div className="node-circle-button">🎁</div>
                  <span className="node-title-badge text-amber-300 font-bold">Recompensa Bônus</span>
                </div>

                {/* Nó 7: Trancado */}
                <div
                  className="duolingo-level-node locked offset-left"
                  onClick={() => alert('🔒 Etapa Bloqueada: Vença a Missão 5 para desbloquear!')}
                >
                  <div className="node-circle-button">🔒</div>
                  <span className="node-title-badge">6. Análise Crítica</span>
                </div>

                {/* Nó 8: Trancado */}
                <div
                  className="duolingo-level-node locked offset-center"
                  onClick={() => alert('🔒 Etapa Bloqueada')}
                >
                  <div className="node-circle-button">🔒</div>
                  <span className="node-title-badge">7. Raciocínio Avançado</span>
                </div>

                {/* Nó 9: Troféu Final */}
                <div
                  className="duolingo-level-node chest offset-center"
                  onClick={() => handleStartAreaQuiz('simulado')}
                  title="Projeto Final / Simulado ENEM"
                >
                  <div className="node-circle-button">🏆</div>
                  <span className="node-title-badge font-bold text-amber-300">Desafio Final ENEM</span>
                </div>
              </div>
            </section>

            {/* 4 Cards de Métricas Inferiores */}
            <div className="student-metrics-row">
              <div className="metric-summary-card">
                <div className="metric-icon-square green">✓</div>
                <div className="metric-text-details">
                  <h5>Aulas concluídas</h5>
                  <p>24</p>
                </div>
              </div>

              <div className="metric-summary-card">
                <div className="metric-icon-square blue">✏️</div>
                <div className="metric-text-details">
                  <h5>Exercícios feitos</h5>
                  <p>128</p>
                </div>
              </div>

              <div className="metric-summary-card">
                <div className="metric-icon-square purple">⭐</div>
                <div className="metric-text-details">
                  <h5>XP conquistado</h5>
                  <p>{currentXp}</p>
                </div>
              </div>

              <div className="metric-summary-card">
                <div className="metric-icon-square amber">⏱️</div>
                <div className="metric-text-details">
                  <h5>Tempo de estudo</h5>
                  <p>18h 45m</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ABA 2: RANKING COMPLETO COM PÓDIO (ESTILO JOGO / LEADERBOARD)    */}
        {/* ================================================================ */}
        {sidebarTab === 'ranking' && (
          <div className="ranking-view-fullscreen">
            <div className="ranking-view-header">
              <h2>🏆 Quadro de Honra & Ranking da Turma</h2>
              <p>Centro Educa Mais Paulo Freire • Acompanhamento de Pontuação e Aproveitamento</p>
            </div>

            {/* PÓDIO 1º, 2º e 3º LUGARES */}
            <div className="podium-container">
              {/* 2º Lugar */}
              <div className="podium-step-card second">
                <div className="podium-avatar-wrapper">
                  <div className="podium-avatar-bubble second">
                    👩‍🎓
                  </div>
                  <span className="podium-crown-badge">🥈</span>
                </div>
                <div className="podium-pedestal-box">
                  <p className="podium-student-name">Mariana Silva</p>
                  <span className="podium-student-xp">2.980 XP</span>
                  <span className="text-xs text-slate-400 mt-1">Nível 7</span>
                </div>
              </div>

              {/* 1º Lugar (Destaque Central Ouro) */}
              <div className="podium-step-card first">
                <div className="podium-avatar-wrapper">
                  <div className="podium-avatar-bubble first">
                    👑
                  </div>
                  <span className="podium-crown-badge">🥇</span>
                </div>
                <div className="podium-pedestal-box">
                  <p className="podium-student-name">Lucas Mendes</p>
                  <span className="podium-student-xp text-amber-400 font-extrabold text-base">3.250 XP</span>
                  <span className="text-xs text-slate-300 mt-1">Nível 8 • Líder</span>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="podium-step-card third">
                <div className="podium-avatar-wrapper">
                  <div className="podium-avatar-bubble third">
                    👨‍🎓
                  </div>
                  <span className="podium-crown-badge">🥉</span>
                </div>
                <div className="podium-pedestal-box">
                  <p className="podium-student-name">Pedro Henrique</p>
                  <span className="podium-student-xp">2.750 XP</span>
                  <span className="text-xs text-slate-400 mt-1">Nível 7</span>
                </div>
              </div>
            </div>

            {/* Tabela Completa de Ranking */}
            <div className="ranking-table-card">
              <div className="ranking-table-controls">
                <div className="ranking-filter-tabs" style={{ maxWidth: '240px', margin: 0 }}>
                  <button
                    className={`ranking-tab-btn ${rankingScope === 'escola' ? 'active' : ''}`}
                    onClick={() => setRankingScope('escola')}
                  >
                    Escola
                  </button>
                  <button
                    className={`ranking-tab-btn ${rankingScope === 'global' ? 'active' : ''}`}
                    onClick={() => setRankingScope('global')}
                  >
                    Maranhão / Global
                  </button>
                </div>

                <div className="ranking-search-bar">
                  <input
                    type="text"
                    placeholder="Buscar colega pelo nome..."
                    value={rankingSearch}
                    onChange={(e) => setRankingSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="ranking-list-items">
                {studentRankingList.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`ranking-item-row ${item.isCurrent ? 'current-user' : ''}`}
                  >
                    <span className={`ranking-position-badge ${idx < 3 ? 'crown' : ''}`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
                    </span>

                    <div className="ranking-user-meta">
                      <div className="ranking-avatar-thumb">
                        {item.name[0]}
                      </div>
                      <div className="ranking-user-names">
                        <h6>
                          {item.name} {item.isCurrent && <span className="text-sky-400 text-xs font-bold">(Você)</span>}
                        </h6>
                        <p>{item.school} • Nível {item.level} • {item.accuracy}% precisão</p>
                      </div>
                    </div>

                    <div className="ranking-xp-pill">
                      {item.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ABA 3: PERFIL DO ESTUDANTE & CONQUISTAS                          */}
        {/* ================================================================ */}
        {sidebarTab === 'perfil' && (
          <div className="profile-view-fullscreen">
            {/* Cartão de Identidade Estudantil */}
            <div className="profile-identity-card">
              <div className="profile-avatar-large">
                {selectedAvatarEmoji}
              </div>

              <div className="profile-identity-meta">
                <h2>{currentUser.name || 'Amberson Rogers'}</h2>
                <p>{currentUser.email || 'aluno@progressed.com'}</p>
                <div className="profile-school-tag">
                  <span>🏫</span>
                  <span>Centro Educa Mais Paulo Freire • 3º Ano Ensino Médio Integral</span>
                </div>

                {/* Seletor Rápido de Avatar */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Escolha seu Avatar:</span>
                  {['🎓', '🧠', '🚀', '⚡', '🔬', '⭐', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedAvatarEmoji(emoji);
                      }}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition ${
                        selectedAvatarEmoji === emoji ? 'border-sky-400 bg-sky-500/20' : 'border-white/10 bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar / Barras de Proficiência Curricular BNCC */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>Proficiência por Área da BNCC</span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-violet-300">Linguagens e suas Tecnologias</span>
                    <span className="text-violet-400">92% (Excelente)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-fuchsia-300">Matemática e suas Tecnologias</span>
                    <span className="text-fuchsia-400">78% (Bom)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-300">Ciências da Natureza</span>
                    <span className="text-emerald-400">68% (Em Desenvolvimento)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-amber-300">Ciências Humanas e Sociais</span>
                    <span className="text-amber-400">95% (Destaque)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Vitrine de Emblemas & Conquistas */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🏅</span>
                <span>Conquistas & Emblemas Desbloqueados</span>
              </h3>

              <div className="profile-badges-grid">
                <div className="badge-item-box">
                  <span className="badge-icon">🥇</span>
                  <h5>Pioneiro BNCC</h5>
                  <p>Completou a primeira trilha de desafios do ensino médio.</p>
                  <span className="badge-status-pill unlocked">DESBLOQUEADO</span>
                </div>

                <div className="badge-item-box">
                  <span className="badge-icon">🔥</span>
                  <h5>Fogo Sagrado</h5>
                  <p>Manteve 7 dias ininterruptos de ofensiva de estudos.</p>
                  <span className="badge-status-pill unlocked">DESBLOQUEADO</span>
                </div>

                <div className="badge-item-box">
                  <span className="badge-icon">🧠</span>
                  <h5>Mestre da Lógica</h5>
                  <p>Acertou 10 questões seguidas de raciocínio abstrato.</p>
                  <span className="badge-status-pill unlocked">DESBLOQUEADO</span>
                </div>

                <div className="badge-item-box">
                  <span className="badge-icon">🏆</span>
                  <h5>Gabarito ENEM</h5>
                  <p>Alcance 800+ pontos no Simulado Geral da BNCC.</p>
                  <span className="badge-status-pill progress">80% CONCLUÍDO</span>
                </div>
              </div>
            </div>

            {/* Botão de Logout */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={onLogout}
                className="px-6 py-3 rounded-xl bg-rose-900/40 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-900/60 transition flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
