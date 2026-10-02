import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider } from '../src/i18n';
import {
  useFonts,
  TitilliumWeb_400Regular_Italic,
  TitilliumWeb_600SemiBold_Italic,
  TitilliumWeb_700Bold_Italic,
} from '@expo-google-fonts/titillium-web';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    TitilliumWeb_400Regular_Italic,
    TitilliumWeb_600SemiBold_Italic,
    TitilliumWeb_700Bold_Italic,
  });

  if (!fontsLoaded) return null;

  return (
    <I18nProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </I18nProvider>
  );
}
