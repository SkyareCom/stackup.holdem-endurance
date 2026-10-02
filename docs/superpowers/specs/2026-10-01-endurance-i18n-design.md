# ENDURANCE — Sistema Trilingue PT / EN / ES

Data: 2026-10-01

## 1. Objetivo

Implantar no STACKUP HOLD'EM ENDURANCE um sistema de internacionalização nativo com três idiomas:

- Português
- English
- Español

Português será sempre o idioma padrão da primeira abertura do aplicativo.

A implementação deve permitir troca instantânea de idioma, persistir a escolha do usuário e garantir que qualquer novo texto funcional adicionado ao app exista obrigatoriamente nos três idiomas.

## 2. Regras de produto

1. Português é o idioma padrão inicial.
2. O idioma do aparelho não altera automaticamente esse padrão.
3. O usuário pode escolher entre Português, English e Español.
4. A escolha de idioma deve existir em dois pontos:
   - tela inicial de entrada do ENDURANCE;
   - Perfil, dentro do aplicativo.
5. Os dois seletores devem compartilhar exatamente o mesmo estado.
6. Uma mudança em qualquer seletor deve atualizar toda a interface imediatamente, sem reiniciar o app.
7. A escolha deve permanecer salva para as próximas aberturas.
8. Se ainda não houver escolha salva, o app abre em Português.
9. Todo conteúdo atual deve ser migrado para a camada de tradução.
10. Toda nova implementação futura deve incluir PT + EN + ES antes de ser considerada válida.

## 3. Idiomas e códigos

Os códigos internos serão:

- `pt` — Português
- `en` — English
- `es` — Español

O estado de idioma nunca deve depender de texto exibido. Componentes, filtros, módulos e fluxos devem usar IDs estáveis e independentes da tradução.

## 4. Arquitetura proposta

Criar uma camada centralizada de internacionalização em `src/i18n/`.

Estrutura:

```
src/i18n/
  index.ts
  types.ts
  I18nProvider.tsx
  storage.ts
  translations/
    pt.ts
    en.ts
    es.ts
```

### `types.ts`

Define:

- `Locale = 'pt' | 'en' | 'es'`;
- schema tipado das chaves de tradução;
- tipos auxiliares para garantir paridade estrutural entre os três idiomas.

### `translations/pt.ts`

Fonte canônica em Português.

### `translations/en.ts`

Tradução completa em Inglês.

### `translations/es.ts`

Tradução completa em Espanhol internacional neutro.

### `I18nProvider.tsx`

Responsável por:

- manter o idioma ativo;
- expor `locale`;
- expor `setLocale(locale)`;
- expor `t(key)`;
- carregar a preferência persistida;
- usar Português quando não houver preferência;
- atualizar imediatamente a interface quando o idioma mudar.

### `storage.ts`

Responsável por persistir apenas o código do idioma selecionado.

## 5. Persistência

A preferência de idioma deve ser persistida localmente no app.

Regras:

- ausência de valor salvo => `pt`;
- valor salvo `pt`, `en` ou `es` => usar diretamente;
- valor inválido => ignorar e voltar para `pt`.

A persistência deve funcionar em Android, iOS e Web.

## 6. Tela inicial de entrada

Na tela atual de abertura do ENDURANCE será inserido um seletor visível antes da entrada no app.

Opções:

- PORTUGUÊS
- ENGLISH
- ESPAÑOL

Comportamento:

- Português selecionado por padrão;
- tocar em outro idioma traduz toda a própria tela imediatamente;
- a seleção é salva;
- o botão de entrada, subtítulos, mantras e demais textos funcionais acompanham o idioma selecionado;
- ENDURANCE permanece como nome próprio do produto.

A estrutura visual premium existente deve ser preservada.

## 7. Perfil

Dentro de Perfil, adicionar uma seção de idioma com as mesmas três opções.

A seção deve:

- mostrar o idioma atual;
- permitir troca imediata;
- refletir exatamente o mesmo estado da tela inicial;
- persistir a nova escolha.

Não deve existir um segundo estado independente de idioma.

## 8. Conteúdo que deve ser traduzido

Todo texto funcional atual deve sair das telas e ir para a camada de i18n.

O escopo inclui:

- entrada;
- navegação;
- Home;
- Session;
- Train;
- Coach;
- Profile;
- SOS;
- Break 4;
- check-ins;
- overlays;
- Sala de Guerra;
- Behavior Lab;
- Mental Gym;
- Performance;
- Mental Audio;
- Battle Diary;
- Vacinas Psicológicas;
- Mindset;
- Emotional Heatmap;
- playlists;
- Decision Cues;
- perguntas do diário;
- lifestyle;
- tells;
- princípios;
- gatilhos da Sala de Guerra;
- placeholders;
- mensagens padrão;
- labels, botões, títulos, subtítulos e descrições.

