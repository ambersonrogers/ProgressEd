# 📚 ProgressEd - Plataforma Educacional Gamificada

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-336791)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://www.docker.com)

> Uma plataforma educacional 🎓 moderna com sistema de gamificação, desafios interativos e ranking competitivo. **100% Multiplataforma**: Web, Desktop, Mobile e Cloud.

## 🎯 Características

✅ **Dashboard Gamificado**
- Sistema de XP e Níveis com badges visuais
- Barra de progresso dinâmica
- Ranking competitivo em tempo real

✅ **Sistema de Desafios**
- Desafios interativos com múltiplas disciplinas
- Filtros por matéria e busca por nome
- Feedback visual ao completar desafios

✅ **Autenticação Segura**
- JWT com hash bcrypt
- Variáveis de ambiente seguras
- Suporte a múltiplos papéis (aluno, professor)

✅ **Interface Responsiva**
- Otimizado para mobiles, tablets e desktops
- PWA com suporte offline
- Tema dark moderno

✅ **Multiplataforma**
- 🌐 Web (React + Vite)
- 🖥️ Desktop (Electron ready)
- 📱 Mobile (React Native ready)
- 🐳 Docker & Kubernetes
- ☁️ Cloud deployment

---

## 🚀 Quick Start

### 1. **Web (Desenvolvimento)**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/progressd.git
cd progressd

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Inicie PostgreSQL (Docker)
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15

# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

**Acesso**: http://localhost:5173

### 1.2 **Deploy na Nuvem (Para Amigos de Outras Cidades)**

Para permitir acesso global, faça deploy na nuvem usando Vercel + Railway.

**📖 Guia Completo**: Veja `DEPLOY_GUIA.md` para instruções detalhadas.

**🚀 Deploy Rápido**: Execute `deploy_nuvem.bat` para guia interativo.
Se o computador estiver na mesma rede Wi-Fi ou LAN, seus amigos podem abrir o app em qualquer navegador pelo IP do seu PC:

```bash
# Descubra o IP local do computador
# Windows: ipconfig | findstr /R /C:"IPv4"
# Linux/macOS: ifconfig | grep inet
```
Acesse no celular ou outro PC:
```text
http://SEU_IP_LOCAL:5173
```

### 1.2 **Testar no celular como app PWA**
- Abra o endereço no navegador do celular
- Toque em “Adicionar à tela inicial”
- O app carregará em modo standalone como um aplicativo

### 2. **Docker (Recomendado)**

```bash
# Build e run
docker-compose up --build

# Acesso
# Frontend: http://localhost:80
# API: http://localhost:5000/api
```

### 3. **Kubernetes**

```bash
docker build -t seu-registry/progressd:1.0.0 .
docker push seu-registry/progressd:1.0.0

helm install progressd ./helm \
  --namespace progressd \
  --create-namespace
```

---

## 📦 Estrutura do Projeto

```
progressd/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── pages/           # Páginas (Dashboard, Login, etc)
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── services/        # API client (axios)
│   │   └── App.jsx
│   ├── public/              # Assets estáticos
│   ├── manifest.json        # PWA manifest
│   └── service-worker.js    # Service Worker offline
│
├── backend/                  # Express + PostgreSQL
│   ├── routes/              # Endpoints API
│   │   ├── auth.js         # Autenticação
│   │   ├── challenges.js   # Desafios
│   │   ├── users.js        # Usuários
│   │   └── ranking.js      # Ranking
│   ├── middleware/          # Middlewares (auth, etc)
│   ├── config/              # Database config
│   └── server.js            # Entrada principal
│
├── docker-compose.yml       # Stack completa (multi-serviço)
├── Dockerfile               # Build multiplataforma
├── nginx.conf              # Servidor web/proxy
├── DEPLOYMENT.md           # Guia de deployment
└── README.md              # Este arquivo
```

---

## 🔧 Configuração

### Variáveis de Ambiente

**Frontend (.env.local)**
```bash
VITE_API_URL=http://localhost:5000/api
VITE_PLATFORM=web
VITE_PWA_ENABLED=true
```

