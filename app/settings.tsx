import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const SettingsPage = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const togglePosition = useSharedValue(isDark ? 1 : 0);

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  const handleThemeToggle = () => {
    togglePosition.value = withSpring(isDark ? 0 : 1, { damping: 15 });
    // Add your theme change logic here
  };

  const SettingsItem = ({ icon, label, action, hasSwitch = false, value = false, onValueChange }: any) => (
    <TouchableOpacity 
      style={[styles.settingsItem, { borderBottomColor: colors.border }]}
      onPress={!hasSwitch ? action : undefined}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} style={styles.itemIcon} />
        <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
      </View>
      {hasSwitch ? (
        <Animated.View style={[styles.toggleContainer, { backgroundColor: colors.border }]}>
          <Animated.View 
            style={[
              styles.toggleButton,
              { 
                transform: [{ translateX: togglePosition.value * 20 }],
                backgroundColor: colors.primary
              }
            ]}
          />
        </Animated.View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { paddingBottom: 80 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <SettingsItem
            icon="person-circle"
            label="Edit Profile"
            action={() => router.push('inside/profile')}
          />
          <SettingsItem
            icon="mail"
            label="Email Address"
            action={() => router.push('/settings/email')}
          />
          <SettingsItem
            icon="lock-closed"
            label="Change Password"
            action={() => router.push('/settings/password')}
          />
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          <SettingsItem
            icon="moon"
            label="Dark Mode"
            hasSwitch
            value={isDark}
            onValueChange={handleThemeToggle}
          />
          <SettingsItem
            icon="notifications"
            label="Notifications"
            hasSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingsItem
            icon="language"
            label="App Language"
            action={() => router.push('/settings/language')}
          />
        </View>

        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          <SettingsItem
            icon="help-circle"
            label="Help Center"
            action={() => router.push('/support')}
          />
          <SettingsItem
            icon="alert-circle"
            label="Report a Problem"
            action={() => router.push('/support/report')}
          />
          <SettingsItem
            icon="information-circle"
            label="About StudyApp"
            action={() => router.push('/about')}
          />
        </View>

        {/* Legal Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
          <SettingsItem
            icon="document-text"
            label="Terms of Service"
            action={() => router.push('/legal/terms')}
          />
          <SettingsItem
            icon="document-lock"
            label="Privacy Policy"
            action={() => router.push('/legal/privacy')}
          />
        </View>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.secondaryText }]}>
          StudyApp v1.0.0
        </Text>
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
    marginBottom: 32
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center'
  },
  section: {
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemIcon: {
    marginRight: 16
  },
  itemLabel: {
    fontSize: 16
  },
  toggleContainer: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 16
  }
});

export default SettingsPage;