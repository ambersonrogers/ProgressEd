class UserModel {
  final String id;
  final String name;
  final String email;
  final String role; // 'student' ou 'teacher'
  int xp;
  int level;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.xp = 0,
    this.level = 1,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? 'Usuário',
      email: json['email'] ?? '',
      role: json['role'] ?? 'student',
      xp: json['xp'] is int ? json['xp'] : int.tryParse(json['xp']?.toString() ?? '0') ?? 0,
      level: json['level'] is int ? json['level'] : int.tryParse(json['level']?.toString() ?? '1') ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'xp': xp,
      'level': level,
    };
  }
}
