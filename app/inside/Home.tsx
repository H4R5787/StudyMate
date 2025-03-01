// import { View, Text, Button } from 'react-native';
// import { auth } from '../../config/firebaseconfig';
// import { signOut } from 'firebase/auth';
// import { router } from 'expo-router';

// const Home = () => {
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.replace('/Auth/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome {auth.currentUser?.email}</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default Home;

// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
// import { Ionicons } from "@expo/vector-icons";
// import { useColorScheme } from 'react-native';
// import { router } from 'expo-router';
// import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

// const HomePage = () => {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';
//   const [studyTime, setStudyTime] = useState(0);
//   const [isStudying, setIsStudying] = useState(false);
//   const progress = useSharedValue(0);

//   const colors = {
//     primary: '#4361ee',
//     background: isDark ? '#121212' : '#f8f9fa',
//     cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
//     text: isDark ? '#FFFFFF' : '#2B2D42',
//     secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
//     border: isDark ? '#333333' : '#E0E0E0',
//   };

//   // Dummy data - replace with real data
//   const recentActivities = [
//     { id: '1', title: 'Mathematics Quiz', duration: '45 mins', date: '2023-08-20' },
//     { id: '2', title: 'Physics Chapter 2', duration: '1h 30m', date: '2023-08-19' },
//     { id: '3', title: 'Chemistry Test', duration: '30 mins', date: '2023-08-18' },
//   ];

//   const subjects = [
//     { name: 'Mathematics', progress: 75, color: '#FF6B6B' },
//     { name: 'Physics', progress: 60, color: '#4ECDC4' },
//     { name: 'Chemistry', progress: 45, color: '#45B7D1' },
//     { name: 'Biology', progress: 30, color: '#96CEB4' },
//   ];

//   useEffect(() => {
//     let interval;
//     if (isStudying) {
//       interval = setInterval(() => {
//         setStudyTime(prev => prev + 1);
//         progress.value = withSpring((studyTime % 60) / 60, { damping: 10 });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isStudying, studyTime]);

//   const toggleStudyTimer = () => setIsStudying(!isStudying);

//   const renderSubject = ({ item }) => (
//     <View style={[styles.subjectCard, { backgroundColor: colors.cardBackground }]}>
//       <View style={styles.subjectHeader}>
//         <Text style={[styles.subjectTitle, { color: colors.text }]}>{item.name}</Text>
//         <Text style={[styles.progressText, { color: colors.secondaryText }]}>{item.progress}%</Text>
//       </View>
//       <View style={styles.progressBar}>
//         <View style={[styles.progressFill, { 
//           width: `${item.progress}%`,
//           backgroundColor: item.color
//         }]}/>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View>
//             <Text style={[styles.greeting, { color: colors.text }]}>Good Morning, User!</Text>
//             <Text style={[styles.dateText, { color: colors.secondaryText }]}>
//               {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//             </Text>
//           </View>
//           <TouchableOpacity onPress={() => router.push('inside/profile')}>
//             <Ionicons name="person-circle" size={32} color={colors.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <TouchableOpacity 
//             style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}
//             onPress={() => router.push('inside/create-session')}
//           >
//             <Ionicons name="add-circle" size={32} color={colors.primary} />
//             <Text style={[styles.actionText, { color: colors.text }]}>New Session</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}
//             onPress={() => router.push('/inside/progress')}
//           >
//             <Ionicons name="stats-chart" size={32} color={colors.primary} />
//             <Text style={[styles.actionText, { color: colors.text }]}>Progress</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Study Timer */}
//         <View style={[styles.timerCard, { backgroundColor: colors.cardBackground }]}>
//           <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Timer</Text>
//           <TouchableOpacity onPress={toggleStudyTimer}>
//             <Animated.View style={[styles.timerCircle, {
//               borderColor: isStudying ? colors.primary : colors.border,
//               transform: [{ scale: progress.value + 0.8 }]
//             }]}>
//               <Text style={[styles.timerText, { color: colors.text }]}>
//                 {Math.floor(studyTime / 60)}:{String(studyTime % 60).padStart(2, '0')}
//               </Text>
//               <Ionicons 
//                 name={isStudying ? 'stop-circle' : 'play-circle'} 
//                 size={40} 
//                 color={colors.primary} 
//               />
//             </Animated.View>
//           </TouchableOpacity>
//         </View>

//         {/* Progress Overview */}
//         <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
//         <FlatList
//           horizontal
//           data={subjects}
//           renderItem={renderSubject}
//           keyExtractor={item => item.name}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.subjectsList}
//         />

//         {/* Recent Activities */}
//         <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
//         <View style={[styles.activitiesCard, { backgroundColor: colors.cardBackground }]}>
//           {recentActivities.map(activity => (
//             <View key={activity.id} style={styles.activityItem}>
//               <View style={styles.activityText}>
//                 <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
//                 <Text style={{ color: colors.secondaryText }}>{activity.duration}</Text>
//               </View>
//               <Text style={{ color: colors.secondaryText }}>
//                 {new Date(activity.date).toLocaleDateString()}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

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
//     marginBottom: 32
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: '700'
//   },
//   dateText: {
//     fontSize: 16,
//     marginTop: 4
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 16,
//     marginBottom: 24
//   },
//   actionCard: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 1
//   },
//   actionText: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: '600'
//   },
//   timerCard: {
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     marginBottom: 24,
//     borderWidth: 1
//   },
//   timerCircle: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     borderWidth: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 16
//   },
//   timerText: {
//     fontSize: 32,
//     fontWeight: '700',
//     marginBottom: 8
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginVertical: 16
//   },
//   subjectsList: {
//     paddingBottom: 16
//   },
//   subjectCard: {
//     width: 280,
//     padding: 16,
//     borderRadius: 12,
//     marginRight: 16,
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
//   progressText: {
//     fontSize: 14
//   },
//   progressBar: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#E0E0E0',
//     overflow: 'hidden'
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 4
//   },
//   activitiesCard: {
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1
//   },
//   activityItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderColor: '#E0E0E0'
//   },
//   activityTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 4
//   }
// };

// export default HomePage;

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router, useRouter } from 'expo-router';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const HomePage = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [studyTime, setStudyTime] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const progress = useSharedValue(0);
  const currentRouter = useRouter();

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  // Dummy data - replace with real data
  const recentActivities = [
    { id: '1', title: 'Mathematics Quiz', duration: '45 mins', date: '2023-08-20' },
    { id: '2', title: 'Physics Chapter 2', duration: '1h 30m', date: '2023-08-19' },
    { id: '3', title: 'Chemistry Test', duration: '30 mins', date: '2023-08-18' },
  ];

  const subjects = [
    { name: 'Mathematics', progress: 75, color: '#FF6B6B' },
    { name: 'Physics', progress: 60, color: '#4ECDC4' },
    { name: 'Chemistry', progress: 45, color: '#45B7D1' },
    { name: 'Biology', progress: 30, color: '#96CEB4' },
  ];

  useEffect(() => {
    let interval;
    if (isStudying) {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
        progress.value = withSpring((studyTime % 60) / 60, { damping: 10 });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, studyTime]);

  const toggleStudyTimer = () => setIsStudying(!isStudying);

  const renderSubject = ({ item }) => (
    <View style={[styles.subjectCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.subjectHeader}>
        <Text style={[styles.subjectTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.progressText, { color: colors.secondaryText }]}>{item.progress}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { 
          width: `${item.progress}%`,
          backgroundColor: item.color
        }]}/>
      </View>
    </View>
  );

  const TabBar = () => {
    const tabs = [
      { name: 'Home', icon: 'home', route: '/inside/Home' },
      { name: 'Progress', icon: 'stats-chart', route: '/inside/progress' },
      { name: 'AI', icon: 'sparkles', route: '/inside/ai-pages' },
      { name: 'Create', icon: 'add-circle', route: '/inside/create-session' },
      { name: 'Profile', icon: 'person', route: '/inside/profile' },
    ];

    return (
      <View style={[styles.tabBar, { 
        backgroundColor: colors.cardBackground,
        borderTopColor: colors.border
      }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => currentRouter.push(tab.route)}
            style={tab.name === 'AI' ? styles.aiTabItem : styles.tabItem}
          >
            <Ionicons
              name={tab.icon}
              size={tab.name === 'AI' ? 28 : 24}
              color={currentRouter.pathname === tab.route ? colors.primary : colors.secondaryText}
            />
            {tab.name !== 'AI' && (
              <Text style={[styles.tabText, { 
                color: currentRouter.pathname === tab.route ? colors.primary : colors.secondaryText
              }]}>
                {tab.name}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>Good Morning, User!</Text>
              <Text style={[styles.dateText, { color: colors.secondaryText }]}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/inside/profile')}>
              <Ionicons name="person-circle" size={32} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push('/inside/create-session')}
            >
              <Ionicons name="add-circle" size={32} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>New Session</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push('/inside/progress')}
            >
              <Ionicons name="stats-chart" size={32} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>Progress</Text>
            </TouchableOpacity>
          </View>

          {/* Study Timer */}
          <View style={[styles.timerCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Timer</Text>
            <TouchableOpacity onPress={toggleStudyTimer}>
              <Animated.View style={[styles.timerCircle, {
                borderColor: isStudying ? colors.primary : colors.border,
                transform: [{ scale: progress.value + 0.8 }]
              }]}>
                <Text style={[styles.timerText, { color: colors.text }]}>
                  {Math.floor(studyTime / 60)}:{String(studyTime % 60).padStart(2, '0')}
                </Text>
                <Ionicons 
                  name={isStudying ? 'stop-circle' : 'play-circle'} 
                  size={40} 
                  color={colors.primary} 
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Progress Overview */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
          <FlatList
            horizontal
            data={subjects}
            renderItem={renderSubject}
            keyExtractor={item => item.name}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsList}
          />

          {/* Recent Activities */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
          <View style={[styles.activitiesCard, { backgroundColor: colors.cardBackground }]}>
            {recentActivities.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                  <Text style={{ color: colors.secondaryText }}>{activity.duration}</Text>
                </View>
                <Text style={{ color: colors.secondaryText }}>
                  {new Date(activity.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TabBar />
    </View>
  );
};

const styles = {
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
    marginBottom: 32
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700'
  },
  dateText: {
    fontSize: 16,
    marginTop: 4
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600'
  },
  timerCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 16
  },
  subjectsList: {
    paddingBottom: 16
  },
  subjectCard: {
    width: 280,
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
  progressText: {
    fontSize: 14
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
  activitiesCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    padding: 8,
    flex: 1,
  },
  aiTabItem: {
    alignItems: 'center',
    padding: 8,
    marginTop: -20,
    zIndex: 1,
    backgroundColor: '#4361ee',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
};

export default HomePage;