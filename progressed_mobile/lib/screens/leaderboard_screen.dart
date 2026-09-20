import 'package:flutter/material.dart';
import '../models/ranking_model.dart';
import '../services/api_service.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  List<RankingModel> _list = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  void _fetch() async {
    final res = await ApiService.getRanking();
    setState(() {
      _list = res;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Ranking da Turma', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF7C3AED)))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _list.length,
              itemBuilder: (ctx, i) {
                final student = _list[i];
                final isPodium = i < 3;
                final medalColor = i == 0 ? const Color(0xFFFBBF24) : i == 1 ? const Color(0xFF94A3B8) : const Color(0xFFD97706);

                return Card(
                  color: const Color(0xFF1E293B),
                  margin: const EdgeInsets.only(bottom: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: isPodium ? medalColor.withOpacity(0.2) : Colors.white10,
                      child: Text(
                        '${i + 1}º',
                        style: TextStyle(fontWeight: FontWeight.bold, color: isPodium ? medalColor : Colors.white70),
                      ),
                    ),
                    title: Text(student.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    subtitle: Text('Nível ${student.level} • ${student.completedChallenges} desafios', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(color: const Color(0xFF7C3AED).withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                      child: Text('${student.xp} XP', style: const TextStyle(color: Color(0xFFA78BFA), fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
