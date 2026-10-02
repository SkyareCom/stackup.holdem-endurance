# ENDURANCE Guided Performance Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize ENDURANCE into a guided mental-performance journey where every major screen explains what the user is seeing, why it matters, what to do next, and how the result should be interpreted.

**Architecture:** Keep the existing React Native / Expo Router structure, bottom navigation, overlays, i18n system, and visual identity. Add one pure guidance layer for deterministic recommendations, one reusable guided-section component for consistent information hierarchy, and migrate Home, Session, Train, overlays/tests, Coach, and Profile onto that shared UX grammar.

**Tech Stack:** React Native 0.86.3, Expo SDK 57, Expo Router, TypeScript 5.9, Vitest, existing PT/EN/ES i18n layer, GitHub Actions CI, Railway web deployment.

**Spec:** `docs/superpowers/specs/2026-10-02-endurance-guided-ux-redesign.md`

## Global Constraints

- Preserve bottom navigation: INÍCIO / SESSÃO / TREINO / COACH / PERFIL.
- Preserve global SOS access.
- Preserve Titillium Web Italic everywhere.
- Use only font sizes 48 / 26 / 22 / 12 / 10 px.
- Subtitles are uppercase.
- Titles are uppercase.
- Descriptions are sentence case / lowercase prose, never ALL CAPS.
- Every new functional string must exist in PT / EN / ES.
- Portuguese remains the first-run default.
- Do not add backend, database, solver, gambling functions, leaderboard, or new monetization.
- Recommendations must be deterministic and explainable from existing frontend state.
- Never invent historical analysis; show an explicit insufficient-data state instead.
- Preserve visual identity, photography, palette, SOS, current navigation, and product features.
- Prefer sections on the page background over decorative cards when a card has no action or state.
- A major flow must always make the next action understandable.

## Review Focus

1. **Insufficient history:** heatmap, trends, and historical recommendations must explain that there is not enough data instead of showing pseudo-analysis.
2. **Conflicting readiness inputs:** high tension or low focus must produce a clear pre-session reset recommendation instead of a generic start-session action.
3. **Locale switching mid-flow:** switching PT/EN/ES must not reset Session phase, selected goal, test phase, module, or user-authored text.
4. **Long translated copy:** EN/ES titles and explanatory blocks must remain readable on mobile without overflow, clipping, or new font sizes.
5. **Card drift:** future cards must preserve subtitle → title → description → status/action order and the casing rules.

---

## File Structure

**Create**
- `src/guidance.ts` — pure deterministic recommendation and interpretation logic.
- `src/components/GuidedSection.tsx` — reusable section anatomy for subtitle/title/description/context/action.
- `src/components/FlowProgress.tsx` — compact stage indicator for Session.
- `src/components/TestIntro.tsx` — shared test/exercise introduction pattern.
- `src/i18n/__tests__/guidance.test.ts` — recommendation logic.
- `src/i18n/__tests__/guided-home-contract.test.ts` — Home structure.
- `src/i18n/__tests__/guided-session-contract.test.ts` — Session structure/state.
- `src/i18n/__tests__/guided-train-contract.test.ts` — Train grouping/module intro.
- `src/i18n/__tests__/guided-overlays-contract.test.ts` — tests, heatmap, War Room, audio.
- `src/i18n/__tests__/guided-coach-profile-contract.test.ts` — Coach/Profile structure.
- `scripts/check-guided-ux.mjs` — source-level UX/casing/card-structure audit.

**Modify**
- `app/index.tsx` — preserve navigation; pass any new contextual callbacks/state needed by guided flows.
- `src/content.ts` — training groups, module intro metadata, test metadata, heatmap labels, contextual tool metadata.
- `src/types.ts` — add stable IDs/types for guided groups, test phases, and guidance state.
- `src/screens/HomeScreen.tsx`
- `src/screens/SessionScreen.tsx`
- `src/screens/TrainScreen.tsx`
- `src/screens/CoachScreen.tsx`
- `src/screens/ProfileScreen.tsx`
- `src/overlays.tsx`
- `src/styles.ts` — guided-section, progress, map legend, result, and action styles; no new font sizes.
- `src/i18n/translations/pt.ts`
- `src/i18n/translations/en.ts`
- `src/i18n/translations/es.ts`
- `.github/workflows/ci.yml` — add guided UX validation.

---

### Task 1: Guidance Model and Shared Guided-Section Grammar

