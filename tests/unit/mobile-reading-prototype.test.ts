import { describe, expect, it } from 'vitest';
import casesSource from '../../src/content/data/cases.json';
import prototypeSource from '../../src/content/data/mobile-reading-prototype.json';
import { CaseStudiesFileSchema, MobileReadingPrototypeSchema } from '../../src/lib/content/schemas';
import { loadMobileReadingPrototype } from '../../src/lib/content/reading-prototype';

describe('Ares 2.3 representative reading contract', () => {
  it('validates the five editorial layers without creating a second case manuscript', () => {
    const prototype = MobileReadingPrototypeSchema.parse(prototypeSource);
    expect(prototype.layerContract.map((layer) => layer.id)).toEqual([
      'essential', 'evidence', 'method', 'interpretation', 'source-provenance',
    ]);
    expect(prototype.case).not.toHaveProperty('chronology');
    expect(prototype.case).not.toHaveProperty('evidence');
    expect(prototype.case).not.toHaveProperty('sections');
  });

  it('resolves every prototype selector into canonical Ares 2.2 case data', () => {
    const cases = CaseStudiesFileSchema.parse(casesSource).cases;
    const prototype = loadMobileReadingPrototype(cases);
    const myLai = cases.find((record) => record.id === prototype.case.caseId);
    expect(myLai).toBeDefined();
    expect(prototype.case.essentialChronologyIndexes.map((index) => myLai?.chronology[index]?.text)).toHaveLength(4);
    expect(myLai?.evidence[prototype.case.focalEvidenceIndex]?.speaker).toBe('Hugh Thompson');
  });

  it('keeps interpretation-critical framework caveats in the essential contract', () => {
    const prototype = MobileReadingPrototypeSchema.parse(prototypeSource);
    expect(prototype.framework.criticalCaveats.length).toBeGreaterThanOrEqual(2);
    expect(prototype.framework.criticalCaveats.join(' ')).toMatch(/not equivalence/i);
    expect(prototype.framework.criticalCaveats.join(' ')).toMatch(/legal/i);
  });

  it('limits the case prototype to three to five essential chronology events', () => {
    const prototype = MobileReadingPrototypeSchema.parse(prototypeSource);
    expect(prototype.case.essentialChronologyIndexes.length).toBeGreaterThanOrEqual(3);
    expect(prototype.case.essentialChronologyIndexes.length).toBeLessThanOrEqual(5);
  });
});
