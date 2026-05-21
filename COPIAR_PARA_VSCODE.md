# 📋 Como Copiar para VS Code

## ✅ Projeto Pronto para Usar!

O projeto **ProgressEd v2.0** está 100% pronto. Basta copiar os arquivos para sua pasta local e abrir no VS Code.

---

## 🚀 Passo a Passo

### 1️⃣ Extrair Arquivo (se necessário)
```bash
# Se recebeu em .tar.gz
tar -xzf ProgressEd-v2-melhorado-final.tar.gz

# Se recebeu em .zip
unzip ProgressEd-v2-melhorado-final.zip
```

### 2️⃣ Copiar para Pasta do Projeto

**Windows (PowerShell):**
```powershell
# Copiar tudo
Copy-Item -Path "C:\caminho\ProgressEd-FINAL\*" -Destination "C:\Users\SeuUsuario\ProgressEd" -Recurse -Force

# Ou manualmente:
# 1. Abra a pasta ProgressEd-FINAL
# 2. Selecione tudo (Ctrl+A)
# 3. Copie (Ctrl+C)
# 4. Abra a pasta ProgressEd do seu computador
# 5. Cole (Ctrl+V)
```

**Mac/Linux:**
```bash
cp -r ProgressEd-FINAL/* ~/seu_caminho/ProgressEd/
```

### 3️⃣ Abrir no VS Code
```bash
# Abrir pasta
code ~/seu_caminho/ProgressEd

# Ou manualmente:
# 1. Abra VS Code
# 2. File > Open Folder
# 3. Selecione a pasta ProgressEd
```

### 4️⃣ Instalar Dependências

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
```

**Terminal 2 - Backend (em outro terminal):**
```bash
cd backend
npm install
```

### 5️⃣ Configurar Variáveis de Ambiente

**Frontend (.env.local):**
```bash
cd frontend
# Edite o arquivo .env.local com:
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=ProgressEd
```

**Backend (.env.local):**
```bash
cd backend
# Edite o arquivo .env.local com:
NODE_ENV=development
PORT=5000
DATABASE_URL=sua_connection_string
JWT_SECRET=seu_jwt_secret_aqui
FRONTEND_URL=http://localhost:5173
```

### 6️⃣ Iniciar Aplicação

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

### 7️⃣ Acessar Aplicação
- Abra http://localhost:5173 no navegador
- Veja o novo login com design dark/neon blue!

---

## 📁 Estrutura de Pastas

```
ProgressEd/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   └── Login.jsx       ✅ Novo design
│   │   ├── components/
│   │   │   ├── Leaderboard.jsx ✅ Novo
│   │   │   └── Analytics.jsx   ✅ Novo
│   │   ├── styles/
│   │   │   ├── login.css       ✅ Novo (dark/neon)
│   │   │   ├── leaderboard.css ✅ Novo
│   │   │   └── analytics.css   ✅ Novo
│   │   ├── hooks/
│   │   │   └── useSocket.js    ✅ Novo
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Express + Node.js
│   ├── routes/
│   │   └── analytics.js        ✅ Novo
│   ├── socketHandler.js        ✅ Novo
│   ├── package.json
│   └── server.js
│
├── Dockerfile                   ✅ Otimizado
├── docker-compose.yml
├── .env.example
├── .env.production
├── INSTALACAO_RAPIDA.md        ✅ Guia rápido
├── DEPLOY_OTIMIZADO.md         ✅ Deploy produção
├── README_MELHORIAS.md         ✅ Novidades
└── COPIAR_PARA_VSCODE.md       ← Este arquivo
```

---

## ✨ O Que Mudou

### Login (Novo Design)
- ✅ Dark theme com neon blue
- ✅ Fundo animado com partículas
- ✅ Card com border azul
- ✅ Logo "ProgressEd" com gradiente
- ✅ Campos de usuário e senha
- ✅ Botão "Entrar" com efeito neon
- ✅ Botões OAuth (Google, GitHub, Microsoft)
- ✅ Links "Cadastre-se" e "Esqueceu sua senha?"
- ✅ Totalmente responsivo

### Novos Componentes
- ✅ **Leaderboard.jsx** - Ranking global com filtros
- ✅ **Analytics.jsx** - Dashboard para professores
- ✅ **useSocket.js** - Hook para Socket.io

### Novos Arquivos
- ✅ `socketHandler.js` - Multiplayer real-time
- ✅ `routes/analytics.js` - APIs de analytics
- ✅ `styles/login.css` - Estilos dark/neon
- ✅ `styles/leaderboard.css` - Estilos leaderboard
- ✅ `styles/analytics.css` - Estilos analytics

---

## 🔧 Troubleshooting

### Erro: "Cannot find module"
```bash
# Reinstale dependências
npm install
```

### Porta 5000 já em uso
```bash
# Use outra porta
PORT=5001 npm run dev
```

### Frontend não conecta ao backend
```bash
# Verifique VITE_API_URL em frontend/.env.local
# Deve ser http://localhost:5000
```

### Erro de CORS
```bash
# Verifique CORS_ORIGIN no backend/.env.local
# Deve incluir http://localhost:5173
```

---

## 📊 Testar Funcionalidades

### 1. Login
1. Acesse http://localhost:5173
2. Veja o novo design dark/neon blue
3. Clique em "Cadastre-se"
4. Preencha nome, email e senha
5. Clique em "Cadastrar"

### 2. Leaderboard
1. Faça login
2. Clique em "Ranking" no menu
3. Veja o leaderboard global
4. Teste filtros (semana/mês/todos os tempos)

### 3. Analytics (Professor)
1. Faça login como professor
2. Vá para "Analytics"
3. Selecione uma sala
4. Veja gráficos e estatísticas

---

## 🎨 Customizar Design

### Cores
Edite `frontend/src/styles/login.css`:
```css
/* Mudar cor primária */
--primary: #3b82f6;        /* Azul */
--primary-dark: #0ea5e9;   /* Azul Claro */

