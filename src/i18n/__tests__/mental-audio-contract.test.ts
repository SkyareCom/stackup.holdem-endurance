import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const pkg=JSON.parse(fs.readFileSync(path.join(process.cwd(),'package.json'),'utf8'));
const app=JSON.parse(fs.readFileSync(path.join(process.cwd(),'app.json'),'utf8'));
const overlays=fs.readFileSync(path.join(process.cwd(),'src/overlays.tsx'),'utf8');

describe('offline mental audio contract',()=>{
  it('uses Expo Audio supported by the current SDK',()=>{
    expect(pkg.dependencies['expo-audio']).toBe('~57.0.5');
    expect(overlays).toContain("from 'expo-audio'");
    expect(overlays).toContain('useAudioPlayer');
    expect(overlays).toContain('useAudioPlayerStatus');
  });

  it('ships a bundled local tone source instead of remote playback',()=>{
    expect(overlays).toContain("require('../assets/audio/mental-tone.wav')");
    expect(overlays).toContain('audioPlayer.replace');
    expect(overlays).toContain('audioPlayer.play()');
    expect(overlays).toContain('audioPlayer.pause()');
  });

  it('does not request recording permissions for playback-only audio',()=>{
    const plugin=app.expo.plugins.find((item:unknown)=>Array.isArray(item)&&item[0]==='expo-audio');
    expect(plugin?.[1]?.recordAudioAndroid).toBe(false);
    expect(plugin?.[1]?.microphonePermission).toBe(false);
  });
});
