/**
 * ProgressEd - Dev Server Runner
 * Inicia Backend (porta 5000) e Frontend (porta 5173) simultaneamente.
 * Não requer dependências adicionais além do Node.js.
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('\n=============================================================');
console.log('🚀  INICIANDO PLATAFORMA PROGRESSED (MODO LOCAL INTELIGENTE)');
console.log('=============================================================');
console.log('📦 Backend: http://localhost:5000');
console.log('💻 Frontend: http://localhost:5173');
console.log('📱 Flutter App: em ./progressed_mobile');
console.log('=============================================================\n');

// 1. Iniciar Backend
const backendProcess = spawn('node', ['server.js'], {
    cwd: backendDir,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, PORT: '5000', FRONTEND_URL: 'http://localhost:5173' }
});

backendProcess.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => console.log(`\x1b[36m[BACKEND]\x1b[0m ${l}`));
});

backendProcess.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => console.error(`\x1b[31m[BACKEND ERRO]\x1b[0m ${l}`));
});

// 2. Iniciar Frontend (Vite)
const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: frontendDir,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, VITE_API_URL: 'http://localhost:5000/api' }
});

frontendProcess.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => console.log(`\x1b[32m[FRONTEND]\x1b[0m ${l}`));
});

frontendProcess.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => console.error(`\x1b[33m[FRONTEND AVISO]\x1b[0m ${l}`));
});

// 3. Abrir navegador quando o frontend estiver pronto
let opened = false;
function checkFrontendAndOpen() {
    if (opened) return;
    const req = http.get('http://localhost:5173', (res) => {
        if (!opened) {
            opened = true;
            console.log('\n🌐 Abrindo ProgressEd no seu navegador (http://localhost:5173)...\n');
            const openCommand = process.platform === 'win32' ? 'start http://localhost:5173' : 'open http://localhost:5173';
            exec(openCommand);
        }
    });
    req.on('error', () => {
        setTimeout(checkFrontendAndOpen, 1000);
    });
}
setTimeout(checkFrontendAndOpen, 2000);

// Encerramento limpo
function cleanExit() {
    console.log('\n🛑 Encerrando servidores ProgressEd...');
    try {
        if (process.platform === 'win32') {
            exec(`taskkill /pid ${backendProcess.pid} /T /F`);
            exec(`taskkill /pid ${frontendProcess.pid} /T /F`);
        } else {
            backendProcess.kill();
            frontendProcess.kill();
        }
    } catch (_) {}
    process.exit(0);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
