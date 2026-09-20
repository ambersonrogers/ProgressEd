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

        const correct = answer === challenge.correctAnswer;
        setIsCorrect(correct);

        setTimeout(async () => {
            await onSubmit(challenge.id, answer);
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
        }, 1200);
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
            'Linguagens': '📝',
            'Matemática': '📐',
            'Ciências da Natureza': '🧪',
            'Ciências Humanas': '📜',
            'Atualidades': '🌎',
            'Português': '📚',
            'Inglês': '🇺🇸',
            'Espanhol': '🇪🇸',
            'Raízes do Brasil': '🌿',
        };
        return icons[subject] || '📖';
    };

    const options = ['A', 'B', 'C', 'D', 'E'].map((option) => ({
        key: option,
        text: challenge[`option${option}`],
    })).filter((item) => item.text !== undefined && item.text !== null);

    return (
        <div className={`challenge-card ${showResult ? 'result-mode' : ''}`}>
            <div className="challenge-header">
                <div className="subject-badge">
                    <span className="subject-icon">{getSubjectIcon(challenge.subject)}</span>
                    <span className="subject-name">{challenge.subject}</span>
                </div>
                <div className={`difficulty-badge ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty === 1 ? 'Fácil' : challenge.difficulty === 2 ? 'Médio' : 'Difícil'}
                </div>
            </div>

            <div className="challenge-content">
                <h3 className="challenge-question">{challenge.question}</h3>

                <div className="answers-grid">
                    {options.map((option) => {
                        const answerText = option.text;
                        const isSelected = selectedAnswer === option.key;
                        const isCorrectAnswer = challenge.correctAnswer === option.key;

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
                                key={option.key}
                                className={buttonClass}
                                onClick={() => handleAnswerClick(option.key)}
                                disabled={disabled || showResult}
                            >
                                <span className="option-letter">{option.key}</span>
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
                                <p>Você ganhou {challenge.xpReward ?? challenge.xp_reward} XP</p>
                            </>
                        ) : (
                            <>
                                <span className="result-icon">😅</span>
                                <h4>Resposta incorreta ou tempo esgotado</h4>
                                <p>{challenge.explanation || 'Analise cada alternativa e tente novamente na próxima questão.'}</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="challenge-footer">
                <div className="xp-reward">
                    <span className="xp-icon">⭐</span>
                    <span>{challenge.xpReward ?? challenge.xp_reward} XP</span>
                </div>
            </div>
        </div>
    );
}

export default ChallengeCard;
