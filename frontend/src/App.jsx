import { GameProvider, useGame } from './context/GameContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SubjectSelectPage from './pages/SubjectSelectPage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import TeacherPage from './pages/TeacherPage';

function AppRouter() {
  const { state } = useGame();
  const { user, screen } = state;

  if (!user) return <LoginPage />;
  if (screen === 'teacher') return <TeacherPage />;
  if (screen === 'subject-select') return <SubjectSelectPage />;
  if (screen === 'game') return <GamePage />;
  if (screen === 'result') return <ResultPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  );
}
