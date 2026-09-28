import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Auth/login" />
        <Stack.Screen name="Auth/signup" />
        <Stack.Screen name="Auth/forgot-password" />
        <Stack.Screen name="Auth/form-ai" />
        <Stack.Screen name="inside/Home" />
        <Stack.Screen name="inside/profile" />
        <Stack.Screen name="inside/create-session" />
        <Stack.Screen name="inside/progress" />
        <Stack.Screen name="inside/ai-pages" />
        <Stack.Screen name="inside/recent-activities" />
        <Stack.Screen name="inside/progress/Mathematics" />
        <Stack.Screen name="inside/progress/Physics" />
        <Stack.Screen name="inside/progress/Chemistry" />
        <Stack.Screen name="inside/progress/Biology" />
        <Stack.Screen name="inside/activity/1" />
        <Stack.Screen name="inside/activity/2" />
        <Stack.Screen name="inside/activity/3" />
        <Stack.Screen name="inside/activity/4" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
