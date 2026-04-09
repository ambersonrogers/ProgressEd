# 🚀 ProgressEd - Como Testar com Amigos

## 🌐 Acesso Global (Para Amigos de Outras Cidades)

### Opção 1: Deploy Automático (Recomendado)
```bash
# Execute este arquivo para deploy automático
deploy_nuvem.bat
```

### Opção 2: Deploy Manual

#### 1. Frontend no Vercel
```bash
npm install -g vercel
cd frontend
npm run build
vercel --prod
```

#### 2. Backend no Railway
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

### Resultado
- **Frontend**: URL pública (ex: https://progressed.vercel.app)
- **Backend**: URL pública (ex: https://progressed-backend.up.railway.app)

## 📱 Acesso Local (Mesma Rede Wi-Fi)

### No Computador ou Celular:
1. Abra o navegador
2. Acesse: **http://192.168.1.248:5179/**

### Como PWA no Celular:
1. Abra o link acima
2. Toque em "Adicionar à tela inicial"
3. O ProgressEd será instalado como app nativo

## 🎮 Como Usar

### Para Alunos:
- **Cadastre-se** ou **faça login**
- Escolha suas **disciplinas** no painel de filtros
- Ative o **modo aleatório** para misturar estudos
- Responda desafios e ganhe **XP** e **níveis**
- Veja seu progresso no **ranking**

### Configurações:
- Clique em ⚙️ **Configurações** para:
  - Escolher **linguagem de programação**
  - Alterar **tema visual** (Escola, Cyber, Aventura)

### Para Professores:
- Faça login como professor
- Veja estatísticas dos alunos
- Monitore progresso e ranking

## 🔧 Status Atual
- ✅ Frontend: http://192.168.1.248:5179/
- ✅ Backend API: http://192.168.1.248:5000/
- ✅ Banco de dados PostgreSQL rodando
- ✅ PWA funcional
- ✅ Responsivo para mobile

## 🧪 Como Testar

### Teste Local Automático
```bash
# Execute para verificar se tudo está funcionando
testar_local.bat
```

### Teste Manual
1. **PostgreSQL**: Deve estar rodando na porta 5432
2. **Backend**: `curl http://localhost:5000/` deve retornar JSON
3. **Frontend**: `curl http://localhost:5179/` deve retornar HTML

## 🎮 Como Usar
- [x] Cadastro e login
- [x] Dashboard do aluno
- [x] Sistema de desafios
- [x] Filtros por disciplina
- [x] Modo aleatório
- [x] Ranking
- [x] Temas visuais
- [x] Responsividade mobile
- [x] PWA offline

---
**Compartilhe este link com seus amigos: http://192.168.1.248:5179/**