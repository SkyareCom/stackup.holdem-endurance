import { Platform } from 'react-native';
import type { PhysiologySample } from './performanceEngine';

export type HealthConnectState='unsupported'|'unavailable'|'permission-required'|'connected'|'error';
export type HealthConnectSync={state:HealthConnectState;samples:PhysiologySample[];message?:string};

const values=(x:unknown):any[]=>{
  if(Array.isArray(x))return x;
  if(x&&typeof x==='object'){
    const o=x as any;
    if(Array.isArray(o.records))return o.records;
    if(Array.isArray(o.result))return o.result;
  }
  return [];
};

export async function connectAndReadHealthConnect(startedAt:number,endedAt=Date.now()):Promise<HealthConnectSync>{
  if(Platform.OS!=='android')return {state:'unsupported',samples:[]};
  try{
    const hc=await import('react-native-health-connect');
    const initialized=await hc.initialize();
    if(!initialized)return {state:'unavailable',samples:[]};
    const granted=await hc.requestPermission([
      {accessType:'read',recordType:'HeartRate'},
      {accessType:'read',recordType:'BloodPressure'},
    ]);
    if(!granted?.length)return {state:'permission-required',samples:[]};
    const timeRangeFilter={operator:'between' as const,startTime:new Date(startedAt).toISOString(),endTime:new Date(endedAt).toISOString()};
    const heartRaw=await hc.readRecords('HeartRate',{timeRangeFilter});
    let pressureRaw:unknown={records:[]};
    try{pressureRaw=await hc.readRecords('BloodPressure',{timeRangeFilter});}catch{}
    const samples:PhysiologySample[]=[];
    for(const record of values(heartRaw)){
      const createdAt=Date.parse(record.startTime??record.time??record.endTime);
      const minute=Math.max(0,Math.floor((createdAt-startedAt)/60000));
      const points=Array.isArray(record.samples)?record.samples:[record];
      for(const point of points){
        const at=Date.parse(point.time??record.startTime??record.endTime);
        const bpm=Number(point.beatsPerMinute??point.bpm??point.value);
        if(Number.isFinite(bpm)&&bpm>0)samples.push({id:`hc-hr-${at}-${bpm}`,createdAt:at,minute:Math.max(0,Math.floor((at-startedAt)/60000)),phase:minute<=0?'pre':'during',heartRate:bpm,source:'health-connect'});
      }
    }
    for(const record of values(pressureRaw)){
      const at=Date.parse(record.time??record.startTime??record.endTime);
      const systolic=Number(record.systolic?.inMillimetersOfMercury??record.systolic);
      const diastolic=Number(record.diastolic?.inMillimetersOfMercury??record.diastolic);
      if(Number.isFinite(systolic)&&Number.isFinite(diastolic))samples.push({id:`hc-bp-${at}`,createdAt:at,minute:Math.max(0,Math.floor((at-startedAt)/60000)),phase:at<startedAt?'pre':at>endedAt?'post':'during',systolic,diastolic,source:'health-connect'});
    }
    return {state:'connected',samples:samples.sort((a,b)=>a.createdAt-b.createdAt)};
  }catch(error){return {state:'error',samples:[],message:error instanceof Error?error.message:String(error)};}
}
