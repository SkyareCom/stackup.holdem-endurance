import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  buildBaseline,
  calculateMentalEv,
  calculateReadiness,
  type DebriefData,
  type PreGrindCheckin,
  type RuntimeCheckin,
  type SessionPlan,
  type SessionRecord,
  type StopRules,
  type Temperament,
  type TiltTrigger,
} from './performanceEngine';

const STORAGE_KEY='stackup.endurance.performance.v1';

export type PerformanceProfile = {
  temperament:Temperament|null;
  extraGrind:{ sleep:number; personalStress:number; financialStress:number; nutrition:number; hydration:number; physicalActivity:number };
  stopRules:StopRules;
};

type ActiveSession = {
  id:string;
  startedAt:number;
  pre:PreGrindCheckin;
  plan:SessionPlan;
  checkins:RuntimeCheckin[];
  reentriesUsed:number;
};

type PersistedState = {
  profile:PerformanceProfile;
  sessions:SessionRecord[];
  activeSession:ActiveSession|null;
  latestCheckin:PreGrindCheckin|null;
};

type PerformanceContextValue = PersistedState & {
  ready:boolean;
  baseline:ReturnType<typeof buildBaseline>;
  updateProfile:(patch:Partial<PerformanceProfile>)=>void;
  updateExtraGrind:(patch:Partial<PerformanceProfile['extraGrind']>)=>void;
  updateStopRules:(patch:Partial<StopRules>)=>void;
  startSession:(pre:PreGrindCheckin,plan:SessionPlan)=>void;
  addRuntimeCheckin:(checkin:Omit<RuntimeCheckin,'createdAt'|'minute'>)=>void;
  recordSOS:(trigger:TiltTrigger)=>void;
  incrementReentry:()=>void;
  finishSession:(debrief:DebriefData)=>SessionRecord|null;
  clearHistory:()=>void;
};

const defaultProfile:PerformanceProfile={
  temperament:null,
  extraGrind:{sleep:5,personalStress:5,financialStress:5,nutrition:5,hydration:5,physicalActivity:5},
  stopRules:{maxDurationMinutes:180,maxReentries:1,minFocus:4,maxTension:7,noStakeIncrease:true},
};

const defaultState:PersistedState={profile:defaultProfile,sessions:[],activeSession:null,latestCheckin:null};

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
            },
            sessions:Array.isArray(parsed.sessions)?parsed.sessions:[],
            activeSession:parsed.activeSession?{...parsed.activeSession,reentriesUsed:parsed.activeSession.reentriesUsed??0}:null,
            latestCheckin:parsed.latestCheckin??null,
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
        state:last?.state??'B',
        trigger,
      };
      return {...s,activeSession:{...s.activeSession,checkins:[...s.activeSession.checkins,next]}};
    });
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
        reentriesUsed:s.activeSession.reentriesUsed,
        debrief,
        readinessIndex,
        mentalEv:calculateMentalEv({gameQuality:debrief.gameQuality,foldDiscipline:debrief.foldDiscipline,readinessIndex}),
      };
      return {...s,sessions:[created,...s.sessions],activeSession:null,latestCheckin:null};
    });
    return created;
  },[]);

  const clearHistory=useCallback(()=>setState(s=>({...s,sessions:[],latestCheckin:null,activeSession:null})),[]);

  const baseline=useMemo(()=>buildBaseline(state.sessions),[state.sessions]);
  const value=useMemo<PerformanceContextValue>(()=>({
    ...state,ready,baseline,updateProfile,updateExtraGrind,updateStopRules,startSession,
    addRuntimeCheckin,recordSOS,incrementReentry,finishSession,clearHistory,
  }),[state,ready,baseline,updateProfile,updateExtraGrind,updateStopRules,startSession,addRuntimeCheckin,recordSOS,incrementReentry,finishSession,clearHistory]);

  if(!ready)return null;
  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformance():PerformanceContextValue {
  const value=useContext(PerformanceContext);
  if(!value)throw new Error('usePerformance must be used inside PerformanceProvider');
  return value;
}
