import { z } from 'zod';

const SourceStatusSchema = z.enum(['requires-source-trace', 'source-reviewed', 'approved']);

export const CaseSectionKindSchema = z.enum(['narrative', 'analysis', 'chronology', 'evidence']);
export const CaseSectionSchema = z.object({
  key: z.string().regex(/^[A-Z]$/), kind: CaseSectionKindSchema, authorship: z.string().min(1),
  /** Why this case departs from the shared section order. Rendered as marginalia. */
  note: z.string().min(1).optional(),
});
export const EvidenceKindSchema = z.enum(['testimony', 'historical-quotation', 'historical-slogan', 'legal-institutional-quotation']);
export const EvidenceRecordSchema = z.object({
  kind: EvidenceKindSchema, speaker: z.string().min(1), context: z.string().min(1), quotationStatus: z.string().min(1), sourceStatus: SourceStatusSchema,
});
export const ChronologyPrecisionSchema = z.enum(['day', 'month', 'season', 'year', 'multi-year', 'decade']);
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const ChronologyEntrySchema = z.object({
  dateLabel: z.string().min(1),
  /**
   * Positioning metadata for Figure 02, never displayed. `dateLabel` remains the
   * displayed truth; `startDate`/`endDate` are the earliest and latest plausible
   * dates for the interval that label denotes, and `precision` names how coarse
   * that interval is. A label like "Spring-Summer 1915" is not missing data — it
   * is an interval of known imprecision, and encoding it as a day would be a
   * fabrication (#33).
   */
  precision: ChronologyPrecisionSchema,
  startDate: IsoDate,
  endDate: IsoDate,
  /**
   * Whether the entry records the violence itself, what led to it, or what came
   * after. Recorded rather than derived: for Bosnia the duration deliberately
   * measures the war while the sort key points at Srebrenica, so deriving a
   * boundary from those two fields would invent one (#34).
   */
  phase: z.enum(['lead-up', 'event', 'aftermath']),
  text: z.string().min(1),
  sourceStatus: SourceStatusSchema,
}).refine((entry) => entry.startDate <= entry.endDate, { message: 'Chronology bounds must not run backwards.' });
export const CaseRecordSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), file: z.string().regex(/^[a-z0-9-]+$/), navTitle: z.string().min(1), displayPeriod: z.string().min(1), sortKey: z.string().min(1),
  /**
   * Machine duration for Figure 03, which compares tempo — never severity and
   * never death toll. `note` records the judgement that produced the figure; the
   * Bosnia, Holodomor and Cambodia measurements are each defensible and each had
   * to be chosen, so the silence is what would not be defensible (#33).
   */
  duration: z.object({
    days: z.number().int().positive(), approximate: z.boolean(), note: z.string().min(1).optional(), sourceStatus: SourceStatusSchema,
  }),
  classification: z.object({ display: z.string().min(1), sourceStatus: SourceStatusSchema }),
  location: z.object({ display: z.string().min(1) }), openingContext: z.string().min(1),
  argumentRole: z.object({ authorship: z.string().min(1), text: z.string().min(1) }),
  sections: z.array(CaseSectionSchema).min(1),
  deathEstimate: z.object({ display: z.string().min(1), provenanceClass: z.string().min(1), sourceStatus: SourceStatusSchema, uncertainty: z.string().min(1) }),
  primaryMethod: z.object({ display: z.string().min(1), sourceStatus: SourceStatusSchema }),
  evidence: z.array(EvidenceRecordSchema).min(1),
  chronology: z.array(ChronologyEntrySchema).min(1),
});
export const CaseStudiesFileSchema = z.object({ schemaVersion: z.string(), editorialStatus: z.string(), editorialNote: z.string(), cases: z.array(CaseRecordSchema).length(8) });
export const GlossaryEntrySchema = z.object({ term: z.string().min(1), definition: z.string().min(1), extendedDefinition: z.string().min(1), category: z.string().min(1), relatedTerms: z.array(z.string()), sourceNote: z.string().optional() });
export const GlossaryFileSchema = z.object({ glossary: z.record(z.string(), GlossaryEntrySchema) });
const SourceMappingSchema = z.object({ sourceId: z.string().min(1), locator: z.string().min(1), note: z.string().optional() });
export const ProcessDomainSchema = z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: z.string().min(1), summary: z.string().min(1), detail: z.string().min(1), glossaryTermIds: z.array(z.string()), sourceMappings: z.array(SourceMappingSchema).min(1) });
export const ProcessFileSchema = z.object({
  id: z.string().min(1), title: z.string().min(1), subtitle: z.string().min(1), editorialStatus: z.literal('source-reviewed'), authorshipLabel: z.string().min(1), basisSourceIds: z.array(z.string()).min(1),
  rendering: z.object({ structure: z.string(), sequential: z.literal(false), defaultExpandedDomainId: z.string() }),
  framing: z.object({ summary: z.string(), nonDeterminism: z.string(), scopeNote: z.string() }),
  sourceMap: z.record(z.string(), z.object({ shortLabel: z.string(), fullTitle: z.string(), container: z.string(), doi: z.string(), referenceTarget: z.string() })),
  domains: z.array(ProcessDomainSchema).length(4),
  relationships: z.array(z.object({ id: z.string(), from: z.string(), to: z.string(), type: z.string(), label: z.string(), sourceMappings: z.array(SourceMappingSchema).min(1) })).min(1),
  limits: z.array(z.string()).min(1),
});
export const ReferenceSchema = z.object({ id: z.string().regex(/^src-[a-z0-9-]+$/), type: z.string(), title: z.string(), authors: z.array(z.string()).min(1), year: z.number().int(), container: z.string(), volume: z.string().optional(), issue: z.string().optional(), pages: z.string().optional(), doi: z.string().optional() });
export const ReferencesFileSchema = z.object({ references: z.array(ReferenceSchema).min(1) });
export type CaseRecord = z.infer<typeof CaseRecordSchema>;
export type CaseSection = z.infer<typeof CaseSectionSchema>;
export type EvidenceKind = z.infer<typeof EvidenceKindSchema>;
export type Glossary = z.infer<typeof GlossaryFileSchema>['glossary'];
export type ProcessModel = z.infer<typeof ProcessFileSchema>;
export type ReferenceRecord = z.infer<typeof ReferenceSchema>;
