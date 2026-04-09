const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const challengeRoutes = require('./routes/challenges');
const userRoutes = require('./routes/users');
const teacherRoutes = require('./routes/teacher');
const rankingRoutes = require('./routes/ranking');
app.use('/api/teacher', teacherRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ranking', rankingRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API do ProgressEd está rodando!' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor ProgressEd rodando na porta ${PORT} (aceitando conexões externas)`);
});