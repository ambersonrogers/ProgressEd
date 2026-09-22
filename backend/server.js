const app = require('./app');
const http = require('http');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Inicializar Socket.io para ambientes com servidor persistente
try {
    const { initializeSocket } = require('./socketHandler');
    initializeSocket(server);
} catch (e) {
    console.warn('Socket.io não inicializado:', e.message);
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor ProgressEd rodando na porta ${PORT} (aceitando conexões externas)`);
});