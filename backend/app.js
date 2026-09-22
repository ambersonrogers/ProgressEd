const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const challengeRoutes = require('./routes/challenges');
const userRoutes = require('./routes/users');
const teacherRoutes = require('./routes/teacher');
const rankingRoutes = require('./routes/ranking');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/teacher', teacherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api', (req, res) => {
    res.json({
        message: 'API do ProgressEd rodando com sucesso (Vercel Serverless)!',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'API do ProgressEd está rodando!',
        status: 'online'
    });
});

module.exports = app;
