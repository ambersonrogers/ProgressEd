# Script automatizado para Instalação e Configuração do Flutter SDK no Windows
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ProgressEd Mobile - Instalador Automatizado do Flutter   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verificar se Flutter já está no PATH
$flutterCmd = Get-Command flutter -ErrorAction SilentlyContinue
if ($flutterCmd) {
    Write-Host "[OK] Flutter SDK ja esta instalado em: $($flutterCmd.Source)" -ForegroundColor Green
    flutter --version
    exit 0
}

# 2. Definir diretório de instalação recomendado pelo Google: C:\srclutter
$installDir = "C:\src"
$flutterDir = "C:\src\flutter"

if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

if (Test-Path "$flutterDir\bin\flutter.bat") {
    Write-Host "[INFO] Pasta do Flutter encontrada em $flutterDir, configurando variaveis de ambiente..." -ForegroundColor Yellow
} else {
    Write-Host "[DOWNLOAD] Baixando Flutter SDK oficial para Windows..." -ForegroundColor Yellow
    $zipUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.3-stable.zip"
    $zipPath = "$installDir\flutter.zip"
    
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath
    Write-Host "[EXTRAINDO] Extraindo SDK em $installDir (aguarde alguns instantes)..." -ForegroundColor Yellow
    Expand-Archive -Path $zipPath -DestinationPath $installDir -Force
    Remove-Item $zipPath -Force
}

# 3. Adicionar C:\srclutterin ao PATH do usuário permanente
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$flutterDir\bin*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$flutterDir\bin", "User")
    Write-Host "[PATH] Adicionado C:\src\flutter\bin ao PATH do usuario com sucesso!" -ForegroundColor Green
}

# 4. Atualizar o PATH da sessão atual
$env:Path += ";$flutterDir\bin"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Flutter SDK instalado com sucesso! Executando verificacao:" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
& "$flutterDir\bin\flutter.bat" doctor
