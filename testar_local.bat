@echo off
echo 🧪 Testando ProgressEd localmente...
echo.

echo 🔧 Verificando se PostgreSQL está rodando...
netstat -ano | findstr :5432 >nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL não está rodando na porta 5432
    echo 💡 Inicie com: docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
    pause
    exit /b 1
) else (
    echo ✅ PostgreSQL rodando
)

echo 🔧 Testando backend...
curl -s http://localhost:5000/ >nul
if %errorlevel% neq 0 (
    echo ❌ Backend não responde
    echo 💡 Inicie com: cd backend && npm start
    pause
    exit /b 1
) else (
    echo ✅ Backend funcionando
)

echo 🔧 Testando frontend...
curl -s http://localhost:5179/ >nul
if %errorlevel% neq 0 (
    echo ❌ Frontend não responde
    echo 💡 Inicie com: cd frontend && npm run dev
    pause
    exit /b 1
) else (
    echo ✅ Frontend funcionando
)

echo.
echo 🎉 Tudo funcionando localmente!
echo.
echo 🌐 Para acesso na rede: http://192.168.1.248:5179/
echo ☁️ Para deploy na nuvem: execute deploy_nuvem.bat
echo.
pause