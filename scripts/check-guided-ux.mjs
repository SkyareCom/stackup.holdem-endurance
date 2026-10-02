import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const requireToken=(source,token,where)=>{ if(!source.includes(token)) failures.push(`${where} is missing ${token}`); };
const rejectToken=(source,token,where)=>{ if(source.includes(token)) failures.push(`${where} still contains forbidden token ${token}`); };
const requireOrder=(source,tokens,where)=>{
  let cursor=-1;
  for(const token of tokens){
    const index=source.indexOf(token);
    if(index<0){failures.push(`${where} is missing ordered token ${token}`);return;}
    if(index<=cursor){failures.push(`${where} has guided sequence out of order at ${token}`);return;}
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
requireOrder(home,["t('home.stateToday')","t('home.nextAction')","t('home.decisionCue')"],'Home');
requireToken(home,'latestCheckin','Home');
requireToken(home,'calculateReadiness','Home');
rejectToken(home,'>82</Serif>','Home');
rejectToken(home,'>A-</Serif>','Home');
rejectToken(home,'s.quickGrid','Home');
rejectToken(home,'s.quickCard','Home');

const session=read('src/screens/SessionScreen.tsx');
requireToken(session,"from '../components/FlowProgress'",'Session');
for(const token of ['wizardStep',"pregrind.sensations","pregrind.lifestyle","pregrind.feeling","pregrind.emotion","pregrind.reason","pregrind.reframe",'calculateMentalEv','finishSession']){
  requireToken(session,token,'Session');
}
rejectToken(session,'02:47:18','Session');
rejectToken(session,"width:'43%'","Session");
rejectToken(session,'18:42 / 45:00','Session');

const train=read('src/screens/TrainScreen.tsx');
requireToken(train,'developmentGroups','Train');
requireToken(train,'selectedDevelopmentGroup','Train');
requireToken(train,'selected.modules.map','Train');
rejectToken(train,'title="74%"','Train');
rejectToken(train,"width:'74%'","Train");

const overlays=read('src/overlays.tsx');
requireToken(overlays,'<TestIntro','Overlays');
requireToken(overlays,'getSOSProtocol','Overlays');
requireToken(overlays,"t('sos.symptom')",'Overlays');
rejectToken(overlays,'setReactionResult(284)','Overlays');
rejectToken(overlays,'Array.from({length:28})','Overlays');

const coach=read('src/screens/CoachScreen.tsx');
requireToken(coach,"t('coach.contextReadiness')",'Coach');
requireToken(coach,"t('coach.contextHomeRecommendation')",'Coach');
requireToken(coach,'usePerformance','Coach');

const profile=read('src/screens/ProfileScreen.tsx');
requireOrder(profile,[
  "t('profile.base')","t('profile.evolution')","t('profile.development')",
  "t('profile.patterns')","t('profile.history')","t('profile.settings')",
],'Profile');
requireToken(profile,'developmentSnapshot','Profile');
requireToken(profile,'baseline.confidence','Profile');
rejectToken(profile,'const hasEvolutionHistory=false','Profile');

if(failures.length){
  for(const failure of failures) console.error(`GUIDED UX CHECK FAILED: ${failure}`);
  process.exit(1);
}
console.log('Guided UX check passed: sequential action-first hierarchy, real-data guards, progressive disclosure, and legacy-fixture rejection are intact.');
