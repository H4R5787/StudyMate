import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Animated, Image, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router, useRouter } from 'expo-router';
import Reanimated, { useSharedValue, withSpring } from 'react-native-reanimated';

const SubjectCard = ({ item, colors }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [item.images.length]);

  return (
    <TouchableOpacity
      style={[styles.subjectCard, { borderColor: colors.border }]}
      onPress={() => router.push(`/inside/progress/${item.name}`)}
    >
      <Animated.Image
        source={item.images[currentImageIndex]}
        style={[styles.backgroundImage, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
      <View style={[styles.contentOverlay, { backgroundColor: colors.cardBackground + 'D0' }]}>
        <View style={styles.subjectHeader}>
          <Text style={[styles.subjectTitle, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.progressText, { color: colors.secondaryText }]}>{item.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            {
              width: `${item.progress}%`,
              backgroundColor: item.color
            }
          ]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

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

  // Using URL-based images that work without local files
  const subjects = [
    {
      name: 'Mathematics',
      progress: 75,
      color: '#FF6B6B',
      images: [
        { uri: 'https://www.shutterstock.com/shutterstock/photos/1859813464/display_1500/stock-vector-math-horizontal-banner-presentation-website-isolated-lettering-typography-idea-with-icons-1859813464.jpg' },
        { uri: 'https://placehold.co/400x200.png/FF6B6B/FFF?text=Algebra' },
        { uri: 'https://placehold.co/400x200.png/FF6B6B/FFF?text=Calculus' }
      ]
    },
    {
      name: 'Physics',
      progress: 60,
      color: '#4ECDC4',
      images: [
        { uri: 'https://placehold.co/400x200.png/4ECDC4/FFF?text=Physics' },
        { uri: 'https://placehold.co/400x200.png/4ECDC4/FFF?text=Motion' },
        { uri: 'https://placehold.co/400x200.png/4ECDC4/FFF?text=Energy' }
      ]
    },
    {
      name: 'Chemistry',
      progress: 45,
      color: '#45B7D1',
      images: [
        { uri: 'https://placehold.co/400x200.png/45B7D1/FFF?text=Chemistry' },
        { uri: 'https://placehold.co/400x200.png/45B7D1/FFF?text=Elements' },
        { uri: 'https://placehold.co/400x200.png/45B7D1/FFF?text=Reactions' }
      ]
    },
    {
      name: 'Biology',
      progress: 30,
      color: '#96CEB4',
      images: [
        { uri: 'https://placehold.co/400x200.png/96CEB4/FFF?text=Biology' },
        { uri: 'https://placehold.co/400x200.png/96CEB4/FFF?text=Cells' },
        { uri: 'https://placehold.co/400x200.png/96CEB4/FFF?text=DNA' }
      ]
    },
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

  const renderSubject = ({ item }) => <SubjectCard item={item} colors={colors} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>Good Morning, Student!</Text>
              <Text style={[styles.dateText, { color: colors.secondaryText }]}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/inside/profile')}>
              <Ionicons name="person-circle" size={32} color={colors.primary} />
            </TouchableOpacity>
          </View>

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

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
          <FlatList
            horizontal
            data={subjects}
            renderItem={renderSubject}
            keyExtractor={item => item.name}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsList}
          />

          <View style={[styles.timerCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Timer</Text>
            <TouchableOpacity onPress={() => setIsStudying(!isStudying)}>
              <Reanimated.View style={[styles.timerCircle, {
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
              </Reanimated.View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/inside/recent-activities')}
            style={styles.sectionHeader}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.secondaryText} />
          </TouchableOpacity>
          
          <View style={[styles.activitiesCard, { backgroundColor: colors.cardBackground }]}>
            {[
              { id: '1', title: 'Algebra Basics', duration: '45 mins', date: '2023-08-20' },
              { id: '2', title: 'Thermodynamics', duration: '1h 30m', date: '2023-08-19' },
              { id: '3', title: 'Organic Chemistry', duration: '30 mins', date: '2023-08-18' },
            ].map(activity => (
              <TouchableOpacity key={activity.id} style={styles.activityItem}>
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                  <Text style={{ color: colors.secondaryText }}>{activity.duration}</Text>
                </View>
                <Text style={{ color: colors.secondaryText }}>
                  {new Date(activity.date).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <TabBar />
    </View>
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
    height: 180,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  contentOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
});

export default HomePage;
