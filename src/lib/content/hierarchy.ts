import comparisonSource from '../../content/data/hierarchy/comparison.json';
import frameworkSource from '../../content/data/hierarchy/framework.json';
import myLaiSource from '../../content/data/hierarchy/my-lai-massacre.json';
import rootSource from '../../content/data/hierarchy/root.json';
import { publicationSectionFiles } from './loaders';
import { HierarchyFileSchema, type CanonicalSource, type HierarchyUnit } from './hierarchy-schema';
import type { CaseRecord, MobileReadingPrototype } from './schemas';

/**
 * The Ares 2.3 screen graph (#51).
 *
 * Domain-local files rather than one manifest: a framework author and a case
 * author edit different files, which is the whole reason the repository does not
 * have a god JSON. This module is the only place that stitches them together, and
 * it fails the build rather than rendering a hierarchy that points at nothing.
 */
const ROOT_ID = 'ares';

/** Roles that never appear in the guided march. Depth is reached by choice, not by Next. */
const OFF_SEQUENCE_ROLES = new Set(['depth', 'utility', 'full-scholarship']);

const files = [rootSource, frameworkSource, myLaiSource, comparisonSource];

export interface UnitDescription {
  unit: HierarchyUnit;
  /** Root first, immediate parent last. Empty for the root itself. */
  trail: HierarchyUnit[];
  parent: HierarchyUnit | null;
  children: HierarchyUnit[];
  /** Position among the parent's authored children, 1-based. */
  position: { index: number; total: number } | null;
  /** Adjacent units in the guided sequence; depth units are never in it. */
  previous: HierarchyUnit | null;
  next: HierarchyUnit | null;
  /** For an off-sequence unit, the guided unit that follows its parent's subtree. */
  continuation: HierarchyUnit | null;
  /** Where the reading path continues once this graph's slice ends. */
  handoff: { label: string; route: string } | null;
}

export interface Hierarchy {
  root: HierarchyUnit;
  byId: ReadonlyMap<string, HierarchyUnit>;
  /** Screen-level units in the order a guided reader meets them. */
  sequence: readonly HierarchyUnit[];
  describe(id: string): UnitDescription;
  unit(id: string): HierarchyUnit;
}

function resolveSource(
  unit: HierarchyUnit,
  source: CanonicalSource,
  cases: readonly CaseRecord[],
  prototype: MobileReadingPrototype,
): void {
  const fail = (reason: string) => {
    throw new Error(`Hierarchy unit ${unit.id}: ${reason}`);
  };
  const caseRecord = (caseId: string) => {
    const record = cases.find((candidate) => candidate.id === caseId);
    if (!record) fail(`canonical source names unknown case ${caseId}.`);
    return record as CaseRecord;
  };

  switch (source.kind) {
    case 'publication-section':
      if (!publicationSectionFiles.has(source.file)) fail(`canonical source names missing section ${source.file}.md.`);
      return;
    case 'case-record':
      caseRecord(source.caseId);
      return;
    case 'case-sections': {
      const record = caseRecord(source.caseId);
      const declared = new Set(record.sections.map((section) => section.key));
      for (const key of source.sectionKeys) if (!declared.has(key)) fail(`case ${source.caseId} does not declare section ${key}.`);
      return;
    }
    case 'case-chronology': {
      const record = caseRecord(source.caseId);
      for (const index of source.indexes) if (!record.chronology[index]) fail(`chronology index ${index} is outside case ${source.caseId}.`);
      return;
    }
    case 'case-evidence': {
      const record = caseRecord(source.caseId);
      for (const index of source.indexes) if (!record.evidence[index]) fail(`evidence index ${index} is outside case ${source.caseId}.`);
      return;
    }
    case 'case-registry':
      for (const caseId of source.caseIds) caseRecord(caseId);
      return;
    case 'reading-contract': {
      let cursor: unknown = prototype;
      for (const key of source.pointer.split('.')) {
        if (typeof cursor !== 'object' || cursor === null || !(key in cursor)) fail(`reading-contract pointer ${source.pointer} does not resolve.`);
        cursor = (cursor as Record<string, unknown>)[key];
      }
      if (cursor === undefined) fail(`reading-contract pointer ${source.pointer} resolves to nothing.`);
      return;
    }
  }
}

