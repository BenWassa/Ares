import type { EvidenceKind } from './schemas';

/**
 * Reader-facing labels derived from structured content, never from template position.
 * A provenance label applied by position is the same error as colour applied by
 * position; both are corrected in Ares 2.2 (#30, #31).
 */
const evidenceKindLabels: Record<EvidenceKind, string> = {
  testimony: 'Witness testimony',
  'historical-quotation': 'Historical quotation',
  'historical-slogan': 'Historical slogan',
  'legal-institutional-quotation': 'Legal or institutional statement',
};

export function evidenceKindLabel(kind: EvidenceKind): string {
  return evidenceKindLabels[kind];
}

const sourceStatusLabels: Record<string, string> = {
  'requires-source-trace': 'requires source trace',
  'source-reviewed': 'source reviewed',
  approved: 'approved',
};

export function sourceStatusLabel(status: string): string {
  return sourceStatusLabels[status] ?? status;
}

const quotationStatusLabels: Record<string, string> = {
  'legacy-unverified': 'legacy wording, not yet verified against a source',
  'secondary-quotation': 'quoted at second hand',
};

export function quotationStatusLabel(status: string): string {
  return quotationStatusLabels[status] ?? status;
}
