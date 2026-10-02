import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { I18nProvider } from '../src/i18n';
import {
  useFonts,
  TitilliumWeb_400Regular_Italic,
  TitilliumWeb_600SemiBold_Italic,
  TitilliumWeb_700Bold_Italic,
} from '@expo-google-fonts/titillium-web';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular_Italic,
    TitilliumWeb_600SemiBold_Italic,
    TitilliumWeb_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <I18nProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </I18nProvider>
  );
}
