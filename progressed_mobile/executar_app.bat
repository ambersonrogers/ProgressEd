@echo off
title ProgressEd Mobile - Executar App
color 0b
echo ========================================================
echo        PROGRESSED MOBILE - FLUTTER RUNNER
echo ========================================================
echo.

:: Verificar se Flutter esta no PATH
where flutter >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\src\flutter\bin\flutter.bat" (
        set "PATH=%PATH%;C:\src\flutter\bin"
    ) else (
        echo [!] Flutter SDK nao foi encontrado no sistema.
        echo Deseja baixar e instalar o Flutter automaticamente agora?
        echo Pressione qualquer tecla para iniciar a instalacao ou feche a janela.
        pause >nul
        powershell -ExecutionPolicy Bypass -File "%~dp0instalar_flutter.ps1"
        set "PATH=%PATH%;C:\src\flutter\bin"
    )
)

echo [1/3] Obtendo dependencias do projeto (flutter pub get)...
cd /d "%~dp0"
call flutter pub get

echo.
echo [2/3] Escolha o dispositivo ou modo de execucao:
echo  [1] Executar no Google Chrome (Navegador Web)
echo  [2] Executar no Microsoft Edge (Navegador Web)
echo  [3] Executar no Windows Desktop (Nativo)
echo  [4] Executar no Celular / Emulador Android
echo  [5] Gerar pacote APK de instalacao para celular Android
echo  [6] Abrir Build Web compilada (porta local 8080)
echo.
set /p opt="Digite o numero da opcao desejada (1-6): "

if "%opt%"=="1" (
    echo.
    echo Iniciando no Google Chrome...
    call flutter run -d chrome
) else if "%opt%"=="2" (
    echo.
    echo Iniciando no Microsoft Edge...
    call flutter run -d edge
) else if "%opt%"=="3" (
    echo.
    echo Iniciando no Windows Desktop...
    call flutter run -d windows
) else if "%opt%"=="4" (
    echo.
    echo Conecte seu celular Android via USB com modo depuracao ativado...
    call flutter run
) else if "%opt%"=="5" (
    echo.
    echo Gerando APK de instalacao para Android...
    call flutter build apk --release
    echo.
    echo [SUCESSO] APK gerado em: build\app\outputs\flutter-apk\app-release.apk
    pause
) else if "%opt%"=="6" (
    echo.
    echo Servindo versao Web compilada na porta 8080...
    start http://localhost:8080
    python -m http.server 8080 --directory build\web
) else (
    echo Opcao invalida.
)

pause
