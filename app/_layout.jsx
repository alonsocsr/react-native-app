import { useEffect } from "react";
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Figtree-Black": require("../assets/fonts/Figtree-Black.ttf"),
    "Figtree-Bold": require("../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-ExtraBold": require("../assets/fonts/Figtree-ExtraBold.ttf"),
    "Figtree-Italic": require("../assets/fonts/Figtree-Italic.ttf"),
    "Figtree-Light": require("../assets/fonts/Figtree-Light.ttf"),
    "Figtree-Medium": require("../assets/fonts/Figtree-Medium.ttf"),
    "Figtree-Regular": require("../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-SemiBold": require("../assets/fonts/Figtree-SemiBold.ttf"),
  })

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout