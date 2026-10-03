import type { TranslationKey } from './i18n';

export type ReadinessSnapshot = {
  energy: number;
  focus: number;
  tension: number;
};

export type GuidanceActionId = 'start-session' | 'lock-in' | 'break-4' | 'check-in' | 'reset';

export type GuidanceResult = {
  actionId: GuidanceActionId;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  reasonKey: TranslationKey;
};

const resetGuidance: GuidanceResult = {
  actionId: 'reset',
  titleKey: 'guidance.reset.title',
  bodyKey: 'guidance.reset.body',
  reasonKey: 'guidance.reset.reason',
};

export function getReadinessGuidance(snapshot: ReadinessSnapshot): GuidanceResult {
  if (snapshot.focus <= 2 || snapshot.tension >= 4) return resetGuidance;
  return {
    actionId: 'start-session',
    titleKey: 'guidance.start.title',
    bodyKey: 'guidance.start.body',
    reasonKey: 'guidance.start.reason',
  };
}

export function getHistoryGuidance(input: { hasHistory: boolean; thirdBlockDrop: boolean }): GuidanceResult | null {
  if (!input.hasHistory) return null;
  if (input.thirdBlockDrop) {
    return {
      actionId: 'break-4',
      titleKey: 'guidance.thirdBlock.title',
      bodyKey: 'guidance.thirdBlock.body',
      reasonKey: 'guidance.thirdBlock.reason',
    };
  }
  return null;
}
