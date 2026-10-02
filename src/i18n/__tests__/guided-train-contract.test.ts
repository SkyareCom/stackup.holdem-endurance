import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { trainingGroups } from '../../content';

const source = fs.readFileSync(path.join(process.cwd(), 'src/screens/TrainScreen.tsx'), 'utf8');

describe('guided Train contract', () => {
  it('groups training by performance objective', () => {
    expect(trainingGroups.map((group) => group.id)).toEqual(['control','reading','focus','performance','audio']);
    expect(trainingGroups.find((g)=>g.id==='control')?.moduleIds).toEqual(['war','vaccines','mindset']);
    expect(trainingGroups.find((g)=>g.id==='reading')?.moduleIds).toEqual(['behavior']);
    expect(trainingGroups.find((g)=>g.id==='focus')?.moduleIds).toEqual(['gym']);
    expect(trainingGroups.find((g)=>g.id==='performance')?.moduleIds).toEqual(['lifestyle']);
    expect(trainingGroups.find((g)=>g.id==='audio')?.moduleIds).toEqual(['audio']);
  });

  it('gives every group and module explanatory metadata', () => {
    for (const group of trainingGroups) {
      expect(group.titleKey).toBeTruthy();
      expect(group.descriptionKey).toBeTruthy();
      for (const module of group.modules) {
        expect(module.whatKey).toBeTruthy();
        expect(module.whenKey).toBeTruthy();
        expect(module.durationKey).toBeTruthy();
      }
    }
  });

  it('renders grouped training instead of the old flat numbered list', () => {
    expect(source).toContain('trainingGroups.map');
    expect(source).toContain("t(group.descriptionKey)");
    expect(source).toContain("t(module.whatKey)");
    expect(source).not.toContain("const keys:Module[]");
  });
});
