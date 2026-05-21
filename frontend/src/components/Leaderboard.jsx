import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/leaderboard.css';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('week');

    useEffect(() => {
        fetchLeaderboard();
    }, [timeFilter]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/leaderboard?period=${timeFilter}`);
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Erro ao buscar leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedalEmoji = (position) => {
        switch (position) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `${position}º`;
        }
    };

    const getBadgeColor = (position) => {
        switch (position) {
            case 1:
                return 'gold';
            case 2:
                return 'silver';
            case 3:
                return 'bronze';
            default:
                return 'default';
        }
    };

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>🏆 Ranking Global</h2>
                <div className="time-filter">
                    <button
                        className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeFilter('week')}
                    >
                        Esta Semana
                    </button>
                    <button
                        className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeFilter('month')}
                    >
                        Este Mês
                    </button>
                    <button
                        className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setTimeFilter('all')}
                    >
                        Todos os Tempos
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Carregando ranking...</div>
            ) : (
                <div className="leaderboard-list">
                    {leaderboard.map((entry, index) => (
                        <div
                            key={entry.userId}
                            className={`leaderboard-item rank-${getBadgeColor(index + 1)}`}
                        >
                            <div className="rank-position">
                                <span className="medal">{getMedalEmoji(index + 1)}</span>
                            </div>
                            <div className="user-info">
                                <div className="user-name">{entry.userName}</div>
                                <div className="user-stats">
                                    {entry.totalPoints} pontos • {entry.correctAnswers} acertos
                                </div>
                            </div>
                            <div className="user-badges">
                                {entry.badges && entry.badges.map((badge, i) => (
                                    <span key={i} className="badge" title={badge.name}>
                                        {badge.emoji}
                                    </span>
                                ))}
                            </div>
                            <div className="user-score">
                                <span className="score-value">{entry.totalPoints}</span>
                                <span className="score-label">XP</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;
