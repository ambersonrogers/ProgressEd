const socketIO = require('socket.io');

let io;
const rooms = new Map();
const userSockets = new Map();

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    io.on('connection', (socket) => {
        console.log(`Usuário conectado: ${socket.id}`);

        // Armazenar socket do usuário
        socket.on('user:join', (userData) => {
            userSockets.set(socket.id, userData);
            console.log(`${userData.name} entrou na sala`);
        });

        // Entrar em uma sala de quiz
        socket.on('room:join', (roomData) => {
            socket.join(roomData.roomId);
            
            if (!rooms.has(roomData.roomId)) {
                rooms.set(roomData.roomId, {
                    id: roomData.roomId,
                    students: [],
                    currentQuestion: null,
                    status: 'waiting',
                });
            }

            const room = rooms.get(roomData.roomId);
            room.students.push({
                socketId: socket.id,
                name: roomData.studentName,
                score: 0,
                answers: [],
            });

            io.to(roomData.roomId).emit('room:updated', room);
        });

        // Iniciar quiz
        socket.on('quiz:start', (quizData) => {
            const room = rooms.get(quizData.roomId);
            if (room) {
                room.status = 'active';
                room.currentQuestion = quizData.question;
                io.to(quizData.roomId).emit('quiz:started', quizData);
            }
        });

        // Responder pergunta
        socket.on('quiz:answer', (answerData) => {
            const room = rooms.get(answerData.roomId);
            if (room) {
                const student = room.students.find(s => s.socketId === socket.id);
                if (student) {
                    student.answers.push(answerData);
                    if (answerData.correct) {
                        student.score += 10; // Pontuação por resposta correta
                    }
                }
                io.to(answerData.roomId).emit('answer:received', {
                    studentName: student?.name,
                    correct: answerData.correct,
                });
            }
        });

        // Finalizar quiz
        socket.on('quiz:end', (endData) => {
            const room = rooms.get(endData.roomId);
            if (room) {
                room.status = 'finished';
                io.to(endData.roomId).emit('quiz:finished', {
                    results: room.students.map(s => ({
                        name: s.name,
                        score: s.score,
                        answers: s.answers.length,
                    })),
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Usuário desconectado: ${socket.id}`);
            userSockets.delete(socket.id);
            
            // Remover da sala
            for (const [roomId, room] of rooms) {
                room.students = room.students.filter(s => s.socketId !== socket.id);
                if (room.students.length === 0) {
                    rooms.delete(roomId);
                } else {
                    io.to(roomId).emit('room:updated', room);
                }
            }
        });

        // Erro
        socket.on('error', (error) => {
            console.error(`Erro do socket ${socket.id}:`, error);
        });
    });

    return io;
}

module.exports = { initializeSocket };
