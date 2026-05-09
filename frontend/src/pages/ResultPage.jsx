import { Trophy, Zap, RotateCcw, Home, Star } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SUBJECTS } from '../data/questions';

export default function ResultPage() {
  const { state, dispatch } = useGame();
  const { currentQuestions, answers, score, sessionXp, gameMode, selectedSubject, user } = state;

  const correct = answers.filter(a => a.correct).length;
  const total = currentQuestions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getMedal = () => {
    if (pct === 100) return { emoji: '🏆', label: 'Perfeito!', color: '#F59E0B' };
    if (pct >= 80) return { emoji: '🥇', label: 'Excelente!', color: '#10B981' };
    if (pct >= 60) return { emoji: '🥈', label: 'Bom!', color: '#0EA5E9' };
    if (pct >= 40) return { emoji: '🥉', label: 'Pode melhorar!', color: '#7C3AED' };
    return { emoji: '💪', label: 'Continue tentando!', color: '#EC4899' };
  };

  const medal = getMedal();
  const subject = selectedSubject ? SUBJECTS.find(s => s.id === selectedSubject) : null;

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-5 animate-bounce-in">
        {/* Medal */}
        <div className="text-center">
          <div className="text-7xl mb-3">{medal.emoji}</div>
          <h1 className="text-3xl font-extrabold text-white">{medal.label}</h1>
          {subject && <p className="text-sm mt-1" style={{ color: subject.color }}>{subject.emoji} {subject.name}</p>}
        </div>

        {/* Score card */}
        <div className="card p-6 space-y-4">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-3xl font-black text-white">{correct}/{total}</p>
              <p className="text-xs text-dark-muted mt-1">Corretas</p>
            </div>
            <div className="w-px bg-dark-border" />
            <div>
              <p className="text-3xl font-black" style={{ color: medal.color }}>{pct}%</p>
              <p className="text-xs text-dark-muted mt-1">Aproveitamento</p>
            </div>
            <div className="w-px bg-dark-border" />
            <div>
              <p className="text-3xl font-black text-warning">{sessionXp}</p>
              <p className="text-xs text-dark-muted mt-1">XP ganhos</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-3 bg-dark rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, #7C3AED, ${medal.color})` }} />
            </div>
          </div>
        </div>

        {/* Player info */}
        {user && (
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-white">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{user.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-dark-muted">Nível {user.level}</span>
                <span className="text-xs text-warning flex items-center gap-0.5"><Zap className="w-3 h-3" />{user.xp} XP total</span>
              </div>
            </div>
            <Star className="w-5 h-5 text-warning fill-warning" />
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => {
            if (gameMode === 'random') dispatch({ type: 'START_RANDOM' });
            else if (selectedSubject) dispatch({ type: 'START_TRAIL', payload: selectedSubject });
            else dispatch({ type: 'RESET_GAME' });
          }} className="btn-secondary flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Jogar de novo
          </button>
          <button onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Início
          </button>
        </div>
      </div>
    </div>
  );
}
