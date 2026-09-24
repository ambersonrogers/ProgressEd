import { useState, useEffect, useMemo } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import api from '../services/api';
import { DEFAULT_CHALLENGES, DEFAULT_RANKING } from '../data/defaultChallenges';
import { playClickSound, playLevelUpSound } from '../utils/soundEffects';
import './StudentDashboard.css';

// --------------------------------------------------------------------------
// DISCIPLINAS DA BASE DO ENSINO MÉDIO INTEGRAL (BNCC)
// --------------------------------------------------------------------------
const BNCC_AREAS = [
  {
    id: 1,
    key: 'linguagens',
    name: 'Linguagens & Tecnologias',
    shortName: 'Linguagens',
    subtitle: 'Português • Redação • Literatura • Inglês • Artes',
    icon: '📝',
    color: '#8b5cf6',
    borderClass: 'border-violet-500/40',
    bgGradient: 'from-violet-600/20 to-indigo-900/40',
    competence: 'EM13LGG101 / EM13LGG302'
  },
  {
    id: 2,
    key: 'matematica',
    name: 'Matemática & Tecnologias',
    shortName: 'Matemática',
    subtitle: 'Álgebra • Geometria • Funções • Estatística',
    icon: '📐',
    color: '#d946ef',
    borderClass: 'border-fuchsia-500/40',
    bgGradient: 'from-fuchsia-600/20 to-pink-900/40',
    competence: 'EM13MAT103 / EM13MAT301'
  },
  {
    id: 3,
    key: 'natureza',
    name: 'Ciências da Natureza',
    shortName: 'Natureza',
    subtitle: 'Física • Química • Biologia',
    icon: '🧪',
    color: '#10b981',
    borderClass: 'border-emerald-500/40',
    bgGradient: 'from-emerald-600/20 to-teal-900/40',
    competence: 'EM13CNT102 / EM13CNT203'
  },
  {
    id: 4,
    key: 'humanas',
    name: 'Ciências Humanas & Sociais',
    shortName: 'Humanas',
    subtitle: 'História • Geografia • Filosofia • Sociologia',
    icon: '📜',
    color: '#f59e0b',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-600/20 to-orange-900/40',
    competence: 'EM13CHS101 / EM13CHS502'
  },
  {
    id: 5,
    key: 'simulado',
    name: 'Simulado Geral ENEM',
    shortName: 'Simulado ENEM',
    subtitle: 'Multidisciplinar • Matriz de Referência ENEM',
    icon: '🎯',
    color: '#38bdf8',
    borderClass: 'border-sky-500/40',
    bgGradient: 'from-sky-600/20 to-blue-900/40',
    competence: 'Matriz Completa ENEM'
  }
];

const LEVEL_XP = 500;

