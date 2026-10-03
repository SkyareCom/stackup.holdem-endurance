import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { developmentGroups } from '../../content';

const source=fs.readFileSync(path.join(process.cwd(),'src/screens/TrainScreen.tsx'),'utf8');

describe('need-driven Train contract',()=>{
  it('covers the holistic development map',()=>{
    expect(developmentGroups).toHaveLength(11);
    expect(developmentGroups.map(x=>x.id)).toContain('discipline');
    expect(developmentGroups.map(x=>x.id)).toContain('logic');
    expect(developmentGroups.map(x=>x.id)).toContain('lifestyle');
  });
  it('asks for the current need before exposing tools',()=>{
    expect(source).toContain("t('train.need')");
    expect(source).toContain('setNeed');
    expect(source).toContain('selected.modules.map');
  });
  it('shows one development area at a time',()=>{
    expect(source).toContain('selectedDevelopmentGroup');
    expect(source).toContain('developmentGroups[selectedDevelopmentGroup]');
  });
  it('does not fabricate mental reserve',()=>{
    expect(source).toContain('baseline.averageReadiness');
    expect(source).not.toContain('title="74%"');
    expect(source).not.toContain("width:'74%'");
  });
});