function buildHierarchy(cases: readonly CaseRecord[], prototype: MobileReadingPrototype): Hierarchy {
  const byId = new Map<string, HierarchyUnit>();
  for (const file of files) {
    const parsed = HierarchyFileSchema.parse(file);
    for (const unit of parsed.units) {
      if (byId.has(unit.id)) throw new Error(`Hierarchy unit ${unit.id} is declared twice; unit IDs are durable and must be unique across domain files.`);
      byId.set(unit.id, unit);
    }
  }

  const root = byId.get(ROOT_ID);
  if (!root) throw new Error(`Hierarchy is missing its ${ROOT_ID} root.`);
  const roots = [...byId.values()].filter((unit) => unit.parentId === null);
  if (roots.length !== 1 || roots[0]?.id !== ROOT_ID) throw new Error(`Hierarchy must have exactly one root and it must be ${ROOT_ID}.`);

  const screenRoutes = new Map<string, string>();
  for (const unit of byId.values()) {
    if (unit.sources.length === 0) throw new Error(`Hierarchy unit ${unit.id} names no canonical source. Every unit must have a source identity.`);
    for (const source of unit.sources) resolveSource(unit, source, cases, prototype);

    if (unit.caveats.length === 0 && unit.note === undefined) {
      throw new Error(`Hierarchy unit ${unit.id} declares no visible caveats and no note explaining where its caveats live.`);
    }

    if (unit.parentId !== null && !byId.has(unit.parentId)) throw new Error(`Hierarchy unit ${unit.id} points at unknown parent ${unit.parentId}.`);
    for (const childId of unit.childIds) {
      const child = byId.get(childId);
      if (!child) throw new Error(`Hierarchy unit ${unit.id} lists unknown child ${childId}.`);
      if (child.parentId !== unit.id) throw new Error(`Hierarchy child ${childId} does not name ${unit.id} as its parent.`);
    }
    if (unit.parentId !== null) {
      const parent = byId.get(unit.parentId) as HierarchyUnit;
      if (!parent.childIds.includes(unit.id)) throw new Error(`Hierarchy unit ${unit.id} claims parent ${parent.id}, which does not list it as a child.`);
    }

    if (unit.screen) {
      // A screen-level unit owns a durable path. A fragment is not an address a
      // reader can be returned to after an interruption.
      if (unit.route.includes('#')) throw new Error(`Hierarchy screen ${unit.id} must own a fragment-free route; found ${unit.route}.`);
      const claimed = screenRoutes.get(unit.route);
      if (claimed) throw new Error(`Hierarchy screens ${claimed} and ${unit.id} both claim route ${unit.route}.`);
      screenRoutes.set(unit.route, unit.id);
    } else {
      const parent = unit.parentId ? byId.get(unit.parentId) : undefined;
      if (!parent) throw new Error(`Hierarchy unit ${unit.id} is not a screen and has no parent surface to live on.`);
      if (!unit.route.startsWith(`${parent.route}#`)) {
        throw new Error(`Hierarchy unit ${unit.id} is rendered on ${parent.id} but its route ${unit.route} is not an anchor into ${parent.route}.`);
      }
    }
  }

  const order: HierarchyUnit[] = [];
  const seen = new Set<string>();
  const walk = (unit: HierarchyUnit) => {
    if (seen.has(unit.id)) throw new Error(`Hierarchy contains a cycle at ${unit.id}.`);
    seen.add(unit.id);
    order.push(unit);
    for (const childId of unit.childIds) walk(byId.get(childId) as HierarchyUnit);
  };
  walk(root);
  if (seen.size !== byId.size) {
    const orphans = [...byId.keys()].filter((id) => !seen.has(id));
    throw new Error(`Hierarchy units are unreachable from the root: ${orphans.join(', ')}.`);
  }

  const sequence = order.filter((unit) => unit.screen && !OFF_SEQUENCE_ROLES.has(unit.role));

  const isDescendantOf = (candidate: HierarchyUnit, ancestorId: string): boolean => {
    let cursor: HierarchyUnit | undefined = candidate;
    while (cursor?.parentId) {
      if (cursor.parentId === ancestorId) return true;
      cursor = byId.get(cursor.parentId);
    }
    return false;
  };

  const unit = (id: string) => {
    const found = byId.get(id);
    if (!found) throw new Error(`Unknown hierarchy unit ${id}.`);
    return found;
  };

  const describe = (id: string): UnitDescription => {
    const target = unit(id);
    const trail: HierarchyUnit[] = [];
    let cursor = target.parentId ? unit(target.parentId) : null;
    const parent = cursor;
    while (cursor) {
      trail.unshift(cursor);
      cursor = cursor.parentId ? unit(cursor.parentId) : null;
    }
    const position = parent
      ? { index: parent.childIds.indexOf(target.id) + 1, total: parent.childIds.length }
      : null;
    const at = sequence.findIndex((candidate) => candidate.id === target.id);
    const previous = at > 0 ? sequence[at - 1] ?? null : null;
    const next = at >= 0 ? sequence[at + 1] ?? null : null;
    let continuation: HierarchyUnit | null = null;
    if (at < 0 && parent) {
      // An off-sequence screen rejoins the path after everything guided under its
      // parent, not before it: depth is a branch off the topic, not a detour that
      // sends the reader back through siblings they have already read.
      const parentAt = sequence.findIndex((candidate) => candidate.id === parent.id);
      if (parentAt >= 0) {
        let cursor = parentAt + 1;
        while (sequence[cursor] && isDescendantOf(sequence[cursor] as HierarchyUnit, parent.id)) cursor += 1;
        continuation = sequence[cursor] ?? null;
      }
    }
    const handoff = !next && !continuation && target.id !== root.id ? root.handoff ?? null : null;
    return { unit: target, trail, parent, children: target.childIds.map(unit), position, previous, next, continuation, handoff };
  };

  return { root, byId, sequence, describe, unit };
}

let cached: Hierarchy | null = null;

/**
 * Build (once) and validate the screen graph against the canonical content it
 * claims to describe. Callers pass the already-validated case records and the
 * #45 reading contract so the graph cannot drift from either.
 */
export function loadHierarchy(cases: readonly CaseRecord[], prototype: MobileReadingPrototype): Hierarchy {
  cached ??= buildHierarchy(cases, prototype);
  return cached;
}
