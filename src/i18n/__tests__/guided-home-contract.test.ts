import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const source=fs.readFileSync(path.join(process.cwd(),'src/screens/HomeScreen.tsx'),'utf8');

describe('action-first Home contract',()=>{
  it('keeps the visible journey minimal and ordered',()=>{
    const tokens=["t('home.stateToday')","t('home.nextAction')","t('home.decisionCue')"];
    const positions=tokens.map(x=>source.indexOf(x));
    expect(positions.every(x=>x>=0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a,b)=>a-b));
  });
  it('uses real persisted state instead of readiness fixtures',()=>{
    expect(source).toContain('latestCheckin');
    expect(source).toContain('calculateReadiness');
    expect(source).toContain('classifyTiltRisk');
    expect(source).toContain('deriveMentalState');
    expect(source).toContain('getSessionAction');
    expect(source).not.toContain('>82</Serif>');
    expect(source).not.toContain('>A-</Serif>');
  });
  it('shows an explicit no-data state before the first check-in',()=>{
    expect(source).toContain("t('home.noCheckinTitle')");
    expect(source).toContain("t('home.noCheckinBody')");
    expect(source).toContain("t('home.checkinNow')");
  });
  it('does not restore the old quick-card dashboard',()=>{
    expect(source).not.toContain('s.quickGrid');
    expect(source).not.toContain('s.quickCard');
  });
});
