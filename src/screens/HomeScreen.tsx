import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PHOTO, C } from '../theme';
import { Backdrop, GoldRule, Header, Label, Serif } from '../ui';
import { s } from '../styles';
import { Module } from '../types';

function Metric({ label, value }: { label: string; value: number }) {
  return <View style={s.metric}><View style={s.rowBetween}><Label>{label}</Label><AppText style={s.metricValue}>{value}/5</AppText></View><View style={s.track}><View style={[s.fill,{width:`${value*20}%`}]} /></View></View>;
}

export function HomeScreen({ startSession, openModule }: { startSession: () => void; openModule: (m: Module) => void }) {
  return (
    <Backdrop uri={PHOTO.focus}>
      <SafeAreaView style={s.flex}>
        <Header title="ENDURANCE" subtitle="DAILY PERFORMANCE" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.heroPanel}>
            <View style={s.rowBetweenTop}>
              <View style={s.flex}><Label>READINESS / TODAY</Label><Serif style={s.heroNumber}>82</Serif><AppText style={s.body}>Boa condição para volume. Atenção estável. Fadiga ainda baixa.</AppText></View>
              <View style={s.ring}><Serif style={s.grade}>A-</Serif><AppText style={s.ringLabel}>BASELINE</AppText></View>
            </View>
            <GoldRule /><Metric label="ENERGIA" value={4}/><Metric label="FOCO" value={4}/><Metric label="TENSÃO" value={2}/>
          </View>

          <TouchableOpacity style={s.primaryAction} onPress={startSession}>
            <View style={s.flex}><Label>PRIMARY ACTION</Label><Serif style={s.primaryTitle}>Iniciar sessão</Serif><AppText style={s.body}>Defina intenção. Proteja a primeira decisão antes de pensar no resultado.</AppText></View>
            <Ionicons name="arrow-forward" size={23} color={C.goldLight}/>
          </TouchableOpacity>

          <View style={s.intelligence}>
            <View style={s.rowBetween}><Label>TODAY'S INTELLIGENCE</Label><AppText style={s.goldText}>02:55 → 03:30</AppText></View>
            <Serif style={s.intelligenceTitle}>Proteja o terceiro bloco.</Serif>
            <AppText style={s.body}>Nas últimas sessões longas, seu foco caiu antes do cansaço subjetivo. Programe o reset antes da queda, não depois.</AppText>
          </View>

          <View style={s.quickGrid}>
            <TouchableOpacity style={s.quickCard} onPress={()=>openModule('audio')}><Ionicons name="headset-outline" size={24} color={C.goldLight}/><Label>MENTAL AUDIO</Label><Serif style={s.quickTitle}>LOCK IN</Serif><AppText style={s.quickCopy}>38 min · Focus</AppText></TouchableOpacity>
            <TouchableOpacity style={s.quickCard} onPress={()=>openModule('war')}><Ionicons name="analytics-outline" size={24} color={C.goldLight}/><Label>WAR ROOM</Label><Serif style={s.quickTitle}>Heatmap</Serif><AppText style={s.quickCopy}>Padrões · gatilhos</AppText></TouchableOpacity>
          </View>

          <View style={s.editorial}><Label>DECISION CUE</Label><Serif style={s.editorialText}>“Resultado anterior não participa desta decisão.”</Serif></View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}
