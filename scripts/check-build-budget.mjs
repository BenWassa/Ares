import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(path));
    else result.push(path);
  }
  return result;
}

// Ares 2.2 self-hosts Newsreader and IBM Plex Sans, which #30 budgets for
// explicitly: total build <= 700KB including fonts. The font line is called out
// separately so a future subset that stops being a subset fails loudly.
const limits = {
  total: 700 * 1024,
  css: 40 * 1024,
  clientScript: 80 * 1024,
  fonts: 280 * 1024,
  binaryAsset: 512 * 1024,
};
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const files = await filesUnder(dist);
const sizes = await Promise.all(files.map(async (file) => ({ file, size: (await stat(file)).size })));
const total = sizes.reduce((sum, item) => sum + item.size, 0);
const css = sizes.filter(({ file }) => file.endsWith('.css')).reduce((sum, item) => sum + item.size, 0);
const externalJs = sizes.filter(({ file }) => file.endsWith('.js')).reduce((sum, item) => sum + item.size, 0);
const htmlText = (await readFile(join(dist, 'index.html'))).toString('utf8');
const inlineJs = [...htmlText.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .reduce((sum, match) => sum + Buffer.byteLength(match[1] ?? '', 'utf8'), 0);
const fonts = sizes.filter(({ file }) => /\.woff2?$/i.test(file)).reduce((sum, item) => sum + item.size, 0);
const oversizedBinary = sizes.filter(({ file, size }) => /\.(?:avif|gif|jpe?g|png|svg|webp|woff2?|ttf|otf)$/i.test(file) && size > limits.binaryAsset);
const failures = [];
if (total > limits.total) failures.push(`total ${total}B > ${limits.total}B`);
if (css > limits.css) failures.push(`css ${css}B > ${limits.css}B`);
if (fonts > limits.fonts) failures.push(`fonts ${fonts}B > ${limits.fonts}B`);
if (externalJs + inlineJs > limits.clientScript) failures.push(`client script ${externalJs + inlineJs}B > ${limits.clientScript}B`);
for (const item of oversizedBinary) failures.push(`binary asset ${item.file} ${item.size}B > ${limits.binaryAsset}B`);
if (failures.length) throw new Error(`Build budget exceeded:\n${failures.join('\n')}`);
console.log(`Build budget OK: total=${total}B css=${css}B fonts=${fonts}B client-script=${externalJs + inlineJs}B; no binary asset exceeds ${limits.binaryAsset}B.`);
