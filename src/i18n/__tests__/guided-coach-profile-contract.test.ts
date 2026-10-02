import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const coach=fs.readFileSync(path.join(process.cwd(),'src/screens/CoachScreen.tsx'),'utf8');
const profile=fs.readFileSync(path.join(process.cwd(),'src/screens/ProfileScreen.tsx'),'utf8');

function expectInOrder(source:string,tokens:string[]){
 let cursor=-1;
 for(const token of tokens){
  const next=source.indexOf(token);
  expect(next, `missing token: ${token}`).toBeGreaterThan(-1);
  expect(next, `out of order: ${token}`).toBeGreaterThan(cursor);
  cursor=next;
 }
}

describe('contextual Coach and real Profile contract',()=>{
  it('keeps Coach context ordered and data-driven',()=>{
    expectInOrder(coach,["t('coach.contextReadiness')","t('coach.contextPhase')","t('coach.contextTrigger')","t('coach.contextTraining')","t('coach.contextHomeRecommendation')"]);
    expect(coach).toContain('usePerformance');
    expect(coach).toContain('calculateReadiness');
    expect(coach).not.toContain("t('coach.contextReadinessValue')");
  });
  it('keeps progressive disclosure and approved quick prompts',()=>{
    expect(coach).toContain('contextExpanded');
    for(const key of ["'coach.quick.accelerated'","'coach.quick.focus'","'coach.quick.tired'","'coach.quick.reset'"]) expect(coach).toContain(key);
  });
  it('orders Profile from base to evidence-backed evolution',()=>{
    expectInOrder(profile,["t('profile.base')","t('profile.evolution')","t('profile.development')","t('profile.patterns')","t('profile.history')","t('profile.settings')"]);
  });
  it('uses persisted sessions and baseline instead of fabricated metrics',()=>{
    expect(profile).toContain('sessions');
    expect(profile).toContain('baseline');
    expect(profile).toContain('developmentSnapshot');
    expect(profile).not.toContain('const hasEvolutionHistory=false');
    expect(profile).not.toContain('>125</Serif>');
    expect(profile).not.toContain('>88</Serif>');
  });
  it('keeps language and privacy under settings',()=>{
    const i=profile.indexOf("t('profile.settings')");
    expect(profile.indexOf("t('profile.language')")).toBeGreaterThan(i);
    expect(profile.indexOf("t('profile.privacy')")).toBeGreaterThan(i);
  });
});
