import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url);
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await filesUnder(path));
    else paths.push(path);
  }
  return paths.sort();
}

async function digestDist() {
  const dist = new URL('../dist/', import.meta.url);
  const files = await filesUnder(dist);
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(relative(dist.pathname, file));
    hash.update(await readFile(file));
  }
  return hash.digest('hex');
}

function build() {
  const result = spawnSync(command, ['exec', 'astro', 'build'], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

build();
const first = await digestDist();
build();
const second = await digestDist();
if (first !== second) throw new Error(`Static build is not deterministic: ${first} != ${second}`);
console.log(`Deterministic build SHA-256: ${first}`);
