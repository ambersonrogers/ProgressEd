const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Middleware para verificar se é professor
const isTeacher = (req, res, next) => {
    if (req.userRole !== 'teacher') {
        return res.status(403).json({ error: 'Acesso restrito a professores' });
    }
    next();
};

// GET Analytics de uma sala específica
router.get('/room/:roomId', authMiddleware, isTeacher, async (req, res) => {
    try {
        const { roomId } = req.params;

        // Buscar dados da sala do banco de dados
        // Este é um exemplo - adapte conforme sua estrutura de banco
        const analytics = {
            totalStudents: 25,
            totalQuestions: 50,
            averageScore: 75.5,
            totalSessions: 10,
            topPerformers: [
                {
                    studentId: 1,
                    name: 'João Silva',
                    score: 95,
                    correctAnswers: 47,
                    totalAnswers: 50,
                },
                {
                    studentId: 2,
                    name: 'Maria Santos',
                    score: 88,
                    correctAnswers: 44,
                    totalAnswers: 50,
                },
                {
                    studentId: 3,
                    name: 'Pedro Costa',
                    score: 82,
                    correctAnswers: 41,
                    totalAnswers: 50,
                },
            ],
            categoryStats: [
                {
                    id: 1,
                    name: 'Linguagens',
                    averageScore: 82,
                    correctAnswers: 164,
                    totalAnswers: 200,
                    color: '#3b82f6',
                    colorLight: '#60a5fa',
                },
                {
                    id: 2,
                    name: 'Matemática',
                    averageScore: 75,
                    correctAnswers: 150,
                    totalAnswers: 200,
                    color: '#10b981',
                    colorLight: '#34d399',
                },
                {
                    id: 3,
                    name: 'Ciências',
                    averageScore: 70,
                    correctAnswers: 140,
                    totalAnswers: 200,
                    color: '#f59e0b',
                    colorLight: '#fbbf24',
                },
            ],
            sessionHistory: [
                {
                    id: 1,
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    studentCount: 25,
                    questionCount: 50,
                    averageScore: 78,
                },
                {
                    id: 2,
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    studentCount: 24,
                    questionCount: 50,
                    averageScore: 76,
                },
                {
                    id: 3,
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    studentCount: 25,
                    questionCount: 50,
                    averageScore: 74,
                },
            ],
        };

        res.json(analytics);
    } catch (error) {
        console.error('Erro ao buscar analytics:', error);
        res.status(500).json({ error: 'Erro ao buscar analytics' });
    }
});

// GET Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const { period = 'week' } = req.query;

        // Exemplo de dados - adapte conforme sua estrutura
        const leaderboard = [
            {
                userId: 1,
                userName: 'João Silva',
                totalPoints: 2500,
                correctAnswers: 150,
                badges: [
                    { emoji: '🔥', name: 'Streak de 10' },
                    { emoji: '⚡', name: 'Rápido' },
                ],
            },
            {
                userId: 2,
                userName: 'Maria Santos',
                totalPoints: 2300,
                correctAnswers: 145,
                badges: [
                    { emoji: '🎯', name: 'Precisão' },
                ],
            },
            {
                userId: 3,
                userName: 'Pedro Costa',
                totalPoints: 2100,
                correctAnswers: 140,
                badges: [
                    { emoji: '🏆', name: 'Campeão' },
                ],
            },
        ];

        res.json(leaderboard);
    } catch (error) {
        console.error('Erro ao buscar leaderboard:', error);
        res.status(500).json({ error: 'Erro ao buscar leaderboard' });
    }
});

// GET Estatísticas do usuário
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        const userStats = {
            userId,
            totalPoints: 1500,
            level: 8,
            nextLevelPoints: 2000,
            correctAnswers: 85,
            totalAnswers: 120,
            accuracy: 70.8,
            streak: 5,
            badges: [
                { emoji: '🔥', name: 'Streak de 5', description: 'Acertou 5 questões seguidas' },
                { emoji: '⚡', name: 'Rápido', description: 'Respondeu em menos de 5 segundos' },
                { emoji: '🎯', name: 'Precisão', description: 'Acertou 10 questões seguidas' },
            ],
            recentSessions: [
                {
                    id: 1,
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    score: 85,
                    correctAnswers: 17,
                    totalAnswers: 20,
                },
                {
                    id: 2,
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    score: 90,
                    correctAnswers: 18,
                    totalAnswers: 20,
                },
            ],
        };

        res.json(userStats);
    } catch (error) {
        console.error('Erro ao buscar estatísticas do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

module.exports = router;
