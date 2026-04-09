const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Buscar todos os desafios
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM challenges ORDER BY module_id, difficulty');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar desafios' });
    }
});

// Submeter resposta
router.post('/:id/submit', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { answer } = req.body;
    
    try {
        const challengeResult = await pool.query('SELECT * FROM challenges WHERE id = $1', [id]);
        if (challengeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Desafio não encontrado' });
        }
        
        const challenge = challengeResult.rows[0];
        const progressResult = await pool.query(
            'SELECT * FROM user_progress WHERE user_id = $1 AND challenge_id = $2',
            [req.userId, id]
        );
        
        if (progressResult.rows.length > 0 && progressResult.rows[0].completed) {
            return res.status(400).json({ error: 'Desafio já foi completado' });
        }
        
        const isCorrect = answer.toUpperCase() === challenge.correct_answer;
        
        if (isCorrect) {
            await pool.query(
                `INSERT INTO user_progress (user_id, challenge_id, completed, score, completed_at) 
                 VALUES ($1, $2, true, $3, NOW())`,
                [req.userId, id, challenge.xp_reward]
            );
            
            await pool.query(
                `UPDATE users 
                 SET xp = xp + $1, 
                     level = FLOOR((xp + $1) / 100) + 1
                 WHERE id = $2`,
                [challenge.xp_reward, req.userId]
            );
            
            const userResult = await pool.query(
                'SELECT id, name, email, role, xp, level FROM users WHERE id = $1',
                [req.userId]
            );
            
            res.json({
                correct: true,
                xpEarned: challenge.xp_reward,
                message: `🎉 Correto! Você ganhou ${challenge.xp_reward} XP!`,
                user: userResult.rows[0]
            });
        } else {
            res.json({
                correct: false,
                xpEarned: 0,
                message: `❌ Resposta incorreta! A resposta correta é: ${challenge.correct_answer}.`
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar resposta' });
    }
});

module.exports = router;