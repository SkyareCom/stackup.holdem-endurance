export const mentalPlaylists = [
  { id: 'lock-in', title: 'LOCK IN', duration: '38 MIN', mode: 'FOCUS', description: 'Atenção estreita. Baixa interferência. Execução limpa.', cue: 'Volte para a decisão presente.' },
  { id: 'a-game', title: 'A-GAME', duration: '45 MIN', mode: 'DECISION CUES', description: 'Processo, tempo e disciplina entre decisões.', cue: 'Resultado anterior não participa desta decisão.' },
  { id: 'discipline', title: 'DISCIPLINE', duration: '32 MIN', mode: 'SELF-TALK', description: 'Controle de impulso e proteção de range.', cue: 'Impulso não é informação.' },
  { id: 'long-grind', title: 'LONG GRIND', duration: '55 MIN', mode: 'ENDURANCE', description: 'Estamina mental para sessões longas.', cue: 'Preserve energia antes de precisar dela.' },
  { id: 'pressure', title: 'PRESSURE', duration: '28 MIN', mode: 'AROUSAL CONTROL', description: 'Clareza sob pressão competitiva.', cue: 'Você não precisa ficar mais intenso. Precisa ficar mais preciso.' },
  { id: 'mental-fortress', title: 'MENTAL FORTRESS', duration: '34 MIN', mode: 'RESILIENCE', description: 'Resiliência após perda, erro ou variância adversa.', cue: 'Variância não é uma interrupção do poker. É parte do poker.' },
  { id: 'cooldown', title: 'COOLDOWN', duration: '18 MIN', mode: 'RECOVERY', description: 'Desaceleração pós-sessão.', cue: 'A sessão terminou. Separe resultado, execução e estado.' },
  { id: 'break-4', title: 'BREAK 4', duration: '04:00', mode: 'RESET', description: 'Respiração, mobilidade, água e reorientação.', cue: 'Quatro minutos para recuperar o processo.' },
];

export const decisionCues = [
  'Uma decisão por vez.',
  'Mais rápido não significa melhor.',
  'Não procure ação. Espere a situação correta.',
  'Nova mão. Novo problema.',
  'Euforia também altera decisões. Volte ao baseline.',
  'Jogue contra o range. Não contra o ego.',
  'Paciência também é uma ação estratégica.',
  'Seu trabalho é decidir. O baralho cuida do resultado.',
];

export const diaryQuestions = [
  'Qual decisão teria sido diferente se você estivesse emocionalmente neutro?',
  'Qual foi o primeiro sinal de queda de performance?',
  'Você percebeu o C-Game antes ou depois do erro?',
  'Qual evento alterou seu estado?',
  'O problema foi conhecimento ou execução?',
  'Onde o cansaço físico afetou sua tomada de decisão?',
];

export const lifestyleSections = [
  {
    title: 'ENERGY',
    subtitle: 'Nutrição para o Grind',
    body: 'Priorize refeições que sustentem energia sem grandes picos e quedas. Combine proteína, fibras, gorduras e carboidratos menos refinados. Hidratação entra no plano antes da sede.',
  },
  {
    title: 'BODY',
    subtitle: 'Ergonomia & Mobilidade',
    body: 'A cada bloco longo, mova coluna torácica, quadris, pescoço e punhos. O objetivo não é “treinar” no break: é retirar tensão acumulada e recuperar amplitude.',
  },
  {
    title: 'RECOVERY',
    subtitle: 'Pós-sessão',
    body: 'Reduza ativação antes de avaliar o jogo. Caminhada leve, banho, respiração e distância da tela ajudam a separar competição de recuperação.',
  },
  {
    title: 'FOCUS',
    subtitle: 'Zero Distraction',
    body: 'Notificações, chats paralelos e alternância de tarefas consomem atenção. Durante o grind, torne distração mais difícil do que concentração.',
  },
];

export const tellLessons = [
  {
    title: 'BASELINE FIRST',
    body: 'Antes de interpretar um comportamento, observe como aquele jogador se comporta normalmente. O sinal útil é a mudança em relação ao próprio baseline.',
  },
  {
    title: 'FROZEN VS. THEATRICAL',
    body: 'Rigidez excessiva pode acompanhar tentativa de controle corporal. Fala performática pode ser encenação. Nenhum dos dois prova blefe ou força isoladamente.',
  },
  {
    title: 'TIMING',
    body: 'Mudanças de tempo de ação podem ser relevantes quando comparadas ao padrão do mesmo jogador e ao tipo de decisão enfrentada.',
  },
  {
    title: 'POSTURE & BREATHING',
    body: 'Ombros, pescoço, padrão respiratório e manipulação de fichas podem indicar alteração de ativação. Trate como evidência contextual, não como detector de mentira.',
  },
];

export const stoicPrinciples = [
  { title: 'CONTROLE', body: 'Você controla preparação, atenção, tempo e decisão. O river não está nessa lista.' },
  { title: 'VARIÂNCIA', body: 'O curto prazo produz ruído. Sua obrigação é proteger decisões repetíveis com EV positivo.' },
  { title: 'ANTIFRAGILIDADE', body: 'Uma sessão difícil pode revelar a estrutura que falha sob pressão. Use o estresse como diagnóstico, não como identidade.' },
  { title: 'PROCESSO', body: 'Não transforme uma mão ruim em uma sessão ruim por insistir em reagir ao que já acabou.' },
];

export const warRoomTriggers = ['BAD BEAT', 'ERRO PRÓPRIO', 'RAIVA', 'PRESSA', 'MEDO', 'EUFORIA', 'FADIGA', 'AUTOPILOT'];
