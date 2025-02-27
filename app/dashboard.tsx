import React from "react";
import { View, Text } from "react-native";

export default function Dashboard() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2b2d42" }}>Dashboard</Text>
    </View>
  );
}
