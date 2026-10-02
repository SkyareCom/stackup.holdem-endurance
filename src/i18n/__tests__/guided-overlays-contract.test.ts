import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const overlays = fs.readFileSync(path.join(process.cwd(), 'src/overlays.tsx'), 'utf8');
const content = fs.readFileSync(path.join(process.cwd(), 'src/content.ts'), 'utf8');
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

  it('localizes the reaction result unit instead of hard-coding functional copy', () => {
    expect(overlays).toContain("t('common.milliseconds')");
    expect(overlays).not.toContain('reactionResult} ms');
  });

  it('shows module context before module-specific content', () => {
    expect(overlays).toContain("t('moduleIntro.whatTrain')");
    expect(overlays).toContain("t('moduleIntro.whenUse')");
    expect(overlays).toContain("t('moduleIntro.estimatedTime')");
  });

  it('renders the emotional heatmap as explicit time buckets with text intensity', () => {
    expect(content).toContain('emotionalHeatmapBuckets');
    expect(content).toContain("'heatmap.window.0_45'");
    expect(content).toContain("'heatmap.window.45_90'");
    expect(content).toContain("'heatmap.window.90_135'");
    expect(content).toContain("'heatmap.window.135_180'");
    expect(content).toContain("'heatmap.window.180_plus'");
    expect(content).toContain("'heatmap.intensity.low'");
    expect(content).toContain("'heatmap.intensity.moderate'");
    expect(content).toContain("'heatmap.intensity.high'");
    expect(content).toContain("'heatmap.intensity.critical'");
    expect(overlays).toContain('emotionalHeatmapBuckets.map');
    expect(overlays).not.toContain('Array.from({length:28})');
  });

  it('explains the heatmap, interprets the pattern and gives direct actions', () => {
    expect(overlays).toContain("t('overlay.heatmapExplanation')");
    expect(overlays).toContain("t('overlay.heatmapReading')");
    expect(overlays).toContain("t('overlay.heatmapActionBreak')");
    expect(overlays).toContain("t('overlay.heatmapActionCue')");
    expect(overlays).toContain("t('overlay.heatmapActionSlow')");
    expect(overlays).toContain("t('overlay.heatmapActionCheckin')");
  });

  it('has an explicit insufficient-history state instead of pseudo-analysis', () => {
    expect(overlays).toContain('heatmapHasHistory');
    expect(overlays).toContain("t('overlay.heatmapInsufficient')");
    expect(overlays).toContain("t('overlay.heatmapCollect')");
  });
});
