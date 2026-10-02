# ENDURANCE — Guided Performance Journey UX Redesign

Data: 2026-10-02

## 1. Objetivo

Reorganizar o STACKUP HOLD'EM ENDURANCE para eliminar a sensação de:

- cards soltos e sem relação entre si;
- testes sem contexto;
- módulos com pouca explicação;
- mapas/indicadores difíceis de interpretar;
- falta de um próximo passo claro;
- excesso de conteúdo apresentado como blocos independentes.

O aplicativo deve passar a funcionar como uma jornada de performance mental guiada, sem perder acesso livre aos módulos existentes.

A pergunta que cada tela deve responder é:

1. como estou?
2. o que isso significa?
3. o que devo fazer agora?
4. por que devo fazer?
5. qual é o próximo passo?

## 2. Princípio central de navegação

O ENDURANCE passa a se organizar pelo ciclo:

PREPARAR → JOGAR → MONITORAR → PAUSAR → RECUPERAR → ENCERRAR → ANALISAR → APRENDER → EVOLUIR

Esse ciclo não cria um novo produto. Ele reorganiza os recursos já existentes para que o usuário entenda a sequência lógica.

A navegação inferior permanece:

- INÍCIO
- SESSÃO
- TREINO
- COACH
- PERFIL

O SOS permanece global e acessível em qualquer tela.

## 3. Regra de experiência

Nenhuma seção funcional deve apresentar apenas um título e uma ação.

Sempre que houver conteúdo, teste, mapa, treino ou recomendação, a interface deve fornecer contexto suficiente para o usuário entender:

- O QUE É
- POR QUE IMPORTA
- COMO USAR
- O QUE O RESULTADO SIGNIFICA
- O QUE FAZER DEPOIS

Isso deve ser feito com textos curtos e objetivos, sem transformar o app em um curso longo.

## 4. Anatomia padrão das seções

A estrutura visual e informacional padrão será:

SUBTÍTULO
TÍTULO
descrição curta

O QUE É
explicação breve

COMO USAR
instrução prática

SEU RESULTADO / SUA LEITURA
interpretação quando houver dados

PRÓXIMA AÇÃO
uma ação principal clara

Nem toda seção precisa mostrar os cinco blocos simultaneamente. A regra é mostrar apenas os necessários, mas nunca deixar o usuário sem contexto ou direção.

## 5. Hierarquia tipográfica já aprovada

Manter Titillium Web Itálico em todo o app.

Usar somente:

- 48 px
- 26 px
- 22 px
- 12 px
- 10 px

Regras de casing:

- subtítulos: MAIÚSCULOS
- títulos: MAIÚSCULOS
- descrições: minúsculas/sentence case conforme idioma, sem usar ALL CAPS

A hierarquia deve ser consistente em PT, EN e ES.

## 6. HOME — O QUE EU PRECISO AGORA

A Home deixa de funcionar como uma sequência de widgets independentes.

Nova ordem:

### 6.1 SEU ESTADO HOJE

Mostrar:

- readiness;
- energia;
- foco;
- tensão;
- baseline;
- leitura resumida.

A leitura não deve ser apenas numérica.

Exemplo:

"boa condição para volume. foco estável. fadiga ainda baixa."

### 6.2 O QUE ISSO SIGNIFICA

Criar uma leitura curta baseada nos indicadores do bloco anterior.

Exemplo:

"você está em condição para iniciar, mas seu histórico indica perda de foco no terceiro bloco."

Esse bloco conecta dado com significado.

### 6.3 FOCO DO DIA

A atual "Inteligência de Hoje" vira uma recomendação contextual clara.

Estrutura:

- subtítulo: FOCO DO DIA
- título: PROTEJA O TERCEIRO BLOCO
- descrição curta
- janela crítica, quando aplicável
- motivo da recomendação

Não usar uma recomendação genérica desconectada dos dados exibidos acima.

### 6.4 AÇÃO RECOMENDADA

Mostrar apenas a principal ação sugerida.

Exemplo:

- PREPARAR RESET
- PROGRAMAR BREAK 4
- INICIAR LOCK IN
- FAZER CHECK-IN
- INICIAR SESSÃO

A Home não deve competir com várias ações principais.

### 6.5 FERRAMENTAS PARA ISSO

Os atalhos deixam de ser cards aleatórios.

Exibir somente ferramentas relacionadas ao foco atual.

Exemplo:

FOCO DO DIA: queda de foco no terceiro bloco.

