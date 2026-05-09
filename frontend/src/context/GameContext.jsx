import { createContext, useContext, useReducer, useCallback } from 'react';
import questionBank, { SUBJECTS } from '../data/questions';

const GameContext = createContext(null);

const initialState = {
  user: null,
  questions: questionBank,
  subjects: SUBJECTS,
  pins: {}, // { pinCode: { id, subject, count, createdBy, createdAt } }
  screen: 'home', // home | subject-select | game | result | teacher
  gameMode: null, // 'trail' | 'random'
  selectedSubject: null,
  currentQuestions: [],
  currentIndex: 0,
  score: 0,
  answers: [], // { questionId, chosen, correct, timeUp }
  timeLeft: 25,
  sessionXp: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    case 'LOGOUT': return { ...initialState };
    case 'ADD_QUESTIONS': {
      const newQ = action.payload;
      const maxId = Math.max(...state.questions.map(q => q.id), 0);
      const withId = newQ.map((q, i) => ({ ...q, id: maxId + i + 1 }));
      return { ...state, questions: [...state.questions, ...withId] };
    }
    case 'ADD_PIN': return { ...state, pins: { ...state.pins, [action.payload.code]: action.payload.pin } };
    case 'GO_TO': return { ...state, screen: action.payload };
    case 'START_RANDOM': {
      const shuffled = [...state.questions].sort(() => Math.random() - 0.5);
      return { ...state, screen: 'game', gameMode: 'random', selectedSubject: null, currentQuestions: shuffled, currentIndex: 0, score: 0, answers: [], sessionXp: 0 };
    }
    case 'START_TRAIL': {
      const qs = state.questions.filter(q => q.subject === action.payload).sort(() => Math.random() - 0.5);
      return { ...state, screen: 'game', gameMode: 'trail', selectedSubject: action.payload, currentQuestions: qs, currentIndex: 0, score: 0, answers: [], sessionXp: 0 };
    }
    case 'START_PIN_CHALLENGE': {
      const pin = state.pins[action.payload];
      if (!pin) return state;
      let qs = [];
      if (pin.subjects && pin.subjects.length > 0) {
        const perSubject = Math.ceil(pin.count / pin.subjects.length);
        pin.subjects.forEach(sub => {
          const subQs = state.questions.filter(q => q.subject === sub).sort(() => Math.random() - 0.5).slice(0, perSubject);
          qs = [...qs, ...subQs];
        });
      } else {
        qs = [...state.questions].sort(() => Math.random() - 0.5).slice(0, pin.count);
      }
      qs = qs.sort(() => Math.random() - 0.5);
      return { ...state, screen: 'game', gameMode: 'pin', selectedSubject: null, currentQuestions: qs, currentIndex: 0, score: 0, answers: [], sessionXp: 0 };
    }
    case 'ANSWER': {
      const q = state.currentQuestions[state.currentIndex];
      const isCorrect = action.payload === q.correctAnswer;
      const xpGain = isCorrect ? (action.timeUp ? 0 : q.points) : 0;
      const newAnswers = [...state.answers, { questionId: q.id, chosen: action.payload, correct: isCorrect, timeUp: action.timeUp }];
      return { ...state, score: state.score + xpGain, sessionXp: state.sessionXp + xpGain, answers: newAnswers };
    }
    case 'NEXT_QUESTION': return { ...state, currentIndex: state.currentIndex + 1, timeLeft: 25 };
    case 'END_GAME': {
      const newXp = (state.user?.xp || 0) + state.sessionXp;
      const newLevel = Math.floor(newXp / 500) + 1;
      const updatedUser = state.user ? { ...state.user, xp: newXp, level: newLevel } : null;
      if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
      return { ...state, screen: 'result', user: updatedUser };
    }
    case 'RESET_GAME': return { ...state, screen: 'home', gameMode: null, selectedSubject: null, currentQuestions: [], currentIndex: 0, score: 0, answers: [], timeLeft: 25, sessionXp: 0 };
    default: return state;
  }
}

export function GameProvider({ children }) {
  const savedUser = (() => { try { const u = localStorage.getItem('user'); const t = localStorage.getItem('token'); return u && t ? JSON.parse(u) : null; } catch { return null; } })();
  const [state, dispatch] = useReducer(reducer, { ...initialState, user: savedUser });

  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (!localStorage.getItem('token')) localStorage.setItem('token', 'mock-token');
    dispatch({ type: 'SET_USER', payload: userData });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
