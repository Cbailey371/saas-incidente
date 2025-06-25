import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { User, Bell, Shield, Palette, CircleHelp as HelpCircle, LogOut, ChevronRight, Crown } from 'lucide-react-native';

interface SettingItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action: 'navigate' | 'toggle' | 'custom';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showArrow?: boolean;
}

function SettingRow({ item }: { item: SettingItem }) {
  return (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={item.onPress}
      disabled={item.action === 'toggle'}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {item.action === 'toggle' && item.onToggle && (
          <Switch
            value={item.value || false}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
            thumbColor={item.value ? '#FFFFFF' : '#9CA3AF'}
          />
        )}
        {item.showArrow && (
          <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const isAdmin = user?.user_metadata?.role === 'admin';

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const profileSettings: SettingItem[] = [
    {
      icon: <User size={20} color="#2563EB" strokeWidth={2} />,
      title: 'Información Personal',
      subtitle: 'Actualiza tu perfil y datos de contacto',
      action: 'navigate',
      showArrow: true,
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
    },
  ];

  const notificationSettings: SettingItem[] = [
    {
      icon: <Bell size={20} color="#059669" strokeWidth={2} />,
      title: 'Notificaciones Push',
      subtitle: 'Recibe alertas de nuevos incidentes',
      action: 'toggle',
      value: true,
      onToggle: (value) => console.log('Push notifications:', value),
    },
    {
      icon: <Bell size={20} color="#059669" strokeWidth={2} />,
      title: 'Notificaciones por Email',
      subtitle: 'Recibe resúmenes diarios por correo',
      action: 'toggle',
      value: false,
      onToggle: (value) => console.log('Email notifications:', value),
    },
  ];

  const securitySettings: SettingItem[] = [
    {
      icon: <Shield size={20} color="#EA580C" strokeWidth={2} />,
      title: 'Cambiar Contraseña',
      subtitle: 'Actualiza tu contraseña de acceso',
      action: 'navigate',
      showArrow: true,
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
    },
    {
      icon: <Shield size={20} color="#EA580C" strokeWidth={2} />,
      title: 'Autenticación de Dos Factores',
      subtitle: 'Añade una capa extra de seguridad',
      action: 'toggle',
      value: false,
      onToggle: (value) => console.log('2FA:', value),
    },
  ];

  const adminSettings: SettingItem[] = isAdmin ? [
    {
      icon: <Crown size={20} color="#7C3AED" strokeWidth={2} />,
      title: 'Panel de Administración',
      subtitle: 'Accede a configuraciones avanzadas',
      action: 'navigate',
      showArrow: true,
      onPress: () => Alert.alert('Panel Admin', 'Configuraciones avanzadas del sistema'),
    },
    {
      icon: <Palette size={20} color="#7C3AED" strokeWidth={2} />,
      title: 'Personalización',
      subtitle: 'Personaliza la apariencia del sistema',
      action: 'navigate',
      showArrow: true,
      onPress: () => Alert.alert('Próximamente', 'Personalización estará disponible pronto'),
    },
  ] : [];

  const supportSettings: SettingItem[] = [
    {
      icon: <HelpCircle size={20} color="#6B7280" strokeWidth={2} />,
      title: 'Centro de Ayuda',
      subtitle: 'Encuentra respuestas a tus preguntas',
      action: 'navigate',
      showArrow: true,
      onPress: () => Alert.alert('Centro de Ayuda', 'Documentación y tutoriales disponibles'),
    },
    {
      icon: <HelpCircle size={20} color="#6B7280" strokeWidth={2} />,
      title: 'Contactar Soporte',
      subtitle: 'Obtén ayuda de nuestro equipo',
      action: 'navigate',
      showArrow: true,
      onPress: () => Alert.alert('Soporte', 'Contacta con soporte@incidentes.com'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <User size={32} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>
                {user?.user_metadata?.full_name || 'Usuario'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                {isAdmin ? (
                  <Crown size={14} color="#7C3AED" strokeWidth={2} />
                ) : (
                  <User size={14} color="#2563EB" strokeWidth={2} />
                )}
                <Text style={[styles.roleText, { 
                  color: isAdmin ? '#7C3AED' : '#2563EB' 
                }]}>
                  {isAdmin ? 'Administrador' : 'Cliente'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <View style={styles.settingsGroup}>
            {profileSettings.map((item, index) => (
              <SettingRow key={index} item={item} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.settingsGroup}>
            {notificationSettings.map((item, index) => (
              <SettingRow key={index} item={item} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          <View style={styles.settingsGroup}>
            {securitySettings.map((item, index) => (
              <SettingRow key={index} item={item} />
            ))}
          </View>
        </View>

        {isAdmin && adminSettings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administración</Text>
            <View style={styles.settingsGroup}>
              {adminSettings.map((item, index) => (
                <SettingRow key={index} item={item} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <View style={styles.settingsGroup}>
            {supportSettings.map((item, index) => (
              <SettingRow key={index} item={item} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#DC2626" strokeWidth={2} />
            <Text style={styles.signOutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Sistema de Gestión de Incidentes</Text>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});