Ferramentas:
- LOCK IN — preparar foco antes da sessão;
- BREAK 4 — programar reset antes da janela crítica.

SALA DE GUERRA só aparece nesse contexto se existir motivo comportamental relevante.

### 6.6 SINAL DE DECISÃO

Decision Cue permanece, mas deve aparecer como reforço final do plano do dia.

Estrutura:

- SINAL DE DECISÃO
- frase
- motivo curto ou contexto

Exemplo:

"resultado anterior não participa desta decisão."

"lembrete para reduzir decisões contaminadas por resultado recente."

## 7. SESSION — JORNADA GUIADA

A sessão deve mostrar progressão de forma explícita.

Fluxo:

1. READY CHECK
2. INTENÇÃO
3. INICIAR
4. SESSÃO ATIVA
5. ESTADO A/B/C GAME
6. DECISION CUE
7. CHECK-IN
8. BREAK 4 quando necessário
9. ENCERRAR
10. DEBRIEF
11. BATTLE DIARY
12. PRÓXIMA RECOMENDAÇÃO

### 7.1 Indicador de etapa

A interface deve sempre mostrar onde o usuário está.

Exemplo:

PREPARAÇÃO · 1/3
SESSÃO ATIVA · 2/3
PÓS-SESSÃO · 3/3

Não precisa ser um wizard pesado. Deve apenas dar orientação de progresso.

### 7.2 Ready Check

Antes das escalas, explicar:

O QUE É:
"um check-in rápido para registrar sua condição antes do jogo."

POR QUE IMPORTA:
"o baseline ajuda a diferenciar queda real de performance de uma impressão momentânea."

COMO USAR:
"avalie energia, foco e tensão com base em como você está agora."

Após resposta:

SUA LEITURA:
interpretação simples dos valores.

PRÓXIMA AÇÃO:
definir intenção.

### 7.3 Intenção

Os objetivos de processo continuam existindo, porém com uma descrição curta do objetivo selecionado.

Exemplo:

PACIÊNCIA
"reduzir ações aceleradas e aceitar spots sem decisão."

### 7.4 Sessão ativa

Prioridade visual:

- tempo;
- estado atual A/B/C Game;
- cue atual;
- ação recomendada;
- check-in/break.

Não empilhar módulos não relacionados.

### 7.5 Check-in

Explicar:

- quando usar;
- o que registrar;
- como o dado será usado depois.

Após salvar:

"check-in registrado. compare este estado com seu baseline no debrief."

### 7.6 Debrief

Estrutura:

- COMO TERMINEI
- O QUE MUDOU
- GATILHOS
- O QUE APRENDER DESTA SESSÃO
- REGISTRAR NO BATTLE DIARY
- PRÓXIMO TREINO RECOMENDADO

O debrief deve fechar o ciclo e não apenas salvar dados.

## 8. TRAIN — ENTENDER → TREINAR → APLICAR

A área Treino deixa de ser apenas uma lista plana.

A tela inicial deve agrupar os módulos pelo objetivo de desenvolvimento.

### 8.1 CONTROLE

Inclui:
- Sala de Guerra;
- Vacinas Psicológicas;
- Mindset.

Objetivo:
controlar resposta emocional, tilt e variância.

### 8.2 LEITURA

Inclui:
- Behavior Lab;
- tells;
- timing;
- baseline.

Objetivo:
melhorar observação e leitura contextual.

### 8.3 FOCO

Inclui:
- Mental Gym;
- reaction;
- Range Memory;
- Attention Shift;
- reset cognitivo.

Objetivo:
treinar atenção, velocidade e estabilidade.

### 8.4 PERFORMANCE

Inclui:
- energia;
- ergonomia;
- mobilidade;
- recuperação;
- zero distraction.

Objetivo:
sustentar capacidade mental durante volume.

### 8.5 ÁUDIO MENTAL

Inclui as playlists já existentes.

Objetivo:
preparar, sustentar, resetar ou desacelerar o estado mental.

## 9. Entrada de cada módulo

Todo módulo deve abrir com uma introdução.

Estrutura:

SUBTÍTULO
TÍTULO
descrição

O QUE VOCÊ VAI TREINAR
2–3 bullets ou frases curtas

QUANDO USAR
contexto de uso

TEMPO ESTIMADO
quando aplicável

INICIAR

O usuário não deve entrar diretamente em um exercício sem saber o que está prestes a fazer.

## 10. Testes e exercícios

Nenhum teste deve abrir apenas com um botão e um número final.

