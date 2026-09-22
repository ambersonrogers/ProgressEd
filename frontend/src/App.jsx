import { useState, Component } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import './index.css';

// Error Boundary para evitar que qualquer erro deixe a tela em branco
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#030712',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚡</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Progress<span style={{ color: '#38bdf8' }}>Ed</span>
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '480px', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Ocorreu uma oscilação na interface ou cache local. Clique no botão abaixo para restaurar o ambiente limpo.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '12px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
            }}
          >
            🔄 Restaurar & Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (!savedUser || !token || savedUser === 'undefined' || savedUser === 'null') {
                return null;
            }
            return JSON.parse(savedUser);
        } catch (e) {
            console.warn('Erro ao restaurar sessão de usuário:', e);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    });

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (!user) {
        return (
            <ErrorBoundary>
                <Login onLogin={handleLogin} />
            </ErrorBoundary>
        );
    }

    if (user.role === 'teacher') {
        return (
            <ErrorBoundary>
                <TeacherDashboard user={user} onLogout={handleLogout} />
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <StudentDashboard user={user} onLogout={handleLogout} />
        </ErrorBoundary>
    );
}

export default App;