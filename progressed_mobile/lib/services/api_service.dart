import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import '../models/challenge_model.dart';
import '../models/ranking_model.dart';
import 'storage_service.dart';
import 'mock_bank.dart';

class ApiService {
  static const String baseUrl = 'https://progressed-backend-production.up.railway.app/api';

  static Future<Map<String, String>> _headers() async {
    final token = await StorageService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<UserModel> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final user = UserModel.fromJson(data['user']);
        await StorageService.saveUser(user);
        await StorageService.saveToken(data['token'] ?? '');
        return user;
      }
    } catch (_) {
      // Offline fallback
    }

    // Demo / Offline fallback
    final isTeacher = email.toLowerCase().contains('prof');
    final user = isTeacher
        ? UserModel(id: 'prof-demo', name: 'Prof. Pedro Brandão', email: email, role: 'teacher')
        : UserModel(id: 'aluno-demo', name: 'Amberson Rogers', email: email, role: 'student', xp: 350, level: 2);
    await StorageService.saveUser(user);
    await StorageService.saveToken('demo-token-progressed-2026');
    return user;
  }

  static Future<List<ChallengeModel>> getChallenges(int moduleId) async {
    try {
      final headers = await _headers();
      final response = await http.get(Uri.parse('$baseUrl/challenges'), headers: headers).timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final List list = jsonDecode(response.body);
        if (list.isNotEmpty) {
          return list.map((e) => ChallengeModel.fromJson(e)).where((c) => c.moduleId == moduleId).toList();
        }
      }
    } catch (_) {}

    return MockBank.challenges.where((c) => c.moduleId == moduleId).toList();
  }

  static Future<List<RankingModel>> getRanking() async {
    try {
      final headers = await _headers();
      final response = await http.get(Uri.parse('$baseUrl/ranking'), headers: headers).timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final List list = jsonDecode(response.body);
        if (list.isNotEmpty) {
          return list.map((e) => RankingModel.fromJson(e)).toList();
        }
      }
    } catch (_) {}

    return MockBank.ranking;
  }
}