**Files:**
- Create: `src/guidance.ts`
- Create: `src/components/GuidedSection.tsx`
- Create: `src/i18n/__tests__/guidance.test.ts`
- Modify: `src/types.ts`
- Modify: `src/styles.ts`
- Modify: all three translation catalogs

**Interfaces:**
- Produces:
  - `type ReadinessSnapshot = { energy: number; focus: number; tension: number }`
  - `type GuidanceActionId = 'start-session' | 'lock-in' | 'break-4' | 'check-in' | 'reset'`
  - `type GuidanceResult = { actionId: GuidanceActionId; titleKey: TranslationKey; bodyKey: TranslationKey; reasonKey: TranslationKey }`
  - `getReadinessGuidance(snapshot: ReadinessSnapshot): GuidanceResult`
  - `getHistoryGuidance(input: { hasHistory: boolean; thirdBlockDrop: boolean }): GuidanceResult | null`
  - `GuidedSection(props)` with subtitle/title/description plus optional explanation, result, and action regions.

- [ ] **Step 1: Write failing guidance tests**

Assert:
- focus <= 2 returns reset/check-in guidance;
- tension >= 4 returns reset guidance;
- normal readiness returns start-session guidance;
- `hasHistory:false` returns no historical recommendation;
- `thirdBlockDrop:true` returns Break 4 / third-block protection guidance.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/i18n/__tests__/guidance.test.ts`

Expected: FAIL because `src/guidance.ts` does not exist.

- [ ] **Step 3: Implement pure guidance logic**

Implement only deterministic rules from the spec. No random values, network calls, or AI-generated analysis.

- [ ] **Step 4: Add `GuidedSection`**

The component must render the standard grammar:
- subtitle;
- title;
- description;
- optional “what it is” / “how to use” / result / next-action children.

It must use `AppText` / `Serif` and existing typography rules.

- [ ] **Step 5: Add PT/EN/ES keys for shared labels**

Include:
- O QUE É / WHAT IT IS / QUÉ ES
- COMO USAR / HOW TO USE / CÓMO USAR
- SUA LEITURA / YOUR READING / TU LECTURA
- PRÓXIMA AÇÃO / NEXT ACTION / PRÓXIMA ACCIÓN
- insufficient-data language.

- [ ] **Step 6: Verify**

Run:
- `npm test -- src/i18n/__tests__/guidance.test.ts`
- `node scripts/check-typography.mjs`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 7: Commit**

`git commit -m "feat: add guided performance UX primitives"`

---

### Task 2: Home — State → Meaning → Focus → Action → Tools → Cue

**Files:**
- Create: `src/i18n/__tests__/guided-home-contract.test.ts`
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/content.ts`
- Modify: all three translation catalogs
- Modify: `src/styles.ts`

**Interfaces:**
- Consumes: `getReadinessGuidance()`, `getHistoryGuidance()`, `GuidedSection`.
- Home order is fixed:
  1. SEU ESTADO HOJE
  2. O QUE ISSO SIGNIFICA
  3. FOCO DO DIA
  4. AÇÃO RECOMENDADA
  5. FERRAMENTAS PARA ISSO
  6. SINAL DE DECISÃO

- [ ] **Step 1: Write failing Home contract test**

Assert source order of the six sections above, require one primary action, and reject the existing isolated quick-card arrangement as the main Home structure.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/i18n/__tests__/guided-home-contract.test.ts`

Expected: FAIL against current Home.

- [ ] **Step 3: Rebuild Home hierarchy**

Keep readiness values and current visual background, but turn the page into the ordered guided sequence.

Use existing 82 / energy 4 / focus 4 / tension 2 fixture values until real data exists.

- [ ] **Step 4: Make tool recommendations contextual**

For current third-block history fixture:
- primary focus: protect third block;
- recommended tool: BREAK 4;
- secondary supporting tool: LOCK IN;
- do not show Sala de Guerra unless a behavioral trigger exists.

- [ ] **Step 5: Add explanation under Decision Cue**

The cue is followed by one short explanatory sentence.

- [ ] **Step 6: Apply casing rule**

All Home card/section subtitles and titles uppercase; descriptive prose sentence case.

- [ ] **Step 7: Verify**

Run:
- `npm test -- src/i18n/__tests__/guided-home-contract.test.ts`
- `node scripts/check-i18n.mjs`
- `node scripts/check-typography.mjs`
- `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 8: Commit**

