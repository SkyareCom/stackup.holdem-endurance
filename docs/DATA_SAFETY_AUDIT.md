# Data Safety audit — current production code

Audit basis: repository main branch, before the first Google Play production AAB.

## Observed persistence
- The selected interface language is stored locally on the device with AsyncStorage.
- Key: `@stackup/endurance/locale`.
- No account identifier is required by the current application flow.

## Observed user inputs
The application accepts session state, energy/focus/stress ratings, process goals, triggers, diary text and cognitive-training answers.

In the current code these values are React component state and are not sent to an application backend. Diary/session inputs are not persisted after their component lifecycle unless future code explicitly adds persistence.

## Observed network behavior
- No application API client, Supabase client, Axios client or direct `fetch` call was found in the current source audit.
- Background photography is loaded from remote Pexels image URLs. Loading remote media necessarily creates network requests to that third-party host.

## Current Data Safety implementation notes
Do not declare cloud collection of diary/session/profile information based on the current code, because no such transmission was found.

The Play Console Data safety form must still be completed against the final compiled AAB and the behavior of included SDKs/libraries. Re-audit this document whenever analytics, authentication, crash reporting, cloud sync, subscriptions, advertising, messaging, AI/coach APIs or another backend is introduced.

## Privacy-policy facts supported by current code
- No login is required.
- No advertising SDK is present in the audited application source.
- No analytics SDK is present in the audited application source.
- Language preference is stored locally.
- Remote images are requested from Pexels.
- Session and diary UI currently operate locally/in memory.

This is an engineering audit, not a claim that the Google Play Data safety questionnaire has been submitted or approved.
