-- Script para popular a tabela challenges com questões de todas as disciplinas do Ensino Médio
-- Execute este script no Supabase SQL Editor

-- Limpar tabela existente
DELETE FROM challenges;

-- Resetar sequence do ID
ALTER SEQUENCE challenges_id_seq RESTART WITH 1;

-- Inserir desafios de Matemática
INSERT INTO challenges (title, description, question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Raiz Quadrada', 'Questão básica de matemática sobre raiz quadrada', 'Qual é a raiz quadrada de 144?', '10', '11', '12', '13', 'C', 10, 1, 'Matemática', 1),
('Porcentagem', 'Cálculo de porcentagem básica', 'Quanto é 15% de 200?', '25', '30', '35', '40', 'B', 10, 1, 'Matemática', 1),
('Valor de Pi', 'Conhecimento sobre constantes matemáticas', 'Qual é o valor de π (pi) aproximado?', '3.14', '3.15', '3.16', '3.17', 'A', 15, 1, 'Matemática', 1),
('Potenciação', 'Cálculo de potência básica', 'Quanto é 2³?', '6', '8', '9', '12', 'B', 10, 1, 'Matemática', 1),
('Área do Círculo', 'Fórmula da área do círculo', 'Qual é a fórmula da área do círculo?', 'πr²', '2πr', 'πr', 'r²', 'A', 15, 2, 'Matemática', 2),
('Derivada', 'Conceito básico de derivada', 'Quanto é a derivada de x²?', 'x', '2x', '2', 'x²', 'B', 20, 2, 'Matemática', 2),
('Seno de 90°', 'Valor do seno de 90 graus', 'Qual é o seno de 90°?', '0', '0.5', '1', '-1', 'C', 15, 2, 'Matemática', 2),
('Integral', 'Cálculo de integral indefinida', 'Quanto é ∫x dx?', 'x²/2 + C', 'x² + C', 'x + C', '2x + C', 'A', 25, 3, 'Matemática', 3),
('Equação Quadrática', 'Resolução de equação do segundo grau', 'Qual é a solução de x² - 4 = 0?', 'x = ±2', 'x = 2', 'x = -2', 'x = 4', 'A', 20, 2, 'Matemática', 3),
('Limite', 'Conceito de limite em cálculo', 'Quanto é o limite de (x²-1)/(x-1) quando x→1?', '1', '2', '0', '∞', 'B', 25, 3, 'Matemática', 3);

-- Inserir desafios de Física
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Qual é a unidade de força no SI?', 'Newton', 'Joule', 'Watt', 'Pascal', 'A', 10, 1, 'Física', 1),
('Quanto é a aceleração da gravidade na Terra?', '8.9 m/s²', '9.8 m/s²', '10.2 m/s²', '11.1 m/s²', 'B', 15, 1, 'Física', 1),
('Qual lei de Newton diz que "ação e reação são iguais e opostas"?', '1ª Lei', '2ª Lei', '3ª Lei', 'Lei da Gravitação', 'C', 15, 2, 'Física', 1),
('Qual é a fórmula da velocidade?', 'd/t', 'd×t', 't/d', 'd+t', 'A', 10, 1, 'Física', 2),
('Quanto é a velocidade da luz no vácuo?', '300.000 km/s', '299.792.458 m/s', '150.000 km/s', '400.000 km/s', 'B', 20, 2, 'Física', 2),
('Qual é a unidade de energia?', 'Watt', 'Joule', 'Volt', 'Ampère', 'B', 15, 2, 'Física', 3),
('O que é trabalho em física?', 'Força × Tempo', 'Força × Distância', 'Força × Velocidade', 'Força × Aceleração', 'B', 15, 2, 'Física', 3),
('Qual é a lei de Ohm?', 'V = I × R', 'P = V × I', 'F = m × a', 'E = m × c²', 'A', 20, 3, 'Física', 3),
('Quanto é a carga elementar do elétron?', '-1.6 × 10^-19 C', '+1.6 × 10^-19 C', '-1.6 × 10^-18 C', '+1.6 × 10^-18 C', 'A', 25, 3, 'Física', 3),
('Qual é a frequência de um som de 440 Hz?', '440 vibrações/s', '440 metros/s', '440 newtons', '440 joules', 'A', 15, 2, 'Física', 4);

-- Inserir desafios de Química
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Qual é o símbolo do Oxigênio?', 'O', 'Ox', 'O2', 'O3', 'A', 10, 1, 'Química', 1),
('Quantos elétrons tem o átomo de Carbono?', '4', '6', '8', '12', 'B', 10, 1, 'Química', 1),
('Qual é a fórmula da água?', 'H2O', 'HO2', 'H2O2', 'HO', 'A', 10, 1, 'Química', 1),
('O que é um ácido?', 'pH > 7', 'pH = 7', 'pH < 7', 'pH > 14', 'C', 15, 2, 'Química', 2),
('Qual é a reação de combustão?', 'C + O2 → CO2', '2H2 + O2 → 2H2O', 'Na + Cl → NaCl', 'CaCO3 → CaO + CO2', 'A', 15, 2, 'Química', 2),
('Quanto é a massa molar do H2O?', '16 g/mol', '18 g/mol', '20 g/mol', '22 g/mol', 'B', 15, 2, 'Química', 3),
('Qual é o número atômico do Hidrogênio?', '1', '2', '3', '4', 'A', 10, 1, 'Química', 3),
('O que é uma ligação iônica?', 'Compartilhamento de elétrons', 'Transferência de elétrons', 'Atração entre moléculas', 'Ligação metálica', 'B', 20, 3, 'Química', 3),
('Qual é a lei de Lavoisier?', 'Lei da Conservação da Massa', 'Lei dos Gases', 'Lei de Boyle', 'Lei de Charles', 'A', 20, 3, 'Química', 4),
('Quanto é o pH neutro?', '0', '7', '14', '1', 'B', 10, 1, 'Química', 4);

-- Inserir desafios de Biologia
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Qual é a unidade básica da vida?', 'Átomo', 'Molécula', 'Célula', 'Tecido', 'C', 10, 1, 'Biologia', 1),
('Onde está localizado o DNA?', 'Citoplasma', 'Núcleo', 'Mitocôndria', 'Ribossomo', 'B', 15, 1, 'Biologia', 1),
('Qual é a função da mitocôndria?', 'Produzir energia', 'Sintetizar proteínas', 'Armazenar água', 'Controlar divisão celular', 'A', 15, 2, 'Biologia', 1),
('O que é fotossíntese?', 'Respiração celular', 'Produção de energia luminosa', 'Conversão de luz em energia química', 'Absorção de água', 'C', 20, 2, 'Biologia', 2),
('Qual é o reino dos animais?', 'Animalia', 'Plantae', 'Fungi', 'Protista', 'A', 10, 1, 'Biologia', 2),
('O que é evolução?', 'Mudança genética rápida', 'Adaptação gradual das espécies', 'Criação de novas espécies instantaneamente', 'Extinção de espécies', 'B', 20, 3, 'Biologia', 3),
('Qual é a função dos glóbulos vermelhos?', 'Combater infecções', 'Transportar oxigênio', 'Coagular sangue', 'Produzir anticorpos', 'B', 15, 2, 'Biologia', 3),
('O que é ecossistema?', 'Comunidade de organismos', 'Ambiente físico', 'Interação entre seres vivos e ambiente', 'Cadeia alimentar', 'C', 20, 3, 'Biologia', 4),
('Qual é o processo de divisão celular?', 'Mitose', 'Meiose', 'Citocinese', 'Todas as anteriores', 'D', 25, 3, 'Biologia', 4),
('O que é biodiversidade?', 'Número de espécies em extinção', 'Variedade de vida na Terra', 'Quantidade de água nos oceanos', 'Número de animais domésticos', 'B', 20, 3, 'Biologia', 4);

-- Inserir desafios de História
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Em que ano começou a Revolução Francesa?', '1789', '1776', '1799', '1804', 'A', 15, 1, 'História', 1),
('Quem descobriu o Brasil?', 'Cristóvão Colombo', 'Pedro Álvares Cabral', 'Vasco da Gama', 'Fernão de Magalhães', 'B', 10, 1, 'História', 1),
('Qual foi a primeira civilização?', 'Grega', 'Romana', 'Egípcia', 'Mesopotâmica', 'D', 15, 2, 'História', 1),
('Quando terminou a Segunda Guerra Mundial?', '1945', '1939', '1950', '1940', 'A', 10, 1, 'História', 2),
('Quem foi o primeiro presidente do Brasil?', 'Getúlio Vargas', 'Juscelino Kubitschek', 'Deodoro da Fonseca', 'Floriano Peixoto', 'C', 15, 2, 'História', 2),
('O que foi o Renascimento?', 'Movimento artístico e cultural', 'Período de guerras', 'Descoberta da América', 'Revolução Industrial', 'A', 20, 3, 'História', 3),
('Qual foi a causa principal da Primeira Guerra Mundial?', 'Assassinato do arquiduque Francisco Ferdinando', 'Crise econômica', 'Descoberta da eletricidade', 'Colonização da África', 'A', 20, 3, 'História', 3),
('O que foi o Iluminismo?', 'Movimento filosófico', 'Revolução tecnológica', 'Período de trevas', 'Era das descobertas', 'A', 20, 3, 'História', 4),
('Quando foi proclamada a República no Brasil?', '1889', '1822', '1891', '1900', 'A', 15, 2, 'História', 4),
('O que foi a Guerra Fria?', 'Conflito armado direto', 'Confronto ideológico entre EUA e URSS', 'Guerra no Ártico', 'Guerra comercial', 'B', 20, 3, 'História', 4);

-- Inserir desafios de Geografia
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Qual é o maior continente?', 'África', 'Ásia', 'América', 'Europa', 'B', 10, 1, 'Geografia', 1),
('Quantos oceanos existem?', '3', '4', '5', '6', 'C', 10, 1, 'Geografia', 1),
('Qual é a capital do Brasil?', 'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'C', 10, 1, 'Geografia', 1),
('O que é latitude?', 'Distância leste-oeste', 'Distância norte-sul', 'Altura acima do nível do mar', 'Profundidade abaixo do nível do mar', 'B', 15, 2, 'Geografia', 2),
('Qual é o maior deserto do mundo?', 'Saara', 'Gobi', 'Atacama', 'Antártida', 'A', 15, 2, 'Geografia', 2),
('O que é globalização?', 'Interdependência econômica mundial', 'Isolamento de países', 'Guerra entre nações', 'Formação de blocos econômicos', 'A', 20, 3, 'Geografia', 3),
('Qual é o rio mais longo do mundo?', 'Amazonas', 'Nilo', 'Yangtzé', 'Mississippi', 'B', 15, 2, 'Geografia', 3),
('O que é urbanização?', 'Crescimento das cidades', 'Diminuição da população urbana', 'Migração para o campo', 'Industrialização rural', 'A', 15, 2, 'Geografia', 4),
('Qual é o clima predominante no Brasil?', 'Polar', 'Desértico', 'Tropical', 'Temperado', 'C', 15, 2, 'Geografia', 4),
('O que é sustentabilidade?', 'Exploração máxima dos recursos', 'Desenvolvimento que atende necessidades presentes sem comprometer futuras', 'Crescimento econômico ilimitado', 'Preservação total da natureza', 'B', 20, 3, 'Geografia', 4);

-- Inserir desafios de Português
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Qual é a classe gramatical de "casa"?', 'Verbo', 'Substantivo', 'Adjetivo', 'Advérbio', 'B', 10, 1, 'Português', 1),
('O que é uma metáfora?', 'Comparação direta', 'Comparação indireta', 'Oposição de ideias', 'Repetição de sons', 'B', 15, 2, 'Português', 1),
('Qual é o plural de "país"?', 'Países', 'País', 'Paízes', 'Paíse', 'A', 10, 1, 'Português', 1),
('O que é uma oração subordinada?', 'Independente', 'Dependente de outra', 'Sempre interrogativa', 'Sempre exclamativa', 'B', 15, 2, 'Português', 2),
('Qual é a função do ponto de interrogação?', 'Finalizar afirmações', 'Indicar perguntas', 'Separar ideias', 'Destacar palavras', 'B', 10, 1, 'Português', 2),
('O que é denotação?', 'Sentido figurado', 'Sentido literal', 'Sentido conotativo', 'Sentido ambíguo', 'B', 15, 2, 'Português', 3),
('Qual é o antônimo de "alegre"?', 'Triste', 'Feliz', 'Contente', 'Alegre', 'A', 10, 1, 'Português', 3),
('O que é uma dissertação?', 'Texto narrativo', 'Texto argumentativo', 'Texto descritivo', 'Texto poético', 'B', 20, 3, 'Português', 4),
('Qual é a norma culta da língua portuguesa?', 'Variante brasileira', 'Variante europeia', 'Ambas são corretas', 'Nenhuma é culta', 'C', 20, 3, 'Português', 4),
('O que é coesão textual?', 'Relação entre frases', 'Ortografia correta', 'Pontuação adequada', 'Vocabulário rico', 'A', 20, 3, 'Português', 4);

-- Inserir desafios de Inglês
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('What is the translation of "casa" in English?', 'House', 'Car', 'Tree', 'Book', 'A', 10, 1, 'Inglês', 1),
('How do you say "obrigado" in English?', 'Please', 'Thank you', 'Sorry', 'Hello', 'B', 10, 1, 'Inglês', 1),
('What is the past tense of "go"?', 'Goed', 'Went', 'Gone', 'Going', 'B', 15, 1, 'Inglês', 1),
('Which article is correct: "___ apple" or "___ apple"?', 'A / An', 'An / A', 'The / A', 'A / The', 'B', 15, 2, 'Inglês', 2),
('Which word is a synonym for "beautiful"?', 'Ugly', 'Pretty', 'Sad', 'Angry', 'B', 10, 1, 'Inglês', 2),
('Choose the correct sentence:', 'I go to school yesterday', 'I went to school yesterday', 'I will go to school yesterday', 'I going to school yesterday', 'B', 15, 2, 'Inglês', 3),
('What is the plural of "child"?', 'Childs', 'Children', 'Childes', 'Childrens', 'B', 15, 2, 'Inglês', 3),
('Which meal is eaten in the morning?', 'Lunch', 'Dinner', 'Breakfast', 'Snack', 'C', 10, 1, 'Inglês', 4),
('Choose the correct preposition: "I live ___ Brazil"', 'at', 'on', 'in', 'to', 'C', 15, 2, 'Inglês', 4),
('What is the comparative of "good"?', 'Gooder', 'Better', 'Best', 'More good', 'B', 15, 2, 'Inglês', 4);

-- Inserir desafios de Artes
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('Qual é o principal elemento das artes visuais?', 'Som', 'Cor', 'Palavras', 'Movimento', 'B', 10, 1, 'Artes', 1),
('O que é perspectiva em pintura?', 'Técnica de representação tridimensional', 'Tipo de pincel', 'Cor primária', 'Estilo artístico', 'A', 20, 3, 'Artes', 1),
('Quem pintou a Mona Lisa?', 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo', 'C', 15, 2, 'Artes', 1),
('O que é barroco na arte?', 'Estilo simples e minimalista', 'Estilo dramático e ornamentado', 'Arte abstrata', 'Arte primitiva', 'B', 20, 3, 'Artes', 2),
('Qual é o instrumento musical de cordas?', 'Flauta', 'Violino', 'Trompete', 'Bateria', 'B', 10, 1, 'Artes', 2),
('O que é ritmo em música?', 'Altura dos sons', 'Duração dos sons', 'Intensidade dos sons', 'Timbre dos sons', 'B', 15, 2, 'Artes', 2),
('Qual é a dança típica brasileira?', 'Tango', 'Samba', 'Flamenco', 'Valsa', 'B', 10, 1, 'Artes', 3),
('O que é expressionismo?', 'Arte realista', 'Arte que expressa emoções', 'Arte religiosa', 'Arte clássica', 'B', 20, 3, 'Artes', 3),
('Qual é o movimento artístico do século XX?', 'Renascimento', 'Barroco', 'Cubismo', 'Romantismo', 'C', 20, 3, 'Artes', 4),
('O que é cenografia?', 'Arte de escrever peças', 'Arte de decorar palcos', 'Arte de dirigir atores', 'Arte de compor músicas', 'B', 15, 2, 'Artes', 4);

-- Inserir desafios de Filosofia
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('O que estuda a filosofia?', 'Ciências naturais', 'Questões fundamentais da existência', 'Linguagens', 'Matemática', 'B', 15, 2, 'Filosofia', 1),
('Quem foi Sócrates?', 'Rei de Atenas', 'Filósofo grego', 'Poeta romano', 'Médico egípcio', 'B', 15, 2, 'Filosofia', 1),
('O que é epistemologia?', 'Teoria do conhecimento', 'Teoria da justiça', 'Teoria da arte', 'Teoria da linguagem', 'A', 20, 3, 'Filosofia', 1),
('Qual é o método socrático?', 'Máieutica', 'Dialética', 'Retórica', 'Silogismo', 'A', 20, 3, 'Filosofia', 2),
('O que é "cogito ergo sum"?', 'Penso logo existo', 'Vivo logo penso', 'Sinto logo sou', 'Sei logo existo', 'A', 20, 3, 'Filosofia', 2),
('Quem foi o autor de "A República"?', 'Aristóteles', 'Platão', 'Sócrates', 'Descartes', 'B', 15, 2, 'Filosofia', 2),
('O que é ética?', 'Estudo da beleza', 'Estudo do bem e do mal', 'Estudo da verdade', 'Estudo da linguagem', 'B', 15, 2, 'Filosofia', 3),
('Qual é a corrente filosófica de Nietzsche?', 'Existencialismo', 'Niilismo', 'Positivismo', 'Empirismo', 'B', 25, 3, 'Filosofia', 3),
('O que é metafísica?', 'Estudo da natureza', 'Estudo do ser como ser', 'Estudo da sociedade', 'Estudo da mente', 'B', 25, 3, 'Filosofia', 4),
('Quem foi Immanuel Kant?', 'Iluminista alemão', 'Existencialista francês', 'Empirista inglês', 'Fenomenólogo alemão', 'A', 20, 3, 'Filosofia', 4);

-- Inserir desafios de Sociologia
INSERT INTO challenges (question, option_a, option_b, option_c, option_d, correct_answer, xp_reward, difficulty, subject, module_id) VALUES
('O que estuda a sociologia?', 'Indivíduo isolado', 'Sociedade e relações sociais', 'Animais em grupo', 'Estruturas econômicas', 'B', 15, 2, 'Sociologia', 1),
('Quem é considerado o pai da sociologia?', 'Karl Marx', 'Émile Durkheim', 'Auguste Comte', 'Max Weber', 'C', 20, 3, 'Sociologia', 1),
('O que é socialização?', 'Processo de isolamento', 'Processo de integração social', 'Conflito entre classes', 'Mudança cultural rápida', 'B', 15, 2, 'Sociologia', 1),
('Qual é o conceito de "alienação" em Marx?', 'Integração social', 'Perda da essência humana', 'Igualdade social', 'Mobilidade social', 'B', 25, 3, 'Sociologia', 2),
('O que é cultura?', 'Apenas costumes materiais', 'Conjunto de valores e normas', 'Somente tradições', 'Exclusivamente arte', 'B', 15, 2, 'Sociologia', 2),
('Qual é a função da família na sociedade?', 'Apenas econômica', 'Reprodução e socialização', 'Somente religiosa', 'Exclusivamente política', 'B', 15, 2, 'Sociologia', 3),
('O que é estratificação social?', 'Igualdade entre pessoas', 'Desigualdade social estruturada', 'Mobilidade constante', 'Ausência de classes', 'B', 20, 3, 'Sociologia', 3),
('Qual é o conceito de "habitus" em Bourdieu?', 'Disposições duradouras', 'Capital econômico', 'Poder político', 'Normas sociais', 'A', 25, 3, 'Sociologia', 4),
('O que é globalização?', 'Isolamento nacional', 'Interdependência mundial', 'Conflito internacional', 'Independência cultural', 'B', 20, 3, 'Sociologia', 4),
('Qual é o papel da educação na sociedade?', 'Somente transmissão de conhecimento', 'Reprodução cultural e social', 'Apenas profissional', 'Exclusivamente moral', 'B', 20, 3, 'Sociologia', 4);

-- Verificar se tudo foi inserido corretamente
SELECT COUNT(*) as total_challenges FROM challenges;
SELECT subject, COUNT(*) as count_by_subject FROM challenges GROUP BY subject ORDER BY subject;