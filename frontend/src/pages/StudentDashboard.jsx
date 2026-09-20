import { useState, useEffect, useMemo } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import api from '../services/api';
import { DEFAULT_CHALLENGES, DEFAULT_RANKING } from '../data/defaultChallenges';
import './StudentDashboard.css';

const MODULES = [
  { id: 1, name: 'Linguagens', subtitle: 'Português • Inglês • Literatura • Artes', description: 'Trilhas de interpretação textual, gramática, literatura e línguas adicionais.', icon: '📝', color: 'from-violet-600 to-indigo-600' },
  { id: 2, name: 'Matemática', subtitle: 'Álgebra • Geometria • Estatística • Funções', description: 'Desafios que desenvolvem o raciocínio abstrato, cálculo e resolução de problemas.', icon: '📐', color: 'from-fuchsia-600 to-purple-800' },
  { id: 3, name: 'Ciências da Natureza', subtitle: 'Física • Química • Biologia', description: 'Questões experimentais, fenômenos da matéria, energia e ecossistemas.', icon: '🧪', color: 'from-emerald-500 to-teal-700' },
  { id: 4, name: 'Ciências Humanas', subtitle: 'História • Geografia • Filosofia • Sociologia', description: 'Sociedade, cidadania, marcos históricos e formação social do Brasil.', icon: '📜', color: 'from-amber-500 to-orange-700' },
  { id: 5, name: 'Atualidades & Cidadania', subtitle: 'Mundo Contemporâneo • Meio Ambiente', description: 'Temas contemporâneos, ética e debates fundamentais para vestibulares e ENEM.', icon: '🌎', color: 'from-cyan-500 to-sky-700' },
];

const LEVEL_XP = 200;

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
    difficulty: Number(c.difficulty || 1),
    xpReward: Number(c.xpReward || c.xp_reward || 15),
    explanation: c.explanation || c.description ||
      `A alternativa correta é a (${(c.correctAnswer || c.correct_answer || 'A').toUpperCase()}). Compreender este conceito consolida os fundamentos curriculares da BNCC em ${c.subject || 'Conhecimentos Gerais'}.`
  };
}

