const fs = require('fs');

const app = JSON.parse(fs.readFileSync('app.json', 'utf8')).expo;
const eas = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const expoMajor = Number(String(pkg.dependencies?.expo ?? '').match(/(\d+)/)?.[1] ?? 0);

const failures = [];
if (!app.name) failures.push('expo.name');
if (!app.version) failures.push('expo.version');
if (!app.android?.package) failures.push('expo.android.package');
if (expoMajor < 57) failures.push('Expo SDK 57+ required for Android target API 36');
if (!Number.isInteger(app.android?.versionCode) || app.android.versionCode < 1) failures.push('expo.android.versionCode');
if (eas.build?.production?.android?.buildType !== 'app-bundle') failures.push('production android buildType=app-bundle');
if (!Array.isArray(app.android?.permissions)) failures.push('expo.android.permissions');
if (!app.icon || !fs.existsSync(app.icon.replace('./',''))) failures.push('expo.icon');
if (!app.android?.adaptiveIcon?.foregroundImage || !fs.existsSync(app.android.adaptiveIcon.foregroundImage.replace('./',''))) failures.push('expo.android.adaptiveIcon.foregroundImage');
if (!app.android?.adaptiveIcon?.backgroundColor) failures.push('expo.android.adaptiveIcon.backgroundColor');

if (failures.length) {
  console.error('Android release config invalid:', failures.join(', '));
  process.exit(1);
}
console.log(`Android release config OK: ${app.android.package} v${app.version} (${app.android.versionCode})`);
