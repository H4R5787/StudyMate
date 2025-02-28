import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '../../config/firebaseconfig';
import { useColorScheme } from 'react-native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Color configurations
  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    inputBorder: isDark ? '#333333' : '#E0E0E0',
    placeholder: isDark ? '#666666' : '#999999',
    errorBackground: isDark ? '#2D0B0B' : '#FEE2E2',
    errorText: isDark ? '#EF4444' : '#DC2626',
    successBackground: isDark ? '#0F2A1F' : '#D1FAE5',
    successText: isDark ? '#10B981' : '#059669',
  };

  const validateEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ 
          flex: 1, 
          padding: 24,
          maxWidth: 500,
          width: '100%',
          alignSelf: 'center'
        }}>
          {/* Header Section */}
          <View style={{ alignItems: 'center', marginVertical: 40 }}>
            <Ionicons 
              name="key" 
              size={60} 
              color={colors.primary} 
              style={{ marginBottom: 20 }}
            />
            <Text style={{
              fontSize: 28,
              fontWeight: '800',
              color: colors.text,
              marginBottom: 8
            }}>
              Reset Password
            </Text>
            <Text style={{
              fontSize: 16,
              color: colors.placeholder,
              textAlign: 'center'
            }}>
              Enter your email to receive a password reset link
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ marginBottom: 24 }}>
            {/* Email Input */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              paddingHorizontal: 16,
              marginBottom: 24,
              borderWidth: 2,
              borderColor: emailFocus ? colors.primary : colors.inputBorder
            }}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={emailFocus ? colors.primary : colors.placeholder} 
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Email address"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={{
                  flex: 1,
                  height: 56,
                  color: colors.text,
                  fontSize: 16,
                }}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                keyboardType="email-address"
              />
            </View>

            {/* Messages Container */}
            <View style={{ marginBottom: 16 }}>
              {/* Error Message */}
              {error ? (
                <View style={{
                  backgroundColor: colors.errorBackground,
                  padding: 16,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <Ionicons 
                    name="alert-circle" 
                    size={20} 
                    color={colors.errorText} 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ 
                    color: colors.errorText,
                    fontSize: 14,
                    flex: 1
                  }}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Success Message */}
              {success && (
                <View style={{
                  backgroundColor: colors.successBackground,
                  padding: 16,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={colors.successText} 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ 
                    color: colors.successText,
                    fontSize: 14,
                    flex: 1
                  }}>
                    Password reset email sent! Check your inbox.
                  </Text>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                height: 56,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 3
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600'
                }}>
                  Send Reset Instructions
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity 
              style={{ marginTop: 24 }}
              onPress={() => router.push('/Auth/login')}
            >
              <Text style={{
                color: colors.primary,
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;