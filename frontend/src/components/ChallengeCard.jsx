import { useState } from 'react';
import './ChallengeCard.css';

function ChallengeCard({ challenge, onSubmit, disabled }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleAnswerClick = async (answer) => {
        if (disabled || showResult) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const correct = answer === challenge.correct_answer;
        setIsCorrect(correct);

        // Pequeno delay para mostrar o feedback visual
        setTimeout(async () => {
            await onSubmit(challenge.id, answer);
            // Reset para próximo desafio
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
        }, 2000);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 1: return 'easy';
            case 2: return 'medium';
            case 3: return 'hard';
            default: return 'medium';
        }
    };

    const getSubjectIcon = (subject) => {
        const icons = {
            'Matemática': '📐',
            'Física': '⚛️',
            'Química': '🧪',
            'Biologia': '🧬',
            'História': '📜',
            'Geografia': '🌍',
            'Português': '📚',
            'Inglês': '🇺🇸',
            'Artes': '🎨',
            'Filosofia': '🤔',
            'Sociologia': '👥'
        };
        return icons[subject] || '📖';
    };

    return (
        <div className={`challenge-card ${showResult ? 'result-mode' : ''}`}>
            <div className="challenge-header">
                <div className="subject-badge">
                    <span className="subject-icon">{getSubjectIcon(challenge.subject)}</span>
                    <span className="subject-name">{challenge.subject}</span>
                </div>
                <div className={`difficulty-badge ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty === 1 ? 'Fácil' :
                     challenge.difficulty === 2 ? 'Médio' : 'Difícil'}
                </div>
            </div>

            <div className="challenge-content">
                <h3 className="challenge-question">{challenge.question}</h3>

                <div className="answers-grid">
                    {['A', 'B', 'C', 'D'].map((option) => {
                        const answerText = challenge[`option_${option.toLowerCase()}`];
                        const isSelected = selectedAnswer === option;
                        const isCorrectAnswer = challenge.correct_answer === option;

                        let buttonClass = 'answer-btn';
                        if (showResult) {
                            if (isCorrectAnswer) {
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
                                key={option}
                                className={buttonClass}
                                onClick={() => handleAnswerClick(option)}
                                disabled={disabled || showResult}
                            >
                                <span className="option-letter">{option}</span>
                                <span className="option-text">{answerText}</span>
                                {showResult && isCorrectAnswer && (
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
                        {isCorrect ? (
                            <>
                                <span className="result-icon">🎉</span>
                                <h4>Parabéns! Você acertou!</h4>
                                <p>Você ganhou {challenge.xp_reward} XP</p>
                            </>
                        ) : (
                            <>
                                <span className="result-icon">😅</span>
                                <h4>A resposta não está correta</h4>
                                <p>Mais sorte na próxima!</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="challenge-footer">
                <div className="xp-reward">
                    <span className="xp-icon">⭐</span>
                    <span>{challenge.xp_reward} XP</span>
                </div>
            </div>
        </div>
    );
}

export default ChallengeCard;