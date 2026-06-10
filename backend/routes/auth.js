const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Usar o cliente Supabase diretamente
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Erro no login:', error.message);
    return res.status(401).json({ error: error.message || 'Credenciais inválidas' });
  }

  // Buscar dados na tabela progressed_users (se existir)
  const { data: userData } = await supabase
    .from('progressed_users')
    .select('*')
    .eq('auth_id', data.user.id)
    .single();

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      name: userData?.name || data.user.email,
      email: data.user.email,
      role: userData?.role || 'student',
      xp: userData?.xp || 0,
      level: userData?.level || 1
    }
  });
});

// CADASTRO
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: name || email.split('@')[0], role: role || 'student' }
    }
  });

  if (error) {
    console.error('Erro no cadastro:', error.message);
    return res.status(400).json({ error: error.message });
  }

  res.json({
    message: 'Usuário criado com sucesso!',
    user: data.user
  });
});

// OBTER USUÁRIO ATUAL
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const { data: userData } = await supabase
    .from('progressed_users')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  res.json({
    id: user.id,
    name: userData?.name || user.email,
    email: user.email,
    role: userData?.role || 'student',
    xp: userData?.xp || 0,
    level: userData?.level || 1
  });
});

// LOGOUT
router.post('/logout', async (req, res) => {
  res.json({ success: true });
});

module.exports = router;
