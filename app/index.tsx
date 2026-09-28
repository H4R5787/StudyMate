import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../constants/theme";

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
  colors: typeof Colors.light;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, children, colors }) => (
  <View style={[styles.featureCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
    <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>{children}</Text>
    </View>
  </View>
);

export default function WelcomePage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const handleGetStarted = () => {
    router.push('/Auth/login');
  };

  const handleGuestEntry = () => {
    router.replace('/inside/Home');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primaryLight }]}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>AI-POWERED STUDY PLATFORM</Text>
            </View>
            <Text style={[styles.mainTitle, { color: colors.text }]}>StudyMate AI</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Master any subject with intelligent tutoring, interactive quizzes, and focused study analytics.
            </Text>
          </View>

          {/* Feature Highlights */}
          <View style={styles.featuresSection}>
            <FeatureItem icon="sparkles" title="AI Study Assistant" colors={colors}>
              Instant explanations, problem-solving, and tailored concept breakdowns.
            </FeatureItem>
            <FeatureItem icon="timer-outline" title="Smart Focus Timer" colors={colors}>
              Custom Pomodoro intervals and active session duration monitoring.
            </FeatureItem>
            <FeatureItem icon="stats-chart" title="Deep Progress Analytics" colors={colors}>
              Visualize study patterns, track subject hours, and identify knowledge gaps.
            </FeatureItem>
            <FeatureItem icon="school-outline" title="Interactive Quizzes" colors={colors}>
              Test your mastery with automated scoring and instant review.
            </FeatureItem>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handleGetStarted}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Get Started with StudyMate"
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
              onPress={handleGuestEntry}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue as Guest"
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Explore as Guest</Text>
            </TouchableOpacity>

            <Text style={[styles.footerText, { color: colors.secondaryText }]}>
              Already have an account?{' '}
              <Text
                style={{ color: colors.primary, fontWeight: '700' }}
                onPress={() => router.push('/Auth/login')}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  container: {
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 68,
    height: 68,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  featuresSection: {
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionsSection: {
    gap: 12,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});
