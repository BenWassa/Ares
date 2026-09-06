import type { CaseRecord } from './schemas';

/**
 * Human-readable duration labels for the eight canonical cases.
 *
 * These are presentation labels over the existing duration record, not new
 * measurements. The underlying `days`, `approximate`, `note` and source status
 * remain authoritative and travel with every rendered label (#63/#70).
 * There is deliberately no numeric fallback: a new canonical duration must make
 * an editorial choice here rather than silently reintroducing mixed display units.
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

function chronologyTime(sortKey: string): number {
  const value = Date.parse(`${sortKey}T00:00:00Z`);
  if (!Number.isFinite(value)) throw new Error(`Invalid case chronology sortKey: ${sortKey}`);
  return value;
}

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

/**
 * Linear elapsed-calendar position for the #70 Home chronology rails.
 *
 * The earliest supplied canonical sortKey is 0 and the latest is 1. Nothing
 * else — duration, deaths, classification, geography or importance — enters
 * the calculation. Callers must render the result without collision shifting.
 */
export function caseChronologyPosition(record: CaseRecord, records: readonly CaseRecord[]): number {
  if (records.length < 2) throw new Error('Chronology position requires at least two cases.');
  const times = records.map((item) => chronologyTime(item.sortKey));
  const start = Math.min(...times);
  const end = Math.max(...times);
  const current = chronologyTime(record.sortKey);
  if (end <= start) throw new Error('Chronology range must have distinct endpoints.');
  if (current < start || current > end) throw new Error(`Case ${record.id} falls outside the chronology range.`);
  return (current - start) / (end - start);
}
