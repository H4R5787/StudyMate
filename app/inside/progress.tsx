import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { StorageService } from '../../services/storage';
import { ValidationUtils } from '../../utils/validation';

interface SubjectStat {
  name: string;
  time: number;
  progress: number;
  color: string;
  grade: string;
}

interface SessionRecord {
  id: string;
  routeId?: string;
  subject: string;
  duration: string;
  date: string;
  activityTitle: string;
}

export default function ProgressPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const studyData = {
    week: [2.5, 4.0, 3.5, 5.0, 4.5, 6.0, 5.5],
    month: [3.2, 4.5, 5.0, 4.2, 6.1, 5.5, 4.8, 3.9, 6.2, 5.0, 4.7, 5.8],
    year: [18, 24, 28, 22, 35, 30, 38, 42, 36, 40, 44, 48],
  };

  const subjects: SubjectStat[] = [
    { name: 'Mathematics', time: 45, progress: 0.75, color: '#4361ee', grade: 'A-' },
    { name: 'Physics', time: 32, progress: 0.6, color: '#06d6a0', grade: 'B+' },
    { name: 'Chemistry', time: 28, progress: 0.45, color: '#f72585', grade: 'B' },
    { name: 'Biology', time: 18, progress: 0.3, color: '#ffb703', grade: 'B-' },
  ];

  const DEFAULT_HISTORY: SessionRecord[] = [
    { id: '1', routeId: '1', subject: 'Mathematics', activityTitle: 'Algebra & Equations Quiz', duration: '45 mins', date: '2026-09-27' },
    { id: '2', routeId: '2', subject: 'Physics', activityTitle: 'Mechanics & Newton Laws', duration: '1h 30m', date: '2026-09-26' },
    { id: '3', routeId: '3', subject: 'Chemistry', activityTitle: 'Stoichiometry & Molarity', duration: '30 mins', date: '2026-09-25' },
    { id: '4', routeId: '4', subject: 'Biology', activityTitle: 'Cell Division & Mitosis', duration: '40 mins', date: '2026-09-24' },
  ];

  const [history, setHistory] = useState<SessionRecord[]>(DEFAULT_HISTORY);

  useEffect(() => {
    StorageService.getActivities().then((stored) => {
      if (stored && stored.length > 0) {
        const storedRecords: SessionRecord[] = stored.map((s) => ({
          id: s.id,
          routeId: s.routeId,
          subject: s.subject,
          duration: s.duration,
          date: s.date || 'Today',
          activityTitle: s.title,
        }));
        setHistory([...storedRecords, ...DEFAULT_HISTORY]);
      }
    });
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 64, 680);

  const totalStudyHours = timeRange === 'week' ? '31.0 hrs' : timeRange === 'month' ? '124.5 hrs' : '385.0 hrs';
  const streakDays = '14 Days';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Study Analytics"
        subtitle="Performance metrics & time tracking"
        rightAction={{
          icon: 'settings-outline',
          onPress: () => router.push('/settings'),
          label: 'Settings',
        }}
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContainer}>
            {/* KPI Summary Cards */}
            <View style={styles.kpiRow}>
              <View style={[styles.kpiCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={[styles.kpiIcon, { backgroundColor: 'rgba(67, 97, 238, 0.12)' }]}>
                  <Ionicons name="time-outline" size={22} color={colors.primary} />
                </View>
                <Text style={[styles.kpiValue, { color: colors.text }]}>{totalStudyHours}</Text>
                <Text style={[styles.kpiLabel, { color: colors.secondaryText }]}>Total Focused Time</Text>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={[styles.kpiIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                  <Ionicons name="flame" size={22} color="#f59e0b" />
                </View>
                <Text style={[styles.kpiValue, { color: colors.text }]}>{streakDays}</Text>
                <Text style={[styles.kpiLabel, { color: colors.secondaryText }]}>Active Study Streak</Text>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={[styles.kpiIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                  <Ionicons name="school-outline" size={22} color="#10b981" />
                </View>
                <Text style={[styles.kpiValue, { color: colors.text }]}>82%</Text>
                <Text style={[styles.kpiLabel, { color: colors.secondaryText }]}>Average Quiz Score</Text>
              </View>
            </View>

            {/* Time Range Selector */}
            <View style={[styles.rangeSelector, { backgroundColor: colors.surface }]}>
              {(['week', 'month', 'year'] as const).map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setTimeRange(range)}
                  style={[
                    styles.rangeButton,
                    timeRange === range && { backgroundColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.rangeText,
                      { color: timeRange === range ? '#ffffff' : colors.secondaryText },
                    ]}
                  >
                    {range.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Study Hours Trend Chart */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Study Hours Distribution</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
                    Time invested during the selected {timeRange}
                  </Text>
                </View>
              </View>

              <View style={styles.chartWrapper}>
                <LineChart
                  data={{
                    labels:
                      timeRange === 'week'
                        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        : timeRange === 'month'
                        ? ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']
                        : ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
                    datasets: [
                      {
                        data:
                          timeRange === 'year'
                            ? [studyData.year[0], studyData.year[2], studyData.year[4], studyData.year[6], studyData.year[8], studyData.year[10]]
                            : studyData[timeRange],
                      },
                    ],
                  }}
                  width={chartWidth}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix="h"
                  chartConfig={{
                    backgroundColor: colors.cardBackground,
                    backgroundGradientFrom: colors.cardBackground,
                    backgroundGradientTo: colors.cardBackground,
                    decimalPlaces: 1,
                    color: () => colors.primary,
                    labelColor: () => colors.secondaryText,
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: colors.primary,
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: '',
                      stroke: isDark ? '#1e293b' : '#f1f5f9',
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
            </View>

            {/* Subject Distribution Bar Chart */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Subject Time Allocation</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
                    Hours dedicated to each core course
                  </Text>
                </View>
              </View>

              <View style={styles.chartWrapper}>
                <BarChart
                  data={{
                    labels: ['Math', 'Physics', 'Chem', 'Biology'],
                    datasets: [
                      {
                        data: subjects.map((s) => s.time),
                      },
                    ],
                  }}
                  width={chartWidth}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix="h"
                  chartConfig={{
                    backgroundColor: colors.cardBackground,
                    backgroundGradientFrom: colors.cardBackground,
                    backgroundGradientTo: colors.cardBackground,
                    color: () => colors.primary,
                    labelColor: () => colors.secondaryText,
                    barPercentage: 0.6,
                    propsForBackgroundLines: {
                      stroke: isDark ? '#1e293b' : '#f1f5f9',
                    },
                  }}
                  style={styles.chart}
                  fromZero
                />
              </View>
            </View>

            {/* Subject Progress Cards */}
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Subject Breakdown</Text>
              <Text style={[styles.sectionSub, { color: colors.secondaryText }]}>Tap to open syllabus & notes</Text>
            </View>

            <View style={styles.subjectsGrid}>
              {subjects.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => router.push(`/inside/progress/${item.name}` as any)}
                  style={[styles.subjectItemCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                  activeOpacity={0.8}
                >
                  <View style={styles.subjectItemHeader}>
                    <Text style={[styles.subjectItemTitle, { color: colors.text }]}>{item.name}</Text>
                    <View style={[styles.gradeBadge, { backgroundColor: item.color + '20' }]}>
                      <Text style={[styles.gradeText, { color: item.color }]}>{item.grade}</Text>
                    </View>
                  </View>

                  <Text style={[styles.subjectTimeText, { color: colors.secondaryText }]}>
                    {item.time} total study hours • {Math.round(item.progress * 100)}% complete
                  </Text>

                  <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
                    <View
                      style={[
                        styles.progressIndicator,
                        { width: `${item.progress * 100}%`, backgroundColor: item.color },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Session History List */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border, marginTop: 12 }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Completed Sessions</Text>
              {history.map((session, index) => {
                const isLast = index === history.length - 1;
                return (
                  <TouchableOpacity
                    key={session.id}
                    onPress={() => router.push(`/inside/activity/${session.routeId || session.id}` as any)}
                    style={[
                      styles.sessionRow,
                      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.sessionIconBox, { backgroundColor: colors.surface }]}>
                      <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                    </View>

                    <View style={styles.sessionInfo}>
                      <Text style={[styles.sessionActivity, { color: colors.text }]}>
                        {session.activityTitle}
                      </Text>
                      <Text style={[styles.sessionMeta, { color: colors.secondaryText }]}>
                        {session.subject} • {session.duration}
                      </Text>
                    </View>

                    <View style={styles.sessionRight}>
                      <Text style={[styles.sessionDate, { color: colors.secondaryText }]}>
                        {ValidationUtils.formatDateShort(session.date)}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.secondaryText} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  mainContainer: {
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  rangeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  chartWrapper: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 14,
    marginVertical: 4,
  },
  sectionTitleRow: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSub: {
    fontSize: 13,
    marginTop: 2,
  },
  subjectsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  subjectItemCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  subjectItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectItemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subjectTimeText: {
    fontSize: 13,
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    borderRadius: 4,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  sessionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionActivity: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 12,
  },
  sessionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionDate: {
    fontSize: 12,
  },
});
