import { useState, useEffect, useMemo } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import api from '../services/api';
import { DEFAULT_CHALLENGES, DEFAULT_RANKING } from '../data/defaultChallenges';
import './StudentDashboard.css';

const MODULES = [
  { id: 1, name: 'Linguagens', subtitle: 'PT • EN • ES', description: 'Trilhas de leitura, escrita e comunicação multicultural.', color: 'from-violet-500 to-indigo-500' },
  { id: 2, name: 'Matemática', subtitle: 'Números e raciocínio lógico', description: 'Desafios que reforçam raciocínio abstrato e resolução de problemas.', color: 'from-fuchsia-500 to-purple-700' },
  { id: 3, name: 'Ciências da Natureza', subtitle: 'Física • Química • Biologia', description: 'Questões experimentais e conceitos científicos modernos.', color: 'from-emerald-400 to-teal-500' },
  { id: 4, name: 'Ciências Humanas', subtitle: 'História • Geografia', description: 'Aprofunde-se em cultura, sociedade e raízes do Brasil.', color: 'from-amber-400 to-orange-500' },
  { id: 5, name: 'Atualidades', subtitle: 'Mundo em movimento', description: 'Temas atuais e debates relevantes para a sua formação.', color: 'from-cyan-400 to-sky-500' },
];

const LEVEL_XP = 200;

