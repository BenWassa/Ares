import { describe, expect, it } from 'vitest';
import casesSource from '../../src/content/data/cases.json';
import { caseChronologyPosition, caseSpanInWords, caseYear } from '../../src/lib/content/case-display';
import { CaseStudiesFileSchema } from '../../src/lib/content/schemas';

const cases = CaseStudiesFileSchema.parse(casesSource).cases.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
const expectedSortKeys = [
  '1915-04-24', '1932-08-01', '1937-12-13', '1968-03-16',
  '1975-04-17', '1981-12-11', '1994-04-07', '1995-07-11',
] as const;
const expectedPositions = [0, 21.53, 28.22, 65.94, 74.78, 83.07, 98.43, 100] as const;

describe('Ares 3.1 final Home historical-field contract', () => {
  it('keeps the audited eight canonical anchors and word spans in chronological order', () => {
    expect(cases.map((record) => record.sortKey)).toEqual(expectedSortKeys);
    expect(cases.map(caseYear)).toEqual(['1915', '1932', '1937', '1968', '1975', '1981', '1994', '1995']);
    expect(cases.map(caseSpanInWords)).toEqual([
      'about three years', 'about thirteen months', 'six weeks', 'one day',
      'about four years', 'one day', 'a hundred days', 'about four years',
    ]);
  });

  it('uses only linear elapsed calendar time for chronology geometry', () => {
    const positions = cases.map((record) => caseChronologyPosition(record, cases) * 100);
    positions.forEach((position, index) => expect(position).toBeCloseTo(expectedPositions[index]!, 2));
    expect(positions[7]! - positions[6]!).toBeLessThan(2);
  });

  it('keeps duration, classification and death-estimate provenance untouched behind the Home presentation', () => {
    for (const record of cases) {
      expect(record.duration.sourceStatus).toBe('requires-source-trace');
      expect(record.classification.sourceStatus).toBe('requires-source-trace');
      expect(record.deathEstimate.sourceStatus).toBe('requires-source-trace');
      expect(record.duration.note, record.id).toBeTruthy();
    }
    expect(cases.find((record) => record.id === 'el-mozote-massacre')?.deathEstimate.display).toBe('~978 (553 children)');
    expect(cases.find((record) => record.id === 'bosnian-war')?.deathEstimate.display).toBe('~100,000 (8,000+ at Srebrenica)');
    expect(cases.find((record) => record.id === 'my-lai-massacre')?.deathEstimate.display).toBe('347–504');
  });
});
