// import React from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import { useNavigation } from "expo-router";

// export default function Login() {
//   const navigation = useNavigation();

//   return (
//     <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8f9fa" }}>
//       <Text style={{ fontSize: 28, fontWeight: "bold", color: "#2b2d42", textAlign: "center", marginBottom: 20 }}>Login</Text>
      
//       <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
//       <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      
//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("dashboard")}>
//         <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Sign In</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate("Auth/signup")} style={{ marginTop: 10 }}>
//         <Text style={{ color: "#4361ee", textAlign: "center" }}>Don't have an account? Sign Up</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = {
//   input: { backgroundColor: "white", padding: 12, marginVertical: 8, borderRadius: 10, fontSize: 16 },
//   button: { backgroundColor: "#4361ee", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 10 }
// };


import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    // Add your authentication logic here
    if (email && password) {
      alert('Login logic to be implemented');
    } else {
      setErrorMessage('Please fill in all fields');
    }
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
            Welcome Back
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#4a4e69',
            textAlign: 'center',
          }}>
            Continue your AI-powered learning journey
          </Text>
        </View>

        {/* Login Form */}
        <View style={{ marginTop: 40 }}>
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
          <View style={{ marginBottom: 10 }}>
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
                placeholder="Enter your password"
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

          {/* Error Message */}
          {errorMessage ? (
            <Text style={{ color: '#e63946', marginTop: 8 }}>
              <Ionicons name="warning-outline" size={14} /> {errorMessage}
            </Text>
          ) : null}

          {/* Forgot Password */}
          <TouchableOpacity 
            style={{ alignSelf: 'flex-end', marginTop: 12 }}
            onPress={() => alert('Navigate to forgot password')}
          >
            <Text style={{ color: '#4361ee', fontWeight: '500' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 30 }}>
          {/* Login Button */}
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
            onPress={handleLogin}
          >
            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 16,
            }}>
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Continue as Guest */}
          <TouchableOpacity 
            style={{ marginTop: 15 }}
            onPress={() => alert('Continue offline')}
          >
            <Text style={{
              color: '#4361ee',
              textAlign: 'center',
              fontWeight: '600',
            }}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}