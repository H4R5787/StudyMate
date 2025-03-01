// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Ionicons } from "@expo/vector-icons";
// import { useColorScheme } from 'react-native';
// import { router } from 'expo-router';
// import { LineChart, BarChart } from 'react-native-chart-kit';
// import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

// const ProgressPage = () => {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';
//   const [timeRange, setTimeRange] = useState('week');
//   const [loading, setLoading] = useState(false);
//   const progress = useSharedValue(0);

//   const colors = {
//     primary: '#4361ee',
//     background: isDark ? '#121212' : '#f8f9fa',
//     cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
//     text: isDark ? '#FFFFFF' : '#2B2D42',
//     secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
//     border: isDark ? '#333333' : '#E0E0E0',
//     chartText: isDark ? '#FFFFFF' : '#000000',
//   };

//   // Mock data - replace with real data
//   const studyData = {
//     week: [2, 4.5, 3, 6, 4.2, 5, 6.5],
//     month: [3, 4, 5, 4.5, 6, 5.5, 4, 3.5, 6, 5, 4.8, 5.2],
//     year: [4, 5, 4.5, 6, 5.5, 7, 6.5, 7.2, 6.8, 7.5, 8, 7]
//   };

//   const subjects = [
//     { name: 'Mathematics', time: 45, progress: 75, color: '#FF6B6B' },
//     { name: 'Physics', time: 32, progress: 60, color: '#4ECDC4' },
//     { name: 'Chemistry', time: 28, progress: 45, color: '#45B7D1' },
//     { name: 'Biology', time: 18, progress: 30, color: '#96CEB4' },
//   ];

//   const weeklyActivity = [
//     { day: 'Mon', hours: 4.2 },
//     { day: 'Tue', hours: 6.0 },
//     { day: 'Wed', hours: 3.8 },
//     { day: 'Thu', hours: 5.5 },
//     { day: 'Fri', hours: 4.5 },
//     { day: 'Sat', hours: 2.8 },
//     { day: 'Sun', hours: 1.5 },
//   ];

//   useEffect(() => {
//     progress.value = withSpring(1, { damping: 10 });
//     return () => { progress.value = 0 };
//   }, []);

//   const renderSubject = (subject) => (
//     <View style={[styles.subjectCard, { backgroundColor: colors.cardBackground }]}>
//       <View style={styles.subjectHeader}>
//         <Text style={[styles.subjectTitle, { color: colors.text }]}>{subject.name}</Text>
//         <Text style={[styles.timeText, { color: colors.secondaryText }]}>{subject.time}h</Text>
//       </View>
//       <View style={styles.progressContainer}>
//         <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
//           <Animated.View style={[styles.progressFill, { 
//             width: `${subject.progress}%`,
//             backgroundColor: subject.color
//           }]}/>
//         </View>
//         <Text style={[styles.percentage, { color: colors.secondaryText }]}>
//           {subject.progress}%
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={[styles.title, { color: colors.text }]}>Study Analytics</Text>
//           <TouchableOpacity onPress={() => router.push('/settings')}>
//             <Ionicons name="settings" size={24} color={colors.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* Time Range Selector */}
//         <View style={styles.rangeSelector}>
//           {['week', 'month', 'year'].map((range) => (
//             <TouchableOpacity
//               key={range}
//               onPress={() => setTimeRange(range)}
//               style={[
//                 styles.rangeButton,
//                 timeRange === range && { backgroundColor: colors.primary }
//               ]}
//             >
//               <Text style={[
//                 styles.rangeText,
//                 timeRange === range && { color: '#FFFFFF' },
//                 { color: colors.text }
//               ]}>
//                 {range.charAt(0).toUpperCase() + range.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Study Time Chart */}
//         <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
//           <Text style={[styles.cardTitle, { color: colors.text }]}>Study Hours</Text>
//           <LineChart
//             data={{
//               labels: timeRange === 'week' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] :
//                       timeRange === 'month' ? Array.from({length: 12}, (_, i) => (i + 1).toString()) :
//                       ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//               datasets: [{ data: studyData[timeRange] }]
//             }}
//             width={Dimensions.get('window').width - 64}
//             height={220}
//             chartConfig={{
//               backgroundColor: colors.cardBackground,
//               backgroundGradientFrom: colors.cardBackground,
//               backgroundGradientTo: colors.cardBackground,
//               decimalPlaces: 1,
//               color: (opacity = 1) => colors.primary,
//               labelColor: (opacity = 1) => colors.chartText,
//               style: { borderRadius: 16 }
//             }}
//             bezier
//             style={{ marginVertical: 8, borderRadius: 16 }}
//           />
//         </View>

