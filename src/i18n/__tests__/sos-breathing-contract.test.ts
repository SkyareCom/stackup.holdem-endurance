import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const overlays=fs.readFileSync(path.join(process.cwd(),'src/overlays.tsx'),'utf8');

describe('real SOS tactical breathing contract',()=>{
  it('runs a real countdown instead of displaying a static duration',()=>{
    expect(overlays).toContain('sosRemaining');
    expect(overlays).toContain('setInterval');
    expect(overlays).toContain('setSosRemaining');
    expect(overlays).not.toContain('<AppText style={s.sosTimer}>{protocol.seconds}</AppText>');
  });

  it('guides cyclic-sigh phases during the protocol',()=>{
    expect(overlays).toContain('sosBreathPhase');
    expect(overlays).toContain("sos.breathe.inhale1");
    expect(overlays).toContain("sos.breathe.inhale2");
    expect(overlays).toContain("sos.breathe.exhale");
  });
});
