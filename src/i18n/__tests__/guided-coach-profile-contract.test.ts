import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const coach = fs.readFileSync(path.join(process.cwd(), 'src/screens/CoachScreen.tsx'), 'utf8');
const profile = fs.readFileSync(path.join(process.cwd(), 'src/screens/ProfileScreen.tsx'), 'utf8');

function expectInOrder(source:string, tokens:string[]) {
  let cursor=-1;
  for (const token of tokens) {
    const next=source.indexOf(token);
    expect(next, `missing token: ${token}`).toBeGreaterThan(-1);
    expect(next, `out of order: ${token}`).toBeGreaterThan(cursor);
    cursor=next;
  }
}

describe('guided Coach and Profile contract', () => {
  it('shows the context Coach is using before chat', () => {
    expectInOrder(coach, [
      "t('coach.contextReadiness')",
      "t('coach.contextPhase')",
      "t('coach.contextTrigger')",
      "t('coach.contextTraining')",
      "t('coach.contextHomeRecommendation')",
    ]);
  });

  it('offers contextual quick prompts from the approved flow', () => {
    expect(coach).toContain("'coach.quick.accelerated'");
    expect(coach).toContain("'coach.quick.focus'");
    expect(coach).toContain("'coach.quick.tired'");
    expect(coach).toContain("'coach.quick.reset'");
    expect(coach).toContain("'coach.quick.review'");
  });

  it('keeps user-authored chat text raw across locale changes', () => {
    expect(coach).toContain("{role:'you',text:v}");
    expect(coach).toContain('<AppText style={s.chatText}>{m.text}</AppText>');
  });

  it('orders Profile as evolution, patterns, history, then settings', () => {
    expectInOrder(profile, [
      "t('profile.evolution')",
      "t('profile.patterns')",
      "t('profile.history')",
      "t('profile.settings')",
    ]);
  });

  it('keeps language, privacy and plan under settings', () => {
    const settingsIndex=profile.indexOf("t('profile.settings')");
    expect(settingsIndex).toBeGreaterThan(-1);
    expect(profile.indexOf("t('profile.language')")).toBeGreaterThan(settingsIndex);
    expect(profile.indexOf("t('profile.privacy')")).toBeGreaterThan(settingsIndex);
    expect(profile.indexOf("t('profile.plan')")).toBeGreaterThan(settingsIndex);
  });

  it('does not present fabricated evolution metrics before history exists', () => {
    expect(profile).toContain('const hasEvolutionHistory=false');
    expect(profile).toContain("t('profile.evolutionInsufficient')");
    expect(profile).toContain("t('profile.evolutionCollect')");
    expect(profile).not.toContain('>125</Serif>');
    expect(profile).not.toContain('>88</Serif>');
  });

  it('keeps Coach context honest when historical context is unavailable', () => {
    expect(coach).toContain("t('coach.contextNoHistory')");
    expect(coach).not.toContain("t('coach.contextBody')");
  });

  it('shows explicit insufficient-history copy for patterns when needed', () => {
    expect(profile).toContain("t('profile.patternsInsufficient')");
    expect(profile).toContain("t('profile.patternsCollect')");
  });
});
