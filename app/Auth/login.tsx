import React, { useState } from 'react';
import { View, TextInput, Text, ActivityIndicator, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '../../config/firebaseconfig';
import { useColorScheme } from 'react-native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  
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
  };

  const validateEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const handleLogin = async () => {
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/inside/Home');
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
              name="book" 
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
              Welcome Back
            </Text>
            <Text style={{
              fontSize: 16,
              color: colors.placeholder,
              textAlign: 'center'
            }}>
              Sign in to continue your learning journey
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
              marginBottom: 16,
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

            {/* Password Input */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              paddingHorizontal: 16,
              marginBottom: 24,
              borderWidth: 2,
              borderColor: passwordFocus ? colors.primary : colors.inputBorder
            }}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={passwordFocus ? colors.primary : colors.placeholder} 
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  flex: 1,
                  height: 56,
                  color: colors.text,
                  fontSize: 16,
                }}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
            </View>

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

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
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
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={{ marginTop: 16 }}
              onPress={() => router.push('/Auth/forgot-password')}
            >
              <Text style={{
                color: colors.primary,
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Section */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            marginTop: 24 
          }}>
            <Text style={{ 
              color: colors.placeholder,
              marginRight: 4 
            }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/Auth/signup')}>
              <Text style={{ 
                color: colors.primary,
                fontWeight: '600'
              }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
