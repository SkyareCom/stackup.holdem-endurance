import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const overlays = fs.readFileSync(path.join(process.cwd(), 'src/overlays.tsx'), 'utf8');
const types = fs.readFileSync(path.join(process.cwd(), 'src/types.ts'), 'utf8');

describe('guided module and exercise contract', () => {
  it('defines an explicit four-phase exercise lifecycle', () => {
    expect(types).toContain("export type ExercisePhase = 'intro' | 'running' | 'result' | 'next'");
    expect(overlays).toContain("useState<ExercisePhase>('intro')");
  });

  it('explains the Reaction Test before running it', () => {
    expect(overlays).toContain('<TestIntro');
    expect(overlays).toContain("t('overlay.reactionMeasures')");
    expect(overlays).toContain("t('overlay.reactionImportance')");
    expect(overlays).toContain("t('overlay.reactionInstructions')");
    expect(overlays).toContain("t('overlay.reactionDuration')");
  });

  it('interprets the result and gives a next action', () => {
    expect(overlays).toContain('reactionResult');
    expect(overlays).toContain("t('overlay.reactionInterpretation')");
    expect(overlays).toContain("t('overlay.reactionConsistency')");
    expect(overlays).toContain("t('overlay.reactionNext')");
  });

  it('shows module context before module-specific content', () => {
    expect(overlays).toContain("t('moduleIntro.whatTrain')");
    expect(overlays).toContain("t('moduleIntro.whenUse')");
    expect(overlays).toContain("t('moduleIntro.estimatedTime')");
  });
});
