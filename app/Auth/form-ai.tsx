import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

const AcademicForm = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    educationLevel: '',
    university: '',
    className: '',
    state: '',
    college: '',
    additionalInfo: ''
  });

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    inputBorder: isDark ? '#333333' : '#E0E0E0',
    placeholder: isDark ? '#666666' : '#999999',
  };

  const educationLevels = ['High School', 'Undergraduate', 'Graduate', 'Postgraduate', 'Doctoral'];
  const states = ['Alabama', 'Alaska', 'Arizona', /*... other states ...*/];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = () => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!formData.educationLevel) {
      alert('Please select your education level');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace('/inside/Home');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={[styles.header, { color: colors.text }]}>Academic Profile</Text>
            <Text style={[styles.subHeader, { color: colors.placeholder }]}>
              Please provide your educational information
            </Text>
          </View>

          <View style={{ gap: 20 }}>
            {/* Full Name Input */}
            <FormField
              label="Full Name"
              icon="person-outline"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
              colors={colors}
              placeholder="John Doe"
            />

            {/* Date of Birth Picker */}
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View style={[styles.inputContainer, { 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.inputBorder
                }]}>
                  <Ionicons 
                    name="calendar-outline" 
                    size={20} 
                    color={colors.placeholder} 
                    style={styles.icon}
                  />
                  <Text style={{ color: colors.text, fontSize: 16 }}>
                    {date.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
              )}
            </View>

            {/* Education Level Picker */}
            <PickerField
              label="Education Level"
              items={educationLevels}
              selectedValue={formData.educationLevel}
              onValueChange={(value) => setFormData({...formData, educationLevel: value})}
              colors={colors}
              placeholder="Select Education Level"
            />

            {/* University Input */}
            <FormField
              label="University Name"
              icon="school-outline"
              value={formData.university}
              onChangeText={(text) => setFormData({...formData, university: text})}
              colors={colors}
              placeholder="Enter university name"
            />

            {/* State Picker */}
            <PickerField
              label="State"
              items={states}
              selectedValue={formData.state}
              onValueChange={(value) => setFormData({...formData, state: value})}
              colors={colors}
              placeholder="Select State"
            />

            {/* Additional Info Input */}
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Additional Information</Text>
              <TextInput
                placeholder="Any other relevant details"
                placeholderTextColor={colors.placeholder}
                value={formData.additionalInfo}
                onChangeText={(text) => setFormData({...formData, additionalInfo: text})}
                multiline
                numberOfLines={4}
                style={[styles.textArea, { 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text
                }]}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Complete Registration</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Reusable Form Field Component
const FormField = ({ label, icon, value, onChangeText, colors, placeholder }) => (
  <View>
    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    <View style={[styles.inputContainer, { 
      backgroundColor: colors.cardBackground,
      borderColor: colors.inputBorder
    }]}>
      <Ionicons 
        name={icon} 
        size={20} 
        color={colors.placeholder} 
        style={styles.icon}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { color: colors.text }]}
      />
    </View>
  </View>
);

// Reusable Picker Component
const PickerField = ({ label, items, selectedValue, onValueChange, colors, placeholder }) => (
  <View>
    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    <View style={[styles.pickerContainer, { 
      backgroundColor: colors.cardBackground,
      borderColor: colors.inputBorder
    }]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={{ color: colors.text }}
        dropdownIconColor={colors.placeholder}
      >
        <Picker.Item label={placeholder} value="" color={colors.placeholder} />
        {items.map((item) => (
          <Picker.Item key={item} label={item} value={item} color={colors.text} />
        ))}
      </Picker>
    </View>
  </View>
);

const styles = {
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center'
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center'
  },
  label: {
    fontWeight: '600', 
    marginBottom: 8,
    fontSize: 16
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    height: 56
  },
  icon: {
    marginRight: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden'
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    textAlignVertical: 'top',
    minHeight: 100
  },
  submitButton: {
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
};

export default AcademicForm;