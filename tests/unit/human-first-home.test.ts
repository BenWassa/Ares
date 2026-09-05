import { describe, expect, it } from 'vitest';
import casesSource from '../../src/content/data/cases.json';
import { caseDecade, caseSpanInWords, caseYear } from '../../src/lib/content/case-display';
import { CaseStudiesFileSchema } from '../../src/lib/content/schemas';

const cases = CaseStudiesFileSchema.parse(casesSource).cases.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

describe('Ares 3.1 historical field data contract', () => {
  it('keeps all eight canonical cases in calendar order and gives each a word span', () => {
    expect(cases.map(caseYear)).toEqual(['1915', '1932', '1937', '1968', '1975', '1981', '1994', '1995']);
    expect(cases.map(caseSpanInWords)).toEqual([
      'about three years', 'about thirteen months', 'six weeks', 'one day',
      'about four years', 'one day', 'a hundred days', 'about four years',
    ]);
    expect(cases.map(caseDecade)).toEqual(['1910s', '1930s', '1930s', '1960s', '1970s', '1980s', '1990s', '1990s']);
  });

  it('keeps duration and classification provenance attached to every field entry', () => {
    for (const record of cases) {
      expect(record.duration.sourceStatus).toBe('requires-source-trace');
      expect(record.classification.sourceStatus).toBe('requires-source-trace');
      expect(record.duration.note, record.id).toBeTruthy();
    }
  });
});
