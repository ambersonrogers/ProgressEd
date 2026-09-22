import { useState, useEffect } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import api from '../services/api';
import { DEFAULT_CHALLENGES, DEFAULT_RANKING } from '../data/defaultChallenges';
import './StudentDashboard.css';

const MODULES = [
  { id: 1, name: 'Linguagens & Códigos', subtitle: 'Português • Redação • Literatura • Inglês', description: 'Trilhas de interpretação textual, gramática, literatura brasileira e análise de discurso.', icon: '📝', color: 'from-violet-600 to-indigo-600' },
  { id: 2, name: 'Matemática & Suas Tecnologias', subtitle: 'Álgebra • Geometria • Estatística • Funções', description: 'Desafios que desenvolvem o raciocínio lógico, modelagem matemática e resolução de problemas.', icon: '📐', color: 'from-fuchsia-600 to-purple-800' },
  { id: 3, name: 'Ciências da Natureza', subtitle: 'Física • Química • Biologia', description: 'Experimentos, termodinâmica, eletricidade, reações químicas, genética e ecologia.', icon: '🧪', color: 'from-emerald-500 to-teal-700' },
  { id: 4, name: 'Ciências Humanas & Sociais', subtitle: 'História • Geografia • Filosofia • Sociologia', description: 'Sociedade, cidadania, marcos históricos nacionais e globais, geopolítica e direitos humanos.', icon: '📜', color: 'from-amber-500 to-orange-700' },
  { id: 5, name: 'Atualidades & Cidadania', subtitle: 'Mundo Contemporâneo • Meio Ambiente • Tecnologia', description: 'Debates contemporâneos essenciais para temas de redação e provas do ENEM.', icon: '🌎', color: 'from-cyan-500 to-sky-700' },
];

const LEVEL_XP = 500;

function normalizeChallenge(c) {
  return {
    id: c.id,
    moduleId: Number(c.moduleId || c.module_id || 1),
    subject: c.subject || 'Conhecimentos Gerais',
    title: c.title || `${c.subject || 'Desafio'} #${c.id}`,
    question: c.question || c.text || '',
    optionA: c.optionA ?? c.option_a ?? '',
    optionB: c.optionB ?? c.option_b ?? '',
    optionC: c.optionC ?? c.option_c ?? '',
    optionD: c.optionD ?? c.option_d ?? '',
    optionE: c.optionE ?? c.option_e ?? null,
    correctAnswer: (c.correctAnswer || c.correct_answer || 'A').toUpperCase(),
    difficulty: Number(c.difficulty || 2),
    xpReward: Number(c.xpReward || c.xp_reward || 15),
    explanation: c.explanation || c.description ||
      `A alternativa correta é a (${(c.correctAnswer || c.correct_answer || 'A').toUpperCase()}). Compreender este conceito consolida as competências essenciais da BNCC em ${c.subject || 'Conhecimentos Gerais'}.`
  };
}

