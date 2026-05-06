// Banco de Questões - ProgressEd
// Organizado por disciplina e nível de ensino

const questionBank = [
  // === INFORMÁTICA ===
  { id: 1, subject: 'Informática', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'O que é um algoritmo?', options: [{ letter: 'A', text: 'Um tipo de vírus' }, { letter: 'B', text: 'Uma sequência de passos para resolver um problema' }, { letter: 'C', text: 'Um programa de computador' }, { letter: 'D', text: 'Uma linguagem de programação' }], correctAnswer: 'B' },
  { id: 2, subject: 'Informática', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Qual destes é um dispositivo de entrada?', options: [{ letter: 'A', text: 'Monitor' }, { letter: 'B', text: 'Impressora' }, { letter: 'C', text: 'Teclado' }, { letter: 'D', text: 'Caixa de som' }], correctAnswer: 'C' },
  { id: 3, subject: 'Informática', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'O que significa HTML?', options: [{ letter: 'A', text: 'Hyper Text Markup Language' }, { letter: 'B', text: 'High Tech Modern Language' }, { letter: 'C', text: 'Home Tool Markup Language' }, { letter: 'D', text: 'Hyper Transfer Mail Language' }], correctAnswer: 'A' },
  { id: 4, subject: 'Informática', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'Qual estrutura de dados segue o princípio LIFO?', options: [{ letter: 'A', text: 'Fila' }, { letter: 'B', text: 'Lista' }, { letter: 'C', text: 'Pilha' }, { letter: 'D', text: 'Árvore' }], correctAnswer: 'C' },
  { id: 5, subject: 'Informática', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'Qual a complexidade de tempo do algoritmo de busca binária?', options: [{ letter: 'A', text: 'O(n)' }, { letter: 'B', text: 'O(log n)' }, { letter: 'C', text: 'O(n²)' }, { letter: 'D', text: 'O(1)' }], correctAnswer: 'B' },

  // === MATEMÁTICA ===
  { id: 6, subject: 'Matemática', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Quanto é 3/4 + 1/4?', options: [{ letter: 'A', text: '4/8' }, { letter: 'B', text: '1' }, { letter: 'C', text: '4/4' }, { letter: 'D', text: 'B e C estão corretas' }], correctAnswer: 'D' },
  { id: 7, subject: 'Matemática', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Qual é a área de um triângulo com base 10 e altura 6?', options: [{ letter: 'A', text: '60' }, { letter: 'B', text: '30' }, { letter: 'C', text: '16' }, { letter: 'D', text: '36' }], correctAnswer: 'B' },
  { id: 8, subject: 'Matemática', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Resolva: 2x + 6 = 20. Qual o valor de x?', options: [{ letter: 'A', text: '5' }, { letter: 'B', text: '7' }, { letter: 'C', text: '8' }, { letter: 'D', text: '10' }], correctAnswer: 'B' },
  { id: 9, subject: 'Matemática', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'Qual o valor de log₂(64)?', options: [{ letter: 'A', text: '4' }, { letter: 'B', text: '5' }, { letter: 'C', text: '6' }, { letter: 'D', text: '8' }], correctAnswer: 'C' },
  { id: 10, subject: 'Matemática', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'Qual é a derivada de f(x) = 3x² + 2x?', options: [{ letter: 'A', text: '6x + 2' }, { letter: 'B', text: '3x + 2' }, { letter: 'C', text: '6x² + 2' }, { letter: 'D', text: '6x' }], correctAnswer: 'A' },

  // === PORTUGUÊS ===
  { id: 11, subject: 'Português', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Qual é o sujeito da frase: "O gato dormiu no sofá"?', options: [{ letter: 'A', text: 'dormiu' }, { letter: 'B', text: 'no sofá' }, { letter: 'C', text: 'O gato' }, { letter: 'D', text: 'sofá' }], correctAnswer: 'C' },
  { id: 12, subject: 'Português', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Qual alternativa contém um dígrafo?', options: [{ letter: 'A', text: 'Casa' }, { letter: 'B', text: 'Chuva' }, { letter: 'C', text: 'Prato' }, { letter: 'D', text: 'Flor' }], correctAnswer: 'B' },
  { id: 13, subject: 'Português', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: '"Nós fomos ao parque." O verbo está em qual tempo?', options: [{ letter: 'A', text: 'Presente' }, { letter: 'B', text: 'Pretérito perfeito' }, { letter: 'C', text: 'Futuro' }, { letter: 'D', text: 'Pretérito imperfeito' }], correctAnswer: 'B' },
  { id: 14, subject: 'Português', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'Qual figura de linguagem está presente em "Ela é uma flor"?', options: [{ letter: 'A', text: 'Metonímia' }, { letter: 'B', text: 'Hipérbole' }, { letter: 'C', text: 'Metáfora' }, { letter: 'D', text: 'Ironia' }], correctAnswer: 'C' },
  { id: 15, subject: 'Português', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'Assinale a oração subordinada substantiva objetiva direta:', options: [{ letter: 'A', text: 'Espero que você venha' }, { letter: 'B', text: 'O livro que li é bom' }, { letter: 'C', text: 'Quando chegar, avise' }, { letter: 'D', text: 'Embora chova, irei' }], correctAnswer: 'A' },

  // === CIÊNCIAS ===
  { id: 16, subject: 'Ciências', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Qual é o maior órgão do corpo humano?', options: [{ letter: 'A', text: 'Coração' }, { letter: 'B', text: 'Fígado' }, { letter: 'C', text: 'Pele' }, { letter: 'D', text: 'Pulmão' }], correctAnswer: 'C' },
  { id: 17, subject: 'Ciências', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Qual gás as plantas absorvem durante a fotossíntese?', options: [{ letter: 'A', text: 'Oxigênio' }, { letter: 'B', text: 'Nitrogênio' }, { letter: 'C', text: 'Gás carbônico' }, { letter: 'D', text: 'Hidrogênio' }], correctAnswer: 'C' },
  { id: 18, subject: 'Ciências', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Qual é a unidade básica da vida?', options: [{ letter: 'A', text: 'Átomo' }, { letter: 'B', text: 'Molécula' }, { letter: 'C', text: 'Célula' }, { letter: 'D', text: 'Tecido' }], correctAnswer: 'C' },
  { id: 19, subject: 'Ciências', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'O DNA é formado por qual tipo de molécula?', options: [{ letter: 'A', text: 'Lipídios' }, { letter: 'B', text: 'Proteínas' }, { letter: 'C', text: 'Carboidratos' }, { letter: 'D', text: 'Ácidos nucleicos' }], correctAnswer: 'D' },
  { id: 20, subject: 'Ciências', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'Qual organela é responsável pela produção de ATP?', options: [{ letter: 'A', text: 'Ribossomo' }, { letter: 'B', text: 'Mitocôndria' }, { letter: 'C', text: 'Lisossomo' }, { letter: 'D', text: 'Complexo de Golgi' }], correctAnswer: 'B' },

  // === HISTÓRIA ===
  { id: 21, subject: 'História', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Quem proclamou a independência do Brasil?', options: [{ letter: 'A', text: 'Tiradentes' }, { letter: 'B', text: 'Dom Pedro I' }, { letter: 'C', text: 'Getúlio Vargas' }, { letter: 'D', text: 'Dom Pedro II' }], correctAnswer: 'B' },
  { id: 22, subject: 'História', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Em que ano foi abolida a escravidão no Brasil?', options: [{ letter: 'A', text: '1822' }, { letter: 'B', text: '1888' }, { letter: 'C', text: '1889' }, { letter: 'D', text: '1900' }], correctAnswer: 'B' },
  { id: 23, subject: 'História', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Qual civilização construiu as pirâmides de Gizé?', options: [{ letter: 'A', text: 'Romana' }, { letter: 'B', text: 'Grega' }, { letter: 'C', text: 'Egípcia' }, { letter: 'D', text: 'Mesopotâmica' }], correctAnswer: 'C' },
  { id: 24, subject: 'História', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'Qual foi a principal causa da Revolução Francesa?', options: [{ letter: 'A', text: 'Invasão estrangeira' }, { letter: 'B', text: 'Desigualdade social e crise econômica' }, { letter: 'C', text: 'Descoberta da América' }, { letter: 'D', text: 'Epidemia de peste' }], correctAnswer: 'B' },
  { id: 25, subject: 'História', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'O Tratado de Tordesilhas (1494) dividiu o mundo entre:', options: [{ letter: 'A', text: 'Inglaterra e França' }, { letter: 'B', text: 'Portugal e Espanha' }, { letter: 'C', text: 'Holanda e Portugal' }, { letter: 'D', text: 'Espanha e França' }], correctAnswer: 'B' },

  // === GEOGRAFIA ===
  { id: 26, subject: 'Geografia', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Qual é o maior país da América do Sul?', options: [{ letter: 'A', text: 'Argentina' }, { letter: 'B', text: 'Colômbia' }, { letter: 'C', text: 'Brasil' }, { letter: 'D', text: 'Peru' }], correctAnswer: 'C' },
  { id: 27, subject: 'Geografia', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Quantos fusos horários o Brasil possui?', options: [{ letter: 'A', text: '2' }, { letter: 'B', text: '3' }, { letter: 'C', text: '4' }, { letter: 'D', text: '5' }], correctAnswer: 'C' },
  { id: 28, subject: 'Geografia', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'O que é a camada de ozônio?', options: [{ letter: 'A', text: 'Camada de gelo na Antártida' }, { letter: 'B', text: 'Camada de gases que filtra radiação UV' }, { letter: 'C', text: 'Camada de solo fértil' }, { letter: 'D', text: 'Corrente marítima' }], correctAnswer: 'B' },
  { id: 29, subject: 'Geografia', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'As placas tectônicas se movem devido a:', options: [{ letter: 'A', text: 'Rotação da Terra' }, { letter: 'B', text: 'Correntes de convecção no manto' }, { letter: 'C', text: 'Gravidade lunar' }, { letter: 'D', text: 'Ventos solares' }], correctAnswer: 'B' },

  // === QUÍMICA ===
  { id: 30, subject: 'Química', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Qual é a fórmula da água?', options: [{ letter: 'A', text: 'CO₂' }, { letter: 'B', text: 'H₂O' }, { letter: 'C', text: 'O₂' }, { letter: 'D', text: 'NaCl' }], correctAnswer: 'B' },
  { id: 31, subject: 'Química', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Quantos elementos a tabela periódica possui atualmente?', options: [{ letter: 'A', text: '108' }, { letter: 'B', text: '118' }, { letter: 'C', text: '92' }, { letter: 'D', text: '100' }], correctAnswer: 'B' },
  { id: 32, subject: 'Química', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'O que é uma ligação covalente?', options: [{ letter: 'A', text: 'Transferência de elétrons' }, { letter: 'B', text: 'Compartilhamento de elétrons' }, { letter: 'C', text: 'Atração entre íons' }, { letter: 'D', text: 'Ligação entre metais' }], correctAnswer: 'B' },
  { id: 33, subject: 'Química', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'Qual é o pH de uma solução neutra a 25°C?', options: [{ letter: 'A', text: '0' }, { letter: 'B', text: '7' }, { letter: 'C', text: '14' }, { letter: 'D', text: '1' }], correctAnswer: 'B' },

  // === FÍSICA ===
  { id: 34, subject: 'Física', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Qual é a unidade de medida de força?', options: [{ letter: 'A', text: 'Joule' }, { letter: 'B', text: 'Watt' }, { letter: 'C', text: 'Newton' }, { letter: 'D', text: 'Pascal' }], correctAnswer: 'C' },
  { id: 35, subject: 'Física', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'A velocidade da luz no vácuo é aproximadamente:', options: [{ letter: 'A', text: '300.000 km/s' }, { letter: 'B', text: '150.000 km/s' }, { letter: 'C', text: '30.000 km/s' }, { letter: 'D', text: '3.000 km/s' }], correctAnswer: 'A' },
  { id: 36, subject: 'Física', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'F = m × a é a expressão de qual lei de Newton?', options: [{ letter: 'A', text: 'Primeira lei' }, { letter: 'B', text: 'Segunda lei' }, { letter: 'C', text: 'Terceira lei' }, { letter: 'D', text: 'Lei da Gravitação' }], correctAnswer: 'B' },
  { id: 37, subject: 'Física', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'Qual é a energia cinética de um corpo de 2kg a 10m/s?', options: [{ letter: 'A', text: '20 J' }, { letter: 'B', text: '50 J' }, { letter: 'C', text: '100 J' }, { letter: 'D', text: '200 J' }], correctAnswer: 'C' },

  // === ARTE ===
  { id: 38, subject: 'Arte', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Quais são as cores primárias?', options: [{ letter: 'A', text: 'Verde, laranja, roxo' }, { letter: 'B', text: 'Vermelho, amarelo, azul' }, { letter: 'C', text: 'Branco, preto, cinza' }, { letter: 'D', text: 'Rosa, marrom, bege' }], correctAnswer: 'B' },
  { id: 39, subject: 'Arte', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Quem pintou a Mona Lisa?', options: [{ letter: 'A', text: 'Michelangelo' }, { letter: 'B', text: 'Picasso' }, { letter: 'C', text: 'Leonardo da Vinci' }, { letter: 'D', text: 'Van Gogh' }], correctAnswer: 'C' },
  { id: 40, subject: 'Arte', level: 'Médio Integral', difficulty: 'Intermediário', points: 100, text: 'O movimento artístico Barroco se caracteriza por:', options: [{ letter: 'A', text: 'Simplicidade e formas geométricas' }, { letter: 'B', text: 'Dramaticidade e contraste de luz e sombra' }, { letter: 'C', text: 'Abstração total' }, { letter: 'D', text: 'Minimalismo' }], correctAnswer: 'B' },

  // === FILOSOFIA ===
  { id: 41, subject: 'Filosofia', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'Quem é considerado o pai da Filosofia ocidental?', options: [{ letter: 'A', text: 'Platão' }, { letter: 'B', text: 'Aristóteles' }, { letter: 'C', text: 'Sócrates' }, { letter: 'D', text: 'Descartes' }], correctAnswer: 'C' },
  { id: 42, subject: 'Filosofia', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: '"Penso, logo existo" é uma frase de qual filósofo?', options: [{ letter: 'A', text: 'Kant' }, { letter: 'B', text: 'Descartes' }, { letter: 'C', text: 'Nietzsche' }, { letter: 'D', text: 'Platão' }], correctAnswer: 'B' },
  { id: 43, subject: 'Filosofia', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'O imperativo categórico é um conceito de:', options: [{ letter: 'A', text: 'Hegel' }, { letter: 'B', text: 'Marx' }, { letter: 'C', text: 'Kant' }, { letter: 'D', text: 'Sartre' }], correctAnswer: 'C' },

  // === SOCIOLOGIA ===
  { id: 44, subject: 'Sociologia', level: 'Fundamental', difficulty: 'Iniciante', points: 50, text: 'O que estuda a Sociologia?', options: [{ letter: 'A', text: 'O universo' }, { letter: 'B', text: 'A sociedade e as relações sociais' }, { letter: 'C', text: 'Os seres vivos' }, { letter: 'D', text: 'A mente humana' }], correctAnswer: 'B' },
  { id: 45, subject: 'Sociologia', level: 'Fundamental', difficulty: 'Intermediário', points: 100, text: 'Quem é considerado o pai da Sociologia?', options: [{ letter: 'A', text: 'Max Weber' }, { letter: 'B', text: 'Karl Marx' }, { letter: 'C', text: 'Auguste Comte' }, { letter: 'D', text: 'Durkheim' }], correctAnswer: 'C' },
  { id: 46, subject: 'Sociologia', level: 'Médio Integral', difficulty: 'Avançado', points: 150, text: 'O conceito de "mais-valia" foi desenvolvido por:', options: [{ letter: 'A', text: 'Weber' }, { letter: 'B', text: 'Durkheim' }, { letter: 'C', text: 'Comte' }, { letter: 'D', text: 'Marx' }], correctAnswer: 'D' },
];

// Funções utilitárias
export const getSubjects = () => [...new Set(questionBank.map(q => q.subject))];

export const getLevels = () => [...new Set(questionBank.map(q => q.level))];

export const filterQuestions = ({ subjects = [], level = null, difficulty = null, count = 5 }) => {
  let filtered = [...questionBank];
  if (subjects.length > 0) filtered = filtered.filter(q => subjects.includes(q.subject));
  if (level) filtered = filtered.filter(q => q.level === level);
  if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty);
  // Embaralhar
  filtered.sort(() => Math.random() - 0.5);
  return filtered.slice(0, count);
};

export const getRandomChallenge = (count = 5, level = null) => {
  return filterQuestions({ subjects: [], level, count });
};

export default questionBank;
