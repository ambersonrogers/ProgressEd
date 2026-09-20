// defaultChallenges.js - Banco local de desafios para os 5 módulos curriculares da BNCC
export const DEFAULT_CHALLENGES = [
  // MÓDULO 1: LINGUAGENS (PT • EN • ES)
  {
    id: 101,
    moduleId: 1,
    subject: 'Linguagens',
    difficulty: 1,
    question: 'Em "Ela tem um coração de ouro", qual figura de linguagem expressa uma comparação implícita?',
    optionA: 'Metonímia',
    optionB: 'Metáfora',
    optionC: 'Hipérbole',
    optionD: 'Eufemismo',
    correctAnswer: 'B',
    explanation: 'A metáfora consiste em uma comparação implícita entre dois termos sem o uso de conectivos comparativos.',
    xpReward: 50
  },
  {
    id: 102,
    moduleId: 1,
    subject: 'Linguagens',
    difficulty: 2,
    question: 'Choose the sentence with the correct use of Present Perfect:',
    optionA: 'She has lived in Brazil since 2020.',
    optionB: 'She lived in Brazil since 2020.',
    optionC: 'She has live in Brazil since 2020.',
    optionD: 'She is living in Brazil since 2020.',
    correctAnswer: 'A',
    explanation: 'O Present Perfect ("has lived") é empregado com "since" para indicar uma ação iniciada no passado que continua.',
    xpReward: 60
  },
  {
    id: 103,
    moduleId: 1,
    subject: 'Linguagens',
    difficulty: 2,
    question: 'Na norma-padrão da língua portuguesa, assinale a oração com concordância verbal correta:',
    optionA: 'Fazem dois anos que não o vejo.',
    optionB: 'Faz dois anos que não o vejo.',
    optionC: 'Haviam muitos alunos na sala.',
    optionD: 'Houveram bastantes problemas.',
    correctAnswer: 'B',
    explanation: 'O verbo "fazer" indicando tempo transcorrido é impessoal e deve permanecer na 3ª pessoa do singular.',
    xpReward: 70
  },

  // MÓDULO 2: MATEMÁTICA (Números e raciocínio lógico)
  {
    id: 201,
    moduleId: 2,
    subject: 'Matemática',
    difficulty: 1,
    question: 'Se f(x) = 2x + 5, qual é o valor de f(4)?',
    optionA: '11',
    optionB: '13',
    optionC: '15',
    optionD: '8',
    correctAnswer: 'B',
    explanation: 'Substituindo x por 4: f(4) = 2(4) + 5 = 8 + 5 = 13.',
    xpReward: 50
  },
  {
    id: 202,
    moduleId: 2,
    subject: 'Matemática',
    difficulty: 2,
    question: 'Qual é a probabilidade de lançar um dado não viciado de 6 faces e obter um número primo?',
    optionA: '1/6',
    optionB: '1/3',
    optionC: '1/2',
    optionD: '2/3',
    correctAnswer: 'C',
    explanation: 'Os números primos entre 1 e 6 são {2, 3, 5} (3/6 = 1/2 ou 50%).',
    xpReward: 60
  },
  {
    id: 203,
    moduleId: 2,
    subject: 'Matemática',
    difficulty: 3,
    question: 'Um triângulo retângulo possui catetos medindo 6 cm e 8 cm. O comprimento da hipotenusa é:',
    optionA: '9 cm',
    optionB: '10 cm',
    optionC: '12 cm',
    optionD: '14 cm',
    correctAnswer: 'B',
    explanation: 'Pelo Teorema de Pitágoras: a² = b² + c² => a² = 36 + 64 = 100 => a = 10 cm.',
    xpReward: 75
  },

  // MÓDULO 3: CIÊNCIAS DA NATUREZA (Física • Química • Biologia)
  {
    id: 301,
    moduleId: 3,
    subject: 'Ciências da Natureza',
    difficulty: 1,
    question: 'Qual organela celular eucarionte é a principal produtora de energia (ATP) por respiração aeróbica?',
    optionA: 'Ribossomo',
    optionB: 'Complexo Golgiense',
    optionC: 'Mitocôndria',
    optionD: 'Lisossomo',
    correctAnswer: 'C',
    explanation: 'A mitocôndria é responsável pela oxidação de nutrientes e fosforilação oxidativa que sintetiza ATP.',
    xpReward: 50
  },
  {
    id: 302,
    moduleId: 3,
    subject: 'Ciências da Natureza',
    difficulty: 2,
    question: 'Segundo a Segunda Lei de Newton (F = m · a), uma força de 40 N aplicada a um corpo de 8 kg resulta em aceleração de:',
    optionA: '320 m/s²',
    optionB: '5 m/s²',
    optionC: '0,2 m/s²',
    optionD: '48 m/s²',
    correctAnswer: 'B',
    explanation: 'Isolando a aceleração: a = F / m = 40 N / 8 kg = 5 m/s².',
    xpReward: 60
  },
  {
    id: 303,
    moduleId: 3,
    subject: 'Ciências da Natureza',
    difficulty: 2,
    question: 'Uma substância com pH igual a 3 é classificada como:',
    optionA: 'Neutra',
    optionB: 'Básica (alcalina)',
    optionC: 'Ácida',
    optionD: 'Salina',
    correctAnswer: 'C',
    explanation: 'Na escala de pH a 25°C, valores inferiores a 7 indicam meio ácido.',
    xpReward: 65
  },

  // MÓDULO 4: CIÊNCIAS HUMANAS (História • Geografia • Raízes do Brasil)
  {
    id: 401,
    moduleId: 4,
    subject: 'Ciências Humanas',
    difficulty: 1,
    question: 'A Lei nº 10.639/2003 alterou a LDB para tornar obrigatório nas escolas o ensino de:',
    optionA: 'Língua Latina clássica',
    optionB: 'História e Cultura Afro-Brasileira e Indígena',
    optionC: 'Economia Financeira e Mercado de Ações',
    optionD: 'Constituição Internacional',
    correctAnswer: 'B',
    explanation: 'A Lei 10.639/03 estabelece a obrigatoriedade da temática "História e Cultura Afro-Brasileira" nas redes de ensino.',
    xpReward: 60
  },
  {
    id: 402,
    moduleId: 4,
    subject: 'Ciências Humanas',
    difficulty: 2,
    question: 'O bioma característico do Maranhão que combina elementos de Cerrado, Caatinga e Amazônia na bacia do Itapecuru é:',
    optionA: 'Mata Atlântica',
    optionB: 'Mata dos Cocais (ecótono de transição)',
    optionC: 'Pampa gaúcho',
    optionD: 'Pantanal mato-grossense',
    correctAnswer: 'B',
    explanation: 'A Mata dos Cocais é uma zona de transição típica do Maranhão rica em babaçuais.',
    xpReward: 70
  },

  // MÓDULO 5: ATUALIDADES (Mundo em movimento)
  {
    id: 501,
    moduleId: 5,
    subject: 'Atualidades',
    difficulty: 1,
    question: 'O Acordo de Paris (2015) é um tratado internacional histórico cujo principal compromisso é:',
    optionA: 'Limitar o aquecimento global bem abaixo de 2°C acima dos níveis pré-industriais',
    optionB: 'Eliminar imediatamente todo o comércio internacional de combustíveis',
    optionC: 'Substituir todas as moedas globais por ativos criptográficos',
    optionD: 'Unificar os sistemas tributários da América Latina',
    correctAnswer: 'A',
    explanation: 'O Acordo de Paris visa frear o aquecimento do planeta reduzindo a emissão de gases de efeito estufa.',
    xpReward: 50
  },
  {
    id: 502,
    moduleId: 5,
    subject: 'Atualidades',
    difficulty: 2,
    question: 'A Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) tem como princípio basilar no tratamento de dados de adolescentes:',
    optionA: 'A comercialização irrestrita de perfis para marketing',
    optionB: 'O melhor interesse do menor e a minimização de dados coletados',
    optionC: 'A divulgação pública compulsória de notas escolares',
    optionD: 'A dispensa total de segurança digital em plataformas educativas',
    correctAnswer: 'B',
    explanation: 'O Artigo 14 da LGPD determina que o tratamento deve ocorrer no melhor interesse da criança/adolescente.',
    xpReward: 65
  }
];

export const DEFAULT_RANKING = [
  { id: '1', name: 'Amberson Rogers', level: 6, xp: 1250, completed_challenges: 18, total_challenges: 20 },
  { id: '2', name: 'Jhony Fernandes', level: 5, xp: 980, completed_challenges: 15, total_challenges: 20 },
  { id: '3', name: 'Kelly Lorrany', level: 5, xp: 920, completed_challenges: 14, total_challenges: 20 },
  { id: '4', name: 'Weldes Reis', level: 4, xp: 840, completed_challenges: 12, total_challenges: 20 },
  { id: '5', name: 'Ana Beatriz Sousa', level: 4, xp: 760, completed_challenges: 11, total_challenges: 20 },
  { id: '6', name: 'Lucas Gabriel Lima', level: 3, xp: 620, completed_challenges: 9, total_challenges: 20 }
];
