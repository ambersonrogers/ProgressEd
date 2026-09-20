import { useState, useEffect } from 'react';
import api from '../services/api';
import { studentsList } from '../services/mockData';

const DEFAULT_TEACHER_STATS = {
    totalStudents: 32,
    avgXp: 890,
    avgLevel: 4,
    totalCompleted: 284
};

const DEFAULT_STUDENTS = [
    { id: '1', name: 'Amberson Rogers', email: 'amberson@escola.com', xp: 1250, level: 6, completed_challenges: 18, total_challenges: 20 },
    { id: '2', name: 'Jhony Fernandes', email: 'jhony@escola.com', xp: 980, level: 5, completed_challenges: 15, total_challenges: 20 },
    { id: '3', name: 'Kelly Lorrany', email: 'kelly@escola.com', xp: 920, level: 5, completed_challenges: 14, total_challenges: 20 },
    { id: '4', name: 'Weldes Reis', email: 'weldes@escola.com', xp: 840, level: 4, completed_challenges: 12, total_challenges: 20 },
    { id: '5', name: 'Ana Beatriz Sousa', email: 'ana.beatriz@escola.com', xp: 760, level: 4, completed_challenges: 11, total_challenges: 20 },
    { id: '6', name: 'Lucas Gabriel Lima', email: 'lucas.lima@escola.com', xp: 620, level: 3, completed_challenges: 9, total_challenges: 20 }
];

function TeacherDashboard({ user, onLogout }) {
    const [students, setStudents] = useState(DEFAULT_STUDENTS);
    const [stats, setStats] = useState(DEFAULT_TEACHER_STATS);
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
            const response = await api.get('/teacher/students');
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setStudents(response.data);
            } else {
                setStudents(DEFAULT_STUDENTS);
            }
        } catch (error) {
            console.warn('Usando lista de alunos demonstrativa:', error.message);
            setStudents(DEFAULT_STUDENTS);
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.get('/teacher/stats');
            if (response.data && response.data.totalStudents) {
                setStats(response.data);
            } else {
                setStats(DEFAULT_TEACHER_STATS);
            }
        } catch (error) {
            console.warn('Usando estatísticas demonstrativas:', error.message);
            setStats(DEFAULT_TEACHER_STATS);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="teacher-dashboard">
            <header className="teacher-header">
                <div className="logo">
                    <h2>📚 ProgressEd - Painel do Professor</h2>
                </div>
                <div className="user-info">
                    <span>👨‍🏫 Olá, Prof. {user?.name || 'Docente'}</span>
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
                <h2>📋 Alunos Matriculados (Centro Educa Mais Paulo Freire)</h2>
                {loading ? (
                    <p>Carregando dados da turma...</p>
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
                                    <td>{student.completed_challenges || 0}/{student.total_challenges || 20}</td>
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
                        <p><strong>XP Total:</strong> {selectedStudent.xp} XP</p>
                        <p><strong>Nível Atual:</strong> {selectedStudent.level}</p>
                        <p><strong>Desafios Concluídos:</strong> {selectedStudent.completed_challenges || 0}</p>
                        <button className="btn btn-primary" onClick={() => setSelectedStudent(null)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherDashboard;
