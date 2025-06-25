import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Calendar, Download, Filter, X, FileText, ChartPie as PieChart } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface ReportStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

function StatCard({ stat }: { stat: ReportStat }) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return '#059669';
      case 'negative': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.statCard, { borderLeftColor: stat.color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
          {stat.icon}
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statTitle}>{stat.title}</Text>
          <Text style={[styles.statChange, { color: getChangeColor(stat.changeType) }]}>
            {stat.change}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SimpleChart({ data, title }: { data: ChartData[]; title: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chart}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartItem}>
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.chartLabel}>{item.label}</Text>
            <Text style={styles.chartValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ReportsScreen() {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const isAdmin = user?.user_metadata?.role === 'admin';

  const adminStats: ReportStat[] = [
    {
      title: 'Incidentes Totales',
      value: '1,247',
      change: '+15.3% vs mes anterior',
      changeType: 'positive',
      icon: <BarChart3 size={24} color="#2563EB" strokeWidth={2} />,
      color: '#2563EB',
    },
    {
      title: 'Tasa de Resolución',
      value: '94.2%',
      change: '+2.1% mejora',
      changeType: 'positive',
      icon: <TrendingUp size={24} color="#059669" strokeWidth={2} />,
      color: '#059669',
    },
    {
      title: 'Tiempo Promedio',
      value: '2.4h',
      change: '-0.5h reducción',
      changeType: 'positive',
      icon: <Calendar size={24} color="#EA580C" strokeWidth={2} />,
      color: '#EA580C',
    },
    {
      title: 'Empresas Activas',
      value: '12',
      change: '+2 nuevas',
      changeType: 'positive',
      icon: <PieChart size={24} color="#7C3AED" strokeWidth={2} />,
      color: '#7C3AED',
    },
  ];

  const clientStats: ReportStat[] = [
    {
      title: 'Mis Incidentes',
      value: '34',
      change: '+8 este mes',
      changeType: 'neutral',
      icon: <BarChart3 size={24} color="#2563EB" strokeWidth={2} />,
      color: '#2563EB',
    },
    {
      title: 'Resueltos',
      value: '29',
      change: '85.3% tasa',
      changeType: 'positive',
      icon: <TrendingUp size={24} color="#059669" strokeWidth={2} />,
      color: '#059669',
    },
    {
      title: 'Tiempo Promedio',
      value: '3.2h',
      change: 'En mejora',
      changeType: 'positive',
      icon: <Calendar size={24} color="#EA580C" strokeWidth={2} />,
      color: '#EA580C',
    },
  ];

  const incidentsByStatus: ChartData[] = [
    { label: 'Abierto', value: 45, color: '#EF4444' },
    { label: 'En Progreso', value: 32, color: '#F59E0B' },
    { label: 'Resuelto', value: 128, color: '#059669' },
    { label: 'Cerrado', value: 156, color: '#6B7280' },
  ];

  const incidentsByPriority: ChartData[] = [
    { label: 'Baja', value: 89, color: '#059669' },
    { label: 'Media', value: 156, color: '#F59E0B' },
    { label: 'Alta', value: 67, color: '#EA580C' },
    { label: 'Crítica', value: 23, color: '#DC2626' },
  ];

  const stats = isAdmin ? adminStats : clientStats;

  const periods = [
    { label: 'Esta semana', value: 'week' },
    { label: 'Este mes', value: 'month' },
    { label: 'Últimos 3 meses', value: 'quarter' },
    { label: 'Este año', value: 'year' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reportes y Analíticas</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color="#2563EB" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análisis de Incidentes</Text>
          <SimpleChart data={incidentsByStatus} title="Por Estado" />
        </View>

        <View style={styles.section}>
          <SimpleChart data={incidentsByPriority} title="Por Prioridad" />
        </View>

        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Métricas por Empresa</Text>
            <View style={styles.companyMetrics}>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>TechCorp Solutions</Text>
                <View style={styles.metricStats}>
                  <View style={styles.metricStat}>
                    <Text style={styles.metricValue}>45</Text>
                    <Text style={styles.metricLabel}>Incidentes</Text>
                  </View>
                  <View style={styles.metricStat}>
                    <Text style={styles.metricValue}>2.8h</Text>
                    <Text style={styles.metricLabel}>Promedio</Text>
                  </View>
                  <View style={styles.metricStat}>
                    <Text style={[styles.metricValue, { color: '#059669' }]}>92%</Text>
                    <Text style={styles.metricLabel}>Resolución</Text>
                  </View>
                </View>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>InnovateLab</Text>
                <View style={styles.metricStats}>
                  <View style={styles.metricStat}>
                    <Text style={styles.metricValue}>23</Text>
                    <Text style={styles.metricLabel}>Incidentes</Text>
                  </View>
                  <View style={styles.metricStat}>
                    <Text style={styles.metricValue}>3.1h</Text>
                    <Text style={styles.metricLabel}>Promedio</Text>
                  </View>
                  <View style={styles.metricStat}>
                    <Text style={[styles.metricValue, { color: '#059669' }]}>87%</Text>
                    <Text style={styles.metricLabel}>Resolución</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Recomendadas</Text>
          <View style={styles.recommendationCard}>
            <FileText size={20} color="#2563EB" strokeWidth={2} />
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>
                {isAdmin 
                  ? 'Optimizar tiempos de respuesta' 
                  : 'Mejorar descripción de incidentes'
                }
              </Text>
              <Text style={styles.recommendationText}>
                {isAdmin
                  ? 'Se detectó un aumento en los tiempos de resolución. Considera asignar más recursos durante las horas pico.'
                  : 'Agregar más detalles y ubicaciones específicas puede acelerar la resolución de tus incidentes.'
                }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros de Reporte</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Período de Tiempo</Text>
              <View style={styles.periodOptions}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period.value}
                    style={[
                      styles.periodOption,
                      selectedPeriod === period.value && styles.periodOptionSelected
                    ]}
                    onPress={() => setSelectedPeriod(period.value)}
                  >
                    <Text
                      style={[
                        styles.periodOptionText,
                        selectedPeriod === period.value && styles.periodOptionTextSelected
                      ]}
                    >
                      {period.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={styles.resetButtonText}>Resetear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  statsContainer: {
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
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    gap: 8,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: '100%',
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
    textAlign: 'center',
  },
  chartValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
  },
  companyMetrics: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  metricStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricStat: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
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
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  periodOptions: {
    gap: 8,
  },
  periodOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodOptionSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
  },
  periodOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  periodOptionTextSelected: {
    color: '#2563EB',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});