function StudentDashboard({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || { name: 'Estudante', level: 1, xp: 0 });
  const [challenges, setChallenges] = useState(DEFAULT_CHALLENGES);
  const [loading, setLoading] = useState(true);
  const [currentModuleId, setCurrentModuleId] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [ranking, setRanking] = useState(DEFAULT_RANKING);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState(25);
  const [feedback, setFeedback] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // 1. Funções de filtro e desafios correntes definidas primeiro
  const filteredChallengesByModule = (moduleId) => {
    return challenges.filter((challenge) => challenge.moduleId === moduleId);
  };

  const filteredChallenges = useMemo(() => {
    return challenges
      .filter((challenge) => challenge.moduleId === currentModuleId)
      .filter((challenge) => {
        if (!searchQuery.trim()) return true;
        const qText = challenge.question || challenge.text || '';
        const sText = challenge.subject || '';
        return qText.toLowerCase().includes(searchQuery.toLowerCase()) ||
               sText.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }, [challenges, currentModuleId, searchQuery]);

  const currentChallenge = filteredChallenges[currentIndex] || null;

  // 2. Módulos completados e desbloqueados
  const completedModuleIds = useMemo(() => {
    return new Set(
      MODULES.filter((module) => {
        const modChallenges = filteredChallengesByModule(module.id);
        return modChallenges.length > 0 && modChallenges.every((c) => completedChallenges.has(c.id));
      }).map((module) => module.id)
    );
  }, [challenges, completedChallenges]);

  const unlockedModules = useMemo(() => {
    const progress = Math.min(Math.floor((currentUser?.xp || 0) / LEVEL_XP), MODULES.length - 1);
    return MODULES.map((module, index) => ({
      ...module,
      unlocked: index <= progress || index === 0,
      completed: completedModuleIds.has(module.id),
    }));
  }, [currentUser, completedModuleIds]);

  const xpForNextLevel = ((currentUser?.level || 1) * LEVEL_XP) - (currentUser?.xp || 0);
  const levelProgress = ((currentUser?.xp || 0) % LEVEL_XP) / LEVEL_XP;
  const nextAllowedModule = Math.min(Math.floor((currentUser?.xp || 0) / LEVEL_XP) + 2, MODULES.length);

  // 3. Efeitos
  useEffect(() => {
    loadUserProfile();
    loadChallenges();
    loadRanking();
  }, []);

  useEffect(() => {
    if (filteredChallenges.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredChallenges.length) {
      setCurrentIndex(0);
    }
  }, [filteredChallenges.length]);

  useEffect(() => {
    if (timeLeft <= 0 && currentChallenge) {
      handleTimeout();
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, currentChallenge]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data) {
        setCurrentUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.warn('Usando perfil local/offline:', error.message);
    }
  };

  const loadChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setChallenges(response.data);
      } else {
        setChallenges(DEFAULT_CHALLENGES);
      }
    } catch (error) {
      console.warn('Backend offline, carregando trilhas locais padrão:', error.message);
      setChallenges(DEFAULT_CHALLENGES);
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
      console.warn('Usando ranking local/offline:', error.message);
      setRanking(DEFAULT_RANKING);
    }
  };

  const handleChallengeSubmit = async (challengeId, answer) => {
    if (!challengeId) return;
    setDisabled(true);

    try {
      const response = await api.post(`/challenges/${challengeId}/submit`, { answer });
      if (response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      setFeedback({
        success: response.data.correct,
        message: response.data.message,
        explanation: response.data.explanation,
      });
      if (currentChallenge && response.data.correct) {
        setCompletedChallenges((prev) => new Set(prev).add(currentChallenge.id));
      }
    } catch (error) {
      // Fallback offline resiliente: calcula acerto e XP localmente sem quebrar
      const isCorrect = currentChallenge && answer === currentChallenge.correctAnswer;
      const xpGained = isCorrect ? (currentChallenge.xpReward || currentChallenge.xp_reward || 50) : 0;
      const newXp = (currentUser.xp || 0) + xpGained;
      const newLevel = Math.floor(newXp / LEVEL_XP) + 1;
      const updatedUser = { ...currentUser, xp: newXp, level: newLevel };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setFeedback({
        success: isCorrect,
        message: isCorrect ? `Parabéns! Você acertou e ganhou +${xpGained} XP!` : (answer ? 'Resposta incorreta.' : 'Tempo esgotado!'),
        explanation: currentChallenge?.explanation || 'Continue praticando para dominar os conteúdos da BNCC.'
      });

      if (isCorrect && currentChallenge) {
        setCompletedChallenges((prev) => new Set(prev).add(currentChallenge.id));
      }
    } finally {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % (filteredChallenges.length || 1));
        setTimeLeft(25);
        setDisabled(false);
        setFeedback(null);
      }, 1400);
    }
  };

  const handleTimeout = async () => {
    if (!currentChallenge || disabled) return;
    await handleChallengeSubmit(currentChallenge.id, null);
  };

  const handleModuleSelect = (module) => {
    if (!module.unlocked) return;
    setCurrentModuleId(module.id);
    setCurrentIndex(0);
    setTimeLeft(25);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-3xl">⌛</div>
          <p className="text-lg font-semibold">Carregando desafios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glow backdrop-blur-xl sm:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Progresso do Estudante</p>
                <h1 className="text-4xl font-semibold text-white">Olá, {currentUser.name}</h1>
                <p className="max-w-2xl text-slate-400">Complete trilhas, colete medalhas e avance no ranking da turma.</p>
              </div>
              <button onClick={onLogout} className="glow-button bg-slate-800/90 hover:bg-slate-800">Sair</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/90 p-5">
                <p className="text-sm text-slate-400">Nível atual</p>
                <p className="mt-2 text-3xl font-semibold text-white">{currentUser.level}</p>
                <p className="mt-1 text-sm text-slate-400">{currentUser.xp} XP</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-5">
                <p className="text-sm text-slate-400">XP para o próximo nível</p>
                <p className="mt-2 text-3xl font-semibold text-white">{Math.max(0, xpForNextLevel)}</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${Math.min(100, Math.round(levelProgress * 100))}%` }} />
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-5">
                <p className="text-sm text-slate-400">Medalhas conquistadas</p>
                <div className="mt-4 flex flex-wrap gap-3 text-2xl">
                  {currentUser.level >= 10 ? '👑' : ''}
                  {currentUser.level >= 8 ? '🥇' : ''}
                  {currentUser.level >= 5 ? '🔥' : ''}
                  {currentUser.level < 5 ? '⭐' : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-900/80 p-6 shadow-lg shadow-black/20">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Ranking da turma</p>
            <div className="mt-5 space-y-3">
              {ranking.slice(0, 5).map((student, index) => (
                <div key={student.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm text-slate-300">{index + 1}º • {student.name}</p>
                    <p className="text-xs text-slate-500">Nível {student.level}</p>
                  </div>
                  <div className="rounded-full bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-200">{student.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="mb-8 space-y-5">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glow backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Trilhas de estudo</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Desbloqueie uma trilha por vez</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">Para avançar à próxima trilha, complete as questões do módulo atual ou acumule XP suficiente.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MODULES.map((module) => {
              const isUnlocked = module.id <= nextAllowedModule || module.id === 1;
              const isSelected = module.id === currentModuleId;
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect({ ...module, unlocked: isUnlocked })}
                  className={`group overflow-hidden rounded-[1.5rem] border p-5 text-left transition duration-300 ${isSelected ? 'border-violet-400 bg-violet-950/30 shadow-glow' : 'border-white/10 bg-slate-900/80 hover:border-violet-400/50'} ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                >
                  <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${module.color}`} />
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{module.subtitle}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{module.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
                  <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                    {isUnlocked ? (
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">Desbloqueado</span>
                    ) : (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-slate-400">Bloqueado</span>
                    )}
                    {module.id === 4 && <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-200">Raízes do Brasil</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-glow backdrop-blur-xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Quiz interativo</p>
                <h2 className="text-3xl font-semibold text-white">Mantenha a evolução</h2>
              </div>
              <div className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">25s por questão</div>
            </div>
            <div className="mb-5 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Temporizador</span>
                  <span>{timeLeft}s restantes</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all" style={{ width: `${(timeLeft / 25) * 100}%` }} />
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-center text-sm text-slate-300">
                {currentUser.level}º Nível • {currentUser.xp} XP
              </div>
            </div>

            {currentChallenge ? (
              <ChallengeCard
                challenge={currentChallenge}
                onSubmit={handleChallengeSubmit}
                disabled={disabled}
              />
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-900/70 p-8 text-center text-slate-300">
                <p className="text-lg font-semibold text-white">Nenhum desafio disponível nesta trilha.</p>
                <p className="mt-3 text-sm">Aguarde a próxima rodada ou selecione outra trilha desbloqueada.</p>
              </div>
            )}

            {feedback && (
              <div className={`mt-5 rounded-[1.5rem] border ${feedback.success ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-rose-400/20 bg-rose-500/10'} p-5 text-slate-100`}>
                <p className="font-semibold">{feedback.success ? '🎉 Feedback positivo' : '💡 Dica pedagógica'}</p>
                <p className="mt-2 text-sm text-slate-200">{feedback.message}</p>
                {feedback.explanation && <p className="mt-3 text-sm text-slate-300">{feedback.explanation}</p>}
              </div>
            )}
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-glow backdrop-blur-xl">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Resumo da trilha</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Desafios completos</span>
                  <span>{completedChallenges.size}/{filteredChallenges.length || 1}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Trilha selecionada</span>
                  <span>{MODULES.find((item) => item.id === currentModuleId)?.name}</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${Math.round((completedChallenges.size / (filteredChallenges.length || 1)) * 100)}%` }} />
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Ranking da sala</p>
              <div className="mt-4 space-y-3">
                {ranking.slice(0, 5).map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm text-slate-100">{student.name}</p>
                      <p className="text-xs text-slate-500">Nível {student.level}</p>
                    </div>
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-100">{student.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