//         {/* Subject Progress */}
//         <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
//           <Text style={[styles.cardTitle, { color: colors.text }]}>Subject Breakdown</Text>
//           <View style={styles.subjectsContainer}>
//             {subjects.map((subject) => renderSubject(subject))}
//           </View>
//         </View>

//         {/* Weekly Activity */}
//         <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
//           <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Activity</Text>
//           <View style={styles.barChartContainer}>
//             <BarChart
//               data={{
//                 labels: weeklyActivity.map(a => a.day),
//                 datasets: [{ data: weeklyActivity.map(a => a.hours) }]
//               }}
//               width={Dimensions.get('window').width - 64}
//               height={200}
//               chartConfig={{
//                 backgroundColor: colors.cardBackground,
//                 backgroundGradientFrom: colors.cardBackground,
//                 backgroundGradientTo: colors.cardBackground,
//                 decimalPlaces: 1,
//                 color: (opacity = 1) => colors.primary,
//                 labelColor: (opacity = 1) => colors.chartText
//               }}
//               style={{ marginVertical: 8, borderRadius: 16 }}
//             />
//           </View>
//         </View>

//         {/* Stats Summary */}
//         <View style={styles.statsRow}>
//           <StatCard
//             icon="time"
//             title="Total Hours"
//             value="142"
//             color="#4ECDC4"
//             colors={colors}
//           />
//           <StatCard
//             icon="book"
//             title="Sessions"
//             value="89"
//             color="#FF6B6B"
//             colors={colors}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const StatCard = ({ icon, title, value, color, colors }) => (
//   <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
//     <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
//       <Ionicons name={icon} size={24} color={color} />
//     </View>
//     <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
//     <Text style={[styles.statTitle, { color: colors.secondaryText }]}>{title}</Text>
//   </View>
// );

// const styles = {
//   container: {
//     flex: 1,
//     padding: 24,
//     maxWidth: 800,
//     alignSelf: 'center',
//     width: '100%'
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700'
//   },
//   rangeSelector: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//     marginBottom: 24
//   },
//   rangeButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8
//   },
//   rangeText: {
//     fontSize: 14,
//     fontWeight: '500'
//   },
//   card: {
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 24,
//     borderWidth: 1
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 16
//   },
//   subjectsContainer: {
//     gap: 16
//   },
//   subjectCard: {
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1
//   },
//   subjectHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8
//   },
//   subjectTitle: {
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   timeText: {
//     fontSize: 14
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8
//   },
//   progressBar: {
//     flex: 1,
//     height: 8,
//     borderRadius: 4,
//     overflow: 'hidden'
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 4
//   },
//   percentage: {
//     fontSize: 14
//   },
//   statsRow: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 24
//   },
//   statCard: {
//     flex: 1,
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1
//   },
//   statIcon: {
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 4
//   },
//   statTitle: {
//     fontSize: 14
//   }
// };

// export default ProgressPage;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { LineChart, BarChart } from 'react-native-chart-kit';
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
    { name: 'Mathematics', time: 45, progress: 75, color: '#FF6B6B' },
    { name: 'Physics', time: 32, progress: 60, color: '#4ECDC4' },
    { name: 'Chemistry', time: 28, progress: 45, color: '#45B7D1' },
    { name: 'Biology', time: 18, progress: 30, color: '#96CEB4' },
  ];

  useEffect(() => {
    progress.value = withSpring(1, { damping: 10 });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Study Analytics</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

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

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Study Hours</Text>
          <LineChart
            data={{
              labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
              datasets: [{ data: studyData[timeRange] }]
            }}
            width={Dimensions.get('window').width - 64}
            height={220}
            chartConfig={{
              backgroundColor: colors.cardBackground,
              color: () => colors.primary,
              labelColor: () => colors.chartText,
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
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
  }
});

export default ProgressPage;
