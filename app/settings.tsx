import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { AppHeader } from '../components/AppHeader';
import { StorageService } from '../services/storage';

export default function SettingsPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');

  useEffect(() => {
    StorageService.getSettings().then((s) => {
      setNotificationsEnabled(s.notificationsEnabled);
      setSoundEnabled(s.soundEnabled);
      setOfflineSync(s.offlineSync);
      setSelectedLanguage(s.language);
    });
  }, []);

  const handleToggleNotifications = (val: boolean) => {
    setNotificationsEnabled(val);
    StorageService.saveSettings({ notificationsEnabled: val });
  };

  const handleToggleSound = (val: boolean) => {
    setSoundEnabled(val);
    StorageService.saveSettings({ soundEnabled: val });
  };

  const handleToggleOffline = (val: boolean) => {
    setOfflineSync(val);
    StorageService.saveSettings({ offlineSync: val });
  };

  // Modal states for settings actions
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [modalInput2, setModalInput2] = useState('');

  const openModal = (type: string) => {
    setModalType(type);
    setModalInput('');
    setModalInput2('');
  };

  const closeModal = () => {
    setModalType(null);
  };

  const handleModalSubmit = () => {
    if (modalType === 'email') {
      if (!modalInput.includes('@')) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
      Alert.alert('Email Updated', `Your account email has been updated to ${modalInput}.`);
    } else if (modalType === 'password') {
      if (modalInput.length < 6) {
        Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
        return;
      }
      if (modalInput !== modalInput2) {
        Alert.alert('Mismatch', 'Passwords do not match.');
        return;
      }
      Alert.alert('Password Changed', 'Your password has been successfully updated.');
    } else if (modalType === 'report') {
      if (!modalInput.trim()) {
        Alert.alert('Empty Report', 'Please describe the problem you encountered.');
        return;
      }
      Alert.alert('Report Received', 'Thank you for your feedback! Our engineering team will review it.');
    }
    closeModal();
  };

  const languages = ['English (US)', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)', 'Mandarin (中文)'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" subtitle="Preferences & App Configuration" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {/* Account Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account & Security</Text>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: colors.border }]}
              onPress={() => router.push('/inside/profile')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="person-circle-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Edit Profile Details</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: colors.border }]}
              onPress={() => openModal('email')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="mail-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Email Address</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.subValue, { color: colors.secondaryText }]}>alex@studymate.ai</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomWidth: 0 }]}
              onPress={() => openModal('password')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="lock-closed-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Preferences Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Preferences</Text>

            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={styles.rowLeft}>
                <Ionicons name="notifications-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Study Reminders</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={styles.rowLeft}>
                <Ionicons name="volume-medium-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Timer Chimes & Sound</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={handleToggleSound}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={styles.rowLeft}>
                <Ionicons name="cloud-offline-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Offline Sync Mode</Text>
              </View>
              <Switch
                value={offlineSync}
                onValueChange={handleToggleOffline}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <TouchableOpacity
              style={[styles.row, { borderBottomWidth: 0 }]}
              onPress={() => openModal('language')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="language-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>App Language</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.subValue, { color: colors.secondaryText }]}>{selectedLanguage}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Help & Support</Text>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: colors.border }]}
              onPress={() => openModal('help')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="help-circle-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Help Center & FAQ</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: colors.border }]}
              onPress={() => openModal('report')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="alert-circle-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Report a Problem</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomWidth: 0 }]}
              onPress={() => openModal('about')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="information-circle-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>About StudyMate</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Legal Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: colors.border }]}
              onPress={() => openModal('terms')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="document-text-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomWidth: 0 }]}
              onPress={() => openModal('privacy')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="shield-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.versionText, { color: colors.secondaryText }]}>
            StudyMate AI v1.0.0 • Production Build 2026
          </Text>
        </View>
      </ScrollView>

      {/* Dynamic Settings Modals */}
      <Modal visible={modalType !== null} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            {/* Email Modal */}
            {modalType === 'email' && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Update Email Address</Text>
                <Text style={[styles.modalSub, { color: colors.secondaryText }]}>
                  Enter the new email address for notifications and account recovery.
                </Text>
                <TextInput
                  placeholder="newemail@example.com"
                  placeholderTextColor={colors.placeholder}
                  value={modalInput}
                  onChangeText={setModalInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                />
                <View style={styles.modalActionRow}>
                  <TouchableOpacity onPress={closeModal} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleModalSubmit} style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Save Email</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Password Modal */}
            {modalType === 'password' && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Change Password</Text>
                <Text style={[styles.modalSub, { color: colors.secondaryText }]}>
                  Choose a new strong password (at least 6 characters).
                </Text>
                <TextInput
                  placeholder="New password"
                  placeholderTextColor={colors.placeholder}
                  value={modalInput}
                  onChangeText={setModalInput}
                  secureTextEntry
                  style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                />
                <TextInput
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.placeholder}
                  value={modalInput2}
                  onChangeText={setModalInput2}
                  secureTextEntry
                  style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                />
                <View style={styles.modalActionRow}>
                  <TouchableOpacity onPress={closeModal} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleModalSubmit} style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Update Password</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Language Modal */}
            {modalType === 'language' && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
                <View style={{ gap: 8, marginVertical: 14 }}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      onPress={() => {
                        setSelectedLanguage(lang);
                        closeModal();
                      }}
                      style={[
                        styles.langItem,
                        {
                          backgroundColor: selectedLanguage === lang ? colors.primaryLight : colors.surface,
                          borderColor: selectedLanguage === lang ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.langText, { color: selectedLanguage === lang ? colors.primary : colors.text }]}>
                        {lang}
                      </Text>
                      {selectedLanguage === lang && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={closeModal} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                  <Text style={[styles.modalBtnText, { color: colors.text }]}>Close</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Help Center */}
            {modalType === 'help' && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Help Center & FAQ</Text>
                <ScrollView style={{ maxHeight: 280, marginVertical: 12 }}>
                  <Text style={[styles.faqQ, { color: colors.text }]}>How does StudyMate AI work?</Text>
                  <Text style={[styles.faqA, { color: colors.secondaryText }]}>
                    StudyMate combines smart Pomodoro timers, subject analytics, and AI tutoring for STEM subjects.
                  </Text>
                  <Text style={[styles.faqQ, { color: colors.text, marginTop: 12 }]}>Does it work offline?</Text>
                  <Text style={[styles.faqA, { color: colors.secondaryText }]}>
                    Yes! All quiz engines, progress metrics, and the built-in study tutor operate offline.
                  </Text>
                  <Text style={[styles.faqQ, { color: colors.text, marginTop: 12 }]}>How do I connect my Gemini key?</Text>
                  <Text style={[styles.faqA, { color: colors.secondaryText }]}>
                    Tap the key icon at the top of the AI page to enter your own Google Gemini API key.
                  </Text>
                </ScrollView>
                <TouchableOpacity onPress={closeModal} style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Got It</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Report Problem */}
            {modalType === 'report' && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Report an Issue</Text>
                <Text style={[styles.modalSub, { color: colors.secondaryText }]}>
                  Describe the error, bug, or feature request.
                </Text>
                <TextInput
                  placeholder="Describe what happened..."
                  placeholderTextColor={colors.placeholder}
                  value={modalInput}
                  onChangeText={setModalInput}
                  multiline
                  numberOfLines={4}
                  style={[styles.modalTextArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                />
                <View style={styles.modalActionRow}>
                  <TouchableOpacity onPress={closeModal} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleModalSubmit} style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Submit Report</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* About Modal */}
            {modalType === 'about' && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <Ionicons name="school" size={48} color={colors.primary} />
                  <Text style={[styles.modalTitle, { color: colors.text, marginTop: 8 }]}>StudyMate AI</Text>
                  <Text style={[styles.modalSub, { color: colors.secondaryText, textAlign: 'center' }]}>
                    Your Personal AI-Powered Learning Companion
                  </Text>
                </View>
                <Text style={[styles.aboutText, { color: colors.secondaryText }]}>
                  StudyMate is an intelligent learning ecosystem designed to streamline STEM coursework through interactive assessments, focus tracking, and generative tutoring.
                </Text>
                <TouchableOpacity onPress={closeModal} style={[styles.modalSaveBtn, { backgroundColor: colors.primary, marginTop: 16 }]}>
                  <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Close</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Terms & Privacy */}
            {(modalType === 'terms' || modalType === 'privacy') && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {modalType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </Text>
                <ScrollView style={{ maxHeight: 260, marginVertical: 12 }}>
                  <Text style={[styles.legalText, { color: colors.secondaryText }]}>
                    {modalType === 'terms'
                      ? 'By using StudyMate AI, you agree to utilize the platform for legitimate educational study purposes. All quizzes and content are curated for academic practice. User progress data is stored locally and securely.'
                      : 'StudyMate values your privacy. Your personal information, academic records, and study notes are kept confidential. We do not sell your personal data or share user study history with third-party advertisers.'}
                  </Text>
                </ScrollView>
                <TouchableOpacity onPress={closeModal} style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
    paddingBottom: 40,
  },
  mainContainer: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  section: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subValue: {
    fontSize: 13,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    maxWidth: 440,
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
    lineHeight: 18,
  },
  modalInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 12,
  },
  modalTextArea: {
    minHeight: 90,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 16,
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
    alignItems: 'center',
  },
  modalSaveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  faqA: {
    fontSize: 13,
    lineHeight: 18,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  legalText: {
    fontSize: 13,
    lineHeight: 20,
  },
});