import casesSource from '../../content/data/cases.json';
import glossarySource from '../../content/data/glossary.json';
import processSource from '../../content/data/process.json';
import referencesSource from '../../content/data/references.json';
import { CaseStudiesFileSchema, GlossaryFileSchema, ProcessFileSchema, ReferencesFileSchema } from './schemas';
import { renderMarkdown } from './markdown';

const sectionSources = import.meta.glob<string>('../../content/sections/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** The section Markdown files that actually exist, for contracts that reference them. */
export const publicationSectionFiles: ReadonlySet<string> = new Set(
  Object.keys(sectionSources).map((path) => path.replace('../../content/sections/', '').replace(/\.md$/, '')),
);

function requireSectionSource(file: string): string {
  const source = sectionSources[`../../content/sections/${file}.md`];
  if (source === undefined) throw new Error(`Unknown publication section: ${file}.`);
  return source;
}

export async function loadStructuredContent() {
  const cases = CaseStudiesFileSchema.parse(casesSource);
  const glossary = GlossaryFileSchema.parse(glossarySource);
  const process = ProcessFileSchema.parse(processSource);
  const references = ReferencesFileSchema.parse(referencesSource);

  const caseIds = new Set(cases.cases.map((entry) => entry.id));
  if (caseIds.size !== cases.cases.length) throw new Error('Duplicate case IDs are not allowed.');
  const sourceIds = new Set(references.references.map((entry) => entry.id));
  const glossaryIds = new Set(Object.keys(glossary.glossary));
  for (const sourceId of process.basisSourceIds) if (!sourceIds.has(sourceId)) throw new Error(`Process source ${sourceId} is not present in references.json.`);
  for (const [sourceId, source] of Object.entries(process.sourceMap)) {
    if (!sourceIds.has(sourceId)) throw new Error(`Process source map key ${sourceId} is not present in references.json.`);
    if (source.referenceTarget !== `ref-${sourceId}`) throw new Error(`Process source ${sourceId} has a non-canonical reference target.`);
  }
  for (const domain of process.domains) {
    for (const mapping of domain.sourceMappings) if (!sourceIds.has(mapping.sourceId)) throw new Error(`Unknown process source ${mapping.sourceId}.`);
    for (const termId of domain.glossaryTermIds) if (!glossaryIds.has(termId)) throw new Error(`Process domain ${domain.id} references unknown glossary term ${termId}.`);
  }
  const domainIds = new Set(process.domains.map((domain) => domain.id));
  if (!domainIds.has(process.rendering.defaultExpandedDomainId)) throw new Error('Default process domain is unknown.');
  for (const relationship of process.relationships) {
    if (!domainIds.has(relationship.from) || !domainIds.has(relationship.to)) throw new Error(`Process relationship ${relationship.id} points to an unknown domain.`);
    for (const mapping of relationship.sourceMappings) if (!sourceIds.has(mapping.sourceId)) throw new Error(`Unknown process relationship source ${mapping.sourceId}.`);
  }
  return { cases, glossary: glossary.glossary, process, references: references.references };
}

export async function loadSectionHtml(file: string, glossary: Awaited<ReturnType<typeof loadStructuredContent>>['glossary'], options: { stripFirstHeading?: boolean; glossaryHrefPrefix?: string } = {}): Promise<string> {
  const lines = requireSectionSource(file).split('\n');
  if (options.stripFirstHeading) {
    const headingIndex = lines.findIndex((line) => /^##\s+/.test(line.trim()));
    if (headingIndex >= 0) lines.splice(headingIndex, 1);
  }
  return renderMarkdown(lines.join('\n'), glossary, options.glossaryHrefPrefix);
}
