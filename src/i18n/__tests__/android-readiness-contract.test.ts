import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const index=fs.readFileSync(path.join(process.cwd(),'app/index.tsx'),'utf8');
const appConfig=JSON.parse(fs.readFileSync(path.join(process.cwd(),'app.json'),'utf8'));
const eas=JSON.parse(fs.readFileSync(path.join(process.cwd(),'eas.json'),'utf8'));

describe('Android publication readiness contract',()=>{
  it('pins the current Play target and production bundle configuration',()=>{
    expect(appConfig.expo.android.package).toBe('com.stackupholdem.endurance');
    expect(appConfig.expo.orientation).toBe('portrait');
    const buildProps=appConfig.expo.plugins.find((item:unknown)=>Array.isArray(item) && item[0]==='expo-build-properties');
    expect(buildProps?.[1]?.android?.targetSdkVersion).toBe(36);
    expect(buildProps?.[1]?.android?.compileSdkVersion).toBeGreaterThanOrEqual(36);
    expect(eas.cli.appVersionSource).toBe('remote');
    expect(eas.build.production.autoIncrement).toBe(true);
    expect(eas.build.production.android.buildType).toBe('app-bundle');
  });

  it('handles Android back navigation inside the single-screen state machine',()=>{
    expect(index).toContain('BackHandler');
    expect(index).toContain("BackHandler.addEventListener('hardwareBackPress'");
    expect(index).toContain('subscription.remove()');
    expect(index).toContain('if(sos)');
    expect(index).toContain('if(checkin)');
    expect(index).toContain('if(breakOpen)');
    expect(index).toContain('if(module)');
    expect(index).toContain("if(tab!=='home')");
    expect(index).toContain('return false');
  });
});
