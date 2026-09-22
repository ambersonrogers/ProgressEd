import { useState, useEffect } from 'react';
import { playCorrectSound, playWrongSound, playClickSound, playLevelUpSound } from '../utils/soundEffects';
import './ChallengeCard.css';

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function ChallengeCard({
  challenge,
  currentIndex = 0,
  totalQuestions = 5,
  timeLeft = 30,
  timerPaused = false,
  onSubmit,
  onNext,
  onExit,
  isLastQuestion = false,
  disabled = false,
  timeExpired = false
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [challenge?.id]);

  useEffect(() => {
    if (timeExpired && !showResult) {
      setShowResult(true);
      setIsCorrect(false);
      playWrongSound();
      if (onSubmit) {
        onSubmit(challenge.id, null);
      }
    }
  }, [timeExpired]);

  if (!challenge) return null;

  const correctAnswer = (challenge.correctAnswer || challenge.correct_answer || 'A').toUpperCase();

  const handleSelectOption = (key) => {
    if (disabled || showResult) return;
    playClickSound();
    setSelectedAnswer(key);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedAnswer || disabled || showResult) return;

    setShowResult(true);
    const correct = selectedAnswer.toUpperCase() === correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    if (onSubmit) {
      await onSubmit(challenge.id, selectedAnswer);
    }
  };

  const options = [
    { key: 'A', text: challenge.optionA ?? challenge.option_a },
    { key: 'B', text: challenge.optionB ?? challenge.option_b },
    { key: 'C', text: challenge.optionC ?? challenge.option_c },
    { key: 'D', text: challenge.optionD ?? challenge.option_d },
  ].filter(opt => opt.text !== undefined && opt.text !== null && opt.text !== '');

  // Prepara linhas para o box contextual estilo código/teoria com numeração (fiel ao MVP Image 3)
  const contextSnippetLines = [
    `// Disciplina: ${challenge.subject || 'BNCC'}`,
    `// Tópico Curricular: ${challenge.title || 'Competência BNCC'}`,
    `// Referência: Centro Educa Mais Paulo Freire`,
    ``,
    `function resolverQuestao() {`,
    `  const dados = "${challenge.question?.slice(0, 45)}...";`,
    `  const foco = "${challenge.subject}";`,
    ``,
    `  // Analisando premissas pedagógicas:`,
    `  if (compreensaoConceitual) {`,
    `    return aplicarCompetenciaBNCC();`,
    `  }`,
    `  return revisaoAtiva();`,
    `}`,
    ``,
    `resolverQuestao();`
  ];

  const difficultyLabel = challenge.difficulty === 1 ? 'FÁCIL' : challenge.difficulty === 3 ? 'DIFÍCIL' : 'MÉDIO';
  const xpReward = challenge.xpReward ?? challenge.xp_reward ?? 10;

  return (
    <div className="challenge-view-wrapper">
      {/* 1. TOP BAR (Logo, Tempo, Sequência, XP, Avatar) */}
      <header className="quiz-top-bar">
        <div className="quiz-top-logo" onClick={onExit} style={{ cursor: 'pointer' }} title="Voltar ao Início">
          <div className="quiz-logo-box">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <path d="M12 8H24C28.4183 8 32 11.5817 32 16C32 20.4183 28.4183 24 24 24H18V32H12V8Z" fill="white" />
              <path d="M18 14H24C25.1046 14 26 14.8954 26 16C26 17.1046 25.1046 18 24 18H18V14Z" fill="#0284c7" />
            </svg>
          </div>
          <div className="quiz-logo-title">
            Progress<span>Ed</span>
          </div>
        </div>

        {/* Indicadores Centrais */}
        <div className="quiz-top-indicators">
          <div className="timer-pill-box">
            <span className="timer-pill-icon">🕒</span>
            <div className="timer-pill-meta">
              <span className="timer-pill-label">TEMPO RESTANTE</span>
              <span className={`timer-pill-value ${timeLeft <= 10 && !timerPaused ? 'urgent' : ''}`}>
                {timerPaused ? 'PAUSADO' : formatTimer(timeLeft)}
              </span>
            </div>
          </div>

          <div className="streak-pill-box">
            <span className="streak-pill-icon">🔥</span>
            <div className="streak-pill-meta">
              <span className="streak-pill-label">SEQUÊNCIA</span>
              <span className="streak-pill-val">
                7 <span className="flames">🔥🔥🔥</span>
              </span>
            </div>
          </div>
        </div>

        {/* Usuário e XP */}
        <div className="quiz-top-user">
          <div className="trophy-xp-pill">
            <span>🏆</span>
            <span>1,250</span>
          </div>
          <div className="quiz-user-avatar">
            A
          </div>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN SPLIT GRID */}
      <div className="challenge-split-grid">
        {/* LEFT COLUMN: Context / Code / Theory */}
        <div className="challenge-context-card">
          <div>
            <div className="context-card-top">
              <span className="category-tag-badge">
                &lt;/&gt; {challenge.subject?.toUpperCase() || 'BNCC'}
              </span>
              <div className="flex items-center gap-2">
                <span className="difficulty-pill-tag">{difficultyLabel}</span>
                <span className="text-slate-400 text-sm cursor-pointer hover:text-sky-400" title="Salvar questão">🔖</span>
              </div>
            </div>

            <h2 className="challenge-headline-title">{challenge.title}</h2>
            <p className="challenge-statement-text">
              {challenge.question}
            </p>

            {/* Terminal / Code / Theory Block with Line Numbers */}
            <div className="code-theory-terminal-box">
              <div className="terminal-header-bar">
                <div className="terminal-dots">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                </div>
                <div className="terminal-lang-badge">
                  {challenge.subject === 'Matemática' ? 'Matemática' : challenge.subject === 'Linguagens' ? 'Português' : 'JavaScript'} ▾
                </div>
              </div>

              <div className="code-lines-scroll">
                {contextSnippetLines.map((line, idx) => (
                  <div key={idx} className="code-line-item">
                    <span className="line-number-gutter">{idx + 1}</span>
                    <span className="line-content-code">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="context-bottom-bar">
            <button className="context-action-btn" type="button">
              <span>&gt;_</span>
              <span>Console / Resumo</span>
            </button>
            <button className="context-action-btn text-sky-400" type="button">
              <span>▷</span>
              <span>Executar / Consultar BNCC</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Question & Alternatives & Hint */}
        <div className="challenge-interaction-card">
          <div>
            <div className="question-top-status">
              <span className="question-counter-label">
                PERGUNTA {currentIndex + 1} DE {totalQuestions}
              </span>

              <div className="question-progress-pills">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div
                    key={i}
                    className={`progress-pill-segment ${
                      i === currentIndex ? 'active' : i < currentIndex ? 'passed' : ''
                    }`}
                  />
                ))}
              </div>

              <div className="xp-reward-hexagon">
                <span>{xpReward} XP</span>
                <span>⬡</span>
              </div>
            </div>

            <h3 className="question-prompt-text">
              {challenge.question}
            </h3>

            {/* 4 Interactive Option Buttons A, B, C, D */}
            <div className="options-interactive-grid">
              {options.map((opt) => {
                const isSelected = selectedAnswer === opt.key;
                const isThisCorrect = correctAnswer === opt.key;

                let stateClass = '';
                if (showResult) {
                  if (isThisCorrect) {
                    stateClass = 'correct';
                  } else if (isSelected && !isCorrect) {
                    stateClass = 'incorrect';
                  }
                } else if (isSelected) {
                  stateClass = 'selected';
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    className={`option-select-button ${stateClass}`}
                    onClick={() => handleSelectOption(opt.key)}
                    disabled={disabled || showResult}
                  >
                    <div className="option-letter-square">
                      {opt.key}
                    </div>
                    <div className="option-text-group">
                      <span className="option-main-text">{opt.text}</span>
                    </div>

                    {showResult && isThisCorrect && (
                      <span className="option-status-icon-badge correct">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="option-status-icon-badge incorrect">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint Box (DICA) */}
            <div className="hint-container-card">
              <div className="hint-header-line">
                <span>💡</span>
                <span>DICA</span>
              </div>
              <p className="hint-body-text">
                Considere as relações fundamentais e propriedades conceituais descritas no enunciado.
              </p>
            </div>

            {/* Pedagogical Explanation Box (Pausa calma para o aluno aprender) */}
            {showResult && (
              <div className={`pedagogical-result-box ${isCorrect ? 'success' : 'error'}`}>
                <div className="pedagogical-title">
                  <span>{isCorrect ? '🎉 Resposta Correta!' : '💡 Resolução Comentada:'}</span>
                  <span className="text-xs font-normal opacity-75">
                    {isCorrect ? `+${xpReward} XP adicionados!` : `Alternativa correta: (${correctAnswer})`}
                  </span>
                </div>
                <p className="pedagogical-content-p">
                  {challenge.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR */}
      <footer className="quiz-bottom-action-bar">
        <button
          type="button"
          className="btn-exit-challenge"
          onClick={onExit}
        >
          <span>✕</span>
          <span>SAIR DO DESAFIO</span>
        </button>

        <div className="saved-changes-indicator">
          <span>✓</span>
          <span>Todas as alterações salvas</span>
        </div>

        {/* Glowing Neon Green Action Button (Faithful to MVP Image 3) */}
        {!showResult ? (
          <button
            type="button"
            className="btn-neon-green-submit"
            onClick={handleConfirmSubmit}
            disabled={!selectedAnswer || disabled}
          >
            <span>ENVIAR</span>
            <span>&gt;</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-neon-green-submit"
            onClick={() => {
              if (isLastQuestion) {
                playLevelUpSound();
              } else {
                playClickSound();
              }
              onNext();
            }}
          >
            <span>{isLastQuestion ? 'FINALIZAR' : 'PRÓXIMA QUESTÃO'}</span>
            <span>&rarr;</span>
          </button>
        )}
      </footer>
    </div>
  );
}

export default ChallengeCard;
