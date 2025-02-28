import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@studymate.ai',
    bio: 'AI-powered learning enthusiast',
    university: 'Tech University',
    major: 'Computer Science',
    graduationYear: '2024'
  });

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEditMode(false);
      Alert.alert('Profile Updated', 'Your changes have been saved successfully');
    }, 1500);
  };

  const confirmLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: () => router.replace('/Auth/login') }
      ]
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {/* Handle deletion */} }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Ionicons 
              name={editMode ? 'close-circle' : 'create-outline'} 
              size={28} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity onPress={editMode ? pickImage : null}>
            <View style={styles.avatarContainer}>
              <Image
                source={image ? { uri: image } : require('../../assets/images/icon.png')}
                style={styles.avatar}
              />
              {editMode && (
                <View style={styles.editBadge}>
                  <Ionicons name="camera" size={20} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 24 }}>
            <EditableField
              label="Full Name"
              value={profileData.name}
              editable={editMode}
              onChangeText={(text) => setProfileData({...profileData, name: text})}
              colors={colors}
            />

            <EditableField
              label="Email"
              value={profileData.email}
              editable={editMode}
              onChangeText={(text) => setProfileData({...profileData, email: text})}
              colors={colors}
              keyboardType="email-address"
            />

            <EditableField
              label="Bio"
              value={profileData.bio}
              editable={editMode}
              onChangeText={(text) => setProfileData({...profileData, bio: text})}
              colors={colors}
              multiline
            />
          </View>
        </View>

        {/* Academic Info */}
        <SectionHeader title="Academic Information" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <EditableField
            label="University"
            value={profileData.university}
            editable={editMode}
            onChangeText={(text) => setProfileData({...profileData, university: text})}
            colors={colors}
          />

          <EditableField
            label="Major"
            value={profileData.major}
            editable={editMode}
            onChangeText={(text) => setProfileData({...profileData, major: text})}
            colors={colors}
          />

          <EditableField
            label="Graduation Year"
            value={profileData.graduationYear}
            editable={editMode}
            onChangeText={(text) => setProfileData({...profileData, graduationYear: text})}
            colors={colors}
            keyboardType="numeric"
          />
        </View>

        {/* Account Settings */}
        <SectionHeader title="Account Settings" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <SettingItem
            icon="lock-closed"
            label="Change Password"
            onPress={() => router.push('/settings/change-password')}
            colors={colors}
          />
          <SettingItem
            icon="notifications"
            label="Notification Preferences"
            onPress={() => router.push('/settings/notifications')}
            colors={colors}
          />
          <SettingItem
            icon="moon"
            label="Dark Mode"
            rightElement={
              <Ionicons 
                name={isDark ? 'toggle' : 'toggle-outline'} 
                size={24} 
                color={colors.primary} 
              />
            }
            colors={colors}
          />
        </View>

        {/* Danger Zone */}
        {editMode && (
          <>
            <SectionHeader title="Danger Zone" colors={colors} />
            <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
              <SettingItem
                icon="log-out"
                label="Log Out"
                color="#ef4444"
                onPress={confirmLogout}
                colors={colors}
              />
              <SettingItem
                icon="trash"
                label="Delete Account"
                color="#ef4444"
                onPress={confirmDelete}
                colors={colors}
              />
            </View>
          </>
        )}

        {/* Save Button */}
        {editMode && (
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

// Reusable Components
const SectionHeader = ({ title, colors }) => (
  <Text style={[styles.sectionHeader, { color: colors.text }]}>{title}</Text>
);

const EditableField = ({ label, value, editable, onChangeText, colors, ...props }) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>{label}</Text>
    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { color: colors.text }]}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
    ) : (
      <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
    )}
  </View>
);

const SettingItem = ({ icon, label, onPress, rightElement, color, colors }) => (
  <TouchableOpacity 
    style={styles.settingItem} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons 
      name={icon} 
      size={20} 
      color={color || colors.primary} 
      style={{ marginRight: 16 }}
    />
    <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
    {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />}
  </TouchableOpacity>
);

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
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700'
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4361ee',
    borderRadius: 20,
    padding: 8
  },
  fieldContainer: {
    marginBottom: 20
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 4
  },
  fieldValue: {
    fontSize: 16,
    paddingVertical: 8
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    paddingVertical: 8,
    borderColor: '#E0E0E0'
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0'
  },
  settingLabel: {
    flex: 1,
    fontSize: 16
  },
  saveButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
};

export default ProfilePage;