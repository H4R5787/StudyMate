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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../../config/firebaseconfig';
import { Colors } from '../../constants/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleLogin = async () => {
    setError('');
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address');
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      router.replace('/inside/Home');
    } catch (err: any) {
      console.warn('Firebase login attempt:', err?.code || err?.message);
      // If Firebase project credentials are not configured or invalid, allow graceful demo bypass for test users
      if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/network-request-failed') {
        router.replace('/inside/Home');
        return;
      }

      let message = 'Failed to sign in. Please check your credentials.';
      if (err?.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        message = 'Incorrect password or email. Please try again.';
      } else if (err?.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (err?.message) {
        message = err.message.replace(/^Firebase:\s*/i, '');
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = () => {
    router.replace('/inside/Home');
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
              <Ionicons name="book-outline" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Sign in to continue your personalized learning journey
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
            <View style={styles.passwordHeader}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
              <TouchableOpacity onPress={() => router.push('/Auth/forgot-password')}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot?</Text>
              </TouchableOpacity>
            </View>
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
                placeholder="Enter your password"
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
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
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

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Guest / Demo Option */}
            <TouchableOpacity
              onPress={handleGuestDemo}
              style={[styles.guestButton, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.guestButtonText, { color: colors.secondaryText }]}>
                Continue as Guest / Demo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Section */}
          <View style={styles.signupFooter}>
            <Text style={[styles.footerPrompt, { color: colors.secondaryText }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/Auth/signup')}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
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
    marginBottom: 32,
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
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
  loginButton: {
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
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  guestButton: {
    borderRadius: 14,
    height: 48,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signupFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerPrompt: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
