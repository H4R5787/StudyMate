import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>

    </Stack>
  )
}

// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="dashboard" />
//       <Stack.Screen name="Auth/login" />
//       <Stack.Screen name="Auth/signup" />
//     </Stack>
//   );
// }

// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import WelcomePage from "./index";
// import DashboardScreen from "./dashboard";
// import LoginScreen from "./Auth/login";

// const Stack = createStackNavigator();

// export default function RootLayout() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Welcome" component={WelcomePage} />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Dashboard" component={DashboardScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

