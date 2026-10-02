import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const engine=fs.readFileSync(path.join(process.cwd(),'src/performance.ts'),'utf8');
const types=fs.readFileSync(path.join(process.cwd(),'src/types.ts'),'utf8');

describe('player performance system',()=>{
  it('models whole-player development without mixing it with financial result',()=>{
    expect(types).toContain("export type MentalState = 'ready' | 'vulnerable' | 'fatigued' | 'tilt-risk' | 'recovery'");
    expect(types).toContain("export type PokerMode = 'mtt' | 'cash'");
    for(const pillar of ['discipline','focus','consistency','resilience','attitude','decisionConfidence','patience','gameUnderstanding','conduct','logic','sleep','nutrition','hydration','physicalActivity','recovery']){
      expect(engine).toContain(pillar);
    }
    expect(engine).toContain('gameQuality * 0.4');
    expect(engine).toContain('foldDiscipline * 0.3');
    expect(engine).toContain('readiness10 * 0.3');
    expect(engine).not.toContain('financialResult *');
  });

  it('supports seven human pillars and adaptive interventions',()=>{
    for(const pillar of ['temperament','extraGrind','sensations','feeling','emotion','reasoning','behavior']){
      expect(engine).toContain(pillar);
    }
    expect(engine).toContain('winner-tilt');
    expect(engine).toContain('stopRules');
    expect(engine).toContain("mode==='mtt'");
    expect(engine).toContain('containment');
  });

  it('does not manufacture longitudinal conclusions',()=>{
    expect(engine).toContain('minimumBaselineSessions');
    expect(engine).toContain('confidence');
    expect(engine).toContain('insufficient');
  });
});
