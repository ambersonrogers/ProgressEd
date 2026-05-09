import { useState } from 'react';
import { ArrowLeft, Plus, Hash, Trash2, BookOpen, Users, Settings } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SUBJECTS } from '../data/questions';

function generatePin() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function TeacherPage() {
  const { state, dispatch } = useGame();
  const { pins, questions, user } = state;
  const [tab, setTab] = useState('dashboard');

  // New question form
  const [qForm, setQForm] = useState({ subject: 'linguagens', text: '', options: ['','','','',''], correct: 'A' });
  const [qSuccess, setQSuccess] = useState(false);

  // New pin form
  const [pinForm, setPinForm] = useState({ subjects: [], count: 10 });
  const [newPin, setNewPin] = useState(null);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!qForm.text || qForm.options.some(o => !o)) return;
    dispatch({
      type: 'ADD_QUESTIONS',
      payload: [{ subject: qForm.subject, text: qForm.text, options: qForm.options.map((t, i) => ({ letter: 'ABCDE'[i], text: t })), correctAnswer: qForm.correct, points: 100 }]
    });
    setQForm({ subject: 'linguagens', text: '', options: ['','','','',''], correct: 'A' });
    setQSuccess(true);
    setTimeout(() => setQSuccess(false), 3000);
  };

  const handleCreatePin = (e) => {
    e.preventDefault();
    const code = generatePin();
    const pin = { id: Date.now(), subjects: pinForm.subjects, count: pinForm.count, createdBy: user?.name, createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_PIN', payload: { code, pin } });
    setNewPin(code);
    setPinForm({ subjects: [], count: 10 });
  };

  const toggleSubject = (id) => {
    setPinForm(p => ({ ...p, subjects: p.subjects.includes(id) ? p.subjects.filter(s => s !== id) : [...p.subjects, id] }));
  };

  const pinList = Object.entries(pins);
  const totalBySubject = SUBJECTS.map(s => ({ ...s, count: questions.filter(q => q.subject === s.id).length }));

  return (
    <div className="min-h-screen bg-dark">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur border-b border-dark-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => dispatch({ type: 'GO_TO', payload: 'home' })} className="p-2 rounded-xl hover:bg-dark-card text-dark-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-white">Painel do Professor</h1>
            <p className="text-xs text-dark-muted">{user?.name}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-2xl mx-auto mt-3 flex gap-1 bg-dark-card rounded-xl p-1">
          {[['dashboard','📊 Dashboard'],['questions','➕ Questões'],['pins','🔑 PINs']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab===k ? 'bg-primary text-white shadow' : 'text-dark-muted hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center">
                <BookOpen className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-black text-white">{questions.length}</p>
                <p className="text-xs text-dark-muted">Total de questões</p>
              </div>
              <div className="card p-4 text-center">
                <Hash className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-black text-white">{pinList.length}</p>
                <p className="text-xs text-dark-muted">PINs ativos</p>
              </div>
            </div>
            <h3 className="font-bold text-white text-sm mt-2">Questões por Trilha</h3>
            {totalBySubject.map(s => (
              <div key={s.id} className="card p-3 flex items-center gap-3">
                <span className="text-xl">{s.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: s.color }}>{s.name}</span>
                    <span className="text-xs text-dark-muted">{s.count} questões</span>
                  </div>
                  <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min((s.count / 60) * 100, 100)}%`, background: s.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD QUESTION */}
        {tab === 'questions' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-bold text-white">Nova Questão</h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="text-xs text-dark-muted mb-1 block">Trilha</label>
                <select className="input-field" value={qForm.subject} onChange={e => setQForm({...qForm, subject: e.target.value})}>
                  {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-dark-muted mb-1 block">Enunciado</label>
                <textarea className="input-field h-24 resize-none" placeholder="Digite a pergunta..." value={qForm.text} onChange={e => setQForm({...qForm, text: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-dark-muted mb-2 block">Alternativas</label>
                {['A','B','C','D','E'].map((l, i) => (
                  <div key={l} className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: qForm.correct === l ? '#7C3AED' : '#2D2D4E', color: qForm.correct === l ? 'white' : '#6B7280' }}>
                      {l}
                    </span>
                    <input className="input-field flex-1 py-2 text-sm" placeholder={`Alternativa ${l}`} value={qForm.options[i]} onChange={e => { const opts = [...qForm.options]; opts[i]=e.target.value; setQForm({...qForm, options: opts}); }} required />
                    <button type="button" onClick={() => setQForm({...qForm, correct: l})}
                      className={`text-xs px-2 py-1 rounded-lg transition-all flex-shrink-0 ${qForm.correct===l ? 'bg-success/20 text-success' : 'text-dark-muted hover:text-white'}`}>
                      ✓
                    </button>
                  </div>
                ))}
                <p className="text-xs text-dark-muted">Resposta correta: <span className="text-success font-bold">{qForm.correct}</span></p>
              </div>
              {qSuccess && <div className="bg-success/20 border border-success/40 rounded-xl px-4 py-2 text-success text-sm font-semibold">✅ Questão adicionada com sucesso!</div>}
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Questão
              </button>
            </form>
          </div>
        )}

        {/* PINS */}
        {tab === 'pins' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-bold text-white mb-3">Criar Sala com PIN</h2>
              <form onSubmit={handleCreatePin} className="card p-4 space-y-4">
                <div>
                  <label className="text-xs text-dark-muted mb-2 block">Disciplinas (deixe vazio para todas)</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(s => (
                      <button key={s.id} type="button" onClick={() => toggleSubject(s.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${pinForm.subjects.includes(s.id) ? 'text-white' : 'text-dark-muted border-dark-border hover:text-white'}`}
                        style={pinForm.subjects.includes(s.id) ? { background: SUBJECTS.find(x=>x.id===s.id).color+'30', borderColor: SUBJECTS.find(x=>x.id===s.id).color, color: SUBJECTS.find(x=>x.id===s.id).color } : {}}>
                        {s.emoji} {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-dark-muted mb-1 block">Número de questões: <span className="text-white font-bold">{pinForm.count}</span></label>
                  <input type="range" min={5} max={50} step={5} value={pinForm.count} onChange={e => setPinForm({...pinForm, count: +e.target.value})}
                    className="w-full accent-primary" />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Hash className="w-4 h-4" /> Gerar PIN
                </button>
              </form>

              {newPin && (
                <div className="card p-5 text-center border-success/40 bg-success/5 mt-3 animate-bounce-in">
                  <p className="text-dark-muted text-sm mb-1">PIN criado!</p>
                  <p className="text-4xl font-black tracking-[0.3em] text-success">{newPin}</p>
                  <p className="text-xs text-dark-muted mt-2">Compartilhe com seus alunos</p>
                </div>
              )}
            </div>

            {pinList.length > 0 && (
              <div>
                <h3 className="font-bold text-white mb-2 text-sm">PINs Gerados</h3>
                <div className="space-y-2">
                  {pinList.map(([code, pin]) => (
                    <div key={code} className="card p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <Hash className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white tracking-widest">{code}</p>
                        <p className="text-xs text-dark-muted">{pin.count} questões · {pin.subjects.length === 0 ? 'Todas as disciplinas' : pin.subjects.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
