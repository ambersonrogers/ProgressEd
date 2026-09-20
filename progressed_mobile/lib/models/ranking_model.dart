class RankingModel {
  final String id;
  final String name;
  final int level;
  final int xp;
  final int completedChallenges;

  RankingModel({
    required this.id,
    required this.name,
    required this.level,
    required this.xp,
    required this.completedChallenges,
  });

  factory RankingModel.fromJson(Map<String, dynamic> json) {
    return RankingModel(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      level: json['level'] is int ? json['level'] : int.tryParse(json['level']?.toString() ?? '1') ?? 1,
      xp: json['xp'] is int ? json['xp'] : int.tryParse(json['xp']?.toString() ?? '0') ?? 0,
      completedChallenges: json['completed_challenges'] ?? json['completedChallenges'] ?? 0,
    );
  }
}
