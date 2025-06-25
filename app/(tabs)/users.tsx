import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, User, Mail, Building2, Shield, Crown, X } from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  companyId: string;
  companyName: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@techcorp.com',
    role: 'client',
    companyId: '1',
    companyName: 'TechCorp Solutions',
    status: 'active',
    lastLogin: '2024-01-15T14:30:00Z',
    createdAt: '2024-01-10T10:30:00Z',
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@innovatelab.es',
    role: 'client',
    companyId: '2',
    companyName: 'InnovateLab',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2024-01-05T14:15:00Z',
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria.lopez@global.com',
    role: 'admin',
    companyId: '3',
    companyName: 'Global Industries',
    status: 'inactive',
    lastLogin: '2024-01-10T09:20:00Z',
    createdAt: '2023-12-20T09:45:00Z',
  },
];

const roleColors = {
  admin: '#7C3AED',
  client: '#2563EB',
};

const roleLabels = {
  admin: 'Administrador',
  client: 'Cliente',
};

function UserCard({ user }: { user: User }) {
  const getRoleIcon = (role: string) => {
    return role === 'admin' ? 
      <Crown size={16} color={roleColors[role as keyof typeof roleColors]} strokeWidth={2} /> :
      <User size={16} color={roleColors[role as keyof typeof roleColors]} strokeWidth={2} />;
  };

  return (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: `${roleColors[user.role]}15` }]}>
              {getRoleIcon(user.role)}
              <Text style={[styles.roleText, { color: roleColors[user.role] }]}>
                {roleLabels[user.role]}
              </Text>
            </View>
          </View>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Mail size={14} color="#6B7280" strokeWidth={2} />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <Building2 size={14} color="#6B7280" strokeWidth={2} />
              <Text style={styles.contactText}>{user.companyName}</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.statusIndicator, {
          backgroundColor: user.status === 'active' ? '#059669' : '#EF4444'
        }]} />
      </View>

      <View style={styles.userFooter}>
        <Text style={styles.lastLoginText}>
          Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-ES')}
        </Text>
        <Text style={styles.createdText}>
          Creado: {new Date(user.createdAt).toLocaleDateString('es-ES')}
        </Text>
      </View>
    </View>
  );
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'client' as const,
    companyId: '1',
    companyName: 'TechCorp Solutions',
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      Alert.alert('Error', 'Por favor, completa los campos obligatorios');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setUsers([user, ...users]);
    setNewUser({ name: '', email: '', role: 'client', companyId: '1', companyName: 'TechCorp Solutions' });
    setShowNewUser(false);
    Alert.alert('Éxito', 'Usuario creado correctamente');
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewUser(true)}
        >
          <Plus size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalUsers}</Text>
          <Text style={styles.summaryLabel}>Total Usuarios</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{activeUsers}</Text>
          <Text style={styles.summaryLabel}>Usuarios Activos</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{adminUsers}</Text>
          <Text style={styles.summaryLabel}>Administradores</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuarios..."
            placeholderTextColor="#9CA3AF"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
        
        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <User size={48} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.emptyStateTitle}>No se encontraron usuarios</Text>
            <Text style={styles.emptyStateText}>
              {searchTerm 
                ? 'Intenta ajustar tu búsqueda' 
                : 'Crea tu primer usuario para comenzar'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showNewUser}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewUser(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Usuario</Text>
            <TouchableOpacity onPress={() => setShowNewUser(false)}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre Completo *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ingresa el nombre completo"
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Correo Electrónico *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="usuario@empresa.com"
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Rol</Text>
              <View style={styles.roleContainer}>
                {Object.entries(roleLabels).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.roleOption,
                      newUser.role === key && styles.roleOptionSelected,
                      { borderColor: roleColors[key as keyof typeof roleColors] }
                    ]}
                    onPress={() => setNewUser({ ...newUser, role: key as any })}
                  >
                    <View style={styles.roleOptionContent}>
                      {key === 'admin' ? 
                        <Crown size={20} color={roleColors[key as keyof typeof roleColors]} strokeWidth={2} /> :
                        <User size={20} color={roleColors[key as keyof typeof roleColors]} strokeWidth={2} />
                      }
                      <Text
                        style={[
                          styles.roleOptionText,
                          newUser.role === key && { color: roleColors[key as keyof typeof roleColors] }
                        ]}
                      >
                        {label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Empresa Asignada</Text>
              <View style={styles.companySelectContainer}>
                <Building2 size={20} color="#6B7280" strokeWidth={2} />
                <Text style={styles.companySelectText}>{newUser.companyName}</Text>
              </View>
              <Text style={styles.helpText}>
                El usuario será asignado automáticamente a la empresa seleccionada
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowNewUser(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateUser}
            >
              <Text style={styles.createButtonText}>Crear Usuario</Text>
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
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  contactInfo: {
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  lastLoginText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  createdText: {
    fontSize: 12,
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
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  roleOptionSelected: {
    backgroundColor: '#F8FAFC',
  },
  roleOptionContent: {
    alignItems: 'center',
    gap: 8,
  },
  roleOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  companySelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  companySelectText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  helpText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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