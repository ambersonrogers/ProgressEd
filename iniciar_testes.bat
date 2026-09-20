@echo off
chcp 65001 >nul
title ProgressEd - Teste Rápido
echo =============================================================
echo   🚀 INICIANDO PROGRESSED PARA TESTES LOCAIS E EM REDE
echo =============================================================
echo.
echo 📦 Iniciando Backend (Porta 5000) e Frontend (Porta 5173)...
echo.

node dev.js

pause