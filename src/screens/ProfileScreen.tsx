import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';

export function ProfileScreen({ openDiary }: { openDiary:()=>void }) {
  return <Backdrop uri={PHOTO.focus} blur={14} overlay={0.88}><SafeAreaView style={s.flex}><Header title="PROFILE" subtitle="STACKUP ID"/><ScrollView contentContainerStyle={s.scroll}><View style={s.lead}><Label>PROGRESSION</Label><Serif style={s.profileLevel}>LEVEL 12</Serif><AppText style={s.body}>4 semanas de consistência · 18 sessões registradas</AppText><View style={s.track}><View style={[s.fill,{width:'68%'}]}/></View></View><View style={s.stats}><View style={s.stat}><Label>SESSIONS</Label><Serif style={s.statValue}>125</Serif><AppText style={s.goldText}>+8 this month</AppText></View><View style={s.stat}><Label>DISCIPLINE</Label><Serif style={s.statValue}>88</Serif><AppText style={s.goldText}>+6%</AppText></View></View><View style={s.panel}><Label>PLAN</Label><Serif style={s.plan}>ENDURANCE EDGE</Serif><AppText style={s.body}>Coach contextual, histórico completo, Mental Playlists e Session Engine.</AppText><PremiumButton label="VER ENDURANCE FULL" secondary/></View><TouchableOpacity style={s.settingRow} onPress={openDiary}><Ionicons name="book-outline" size={20} color={C.goldLight}/><View style={s.flex}><AppText style={s.settingTitle}>Battle Diary</AppText><AppText style={s.settingSub}>Auditoria pós-sessão e histórico</AppText></View><Ionicons name="chevron-forward" size={18} color={C.dim}/></TouchableOpacity><View style={s.settingRow}><Ionicons name="shield-checkmark-outline" size={20} color={C.goldLight}/><View style={s.flex}><AppText style={s.settingTitle}>Privacidade</AppText><AppText style={s.settingSub}>Áudio, memória e dados comportamentais</AppText></View><Ionicons name="chevron-forward" size={18} color={C.dim}/></View></ScrollView></SafeAreaView></Backdrop>;
}
