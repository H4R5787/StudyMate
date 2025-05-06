import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';

const FormField = ({ 
  label, 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  colors,
  ...props 
}) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.label, { color: colors.secondaryText }]}>{label}</Text>
    <View style={[styles.inputContainer, { 
      backgroundColor: colors.cardBackground,
      borderColor: colors.border
    }]}>
      <Ionicons 
        name={icon} 
        size={20} 
        color={colors.primary} 
        style={{ marginRight: 12 }}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { color: colors.text }]}
        {...props}
      />
    </View>
  </View>
);

const CreateSession = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('individual');
  const [duration, setDuration] = useState({ hours: 1, minutes: 0 });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [sessionName, setSessionName] = useState('');

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
    placeholder: isDark ? '#666666' : '#999999',
  };

  const subjects = [
    'Mathematics', 
    'Physics', 
    'Chemistry', 
    'Biology', 
    'Computer Science'
  ];

  const handleCreateSession = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('inside/Home');
    }, 1500);
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true
      });
      if (!result.canceled) {
        setFiles([...files, ...result.assets]);
      }
    } catch (err) {
      console.error('Document picker error:', err);
    }
  };

  const formatDuration = () => {
    let time = '';
    if (duration.hours > 0) time += `${duration.hours}h `;
    if (duration.minutes > 0) time += `${duration.minutes}m`;
    return time || '0m';
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>New Study Session</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <FormField
            label="Session Name"
            icon="book-outline"
            placeholder="Enter session name"
            value={sessionName}
            onChangeText={setSessionName}
            colors={colors}
          />

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.secondaryText }]}>Subject</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.cardBackground }]}>
              <Picker
                selectedValue={subjects[0]}
                style={{ color: colors.text }}
                dropdownIconColor={colors.secondaryText}
              >
                {subjects.map(subject => (
                  <Picker.Item key={subject} label={subject} value={subject} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.secondaryText }]}>Duration</Text>
            <TouchableOpacity 
              style={[styles.durationButton, { backgroundColor: colors.cardBackground }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.durationText, { color: colors.text }]}>
                {formatDuration()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Mode</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                { 
                  backgroundColor: mode === 'individual' ? colors.primary : colors.cardBackground,
                  borderColor: colors.border
                }
              ]}
              onPress={() => setMode('individual')}
            >
              <Ionicons 
                name="person" 
                size={24} 
                color={mode === 'individual' ? 'white' : colors.primary} 
              />
              <Text style={[
                styles.modeText,
                { color: mode === 'individual' ? 'white' : colors.text }
              ]}>
                Individual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                { 
                  backgroundColor: mode === 'group' ? colors.primary : colors.cardBackground,
                  borderColor: colors.border
                }
              ]}
              onPress={() => setMode('group')}
            >
              <Ionicons 
                name="people" 
                size={24} 
                color={mode === 'group' ? 'white' : colors.primary} 
              />
              <Text style={[
                styles.modeText,
                { color: mode === 'group' ? 'white' : colors.text }
              ]}>
                Group Study
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Materials</Text>
          <TouchableOpacity 
            style={[styles.uploadButton, { borderColor: colors.border }]}
            onPress={pickDocuments}
          >
            <Ionicons name="attach" size={24} color={colors.primary} />
            <Text style={[styles.uploadText, { color: colors.text }]}>
              {files.length > 0 ? 
                `${files.length} files attached` : 
                'Attach study materials'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Session Notes</Text>
          <TextInput
            placeholder="Enter any specific notes or goals..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
            style={[styles.notesInput, { 
              color: colors.text,
              borderColor: colors.border
            }]}
          />
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateSession}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="add-circle" size={24} color="white" />
              <Text style={styles.createButtonText}>Create Session</Text>
            </>
          )}
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowTimePicker(false);
              if (selectedDate) {
                setDuration({
                  hours: selectedDate.getHours(),
                  minutes: selectedDate.getMinutes()
                });
              }
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

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
    fontSize: 24,
    fontWeight: '700'
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1
  },
  fieldContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1
  },
  input: {
    flex: 1,
    fontSize: 16
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: 'hidden'
  },
  durationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12
  },
  durationText: {
    fontSize: 16,
    fontWeight: '500'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500'
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12
  },
  uploadText: {
    fontSize: 16
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginTop: 24
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
};

export default CreateSession;
