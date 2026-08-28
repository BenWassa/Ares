import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { CaseRecord, Glossary } from './schemas';
import { renderMarkdown } from './markdown';

const caseDirectory = new URL('../../content/cases/', import.meta.url);
const expectedSections = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

type CaseSectionKey = (typeof expectedSections)[number];

export interface CaseDocument {
  id: string;
  title: string;
  sections: Record<CaseSectionKey, { title: string; html: string }>;
}

function parseCaseMarkdown(source: string, glossary: Glossary): CaseDocument {
  const titleMatch = source.match(/^#\s+(.+)$/m);
  if (!titleMatch?.[1]) throw new Error('Case Markdown is missing an H1 title.');

  const headingPattern = /^##\s+([A-F])\.\s+(.+)$/gm;
  const matches = [...source.matchAll(headingPattern)];
  const keys = matches.map((match) => match[1]);
  if (keys.join(',') !== expectedSections.join(',')) {
    throw new Error(`Case grammar must contain A–F in order; found ${keys.join(', ') || 'none'}.`);
  }

  const sections = {} as CaseDocument['sections'];
  matches.forEach((match, index) => {
    const key = match[1] as CaseSectionKey;
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? source.length;
    const raw = source.slice(start, end).trim();
    const withoutChronologyPlaceholder = raw.replace(/<!--\s*Structured chronology[\s\S]*?-->/g, '').trim();
    sections[key] = {
      title: match[2] ?? key,
      html: renderMarkdown(withoutChronologyPlaceholder, glossary),
    };
  });

  return { id: titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), title: titleMatch[1], sections };
}

export async function loadCaseDocument(record: CaseRecord, glossary: Glossary): Promise<CaseDocument> {
  const path = new URL(`${record.file}.md`, caseDirectory);
  const source = await readFile(fileURLToPath(path), 'utf8');
  return parseCaseMarkdown(source, glossary);
}
