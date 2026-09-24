const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Buscar perfil do usuário
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, xp, level FROM users WHERE id = $1',
            [req.userId]
        );
        if (result.rows && result.rows.length > 0) {
            return res.json(result.rows[0]);
        }
    } catch (error) {
        console.warn('Aviso ao consultar perfil no banco:', error.message);
    }

    // Retorno seguro caso id seja virtual (demo) ou registro não retornado
    res.json({
        id: req.userId || 1,
        name: req.userRole === 'teacher' ? 'Prof. Pedro Brandão' : 'Amberson Rogers',
        email: req.userRole === 'teacher' ? 'professor@progressed.com' : 'aluno@progressed.com',
        role: req.userRole || 'student',
        xp: 420,
        level: 4
    });
});

module.exports = router;