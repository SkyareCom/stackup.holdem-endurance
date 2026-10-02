import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const requireToken=(source,token,where)=>{
  if(!source.includes(token)) failures.push(`${where} is missing ${token}`);
};
const rejectToken=(source,token,where)=>{
  if(source.includes(token)) failures.push(`${where} still contains legacy token ${token}`);
};
const requireOrder=(source,tokens,where)=>{
  let cursor=-1;
  for(const token of tokens){
    const index=source.indexOf(token);
    if(index<0){ failures.push(`${where} is missing ordered token ${token}`); return; }
    if(index<=cursor){ failures.push(`${where} has guided sequence out of order at ${token}`); return; }
    cursor=index;
  }
};

const styles=read('src/styles.ts');
for(const match of styles.matchAll(/fontSize\s*:\s*(\d+(?:\.\d+)?)/g)){
  const size=Number(match[1]);
  if(!new Set([48,26,22,12,10]).has(size)) failures.push(`src/styles.ts uses disallowed fontSize ${size}`);
}
for(const styleName of ['body','guidedDescription','guidedToolBody','lessonBody','playlistBody','settingSub','contextValue']){
  const pattern=new RegExp(`${styleName}\\s*:\\s*\\{[^}]*textTransform\\s*:\\s*['"]uppercase['"]`);
  if(pattern.test(styles)) failures.push(`${styleName} forces uppercase descriptive copy`);
}

const guided=read('src/components/GuidedSection.tsx');
requireToken(guided,'{subtitle.toUpperCase()}','GuidedSection');
requireToken(guided,'{title.toUpperCase()}','GuidedSection');
rejectToken(guided,'{description.toUpperCase()}','GuidedSection');

const home=read('src/screens/HomeScreen.tsx');
requireToken(home,"from '../components/GuidedSection'",'Home');
requireOrder(home,[
  "t('home.stateToday')",
  "t('home.meaning')",
  "t('home.focusOfDay')",
  "t('home.recommendedAction')",
  "t('home.toolsForThis')",
  "t('home.decisionCue')",
],'Home');
rejectToken(home,'s.quickGrid','Home');
rejectToken(home,'s.quickCard','Home');

const session=read('src/screens/SessionScreen.tsx');
requireToken(session,"from '../components/FlowProgress'",'Session');
requireToken(session,"from '../components/GuidedSection'",'Session');
requireToken(session,'getReadinessGuidance','Session ready check');
requireToken(session,"t('common.yourReading')",'Session ready check');

const train=read('src/screens/TrainScreen.tsx');
requireToken(train,"from '../components/GuidedSection'",'Train');
requireToken(train,'trainingGroups.map','Train');

const overlays=read('src/overlays.tsx');
requireToken(overlays,'<TestIntro','Overlays');
requireToken(overlays,'emotionalHeatmapBuckets.map','Overlays');
rejectToken(overlays,'Array.from({length:28})','Overlays');

const coach=read('src/screens/CoachScreen.tsx');
requireToken(coach,"t('coach.contextReadiness')",'Coach');
requireToken(coach,"t('coach.contextHomeRecommendation')",'Coach');

const profile=read('src/screens/ProfileScreen.tsx');
requireOrder(profile,[
  "t('profile.evolution')",
  "t('profile.patterns')",
  "t('profile.history')",
  "t('profile.settings')",
],'Profile');

if(failures.length){
  for(const failure of failures) console.error(`GUIDED UX CHECK FAILED: ${failure}`);
  process.exit(1);
}
console.log('Guided UX check passed: hierarchy, casing, shared primitives, actionable flows, and legacy-pattern guards are intact.');
