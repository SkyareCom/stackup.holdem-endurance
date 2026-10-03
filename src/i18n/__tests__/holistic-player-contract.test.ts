import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const contentSource=fs.readFileSync(path.join(process.cwd(),'src/content.ts'),'utf8');
const engine=fs.readFileSync(path.join(process.cwd(),'src/performanceEngine.ts'),'utf8');
const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');
const train=fs.readFileSync(path.join(process.cwd(),'src/screens/TrainScreen.tsx'),'utf8');
const profile=fs.readFileSync(path.join(process.cwd(),'src/screens/ProfileScreen.tsx'),'utf8');
const overlays=fs.readFileSync(path.join(process.cwd(),'src/overlays.tsx'),'utf8');

describe('holistic player development contract',()=>{
  it('covers the complete player-development map',()=>{
    for(const id of [
      'discipline','focus','consistency','resilience','attitude','decision-confidence',
      'patience','game-understanding','cordiality','logic','lifestyle'
    ]) expect(contentSource).toContain(`id: '${id}'`);
  });

  it('tracks lifestyle inputs without pretending they are medical diagnoses',()=>{
    for(const token of ['nutrition','hydration','physicalActivity','sleep']) expect(engine).toContain(token);
    expect(session).toContain("pregrind.lifestyle");
    expect(session).toContain("pregrind.sleep");
    expect(session).toContain("pregrind.nutrition");
    expect(session).toContain("pregrind.hydration");
    expect(session).toContain("pregrind.activity");
    for(const id of ["id: 'sleep'","id: 'nutrition'","id: 'hydration'","id: 'activity'"]) expect(contentSource).toContain(id);
  });

  it('captures process quality beyond financial result',()=>{
    for(const token of ['patience','decisionConfidence','professionalConduct','attitude','resilience','gameUnderstanding','logic']) {
      expect(engine).toContain(token);
      expect(session).toContain(token);
    }
  });

  it('shows development areas progressively instead of another dense dashboard',()=>{
    expect(train).toContain('developmentGroups');
    expect(train).toContain('selectedDevelopmentGroup');
    expect(profile).toContain('developmentSnapshot');
    expect(profile).toContain('baseline.confidence');
  });

  it('removes remaining fabricated runtime performance numbers',()=>{
    expect(session).not.toContain('02:47:18');
    expect(session).not.toContain("width:'43%'");
    expect(session).not.toContain('18:42 / 45:00');
    expect(train).not.toContain('title="74%"');
    expect(overlays).not.toContain('setReactionResult(284)');
  });
});
