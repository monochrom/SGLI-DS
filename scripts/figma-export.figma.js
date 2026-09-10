// SGLI Design System – Figma → DTCG Export
//
// READ-ONLY Figma Plugin-API script. Wird über den Figma MCP (use_figma) im File
// Nm1wSBrrniedJI8ojcjZIp ausgeführt. Es verändert nichts in Figma, es liest nur
// Variablen und Text Styles und gibt DTCG-JSON (W3C Design Tokens Format) zurück.
//
// Aufruf: dem Script `const EXPORT_PART = 'primitives';` voranstellen.
//   primitives  → tokens/primitives/*.json (ein Objekt, wird beim Speichern nach Top-Level-Key gesplittet)
//   semantic    → tokens/semantic/color.json (Default = Mode surface-50) + tokens/semantic/context/*.json (nur Abweichungen)
//   typography  → tokens/typography/{font,phone,tablet,desktop,line-height,letter-spacing,text-styles}.json
//   layout      → tokens/layout/{phone,tablet,desktop}.json
//
// Regeln (siehe PLAN.md):
// - Figma-Namen werden nur normalisiert (Slash → Punkt, lowercase, Leerzeichen → Bindestrich), nie umbenannt.
// - Line-Height und Letter-Spacing kommen aus den TEXT STYLES (Master), in Prozent.
//   Letter-Spacing in PIXELS ungleich 0 wird als Prozent aus der gebundenen Variable gelesen (H1: −2 → −2 %).
// - Breakpoints mobile first: phone.json vollständig, tablet.json / desktop.json nur Abweichungen zur kleineren Stufe.
// - Kontexte: surface-50 ist Default, alle anderen Modes nur Abweichungen.

const PART = typeof EXPORT_PART !== 'undefined' ? EXPORT_PART : 'primitives';

