# 🚀 ProgressEd - Guia de Deployment Multiplataforma

Plataforma educacional gamificada com suporte para **Web, Desktop, Mobile e Cloud**.

## 📋 Sumário
- [Requisitos](#requisitos)
- [Instalação Web](#instalação-web)
- [Deployment Docker](#deployment-docker)
- [Deployment Kubernetes](#deployment-kubernetes)
- [Aplicação Desktop (Electron)](#aplicação-desktop-electron)
- [Aplicação Mobile (React Native)](#aplicação-mobile-react-native)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [CI/CD](#cicd)

---

## ✅ Requisitos

### Mínimo
- Node.js 18+
- npm 9+
- PostgreSQL 13+

### Docker
- Docker 20.10+
- Docker Compose 2.0+

### Kubernetes
- kubectl 1.24+
- Helm 3.0+

---

## 🌐 Instalação Web

### 1. Desenvolvimento Local
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/progressd.git
cd progressd

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# Inicie o banco de dados (PostgreSQL)
# Ou use: docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15

# Inicie o backend
cd backend
npm start

# Em outro terminal, inicie o frontend
cd frontend
npm run dev
```

**Acesso**: http://localhost:5173

### 1.1 Distribuição em LAN
Se quiser que amigos testem no navegador do PC ou no celular na mesma rede, use o IP local do computador em vez de localhost:
```text
http://SEU_IP_LOCAL:5173
```
Certifique-se de que todos estejam na mesma rede Wi-Fi ou LAN.

### 1.2 Teste PWA no celular
1. Abra o app no navegador do celular via IP local.
2. Adicione à tela inicial.
3. O app será executado no modo aplicativo web.

### 2. Build de Produção
```bash
# Frontend
cd frontend
npm run build

# Backend está pronto para produção
```

---

## 🐳 Deployment Docker

### Quick Start
```bash
# Build e inicie todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

**Acesso**: 
- Frontend: http://localhost:80
- API: http://localhost:5000/api
- Postgres: localhost:5432

### Configuração de Produção
```bash
# Configure o .env
POSTGRES_PASSWORD=sua-senha-forte
JWT_SECRET=sua-chave-jwt-forte
NODE_ENV=production

# Inicie com override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Health Check
```bash
curl http://localhost/health
```

---

## ☸️ Deployment Kubernetes

### Requisitos
- Cluster Kubernetes ativo
- kubectl configurado
- Helm 3+ instalado

### 1. Build de Imagem Docker
```bash
docker build -t seu-registry/progressd:1.0.0 .
docker push seu-registry/progressd:1.0.0
```

### 2. Deploy com Helm
```bash
# Adicione o repositório
helm repo add progressd ./helm
helm repo update

# Instale
helm install progressd progressd/progressd \
  --namespace progressd \
  --create-namespace \
  --values values.yaml
```

### 3. Configurar Ingress
```bash
kubectl apply -f k8s/ingress.yaml
```

### 4. Verificar Status
```bash
kubectl get pods -n progressd
kubectl logs -n progressd deployment/progressd-backend
```

---

## 🖥️ Aplicação Desktop (Electron)

### Instalação
```bash
# Instale dependências do Electron
npm install electron electron-builder --save-dev

# Configure em vite.config.js para Electron
# Veja: electron-builder.json

# Build
npm run build:electron

# Executar em desarrollo
npm run electron:dev
```

### Distribuição
```bash
# Windows
npm run electron:build -- --win

# macOS
npm run electron:build -- --mac

# Linux
npm run electron:build -- --linux
```

---

## 📱 Aplicação Mobile (React Native)

### Setup
```bash
# Instale React Native CLI
npm install -g react-native-cli

# Crie projeto híbrido
npx react-native init ProgressEdMobile

# Use a estrutura Web existente com React Native Web
npm install react-native-web
```

### Build

**iOS**
```bash
cd ios
pod install
cd ..
npm run ios
```

**Android**
```bash
npm run android
```

---

## 🔐 Variáveis de Ambiente

### Web (.env.local)
```bash
VITE_API_URL=https://api.progressd.com
VITE_PLATFORM=web
VITE_PWA_ENABLED=true
VITE_OFFLINE_MODE=true
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/progressd
JWT_SECRET=sua-chave-super-segura
NODE_ENV=production
PORT=5000
```

### Docker (.env)
```bash
POSTGRES_PASSWORD=sua-senha
DB_NAME=progressd
JWT_SECRET=sua-chave-super-segura
```

---

## ⚙️ CI/CD com GitHub Actions

### Push para Production (Exemplo)

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker Image
        run: docker build -t progressd:${{ github.sha }} .
      
      - name: Push to Registry
        run: docker push seu-registry/progressd:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/progressd-backend \
            progressd-backend=seu-registry/progressd:${{ github.sha }}
```

---

## 📊 Monitoramento

### Logs
```bash
# Docker
docker-compose logs -f backend

# Kubernetes
kubectl logs -f deployment/progressd-backend -n progressd
```

### Métricas
- Health Check: `/health`
- Prometheus: `/metrics` (quando habilitado)

---

## 🛡️ Segurança em Produção

### Checklist
- [ ] Gerar certificados SSL/TLS
- [ ] Definir variáveis de ambiente seguras
- [ ] Habilitar CORS apenas para domínios confiáveis
- [ ] Usar HTTPS em produção
- [ ] Configurar backup automático do banco
- [ ] Implementar rate limiting
- [ ] Configurar escaneamento de vulnerabilidades

### HTTPS com Let's Encrypt
```bash
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d seu-dominio.com
```

---

## 🐛 Troubleshooting

### Porta já em uso
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Erro de conexão com BD
```bash
# Verificar PostgreSQL rodando
docker ps | grep postgres

# Conectar direto
psql -h localhost -U postgres -d progressd
```

### Certificado SSL inválido
```bash
# Gerar auto-signed para desenvolvimento
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

---

## 📚 Recursos Adicionais

- [Documentação React](https://react.dev)
- [Documentação Express](https://expressjs.com)
- [Documentação Docker](https://docs.docker.com)
- [Documentação Kubernetes](https://kubernetes.io/docs)
- [PWA](https://web.dev/progressive-web-apps)

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma [issue](https://github.com/seu-usuario/progressd/issues)

---

**Última atualização**: 8 de Abril de 2026
**Versão**: 1.0.0
