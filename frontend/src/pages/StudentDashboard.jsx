import { useState, useEffect, useMemo } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import api from '../services/api';
import './StudentDashboard.css';

function StudentDashboard({ user, onLogout }) {
    const [challenges, setChallenges] = useState([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(user);
    const [completedChallenges, setCompletedChallenges] = useState(new Set());
    const [showStats, setShowStats] = useState(false);
    const [showRanking, setShowRanking] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [ranking, setRanking] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [randomMode, setRandomMode] = useState(false);
    const [randomChallengeId, setRandomChallengeId] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem('selectedLanguage') || 'JavaScript');
    const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem('selectedTheme') || 'school');

    const availableThemes = [
        { id: 'school', label: 'Escola' },
        { id: 'cyber', label: 'Cyber' },
        { id: 'adventure', label: 'Aventura' },
    ];

    const handleThemeChange = (themeId) => {
        setSelectedTheme(themeId);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            setSelectedLanguage(savedLanguage);
        }
    }, []);

    const availableLanguages = ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'HTML/CSS'];

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        localStorage.setItem('selectedLanguage', language);
    };

    useEffect(() => {
        loadChallenges();
        loadUserProfile();
        loadRanking();
    }, []);

    useEffect(() => {
        if (challenges.length > 0 && selectedSubjects === null) {
            setSelectedSubjects(new Set(challenges.map(challenge => challenge.subject)));
        }
    }, [challenges, selectedSubjects]);

    useEffect(() => {
        document.documentElement.dataset.theme = selectedTheme;
        localStorage.setItem('selectedTheme', selectedTheme);
    }, [selectedTheme]);

    const loadUserProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setCurrentUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    };

    const loadRanking = async () => {
        try {
            const response = await api.get('/ranking');
            setRanking(response.data);
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
        }
    };

    const loadChallenges = async () => {
        try {
            const response = await api.get('/challenges');
            setChallenges(response.data);
        } catch (error) {
            console.error('Erro ao carregar desafios:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRandomChallengeId = (list, excludeId = null) => {
        const candidates = excludeId ? list.filter(challenge => challenge.id !== excludeId) : list;
        if (candidates.length === 0) {
            return list.length > 0 ? list[0].id : null;
        }
        return candidates[Math.floor(Math.random() * candidates.length)].id;
    };

    const handleChallengeSubmit = async (challengeId, answer) => {
        try {
            const response = await api.post(`/challenges/${challengeId}/submit`, { answer });

            if (response.data.user) {
                setCurrentUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            setCompletedChallenges(prev => new Set([...prev, challengeId]));

            setTimeout(() => {
                if (randomMode) {
                    setRandomChallengeId(getRandomChallengeId(filteredChallenges, challengeId));
                } else {
                    setCurrentChallengeIndex(prevIndex => {
                        if (prevIndex < filteredChallenges.length - 1) {
                            return prevIndex + 1;
                        }
                        return 0;
                    });
                }
            }, 1000);

        } catch (error) {
            console.error('Erro ao submeter desafio:', error);
            alert('Erro ao enviar resposta. Tente novamente.');
        }
    };

    const getProgressPercentage = () => {
        if (challenges.length === 0) return 0;
        return Math.round((completedChallenges.size / challenges.length) * 100);
    };

    const getSubjectStats = () => {
        const stats = {};
        challenges.forEach(challenge => {
            if (!stats[challenge.subject]) {
                stats[challenge.subject] = { total: 0, completed: 0 };
            }
            stats[challenge.subject].total++;
            if (completedChallenges.has(challenge.id)) {
                stats[challenge.subject].completed++;
            }
        });
        return stats;
    };

    const getXpToNextLevel = () => {
        const XP_PER_LEVEL = 500;
        const nextLevelXp = (currentUser?.level || 1) * XP_PER_LEVEL;
        const currentLevelXp = ((currentUser?.level || 1) - 1) * XP_PER_LEVEL;
        const userXp = currentUser?.xp || 0;
        const xpInCurrentLevel = userXp - currentLevelXp;
        const xpNeeded = nextLevelXp - currentLevelXp;
        const xpToNext = nextLevelXp - userXp;
        return { xpToNext, xpNeeded, xpInCurrentLevel };
    };

    const subjects = useMemo(() => {
        return Array.from(new Set(challenges.map(challenge => challenge.subject))).sort();
    }, [challenges]);

    const filteredChallenges = useMemo(() => {
        return challenges.filter(challenge => {
            const matchesSubject = selectedSubjects === null || selectedSubjects.has(challenge.subject);
            const matchesSearch = challenge.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                challenge.subject?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSubject && matchesSearch;
        });
    }, [challenges, selectedSubjects, searchQuery]);

    useEffect(() => {
        if (filteredChallenges.length === 0) {
            setCurrentChallengeIndex(0);
            setRandomChallengeId(null);
            return;
        }

        if (randomMode) {
            setRandomChallengeId(prevId => filteredChallenges.some(challenge => challenge.id === prevId) ? prevId : getRandomChallengeId(filteredChallenges));
        } else {
            setCurrentChallengeIndex(prevIndex => Math.min(prevIndex, filteredChallenges.length - 1));
        }
    }, [filteredChallenges.length, randomMode, selectedSubjects, searchQuery]);

    const toggleSubject = (subject) => {
        setSelectedSubjects(prev => {
            const next = prev === null ? new Set(subjects) : new Set(prev);
            if (next.has(subject)) {
                next.delete(subject);
            } else {
                next.add(subject);
            }
            return next;
        });
    };

    const selectAllSubjects = () => {
        setSelectedSubjects(new Set(subjects));
    };

    const clearSubjects = () => {
        setSelectedSubjects(new Set());
    };

    const getLevelBadge = () => {
        const level = currentUser?.level || 1;
        if (level >= 10) return '👑';
        if (level >= 8) return '🥇';
        if (level >= 5) return '🔥';
        return '⭐';
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Carregando desafios...</p>
                </div>
            </div>
        );
    }

    const currentChallenge = (() => {
        if (filteredChallenges.length === 0) return null;
        if (randomMode) {
            return filteredChallenges.find(challenge => challenge.id === randomChallengeId) || filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
        }
        return filteredChallenges[Math.min(currentChallengeIndex, filteredChallenges.length - 1)];
    })();

    const selectedCount = selectedSubjects === null ? subjects.length : selectedSubjects.size;
    const selectedMessage = selectedSubjects === null
        ? 'Todas as disciplinas selecionadas'
        : selectedCount === 0
            ? 'Nenhuma disciplina selecionada'
            : `${selectedCount} disciplina(s) selecionada(s)`;
    const xpProgress = getXpToNextLevel();

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>📚 ProgressEd</h1>
                        <p>Aprenda jogando • Ganhe XP • Suba de nível</p>
                    </div>

                    <div className="user-section">
                        <div className="user-info">
                            <div className="user-avatar level-badge" title="Badge de Nível">
                                <span>{getLevelBadge()}</span>
                                <div className="badge-label">Nível {currentUser?.level}</div>
                            </div>
                            <div className="user-details">
                                <h3>{currentUser?.name}</h3>
                                <div className="user-stats">
                                    <span className="xp-info">⭐ {currentUser?.xp} XP</span>
                                    <div className="mini-progress" title={`${xpProgress.xpToNext} XP para próximo nível`}>
                                        <div className="mini-bar" style={{ 
                                            width: `${(xpProgress.xpInCurrentLevel / xpProgress.xpNeeded) * 100}%` 
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="header-actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowStats(!showStats)}
                            >
                                📊 Estatísticas
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowRanking(!showRanking)}
                            >
                                🏆 Ranking
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowSettings(prev => !prev)}
                            >
                                ⚙️ Configurações
                            </button>
                            <button className="btn btn-danger" onClick={onLogout}>
                                🚪 Sair
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-section">
                    <div className="progress-info">
                        <span>Progresso: {completedChallenges.size} / {challenges.length} desafios</span>
                        <span>{getProgressPercentage()}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {showStats ? (
                    <div className="stats-view">
                        <h2>📊 Suas Estatísticas</h2>
                        <div className="stats-grid">
                            {Object.entries(getSubjectStats()).map(([subject, stats]) => (
                                <div key={subject} className="stat-card">
                                    <h3>{subject}</h3>
                                    <div className="stat-progress">
                                        <div className="stat-bar">
                                            <div
                                                className="stat-fill"
                                                style={{
                                                    width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span>{stats.completed}/{stats.total}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowStats(false)}
                        >
                            ← Voltar aos Desafios
                        </button>
                    </div>
                ) : showRanking ? (
                    <div className="ranking-section">
                        <h2>🏆 Ranking - Top Alunos</h2>
                        <div className="ranking-list">
                            {ranking.map((student, index) => (
                                <div key={student.id} className="ranking-item">
                                    <div className="ranking-position">{index + 1}º</div>
                                    <div className="ranking-name">{student.name}</div>
                                    <div className="ranking-xp">⭐ {student.xp} XP</div>
                                    <div className="ranking-level">🎯 Nível {student.level}</div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowRanking(false)}
                        >
                            ← Voltar aos Desafios
                        </button>
                    </div>
                ) : (
                    <div className="challenge-view">
                        <div className="challenge-grid">
                            <div className="challenge-filters card">
                                <div className="filter-group">
                                    <label>🔍 Buscar:</label>
                                    <input
                                        type="text"
                                        placeholder="Digite o nome do desafio ou matéria..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                <div className="filter-group">
                                    <label>📚 Disciplinas:</label>
                                    <div className="subject-pills">
                                        {subjects.map(subject => (
                                            <button
                                                key={subject}
                                                className={`pill ${selectedSubjects === null || selectedSubjects.has(subject) ? 'active' : ''}`}
                                                onClick={() => toggleSubject(subject)}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="subject-actions">
                                        <button className="btn btn-small btn-outline" onClick={selectAllSubjects}>
                                            Selecionar tudo
                                        </button>
                                        <button className="btn btn-small btn-outline" onClick={clearSubjects}>
                                            Desmarcar tudo
                                        </button>
                                    </div>
                                    <p className="subject-summary">{selectedMessage}</p>
                                </div>
                                <div className="filter-group random-mode-group">
                                    <label>🎲 Modo de jogo:</label>
                                    <div className="random-mode-row">
                                        <button
                                            className={`btn ${randomMode ? 'btn-primary' : 'btn-outline'}`}
                                            onClick={() => setRandomMode(prev => !prev)}
                                        >
                                            {randomMode ? '🎲 Aleatório ativo' : '⚡ Ativar modo aleatório'}
                                        </button>
                                        <span className="random-mode-badge">{randomMode ? 'Desafios sorteados entre as disciplinas selecionadas' : 'Use para misturar seus estudos'}</span>
                                    </div>
                                </div>
                            </div>
                            {showSettings && (
                                <aside className="settings-panel card">
                                    <div className="settings-panel-header">
                                        <h2>⚙️ Configurações</h2>
                                        <p>Selecione a linguagem de programação para os desafios.</p>
                                    </div>
                                    <div className="settings-item">
                                        <label>Linguagem do programa</label>
                                        <select
                                            className="language-select"
                                            value={selectedLanguage}
                                            onChange={(e) => handleLanguageChange(e.target.value)}
                                        >
                                            {availableLanguages.map(language => (
                                                <option key={language} value={language}>{language}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="settings-item">
                                        <label>Tema visual</label>
                                        <div className="theme-select-grid">
                                            {availableThemes.map(theme => (
                                                <button
                                                    key={theme.id}
                                                    type="button"
                                                    className={`theme-pill ${selectedTheme === theme.id ? 'active' : ''}`}
                                                    onClick={() => handleThemeChange(theme.id)}
                                                >
                                                    {theme.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="settings-item">
                                        <label>Estado do modo</label>
                                        <div className="setting-badges">
                                            <span className={randomMode ? 'badge badge-success' : 'badge badge-warning'}>
                                                {randomMode ? 'Aleatório' : 'Sequencial'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="settings-item">
                                        <label>Visão geral</label>
                                        <p className="settings-description">
                                            Você está estudando em <strong>{selectedLanguage}</strong> e selecionou <strong>{selectedMessage}</strong>.
                                        </p>
                                    </div>
                                </aside>
                            )}
                        </div>
                        {filteredChallenges.length === 0 ? (
                            <div className="no-results">
                                <h3>😕 Nenhum desafio encontrado</h3>
                                <p>Selecione ao menos uma disciplina ou ajuste sua busca.</p>
                                <button className="btn btn-primary" onClick={() => {
                                    setSearchQuery('');
                                    selectAllSubjects();
                                }}>
                                    Limpar Filtros
                                </button>
                            </div>
                        ) : currentChallenge ? (
                            <>
                                <div className="challenge-counter">
                                    <span>{randomMode ? '🎲 Desafio aleatório' : `Desafios ${filteredChallenges.indexOf(currentChallenge) + 1} de ${filteredChallenges.length}`}</span>
                                    {currentChallenge.subject && (
                                        <span className="subject-badge">{currentChallenge.subject}</span>
                                    )}
                                </div>

                                <ChallengeCard
                                    challenge={currentChallenge}
                                    onSubmit={handleChallengeSubmit}
                                    disabled={completedChallenges.has(currentChallenge.id)}
                                />

                                <div className="navigation-buttons">
                                    {!randomMode ? (
                                        <>
                                            <button
                                                className="btn btn-outline"
                                                onClick={() => setCurrentChallengeIndex(Math.max(0, currentChallengeIndex - 1))}
                                                disabled={currentChallengeIndex === 0}
                                            >
                                                ← Anterior
                                            </button>

                                            <button
                                                className="btn btn-outline"
                                                onClick={() => setCurrentChallengeIndex(Math.min(filteredChallenges.length - 1, currentChallengeIndex + 1))}
                                            >
                                                Próximo →
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => setRandomChallengeId(getRandomChallengeId(filteredChallenges, currentChallenge.id))}
                                        >
                                            🎲 Novo desafio aleatório
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="no-challenges">
                                <h2>🎉 Parabéns!</h2>
                                <p>Você completou todos os desafios disponíveis!</p>
                                <button className="btn btn-primary" onClick={() => setShowStats(true)}>
                                    Ver Estatísticas
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
export default StudentDashboard;