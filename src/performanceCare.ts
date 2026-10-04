export type LifestyleCheckin = {
  sleepHours:number;
  sleepQuality:number;
  hydration:number;
  mealQuality:number;
  hoursSinceMeal:number;
  caffeineMg:number;
  caffeineHoursAgo:number;
  movementMinutes:number;
  strengthDaysThisWeek:number;
  sittingHours:number;
  painOrIllness:boolean;
};

export type CarePriority='sleep'|'nutrition'|'hydration'|'movement'|'caffeine'|'medical'|'ready';
export type CareAction={priority:CarePriority;severity:'info'|'attention'|'high';title:string;action:string};

export function buildPerformanceCare(x:LifestyleCheckin):CareAction[] {
  const a:CareAction[]=[];
  if(x.painOrIllness)a.push({priority:'medical',severity:'high',title:'Saúde antes do grind',action:'Sintomas, dor ou doença não devem ser mascarados para jogar. Reduza a carga e procure avaliação profissional quando necessário.'});
  if(x.sleepHours<7||x.sleepQuality<=4)a.push({priority:'sleep',severity:x.sleepHours<6?'high':'attention',title:'Sono abaixo da base',action:'Proteja recuperação antes de aumentar volume. Se possível, reduza a duração da sessão; cochilo curto pode ajudar alerta quando houver dívida de sono.'});
  if(x.hydration<=4)a.push({priority:'hydration',severity:'attention',title:'Hidratação baixa',action:'Reidrate-se antes do grind e mantenha água acessível durante a sessão. Use sede e contexto individual como sinais; evite metas rígidas universais.'});
  if(x.hoursSinceMeal>=5||x.mealQuality<=4)a.push({priority:'nutrition',severity:'attention',title:'Combustível inadequado',action:'Planeje uma refeição ou lanche equilibrado antes de uma sessão longa: fonte de carboidrato pouco refinado, proteína e alimento vegetal, respeitando tolerância individual.'});
  if(x.caffeineMg>0&&x.caffeineHoursAgo<6)a.push({priority:'caffeine',severity:'info',title:'Cafeína recente',action:'Considere o horário do sono antes de repetir cafeína. Não use estimulante como substituto de sono ou para ultrapassar sinais de fadiga.'});
  if(x.movementMinutes<20||x.sittingHours>=4)a.push({priority:'movement',severity:'attention',title:'Corpo parado',action:'Inclua uma caminhada ou movimento leve hoje e interrompa períodos prolongados sentado. Na semana, construa atividade aeróbica e força de forma progressiva.'});
  if(!a.length)a.push({priority:'ready',severity:'info',title:'Base física favorável',action:'Mantenha sono, alimentação, hidratação e movimento consistentes. O objetivo é preservar qualidade de decisão, não perseguir perfeição.'});
  return a;
}

export const PERFORMANCE_CARE_EVIDENCE = {
  movement:'WHO: adultos devem buscar 150–300 min/semana de atividade aeróbica moderada (ou equivalente) e força em 2+ dias; reduzir sedentarismo.',
  nutrition:'WHO: alimentação saudável prioriza adequação, equilíbrio, moderação e diversidade, com grãos integrais, vegetais, frutas, leguminosas e fontes adequadas de proteína.',
  sleep:'Consenso de sono no esporte: sono deve ser individualizado; sono curto e baixa qualidade são fatores relevantes para recuperação, cognição e desempenho.',
  hydration:'Revisões associam desidratação a prejuízo cognitivo; a resposta à reposição hídrica depende do contexto e não justifica uma meta universal rígida.',
  safety:'ENDURANCE oferece educação e suporte comportamental. Não diagnostica, prescreve medicamentos, suplementos, dietas terapêuticas ou tratamento médico.',
} as const;
