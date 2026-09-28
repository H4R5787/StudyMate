import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { AppHeader } from './AppHeader';

export interface SubjectProgressConfig {
  subjectName: string;
  themeColor: string;
  overallProgress: number;
  studyTime: string;
  grade: string;
  weeklyProgress: { day: string; hours: number }[];
  syllabusTopics: { title: string; completed: boolean; hours: string }[];
  recommendedActivities: { id: string; title: string; duration: string; type: string }[];
}

export const SubjectProgressView: React.FC<{ config: SubjectProgressConfig }> = ({ config }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const maxHours = Math.max(...config.weeklyProgress.map((d) => d.hours), 1);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title={`${config.subjectName} Progress`}
        subtitle={`${config.studyTime} total time invested`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {/* Overview Metric Banner */}
          <View style={[styles.overviewCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.progressCircleWrapper}>
              <View
                style={[
                  styles.outerCircle,
                  { borderColor: config.themeColor + '30', backgroundColor: colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.innerRing,
                    { borderColor: config.themeColor },
                  ]}
                >
                  <Text style={[styles.percentageText, { color: colors.text }]}>
                    {config.overallProgress}%
                  </Text>
                  <Text style={[styles.masteryText, { color: config.themeColor }]}>
                    Mastery
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.overviewMeta}>
              <View style={styles.metaStat}>
                <Text style={[styles.metaLabel, { color: colors.secondaryText }]}>Current Grade</Text>
                <Text style={[styles.metaValue, { color: config.themeColor }]}>{config.grade}</Text>
              </View>

              <View style={styles.metaStat}>
                <Text style={[styles.metaLabel, { color: colors.secondaryText }]}>Total Hours</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{config.studyTime}</Text>
              </View>

              <View style={styles.metaStat}>
                <Text style={[styles.metaLabel, { color: colors.secondaryText }]}>Target Exam</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>Finals 2026</Text>
              </View>
            </View>
          </View>

          {/* Weekly Progress Bar Chart */}
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Study Hours</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
              Daily focus breakdown over the past 7 days
            </Text>

            <View style={styles.barChartContainer}>
              {config.weeklyProgress.map((item, index) => {
                const barHeight = Math.max(12, (item.hours / maxHours) * 110);
                return (
                  <View key={index} style={styles.barColumn}>
                    <Text style={[styles.barValueText, { color: colors.secondaryText }]}>
                      {item.hours > 0 ? `${item.hours}h` : '-'}
                    </Text>
                    <View style={[styles.barTrack, { backgroundColor: colors.surface }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: barHeight,
                            backgroundColor: item.hours > 0 ? config.themeColor : 'transparent',
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.dayLabel, { color: colors.text }]}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Syllabus Curriculum Checklist */}
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Curriculum & Milestones</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
              Track completed units and upcoming topics
            </Text>

            <View style={styles.syllabusList}>
              {config.syllabusTopics.map((topic, i) => (
                <View
                  key={i}
                  style={[
                    styles.syllabusRow,
                    { borderBottomColor: colors.border },
                    i === config.syllabusTopics.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Ionicons
                    name={topic.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={topic.completed ? Colors.light.success : colors.placeholder}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.topicTitle,
                        {
                          color: colors.text,
                          textDecorationLine: topic.completed ? 'line-through' : 'none',
                          opacity: topic.completed ? 0.7 : 1,
                        },
                      ]}
                    >
                      {topic.title}
                    </Text>
                    <Text style={[styles.topicSub, { color: colors.secondaryText }]}>
                      {topic.hours} estimated study
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: topic.completed
                          ? 'rgba(16, 185, 129, 0.12)'
                          : colors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color: topic.completed
                            ? Colors.light.success
                            : colors.secondaryText,
                        },
                      ]}
                    >
                      {topic.completed ? 'Done' : 'Upcoming'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Recommended Practice Activities */}
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Recommended Practice</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
              Interactive quizzes and reading material for this course
            </Text>

            <View style={styles.activityList}>
              {config.recommendedActivities.map((act) => (
                <TouchableOpacity
                  key={act.id}
                  style={[styles.activityItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push(`/inside/activity/${act.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.activityIconBox, { backgroundColor: config.themeColor + '20' }]}>
                    <Ionicons name="sparkles" size={18} color={config.themeColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.actTitle, { color: colors.text }]}>{act.title}</Text>
                    <Text style={[styles.actMeta, { color: colors.secondaryText }]}>
                      {act.type} • {act.duration}
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={24} color={config.themeColor} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  mainContainer: {
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  overviewCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  progressCircleWrapper: {
    marginRight: 20,
  },
  outerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 26,
    fontWeight: '800',
  },
  masteryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  overviewMeta: {
    flex: 1,
    gap: 10,
  },
  metaStat: {},
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 1,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 16,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValueText: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  barTrack: {
    width: 24,
    height: 110,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  syllabusList: {
    marginTop: 4,
  },
  syllabusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  topicSub: {
    fontSize: 12,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  activityIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  actMeta: {
    fontSize: 12,
  },
});
