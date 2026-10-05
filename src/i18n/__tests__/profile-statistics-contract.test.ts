import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const profile=fs.readFileSync(path.join(process.cwd(),'src/screens/ProfileScreen.tsx'),'utf8');

describe('profile evidence threshold contract',()=>{
  it('does not expose correlation coefficients before the baseline is usable',()=>{
    expect(profile).toContain("const analyticsUsable=baseline.confidence!=='none'");
    expect(profile).toContain("analyticsUsable&&baseline.resultCorrelation!==null");
    expect(profile).toContain("profile.analyticsInsufficient");
  });
});
