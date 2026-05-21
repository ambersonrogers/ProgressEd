# ProgressEd v2.0 - Guia de Instalação Rápida

## 🚀 Instalação em 5 Minutos

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Git
- VS Code (recomendado)

### Passo 1: Extrair Arquivo
```bash
# Extrair o arquivo
tar -xzf ProgressEd-v2-melhorado.tar.gz

# Entrar na pasta
cd ProgressEd-melhorado
```

### Passo 2: Instalar Dependências
```bash
# Frontend
cd frontend
npm install

# Backend (em outro terminal)
cd backend
npm install
```

### Passo 3: Configurar Variáveis de Ambiente
```bash
# Frontend
cd frontend
cp .env.example .env.local

# Backend
cd backend
cp .env.example .env.local
```

**Edite `.env.local` com suas credenciais:**
```env
# Backend
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/progressd
JWT_SECRET=seu_jwt_secret_aqui

# Frontend
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Passo 4: Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Servidor rodando em http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Aplicação rodando em http://localhost:5173
```

### Passo 5: Acessar Aplicação
- Abra http://localhost:5173 no navegador
- Use as credenciais de teste:
  - Email: `test@example.com`
  - Senha: `password123`

---

## 📁 Estrutura do Projeto

```
ProgressEd-melhorado/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── pages/              # Páginas (Login, Dashboard, etc)
│   │   ├── components/         # Componentes (Leaderboard, Analytics)
│   │   ├── styles/             # CSS (login.css, leaderboard.css, etc)
│   │   ├── hooks/              # Custom hooks (useSocket.js)
│   │   └── services/           # API calls
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Express + Node.js
│   ├── routes/                 # Rotas API
│   ├── middleware/             # Autenticação, validação
│   ├── socketHandler.js        # Socket.io
│   ├── package.json
│   └── server.js
│
├── Dockerfile                   # Docker multi-stage
├── docker-compose.yml          # Docker Compose
├── DEPLOY_OTIMIZADO.md        # Guia de deploy
├── README_MELHORIAS.md         # Novidades v2.0
└── INSTALACAO_RAPIDA.md        # Este arquivo
```

---

## 🎨 Principais Melhorias

### 1. **Login Dark/Neon Blue**
- Tela de login completamente redesenhada
- Tema escuro com gradiente neon
- Responsivo em todos os dispositivos
- OAuth integrado (Google, GitHub, Microsoft)

### 2. **Multiplayer em Tempo Real**
- Socket.io para comunicação em tempo real
- Competição ao vivo entre alunos
- Sincronização instantânea de respostas

### 3. **Leaderboard Global**
- Ranking com filtros (semana, mês, todos os tempos)
- Sistema de badges/conquistas
- Medalhas para top 3

### 4. **Analytics para Professores**
- Dashboard com gráficos de desempenho
- Estatísticas por categoria
- Histórico de sessões
- Melhores desempenhos

### 5. **Deploy Otimizado**
- Docker multi-stage
- Vercel (Frontend)
- Railway (Backend)
- Supabase (Database)
- CI/CD com GitHub Actions

---

## 🔧 Comandos Úteis

### Frontend
```bash
cd frontend

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

### Backend
```bash
cd backend

# Desenvolvimento
npm run dev

# Produção
npm start

# Testes
npm test

# Migrations
npm run migrate
npm run db:seed
npm run db:reset

# Linting
npm run lint
npm run lint:fix
```

---

## 📊 Testar Funcionalidades

### Login
1. Acesse http://localhost:5173
2. Clique em "Cadastre-se"
3. Preencha nome, email e senha
4. Clique em "Cadastrar"

### Leaderboard
1. Faça login como aluno
2. Clique em "Ranking" no menu
3. Veja o leaderboard global
4. Filtre por semana/mês/todos os tempos

### Analytics (Professor)
1. Faça login como professor
2. Vá para "Analytics"
3. Selecione uma sala
4. Veja gráficos e estatísticas

### Multiplayer
1. Abra dois navegadores
2. Faça login em ambos
3. Ambos entram na mesma sala
4. Veja as respostas sincronizadas em tempo real

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'socket.io'"
```bash
cd backend && npm install socket.io
```

### Erro: "ECONNREFUSED" no banco de dados
```bash
# Verifique se PostgreSQL está rodando
# Ou use SQLite para desenvolvimento:
DATABASE_URL=sqlite:./dev.db npm run dev
```

### Frontend não conecta ao backend
```bash
# Verifique VITE_API_URL em frontend/.env.local
# Deve apontar para http://localhost:5000
```

### Porta 5000 já em uso
```bash
# Use outra porta
PORT=5001 npm run dev
```

---

## 📚 Documentação Completa

- `README_MELHORIAS.md` - Detalhes das melhorias
- `DEPLOY_OTIMIZADO.md` - Guia de deploy em produção
- `DEPLOYMENT.md` - Deploy original
- `COMO_TESTAR.md` - Testes

---

## 🚀 Deploy em Produção

Para fazer deploy em produção, veja `DEPLOY_OTIMIZADO.md` com instruções para:
- ✅ Vercel (Frontend)
- ✅ Railway (Backend + Database)
- ✅ Supabase (Database)
- ✅ Docker (VPS/Self-hosted)
- ✅ CI/CD com GitHub Actions

---

## 💡 Dicas

1. **Use VS Code** com extensões:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - Thunder Client (para testar API)

2. **Instale ferramentas úteis:**
   ```bash
   npm install -g nodemon  # Auto-reload
   npm install -g concurrently  # Rodar múltiplos comandos
   ```

3. **Rode frontend e backend juntos:**
   ```bash
   # Na raiz do projeto
   npm install -g concurrently
   concurrently "cd frontend && npm run dev" "cd backend && npm run dev"
   ```

---

## ✅ Checklist de Configuração

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (npm install)
- [ ] Variáveis de ambiente configuradas (.env.local)
- [ ] Banco de dados criado/migrado
- [ ] Backend rodando (http://localhost:5000)
- [ ] Frontend rodando (http://localhost:5173)
- [ ] Login funcionando
- [ ] Leaderboard carregando
- [ ] Analytics exibindo dados
- [ ] Socket.io conectado

---

## 🎓 Próximos Passos

1. Explore o código
2. Customize as cores e estilos
3. Adicione suas próprias questões
4. Configure OAuth (Google, GitHub, Microsoft)
5. Faça deploy em produção

---

## 📞 Suporte

Dúvidas? Veja:
- `README_MELHORIAS.md` - Novidades
- `DEPLOY_OTIMIZADO.md` - Deploy
- GitHub Issues - Problemas conhecidos

---

**Versão:** 2.0.0  
**Última atualização:** Maio 2026  
**Status:** ✅ Pronto para Usar
