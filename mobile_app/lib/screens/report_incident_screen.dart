import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String? _selectedTipoIncidenteId;

  @override
  void dispose() {
                      maxLines: 4,
                      validator: (value) => value!.isEmpty ? 'La descripción es obligatoria' : null,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      decoration: const InputDecoration(labelText: 'Tipo de Incidente'),
                      value: _selectedTipoIncidenteId,
                      items: provider.tiposIncidente.map((tipo) {
                        return DropdownMenuItem(
                          value: tipo['id'],
                          child: Text(tipo['nombre']),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedTipoIncidenteId = value;
                        });
                      },
                      validator: (value) => value == null ? 'Seleccione un tipo de incidente' : null,
                    ),
                    //  Aquí debes modificar el método submitIncident en el provider
                    //  para que use _selectedTipoIncidenteId en lugar de un ID fijo.
                    //  Algo como:
                    //  provider.submitIncident(
                    //    title: _titleController.text,
                    //    description: _descriptionController.text,
                    //    incidentTypeId: _selectedTipoIncidenteId!,
                    //  );
                    //
                    //  Y también debes actualizar el método reportIncident en ApiService
                    //  para que acepte el incidentTypeId como parámetro.

                    const SizedBox(height: 24),
                    _buildImagePicker(provider),
                    const SizedBox(height: 24),

