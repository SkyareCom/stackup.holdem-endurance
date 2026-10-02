# Google Play readiness — ENDURANCE

Date: 2026-10-02  
Branch: `feat/guided-ux-playstore`  
Package: `com.stackupholdem.endurance`

## Current official baseline

- Google Play requires new mobile apps and app updates submitted after 2026-08-31 to target Android 16 / API 36 or higher.
- Expo SDK 57 documents Android `compileSdkVersion 36` and `targetSdkVersion 36`.
- Current branch explicitly pins compile/target 36 with `expo-build-properties`.
- Production EAS profile is configured as Android App Bundle with remote app-version source and auto-increment.

Official references:
- https://support.google.com/googleplay/android-developer/answer/11926878
- https://docs.expo.dev/versions/latest/
- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/18258653
- https://support.google.com/googleplay/android-developer/answer/9859655
- https://support.google.com/googleplay/android-developer/answer/9866151

## Readiness matrix

| Item | State | Evidence / next action |
|---|---|---|
| Target SDK | READY | API 36 in `app.json`. |
| Compile SDK | READY | API 36 in `app.json`; matches Expo SDK 57 docs. |
| Expo / RN baseline | READY | Expo ~57.0.0 / RN 0.86.3. No major upgrade required for current target. |
| Version name | READY FOR TEST | `0.5.0`; freeze final release version before submission. |
| Version code | BUILD-TIME | EAS remote version source + autoIncrement; exact value must be verified on produced AAB. |
| Package ID | READY / FREEZE | `com.stackupholdem.endurance`; do not change after Play publication. |
| Production AAB profile | READY | `buildType: app-bundle`. |
| Signing | NEEDS BUILD CREDENTIALS | Verify EAS/Play App Signing during real Android build. |
| Display name | READY | `STACKUP ENDURANCE`. |
| Orientation | READY | portrait. |
| Dark cold start | READY IN CODE | Native splash held until fonts resolve; background #090806. |
| Android back behavior | READY IN CODE | Back handler is scoped to focused index route and unwinds overlays/tabs. |
| PT / EN / ES persistence | READY | AsyncStorage-backed locale; bundled translations. |
| Offline translations | READY | Translation catalogs ship in bundle. |
| Dangerous permissions | NO CURRENT FEATURE REQUIRES THEM | No camera/location/microphone implementation in current release. Inspect final merged manifest from AAB before submission. |
| Privacy policy in app | READY IN CODE | `/privacy` route and Profile access added. |
| Public privacy-policy URL | AFTER WEB DEPLOY | Expected web route after validated merge/deploy: `/privacy`. Verify public HTTP 200 before entering Play Console URL. |
| Privacy contact | MANUAL | Policy points to official developer contact on Play listing. Ensure the Play developer/support contact is valid and verified. |
| Data Safety | NOT FINAL | Current runtime still loads Pexels background images remotely. Review third-party request data or bundle licensed images locally before final declaration. |
| Coach data | CURRENTLY LOCAL | No external AI integration; typed messages remain in local component state for this release. |
| Microphone / voice | CURRENTLY INACTIVE | Mic control is visual only; no recording/upload and no mic permission requested by product code. |
| Mental Audio | CURRENTLY UI-ONLY | No remote audio service integrated in current release. |
| Content rating | PLAY CONSOLE ACTION | Complete IARC accurately. App is training/performance software and does not provide real-money wagering or gameplay. |
| Target audience | PLAY CONSOLE ACTION | Declare intended age group accurately; do not include children unless Families requirements are intentionally supported. |
| Store listing PT / EN / ES | PREPARED | See `docs/play-store-listing-pt-en-es.md`. |
| Store icon | BLOCKED BY ASSET | Play listing requires 512x512 32-bit PNG, <=1024 KB. Repository currently has no `assets/` directory. |
| Launcher/adaptive icon | BLOCKED BY ASSET | Add final approved local icon assets and wire `icon` / `android.adaptiveIcon` in Expo config. |
| Splash graphic | PARTIAL | Native splash behavior/background is configured; final branded splash image asset is not present. |
| Screenshots | PLAY CONSOLE ASSET | At least two screenshots are required for the store listing; create from validated mobile build. |
| Remote poker photos | PRE-PRODUCTION BLOCKER | `src/theme.ts` hotlinks Pexels photos. Bundle approved/licensed local copies before production if possible. |
| Real Android cold start | NOT YET VERIFIED | CI validates web export only. Verify on installed Android build. |
| Real AAB manifest | NOT YET VERIFIED | After AAB: inspect permissions, target SDK, package, versionCode and signing. |
| AAB produced | NO | Do not claim an AAB exists until EAS Android production build succeeds and artifact is verified. |

## Data Safety draft for the current code

Do not submit this section unchanged while remote Pexels images remain.

Current product behavior:
- locale preference is stored locally with AsyncStorage;
- Coach messages and Battle Diary input are not sent to a backend by current code;
- no account creation is implemented;
- no analytics or ads SDK is installed;
- no payment SDK is installed;
- no external AI is called;
- no microphone recording is implemented;
- background photographs are requested from Pexels over HTTPS.

Before Play submission:
1. bundle approved photography locally or assess Pexels request data accurately;
2. inspect the final AAB/manifest and SDK list;
3. complete Data Safety based on the exact shipped artifact, including third-party SDK behavior;
4. keep the in-app privacy policy consistent with the final declaration.

## Remaining release gate

The branch can proceed to a real Android production build only after final launcher/adaptive/splash assets are available and EAS signing/build credentials are usable. The build must then be verified before any AAB is described as release-ready.
