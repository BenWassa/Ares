import type { CaseRecord } from './schemas';

/**
 * Human-readable duration labels for the eight canonical cases.
 *
 * These are presentation labels over the existing duration record, not new
 * measurements. The underlying `days`, `approximate`, `note` and source status
 * remain authoritative and travel with every rendered label (#63).
 */
const spanByDays = new Map<number, string>([
  [1, 'one day'],
  [42, 'six weeks'],
  [100, 'a hundred days'],
  [396, 'about thirteen months'],
  [1065, 'about three years'],
  [1362, 'about four years'],
  [1370, 'about four years'],
]);

export function caseYear(record: CaseRecord): string {
  return record.sortKey.slice(0, 4);
}

export function caseDecade(record: CaseRecord): string {
  return `${caseYear(record).slice(0, 3)}0s`;
}

export function caseSpanInWords(record: CaseRecord): string {
  const label = spanByDays.get(record.duration.days);
  if (!label) throw new Error(`No human span label for ${record.id} (${record.duration.days} days).`);
  return label;
}