function StudentDashboard({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || { name: 'Estudante', level: 1, xp: 0 });
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(DEFAULT_RANKING);

  // Estados de Navegação e Quiz
  const [viewMode, setViewMode] = useState('hub'); // 'hub' | 'quiz' | 'simulado_result'
  const [quizMode, setQuizMode] = useState('track'); // 'track' | 'simulado'
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeQuizList, setActiveQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [timerPaused, setTimerPaused] = useState(true);
  const [timeExpired, setTimeExpired] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Estatísticas da sessão atual (para simulados)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    xpGained: 0,
    answers: []
  });

  const [completedChallenges, setCompletedChallenges] = useState(new Set());

  // 1. Carregamento inicial de dados
  useEffect(() => {
    loadUserProfile();
    loadChallenges();
    loadRanking();
  }, []);

  // 2. Temporizador controlado (Pausa quando o aluno responde ou expira)
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
      console.warn('Usando perfil local:', error.message);
    }
  };

  const loadChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const normalized = response.data.map(normalizeChallenge);
        setChallenges(normalized);
      } else {
        setChallenges(DEFAULT_CHALLENGES.map(normalizeChallenge));
      }
    } catch (error) {
      console.warn('Backend offline, carregando desafios da BNCC locais:', error.message);
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
      console.warn('Usando ranking local:', error.message);
      setRanking(DEFAULT_RANKING);
    }
  };

  // Funções de Inicialização de Quizzes / Modos
  const handleStartTrack = (module) => {
    const trackChallenges = challenges.filter(c => c.moduleId === module.id);
    if (trackChallenges.length === 0) {
      alert('Nenhum desafio encontrado para esta trilha no momento.');
      return;
    }

    setCurrentTrack(module);
    setQuizMode('track');
    setActiveQuizList(trackChallenges);
    setCurrentIndex(0);
    setTimeLeft(25);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setViewMode('quiz');
  };

  const handleStartSimulado = (count = 10) => {
    if (challenges.length === 0) {
      alert('Carregando banco de questões, aguarde um instante.');
      return;
    }

    // Sorteia aleatoriamente 'count' questões de todas as disciplinas
    const shuffled = [...challenges].sort(() => 0.5 - Math.random()).slice(0, count);
    
    setCurrentTrack({ name: 'Simulado Geral BNCC', icon: '🎯', subtitle: '10 Questões Multidisciplinares' });
    setQuizMode('simulado');
    setActiveQuizList(shuffled);
    setCurrentIndex(0);
    setTimeLeft(25);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setViewMode('quiz');
  };

  // Submissão da resposta pelo aluno
  const handleChallengeSubmit = async (challengeId, answer) => {
    setTimerPaused(true); // PAUSA IMEDIATAMENTE O TEMPORIZADOR para leitura calma da explicação
    setDisabled(true);

    const currentQ = activeQuizList[currentIndex];
    const isCorrect = currentQ && (answer || '').toUpperCase() === currentQ.correctAnswer;
    const xpReward = currentQ ? currentQ.xpReward : 15;

    // Atualiza estatísticas da sessão
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
      if (isCorrect) {
        setCompletedChallenges(prev => new Set(prev).add(challengeId));
      }
    } catch (error) {
      // Fallback offline com cálculo de XP local
      if (isCorrect) {
        const newXp = (currentUser.xp || 0) + xpReward;
        const newLevel = Math.floor(newXp / LEVEL_XP) + 1;
        const updated = { ...currentUser, xp: newXp, level: newLevel };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        setCompletedChallenges(prev => new Set(prev).add(challengeId));
      }
    } finally {
      setDisabled(false);
    }
  };

  // Avanço manual para a próxima questão
  const handleNextQuestion = () => {
    if (currentIndex < activeQuizList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(25);
      setTimeExpired(false);
      setTimerPaused(false);
      setDisabled(false);
    } else {
      // Chegou ao fim do quiz ou simulado
      if (quizMode === 'simulado') {
        setViewMode('simulado_result');
      } else {
        alert('🎉 Trilha concluída com sucesso! Você avançou em seus estudos.');
        setViewMode('hub');
      }
    }
  };

  // Módulos e progresso
  const xpForNextLevel = ((currentUser?.level || 1) * LEVEL_XP) - (currentUser?.xp || 0);
  const levelProgress = ((currentUser?.xp || 0) % LEVEL_XP) / LEVEL_XP;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-3xl animate-bounce">📚</div>
          <p className="text-lg font-semibold">Carregando conteúdos da BNCC...</p>
        </div>
      </div>
    );
  }

  const currentChallenge = activeQuizList[currentIndex] || null;
  const isLastQuestion = currentIndex >= activeQuizList.length - 1;

  // ==========================================
  // RENDERIZAÇÃO: TELA DO QUIZ / QUESTÃO ATIVA
  // ==========================================
  if (viewMode === 'quiz' && currentChallenge) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Top Bar do Quiz */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/90 p-4 backdrop-blur-xl">
            <button
              onClick={() => setViewMode('hub')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              ⬅️ Voltar ao Menu
            </button>

            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentTrack?.icon || '🎯'}</span>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">{currentTrack?.name}</h2>
                <p className="text-xs text-slate-400">Questão {currentIndex + 1} de {activeQuizList.length}</p>
              </div>
            </div>

            {/* Temporizador com destaque visual */}
            <div className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono font-bold text-base border ${
              timeLeft <= 5 ? 'border-rose-500/60 bg-rose-500/20 text-rose-300 animate-pulse' :
              timeLeft <= 10 ? 'border-amber-500/60 bg-amber-500/20 text-amber-300' :
              'border-violet-500/40 bg-violet-500/10 text-violet-300'
            }`}>
              <span>⏱️</span>
              <span>{timerPaused ? 'Pausado' : `${timeLeft}s`}</span>
            </div>
          </div>

          {/* Barra de Progresso do Quiz */}
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.round(((currentIndex + 1) / activeQuizList.length) * 100)}%` }}
            />
          </div>

          {/* Card da Questão com Explicação e Avanço Manual */}
          <ChallengeCard
            challenge={currentChallenge}
            onSubmit={handleChallengeSubmit}
            onNext={handleNextQuestion}
            isLastQuestion={isLastQuestion}
            disabled={disabled}
            timeExpired={timeExpired}
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO: RESULTADO DO SIMULADO GERAL
  // ==========================================
  if (viewMode === 'simulado_result') {
    const totalQ = sessionStats.correct + sessionStats.wrong || 1;
    const accuracy = Math.round((sessionStats.correct / totalQ) * 100);
    const enemScore = Math.min(1000, Math.round(300 + (accuracy * 6.5) + (sessionStats.xpGained * 0.5)));

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-4xl shadow-glow">
            🏆
          </div>

          <h2 className="text-3xl font-extrabold text-white">Simulado Concluído!</h2>
          <p className="text-slate-400">Confira seu relatório de proficiência e pontuação estimada no modelo ENEM/Vestibular.</p>

          {/* Placar em Destaque */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-2xl bg-slate-800/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400 uppercase font-semibold">Nota Estimada</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">{enemScore}</p>
              <p className="text-xs text-slate-500 mt-1">Escala 0 a 1000</p>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400 uppercase font-semibold">Taxa de Acertos</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{accuracy}%</p>
              <p className="text-xs text-slate-500 mt-1">{sessionStats.correct} de {totalQ} questões</p>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-4 border border-white/5 col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400 uppercase font-semibold">XP Acumulado</p>
              <p className="text-3xl font-extrabold text-violet-400 mt-1">+{sessionStats.xpGained}</p>
              <p className="text-xs text-slate-500 mt-1">Pontos de Experiência</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => handleStartSimulado(10)}
              className="flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 px-6 font-bold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 transition"
            >
              🔄 Fazer Outro Simulado
            </button>
            <button
              onClick={() => setViewMode('hub')}
              className="flex-1 rounded-2xl bg-slate-800 py-3.5 px-6 font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              📚 Explorar Trilhas BNCC
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO: HUB PRINCIPAL DO ESTUDANTE
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Header do Aluno com Estatísticas */}
        <header className="mb-8 grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glow backdrop-blur-xl sm:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Hub de Aprendizado Gamificado</p>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white">Olá, {currentUser.name}</h1>
                <p className="max-w-2xl text-slate-400 text-sm sm:text-base">Escolha uma trilha temática da BNCC ou teste seus limites no Simulado Geral.</p>
              </div>
              <button onClick={onLogout} className="glow-button bg-slate-800/90 hover:bg-slate-800">Sair</button>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/90 p-4 sm:p-5 border border-white/5">
                <p className="text-xs sm:text-sm text-slate-400">Nível do Aluno</p>
                <p className="mt-2 text-2xl sm:text-3xl font-semibold text-white">{currentUser.level}</p>
                <p className="mt-1 text-xs sm:text-sm text-violet-400">{currentUser.xp} XP total</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-4 sm:p-5 border border-white/5">
                <p className="text-xs sm:text-sm text-slate-400">XP para Próximo Nível</p>
                <p className="mt-2 text-2xl sm:text-3xl font-semibold text-white">{Math.max(0, xpForNextLevel)}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${Math.min(100, Math.round(levelProgress * 100))}%` }} />
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-4 sm:p-5 border border-white/5 col-span-2 sm:col-span-1">
                <p className="text-xs sm:text-sm text-slate-400">Emblemas & Conquistas</p>
                <div className="mt-2 flex flex-wrap gap-2 text-2xl">
                  {currentUser.level >= 10 ? '👑' : ''}
                  {currentUser.level >= 5 ? '🔥' : ''}
                  {currentUser.level >= 3 ? '⚡' : ''}
                  <span title="Estudante Ativo">⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking Rápido */}
          <div className="rounded-[1.75rem] bg-slate-900/80 p-6 shadow-lg shadow-black/20 border border-white/5">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300 font-bold">🏆 Ranking da Turma</p>
            <div className="mt-4 space-y-2.5">
              {ranking.slice(0, 4).map((student, idx) => (
                <div key={student.id || idx} className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3.5 py-2.5 text-sm border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400 w-4">{idx + 1}º</span>
                    <span className="font-medium text-slate-200">{student.name}</span>
                  </div>
                  <span className="font-bold text-violet-300 text-xs">{student.xp || 0} XP</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ========================================== */}
        {/* DESTAQUE 1: SIMULADO GERAL ALEATÓRIO (ENEM) */}
        {/* ========================================== */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/60 via-indigo-950/40 to-slate-900/90 p-6 sm:p-8 shadow-2xl">
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
                  ⚡ Modo Desafio Completo
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Simulado Geral Multidisciplinar (ENEM/Vestibulares)</h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Pratique com 10 questões selecionadas aleatoriamente entre todas as matérias (Linguagens, Matemática, Física, Química, Biologia e Humanas). Com resolução comentada e estimativa de nota!
                </p>
              </div>
              <button
                onClick={() => handleStartSimulado(10)}
                className="whitespace-nowrap rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] transition-all"
              >
                🚀 Iniciar Simulado Geral
              </button>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* DESTAQUE 2: TRILHAS TEMÁTICAS DA BNCC      */}
        {/* ========================================== */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Trilhas de Aprendizagem por Área da BNCC</h2>
            <p className="text-slate-400 text-sm">Selecione uma área do conhecimento para responder desafios focados.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => {
              const modChallenges = challenges.filter(c => c.moduleId === module.id);
              const count = modChallenges.length;

              return (
                <div
                  key={module.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition-all duration-300 hover:border-violet-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-violet-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl group-hover:scale-110 transition">
                        {module.icon}
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 border border-white/5">
                        {count} desafios disponíveis
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition">{module.name}</h3>
                      <p className="text-xs font-semibold text-violet-400/90 mt-0.5">{module.subtitle}</p>
                      <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">{module.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleStartTrack(module)}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 hover:from-violet-600 hover:to-indigo-600 py-3 text-sm font-bold text-white transition duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      <span>🎯 Iniciar Trilha</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

export default StudentDashboard;
