# ENDURANCE Trilingual i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement complete Portuguese/English/Spanish localization in ENDURANCE, with Portuguese as the first-run default, synchronized language selectors on the landing screen and Profile, persisted language choice, and CI enforcement for every future user-facing string.

**Architecture:** Add a typed `src/i18n/` subsystem with stable locale IDs, translation catalogs, a provider/hook, and cross-platform persistence via AsyncStorage. Existing state continues to use stable IDs; UI strings are resolved from translation keys at render time. A shared `LanguageSelector` is rendered both on the landing screen and Profile, while CI validates catalog parity and rejects new hard-coded functional copy.

**Tech Stack:** React Native 0.86.3, Expo SDK 57, Expo Router, TypeScript 5.9, `@react-native-async-storage/async-storage`, Vitest for pure TypeScript i18n tests, existing GitHub Actions CI, Railway web deployment.

**Spec:** `docs/superpowers/specs/2026-10-01-endurance-i18n-design.md`

## Global Constraints

- Supported locales are exactly `pt`, `en`, and `es`.
- Portuguese (`pt`) is always the default when no valid stored preference exists.
- Device locale must not override the first-run Portuguese default.
- Language changes must update the whole app immediately without restart.
- The landing selector and Profile selector must use the same single language state.
- The selected locale must persist across Android, iOS, and Web.
- All current functional copy must be localized in PT/EN/ES.
- New functional copy must not ship unless PT/EN/ES entries all exist.
- ENDURANCE, STACKUP HOLD'EM, A-GAME, B-GAME, C-GAME, LOCK IN, MTT, range, river, all-in, tilt, and bad beat may remain invariant when used as product/poker terms.
- No external runtime translation API is allowed.
- Titillium Web Italic remains the global typography.
- Existing visual identity, photography, layout, navigation, and SOS placement remain unchanged except for the two language selectors.
- Final release requires passing CI, TypeScript, Expo Web export, Railway `SUCCESS`, and HTTP 200.

## Review Focus

1. **Empty/invalid persisted locale:** `null`, empty string, or unknown values must resolve to `pt`; Task 1 tests this explicitly.
2. **Rapid language switching:** repeated PT→EN→ES changes must leave the last selected locale active and persisted; Task 3 tests the locale reducer/core state path and smoke-tests both selectors.
3. **Catalog drift:** missing or extra keys in EN/ES must fail CI before TypeScript/build; Task 2 adds parity tests and a CI gate.
4. **Stable state across translation changes:** selected process goals, triggers, modules, playlists, and game states must remain selected after changing locale because state stores IDs, not translated labels; Tasks 4–6 add tests/source checks for stable IDs.
5. **User-authored content:** diary/chat text must remain exactly as entered when locale changes; Task 7 explicitly tests that only interface/system copy changes.

---

## File Structure

**Create**
- `src/i18n/types.ts` — locale type, translation key/catalog types.
- `src/i18n/core.ts` — pure locale normalization and translation lookup helpers.
- `src/i18n/storage.ts` — AsyncStorage read/write for the locale.
- `src/i18n/I18nProvider.tsx` — global locale state, persistence, `t()`, and hook.
- `src/i18n/index.ts` — public i18n exports.
- `src/i18n/translations/pt.ts` — canonical Portuguese catalog.
- `src/i18n/translations/en.ts` — English catalog.
- `src/i18n/translations/es.ts` — neutral international Spanish catalog.
- `src/components/LanguageSelector.tsx` — shared PT/EN/ES selector.
- `scripts/check-i18n.mjs` — catalog parity + hard-coded functional-copy CI audit.
- `src/i18n/__tests__/core.test.ts` — pure i18n behavior tests.
- `src/i18n/__tests__/catalogs.test.ts` — translation parity and required-copy tests.

**Modify**
- `package.json` — AsyncStorage, Vitest, test scripts.
- `app/_layout.tsx` — mount `I18nProvider` after fonts load.
- `app/index.tsx` — localized landing/navigation + landing selector.
- `src/ui.tsx` — localize shared Header status and remove functional hard-coded copy.
- `src/content.ts` — convert localizable content to stable IDs + translation keys.
- `src/types.ts` — convert module metadata labels/subtitles to translation keys.
- `src/screens/HomeScreen.tsx`
- `src/screens/SessionScreen.tsx`
- `src/screens/TrainScreen.tsx`
- `src/screens/CoachScreen.tsx`
- `src/screens/ProfileScreen.tsx`
- `src/overlays.tsx`
- `src/styles.ts` — language selector styles only.
- `.github/workflows/ci.yml` — tests + i18n audit + web export.

