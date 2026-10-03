import type { TranslationKey } from './i18n';

export const mentalPlaylists = [
  { id: 'lock-in', titleKey: 'playlist.lockIn.title', duration: '38 MIN', modeKey: 'playlist.lockIn.mode', objectiveKey:'playlist.lockIn.objective', bestMomentKey:'playlist.lockIn.bestMoment', descriptionKey: 'playlist.lockIn.description', cueKey: 'playlist.lockIn.cue' },
  { id: 'a-game', titleKey: 'playlist.aGame.title', duration: '45 MIN', modeKey: 'playlist.aGame.mode', objectiveKey:'playlist.aGame.objective', bestMomentKey:'playlist.aGame.bestMoment', descriptionKey: 'playlist.aGame.description', cueKey: 'playlist.aGame.cue' },
  { id: 'discipline', titleKey: 'playlist.discipline.title', duration: '32 MIN', modeKey: 'playlist.discipline.mode', objectiveKey:'playlist.discipline.objective', bestMomentKey:'playlist.discipline.bestMoment', descriptionKey: 'playlist.discipline.description', cueKey: 'playlist.discipline.cue' },
  { id: 'long-grind', titleKey: 'playlist.longGrind.title', duration: '55 MIN', modeKey: 'playlist.longGrind.mode', objectiveKey:'playlist.longGrind.objective', bestMomentKey:'playlist.longGrind.bestMoment', descriptionKey: 'playlist.longGrind.description', cueKey: 'playlist.longGrind.cue' },
  { id: 'pressure', titleKey: 'playlist.pressure.title', duration: '28 MIN', modeKey: 'playlist.pressure.mode', objectiveKey:'playlist.pressure.objective', bestMomentKey:'playlist.pressure.bestMoment', descriptionKey: 'playlist.pressure.description', cueKey: 'playlist.pressure.cue' },
  { id: 'mental-fortress', titleKey: 'playlist.mentalFortress.title', duration: '34 MIN', modeKey: 'playlist.mentalFortress.mode', objectiveKey:'playlist.mentalFortress.objective', bestMomentKey:'playlist.mentalFortress.bestMoment', descriptionKey: 'playlist.mentalFortress.description', cueKey: 'playlist.mentalFortress.cue' },
  { id: 'cooldown', titleKey: 'playlist.cooldown.title', duration: '18 MIN', modeKey: 'playlist.cooldown.mode', objectiveKey:'playlist.cooldown.objective', bestMomentKey:'playlist.cooldown.bestMoment', descriptionKey: 'playlist.cooldown.description', cueKey: 'playlist.cooldown.cue' },
  { id: 'break-4', titleKey: 'playlist.break4.title', duration: '04:00', modeKey: 'playlist.break4.mode', objectiveKey:'playlist.break4.objective', bestMomentKey:'playlist.break4.bestMoment', descriptionKey: 'playlist.break4.description', cueKey: 'playlist.break4.cue' },
] as const satisfies readonly {
  id: string;
  titleKey: TranslationKey;
  duration: string;
  modeKey: TranslationKey;
  objectiveKey: TranslationKey;
  bestMomentKey: TranslationKey;
  descriptionKey: TranslationKey;
  cueKey: TranslationKey;
}[];

export const processGoals = [
  { id: 'process', labelKey: 'session.goal.process', descriptionKey: 'session.goal.process.body' },
  { id: 'patience', labelKey: 'session.goal.patience', descriptionKey: 'session.goal.patience.body' },
  { id: 'tempo', labelKey: 'session.goal.tempo', descriptionKey: 'session.goal.tempo.body' },
  { id: 'ranges', labelKey: 'session.goal.ranges', descriptionKey: 'session.goal.ranges.body' },
  { id: 'breaks', labelKey: 'session.goal.breaks', descriptionKey: 'session.goal.breaks.body' },
  { id: 'discipline', labelKey: 'session.goal.discipline', descriptionKey: 'session.goal.discipline.body' },
] as const satisfies readonly { id: string; labelKey: TranslationKey; descriptionKey: TranslationKey }[];

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
  { id: 'sleep', titleKey: 'lifestyle.sleep.title', subtitleKey: 'lifestyle.sleep.subtitle', bodyKey: 'lifestyle.sleep.body' },
  { id: 'nutrition', titleKey: 'lifestyle.nutrition.title', subtitleKey: 'lifestyle.nutrition.subtitle', bodyKey: 'lifestyle.nutrition.body' },
  { id: 'hydration', titleKey: 'lifestyle.hydration.title', subtitleKey: 'lifestyle.hydration.subtitle', bodyKey: 'lifestyle.hydration.body' },
  { id: 'activity', titleKey: 'lifestyle.activity.title', subtitleKey: 'lifestyle.activity.subtitle', bodyKey: 'lifestyle.activity.body' },
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
  { id: 'revenge', labelKey: 'trigger.revenge' },
  { id: 'personal', labelKey: 'trigger.personal' },
] as const satisfies readonly { id: string; labelKey: TranslationKey }[];

export type WarRoomTriggerId = (typeof warRoomTriggers)[number]['id'];

export const heatmapIntensityLegend = [
  { id:'low', labelKey:'heatmap.intensity.low' },
  { id:'moderate', labelKey:'heatmap.intensity.moderate' },
  { id:'high', labelKey:'heatmap.intensity.high' },
  { id:'critical', labelKey:'heatmap.intensity.critical' },
] as const satisfies readonly { id:'low'|'moderate'|'high'|'critical'; labelKey:TranslationKey }[];

