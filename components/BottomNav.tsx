import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Colors } from '../constants/theme';
import { useColorScheme } from 'react-native';

interface TabItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  route: string;
}

const TABS: TabItem[] = [
  { name: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home', route: '/inside/Home' },
  { name: 'Progress', label: 'Analytics', icon: 'stats-chart-outline', iconActive: 'stats-chart', route: '/inside/progress' },
  { name: 'AI', label: 'AI Tutor', icon: 'sparkles', iconActive: 'sparkles', route: '/inside/ai-pages' },
  { name: 'Create', label: 'New Session', icon: 'add-circle-outline', iconActive: 'add-circle', route: '/inside/create-session' },
  { name: 'Profile', label: 'Profile', icon: 'person-outline', iconActive: 'person', route: '/inside/profile' },
];

export const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.route;
          const isAI = tab.name === 'AI';

          if (isAI) {
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => router.push(tab.route as any)}
                style={[styles.aiButton, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <Ionicons name={tab.icon} size={26} color="#ffffff" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.route as any)}
              style={styles.tabItem}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? colors.primary : colors.secondaryText}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.primary : colors.secondaryText,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
  },
  aiButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
