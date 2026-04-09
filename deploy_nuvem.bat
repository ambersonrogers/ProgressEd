@echo off
echo 🚀 ProgressEd - Deploy na Nuvem (Passo a Passo)
echo.
echo Este script vai te guiar pelo deploy manual.
echo Você precisará criar contas gratuitas nos serviços.
echo.

echo 📋 ESCOLHA SUA OPÇÃO:
echo.
echo [1] Netlify + Railway (MAIS FÁCIL - recomendado)
echo [2] Vercel + Railway (Mais avançado)
echo.
set /p choice="Digite 1 ou 2: "

if "%choice%"=="1" goto netlify
if "%choice%"=="2" goto vercel
echo ❌ Opção inválida
pause
exit /b 1

:netlify
echo.
echo 📋 OPÇÃO 1: NETLIFY + RAILWAY (Mais Fácil)
echo.
echo 📋 PASSO 1: Criar conta no Netlify
echo    1. Acesse: https://netlify.com
echo    2. Cadastre-se com GitHub
echo    3. Confirme seu e-mail
echo.
pause

echo 📋 PASSO 2: Deploy do Frontend no Netlify
echo    1. No site do Netlify, clique "Add new site"
echo    2. Escolha "Deploy manually"
echo    3. Arraste a pasta frontend/dist (faça build primeiro)
echo    4. Configure VITE_API_URL com a URL do Railway
echo.
echo Fazendo build do frontend...
cd frontend
call npm run build
echo.
echo ✅ Build concluído! Agora faça upload manual no Netlify.
echo.
pause

goto railway

:vercel
echo.
echo 📋 OPÇÃO 2: VERCEL + RAILWAY
echo.
echo 📋 PASSO 1: Criar conta no Vercel
echo    1. Acesse: https://vercel.com
echo    2. Cadastre-se com GitHub
echo    3. Confirme seu e-mail
echo.
pause

echo 📋 PASSO 2: Fazer login no Vercel CLI
echo    Execute: vercel login
echo    (Siga as instruções no navegador)
echo.
pause

echo 📋 PASSO 3: Deploy do Frontend
cd frontend
echo Fazendo build...
call npm run build
echo Deploy no Vercel...
call vercel --prod
echo.
echo ✅ Frontend deploy concluído! Copie a URL mostrada acima.
echo.
pause

:railway
echo 📋 PASSO 4: Criar conta no Railway
echo    1. Acesse: https://railway.app
echo    2. Cadastre-se com GitHub
echo    3. Adicione cartão (gratuito, não cobra)
echo.
pause

echo 📋 PASSO 5: Fazer login no Railway CLI
cd ..
cd backend
echo Execute: railway login
echo (Siga as instruções no navegador)
echo.
pause

echo 📋 PASSO 6: Deploy do Backend
echo Deploy no Railway...
call railway init
call railway up
echo.
echo ✅ Backend deploy concluído! Copie a URL mostrada acima.
echo.
pause

echo 🎉 DEPLOY CONCLUÍDO!
echo.
echo 📱 Agora compartilhe as URLs com seus amigos!
echo 🌐 Eles podem acessar de qualquer lugar do mundo!
echo.
echo 💡 Dica: Atualize o VITE_API_URL no frontend com a URL do Railway
echo.
pause
echo.
echo ✅ Backend deploy concluído! Copie a URL mostrada acima.
echo.
pause

echo 🎉 DEPLOY CONCLUÍDO!
echo.
echo 📱 Agora compartilhe as URLs com seus amigos!
echo 🌐 Eles podem acessar de qualquer lugar do mundo!
echo.
pause