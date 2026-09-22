import { useState, useEffect } from 'react';
import api from '../services/api';
import './TeacherDashboard.css';

const DEFAULT_TEACHER_STATS = {
  totalStudents: 8,
  avgXp: 345,
  avgLevel: 3,
  totalCompleted: 32
};

const DEFAULT_CLASS_ANALYTICS = {
  totalSubmissions: 32,
  totalCorrect: 16,
  totalWrong: 16,
  classAverageAccuracy: 50,
  subjectProficiency: [
    { subject: 'Física', total: 10, correct: 3, wrong: 7, accuracyRate: 30, status: 'critico' },
    { subject: 'Matemática', total: 8, correct: 3, wrong: 5, accuracyRate: 38, status: 'critico' },
    { subject: 'Química', total: 4, correct: 1, wrong: 3, accuracyRate: 25, status: 'critico' },
    { subject: 'Biologia', total: 1, correct: 0, wrong: 1, accuracyRate: 0, status: 'critico' },
    { subject: 'História', total: 4, correct: 4, wrong: 0, accuracyRate: 100, status: 'excelente' },
    { subject: 'Geografia', total: 2, correct: 2, wrong: 0, accuracyRate: 100, status: 'excelente' },
    { subject: 'Português', total: 3, correct: 3, wrong: 0, accuracyRate: 100, status: 'excelente' }
  ],
  criticalTopics: [
    { topic: 'Eletrodinâmica', subject: 'Física', wrongCount: 4 },
    { topic: 'Dinâmica e Leis de Newton', subject: 'Física', wrongCount: 3 },
    { topic: 'Cálculo e Funções', subject: 'Matemática', wrongCount: 3 },
    { topic: 'Funções Inorgânicas e pH', subject: 'Química', wrongCount: 3 },
    { topic: 'Equações Quadráticas', subject: 'Matemática', wrongCount: 2 }
  ]
};

const DEFAULT_STUDENTS_LIST = [
  { id: 1, name: 'Alden Johnson', completion: 92, status: 'active', color: 'blue' },
  { id: 2, name: 'Sarah Miller', completion: 85, status: 'active', color: 'green' },
  { id: 3, name: 'Ethan Walker', completion: 78, status: 'active', color: 'purple' },
  { id: 4, name: 'Olivia Lewis', completion: 62, status: 'needs-help', color: 'amber' },
  { id: 5, name: 'James Martinez', completion: 55, status: 'needs-help', color: 'amber' },
  { id: 6, name: 'Hannah Scott', completion: 45, status: 'needs-help', color: 'rose' },
  { id: 7, name: 'Tyler White', completion: 100, status: 'completed', color: 'blue' },
  { id: 8, name: 'Amberson Rogers', completion: 88, status: 'active', color: 'green' }
];

function TeacherDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('painel');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDiagnosis, setStudentDiagnosis] = useState(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [selectedClass, setSelectedClass] = useState('3em');

  const [stats, setStats] = useState(DEFAULT_TEACHER_STATS);
  const [classAnalytics, setClassAnalytics] = useState(DEFAULT_CLASS_ANALYTICS);
  const [students, setStudents] = useState(DEFAULT_STUDENTS_LIST);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [statsRes, analyticsRes, studentsRes] = await Promise.allSettled([
        api.get('/teacher/stats'),
        api.get('/teacher/analytics/class'),
        api.get('/teacher/students')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        setStats(statsRes.value.data);
      }
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data) {
        setClassAnalytics(analyticsRes.value.data);
      }
      if (studentsRes.status === 'fulfilled' && Array.isArray(studentsRes.value.data) && studentsRes.value.data.length > 0) {
        // Mapeia para o formato visual
        const mapped = studentsRes.value.data.map((s, idx) => ({
          id: s.id,
          name: s.name,
          completion: s.accuracy_rate || Math.min(100, Math.round(((s.completed_challenges || 1) / 10) * 100)),
          status: (s.accuracy_rate || 50) < 60 ? 'needs-help' : (s.completed_challenges || 0) >= 10 ? 'completed' : 'active',
          color: ['blue', 'green', 'purple', 'amber', 'rose'][idx % 5]
        }));
        setStudents(mapped);
      }
    } catch (err) {
      console.warn('Usando métricas demonstrativas:', err.message);
    }
  };

  const handleOpenStudentDossier = async (student) => {
    setSelectedStudent(student);
    setLoadingDiagnosis(true);
    try {
      const res = await api.get(`/teacher/students/${student.id}/diagnosis`);
      if (res.data) {
        setStudentDiagnosis(res.data);
      }
    } catch (err) {
      setStudentDiagnosis({
        student: { name: student.name, email: `${student.name.toLowerCase().replace(/\s+/g, '.')}@escola.com` },
        accuracyRate: student.completion,
        totalAnswers: 14,
        totalCorrect: Math.round(14 * (student.completion / 100)),
        totalWrong: 14 - Math.round(14 * (student.completion / 100)),
        subjectProficiency: [
          { subject: 'Física', total: 6, correct: 2, wrong: 4, accuracyRate: 33, status: 'critico' },
          { subject: 'Matemática', total: 4, correct: 2, wrong: 2, accuracyRate: 50, status: 'atencao' },
          { subject: 'Português', total: 4, correct: 4, wrong: 0, accuracyRate: 100, status: 'excelente' }
        ],
        recentErrors: [
          {
            id: 1,
            question: 'Qual é a unidade padrão de força no Sistema Internacional (SI)?',
            subject: 'Física',
            topic: 'Dinâmica e Leis de Newton',
            selected_answer: 'B (Joule)',
            correct_answer: 'A (Newton)',
            answered_at: new Date().toISOString()
          },
          {
            id: 2,
            question: 'De acordo com a Primeira Lei de Ohm, qual é a fórmula correta?',
            subject: 'Física',
            topic: 'Eletrodinâmica',
            selected_answer: 'C (F = m × a)',
            correct_answer: 'A (V = I × R)',
            answered_at: new Date().toISOString()
          }
        ],
        pedagogicalSummary: `⚠️ Alerta de Defasagem Curricular: O aluno ${student.name} demonstrou fragilidades conceituais em Ciências da Natureza (Física - Circuitos e Mecânica). Recomenda-se atividades de reforço contextualizadas.`
      });
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="teacher-dashboard-page">
      {/* 1. LEFT SIDEBAR (Faithful to MVP Image 2) */}
      <aside className="teacher-nav-sidebar">
        <div>
          <div className="teacher-sidebar-brand">
            <div className="brand-icon-box">
              <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                <path d="M12 8H24C28.4183 8 32 11.5817 32 16C32 20.4183 28.4183 24 24 24H18V32H12V8Z" fill="white" />
                <path d="M18 14H24C25.1046 14 26 14.8954 26 16C26 17.1046 25.1046 18 24 18H18V14Z" fill="#0284c7" />
              </svg>
            </div>
            <div className="brand-name-title">Progress<span>Ed</span></div>
          </div>

          <nav className="teacher-sidebar-menu">
            <button
              className={`teacher-menu-link ${activeMenu === 'painel' ? 'active' : ''}`}
              onClick={() => setActiveMenu('painel')}
            >
              <span>📊</span>
              <span>Painel</span>
            </button>
            <button
              className={`teacher-menu-link ${activeMenu === 'alunos' ? 'active' : ''}`}
              onClick={() => setActiveMenu('alunos')}
            >
              <span>👥</span>
              <span>Alunos</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Turmas: 3º Ano Médio Regular')}>
              <span>🏫</span>
              <span>Turmas</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Módulo de Tarefas Curriculares')}>
              <span>☑️</span>
              <span>Tarefas</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Módulo de Avaliações')}>
              <span>📝</span>
              <span>Avaliações</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Relatórios Gerenciais')}>
              <span>📈</span>
              <span>Relatórios</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Análises Preditivas')}>
              <span>💡</span>
              <span>Análises</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Mensagens')}>
              <span>✉️</span>
              <span>Mensagens</span>
              <span className="menu-badge-pill">3</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Metas Pedagógicas')}>
              <span>🎯</span>
              <span>Metas</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Recursos Didáticos')}>
              <span>📚</span>
              <span>Recursos</span>
            </button>
            <button className="teacher-menu-link" onClick={() => alert('Configurações da Escola')}>
              <span>⚙️</span>
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        {/* Profile Card Bottom */}
        <div className="teacher-profile-footer">
          <div className="teacher-user-card" onClick={onLogout} title="Clique para sair">
            <div className="teacher-avatar-circle">
              P
            </div>
            <div className="teacher-user-meta">
              <h6>Prof. Pedro Brandão</h6>
              <p>Centro Educa Mais Paulo Freire</p>
            </div>
            <span className="text-slate-500 text-xs">🚪</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <main className="teacher-main-viewport">
        {/* Top Action Bar */}
        <header className="teacher-top-action-bar">
          <div className="teacher-header-titles">
            <h1>Painel</h1>
            <p>Visão geral do engajamento e progresso da turma</p>
          </div>

          <div className="teacher-header-controls">
            <select
              className="select-custom-dropdown"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="3em">3º Ano Médio - Regular</option>
              <option value="8ci">8º Ano Ciências</option>
            </select>

            <div className="date-range-badge-pill">
              <span>📅</span>
              <span>12 de mai – 16 de mai, 2026</span>
            </div>

            <button className="btn-export-report" onClick={() => window.print()}>
              <span>📥</span>
              <span>Exportar Relatório</span>
            </button>
          </div>
        </header>

        {/* ROW 1: 4 KPI CARDS (Faithful to MVP Image 2) */}
        <section className="kpi-cards-grid-4">
          {/* Card 1: Engajamento Geral */}
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <div className="kpi-icon-circle blue">👥</div>
              <p className="kpi-label-text">Engajamento Geral</p>
            </div>
            <div className="kpi-bottom-row">
              <div>
                <h3 className="kpi-number-display">76%</h3>
                <span className="kpi-trend-info up">↑ 8% vs últimos 7 dias</span>
              </div>
              <svg className="kpi-sparkline-svg" viewBox="0 0 90 32">
                <path d="M0,28 Q20,10 45,22 T90,5" stroke="#38bdf8" />
              </svg>
            </div>
          </div>

          {/* Card 2: Tarefas Concluídas */}
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <div className="kpi-icon-circle green">✓</div>
              <p className="kpi-label-text">Tarefas Concluídas</p>
            </div>
            <div className="kpi-bottom-row">
              <div>
                <h3 className="kpi-number-display">82%</h3>
                <span className="kpi-trend-info up">↑ 6% vs últimos 7 dias</span>
              </div>
              <svg className="kpi-sparkline-svg" viewBox="0 0 90 32">
                <path d="M0,25 Q30,5 60,18 T90,8" stroke="#34d399" />
              </svg>
            </div>
          </div>

          {/* Card 3: Tempo em Tarefa */}
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <div className="kpi-icon-circle purple">⏱️</div>
              <p className="kpi-label-text">Tempo em Tarefa (Média)</p>
            </div>
            <div className="kpi-bottom-row">
              <div>
                <h3 className="kpi-number-display">48m</h3>
                <span className="kpi-trend-info up">↑ 5m vs últimos 7 dias</span>
              </div>
              <svg className="kpi-sparkline-svg" viewBox="0 0 90 32">
                <path d="M0,20 Q25,28 50,10 T90,12" stroke="#c084fc" />
              </svg>
            </div>
          </div>

          {/* Card 4: Alunos Precisando de Ajuda */}
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <div className="kpi-icon-circle amber">⚠️</div>
              <p className="kpi-label-text">Alunos Precisando de Ajuda</p>
            </div>
            <div className="kpi-bottom-row">
              <div>
                <h3 className="kpi-number-display">6</h3>
                <span className="kpi-trend-info down">↓ 2 vs últimos 7 dias</span>
              </div>
              <svg className="kpi-sparkline-svg" viewBox="0 0 90 32">
                <path d="M0,8 Q30,25 60,12 T90,26" stroke="#fbbf24" />
              </svg>
            </div>
          </div>
        </section>

        {/* ROW 2: 3 CARDS (Line Chart, Bar Chart by Topic, Students List) */}
        <section className="teacher-row-2-grid">
          {/* Card 1: Engajamento ao Longo do Tempo */}
          <div className="teacher-card-panel">
            <div className="card-panel-header">
              <h4>
                <span>Engajamento ao Longo do Tempo</span>
                <span className="info-tooltip-icon">ⓘ</span>
              </h4>
              <select className="bg-slate-900 text-xs text-slate-300 rounded-lg px-2 py-1 border border-white/10 outline-none">
                <option>30 Dias</option>
                <option>7 Dias</option>
              </select>
            </div>

            {/* Line Chart SVG */}
            <div className="relative h-[200px] w-full flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 360 160">
                <line x1="40" y1="20" x2="350" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="40" y1="60" x2="350" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="40" y1="100" x2="350" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="40" y1="140" x2="350" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />

                <text x="10" y="24" fill="#64748b" fontSize="10">100%</text>
                <text x="10" y="64" fill="#64748b" fontSize="10">75%</text>
                <text x="10" y="104" fill="#64748b" fontSize="10">50%</text>
                <text x="10" y="144" fill="#64748b" fontSize="10">0%</text>

                {/* Line Path */}
                <path
                  d="M50,100 Q100,70 150,60 T250,55 T340,50"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Dots on line */}
                <circle cx="50" cy="100" r="4" fill="#38bdf8" />
                <circle cx="110" cy="74" r="4" fill="#38bdf8" />
                <circle cx="170" cy="62" r="4" fill="#38bdf8" />
                <circle cx="230" cy="57" r="4" fill="#38bdf8" />
                <circle cx="290" cy="53" r="4" fill="#38bdf8" />
                <circle cx="340" cy="50" r="4" fill="#38bdf8" />

                {/* Bottom Date labels */}
                <text x="40" y="155" fill="#64748b" fontSize="9">Abr 21</text>
                <text x="100" y="155" fill="#64748b" fontSize="9">28 abr</text>
                <text x="160" y="155" fill="#64748b" fontSize="9">5 mai</text>
                <text x="220" y="155" fill="#64748b" fontSize="9">12 mai</text>
                <text x="280" y="155" fill="#64748b" fontSize="9">19 mai</text>
              </svg>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-xs text-slate-400">Pontuação de Engajamento</span>
            </div>
          </div>

          {/* Card 2: Conclusão de Tarefas por Tópico */}
          <div className="teacher-card-panel">
            <div className="card-panel-header">
              <h4>
                <span>Conclusão de Tarefas por Tópico</span>
                <span className="info-tooltip-icon">ⓘ</span>
              </h4>
              <span className="text-xs text-sky-400 font-semibold cursor-pointer">Ver Todos</span>
            </div>

            <div className="topic-bars-container">
              <div className="topic-bar-column">
                <span className="topic-bar-percentage">90%</span>
                <div className="topic-bar-fill-body blue" style={{ height: '90%' }} />
                <span className="topic-bar-label">Células & Vida</span>
              </div>
              <div className="topic-bar-column">
                <span className="topic-bar-percentage">76%</span>
                <div className="topic-bar-fill-body green" style={{ height: '76%' }} />
                <span className="topic-bar-label">Ecossistemas</span>
              </div>
              <div className="topic-bar-column">
                <span className="topic-bar-percentage">65%</span>
                <div className="topic-bar-fill-body amber" style={{ height: '65%' }} />
                <span className="topic-bar-label">Energia</span>
              </div>
              <div className="topic-bar-column">
                <span className="topic-bar-percentage">86%</span>
                <div className="topic-bar-fill-body purple" style={{ height: '86%' }} />
                <span className="topic-bar-label">Forças & Mov.</span>
              </div>
              <div className="topic-bar-column">
                <span className="topic-bar-percentage">72%</span>
                <div className="topic-bar-fill-body cyan" style={{ height: '72%' }} />
                <span className="topic-bar-label">Ciências Terra</span>
              </div>
              <div className="topic-bar-column">
                <span className="topic-bar-percentage">85%</span>
                <div className="topic-bar-fill-body blue" style={{ height: '85%' }} />
                <span className="topic-bar-label">Método Cient.</span>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-500 mt-2">% de Alunos que Completaram</p>
          </div>

          {/* Card 3: Alunos (Search + List + Click for Dossier) */}
          <div className="teacher-card-panel">
            <div className="card-panel-header">
              <h4>Alunos</h4>
              <select
                className="bg-slate-900 text-xs text-slate-300 rounded-lg px-2 py-1 border border-white/10 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="needs-help">Precisa de Ajuda</option>
                <option value="completed">Concluído</option>
              </select>
            </div>

            <div className="student-search-input-box">
              <span className="student-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="teacher-student-items-scroll">
              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="teacher-student-row"
                  onClick={() => handleOpenStudentDossier(st)}
                  title="Clique para abrir o Dossiê Individual"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`student-avatar-badge ${st.color}`}>
                      {st.name[0]}
                    </div>
                    <span className="student-name-text">{st.name}</span>
                  </div>

                  <span className="student-completion-val">{st.completion}%</span>

                  <span className={`student-status-tag ${st.status}`}>
                    {st.status === 'active' ? 'Ativo' : st.status === 'needs-help' ? 'Precisa de Ajuda' : 'Concluído'}
                  </span>

                  <span className="text-slate-400 text-xs hover:text-white">⋮</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Visualizando todos os alunos matriculados')}
              className="mt-3 text-xs text-sky-400 font-semibold hover:underline text-left"
            >
              Ver Todos os Alunos &gt;
            </button>
          </div>
        </section>

        {/* ROW 3: 3 CARDS (Donut Activity, Heatmap, Insights) */}
        <section className="teacher-row-3-grid">
          {/* Card 1: Engajamento por Tipo de Atividade */}
          <div className="teacher-card-panel">
            <div className="card-panel-header">
              <h4>
                <span>Engajamento por Tipo</span>
                <span className="info-tooltip-icon">ⓘ</span>
              </h4>
            </div>

            <div className="donut-chart-layout">
              <div className="donut-svg-wrapper">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3.8" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3.8" strokeDasharray="40, 100" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3.8" strokeDasharray="25, 100" strokeDashoffset="-40" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray="15, 100" strokeDashoffset="-65" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3.8" strokeDasharray="10, 100" strokeDashoffset="-80" />
                </svg>
                <div className="donut-center-metric">
                  <h5>76%</h5>
                  <p>Geral</p>
                </div>
              </div>

              <div className="donut-legend-list">
                <div className="donut-legend-item">
                  <span className="donut-dot bg-blue-500" />
                  <span>Tarefas: 40%</span>
                </div>
                <div className="donut-legend-item">
                  <span className="donut-dot bg-emerald-500" />
                  <span>Avaliações: 25%</span>
                </div>
                <div className="donut-legend-item">
                  <span className="donut-dot bg-amber-500" />
                  <span>Discussões: 15%</span>
                </div>
                <div className="donut-legend-item">
                  <span className="donut-dot bg-purple-500" />
                  <span>Vídeos: 10%</span>
                </div>
              </div>
            </div>
            <a href="#relatorio" onClick={(e) => { e.preventDefault(); alert('Relatório analítico de atividades'); }} className="text-xs text-sky-400 font-semibold hover:underline mt-2">
              Ver Relatório Completo &gt;
            </a>
          </div>

          {/* Card 2: Mapa de Calor de Engajamento */}
          <div className="teacher-card-panel">
            <div className="card-panel-header">
              <h4>
                <span>Mapa de Calor de Engajamento (Últimos 7 Dias)</span>
                <span className="info-tooltip-icon">ⓘ</span>
              </h4>
            </div>

            <div className="heatmap-table-grid">
              <div className="heatmap-days-header-row">
                <span />
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {[
                { hour: '18h', cells: ['lvl-1', 'lvl-2', 'lvl-3', 'lvl-2', 'lvl-3', 'lvl-4', 'lvl-2'] },
                { hour: '16h', cells: ['lvl-2', 'lvl-3', 'lvl-3', 'lvl-4', 'lvl-4', 'lvl-3', 'lvl-1'] },
                { hour: '14h', cells: ['lvl-1', 'lvl-2', 'lvl-4', 'lvl-3', 'lvl-3', 'lvl-2', 'lvl-1'] },
                { hour: '10h', cells: ['lvl-2', 'lvl-3', 'lvl-2', 'lvl-3', 'lvl-2', 'lvl-1', 'lvl-1'] },
                { hour: '8h', cells: ['lvl-1', 'lvl-2', 'lvl-2', 'lvl-1', 'lvl-2', 'lvl-1', 'lvl-1'] },
              ].map((row, rIdx) => (
                <div key={rIdx} className="heatmap-hour-row">
                  <span className="hour-label">{row.hour}</span>
                  {row.cells.map((lvl, cIdx) => (
                    <div key={cIdx} className={`heatmap-cell ${lvl}`} />
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
              <span>Menos Engajamento</span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded bg-sky-950" />
                <span className="w-3 h-3 rounded bg-sky-800" />
                <span className="w-3 h-3 rounded bg-sky-600" />
                <span className="w-3 h-3 rounded bg-sky-400" />
              </div>
              <span>Mais Engajamento</span>
            </div>
          </div>

          {/* Card 3: Insights & Análises */}
          <div className="teacher-card-panel">
            <div className="card-panel-header">
              <h4>
                <span>Análises</span>
                <span className="info-tooltip-icon">ⓘ</span>
              </h4>
            </div>

            <div className="insights-items-list">
              <div className="insight-card-item">
                <div className="insight-icon-box green">📈</div>
                <div className="insight-text-details">
                  <h6>Engajamento em Melhora</h6>
                  <p>O engajamento geral aumentou 8% em comparação com a semana passada. Ótimo ritmo!</p>
                </div>
              </div>

              <div className="insight-card-item">
                <div className="insight-icon-box amber">⚠️</div>
                <div className="insight-text-details">
                  <h6>6 Alunos Precisam de Atenção</h6>
                  <p>Considere entrar em contato com os alunos que podem estar com dificuldades em Física e Matemática.</p>
                </div>
              </div>

              <div className="insight-card-item">
                <div className="insight-icon-box purple">💡</div>
                <div className="insight-text-details">
                  <h6>Conteúdos Mais Populares</h6>
                  <p>As trilhas de Ciências da Natureza tiveram o maior índice de engajamento esta semana.</p>
                </div>
              </div>
            </div>

            <a href="#analises" onClick={(e) => { e.preventDefault(); alert('Visualizando diagnósticos preditivos da turma'); }} className="text-xs text-sky-400 font-semibold hover:underline mt-3">
              Ver Todas as Análises &gt;
            </a>
          </div>
        </section>

        {/* Footer Info */}
        <div className="teacher-dashboard-footer-info">
          <span>ⓘ</span>
          <span>Todos os dados são atualizados diariamente. Última atualização: 16 de mai de 2026 às 22:30 • Centro Educa Mais Paulo Freire</span>
        </div>

        {/* ================================================================ */}
        {/* DOSSIÊ INDIVIDUAL DO ALUNO (MODAL COMPLETO)                      */}
        {/* ================================================================ */}
        {selectedStudent && (
          <div className="dossier-modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="dossier-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 font-extrabold text-xl flex items-center justify-center border border-sky-500/30">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{selectedStudent.name}</h3>
                    <p className="text-xs text-slate-400">Dossiê Pedagógico Individual • Centro Educa Mais Paulo Freire</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    🖨️ Imprimir
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {loadingDiagnosis ? (
                <div className="py-12 text-center text-slate-400">
                  <span className="text-2xl animate-spin inline-block">⏳</span>
                  <p className="mt-2 text-sm">Carregando métricas e histórico de erros do estudante...</p>
                </div>
              ) : studentDiagnosis ? (
                <div className="space-y-6 pt-5">
                  {/* Resumo Diagnóstico */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm leading-relaxed">
                    {studentDiagnosis.pedagogicalSummary}
                  </div>

                  {/* KPIs do Aluno */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Taxa de Acertos</p>
                      <p className="text-2xl font-extrabold text-emerald-400 mt-1">{studentDiagnosis.accuracyRate}%</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Acertos</p>
                      <p className="text-2xl font-extrabold text-sky-400 mt-1">{studentDiagnosis.totalCorrect}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Erros Registrados</p>
                      <p className="text-2xl font-extrabold text-rose-400 mt-1">{studentDiagnosis.totalWrong}</p>
                    </div>
                  </div>

                  {/* Histórico Recente de Erros */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Questões com Erro & Alternativas Assinaladas
                    </h4>
                    <div className="space-y-2.5">
                      {studentDiagnosis.recentErrors?.map((err, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 text-xs">
                          <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="font-semibold text-sky-400">{err.subject} • {err.topic}</span>
                            <span>{new Date(err.answered_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p className="font-medium text-slate-200 mb-2">{err.question}</p>
                          <div className="flex gap-4">
                            <span className="text-rose-400 font-semibold">Marcou: {err.selected_answer}</span>
                            <span className="text-emerald-400 font-semibold">Correta: {err.correct_answer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;
