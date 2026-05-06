import { useState, useEffect } from 'react';
import { 
    Users, BookOpen, CheckSquare, Clock, AlertTriangle, 
    MessageSquare, Target, Settings, Download, Search, 
    MoreVertical, Info, GraduationCap, LayoutDashboard, 
    BarChart2, ShieldAlert, Video, PlusCircle
} from 'lucide-react';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import CreateChallengeForm from '../components/CreateChallengeForm';
import { engagementData, topicsData, activityData, studentsList } from '../services/mockData';
import api from '../services/api';
import './TeacherDashboard.css';

function TeacherDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('Painel');
    const [apiStudents, setApiStudents] = useState([]);
    const [apiStats, setApiStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            document.documentElement.dataset.theme = savedTheme;
        }
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [studentsRes, statsRes] = await Promise.all([
                api.get('/teacher/students').catch(() => null),
                api.get('/teacher/stats').catch(() => null)
            ]);
            if (studentsRes) setApiStudents(studentsRes.data);
            if (statsRes) setApiStats(statsRes.data);
        } catch (error) {
            console.warn('Usando dados mock - backend indisponível');
        } finally {
            setLoading(false);
        }
    };

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#1e293b', padding: '8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                    <p style={{ margin: 0, color: 'white', fontSize: '12px' }}>{`${payload[0].value}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="teacher-dashboard-layout">
            {/* Sidebar */}
            <aside className="teacher-sidebar">
                <div className="sidebar-logo">
                    <GraduationCap size={28} />
                    ProgressEd
                </div>

                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'Painel' ? 'active' : ''}`} onClick={() => setActiveTab('Painel')}>
                        <LayoutDashboard size={18} /> Painel
                    </button>
                    <button className={`nav-item ${activeTab === 'Criar' ? 'active' : ''}`} onClick={() => setActiveTab('Criar')}>
                        <PlusCircle size={18} /> Criar Desafio
                    </button>
                    <button className="nav-item">
                        <Users size={18} /> Alunos
                    </button>
                    <button className="nav-item">
                        <BookOpen size={18} /> Turmas
                    </button>
                    <button className="nav-item">
                        <CheckSquare size={18} /> Tarefas
                    </button>
                    <button className="nav-item">
                        <Target size={18} /> Avaliações
                    </button>
                    <button className="nav-item">
                        <BarChart2 size={18} /> Relatórios
                    </button>
                    <button className="nav-item">
                        <MessageSquare size={18} /> Mensagens
                        <span className="nav-badge">3</span>
                    </button>
                    <button className="nav-item">
                        <Target size={18} /> Metas
                    </button>
                    <button className="nav-item">
                        <BookOpen size={18} /> Recursos
                    </button>
                    <button className="nav-item">
                        <Settings size={18} /> Configurações
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="user-profile-btn" onClick={onLogout}>
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="user-info-text">
                            <span className="user-name">{user?.name || 'Professor'}</span>
                            <span className="user-role">Professor</span>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="teacher-main">
                {activeTab === 'Painel' ? (
                    <>
                        <div className="dashboard-header">
                            <div className="dashboard-title">
                                <h1>Painel</h1>
                                <p>Visão geral do engajamento e progresso da turma</p>
                            </div>
                            <div className="dashboard-actions">
                                <select className="select-dropdown">
                                    <option>8º Ano Ciências</option>
                                </select>
                                <button className="btn btn-outline" style={{ background: 'var(--bg-surface)' }}>
                                    12 de mai - 16 de mai, 2024
                                </button>
                                <button className="btn btn-outline">
                                    <Download size={16} /> Exportar Relatório
                                </button>
                            </div>
                        </div>

                        <div className="metrics-grid">
                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon blue"><Users size={16} /></div>
                                    <span>Engajamento Geral</span>
                                </div>
                                <div className="metric-value-row">
                                    <span className="metric-value">{apiStats.totalStudents || '76%'}</span>
                                    <span className="metric-trend up">↑ 6% <span className="metric-trend-label">vs últimos 7 dias</span></span>
                                </div>
                                <div className="metric-chart-small">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={engagementData}>
                                            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon green"><CheckSquare size={16} /></div>
                                    <span>Tarefas Concluídas</span>
                                </div>
                                <div className="metric-value-row">
                                    <span className="metric-value">{apiStats.totalCompleted || '82%'}</span>
                                    <span className="metric-trend up">↑ 6% <span className="metric-trend-label">vs últimos 7 dias</span></span>
                                </div>
                                <div className="metric-chart-small">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={engagementData}>
                                            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon purple"><Clock size={16} /></div>
                                    <span>Tempo em Tarefa (Média)</span>
                                </div>
                                <div className="metric-value-row">
                                    <span className="metric-value">48m</span>
                                    <span className="metric-trend up">↑ 5m <span className="metric-trend-label">vs últimos 7 dias</span></span>
                                </div>
                                <div className="metric-chart-small">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={engagementData}>
                                            <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon orange"><AlertTriangle size={16} /></div>
                                    <span>Alunos Precisando de Ajuda</span>
                                </div>
                                <div className="metric-value-row">
                                    <span className="metric-value">6</span>
                                    <span className="metric-trend down">↓ 2 <span className="metric-trend-label">vs últimos 7 dias</span></span>
                                </div>
                                <div className="metric-chart-small">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={engagementData}>
                                            <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard Grid */}
                        <div className="dashboard-grid">
                            {/* Row 1 */}
                            <div className="panel-card" style={{ gridColumn: '1 / 2' }}>
                                <div className="panel-header">
                                    <span className="panel-title">Engajamento ao Longo do Tempo <Info size={14} color="var(--text-muted)"/></span>
                                    <select className="select-dropdown" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                        <option>30 Dias</option>
                                    </select>
                                </div>
                                <div style={{ height: '200px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={engagementData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginRight: '4px' }}></span>
                                    Pontuação de Engajamento
                                </div>
                            </div>

                            <div className="panel-card" style={{ gridColumn: '2 / 3' }}>
                                <div className="panel-header">
                                    <span className="panel-title">Conclusão de Tarefas por Tópico <Info size={14} color="var(--text-muted)"/></span>
                                    <a href="#" className="panel-action">Ver Todos</a>
                                </div>
                                <div style={{ height: '200px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topicsData} margin={{top: 20}}>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} interval={0} />
                                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />} />
                                            <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                                                {topicsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8' }}>
                                    % de Alunos que Completaram
                                </div>
                            </div>

                            {/* Students Sidebar (spans 2 rows) */}
                            <div className="panel-card" style={{ gridColumn: '3 / 4', gridRow: '1 / 3' }}>
                                <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
                                    <span className="panel-title">Alunos</span>
                                </div>
                                <div className="student-search">
                                    <Search size={16} />
                                    <input type="text" placeholder="Buscar alunos..." />
                                </div>
                                <div className="students-list">
                                    {(apiStudents.length > 0 ? apiStudents.map(s => ({
                                        id: s.name?.substring(0,2).toUpperCase() || '??',
                                        name: s.name,
                                        score: `${s.xp || 0} XP`,
                                        status: 'Ativo',
                                        statusColor: 'status-active',
                                        color: '#3b82f6'
                                    })) : studentsList).map((student, idx) => (
                                        <div className="student-item" key={idx}>
                                            <div className="student-item-info">
                                                <div className="student-avatar-small" style={{ background: student.color }}>
                                                    {student.id}
                                                </div>
                                                <span className="student-name">{student.name}</span>
                                            </div>
                                            <div className="student-stats">
                                                <span className="student-score">{student.score}</span>
                                                <span className={`student-status ${student.statusColor}`}>{student.status}</span>
                                                <button className="btn-ghost" style={{ padding: '0.2rem' }}><MoreVertical size={14}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <a href="#" className="panel-action" style={{ marginTop: '1rem', display: 'block' }}>Ver Todos os Alunos &gt;</a>
                            </div>

                            {/* Row 2 */}
                            <div className="panel-card" style={{ gridColumn: '1 / 2' }}>
                                <div className="panel-header">
                                    <span className="panel-title">Engajamento por Tipo de Atividade <Info size={14} color="var(--text-muted)"/></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', height: '150px' }}>
                                    <div style={{ width: '50%', height: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={activityData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                                    {activityData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ width: '50%', fontSize: '0.8rem' }}>
                                        {activityData.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span style={{ fontWeight: 'bold' }}>{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <a href="#" className="panel-action" style={{ marginTop: 'auto' }}>Ver Relatório Completo &gt;</a>
                            </div>

                            <div className="panel-card" style={{ gridColumn: '2 / 3' }}>
                                <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
                                    <span className="panel-title">Mapa de Calor de Engajamento <Info size={14} color="var(--text-muted)"/></span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '20px' }}>
                                        {['16h', '10h', '16h', '16h', '15h', '16h', '5h'].map((h, i) => <div key={i} className="heatmap-label">{h}</div>)}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', paddingBottom: '4px' }}>
                                            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                                        </div>
                                        {Array(7).fill(0).map((_, rowIdx) => (
                                            <div key={rowIdx} className="heatmap-row">
                                                {Array(7).fill(0).map((_, colIdx) => {
                                                    const intensity = `l${Math.floor(Math.random() * 4) + 1}`;
                                                    return <div key={`${rowIdx}-${colIdx}`} className={`heatmap-cell ${intensity}`}></div>;
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="heatmap-legend">
                                    Menos Engajamento
                                    <div className="heatmap-legend-scale">
                                        <div className="heatmap-legend-cell l1"></div>
                                        <div className="heatmap-legend-cell l2"></div>
                                        <div className="heatmap-legend-cell l3"></div>
                                        <div className="heatmap-legend-cell l4"></div>
                                    </div>
                                    Mais Engajamento
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid" style={{ marginTop: '1rem', gridTemplateColumns: '1fr', gridTemplateRows: 'auto' }}>
                            {/* Alerts Row */}
                             <div className="panel-card">
                                 <div className="panel-header">
                                    <span className="panel-title">Alertas <Info size={14} color="var(--text-muted)"/></span>
                                </div>
                                <div className="alerts-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div className="alert-item">
                                        <div className="alert-icon up"><LineChart size={16} /></div>
                                        <div className="alert-content">
                                            <h4>Engajamento em Melhora</h4>
                                            <p>O engajamento geral aumentou 6% em comparação com a semana passada. Ótimo trabalho!</p>
                                        </div>
                                    </div>
                                    <div className="alert-item">
                                        <div className="alert-icon warn"><ShieldAlert size={16} /></div>
                                        <div className="alert-content">
                                            <h4>6 Alunos Precisam de Atenção</h4>
                                            <p>Considere entrar em contato com os alunos que podem estar com dificuldades.</p>
                                        </div>
                                    </div>
                                    <div className="alert-item">
                                        <div className="alert-icon info"><Video size={16} /></div>
                                        <div className="alert-content">
                                            <h4>Vídeo de Ciências Populares</h4>
                                            <p>Os vídeos tiveram a maior taxa de engajamento esta semana.</p>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" className="panel-action" style={{ marginTop: '1rem' }}>Ver Todas as Análises &gt;</a>
                            </div>
                        </div>

                        <footer className="dashboard-footer">
                            <Clock size={12} />
                            <span>Todos os dados são atualizados diariamente. Última atualização: 16 de mai de 2024 às 22:30</span>
                        </footer>
                    </>
                ) : activeTab === 'Criar' ? (
                    <CreateChallengeForm />
                ) : (
                    <div className="dashboard-header">
                        <div className="dashboard-title">
                            <h1>Em breve</h1>
                            <p>Esta aba ainda está em desenvolvimento.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default TeacherDashboard;