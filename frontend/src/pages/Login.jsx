import { useState, useEffect } from 'react';
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
                    email, password, name, role: 'student' 
                });
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
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            document.documentElement.dataset.theme = savedTheme;
        }
    }, []);

    return (
        <div className="login-container">
            <div className="login-background"></div>
            
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">P</div>
                    </div>
                    <h1>ProgressEd</h1>
                    <p className="tagline">Aprenda. Pratique. Progrida.</p>
                    <div className="header-divider">
                        <span className="divider-icon">📚</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Nome</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Usuário</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="email"
                                placeholder="Digite seu usuário"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Senha</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {isLogin && (
                        <div className="forgot-password">
                            <a href="#forgot">Esqueceu sua senha?</a>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn-login" 
                        disabled={loading}
                    >
                        <span className="btn-arrow">→</span>
                        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <div className="login-divider">
                    <span>ou continue com</span>
                </div>

                <div className="social-login">
                    <button className="social-btn google">
                        <span>G</span>
                    </button>
                    <button className="social-btn github">
                        <span>⚙️</span>
                    </button>
                    <button className="social-btn microsoft">
                        <span>⬜</span>
                    </button>
                </div>

                <div className="login-footer">
                    <p>
                        {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                        <button 
                            type="button" 
                            className="toggle-mode"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                        >
                            {isLogin ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
