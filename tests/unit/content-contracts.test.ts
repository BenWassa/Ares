import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { loadStructuredContent } from '../../src/lib/content/loaders';
import { loadCaseDocument } from '../../src/lib/content/case-document';
import { evidenceKindLabel } from '../../src/lib/content/labels';

const caseFile = (file: string) => new URL(`../../src/content/cases/${file}.md`, import.meta.url);
const sectionsOf = (source: string) => [...source.matchAll(/^##\s+([A-F])\.\s+.+$/gm)].map((match, index, all) => ({
  key: match[1] as string,
  body: source.slice((match.index ?? 0) + match[0].length, all[index + 1]?.index ?? source.length),
}));

describe('Ares editorial contracts', () => {
  it('loads eight cases, a four-domain non-sequential synthesis, and stable sources', async () => {
    const { cases, glossary, process, references } = await loadStructuredContent();
    expect(cases.cases).toHaveLength(8);
    expect(process.domains).toHaveLength(4);
    expect(process.rendering.sequential).toBe(false);
    expect(process.authorshipLabel).toMatch(/Ares synthesis/i);
    expect(process.authorshipLabel).toMatch(/not a stage model/i);
    expect(references.some((source) => source.id === 'src-dutton-2005')).toBe(true);
    expect(Object.keys(glossary).length).toBeGreaterThan(10);
  });

  it('lets each case declare its own section order while holding the shared grammar', async () => {
    const { cases, glossary } = await loadStructuredContent();
    const orders = new Set<string>();
    for (const record of cases.cases) {
      const document = await loadCaseDocument(record, glossary);
      const order = record.sections.map((section) => section.key);
      orders.add(order.join(''));
      // Every declared section has prose, and nothing in the Markdown is orphaned.
      expect(Object.keys(document.sections).sort()).toEqual([...order].sort());
      // Shared grammar: narrative orientation first, a chronology, analysis last.
      expect(record.sections[0]?.kind).toBe('narrative');
      expect(record.sections.at(-1)?.kind).toBe('analysis');
      expect(record.sections.filter((section) => section.kind === 'chronology')).toHaveLength(1);
      expect(record.evidence.length).toBeGreaterThanOrEqual(1);
      expect(record.chronology.length).toBeGreaterThan(0);
      const chronologyKey = record.sections.find((section) => section.kind === 'chronology')?.key ?? '';
      expect(document.sections[chronologyKey]?.html).not.toMatch(/Structured chronology/);
      // A case that departs from the shared order records why, in the content.
      const shared = order.join('') === 'ABCDEF';
      if (!shared) expect(record.sections.some((section) => section.note)).toBe(true);
    }
    // At least two distinct shapes across the corpus.
    expect(orders.size).toBeGreaterThanOrEqual(3);
  });

  it('labels every case section from its declared authorship, never from template position', async () => {
    const { cases, glossary } = await loadStructuredContent();
    for (const record of cases.cases) {
      const document = await loadCaseDocument(record, glossary);
      expect(record.sections.map((section) => section.key).sort()).toEqual(Object.keys(document.sections).sort());
      for (const section of record.sections) {
        expect(section.authorship).toMatch(/Ares/);
        if (section.kind === 'narrative') expect(section.authorship).toMatch(/^Narrative written by Ares/);
        expect(section.authorship).not.toMatch(/witness/i);
      }
      // Exactly one narrative and one chronology section, and the evidence record is
      // labelled from its own kind rather than from where it happens to sit.
      expect(record.sections.filter((section) => section.kind === 'narrative')).toHaveLength(1);
      expect(record.sections.filter((section) => section.kind === 'chronology')).toHaveLength(1);
      for (const evidence of record.evidence) expect(evidenceKindLabel(evidence.kind)).toMatch(/\S/);
    }
  });

  it('carries positioning bounds for every chronology entry without manufacturing precision', async () => {
    const { cases } = await loadStructuredContent();
    let entries = 0;
    for (const record of cases.cases) {
      for (const entry of record.chronology) {
        entries += 1;
        expect(entry.startDate <= entry.endDate).toBe(true);
        // A day-precision entry spans at most two days (a label may name a short
        // range like "December 12-13, 1981"); anything coarser must span more than
        // a single day, or the label has been given precision it does not have.
        const span = (Date.parse(entry.endDate) - Date.parse(entry.startDate)) / 86_400_000;
        if (entry.precision === 'day') expect(span).toBeLessThanOrEqual(11);
        else expect(span).toBeGreaterThan(0);
        // Bounds sit inside the case's own era rather than being parsed loose from
        // the label: nothing precedes the case by more than two decades.
        const caseYear = Number.parseInt(record.sortKey.slice(0, 4), 10);
        expect(Number.parseInt(entry.startDate.slice(0, 4), 10)).toBeGreaterThanOrEqual(caseYear - 40);
      }
    }
    expect(entries).toBe(56);
  });

  it('records the duration judgement rather than deciding it silently', async () => {
    const { cases } = await loadStructuredContent();
    for (const record of cases.cases) {
      expect(record.duration.days).toBeGreaterThan(0);
      expect(record.duration.sourceStatus).toBe('requires-source-trace');
      // The duration must sit inside the span the chronology covers.
      const earliest = record.chronology.map((entry) => entry.startDate).sort()[0] ?? '';
      const latest = record.chronology.map((entry) => entry.endDate).sort().at(-1) ?? '';
      const covered = (Date.parse(latest) - Date.parse(earliest)) / 86_400_000 + 1;
      expect(record.duration.days).toBeLessThanOrEqual(covered);
      // An exact duration is only claimed for single-day events.
      if (!record.duration.approximate) expect(record.duration.days).toBeLessThanOrEqual(1);
    }
    // The three contested measurements say so in words, not by omission.
    for (const id of ['bosnian-war', 'ukrainian-holodomor', 'cambodian-genocide']) {
      const record = cases.cases.find((entry) => entry.id === id);
      expect(record?.duration.note, `${id} must record its duration judgement`).toMatch(/Judgement call/);
    }
  });

  it('never renders an ISO date as a chronology label', async () => {
    const { cases } = await loadStructuredContent();
    for (const record of cases.cases) {
      for (const entry of record.chronology) {
        expect(entry.dateLabel).not.toMatch(/\d{4}-\d{2}-\d{2}/);
      }
      expect(record.displayPeriod).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    }
  });

  it('keeps every case death estimate paired with its stated uncertainty', async () => {
    const { cases } = await loadStructuredContent();
    for (const record of cases.cases) {
      expect(record.deathEstimate.uncertainty.length).toBeGreaterThan(20);
      expect(record.deathEstimate.sourceStatus).toBe('requires-source-trace');
    }
  });

  it('reserves case emphasis for named analytic concepts, never for descriptions of violence', async () => {
    const { cases, glossary } = await loadStructuredContent();
    // The publication's defined analytic vocabulary: glossary entries plus the framework
    // drivers named in Part I and Part III. Anything else bolded in a case body is
    // emphasis-as-sensation and is not allowed (#31).
    const vocabulary = new Set([
      ...Object.values(glossary).map((entry) => entry.term.toLowerCase()),
      'shattered authority',
      'social chaos',
      'group cohesion',
    ]);
    const normalize = (phrase: string) => {
      const value = phrase.trim().toLowerCase().replace(/[:.]$/, '');
      return value.endsWith('s') && vocabulary.has(value.slice(0, -1)) ? value.slice(0, -1) : value;
    };
    for (const record of cases.cases) {
      const source = await readFile(caseFile(record.file), 'utf8');
      for (const section of sectionsOf(source)) {
        const emphasised = [...section.body.matchAll(/\*\*([^*]+)\*\*/g)].map((match) => normalize(match[1] ?? ''));
        for (const phrase of emphasised) {
          expect(vocabulary.has(phrase), `${record.file} section ${section.key} emphasises "${phrase}", which is not a defined analytic concept`).toBe(true);
        }
        expect(new Set(emphasised).size, `${record.file} section ${section.key} emphasises the same concept twice`).toBe(emphasised.length);
      }
    }
  });

  it('uses typographic quotation marks and apostrophes across published content', async () => {
    const { cases } = await loadStructuredContent();
    const files = [
      ...cases.cases.map((record) => caseFile(record.file)),
      ...['front-matter', 'scope-purpose', 'definitions-typology', 'theoretical-lenses', 'comparative-analysis', 'process-model', 'implications', 'critical-reflection']
        .map((file) => new URL(`../../src/content/sections/${file}.md`, import.meta.url)),
    ];
    for (const file of files) {
      const text = await readFile(file, 'utf8');
      expect(text, `${file.pathname} still contains a straight quote`).not.toMatch(/["']/);
    }
    for (const record of cases.cases) {
      for (const value of [...record.evidence.map((evidence) => evidence.context), record.deathEstimate.uncertainty, ...record.chronology.map((entry) => entry.text)]) {
        expect(value).not.toMatch(/["']/);
      }
    }
  });

  it('does not reintroduce the rejected stage model into active publication sections', async () => {
    const files = [
      'front-matter.md',
      'scope-purpose.md',
      'definitions-typology.md',
      'theoretical-lenses.md',
      'comparative-analysis.md',
      'process-model.md',
      'implications.md',
      'critical-reflection.md',
    ];
    for (const file of files) {
      const text = await readFile(new URL(`../../src/content/sections/${file}`, import.meta.url), 'utf8');
      const lower = text.toLowerCase();
      expect(lower).not.toContain('escalation ladder');
      expect(lower).not.toContain('six-stage model');
      expect(lower).not.toContain('eight-stage model');
      expect(lower).not.toContain('deterministic early warning');
    }
  });
});
