import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const contentSource=fs.readFileSync(path.join(process.cwd(),'src/content.ts'),'utf8');
const overlays=fs.readFileSync(path.join(process.cwd(),'src/overlays.tsx'),'utf8');

describe('mindfulness library contract',()=>{
  it('ships all approved self-regulation techniques',()=>{
    for(const id of ['grounding-54321','mental-labeling','mountain-weather','leaves-stream','cinema-screen']){
      expect(contentSource).toContain(`id: '${id}'`);
    }
  });

  it('uses progressive disclosure instead of rendering all techniques at once',()=>{
    expect(overlays).toContain('mindsetIndex');
    expect(overlays).toContain('mindfulnessTechniques[mindsetIndex]');
    expect(overlays).not.toContain('mindfulnessTechniques.map');
  });
});
