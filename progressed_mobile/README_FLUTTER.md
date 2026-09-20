# 📱 ProgressEd Mobile (Flutter Edition)

Versão nativa multiplataforma (Android, iOS, Web e Windows) da plataforma educacional gamificada **ProgressEd**, concebida para os estudantes e professores do **Centro Educa Mais Paulo Freire** (Timbiras/MA).

Este projeto foi construído em consonância com as disciplinas de **Prática Profissional Supervisionada (Segunda Etapa)** e **Vivências – Empreendedorismo (CST em Análise e Desenvolvimento de Sistemas - UEMA/UEMANET)**.

---

## 🎯 Por que criar uma versão em Flutter? (Análise Empreendedora e Pedagógica)

1. **Inclusão Digital e Realidade do Aluno:** No interior do Maranhão, nem todo estudante possui computador em casa, mas quase todos possuem um smartphone Android (modelo BYOD - *Bring Your Own Device*).
2. **Execução Offline-First Resiliente:** Em escolas públicas com rede oscilante, o app armazena localmente o banco de questões da BNCC (Linguagens, Matemática, Ciências da Natureza, Humanas e Atualidades) via `SharedPreferences`. O estudante responde aos quizzes sem depender de sinal de internet, e o XP acumulado é sincronizado quando a conexão é restabelecida!
3. **Performance Nativa de 60 FPS:** Transições ultra-fluidas, animações de progresso e barra de XP circular/linear.
4. **Visão de Mercado e EdTech:** Empreendedorismo escalável com custo marginal quase nulo de replicação.

---

## 🏗️ Arquitetura do Aplicativo

```text
progressed_mobile/
├── lib/
│   ├── main.dart                       # Ponto de entrada e configuração do tema Dark
│   ├── models/
│   │   ├── user_model.dart             # Modelo do Aluno/Professor (XP, Nível, Perfil)
│   │   ├── challenge_model.dart        # Modelo de Quiz (Módulos, Alternativas, Feedback)
│   │   └── ranking_model.dart          # Modelo de Classificação e Pódio
│   ├── services/
│   │   ├── api_service.dart            # Conexão com API Node.js / Supabase em nuvem
│   │   ├── storage_service.dart        # Cache local offline com SharedPreferences
│   │   └── mock_bank.dart              # Banco de desafios offline da BNCC (5 módulos)
│   ├── providers/
│   │   └── auth_provider.dart          # Gerenciamento reativo de estado (Provider)
│   └── screens/
│       ├── login_screen.dart           # Login com botões rápidos de Aluno e Professor Demo
│       ├── student_dashboard_screen.dart # Hub das 5 trilhas, barra de XP e patentes
│       ├── quiz_screen.dart            # Quiz interativo com temporizador de 25s e feedback
│       ├── teacher_dashboard_screen.dart # Painel docente com métricas de turma
│       └── leaderboard_screen.dart     # Ranking geral com medalhas de pódio
├── pubspec.yaml                        # Dependências modernas do ecossistema Flutter
├── instalar_flutter.ps1                # Script de download e instalação automatizada do Flutter SDK
└── executar_app.bat                    # Executador em 1 clique (Web, Windows ou Android)
```

---

## 🚀 Como Baixar, Instalar e Executar

### Método 1: Execução Automática em 1 Clique (Recomendado)
Basta dar dois cliques no arquivo:
👉 `executar_app.bat`

O script verificará se o Flutter SDK já existe no seu computador. Se não estiver instalado, ele fará o download automatizado do SDK oficial para Windows, configurará as variáveis de ambiente e abrirá o menu para você rodar no **Navegador**, no **Windows Desktop** ou gerar o **APK** para celular!

### Método 2: Via Terminal (Comandos Manuais)
Se você já possui o Flutter configurado:
```bash
cd "c:\Users\amber\OneDrive\Área de Trabalho\ProgressEd\progressed_mobile"

# Baixar dependências
flutter pub get

# Executar no Chrome / Web
flutter run -d chrome

# Executar no Windows Desktop
flutter run -d windows

# Gerar o instalador APK para celular Android
flutter build apk --release
```

---

## ✨ Telas e Funcionalidades Principais

- **Login com Acesso Rápido:** Entre com seu e-mail ou use os botões instantâneos `🎓 Aluno Demo` e `👨‍🏫 Prof. Demo`.
- **Trilhas da BNCC:** Linguagens, Matemática, Ciências da Natureza, Ciências Humanas (com foco em Raízes do Brasil) e Atualidades.
- **Quizzes Cronometrados:** 25 segundos por desafio com explicações formativas ao final de cada questão.
- **XP e Patentes:** Suba de nível a cada 200 XP conquistados!
- **Painel do Professor:** Monitore a média de XP da turma, desafios completados e alunos em situação de alerta.
