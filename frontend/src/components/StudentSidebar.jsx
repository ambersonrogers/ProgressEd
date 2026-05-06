import { Map, Trophy, User, Flame, CheckCircle2, PlayCircle, BarChart2, Settings } from 'lucide-react';
import './StudentSidebar.css';

function StudentSidebar({ activeTab, setActiveTab }) {
    return (
        <aside className="student-sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">P</div>
                ProgressEd
            </div>

            <nav className="sidebar-nav">
                <button 
                    className={`nav-item ${activeTab === 'Trilhas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Trilhas')}
                >
                    <Map size={20} /> Painel de Trilhas
                </button>
                <button 
                    className={`nav-item ${activeTab === 'Desafios' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Desafios')}
                >
                    <PlayCircle size={20} /> Jogar Desafios
                </button>
                <button 
                    className={`nav-item ${activeTab === 'Ranking' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Ranking')}
                >
                    <Trophy size={20} /> Ranking
                </button>
                <button 
                    className={`nav-item ${activeTab === 'Estatísticas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Estatísticas')}
                >
                    <BarChart2 size={20} /> Estatísticas
                </button>
                <button 
                    className={`nav-item ${activeTab === 'Configurações' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Configurações')}
                >
                    <Settings size={20} /> Configurações
                </button>
            </nav>

            <div className="sidebar-streak">
                <div className="streak-header">
                    <Flame size={24} color="#f97316" className="streak-icon" />
                    <div>
                        <div className="streak-title">Sequência atual</div>
                        <div className="streak-days">7 dias</div>
                    </div>
                </div>
                <div className="streak-calendar">
                    {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => (
                        <div key={idx} className="streak-day">
                            <span className="day-label">{day}</span>
                            <CheckCircle2 size={16} color="#3b82f6" fill="rgba(59, 130, 246, 0.2)" />
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default StudentSidebar;
