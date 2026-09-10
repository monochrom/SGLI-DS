// SGLI Design System – Token Lint
// Prüft tokens/**/*.json ohne Build:
//   1. Aliase lösen sich auf (keine toten Referenzen, keine Zyklen)
//   2. Namen sind normalisiert (a-z, 0-9, Punkt, Bindestrich)
//   3. WCAG-2.2-Kontrast je Semantic-Kontext (AA: 4.5 Text, 3.0 UI/Icons/Rahmen)
//
// Figma ist Master. Verstöße werden gemeldet, nicht automatisch korrigiert.
// `node scripts/lint-tokens.mjs --strict` beendet mit Exit-Code 1 bei Verstößen.

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const CONTEXTS = ['surface-50', 'surface-100', 'surface-200', 'surface-300', 'surface-400', 'primary-900', 'secondary-400'];

// ---------- Laden ----------
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const flatten = (obj, path = [], out = {}) => {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out[[...path, k].join('.')] = v;
    else if (v && typeof v === 'object') flatten(v, [...path, k], out);
  }
  return out;
};
const loadDir = (dir) => readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.json')).reduce((acc, f) => Object.assign(acc, flatten(readJson(join(ROOT, dir, f)))), {});

const primitives = loadDir('tokens/primitives');
const semanticDefault = flatten(readJson(join(ROOT, 'tokens/semantic/color.json')));
const typography = loadDir('tokens/typography');
const layout = loadDir('tokens/layout');
const contexts = Object.fromEntries(CONTEXTS.filter((c) => c !== 'surface-50').map((c) => [c, flatten(readJson(join(ROOT, `tokens/semantic/context/${c}.json`)))]));

const problems = [];
const warn = (kind, msg) => problems.push({ kind, msg });

// ---------- 1. Aliase ----------
function resolve(name, table, seen = new Set()) {
  const t = table[name];
  if (!t) { warn('alias', `Referenz auf unbekanntes Token: ${name}`); return undefined; }
  const v = t.$value;
  if (typeof v === 'string' && /^\{[^}]+\}$/.test(v)) {
    const ref = v.slice(1, -1);
    if (seen.has(ref)) { warn('alias', `Zyklus: ${[...seen, ref].join(' → ')}`); return undefined; }
    return resolve(ref, table, new Set([...seen, name]));
  }
  return v;
}
const all = { ...primitives, ...semanticDefault, ...typography, ...layout };
for (const name of Object.keys(all)) resolve(name, all);

// ---------- 2. Namen ----------
for (const name of Object.keys(all)) if (!/^[a-z0-9.-]+$/.test(name)) warn('naming', `Nicht normalisiert: ${name}`);

// ---------- 3. Kontrast ----------
const hexToRgba = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a };
};
const composite = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
const lum = ({ r, g, b }) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrast = (fgHex, bgHex) => { const bg = hexToRgba(bgHex); const fg = composite(hexToRgba(fgHex), bg); const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a); return (l1 + 0.05) / (l2 + 0.05); };

