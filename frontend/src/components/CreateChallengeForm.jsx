import { useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Shuffle, BookOpen, Library } from 'lucide-react';
import { getSubjects, filterQuestions, getRandomChallenge } from '../services/questionBank';
import './CreateChallengeForm.css';

const ALL_SUBJECTS = getSubjects();

function CreateChallengeForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [challengeMode, setChallengeMode] = useState('single'); // 'single', 'multi', 'random'
    const [subject, setSubject] = useState('Informática');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [level, setLevel] = useState('Fundamental');
    const [difficulty, setDifficulty] = useState('Iniciante');
    const [points, setPoints] = useState(100);
    const [questions, setQuestions] = useState([
        {
            id: Date.now(),
            text: '',
            options: [
                { id: 1, text: '', isCorrect: true },
                { id: 2, text: '', isCorrect: false }
            ]
        }
    ]);
    const [successMsg, setSuccessMsg] = useState('');

    const toggleSubject = (subj) => {
        setSelectedSubjects(prev =>
            prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
        );
    };

    const importFromBank = () => {
        let bankQuestions;
        if (challengeMode === 'random') {
            bankQuestions = getRandomChallenge(5, level);
        } else if (challengeMode === 'multi') {
            bankQuestions = filterQuestions({ subjects: selectedSubjects, level, difficulty, count: 5 });
        } else {
            bankQuestions = filterQuestions({ subjects: [subject], level, difficulty, count: 5 });
        }

        if (bankQuestions.length === 0) {
            setSuccessMsg('Nenhuma questão encontrada para os filtros selecionados.');
            setTimeout(() => setSuccessMsg(''), 3000);
            return;
        }

        const converted = bankQuestions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options.map((opt, i) => ({
                id: i + 1,
                text: opt.text,
                isCorrect: opt.letter === q.correctAnswer
            }))
        }));
        setQuestions(converted);
        setSuccessMsg(`${converted.length} questões importadas do banco!`);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                text: '',
                options: [
                    { id: 1, text: '', isCorrect: true },
                    { id: 2, text: '', isCorrect: false }
                ]
            }
        ]);
    };

    const removeQuestion = (qId) => {
        setQuestions(questions.filter(q => q.id !== qId));
    };

    const addOption = (qId) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const newOptionId = q.options.length > 0 ? Math.max(...q.options.map(o => o.id)) + 1 : 1;
                return {
                    ...q,
                    options: [...q.options, { id: newOptionId, text: '', isCorrect: false }]
                };
            }
            return q;
        }));
    };

    const removeOption = (qId, optId) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                return {
                    ...q,
                    options: q.options.filter(o => o.id !== optId)
                };
            }
            return q;
        }));
    };

    const updateQuestionText = (qId, text) => {
        setQuestions(questions.map(q => (q.id === qId ? { ...q, text } : q)));
    };

    const updateOptionText = (qId, optId, text) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                return {
                    ...q,
                    options: q.options.map(o => (o.id === optId ? { ...o, text } : o))
                };
            }
            return q;
        }));
    };

    const setCorrectOption = (qId, optId) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                return {
                    ...q,
                    options: q.options.map(o => ({
                        ...o,
                        isCorrect: o.id === optId
                    }))
                };
            }
            return q;
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const subjects = challengeMode === 'single' ? [subject] : challengeMode === 'multi' ? selectedSubjects : ALL_SUBJECTS;
        console.log("Saving challenge:", { title, description, challengeMode, subjects, level, difficulty, points, questions });
        setSuccessMsg("Desafio salvo com sucesso!");
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    return (
        <div className="create-challenge-container animate-fade-in">
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <h1>Criar Novo Desafio</h1>
                    <p>Elabore questões e defina o gabarito para a turma</p>
                </div>
            </div>

            {successMsg && (
                <div className="success-banner">
                    <CheckCircle size={20} />
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSave} className="challenge-form">
                <div className="form-section">
                    <h3>Detalhes do Desafio</h3>
                    
                    <div className="form-group">
                        <label>Título do Desafio</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Ex: Estruturas de Decisão em JavaScript"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea 
                            className="form-input form-textarea" 
                            placeholder="Descreva o contexto do desafio..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Modo do Desafio</label>
                        <div className="mode-selector">
                            <button type="button" className={`mode-btn ${challengeMode === 'single' ? 'active' : ''}`} onClick={() => setChallengeMode('single')}>
                                <BookOpen size={16} /> Uma Disciplina
                            </button>
                            <button type="button" className={`mode-btn ${challengeMode === 'multi' ? 'active' : ''}`} onClick={() => setChallengeMode('multi')}>
                                <Library size={16} /> Várias Disciplinas
                            </button>
                            <button type="button" className={`mode-btn ${challengeMode === 'random' ? 'active' : ''}`} onClick={() => setChallengeMode('random')}>
                                <Shuffle size={16} /> Aleatório (Todas)
                            </button>
                        </div>
                    </div>

                    {challengeMode === 'single' && (
                        <div className="form-group">
                            <label>Disciplina</label>
                            <select className="form-input" value={subject} onChange={(e) => setSubject(e.target.value)}>
                                {ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}

                    {challengeMode === 'multi' && (
                        <div className="form-group">
                            <label>Selecione as Disciplinas</label>
                            <div className="subjects-grid">
                                {ALL_SUBJECTS.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        className={`subject-chip ${selectedSubjects.includes(s) ? 'active' : ''}`}
                                        onClick={() => toggleSubject(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {challengeMode === 'random' && (
                        <div className="form-group">
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Questões serão sorteadas aleatoriamente de todas as 11 disciplinas.</p>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nível de Ensino</label>
                            <select className="form-input" value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option value="Fundamental">Fundamental</option>
                                <option value="Médio Integral">Médio Integral</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dificuldade</label>
                            <select className="form-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                <option value="Iniciante">Iniciante</option>
                                <option value="Intermediário">Intermediário</option>
                                <option value="Avançado">Avançado</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Pontos (XP)</label>
                            <input type="number" className="form-input" value={points} onChange={(e) => setPoints(Number(e.target.value))} min="10" step="10" />
                        </div>
                    </div>
                </div>

                <div className="form-section questions-section">
                    <div className="section-header">
                        <h3>Questões e Gabarito</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className="btn-add" onClick={importFromBank} style={{ borderColor: 'var(--secondary)', color: 'var(--secondary-neon)' }}>
                                <BookOpen size={16} /> Importar do Banco
                            </button>
                            <button type="button" className="btn-add" onClick={addQuestion}>
                                <Plus size={16} /> Adicionar Manual
                            </button>
                        </div>
                    </div>

                    <div className="questions-list">
                        {questions.map((q, index) => (
                            <div key={q.id} className="question-card">
                                <div className="question-header">
                                    <h4>Questão {index + 1}</h4>
                                    {questions.length > 1 && (
                                        <button type="button" className="btn-icon-danger" onClick={() => removeQuestion(q.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        className="form-input question-input" 
                                        placeholder="Digite a pergunta aqui..."
                                        value={q.text}
                                        onChange={(e) => updateQuestionText(q.id, e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="options-container">
                                    <label className="options-label">Opções de Resposta (Marque a correta)</label>
                                    {q.options.map((opt, optIndex) => (
                                        <div key={opt.id} className={`option-row ${opt.isCorrect ? 'is-correct' : ''}`}>
                                            <div 
                                                className="correct-toggle"
                                                onClick={() => setCorrectOption(q.id, opt.id)}
                                                title="Marcar como correta"
                                            >
                                                {opt.isCorrect ? <CheckCircle size={20} color="var(--secondary-neon)" /> : <div className="circle-empty"></div>}
                                            </div>
                                            
                                            <div className="option-letter-badge">
                                                {String.fromCharCode(65 + optIndex)}
                                            </div>

                                            <input 
                                                type="text" 
                                                className="form-input option-input" 
                                                placeholder={`Opção ${String.fromCharCode(65 + optIndex)}`}
                                                value={opt.text}
                                                onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                                                required
                                            />

                                            <button 
                                                type="button" 
                                                className="btn-icon-danger"
                                                onClick={() => removeOption(q.id, opt.id)}
                                                disabled={q.options.length <= 2}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {q.options.length < 5 && (
                                        <button type="button" className="btn-add-option" onClick={() => addOption(q.id)}>
                                            <Plus size={14} /> Adicionar Opção
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-outline">Cancelar</button>
                    <button type="submit" className="btn btn-primary btn-save">
                        <Save size={18} /> Salvar e Publicar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateChallengeForm;
