import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-pink-200">
      <Text className="text-3xl font-fblack text-pink-700">Welcome!! This is Maia :)</Text>
      <StatusBar style="auto" />
      <Link href="/home" className="text-pink-600">Go to home</Link>
    </View>
  );
}
