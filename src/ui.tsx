import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
  type TextProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { s } from './styles';

const REGULAR_ITALIC = 'KulimPark_400Regular_Italic';
const SEMIBOLD_ITALIC = 'KulimPark_600SemiBold_Italic';
const BOLD_ITALIC = 'KulimPark_700Bold_Italic';

function resolveItalicFont(style: TextProps['style']) {
  const weight = StyleSheet.flatten(style)?.fontWeight;
  if (weight === 'bold') return BOLD_ITALIC;
  const numericWeight = typeof weight === 'number' ? weight : Number(weight);
  if (numericWeight >= 700) return BOLD_ITALIC;
  if (numericWeight >= 600) return SEMIBOLD_ITALIC;
  return REGULAR_ITALIC;
}

export function AppText({ style, ...props }: TextProps) {
  const fontFamily = resolveItalicFont(style);
  return <RNText {...props} style={[style, { fontFamily, fontStyle: 'normal' }]} />;
}

export function AppTextInput({ style, ...props }: TextInputProps) {
  return <RNTextInput {...props} style={[style, { fontFamily: REGULAR_ITALIC, fontStyle: 'normal' }]} />;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <AppText style={s.label}>{children}</AppText>;
}

export function Serif({ children, style }: { children: React.ReactNode; style?: any }) {
  return <AppText style={[s.serif, style]}>{children}</AppText>;
}

export function GoldRule() { return <View style={s.rule} />; }

export function PremiumButton({ label, onPress, secondary = false, danger = false, icon }: {
  label: string;
  onPress?: () => void;
  secondary?: boolean;
  danger?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.button, secondary ? s.buttonSecondary : s.buttonGold, danger && s.buttonDanger]}>
      {icon ? <Ionicons name={icon} size={16} color={danger ? C.ivory : secondary ? C.goldLight : C.ink} /> : null}
      <AppText style={[s.buttonText, secondary && s.buttonTextSecondary, danger && s.buttonTextDanger]}>{label}</AppText>
      {!icon ? <Ionicons name="chevron-forward" size={16} color={danger ? C.ivory : secondary ? C.goldLight : C.ink} /> : null}
    </TouchableOpacity>
  );
}

export function Backdrop({ uri, children, blur = 10, overlay = 0.78 }: {
  uri: string;
  children: React.ReactNode;
  blur?: number;
  overlay?: number;
}) {
  return (
    <ImageBackground source={{ uri }} blurRadius={blur} resizeMode="cover" style={s.backdrop}>
      <LinearGradient
        colors={[`rgba(8,7,5,${Math.min(overlay + 0.05, 0.96)})`, `rgba(25,18,11,${overlay})`, 'rgba(6,6,5,0.98)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </ImageBackground>
  );
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.header}>
      <View>
        <AppText style={s.stackup}>STACKUP HOLD'EM</AppText>
        <Serif style={s.headerTitle}>{title}</Serif>
        {subtitle ? <AppText style={s.headerSub}>{subtitle}</AppText> : null}
      </View>
      <View style={s.status}><View style={s.statusDot} /><AppText style={s.statusText}>ACTIVE</AppText></View>
    </View>
  );
}