const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');
const pathOf = (name) => name.split('/').map(slug);
const hex = (c) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  return '#' + h(c.r) + h(c.g) + h(c.b) + (c.a !== undefined && c.a < 1 ? h(c.a) : '');
};
const setDeep = (obj, path, val) => {
  let o = obj;
  for (let i = 0; i < path.length - 1; i++) { o[path[i]] = o[path[i]] || {}; o = o[path[i]]; }
  o[path[path.length - 1]] = val;
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(allVars.map((v) => [v.id, v]));
const col = (n) => collections.find((c) => c.name === n);

function typeFor(v) {
  const n = v.name;
  if (v.resolvedType === 'COLOR') return 'color';
  if (v.resolvedType === 'STRING') return n.startsWith('font-family') ? 'fontFamily' : 'string';
  if (v.resolvedType === 'BOOLEAN') return 'boolean';
  if (n.startsWith('z/')) return 'number';
  if (n.startsWith('line-height') || n.startsWith('letter-spacing')) return 'number';
  return 'dimension';
}
function rawValue(v, modeId) {
  const raw = v.valuesByMode[modeId];
  if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') return '{' + pathOf(byId[raw.id].name).join('.') + '}';
  const t = typeFor(v);
  if (t === 'color') return hex(raw);
  if (t === 'dimension') return raw + 'px';
  return raw;
}
function token(v, modeId) {
  const t = typeFor(v);
  const tok = { $type: t, $value: rawValue(v, modeId) };
  if (t === 'number' && (v.name.startsWith('line-height') || v.name.startsWith('letter-spacing'))) tok.$extensions = { unit: 'percent' };
  if (v.description) tok.$description = v.description;
  return tok;
}
function modeId(c, name) { return c.modes.find((m) => m.name === name).modeId; }
function dumpMode(c, modeName, filter) {
  const mid = modeId(c, modeName);
  const out = {};
  for (const id of c.variableIds) { const v = byId[id]; if (filter && !filter(v)) continue; setDeep(out, pathOf(v.name), token(v, mid)); }
  return out;
}
function dumpDiff(c, modeName, baseModeName, filter) {
  const mid = modeId(c, modeName), base = modeId(c, baseModeName);
  const out = {};
  for (const id of c.variableIds) {
    const v = byId[id]; if (filter && !filter(v)) continue;
    if (rawValue(v, mid) !== rawValue(v, base)) setDeep(out, pathOf(v.name), token(v, mid));
  }
  return out;
}

if (PART === 'primitives') {
  return dumpMode(col('Primitives'), 'Default');
}

if (PART === 'semantic') {
  const c = col('Semantic');
  const contexts = {};
  for (const m of c.modes) if (m.name !== 'surface-50') contexts[m.name] = dumpDiff(c, m.name, 'surface-50');
  return { default: dumpMode(c, 'surface-50'), contexts };
}

if (PART === 'layout') {
  const c = col('Layout');
  return { phone: dumpMode(c, 'Phone'), tablet: dumpDiff(c, 'Tablet', 'Phone'), desktop: dumpDiff(c, 'Desktop', 'Tablet') };
}

if (PART === 'typography') {
  const c = col('Typography');
  const isSize = (v) => v.name.startsWith('font-size/');
  const isFamily = (v) => v.name.startsWith('font-family/');
  const styles = await figma.getLocalTextStylesAsync();
  const lineHeight = {}, letterSpacing = {}, textStyles = {}, weights = {};
  const weightOf = (style) => ({ Regular: 400, Medium: 500, Semibold: 600, 'Semi Bold': 600, Bold: 700 }[style] || 400);
  for (const s of styles) {
    const bv = s.boundVariables || {};
    const sizeVar = bv.fontSize ? byId[bv.fontSize.id] : null;
    const key = sizeVar ? pathOf(sizeVar.name).slice(1).join('.') : slug(s.name.replace(/\//g, '-'));
    const lh = s.lineHeight.unit === 'PERCENT' ? Math.round(s.lineHeight.value * 100) / 100 : null;
    let ls = 0;
    if (s.letterSpacing.unit === 'PERCENT') ls = s.letterSpacing.value;
    else if (s.letterSpacing.value !== 0 && bv.letterSpacing) ls = byId[bv.letterSpacing.id].valuesByMode[modeId(c, 'Desktop')];
    else ls = s.letterSpacing.value;
    setDeep(lineHeight, ['line-height', key], { $type: 'number', $value: lh, $extensions: { unit: 'percent', 'com.figma.textStyle': s.name } });
    setDeep(letterSpacing, ['letter-spacing', key], { $type: 'number', $value: ls, $extensions: { unit: 'percent', 'com.figma.textStyle': s.name } });
    const famKey = slug(s.fontName.family) === 'switzer' ? 'sans' : 'mono';
    const wKey = s.fontName.style.toLowerCase().replace(/\s+/g, '');
    weights[wKey] = weightOf(s.fontName.style);
    setDeep(textStyles, ['text-style', key], {
      $type: 'typography',
      $value: { fontFamily: '{font.family.' + famKey + '}', fontWeight: '{font.weight.' + wKey + '}', fontSize: '{font-size.' + key + '}', lineHeight: '{line-height.' + key + '}', letterSpacing: '{letter-spacing.' + key + '}' },
      $extensions: { 'com.figma.textStyle': s.name, textTransform: s.textCase === 'UPPER' ? 'uppercase' : 'none' }
    });
  }
  const fam = dumpMode(c, 'Desktop', isFamily);
  const font = { font: { family: {}, weight: {} } };
  for (const [k, v] of Object.entries(fam['font-family'])) font.font.family[k === 'switzer' ? 'sans' : 'mono'] = { $type: 'fontFamily', $value: [v.$value, k === 'switzer' ? 'system-ui' : 'monospace'], $extensions: { 'com.figma.variable': 'font-family/' + v.$value } };
  for (const [k, v] of Object.entries(weights)) font.font.weight[k] = { $type: 'fontWeight', $value: v };
  return {
    font,
    phone: dumpMode(c, 'Phone', isSize),
    tablet: dumpDiff(c, 'Tablet', 'Phone', isSize),
    desktop: dumpDiff(c, 'Desktop', 'Tablet', isSize),
    lineHeight, letterSpacing, textStyles
  };
}

return { error: 'unknown EXPORT_PART ' + PART };
