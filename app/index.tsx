import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function WelcomePage() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa", padding: 24 }}>
      {/* Header Section */}
      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../assets/images/icon.png")} style={{ width: 120, height: 120, marginBottom: 30 }} />
        <Text style={{ fontSize: 32, fontWeight: "800", color: "#2b2d42", marginBottom: 10, textAlign: "center" }}>
          Study Mate AI
        </Text>
        <Text style={{ fontSize: 18, color: "#4a4e69", textAlign: "center", marginBottom: 20 }}>
          Your Personal AI-Powered Learning Companion
        </Text>
      </View>

      {/* Feature Highlights */}
      <View style={{ flex: 3, justifyContent: "space-evenly", marginVertical: 20 }}>
        <FeatureItem icon="rocket" title="AI-Powered Learning">Smart test generation and adaptive learning paths</FeatureItem>
        <FeatureItem icon="wifi-off" title="Offline Access">Full functionality without internet connection</FeatureItem>
        <FeatureItem icon="trending-up" title="Progress Tracking">Detailed analytics and performance insights</FeatureItem>
        <FeatureItem icon="person" title="Personalized Tests">Customized quizzes based on your learning patterns</FeatureItem>
      </View>

      {/* Action Buttons */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 30 }}>
        <ActionButton color="#4361ee" onPress={() => navigation.navigate("Auth/login")}>Get Started</ActionButton>

        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate("Auth/signup")}>
          <Text style={{ color: "#4361ee", textAlign: "center", fontWeight: "600" }}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Feature Highlight Component
const FeatureItem = ({ icon, title, children }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 8 }}>
    <Ionicons name={icon} size={24} color="#4361ee" style={{ marginRight: 15 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#2b2d42" }}>{title}</Text>
      <Text style={{ fontSize: 14, color: "#4a4e69" }}>{children}</Text>
    </View>
  </View>
);

// Reusable Button Component
const ActionButton = ({ children, color, onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: color,
      padding: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}
    onPress={onPress}
  >
    <Text style={{ color: "white", textAlign: "center", fontWeight: "600", fontSize: 16 }}>{children}</Text>
  </TouchableOpacity>
);
