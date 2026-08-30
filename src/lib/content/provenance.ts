import type { CaseRecord } from './schemas';

export const sourceStatuses = ['requires-source-trace', 'source-reviewed', 'approved'] as const;
export type SourceStatus = (typeof sourceStatuses)[number];

export interface ProvenanceRow {
  id: string;
  label: string;
  counts: Record<SourceStatus, number>;
  total: number;
}

const empty = (): Record<SourceStatus, number> => ({ 'requires-source-trace': 0, 'source-reviewed': 0, approved: 0 });

/**
 * One place that counts source-status values across the case corpus, so the
 * provenance ledger and any future badge cannot disagree with each other (#34).
 *
 * Every record in the corpus is counted exactly once: a classification, a death
 * estimate, a primary method and an evidence record per case, plus every
 * chronology entry.
 */
export function summariseProvenance(cases: CaseRecord[]): { rows: ProvenanceRow[]; total: ProvenanceRow } {
  const rows: ProvenanceRow[] = [
    { id: 'classification', label: 'Classification', counts: empty(), total: 0 },
    { id: 'death-estimate', label: 'Death estimates', counts: empty(), total: 0 },
    { id: 'primary-method', label: 'Primary method', counts: empty(), total: 0 },
    { id: 'evidence', label: 'Quoted evidence', counts: empty(), total: 0 },
    { id: 'chronology', label: 'Chronology entries', counts: empty(), total: 0 },
  ];
  const index = new Map(rows.map((row) => [row.id, row]));
  const add = (id: string, status: SourceStatus) => {
    const row = index.get(id);
    if (!row) throw new Error(`Unknown provenance category ${id}.`);
    row.counts[status] += 1;
    row.total += 1;
  };

  for (const record of cases) {
    add('classification', record.classification.sourceStatus);
    add('death-estimate', record.deathEstimate.sourceStatus);
    add('primary-method', record.primaryMethod.sourceStatus);
    for (const evidence of record.evidence) add('evidence', evidence.sourceStatus);
    for (const entry of record.chronology) add('chronology', entry.sourceStatus);
  }

  const total: ProvenanceRow = { id: 'corpus', label: 'Whole case corpus', counts: empty(), total: 0 };
  for (const row of rows) {
    for (const status of sourceStatuses) total.counts[status] += row.counts[status];
    total.total += row.total;
  }
  return { rows, total };
}

/** The same summary for one case, for the compact variant in the case header. */
export function summariseCaseProvenance(record: CaseRecord): ProvenanceRow {
  const { total } = summariseProvenance([record]);
  return { ...total, id: record.id, label: record.navTitle };
}

export const sourceStatusDisplay: Record<SourceStatus, string> = {
  'requires-source-trace': 'requires source trace',
  'source-reviewed': 'source reviewed',
  approved: 'approved',
};