Todo teste terá quatro momentos:

### 10.1 Antes

Mostrar:

- O QUE ESTE TESTE MEDE
- POR QUE ISSO IMPORTA NO POKER
- COMO FAZER
- DURAÇÃO
- INICIAR TESTE

### 10.2 Durante

Interface limpa e focada.

Evitar textos extras que atrapalhem execução.

### 10.3 Resultado

Mostrar:

- resultado bruto;
- comparação com baseline, quando disponível;
- interpretação;
- consistência;
- limite da métrica.

Exemplo:

284 ms

"seu tempo está dentro do seu baseline atual. o objetivo aqui não é buscar velocidade máxima, e sim manter consistência sem perda de precisão."

### 10.4 Próxima ação

Exemplo:

"faça 3 blocos de 60 segundos."

ou

"repita após a sessão e compare a variação."

## 11. MAPA DE CALOR EMOCIONAL

O mapa atual deve ser redesenhado.

Ele não pode ser apenas uma grade visual sem significado explícito.

### 11.1 O que representa

Mostrar no topo:

MAPA DE CALOR EMOCIONAL

"mostra quando sua estabilidade se deteriora ao longo das sessões e quais gatilhos aparecem próximos desses momentos."

### 11.2 Eixo temporal

O mapa deve se organizar por:

- blocos de sessão;
- ou janelas temporais.

Exemplo:

0–45 min
45–90 min
90–135 min
135–180 min
180+ min

### 11.3 Intensidade

Criar legenda explícita:

BAIXA
MODERADA
ALTA
CRÍTICA

Não depender apenas da cor.

### 11.4 Gatilhos associados

Quando houver dados:

- fadiga;
- pressa;
- raiva;
- medo;
- euforia;
- autopilot;
- erro próprio;
- bad beat.

### 11.5 Leitura automática

Abaixo do mapa, gerar uma frase interpretativa.

Exemplo:

"seu maior risco aparece entre 135 e 180 minutos e costuma coincidir com fadiga + pressa."

### 11.6 O que fazer

Mostrar ações ligadas diretamente ao padrão encontrado.

Exemplo:

- programar BREAK 4 antes de 135 min;
- ativar cue de decisão;
- reduzir velocidade de ação;
- fazer check-in de foco.

### 11.7 Estado sem histórico suficiente

Não mostrar mapa vazio ou pseudo-analítico.

Mostrar:

"Ainda não há sessões suficientes para identificar um padrão confiável."

Em seguida:

"registre check-ins durante suas próximas sessões para construir o mapa."

## 12. SALA DE GUERRA

A Sala de Guerra deve deixar claro seu papel.

Introdução:

O QUE É:
"um espaço para reconhecer gatilhos e interromper padrões antes que eles dominem a sessão."

QUANDO USAR:
- após mudança brusca de estado;
- repetição de erro;
- pressa;
- raiva;
- medo;
- fadiga;
- euforia;
- autopilot.

Ações internas:
- MAPA DE CALOR EMOCIONAL
- BATTLE DIARY
- VACINAS PSICOLÓGICAS
- SOS TILT

Não apresentar essas ferramentas como opções sem contexto.

## 13. Mental Audio

Cada playlist deve explicar:

- objetivo;
- melhor momento para usar;
- duração;
- efeito esperado;
- cue principal.

Exemplo:

LOCK IN

"preparação de foco antes de iniciar uma sessão."

MELHOR MOMENTO:
"5–10 minutos antes de jogar."

DURAÇÃO:
38 min

OBJETIVO:
"reduzir ruído mental e entrar na sessão com uma intenção clara."

## 14. Coach

O Coach passa a ser uma camada contextual transversal.

Não deve parecer apenas um chat independente.

O contexto deve indicar ao usuário o que o Coach já sabe naquele momento:

- estado atual;
- fase da sessão;
- check-ins;
- gatilhos recentes;
- treino atual;
- recomendação da Home.

Prompts rápidos devem ser relacionados ao contexto atual.

Exemplo:

- ESTOU ACELERADO
- PERDI FOCO
- ESTOU CANSADO
- QUERO RESETAR
- REVISE ESTA SESSÃO

Nenhuma nova integração de IA externa é exigida neste redesign. A arquitetura deve apenas preservar o locale e o contexto para uso futuro.

## 15. Profile

Perfil deve priorizar evolução antes de configurações.

Nova ordem:

### EVOLUÇÃO
- consistência;
- sessões;
- disciplina;
- tendência A/B/C Game;
- gatilhos mais comuns;
- progresso recente.

