import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

enum ReportState { initial, loading, success, error }
  List<Map<String, dynamic>> get tiposIncidente => _tiposIncidente;

  IncidentProvider() {
    loadTiposIncidente();
  }

  Future<void> loadTiposIncidente() async {
    try {
      _tiposIncidente = await _apiService.getTiposIncidente();
    } catch (e) {
      // Manejar el error, quizás mostrando un mensaje
      _message = 'No se pudieron cargar los tipos de incidente.';
      _state = ReportState.error;
    }
    notifyListeners(); // Notificar incluso si hay error para actualizar la UI
  }

  Future<void> pickImage(ImageSource source) async {

  Future<void> submitIncident({
    required String title,
    required String description,
    required String incidentTypeId,
  }) async {
    if (_pickedImage == null) {
      _message = 'Por favor, seleccione una imagen.';
      _state = ReportState.error;
      notifyListeners();
      return;
    }
    
    _state = ReportState.loading;
    notifyListeners();

    try {
      // Obtener el dispositivoId guardado en el login
      final prefs = await SharedPreferences.getInstance();
      final dispositivoId = prefs.getString('dispositivoId');

      if (dispositivoId == null) {
        throw Exception('ID de dispositivo no encontrado. Por favor, inicie sesión de nuevo.');
      }

      final response = await _apiService.reportIncident(
        title: title,
        description: description,
        incidentTypeId: incidentTypeId,
        dispositivoId: dispositivoId,
        image: _pickedImage!,
      );

      // La respuesta de http.StreamedResponse no tiene statusCode directamente así
      _state = (response.statusCode >= 200 && response.statusCode < 300) ? ReportState.success : ReportState.error;
      _message = _state == ReportState.success ? 'Incidente reportado con éxito' : 'Error al reportar el incidente.';

    } catch (e) {
      _state = ReportState.error;
      _message = 'Ocurrió un error: ${e.toString()}';


