import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const AIPage = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#f8f9fa' }}>
      <Text style={{ color: isDark ? 'white' : 'black' }}>AI Features Page</Text>
    </View>
  );
};

export default AIPage;