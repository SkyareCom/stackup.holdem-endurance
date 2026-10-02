import type { TranslationKey } from './i18n';

export const mentalPlaylists = [
  { id: 'lock-in', titleKey: 'playlist.lockIn.title', duration: '38 MIN', modeKey: 'playlist.lockIn.mode', descriptionKey: 'playlist.lockIn.description', cueKey: 'playlist.lockIn.cue' },
  { id: 'a-game', titleKey: 'playlist.aGame.title', duration: '45 MIN', modeKey: 'playlist.aGame.mode', descriptionKey: 'playlist.aGame.description', cueKey: 'playlist.aGame.cue' },
  { id: 'discipline', titleKey: 'playlist.discipline.title', duration: '32 MIN', modeKey: 'playlist.discipline.mode', descriptionKey: 'playlist.discipline.description', cueKey: 'playlist.discipline.cue' },
  { id: 'long-grind', titleKey: 'playlist.longGrind.title', duration: '55 MIN', modeKey: 'playlist.longGrind.mode', descriptionKey: 'playlist.longGrind.description', cueKey: 'playlist.longGrind.cue' },
  { id: 'pressure', titleKey: 'playlist.pressure.title', duration: '28 MIN', modeKey: 'playlist.pressure.mode', descriptionKey: 'playlist.pressure.description', cueKey: 'playlist.pressure.cue' },
  { id: 'mental-fortress', titleKey: 'playlist.mentalFortress.title', duration: '34 MIN', modeKey: 'playlist.mentalFortress.mode', descriptionKey: 'playlist.mentalFortress.description', cueKey: 'playlist.mentalFortress.cue' },
  { id: 'cooldown', titleKey: 'playlist.cooldown.title', duration: '18 MIN', modeKey: 'playlist.cooldown.mode', descriptionKey: 'playlist.cooldown.description', cueKey: 'playlist.cooldown.cue' },
  { id: 'break-4', titleKey: 'playlist.break4.title', duration: '04:00', modeKey: 'playlist.break4.mode', descriptionKey: 'playlist.break4.description', cueKey: 'playlist.break4.cue' },
] as const satisfies readonly {
  id: string;
  titleKey: TranslationKey;
  duration: string;
  modeKey: TranslationKey;
  descriptionKey: TranslationKey;
  cueKey: TranslationKey;
}[];

export const processGoals = [
  { id: 'process', labelKey: 'session.goal.process' },
  { id: 'patience', labelKey: 'session.goal.patience' },
  { id: 'tempo', labelKey: 'session.goal.tempo' },
  { id: 'ranges', labelKey: 'session.goal.ranges' },
  { id: 'breaks', labelKey: 'session.goal.breaks' },
  { id: 'discipline', labelKey: 'session.goal.discipline' },
] as const satisfies readonly { id: string; labelKey: TranslationKey }[];

export type ProcessGoalId = (typeof processGoals)[number]['id'];

export const decisionCues: TranslationKey[] = [
  'cue.1',
  'cue.2',
  'cue.3',
  'cue.4',
  'cue.5',
  'cue.6',
  'cue.7',
  'cue.8',
];

export const diaryQuestions = [
  { id: 'q1', textKey: 'diary.q1' },
  { id: 'q2', textKey: 'diary.q2' },
  { id: 'q3', textKey: 'diary.q3' },
  { id: 'q4', textKey: 'diary.q4' },
  { id: 'q5', textKey: 'diary.q5' },
  { id: 'q6', textKey: 'diary.q6' },
] as const satisfies readonly { id: string; textKey: TranslationKey }[];

export const lifestyleSections = [
  { id: 'energy', titleKey: 'lifestyle.energy.title', subtitleKey: 'lifestyle.energy.subtitle', bodyKey: 'lifestyle.energy.body' },
  { id: 'body', titleKey: 'lifestyle.body.title', subtitleKey: 'lifestyle.body.subtitle', bodyKey: 'lifestyle.body.body' },
  { id: 'recovery', titleKey: 'lifestyle.recovery.title', subtitleKey: 'lifestyle.recovery.subtitle', bodyKey: 'lifestyle.recovery.body' },
  { id: 'focus', titleKey: 'lifestyle.focus.title', subtitleKey: 'lifestyle.focus.subtitle', bodyKey: 'lifestyle.focus.body' },
] as const satisfies readonly { id: string; titleKey: TranslationKey; subtitleKey: TranslationKey; bodyKey: TranslationKey }[];

export const tellLessons = [
  { id: 'baseline', titleKey: 'tell.baseline.title', bodyKey: 'tell.baseline.body' },
  { id: 'frozen', titleKey: 'tell.frozen.title', bodyKey: 'tell.frozen.body' },
  { id: 'timing', titleKey: 'tell.timing.title', bodyKey: 'tell.timing.body' },
  { id: 'posture', titleKey: 'tell.posture.title', bodyKey: 'tell.posture.body' },
] as const satisfies readonly { id: string; titleKey: TranslationKey; bodyKey: TranslationKey }[];

export const stoicPrinciples = [
  { id: 'control', titleKey: 'stoic.control.title', bodyKey: 'stoic.control.body' },
  { id: 'variance', titleKey: 'stoic.variance.title', bodyKey: 'stoic.variance.body' },
  { id: 'antifragility', titleKey: 'stoic.antifragility.title', bodyKey: 'stoic.antifragility.body' },
  { id: 'process', titleKey: 'stoic.process.title', bodyKey: 'stoic.process.body' },
] as const satisfies readonly { id: string; titleKey: TranslationKey; bodyKey: TranslationKey }[];

export const warRoomTriggers = [
  { id: 'bad-beat', labelKey: 'trigger.badBeat' },
  { id: 'own-error', labelKey: 'trigger.ownError' },
  { id: 'anger', labelKey: 'trigger.anger' },
  { id: 'rush', labelKey: 'trigger.rush' },
  { id: 'fear', labelKey: 'trigger.fear' },
  { id: 'euphoria', labelKey: 'trigger.euphoria' },
  { id: 'fatigue', labelKey: 'trigger.fatigue' },
  { id: 'autopilot', labelKey: 'trigger.autopilot' },
] as const satisfies readonly { id: string; labelKey: TranslationKey }[];

export type WarRoomTriggerId = (typeof warRoomTriggers)[number]['id'];
