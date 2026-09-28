import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import { StorageService } from '../../services/storage';

interface FormFieldProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  colors: typeof Colors.light;
  placeholder: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  icon,
  value,
  onChangeText,
  colors,
  placeholder,
}) => (
  <View style={styles.fieldWrapper}>
    <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.primary} style={styles.fieldIcon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.textInput, { color: colors.text }]}
      />
    </View>
  </View>
);

interface PickerFieldProps {
  label: string;
  items: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  colors: typeof Colors.light;
  placeholder: string;
}

const PickerField: React.FC<PickerFieldProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  colors,
  placeholder,
}) => (
  <View style={styles.fieldWrapper}>
    <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
    <View
      style={[
        styles.pickerContainer,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={{ color: colors.text }}
        dropdownIconColor={colors.secondaryText}
      >
        <Picker.Item label={placeholder} value="" color={colors.placeholder} />
        {items.map((item) => (
          <Picker.Item key={item} label={item} value={item} color={colors.text} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function AcademicForm() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [date, setDate] = useState(new Date(2002, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    educationLevel: 'Undergraduate',
    university: '',
    targetSubject: 'Mathematics',
    studyHoursPerDay: '2-3 hours',
    additionalInfo: '',
  });

  const educationLevels = [
    'Middle School',
    'High School',
    'Undergraduate',
    'Graduate / Master’s',
    'Doctoral / PhD',
    'Professional / Self-Taught'
  ];

  const targetSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'General Sciences'
  ];

  const studyHoursOptions = [
    'Less than 1 hour',
    '1-2 hours',
    '2-3 hours',
    '4+ hours'
  ];

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name to set up your profile.');
      return;
    }
    if (!formData.educationLevel) {
      Alert.alert('Required Field', 'Please select your current education level.');
      return;
    }

    setLoading(true);
    try {
      await StorageService.saveProfile({
        name: formData.fullName.trim(),
        university: formData.university.trim() || 'Stanford University',
        major: formData.targetSubject || 'Computer Science',
        bio: `${formData.educationLevel} scholar studying ${formData.targetSubject}. Target daily focus: ${formData.studyHoursPerDay}.`,
      });
    } catch (e) {
      console.warn('Failed saving profile during onboarding:', e);
    } finally {
      setLoading(false);
      router.replace('/inside/Home');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="school-outline" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Academic Profile</Text>
            <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
              Personalize your StudyMate AI learning plan and recommendations
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <FormField
              label="Full Name *"
              icon="person-outline"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              colors={colors}
              placeholder="e.g. Alex Johnson"
            />

            {/* Date of Birth Picker */}
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Date of Birth</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.primary}
                    style={styles.fieldIcon}
                  />
                  <Text style={{ color: colors.text, fontSize: 15 }}>
                    {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <PickerField
              label="Education Level *"
              items={educationLevels}
              selectedValue={formData.educationLevel}
              onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}
              colors={colors}
              placeholder="Select Education Level"
            />

            <FormField
              label="Institution / University"
              icon="business-outline"
              value={formData.university}
              onChangeText={(text) => setFormData({ ...formData, university: text })}
              colors={colors}
              placeholder="e.g. Stanford University or Lincoln High"
            />

            <PickerField
              label="Primary Focus Subject"
              items={targetSubjects}
              selectedValue={formData.targetSubject}
              onValueChange={(value) => setFormData({ ...formData, targetSubject: value })}
              colors={colors}
              placeholder="Select Primary Subject"
            />

            <PickerField
              label="Daily Target Study Time"
              items={studyHoursOptions}
              selectedValue={formData.studyHoursPerDay}
              onValueChange={(value) => setFormData({ ...formData, studyHoursPerDay: value })}
              colors={colors}
              placeholder="Select Target Hours"
            />

            {/* Additional Info Input */}
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Learning Goals & Notes</Text>
              <TextInput
                placeholder="What are you currently preparing for? (e.g. AP Exams, Finals, GRE)"
                placeholderTextColor={colors.placeholder}
                value={formData.additionalInfo}
                onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
                multiline
                numberOfLines={3}
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.buttonInner}>
                  <Text style={styles.buttonText}>Complete Profile & Get Started</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/inside/Home')}
              style={styles.skipButton}
            >
              <Text style={[styles.skipButtonText, { color: colors.secondaryText }]}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingVertical: 40,
  },
  contentWrapper: {
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formGroup: {
    gap: 16,
  },
  fieldWrapper: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    height: 52,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
  },
  pickerContainer: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    textAlignVertical: 'top',
    minHeight: 88,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});