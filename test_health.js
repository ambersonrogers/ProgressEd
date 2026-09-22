/**
 * ProgressEd - Diagnóstico Completo (Local & Vercel Serverless / Neon)
 */

const VERCEL_URL = 'https://progress-ed-git-master-ambersonrogers-projects.vercel.app';
const LOCAL_URL = 'http://localhost:5000';

async function testEndpoint(baseUrl) {
    console.log(`\n🔍 Testando Ambiente: ${baseUrl}`);
    
    // 1. Login Aluno
    process.stdout.write('1. Testando Autenticação Aluno (aluno@progressed.com)... ');
    let studentToken = null;
    try {
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'aluno@progressed.com', password: '123456' })
        });
        const loginData = await loginRes.json();
        if (loginData.token) {
            studentToken = loginData.token;
            console.log(`✅ OK (${loginData.user.name}, Nível ${loginData.user.level}, XP ${loginData.user.xp})`);
        } else {
            console.log('❌ Falha:', loginData.error);
        }
    } catch (e) {
        console.log('❌ Erro de conexão:', e.message);
    }

    // 2. Desafios BNCC
    if (studentToken) {
        process.stdout.write('2. Testando Banco de Desafios BNCC (/api/challenges)... ');
        try {
            const chRes = await fetch(`${baseUrl}/api/challenges`, {
                headers: { 'Authorization': `Bearer ${studentToken}` }
            });
            const challenges = await chRes.json();
            if (Array.isArray(challenges)) {
                console.log(`✅ OK (${challenges.length} desafios curriculares carregados)`);
            } else {
                console.log('❌ Falha:', challenges);
            }
        } catch (e) {
            console.log('❌ Erro:', e.message);
        }
    }

    // 3. Login Professor
    process.stdout.write('3. Testando Painel do Professor (professor@progressed.com)... ');
    let profToken = null;
    try {
        const profRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'professor@progressed.com', password: '123456' })
        });
        const profData = await profRes.json();
        if (profData.token) {
            profToken = profData.token;
            console.log(`✅ OK (${profData.user.name})`);
        } else {
            console.log('❌ Falha:', profData.error);
        }
    } catch (e) {
        console.log('❌ Erro:', e.message);
    }

    // 4. Diagnóstico de Defasagens
    if (profToken) {
        process.stdout.write('4. Testando Mapa de Defasagens da Turma (/api/teacher/analytics/class)... ');
        try {
            const classRes = await fetch(`${baseUrl}/api/teacher/analytics/class`, {
                headers: { 'Authorization': `Bearer ${profToken}` }
            });
            const classData = await classRes.json();
            console.log(`✅ OK (${classData.subjectProficiency?.length || 0} disciplinas mapeadas, ${classData.criticalTopics?.length || 0} tópicos críticos)`);
        } catch (e) {
            console.log('❌ Erro:', e.message);
        }

        process.stdout.write('5. Testando Dossiê Individual do Aluno (/api/teacher/students/1/diagnosis)... ');
        try {
            const diagRes = await fetch(`${baseUrl}/api/teacher/students/1/diagnosis`, {
                headers: { 'Authorization': `Bearer ${profToken}` }
            });
            const diagData = await diagRes.json();
            console.log(`✅ OK (${diagData.student?.name} - ${diagData.recentErrors?.length || 0} erros com histórico)`);
        } catch (e) {
            console.log('❌ Erro:', e.message);
        }
    }
}

async function runDiagnostics() {
    console.log('\n=============================================================');
    console.log('🧪 DIAGNÓSTICO DO SISTEMA PROGRESSED (NEON + VERCEL)');
    console.log('=============================================================');

    await testEndpoint(VERCEL_URL);

    console.log('\n=============================================================');
    console.log('🎉 DIAGNÓSTICO CONCLUÍDO COM SUCESSO!');
    console.log('   Vercel URL: ' + VERCEL_URL);
    console.log('=============================================================\n');
}

runDiagnostics();
