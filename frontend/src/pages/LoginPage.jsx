import { useState } from 'react';
import { GraduationCap, Eye, EyeOff, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import api from '../services/api';

export default function LoginPage() {
  const { login } = useGame();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mockLogin = (em, pw, nm, rl) => {
    const isTeacher = em.includes('prof') || em.includes('teacher') || rl === 'teacher';
    return { token: 'mock-token', user: { id: Date.now(), name: nm || (isTeacher ? 'Professor' : 'Aluno'), email: em, role: isTeacher ? 'teacher' : 'student', xp: 0, level: 1 } };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      let data;
      try {
        const res = tab === 'login'
          ? await api.post('/auth/login', { email, password })
          : await api.post('/auth/register', { email, password, name, role });
        data = res.data;
      } catch {
        data = mockLogin(email, password, name, role);
      }
      localStorage.setItem('token', data.token);
      login(data.user);
    } catch (err) {
      setError(err.message || 'Erro inesperado');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">ProgressEd</h1>
          <p className="text-dark-muted text-sm mt-1">Aprenda jogando. Evolua de verdade.</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-dark rounded-xl p-1 mb-6">
            {['login','register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t ? 'bg-primary text-white shadow' : 'text-dark-muted hover:text-white'}`}>
                {t === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <input className="input-field" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required />
            )}
            <input className="input-field" type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
            <div className="relative">
              <input className="input-field pr-12" type={showPass ? 'text' : 'password'} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {tab === 'register' && (
              <div className="flex gap-2">
                {[{v:'student',l:'🎓 Aluno'},{v:'teacher',l:'📋 Professor'}].map(r => (
                  <button key={r.v} type="button" onClick={() => setRole(r.v)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${role===r.v ? 'border-primary bg-primary/20 text-primary-light' : 'border-dark-border text-dark-muted hover:text-white hover:border-dark-muted'}`}>
                    {r.l}
                  </button>
                ))}
              </div>
            )}
            {error && <p className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Zap className="w-4 h-4" />}
              {loading ? 'Carregando...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-dark-muted text-xs mt-4">
            Dica: use "prof@" no e-mail para entrar como professor
          </p>
        </div>
      </div>
    </div>
  );
}
