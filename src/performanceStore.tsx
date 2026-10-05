import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  buildBaseline,
  calculateMentalEv,
  calculateReadiness,
  type DebriefData,
  type PreGrindCheckin,
  type RuntimeCheckin,
  type LiveSessionEvent,
  type LiveEventType,
  type PhysiologySample,
  type PhysiologyPhase,
  type SessionPlan,
  type SessionRecord,
  type StopRules,
  type Temperament,
  type TiltTrigger,
} from './performanceEngine';
import type { LifestyleCheckin } from './performanceCare';
export type CareTaskEvent={id:string;taskId:string;date:string;status:'done'|'skipped';createdAt:number};
export type DailyWellbeing={date:string;feeling:string;personalImpact:string;professionalImpact:string;updatedAt:number};

const STORAGE_KEY='stackup.endurance.performance.v1';

export type PerformanceProfile = {
  temperament:Temperament|null;
  extraGrind:{ sleep:number; personalStress:number; financialStress:number; nutrition:number; hydration:number; physicalActivity:number };
  stopRules:StopRules;
  lifestyle:LifestyleCheckin;
};

type ActiveSession = {
  id:string;
  startedAt:number;
  pre:PreGrindCheckin;
  plan:SessionPlan;
  checkins:RuntimeCheckin[];
  liveEvents:LiveSessionEvent[];
  physiology:PhysiologySample[];
  reentriesUsed:number;
};

type PersistedState = {
  profile:PerformanceProfile;
  sessions:SessionRecord[];
  activeSession:ActiveSession|null;
  latestCheckin:PreGrindCheckin|null;
  careTaskEvents:CareTaskEvent[];
  dailyWellbeing:DailyWellbeing[];
};

type PerformanceContextValue = PersistedState & {
  ready:boolean;
  baseline:ReturnType<typeof buildBaseline>;
  updateProfile:(patch:Partial<PerformanceProfile>)=>void;
  updateExtraGrind:(patch:Partial<PerformanceProfile['extraGrind']>)=>void;
  updateStopRules:(patch:Partial<StopRules>)=>void;
  updateLifestyle:(patch:Partial<LifestyleCheckin>)=>void;
  startSession:(pre:PreGrindCheckin,plan:SessionPlan)=>void;
  addRuntimeCheckin:(checkin:Omit<RuntimeCheckin,'createdAt'|'minute'>)=>void;
  recordSOS:(trigger:TiltTrigger)=>void;
  incrementReentry:()=>void;
  addLiveEvent:(type:LiveEventType,amount?:number,note?:string)=>void;
  addPhysiologySample:(phase:PhysiologyPhase,heartRate?:number,systolic?:number,diastolic?:number)=>void;
  importPhysiologySamples:(samples:PhysiologySample[])=>void;
  finishSession:(debrief:DebriefData)=>SessionRecord|null;
  setCareTaskStatus:(taskId:string,status:'done'|'skipped')=>void;
  updateDailyWellbeing:(patch:Partial<Omit<DailyWellbeing,'date'|'updatedAt'>>)=>void;
  clearHistory:()=>void;
};

const defaultProfile:PerformanceProfile={
  temperament:null,
  extraGrind:{sleep:5,personalStress:5,financialStress:5,nutrition:5,hydration:5,physicalActivity:5},
  stopRules:{maxDurationMinutes:180,maxReentries:1,minFocus:4,maxTension:7,noStakeIncrease:true},
  lifestyle:{sleepHours:7.5,sleepQuality:7,hydration:7,mealQuality:7,hoursSinceMeal:3,caffeineMg:0,caffeineHoursAgo:24,movementMinutes:30,strengthDaysThisWeek:2,sittingHours:2,painOrIllness:false},
};

const defaultState:PersistedState={profile:defaultProfile,sessions:[],activeSession:null,latestCheckin:null,careTaskEvents:[],dailyWellbeing:[]};

const PerformanceContext=createContext<PerformanceContextValue|null>(null);

