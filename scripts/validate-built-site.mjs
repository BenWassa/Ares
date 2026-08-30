import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const entries = await readdir(dist, { recursive: true });
const htmlFiles = entries.filter((entry) => entry.endsWith('.html'));
if (htmlFiles.length < 17) throw new Error(`Expected a multi-page publication with at least 17 HTML documents; found ${htmlFiles.length}.`);

const documents = [];
for (const file of htmlFiles) {
  const html = await readFile(new URL(file, dist), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const idSet = new Set(ids);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) throw new Error(`${file}: duplicate HTML IDs: ${[...new Set(duplicates)].join(', ')}`);
  const fragments = [...html.matchAll(/\shref="#([^"]+)"/g)].map((match) => decodeURIComponent(match[1]));
  const missing = [...new Set(fragments.filter((id) => !idSet.has(id)))];
  if (missing.length) throw new Error(`${file}: broken same-document fragment targets: ${missing.join(', ')}`);
  documents.push({ file, html, ids });
}

const joined = documents.map(({ html }) => html).join('\n');
const requiredIds = ['front-matter', 'part-i', 'part-ii', 'part-iii', 'part-iv', 'part-v', 'part-vi', 'glossary', 'references', 'armenian-genocide', 'rwandan-genocide'];
for (const id of requiredIds) if (!joined.includes(`id="${id}"`)) throw new Error(`Missing durable publication anchor #${id} across built routes.`);
if (!joined.includes('requires source trace')) throw new Error('Rendered publication lost the visible source-trace boundary.');
if (joined.includes('ARES_PROCESS_STAGES')) throw new Error('Legacy process-stage runtime data is forbidden.');
if (!joined.includes('data-process-domain=')) throw new Error('Process synthesis did not render semantic domain disclosures.');

// Chronology ISO bounds are positioning metadata for Figure 02 and must never
// reach the reader: `dateLabel` is the displayed truth, and an ISO date in the
// markup would present "Spring-Summer 1915" as though it had a known day (#33).
const isoDate = /\b\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/;
for (const { file, html } of documents) {
  const match = html.match(isoDate);
  if (match) throw new Error(`${file}: an ISO 8601 date reached the rendered interface (${match[0]}). Chronology bounds are positioning metadata only.`);
}

const root = await readFile(new URL('index.html', dist), 'utf8');
if (root.includes('class="case-study')) throw new Error('The opening route regressed to the monolithic all-cases publication.');
for (const path of ['/Ares/framework', '/Ares/cases', '/Ares/comparison', '/Ares/process', '/Ares/glossary', '/Ares/references']) {
  if (!root.includes(`href="${path}"`)) throw new Error(`Opening route is missing publication route ${path}.`);
}

console.log(`Built-site contract: ${htmlFiles.length} HTML documents; durable anchors and route-level publication structure verified.`);
