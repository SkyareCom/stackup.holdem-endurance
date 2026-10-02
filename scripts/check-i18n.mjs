import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const fail = (message) => {
  console.error(`I18N CHECK FAILED: ${message}`);
  process.exitCode = 1;
};

const catalogPaths = {
  pt: path.join(root, 'src/i18n/translations/pt.ts'),
  en: path.join(root, 'src/i18n/translations/en.ts'),
  es: path.join(root, 'src/i18n/translations/es.ts'),
};

function readCatalog(locale, filePath) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const source = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let result = null;

  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== locale || !declaration.initializer) continue;
      let init = declaration.initializer;
      if (ts.isAsExpression(init) || ts.isSatisfiesExpression(init)) init = init.expression;
      if (!ts.isObjectLiteralExpression(init)) continue;

      const entries = new Map();
      for (const prop of init.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const key = ts.isStringLiteral(prop.name) || ts.isNoSubstitutionTemplateLiteral(prop.name)
          ? prop.name.text
          : ts.isIdentifier(prop.name)
            ? prop.name.text
            : null;
        const value = ts.isStringLiteral(prop.initializer) || ts.isNoSubstitutionTemplateLiteral(prop.initializer)
          ? prop.initializer.text
          : null;
        if (key !== null && value !== null) entries.set(key, value);
      }
      result = entries;
    }
  });

  if (!result) throw new Error(`Could not parse catalog ${locale} at ${filePath}`);
  return result;
}

const catalogs = Object.fromEntries(
  Object.entries(catalogPaths).map(([locale, file]) => [locale, readCatalog(locale, file)])
);
const canonicalKeys = [...catalogs.pt.keys()].sort();

for (const locale of ['en', 'es']) {
  const keys = [...catalogs[locale].keys()].sort();
  const missing = canonicalKeys.filter((key) => !catalogs[locale].has(key));
  const extra = keys.filter((key) => !catalogs.pt.has(key));
  if (missing.length) fail(`${locale.toUpperCase()} is missing keys: ${missing.join(', ')}`);
  if (extra.length) fail(`${locale.toUpperCase()} has extra keys: ${extra.join(', ')}`);
}

for (const [locale, catalog] of Object.entries(catalogs)) {
  for (const [key, value] of catalog.entries()) {
    if (!value.trim()) fail(`${locale.toUpperCase()} has an empty value for ${key}`);
  }
}

const LEGACY_I18N_FILES = new Set([]);

const invariantStrings = new Set([
  'ENDURANCE',
  "STACKUP HOLD'EM",
  'SOS',
  'A',
  'B',
  'C',
  'A-',
  '-GAME',
]);

const userFacingAttributes = new Set([
  'label',
  'title',
  'subtitle',
  'placeholder',
  'accessibilityLabel',
  'accessibilityHint',
]);

function hasHumanLetters(text) {
  return /[A-Za-zÀ-ÿ]/.test(text);
}

function isAllowedLiteral(text) {
  const normalized = text.trim();
  if (!normalized || invariantStrings.has(normalized)) return true;
  if (/^[\d\s:./%+→←·'’-]+$/.test(normalized)) return true;
  return false;
}

function scanTsx(filePath, relative) {
  if (LEGACY_I18N_FILES.has(relative)) return;
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const source = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  function visit(node) {
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, ' ').trim();
      if (hasHumanLetters(text) && !isAllowedLiteral(text)) {
        fail(`${relative} contains hard-coded JSX text: "${text}"`);
      }
    }

    if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && userFacingAttributes.has(node.name.text)) {
      if (node.initializer && ts.isStringLiteral(node.initializer)) {
        const text = node.initializer.text.trim();
        if (hasHumanLetters(text) && !isAllowedLiteral(text)) {
          fail(`${relative} contains hard-coded ${node.name.text}: "${text}"`);
        }
      }
    }

    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      (ts.isStringLiteral(node.expression) || ts.isNoSubstitutionTemplateLiteral(node.expression))
    ) {
      const text = node.expression.text.trim();
      if (hasHumanLetters(text) && !isAllowedLiteral(text)) {
        fail(`${relative} contains hard-coded JSX expression text: "${text}"`);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
}

function walk(dir, found = []) {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, found);
    else if (entry.isFile() && entry.name.endsWith('.tsx')) found.push(full);
  }
  return found;
}

const candidates = [
  path.join(root, 'app/index.tsx'),
  path.join(root, 'src/ui.tsx'),
  path.join(root, 'src/overlays.tsx'),
  ...walk(path.join(root, 'src/components')),
  ...walk(path.join(root, 'src/screens')),
];

for (const file of [...new Set(candidates)]) {
  if (!fs.existsSync(file)) continue;
  scanTsx(file, path.relative(root, file).split(path.sep).join('/'));
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`i18n check passed: ${canonicalKeys.length} keys in PT/EN/ES; no new hard-coded functional copy outside the migration baseline.`);
