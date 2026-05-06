export const engagementData = [
  { day: 'Jan 21', score: 50 },
  { day: '28 abr', score: 65 },
  { day: '5 mai', score: 72 },
  { day: '12 mai', score: 85 },
  { day: '19 mai', score: 90 },
];

export const topicsData = [
  { name: 'Células & Vida', completion: 90, fill: '#3b82f6' },
  { name: 'Ecossistemas', completion: 76, fill: '#10b981' },
  { name: 'Energia', completion: 55, fill: '#f59e0b' },
  { name: 'Forças', completion: 86, fill: '#8b5cf6' },
  { name: 'Ciências', completion: 72, fill: '#06b6d4' },
  { name: 'Método Cient.', completion: 95, fill: '#ec4899' },
];

export const activityData = [
  { name: 'Tarefas', value: 40, color: '#3b82f6' },
  { name: 'Avaliações', value: 25, color: '#8b5cf6' },
  { name: 'Discussões', value: 15, color: '#10b981' },
  { name: 'Vídeos', value: 10, color: '#f59e0b' },
  { name: 'Outros', value: 10, color: '#64748b' },
];

export const studentsList = [
  { id: 'AJ', name: 'Alden Johnson', score: '92%', status: 'Ativo', statusColor: 'status-active', color: '#3b82f6' },
  { id: 'SM', name: 'Sarah Miller', score: '85%', status: 'Ativo', statusColor: 'status-active', color: '#10b981' },
  { id: 'EW', name: 'Ethan Walker', score: '78%', status: 'Ativo', statusColor: 'status-active', color: '#8b5cf6' },
  { id: 'OL', name: 'Olivia Lewis', score: '62%', status: 'Precisa de Ajuda', statusColor: 'status-warning', color: '#3b82f6' },
  { id: 'JM', name: 'James Martinez', score: '55%', status: 'Precisa de Ajuda', statusColor: 'status-warning', color: '#f59e0b' },
  { id: 'HS', name: 'Hannah Scott', score: '45%', status: 'Precisa de Ajuda', statusColor: 'status-warning', color: '#ef4444' },
  { id: 'TW', name: 'Tyler White', score: '100%', status: 'Concluído', statusColor: 'status-completed', color: '#8b5cf6' },
  { id: 'BK', name: 'Brooklyn King', score: '100%', status: 'Concluído', statusColor: 'status-completed', color: '#ec4899' },
  { id: 'LG', name: 'Liam Garcia', score: '100%', status: 'Concluído', statusColor: 'status-completed', color: '#10b981' },
];

// Using strings for icons to avoid React component imports in data file, they can be mapped later if needed
export const learningPath = [
  { id: 1, title: 'Introdução ao Pensamento Computacional', status: 'completed', iconName: 'CheckCircle2' },
  { id: 2, title: 'Lógica de Programação', status: 'completed', iconName: 'Code2' },
  { id: 3, title: 'Estruturas de Dados', status: 'completed', iconName: 'Database' },
  { id: 4, title: 'Funções e Algoritmos', status: 'completed', iconName: 'Activity' },
  { id: 5, title: 'Algoritmos Avançados', status: 'active', iconName: 'BrainCircuit' },
  { id: 6, title: 'Recursividade e Backtracking', status: 'locked', iconName: 'Lock' },
  { id: 7, title: 'Grafos e Redes', status: 'locked', iconName: 'Lock' },
  { id: 8, title: 'Programação Dinâmica', status: 'locked', iconName: 'Lock' },
  { id: 9, title: 'Otimização de Algoritmos', status: 'locked', iconName: 'Lock' },
  { id: 10, title: 'Projeto Final Desafio Expert', status: 'locked', iconName: 'TrophyIcon' }
];
