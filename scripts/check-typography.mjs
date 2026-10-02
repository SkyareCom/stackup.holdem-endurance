import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = (message) => {
  console.error(`TYPOGRAPHY CHECK FAILED: ${message}`);
  process.exit(1);
};

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!pkg.dependencies?.['@expo-google-fonts/kulim-park']) {
  fail('Kulim Park package is not installed.');
}
if (!pkg.dependencies?.['expo-font']) {
  fail('expo-font is not installed.');
}

const layout = fs.readFileSync(path.join(root, 'app/_layout.tsx'), 'utf8');
for (const token of [
  'useFonts',
  'KulimPark_400Regular_Italic',
  'KulimPark_600SemiBold_Italic',
  'KulimPark_700Bold_Italic',
]) {
  if (!layout.includes(token)) fail(`app/_layout.tsx is missing ${token}.`);
}

const ui = fs.readFileSync(path.join(root, 'src/ui.tsx'), 'utf8');
for (const token of [
  'export function AppText',
  'export function AppTextInput',
  'KulimPark_400Regular_Italic',
  'KulimPark_600SemiBold_Italic',
  'KulimPark_700Bold_Italic',
]) {
  if (!ui.includes(token)) fail(`src/ui.tsx is missing ${token}.`);
}

const sourceFiles = [];
for (const start of ['app', 'src']) {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (entry.isFile() && /\.tsx$/.test(entry.name)) sourceFiles.push(rel);
    }
  };
  walk(start);
}

for (const file of sourceFiles) {
  if (file === path.join('src', 'ui.tsx')) continue;
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (/<Text(?:\s|>)/.test(source) || /<\/Text>/.test(source)) {
    fail(`${file} still renders raw React Native Text.`);
  }
  if (/<TextInput(?:\s|>)/.test(source)) {
    fail(`${file} still renders raw React Native TextInput.`);
  }
}

console.log('Typography check passed: all app text is routed through Kulim Park italic components.');
