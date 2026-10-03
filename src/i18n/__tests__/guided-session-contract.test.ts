import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const source=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');

describe('sequential Session contract',()=>{
  it('uses a seven-step pre-grind wizard with mandatory activation and four journey stages',()=>{
    expect(source).toContain('wizardStep');
    expect(source).toContain('total={7}');
    expect(source).toContain("'pregrind.activation'");
    expect(source).toContain('activationUsed');
    expect(source).toContain('disabled={wizardStep===6&&!activationUsed}');
    expect(source).toContain('current={2}');
    expect(source).toContain('current={debriefStep+1}');
    expect(source).toContain('current={4}');
    expect(source).toContain('total={5}');
  });
  it('orders human state from sensations through reframe',()=>{
    for(const token of ["pregrind.sensations","pregrind.lifestyle","pregrind.feeling","pregrind.emotion","pregrind.reason","pregrind.reframe"]){
      expect(source).toContain(token);
    }
    expect(source).toContain('calculateReadiness');
    expect(source).toContain('classifyTiltRisk');
    expect(source).toContain('getRitualMinutes');
  });
  it('uses a real elapsed clock and no simulated audio progress',()=>{
    expect(source).toContain('Date.now()');
    expect(source).toContain('formatElapsed');
    expect(source).not.toContain('02:47:18');
    expect(source).not.toContain("width:'43%'");
    expect(source).not.toContain('18:42 / 45:00');
  });
  it('separates financial result from execution and finishes into recovery',()=>{
    expect(source).toContain('financialResult');
    expect(source).toContain('resultHidden');
    expect(source).toContain('gameQuality');
    expect(source).toContain('foldDiscipline');
    expect(source).toContain('finishSession');
    expect(source).toContain("setPhase('recovery')");
  });
});