---

### Task 1: Typed i18n Core, Portuguese Fallback, and Persistence

**Files:**
- Create: `src/i18n/types.ts`
- Create: `src/i18n/core.ts`
- Create: `src/i18n/storage.ts`
- Create: `src/i18n/I18nProvider.tsx`
- Create: `src/i18n/index.ts`
- Create: `src/i18n/__tests__/core.test.ts`
- Modify: `package.json`
- Modify: `app/_layout.tsx`

**Interfaces:**
- Produces: `type Locale = 'pt' | 'en' | 'es'`
- Produces: `normalizeLocale(value: unknown): Locale`
- Produces: `loadLocale(): Promise<Locale>`
- Produces: `saveLocale(locale: Locale): Promise<void>`
- Produces: `useI18n(): { locale: Locale; setLocale(locale: Locale): void; t(key: TranslationKey): string }`
- Uses storage key: `@stackup/endurance/locale`

- [ ] **Step 1: Add the failing locale-core tests**

Add Vitest tests asserting:
- `normalizeLocale(undefined) === 'pt'`
- `normalizeLocale(null) === 'pt'`
- `normalizeLocale('') === 'pt'`
- `normalizeLocale('fr') === 'pt'`
- valid `pt`, `en`, `es` pass through unchanged.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/i18n/__tests__/core.test.ts`

Expected: FAIL because i18n core and/or Vitest are not yet present.

- [ ] **Step 3: Install test/persistence dependencies and implement the minimal core**

Run dependency installation with Expo compatibility:
`npx expo install @react-native-async-storage/async-storage`
and add Vitest as a dev dependency.

Add scripts:
- `"test": "vitest run"`
- `"test:i18n": "vitest run src/i18n/__tests__"`

Implement the exact interfaces above. `I18nProvider` starts with `pt`, hydrates from `loadLocale()`, and persists every explicit `setLocale()`.

- [ ] **Step 4: Mount the provider at the root**

In `app/_layout.tsx`, keep the existing Titillium Web font loading and wrap the app stack with `I18nProvider`. Do not render app UI until fonts and persisted locale hydration are ready.

- [ ] **Step 5: Run tests and TypeScript**

Run:
- `npm test -- src/i18n/__tests__/core.test.ts`
- `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 6: Commit**

`git commit -m "feat: add Endurance i18n core and locale persistence"`

---

### Task 2: Complete PT/EN/ES Catalogs and CI Contract

**Files:**
- Create: `src/i18n/translations/pt.ts`
- Create: `src/i18n/translations/en.ts`
- Create: `src/i18n/translations/es.ts`
- Create: `src/i18n/__tests__/catalogs.test.ts`
- Create: `scripts/check-i18n.mjs`
- Modify: `src/i18n/types.ts`
- Modify: `src/i18n/core.ts`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `TranslationKey` covering all current functional copy.
- Produces: `translations: Record<Locale, TranslationCatalog>`.
- `t(key)` returns the active-locale string and falls back to Portuguese only for a runtime lookup failure that escaped CI.

- [ ] **Step 1: Write failing catalog-parity tests**

