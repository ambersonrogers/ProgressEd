import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Clock, Zap, CheckCircle, XCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SUBJECTS } from '../data/questions';

const LETTERS = ['A','B','C','D','E'];
const LETTER_COLORS = ['#7C3AED','#0EA5E9','#10B981','#F59E0B','#EC4899'];

export default function GamePage() {
  const { state, dispatch } = useGame();
  const { currentQuestions, currentIndex, score, user } = state;
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [timerActive, setTimerActive] = useState(true);
  const timerRef = useRef(null);
  const nextRef = useRef(null);

  const question = currentQuestions[currentIndex];
  const isLast = currentIndex >= currentQuestions.length - 1;
  const subject = question ? SUBJECTS.find(s => s.id === question.subject) : null;

  const reveal = useCallback((answer, isTimeUp = false) => {
    if (revealed) return;
    setTimerActive(false);
    clearInterval(timerRef.current);
    setSelected(answer);
    setRevealed(true);
    dispatch({ type: 'ANSWER', payload: answer, timeUp: isTimeUp });
  }, [revealed, dispatch]);

  const goNext = useCallback(() => {
    if (isLast) {
      dispatch({ type: 'END_GAME' });
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
      setSelected(null);
      setRevealed(false);
      setTimeLeft(25);
      setTimerActive(true);
    }
  }, [isLast, dispatch]);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setTimeLeft(25);
    setTimerActive(true);
  }, [currentIndex]);

  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          reveal(null, true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive, reveal]);

  useEffect(() => {
    if (revealed) {
      nextRef.current = setTimeout(goNext, 2200);
      return () => clearTimeout(nextRef.current);
    }
  }, [revealed, goNext]);

  if (!question) return null;

  const correctIdx = LETTERS.indexOf(question.correctAnswer);

  const getBtnStyle = (letter, idx) => {
    if (!revealed) return {
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid rgba(255,255,255,0.08)`,
      color: '#F1F5F9'
    };
    const isCorrect = letter === question.correctAnswer;
    const isSelected = letter === selected;
    if (isCorrect) return { background: 'rgba(16,185,129,0.25)', border: '1.5px solid #10B981', color: '#34D399' };
    if (isSelected && !isCorrect) return { background: 'rgba(239,68,68,0.2)', border: '1.5px solid #EF4444', color: '#F87171' };
    return { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: '#64748B' };
  };

  const timerPercent = (timeLeft / 25) * 100;
  const timerColor = timeLeft > 10 ? '#10B981' : timeLeft > 5 ? '#F59E0B' : '#EF4444';

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur border-b border-dark-border px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => dispatch({ type: 'RESET_GAME' })} className="p-2 rounded-xl hover:bg-dark-card text-dark-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-dark-muted">{currentIndex + 1}/{currentQuestions.length}</span>
            <div className="flex items-center gap-1 bg-warning/10 rounded-lg px-2 py-1">
              <Zap className="w-3 h-3 text-warning" />
              <span className="text-xs font-bold text-warning">{score}</span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-xl mx-auto mt-2">
          <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex) / currentQuestions.length) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-4 flex flex-col gap-4">
        {/* Subject badge */}
        {subject && (
          <div className="flex items-center gap-2">
            <span className="text-base">{subject.emoji}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: subject.color + '20', color: subject.color }}>
              {subject.name}
            </span>
            <span className="ml-auto text-xs text-dark-muted">{question.points} XP</span>
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 flex-shrink-0" style={{ color: timerColor }} />
          <div className="flex-1 h-2.5 bg-dark-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${timerPercent}%`, background: timerColor }} />
          </div>
          <span className="text-sm font-bold w-6 text-right" style={{ color: timerColor }}>{timeLeft}</span>
        </div>

        {/* Question */}
        <div className="card p-5 flex-shrink-0" style={{ borderColor: subject?.border + '40' }}>
          <p className="text-white font-semibold text-base leading-relaxed">{question.text}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 flex-1">
          {question.options.map((opt, idx) => {
            const style = getBtnStyle(opt.letter, idx);
            const isCorrect = revealed && opt.letter === question.correctAnswer;
            const isWrong = revealed && opt.letter === selected && opt.letter !== question.correctAnswer;
            return (
              <button key={opt.letter} onClick={() => !revealed && reveal(opt.letter)}
                disabled={revealed}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-200 ${!revealed ? 'hover:scale-[1.01] active:scale-[0.98] cursor-pointer' : ''} ${isWrong ? 'animate-shake' : ''}`}
                style={style}>
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                  style={{ background: revealed && isCorrect ? '#10B981' : revealed && isWrong ? '#EF4444' : LETTER_COLORS[idx] + '30', color: revealed && isCorrect ? 'white' : revealed && isWrong ? 'white' : LETTER_COLORS[idx] }}>
                  {opt.letter}
                </span>
                <span className="flex-1 text-sm leading-snug">{opt.text}</span>
                {isCorrect && <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />}
                {isWrong && <XCircle className="w-5 h-5 text-danger flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {revealed && (
          <div className={`card p-4 text-center animate-bounce-in ${selected === question.correctAnswer ? 'border-success/40 bg-success/5' : 'border-danger/40 bg-danger/5'}`}>
            <p className="font-bold text-base">
              {selected === null ? '⏰ Tempo esgotado!' : selected === question.correctAnswer ? `🎉 Correto! +${question.points} XP` : `❌ Era a letra ${question.correctAnswer}`}
            </p>
            <p className="text-xs text-dark-muted mt-1">Próxima em instantes...</p>
          </div>
        )}

        {revealed && (
          <button onClick={() => { clearTimeout(nextRef.current); goNext(); }}
            className="btn-primary w-full">
            {isLast ? 'Ver resultado' : 'Próxima →'}
          </button>
        )}
      </div>
    </div>
  );
}
