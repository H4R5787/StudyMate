import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { BottomNav } from '../../components/BottomNav';

interface SubjectItem {
  id: string;
  name: string;
  progress: number;
  color: string;
  image: any;
  sessions: number;
  totalHours: string;
}

const SUBJECTS: SubjectItem[] = [
  {
    id: 'Mathematics',
    name: 'Mathematics',
    progress: 75,
    color: '#4361ee',
    image: require('../../assets/images/math1.jpg'),
    sessions: 14,
    totalHours: '18.5h',
  },
  {
    id: 'Physics',
    name: 'Physics',
    progress: 60,
    color: '#06d6a0',
    image: require('../../assets/images/physics.jpg'),
    sessions: 10,
    totalHours: '12.0h',
  },
  {
    id: 'Chemistry',
    name: 'Chemistry',
    progress: 45,
    color: '#f72585',
    image: require('../../assets/images/maxresdefault.jpg'),
    sessions: 8,
    totalHours: '9.2h',
  },
  {
    id: 'Biology',
    name: 'Biology',
    progress: 30,
    color: '#ffb703',
    image: require('../../assets/images/biology.jpg'),
    sessions: 5,
    totalHours: '6.0h',
  },
];

interface RecentActivity {
  id: string;
  title: string;
  subject: string;
  duration: string;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
  score?: string;
}

const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    title: 'Algebra & Equations Quiz',
    subject: 'Mathematics',
    duration: '15 mins',
    date: 'Today',
    icon: 'calculator-outline',
    score: '5/5',
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    duration: '35 mins',
    date: 'Yesterday',
    icon: 'planet-outline',
    score: 'Completed',
  },
  {
    id: '3',
    title: 'Periodic Table & Molarity Test',
    subject: 'Chemistry',
    duration: '20 mins',
    date: '2 days ago',
    icon: 'flask-outline',
    score: '4/5',
  },
  {
    id: '4',
    title: 'Cell Biology & Mitosis Test',
    subject: 'Biology',
    duration: '25 mins',
    date: '3 days ago',
    icon: 'leaf-outline',
    score: '5/5',
  },
];