### PADRÕES
- janelas críticas;
- pontos fortes;
- pontos em desenvolvimento.

### HISTÓRICO
- sessões;
- check-ins;
- Battle Diary;
- testes.

### CONFIGURAÇÕES
- idioma;
- privacidade;
- plano.

## 16. Cards

Cards só devem existir quando houver uma função clara.

Evitar:
- cards decorativos;
- cards contendo apenas uma frase;
- cards que poderiam ser apenas uma seção no fundo da tela;
- múltiplos cards concorrendo como ação principal.

Usar:
- um card principal quando houver ação prioritária;
- cards menores apenas para ferramentas relacionadas;
- linhas/listas para módulos e histórico;
- seções editoriais diretamente no fundo para explicações.

## 17. Padronização de conteúdo dos cards

Quando houver card:

SUBTÍTULO — MAIÚSCULO
TÍTULO — MAIÚSCULO
descrição — minúscula/sentence case

Ordem:

1. ícone, quando necessário;
2. subtítulo;
3. título;
4. descrição;
5. status/tempo, quando necessário;
6. ação.

Não inverter essa hierarquia entre telas.

## 18. Idiomas

Toda nova copy deve existir simultaneamente em:

- Português;
- English;
- Español.

Português continua sendo padrão inicial.

A nova arquitetura deve continuar usando a camada i18n existente.

Nenhum texto funcional novo pode ser hard-coded diretamente nas telas.

## 19. Regras visuais preservadas

Manter:

- linguagem visual premium;
- carvão / nogueira / bronze envelhecido / marfim;
- fotografia real de poker como fundo;
- Titillium Web Itálico;
- sistema trilingue;
- fundo cinematográfico;
- hierarquia editorial;
- SOS global;
- bottom navigation atual.

Evitar:

- aparência de dashboard corporativo genérico;
- excesso de cards;
- bordas externas sem função;
- mapas sem legenda;
- testes sem instrução;
- telas com listas longas sem agrupamento.

## 20. Dados e recomendações

Nesta fase, as recomendações podem ser derivadas do estado já existente no frontend.

Não é obrigatório criar backend, analytics remoto ou IA nova para executar este redesign.

As recomendações devem ser determinísticas e explicáveis.

Exemplo:

Se:
- foco <= 2;
- ou tensão >= 4;

então:
- recomendar reset/check-in antes de iniciar.

Se:
- histórico indicar queda no terceiro bloco;

então:
- sugerir BREAK 4 antes da janela crítica.

Quando não houver dados suficientes, a interface deve dizer isso explicitamente.

## 21. Estados vazios e incerteza

Nunca inventar análise.

Se não houver histórico suficiente:

- informar que ainda não existe padrão confiável;
- explicar quais dados faltam;
- indicar como gerar esses dados.

Isso vale para:

- heatmap;
- tendências;
- gatilhos;
- evolução;
- recomendações históricas.

## 22. Critérios de aceite

O redesign estará concluído quando:

- a Home apresentar uma sequência clara de estado → significado → foco → ação → ferramentas → próximo passo;
- nenhum card parecer isolado ou sem contexto;
- Session mostrar claramente etapa atual e próximo passo;
- Ready Check explicar o teste antes de pedir respostas;
- todos os testes explicarem o que medem, por que importam e como interpretar resultados;
- Train estiver agrupado por objetivo, não apenas por módulos soltos;
- cada módulo tiver introdução antes da atividade;
- o mapa de calor tiver eixo temporal, legenda, leitura e ações;
- estados sem dados suficientes forem explícitos;
- Coach usar contexto da jornada;
- Profile priorizar evolução;
- subtítulos e títulos estiverem em MAIÚSCULO;
- descrições estiverem em minúscula/sentence case;
- apenas 48/26/22/12/10 px forem utilizados;
- PT/EN/ES tiverem paridade;
- CI, TypeScript, i18n, typography e web export passarem;
- o deploy final do Railway estiver em SUCCESS e responder HTTP 200.

## 23. Não objetivos desta fase

Não faz parte deste redesign:

- criar novo backend;
- criar banco de dados novo;
- adicionar solver;
- criar sistema de apostas;
- criar leaderboard;
- adicionar monetização nova;
- alterar a identidade visual base;
- substituir a navegação inferior;
- remover conteúdo definido no produto original.

O foco é tornar o conteúdo já existente mais compreensível, guiado, contextual e acionável.
