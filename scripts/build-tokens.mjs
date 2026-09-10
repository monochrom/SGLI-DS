// SGLI Design System – Token Build
// tokens/**/*.json (DTCG) → dist/css/*.css + dist/json/tokens.flat.json
//
// Style Dictionary v4. Vier Bausteine:
//   1. Basis       → tokens.css (Primitives + Semantic Default), typography.css, layout.css, text-styles.css
//   2. Breakpoints → tablet/desktop-Overrides als @media (min-width) an typography.css / layout.css angehängt
//   3. Kontexte    → contexts.css, ein [data-context="…"]-Block je Semantic-Mode (nur Abweichungen)
//   4. JSON        → tokens.flat.json (aufgelöste Werte für Doku und Tooling)
//
// Regeln: Figma-Name → CSS-Name nur normalisiert (color/neutral/900 → --color-neutral-900).
// font-size in rem (Basis 16), Spacing/Radius/Border/Size in px (1:1 Figma),
// line-height unitless, letter-spacing in em, Aliase bleiben als var(--…) erhalten.

import StyleDictionary from 'style-dictionary';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PARTS = join(DIST, '.parts');
const rel = (p) => join(ROOT, p);

const breakpoints = JSON.parse(readFileSync(rel('tokens/layout/breakpoints.json'), 'utf8')).breakpoint;
const MQ = { tablet: breakpoints.md.$value, desktop: breakpoints.lg.$value };
const CONTEXTS = ['surface-100', 'surface-200', 'surface-300', 'surface-400', 'primary-900', 'secondary-400'];

const BASE = [
  'tokens/primitives/*.json',
  'tokens/semantic/color.json',
  'tokens/typography/font.json',
  'tokens/typography/phone.json',
  'tokens/typography/line-height.json',
  'tokens/typography/letter-spacing.json',
  'tokens/layout/phone.json',
  'tokens/layout/breakpoints.json',
  'tokens/layout/grid.json',
].map(rel);

const HEADER = `/* SGLI Design System – generiert aus tokens/ (Quelle: Figma „SGLI – Design“). Nicht von Hand ändern. */\n`;

// ---------- Transforms ----------
const isFontSize = (t) => t.path[0] === 'font-size';
const isLineHeight = (t) => t.path[0] === 'line-height';
const isLetterSpacing = (t) => t.path[0] === 'letter-spacing';
const isFontFamily = (t) => t.$type === 'fontFamily';

StyleDictionary.registerTransform({
  name: 'sgli/name', type: 'name',
  transform: (t) => t.path.join('-'),
});
StyleDictionary.registerTransform({
  name: 'sgli/font-size/rem', type: 'value', transitive: true,
  filter: isFontSize,
  transform: (t) => { const px = parseFloat(t.$value); return `${+(px / 16).toFixed(4)}rem`; },
});
StyleDictionary.registerTransform({
  name: 'sgli/line-height/unitless', type: 'value',
  filter: isLineHeight,
  transform: (t) => `${+(t.$value / 100).toFixed(4)}`,
});
StyleDictionary.registerTransform({
  name: 'sgli/letter-spacing/em', type: 'value',
  filter: isLetterSpacing,
  transform: (t) => (t.$value === 0 ? '0' : `${+(t.$value / 100).toFixed(4)}em`),
});
StyleDictionary.registerTransform({
  name: 'sgli/font-family/css', type: 'value',
  filter: isFontFamily,
  transform: (t) => (Array.isArray(t.$value) ? t.$value : [t.$value]).map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', '),
});
StyleDictionary.registerTransformGroup({
  name: 'sgli/css',
  transforms: ['sgli/name', 'sgli/font-size/rem', 'sgli/line-height/unitless', 'sgli/letter-spacing/em', 'sgli/font-family/css'],
});

// ---------- Helpers ----------
const refToVar = (v) => (typeof v === 'string' ? v.replace(/\{([^}]+)\}/g, (_, p) => `var(--${p.replace(/\./g, '-')})`) : v);
const isRef = (v) => typeof v === 'string' && /^\{[^}]+\}$/.test(v);
const cssValue = (t) => (isRef(t.original.$value) ? refToVar(t.original.$value) : t.$value);
const indent = (s) => s.split('\n').map((l) => (l ? '  ' + l : l)).join('\n');
const block = (selector, tokens) => `${selector} {\n${tokens.map((t) => `  --${t.name}: ${cssValue(t)};`).join('\n')}\n}\n`;

// ---------- Formats ----------
StyleDictionary.registerFormat({
  name: 'sgli/css-vars',
  format: ({ dictionary, options }) => {
    const { selector = ':root', mediaQuery, comment } = options;
    let out = block(selector, dictionary.allTokens);
    if (mediaQuery) out = `@media (min-width: ${mediaQuery}) {\n${indent(out).trimEnd()}\n}\n`;
    return (comment ? `/* ${comment} */\n` : '') + out;
  },
});
StyleDictionary.registerFormat({
  name: 'sgli/text-styles',
  format: ({ dictionary }) =>
    dictionary.allTokens
      .filter((t) => t.$type === 'typography')
      .map((t) => {
        const v = t.original.$value;
        const tt = t.$extensions?.textTransform;
        const lines = [
          `font-family: ${refToVar(v.fontFamily)};`,
          `font-weight: ${refToVar(v.fontWeight)};`,
          `font-size: ${refToVar(v.fontSize)};`,
          `line-height: ${refToVar(v.lineHeight)};`,
          `letter-spacing: ${refToVar(v.letterSpacing)};`,
          ...(tt && tt !== 'none' ? [`text-transform: ${tt};`] : []),
        ];
        return `/* Figma: ${t.$extensions?.['com.figma.textStyle'] ?? t.name} */\n.text-${t.path.at(-1)} {\n${lines.map((l) => '  ' + l).join('\n')}\n}\n`;
      })
      .join('\n'),
});
StyleDictionary.registerFormat({
  name: 'sgli/json-flat',
  format: ({ dictionary }) => {
    const out = {};
    for (const t of dictionary.allTokens) {
      out[t.name] = { value: t.$value, type: t.$type, path: t.path, original: t.original.$value, file: t.filePath.replace(ROOT + '/', '') };
      if (t.$extensions) out[t.name].extensions = t.$extensions;
    }
    return JSON.stringify(out, null, 2) + '\n';
  },
});