**Backend (.env)**
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/progressd
JWT_SECRET=sua-chave-super-segura
NODE_ENV=development
PORT=5000
```

Veja `.env.example` para todas as opções.

---

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token

### Usuários
- `GET /api/users/profile` - Perfil do usuário logado
- `GET /api/ranking` - Top 10 alunos por XP
- `PUT /api/users/:id` - Atualizar perfil

### Desafios
- `GET /api/challenges` - Listar todos os desafios
- `GET /api/challenges/:id` - Detalhes do desafio
- `POST /api/challenges/:id/submit` - Submeter resposta

---

## 🎨 Paleta de Cores & Design

- **Primary**: `#667eea` (Roxo)
- **Secondary**: `#764ba2` (Roxo escuro)
- **Background**: `#0f0f23` (Preto profundo)
- **Cards**: `#1a1a2e` (Cinza escuro)

Tema dark moderno com gradientes e animações suaves.

---

## 🧪 Testes

### Frontend
```bash
cd frontend
npm run lint      # ESLint
npm test          # Jest (quando configurado)
```

### Backend
```bash
cd backend
npm run lint      # ESLint
npm test          # Jest
npm run test:watch
```

---

## 🔐 Segurança

✅ Checklist de segurança:
- [x] Variáveis de ambiente seguras
- [x] Hashing bcrypt para senhas
- [x] JWT para autenticação
- [x] SSL/TLS ready
- [x] CORS configurável
- [x] Rate limiting ready
- [x] Input sanitization
- [x] Headers de segurança

Para produção:
1. Configure HTTPS
2. Use `NODE_ENV=production`
3. Atualize `JWT_SECRET` e `DB_PASSWORD`
4. Habilite rate limiting
5. Configure backup automático

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| Linhas de Código | 5000+ |
| Desafios de Exemplo | 50+ |
| Disciplinas | 10+ |
| Componentes React | 20+ |
| Roteamentos | 15+ |
| API Endpoints | 25+ |
| Responsividade | 100% |

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.4
- **Vite** 8.0.7
- **React Router** 7.14
- **Axios** 1.14
- **CSS3** com variáveis
- **PWA** com Service Worker

### Backend
- **Node.js** 18+
- **Express** 5.2.1
- **PostgreSQL** 13+
- **JWT** para auth
- **bcryptjs** para senhas

### DevOps
- **Docker** & Docker Compose
- **Kubernetes** ready
- **Nginx** como proxy/server
- **GitHub Actions** para CI/CD

---

## 📱 Plataformas Suportadas

| Plataforma | Status | Comando |
|-----------|--------|---------|
| 🌐 Web | ✅ Pronto | `npm run dev` |
| 🖥️ Desktop | 🔄 Próximo | `npm run dev:desktop` |
| 📱 Mobile | 🔄 Próximo | `npm run dev:mobile` |
| 🐳 Docker | ✅ Pronto | `docker-compose up` |
| ☸️ Kubernetes | ✅ Pronto | Ver [DEPLOYMENT.md](DEPLOYMENT.md) |

---

## 🚀 Deployment

### Desenvolvimento
```bash
npm install
npm run dev
```

### Produção Local
```bash
npm run build
npm run preview
```

### Docker
```bash
docker-compose up --build
```

### Cloud (Vercel, Netlify, Heroku, AWS)
Veja [DEPLOYMENT.md](DEPLOYMENT.md) para instruções específicas.

---

## 📚 Documentação

- [DEPLOYMENT.md](DEPLOYMENT.md) - Guia completo de deployment multiplataforma
- [API.md](API.md) - Documentação dos endpoints
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura da aplicação
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guia de contribuição

---

## 🐛 Issues Conhecidos

Nenhum no momento! 🎉

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores & Créditos

- **ProgressEd Team** - Desenvolvimento inicial
- Construído com ❤️ para educadores e alunos

---

## 💬 Suporte

- 📖 [Documentação Completa](./docs)
- 🐛 [Reportar Issues](https://github.com/seu-usuario/progressd/issues)
- 💡 [Solicitar Features](https://github.com/seu-usuario/progressd/discussions)
- 📧 [Email](mailto:contato@progressd.com)

---

## 🙏 Agradecimentos

Obrigado a todos que contribuem com código, reportes de bugs e feedback!

---

**Última atualização**: 8 de Abril de 2026  
**Versão**: 1.0.0  
**Status**: Em Produção ✅

