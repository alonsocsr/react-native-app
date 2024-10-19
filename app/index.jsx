import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  return (
    <View className="flex-1 items-center justify-center bg-pink-200">
      <Text className="text-3xl font-fblack text-pink-700">Welcome!! This is Maia :)</Text>
      <StatusBar style="auto" />
      <Link href="/home" className="text-pink-600 text-lg mt-4" >Go to home</Link>
    </View>
  );
}