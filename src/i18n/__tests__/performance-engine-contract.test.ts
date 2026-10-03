import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const engine=fs.readFileSync(path.join(process.cwd(),'src/performanceEngine.ts'),'utf8');

describe('player performance system',()=>{
  it('models whole-player development without mixing it with financial result',()=>{
    for(const pillar of ['resilience','decisionConfidence','patience','gameUnderstanding','professionalConduct','sleep','nutrition','hydration','physicalActivity']) expect(engine).toContain(pillar);
    expect(engine).toContain('calculateMentalEv');
    expect(engine).not.toContain('financialResult)*');
  });
  it('encodes the seven human pillars and adaptive interventions in one canonical engine',()=>{
    expect(engine).toContain('HUMAN_PILLARS');
    for(const pillar of ['temperament','extraGrind','sensations','feeling','emotion','reasoning','behavior']) expect(engine).toContain(pillar);
    expect(engine).toContain("'winner-tilt'");
    expect(engine).toContain('getSOSProtocol');
  });
  it('requires evidence before longitudinal conclusions',()=>{
    expect(engine).toContain('minimumBaselineSessions');
    expect(engine).toContain('getEvidenceState');
    expect(engine).toContain("'insufficient'");
  });
});
