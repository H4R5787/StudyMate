import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/theme';
import { AppHeader } from '../../../components/AppHeader';

interface Section {
  id: string;
  title: string;
  content: string[];
  equations: { formula: string; desc: string }[];
}

const CHAPTER_DATA = {
  title: 'Chapter 2: Classical Mechanics',
  course: 'Physics • Dynamics & Conservation Laws',
  sections: [
    {
      id: '2.1',
      title: 'Newton\'s Laws of Motion',
      content: [
        'First Law (Inertia): An object remains in its state of rest or uniform motion in a straight line unless acted upon by a net external resultant force.',
        'Second Law (Momentum & Force): The rate of change of momentum is directly proportional to the applied force: F = ma.',
        'Third Law (Action & Reaction): To every action force, there is an equal and opposite reaction force occurring simultaneously on different bodies.'
      ],
      equations: [
        { formula: 'F_net = m · a', desc: 'Net force equals mass times acceleration' },
        { formula: 'p = m · v', desc: 'Linear momentum equals mass times velocity' }
      ]
    },
    {
      id: '2.2',
      title: 'Work, Kinetic Energy & Work-Energy Theorem',
      content: [
        'Work is defined as force multiplied by displacement in the direction of the force: W = F · d · cos(θ).',
        'Kinetic Energy (KE) represents the energy possessed by an object due to its motion: KE = ½mv².',
        'Work-Energy Theorem: The net work done by all forces equals the change in kinetic energy: W_net = ΔKE.'
      ],
      equations: [
        { formula: 'W = F · d · cos(θ)', desc: 'Work done by constant force' },
        { formula: 'KE = ½ · m · v²', desc: 'Translational kinetic energy' },
        { formula: 'PE = m · g · h', desc: 'Gravitational potential energy near Earth' }
      ]
    },
    {
      id: '2.3',
      title: 'Conservation Laws & Collisions',
      content: [
        'Conservation of Mechanical Energy: In an isolated system with conservative forces, E_total = KE + PE remains constant.',
        'Conservation of Linear Momentum: In any closed collision where no net external force acts, total initial momentum equals total final momentum.',
        'Elastic vs Inelastic: Kinetic energy is conserved in perfectly elastic collisions, whereas energy is converted into heat or sound in inelastic collisions.'
      ],
      equations: [
        { formula: 'E_initial = E_final', desc: 'Total mechanical energy conservation' },
        { formula: 'm₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\'', desc: '1D collision momentum conservation' }
      ]
    }
  ]
};

export default function PhysicsChapter() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set(['2.1']));
  const [expandedSection, setExpandedSection] = useState<string>('2.1');
  const progress = useRef(new Animated.Value(1 / CHAPTER_DATA.sections.length)).current;

  const totalSections = CHAPTER_DATA.sections.length;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: completedSections.size / totalSections,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [completedSections.size]);

  const toggleComplete = (id: string) => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedSection((prev) => (prev === id ? '' : id));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title={CHAPTER_DATA.title}
        subtitle={CHAPTER_DATA.course}
      />

      {/* Progress Bar Header */}
      <View style={[styles.progressHeader, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <View style={styles.progressTextRow}>
          <Text style={[styles.progressLabel, { color: colors.text }]}>Chapter Progress</Text>
          <Text style={[styles.progressCount, { color: colors.primary }]}>
            {completedSections.size} of {totalSections} completed
          </Text>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: colors.primary,
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {CHAPTER_DATA.sections.map((section) => {
            const isExpanded = expandedSection === section.id;
            const isCompleted = completedSections.has(section.id);

            return (
              <View
                key={section.id}
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: isCompleted ? Colors.light.success : colors.border,
                  },
                ]}
              >
                {/* Header Toggle */}
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleExpand(section.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.sectionTitleRow}>
                    <Ionicons
                      name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
                      size={22}
                      color={isCompleted ? Colors.light.success : colors.secondaryText}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      {section.id}. {section.title}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>

                {/* Collapsible Content */}
                {isExpanded && (
                  <View style={styles.sectionBody}>
                    <View style={styles.paragraphsList}>
                      {section.content.map((p, idx) => (
                        <View key={idx} style={styles.paragraphBulletRow}>
                          <Text style={[styles.bulletDot, { color: colors.primary }]}>•</Text>
                          <Text style={[styles.paragraphText, { color: colors.text }]}>{p}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Equations Box */}
                    <View style={[styles.equationsBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <View style={styles.equationsHeader}>
                        <Ionicons name="calculator-outline" size={16} color={colors.primary} />
                        <Text style={[styles.equationsTitle, { color: colors.primary }]}>Key Formulas</Text>
                      </View>
                      {section.equations.map((eq, idx) => (
                        <View key={idx} style={styles.equationRow}>
                          <Text style={[styles.formulaText, { color: colors.text }]}>{eq.formula}</Text>
                          <Text style={[styles.formulaDesc, { color: colors.secondaryText }]}>{eq.desc}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Complete Button */}
                    <TouchableOpacity
                      onPress={() => toggleComplete(section.id)}
                      style={[
                        styles.completeBtn,
                        {
                          backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.12)' : colors.primary,
                          borderColor: isCompleted ? Colors.light.success : colors.primary,
                        },
                      ]}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name={isCompleted ? "checkmark-done" : "checkmark-circle-outline"}
                        size={18}
                        color={isCompleted ? Colors.light.success : "#ffffff"}
                      />
                      <Text
                        style={[
                          styles.completeBtnText,
                          { color: isCompleted ? Colors.light.success : "#ffffff" },
                        ]}
                      >
                        {isCompleted ? 'Marked as Understood ✓' : 'Mark Section as Understood'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          {/* Quick AI Help Callout */}
          <TouchableOpacity
            style={[styles.aiHelpCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => router.push('/inside/ai-pages')}
            activeOpacity={0.8}
          >
            <View style={[styles.aiIconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="sparkles" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.aiCardTitle, { color: colors.text }]}>Need Concept Clarification?</Text>
              <Text style={[styles.aiCardSub, { color: colors.secondaryText }]}>
                Ask StudyMate AI to explain any physics equation in plain language.
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  progressHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  mainContainer: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  paragraphsList: {
    gap: 10,
    marginBottom: 16,
  },
  paragraphBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 18,
    marginRight: 8,
    lineHeight: 22,
  },
  paragraphText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  equationsBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  equationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  equationsTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  equationRow: {
    borderLeftWidth: 3,
    borderLeftColor: '#4361ee',
    paddingLeft: 10,
  },
  formulaText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
  },
  formulaDesc: {
    fontSize: 12,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  completeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  aiHelpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    marginTop: 8,
  },
  aiIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  aiCardSub: {
    fontSize: 12,
    lineHeight: 16,
  },
});