`git commit -m "feat: turn home into a guided performance journey"`

---

### Task 3: Session — Explicit Progress and Next Step

**Files:**
- Create: `src/components/FlowProgress.tsx`
- Create: `src/i18n/__tests__/guided-session-contract.test.ts`
- Modify: `src/screens/SessionScreen.tsx`
- Modify: all three translation catalogs
- Modify: `src/styles.ts`

**Interfaces:**
- Produces: `FlowProgress({ current, total, label }: { current:number; total:number; label:string })`.
- Session high-level phases remain stable IDs: `ready | active | debrief`.
- Visible labels:
  - PREPARAÇÃO · 1/3
  - SESSÃO ATIVA · 2/3
  - PÓS-SESSÃO · 3/3

- [ ] **Step 1: Write failing Session contract tests**

Assert:
- FlowProgress appears in all three phases;
- Ready Check contains what/why/how context before scales;
- selected goal keeps stable `ProcessGoalId`;
- Active prioritizes timer → A/B/C → cue → recommended action → check-in/break;
- Debrief ends with next recommended training/action.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/i18n/__tests__/guided-session-contract.test.ts`

- [ ] **Step 3: Implement `FlowProgress` and Ready Check guidance**

Add explanatory copy before scales and a computed reading after selections.

- [ ] **Step 4: Expand process intention**

The selected process goal gets a short explanatory description from the translation catalog.

- [ ] **Step 5: Reorder Active Session**

Keep all existing functionality, but enforce the visual order from the spec and place check-in/break as contextual actions.

- [ ] **Step 6: Rebuild Debrief**

Sections:
- COMO TERMINEI
- O QUE MUDOU
- GATILHOS
- O QUE APRENDER DESTA SESSÃO
- BATTLE DIARY
- PRÓXIMO TREINO RECOMENDADO

- [ ] **Step 7: Verify state stability**

Test locale changes do not reset:
- phase;
- A/B/C state;
- selected goal;
- cue index;
- trigger IDs.

- [ ] **Step 8: Verify full task**

Run:
- `npm test -- src/i18n/__tests__/guided-session-contract.test.ts`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

- [ ] **Step 9: Commit**

`git commit -m "feat: guide the Endurance session lifecycle"`

---

### Task 4: Train — Group Modules by Objective and Explain Entry

**Files:**
- Create: `src/i18n/__tests__/guided-train-contract.test.ts`
- Modify: `src/content.ts`
- Modify: `src/types.ts`
- Modify: `src/screens/TrainScreen.tsx`
- Modify: all three translation catalogs
- Modify: `src/styles.ts`

**Interfaces:**
- Produces:
  - `type TrainingGroupId = 'control' | 'reading' | 'focus' | 'performance' | 'audio'`
  - `trainingGroups: readonly { id; titleKey; descriptionKey; moduleIds }[]`
  - module intro metadata with `whatKey`, `whenKey`, `durationKey`.

- [ ] **Step 1: Write failing Train contract test**

Assert group IDs and membership:
- CONTROL: war, vaccines, mindset
- READING: behavior
- FOCUS: gym
- PERFORMANCE: lifestyle
- AUDIO: audio

Assert each group has translated description and each module has intro metadata.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/i18n/__tests__/guided-train-contract.test.ts`

- [ ] **Step 3: Add group and module-intro data**

Use stable IDs only; text comes from PT/EN/ES catalogs.

- [ ] **Step 4: Rebuild Train landing**

Render grouped sections with:
- group title;
- one-sentence objective;
- modules beneath;
- module row title + short purpose.

Do not return to a flat numbered list.

- [ ] **Step 5: Preserve Mental Reserve as a contextual summary**

Place it after the grouped training areas with a short explanation of what it means.

- [ ] **Step 6: Verify**

Run:
- `npm test -- src/i18n/__tests__/guided-train-contract.test.ts`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

- [ ] **Step 7: Commit**

`git commit -m "feat: organize training by performance objective"`

---

### Task 5: Module Entry and Test/Exercise Four-Phase Pattern

**Files:**
- Create: `src/components/TestIntro.tsx`
- Create: `src/i18n/__tests__/guided-overlays-contract.test.ts`
- Modify: `src/overlays.tsx`
- Modify: `src/content.ts`
- Modify: `src/types.ts`
- Modify: all three translation catalogs
- Modify: `src/styles.ts`

