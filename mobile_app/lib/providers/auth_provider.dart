import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

enum AuthState { unauthenticated, authenticating, authenticated, error }

class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  AuthState _authState = AuthState.unauthenticated;
  String _errorMessage = '';

  AuthState get authState => _authState;
  String get errorMessage => _errorMessage;

  Future<void> login(String email, String password) async {
    _authState = AuthState.authenticating;
    notifyListeners();

    try {
      final responseData = await _apiService.login(email, password);
      final token = responseData['token'];
      final dispositivoId = responseData['dispositivoId'];

      if (token != null && dispositivoId != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', token);
        await prefs.setString('dispositivoId', dispositivoId);
        _authState = AuthState.authenticated;
      } else {
        throw Exception('Respuesta inválida del servidor. El dispositivo puede no ser válido.');
      }
    } catch (e) {
      _authState = AuthState.error;
      _errorMessage = e.toString().replaceFirst('Exception: ', '');
    }
    notifyListeners();
  }

  Future<void> logout() async {
    // Lógica para limpiar SharedPreferences y cambiar el estado
  }
}