// --------------------------------------------------------------------------
// ETAPAS DINÂMICAS DA TRILHA DUOLINGO POR DISCIPLINA (BNCC INTEGRAL)
// --------------------------------------------------------------------------
const BNCC_TRAIL_STAGES = {
  linguagens: [
    {
      id: 1,
      title: 'Gramática & Ortografia',
      subtitle: 'Acentuação, Crase e Regência Verbal',
      icon: '✍️',
      keywords: ['ortografia', 'acentuação', 'crase', 'concordância', 'regência', 'gramática', 'verbo', 'português'],
      type: 'challenge'
    },
    {
      id: 2,
      title: 'Interpretação & Gêneros',
      subtitle: 'Gêneros Textuais, Coesão e Variação Linguística',
      icon: '📖',
      keywords: ['interpretação', 'gênero', 'variação', 'figura', 'leitura', 'texto'],
      type: 'challenge'
    },
    {
      id: 3,
      title: 'Literatura Brasileira',
      subtitle: 'Romantismo, Realismo, Modernismo e Contemporânea',
      icon: '📚',
      keywords: ['literatura', 'romantismo', 'realismo', 'modernismo', 'arcadismo', 'poema', 'autor'],
      type: 'challenge'
    },
    {
      id: 4,
      title: 'Língua Inglesa',
      subtitle: 'Tempos Verbais, Vocabulário e Falsos Cognatos',
      icon: '🇬🇧',
      keywords: ['inglês', 'english', 'present', 'past', 'future', 'comparative', 'verb', 'translation'],
      type: 'challenge'
    },
    {
      id: 5,
      title: 'Artes & Expressão Cultural',
      subtitle: 'Artes Visuais, Teatro, Música e Dança',
      icon: '🎨',
      keywords: ['artes', 'música', 'teatro', 'dança', 'esporte', 'futebol', 'cultura'],
      type: 'challenge'
    },
    {
      id: 6,
      title: 'Baú de Linguagens',
      subtitle: 'Recompensa Bônus: Dicas de Redação Nota 1000 ENEM',
      icon: '🎁',
      type: 'chest',
      bonusXp: 100
    },
    {
      id: 7,
      title: 'Redação & Argumentação',
      subtitle: 'Estrutura Dissertativa e Norma Culta ENEM',
      icon: '📝',
      keywords: ['redação', 'oficial', 'texto', 'dissertativo', 'argumentação'],
      type: 'challenge'
    },
    {
      id: 8,
      title: 'Desafio Mestre de Linguagens',
      subtitle: 'Avaliação Integradora de Competências',
      icon: '🏆',
      type: 'boss'
    }
  ],

  matematica: [
    {
      id: 1,
      title: 'Operações & Aritmética',
      subtitle: 'Frações, Potenciação e Expressões Numéricas',
      icon: '🔢',
      keywords: ['operações', 'divisão', 'multiplicação', 'frações', 'expressões', 'potenciação', 'raiz'],
      type: 'challenge'
    },
    {
      id: 2,
      title: 'Álgebra & Equações',
      subtitle: 'Equações de 1º e 2º Grau e Regra de Três',
      icon: '📐',
      keywords: ['equações', 'regra de três', 'razão', 'proporção', 'álgebra', 'x²'],
      type: 'challenge'
    },
    {
      id: 3,
      title: 'Porcentagem & Finanças',
      subtitle: 'Matemática Financeira, Juros e Descontos',
      icon: '💰',
      keywords: ['porcentagem', 'financeira', 'juros', 'desconto'],
      type: 'challenge'
    },
    {
      id: 4,
      title: 'Geometria Plana & Espacial',
      subtitle: 'Áreas, Perímetros, Triângulos e Sólidos',
      icon: '📏',
      keywords: ['geometria', 'plana', 'espacial', 'área', 'perímetro', 'círculo'],
      type: 'challenge'
    },
    {
      id: 5,
      title: 'Funções & Trigonometria',
      subtitle: 'Função Afim, Quadrática, Seno, Cosseno e Logaritmos',
      icon: '📈',
      keywords: ['funções', 'trigonometria', 'logaritmo', 'seno', 'limite', 'derivada'],
      type: 'challenge'
    },
    {
      id: 6,
      title: 'Baú Matemático',
      subtitle: 'Recompensa Bônus: Fórmulas e Macetes de Raciocínio Rápido',
      icon: '🎁',
      type: 'chest',
      bonusXp: 100
    },
    {
      id: 7,
      title: 'Estatística & Probabilidade',
      subtitle: 'Média Aritmética, Mediana, Moda e Probabilidade',
      icon: '🎲',
      keywords: ['estatística', 'probabilidade', 'média', 'gráfico'],
      type: 'challenge'
    },
    {
      id: 8,
      title: 'Desafio Mestre de Matemática',
      subtitle: 'Grandes Problemas e Raciocínio Lógico Avançado',
      icon: '🏆',
      type: 'boss'
    }
  ],

  natureza: [
    {
      id: 1,
      title: 'Física: Mecânica & Newton',
      subtitle: 'Velocidade, Força, Gravidade e Leis de Newton',
      icon: '⚡',
      keywords: ['newton', 'velocidade', 'força', 'gravidade', 'mecânica', 'cinética'],
      type: 'challenge'
    },
    {
      id: 2,
      title: 'Física: Energia & Circuitos',
      subtitle: 'Trabalho, Potência, Calor, Óptica e Lei de Ohm',
      icon: '💡',
      keywords: ['energia', 'trabalho', 'ohm', 'eletricidade', 'óptica', 'ondulatória', 'termologia'],
      type: 'challenge'
    },
    {
      id: 3,
      title: 'Química: Átomos & Tabela',
      subtitle: 'Estrutura Atômica, Tabela Periódica e Ligações',
      icon: '🧪',
      keywords: ['átomo', 'tabela periódica', 'oxigênio', 'carbono', 'ligações', 'hidrogênio'],
      type: 'challenge'
    },
    {
      id: 4,
      title: 'Química: Reações & pH',
      subtitle: 'Funções Químicas, Ácidos, Bases, Estequiometria e Soluções',
      icon: '⚗️',
      keywords: ['ácido', 'ph', 'reação', 'massa molar', 'estequiometria', 'termoquímica', 'química'],
      type: 'challenge'
    },
    {
      id: 5,
      title: 'Biologia: Célula & Genética',
      subtitle: 'Citologia, DNA, Mitocôndria, Mitose e Hereditariedade',
      icon: '🧬',
      keywords: ['célula', 'dna', 'mitocôndria', 'genética', 'divisão celular', 'mitose', 'biologia'],
      type: 'challenge'
    },
    {
      id: 6,
      title: 'Baú da Natureza',
      subtitle: 'Recompensa Bônus: Guia de Métodos Científicos e Fisiologia',
      icon: '🎁',
      type: 'chest',
      bonusXp: 100
    },
    {
      id: 7,
      title: 'Biologia: Ecologia & Evolução',
      subtitle: 'Ecossistemas, Cadeia Alimentar, Biodiversidade e Darwin',
      icon: '🌿',
      keywords: ['ecologia', 'ecossistema', 'evolução', 'biodiversidade', 'fotossíntese', 'cadeia alimentar'],
      type: 'challenge'
    },
    {
      id: 8,
      title: 'Desafio Mestre da Natureza',
      subtitle: 'Integração Física-Química-Biologia no Mundo Real',
      icon: '🏆',
      type: 'boss'
    }
  ],

  humanas: [
    {
      id: 1,
      title: 'História do Brasil',
      subtitle: 'Brasil Colônia, Império e Formação da Nação',
      icon: '👑',
      keywords: ['colônia', 'império', 'descobrimento', 'independência', 'brasil'],
      type: 'challenge'
    },
    {
      id: 2,
      title: 'República & Brasil Moderno',
      subtitle: 'República Velha, Era Vargas e Ditadura Militar',
      icon: '🏛️',
      keywords: ['república', 'vargas', 'ditadura', 'militar', 'revolução'],
      type: 'challenge'
    },
    {
      id: 3,
      title: 'História Geral & Guerras',
      subtitle: 'Grécia, Roma, Idade Média, Revolução Industrial e Guerras Mundiais',
      icon: '⚔️',
      keywords: ['grécia', 'roma', 'idade média', 'revolução industrial', 'guerra', 'francesa'],
      type: 'challenge'
    },
    {
      id: 4,
      title: 'Geografia do Brasil',
      subtitle: 'Climas, Relevo, Hidrografia, Biomas e Regiões',
      icon: '🗺️',
      keywords: ['clima', 'hidrografia', 'regiões', 'cartografia', 'continente'],
      type: 'challenge'
    },
    {
      id: 5,
      title: 'Geografia Humana & Global',
      subtitle: 'Urbanização, Demografia, Geopolítica e Globalização',
      icon: '🏙️',
      keywords: ['urbanização', 'demografia', 'geopolítica', 'globalização', 'população'],
      type: 'challenge'
    },
    {
      id: 6,
      title: 'Baú de Humanidades',
      subtitle: 'Recompensa Bônus: Atlas Histórico & Repertório Sociocultural',
      icon: '🎁',
      type: 'chest',
      bonusXp: 100
    },
    {
      id: 7,
      title: 'Filosofia & Sociologia',
      subtitle: 'Ética, Iluminismo, Cidadania, Cultura e Estrutura Social',
      icon: '🤔',
      keywords: ['filosofia', 'ética', 'iluminismo', 'existencialismo', 'cultura', 'sociologia', 'família', 'desigualdade', 'trabalho'],
      type: 'challenge'
    },
    {
      id: 8,
      title: 'Desafio Mestre de Humanas',
      subtitle: 'Sociedade, Cidadania e Análise Crítica Contemporânea',
      icon: '🏆',
      type: 'boss'
    }
  ],

  simulado: [
    {
      id: 1,
      title: 'Módulo 1: Linguagens ENEM',
      subtitle: 'Interpretação e Competências de Linguagens',
      icon: '📝',
      keywords: ['linguagens', 'português', 'literatura', 'inglês', 'artes'],
      type: 'challenge'
    },
    {
      id: 2,
      title: 'Módulo 2: Ciências Humanas ENEM',
      subtitle: 'História, Geografia, Filosofia e Sociologia',
      icon: '📜',
      keywords: ['humanas', 'história', 'geografia', 'filosofia', 'sociologia'],
      type: 'challenge'
    },
    {
      id: 3,
      title: 'Módulo 3: Ciências da Natureza ENEM',
      subtitle: 'Física, Química e Biologia Aplicadas',
      icon: '🧪',
      keywords: ['natureza', 'física', 'química', 'biologia'],
      type: 'challenge'
    },
    {
      id: 4,
      title: 'Módulo 4: Matemática ENEM',
      subtitle: 'Álgebra, Geometria e Raciocínio Quantitativo',
      icon: '📐',
      keywords: ['matemática', 'álgebra', 'geometria', 'cálculo', 'estatística'],
      type: 'challenge'
    },
    {
      id: 5,
      title: 'Baú Estratégico ENEM',
      subtitle: 'Recompensa Bônus: Guia de Gestão de Tempo e TRI',
      icon: '🎁',
      type: 'chest',
      bonusXp: 150
    },
    {
      id: 6,
      title: 'Grande Simulado Geral ENEM',
      subtitle: '10 Questões Integradas • Pontuação Simulada 0 a 1000',
      icon: '🎯',
      type: 'boss'
    }
  ]
};

