import { useState, useEffect, useMemo } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import ChallengeCard from '../components/ChallengeCard';
import { Bell, ChevronRight, CheckCircle2, Lock, Edit3, Star, Clock, Trophy, Map, BrainCircuit, Activity, Database, Code2 } from 'lucide-react';
import api from '../services/api';
import { learningPath as rawLearningPath } from '../services/mockData';
import './StudentDashboard.css';

function TrophyIcon(props) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
      <path d="M4 22h16"></path>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
  );
}

function StudentDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('Trilhas');
    const [challenges, setChallenges] = useState([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(user);
    const [completedChallenges, setCompletedChallenges] = useState(new Set());
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

    const iconMap = {
        CheckCircle2, Code2, Database, Activity, BrainCircuit, Lock, TrophyIcon
    };

    const learningPath = rawLearningPath.map(node => ({
        ...node,
        icon: iconMap[node.iconName]
    }));

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
            console.warn('Backend indisponível para profile. Usando mock ou storage.');
        }
    };

    const loadRanking = async () => {
        try {
            const response = await api.get('/ranking');
            setRanking(response.data);
        } catch (error) {
            console.warn('Backend indisponível para ranking. Usando mock.');
            setRanking([
                { id: 1, name: 'Lucas Mendes', xp: 3250, level: 8 },
                { id: 2, name: 'Mariana Silva', xp: 2980, level: 7 },
                { id: 3, name: 'Pedro Henrique', xp: 2750, level: 7 },
                { id: currentUser?.id || 99, name: currentUser?.name || 'Você', xp: currentUser?.xp || 2450, level: currentUser?.level || 5 }
            ].sort((a, b) => b.xp - a.xp));
        }
    };

    const loadChallenges = async () => {
        try {
            const response = await api.get('/challenges');
            setChallenges(response.data);
        } catch (error) {
            console.warn('Backend indisponível para desafios. Simulando array vazio.');
            setChallenges([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNodeClick = (node) => {
        if (node.status === 'locked') return;
        setActiveTab('Desafios');
    };

    const handleThemeChange = (themeId) => {
        setSelectedTheme(themeId);
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        localStorage.setItem('selectedLanguage', language);
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
            console.warn('Erro na API ao submeter desafio. Simulando sucesso.');
            setCompletedChallenges(prev => new Set([...prev, challengeId]));
            setCurrentUser(prev => ({ ...prev, xp: prev.xp + 10 }));
            
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
        return { 
            xpToNext: nextLevelXp - userXp, 
            xpNeeded, 
            xpInCurrentLevel,
            progressPercent: (xpInCurrentLevel / xpNeeded) * 100 
        };
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

    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
                <div style={{ color: 'var(--primary-neon)', fontSize: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary-neon)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Carregando desafios...
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
    const xpInfo = getXpToNextLevel();

    return (
        <div className="student-dashboard-layout">
            <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="student-main">
                <header className="student-header">
                    <div className="student-greeting">
                        <h1>Olá, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Aluno'}! 👋</h1>
                        <p>Continue sua jornada de aprendizado e conquiste novos níveis!</p>
                    </div>
                    <div className="student-header-actions">
                        <div className="xp-badge">
                            ⚡ {currentUser?.xp || 0} XP
                        </div>
                        <button className="notification-btn">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <button className="avatar-btn" onClick={onLogout} title="Sair">
                            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', fontSize:'1.2rem'}}>
                                {currentUser?.name?.charAt(0) || 'A'}
                            </div>
                        </button>
                    </div>
                </header>

                <div className="trilhas-grid">
                    <div className="trilhas-content">
                        {activeTab === 'Trilhas' && (
                            <>
                                {/* Level Card */}
                                <div className="level-card">
                                    <div className="level-badge-large">
                                        <span style={{fontSize:'0.7rem', fontWeight:600, color:'#facc15', marginBottom:'-5px', textTransform:'uppercase'}}>Nível</span>
                                        <span className="level-num">{currentUser?.level || 1}</span>
                                    </div>
                                    <div className="level-info">
                                        <div className="level-header-row">
                                            <h3 className="level-title">Nível {currentUser?.level || 1}</h3>
                                            <span className="level-xp-text">XP: {currentUser?.xp || 0}</span>
                                        </div>
                                        <div className="level-progress-bar">
                                            <div className="level-progress-fill" style={{ width: `${Math.min(100, Math.max(0, xpInfo.progressPercent))}%` }}></div>
                                            <div className="level-progress-glow" style={{ right: `${100 - Math.min(100, Math.max(0, xpInfo.progressPercent))}%` }}></div>
                                        </div>
                                        <span className="level-remaining">Faltam {xpInfo.xpToNext} XP para o próximo nível</span>
                                    </div>
                                </div>

                                {/* Path Card */}
                                <div className="path-card">
                                    <div className="path-header">
                                        <div>
                                            <h3 className="path-title"><Map size={20}/> Trilha de Aprendizagem</h3>
                                            <span className="path-subtitle">Desenvolva suas habilidades passo a passo</span>
                                        </div>
                                        <button className="btn-ghost" style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}} onClick={() => setActiveTab('Desafios')}>
                                            Ver desafios disponíveis <ChevronRight size={16}/>
                                        </button>
                                    </div>

                                    <div className="path-nodes-container">
                                        <div className="path-line"></div>
                                        {learningPath.slice(0, 6).map((node) => {
                                            const Icon = node.icon;
                                            return (
                                                <div key={node.id} className="path-node-wrapper" onClick={() => handleNodeClick(node)}>
                                                    <div className="node-number">{node.id}</div>
                                                    <div className={`path-node ${node.status}`}>
                                                        {node.status === 'completed' && <CheckCircle2 size={24} color="var(--secondary-neon)" />}
                                                        {node.status === 'active' && <Icon size={24} color="var(--primary-neon)" />}
                                                        {node.status === 'locked' && <Lock size={20} color="var(--text-muted)" />}
                                                    </div>
                                                    <span className="node-label">{node.title}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Bottom Stats */}
                                <div className="bottom-stats">
                                    <div className="bottom-stat-card">
                                        <div className="stat-icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary-neon)'}}>
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="bottom-stat-info">
                                            <span className="stat-label">Progresso</span>
                                            <span className="stat-val">{getProgressPercentage()}%</span>
                                        </div>
                                    </div>
                                    <div className="bottom-stat-card">
                                        <div className="stat-icon-wrapper" style={{background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-neon)'}}>
                                            <Edit3 size={20} />
                                        </div>
                                        <div className="bottom-stat-info">
                                            <span className="stat-label">Desafios Feitos</span>
                                            <span className="stat-val">{completedChallenges.size}</span>
                                        </div>
                                    </div>
                                    <div className="bottom-stat-card">
                                        <div className="stat-icon-wrapper" style={{background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-neon)'}}>
                                            <Star size={20} />
                                        </div>
                                        <div className="bottom-stat-info">
                                            <span className="stat-label">XP Conquistado</span>
                                            <span className="stat-val">{currentUser?.xp || 0}</span>
                                        </div>
                                    </div>
                                    <div className="bottom-stat-card">
                                        <div className="stat-icon-wrapper" style={{background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)'}}>
                                            <Clock size={20} />
                                        </div>
                                        <div className="bottom-stat-info">
                                            <span className="stat-label">Nível Atual</span>
                                            <span className="stat-val">{currentUser?.level || 1}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'Desafios' && (
                            <div className="challenge-view">
                                <div className="challenge-filters card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className="filter-group">
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>🔍 Buscar:</label>
                                        <input
                                            type="text"
                                            placeholder="Digite o nome do desafio ou matéria..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="input"
                                        />
                                    </div>
                                    <div className="filter-group">
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>📚 Disciplinas:</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            {subjects.map(subject => (
                                                <button
                                                    key={subject}
                                                    className={`badge ${selectedSubjects === null || selectedSubjects.has(subject) ? 'badge-info' : 'btn-outline'}`}
                                                    onClick={() => toggleSubject(subject)}
                                                    style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                                                >
                                                    {subject}
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={selectAllSubjects}>Selecionar tudo</button>
                                            <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={clearSubjects}>Desmarcar tudo</button>
                                        </div>
                                    </div>
                                    <div className="filter-group">
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>🎲 Modo de jogo:</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <button
                                                className={`btn ${randomMode ? 'btn-primary' : 'btn-outline'}`}
                                                onClick={() => setRandomMode(prev => !prev)}
                                            >
                                                {randomMode ? '🎲 Aleatório ativo' : '⚡ Ativar modo aleatório'}
                                            </button>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{randomMode ? 'Sorteando desafios aleatórios' : 'Seguindo a ordem'}</span>
                                        </div>
                                    </div>
                                </div>

                                {filteredChallenges.length === 0 ? (
                                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <h3 style={{ marginBottom: '1rem' }}>😕 Nenhum desafio encontrado</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Selecione ao menos uma disciplina ou ajuste sua busca.</p>
                                        <button className="btn btn-primary" onClick={() => { setSearchQuery(''); selectAllSubjects(); }}>Limpar Filtros</button>
                                    </div>
                                ) : currentChallenge ? (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <span>{randomMode ? '🎲 Desafio aleatório' : `Desafio ${filteredChallenges.indexOf(currentChallenge) + 1} de ${filteredChallenges.length}`}</span>
                                        </div>

                                        <ChallengeCard
                                            challenge={currentChallenge}
                                            onSubmit={handleChallengeSubmit}
                                            disabled={completedChallenges.has(currentChallenge.id)}
                                        />

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                                            {!randomMode ? (
                                                <>
                                                    <button className="btn btn-outline" onClick={() => setCurrentChallengeIndex(Math.max(0, currentChallengeIndex - 1))} disabled={currentChallengeIndex === 0}>← Anterior</button>
                                                    <button className="btn btn-outline" onClick={() => setCurrentChallengeIndex(Math.min(filteredChallenges.length - 1, currentChallengeIndex + 1))}>Próximo →</button>
                                                </>
                                            ) : (
                                                <button className="btn btn-outline" onClick={() => setRandomChallengeId(getRandomChallengeId(filteredChallenges, currentChallenge.id))}>🎲 Novo desafio aleatório</button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Parabéns!</h2>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Você completou todos os desafios disponíveis!</p>
                                        <button className="btn btn-primary" onClick={() => setActiveTab('Estatísticas')}>Ver Estatísticas</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Estatísticas' && (
                            <div className="stats-view card">
                                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📊 Suas Estatísticas por Disciplina</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {Object.entries(getSubjectStats()).map(([subject, stats]) => (
                                        <div key={subject} className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{subject}</h3>
                                            <div className="progress-bar-container" style={{ marginBottom: '0.5rem' }}>
                                                <div className="progress-bar-fill" style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stats.completed}/{stats.total} concluídos</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Configurações' && (
                            <div className="settings-panel card">
                                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>⚙️ Configurações</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Linguagem do programa (Preferência)</label>
                                        <select className="input" value={selectedLanguage} onChange={(e) => handleLanguageChange(e.target.value)}>
                                            {['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'HTML/CSS'].map(language => (
                                                <option key={language} value={language}>{language}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tema visual</label>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {availableThemes.map(theme => (
                                                <button
                                                    key={theme.id}
                                                    type="button"
                                                    className={`btn ${selectedTheme === theme.id ? 'btn-primary' : 'btn-outline'}`}
                                                    onClick={() => handleThemeChange(theme.id)}
                                                >
                                                    {theme.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ranking-sidebar">
                        {/* Ranking Card */}
                        <div className="ranking-card">
                            <div className="ranking-header">
                                <h3 className="ranking-title"><Trophy size={20}/> Ranking Global</h3>
                            </div>
                            <div className="ranking-list">
                                {ranking.map((student, index) => (
                                    <div key={student.id || index} className={`ranking-item ${student.id === currentUser?.id ? 'is-user' : ''}`}>
                                        <div className="rank-pos">{index + 1}</div>
                                        <div className="rank-avatar" style={{background: student.id === currentUser?.id ? 'var(--primary)' : 'var(--bg-surface)'}}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="rank-info">
                                            <span className="rank-name">{student.name}</span>
                                            <span className="rank-level" style={student.id === currentUser?.id ? {color: 'var(--primary-neon)'} : {}}>
                                                {student.id === currentUser?.id ? 'Você • ' : ''}Nível {student.level}
                                            </span>
                                        </div>
                                        <div className="rank-xp">{student.xp} XP</div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-ghost" style={{ width: '100%', marginTop: '1rem', fontSize: '0.85rem' }} onClick={() => setActiveTab('Ranking')}>
                                Ver ranking completo &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;