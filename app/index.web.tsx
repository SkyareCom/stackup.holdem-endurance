import React from 'react';
import { Platform, Text, View } from 'react-native';
import Index from './index';

export default function WebEntry() {
  if (Platform.OS !== 'web') return <Index />;
  return (
    <View style={{ flex: 1, minHeight: '100vh' as any, backgroundColor: '#090806', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: '#E0C995', fontSize: 24, fontWeight: '700' }}>STACKUP HOLD’EM</Text>
      <Text style={{ color: '#F0E8D7', fontSize: 34, marginTop: 8 }}>ENDURANCE</Text>
      <Text style={{ color: '#A79B87', fontSize: 14, marginTop: 18 }}>WEB RUNTIME OK</Text>
    </View>
  );
}
