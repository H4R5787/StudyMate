import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { StorageService } from '../../services/storage';
import { ValidationUtils } from '../../utils/validation';

interface ActivityItem {
  id: string;
  routeId: string;
  title: string;
  duration: string;
  type: string;
  score?: string;
  status: 'completed' | 'in_progress';
}

interface ActivitySection {
  date: string;
  data: ActivityItem[];
}

const DEFAULT_ACTIVITIES: ActivitySection[] = [
  {
    date: 'Today',
    data: [
      { id: '1', routeId: '1', title: 'Mathematics Mastery Quiz', duration: '15 mins', type: 'Mathematics', score: '5/5', status: 'completed' },
      { id: '2', routeId: '2', title: 'Physics Mechanics: Chapter 2', duration: '35 mins', type: 'Physics', score: '100%', status: 'completed' },
    ],
  },
  {
    date: 'Yesterday',
    data: [
      { id: '3', routeId: '3', title: 'Chemistry Stoichiometry Drill', duration: '20 mins', type: 'Chemistry', score: '4/5', status: 'completed' },
      { id: '4', routeId: '4', title: 'Cell Biology & Mitosis Test', duration: '25 mins', type: 'Biology', score: '5/5', status: 'completed' },
    ],
  },
  {
    date: '3 Days Ago',
    data: [
      { id: '5', routeId: '1', title: 'Calculus Derivatives & Integrals', duration: '30 mins', type: 'Mathematics', score: '4/5', status: 'completed' },
      { id: '6', routeId: '3', title: 'Organic Chemistry & Bonding', duration: '25 mins', type: 'Chemistry', score: '3/5', status: 'completed' },
    ],
  },
];

export default function RecentActivities() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [sections, setSections] = useState<ActivitySection[]>(DEFAULT_ACTIVITIES);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    StorageService.getActivities().then((stored) => {
      if (stored && stored.length > 0) {
        const storedItems: ActivityItem[] = stored.map((s) => ({
          id: s.id,
          routeId: s.routeId,
          title: s.title,
          duration: s.duration,
          type: s.subject,
          score: s.score,
          status: 'completed',
        }));

        setSections([
          {
            date: 'Recently Completed',
            data: storedItems,
          },
          ...DEFAULT_ACTIVITIES,
        ]);
      }
    });
  }, []);

  const filters = [
    { id: 'all', label: 'All Courses' },
    { id: 'Mathematics', label: 'Math' },
    { id: 'Physics', label: 'Physics' },
    { id: 'Chemistry', label: 'Chemistry' },
    { id: 'Biology', label: 'Biology' },
  ];

  const getSubjectColor = (type: string) => {
    switch (type) {
      case 'Mathematics':
        return '#4361ee';
      case 'Physics':
        return '#06d6a0';
      case 'Chemistry':
        return '#f72585';
      case 'Biology':
        return '#ffb703';
      default:
        return colors.primary;
    }
  };

  const filteredSections = sections.map((section) => ({
    ...section,
    data: section.data.filter(
      (item) => selectedFilter === 'all' || item.type === selectedFilter
    ),
  })).filter((section) => section.data.length > 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Study History"
        subtitle="Review completed quizzes and reading sessions"
      />

      {/* Filter Horizontal Scroll */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => {
            const isSelected = filter.id === selectedFilter;
            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? '#ffffff' : colors.text },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Activities Section List */}
      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { date } }) => (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionDateText, { color: colors.secondaryText }]}>
              {ValidationUtils.formatDateHeader(date)}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const subjectColor = getSubjectColor(item.type);
          return (
            <TouchableOpacity
              onPress={() => router.push(`/inside/activity/${item.routeId}` as any)}
              style={[
                styles.activityCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
              activeOpacity={0.8}
            >
              <View style={[styles.typeIconBox, { backgroundColor: subjectColor + '18' }]}>
                <Ionicons name="school-outline" size={20} color={subjectColor} />
              </View>

              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaSubject, { color: subjectColor }]}>{item.type}</Text>
                  <Text style={[styles.metaDot, { color: colors.secondaryText }]}>•</Text>
                  <Text style={[styles.metaDuration, { color: colors.secondaryText }]}>{item.duration}</Text>
                </View>
              </View>

              <View style={styles.scoreBox}>
                {item.score && (
                  <View style={[styles.scoreBadge, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.scoreText, { color: colors.text }]}>{item.score}</Text>
                  </View>
                )}
                <Ionicons name="arrow-forward" size={16} color={colors.secondaryText} />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBox, { backgroundColor: colors.surface }]}>
              <Ionicons name="file-tray-outline" size={36} color={colors.secondaryText} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Activities Found</Text>
            <Text style={[styles.emptySub, { color: colors.secondaryText }]}>
              There are no recorded sessions for this filter category yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  filterWrapper: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingVertical: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  sectionDateText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  typeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaSubject: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaDot: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  metaDuration: {
    fontSize: 12,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
  },
});