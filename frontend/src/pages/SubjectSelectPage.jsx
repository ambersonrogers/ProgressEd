import { ArrowLeft, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function SubjectSelectPage() {
  const { state, dispatch } = useGame();
  const { subjects, questions } = state;

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur border-b border-dark-border px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button onClick={() => dispatch({ type: 'GO_TO', payload: 'home' })} className="p-2 rounded-xl hover:bg-dark-card transition-colors text-dark-muted hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-white text-lg">Escolha a Trilha</h1>
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-3">
        {subjects.map((s, i) => {
          const count = questions.filter(q => q.subject === s.id).length;
          return (
            <button key={s.id} onClick={() => dispatch({ type: 'START_TRAIL', payload: s.id })}
              className="w-full rounded-2xl p-5 flex items-center gap-4 border transition-all hover:scale-[1.02] active:scale-95 animate-slide-up"
              style={{ background: s.bg, borderColor: s.border + '60', animationDelay: `${i * 60}ms` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
                style={{ background: s.color + '30', boxShadow: `0 6px 20px ${s.color}40` }}>
                {s.emoji}
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-lg" style={{ color: s.color }}>{s.name}</p>
                <p className="text-sm text-slate-400 mt-0.5">{count} questões disponíveis</p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.color + '20' }}>
                <svg className="w-5 h-5" fill="none" stroke={s.color} strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </div>
            </button>
          );
        })}

        <button onClick={() => dispatch({ type: 'START_RANDOM' })}
          className="w-full card p-5 flex items-center gap-4 hover:border-warning/50 hover:bg-warning/5 transition-all active:scale-95 border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center text-3xl">⚡</div>
          <div className="flex-1 text-left">
            <p className="font-bold text-warning text-lg">Modo Aleatório</p>
            <p className="text-sm text-dark-muted">Mix de todas as disciplinas</p>
          </div>
          <Zap className="w-5 h-5 text-warning" />
        </button>
      </div>
    </div>
  );
}