**Interfaces:**
- Produces:
  - `type ExercisePhase = 'intro' | 'running' | 'result' | 'next'`
  - `TestIntro({ titleKey, measuresKey, importanceKey, instructionsKey, durationKey, onStart })`
- Reaction Test is the first concrete test migrated to the four-phase pattern.

- [ ] **Step 1: Write failing overlay/test contract**

Assert Reaction Test starts at `intro`, not directly on the tappable test.
Require the intro to expose:
- what it measures;
- why it matters in poker;
- how to perform it;
- duration;
- start action.

Require result state to show:
- raw result;
- baseline interpretation;
- consistency note;
- next action.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/i18n/__tests__/guided-overlays-contract.test.ts`

- [ ] **Step 3: Add generic module intro**

Every module overlay must begin with:
- what you will train;
- when to use;
- estimated time when applicable;
- start/continue affordance.

- [ ] **Step 4: Implement Reaction Test phases**

Keep execution screen sparse. Do not show long guidance while the test is running.

- [ ] **Step 5: Add result interpretation**

For the current placeholder 284 ms result, copy must state that consistency matters more than chasing maximum speed.

- [ ] **Step 6: Preserve user text and local state**

Changing locale must not clear diary text, selected playlist, selected trigger, test phase, or result.

- [ ] **Step 7: Verify**

Run:
- `npm test -- src/i18n/__tests__/guided-overlays-contract.test.ts`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

- [ ] **Step 8: Commit**

`git commit -m "feat: explain modules and tests before interaction"`

---

### Task 6: Emotional Heatmap — Meaningful Timeline, Legend, Reading, Action

**Files:**
- Modify: `src/overlays.tsx`
- Modify: `src/content.ts`
- Modify: all three translation catalogs
- Modify: `src/i18n/__tests__/guided-overlays-contract.test.ts`
- Modify: `src/styles.ts`

**Interfaces:**
- Heatmap time buckets:
  - 0–45 min
  - 45–90 min
  - 90–135 min
  - 135–180 min
  - 180+ min
- Intensity IDs:
  - low
  - moderate
  - high
  - critical
- Produces a deterministic readout from fixture/history availability.

- [ ] **Step 1: Extend test with failing heatmap assertions**

Require:
- explicit time axis;
- explicit intensity legend;
- trigger association;
- automatic reading;
- action recommendations;
- insufficient-history state.

- [ ] **Step 2: Verify RED**

Run heatmap-focused test.

- [ ] **Step 3: Replace decorative 28-cell grid**

Render a small time-based heatmap where each bucket has:
- label;
- intensity;
- optional trigger label.

Do not rely on color alone.

- [ ] **Step 4: Add automatic reading**

For the current third-block fixture:
“highest risk appears between 135 and 180 minutes and commonly coincides with fatigue + rush” translated in all locales.

- [ ] **Step 5: Add direct actions**

Expose:
- schedule Break 4 before 135 min;
- activate Decision Cue;
- slow decision tempo;
- run focus check-in.

- [ ] **Step 6: Add insufficient-history state**

When `hasHistory === false`, do not render analytical buckets. Explain what data is missing and how to collect it.

- [ ] **Step 7: Verify**

Run:
- `npm test -- src/i18n/__tests__/guided-overlays-contract.test.ts`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

- [ ] **Step 8: Commit**

`git commit -m "feat: make emotional heatmap actionable"`

---

### Task 7: War Room and Mental Audio Context

**Files:**
- Modify: `src/overlays.tsx`
- Modify: `src/content.ts`
- Modify: all three translation catalogs
- Modify: `src/i18n/__tests__/guided-overlays-contract.test.ts`

**Interfaces:**
- War Room entry explains purpose and use cases before actions.
- Playlist items expose objective, best-use moment, duration, expected effect, and cue.

- [ ] **Step 1: Add failing context assertions**

Require War Room copy for:
- what it is;
- when to use;
- MAPA DE CALOR EMOCIONAL;
- BATTLE DIARY;
- VACINAS PSICOLÓGICAS;
- SOS TILT.

Require each playlist to expose:
- objective;
- best moment;
- duration;
- expected effect;
- cue.

- [ ] **Step 2: Verify RED**

- [ ] **Step 3: Implement War Room context**

Replace bare action rows with contextualized actions; avoid decorative cards.

- [ ] **Step 4: Expand Mental Audio items**

Keep playlist selection behavior but add the explanatory fields from content metadata.

- [ ] **Step 5: Verify**

Run full overlay tests, i18n validation, and TypeScript.

- [ ] **Step 6: Commit**

`git commit -m "feat: contextualize war room and mental audio"`

---

### Task 8: Coach and Profile — Context and Evolution First

**Files:**
- Create: `src/i18n/__tests__/guided-coach-profile-contract.test.ts`
- Modify: `src/screens/CoachScreen.tsx`
- Modify: `src/screens/ProfileScreen.tsx`
- Modify: all three translation catalogs
- Modify: `src/styles.ts`

**Interfaces:**
- Coach shows active context summary before chat.
- Profile order:
  1. EVOLUÇÃO
  2. PADRÕES
  3. HISTÓRICO
  4. CONFIGURAÇÕES

- [ ] **Step 1: Write failing Coach/Profile contract**

Assert:
- Coach context includes readiness/session phase/recent trigger/training recommendation placeholders where data exists;
- quick prompts remain contextual;
- user-entered text stays raw;
- Profile section order matches spec;
- language/privacy/plan move under Configurações.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/i18n/__tests__/guided-coach-profile-contract.test.ts`

