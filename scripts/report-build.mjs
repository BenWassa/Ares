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

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const files = await filesUnder(dist);
const sizes = await Promise.all(files.map(async (file) => ({ file, size: (await stat(file)).size })));
const total = sizes.reduce((sum, item) => sum + item.size, 0);
const html = await readFile(join(dist, 'index.html'));
const htmlText = html.toString('utf8');
const externalJs = sizes.filter(({ file }) => file.endsWith('.js')).reduce((sum, item) => sum + item.size, 0);
const css = sizes.filter(({ file }) => file.endsWith('.css')).reduce((sum, item) => sum + item.size, 0);
const media = sizes.filter(({ file }) => /\.(?:avif|gif|jpe?g|png|svg|webp|woff2?|ttf|otf)$/i.test(file));
const inlineJs = [...htmlText.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .reduce((sum, match) => sum + Buffer.byteLength(match[1] ?? '', 'utf8'), 0);
const largest = [...sizes].sort((a, b) => b.size - a.size)[0];
console.log(`Build payload: html=${html.byteLength}B css=${css}B external-js=${externalJs}B inline-js=${inlineJs}B media=${media.reduce((sum, item) => sum + item.size, 0)}B total=${total}B files=${files.length} largest=${largest?.size ?? 0}B:${largest?.file.replace(`${dist}/`, '') ?? 'none'}`);
