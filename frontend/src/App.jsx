import { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import './index.css';

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        return savedUser && token ? JSON.parse(savedUser) : null;
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
        return <Login onLogin={handleLogin} />;
    }

    if (user.role === 'teacher') {
        return <TeacherDashboard user={user} onLogout={handleLogout} />;
    }

    return <StudentDashboard user={user} onLogout={handleLogout} />;
}

export default App;