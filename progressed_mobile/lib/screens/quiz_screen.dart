import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/challenge_model.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';

class QuizScreen extends StatefulWidget {
  final int moduleId;
  final String moduleTitle;

  const QuizScreen({super.key, required this.moduleId, required this.moduleTitle});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  List<ChallengeModel> _challenges = [];
  int _currentIndex = 0;
  bool _loading = true;
  int _timeLeft = 25;
  Timer? _timer;
  String? _selectedOption;
  bool _answered = false;

  @override
  void initState() {
    super.initState();
    _loadChallenges();
  }

  void _loadChallenges() async {
    final list = await ApiService.getChallenges(widget.moduleId);
    setState(() {
      _challenges = list;
      _loading = false;
    });
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timeLeft = 25;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_timeLeft <= 1) {
        t.cancel();
        _onAnswer(null);
      } else {
        setState(() => _timeLeft--);
      }
    });
  }

  void _onAnswer(String? letter) {
    if (_answered) return;
    _timer?.cancel();
    setState(() {
      _selectedOption = letter;
      _answered = true;
    });

    final current = _challenges[_currentIndex];
    final isCorrect = letter == current.correctAnswer;
    if (isCorrect) {
      Provider.of<AuthProvider>(context, listen: false).addXp(current.xpReward);
    }
  }

  void _next() {
    if (_currentIndex < _challenges.length - 1) {
      setState(() {
        _currentIndex++;
        _answered = false;
        _selectedOption = null;
      });
      _startTimer();
    } else {
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0F172A),
        body: Center(child: CircularProgressIndicator(color: Color(0xFF7C3AED))),
      );
    }

    if (_challenges.isEmpty) {
      return Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
        body: const Center(child: Text('Nenhuma questão disponível.', style: TextStyle(color: Colors.white))),
      );
    }

    final challenge = _challenges[_currentIndex];
    final isCorrect = _selectedOption == challenge.correctAnswer;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Text(widget.moduleTitle, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Text(
                '${_currentIndex + 1}/${_challenges.length}',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF38BDF8)),
              ),
            ),
          )
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Timer & XP Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.timer_outlined, color: _timeLeft <= 5 ? Colors.red : const Color(0xFF38BDF8), size: 20),
                      const SizedBox(width: 6),
                      Text('$_timeLeft s', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: _timeLeft <= 5 ? Colors.red : Colors.white)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFF7C3AED).withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                    child: Text('+${challenge.xpReward} XP', style: const TextStyle(color: Color(0xFFA78BFA), fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: _timeLeft / 25.0,
                  backgroundColor: Colors.white10,
                  valueColor: AlwaysStoppedAnimation(_timeLeft <= 5 ? Colors.red : const Color(0xFF7C3AED)),
                  minHeight: 6,
                ),
              ),
              const SizedBox(height: 20),

              // Card da Pergunta
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Text(
                  challenge.question,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white, height: 1.4),
                ),
              ),
              const SizedBox(height: 20),

              // Alternativas
              Expanded(
                child: ListView(
                  children: [
                    _buildOption('A', challenge.optionA, challenge),
                    _buildOption('B', challenge.optionB, challenge),
                    _buildOption('C', challenge.optionC, challenge),
                    _buildOption('D', challenge.optionD, challenge),
                  ],
                ),
              ),

              // Feedback formativo se respondido
              if (_answered) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isCorrect ? const Color(0xFF10B981).withOpacity(0.15) : const Color(0xFFEF4444).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(isCorrect ? Icons.check_circle_rounded : Icons.cancel_rounded, color: isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444), size: 20),
                          const SizedBox(width: 8),
                          Text(
                            isCorrect ? 'Correto! +${challenge.xpReward} XP' : 'Resposta Incorreta',
                            style: TextStyle(fontWeight: FontWeight.bold, color: isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444), fontSize: 14),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(challenge.explanation, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: _next,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7C3AED),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Text(_currentIndex < _challenges.length - 1 ? 'Próxima Questão →' : 'Finalizar Trilha 🎉', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOption(String letter, String text, ChallengeModel challenge) {
    Color bg = const Color(0xFF1E293B);
    Color border = Colors.white.withOpacity(0.08);

    if (_answered) {
      if (letter == challenge.correctAnswer) {
        bg = const Color(0xFF10B981).withOpacity(0.2);
        border = const Color(0xFF10B981);
      } else if (letter == _selectedOption) {
        bg = const Color(0xFFEF4444).withOpacity(0.2);
        border = const Color(0xFFEF4444);
      }
    }

    return Card(
      color: bg,
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(color: border, width: 1.5),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: _answered ? null : () => _onAnswer(letter),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: Colors.white10,
                child: Text(letter, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(text, style: const TextStyle(fontSize: 14, color: Colors.white)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
