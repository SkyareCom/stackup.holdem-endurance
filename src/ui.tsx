import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { s } from './styles';

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

export function Serif({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[s.serif, style]}>{children}</Text>;
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
      <Text style={[s.buttonText, secondary && s.buttonTextSecondary, danger && s.buttonTextDanger]}>{label}</Text>
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
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </ImageBackground>
  );
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.header}>
      <View>
        <Text style={s.stackup}>STACKUP HOLD'EM</Text>
        <Serif style={s.headerTitle}>{title}</Serif>
        {subtitle ? <Text style={s.headerSub}>{subtitle}</Text> : null}
      </View>
      <View style={s.status}><View style={s.statusDot} /><Text style={s.statusText}>ACTIVE</Text></View>
    </View>
  );
}
