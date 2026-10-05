import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const pkg=JSON.parse(fs.readFileSync(path.join(process.cwd(),'package.json'),'utf8'));
const contentSource=fs.readFileSync(path.join(process.cwd(),'src/content.ts'),'utf8');
const overlays=fs.readFileSync(path.join(process.cwd(),'src/overlays.tsx'),'utf8');

describe('guided micro-audio contract',()=>{
  it('uses Expo Speech for local device narration',()=>{
    expect(pkg.dependencies['expo-speech']).toBe('~57.0.3');
    expect(overlays).toContain("import * as Speech from 'expo-speech'");
    expect(overlays).toContain('Speech.speak');
    expect(overlays).toContain('Speech.stop');
  });

  it('includes the three approved coaching topics',()=>{
    for(const id of ['downswing','loss-aversion','personal-stress']) {
      expect(contentSource).toContain(`id:'${id}'`);
    }
  });

  it('shows one coaching audio at a time instead of a dense catalog',()=>{
    expect(overlays).toContain('microAudioIndex');
    expect(overlays).toContain('microAudios[microAudioIndex]');
    expect(overlays).not.toContain('microAudios.map');
  });
});
