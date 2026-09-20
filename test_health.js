/**
 * ProgressEd - Diagnóstico Local Completo
 */

const http = require('http');

async function testUrl(url) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode, data }));
        });
        req.on('error', (err) => resolve({ ok: false, error: err.message }));
        req.setTimeout(3000, () => {
            req.destroy();
            resolve({ ok: false, error: 'Timeout (3s)' });
        });
    });
}

async function runDiagnostics() {
    console.log('\n=============================================================');
    console.log('🧪 DIAGNÓSTICO DO SISTEMA PROGRESSED');
    console.log('=============================================================\n');

    // 1. Backend Ping
    process.stdout.write('1. Testando Backend API (http://localhost:5000)... ');
    const backendRes = await testUrl('http://localhost:5000/');
    if (backendRes.ok) {
        console.log('✅ OK (Porta 5000 ativa)');
    } else {
        console.log('❌ OFFLINE');
        console.log('   💡 O backend não está rodando no momento.');
        console.log('   👉 Dica: Execute "iniciar_tudo.bat" ou "npm start" no terminal para iniciar.');
        return;
    }

    // 2. Login Aluno
    process.stdout.write('2. Testando Autenticação Aluno (aluno@progressed.com)... ');
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'aluno@progressed.com', password: '123456' })
        });
        const loginData = await loginRes.json();
        if (loginData.token) {
            console.log(`✅ OK (${loginData.user.name}, Nível ${loginData.user.level}, XP ${loginData.user.xp})`);

            // 3. Teste Desafios
            process.stdout.write('3. Testando Banco de Desafios BNCC (/api/challenges)... ');
            const chRes = await fetch('http://localhost:5000/api/challenges', {
                headers: { 'Authorization': `Bearer ${loginData.token}` }
            });
            const challenges = await chRes.json();
            if (Array.isArray(challenges)) {
                console.log(`✅ OK (${challenges.length} desafios carregados)`);
            } else {
                console.log('❌ Erro ao listar desafios');
            }
        } else {
            console.log('❌ Falha:', loginData.error || 'Sem token retornado');
        }
    } catch (e) {
        console.log('❌ Erro:', e.message);
    }

    // 4. Login Professor
    process.stdout.write('4. Testando Painel do Professor (professor@progressed.com)... ');
    try {
        const profRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'professor@progressed.com', password: '123456' })
        });
        const profData = await profRes.json();
        if (profData.token) {
            const statsRes = await fetch('http://localhost:5000/api/teacher/stats', {
                headers: { 'Authorization': `Bearer ${profData.token}` }
            });
            const stats = await statsRes.json();
            console.log(`✅ OK (${profData.user.name} - ${stats.totalstudents || 0} alunos vinculados)`);
        } else {
            console.log('❌ Falha:', profData.error);
        }
    } catch (e) {
        console.log('❌ Erro:', e.message);
    }

    // 5. Frontend
    process.stdout.write('5. Testando Frontend Web (http://localhost:5173)... ');
    const frontendRes = await testUrl('http://localhost:5173/');
    if (frontendRes.ok) {
        console.log('✅ OK (Interface Vite ativa)');
    } else {
        console.log('⚠️ AVISO: Frontend não detectado na porta 5173 (execute "npm run dev:frontend")');
    }

    console.log('\n=============================================================');
    console.log('🎉 DIAGNÓSTICO CONCLUÍDO!');
    console.log('   Acesse a plataforma em: http://localhost:5173');
    console.log('   Credenciais Demo:');
    console.log('   - Aluno: aluno@progressed.com / 123456');
    console.log('   - Professor: professor@progressed.com / 123456');
    console.log('=============================================================\n');
}

runDiagnostics();
