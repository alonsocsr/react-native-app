import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  return (
    <View className="flex-1 items-center justify-center bg-pink-200 p-6">
      <Text className="text-3xl font-fblack text-pink-700">¡Bienvenido a tu Gestor de Compras!</Text>
      <StatusBar style="auto" />
      <Link href="/home" className="mt-4">
        <View className="bg-pink-600 py-2 px-4 rounded-full">
          <Text className="text-white text-lg">Ir al inicio</Text>
        </View>
      </Link>
    </View>
  );
}