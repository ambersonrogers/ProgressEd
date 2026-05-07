import { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react';
import api from '../services/api';
import './Login.css';

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [registerRole, setRegisterRole] = useState('student');

    const handleReset = () => {
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setName('');
        setError('');
        setRegisterRole('student');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (isLogin) {
                try {
                    response = await api.post('/auth/login', { email, password });
                } catch (e) {
                    // Mock login if backend fails
                    console.warn("Backend indisponível, usando mock de login");
                    const isTeacher = email.includes('prof');
                    response = {
                        data: {
                            token: 'mock-token',
                            user: {
                                id: 1,
                                name: isTeacher ? 'Professor Teste' : 'Aluno Teste',
                                email: email,
                                role: isTeacher ? 'teacher' : 'student',
                                xp: 2450,
                                level: 5
                            }
                        }
                    };
                }
            } else {
                try {
                    response = await api.post('/auth/register', { 
                        email, password, name, role: registerRole 
                    });
                } catch (e) {
                    console.warn("Backend indisponível, usando mock de registro");
                    response = {
                        data: {
                            token: 'mock-token',
                            user: {
                                id: 2,
                                name: name || 'Usuário Teste',
                                email: email,
                                role: registerRole,
                                xp: 0,
                                level: 1
                            }
                        }
                    };
                }
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro na conexão');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.dataset.theme = 'cyber';
        localStorage.setItem('selectedTheme', 'cyber');
    }, []);

    return (
        <div className="login-container">
            <div className="login-bg-code"></div>
            <div className="login-shape-1"></div>
            <div className="login-shape-2"></div>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <GraduationCap size={32} />
                        <h1>ProgressEd</h1>
                    </div>
                    <p>Pratique. Aprenda. Progrida.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0 1.5rem 0' }}>
                    <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, rgba(96, 165, 250, 0.5))' }}></div>
                    <div 
                        style={{ padding: '0 1rem', cursor: 'pointer', display: 'flex' }}
                        onClick={handleReset}
                        title="Limpar formulário e voltar ao Início"
                    >
                        <GraduationCap size={24} color="#60a5fa" />
                    </div>
                    <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to left, transparent, rgba(96, 165, 250, 0.5))' }}></div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Perfil</label>
                                <div className="role-selector">
                                    <button 
                                        type="button" 
                                        className={`btn-role ${registerRole === 'student' ? 'active' : ''}`}
                                        onClick={() => setRegisterRole('student')}
                                    >
                                        Sou Aluno
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`btn-role ${registerRole === 'teacher' ? 'active' : ''}`}
                                        onClick={() => setRegisterRole('teacher')}
                                    >
                                        Sou Professor
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Nome</label>
                                <div className="input-icon-wrapper">
                                    <User className="input-icon" />
                                    <input
                                        className="login-input"
                                        type="text"
                                        placeholder="Digite seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    
                    <div className="form-group">
                        <label>Usuário</label>
                        <div className="input-icon-wrapper">
                            <User className="input-icon" />
                            <input
                                className="login-input"
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Senha</label>
                        <div className="input-icon-wrapper">
                            <Lock className="input-icon" />
                            <input
                                className="login-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {isLogin && (
                            <a href="#" className="forgot-password">Esqueceu sua senha?</a>
                        )}
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                        <ArrowRight size={18} />
                    </button>
                </form>

                {isLogin && (
                    <>
                        <div className="login-divider">ou continue com</div>
                        <div className="social-login">
                            <a href="#" className="btn-social" title="Login com Google" onClick={(e) => e.preventDefault()}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                                    <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.64 12 18.64C9.14 18.64 6.71 16.7 5.84 14.12H2.16V16.97C3.97 20.57 7.69 23 12 23Z" fill="#34A853"/>
                                    <path d="M5.84 14.12C5.62 13.46 5.49 12.75 5.49 12C5.49 11.25 5.62 10.54 5.84 9.88V7.03H2.16C1.41 8.52 1 10.21 1 12C1 13.79 1.41 15.48 2.16 16.97L5.84 14.12Z" fill="#FBBC05"/>
                                    <path d="M12 5.36C13.62 5.36 15.06 5.92 16.2 7.01L19.36 3.85C17.46 2.08 14.97 1 12 1C7.69 1 3.97 3.43 2.16 7.03L5.84 9.88C6.71 7.3 9.14 5.36 12 5.36Z" fill="#EA4335"/>
                                </svg>
                            </a>
                            <a href="#" className="btn-social" title="Login com Github" onClick={(e) => e.preventDefault()}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.865 20.17 8.838 21.49C9.338 21.58 9.52 21.27 9.52 21.01C9.52 20.78 9.511 20.15 9.506 19.32C6.726 19.92 6.139 17.98 6.139 17.98C5.684 16.83 5.029 16.52 5.029 16.52C4.122 15.9 5.097 15.91 5.097 15.91C6.1 15.98 6.626 16.94 6.626 16.94C7.517 18.47 8.966 18.03 9.539 17.77C9.629 17.12 9.889 16.68 10.178 16.42C7.96 16.17 5.625 15.31 5.625 11.47C5.625 10.38 6.015 9.49 6.65 8.79C6.547 8.54 6.204 7.53 6.748 6.15C6.748 6.15 7.583 5.88 9.499 7.18C10.292 6.96 11.148 6.85 12 6.85C12.852 6.85 13.708 6.96 14.503 7.18C16.418 5.88 17.252 6.15 17.252 6.15C17.798 7.53 17.455 8.54 17.352 8.79C17.989 9.49 18.377 10.38 18.377 11.47C18.377 15.32 16.039 16.17 13.816 16.41C14.18 16.73 14.505 17.35 14.505 18.31C14.505 19.68 14.492 20.78 14.492 21.01C14.492 21.27 14.671 21.59 15.176 21.49C19.146 20.17 22 16.42 22 12C22 6.477 17.523 2 12 2Z"/>
                                </svg>
                            </a>
                            <a href="#" className="btn-social" title="Login com Microsoft" onClick={(e) => e.preventDefault()}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.4 24H0V12.6H11.4V24ZM24 24H12.6V12.6H24V24ZM11.4 11.4H0V0H11.4V11.4ZM24 11.4H12.6V0H24V11.4Z" fill="#00A4EF"/>
                                </svg>
                            </a>
                        </div>
                    </>
                )}

                <div className="register-prompt">
                    {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
                    <button type="button" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;