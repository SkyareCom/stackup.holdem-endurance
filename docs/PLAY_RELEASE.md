# Android / Google Play release gate

## Automated — must be green
- [x] Expo Doctor dependency/config diagnostics
- [x] Unit/test suite
- [x] Typography validation
- [x] i18n validation
- [x] TypeScript validation
- [x] Android release configuration
- [x] Android Expo export
- [x] Expo SDK 57 release baseline (Android API 36 target)
- [x] Web Expo export
- [x] Android package: com.stackupholdem.endurance
- [x] Production build type: app-bundle
- [x] App icon and adaptive icon configured

## Release execution — requires Expo/Google credentials
- [ ] Authenticate EAS CLI with the STACKUP Expo account
- [ ] Run: npm run build:android:production
- [ ] Confirm EAS build status is finished
- [ ] Download and archive the generated .aab
- [ ] Upload the .aab to the intended Google Play track
- [ ] Complete Play Console declarations, store listing and Data safety for the actual production behavior
- [ ] Install the Play-delivered build on a physical Android device and complete smoke testing

Do not mark the app as published or Play-ready until the generated AAB and Play Console requirements are verified.

## Last verified automated gate
- Commit: `a90bdfb9bcb91bc73077fb67c2d628abab8a8e8c`
- GitHub Actions run: `37281251080`
- Result: success; every validation/export step passed.
