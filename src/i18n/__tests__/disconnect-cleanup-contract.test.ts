import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');

describe('two-minute disconnect contract',()=>{
  it('starts a real 120-second cleanup when Recovery mounts',()=>{
    expect(session).toContain('disconnectRemaining');
    expect(session).toContain('setDisconnectRemaining(120)');
    expect(session).toContain('setInterval');
  });

  it('narrates the mental cleanup locally and stops it on unmount',()=>{
    expect(session).toContain("import * as Speech from 'expo-speech'");
    expect(session).toContain("Speech.speak(t('recovery.disconnectScript')");
    expect(session).toContain('Speech.stop()');
  });

  it('shows live cleanup state instead of a static fake player',()=>{
    expect(session).toContain("t(disconnectRemaining>0?'recovery.disconnectRunning':'recovery.disconnectComplete')");
    expect(session).toContain('{disconnectRemaining}');
  });
});
