import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
    required String title,
    required String description,
    required String incidentTypeId,
    required String dispositivoId,
    required File image,
  }) async {
    // Obtener el token guardado
    // Añadir campos de texto
    request.fields['titulo'] = title;
    request.fields['descripcion'] = description;
    request.fields['tipoIncidenteId'] = incidentTypeId;
    request.fields['dispositivoId'] = dispositivoId;

    // Añadir el archivo de imagen
    request.files.add(


  },
                      validator: (value) => value == null ? 'Seleccione un tipo de incidente' : null,
                    ),
                    const SizedBox(height: 24),
                    _buildImagePicker(provider),
                    const SizedBox(height: 24),
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          provider.submitIncident(
                            title: _titleController.text.trim(),
                            description: _descriptionController.text.trim(),
                            incidentTypeId: _selectedTipoIncidenteId!,
                          );
                        }
                      },

