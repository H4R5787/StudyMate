// AIzaSyB30fk258h-X8xEojAk8HCevUU405EqDRk

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AIPage = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);

  const API_KEY = 'AIzaSyB30fk258h-X8xEojAk8HCevUU405EqDRk';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Color theme configuration
  const theme = {
    dark: {
      background: '#121212',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      primary: '#BB86FC',
      secondary: '#03DAC6',
      error: '#CF6679',
    },
    light: {
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#000000',
      primary: '#6200EE',
      secondary: '#03DAC6',
      error: '#B00020',
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setError('');
    
    try {
      // Add user message to history
      setMessages(prev => [...prev, {
        role: 'user',
        content: query,
        timestamp: new Date().toISOString()
      }]);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }]
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        throw new Error('No valid response from AI');
      }

      // Add AI response to history
      setMessages(prev => [...prev, {
        role: 'ai',
        content: responseText,
        timestamp: new Date().toISOString()
      }]);

      setQuery('');
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollViewRef = React.useRef();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: currentTheme.primary }]}>
          AI Assistant
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.text }]}>
          How can I help you today?
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => {
          if (!hasScrolled || messages.length % 2 === 0) {
            scrollViewRef.current.scrollToEnd({ animated: true });
            setHasScrolled(true);
          }
        }}
      >
        {messages.map((msg, index) => (
          <View
            key={msg.timestamp}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              {
                backgroundColor: msg.role === 'user'
                  ? currentTheme.primary
                  : currentTheme.surface,
              }
            ]}
          >
            <Text style={[
              styles.messageText,
              {
                color: msg.role === 'user' ? '#FFFFFF' : currentTheme.text,
              }
            ]}>
              {msg.content}
            </Text>
            {msg.role === 'ai' && loading && index === messages.length - 1 && (
              <ActivityIndicator color={currentTheme.text} style={styles.typingIndicator} />
            )}
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.surface,
                color: currentTheme.text,
                borderColor: error ? currentTheme.error : currentTheme.surface,
              }
            ]}
            placeholder="Type your message..."
            placeholderTextColor={currentTheme.text + '88'}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            multiline
            editable={!loading}
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmit}
            disabled={loading || !query.trim()}
          >
            <Icon
              name={loading ? 'hourglass-top' : 'send'}
              size={24}
              color={currentTheme.primary}
            />
          </TouchableOpacity>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color={currentTheme.error} />
            <Text style={[styles.errorText, { color: currentTheme.error }]}>
              {error}
            </Text>
          </View>
        )}

        <Text style={[styles.charCount, { color: currentTheme.text + '88' }]}>
          {query.length}/500
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 4,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 8,
  },
  typingIndicator: {
    marginTop: 8,
  },
});

export default AIPage;