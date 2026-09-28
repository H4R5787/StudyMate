import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';

export default function CreateSession() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [sessionName, setSessionName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [durationHours, setDurationHours] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'General Study',
  ];

  const handleCreateSession = () => {
    if (!sessionName.trim()) {
      Alert.alert('Required Field', 'Please enter a name or topic for your study session.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Session Scheduled!',
        `"${sessionName}" has been created for ${selectedSubject}. Duration: ${durationHours}h ${durationMinutes}m.`,
        [
          {
            text: 'Go to Dashboard',
            onPress: () => router.replace('/inside/Home'),
          },
        ]
      );
    }, 800);
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });
      if (!result.canceled && result.assets) {
        setFiles((prev) => [...prev, ...result.assets]);
      }
    } catch (err) {
      console.error('Document picker error:', err);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="New Study Session" subtitle="Schedule and customize study goals" />

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContainer}>
            {/* Session Basic Info */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Session Details</Text>

              {/* Session Name */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Session Name *</Text>
                <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="book-outline" size={20} color={colors.primary} style={styles.fieldIcon} />
                  <TextInput
                    placeholder="e.g. Calculus Midterm Prep"
                    placeholderTextColor={colors.placeholder}
                    value={sessionName}
                    onChangeText={setSessionName}
                    style={[styles.input, { color: colors.text }]}
                  />
                </View>
              </View>

              {/* Subject Selection */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Subject</Text>
                <View style={[styles.pickerBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Picker
                    selectedValue={selectedSubject}
                    onValueChange={(val) => setSelectedSubject(val)}
                    style={{ color: colors.text }}
                    dropdownIconColor={colors.secondaryText}
                  >
                    {subjects.map((subj) => (
                      <Picker.Item key={subj} label={subj} value={subj} color={colors.text} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Duration Settings */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Duration</Text>
                <TouchableOpacity
                  style={[styles.durationPickerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="time-outline" size={20} color={colors.primary} style={styles.fieldIcon} />
                  <Text style={[styles.durationText, { color: colors.text }]}>
                    {durationHours} hour{durationHours === 1 ? '' : 's'} {durationMinutes} minutes
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={colors.secondaryText} />
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={new Date(2026, 0, 1, durationHours, durationMinutes)}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      setShowTimePicker(false);
                      if (selectedDate) {
                        setDurationHours(selectedDate.getHours());
                        setDurationMinutes(selectedDate.getMinutes());
                      }
                    }}
                  />
                )}
              </View>
            </View>

            {/* Study Mode Card */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Study Mode</Text>
              <View style={styles.modeRow}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    {
                      backgroundColor: mode === 'individual' ? colors.primary : colors.surface,
                      borderColor: mode === 'individual' ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setMode('individual')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="person"
                    size={22}
                    color={mode === 'individual' ? '#ffffff' : colors.primary}
                  />
                  <Text
                    style={[
                      styles.modeButtonText,
                      { color: mode === 'individual' ? '#ffffff' : colors.text },
                    ]}
                  >
                    Solo Focus
                  </Text>
                  <Text
                    style={[
                      styles.modeSubText,
                      { color: mode === 'individual' ? 'rgba(255,255,255,0.8)' : colors.secondaryText },
                    ]}
                  >
                    Distraction-free timer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    {
                      backgroundColor: mode === 'group' ? colors.primary : colors.surface,
                      borderColor: mode === 'group' ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setMode('group')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="people"
                    size={22}
                    color={mode === 'group' ? '#ffffff' : colors.primary}
                  />
                  <Text
                    style={[
                      styles.modeButtonText,
                      { color: mode === 'group' ? '#ffffff' : colors.text },
                    ]}
                  >
                    Group Room
                  </Text>
                  <Text
                    style={[
                      styles.modeSubText,
                      { color: mode === 'group' ? 'rgba(255,255,255,0.8)' : colors.secondaryText },
                    ]}
                  >
                    Peer study tracking
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Study Materials */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.materialsHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Study Materials</Text>
                <TouchableOpacity
                  style={[styles.attachButton, { backgroundColor: colors.primaryLight }]}
                  onPress={pickDocuments}
                  activeOpacity={0.7}
                >
                  <Ionicons name="attach" size={16} color={colors.primary} />
                  <Text style={[styles.attachText, { color: colors.primary }]}>Attach</Text>
                </TouchableOpacity>
              </View>

              {files.length === 0 ? (
                <View style={[styles.emptyAttachBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="cloud-upload-outline" size={28} color={colors.secondaryText} />
                  <Text style={[styles.emptyAttachText, { color: colors.secondaryText }]}>
                    No documents attached yet (PDF, DOCX, images)
                  </Text>
                </View>
              ) : (
                <View style={styles.fileList}>
                  {files.map((file, idx) => (
                    <View
                      key={idx}
                      style={[styles.fileChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                      <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeFile(idx)}>
                        <Ionicons name="close-circle" size={18} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Session Notes */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Session Notes & Goals</Text>
              <TextInput
                placeholder="What specific topics or problems do you plan to conquer?"
                placeholderTextColor={colors.placeholder}
                value={sessionNotes}
                onChangeText={setSessionNotes}
                multiline
                numberOfLines={4}
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={handleCreateSession}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="calendar-outline" size={20} color="#ffffff" />
                  <Text style={styles.createButtonText}>Start / Schedule Session</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
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
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  fieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  pickerBox: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  durationPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  durationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 4,
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  modeSubText: {
    fontSize: 12,
  },
  materialsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  attachText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyAttachBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyAttachText: {
    fontSize: 13,
    textAlign: 'center',
  },
  fileList: {
    gap: 8,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
  },
  notesInput: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
