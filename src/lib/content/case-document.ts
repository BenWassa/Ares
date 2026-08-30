import type { CaseRecord, Glossary } from './schemas';
import { renderMarkdown } from './markdown';

const caseSources = import.meta.glob<string>('../../content/cases/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface CaseSectionContent {
  title: string;
  html: string;
}

export interface CaseDocument {
  id: string;
  title: string;
  sections: Record<string, CaseSectionContent>;
}

/**
 * Case shape comes from `cases.json`, not from this parser. The Markdown supplies
 * the prose for each declared section key; the record supplies the order, the kind
 * and the authorship. That is what lets a three-month engineered famine and a
 * single morning carry different chapter shapes (#33).
 */
function parseCaseMarkdown(source: string, record: CaseRecord, glossary: Glossary, glossaryHrefPrefix = '#glossary-'): CaseDocument {
  const titleMatch = source.match(/^#\s+(.+)$/m);
  if (!titleMatch?.[1]) throw new Error('Case Markdown is missing an H1 title.');

  const matches = [...source.matchAll(/^##\s+([A-Z])\.\s+(.+)$/gm)];
  const declared = record.sections.map((section) => section.key);
  const present = matches.map((match) => match[1]);
  const missing = declared.filter((key) => !present.includes(key));
  const undeclared = present.filter((key) => key !== undefined && !declared.includes(key));
  if (missing.length || undeclared.length) {
    throw new Error(
      `Case ${record.id}: Markdown sections ${present.join(', ') || 'none'} do not match the declared sections ${declared.join(', ')}` +
      `${missing.length ? `; missing ${missing.join(', ')}` : ''}${undeclared.length ? `; undeclared ${undeclared.join(', ')}` : ''}.`,
    );
  }

  const sections: Record<string, CaseSectionContent> = {};
  matches.forEach((match, index) => {
    const key = match[1] as string;
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? source.length;
    const raw = source.slice(start, end).trim();
    const withoutChronologyPlaceholder = raw.replace(/<!--\s*Structured chronology[\s\S]*?-->/g, '').trim();
    sections[key] = {
      title: match[2] ?? key,
      html: renderMarkdown(withoutChronologyPlaceholder, glossary, glossaryHrefPrefix),
    };
  });

  return { id: titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), title: titleMatch[1], sections };
}

export async function loadCaseDocument(record: CaseRecord, glossary: Glossary, options: { glossaryHrefPrefix?: string } = {}): Promise<CaseDocument> {
  const source = caseSources[`../../content/cases/${record.file}.md`];
  if (source === undefined) throw new Error(`Case source ${record.file}.md is not present in the Vite content graph.`);
  return parseCaseMarkdown(source, record, glossary, options.glossaryHrefPrefix);
}
