import { z } from 'zod';

const SourceStatusSchema = z.enum(['requires-source-trace', 'source-reviewed', 'approved']);

export const ChronologyEntrySchema = z.object({
  dateLabel: z.string().min(1), dateTime: z.string().optional(), text: z.string().min(1), sourceStatus: SourceStatusSchema,
});
export const CaseRecordSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), file: z.string().regex(/^[a-z0-9-]+$/), navTitle: z.string().min(1), displayPeriod: z.string().min(1), sortKey: z.string().min(1),
  classification: z.object({ display: z.string().min(1), sourceStatus: SourceStatusSchema }),
  location: z.object({ display: z.string().min(1) }), openingContext: z.string().min(1),
  argumentRole: z.object({ authorship: z.string().min(1), text: z.string().min(1) }),
  deathEstimate: z.object({ display: z.string().min(1), provenanceClass: z.string().min(1), sourceStatus: SourceStatusSchema, uncertainty: z.string().min(1) }),
  primaryMethod: z.object({ display: z.string().min(1), sourceStatus: SourceStatusSchema }),
  evidence: z.object({ kind: z.string().min(1), speaker: z.string().min(1), context: z.string().min(1), quotationStatus: z.string().min(1), sourceStatus: SourceStatusSchema }),
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
export type Glossary = z.infer<typeof GlossaryFileSchema>['glossary'];
export type ProcessModel = z.infer<typeof ProcessFileSchema>;
export type ReferenceRecord = z.infer<typeof ReferenceSchema>;