const SubjectCard: React.FC<{ item: SubjectItem; colors: typeof Colors.light; onPress: () => void }> = ({
  item,
  colors,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.subjectCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.subjectImageContainer}>
        <Image source={item.image} style={styles.subjectImage} resizeMode="cover" />
        <View style={styles.imageOverlay} />
        <View style={[styles.subjectTag, { backgroundColor: item.color }]}>
          <Text style={styles.subjectTagText}>{item.name}</Text>
        </View>
      </View>

      <View style={styles.subjectBody}>
        <View style={styles.subjectMetaRow}>
          <Text style={[styles.subjectHours, { color: colors.secondaryText }]}>
            <Ionicons name="time-outline" size={13} color={colors.secondaryText} /> {item.totalHours}
          </Text>
          <Text style={[styles.subjectProgressText, { color: colors.text }]}>{item.progress}%</Text>
        </View>

        <View style={[styles.progressBarTrack, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.progressBarIndicator,
              { width: `${item.progress}%`, backgroundColor: item.color },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomePage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  // Study Timer State
  const [studySeconds, setStudySeconds] = useState(1500); // 25 mins initial
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setStudySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  const animatedTimerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isTimerRunning ? 1.03 : 1, { damping: 12 }) }],
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setStudySeconds(timerMode === 'study' ? 1500 : 300);
  };

  const switchTimerMode = (mode: 'study' | 'break') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setStudySeconds(mode === 'study' ? 1500 : 300);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContainer}>
            {/* Top Greeting Header */}
            <View style={styles.greetingHeader}>
              <View>
                <View style={styles.greetingBadge}>
                  <Text style={[styles.greetingBadgeText, { color: colors.primary }]}>
                    STUDYMATE DASHBOARD
                  </Text>
                </View>
                <Text style={[styles.greetingTitle, { color: colors.text }]}>
                  Welcome, Scholar! 👋
                </Text>
                <Text style={[styles.greetingDate, { color: colors.secondaryText }]}>
                  {new Date().toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/inside/profile')}
                style={[styles.profileAvatarButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel="View Profile"
              >
                <Ionicons name="person" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={[styles.quickActionCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                onPress={() => router.push('/inside/create-session')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(67, 97, 238, 0.12)' }]}>
                  <Ionicons name="add-circle" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.actionTitle, { color: colors.text }]}>New Session</Text>
                <Text style={[styles.actionSub, { color: colors.secondaryText }]}>Create study plan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickActionCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                onPress={() => router.push('/inside/ai-pages')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(247, 37, 133, 0.12)' }]}>
                  <Ionicons name="sparkles" size={24} color="#f72585" />
                </View>
                <Text style={[styles.actionTitle, { color: colors.text }]}>AI Tutor</Text>
                <Text style={[styles.actionSub, { color: colors.secondaryText }]}>Ask any question</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickActionCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                onPress={() => router.push('/inside/progress')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(6, 214, 160, 0.12)' }]}>
                  <Ionicons name="stats-chart" size={24} color="#06d6a0" />
                </View>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Analytics</Text>
                <Text style={[styles.actionSub, { color: colors.secondaryText }]}>Weekly progress</Text>
              </TouchableOpacity>
            </View>

            {/* Active Study Timer Card */}
            <Animated.View
              style={[
                styles.timerCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                animatedTimerStyle,
              ]}
            >
              <View style={styles.timerHeader}>
                <View style={styles.timerTitleRow}>
                  <Ionicons name="timer-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.timerTitle, { color: colors.text }]}>Focus Timer</Text>
                </View>
                <View style={styles.timerModes}>
                  <TouchableOpacity
                    onPress={() => switchTimerMode('study')}
                    style={[
                      styles.modePill,
                      timerMode === 'study' && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modePillText,
                        { color: timerMode === 'study' ? '#ffffff' : colors.secondaryText },
                      ]}
                    >
                      Study 25m
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => switchTimerMode('break')}
                    style={[
                      styles.modePill,
                      timerMode === 'break' && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modePillText,
                        { color: timerMode === 'break' ? '#ffffff' : colors.secondaryText },
                      ]}
                    >
                      Break 5m
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.timerCenter}>
                <Text style={[styles.timerDigits, { color: colors.text }]}>
                  {formatTimer(studySeconds)}
                </Text>
                <Text style={[styles.timerStatusText, { color: isTimerRunning ? colors.primary : colors.secondaryText }]}>
                  {isTimerRunning ? 'Session in progress • Stay focused' : 'Paused • Ready when you are'}
                </Text>

                <View style={styles.timerControls}>
                  <TouchableOpacity
                    onPress={() => setIsTimerRunning(!isTimerRunning)}
                    style={[
                      styles.timerMainButton,
                      { backgroundColor: isTimerRunning ? '#ef4444' : colors.primary },
                    ]}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={isTimerRunning ? 'pause' : 'play'}
                      size={24}
                      color="#ffffff"
                    />
                    <Text style={styles.timerMainButtonText}>
                      {isTimerRunning ? 'Pause' : 'Start Focus'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={resetTimer}
                    style={[styles.timerResetButton, { backgroundColor: colors.surface }]}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Subject Mastery Carousel */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Course Progress</Text>
                <Text style={[styles.sectionSubheading, { color: colors.secondaryText }]}>
                  Tap any subject to view detailed performance
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/inside/progress')}
                style={styles.seeAllButton}
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={SUBJECTS}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subjectsScroll}
              renderItem={({ item }) => (
                <SubjectCard
                  item={item}
                  colors={colors}
                  onPress={() => router.push(`/inside/progress/${item.name}` as any)}
                />
              )}
            />

            {/* Recent Activities Section */}
            <View style={[styles.sectionHeaderRow, { marginTop: 28 }]}>
              <View>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Recent Activities</Text>
                <Text style={[styles.sectionSubheading, { color: colors.secondaryText }]}>
                  Resume recent quizzes and practice modules
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/inside/recent-activities')}
                style={styles.seeAllButton}
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>All Activities</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.activitiesCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              {RECENT_ACTIVITIES.map((activity, index) => {
                const isLast = index === RECENT_ACTIVITIES.length - 1;
                return (
                  <TouchableOpacity
                    key={activity.id}
                    onPress={() => router.push(`/inside/activity/${activity.id}` as any)}
                    style={[
                      styles.activityRow,
                      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.activityIconCircle, { backgroundColor: colors.surface }]}>
                      <Ionicons name={activity.icon} size={20} color={colors.primary} />
                    </View>

                    <View style={styles.activityInfo}>
                      <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>
                        {activity.title}
                      </Text>
                      <Text style={[styles.activityMeta, { color: colors.secondaryText }]}>
                        {activity.subject} • {activity.duration} • {activity.date}
                      </Text>
                    </View>

                    <View style={styles.activityRight}>
                      {activity.score && (
                        <View style={[styles.scoreBadge, { backgroundColor: colors.primaryLight }]}>
                          <Text style={[styles.scoreBadgeText, { color: colors.primary }]}>
                            {activity.score}
                          </Text>
                        </View>
                      )}
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
    paddingBottom: 110,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingHorizontal: 20,
  },
  mainContainer: {
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    marginBottom: 6,
  },
  greetingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  greetingDate: {
    fontSize: 14,
    marginTop: 2,
  },
  profileAvatarButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  actionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 11,
  },
  timerCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 28,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  timerModes: {
    flexDirection: 'row',
    gap: 6,
  },
  modePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timerCenter: {
    alignItems: 'center',
  },
  timerDigits: {
    fontSize: 54,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  timerStatusText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 18,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerMainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  timerMainButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  timerResetButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: '700',
  },
  sectionSubheading: {
    fontSize: 13,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  subjectsScroll: {
    paddingRight: 16,
    gap: 14,
    paddingBottom: 4,
  },
  subjectCard: {
    width: 210,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  subjectImageContainer: {
    height: 110,
    width: '100%',
    position: 'relative',
  },
  subjectImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  subjectTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  subjectBody: {
    padding: 14,
  },
  subjectMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectHours: {
    fontSize: 12,
    fontWeight: '500',
  },
  subjectProgressText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarIndicator: {
    height: '100%',
    borderRadius: 3,
  },
  activitiesCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityMeta: {
    fontSize: 12,
  },
  activityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
