# 🚀 ProgressEd - Deploy na Nuvem (Guia Completo)

## 📋 Por que fazer deploy?

Atualmente o app só funciona na sua rede local (192.168.1.248). Para amigos de outras cidades acessarem, precisamos colocar na **nuvem** (internet pública).

## 🛠️ Serviços Gratuitos Utilizados

### 🔥 Opção 1: Netlify + Railway (MAIS FÁCIL - Recomendado)
- **Netlify**: https://netlify.com (Frontend - upload manual, super simples)
- **Railway**: https://railway.app (Backend)

### ⚡ Opção 2: Vercel + Railway (Mais Avançado)
- **Vercel**: https://vercel.com (Frontend - via CLI)
- **Railway**: https://railway.app (Backend)

## 📝 Passo a Passo do Deploy

### 1. **Preparar Contas**

#### Criar conta no Vercel:
1. Acesse https://vercel.com
2. Clique "Sign Up"
3. Cadastre-se com GitHub (recomendado)
4. Confirme seu e-mail

#### Criar conta no Railway:
1. Acesse https://railway.app
2. Clique "Sign Up"
3. Cadastre-se com GitHub
4. Adicione cartão de crédito (não cobra, apenas verificação)

### 2. **Instalar CLIs**

Abra o terminal e execute:
```bash
# Instalar Vercel CLI
npm install -g vercel

# Instalar Railway CLI
npm install -g @railway/cli
```

### 3. **Deploy do Frontend (Netlify - MAIS FÁCIL)**

#### Método 1: Via Site (Mais Fácil)
1. Acesse https://netlify.com
2. Cadastre-se com GitHub
3. Clique "Add new site" → "Deploy manually"
4. Arraste a pasta `frontend/dist` (após `npm run build`)
5. Configure variável: `VITE_API_URL` = URL do Railway

#### Método 2: Via CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Navegar para frontend
cd frontend

# Fazer build
npm run build

# Fazer login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Resultado**: URL como `https://amazing-site.netlify.app`

### 4. **Deploy do Backend (Railway)**

```bash
# Navegar para backend
cd ../backend

# Fazer login no Railway
railway login

# Inicializar projeto
railway init

# Fazer deploy
railway up
```

**Resultado**: URL como `https://progressed-backend.up.railway.app`

### 5. **Configurar Variáveis de Ambiente**

No Railway, configure:
- `DATABASE_URL`: Sua URL do Supabase (já está no .env)
- `JWT_SECRET`: Uma chave segura (já está no .env)
- `NODE_ENV`: production
- `PORT`: 5000

### 6. **Atualizar Frontend**

No Vercel, adicione variável de ambiente:
- `VITE_API_URL`: URL do backend Railway

## 🎯 Resultado Final

Após o deploy, você terá:
- **Frontend**: https://seu-app.vercel.app
- **Backend**: https://seu-backend.up.railway.app

**Qualquer pessoa no mundo pode acessar!** 🌍

## 🔧 Comandos Rápidos

Execute o arquivo `deploy_nuvem.bat` para um guia passo-a-passo interativo.

## 🆘 Problemas Comuns

### Vercel não faz deploy:
- Certifique-se de estar logado: `vercel login`
- Verifique se o build funciona: `npm run build`

### Railway erro de build:
- Verifique se o Dockerfile está correto
- Certifique-se de que as dependências estão no package.json

### App não conecta com backend:
- Atualize `VITE_API_URL` no Vercel com a URL do Railway
- Verifique se o Railway está rodando: `railway logs`

## 💡 Dicas

- **Netlify é mais fácil** para iniciantes (upload manual)
- **Vercel é mais avançado** mas tem melhor integração Git
- **Domínios customizados**: Ambos permitem domínios próprios
- **Monitoramento**: Vercel e Railway têm logs e métricas
- **Backup**: Railway faz backup automático do banco
- **Escalabilidade**: Planos pagos para mais usuários

---

**Precisa de ajuda? Execute `deploy_nuvem.bat` para instruções guiadas!**