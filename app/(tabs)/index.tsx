import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, Building2, Users, TrendingUp, Bell, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
          {icon}
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {trend && (
            <Text style={[styles.statTrend, { color: color }]}>{trend}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const isAdmin = user?.user_metadata?.role === 'admin';

  const adminStats = [
    {
      title: 'Empresas Activas',
      value: '12',
      icon: <Building2 size={24} color="#2563EB" strokeWidth={2} />,
      color: '#2563EB',
      trend: '+2 este mes',
    },
    {
      title: 'Incidentes Totales',
      value: '847',
      icon: <AlertTriangle size={24} color="#EA580C" strokeWidth={2} />,
      color: '#EA580C',
      trend: '+15% vs mes anterior',
    },
    {
      title: 'Usuarios Activos',
      value: '156',
      icon: <Users size={24} color="#059669" strokeWidth={2} />,
      color: '#059669',
      trend: '+8 esta semana',
    },
    {
      title: 'Tasa de Resolución',
      value: '94%',
      icon: <TrendingUp size={24} color="#7C3AED" strokeWidth={2} />,
      color: '#7C3AED',
      trend: '+3% mejora',
    },
  ];

  const clientStats = [
    {
      title: 'Mis Incidentes',
      value: '23',
      icon: <AlertTriangle size={24} color="#EA580C" strokeWidth={2} />,
      color: '#EA580C',
      trend: '5 pendientes',
    },
    {
      title: 'Resueltos Este Mes',
      value: '18',
      icon: <TrendingUp size={24} color="#059669" strokeWidth={2} />,
      color: '#059669',
      trend: '+12 vs mes anterior',
    },
  ];

  const stats = isAdmin ? adminStats : clientStats;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              Hola, {user?.user_metadata?.full_name || 'Usuario'}
            </Text>
            <Text style={styles.role}>
              {isAdmin ? 'Administrador del Sistema' : 'Cliente'}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#FFFFFF" strokeWidth={2} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/incidents')}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.quickActionText}>Nuevo Incidente</Text>
            </TouchableOpacity>
            
            {isAdmin && (
              <TouchableOpacity 
                style={[styles.quickActionButton, styles.secondaryAction]}
                onPress={() => router.push('/companies')}
              >
                <Building2 size={20} color="#2563EB" strokeWidth={2} />
                <Text style={[styles.quickActionText, { color: '#2563EB' }]}>
                  Gestionar Empresas
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#FEF3C7' }]}>
                <AlertTriangle size={16} color="#F59E0B" strokeWidth={2} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Nuevo incidente reportado</Text>
                <Text style={styles.activityTime}>Hace 2 horas</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#D1FAE5' }]}>
                <TrendingUp size={16} color="#059669" strokeWidth={2} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Incidente resuelto</Text>
                <Text style={styles.activityTime}>Hace 4 horas</Text>
              </View>
            </View>

            {isAdmin && (
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Building2 size={16} color="#2563EB" strokeWidth={2} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Nueva empresa registrada</Text>
                  <Text style={styles.activityTime}>Ayer</Text>
                </View>
              </View>
            )}
          </View>
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
    paddingVertical: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  statTrend: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  quickActions: {
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});