import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AcademicForm = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const educationLevels = [
    'High School', 
    'Undergraduate', 
    'Graduate', 
    'Postgraduate', 
    'Doctoral'
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', /*... other states ...*/
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '800',
              color: colors.text,
              marginBottom: 8,
              textAlign: 'center'
            }}>
              Academic Profile
            </Text>
            <Text style={{
              fontSize: 16,
              color: colors.placeholder,
              textAlign: 'center'
            }}>
              Please provide your educational information
            </Text>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 20 }}>
            {/* Full Name */}
            <View>
              <Text style={{ 
                color: colors.text, 
                fontWeight: '600', 
                marginBottom: 8 
              }}>
                Full Name
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardBackground,
                borderRadius: 12,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                height: 56
              }}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={colors.placeholder} 
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor={colors.placeholder}
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({...formData, fullName: text})}
                  style={{
                    flex: 1,
                    color: colors.text,
                    fontSize: 16,
                  }}
                />
              </View>
            </View>

            {/* Date of Birth */}
            <View>
              <Text style={{ 
                color: colors.text, 
                fontWeight: '600', 
                marginBottom: 8 
              }}>
                Date of Birth
              </Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  height: 56
                }}>
                  <Ionicons 
                    name="calendar-outline" 
                    size={20} 
                    color={colors.placeholder} 
                    style={{ marginRight: 12 }}
                  />
                  <Text style={{ 
                    color: date ? colors.text : colors.placeholder,
                    fontSize: 16
                  }}>
                    {date.toLocaleDateString() || 'Select Date'}
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

            {/* Education Level */}
            <View>
              <Text style={{ 
                color: colors.text, 
                fontWeight: '600', 
                marginBottom: 8 
              }}>
                Education Level
              </Text>
              <View style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.inputBorder
              }}>
                <Picker
                  selectedValue={formData.educationLevel}
                  onValueChange={(value) => setFormData({...formData, educationLevel: value})}
                  style={{ 
                    color: colors.text,
                    height: 56,
                    paddingHorizontal: 16
                  }}
                  dropdownIconColor={colors.placeholder}
                >
                  <Picker.Item 
                    label="Select Education Level" 
                    value="" 
                    color={colors.placeholder}
                  />
                  {educationLevels.map((level) => (
                    <Picker.Item 
                      key={level} 
                      label={level} 
                      value={level} 
                      color={colors.text} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* University Name */}
            <View>
              <Text style={{ 
                color: colors.text, 
                fontWeight: '600', 
                marginBottom: 8 
              }}>
                University Name
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardBackground,
                borderRadius: 12,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                height: 56
              }}>
                <Ionicons 
                  name="school-outline" 
                  size={20} 
                  color={colors.placeholder} 
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  placeholder="Enter university name"
                  placeholderTextColor={colors.placeholder}
                  value={formData.university}
                  onChangeText={(text) => setFormData({...formData, university: text})}
                  style={{
                    flex: 1,
                    color: colors.text,
                    fontSize: 16,
                  }}
                />
              </View>
            </View>

            {/* State Selection */}
            <View>
              <Text style={{ 
                color: colors.text, 
                fontWeight: '600', 
                marginBottom: 8 
              }}>
                State
              </Text>
              <View style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.inputBorder
              }}>
                <Picker
                  selectedValue={formData.state}
                  onValueChange={(value) => setFormData({...formData, state: value})}
                  style={{ 
                    color: colors.text,
                    height: 56,
                    paddingHorizontal: 16
                  }}
                  dropdownIconColor={colors.placeholder}
                >
                  <Picker.Item 
                    label="Select State" 
                    value="" 
                    color={colors.placeholder}
                  />
                  {states.map((state) => (
                    <Picker.Item 
                      key={state} 
                      label={state} 
                      value={state} 
                      color={colors.text} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Additional Information */}
            <View>
              <Text style={{ 
                color: colors.text, 
                fontWeight: '600', 
                marginBottom: 8 
              }}>
                Additional Information
              </Text>
              <TextInput
                placeholder="Any other relevant details"
                placeholderTextColor={colors.placeholder}
                value={formData.additionalInfo}
                onChangeText={(text) => setFormData({...formData, additionalInfo: text})}
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: colors.cardBackground,
                  color: colors.text,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  padding: 16,
                  textAlignVertical: 'top'
                }}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                height: 56,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 24,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 3
              }}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600'
              }}>
                Complete Registration
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AcademicForm;