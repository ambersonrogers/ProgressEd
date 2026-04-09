const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Middleware para verificar se é professor
const isTeacher = (req, res, next) => {
    if (req.userRole !== 'teacher') {
        return res.status(403).json({ error: 'Acesso restrito a professores' });
    }
    next();
};

// Listar todos os alunos
router.get('/students', authMiddleware, isTeacher, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.name, u.email, u.xp, u.level,
                   COUNT(up.id) as completed_challenges,
                   (SELECT COUNT(*) FROM challenges) as total_challenges
            FROM users u
            LEFT JOIN user_progress up ON u.id = up.user_id AND up.completed = true
            WHERE u.role = 'student'
            GROUP BY u.id
            ORDER BY u.xp DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
});

// Estatísticas gerais
router.get('/stats', authMiddleware, isTeacher, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as totalStudents,
                AVG(xp) as avgXp,
                AVG(level) as avgLevel,
                (SELECT COUNT(*) FROM user_progress WHERE completed = true) as totalCompleted
            FROM users 
            WHERE role = 'student'
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

module.exports = router;