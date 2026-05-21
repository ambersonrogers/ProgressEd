import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/analytics.css';

function Analytics() {
    const [analytics, setAnalytics] = useState({
        totalStudents: 0,
        totalQuestions: 0,
        averageScore: 0,
        totalSessions: 0,
        topPerformers: [],
        categoryStats: [],
        sessionHistory: [],
    });
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            fetchAnalytics(selectedRoom);
        }
    }, [selectedRoom]);

    const fetchRooms = async () => {
        try {
            const response = await api.get('/teacher/rooms');
            setRooms(response.data);
            if (response.data.length > 0) {
                setSelectedRoom(response.data[0].id);
            }
        } catch (error) {
            console.error('Erro ao buscar salas:', error);
        }
    };

    const fetchAnalytics = async (roomId) => {
        try {
            setLoading(true);
            const response = await api.get(`/analytics/room/${roomId}`);
            setAnalytics(response.data);
        } catch (error) {
            console.error('Erro ao buscar analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPerformanceColor = (score) => {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'fair';
        return 'poor';
    };

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h2>📊 Analytics & Desempenho</h2>
                <select
                    className="room-selector"
                    value={selectedRoom || ''}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                >
                    <option value="">Selecione uma sala</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.name} ({room.studentCount} alunos)
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="loading">Carregando dados...</div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-content">
                                <div className="stat-label">Total de Alunos</div>
                                <div className="stat-value">{analytics.totalStudents}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">❓</div>
                            <div className="stat-content">
                                <div className="stat-label">Total de Questões</div>
                                <div className="stat-value">{analytics.totalQuestions}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div className="stat-content">
                                <div className="stat-label">Média de Pontuação</div>
                                <div className="stat-value">{analytics.averageScore.toFixed(1)}%</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🎮</div>
                            <div className="stat-content">
                                <div className="stat-label">Total de Sessões</div>
                                <div className="stat-value">{analytics.totalSessions}</div>
                            </div>
                        </div>
                    </div>

                    {/* Category Stats */}
                    <div className="analytics-section">
                        <h3>Desempenho por Categoria</h3>
                        <div className="category-stats">
                            {analytics.categoryStats.map((category) => (
                                <div key={category.id} className="category-item">
                                    <div className="category-name">{category.name}</div>
                                    <div className="category-bar">
                                        <div
                                            className="category-progress"
                                            style={{
                                                width: `${category.averageScore}%`,
                                                background: `linear-gradient(90deg, ${category.color} 0%, ${category.colorLight} 100%)`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="category-stats-text">
                                        <span>{category.averageScore.toFixed(1)}%</span>
                                        <span>{category.correctAnswers}/{category.totalAnswers}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="analytics-section">
                        <h3>Melhores Desempenhos</h3>
                        <div className="top-performers">
                            {analytics.topPerformers.map((performer, index) => (
                                <div
                                    key={performer.studentId}
                                    className={`performer-card ${getPerformanceColor(performer.score)}`}
                                >
                                    <div className="performer-rank">#{index + 1}</div>
                                    <div className="performer-info">
                                        <div className="performer-name">{performer.name}</div>
                                        <div className="performer-stats">
                                            {performer.correctAnswers} acertos de {performer.totalAnswers}
                                        </div>
                                    </div>
                                    <div className="performer-score">
                                        <span className="score">{performer.score.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Session History */}
                    <div className="analytics-section">
                        <h3>Histórico de Sessões</h3>
                        <div className="session-history">
                            {analytics.sessionHistory.map((session) => (
                                <div key={session.id} className="session-item">
                                    <div className="session-info">
                                        <div className="session-date">
                                            {new Date(session.createdAt).toLocaleDateString('pt-BR')}
                                        </div>
                                        <div className="session-stats">
                                            {session.studentCount} alunos • {session.questionCount} questões
                                        </div>
                                    </div>
                                    <div className="session-score">
                                        <span className="score">{session.averageScore.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Analytics;
