import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const styles = fs.readFileSync(path.join(process.cwd(), 'src/styles.ts'), 'utf8');
const session = fs.readFileSync(path.join(process.cwd(), 'src/screens/SessionScreen.tsx'), 'utf8');
const coach = fs.readFileSync(path.join(process.cwd(), 'src/screens/CoachScreen.tsx'), 'utf8');
const shell = fs.readFileSync(path.join(process.cwd(), 'app/index.tsx'), 'utf8');

describe('premium visual consistency contract', () => {
  it('uses shared rounded-rectangle radii instead of mixed card/control geometry', () => {
    expect(styles).toContain('const CARD_RADIUS=16');
    expect(styles).toContain('const CONTROL_RADIUS=12');
    expect(styles).toContain('borderRadius:CARD_RADIUS');
    expect(styles).toContain('borderRadius:CONTROL_RADIUS');
  });

  it('distributes Ready Check and process choices into balanced card layouts', () => {
    expect(session).toContain('style={s.sessionGuideCard}');
    expect(session).toContain('style={s.processGrid}');
    expect(session).toContain('s.processChip');
    expect(session).toContain('style={s.readingCard}');
  });

  it('uses progressive disclosure to keep Coach calm and intuitive', () => {
    expect(coach).toContain('const [contextExpanded,setContextExpanded]=useState(false)');
    expect(coach).toContain('contextExpanded?<View style={s.contextList}>');
    expect(coach).toContain("t(contextExpanded?'coach.hideContext':'coach.showContext')");
    expect(coach).toContain('primaryQuickPromptKeys');
    expect(coach).toContain("phase==='debrief'");
    expect(coach).not.toContain('style={s.coachEmptyState}');
    expect(coach).not.toContain('style={s.voice}');
  });

  it('keeps SOS physically clear of typing and improves bottom navigation icon states', () => {
    expect(styles).toContain("composer:{position:'absolute',left:0,right:0,bottom:160");
    expect(styles).toContain("navSOS:{position:'absolute',right:14,top:-54");
    expect(styles).toContain("scroll:{padding:18,paddingBottom:140,gap:18}");
    expect(shell).toContain('activeIcon');
    expect(shell).toContain('s.navIconWrap');
    expect(shell).toContain('s.navIconWrapActive');
  });
});
