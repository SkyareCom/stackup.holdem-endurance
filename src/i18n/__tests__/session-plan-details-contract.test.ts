import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const engine=fs.readFileSync(path.join(process.cwd(),'src/performanceEngine.ts'),'utf8');
const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');

describe('session planning details contract',()=>{
  it('stores expected duration and optional stakes separately from stop rules',()=>{
    expect(engine).toContain('expectedMinutes:number');
    expect(engine).toContain('stakesLabel?:string');
    expect(session).toContain('expectedMinutes');
    expect(session).toContain('stakesLabel');
  });

  it('keeps plan details behind progressive disclosure',()=>{
    expect(session).toContain('planExpanded');
    expect(session).toContain("t(planExpanded?'pregrind.hidePlanDetails':'pregrind.planDetails')");
    expect(session).toContain("t('pregrind.expectedDuration')");
    expect(session).toContain("t('pregrind.stakes')");
  });
});
