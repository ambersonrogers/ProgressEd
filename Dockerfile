# Multi-stage build para otimização

# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --only=production && npm ci

COPY frontend/ .
RUN npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Production Runtime
FROM node:22-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache curl dumb-init tini

# Copiar backend
COPY backend/ ./backend/
COPY backend/package*.json ./backend/

# Copiar frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Instalar dependências de produção
WORKDIR /app/backend
RUN npm ci --only=production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Mudar permissões
RUN chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Usar dumb-init para gerenciar sinais
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Iniciar aplicação
CMD ["node", "server.js"]

# Expor porta
EXPOSE 5000

# Labels
LABEL maintainer="ProgressEd Team"
LABEL version="1.0.0"
LABEL description="ProgressEd - Plataforma Educacional Gamificada"