// --------------------------------------------------------------------------
// NORMALIZAÇÃO DE DESAFIOS CARREGADOS DO BANCO DE DADOS
// --------------------------------------------------------------------------
function normalizeChallenge(c) {
  const rawSub = (c.subject || '').trim();
  let subject = rawSub;
  if (!subject) {
    const mod = Number(c.module_id || c.moduleId || 1);
    if (mod === 1) subject = 'Português';
    else if (mod === 2) subject = 'Matemática';
    else if (mod === 3) subject = 'Ciências da Natureza';
    else if (mod === 4) subject = 'Ciências Humanas';
    else subject = 'Geral';
  }

  // Mapeia para grande área BNCC
  let areaKey = 'linguagens';
  if (['Português', 'Literatura', 'Inglês', 'Artes', 'Educação Física', 'Linguagens'].includes(subject)) {
    areaKey = 'linguagens';
  } else if (subject === 'Matemática') {
    areaKey = 'matematica';
  } else if (['Física', 'Química', 'Biologia', 'Ciências da Natureza'].includes(subject)) {
    areaKey = 'natureza';
  } else if (['História', 'Geografia', 'Filosofia', 'Sociologia', 'Ciências Humanas'].includes(subject)) {
    areaKey = 'humanas';
  } else {
    areaKey = 'simulado';
  }

  return {
    id: c.id,
    moduleId: Number(c.moduleId || c.module_id || 1),
    subject,
    areaKey,
    title: c.title || `${subject} #${c.id}`,
    question: c.question || c.text || '',
    optionA: c.optionA ?? c.option_a ?? '',
    optionB: c.optionB ?? c.option_b ?? '',
    optionC: c.optionC ?? c.option_c ?? '',
    optionD: c.optionD ?? c.option_d ?? '',
    correctAnswer: (c.correctAnswer || c.correct_answer || 'A').toUpperCase(),
    difficulty: Number(c.difficulty || 2),
    xpReward: Number(c.xpReward || c.xp_reward || 15),
    explanation: c.explanation || c.description ||
      `A alternativa correta é a (${(c.correctAnswer || c.correct_answer || 'A').toUpperCase()}). Compreender este conceito consolida as competências essenciais da BNCC em ${subject}.`
  };
}

// Notificações escolares iniciais
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Nova Lista de Exercícios em Física',
    message: 'Prof. Pedro Brandão disponibilizou desafios práticos sobre Circuitos Elétricos e 1ª Lei de Ohm.',
    time: 'Há 25 min',
    icon: '⚡',
    unread: true
  },
  {
    id: 2,
    title: 'Sequência de Estudos Mantida! 🔥',
    message: 'Parabéns! Você completou 7 dias consecutivos de estudos no Centro Educa Mais Paulo Freire.',
    time: 'Hoje, 09:30',
    icon: '🔥',
    unread: true
  },
  {
    id: 3,
    title: 'Simulado Multidisciplinar ENEM Liberado',
    message: 'Teste seus limites no novo Simulado Geral de 10 questões com nota estimada de 0 a 1000.',
    time: 'Ontem',
    icon: '🏆',
    unread: true
  },
  {
    id: 4,
    title: 'Avanço de Nível Registrado',
    message: 'Você atingiu o Nível 5 com 2.450 XP acumulados! Continue praticando.',
    time: '2 dias atrás',
    icon: '⭐',
    unread: false
  }
];

