const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, xp, level 
            FROM users 
            WHERE role = 'student'
            ORDER BY xp DESC 
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ranking' });
    }
});

module.exports = router;
