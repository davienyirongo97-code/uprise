import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final _storage = const FlutterSecureStorage();
  final _apiService = ApiService();
  
  String? _token;
  String? _role;
  String? _fullName;
  bool _isAuthenticated = false;

  bool get isAuthenticated => _isAuthenticated;
  String? get role => _role;
  String? get fullName => _fullName;
  String? get token => _token;

  Future<void> login(String username, String password) async {
    try {
      final response = await _apiService.login(username, password);
      
      _token = response['token'];
      _role = response['role'];
      _fullName = response['fullName'];
      _isAuthenticated = true;
      
      await _storage.write(key: 'token', value: _token);
      await _storage.write(key: 'role', value: _role);
      await _storage.write(key: 'fullName', value: _fullName);
      
      notifyListeners();
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }

  Future<void> logout() async {
    _token = null;
    _role = null;
    _fullName = null;
    _isAuthenticated = false;
    
    await _storage.deleteAll();
    notifyListeners();
  }

  Future<void> checkAuth() async {
    _token = await _storage.read(key: 'token');
    _role = await _storage.read(key: 'role');
    _fullName = await _storage.read(key: 'fullName');
    
    if (_token != null) {
      _isAuthenticated = true;
      notifyListeners();
    }
  }
}
