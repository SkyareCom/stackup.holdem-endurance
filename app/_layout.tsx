import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { I18nProvider } from '../src/i18n';
import { PerformanceProvider } from '../src/performanceStore';
import {
  useFonts,
  TitilliumWeb_400Regular_Italic,
  TitilliumWeb_600SemiBold_Italic,
  TitilliumWeb_700Bold_Italic,
} from '@expo-google-fonts/titillium-web';

if (Platform.OS !== 'web') void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular_Italic,
    TitilliumWeb_600SemiBold_Italic,
    TitilliumWeb_700Bold_Italic,
  });

  useEffect(() => {
    if (Platform.OS !== 'web' && (fontsLoaded || fontError)) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  const app = (
    <I18nProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </I18nProvider>
  );

  if (Platform.OS === 'web') return app;
  return <PerformanceProvider>{app}</PerformanceProvider>;
}
