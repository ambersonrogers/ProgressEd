import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'quiz_screen.dart';
import 'leaderboard_screen.dart';
import 'login_screen.dart';

class StudentDashboardScreen extends StatelessWidget {
  const StudentDashboardScreen({Key? key}) : super(key: key);

  static final List<Map<String, dynamic>> modules = [
    {
      'id': 1,
      'title': 'Linguagens',
      'subtitle': 'PT • EN • ES',
      'icon': Icons.menu_book_rounded,
      'color': const Color(0xFF8B5CF6),
      'desc': 'Trilhas de leitura, redação e comunicação.'
    },
    {
      'id': 2,
      'title': 'Matemática',
      'subtitle': 'Álgebra e Geometria',
      'icon': Icons.calculate_rounded,
      'color': const Color(0xFFEC4899),
      'desc': 'Raciocínio lógico, frações e equações.'
    },
    {
      'id': 3,
      'title': 'Ciências da Natureza',
      'subtitle': 'Física • Química • Bio',
      'icon': Icons.science_rounded,
      'color': const Color(0xFF10B981),
      'desc': 'Conceitos experimentais e leis científicas.'
    },
    {
      'id': 4,
      'title': 'Ciências Humanas',
      'subtitle': 'História • Geografia',
      'icon': Icons.public_rounded,
      'color': const Color(0xFFF59E0B),
      'desc': 'Sociedade, cultura e Raízes do Brasil.'
    },
    {
      'id': 5,
      'title': 'Atualidades',
      'subtitle': 'Mundo Contemporâneo',
      'icon': Icons.newspaper_rounded,
      'color': const Color(0xFF06B6D4),
      'desc': 'Clima, cidadania e tecnologia moderna.'
    },
  ];

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;
    final xp = user?.xp ?? 0;
    final level = user?.level ?? 1;
    final xpInLevel = xp % 200;
    final xpPercent = (xpInLevel / 200.0).clamp(0.0, 1.0);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Row(
          children: [
            const CircleAvatar(
              backgroundColor: Color(0xFF7C3AED),
              radius: 18,
              child: Icon(Icons.person, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user?.name ?? 'Estudante', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                Text('Nível $level • $xp XP', style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.6))),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.leaderboard_rounded, color: Color(0xFF38BDF8)),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LeaderboardScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Colors.grey),
            onPressed: () async {
              await auth.logout();
              if (context.mounted) {
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner de Nível
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6D28D9), Color(0xFF4338CA)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: const Color(0xFF7C3AED).withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 8)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('JORNADA ATIVA', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 1.5)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                        child: Text('$xpInLevel / 200 XP', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text('Nível $level: Explorador', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: xpPercent,
                      backgroundColor: Colors.black26,
                      valueColor: const AlwaysStoppedAnimation(Color(0xFF38BDF8)),
                      minHeight: 10,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Título das Trilhas
            const Text('Trilhas de Aprendizagem', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 4),
            Text('Selecione uma trilha para praticar desafios rápidos com feedback explicativo:', style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.6))),
            const SizedBox(height: 16),

            // Lista de Módulos
            ...modules.map((m) {
              return Card(
                color: const Color(0xFF1E293B),
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => QuizScreen(moduleId: m['id'], moduleTitle: m['title']),
                      ),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: (m['color'] as Color).withOpacity(0.2), borderRadius: BorderRadius.circular(16)),
                          child: Icon(m['icon'], color: m['color'], size: 28),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(m['title'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                              const SizedBox(height: 2),
                              Text(m['subtitle'], style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5))),
                              const SizedBox(height: 4),
                              Text(m['desc'], style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.7))),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white38, size: 16),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}