/* Mudar cor de fundo */
--bg-dark: #0a0e27;        /* Fundo Escuro */
```

### Fontes
Edite `frontend/index.html`:
```html
<!-- Adicionar fonte customizada -->
<link href="https://fonts.googleapis.com/css2?family=YusuFont:wght@400;600;900&display=swap" rel="stylesheet">
```

### Animações
Edite `frontend/src/styles/login.css`:
```css
/* Mudar velocidade de animação */
@keyframes cardSlideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## 📚 Documentação

- **INSTALACAO_RAPIDA.md** - Guia rápido (5 minutos)
- **README_MELHORIAS.md** - Detalhes das melhorias v2.0
- **DEPLOY_OTIMIZADO.md** - Deploy em produção (Vercel, Railway, Supabase, Docker)
- **README.md** - Documentação geral do projeto

---

## ✅ Checklist

- [ ] Arquivo extraído
- [ ] Pasta copiada para seu computador
- [ ] Aberto em VS Code
- [ ] `npm install` executado (frontend e backend)
- [ ] `.env.local` configurado
- [ ] Backend rodando (http://localhost:5000)
- [ ] Frontend rodando (http://localhost:5173)
- [ ] Login funcionando com novo design
- [ ] Leaderboard carregando
- [ ] Analytics exibindo dados

---

## 🎓 Próximos Passos

1. ✅ Explore o novo design do login
2. ✅ Teste leaderboard e analytics
3. ✅ Customize cores e estilos conforme necessário
4. ✅ Configure OAuth (Google, GitHub, Microsoft)
5. ✅ Faça deploy em produção (ver DEPLOY_OTIMIZADO.md)

---

## 📞 Suporte

Dúvidas? Veja:
- `INSTALACAO_RAPIDA.md` - Instalação rápida
- `README_MELHORIAS.md` - Novidades
- `DEPLOY_OTIMIZADO.md` - Deploy

---

**Versão:** 2.0.0  
**Status:** ✅ Pronto para Usar  
**Data:** Maio 2026

Bom desenvolvimento! 🚀
