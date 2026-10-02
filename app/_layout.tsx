import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  KulimPark_400Regular_Italic,
  KulimPark_600SemiBold_Italic,
  KulimPark_700Bold_Italic,
} from '@expo-google-fonts/kulim-park';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    KulimPark_400Regular_Italic,
    KulimPark_600SemiBold_Italic,
    KulimPark_700Bold_Italic,
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
