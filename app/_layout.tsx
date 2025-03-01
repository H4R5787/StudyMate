
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Auth/login" />
      <Stack.Screen name="Auth/forgot-password" />
      <Stack.Screen name="Auth/signup" />
      <Stack.Screen name="Auth/form-ai" />
      <Stack.Screen name="inside/Home" /> 
      <Stack.Screen name="inside/profile" />
      <Stack.Screen name="inside/create-session" />
      <Stack.Screen name="inside/progress" />
      <Stack.Screen name="/inside/ai-pages" />

      

    
      
    </Stack>
  );
}