export function PerformanceProvider({children}:{children:React.ReactNode}) {
  const [state,setState]=useState<PersistedState>(defaultState);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    let active=true;
    AsyncStorage.getItem(STORAGE_KEY).then(raw=>{
      if(!active)return;
      if(raw){
        try{
          const parsed=JSON.parse(raw) as Partial<PersistedState>;
          setState({
            profile:{
              ...defaultProfile,
              ...parsed.profile,
              extraGrind:{...defaultProfile.extraGrind,...parsed.profile?.extraGrind},
              stopRules:{...defaultProfile.stopRules,...parsed.profile?.stopRules},
              lifestyle:{...defaultProfile.lifestyle,...parsed.profile?.lifestyle},
            },
            sessions:Array.isArray(parsed.sessions)?parsed.sessions:[],
            activeSession:parsed.activeSession?{...parsed.activeSession,liveEvents:Array.isArray((parsed.activeSession as ActiveSession).liveEvents)?(parsed.activeSession as ActiveSession).liveEvents:[],physiology:Array.isArray((parsed.activeSession as ActiveSession).physiology)?(parsed.activeSession as ActiveSession).physiology:[],reentriesUsed:parsed.activeSession.reentriesUsed??0}:null,
            latestCheckin:parsed.latestCheckin??null,
            careTaskEvents:Array.isArray(parsed.careTaskEvents)?parsed.careTaskEvents:[],
            dailyWellbeing:Array.isArray(parsed.dailyWellbeing)?parsed.dailyWellbeing:[],
          });
        }catch{
          setState(defaultState);
        }
      }
      setReady(true);
    });
    return()=>{active=false;};
  },[]);

  useEffect(()=>{
    if(!ready)return;
    void AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  },[ready,state]);

  const updateProfile=useCallback((patch:Partial<PerformanceProfile>)=>{
    setState(s=>({...s,profile:{...s.profile,...patch}}));
  },[]);

  const updateExtraGrind=useCallback((patch:Partial<PerformanceProfile['extraGrind']>)=>{
    setState(s=>({...s,profile:{...s.profile,extraGrind:{...s.profile.extraGrind,...patch}}}));
  },[]);

  const updateLifestyle=useCallback((patch:Partial<LifestyleCheckin>)=>{
    setState(s=>({...s,profile:{...s.profile,lifestyle:{...s.profile.lifestyle,...patch}}}));
  },[]);

  const updateStopRules=useCallback((patch:Partial<StopRules>)=>{
    setState(s=>({...s,profile:{...s.profile,stopRules:{...s.profile.stopRules,...patch}}}));
  },[]);

  const startSession=useCallback((pre:PreGrindCheckin,plan:SessionPlan)=>{
    const now=Date.now();
    setState(s=>({...s,latestCheckin:pre,activeSession:{
      id:'session-'+now,
      startedAt:now,
      pre,
      plan,
      checkins:[],
      liveEvents:[],
      physiology:[],
      reentriesUsed:0,
    }}));
  },[]);

  const addRuntimeCheckin=useCallback((checkin:Omit<RuntimeCheckin,'createdAt'|'minute'>)=>{
    const now=Date.now();
    setState(s=>{
      if(!s.activeSession)return s;
      const minute=Math.max(0,Math.floor((now-s.activeSession.startedAt)/60000));
      return {...s,activeSession:{...s.activeSession,checkins:[...s.activeSession.checkins,{...checkin,createdAt:now,minute}]}};
    });
  },[]);

  const recordSOS=useCallback((trigger:TiltTrigger)=>{
    const now=Date.now();
    setState(s=>{
      if(!s.activeSession)return s;
      const last=s.activeSession.checkins[s.activeSession.checkins.length-1];
      const minute=Math.max(0,Math.floor((now-s.activeSession.startedAt)/60000));
      const next:RuntimeCheckin={
        createdAt:now,
        minute,
        focus:last?.focus??s.activeSession.pre.mentalDrive,
        tension:last?.tension??s.activeSession.pre.tension,
        impulse:Math.max(last?.impulse??s.activeSession.pre.impulse,6),
        fatigue:last?.fatigue??s.activeSession.pre.fatigue,
        mentalState:'dysregulated',
        executionQuality:last?.executionQuality??'oscillating',
        trigger,
      };
      return {...s,activeSession:{...s.activeSession,checkins:[...s.activeSession.checkins,next]}};
    });
  },[]);


  const addLiveEvent=useCallback((type:LiveEventType,amount?:number,note?:string)=>{
    const now=Date.now();
    setState(s=>{
      if(!s.activeSession)return s;
      const minute=Math.max(0,Math.floor((now-s.activeSession.startedAt)/60000));
      const event:LiveSessionEvent={id:'event-'+now,createdAt:now,minute,type,...(amount&&amount>0?{amount}:{}),...(note?.trim()?{note:note.trim()}: {})};
      const reentriesUsed=type==='rebuy'?Math.min(s.activeSession.plan.maxReentries,s.activeSession.reentriesUsed+1):s.activeSession.reentriesUsed;
      return {...s,activeSession:{...s.activeSession,reentriesUsed,liveEvents:[...s.activeSession.liveEvents,event]}};
    });
  },[]);

  const addPhysiologySample=useCallback((phase:PhysiologyPhase,heartRate?:number,systolic?:number,diastolic?:number)=>{
    const now=Date.now();
    setState(s=>{
      if(!s.activeSession)return s;
      const minute=Math.max(0,Math.floor((now-s.activeSession.startedAt)/60000));
      const sample:PhysiologySample={id:'phys-'+now,createdAt:now,minute,phase,source:'manual',...(heartRate?{heartRate}:{}),...(systolic?{systolic}:{}),...(diastolic?{diastolic}: {})};
      return {...s,activeSession:{...s.activeSession,physiology:[...s.activeSession.physiology,sample]}};
    });
  },[]);

  const importPhysiologySamples=useCallback((samples:PhysiologySample[])=>{
    if(!samples.length)return;
    setState(s=>{if(!s.activeSession)return s;const merged=new Map(s.activeSession.physiology.map(x=>[x.id,x]));for(const sample of samples)merged.set(sample.id,sample);return {...s,activeSession:{...s.activeSession,physiology:[...merged.values()].sort((a,b)=>a.createdAt-b.createdAt)}};});
  },[]);

  const incrementReentry=useCallback(()=>{
    setState(s=>{
      if(!s.activeSession||s.activeSession.plan.mode!=='tournament')return s;
      if(s.activeSession.reentriesUsed>=s.activeSession.plan.maxReentries)return s;
      return {...s,activeSession:{...s.activeSession,reentriesUsed:s.activeSession.reentriesUsed+1}};
    });
  },[]);

  const finishSession=useCallback((debrief:DebriefData)=>{
    let created:SessionRecord|null=null;
    setState(s=>{
      if(!s.activeSession)return s;
      const endedAt=Date.now();
      const readinessIndex=calculateReadiness(s.activeSession.pre);
      created={
        id:s.activeSession.id,
        startedAt:s.activeSession.startedAt,
        endedAt,
        pre:s.activeSession.pre,
        plan:s.activeSession.plan,
        checkins:s.activeSession.checkins,
        liveEvents:s.activeSession.liveEvents,
        physiology:s.activeSession.physiology,
        reentriesUsed:s.activeSession.reentriesUsed,
        debrief,
        readinessIndex,
        mentalEv:calculateMentalEv({gameQuality:debrief.gameQuality,foldDiscipline:debrief.foldDiscipline,readinessIndex}),
      };
      return {...s,sessions:[created,...s.sessions],activeSession:null,latestCheckin:null};
    });
    return created;
  },[]);

  const setCareTaskStatus=useCallback((taskId:string,status:'done'|'skipped')=>{
    const now=Date.now();const date=new Date(now).toISOString().slice(0,10);
    setState(s=>({...s,careTaskEvents:[...s.careTaskEvents.filter(e=>!(e.taskId===taskId&&e.date===date)),{id:`care-${taskId}-${now}`,taskId,date,status,createdAt:now}]}));
  },[]);

  const updateDailyWellbeing=useCallback((patch:Partial<Omit<DailyWellbeing,'date'|'updatedAt'>>)=>{const now=Date.now();const date=new Date(now).toISOString().slice(0,10);setState(s=>{const current=s.dailyWellbeing.find(x=>x.date===date)??{date,feeling:'',personalImpact:'',professionalImpact:'',updatedAt:now};return {...s,dailyWellbeing:[...s.dailyWellbeing.filter(x=>x.date!==date),{...current,...patch,updatedAt:now}]};});},[]);

  const clearHistory=useCallback(()=>setState(s=>({...s,sessions:[],latestCheckin:null,activeSession:null})),[]);

  const baseline=useMemo(()=>buildBaseline(state.sessions),[state.sessions]);
  const value=useMemo<PerformanceContextValue>(()=>({
    ...state,ready,baseline,updateProfile,updateExtraGrind,updateLifestyle,updateStopRules,startSession,
    addRuntimeCheckin,recordSOS,incrementReentry,addLiveEvent,addPhysiologySample,importPhysiologySamples,finishSession,setCareTaskStatus,updateDailyWellbeing,clearHistory,
  }),[state,ready,baseline,updateProfile,updateExtraGrind,updateLifestyle,updateStopRules,startSession,addRuntimeCheckin,recordSOS,incrementReentry,addLiveEvent,addPhysiologySample,importPhysiologySamples,finishSession,setCareTaskStatus,updateDailyWellbeing,clearHistory]);

  if(!ready)return null;
  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformance():PerformanceContextValue {
  const value=useContext(PerformanceContext);
  if(!value)throw new Error('usePerformance must be used inside PerformanceProvider');
  return value;
}
