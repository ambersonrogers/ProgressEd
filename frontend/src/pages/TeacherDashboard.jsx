import { useState, useEffect } from 'react';
import api from '../services/api';

function TeacherDashboard({ user, onLogout }) {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            document.documentElement.dataset.theme = savedTheme;
        }
        loadStudents();
        loadStats();
    }, []);

    const loadStudents = async () => {
        try {
            // Buscar todos os alunos
            const response = await api.get('/teacher/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.get('/teacher/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="teacher-dashboard">
            <header className="teacher-header">
                <div className="logo">
                    <h2>📚 ProgressEd - Professor</h2>
                </div>
                <div className="user-info">
                    <span>👨‍🏫 Olá, Prof. {user.name}</span>
                    <button onClick={onLogout} className="logout-btn">Sair</button>
                </div>
            </header>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>📊 Total de Alunos</h3>
                    <p className="stat-number">{stats.totalStudents || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>⭐ Média de XP</h3>
                    <p className="stat-number">{stats.avgXp || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>🏆 Nível Médio</h3>
                    <p className="stat-number">{stats.avgLevel || 1}</p>
                </div>
                <div className="stat-card">
                    <h3>✅ Desafios Completados</h3>
                    <p className="stat-number">{stats.totalCompleted || 0}</p>
                </div>
            </div>

            <main className="dashboard-main">
                <h2>📋 Alunos Matriculados</h2>
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>XP</th>
                                <th>Nível</th>
                                <th>Desafios</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>⭐ {student.xp}</td>
                                    <td>🎯 {student.level}</td>
                                    <td>{student.completed_challenges || 0}/{student.total_challenges || 0}</td>
                                    <td>
                                        <button 
                                            className="view-btn"
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>

            {selectedStudent && (
                <div className="modal" onClick={() => setSelectedStudent(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Detalhes do Aluno</h3>
                        <p><strong>Nome:</strong> {selectedStudent.name}</p>
                        <p><strong>E-mail:</strong> {selectedStudent.email}</p>
                        <p><strong>XP Total:</strong> {selectedStudent.xp}</p>
                        <p><strong>Nível:</strong> {selectedStudent.level}</p>
                        <p><strong>Desafios Completos:</strong> {selectedStudent.completed_challenges || 0}</p>
                        <button className="btn btn-primary" onClick={() => setSelectedStudent(null)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherDashboard;