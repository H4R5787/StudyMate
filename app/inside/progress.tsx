import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const ProgressPage = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [timeRange, setTimeRange] = useState('week');
  const progress = useSharedValue(0);

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
    chartText: isDark ? '#FFFFFF' : '#000000',
  };

  const studyData = {
    week: [2, 4.5, 3, 6, 4.2, 5, 6.5],
    month: [3, 4, 5, 4.5, 6, 5.5, 4, 3.5, 6, 5, 4.8, 5.2],
    year: [4, 5, 4.5, 6, 5.5, 7, 6.5, 7.2, 6.8, 7.5, 8, 7]
  };

  const subjects = [
    { name: 'Mathematics', time: 45, progress: 0.75, color: '#FF6B6B' },
    { name: 'Physics', time: 32, progress: 0.6, color: '#4ECDC4' },
    { name: 'Chemistry', time: 28, progress: 0.45, color: '#45B7D1' },
    { name: 'Biology', time: 18, progress: 0.3, color: '#96CEB4' },
  ];

  const sessionHistory = [
    { id: '1', subject: 'Mathematics', duration: '45 mins', date: '2023-08-20' },
    { id: '2', subject: 'Physics', duration: '1h 30m', date: '2023-08-19' },
    { id: '3', subject: 'Chemistry', duration: '30 mins', date: '2023-08-18' },
  ];

  useEffect(() => {
    progress.value = withSpring(1, { damping: 10 });
  }, []);

  const renderSubject = ({ item }) => (
    <View style={[styles.subjectCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.subjectHeader}>
        <Text style={[styles.subjectTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.subjectTime, { color: colors.primary }]}>{item.time}h</Text>
      </View>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { 
              width: `${item.progress * 100}%`,
              backgroundColor: item.color
            }
          ]}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Study Analytics</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
          {['week', 'month', 'year'].map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              style={[styles.rangeButton, timeRange === range && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.rangeText, timeRange === range && { color: '#FFFFFF' }]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Study Hours Line Chart */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Study Hours</Text>
          <LineChart
            data={{
              labels: timeRange === 'week' 
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : timeRange === 'month' 
                ? Array.from({length: 12}, (_, i) => `W${i+1}`)
                : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{ data: studyData[timeRange] }]
            }}
            width={Dimensions.get('window').width - 64}
            height={220}
            chartConfig={{
              backgroundColor: colors.cardBackground,
              backgroundGradientFrom: colors.cardBackground,
              backgroundGradientTo: colors.cardBackground,
              decimalPlaces: 1,
              color: () => colors.primary,
              labelColor: () => colors.chartText,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: colors.primary
              }
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        {/* Subject Distribution Bar Chart */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Subject Distribution</Text>
          <BarChart
            data={{
              labels: subjects.map(s => s.name),
              datasets: [{
                data: subjects.map(s => s.time)
              }]
            }}
            width={Dimensions.get('window').width - 64}
            height={220}
            yAxisSuffix="h"
            chartConfig={{
              backgroundColor: colors.cardBackground,
              backgroundGradientFrom: colors.cardBackground,
              backgroundGradientTo: colors.cardBackground,
              color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`,
              labelColor: () => colors.chartText,
              barPercentage: 0.5,
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
            fromZero
          />
        </View>

        {/* Subject Progress */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Subject Progress</Text>
          <FlatList
            data={subjects}
            renderItem={renderSubject}
            keyExtractor={item => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectList}
          />
        </View>

        {/* Recent Sessions */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Sessions</Text>
          {sessionHistory.map(session => (
            <TouchableOpacity 
              key={session.id} 
              style={[styles.sessionItem, { borderBottomColor: colors.border }]}
              onPress={() => router.push(`/session/${session.id}`)}
            >
              <View style={styles.sessionInfo}>
                <Text style={[styles.sessionSubject, { color: colors.text }]}>
                  {session.subject}
                </Text>
                <Text style={{ color: colors.secondaryText }}>{session.duration}</Text>
              </View>
              <Text style={{ color: colors.secondaryText }}>
                {new Date(session.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700'
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  rangeText: {
    fontSize: 14,
    fontWeight: '500'
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16
  },
  subjectCard: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  subjectTime: {
    fontSize: 14,
    fontWeight: '700'
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 4
  },
  subjectList: {
    paddingBottom: 8
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  }
});

export default ProgressPage;