Tests assert:
- PT/EN/ES expose identical key sets;
- each value is a non-empty string;
- Portuguese contains the expected first-run copy for landing, Home, Session, Train, Coach, Profile, overlays, and navigation;
- invariant product terms are present exactly where specified.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- src/i18n/__tests__/catalogs.test.ts`

Expected: FAIL because catalogs are not complete.

- [ ] **Step 3: Implement all three translation catalogs**

Translate all currently shipped functional copy into:
- natural Brazilian Portuguese;
- natural English;
- neutral international Spanish.

Keep invariant product/poker terms from the spec unchanged where appropriate.

- [ ] **Step 4: Implement `scripts/check-i18n.mjs`**

The script must:
- compare exact PT/EN/ES key parity;
- reject empty values;
- scan `app/index.tsx`, `src/ui.tsx`, `src/components/**/*.tsx`, `src/screens/**/*.tsx`, and `src/overlays.tsx` for new user-facing hard-coded JSX text/label/title/subtitle/placeholder strings;
- allow only explicit invariant/technical literals (brand names, numeric displays, icon-independent symbols, stable IDs);
- maintain a temporary `LEGACY_I18N_FILES` baseline containing only the currently unmigrated files so CI stays green during the staged migration;
- fail if a file outside that baseline introduces hard-coded functional copy.

Use the TypeScript AST rather than broad regex for TSX user-facing strings. The initial temporary baseline is exactly:
- `app/index.tsx`
- `src/ui.tsx`
- `src/screens/HomeScreen.tsx`
- `src/screens/SessionScreen.tsx`
- `src/screens/TrainScreen.tsx`
- `src/screens/CoachScreen.tsx`
- `src/screens/ProfileScreen.tsx`
- `src/overlays.tsx`

Each migration task below must remove its completed files from this baseline. Task 7 must leave the baseline empty.

- [ ] **Step 5: Put the i18n gate before TypeScript in CI**

CI order:
1. install;
2. `npm test`;
3. `node scripts/check-typography.mjs`;
4. `node scripts/check-i18n.mjs`;
5. `npx tsc --noEmit`;
6. `npx expo export --platform web`.

- [ ] **Step 6: Verify GREEN**

Run:
- `npm test`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

Expected: PASS. Catalog parity is enforced immediately, while only the explicitly listed legacy files are temporarily exempt from the hard-coded-copy scan. No new file is exempt.

- [ ] **Step 7: Commit**

`git commit -m "test: enforce complete Endurance translations"`

---

### Task 3: Shared Language Selector and Global Locale Switching

**Files:**
- Create: `src/components/LanguageSelector.tsx`
- Modify: `src/styles.ts`
- Modify: `app/index.tsx`
- Modify: `src/screens/ProfileScreen.tsx`

**Interfaces:**
- Consumes: `useI18n()` from Task 1.
- Produces: `LanguageSelector({ variant }: { variant: 'landing' | 'profile' }): JSX.Element`.
- Options are stable IDs `pt`, `en`, `es`; display labels come from translations.

- [ ] **Step 1: Add failing selector-contract assertions**

Extend the i18n test/audit to require:
- exactly three locale options;
- default selected locale `pt`;
- both landing and Profile import the same `LanguageSelector`;
- no local language state exists in either screen.

- [ ] **Step 2: Verify RED**

Run: `npm test && node scripts/check-i18n.mjs`

Expected: FAIL because the selector does not exist.

- [ ] **Step 3: Implement the shared selector**

The selector reads `locale` and calls `setLocale`. It must not own independent state.

Landing labels:
- `PORTUGUÊS`
- `ENGLISH`
- `ESPAÑOL`

Profile uses the same component and same state.

- [ ] **Step 4: Add selector styling without changing existing layout hierarchy**

Add only selector container, option, active option, and text styles. Preserve Titillium Web Italic through `AppText`.

- [ ] **Step 5: Verify switching contract**

Run:
- `npm test`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

Smoke-check PT→EN→ES→PT on both selector locations and verify the last choice is still active after reload.

- [ ] **Step 6: Commit**

`git commit -m "feat: add synchronized language selectors"`

---

### Task 4: Localize Landing, Navigation, Shared UI, and Home

**Files:**
- Modify: `app/index.tsx`
- Modify: `src/ui.tsx`
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/types.ts`
- Modify: `src/content.ts`
- Modify: `src/i18n/translations/pt.ts`
- Modify: `src/i18n/translations/en.ts`
- Modify: `src/i18n/translations/es.ts`

**Interfaces:**
- Module metadata becomes `{ titleKey, subtitleKey, icon }`, keyed by stable `Module` IDs.
- Content data stores stable IDs and translation keys, never translated labels.

- [ ] **Step 1: Add failing required-copy/stable-ID tests**

Assert Portuguese first-run rendering keys include:
- `DIVISÃO DE PERFORMANCE`
- `O SISTEMA DE PERFORMANCE MENTAL`
- `FOCO`
- `DISCIPLINA`
- `RESILIÊNCIA`
- `MELHORES DECISÕES`
- `UM JOGO MAIS LONGO`
- `ENTRAR NO ENDURANCE`
- Home/navigation Portuguese equivalents.