function StudentDashboard({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || { name: 'Ana Carolina', level: 5, xp: 2450 });
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(DEFAULT_RANKING);

  // Navegação
  const [sidebarTab, setSidebarTab] = useState('trilhas'); // 'trilhas' | 'ranking' | 'perfil'
  const [rankingTab, setRankingTab] = useState('global'); // 'global' | 'escola'
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Estados do Quiz
  const [viewMode, setViewMode] = useState('hub'); // 'hub' | 'quiz' | 'simulado_result'
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

  // Timer com pausa pedagógica automática ao responder
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
      console.warn('Perfil local mantido:', error.message);
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

  const handleStartTrack = (module) => {
    const trackChallenges = challenges.filter(c => c.moduleId === module.id);
    const selectedList = trackChallenges.length > 0 ? trackChallenges : challenges.slice(0, 5);

    setCurrentTrack(module);
    setQuizMode('track');
    setActiveQuizList(selectedList);
    setCurrentIndex(0);
    setTimeLeft(30);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setShowTrackModal(false);
    setViewMode('quiz');
  };

  const handleStartSimulado = (count = 10) => {
    const shuffled = [...challenges].sort(() => 0.5 - Math.random()).slice(0, count);
    setCurrentTrack({ name: 'Simulado Geral BNCC (ENEM)', icon: '🎯', subtitle: '10 Questões Multidisciplinares' });
    setQuizMode('simulado');
    setActiveQuizList(shuffled);
    setCurrentIndex(0);
    setTimeLeft(45);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setShowTrackModal(false);
    setViewMode('quiz');
  };

  const handleChallengeSubmit = async (challengeId, answer) => {
    setTimerPaused(true); // Pausa o tempo imediatamente para que o aluno leia a explicação com calma!
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
      if (quizMode === 'simulado') {
        setViewMode('simulado_result');
      } else {
        alert('🎉 Desafio concluído com sucesso! Excelente progresso.');
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

  // Dados fiéis do Ranking
  const topRankings = [
    { rank: 1, name: 'Lucas Mendes', level: 8, xp: 3250, isCurrent: false },
    { rank: 2, name: 'Mariana Silva', level: 7, xp: 2980, isCurrent: false },
    { rank: 3, name: 'Pedro Henrique', level: 7, xp: 2750, isCurrent: false },
    { rank: 4, name: 'Beatriz Oliveira', level: 6, xp: 2450, isCurrent: false },
    { rank: 5, name: currentUser.name || 'Ana Carolina', level: currentLevel, xp: currentXp, isCurrent: true }
  ];

  // --------------------------------------------------------------------------
  // TELA DO QUIZ (Fiel ao MVP Image 3)
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
          onExit={() => setViewMode('hub')}
          isLastQuestion={currentIndex >= activeQuizList.length - 1}
          disabled={disabled}
          timeExpired={timeExpired}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TELA DE RESULTADO DO SIMULADO
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
              onClick={() => handleStartSimulado(10)}
              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-white transition shadow-lg"
            >
              🔄 Repetir Simulado
            </button>
            <button
              onClick={() => setViewMode('hub')}
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
  // HUB PRINCIPAL DO ESTUDANTE (Faithful to MVP Image 0)
  // --------------------------------------------------------------------------
  return (
    <div className="student-dashboard-layout">
      {/* 1. Left Vertical Navigation Sidebar */}
      <aside className="student-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <path d="M12 8H24C28.4183 8 32 11.5817 32 16C32 20.4183 28.4183 24 24 24H18V32H12V8Z" fill="white" />
              <path d="M18 14H24C25.1046 14 26 14.8954 26 16C26 17.1046 25.1046 18 24 18H18V14Z" fill="#0284c7" />
            </svg>
          </div>
          <div className="sidebar-logo-text">Progress<span>Ed</span></div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item-btn ${sidebarTab === 'trilhas' ? 'active' : ''}`}
            onClick={() => setSidebarTab('trilhas')}
          >
            <span className="nav-icon">🗺️</span>
            <span>Trilhas</span>
          </button>
          <button
            className={`nav-item-btn ${sidebarTab === 'ranking' ? 'active' : ''}`}
            onClick={() => setSidebarTab('ranking')}
          >
            <span className="nav-icon">🏆</span>
            <span>Ranking</span>
          </button>
          <button
            className={`nav-item-btn ${sidebarTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setSidebarTab('perfil')}
          >
            <span className="nav-icon">👤</span>
            <span>Perfil</span>
          </button>
        </nav>

        {/* Sidebar Streak Card */}
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

      {/* 2. Main Viewport */}
      <main className="student-viewport">
        {/* Top Header */}
        <header className="student-top-header">
          <div>
            <h1 className="greeting-title">
              Olá, {currentUser.name || 'Ana'}! <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="greeting-subtitle">Continue sua jornada de aprendizado e conquiste novos níveis!</p>
          </div>

          <div className="top-header-widgets">
            <div className="energy-badge" title="Energia / Streak">
              <span>⚡</span>
              <span>150</span>
            </div>

            <button className="bell-button" title="Notificações">
              <span>🔔</span>
              <span className="bell-badge-count">3</span>
            </button>

            <div className="user-profile-pill" onClick={onLogout} title="Clique para sair">
              <div className="user-avatar-circle">
                {(currentUser.name || 'A')[0]}
              </div>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sair 🚪</span>
            </div>
          </div>
        </header>

        {/* 3. Two-Column Layout (Center Main + Right Sidebar) */}
        <div className="student-content-grid">
          {/* LEFT / CENTER COLUMN */}
          <div className="student-main-column">
            {/* Level 5 Gold Hexagon Banner */}
            <div className="level-banner-card">
              <div className="gold-hexagon-badge">
                <span className="hexagon-number">{currentLevel}</span>
              </div>
              <div className="level-info-content">
                <div className="level-top-status">
                  <div>
                    <span className="level-badge-title">NÍVEL</span>
                    <h2 className="level-name-display">Nível {currentLevel}</h2>
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

            {/* Learning Trail Card with Connected Nodes (Faithful to MVP Image 0) */}
            <div className="trail-master-card">
              <div className="trail-header-row">
                <div className="trail-title-wrapper">
                  <span className="trail-title-icon">📖</span>
                  <div>
                    <h3>Trilha de Aprendizagem</h3>
                    <p>Desenvolva suas habilidades passo a passo</p>
                  </div>
                </div>
                <button
                  className="btn-view-available-trails"
                  onClick={() => setShowTrackModal(true)}
                >
                  <span>Ver trilhas disponíveis</span>
                  <span>&gt;</span>
                </button>
              </div>

              {/* Visual Connected Nodes (Snake Trail) */}
              <div className="trail-nodes-canvas">
                {/* Top Row: Nodes 1 to 6 */}
                <div className="trail-nodes-row">
                  {/* Node 1 */}
                  <div className="trail-node-item completed" onClick={() => handleStartTrack(MODULES[0])}>
                    <span className="node-step-tag">1</span>
                    <div className="node-circle-bubble">✓</div>
                    <div className="node-title-caption">Introdução ao Conhecimento</div>
                    <span className="node-status-check">✓</span>
                  </div>

                  {/* Node 2 */}
                  <div className="trail-node-item completed" onClick={() => handleStartTrack(MODULES[0])}>
                    <span className="node-step-tag">2</span>
                    <div className="node-circle-bubble">&lt;/&gt;</div>
                    <div className="node-title-caption">Lógica e Leitura Crítica</div>
                    <span className="node-status-check">✓</span>
                  </div>

                  {/* Node 3 */}
                  <div className="trail-node-item completed" onClick={() => handleStartTrack(MODULES[1])}>
                    <span className="node-step-tag">3</span>
                    <div className="node-circle-bubble">🗄️</div>
                    <div className="node-title-caption">Estruturas e Dados</div>
                    <span className="node-status-check">✓</span>
                  </div>

                  {/* Node 4 */}
                  <div className="trail-node-item completed" onClick={() => handleStartTrack(MODULES[1])}>
                    <span className="node-step-tag">4</span>
                    <div className="node-circle-bubble">f(x)</div>
                    <div className="node-title-caption">Funções e Relações</div>
                    <span className="node-status-check">✓</span>
                  </div>

                  {/* Node 5 - Active (Glowing Brain) */}
                  <div className="trail-node-item active" onClick={() => handleStartTrack(MODULES[2])} title="Clique para iniciar o desafio atual!">
                    <span className="node-step-tag">5</span>
                    <div className="node-circle-bubble">🧠</div>
                    <div className="active-ring-indicator" />
                    <div className="node-title-caption font-bold text-sky-300">Ciências & Fenômenos</div>
                    <span className="text-[10px] text-sky-400 font-bold mt-1">EM ANDAMENTO</span>
                  </div>

                  {/* Node 6 - Locked */}
                  <div className="trail-node-item locked" onClick={() => alert('Complete os desafios do nível 5 para desbloquear esta etapa!')}>
                    <span className="node-step-tag">6</span>
                    <div className="node-circle-bubble">🔒</div>
                    <div className="node-title-caption">Análise Crítica & Redação</div>
                    <span className="node-status-lock">🔒</span>
                  </div>
                </div>

                {/* Bottom Row: Nodes 7 to 10 */}
                <div className="trail-nodes-row" style={{ marginTop: '1rem' }}>
                  {/* Node 7 */}
                  <div className="trail-node-item locked" onClick={() => alert('Etapa bloqueada')}>
                    <span className="node-step-tag">7</span>
                    <div className="node-circle-bubble">🔒</div>
                    <div className="node-title-caption">Sociedade & Cidadania</div>
                    <span className="node-status-lock">🔒</span>
                  </div>

                  {/* Node 8 */}
                  <div className="trail-node-item locked" onClick={() => alert('Etapa bloqueada')}>
                    <span className="node-step-tag">8</span>
                    <div className="node-circle-bubble">🔒</div>
                    <div className="node-title-caption">Eletricidade & Matéria</div>
                    <span className="node-status-lock">🔒</span>
                  </div>

                  {/* Node 9 */}
                  <div className="trail-node-item locked" onClick={() => alert('Etapa bloqueada')}>
                    <span className="node-step-tag">9</span>
                    <div className="node-circle-bubble">🔒</div>
                    <div className="node-title-caption">Otimização & Métodos</div>
                    <span className="node-status-lock">🔒</span>
                  </div>

                  {/* Node 10 - Expert Trophy */}
                  <div className="trail-node-item trophy" onClick={() => handleStartSimulado(10)} title="Simulado Geral BNCC (ENEM)">
                    <span className="node-step-tag">10</span>
                    <div className="node-circle-bubble">🏆</div>
                    <div className="node-title-caption font-bold text-amber-300">Projeto Final Desafio Expert</div>
                    <span className="text-[10px] text-amber-400 font-bold mt-1">SIMULADO ENEM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Bottom Metrics Cards (Faithful to MVP Image 0) */}
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

          {/* RIGHT COLUMN (Ranking & Performance) */}
          <div className="student-right-column">
            {/* Ranking Geral Card */}
            <div className="ranking-sidebar-card">
              <div className="ranking-top-header">
                <h4 className="ranking-title-label">
                  <span>🏆</span>
                  <span>Ranking Geral</span>
                </h4>
                <a href="#ranking" onClick={(e) => { e.preventDefault(); setShowTrackModal(true); }} className="ranking-view-all-link">
                  Ver tudo &gt;
                </a>
              </div>

              {/* Tabs [Global] / [Escola] */}
              <div className="ranking-filter-tabs">
                <button
                  className={`ranking-tab-btn ${rankingTab === 'global' ? 'active' : ''}`}
                  onClick={() => setRankingTab('global')}
                >
                  Global
                </button>
                <button
                  className={`ranking-tab-btn ${rankingTab === 'escola' ? 'active' : ''}`}
                  onClick={() => setRankingTab('escola')}
                >
                  Escola
                </button>
              </div>

              {/* Student Ranking List */}
              <div className="ranking-list-items">
                {topRankings.map((item) => (
                  <div
                    key={item.rank}
                    className={`ranking-item-row ${item.isCurrent ? 'current-user' : ''}`}
                  >
                    <span className={`ranking-position-badge ${item.rank <= 3 ? 'crown' : ''}`}>
                      {item.rank <= 3 ? '👑' : item.rank}
                    </span>

                    <div className="ranking-user-meta">
                      <div className="ranking-avatar-thumb">
                        {item.name[0]}
                      </div>
                      <div className="ranking-user-names">
                        <h6>
                          {item.name} {item.isCurrent && <span className="text-sky-400 text-xs">(Você)</span>}
                        </h6>
                        <p>Nível {item.level}</p>
                      </div>
                    </div>

                    <div className="ranking-xp-pill">
                      {item.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Card with Sparklines */}
            <div className="performance-sidebar-card">
              <div className="perf-card-header">
                <h4>Seu desempenho</h4>
                <p>Comparado à semana passada</p>
              </div>

              <div className="perf-metrics-grid">
                <div className="perf-stat-box">
                  <p className="stat-label">XP ganho</p>
                  <div className="stat-val">
                    <span>+520</span>
                    <span className="text-sm">↑</span>
                  </div>
                  <svg className="mini-sparkline-svg" viewBox="0 0 100 30">
                    <path d="M0,25 Q20,10 40,20 T80,5 T100,15" />
                  </svg>
                </div>

                <div className="perf-stat-box">
                  <p className="stat-label">Posição no ranking</p>
                  <div className="stat-val">
                    <span>↑ 2</span>
                  </div>
                  <svg className="mini-sparkline-svg" viewBox="0 0 100 30">
                    <path d="M0,20 Q25,25 50,15 T75,8 T100,5" />
                  </svg>
                  <p className="stat-sub">subiu 2 posições</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Escolha de Trilhas da BNCC ou Simulado ENEM */}
        {showTrackModal && (
          <div className="track-selector-modal-overlay" onClick={() => setShowTrackModal(false)}>
            <div className="track-selector-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <div>
                  <h3>Trilhas Curriculares & Simulado BNCC</h3>
                  <p className="text-xs text-slate-400 mt-1">Centro Educa Mais Paulo Freire • Selecione um percurso</p>
                </div>
                <button className="modal-close-btn" onClick={() => setShowTrackModal(false)}>✕</button>
              </div>

              {/* Simulado Geral Banner */}
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-sky-950 via-blue-950 to-indigo-950 p-5 border border-sky-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">⚡ Desafio Completo</span>
                  <h4 className="text-xl font-bold text-white mt-0.5">Simulado Geral Multidisciplinar (ENEM)</h4>
                  <p className="text-xs text-slate-300 mt-1">10 questões selecionadas de todas as áreas com cálculo estimado de nota.</p>
                </div>
                <button
                  onClick={() => handleStartSimulado(10)}
                  className="whitespace-nowrap px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-white shadow-lg transition"
                >
                  Iniciar Simulado
                </button>
              </div>

              {/* Grid de Trilhas BNCC */}
              <div className="grid gap-4 sm:grid-cols-2">
                {MODULES.map((m) => {
                  const count = challenges.filter(c => c.moduleId === m.id).length;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleStartTrack(m)}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-sky-500/50 hover:bg-slate-900 transition cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{m.icon}</span>
                          <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full">{count} questões</span>
                        </div>
                        <h5 className="text-base font-bold text-white mt-3">{m.name}</h5>
                        <p className="text-xs text-sky-300 mt-0.5">{m.subtitle}</p>
                        <p className="text-xs text-slate-400 mt-2">{m.description}</p>
                      </div>
                      <button className="mt-4 w-full py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-sky-600 text-white transition">
                        Começar Trilha &rarr;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
