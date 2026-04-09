@echo off
echo 🚀 Iniciando ProgressEd para testes em rede...
echo.

echo 📊 Iniciando PostgreSQL (se não estiver rodando)...
echo (Certifique-se de que o Docker está rodando: docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15)

timeout /t 3 /nobreak > nul

echo 🔧 Iniciando Backend API...
start cmd /k "cd /d %~dp0backend && npm start"

echo 🌐 Aguardando backend iniciar...
timeout /t 5 /nobreak > nul

echo 🎨 Iniciando Frontend...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ✅ Tudo pronto!
echo.
echo 📱 Acesse no seu navegador: http://192.168.1.248:5179/
echo 📱 Ou compartilhe com amigos na mesma rede
echo.
echo 📋 Veja instruções completas em: COMO_TESTAR.md
echo.
pause