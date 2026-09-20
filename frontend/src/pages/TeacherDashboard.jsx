import { useState, useEffect } from 'react';
import api from '../services/api';

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

const DEFAULT_STUDENTS = [
    { id: 1, name: 'Amberson Rogers', email: 'aluno@progressed.com', xp: 420, level: 4, completed_challenges: 7, total_answers: 12, accuracy_rate: 58 },
    { id: 6, name: 'Kelly Lorrany', email: 'kelly@escola.com', xp: 520, level: 5, completed_challenges: 5, total_answers: 5, accuracy_rate: 100 },
    { id: 7, name: 'Weldes Reis', email: 'weldes@escola.com', xp: 380, level: 4, completed_challenges: 6, total_answers: 9, accuracy_rate: 67 },
    { id: 4, name: 'Maria Santos', email: 'maria@test.com', xp: 310, level: 3, completed_challenges: 3, total_answers: 4, accuracy_rate: 75 },
    { id: 3, name: 'João Silva', email: 'joao@test.com', xp: 280, level: 3, completed_challenges: 3, total_answers: 6, accuracy_rate: 50 },
    { id: 8, name: 'Ana Beatriz Sousa', email: 'ana.beatriz@escola.com', xp: 260, level: 3, completed_challenges: 3, total_answers: 5, accuracy_rate: 60 },
    { id: 5, name: 'Pedro Costa', email: 'pedro@test.com', xp: 150, level: 2, completed_challenges: 1, total_answers: 5, accuracy_rate: 20 }
];

function TeacherDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'students'
    const [students, setStudents] = useState(DEFAULT_STUDENTS);
    const [stats, setStats] = useState(DEFAULT_TEACHER_STATS);
    const [classAnalytics, setClassAnalytics] = useState(DEFAULT_CLASS_ANALYTICS);
    const [loading, setLoading] = useState(true);

    // Dossiê do aluno selecionado
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [studentDiagnosis, setStudentDiagnosis] = useState(null);
    const [diagnosisLoading, setDiagnosisLoading] = useState(false);

    // Filtro e busca
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [statsRes, studentsRes, analyticsRes] = await Promise.allSettled([
                api.get('/teacher/stats'),
                api.get('/teacher/students'),
                api.get('/teacher/analytics/class')
            ]);

            if (statsRes.status === 'fulfilled' && statsRes.value.data) {
                setStats(statsRes.value.data);
            }
            if (studentsRes.status === 'fulfilled' && Array.isArray(studentsRes.value.data) && studentsRes.value.data.length > 0) {
                setStudents(studentsRes.value.data);
            }
            if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data) {
                setClassAnalytics(analyticsRes.value.data);
            }
        } catch (error) {
            console.warn('Usando dados diagnósticos demonstrativos:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDiagnosis = async (studentId) => {
        setSelectedStudentId(studentId);
        setDiagnosisLoading(true);
        try {
            const res = await api.get(`/teacher/students/${studentId}/diagnosis`);
            if (res.data) {
                setStudentDiagnosis(res.data);
            }
        } catch (err) {
            // Fallback para diagnóstico offline
            const student = students.find(s => Number(s.id) === Number(studentId));
            setStudentDiagnosis({
                student: student || { name: 'Aluno', email: '' },
                totalAnswers: student?.total_answers || 10,
                totalCorrect: student?.completed_challenges || 6,
                totalWrong: (student?.total_answers || 10) - (student?.completed_challenges || 6),
                accuracyRate: student?.accuracy_rate || 60,
                subjectProficiency: [
                    { subject: 'Física', total: 4, correct: 1, wrong: 3, accuracyRate: 25, status: 'critico' },
                    { subject: 'Matemática', total: 4, correct: 2, wrong: 2, accuracyRate: 50, status: 'atencao' },
                    { subject: 'Português', total: 3, correct: 3, wrong: 0, accuracyRate: 100, status: 'excelente' },
                    { subject: 'História', total: 2, correct: 2, wrong: 0, accuracyRate: 100, status: 'excelente' }
                ],
                recentErrors: [
                    {
                        id: 1,
                        question: 'Qual é a unidade de força no SI?',
                        subject: 'Física',
                        topic: 'Dinâmica e Leis de Newton',
                        selected_answer: 'B (Joule)',
                        correct_answer: 'A (Newton)',
                        answered_at: new Date().toISOString()
                    },
                    {
                        id: 2,
                        question: 'Qual é a lei de Ohm?',
                        subject: 'Física',
                        topic: 'Eletrodinâmica',
                        selected_answer: 'C (F = m × a)',
                        correct_answer: 'A (V = I × R)',
                        answered_at: new Date().toISOString()
                    }
                ],
                pedagogicalSummary: `⚠️ Alerta de Defasagem: O estudante apresenta maior índice de erros em Ciências da Natureza (Física). Recomenda-se acompanhamento focado na aplicação das Leis de Newton e circuitos elétricos básicos. Mantém ótimo desempenho em Linguagens e Humanas.`
            });
        } finally {
            setDiagnosisLoading(false);
        }
    };

    const handlePrintDiagnosis = () => {
        window.print();
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                
                {/* Header do Professor */}
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-glow backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-2xl shadow-lg">
                            👨‍🏫
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-[0.3em] text-violet-300 font-bold">Painel de Avaliação & Diagnóstico Docente</span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Prof. {user?.name || 'Pedro Brandão'}</h1>
                            <p className="text-xs sm:text-sm text-slate-400">Centro Educa Mais Paulo Freire • Acompanhamento da Aprendizagem BNCC</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadAllData}
                            className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                            title="Recarregar Métricas"
                        >
                            🔄 Atualizar Dados
                        </button>
                        <button
                            onClick={onLogout}
                            className="rounded-xl bg-rose-900/60 border border-rose-500/30 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-200 hover:bg-rose-800 transition"
                        >
                            Sair
                        </button>
                    </div>
                </header>

                {/* Cards de Métricas Gerais da Turma */}
                <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs sm:text-sm font-semibold">Total de Alunos</span>
                            <span className="text-xl">👥</span>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-white">{stats.totalStudents || students.length}</p>
                        <p className="mt-1 text-xs text-slate-500">Matriculados na turma</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs sm:text-sm font-semibold">Média de Aproveitamento</span>
                            <span className="text-xl">🎯</span>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-emerald-400">{classAnalytics.classAverageAccuracy}%</p>
                        <p className="mt-1 text-xs text-slate-500">Taxa média de acertos</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs sm:text-sm font-semibold">Média de XP por Aluno</span>
                            <span className="text-xl">⭐</span>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-amber-400">{stats.avgXp || 350}</p>
                        <p className="mt-1 text-xs text-slate-500">Engajamento gamificado</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs sm:text-sm font-semibold">Questões Submetidas</span>
                            <span className="text-xl">📝</span>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-violet-400">{classAnalytics.totalSubmissions || stats.totalCompleted || 32}</p>
                        <p className="mt-1 text-xs text-slate-500">Respostas avaliadas</p>
                    </div>
                </div>

                {/* Seletor de Abas */}
                <div className="mb-6 flex gap-3 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${
                            activeTab === 'analytics'
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                        }`}
                    >
                        <span>📊 Diagnóstico da Turma & Defasagens</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${
                            activeTab === 'students'
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                        }`}
                    >
                        <span>👥 Acompanhamento Individual ({students.length} Alunos)</span>
                    </button>
                </div>

                {/* ============================================================== */}
                {/* ABA 1: DIAGNÓSTICO DA TURMA & MAPA DE DEFASAGENS               */}
                {/* ============================================================== */}
                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        {/* Seção Gráfica: Proficiência por Disciplina */}
                        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-xl">
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white">Mapa de Proficiência por Disciplina</h2>
                                    <p className="text-xs sm:text-sm text-slate-400">Identificação das áreas com maior índice de acertos e defasagens críticas da turma.</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-semibold">
                                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-rose-500 inline-block" /> Crítico (&lt;50%)</span>
                                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-amber-500 inline-block" /> Atenção (50-70%)</span>
                                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" /> Bom (&gt;70%)</span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {classAnalytics.subjectProficiency.map((item) => {
                                    const isCrit = item.status === 'critico';
                                    const isAtt = item.status === 'atencao';
                                    const colorBar = isCrit ? 'from-rose-600 to-red-500' : isAtt ? 'from-amber-600 to-yellow-500' : 'from-emerald-500 to-teal-500';
                                    const badgeBg = isCrit ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : isAtt ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                                    const labelStatus = isCrit ? 'Defasagem Crítica' : isAtt ? 'Requer Atenção' : 'Excelente Domínio';

                                    return (
                                        <div key={item.subject} className="rounded-2xl bg-slate-950/60 p-4 border border-white/5">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-white text-base">{item.subject}</span>
                                                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badgeBg}`}>
                                                        {labelStatus}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-extrabold text-lg text-white">{item.accuracyRate}%</span>
                                                    <span className="text-xs text-slate-400 ml-2">({item.correct} acertos / {item.total} respostas)</span>
                                                </div>
                                            </div>

                                            {/* Barra de Progresso Visual */}
                                            <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-800/90">
                                                <div
                                                    className={`h-3.5 rounded-full bg-gradient-to-r ${colorBar} transition-all duration-500`}
                                                    style={{ width: `${Math.max(5, item.accuracyRate)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Seção 2: Top Tópicos com Maior Índice de Erros */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/30 via-slate-900/90 to-slate-900/90 p-6 sm:p-8 shadow-xl">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="text-3xl">⚠️</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Tópicos com Maior Defasagem na Turma</h3>
                                        <p className="text-xs text-slate-400">Conceitos onde os estudantes mais cometeram erros nas atividades.</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-5">
                                    {classAnalytics.criticalTopics.map((top, idx) => (
                                        <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-950/70 p-3.5 border border-rose-500/20">
                                            <div>
                                                <p className="font-semibold text-white text-sm">{top.topic}</p>
                                                <span className="text-xs text-violet-400 font-medium">Disciplina: {top.subject}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
                                                    {top.wrongCount} erros registrados
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Diretrizes Pedagógicas para o Docente */}
                            <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 via-slate-900/90 to-slate-900/90 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <span className="text-3xl">💡</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Plano de Intervenção Pedagógica</h3>
                                            <p className="text-xs text-slate-400">Recomendações automatizadas com base no diagnóstico da BNCC.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3.5 text-sm text-slate-300 leading-relaxed mt-4">
                                        <p className="rounded-xl bg-slate-950/50 p-3.5 border border-white/5">
                                            📌 <strong>Física & Matemática:</strong> Recomenda-se realizar uma oficina de resolução comentada de exercícios focada em <em>Leis de Newton</em> e <em>Equações Quadráticas</em>, aproveitando o feedback imediato da plataforma.
                                        </p>
                                        <p className="rounded-xl bg-slate-950/50 p-3.5 border border-white/5">
                                            📌 <strong>Química:</strong> Propor atividade prática demonstrativa de funções inorgânicas e escala de pH para contextualizar os erros conceituais identificados.
                                        </p>
                                        <p className="rounded-xl bg-slate-950/50 p-3.5 border border-white/5">
                                            📌 <strong>Humanas e Linguagens:</strong> A turma demonstrou forte proficiência (&gt;80%). Sugere-se desafiar os alunos com questões interdisciplinares de nível difícil.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                                    <button
                                        onClick={() => setActiveTab('students')}
                                        className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-bold text-white transition shadow-md"
                                    >
                                        Ver Alunos Individualmente ➡️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* ABA 2: ACOMPANHAMENTO INDIVIDUAL DE ALUNOS                      */}
                {/* ============================================================== */}
                {activeTab === 'students' && (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-xl">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Alunos da Turma (Centro Educa Mais Paulo Freire)</h2>
                                <p className="text-xs sm:text-sm text-slate-400">Clique em "Avaliar Aluno" para inspecionar os erros exatos, disciplinas críticas e parecer individual.</p>
                            </div>

                            <input
                                type="text"
                                placeholder="🔍 Buscar aluno por nome ou e-mail..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-80 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                            />
                        </div>

                        {/* Tabela de Alunos */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-950/80 uppercase text-xs text-slate-400 border-b border-white/10">
                                    <tr>
                                        <th className="py-3.5 px-4">Estudante</th>
                                        <th className="py-3.5 px-4">Nível</th>
                                        <th className="py-3.5 px-4">XP Total</th>
                                        <th className="py-3.5 px-4">Taxa de Acerto</th>
                                        <th className="py-3.5 px-4">Desafios Feitos</th>
                                        <th className="py-3.5 px-4 text-center">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredStudents.map((s) => {
                                        const rate = s.accuracy_rate || 50;
                                        const rateBadge = rate < 50
                                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                            : rate <= 70
                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

                                        return (
                                            <tr key={s.id} className="hover:bg-slate-800/40 transition">
                                                <td className="py-4 px-4 font-semibold text-white">
                                                    <div>{s.name}</div>
                                                    <div className="text-xs text-slate-500 font-normal">{s.email}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-300 border border-violet-500/20">
                                                        Nível {s.level}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-bold text-amber-400">
                                                    ⭐ {s.xp} XP
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${rateBadge}`}>
                                                        {rate}%
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-slate-400">
                                                    {s.completed_challenges || 0} acertos / {s.total_answers || s.total_challenges || 10}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <button
                                                        onClick={() => handleOpenDiagnosis(s.id)}
                                                        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow transition"
                                                    >
                                                        🔍 Avaliar / Dossiê
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* MODAL / PAINEL: DOSSIÊ DIAGNÓSTICO INDIVIDUAL DO ALUNO         */}
                {/* ============================================================== */}
                {selectedStudentId && studentDiagnosis && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto backdrop-blur-sm">
                        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
                            
                            {/* Topo do Dossiê */}
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                                <div>
                                    <span className="text-xs uppercase tracking-[0.2em] text-violet-400 font-bold">Dossiê de Avaliação Diagnóstica Individual</span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{studentDiagnosis.student.name}</h3>
                                    <p className="text-xs sm:text-sm text-slate-400">{studentDiagnosis.student.email} • Nível {studentDiagnosis.student.level} • {studentDiagnosis.student.xp} XP</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrintDiagnosis}
                                        className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 transition"
                                    >
                                        🖨️ Imprimir Dossiê
                                    </button>
                                    <button
                                        onClick={() => { setSelectedStudentId(null); setStudentDiagnosis(null); }}
                                        className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs sm:text-sm font-bold text-white transition"
                                    >
                                        Fechar ✕
                                    </button>
                                </div>
                            </div>

                            {/* Resumo Geral de Acertos */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="rounded-2xl bg-slate-950 p-4 border border-white/5">
                                    <p className="text-xs text-slate-400">Total Respondidas</p>
                                    <p className="text-2xl font-bold text-white mt-1">{studentDiagnosis.totalAnswers}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-950 p-4 border border-white/5">
                                    <p className="text-xs text-slate-400">Acertos</p>
                                    <p className="text-2xl font-bold text-emerald-400 mt-1">{studentDiagnosis.totalCorrect}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-950 p-4 border border-white/5">
                                    <p className="text-xs text-slate-400">Erros Registrados</p>
                                    <p className="text-2xl font-bold text-rose-400 mt-1">{studentDiagnosis.totalWrong}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-950 p-4 border border-white/5">
                                    <p className="text-xs text-slate-400">Taxa de Acerto Global</p>
                                    <p className="text-2xl font-bold text-violet-400 mt-1">{studentDiagnosis.accuracyRate}%</p>
                                </div>
                            </div>

                            {/* Parecer Pedagógico Automático */}
                            <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-5">
                                <p className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-1">📋 Parecer Pedagógico Automatizado (Orientação ao Docente)</p>
                                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{studentDiagnosis.pedagogicalSummary}</p>
                            </div>

                            {/* Proficiência do Aluno por Disciplina */}
                            <div>
                                <h4 className="text-lg font-bold text-white mb-3">Proficiência Individual por Disciplina</h4>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {studentDiagnosis.subjectProficiency.map((sub) => {
                                        const isCrit = sub.status === 'critico';
                                        const isAtt = sub.status === 'atencao';
                                        const barColor = isCrit ? 'from-rose-600 to-red-500' : isAtt ? 'from-amber-600 to-yellow-500' : 'from-emerald-500 to-teal-500';
                                        return (
                                            <div key={sub.subject} className="rounded-xl bg-slate-950 p-3.5 border border-white/5">
                                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                                    <span className="text-white">{sub.subject}</span>
                                                    <span className={isCrit ? 'text-rose-400' : isAtt ? 'text-amber-400' : 'text-emerald-400'}>
                                                        {sub.accuracyRate}% ({sub.correct}/{sub.total})
                                                    </span>
                                                </div>
                                                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div className={`h-2.5 rounded-full bg-gradient-to-r ${barColor}`} style={{ width: `${Math.max(5, sub.accuracyRate)}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Detalhamento das Questões que o Aluno Errou */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-lg font-bold text-white">Questões com Erros Registrados ({studentDiagnosis.recentErrors.length})</h4>
                                    <span className="text-xs text-rose-400 font-semibold">Oportunidades de Reforço e Intervenção</span>
                                </div>

                                {studentDiagnosis.recentErrors.length === 0 ? (
                                    <p className="rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-4 text-sm text-emerald-300">
                                        🎉 Excelente! O estudante não possui registros de erros recentes.
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {studentDiagnosis.recentErrors.map((err, i) => (
                                            <div key={i} className="rounded-2xl bg-slate-950/90 p-4 border border-rose-500/20 space-y-2">
                                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                                    <span className="font-bold text-violet-300">{err.subject} • {err.topic || 'Conceito Curricular'}</span>
                                                    <span className="text-slate-500">{new Date(err.answered_at).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <p className="text-sm font-semibold text-white">{err.question}</p>
                                                <div className="flex flex-wrap gap-4 text-xs pt-1 border-t border-white/5">
                                                    <span className="text-rose-400 font-semibold">❌ Resposta Marcada pelo Aluno: {err.selected_answer}</span>
                                                    <span className="text-emerald-400 font-semibold">✅ Alternativa Correta: {err.correct_answer}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default TeacherDashboard;
