import { Ionicons } from '@expo/vector-icons';

export type Tab = 'home' | 'session' | 'train' | 'coach' | 'profile';
export type Phase = 'ready' | 'active' | 'debrief';
export type GameState = 'A' | 'B' | 'C';
export type Module = 'war' | 'behavior' | 'gym' | 'lifestyle' | 'audio' | 'diary' | 'vaccines' | 'mindset';

export const moduleMeta: Record<Module, { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }> = {
  war: { title: 'SALA DE GUERRA', subtitle: 'Anti-Tilt · Predição · Resiliência', icon: 'shield-half-outline' },
  behavior: { title: 'BEHAVIOR LAB', subtitle: 'Baseline · Tells · Timing · Contexto', icon: 'eye-outline' },
  gym: { title: 'MENTAL GYM', subtitle: 'Reaction · Memory · Attention · Reset', icon: 'flash-outline' },
  lifestyle: { title: 'PERFORMANCE', subtitle: 'Energy · Body · Recovery · Focus', icon: 'fitness-outline' },
  audio: { title: 'MENTAL AUDIO', subtitle: 'Playlists · Decision Cues · Break 4', icon: 'headset-outline' },
  diary: { title: 'BATTLE DIARY', subtitle: 'Auditoria de execução e estado', icon: 'book-outline' },
  vaccines: { title: 'VACINAS PSICOLÓGICAS', subtitle: 'Variância · Dessensibilização · Processo', icon: 'medical-outline' },
  mindset: { title: 'MINDSET', subtitle: 'Controle · Variância · Antifragilidade', icon: 'compass-outline' },
};
