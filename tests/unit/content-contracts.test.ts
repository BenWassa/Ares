import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { loadStructuredContent } from '../../src/lib/content/loaders';
import { loadCaseDocument } from '../../src/lib/content/case-document';

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

  it('keeps every case on the A–F grammar and structured chronology', async () => {
    const { cases, glossary } = await loadStructuredContent();
    for (const record of cases.cases) {
      const document = await loadCaseDocument(record, glossary);
      expect(Object.keys(document.sections)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
      expect(record.chronology.length).toBeGreaterThan(0);
      expect(document.sections.C.html).not.toMatch(/Structured chronology/);
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
