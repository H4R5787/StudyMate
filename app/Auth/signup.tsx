import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, isFirebaseConfigured } from '../../config/firebaseconfig';
import { Colors } from '../../constants/theme';
import { ValidationUtils } from '../../utils/validation';
import { StorageService } from '../../services/storage';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const handleSignup = async () => {
    setError('');
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address');
      return;
    }
    if (!ValidationUtils.validateEmail(cleanEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    const pwdCheck = ValidationUtils.validatePassword(password);
    if (!pwdCheck.isValid) {
      setError(pwdCheck.error || 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // If Firebase backend is in demo mode (default local credentials)
    if (!isFirebaseConfigured) {
      await StorageService.saveProfile({ email: cleanEmail });
      setLoading(false);
      router.replace('/Auth/form-ai');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await StorageService.saveProfile({ email: cleanEmail });
      router.replace('/Auth/form-ai');
    } catch (err: any) {
      console.warn('Firebase signup error:', err?.code || err?.message);
      let message = 'Failed to create account. Please try again.';
      if (err?.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Try signing in.';
      } else if (err?.code === 'auth/weak-password') {
        message = 'Password is too weak. Include a mix of letters and numbers.';
      } else if (err?.code === 'auth/network-request-failed') {
        message = 'Network connection failed. Please check your internet connection.';
      } else if (err?.message) {
        message = err.message.replace(/^Firebase:\s*/i, '');
      }
      setError(message);
    } finally {
      setLoading(false);
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
          {/* Header Section */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="person-add-outline" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Start your personalized learning journey with StudyMate
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: emailFocus ? colors.primary : colors.border,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailFocus ? colors.primary : colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="name@example.com"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError('');
                }}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                style={[styles.inputField, { color: colors.text }]}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>

            {/* Password Input */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: passwordFocus ? colors.primary : colors.border,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordFocus ? colors.primary : colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="At least 6 characters"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={[styles.inputField, { color: colors.text }]}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm Password</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: confirmFocus ? colors.primary : colors.border,
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={confirmFocus ? colors.primary : colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Re-enter password"
                placeholderTextColor={colors.placeholder}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError('');
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                style={[styles.inputField, { color: colors.text }]}
                onFocus={() => setConfirmFocus(true)}
                onBlur={() => setConfirmFocus(false)}
                onSubmitEditing={handleSignup}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} style={{ marginRight: 8 }} />
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
              </View>
            ) : null}

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              style={[styles.signupButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Existing User Section */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.secondaryText }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/Auth/login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
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
    justifyContent: 'center',
  },
  contentWrapper: {
    maxWidth: 440,
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  eyeButton: {
    padding: 8,
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  signupButton: {
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});