import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Building2, Users, Calendar, MoveVertical as MoreVertical, X, Mail, Phone } from 'lucide-react-native';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  usersCount: number;
  incidentsCount: number;
  createdAt: string;
  subscription: 'basic' | 'pro' | 'enterprise';
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'contacto@techcorp.com',
    phone: '+34 666 123 456',
    address: 'Calle Mayor 123, Madrid',
    status: 'active',
    usersCount: 15,
    incidentsCount: 45,
    createdAt: '2024-01-10T10:30:00Z',
    subscription: 'pro',
  },
  {
    id: '2',
    name: 'InnovateLab',
    email: 'info@innovatelab.es',
    phone: '+34 677 987 654',
    address: 'Avenida Libertad 456, Barcelona',
    status: 'active',
    usersCount: 8,
    incidentsCount: 23,
    createdAt: '2024-01-05T14:15:00Z',
    subscription: 'basic',
  },
  {
    id: '3',
    name: 'Global Industries',
    email: 'admin@global.com',
    phone: '+34 655 111 222',
    address: 'Plaza Central 789, Valencia',
    status: 'inactive',
    usersCount: 25,
    incidentsCount: 67,
    createdAt: '2023-12-20T09:45:00Z',
    subscription: 'enterprise',
  },
];

const subscriptionColors = {
  basic: '#6B7280',
  pro: '#2563EB',
  enterprise: '#7C3AED',
};

const subscriptionLabels = {
  basic: 'Básico',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

function CompanyCard({ company, onToggleStatus }: { company: Company; onToggleStatus: (id: string) => void }) {
  return (
    <View style={styles.companyCard}>
      <View style={styles.companyHeader}>
        <View style={styles.companyTitleContainer}>
          <Text style={styles.companyName}>{company.name}</Text>
          <View style={[styles.subscriptionBadge, { backgroundColor: `${subscriptionColors[company.subscription]}15` }]}>
            <Text style={[styles.subscriptionText, { color: subscriptionColors[company.subscription] }]}>
              {subscriptionLabels[company.subscription]}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.companyInfo}>
        <View style={styles.contactRow}>
          <Mail size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.contactText}>{company.email}</Text>
        </View>
        <View style={styles.contactRow}>
          <Phone size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.contactText}>{company.phone}</Text>
        </View>
      </View>

      <View style={styles.companyStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{company.usersCount}</Text>
          <Text style={styles.statLabel}>Usuarios</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{company.incidentsCount}</Text>
          <Text style={styles.statLabel}>Incidentes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {new Date(company.createdAt).toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: '2-digit' 
            })}
          </Text>
          <Text style={styles.statLabel}>Creado</Text>
        </View>
      </View>

      <View style={styles.companyFooter}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Estado:</Text>
          <Switch
            value={company.status === 'active'}
            onValueChange={() => onToggleStatus(company.id)}
            trackColor={{ false: '#E5E7EB', true: '#059669' }}
            thumbColor={company.status === 'active' ? '#FFFFFF' : '#9CA3AF'}
          />
          <Text style={[styles.statusText, { 
            color: company.status === 'active' ? '#059669' : '#EF4444' 
          }]}>
            {company.status === 'active' ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function CompaniesScreen() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subscription: 'basic' as const,
  });

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setCompanies(companies.map(company => 
      company.id === id 
        ? { ...company, status: company.status === 'active' ? 'inactive' : 'active' }
        : company
    ));
  };

  const handleCreateCompany = () => {
    if (!newCompany.name || !newCompany.email) {
      Alert.alert('Error', 'Por favor, completa los campos obligatorios');
      return;
    }

    const company: Company = {
      id: Date.now().toString(),
      ...newCompany,
      status: 'active',
      usersCount: 0,
      incidentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setCompanies([company, ...companies]);
    setNewCompany({ name: '', email: '', phone: '', address: '', subscription: 'basic' });
    setShowNewCompany(false);
    Alert.alert('Éxito', 'Empresa creada correctamente');
  };

  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const totalUsers = companies.reduce((sum, c) => sum + c.usersCount, 0);
  const totalIncidents = companies.reduce((sum, c) => sum + c.incidentsCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Empresas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewCompany(true)}
        >
          <Plus size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{activeCompanies}</Text>
          <Text style={styles.summaryLabel}>Empresas Activas</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalUsers}</Text>
          <Text style={styles.summaryLabel}>Total Usuarios</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalIncidents}</Text>
          <Text style={styles.summaryLabel}>Total Incidentes</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar empresas..."
            placeholderTextColor="#9CA3AF"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredCompanies.map(company => (
          <CompanyCard 
            key={company.id} 
            company={company} 
            onToggleStatus={handleToggleStatus}
          />
        ))}
        
        {filteredCompanies.length === 0 && (
          <View style={styles.emptyState}>
            <Building2 size={48} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.emptyStateTitle}>No se encontraron empresas</Text>
            <Text style={styles.emptyStateText}>
              {searchTerm 
                ? 'Intenta ajustar tu búsqueda' 
                : 'Crea tu primera empresa para comenzar'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showNewCompany}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewCompany(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Empresa</Text>
            <TouchableOpacity onPress={() => setShowNewCompany(false)}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre de la Empresa *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ingresa el nombre de la empresa"
                value={newCompany.name}
                onChangeText={(text) => setNewCompany({ ...newCompany, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Correo Electrónico *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="contacto@empresa.com"
                value={newCompany.email}
                onChangeText={(text) => setNewCompany({ ...newCompany, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Teléfono</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+34 666 123 456"
                value={newCompany.phone}
                onChangeText={(text) => setNewCompany({ ...newCompany, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Dirección</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Dirección completa de la empresa"
                value={newCompany.address}
                onChangeText={(text) => setNewCompany({ ...newCompany, address: text })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Plan de Suscripción</Text>
              <View style={styles.subscriptionContainer}>
                {Object.entries(subscriptionLabels).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.subscriptionOption,
                      newCompany.subscription === key && styles.subscriptionOptionSelected,
                      { borderColor: subscriptionColors[key as keyof typeof subscriptionColors] }
                    ]}
                    onPress={() => setNewCompany({ ...newCompany, subscription: key as any })}
                  >
                    <Text
                      style={[
                        styles.subscriptionOptionText,
                        newCompany.subscription === key && { 
                          color: subscriptionColors[key as keyof typeof subscriptionColors] 
                        }
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowNewCompany(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateCompany}
            >
              <Text style={styles.createButtonText}>Crear Empresa</Text>
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchBar: {
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  companyCard: {
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
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  menuButton: {
    padding: 4,
  },
  companyInfo: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  companyStats: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  companyFooter: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
    height: 80,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  subscriptionOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  subscriptionOptionSelected: {
    backgroundColor: '#F8FAFC',
  },
  subscriptionOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
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