function StudentDashboard({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || { name: 'Amberson Rogers', level: 5, xp: 2450 });
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(DEFAULT_RANKING);

  // --------------------------------------------------------------------------
  // CONTROLE DE TELAS & NAVEGAÇÃO REATIVA
  // --------------------------------------------------------------------------
  const [sidebarTab, setSidebarTab] = useState('trilhas'); // 'trilhas' | 'ranking' | 'perfil'
  const [viewMode, setViewMode] = useState('hub'); // 'hub' | 'quiz' | 'simulado_result'
  const [selectedAreaKey, setSelectedAreaKey] = useState('natureza'); // área ativa da BNCC
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Progresso individual por disciplina na trilha
  const [trailProgress, setTrailProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('progressed_trail_progress');
      return saved ? JSON.parse(saved) : { linguagens: 3, matematica: 2, natureza: 4, humanas: 2, simulado: 1 };
    } catch (_) {
      return { linguagens: 3, matematica: 2, natureza: 4, humanas: 2, simulado: 1 };
    }
  });

  // Baús de recompensas resgatados
  const [openedChests, setOpenedChests] = useState(() => {
    try {
      const saved = localStorage.getItem('progressed_opened_chests');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  // Histórico anti-repetição de questões respondidas
  const [answeredChallengeIds, setAnsweredChallengeIds] = useState(() => {
    try {
      const saved = localStorage.getItem('progressed_answered_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Etapa ativa sendo jogada
  const [currentActiveStage, setCurrentActiveStage] = useState(null);

  // Filtros da tela de ranking
  const [rankingScope, setRankingScope] = useState('escola'); // 'global' | 'escola'
  const [rankingSearch, setRankingSearch] = useState('');

  // Seletor de Avatar do Perfil
  const [selectedAvatarEmoji, setSelectedAvatarEmoji] = useState('🎓');

  // Estados do Quiz
  const [quizMode, setQuizMode] = useState('track'); // 'track' | 'simulado'
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeQuizList, setActiveQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Estatísticas da sessão
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    xpGained: 0,
    answers: []
  });

  useEffect(() => {
    loadUserProfile();
    loadChallenges();
    loadRanking();
  }, []);

  // Temporizador do Quiz
  useEffect(() => {
    if (viewMode !== 'quiz' || timerPaused) return;

    if (timeLeft <= 0) {
      setTimeExpired(true);
      setTimerPaused(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, timerPaused, timeLeft]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data) {
        setCurrentUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.warn('Perfil local ativo:', error.message);
    }
  };

  const loadChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setChallenges(response.data.map(normalizeChallenge));
      } else {
        setChallenges(DEFAULT_CHALLENGES.map(normalizeChallenge));
      }
    } catch (error) {
      setChallenges(DEFAULT_CHALLENGES.map(normalizeChallenge));
    } finally {
      setLoading(false);
    }
  };

  const loadRanking = async () => {
    try {
      const response = await api.get('/ranking');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setRanking(response.data);
      } else {
        setRanking(DEFAULT_RANKING);
      }
    } catch (error) {
      setRanking(DEFAULT_RANKING);
    }
  };

  // --------------------------------------------------------------------------
  // CONTROLE DE NAVEGAÇÃO & HOME
  // --------------------------------------------------------------------------
  const handleGoHome = () => {
    playClickSound();
    setSidebarTab('trilhas');
    setViewMode('hub');
    setShowNotifications(false);
  };

  const handleToggleNotifications = () => {
    playClickSound();
    setShowNotifications(!showNotifications);
  };

  const handleClearNotifications = () => {
    playClickSound();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // --------------------------------------------------------------------------
  // MECÂNICA DINÂMICA DE ETAPAS DA TRILHA & SELEÇÃO INTELIGENTE DE QUESTÕES
  // --------------------------------------------------------------------------
  const getOffsetClass = (idx) => {
    const seq = ['offset-center', 'offset-left', 'offset-center', 'offset-right'];
    return seq[idx % seq.length];
  };

  const advanceStageProgress = (areaKey, nextStageId) => {
    setTrailProgress(prev => {
      const maxStage = (BNCC_TRAIL_STAGES[areaKey] || []).length;
      const updated = {
        ...prev,
        [areaKey]: Math.min(nextStageId, maxStage)
      };
      try {
        localStorage.setItem('progressed_trail_progress', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleNodeClick = (stage) => {
    playClickSound();
    const currentStageIndex = trailProgress[selectedAreaKey] || 1;
    const currentAreaConfig = BNCC_AREAS.find(a => a.key === selectedAreaKey);

    // Nó do Baú de Recompensa
    if (stage.type === 'chest') {
      if (stage.id > currentStageIndex) {
        alert(`🔒 Baú Bloqueado: Conclua as etapas anteriores de ${currentAreaConfig?.shortName || 'Trilha'} para abrir este baú!`);
        return;
      }
      const chestKey = `${selectedAreaKey}_${stage.id}`;
      if (openedChests[chestKey]) {
        alert(`🎁 Baú já aberto: Você já resgatou os +${stage.bonusXp || 100} XP desta etapa.`);
        return;
      }
      playLevelUpSound();
      const bonus = stage.bonusXp || 100;
      const newXp = (currentUser.xp || 420) + bonus;
      const newLevel = Math.floor(newXp / LEVEL_XP) + 1;
      const updated = { ...currentUser, xp: newXp, level: newLevel };
      setCurrentUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setOpenedChests(prev => {
        const next = { ...prev, [chestKey]: true };
        try {
          localStorage.setItem('progressed_opened_chests', JSON.stringify(next));
        } catch (_) {}
        return next;
      });
      alert(`🎉 BAÚ DE RECOMPENSAS DESBLOQUEADO!\n\nVocê ganhou +${bonus} XP!\n\n💡 Dica BNCC: ${stage.subtitle}`);
      if (stage.id === currentStageIndex) {
        advanceStageProgress(selectedAreaKey, stage.id + 1);
      }
      return;
    }

    // Nó Bloqueado
    if (stage.id > currentStageIndex) {
      const currentAreaStages = BNCC_TRAIL_STAGES[selectedAreaKey] || [];
      const activeStageObj = currentAreaStages.find(s => s.id === currentStageIndex);
      alert(`🔒 Etapa Bloqueada: Conclua a Etapa ${currentStageIndex} ("${activeStageObj?.title || 'Missão Atual'}") para desbloquear!`);
      return;
    }

    // Inicia o Quiz desta etapa específica
    handleStartStageQuiz(selectedAreaKey, stage);
  };

  const handleStartStageQuiz = (areaKey, stage) => {
    playClickSound();

    // 1. Filtrar desafios pertencentes a esta grande área
    let areaChallenges = challenges.filter(c => {
      if (areaKey === 'linguagens') {
        return ['Português', 'Literatura', 'Inglês', 'Artes', 'Educação Física', 'Linguagens'].includes(c.subject) || c.moduleId === 1;
      }
      if (areaKey === 'matematica') {
        return c.subject === 'Matemática' || c.moduleId === 2;
      }
      if (areaKey === 'natureza') {
        return ['Física', 'Química', 'Biologia', 'Ciências da Natureza'].includes(c.subject) || c.moduleId === 3;
      }
      if (areaKey === 'humanas') {
        return ['História', 'Geografia', 'Filosofia', 'Sociologia', 'Ciências Humanas'].includes(c.subject) || c.moduleId === 4;
      }
      if (areaKey === 'simulado') {
        return true;
      }
      return true;
    });

    if (areaChallenges.length === 0) {
      areaChallenges = challenges;
    }

    // 2. Pontuar desafios por afinidade com os keywords desta etapa específica
    const stageKeywords = stage.keywords || [];
    const scored = areaChallenges.map(c => {
      let score = 0;
      const searchString = `${c.title || ''} ${c.question || ''} ${c.subject || ''}`.toLowerCase();
      
      for (const kw of stageKeywords) {
        if (searchString.includes(kw.toLowerCase())) {
          score += 25;
        }
      }

      // Se for Boss ou Simulado Geral, diversifica entre todas as questões
      if (stage.type === 'boss') {
        score += 10;
      }

      // Sistema Anti-Repetição: Prioriza fortemente questões ainda não respondidas
      if (!answeredChallengeIds.includes(c.id)) {
        score += 50;
      }

      return { ...c, score };
    });

    // Ordena decrescente pelo score e aplica sorteio para variedade contínua
    scored.sort((a, b) => b.score - a.score || (0.5 - Math.random()));

    // Quantidade de questões por sessão:
    // Simulado Geral ENEM: 10 questões
    // Desafio Mestre (Boss): 6 questões
    // Etapa regular: 4 questões
    const qCount = areaKey === 'simulado' && stage.type === 'boss' ? 10 : stage.type === 'boss' ? 6 : 4;
    const selectedQuestions = scored.slice(0, qCount);

    setCurrentActiveStage(stage);
    setCurrentTrack({
      name: `${stage.title}`,
      icon: stage.icon,
      subtitle: `${stage.subtitle} • ${BNCC_AREAS.find(a => a.key === areaKey)?.name || 'BNCC'}`
    });
    setQuizMode(areaKey === 'simulado' && stage.type === 'boss' ? 'simulado' : 'track');
    setActiveQuizList(selectedQuestions);
    setCurrentIndex(0);
    setTimeLeft(30);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setViewMode('quiz');
  };

  // Botão Roleta / Desafio Relâmpago estilo Perguntados
  const handleRandomQuickChallenge = () => {
    playClickSound();
    if (challenges.length === 0) return;

    // Prioriza questões ainda não respondidas de qualquer matéria
    const unAnswered = challenges.filter(c => !answeredChallengeIds.includes(c.id));
    const pool = unAnswered.length > 0 ? unAnswered : challenges;
    const randomQ = pool[Math.floor(Math.random() * pool.length)];

    const quickStage = {
      id: 99,
      title: `⚡ Desafio Relâmpago em ${randomQ.subject}`,
      subtitle: `Questão Surpresa da BNCC • +20 XP Bônus`,
      icon: '⚡',
      type: 'challenge'
    };

    setCurrentActiveStage(quickStage);
    setCurrentTrack({
      name: quickStage.title,
      icon: '⚡',
      subtitle: quickStage.subtitle
    });
    setQuizMode('track');
    setActiveQuizList([randomQ]);
    setCurrentIndex(0);
    setTimeLeft(25);
    setTimerPaused(false);
    setTimeExpired(false);
    setDisabled(false);
    setSessionStats({ correct: 0, wrong: 0, xpGained: 0, answers: [] });
    setViewMode('quiz');
  };

  // Submissão de Desafio
  const handleChallengeSubmit = async (challengeId, answer) => {
    setTimerPaused(true);
    setDisabled(true);

    // Registra ID da questão no histórico anti-repetição
    setAnsweredChallengeIds(prev => {
      const next = [...new Set([...prev, challengeId])];
      try {
        localStorage.setItem('progressed_answered_ids', JSON.stringify(next.slice(-80)));
      } catch (_) {}
      return next;
    });

    const currentQ = activeQuizList[currentIndex];
    const isCorrect = currentQ && (answer || '').toUpperCase() === currentQ.correctAnswer;
    const xpReward = currentQ ? currentQ.xpReward : 15;

    setSessionStats(prev => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrong: !isCorrect ? prev.wrong + 1 : prev.wrong,
      xpGained: isCorrect ? prev.xpGained + xpReward : prev.xpGained,
      answers: [...prev.answers, { challengeId, selected: answer, isCorrect, subject: currentQ?.subject }]
    }));

    try {
      const response = await api.post(`/challenges/${challengeId}/submit`, { answer });
      if (response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (isCorrect) {
        const newXp = (currentUser.xp || 2450) + xpReward;
        const newLevel = Math.floor(newXp / LEVEL_XP) + 1;
        const updated = { ...currentUser, xp: newXp, level: newLevel };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } finally {
      setDisabled(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < activeQuizList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(30);
      setTimeExpired(false);
      setTimerPaused(false);
      setDisabled(false);
    } else {
      playLevelUpSound();
      if (quizMode === 'simulado') {
        setViewMode('simulado_result');
      } else {
        // Se a etapa concluída era a etapa ativa atual, avança para a próxima etapa na trilha!
        const currentActiveStageIndex = trailProgress[selectedAreaKey] || 1;
        if (currentActiveStage && currentActiveStage.id >= currentActiveStageIndex) {
          advanceStageProgress(selectedAreaKey, currentActiveStage.id + 1);
        }
        alert(`🎉 Parabéns! Você concluiu a etapa "${currentActiveStage?.title || 'Missão'}" com sucesso!\n\nVocê consolidou novas competências curriculares da BNCC.`);
        setViewMode('hub');
      }
    }
  };

  // Níveis e Metas
  const currentLevel = currentUser?.level || 5;
  const currentXp = currentUser?.xp || 2450;
  const targetXp = currentLevel * LEVEL_XP + 1000;
  const xpNeeded = Math.max(0, targetXp - currentXp);
  const progressPercent = Math.min(100, Math.round((currentXp / targetXp) * 100));

  // Lista consolidada de ranking
  const studentRankingList = useMemo(() => {
    const list = [
      { id: 101, name: 'Lucas Mendes', level: 8, xp: 3250, school: 'CE Paulo Freire', accuracy: 94 },
      { id: 102, name: 'Mariana Silva', level: 7, xp: 2980, school: 'CE Paulo Freire', accuracy: 91 },
      { id: 103, name: 'Pedro Henrique', level: 7, xp: 2750, school: 'CE Paulo Freire', accuracy: 88 },
      { id: 104, name: 'Beatriz Oliveira', level: 6, xp: 2450, school: 'CE Paulo Freire', accuracy: 85 },
      { id: 105, name: currentUser.name || 'Amberson Rogers', level: currentLevel, xp: currentXp, school: 'CE Paulo Freire', accuracy: 82, isCurrent: true },
      { id: 106, name: 'Weldes Reis', level: 5, xp: 2100, school: 'CE Paulo Freire', accuracy: 79 },
      { id: 107, name: 'Kelly Lorrany', level: 5, xp: 1950, school: 'CE Paulo Freire', accuracy: 76 },
      { id: 108, name: 'Ana Beatriz Sousa', level: 4, xp: 1600, school: 'CE Paulo Freire', accuracy: 72 }
    ];

    if (!rankingSearch) return list;
    return list.filter(item => item.name.toLowerCase().includes(rankingSearch.toLowerCase()));
  }, [currentUser, currentLevel, currentXp, rankingSearch]);

  // Contagem real de questões por grande área curricular
  const countsByArea = useMemo(() => {
    return {
      linguagens: challenges.filter(c => ['Português', 'Literatura', 'Inglês', 'Artes', 'Educação Física', 'Linguagens'].includes(c.subject) || c.moduleId === 1).length || 33,
      matematica: challenges.filter(c => c.subject === 'Matemática' || c.moduleId === 2).length || 22,
      natureza: challenges.filter(c => ['Física', 'Química', 'Biologia', 'Ciências da Natureza'].includes(c.subject) || c.moduleId === 3).length || 34,
      humanas: challenges.filter(c => ['História', 'Geografia', 'Filosofia', 'Sociologia', 'Ciências Humanas'].includes(c.subject) || c.moduleId === 4).length || 33,
      simulado: challenges.length || 131
    };
  }, [challenges]);

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO: QUIZ / DESAFIO ATIVO
  // --------------------------------------------------------------------------
  if (viewMode === 'quiz' && activeQuizList[currentIndex]) {
    const currentQ = activeQuizList[currentIndex];
    return (
      <div className="quiz-page-container min-h-screen bg-[#030712] text-white p-4 sm:p-6 lg:p-8">
        <ChallengeCard
          challenge={currentQ}
          currentIndex={currentIndex}
          totalQuestions={activeQuizList.length}
          timeLeft={timeLeft}
          timerPaused={timerPaused}
          onSubmit={handleChallengeSubmit}
          onNext={handleNextQuestion}
          onExit={handleGoHome}
          isLastQuestion={currentIndex >= activeQuizList.length - 1}
          disabled={disabled}
          timeExpired={timeExpired}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO: RESULTADO DO SIMULADO
  // --------------------------------------------------------------------------
  if (viewMode === 'simulado_result') {
    const totalQ = sessionStats.correct + sessionStats.wrong || 1;
    const accuracy = Math.round((sessionStats.correct / totalQ) * 100);
    const enemScore = Math.min(1000, Math.round(340 + (accuracy * 6.2) + (sessionStats.xpGained * 0.4)));

    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-3xl border border-sky-500/30 bg-[#0b1120] p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-4xl shadow-glow">
            🏆
          </div>
          <h2 className="text-3xl font-extrabold text-white">Simulado BNCC Concluído!</h2>
          <p className="text-slate-300 text-sm">Desempenho consolidado com base na matriz curricular do Ensino Médio.</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400">Nota Estimada</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{enemScore}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400">Taxa de Acertos</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{accuracy}%</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/5">
              <p className="text-xs text-slate-400">XP Ganho</p>
              <p className="text-2xl font-bold text-sky-400 mt-1">+{sessionStats.xpGained}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleStartAreaQuiz('simulado')}
              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-white transition shadow-lg"
            >
              🔄 Repetir Simulado
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 transition"
            >
              🏠 Voltar ao Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // HUB PRINCIPAL DO ESTUDANTE
  // --------------------------------------------------------------------------
  return (
    <div className="student-dashboard-layout">
      {/* 1. BARRA LATERAL ESQUERDA (Navegação Reativa) */}
      <aside className="student-sidebar">
        {/* Logotipo que volta ao Início */}
        <button className="sidebar-logo" onClick={handleGoHome} title="Ir para a Tela Inicial">
          <div className="sidebar-logo-icon">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <path d="M12 8H24C28.4183 8 32 11.5817 32 16C32 20.4183 28.4183 24 24 24H18V32H12V8Z" fill="white" />
              <path d="M18 14H24C25.1046 14 26 14.8954 26 16C26 17.1046 25.1046 18 24 18H18V14Z" fill="#0284c7" />
            </svg>
          </div>
          <div className="sidebar-logo-text">Progress<span>Ed</span></div>
        </button>

        {/* Itens de Navegação que trocam a tela dinamicamente */}
        <nav className="sidebar-nav">
          <button
            className={`nav-item-btn ${sidebarTab === 'trilhas' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setSidebarTab('trilhas');
              setViewMode('hub');
            }}
            title="Trilhas Curriculares e Missões"
          >
            <span className="nav-icon">🗺️</span>
            <span>Trilhas</span>
          </button>

          <button
            className={`nav-item-btn ${sidebarTab === 'ranking' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setSidebarTab('ranking');
              setViewMode('hub');
            }}
            title="Classificação Geral da Escola"
          >
            <span className="nav-icon">🏆</span>
            <span>Ranking</span>
          </button>

          <button
            className={`nav-item-btn ${sidebarTab === 'perfil' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setSidebarTab('perfil');
              setViewMode('hub');
            }}
            title="Meu Perfil e Medalhas"
          >
            <span className="nav-icon">👤</span>
            <span>Perfil</span>
          </button>
        </nav>

        {/* Card Sequência de 7 Dias */}
        <div className="sidebar-streak-card">
          <div className="streak-top-row">
            <span>🔥</span>
            <span>Sequência atual</span>
          </div>
          <div className="streak-days-count">7 dias</div>
          <div className="streak-week-dots">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => (
              <div key={idx} className={`week-day-dot ${idx < 6 ? 'done' : 'today'}`}>
                ✓
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. VIEWPORT PRINCIPAL */}
      <main className="student-viewport">
        {/* Top Header */}
        <header className="student-top-header">
          <div>
            <h1 className="greeting-title">
              Olá, {currentUser.name || 'Amberson'}! <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="greeting-subtitle">
              {sidebarTab === 'ranking'
                ? 'Confira o pódio e a classificação da sua turma no Centro Educa Mais Paulo Freire.'
                : sidebarTab === 'perfil'
                ? 'Acompanhe seu avanço curricular, conquistas e proficiência por área da BNCC.'
                : 'Trilhas do Ensino Médio Integral • Conquiste XP e avance nos níveis da BNCC!'}
            </p>
          </div>

          <div className="top-header-widgets">
            <div className="energy-badge" title="Energia / Pontos de Ação">
              <span>⚡</span>
              <span>150</span>
            </div>

            {/* Sino de Notificações com Drawer Retrátil */}
            <button
              className={`bell-button ${showNotifications ? 'active' : ''}`}
              onClick={handleToggleNotifications}
              title="Notificações Escolares"
            >
              <span>🔔</span>
              {unreadCount > 0 && <span className="bell-badge-count">{unreadCount}</span>}
            </button>

            {/* Dropdown de Notificações */}
            {showNotifications && (
              <div className="notifications-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="notifications-header-bar">
                  <h4>
                    <span>🔔</span>
                    <span>Recados & Alertas</span>
                  </h4>
                  {unreadCount > 0 && (
                    <button className="btn-clear-notifications" onClick={handleClearNotifications}>
                      Marcar lidas
                    </button>
                  )}
                </div>

                <div className="notifications-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item-card ${n.unread ? 'unread' : ''}`}
                      onClick={() => {
                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                        if (n.title.includes('Física')) handleStartAreaQuiz('natureza', 5);
                        if (n.title.includes('Simulado')) handleStartAreaQuiz('simulado');
                      }}
                    >
                      <span className="notif-icon-box">{n.icon}</span>
                      <div className="notif-content-text">
                        <h6>{n.title}</h6>
                        <p>{n.message}</p>
                        <span className="notif-time-tag">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfil Rápido */}
            <div
              className="user-profile-pill"
              onClick={() => {
                playClickSound();
                setSidebarTab('perfil');
              }}
              title="Ir para o Perfil"
            >
              <div className="user-avatar-circle">
                {selectedAvatarEmoji}
              </div>
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                {currentUser.name?.split(' ')[0] || 'Aluno'}
              </span>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* ABA 1: TRILHAS CURRICULARES (DUOLINGO & PERGUNTADOS GAMIFIED)     */}
        {/* ================================================================ */}
        {sidebarTab === 'trilhas' && (
          <div>
            {/* Banner Nível 5 & XP */}
            <div className="level-banner-card">
              <div className="gold-hexagon-badge">
                <span className="hexagon-number">{currentLevel}</span>
              </div>
              <div className="level-info-content">
                <div className="level-top-status">
                  <div>
                    <span className="level-badge-title">NÍVEL ATUAL</span>
                    <h2 className="level-name-display">Nível {currentLevel} • Explorador BNCC</h2>
                  </div>
                  <div className="xp-ratio-text">
                    XP: <span>{currentXp}</span>/{targetXp}
                  </div>
                </div>

                <div className="level-progress-bar-container">
                  <div className="level-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                <p className="level-progress-subtext">Faltam {xpNeeded} XP para o próximo nível</p>
              </div>
            </div>

            {/* SELETOR DE DISCIPLINAS BNCC (ESTILO PERGUNTADOS / TRIVIA CRACK) */}
            <section className="perguntados-category-bar">
              <div className="category-bar-header">
                <h3>
                  <span>🎯</span>
                  <span>Áreas do Conhecimento (Ensino Médio Integral)</span>
                </h3>
                {/* Botão Roleta / Desafio Relâmpago */}
                <button
                  type="button"
                  className="btn-random-wheel"
                  onClick={handleRandomQuickChallenge}
                  title="Gira a roleta e responde a uma questão aleatória com bônus de XP!"
                >
                  <span>⚡</span>
                  <span>Roleta / Desafio Relâmpago</span>
                </button>
              </div>

              {/* Grid das 5 Grandes Áreas */}
              <div className="disciplines-cards-scroll">
                {BNCC_AREAS.map((area) => {
                  const isActive = selectedAreaKey === area.key;
                  const count = countsByArea[area.key] || 25;

                  return (
                    <div
                      key={area.key}
                      className={`discipline-card-pill ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        playClickSound();
                        setSelectedAreaKey(area.key);
                      }}
                    >
                      <div>
                        <span className="card-top-icon">{area.icon}</span>
                        <h5>{area.shortName}</h5>
                        <p>{area.subtitle}</p>
                      </div>
                      <span className="question-counter-badge">
                        {count} desafios disponíveis
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CAMINHO EM ZIGUE-ZAGUE ESTILO DUOLINGO - DINÂMICO POR DISCIPLINA */}
            <section className="duolingo-trail-section">
              <div className="trail-section-header">
                <div>
                  <h4>
                    Trilha: {BNCC_AREAS.find(a => a.key === selectedAreaKey)?.name}
                  </h4>
                  <p>
                    {BNCC_AREAS.find(a => a.key === selectedAreaKey)?.subtitle} • Habilidade: {BNCC_AREAS.find(a => a.key === selectedAreaKey)?.competence}
                  </p>
                </div>
                {(() => {
                  const currentStages = BNCC_TRAIL_STAGES[selectedAreaKey] || [];
                  const currentStageIdx = trailProgress[selectedAreaKey] || 1;
                  const activeStage = currentStages.find(s => s.id === currentStageIdx) || currentStages[0];
                  return (
                    <button
                      className="btn-view-available-trails"
                      onClick={() => activeStage && handleNodeClick(activeStage)}
                    >
                      <span>🚀 Continuar Jornada</span>
                    </button>
                  );
                })()}
              </div>

              {/* Nós Conectados em zigue-zague com base no currículo da matéria */}
              <div className="winding-path-container">
                {(BNCC_TRAIL_STAGES[selectedAreaKey] || []).map((stage, idx) => {
                  const currentStageIdx = trailProgress[selectedAreaKey] || 1;
                  const isCompleted = stage.id < currentStageIdx;
                  const isActive = stage.id === currentStageIdx;
                  const isLocked = stage.id > currentStageIdx;
                  const offsetClass = getOffsetClass(idx);

                  // 1. Tipo: Baú de Recompensa
                  if (stage.type === 'chest') {
                    const chestKey = `${selectedAreaKey}_${stage.id}`;
                    const isOpened = openedChests[chestKey];
                    return (
                      <div
                        key={stage.id}
                        className={`duolingo-level-node chest ${offsetClass} ${isOpened ? 'completed' : isLocked ? 'locked' : 'active'}`}
                        onClick={() => handleNodeClick(stage)}
                        title={isOpened ? 'Baú já resgatado!' : isLocked ? 'Complete as etapas anteriores para abrir' : 'Clique para abrir o Baú de Recompensas!'}
                      >
                        <div className="node-circle-button">
                          {isOpened ? '✨' : '🎁'}
                        </div>
                        <span className="node-title-badge text-amber-300 font-bold">
                          {stage.title}
                        </span>
                        <span className="text-[10px] font-extrabold mt-1 tracking-wider text-amber-400">
                          {isOpened ? '✓ RESGATADO (+XP)' : isLocked ? '🔒 BLOQUEADO' : '🎁 ABRIR BAÚ (+100 XP)'}
                        </span>
                      </div>
                    );
                  }

                  // 2. Tipo: Desafio Mestre / Boss Final da Trilha
                  if (stage.type === 'boss') {
                    return (
                      <div
                        key={stage.id}
                        className={`duolingo-level-node ${isActive ? 'active' : isCompleted ? 'completed' : 'locked'} ${offsetClass}`}
                        onClick={() => handleNodeClick(stage)}
                        title={isCompleted ? `${stage.title} (Concluído)` : isActive ? `Desafio Mestre: ${stage.title}` : 'Complete as etapas anteriores'}
                      >
                        {isActive && (
                          <div className="active-student-pin">
                            <span>{selectedAvatarEmoji}</span>
                            <span>VOCÊ ESTÁ AQUI</span>
                          </div>
                        )}
                        <div className="node-circle-button">
                          {isCompleted ? '🏆' : isActive ? (stage.icon || '👑') : '🔒'}
                        </div>
                        <span className={`node-title-badge ${isActive ? 'font-bold text-amber-300' : isCompleted ? 'text-emerald-400' : ''}`}>
                          {stage.title}
                        </span>
                        {isCompleted && <div className="node-stars-row">⭐⭐⭐</div>}
                        {isActive && (
                          <span className="text-[10px] text-amber-400 font-extrabold mt-1 tracking-wider animate-pulse">
                            🔥 DESAFIO MESTRE
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-[10px] text-slate-500 font-medium mt-1">
                            Etapa Final
                          </span>
                        )}
                      </div>
                    );
                  }

                  // 3. Etapa Regular de Conteúdo Curricular
                  return (
                    <div
                      key={stage.id}
                      className={`duolingo-level-node ${isActive ? 'active' : isCompleted ? 'completed' : 'locked'} ${offsetClass}`}
                      onClick={() => handleNodeClick(stage)}
                      title={`Etapa ${stage.id}: ${stage.title} - ${stage.subtitle}`}
                    >
                      {isActive && (
                        <div className="active-student-pin">
                          <span>{selectedAvatarEmoji}</span>
                          <span>VOCÊ ESTÁ AQUI</span>
                        </div>
                      )}
                      <div className="node-circle-button">
                        {isCompleted ? '✓' : isActive ? (stage.icon || '🧠') : '🔒'}
                      </div>
                      <span className={`node-title-badge ${isActive ? 'font-bold text-sky-300' : ''}`}>
                        {stage.id}. {stage.title}
                      </span>
                      {isCompleted && <div className="node-stars-row">⭐⭐⭐</div>}
                      {isActive && (
                        <span className="text-[10px] text-sky-400 font-extrabold mt-1 tracking-wider">
                          CLIQUE PARA JOGAR
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4 Cards de Métricas Inferiores */}
            <div className="student-metrics-row">
              <div className="metric-summary-card">
                <div className="metric-icon-square green">✓</div>
                <div className="metric-text-details">
                  <h5>Aulas concluídas</h5>
                  <p>24</p>
                </div>
              </div>

              <div className="metric-summary-card">
                <div className="metric-icon-square blue">✏️</div>
                <div className="metric-text-details">
                  <h5>Exercícios feitos</h5>
                  <p>128</p>
                </div>
              </div>

              <div className="metric-summary-card">
                <div className="metric-icon-square purple">⭐</div>
                <div className="metric-text-details">
                  <h5>XP conquistado</h5>
                  <p>{currentXp}</p>
                </div>
              </div>

              <div className="metric-summary-card">
                <div className="metric-icon-square amber">⏱️</div>
                <div className="metric-text-details">
                  <h5>Tempo de estudo</h5>
                  <p>18h 45m</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ABA 2: RANKING COMPLETO COM PÓDIO (ESTILO JOGO / LEADERBOARD)    */}
        {/* ================================================================ */}
        {sidebarTab === 'ranking' && (
          <div className="ranking-view-fullscreen">
            <div className="ranking-view-header">
              <h2>🏆 Quadro de Honra & Ranking da Turma</h2>
              <p>Centro Educa Mais Paulo Freire • Acompanhamento de Pontuação e Aproveitamento</p>
            </div>

            {/* PÓDIO 1º, 2º e 3º LUGARES */}
            <div className="podium-container">
              {/* 2º Lugar */}
              <div className="podium-step-card second">
                <div className="podium-avatar-wrapper">
                  <div className="podium-avatar-bubble second">
                    👩‍🎓
                  </div>
                  <span className="podium-crown-badge">🥈</span>
                </div>
                <div className="podium-pedestal-box">
                  <p className="podium-student-name">Mariana Silva</p>
                  <span className="podium-student-xp">2.980 XP</span>
                  <span className="text-xs text-slate-400 mt-1">Nível 7</span>
                </div>
              </div>

              {/* 1º Lugar (Destaque Central Ouro) */}
              <div className="podium-step-card first">
                <div className="podium-avatar-wrapper">
                  <div className="podium-avatar-bubble first">
                    👑
                  </div>
                  <span className="podium-crown-badge">🥇</span>
                </div>
                <div className="podium-pedestal-box">
                  <p className="podium-student-name">Lucas Mendes</p>
                  <span className="podium-student-xp text-amber-400 font-extrabold text-base">3.250 XP</span>
                  <span className="text-xs text-slate-300 mt-1">Nível 8 • Líder</span>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="podium-step-card third">
                <div className="podium-avatar-wrapper">
                  <div className="podium-avatar-bubble third">
                    👨‍🎓
                  </div>
                  <span className="podium-crown-badge">🥉</span>
                </div>
                <div className="podium-pedestal-box">
                  <p className="podium-student-name">Pedro Henrique</p>
                  <span className="podium-student-xp">2.750 XP</span>
                  <span className="text-xs text-slate-400 mt-1">Nível 7</span>
                </div>
              </div>
            </div>

            {/* Tabela Completa de Ranking */}
            <div className="ranking-table-card">
              <div className="ranking-table-controls">
                <div className="ranking-filter-tabs" style={{ maxWidth: '240px', margin: 0 }}>
                  <button
                    className={`ranking-tab-btn ${rankingScope === 'escola' ? 'active' : ''}`}
                    onClick={() => setRankingScope('escola')}
                  >
                    Escola
                  </button>
                  <button
                    className={`ranking-tab-btn ${rankingScope === 'global' ? 'active' : ''}`}
                    onClick={() => setRankingScope('global')}
                  >
                    Maranhão / Global
                  </button>
                </div>

                <div className="ranking-search-bar">
                  <input
                    type="text"
                    placeholder="Buscar colega pelo nome..."
                    value={rankingSearch}
                    onChange={(e) => setRankingSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="ranking-list-items">
                {studentRankingList.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`ranking-item-row ${item.isCurrent ? 'current-user' : ''}`}
                  >
                    <span className={`ranking-position-badge ${idx < 3 ? 'crown' : ''}`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
                    </span>

                    <div className="ranking-user-meta">
                      <div className="ranking-avatar-thumb">
                        {item.name[0]}
                      </div>
                      <div className="ranking-user-names">
                        <h6>
                          {item.name} {item.isCurrent && <span className="text-sky-400 text-xs font-bold">(Você)</span>}
                        </h6>
                        <p>{item.school} • Nível {item.level} • {item.accuracy}% precisão</p>
                      </div>
                    </div>

                    <div className="ranking-xp-pill">
                      {item.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ABA 3: PERFIL DO ESTUDANTE & CONQUISTAS                          */}
        {/* ================================================================ */}
        {sidebarTab === 'perfil' && (
          <div className="profile-view-fullscreen">
            {/* Cartão de Identidade Estudantil */}
            <div className="profile-identity-card">
              <div className="profile-avatar-large">
                {selectedAvatarEmoji}
              </div>

              <div className="profile-identity-meta">
                <h2>{currentUser.name || 'Amberson Rogers'}</h2>
                <p>{currentUser.email || 'aluno@progressed.com'}</p>
                <div className="profile-school-tag">
                  <span>🏫</span>
                  <span>Centro Educa Mais Paulo Freire • 3º Ano Ensino Médio Integral</span>
                </div>

                {/* Seletor Rápido de Avatar */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Escolha seu Avatar:</span>
                  {['🎓', '🧠', '🚀', '⚡', '🔬', '⭐', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedAvatarEmoji(emoji);
                      }}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition ${
                        selectedAvatarEmoji === emoji ? 'border-sky-400 bg-sky-500/20' : 'border-white/10 bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar / Barras de Proficiência Curricular BNCC */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>Proficiência por Área da BNCC</span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-violet-300">Linguagens e suas Tecnologias</span>
                    <span className="text-violet-400">92% (Excelente)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-fuchsia-300">Matemática e suas Tecnologias</span>
                    <span className="text-fuchsia-400">78% (Bom)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-300">Ciências da Natureza</span>
                    <span className="text-emerald-400">68% (Em Desenvolvimento)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-amber-300">Ciências Humanas e Sociais</span>
                    <span className="text-amber-400">95% (Destaque)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Vitrine de Emblemas & Conquistas */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🏅</span>
                <span>Conquistas & Emblemas Desbloqueados</span>
              </h3>

              <div className="profile-badges-grid">
                <div className="badge-item-box">
                  <span className="badge-icon">🥇</span>
                  <h5>Pioneiro BNCC</h5>
                  <p>Completou a primeira trilha de desafios do ensino médio.</p>
                  <span className="badge-status-pill unlocked">DESBLOQUEADO</span>
                </div>

                <div className="badge-item-box">
                  <span className="badge-icon">🔥</span>
                  <h5>Fogo Sagrado</h5>
                  <p>Manteve 7 dias ininterruptos de ofensiva de estudos.</p>
                  <span className="badge-status-pill unlocked">DESBLOQUEADO</span>
                </div>

                <div className="badge-item-box">
                  <span className="badge-icon">🧠</span>
                  <h5>Mestre da Lógica</h5>
                  <p>Acertou 10 questões seguidas de raciocínio abstrato.</p>
                  <span className="badge-status-pill unlocked">DESBLOQUEADO</span>
                </div>

                <div className="badge-item-box">
                  <span className="badge-icon">🏆</span>
                  <h5>Gabarito ENEM</h5>
                  <p>Alcance 800+ pontos no Simulado Geral da BNCC.</p>
                  <span className="badge-status-pill progress">80% CONCLUÍDO</span>
                </div>
              </div>
            </div>

            {/* Botão de Logout */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={onLogout}
                className="px-6 py-3 rounded-xl bg-rose-900/40 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-900/60 transition flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
