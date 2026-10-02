import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), 'utf8');

describe('Train, content libraries, and overlays localization contract', () => {
  it('stores localizable content as stable ids plus translation keys', () => {
    const content = read('src/content.ts');
    expect(content).toContain("modeKey: 'playlist.lockIn.mode'");
    expect(content).toContain("descriptionKey: 'playlist.lockIn.description'");
    expect(content).toContain("cueKey: 'playlist.lockIn.cue'");
    expect(content).toContain("id: 'q1'");
    expect(content).toContain("textKey: 'diary.q1'");
    expect(content).toContain("id: 'energy'");
    expect(content).toContain("titleKey: 'lifestyle.energy.title'");
    expect(content).toContain("id: 'baseline'");
    expect(content).toContain("titleKey: 'tell.baseline.title'");
    expect(content).toContain("id: 'control'");
    expect(content).toContain("titleKey: 'stoic.control.title'");
  });

  it('renders Train and overlays through translation keys', () => {
    const train = read('src/screens/TrainScreen.tsx');
    const overlays = read('src/overlays.tsx');
    expect(train).toContain("t('train.title')");
    expect(train).toContain("t('train.reserveBody')");
    expect(overlays).toContain("t('overlay.heatmap')");
    expect(overlays).toContain("t('break.label')");
    expect(overlays).toContain("t('checkin.label')");
    expect(overlays).toContain("t('sos.label')");
    expect(overlays).not.toContain('EMOTIONAL HEATMAP');
    expect(overlays).not.toContain('RETURN TO SESSION');
    expect(overlays).not.toContain('SAVE CHECK-IN');
  });

  it('keeps overlay state on stable ids or indexes', () => {
    const overlays = read('src/overlays.tsx');
    expect(overlays).toContain("useState('a-game')");
    expect(overlays).toContain('setPlaylist(p.id)');
    expect(overlays).toContain('setTrigger(x.id)');
    expect(overlays).toContain('diaryIndex');
    expect(overlays).toContain('step');
  });
});
