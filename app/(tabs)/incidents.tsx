import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, TriangleAlert as AlertTriangle, Clock, CircleCheck as CheckCircle, X, Camera, MapPin } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface Incident {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  location?: string;
  imageUri?: string;
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Falla en sistema de seguridad',
    description: 'El sistema de cámaras de seguridad presenta intermitencias',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T10:30:00Z',
    location: 'Edificio Principal - Planta 2',
  },
  {
    id: '2',
    title: 'Equipo de computo dañado',
    description: 'La computadora del área de recepción no enciende',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-01-14T15:45:00Z',
    location: 'Recepción',
  },
  {
    id: '3',
    title: 'Mantenimiento de aire acondicionado',
    description: 'El aire acondicionado de la sala de juntas hace ruido',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-01-13T09:15:00Z',
    location: 'Sala de Juntas A',
  },
];

const priorityColors = {
  low: '#059669',
  medium: '#F59E0B',
  high: '#EA580C',
  critical: '#DC2626',
};

const statusColors = {
  open: '#EF4444',
  in_progress: '#F59E0B',
  resolved: '#059669',
  closed: '#6B7280',
};

const statusLabels = {
  open: 'Abierto',
  in_progress: 'En Progreso',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

function IncidentCard({ incident }: { incident: Incident }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle size={16} color={statusColors[status as keyof typeof statusColors]} strokeWidth={2} />;
      case 'in_progress':
        return <Clock size={16} color={statusColors[status as keyof typeof statusColors]} strokeWidth={2} />;
      case 'resolved':
      case 'closed':
        return <CheckCircle size={16} color={statusColors[status as keyof typeof statusColors]} strokeWidth={2} />;
      default:
        return <AlertTriangle size={16} color="#6B7280" strokeWidth={2} />;
    }
  };

  return (
    <View style={styles.incidentCard}>
      <View style={styles.incidentHeader}>
        <Text style={styles.incidentTitle}>{incident.title}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: `${priorityColors[incident.priority]}15` }]}>
          <Text style={[styles.priorityText, { color: priorityColors[incident.priority] }]}>
            {priorityLabels[incident.priority]}
          </Text>
        </View>
      </View>
      
      <Text style={styles.incidentDescription}>{incident.description}</Text>
      
      {incident.location && (
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#6B7280" strokeWidth={2} />
          <Text style={styles.locationText}>{incident.location}</Text>
        </View>
      )}
      
      <View style={styles.incidentFooter}>
        <View style={styles.statusContainer}>
          {getStatusIcon(incident.status)}
          <Text style={[styles.statusText, { color: statusColors[incident.status as keyof typeof statusColors] }]}>
            {statusLabels[incident.status as keyof typeof statusLabels]}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(incident.createdAt).toLocaleDateString('es-ES')}
        </Text>
      </View>
    </View>
  );
}

export default function IncidentsScreen() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    location: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateIncident = () => {
    if (!newIncident.title || !newIncident.description) {
      Alert.alert('Error', 'Por favor, completa los campos obligatorios');
      return;
    }

    const incident: Incident = {
      id: Date.now().toString(),
      ...newIncident,
      status: 'open',
      createdAt: new Date().toISOString(),
      imageUri: selectedImage || undefined,
    };

    setIncidents([incident, ...incidents]);
    setNewIncident({ title: '', description: '', priority: 'medium', location: '' });
    setSelectedImage(null);
    setShowNewIncident(false);
    Alert.alert('Éxito', 'Incidente creado correctamente');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Incidentes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewIncident(true)}
        >
          <Plus size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar incidentes..."
            placeholderTextColor="#9CA3AF"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#2563EB" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredIncidents.map(incident => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
        
        {filteredIncidents.length === 0 && (
          <View style={styles.emptyState}>
            <AlertTriangle size={48} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.emptyStateTitle}>No se encontraron incidentes</Text>
            <Text style={styles.emptyStateText}>
              {searchTerm 
                ? 'Intenta ajustar tu búsqueda' 
                : 'Crea tu primer incidente para comenzar'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showNewIncident}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewIncident(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Incidente</Text>
            <TouchableOpacity onPress={() => setShowNewIncident(false)}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Título *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Describe brevemente el incidente"
                value={newIncident.title}
                onChangeText={(text) => setNewIncident({ ...newIncident, title: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Descripción *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Proporciona detalles del incidente"
                value={newIncident.description}
                onChangeText={(text) => setNewIncident({ ...newIncident, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Ubicación</Text>
              <TextInput
                style={styles.formInput}
                placeholder="¿Dónde ocurrió el incidente?"
                value={newIncident.location}
                onChangeText={(text) => setNewIncident({ ...newIncident, location: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Prioridad</Text>
              <View style={styles.priorityContainer}>
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.priorityOption,
                      newIncident.priority === key && styles.priorityOptionSelected,
                      { borderColor: priorityColors[key as keyof typeof priorityColors] }
                    ]}
                    onPress={() => setNewIncident({ ...newIncident, priority: key as any })}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        newIncident.priority === key && { color: priorityColors[key as keyof typeof priorityColors] }
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Imagen</Text>
              <View style={styles.imageContainer}>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Camera size={20} color="#2563EB" strokeWidth={2} />
                  <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <Camera size={20} color="#2563EB" strokeWidth={2} />
                  <Text style={styles.imageButtonText}>Tomar Foto</Text>
                </TouchableOpacity>
              </View>
              {selectedImage && (
                <Text style={styles.selectedImageText}>Imagen seleccionada ✓</Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowNewIncident(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateIncident}
            >
              <Text style={styles.createButtonText}>Crear Incidente</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  incidentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  incidentTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  incidentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  incidentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  dateText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityOptionSelected: {
    backgroundColor: '#F8FAFC',
  },
  priorityOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  imageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  selectedImageText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});