## 9. Nomes invariantes

Os seguintes nomes podem permanecer iguais quando funcionarem como marca, conceito consolidado ou termo de poker:

- ENDURANCE
- STACKUP HOLD'EM
- A-GAME
- B-GAME
- C-GAME
- LOCK IN
- MTT
- range
- river
- all-in
- tilt
- bad beat

Textos explicativos relacionados a esses termos continuam traduzidos.

## 10. Conteúdo dinâmico

Estados internos nunca devem armazenar texto traduzido.

Exemplo correto:

```ts
{ id: 'anger', labelKey: 'warRoom.trigger.anger' }
```

Exemplo incorreto:

```ts
{ label: 'RAIVA' }
```

Essa regra vale para filtros, módulos, gatilhos, objetivos, playlists, sessões, exercícios, respostas rápidas e itens futuros.

## 11. Coach e IA futura

O Coach deve sempre receber o idioma ativo como parte do contexto.

Regras:

- respostas geradas devem usar o idioma selecionado;
- prompts rápidos devem vir da camada de tradução;
- mensagens históricas do usuário não devem ser retroativamente traduzidas;
- conteúdo novo gerado após a troca deve seguir o novo idioma.

## 12. Tradução automática de novas implementações

“Tradução automática” será uma garantia estrutural do processo de desenvolvimento, sem API externa de tradução em tempo real.

Ao implementar qualquer novo item com texto:

1. a versão PT é criada;
2. as versões EN e ES são criadas no mesmo conjunto de alterações;
3. a chave só pode ser consumida pela UI quando existir nos três catálogos;
4. o CI rejeita a alteração se qualquer idioma estiver incompleto.

O CI deve falhar se:

- faltar uma chave em qualquer idioma;
- a estrutura das três traduções divergir;
- houver texto funcional hard-coded fora da camada permitida;
- um novo item exibir diretamente um rótulo que deveria vir de i18n.

Assim, novas telas e recursos não poderão ser publicados parcialmente traduzidos.

## 13. Validação automática

Adicionar uma verificação de i18n ao CI que valide:

1. paridade de chaves PT/EN/ES;
2. ausência de chaves faltantes;
3. ausência de chaves extras isoladas;
4. ausência de textos funcionais hard-coded nas telas migradas;
5. Português como fallback configurado;
6. compilação TypeScript;
7. build Expo Web.

## 14. Compatibilidade visual

O sistema de idiomas não deve alterar:

- identidade visual;
- fotografias;
- paleta;
- layout existente;
- navegação;
- componentes;
- Titillium Web Itálico;
- hierarquia visual;
- posicionamento do SOS.

A única inclusão visual é o seletor de idioma na tela inicial e em Perfil.

## 15. Compatibilidade de plataforma

A solução deve funcionar em:

- Android;
- iOS;
- Web.

A implementação não deve depender de APIs externas de tradução em tempo real, evitando dependência de rede, custo variável e inconsistência terminológica.

## 16. Migração

A implantação seguirá esta sequência:

1. criar a camada i18n;
2. configurar Português como fallback;
3. adicionar persistência multiplataforma;
4. adicionar seletor na entrada;
5. adicionar seletor em Perfil;
6. migrar entrada e navegação;
7. migrar Home;
8. migrar Session;
9. migrar Train;
10. migrar Coach;
11. migrar Profile;
12. migrar overlays e conteúdos;
13. converter metadados para IDs + translation keys;
14. adicionar validação de paridade e hard-coded strings;
15. executar TypeScript;
16. executar build web;
17. publicar;
18. verificar domínio e HTTP 200.

## 17. Critérios de aceite

A implementação estará concluída somente quando:

- a primeira abertura estiver 100% em Português;
- não houver mistura indevida de PT/EN/ES na interface;
- o seletor PT/EN/ES existir na tela inicial;
- o seletor PT/EN/ES existir em Perfil;
- alterar idioma em qualquer um dos dois pontos atualizar todo o app;
- a escolha persistir após reabrir;
- PT, EN e ES cobrirem todo o conteúdo existente;
- nomes próprios definidos como invariantes permanecerem consistentes;
- novos textos sem as três traduções forem bloqueados pelo CI;
- TypeScript passar;
- build web passar;
- deploy terminar em SUCCESS;
- domínio público responder HTTP 200.
