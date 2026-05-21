# ProgressEd - Guia de Deploy Otimizado

## 📋 Índice
1. [Vercel (Frontend)](#vercel-frontend)
2. [Railway (Backend + Database)](#railway-backend--database)
3. [Supabase (Database)](#supabase-database)
4. [Docker (VPS/Self-hosted)](#docker-vpsself-hosted)
5. [CI/CD com GitHub Actions](#cicd-com-github-actions)

---

## Vercel (Frontend)

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Repositório no GitHub

### Passos

1. **Conectar Repositório**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Clique em "Import Git Repository"
   - Selecione seu repositório ProgressEd

2. **Configurar Projeto**
   - **Project Name:** progressd-frontend
   - **Framework:** Vite
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Variáveis de Ambiente**
   ```
   VITE_API_URL=https://api.progressd.railway.app
   VITE_SOCKET_URL=https://api.progressd.railway.app
   VITE_APP_NAME=ProgressEd
   ```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde a build completar
   - Seu site estará disponível em `https://progressd-frontend.vercel.app`

### Domínio Customizado
- Vá para Settings > Domains
- Adicione seu domínio (ex: `progressd.com`)
- Configure DNS conforme instruções

---

## Railway (Backend + Database)

### Pré-requisitos
- Conta no [Railway](https://railway.app)
- Repositório no GitHub

### Passos

1. **Criar Novo Projeto**
   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"

2. **Conectar Repositório**
   - Autorize Railway no GitHub
   - Selecione repositório ProgressEd

3. **Adicionar Serviços**

   **Backend (Node.js)**
   - Clique em "+ Add Service"
   - Selecione "GitHub Repo"
   - Configure:
     - **Root Directory:** `./backend`
     - **Start Command:** `node server.js`
     - **Port:** `5000`

   **Database (PostgreSQL)**
   - Clique em "+ Add Service"
   - Selecione "PostgreSQL"
   - Railway criará automaticamente

4. **Configurar Variáveis de Ambiente**

   Backend:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=https://progressd.vercel.app
   ```

5. **Deploy**
   - Railway fará deploy automático a cada push no GitHub
   - Acesse seu backend em `https://progressd-backend.railway.app`

---

## Supabase (Database)

### Pré-requisitos
- Conta no [Supabase](https://supabase.com)

### Passos

1. **Criar Projeto**
   - Acesse [supabase.com](https://supabase.com)
   - Clique em "New Project"
   - Configure:
     - **Project Name:** progressd
     - **Database Password:** (salve em local seguro)
     - **Region:** Mais próxima de seus usuários

2. **Obter Connection String**
   - Vá para Settings > Database
   - Copie a "Connection string"
   - Use como `DATABASE_URL` no Railway

3. **Executar Migrations**
   ```bash
   # No seu computador local
   cd backend
   DATABASE_URL="sua_connection_string" npm run migrate
   npm run db:seed
   ```

4. **Configurar Auth (Opcional)**
   - Vá para Authentication > Providers
   - Configure Google, GitHub, Microsoft OAuth
   - Copie Client IDs e Secrets para variáveis de ambiente

---

## Docker (VPS/Self-hosted)

### Pré-requisitos
- VPS com Docker instalado
- Domínio apontando para seu VPS
- SSH acesso ao VPS

### Passos

1. **Preparar VPS**
   ```bash
   # SSH no seu VPS
   ssh root@seu_vps_ip

   # Instalar Docker e Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Instalar Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Clonar Repositório**
   ```bash
   cd /opt
   git clone https://github.com/seu_usuario/ProgressEd.git
   cd ProgressEd
   ```

3. **Configurar Variáveis de Ambiente**
   ```bash
   cp .env.example .env.production
   nano .env.production
   # Edite com suas credenciais
   ```

4. **Executar com Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

5. **Configurar Nginx (Reverse Proxy)**
   ```bash
   # Instalar Nginx
   sudo apt-get install nginx

   # Criar configuração
   sudo nano /etc/nginx/sites-available/progressd
   ```

   Adicione:
   ```nginx
   server {
       listen 80;
       server_name progressd.com www.progressd.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Ativar site
   sudo ln -s /etc/nginx/sites-available/progressd /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL com Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d progressd.com -d www.progressd.com
   ```

---

## CI/CD com GitHub Actions

### Criar Workflow

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy ProgressEd

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install dependencies (Frontend)
        run: cd frontend && npm ci
      
      - name: Build Frontend
        run: cd frontend && npm run build
      
      - name: Install dependencies (Backend)
        run: cd backend && npm ci
      
      - name: Run tests
        run: cd backend && npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: railway-app/deploy-action@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## Monitoramento & Logs

### Railway
- Acesse [railway.app/dashboard](https://railway.app/dashboard)
- Clique no seu projeto
- Vá para "Logs" para ver logs em tempo real

### Vercel
- Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
- Clique no seu projeto
- Vá para "Deployments" para histórico

### Docker (VPS)
```bash
# Ver logs
docker-compose logs -f backend

# Ver status dos containers
docker-compose ps

# Reiniciar serviço
docker-compose restart backend
```

---

## Troubleshooting

### Erro de Conexão com Banco de Dados
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL -c "SELECT 1"
```

### Frontend não conecta ao Backend
- Verifique `VITE_API_URL` no Vercel
- Verifique CORS no backend
- Teste com `curl https://seu-backend.com/health`

### Docker não inicia
```bash
# Verificar logs
docker-compose logs

# Reconstruir imagem
docker-compose build --no-cache

# Reiniciar
docker-compose down && docker-compose up -d
```

---

## Performance & Otimizações

### Frontend (Vercel)
- Ativar Edge Caching
- Usar Image Optimization
- Minify CSS/JS

### Backend (Railway)
- Usar Redis para cache
- Implementar rate limiting
- Usar connection pooling no banco

### Database (Supabase)
- Criar índices nas queries frequentes
- Usar prepared statements
- Monitorar query performance

---

## Segurança

✅ Checklist:
- [ ] Usar HTTPS em produção
- [ ] Configurar CORS corretamente
- [ ] Validar todas as inputs
- [ ] Usar variáveis de ambiente para secrets
- [ ] Implementar rate limiting
- [ ] Usar JWT com expiração
- [ ] Fazer backup regular do banco
- [ ] Monitorar logs de erro
- [ ] Usar firewall/WAF
- [ ] Atualizar dependências regularmente

---

## Suporte

Para dúvidas ou problemas:
- 📧 Email: support@progressd.com
- 🐛 Issues: github.com/seu_usuario/ProgressEd/issues
- 💬 Discord: discord.gg/progressd

---

**Última atualização:** Maio 2026
**Versão:** 1.0.0