// ---------- Builds ----------
const inFile = (...names) => (t) => names.some((n) => t.filePath.endsWith(n));
const inDir = (dir) => (t) => t.filePath.includes(`/tokens/${dir}/`);

async function build(config) {
  const sd = new StyleDictionary({ log: { verbosity: 'silent', warnings: 'disabled' }, ...config });
  await sd.buildAllPlatforms();
}

rmSync(PARTS, { recursive: true, force: true });
mkdirSync(PARTS, { recursive: true });
mkdirSync(join(DIST, 'css'), { recursive: true });
mkdirSync(join(DIST, 'json'), { recursive: true });

// 1. Basis
await build({
  source: [...BASE, rel('tokens/typography/text-styles.json')],
  platforms: {
    css: {
      transformGroup: 'sgli/css', buildPath: PARTS + '/',
      files: [
        { destination: 'tokens.css', format: 'sgli/css-vars', filter: (t) => inDir('primitives')(t) || inFile('semantic/color.json')(t), options: { comment: 'Primitives + Semantic (Default-Kontext = Figma-Mode surface-50)' } },
        { destination: 'typography.base.css', format: 'sgli/css-vars', filter: (t) => inDir('typography')(t) && t.$type !== 'typography', options: { comment: 'Typography, mobile first (Figma-Mode Phone)' } },
        { destination: 'layout.base.css', format: 'sgli/css-vars', filter: inDir('layout'), options: { comment: 'Layout, mobile first (Figma-Mode Phone) + Breakpoints + Grid' } },
        { destination: 'text-styles.css', format: 'sgli/text-styles', filter: (t) => t.$type === 'typography' },
      ],
    },
    json: {
      transformGroup: 'sgli/css', buildPath: DIST + '/json/',
      files: [{ destination: 'tokens.flat.json', format: 'sgli/json-flat', filter: (t) => t.$type !== 'typography' }],
    },
  },
});

// 2. Breakpoints
for (const bp of ['tablet', 'desktop']) {
  await build({
    include: BASE,
    source: [rel(`tokens/typography/${bp}.json`), rel(`tokens/layout/${bp}.json`)],
    platforms: {
      css: {
        transformGroup: 'sgli/css', buildPath: PARTS + '/',
        files: [
          { destination: `typography.${bp}.css`, format: 'sgli/css-vars', filter: inFile(`typography/${bp}.json`), options: { mediaQuery: MQ[bp], comment: `Figma-Mode ${bp[0].toUpperCase() + bp.slice(1)}` } },
          { destination: `layout.${bp}.css`, format: 'sgli/css-vars', filter: inFile(`layout/${bp}.json`), options: { mediaQuery: MQ[bp], comment: `Figma-Mode ${bp[0].toUpperCase() + bp.slice(1)}` } },
        ],
      },
    },
  });
}

// 3. Kontexte
for (const ctx of CONTEXTS) {
  await build({
    include: BASE,
    source: [rel(`tokens/semantic/context/${ctx}.json`)],
    platforms: {
      css: {
        transformGroup: 'sgli/css', buildPath: PARTS + '/',
        files: [{ destination: `context.${ctx}.css`, format: 'sgli/css-vars', filter: inFile(`context/${ctx}.json`), options: { selector: `[data-context="${ctx}"]`, comment: `Figma Semantic-Mode ${ctx}` } }],
      },
    },
  });
}

// ---------- Assemble ----------
const part = (n) => readFileSync(join(PARTS, n), 'utf8');
const out = (n, s) => writeFileSync(join(DIST, 'css', n), HEADER + s);

out('tokens.css', part('tokens.css'));
out('typography.css', [part('typography.base.css'), part('typography.tablet.css'), part('typography.desktop.css')].join('\n'));
out('layout.css', [part('layout.base.css'), part('layout.tablet.css'), part('layout.desktop.css')].join('\n'));
out('contexts.css', `/* Semantic-Modes als Modul-Kontexte. Default (surface-50) steht in tokens.css. */\n\n` + CONTEXTS.map((c) => part(`context.${c}.css`)).join('\n'));
out('text-styles.css', `/* Die 13 Figma Text Styles als Utility-Klassen. */\n\n` + part('text-styles.css'));
out('index.css', ['tokens', 'contexts', 'typography', 'layout', 'text-styles'].map((n) => `@import "./${n}.css";`).join('\n') + '\n');
rmSync(PARTS, { recursive: true, force: true });

const flat = JSON.parse(readFileSync(join(DIST, 'json', 'tokens.flat.json'), 'utf8'));
console.log(`✔ dist/css: tokens, contexts, typography, layout, text-styles, index (${Object.keys(flat).length} Tokens)`);
