import { z } from 'zod';

/**
 * Ares 2.3 screen hierarchy contract (#51).
 *
 * This file describes *where a reader is*, never *what Ares says*. Every unit
 * points at canonical authorities — `src/content/sections/*.md`, `cases.json`,
 * the case Markdown and the #45 reading contract — rather than carrying a second
 * copy of the manuscript. The one exception is navigational text (`label`,
 * `title`, `question`, `cognitiveJob`) and `caveats`, which are the authored
 * qualifications that must stay visible at that level of the tree.
 */

const Slug = z.string().regex(/^[a-z0-9-]+$/);
const SectionKey = z.string().regex(/^[A-Z]$/);
const Indexes = z.array(z.number().int().nonnegative()).min(1);

/**
 * A unit's editorial job, not its visual treatment.
 *
 * - `overview` — a parent surface that explains a topic and exposes its children.
 * - `essential` — first-pass reading required to understand the claim.
 * - `depth` — optional scholarly material, deliberately outside the guided march.
 * - `utility` — a research tool (glossary, references) reached on demand.
 * - `full-scholarship` — the complete canonical manuscript for a branch.
 */
export const UnitRoleSchema = z.enum(['overview', 'essential', 'depth', 'utility', 'full-scholarship']);

/**
 * Where a unit's content actually lives. A unit that cannot name a canonical
 * authority is either navigation chrome (the root) or an invented subset, and
 * `loadHierarchy` rejects the second case.
 */
export const CanonicalSourceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('publication-section'), file: Slug, note: z.string().min(1).optional() }),
  z.object({ kind: z.literal('case-record'), caseId: Slug, note: z.string().min(1).optional() }),
  z.object({ kind: z.literal('case-sections'), caseId: Slug, sectionKeys: z.array(SectionKey).min(1), note: z.string().min(1).optional() }),
  z.object({ kind: z.literal('case-chronology'), caseId: Slug, indexes: Indexes, note: z.string().min(1).optional() }),
  z.object({ kind: z.literal('case-evidence'), caseId: Slug, indexes: Indexes, note: z.string().min(1).optional() }),
  z.object({ kind: z.literal('case-registry'), caseIds: z.array(Slug).min(2), note: z.string().min(1).optional() }),
  z.object({ kind: z.literal('reading-contract'), pointer: z.string().regex(/^[a-zA-Z]+(?:\.[a-zA-Z]+)*$/), note: z.string().min(1).optional() }),
]);

export const HierarchyUnitSchema = z.object({
  /** Durable identity. Resume state and deep links are written against this. */
  id: Slug,
  /** Short human label used in trails, child lists and previous/next links. */
  label: z.string().min(1),
  /** The heading the screen itself carries. */
  title: z.string().min(1),
  parentId: Slug.nullable(),
  /** Ordered immediate children. Sibling order is authored here, never derived. */
  childIds: z.array(Slug),
  /**
   * Screen units own a durable path with no fragment. Units that still live on a
   * parent surface carry `parentRoute#anchor` and set `screen: false`, which is
   * how a deferred split stays documented instead of silently disappearing.
   */
  route: z.string().regex(/^\/[^\s]*$/),
  screen: z.boolean(),
  role: UnitRoleSchema,
  /** The one question this unit answers. If it needs two, it is two units. */
  question: z.string().min(1),
  /** Why this is one coherent cognitive job rather than several. */
  cognitiveJob: z.string().min(1),
  sources: z.array(CanonicalSourceSchema),
  /** Qualifications whose absence would change meaning or confidence here. */
  caveats: z.array(z.string().min(1)),
  /** Records an ambiguous subset relationship or a deliberately deferred split. */
  note: z.string().min(1).optional(),
  /**
   * Where the reading path continues once this graph runs out. #51 maps a
   * representative slice, so the last unit has to hand the reader to the rest of
   * the publication rather than end on a screen with no next step.
   */
  handoff: z.object({ label: z.string().min(1), route: z.string().regex(/^\/[^\s]*$/) }).optional(),
});

export const HierarchyFileSchema = z.object({
  schemaVersion: z.literal('2.3-hierarchy-1'),
  /** The domain-local file this unit set belongs to; used only in error messages. */
  domain: z.string().min(1),
  units: z.array(HierarchyUnitSchema).min(1),
});

export type UnitRole = z.infer<typeof UnitRoleSchema>;
export type CanonicalSource = z.infer<typeof CanonicalSourceSchema>;
export type HierarchyUnit = z.infer<typeof HierarchyUnitSchema>;
export type HierarchyFile = z.infer<typeof HierarchyFileSchema>;
