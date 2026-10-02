import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const layout=fs.readFileSync(path.join(process.cwd(),'app/_layout.tsx'),'utf8');
const shell=fs.readFileSync(path.join(process.cwd(),'app/index.tsx'),'utf8');
const home=fs.readFileSync(path.join(process.cwd(),'src/screens/HomeScreen.tsx'),'utf8');
const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');
const profile=fs.readFileSync(path.join(process.cwd(),'src/screens/ProfileScreen.tsx'),'utf8');
const overlays=fs.readFileSync(path.join(process.cwd(),'src/overlays.tsx'),'utf8');

describe('ENDURANCE sequential performance journey',()=>{
  it('provides a persistent performance context to the whole app',()=>{
    expect(layout).toContain('PerformanceProvider');
    expect(shell).toContain('usePerformance');
  });

  it('does not show fabricated readiness on Home before a real check-in',()=>{
    expect(home).toContain('latestCheckin');
    expect(home).not.toContain('<Serif style={s.heroNumber}>82</Serif>');
    expect(home).not.toContain('<Serif style={s.grade}>A-</Serif>');
  });

  it('implements a sequential pre-grind wizard',()=>{
    expect(session).toContain('wizardStep');
    expect(session).toContain("pregrind.sensations");
    expect(session).toContain("pregrind.feeling");
    expect(session).toContain("pregrind.emotion");
    expect(session).toContain("pregrind.reason");
    expect(session).toContain("pregrind.reframe");
    expect(session).toContain('getRitualMinutes');
  });

  it('separates result from execution and persists a real debrief',()=>{
    expect(session).toContain('financialResult');
    expect(session).toContain('gameQuality');
    expect(session).toContain('foldDiscipline');
    expect(session).toContain('calculateMentalEv');
    expect(session).toContain('finishSession');
  });

  it('uses real history for Profile evolution and baseline confidence',()=>{
    expect(profile).toContain('sessions');
    expect(profile).toContain('baseline');
    expect(profile).toContain('confidence');
    expect(profile).not.toContain('const hasEvolutionHistory=false');
  });

  it('turns SOS into symptom -> intervention rather than a generic script',()=>{
    expect(overlays).toContain('getSOSProtocol');
    expect(overlays).toContain("sos.symptom");
    expect(overlays).toContain("sos.protocol");
  });
});
