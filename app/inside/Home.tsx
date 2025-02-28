import { View, Text, Button } from 'react-native';
import { auth } from '../../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

const Home = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/Auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome {auth.currentUser?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Home;