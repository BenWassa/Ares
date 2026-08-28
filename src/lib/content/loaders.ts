import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { CaseStudiesFileSchema, GlossaryFileSchema, ProcessFileSchema, ReferencesFileSchema } from './schemas';
import { renderMarkdown } from './markdown';

const contentRoot = new URL('../../content/', import.meta.url);
async function readJson(relativePath: string): Promise<unknown> { return JSON.parse(await readFile(fileURLToPath(new URL(relativePath, contentRoot)), 'utf8')) as unknown; }

export async function loadStructuredContent() {
  const [cases, glossary, process, references] = await Promise.all([
    readJson('data/cases.json').then((value) => CaseStudiesFileSchema.parse(value)),
    readJson('data/glossary.json').then((value) => GlossaryFileSchema.parse(value)),
    readJson('data/process.json').then((value) => ProcessFileSchema.parse(value)),
    readJson('data/references.json').then((value) => ReferencesFileSchema.parse(value)),
  ]);
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

export async function loadSectionHtml(file: string, glossary: Awaited<ReturnType<typeof loadStructuredContent>>['glossary'], options: { stripFirstHeading?: boolean } = {}): Promise<string> {
  const raw = await readFile(fileURLToPath(new URL(`sections/${file}.md`, contentRoot)), 'utf8');
  const lines = raw.split('\n');
  if (options.stripFirstHeading) {
    const headingIndex = lines.findIndex((line) => /^##\s+/.test(line.trim()));
    if (headingIndex >= 0) lines.splice(headingIndex, 1);
  }
  return renderMarkdown(lines.join('\n'), glossary);
}
