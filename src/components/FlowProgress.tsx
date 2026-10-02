import React from 'react';
import { View } from 'react-native';
import { AppText, Label } from '../ui';
import { s } from '../styles';

export function FlowProgress({ current, total, label }: { current:number; total:number; label:string }) {
  const width = `${Math.max(0, Math.min(100, (current / total) * 100))}%`;
  return (
    <View style={s.flowProgress}>
      <View style={s.rowBetween}>
        <Label>{label.toUpperCase()}</Label>
        <AppText style={s.flowCount}>{current}/{total}</AppText>
      </View>
      <View style={s.flowTrack}><View style={[s.flowFill,{width}]}/></View>
    </View>
  );
}
