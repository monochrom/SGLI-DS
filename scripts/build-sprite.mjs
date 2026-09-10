// SGLI Design System – Icon Sprite
// assets/icons/*.svg → dist/icons/sprite.svg (<symbol id="…" viewBox="…">)
// Verwendung: <svg class="icon" aria-hidden="true"><use href="/dist/icons/sprite.svg#icon-arrow-right"></use></svg>
// Farbe kommt über currentColor, Größe über --size-icon-*.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets/icons');
const OUT = join(ROOT, 'dist/icons');
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.endsWith('.svg')).sort();
const symbols = [];
const names = [];
for (const f of files) {
  const svg = readFileSync(join(SRC, f), 'utf8');
  const name = basename(f, '.svg');
  const viewBox = (svg.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 24 24';
  let inner = svg.replace(/<\?xml[^>]*>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  // Farben auf currentColor normalisieren (Phosphor exportiert fill="#…" / stroke="#…")
  inner = inner.replace(/(fill|stroke)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"');
  symbols.push(`  <symbol id="icon-${name}" viewBox="${viewBox}">${inner}</symbol>`);
  names.push(name);
}
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n${symbols.join('\n')}\n</svg>\n`;
writeFileSync(join(OUT, 'sprite.svg'), sprite);
writeFileSync(join(OUT, 'icons.json'), JSON.stringify(names, null, 2) + '\n');
console.log(`✔ dist/icons/sprite.svg (${names.length} Icons)`);
