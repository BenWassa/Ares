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

  it('does not reintroduce the rejected escalation ladder into authoritative framing', async () => {
    const files = ['front-matter.md', 'scope-purpose.md', 'process-model.md', 'implications.md'];
    for (const file of files) {
      const text = await readFile(new URL(`../../src/content/sections/${file}`, import.meta.url), 'utf8');
      expect(text.toLowerCase()).not.toContain('escalation ladder');
      expect(text.toLowerCase()).not.toContain('six-stage model');
      expect(text.toLowerCase()).not.toContain('eight-stage model');
    }
  });
});
