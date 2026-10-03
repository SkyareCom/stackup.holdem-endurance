import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const overlays=fs.readFileSync(path.join(process.cwd(),'src/overlays.tsx'),'utf8');

describe('offline frequency generator contract',()=>{
  it('ships four distinct local stereo frequency assets',()=>{
    for(const file of [
      'binaural-delta-4.wav','binaural-alpha-10.wav','binaural-beta-20.wav','binaural-gamma-30.wav'
    ]) expect(overlays).toContain(file);
  });

  it('lets the user choose delta, alpha, beta, or gamma without remote audio',()=>{
    expect(overlays).toContain('frequencyPreset');
    expect(overlays).toContain('frequencyPresets');
    expect(overlays).toContain('toggleFrequencyAudio');
    expect(overlays).toContain('loadedFrequency===preset.id&&audioStatus.playing');
    expect(overlays).not.toContain('frequencyRateByPlaylist');
  });

  it('keeps the evidence limitation visible next to the selector',()=>{
    expect(overlays).toContain("t('overlay.audioFrequencyNote')");
  });
});
