import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';

export function ProfileScreen({ openDiary }: { openDiary:()=>void }) {
  return <Backdrop uri={PHOTO.focus} blur={14} overlay={0.88}><SafeAreaView style={s.flex}><Header title="PROFILE" subtitle="STACKUP ID"/><ScrollView contentContainerStyle={s.scroll}><View style={s.lead}><Label>PROGRESSION</Label><Serif style={s.profileLevel}>LEVEL 12</Serif><Text style={s.body}>4 semanas de consistência · 18 sessões registradas</Text><View style={s.track}><View style={[s.fill,{width:'68%'}]}/></View></View><View style={s.stats}><View style={s.stat}><Label>SESSIONS</Label><Serif style={s.statValue}>125</Serif><Text style={s.goldText}>+8 this month</Text></View><View style={s.stat}><Label>DISCIPLINE</Label><Serif style={s.statValue}>88</Serif><Text style={s.goldText}>+6%</Text></View></View><View style={s.panel}><Label>PLAN</Label><Serif style={s.plan}>ENDURANCE EDGE</Serif><Text style={s.body}>Coach contextual, histórico completo, Mental Playlists e Session Engine.</Text><PremiumButton label="VER ENDURANCE FULL" secondary/></View><TouchableOpacity style={s.settingRow} onPress={openDiary}><Ionicons name="book-outline" size={20} color={C.goldLight}/><View style={s.flex}><Text style={s.settingTitle}>Battle Diary</Text><Text style={s.settingSub}>Auditoria pós-sessão e histórico</Text></View><Ionicons name="chevron-forward" size={18} color={C.dim}/></TouchableOpacity><View style={s.settingRow}><Ionicons name="shield-checkmark-outline" size={20} color={C.goldLight}/><View style={s.flex}><Text style={s.settingTitle}>Privacidade</Text><Text style={s.settingSub}>Áudio, memória e dados comportamentais</Text></View><Ionicons name="chevron-forward" size={18} color={C.dim}/></View></ScrollView></SafeAreaView></Backdrop>;
}
