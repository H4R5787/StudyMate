import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignup = () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please accept the terms & conditions');
      return;
    }
    // Add your signup logic here
    alert('Signup logic to be implemented');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 24,
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Header Section */}
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={{ width: 80, height: 80, marginBottom: 20 }}
          />
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#2b2d42',
            marginBottom: 10,
          }}>
            Create Account
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#4a4e69',
            textAlign: 'center',
          }}>
            Start your personalized learning journey
          </Text>
        </View>

        {/* Signup Form */}
        <View style={{ marginTop: 30 }}>
          {/* Name Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#4a4e69', marginBottom: 8 }}>Full Name</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: '#e9ecef',
            }}>
              <Ionicons name="person-outline" size={20} color="#4361ee" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                style={{ flex: 1, paddingVertical: 14 }}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#4a4e69', marginBottom: 8 }}>Email</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: '#e9ecef',
            }}>
              <Ionicons name="mail-outline" size={20} color="#4361ee" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={{ flex: 1, paddingVertical: 14 }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#4a4e69', marginBottom: 8 }}>Password</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: '#e9ecef',
            }}>
              <Ionicons name="lock-closed-outline" size={20} color="#4361ee" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1, paddingVertical: 14 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color="#4361ee" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: '#4a4e69', marginBottom: 8 }}>Confirm Password</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: '#e9ecef',
            }}>
              <Ionicons name="lock-closed-outline" size={20} color="#4361ee" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1, paddingVertical: 14 }}
              />
            </View>
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            <Ionicons 
              name={acceptedTerms ? 'checkbox' : 'square-outline'} 
              size={20} 
              color="#4361ee" 
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: '#4a4e69', fontSize: 14 }}>
              I agree to the{' '}
              <Text style={{ color: '#4361ee', fontWeight: '500' }}>
                Terms & Conditions
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Error Message */}
          {errorMessage ? (
            <Text style={{ color: '#e63946', marginTop: 15 }}>
              <Ionicons name="warning-outline" size={14} /> {errorMessage}
            </Text>
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 30 }}>
          {/* Signup Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#4361ee',
              padding: 16,
              borderRadius: 12,
              marginBottom: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleSignup}
          >
            <Ionicons name="person-add-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 16,
            }}>
              Create Account
            </Text>
          </TouchableOpacity>

          {/* Login Redirect */}
          <TouchableOpacity 
            style={{ flexDirection: 'row', justifyContent: 'center' }}
            onPress={() => alert('Navigate to login')}
          >
            <Text style={{ color: '#4a4e69' }}>Already have an account? </Text>
            <Text style={{ color: '#4361ee', fontWeight: '600' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}