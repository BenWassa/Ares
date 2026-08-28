import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(ids);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) throw new Error(`Duplicate HTML IDs: ${[...new Set(duplicates)].join(', ')}`);

const fragments = [...html.matchAll(/\shref="#([^"]+)"/g)].map((match) => decodeURIComponent(match[1]));
const missing = [...new Set(fragments.filter((id) => !idSet.has(id)))];
if (missing.length) throw new Error(`Broken fragment targets: ${missing.join(', ')}`);

const required = ['front-matter', 'part-i', 'part-ii', 'part-iii', 'part-iv', 'part-v', 'part-vi', 'glossary', 'references'];
for (const id of required) if (!idSet.has(id)) throw new Error(`Missing durable publication anchor #${id}`);
if (!html.includes('requires source trace')) throw new Error('Rendered publication lost the visible source-trace boundary.');
if (html.includes('ARES_PROCESS_STAGES')) throw new Error('Legacy process-stage runtime data is forbidden.');
if (!html.includes('data-process-domain=')) throw new Error('Process synthesis did not render semantic domain disclosures.');
console.log(`Built-site contract: ${ids.length} unique ids, ${fragments.length} fragment links, all required anchors resolve.`);
