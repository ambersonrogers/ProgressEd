class ChallengeModel {
  final int id;
  final int moduleId;
  final String subject;
  final int difficulty;
  final String question;
  final String optionA;
  final String optionB;
  final String optionC;
  final String optionD;
  final String correctAnswer;
  final String explanation;
  final int xpReward;

  ChallengeModel({
    required this.id,
    required this.moduleId,
    required this.subject,
    required this.difficulty,
    required this.question,
    required this.optionA,
    required this.optionB,
    required this.optionC,
    required this.optionD,
    required this.correctAnswer,
    required this.explanation,
    required this.xpReward,
  });

  factory ChallengeModel.fromJson(Map<String, dynamic> json) {
    return ChallengeModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      moduleId: json['moduleId'] ?? json['module_id'] ?? 1,
      subject: json['subject'] ?? 'Geral',
      difficulty: json['difficulty'] ?? 1,
      question: json['question'] ?? json['text'] ?? '',
      optionA: json['optionA'] ?? json['option_a'] ?? '',
      optionB: json['optionB'] ?? json['option_b'] ?? '',
      optionC: json['optionC'] ?? json['option_c'] ?? '',
      optionD: json['optionD'] ?? json['option_d'] ?? '',
      correctAnswer: json['correctAnswer'] ?? json['correct_answer'] ?? 'A',
      explanation: json['explanation'] ?? '',
      xpReward: json['xpReward'] ?? json['xp_reward'] ?? 50,
    );
  }
}
