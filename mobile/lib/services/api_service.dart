import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:8080/api';
  
  String? _token;

  void setToken(String token) {
    _token = token;
  }

  Map<String, String> _getHeaders() {
    final headers = {'Content-Type': 'application/json'};
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Login failed');
    }
  }

  Future<List<dynamic>> getPendingLoans() async {
    final response = await http.get(
      Uri.parse('$baseUrl/admin/loans/pending'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load loans');
    }
  }

  Future<Map<String, dynamic>> approveLoan(int loanId, bool disbursed) async {
    final response = await http.post(
      Uri.parse('$baseUrl/admin/loans/$loanId/approve'),
      headers: _getHeaders(),
      body: jsonEncode({'disbursed': disbursed}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to approve loan');
    }
  }

  Future<List<dynamic>> getBranchClients() async {
    final response = await http.get(
      Uri.parse('$baseUrl/branch/clients'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load clients');
    }
  }

  Future<Map<String, dynamic>> registerClient(Map<String, dynamic> clientData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/branch/clients'),
      headers: _getHeaders(),
      body: jsonEncode(clientData),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to register client');
    }
  }

  Future<Map<String, dynamic>> applyForLoan(Map<String, dynamic> loanData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/branch/loans'),
      headers: _getHeaders(),
      body: jsonEncode(loanData),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to apply for loan');
    }
  }
}
