import { useState, useEffect } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            console.error('❌ Erro ao fazer login:', err);
            console.error('Response:', err.response);
            setError(err.response?.data?.error || err.message || 'Erro na conexão');
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
        <div className="login-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>📚 ProgressEd</h1>
                    <p>Aprenda jogando • Ganhe XP • Suba de nível</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            className="input"
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    
                    <input
                        className="input"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <input
                        className="input"
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <p className="switch-mode">
                    {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
                    <button type="button" className="link-button" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;