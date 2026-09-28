import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { StorageService } from '../../services/storage';

export default function ProfilePage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex@studymate.ai',
    bio: 'Computer Science & Physics student passionate about AI-driven learning.',
    university: 'Stanford University',
    major: 'Computer Science',
    graduationYear: '2026',
  });

  useEffect(() => {
    StorageService.getProfile().then((prof) => {
      setProfileData({
        name: prof.name,
        email: prof.email,
        bio: prof.bio,
        university: prof.university,
        major: prof.major,
        graduationYear: prof.graduationYear,
      });
      if (prof.avatarUri) {
        setImage(prof.avatarUri);
      }
    });
  }, []);

  // Settings modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        await StorageService.saveProfile({ avatarUri: uri });
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await StorageService.saveProfile({
        ...profileData,
        avatarUri: image,
      });
      setLoading(false);
      setEditMode(false);
      Alert.alert('Profile Updated', 'Your profile information has been saved successfully.');
    } catch (e) {
      console.warn('Error saving profile:', e);
      setLoading(false);
    }
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Password Updated', 'Your security credentials have been updated.');
  };

  const confirmLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to end your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/Auth/login') },
      ]
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? All study history, quiz scores, and saved sessions will be permanently erased.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your data has been removed.');
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Student Profile"
        subtitle="Manage personal & academic records"
        rightAction={{
          icon: editMode ? 'close-outline' : 'create-outline',
          onPress: () => setEditMode(!editMode),
          label: editMode ? 'Cancel Edit' : 'Edit Profile',
        }}
      />

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContainer}>
            {/* Profile Avatar Card */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.avatarSection}>
                <TouchableOpacity onPress={editMode ? pickImage : undefined} activeOpacity={editMode ? 0.7 : 1}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={image ? { uri: image } : require('../../assets/images/icon.png')}
                      style={styles.avatar}
                    />
                    {editMode && (
                      <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                        <Ionicons name="camera" size={16} color="#ffffff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                <Text style={[styles.profileName, { color: colors.text }]}>{profileData.name}</Text>
                <Text style={[styles.profileEmail, { color: colors.secondaryText }]}>{profileData.email}</Text>
              </View>

              <View style={styles.formFields}>
                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>Full Name</Text>
                  {editMode ? (
                    <TextInput
                      value={profileData.name}
                      onChangeText={(t) => setProfileData({ ...profileData, name: t })}
                      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    />
                  ) : (
                    <Text style={[styles.fieldValue, { color: colors.text }]}>{profileData.name}</Text>
                  )}
                </View>

                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>Email Address</Text>
                  {editMode ? (
                    <TextInput
                      value={profileData.email}
                      onChangeText={(t) => setProfileData({ ...profileData, email: t })}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    />
                  ) : (
                    <Text style={[styles.fieldValue, { color: colors.text }]}>{profileData.email}</Text>
                  )}
                </View>

                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>Bio</Text>
                  {editMode ? (
                    <TextInput
                      value={profileData.bio}
                      onChangeText={(t) => setProfileData({ ...profileData, bio: t })}
                      multiline
                      numberOfLines={3}
                      style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    />
                  ) : (
                    <Text style={[styles.fieldValue, { color: colors.text }]}>{profileData.bio}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Academic Information */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Academic Information</Text>

              <View style={styles.formFields}>
                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>University / Institution</Text>
                  {editMode ? (
                    <TextInput
                      value={profileData.university}
                      onChangeText={(t) => setProfileData({ ...profileData, university: t })}
                      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    />
                  ) : (
                    <Text style={[styles.fieldValue, { color: colors.text }]}>{profileData.university}</Text>
                  )}
                </View>

                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>Major / Field of Study</Text>
                  {editMode ? (
                    <TextInput
                      value={profileData.major}
                      onChangeText={(t) => setProfileData({ ...profileData, major: t })}
                      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    />
                  ) : (
                    <Text style={[styles.fieldValue, { color: colors.text }]}>{profileData.major}</Text>
                  )}
                </View>

                <View style={styles.fieldItem}>
                  <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>Graduation Year</Text>
                  {editMode ? (
                    <TextInput
                      value={profileData.graduationYear}
                      onChangeText={(t) => setProfileData({ ...profileData, graduationYear: t })}
                      keyboardType="numeric"
                      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    />
                  ) : (
                    <Text style={[styles.fieldValue, { color: colors.text }]}>{profileData.graduationYear}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Account Security & Preferences */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Security & Preferences</Text>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border }]}
                onPress={() => setShowPasswordModal(true)}
              >
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setNotificationsEnabled(!notificationsEnabled);
                  Alert.alert('Notifications', `Study reminders are now ${!notificationsEnabled ? 'enabled' : 'disabled'}.`);
                }}
              >
                <Ionicons name="notifications-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={[styles.settingText, { color: colors.text }]}>Study Reminder Notifications</Text>
                <Ionicons
                  name={notificationsEnabled ? "toggle" : "toggle-outline"}
                  size={26}
                  color={notificationsEnabled ? colors.primary : colors.secondaryText}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomWidth: 0 }]}
                onPress={() => router.push('/settings')}
              >
                <Ionicons name="settings-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={[styles.settingText, { color: colors.text }]}>All App Settings</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>

            {/* Save Button in Edit Mode */}
            {editMode && (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Profile Changes'}</Text>
              </TouchableOpacity>
            )}

            {/* Account Actions / Danger Zone */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border }]}
                onPress={confirmLogout}
              >
                <Ionicons name="log-out-outline" size={20} color={colors.danger} style={{ marginRight: 12 }} />
                <Text style={[styles.settingText, { color: colors.danger }]}>Log Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomWidth: 0 }]}
                onPress={confirmDelete}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} style={{ marginRight: 12 }} />
                <Text style={[styles.settingText, { color: colors.danger }]}>Delete Account & Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomNav />
      </View>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Change Password</Text>
            <Text style={[styles.modalSub, { color: colors.secondaryText }]}>
              Enter a new password of at least 6 characters.
            </Text>

            <TextInput
              placeholder="New password"
              placeholderTextColor={colors.placeholder}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />

            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor={colors.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdatePassword}
                style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  mainContainer: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  formFields: {
    gap: 14,
  },
  fieldItem: {},
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 70,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    maxWidth: 420,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    marginBottom: 16,
  },
  modalInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalSaveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});