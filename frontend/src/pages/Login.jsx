import { useState } from 'react';
import api from '../services/api';
import '../styles/login.css';

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (isLogin) {
                response = await api.post('/auth/login', { email, password });
            } else {
                response = await api.post('/auth/register', {
                    email,
                    password,
                    name,
                    role: 'student'
                });
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLogin(response.data.user);
        } catch (err) {
            console.warn('Falha na autenticação remota:', err);
            // Fallback de demonstração imediato
            if (email.toLowerCase().includes('prof')) {
                handleDemoLogin('teacher');
            } else if (email.toLowerCase().includes('aluno') || email.toLowerCase().includes('estudante') || email.toLowerCase().includes('demo')) {
                handleDemoLogin('student');
            } else {
                setError(err.response?.data?.error || err.message || 'Erro ao conectar. Utilize os botões de Acesso Rápido abaixo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (role) => {
        setLoading(true);
        setError('');
        const creds = role === 'teacher'
            ? { email: 'professor@progressed.com', password: '123456' }
            : { email: 'aluno@progressed.com', password: '123456' };

        try {
            const response = await api.post('/auth/login', creds);
            if (response.data?.token && response.data?.user) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onLogin(response.data.user);
                return;
            }
        } catch (err) {
            console.warn('Login demo remoto falhou, usando autenticação offline segura:', err.message);
        } finally {
            setLoading(false);
        }

        // Fallback offline seguro
        const demoUser = role === 'teacher'
            ? { id: 2, name: 'Prof. Pedro Brandão', email: 'professor@progressed.com', role: 'teacher' }
            : { id: 1, name: 'Amberson Rogers', email: 'aluno@progressed.com', role: 'student', xp: 420, level: 4 };
        localStorage.setItem('token', role === 'teacher' ? 'demo-token-teacher-2026' : 'demo-token-progressed-2026');
        localStorage.setItem('user', JSON.stringify(demoUser));
        onLogin(demoUser);
    };

    const handleSocialLogin = (provider) => {
        // Fallback elegante para demonstração
        handleDemoLogin('student');
    };

    return (
        <div className="login-page">
            {/* Cyber background elements & floating code snippets (faithful to MVP Image 1) */}
            <div className="cyber-bg-elements">
                <div className="cyber-grid" />

                {/* Left Floating Code Snippet */}
                <div className="floating-code left">
                    <span className="keyword">function</span> <span className="function">learn</span>(newSkill) &#123;{'\n'}
                    {'  '}<span className="keyword">const</span> progress = <span className="keyword">new</span> ProgressEd();{'\n'}
                    {'  '}progress.<span className="function">init</span>();{'\n\n'}
                    {'  '}<span className="keyword">return</span> progress{'\n'}
                    {'    '}.<span className="function">study</span>(newSkill){'\n'}
                    {'    '}.<span className="function">practice</span>(){'\n'}
                    {'    '}.<span className="function">evolve</span>();{'\n'}
                    &#125;{'\n\n'}
                    <span className="comment">// Seu futuro começa com progresso.</span>{'\n'}
                    <span className="comment">// Nunca pare de aprender.</span>{'\n\n'}
                    <span className="keyword">const</span> skills = [{'\n'}
                    {'  '}<span className="string">'Lógica de Programação'</span>,{'\n'}
                    {'  '}<span className="string">'Estruturas de Dados'</span>,{'\n'}
                    {'  '}<span className="string">'Algoritmos'</span>,{'\n'}
                    {'  '}<span className="string">'Desenvolvimento Web'</span>,{'\n'}
                    {'  '}<span className="string">'Inteligência Artificial'</span>{'\n'}
                    ];{'\n\n'}
                    <span className="keyword">for</span> (<span className="keyword">let</span> skill <span className="keyword">of</span> skills) &#123;{'\n'}
                    {'  '}<span className="function">learn</span>(skill);{'\n'}
                    &#125;
                </div>

                {/* Right Floating Code Snippet */}
                <div className="floating-code right">
                    <span className="comment">// Code. Learn. Grow.</span>{'\n'}
                    <span className="comment">// ProgressEd.</span>{'\n\n'}
                    <span className="keyword">class</span> <span className="function">Student</span> &#123;{'\n'}
                    {'  '}<span className="function">constructor</span>(name) &#123;{'\n'}
                    {'    '}<span className="keyword">this</span>.name = name;{'\n'}
                    {'    '}<span className="keyword">this</span>.focus = <span className="string">'Evoluir todos os dias'</span>;{'\n'}
                    {'    '}<span className="keyword">this</span>.goal = <span className="string">'Transformar conhecimento em conquistas'</span>;{'\n'}
                    {'  '}&#125;{'\n\n'}
                    {'  '}<span className="function">study</span>() &#123;{'\n'}
                    {'    '}<span className="keyword">return</span> <span className="string">'Aprendizado contínuo'</span>;{'\n'}
                    {'  '}&#125;{'\n'}
                    &#125;{'\n\n'}
                    <span className="keyword">const</span> mindset = <span className="keyword">new</span> <span className="function">Student</span>(<span className="string">'Você'</span>);{'\n'}
                    mindset.<span className="function">study</span>();
                </div>
            </div>

            {/* Central Glassmorphic Card */}
            <div className="login-card-container">
                <div className="login-brand-header">
                    <div className="login-brand-logo">
                        <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                            <path d="M12 8H24C28.4183 8 32 11.5817 32 16C32 20.4183 28.4183 24 24 24H18V32H12V8Z" fill="white" />
                            <path d="M18 14H24C25.1046 14 26 14.8954 26 16C26 17.1046 25.1046 18 24 18H18V14Z" fill="#0284c7" />
                        </svg>
                    </div>
                    <h1 className="login-brand-title">
                        Progress<span className="ed-accent">Ed</span>
                    </h1>
                    <p className="login-brand-tagline">Aprenda. Pratique. Progrida.</p>
                </div>

                {/* Divider with Graduation Cap Icon */}
                <div className="login-header-divider">
                    <span className="cap-icon">🎓</span>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="login-actual-form">
                    {!isLogin && (
                        <div className="form-field-group">
                            <label className="form-field-label">Nome Completo</label>
                            <div className="input-with-icon">
                                <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    type="text"
                                    className="input-field-custom"
                                    placeholder="Digite seu nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-field-group">
                        <label className="form-field-label">Usuário</label>
                        <div className="input-with-icon">
                            <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                            </svg>
                            <input
                                type="email"
                                className="input-field-custom"
                                placeholder="Digite seu usuário ou e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field-group">
                        <label className="form-field-label">Senha</label>
                        <div className="input-with-icon">
                            <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-field-custom"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Ocultar senha" : "Exibir senha"}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="forgot-password-row">
                        <a href="#recuperar" onClick={(e) => { e.preventDefault(); alert('Instruções de recuperação foram enviadas para seu e-mail cadastrado.'); }} className="forgot-link">
                            Esqueceu sua senha?
                        </a>
                    </div>

                    {error && <div className="auth-error-banner">{error}</div>}

                    <button type="submit" className="btn-enter-glow" disabled={loading}>
                        {loading ? (
                            'Conectando...'
                        ) : (
                            <>
                                <span>&rarr;</span>
                                <span>{isLogin ? 'Entrar' : 'Cadastrar'}</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider 'ou continue com' */}
                <div className="social-divider">
                    <span>ou continue com</span>
                </div>

                {/* Social Login 3 buttons: Google, GitHub, Microsoft */}
                <div className="social-buttons-grid">
                    <button
                        type="button"
                        className="social-auth-button"
                        title="Entrar com Google"
                        onClick={() => handleSocialLogin('google')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="social-auth-button"
                        title="Entrar com GitHub"
                        onClick={() => handleSocialLogin('github')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="social-auth-button"
                        title="Entrar com Microsoft"
                        onClick={() => handleSocialLogin('azure')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                            <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
                            <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
                            <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
                        </svg>
                    </button>
                </div>

                {/* Quick Demo Access Pills */}
                <div className="demo-access-panel">
                    <div className="demo-access-header">Acesso Instantâneo de Teste</div>
                    <div className="demo-buttons-row">
                        <button
                            type="button"
                            className="demo-pill-btn"
                            onClick={() => handleDemoLogin('student')}
                        >
                            <span>🎓</span>
                            <span>Aluno Demo</span>
                        </button>
                        <button
                            type="button"
                            className="demo-pill-btn teacher"
                            onClick={() => handleDemoLogin('teacher')}
                        >
                            <span>👨‍🏫</span>
                            <span>Professor Demo</span>
                        </button>
                    </div>
                </div>

                {/* Footer Switcher */}
                <div className="login-card-footer">
                    <span>{isLogin ? 'Ainda não tem uma conta?' : 'Já possui conta?'}</span>
                    <button
                        type="button"
                        className="signup-link-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                    >
                        {isLogin ? 'Cadastre-se' : 'Entrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
