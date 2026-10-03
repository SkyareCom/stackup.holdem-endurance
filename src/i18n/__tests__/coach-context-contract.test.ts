import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const coach=fs.readFileSync(path.join(process.cwd(),'src/screens/CoachScreen.tsx'),'utf8');

describe('deterministic contextual Coach contract',()=>{
  it('derives replies from the same session-action engine used by the app',()=>{
    expect(coach).toContain('getSessionAction');
    expect(coach).toContain('coachAdviceKeys');
    expect(coach).toContain('currentAction');
  });

  it('does not answer every message with the same generic fixture',()=>{
    expect(coach).not.toContain("text:t('coach.reply')");
    expect(coach).toContain("t(coachAdviceKeys[currentAction])");
    expect(coach).toContain("t('coach.advice.noContext')");
  });
});