export const emotionalHeatmapBuckets = [
  { id:'0-45', labelKey:'heatmap.window.0_45', intensityKey:'heatmap.intensity.low', triggerKeys:[] },
  { id:'45-90', labelKey:'heatmap.window.45_90', intensityKey:'heatmap.intensity.moderate', triggerKeys:['trigger.rush'] },
  { id:'90-135', labelKey:'heatmap.window.90_135', intensityKey:'heatmap.intensity.high', triggerKeys:['trigger.fatigue'] },
  { id:'135-180', labelKey:'heatmap.window.135_180', intensityKey:'heatmap.intensity.critical', triggerKeys:['trigger.fatigue','trigger.rush'] },
  { id:'180-plus', labelKey:'heatmap.window.180_plus', intensityKey:'heatmap.intensity.high', triggerKeys:['trigger.fatigue','trigger.autopilot'] },
] as const satisfies readonly {
  id:string;
  labelKey:TranslationKey;
  intensityKey:TranslationKey;
  triggerKeys:readonly TranslationKey[];
}[];

export const trainingGroups = [
  {
    id: 'control',
    titleKey: 'train.group.control.title',
    descriptionKey: 'train.group.control.description',
    moduleIds: ['war','vaccines','mindset'],
    modules: [
      { id:'war', whatKey:'module.war.what', whenKey:'module.war.when', durationKey:'module.war.duration' },
      { id:'vaccines', whatKey:'module.vaccines.what', whenKey:'module.vaccines.when', durationKey:'module.vaccines.duration' },
      { id:'mindset', whatKey:'module.mindset.what', whenKey:'module.mindset.when', durationKey:'module.mindset.duration' },
    ],
  },
  {
    id: 'reading',
    titleKey: 'train.group.reading.title',
    descriptionKey: 'train.group.reading.description',
    moduleIds: ['behavior'],
    modules: [
      { id:'behavior', whatKey:'module.behavior.what', whenKey:'module.behavior.when', durationKey:'module.behavior.duration' },
    ],
  },
  {
    id: 'focus',
    titleKey: 'train.group.focus.title',
    descriptionKey: 'train.group.focus.description',
    moduleIds: ['gym'],
    modules: [
      { id:'gym', whatKey:'module.gym.what', whenKey:'module.gym.when', durationKey:'module.gym.duration' },
    ],
  },
  {
    id: 'performance',
    titleKey: 'train.group.performance.title',
    descriptionKey: 'train.group.performance.description',
    moduleIds: ['lifestyle'],
    modules: [
      { id:'lifestyle', whatKey:'module.lifestyle.what', whenKey:'module.lifestyle.when', durationKey:'module.lifestyle.duration' },
    ],
  },
  {
    id: 'audio',
    titleKey: 'train.group.audio.title',
    descriptionKey: 'train.group.audio.description',
    moduleIds: ['audio'],
    modules: [
      { id:'audio', whatKey:'module.audio.what', whenKey:'module.audio.when', durationKey:'module.audio.duration' },
    ],
  },
] as const satisfies readonly {
  id: import('./types').TrainingGroupId;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  moduleIds: readonly import('./types').Module[];
  modules: readonly {
    id: import('./types').Module;
    whatKey: TranslationKey;
    whenKey: TranslationKey;
    durationKey: TranslationKey;
  }[];
}[];


export const moduleIntroById = {
  war: { whatKey:'module.war.what', whenKey:'module.war.when', durationKey:'module.war.duration' },
  vaccines: { whatKey:'module.vaccines.what', whenKey:'module.vaccines.when', durationKey:'module.vaccines.duration' },
  mindset: { whatKey:'module.mindset.what', whenKey:'module.mindset.when', durationKey:'module.mindset.duration' },
  behavior: { whatKey:'module.behavior.what', whenKey:'module.behavior.when', durationKey:'module.behavior.duration' },
  gym: { whatKey:'module.gym.what', whenKey:'module.gym.when', durationKey:'module.gym.duration' },
  lifestyle: { whatKey:'module.lifestyle.what', whenKey:'module.lifestyle.when', durationKey:'module.lifestyle.duration' },
  audio: { whatKey:'module.audio.what', whenKey:'module.audio.when', durationKey:'module.audio.duration' },
  diary: { whatKey:'module.diary.what', whenKey:'module.diary.when', durationKey:'module.diary.duration' },
} as const satisfies Record<import('./types').Module, {
  whatKey: TranslationKey;
  whenKey: TranslationKey;
  durationKey: TranslationKey;
}>;


export const developmentGroups = [
  { id: 'discipline', titleKey: 'development.discipline.title', bodyKey: 'development.discipline.body' },
  { id: 'focus', titleKey: 'development.focus.title', bodyKey: 'development.focus.body' },
  { id: 'consistency', titleKey: 'development.consistency.title', bodyKey: 'development.consistency.body' },
  { id: 'resilience', titleKey: 'development.resilience.title', bodyKey: 'development.resilience.body' },
  { id: 'attitude', titleKey: 'development.attitude.title', bodyKey: 'development.attitude.body' },
  { id: 'decision-confidence', titleKey: 'development.decisionConfidence.title', bodyKey: 'development.decisionConfidence.body' },
  { id: 'patience', titleKey: 'development.patience.title', bodyKey: 'development.patience.body' },
  { id: 'game-understanding', titleKey: 'development.gameUnderstanding.title', bodyKey: 'development.gameUnderstanding.body' },
  { id: 'cordiality', titleKey: 'development.cordiality.title', bodyKey: 'development.cordiality.body' },
  { id: 'logic', titleKey: 'development.logic.title', bodyKey: 'development.logic.body' },
  { id: 'lifestyle', titleKey: 'development.lifestyle.title', bodyKey: 'development.lifestyle.body' },
] as const satisfies readonly { id:string; titleKey:TranslationKey; bodyKey:TranslationKey }[];