Assert module/content state entries expose IDs/keys rather than localized label strings.

- [ ] **Step 2: Verify RED**

Run: `npm test && node scripts/check-i18n.mjs`

Expected: FAIL on current mixed PT/EN landing/Home/shared UI.

- [ ] **Step 3: Replace hard-coded landing/nav/shared UI strings with `t()`**

Preserve `ENDURANCE` and `STACKUP HOLD'EM` as invariant brand names.

- [ ] **Step 4: Migrate Home and module metadata**

Translate Home completely in all three locales. Convert module metadata and reusable content entries touched by Home to stable translation keys.

- [ ] **Step 5: Remove migrated files from the temporary legacy baseline**

Remove `app/index.tsx`, `src/ui.tsx`, and `src/screens/HomeScreen.tsx` from `LEGACY_I18N_FILES`.

- [ ] **Step 6: Verify GREEN for these files**

Run:
- `npm test`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

Expected: no i18n audit findings for `app/index.tsx`, `src/ui.tsx`, or `HomeScreen.tsx`.

- [ ] **Step 7: Commit**

`git commit -m "feat: localize landing navigation and home"`

---

### Task 5: Localize Session Without Translating State

**Files:**
- Modify: `src/screens/SessionScreen.tsx`
- Modify: `src/content.ts`
- Modify: all three translation catalogs
- Modify: `src/i18n/__tests__/catalogs.test.ts`

**Interfaces:**
- Process goals use stable IDs such as `process`, `patience`, `tempo`, `ranges`, `breaks`, `discipline`.
- War Room triggers use stable IDs; display text is translated.
- `GameState` remains `A | B | C`.

- [ ] **Step 1: Add failing tests for Session keys and stable IDs**

Assert:
- all Session phases have PT/EN/ES keys;
- process goals and triggers keep the same selected ID across locale changes;
- decision cues resolve by key/index, not stored translated string.

- [ ] **Step 2: Verify RED**

Run the Session-focused test set and i18n audit.

- [ ] **Step 3: Migrate Ready, Active, and Debrief**

Replace every functional string with `t()`, including header subtitles, buttons, helper copy, labels, process goals, trigger labels, and Decision Cue instruction text.

- [ ] **Step 4: Remove Session from the temporary legacy baseline**

Remove `src/screens/SessionScreen.tsx` from `LEGACY_I18N_FILES`.

- [ ] **Step 5: Remove Coach and Profile from the temporary legacy baseline**

Remove `src/screens/CoachScreen.tsx` and `src/screens/ProfileScreen.tsx` from `LEGACY_I18N_FILES`. Assert the baseline is now empty.

- [ ] **Step 6: Verify GREEN**

Run:
- `npm test`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

Smoke-check changing language while Session is active does not reset phase, A/B/C state, selected goal, cue index, or trigger IDs.

- [ ] **Step 6: Commit**

`git commit -m "feat: localize Endurance session flow"`

---

### Task 6: Localize Train, Content Libraries, and All Overlays

**Files:**
- Modify: `src/screens/TrainScreen.tsx`
- Modify: `src/overlays.tsx`
- Modify: `src/content.ts`
- Modify: `src/types.ts`
- Modify: all three translation catalogs
- Modify: `src/i18n/__tests__/catalogs.test.ts`

**Interfaces:**
- `mentalPlaylists` keeps invariant IDs/durations and exposes translation keys for mode/description/cue.
- `lifestyleSections`, `tellLessons`, `stoicPrinciples`, `diaryQuestions`, and `warRoomTriggers` expose stable IDs/translation keys.
- Overlay local state stores IDs/indexes only.

- [ ] **Step 1: Add failing content-library tests**

Assert each content item:
- has a stable ID;
- uses translation keys for localizable fields;
- resolves non-empty PT/EN/ES copy;
- preserves playlist selection and trigger selection across locale changes.

- [ ] **Step 2: Verify RED**

Run tests and i18n audit.

- [ ] **Step 3: Migrate Train and all overlay modules**

Cover:
- Sala de Guerra;
- Behavior Lab;
- Mental Gym;
- Performance;
- Mental Audio;
- Battle Diary;
- Vacinas Psicológicas;
- Mindset;
- Break 4;
- Micro Check-in;
- SOS.

