import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = (message) => {
  console.error(`TYPOGRAPHY CHECK FAILED: ${message}`);
  process.exit(1);
};

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!pkg.dependencies?.['@expo-google-fonts/titillium-web']) {
  fail('Titillium Web package is not installed.');
}
if (pkg.dependencies?.['@expo-google-fonts/kulim-park']) {
  fail('Legacy Kulim Park package must be removed.');
}
if (!pkg.dependencies?.['expo-font']) {
  fail('expo-font is not installed.');
}

const layout = fs.readFileSync(path.join(root, 'app/_layout.tsx'), 'utf8');
for (const token of [
  'useFonts',
  'TitilliumWeb_400Regular_Italic',
  'TitilliumWeb_600SemiBold_Italic',
  'TitilliumWeb_700Bold_Italic',
]) {
  if (!layout.includes(token)) fail(`app/_layout.tsx is missing ${token}.`);
}

const ui = fs.readFileSync(path.join(root, 'src/ui.tsx'), 'utf8');
for (const token of [
  'export function AppText',
  'export function AppTextInput',
  'TitilliumWeb_400Regular_Italic',
  'TitilliumWeb_600SemiBold_Italic',
  'TitilliumWeb_700Bold_Italic',
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
  if (/<AppText\b/.test(source) && !/import\s*\{[^}]*\bAppText\b[^}]*\}\s*from\s*['"][^'"]*ui['"]/.test(source)) {
    fail(`${file} renders AppText without importing it from the shared UI layer.`);
  }
  if (/<AppTextInput\b/.test(source) && !/import\s*\{[^}]*\bAppTextInput\b[^}]*\}\s*from\s*['"][^'"]*ui['"]/.test(source)) {
    fail(`${file} renders AppTextInput without importing it from the shared UI layer.`);
  }
}

const allowedFontSizes = new Set([48, 26, 22, 12, 10]);
const typographySourceFiles = [];
for (const start of ['app', 'src']) {
  const walkTypography = (dir) => {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) walkTypography(rel);
      else if (entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name)) typographySourceFiles.push(rel);
    }
  };
  walkTypography(start);
}

for (const file of typographySourceFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of source.matchAll(/fontSize\s*:\s*(\d+(?:\.\d+)?)/g)) {
    const size = Number(match[1]);
    if (!allowedFontSizes.has(size)) {
      fail(`${file} uses fontSize ${size}px. Allowed sizes: 48, 26, 22, 12, 10.`);
    }
  }
}

console.log('Typography check passed: Titillium Web italic is global and font sizes are restricted to 48/26/22/12/10px.');
