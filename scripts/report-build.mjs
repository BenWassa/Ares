import { readdir, readFile, stat } from 'node:fs/promises';
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
const dist = new URL('../dist/', import.meta.url).pathname;
const files = await filesUnder(dist);
let total = 0;
for (const file of files) total += (await stat(file)).size;
const html = await readFile(new URL('../dist/index.html', import.meta.url));
const js = await Promise.all(files.filter((file) => file.endsWith('.js')).map(async (file) => (await stat(file)).size));
const css = await Promise.all(files.filter((file) => file.endsWith('.css')).map(async (file) => (await stat(file)).size));
console.log(`Build payload: html=${html.byteLength}B css=${css.reduce((a,b)=>a+b,0)}B js=${js.reduce((a,b)=>a+b,0)}B total=${total}B files=${files.length}`);
