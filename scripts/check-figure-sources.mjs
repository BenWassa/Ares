/**
 * Figure/source contract (#34).
 *
 * A hand-tuned diagram that quietly disagrees with the data it describes is the
 * most common failure mode for figures in a content-driven site. This asserts
 * that every figure's rendered text still matches the JSON it claims to come
 * from, and that no figure has started ranking cases by death toll.
 */
import { readFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const source = new URL('../src/content/data/', import.meta.url);

const cases = JSON.parse(await readFile(new URL('cases.json', source), 'utf8'));
const process = JSON.parse(await readFile(new URL('process.json', source), 'utf8'));

const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (html) => html.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
  if (/^#x/i.test(entity)) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
  if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
  return named[entity.toLowerCase()] ?? match;
});
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

async function route(path) {
  return readFile(new URL(path, dist), 'utf8');
}

/** The markup of one figure, located by its data-figure id. */
function figure(html, id) {
  const marker = `data-figure="${id}"`;
  const anchor = html.indexOf(marker);
  if (anchor < 0) throw new Error(`Figure ${id} is missing from the built page.`);
  const start = html.lastIndexOf('<figure', anchor);
  const end = html.indexOf('</figure>', anchor);
  if (start < 0 || end < 0) throw new Error(`Figure ${id} is not wrapped in a <figure> element.`);
  return html.slice(start, end);
}

const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

// ---- Figure 01: the cycle says what process.json says -----------------------
{
  const html = await route('process.html');
  const body = text(figure(html, 'figure-01'));
  for (const domain of process.domains) {
    // Node labels wrap across tspans, so compare on the words rather than the run.
    for (const word of domain.label.split(' ')) expect(body.includes(word), `Figure 01 has drifted from process.json: "${domain.label}" is not rendered.`);
  }
  for (const relationship of process.relationships) {
    const verb = relationship.type.replaceAll('-', ' ');
    expect(body.includes(verb), `Figure 01 is missing the modal verb "${verb}"; the edges must not be reduced to arrows alone.`);
    expect(body.includes(relationship.label), `Figure 01 has drifted from process.json: the gloss for ${relationship.id} is not rendered.`);
  }
  expect(!/\b(step|stage)\s*[1-4]\b/i.test(body), 'Figure 01 must carry no numbering: it is a cycle, not a ladder.');
  expect(body.includes(process.authorshipLabel), 'Figure 01 must carry the Ares synthesis attribution on the figure itself.');
}

// ---- Figure 02: each case's spine says what its chronology says --------------
// A case whose reading units are screens renders its spine on the unit that owns
// the complete chronology rather than on the case overview (#51). The route moves;
// the contract that the spine matches cases.json does not.
const chronologyRoutes = {
  'my-lai-massacre': 'cases/my-lai-massacre/scholarly-depth.html',
};
for (const record of cases.cases) {
  const html = await route(chronologyRoutes[record.id] ?? `cases/${record.id}.html`);
  const body = text(figure(html, `figure-02-${record.id}`));
  for (const entry of record.chronology) {
    expect(body.includes(entry.dateLabel), `Figure 02 (${record.id}) has drifted: "${entry.dateLabel}" is not rendered.`);
    expect(body.includes(entry.text.slice(0, 40)), `Figure 02 (${record.id}) has drifted: the entry for "${entry.dateLabel}" is not rendered.`);
    expect(!body.includes(entry.startDate) && !body.includes(entry.endDate), `Figure 02 (${record.id}) rendered an ISO bound; those are positioning metadata only.`);
  }
}

// ---- Figure 03: tempo, chronological, and never sized by toll ---------------
{
  // The complete comparison is its own screen under the hierarchy (#51); the
  // duration figure travelled with it.
  const html = await route('comparison/scholarly-depth.html');
  const block = figure(html, 'figure-03');
  const body = text(block);
  const chronological = [...cases.cases].sort((a, b) => a.sortKey.localeCompare(b.sortKey)).map((record) => record.navTitle);
  const rendered = chronological.filter((title) => body.includes(title));
  expect(rendered.length === chronological.length, 'Figure 03 has drifted: not every case is rendered.');
  const positions = chronological.map((title) => body.indexOf(title));
  expect(positions.every((value, index) => index === 0 || value > positions[index - 1]),
    'Figure 03 must order cases chronologically. Ordering by duration or by death toll would make it a league table.');
  for (const record of cases.cases) {
    expect(body.includes(record.duration.days.toLocaleString('en-GB')), `Figure 03 has drifted from ${record.id}'s duration.`);
    expect(body.includes(record.deathEstimate.display), `Figure 03 must show ${record.id}'s estimate as text, with its range visible.`);
  }
  // The only quantity encoded as geometry is time.
  const geometry = [...block.matchAll(/--extent:([\d.]+)%/g)].map((match) => Number.parseFloat(match[1]));
  expect(geometry.length === cases.cases.length, 'Figure 03 must draw exactly one bar per case.');
  const byToll = [...cases.cases]
    .map((record) => ({ id: record.id, toll: Number.parseInt(record.deathEstimate.display.replace(/[^\d]/g, '').slice(0, 9), 10) || 0 }))
    .sort((a, b) => b.toll - a.toll)
    .map((entry) => entry.id);
  const byBar = [...cases.cases]
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map((record, index) => ({ id: record.id, extent: geometry[index] ?? 0 }))
    .sort((a, b) => b.extent - a.extent)
    .map((entry) => entry.id);
  expect(byToll.join() !== byBar.join(), 'Figure 03 bar lengths track the death-toll ordering; geometry must encode tempo, never toll.');
  expect(/logarithmic/i.test(body), 'Figure 03 must label its axis as logarithmic.');
}

// ---- Figure 04: the ledger counts what the corpus contains ------------------
{
  const counts = { 'requires-source-trace': 0, 'source-reviewed': 0, approved: 0 };
  let total = 0;
  for (const record of cases.cases) {
    const statuses = [
      record.classification.sourceStatus,
      record.deathEstimate.sourceStatus,
      record.primaryMethod.sourceStatus,
      ...record.evidence.map((evidence) => evidence.sourceStatus),
      ...record.chronology.map((entry) => entry.sourceStatus),
    ];
    for (const status of statuses) { counts[status] += 1; total += 1; }
  }
  const body = text(figure(await route('references.html'), 'figure-04'));
  expect(body.includes(String(total)), `Figure 04 has drifted: the corpus holds ${total} records and the figure does not say so.`);
  const tracedCount = counts['source-reviewed'] + counts.approved;
  expect(body.includes(`${tracedCount} have been traced`) || body.includes(`${tracedCount} of ${total}`),
    `Figure 04 must state the traced count (${tracedCount} of ${total}) in words.`);
  expect(/untraced does not mean false/i.test(body), 'Figure 04 must say plainly that untraced does not mean false.');
  expect(!/\bcomplete\b|\bprogress\b|%\s*done/i.test(body), 'Figure 04 must not be framed as a completion meter.');
}

if (failures.length) throw new Error(`Figure/source contract failed:\n- ${failures.join('\n- ')}`);
console.log(`Figure/source contract OK: figures 01–04 match cases.json and process.json; no figure orders or sizes by death toll.`);
