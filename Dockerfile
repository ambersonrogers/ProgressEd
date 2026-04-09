# Multi-stage build para ProgressEd

# Stage 1: Build da aplicação frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Build da aplicação backend
FROM node:18-alpine as backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --production

# Stage 3: Imagem final
FROM node:18-alpine

# Instalar dumb-init para melhor gerenciamento de processos
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copiar frontend buildado
COPY --from=frontend-builder /app/frontend/dist ./frontend/public

# Copiar backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

WORKDIR /app/backend

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init para executar Node.js corretamente
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
