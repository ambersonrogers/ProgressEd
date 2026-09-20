import { useState, useEffect } from 'react';
import './ChallengeCard.css';

function ChallengeCard({ challenge, onSubmit, onNext, isLastQuestion, disabled, timeExpired }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Reset ao mudar de desafio
    useEffect(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [challenge?.id]);

    // Trata expiração do tempo vinda do timer pai
    useEffect(() => {
        if (timeExpired && !showResult) {
            setShowResult(true);
            setIsCorrect(false);
            if (onSubmit) {
                onSubmit(challenge.id, null);
            }
        }
    }, [timeExpired]);

    if (!challenge) return null;

    const correctAnswer = (challenge.correctAnswer || challenge.correct_answer || 'A').toUpperCase();

    const handleAnswerClick = async (answer) => {
        if (disabled || showResult) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const correct = answer.toUpperCase() === correctAnswer;
        setIsCorrect(correct);

        if (onSubmit) {
            await onSubmit(challenge.id, answer);
        }
    };

    const handleNext = () => {
        if (onNext) {
            onNext();
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (Number(difficulty)) {
            case 1: return 'easy';
            case 2: return 'medium';
            case 3: return 'hard';
            default: return 'medium';
        }
    };

    const getSubjectIcon = (subject) => {
        const icons = {
            'Linguagens': '📝',
            'Matemática': '📐',
            'Ciências da Natureza': '🧪',
            'Ciências Humanas': '📜',
            'Atualidades': '🌎',
            'Português': '📚',
            'Inglês': '🇺🇸',
            'Física': '⚡',
            'Química': '⚗️',
            'Biologia': '🧬',
            'História': '🏛️',
            'Geografia': '🗺️',
            'Filosofia': '💭',
            'Sociologia': '👥',
            'Artes': '🎨'
        };
        return icons[subject] || '📖';
    };

    const options = [
        { key: 'A', text: challenge.optionA ?? challenge.option_a },
        { key: 'B', text: challenge.optionB ?? challenge.option_b },
        { key: 'C', text: challenge.optionC ?? challenge.option_c },
        { key: 'D', text: challenge.optionD ?? challenge.option_d },
        { key: 'E', text: challenge.optionE ?? challenge.option_e },
    ].filter((item) => item.text !== undefined && item.text !== null && item.text !== '');

    const explanationText = challenge.explanation || challenge.description ||
        `A alternativa correta é a (${correctAnswer}). Esta questão exercita competências e habilidades fundamentais da BNCC em ${challenge.subject || 'Conhecimentos Gerais'}.`;

    return (
        <div className={`challenge-card ${showResult ? 'result-mode' : ''}`}>
            <div className="challenge-header">
                <div className="subject-badge">
                    <span className="subject-icon">{getSubjectIcon(challenge.subject)}</span>
                    <span className="subject-name">{challenge.subject || 'Geral'}</span>
                </div>
                <div className={`difficulty-badge ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty === 1 ? 'Fácil' : challenge.difficulty === 2 ? 'Médio' : 'Difícil'}
                </div>
            </div>

            <div className="challenge-content">
                <h3 className="challenge-question">{challenge.question || challenge.text}</h3>

                <div className="answers-grid">
                    {options.map((option) => {
                        const answerText = option.text;
                        const isSelected = selectedAnswer === option.key;
                        const isThisCorrect = correctAnswer === option.key;

                        let buttonClass = 'answer-btn';
                        if (showResult) {
                            if (isThisCorrect) {
                                buttonClass += ' correct';
                            } else if (isSelected && !isCorrect) {
                                buttonClass += ' incorrect';
                            } else {
                                buttonClass += ' disabled';
                            }
                        } else if (isSelected) {
                            buttonClass += ' selected';
                        }

                        return (
                            <button
                                key={option.key}
                                className={buttonClass}
                                onClick={() => handleAnswerClick(option.key)}
                                disabled={disabled || showResult}
                            >
                                <span className="option-letter">{option.key}</span>
                                <span className="option-text">{answerText}</span>
                                {showResult && isThisCorrect && (
                                    <span className="correct-icon">✓</span>
                                )}
                                {showResult && isSelected && !isCorrect && (
                                    <span className="incorrect-icon">✗</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {showResult && (
                    <div className={`result-message ${isCorrect ? 'success' : 'error'}`}>
                        <div className="result-header-row">
                            <span className="result-icon">{isCorrect ? '🎉' : '💡'}</span>
                            <div>
                                <h4 className="result-title">
                                    {isCorrect
                                        ? 'Parabéns! Resposta Correta!'
                                        : (selectedAnswer ? 'Resposta Incorreta' : 'Tempo Esgotado!')}
                                </h4>
                                <p className="result-xp-text">
                                    {isCorrect
                                        ? `+${challenge.xpReward ?? challenge.xp_reward ?? 15} XP conquistados!`
                                        : `Alternativa correta: (${correctAnswer})`}
                                </p>
                            </div>
                        </div>

                        {/* Explicação Pedagógica Clara */}
                        <div className="pedagogical-box">
                            <div className="pedagogical-label">
                                <span>📖 Explicação Pedagógica & Resolução:</span>
                            </div>
                            <p className="pedagogical-text">{explanationText}</p>
                        </div>

                        {/* Botão de Avanço Manual Sem Pressa */}
                        <div className="next-action-container">
                            <button
                                type="button"
                                className="next-question-btn"
                                onClick={handleNext}
                            >
                                {isLastQuestion ? '🏁 Finalizar & Ver Placar' : 'Próxima Questão ➡️'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="challenge-footer">
                <div className="xp-reward">
                    <span className="xp-icon">⭐</span>
                    <span>Recompensa: {challenge.xpReward ?? challenge.xp_reward ?? 15} XP</span>
                </div>
            </div>
        </div>
    );
}

export default ChallengeCard;
