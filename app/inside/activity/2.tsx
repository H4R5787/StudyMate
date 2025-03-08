import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const PhysicsChapter = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSection] = useState('');
  const progress = new Animated.Value(0);
  const params = useLocalSearchParams();

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  const chapterContent = {
    title: 'Chapter 2: Mechanics',
    sections: [
      {
        id: '2.1',
        title: 'Newton\'s Laws of Motion',
        content: [
          'First Law: An object at rest remains at rest, and an object in motion remains in motion unless acted upon by a net external force.',
          'Second Law: F = ma',
          'Third Law: For every action, there is an equal and opposite reaction.'
        ],
        equations: ['F = ma', 'p = mv']
      },
      {
        id: '2.2',
        title: 'Work and Energy',
        content: [
          'Work (W) = Force × Displacement × cosθ',
          'Kinetic Energy (KE) = ½mv²',
          'Potential Energy (PE) = mgh'
        ],
        equations: ['W = Fd cosθ', 'KE = ½mv²', 'PE = mgh']
      },
      {
        id: '2.3',
        title: 'Conservation Laws',
        content: [
          'Conservation of Energy: Energy cannot be created or destroyed',
          'Conservation of Momentum: Total momentum remains constant in isolated systems'
        ],
        equations: ['ΣE_initial = ΣE_final', 'Σp_initial = Σp_final']
      }
    ]
  };

  const totalSections = chapterContent.sections.length;
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  useEffect(() => {
    Animated.timing(progress, {
      toValue: completedSections.size / totalSections,
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [completedSections]);

  const toggleSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleContent = (sectionId: string) => {
    setCurrentSection(prev => prev === sectionId ? '' : sectionId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {chapterContent.title}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Section */}
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.text }]}>
          Completed: {completedSections.size}/{totalSections}
        </Text>
        <Animated.View style={[
          styles.progressBar,
          { width: progressWidth, backgroundColor: colors.primary }
        ]} />
      </View>

      {/* Chapter Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {chapterContent.sections.map((section) => (
          <View 
            key={section.id}
            style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}
          >
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleContent(section.id)}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
              <Ionicons
                name={currentSection === section.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>

            {currentSection === section.id && (
              <View style={styles.sectionContent}>
                {section.content.map((text, index) => (
                  <Text 
                    key={index} 
                    style={[styles.contentText, { color: colors.text }]}
                  >
                    {text}
                  </Text>
                ))}

                <View style={styles.equationContainer}>
                  <Text style={[styles.equationTitle, { color: colors.primary }]}>
                    Key Equations:
                  </Text>
                  {section.equations.map((equation, index) => (
                    <Text
                      key={index}
                      style={[styles.equationText, { color: colors.text }]}
                    >
                      {equation}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    { 
                      backgroundColor: completedSections.has(section.id) 
                        ? colors.primary 
                        : 'transparent',
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => toggleSectionComplete(section.id)}
                >
                  <Text style={[
                    styles.buttonText,
                    { 
                      color: completedSections.has(section.id) 
                        ? colors.cardBackground 
                        : colors.primary
                    }
                  ]}>
                    {completedSections.has(section.id) ? 'Completed ✓' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center'
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E'
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8
  },
  progressBar: {
    height: 4,
    borderRadius: 2
  },
  container: {
    padding: 16,
    paddingBottom: 80
  },
  sectionCard: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12
  },
  equationContainer: {
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4361ee33'
  },
  equationTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8
  },
  equationText: {
    fontSize: 16,
    fontFamily: 'monospace',
    marginVertical: 4
  },
  completeButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600'
  }
};

export default PhysicsChapter;