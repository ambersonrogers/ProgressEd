import { useState } from 'react';
import { Zap, Map, Trophy, Star, LogOut, Settings, Hash } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function HomePage() {
  const { state, dispatch, logout } = useGame();
  const { user, subjects, pins } = state;
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const xpToNextLevel = user ? (user.level * 500) - user.xp : 500;
  const xpProgress = user ? ((user.xp % 500) / 500) * 100 : 0;

  const handlePin = (e) => {
    e.preventDefault();
    const code = pinInput.trim().toUpperCase();
    if (pins[code]) {
      dispatch({ type: 'START_PIN_CHALLENGE', payload: code });
    } else {
      setPinError('PIN inválido ou expirado');
      setTimeout(() => setPinError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur border-b border-dark-border px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="font-bold text-white">ProgressEd</span>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'teacher' && (
              <button onClick={() => dispatch({ type: 'GO_TO', payload: 'teacher' })}
                className="flex items-center gap-1 text-xs text-warning hover:text-yellow-300 border border-warning/30 rounded-lg px-2 py-1 transition-colors">
                <Settings className="w-3 h-3" /> Painel
              </button>
            )}
            <button onClick={logout} className="text-dark-muted hover:text-danger transition-colors p-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Player card */}
        <div className="card p-5 bg-gradient-to-br from-primary/20 to-dark-card border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-primary/30">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-lg truncate">{user?.name || 'Jogador'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-primary/30 text-primary-light px-2 py-0.5 rounded-full font-semibold">Nível {user?.level || 1}</span>
                <span className="text-xs text-dark-muted">{user?.xp || 0} XP</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <span className="text-xs text-dark-muted">{xpToNextLevel} p/ nível</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-dark-muted mb-1">
              <span>Progresso do nível</span>
              <span>{Math.round(xpProgress)}%</span>
            </div>
            <div className="h-2 bg-dark rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Main actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => dispatch({ type: 'GO_TO', payload: 'subject-select' })}
            className="card p-5 flex flex-col items-center gap-3 hover:border-primary/60 hover:bg-primary/10 transition-all active:scale-95 group">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Map className="w-6 h-6 text-primary-light" />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-sm">Escolher Trilha</p>
              <p className="text-xs text-dark-muted mt-0.5">Escolha a disciplina</p>
            </div>
          </button>

          <button onClick={() => dispatch({ type: 'START_RANDOM' })}
            className="card p-5 flex flex-col items-center gap-3 hover:border-warning/60 hover:bg-warning/10 transition-all active:scale-95 group">
            <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center group-hover:bg-warning/30 transition-colors">
              <Zap className="w-6 h-6 text-warning" />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-sm">Modo Aleatório</p>
              <p className="text-xs text-dark-muted mt-0.5">Mix de tudo!</p>
            </div>
          </button>
        </div>

        {/* PIN challenge */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-secondary" />
            <p className="font-semibold text-white text-sm">Entrar com PIN</p>
          </div>
          <form onSubmit={handlePin} className="flex gap-2">
            <input className="input-field flex-1 text-center tracking-widest uppercase text-sm" maxLength={6}
              placeholder="Digite o PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} />
            <button type="submit" className="btn-primary px-4 py-2 text-sm">Entrar</button>
          </form>
          {pinError && <p className="text-danger text-xs mt-2">{pinError}</p>}
        </div>

        {/* Trilhas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-warning" />
            <h2 className="font-bold text-white">Trilhas Disponíveis</h2>
          </div>
          <div className="space-y-2">
            {subjects.map(s => {
              const count = state.questions.filter(q => q.subject === s.id).length;
              return (
                <button key={s.id} onClick={() => dispatch({ type: 'START_TRAIL', payload: s.id })}
                  className="w-full card p-4 flex items-center gap-4 hover:scale-[1.01] active:scale-95 transition-all group"
                  style={{ borderColor: s.border + '40' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg"
                    style={{ background: s.bg, boxShadow: `0 4px 15px ${s.color}30` }}>
                    {s.emoji}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-white text-sm truncate" style={{ color: s.color }}>{s.name}</p>
                    <p className="text-xs text-dark-muted">{count} questões</p>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-dark-muted group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Teacher button (small) */}
        {user?.role !== 'teacher' && (
          <div className="text-center pb-4">
            <button onClick={() => dispatch({ type: 'GO_TO', payload: 'teacher' })}
              className="text-xs text-dark-muted/50 hover:text-dark-muted transition-colors underline underline-offset-2">
              Área do Professor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
