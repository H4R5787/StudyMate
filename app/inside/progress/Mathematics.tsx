import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated from 'react-native-reanimated';

const MathematicsProgress = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  const subject = params.subject || 'Mathematics';

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  // Sample data - replace with real data
  const progressData = {
    overallProgress: 75,
    studyTime: '15h 30m',
    weeklyProgress: [
      { day: 'Mon', value: 60 },
      { day: 'Tue', value: 45 },
      { day: 'Wed', value: 80 },
      { day: 'Thu', value: 65 },
      { day: 'Fri', value: 90 },
      { day: 'Sat', value: 50 },
      { day: 'Sun', value: 70 },
    ],
    recentActivities: [
      { id: '1', title: 'Algebra Basics', duration: '45 mins', date: '2023-08-20' },
      { id: '2', title: 'Geometry Quiz', duration: '30 mins', date: '2023-08-19' },
      { id: '3', title: 'Calculus Test', duration: '1h 15m', date: '2023-08-18' },
    ]
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{subject} Progress</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Overall Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overall Progress</Text>
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.circularProgress, {
              borderColor: colors.primary,
              transform: [{ rotate: `${progressData.overallProgress * 3.6}deg` }]
            }]}>
              <Text style={[styles.progressPercentage, { color: colors.text }]}>
                {progressData.overallProgress}%
              </Text>
            </Animated.View>
            <Text style={[styles.studyTime, { color: colors.secondaryText }]}>
              Total Study Time: {progressData.studyTime}
            </Text>
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
          <View style={styles.chartContainer}>
            {progressData.weeklyProgress.map((day, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.progressBar, { 
                  height: day.value * 2,
                  backgroundColor: colors.primary,
                  opacity: day.value / 100
                }]} />
                <Text style={[styles.chartLabel, { color: colors.secondaryText }]}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={[styles.activitiesCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
          {progressData.recentActivities.map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              onPress={() => router.push(`/inside/activity/${activity.id}`)}
            >
              <View style={styles.activityItem}>
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                  <Text style={{ color: colors.secondaryText }}>{activity.duration}</Text>
                </View>
                <Text style={{ color: colors.secondaryText }}>
                  {new Date(activity.date).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    padding: 16,
    paddingBottom: 80
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700'
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 16
  },
  circularProgress: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderLeftColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: '700'
  },
  studyTime: {
    marginTop: 16,
    fontSize: 16
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    marginVertical: 16
  },
  barContainer: {
    alignItems: 'center',
    flex: 1
  },
  progressBar: {
    width: 20,
    borderRadius: 8,
    marginHorizontal: 4
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12
  },
  activitiesCard: {
    borderRadius: 16,
    padding: 20
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0'
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  activityText: {
    flex: 1,
    marginRight: 16
  }
};

export default MathematicsProgress;