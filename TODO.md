# ProgressEd - TODO (implementação requisitos)

## Fase 1 — Infra/Arquitetura
- [x] Criar `render.yaml` na raiz (Node web service + PostgreSQL progress-ed-db)
- [x] Criar `vercel.json` na raiz configurado para Next.js
- [x] Atualizar/criar `.env.example` com variáveis Supabase, OAuth Google/Microsoft e Render

- [ ] Migrar frontend Vite/React → Next.js (sem criar projeto do zero; refatorar o que já existe)

## Fase 2 — Design/UI/UX
- [ ] Introduzir Tailwind CSS (mobile-first) no frontend Next
- [ ] Reforçar identidade visual roxa/branca, tipografia e estilos de botões hover/active/disabled
- [ ] Recriar layout gamificado (trilhas, XP, medalhas, quiz)

## Fase 3 — Gamificação/Trilhas/Quiz (UI + API)
- [ ] Implementar modelos e lógica de XP/níveis no backend
- [ ] Implementar trilhas com desbloqueio sequencial
- [ ] Tela de quiz: timer 25s + barra visual + alternativas A-E
- [ ] Feedback pedagógico em caso de erro (usando explicação da questão)
- [ ] Medalhas e Leaderboard/Ranking da turma

## Fase 4 — Painel do Professor
- [ ] Auth Google/Microsoft com Supabase/NextAuth
- [ ] Dashboard analítico (médias e acompanhamento)
- [ ] Salas privadas com PIN/senha
- [ ] CRUD de disciplinas e questões com campo de explicação

## Fase 5 — Prisma Modelagem + Seed
- [ ] Criar `backend/prisma/schema.prisma` com User/XP/Nível, Disciplinas, Módulos, Questões, Salas
- [ ] Criar `backend/prisma/seed.ts` para inserir base de disciplinas + 100 questões mockadas por disciplina com explicação
- [ ] Ajustar scripts e rotas para usar Prisma ao invés de SQL ad-hoc

## Fase 6 — Build/Test
- [ ] Rodar migrations/seed local
- [ ] Verificar endpoints e UI (quiz, trilhas, leaderboard, professor)
- [ ] Validar responsividade mobile-first

