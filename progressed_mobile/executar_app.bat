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
echo [2/3] Escolha o dispositivo para executar:
echo  [1] Executar no Google Chrome / Navegador Web
echo  [2] Executar no Windows Desktop (Nativo)
echo  [3] Executar no Celular / Emulador Android
echo  [4] Gerar pacote APK de instalacao para celular
echo.
set /p opt="Digite o numero da opcao desejada (1-4): "

if "%opt%"=="1" (
    echo Iniciando no Navegador Web...
    call flutter run -d chrome
) else if "%opt%"=="2" (
    echo Iniciando no Windows Desktop...
    call flutter run -d windows
) else if "%opt%"=="3" (
    echo Conecte seu celular Android via USB com depuracao ativada...
    call flutter run
) else if "%opt%"=="4" (
    echo Gerando APK para Android...
    call flutter build apk --release
    echo.
    echo [SUCESSO] APK gerado em: build\app\outputs\flutter-apk\app-release.apk
    pause
) else (
    echo Opcao invalida.
)

pause
