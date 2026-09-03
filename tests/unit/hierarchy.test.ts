import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import casesSource from '../../src/content/data/cases.json';
import prototypeSource from '../../src/content/data/mobile-reading-prototype.json';
import comparisonUnits from '../../src/content/data/hierarchy/comparison.json';
import frameworkUnits from '../../src/content/data/hierarchy/framework.json';
import myLaiUnits from '../../src/content/data/hierarchy/my-lai-massacre.json';
import rootUnits from '../../src/content/data/hierarchy/root.json';
import { CaseStudiesFileSchema, MobileReadingPrototypeSchema } from '../../src/lib/content/schemas';
import { loadHierarchy } from '../../src/lib/content/hierarchy';

const cases = CaseStudiesFileSchema.parse(casesSource).cases;
const prototype = MobileReadingPrototypeSchema.parse(prototypeSource);
const hierarchy = loadHierarchy(cases, prototype);
const units = [...hierarchy.byId.values()];
const domainFiles = [rootUnits, frameworkUnits, myLaiUnits, comparisonUnits];

describe('Ares 2.3 screen hierarchy (#51)', () => {
  it('resolves one rooted tree from domain-local files rather than one manifest', () => {
    expect(domainFiles.length).toBeGreaterThan(1);
    expect(hierarchy.root.id).toBe('ares');
    expect(units.filter((unit) => unit.parentId === null)).toHaveLength(1);
    // Every unit is reachable and every parent/child pair agrees in both directions;
    // loadHierarchy throws otherwise, so reaching this point is the assertion.
    for (const unit of units) {
      for (const childId of unit.childIds) expect(hierarchy.unit(childId).parentId).toBe(unit.id);
      if (unit.parentId) expect(hierarchy.unit(unit.parentId).childIds).toContain(unit.id);
    }
  });

  it('gives every screen-level unit a durable fragment-free address', () => {
    const screens = units.filter((unit) => unit.screen);
    expect(screens.length).toBeGreaterThanOrEqual(10);
    for (const screen of screens) expect(screen.route).not.toContain('#');
    expect(new Set(screens.map((screen) => screen.route)).size).toBe(screens.length);
  });

  it('gives every framework child its own screen after the #55 parent correction', () => {
    const deferred = units.filter((unit) => !unit.screen);
    expect(deferred).toEqual([]);
    expect(hierarchy.unit('framework-scope-purpose').route).toBe('/framework/scope-purpose');
    expect(hierarchy.unit('framework-theoretical-lenses').route).toBe('/framework/theoretical-lenses');
  });

  it('names a canonical source for every unit and never carries a second manuscript', () => {
    for (const unit of units) expect(unit.sources.length, `${unit.id} has no source`).toBeGreaterThan(0);
    const graphText = JSON.stringify(domainFiles);
    // Prose fields exist for navigation only. If a caveat or question were lifted
    // from the manuscripts, the guided layer would start drifting from the source.
    expect(graphText).not.toContain(prototype.case.orientation);
    expect(graphText).not.toContain(prototype.case.finding);
    expect(graphText).not.toContain(prototype.comparison.warning);
    for (const caveat of prototype.framework.criticalCaveats) expect(graphText).not.toContain(caveat);
  });

  it('does not copy case or section prose into the graph', async () => {
    const graphText = JSON.stringify(domainFiles);
    const sources = await Promise.all([
      readFile(new URL('../../src/content/cases/my-lai-massacre.md', import.meta.url), 'utf8'),
      readFile(new URL('../../src/content/sections/comparative-analysis.md', import.meta.url), 'utf8'),
      readFile(new URL('../../src/content/sections/definitions-typology.md', import.meta.url), 'utf8'),
    ]);
    for (const source of sources) {
      for (const sentence of source.split(/(?<=\.)\s+/).map((part) => part.trim()).filter((part) => part.length > 60)) {
        expect(graphText, `the graph repeats manuscript prose: ${sentence.slice(0, 60)}`).not.toContain(sentence);
      }
    }
  });

  it('holds every caveat at the level that must show it, or says where it is rendered', () => {
    for (const unit of units) {
      expect(unit.caveats.length > 0 || typeof unit.note === 'string', `${unit.id} hides its caveats`).toBe(true);
    }
    const myLai = hierarchy.unit('my-lai');
    expect(myLai.caveats.join(' ')).toMatch(/source-trace/i);
    expect(hierarchy.unit('my-lai-scholarly-depth').caveats.join(' ')).toMatch(/choice/i);
    expect(hierarchy.unit('comparison').caveats.join(' ')).toMatch(/never ranked|not a ranking/i);
  });

  it('keeps optional depth out of the guided sequence', () => {
    const ids = hierarchy.sequence.map((unit) => unit.id);
    expect(ids).toEqual([
      'ares',
      'framework',
      'framework-scope-purpose',
      'framework-definitions-typology',
      'my-lai',
      'my-lai-orientation',
      'my-lai-narrative',
      'my-lai-key-evidence',
      'my-lai-finding',
      'comparison',
      'comparison-tempo',
    ]);
    for (const depth of ['my-lai-scholarly-depth', 'comparison-scholarly-depth']) {
      expect(ids).not.toContain(depth);
      const description = hierarchy.describe(depth);
      expect(description.next).toBeNull();
      expect(description.parent?.id).toBe(hierarchy.unit(depth).parentId);
      // A depth screen is a branch, not a dead end: it offers the way back to the
      // guided path without pretending to be the next required unit.
      expect(description.continuation ?? description.handoff).toBeTruthy();
    }
  });

  it('moves the reader from the last essential case unit to the next topic, not into depth', () => {
    const finding = hierarchy.describe('my-lai-finding');
    expect(finding.next?.id).toBe('comparison');
    expect(finding.previous?.id).toBe('my-lai-key-evidence');
    // Case depth rejoins the path after everything guided under My Lai, never by
    // sending the reader back through siblings they have already read.
    expect(hierarchy.describe('my-lai-scholarly-depth').continuation?.id).toBe('comparison');
  });

  it('hands the reader on when the representative slice runs out', () => {
    // #51 maps three branches. The last unit of the last branch must not be a
    // screen with no next step, so the root names where the publication resumes.
    const last = hierarchy.describe(hierarchy.sequence.at(-1)!.id);
    expect(last.next).toBeNull();
    expect(last.handoff?.route).toBe('/process');
    expect(hierarchy.describe('comparison-scholarly-depth').handoff?.route).toBe('/process');
    // Units in the middle of the slice never advertise a handoff.
    expect(hierarchy.describe('my-lai-finding').handoff).toBeNull();
  });

  it('describes each unit with a trail, a sibling position and one question', () => {
    const evidence = hierarchy.describe('my-lai-key-evidence');
    expect(evidence.trail.map((unit) => unit.id)).toEqual(['ares', 'my-lai']);
    expect(evidence.position).toEqual({ index: 3, total: 5 });
    expect(evidence.unit.question.trim().endsWith('?')).toBe(true);
    for (const unit of units) expect(unit.question.trim().endsWith('?'), `${unit.id} has no question`).toBe(true);
  });

  it('resolves every canonical selector against the published content', () => {
    const myLai = cases.find((record) => record.id === 'my-lai-massacre');
    const evidenceSource = hierarchy.unit('my-lai-key-evidence').sources
      .find((source) => source.kind === 'case-chronology');
    expect(evidenceSource?.kind).toBe('case-chronology');
    if (evidenceSource?.kind !== 'case-chronology') throw new Error('unreachable');
    // The essential selection is a subset of the same array the depth screen shows
    // in full, which is what makes "subset of" a fact rather than a claim.
    const full = hierarchy.unit('my-lai-scholarly-depth').sources.find((source) => source.kind === 'case-chronology');
    if (full?.kind !== 'case-chronology') throw new Error('unreachable');
    expect(evidenceSource.indexes.every((index) => full.indexes.includes(index))).toBe(true);
    expect(evidenceSource.indexes).toEqual(prototype.case.essentialChronologyIndexes);
    expect(full.indexes).toHaveLength(myLai?.chronology.length ?? 0);
  });
});