- [ ] **Step 3: Rebuild Coach context header**

Make the current-state block explain what the Coach is using as context. Do not add external AI/network behavior.

- [ ] **Step 4: Reorder Profile**

Move progress first, then patterns, history, settings. Add explicit insufficient-history copy where needed.

- [ ] **Step 5: Verify**

Run:
- `npm test -- src/i18n/__tests__/guided-coach-profile-contract.test.ts`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

- [ ] **Step 6: Commit**

`git commit -m "feat: make coach contextual and profile evolution-first"`

---

### Task 9: Global UX Guardrails, Card Casing, Regression, and Release

**Files:**
- Create: `scripts/check-guided-ux.mjs`
- Modify: `.github/workflows/ci.yml`
- Modify: `src/styles.ts` only if visual regression fixes are needed.
- Modify: any scoped screen only if verification finds a defect.

**Interfaces:**
- `scripts/check-guided-ux.mjs` enforces:
  - no disallowed font sizes;
  - no legacy isolated Home quick-card pattern;
  - all guided screens import shared guided primitives where required;
  - no raw functional copy outside i18n;
  - card title/subtitle styles are uppercase-driven;
  - description styles do not force uppercase.

- [ ] **Step 1: Write the failing UX audit**

Add checks for the old structures that must no longer exist.

- [ ] **Step 2: Verify RED before wiring CI**

Run: `node scripts/check-guided-ux.mjs`

Expected: FAIL until all prior tasks are complete.

- [ ] **Step 3: Finish the audit and add to CI**

CI order:
1. install;
2. `npm test`;
3. typography validation;
4. i18n validation;
5. guided UX validation;
6. TypeScript;
7. Expo Web export.

- [ ] **Step 4: Run full automated regression**

Run:
- `npm test`
- `node scripts/check-typography.mjs`
- `node scripts/check-i18n.mjs`
- `node scripts/check-guided-ux.mjs`
- `npx tsc --noEmit`
- `npx expo export --platform web`

Expected: PASS.

- [ ] **Step 5: Mobile visual smoke pass**

Verify on a narrow mobile viewport:
- no card/text overflow in PT/EN/ES;
- titles/subtitles uppercase;
- descriptions readable and not uppercase;
- SOS position preserved;
- Home reads top-to-bottom as one journey;
- Session always exposes current stage and next action;
- Train grouping is obvious;
- Reaction Test explains itself before start;
- heatmap is readable without interpreting color alone;
- empty-history state is explicit;
- bottom nav remains unchanged.

- [ ] **Step 6: Deploy only the validated main commit to Railway**

Service: `endurance-web`.

Preserve:
- build: `npx expo export --platform web`
- start: `npx --yes serve@14.2.5 dist -s -l $PORT`
- healthcheck: `/`
- domain: `endurance-web-production.up.railway.app`
- region: `sfo`.

- [ ] **Step 7: Verify production**

Require:
- GitHub Actions: SUCCESS
- Railway: SUCCESS
- production GET `/`: HTTP 200
- published commit hash matches validated commit.

- [ ] **Step 8: Commit any verification-only corrections and rerun all gates before redeploying**

Do not claim completion until the final production commit passes every gate.