// Prüfpaare: [Vordergrund, Hintergrund, Mindestkontrast, Beschreibung, nur in Kontexten]
// Mindestkontrast 0 = nur informativ (z. B. dekorative Divider, WCAG 1.4.11 greift nicht).
const PAIRS = [
  ['color.text.primary', 'color.bg.module', 4.5, 'Fließtext auf Modul'],
  ['color.text.primary', 'color.bg.card', 4.5, 'Fließtext auf Card'],
  ['color.text.primary', 'color.bg.inset', 4.5, 'Fließtext auf Inset'],
  ['color.text.primary', 'color.bg.page', 4.5, 'Fließtext auf Page', ['surface-50']],
  ['color.text.secondary', 'color.bg.module', 4.5, 'Sekundärtext auf Modul'],
  ['color.text.secondary', 'color.bg.card', 4.5, 'Sekundärtext auf Card'],
  ['color.text.secondary', 'color.bg.inset', 4.5, 'Sekundärtext auf Inset'],
  ['color.interactive', 'color.bg.module', 4.5, 'Link auf Modul'],
  ['color.interactive-hover', 'color.bg.module', 4.5, 'Link Hover auf Modul'],
  ['color.interactive-secondary', 'color.bg.module', 4.5, 'Link sekundär auf Modul'],
  ['color.button.primary.fg', 'color.button.primary.bg', 4.5, 'Button Primary'],
  ['color.button.primary.fg', 'color.button.primary.bg-hover', 4.5, 'Button Primary Hover'],
  ['color.button.primary.fg', 'color.button.primary.bg-pressed', 4.5, 'Button Primary Pressed'],
  ['color.button.secondary.fg', 'color.bg.module', 4.5, 'Button Secondary'],
  ['color.button.secondary.fg-hover', 'color.bg.module', 4.5, 'Button Secondary Hover'],
  ['color.button.icon.fg', 'color.bg.module', 3, 'Icon-Button Icon'],
  ['color.button.icon.border', 'color.bg.module', 3, 'Icon-Button Rahmen'],
  ['color.chip.fg', 'color.bg.module', 4.5, 'Chip Text'],
  ['color.chip.fg-active', 'color.chip.bg-active', 4.5, 'Chip aktiv'],
  ['color.chip.badge-fg', 'color.chip.badge-bg', 4.5, 'Chip Badge (auf Modul komponiert)'],
  ['color.chip.badge-fg-active', 'color.chip.badge-bg-active', 4.5, 'Chip Badge aktiv (auf bg-active komponiert)'],
  ['color.icon.primary', 'color.bg.module', 3, 'Icon auf Modul'],
  ['color.border.default', 'color.bg.module', 3, 'Rahmen auf Modul'],
  ['color.border.focus-outer', 'color.bg.module', 3, 'Fokusring außen auf Modul'],
  ['color.divider.default', 'color.bg.module', 0, 'Divider auf Modul (dekorativ, nur Info)'],
  ['color.toggle.track-off', 'color.bg.module', 3, 'Toggle aus'],
  ['color.toggle.track-on', 'color.bg.module', 3, 'Toggle an'],
  ['color.feedback.error', 'color.bg.module', 4.5, 'Fehlertext auf Modul'],
  ['color.feedback.error', 'color.feedback.error-bg', 4.5, 'Fehlertext auf Fehler-Hintergrund'],
  ['color.feedback.success', 'color.feedback.success-bg', 4.5, 'Erfolgstext auf Erfolg-Hintergrund'],
  ['color.feedback.warning', 'color.feedback.warning-bg', 4.5, 'Warntext auf Warn-Hintergrund'],
  ['color.feedback.info', 'color.feedback.info-bg', 4.5, 'Infotext auf Info-Hintergrund'],
];
// Badge-Hintergründe sind halbtransparent: erst auf die jeweilige Fläche komponieren.
const BADGE_BASE = { 'color.chip.badge-bg': 'color.bg.module', 'color.chip.badge-bg-active': 'color.chip.bg-active' };

const rows = [];
for (const ctx of CONTEXTS) {
  const table = { ...primitives, ...semanticDefault, ...(contexts[ctx] || {}) };
  const val = (n) => resolve(n, table);
  const hexOf = (n) => { let h = val(n); if (BADGE_BASE[n]) { const b = hexToRgba(val(BADGE_BASE[n])); const c = composite(hexToRgba(h), b); h = '#' + [c.r, c.g, c.b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join(''); } return h; };
  for (const [fg, bg, min, label, only] of PAIRS) {
    if (only && !only.includes(ctx)) continue;
    const f = hexOf(fg), b = hexOf(bg);
    if (!f || !b) continue;
    const ratio = contrast(f, b);
    const ok = min === 0 || ratio >= min;
    rows.push({ ctx, label, fg, bg, ratio: ratio.toFixed(2), min, ok, info: min === 0 });
    if (!ok) warn('contrast', `[${ctx}] ${label}: ${fg} auf ${bg} = ${ratio.toFixed(2)}:1 (min ${min}:1)`);
  }
}

// ---------- Report ----------
const pad = (s, n) => String(s).padEnd(n);
console.log('\nKontrast-Matrix (WCAG 2.2 AA)\n');
for (const ctx of CONTEXTS) {
  const r = rows.filter((x) => x.ctx === ctx);
  const fails = r.filter((x) => !x.ok).length;
  console.log(`${pad(ctx, 14)} ${r.length - fails}/${r.length} ok${fails ? `  ✖ ${fails} Verstoß/Verstöße` : ''}`);
  for (const x of r.filter((x) => !x.ok)) console.log(`   ✖ ${pad(x.label, 44)} ${x.ratio}:1  (min ${x.min})  ${x.fg} auf ${x.bg}`);
  for (const x of r.filter((x) => x.info)) console.log(`   ℹ ${pad(x.label, 44)} ${x.ratio}:1`);
}
const byKind = problems.reduce((a, p) => ((a[p.kind] = (a[p.kind] || 0) + 1), a), {});
console.log(`\nTokens: ${Object.keys(all).length}  ·  Probleme: ${problems.length}${problems.length ? ` (${Object.entries(byKind).map(([k, v]) => `${k}: ${v}`).join(', ')})` : ''}`);
for (const p of problems.filter((p) => p.kind !== 'contrast')) console.log(`   ✖ [${p.kind}] ${p.msg}`);
if (STRICT && problems.length) process.exit(1);
