import { Ionicons } from '@expo/vector-icons';
import type { TranslationKey } from './i18n';

export type Tab = 'home' | 'session' | 'train' | 'coach' | 'profile';
export type Phase = 'ready' | 'active' | 'debrief';
export type GameState = 'A' | 'B' | 'C';
export type Module = 'war' | 'behavior' | 'gym' | 'lifestyle' | 'audio' | 'diary' | 'vaccines' | 'mindset' | 'rangeMemory' | 'attention';

export const moduleMeta: Record<Module, { titleKey: TranslationKey; subtitleKey: TranslationKey; icon: keyof typeof Ionicons.glyphMap }> = {
  war: { titleKey: 'module.war.title', subtitleKey: 'module.war.subtitle', icon: 'shield-half-outline' },
  behavior: { titleKey: 'module.behavior.title', subtitleKey: 'module.behavior.subtitle', icon: 'eye-outline' },
  gym: { titleKey: 'module.gym.title', subtitleKey: 'module.gym.subtitle', icon: 'flash-outline' },
  lifestyle: { titleKey: 'module.lifestyle.title', subtitleKey: 'module.lifestyle.subtitle', icon: 'fitness-outline' },
  audio: { titleKey: 'module.audio.title', subtitleKey: 'module.audio.subtitle', icon: 'headset-outline' },
  diary: { titleKey: 'module.diary.title', subtitleKey: 'module.diary.subtitle', icon: 'book-outline' },
  vaccines: { titleKey: 'module.vaccines.title', subtitleKey: 'module.vaccines.subtitle', icon: 'medical-outline' },
  mindset: { titleKey: 'module.mindset.title', subtitleKey: 'module.mindset.subtitle', icon: 'compass-outline' },
  rangeMemory: { titleKey: 'module.rangeMemory.title', subtitleKey: 'module.rangeMemory.subtitle', icon: 'grid-outline' },
  attention: { titleKey: 'module.attention.title', subtitleKey: 'module.attention.subtitle', icon: 'scan-outline' },
};