- [ ] **Step 4: Remove Train and overlays from the temporary legacy baseline**

Remove `src/screens/TrainScreen.tsx` and `src/overlays.tsx` from `LEGACY_I18N_FILES`.

- [ ] **Step 5: Verify GREEN**

Run:
- `npm test`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

Smoke-check module, playlist, trigger, diary question index, reaction state, Break step, and SOS step survive locale changes.

- [ ] **Step 6: Commit**

`git commit -m "feat: localize training content and overlays"`

---

### Task 7: Localize Coach and Profile, Preserve User Text

**Files:**
- Modify: `src/screens/CoachScreen.tsx`
- Modify: `src/screens/ProfileScreen.tsx`
- Modify: all three translation catalogs
- Modify: `src/i18n/__tests__/catalogs.test.ts`

**Interfaces:**
- Coach system copy and canned assistant replies use translation keys.
- User-entered `input`, diary text, and existing user-authored messages remain raw user text.
- Future AI integration consumes `locale` as context; this task exposes the locale in the Coach component but does not add a network AI dependency.

- [ ] **Step 1: Add failing tests for Coach/Profile translation coverage**

Assert:
- quick prompts, placeholders, system messages, Profile stats labels, plan copy, privacy copy, and language-section copy exist in all three catalogs;
- user-authored sample strings are not passed through `t()`;
- switching locale does not mutate stored user message text.

- [ ] **Step 2: Verify RED**

Run tests and i18n audit.

- [ ] **Step 3: Migrate Coach functional/system copy**

Use active locale for canned assistant/system copy and expose `locale` for future real AI context. Do not translate existing user-authored messages.

- [ ] **Step 4: Migrate Profile and finalize its language section**

Localize Profile fully while keeping the shared `LanguageSelector variant="profile"`.

- [ ] **Step 5: Verify GREEN**

Run:
- `npm test`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`

Expected: no remaining functional hard-coded copy outside the explicit invariant allowlist.

- [ ] **Step 7: Commit**

`git commit -m "feat: localize coach and profile"`

---

### Task 8: Full Regression, Web Export, and Production Release

**Files:**
- Modify only if verification finds defects in the scoped i18n implementation.
- Verify: `.github/workflows/ci.yml`, all i18n files, all migrated UI files.

**Interfaces:**
- Final contract: first-run PT, switchable PT/EN/ES, persisted last selection, complete catalog parity, no functional hard-coded UI strings.

- [ ] **Step 1: Run the complete automated suite**

Run:
- `npm test`
- `node scripts/check-typography.mjs`
- `node scripts/check-i18n.mjs`
- `npx tsc --noEmit`
- `npx expo export --platform web`

Expected: all commands PASS and `dist` is exported.

- [ ] **Step 2: Perform language smoke matrix**

Verify on Web and at least one native Expo/Android run:
- clean first launch => Portuguese;
- landing PT/EN/ES selector updates immediately;
- enter app and Profile shows same locale;
- Profile change updates all current screens immediately;
- reload/reopen retains last choice;
- PT, EN, and ES each cover landing, Home, Session, Train, Coach, Profile, SOS, Break, and overlays;
- changing locale mid-flow preserves stable state;
- diary/chat user text remains unchanged.

- [ ] **Step 3: Confirm GitHub Actions is green**

The production commit must have:
- test success;
- typography audit success;
- i18n audit success;
- TypeScript success;
- Expo Web export success.

- [ ] **Step 4: Deploy the exact green commit to Railway**

Deploy only `endurance-web`. Preserve:
- build command: `npx expo export --platform web`;
- start command: `npx --yes serve@14.2.5 dist -s -l $PORT`;
- healthcheck: `/`;
- domain: `endurance-web-production.up.railway.app`.

- [ ] **Step 5: Verify production**

Require:
- Railway deployment status `SUCCESS`;
- production logs show the server accepting connections;
- GET `/` returns HTTP 200;
- public URL loads the Portuguese first-run UI after clearing stored locale.

- [ ] **Step 6: Commit any verification-only corrections, rerun all gates, and redeploy if needed**

No completion claim is allowed until the final deployed commit is green and HTTP 200.

