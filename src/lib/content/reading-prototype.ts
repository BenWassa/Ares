import prototypeSource from '../../content/data/mobile-reading-prototype.json';
import { MobileReadingPrototypeSchema, type CaseRecord } from './schemas';

/**
 * Validate the small Ares 2.3 vertical-slice contract and then validate its
 * references into the existing canonical case model. The prototype may select
 * from chronology/evidence/section records; it may not copy them into a second
 * manuscript just to create a guided view (#45).
 */
export function loadMobileReadingPrototype(cases: readonly CaseRecord[]) {
  const prototype = MobileReadingPrototypeSchema.parse(prototypeSource);
  const caseIds = new Set(cases.map((record) => record.id));
  const record = cases.find((candidate) => candidate.id === prototype.case.caseId);
  if (!record) throw new Error(`Ares 2.3 prototype case ${prototype.case.caseId} is not present in cases.json.`);

  const declaredSections = new Set(record.sections.map((section) => section.key));
  for (const key of [...prototype.case.essentialSectionKeys, ...prototype.case.depthSectionKeys]) {
    if (!declaredSections.has(key)) throw new Error(`Ares 2.3 prototype case references undeclared section ${key}.`);
  }
  for (const index of prototype.case.essentialChronologyIndexes) {
    if (!record.chronology[index]) throw new Error(`Ares 2.3 prototype chronology index ${index} is outside ${record.id}.`);
  }
  if (!record.evidence[prototype.case.focalEvidenceIndex]) throw new Error('Ares 2.3 prototype focal evidence index is outside the case record.');
  for (const caseId of prototype.comparison.dimension.caseIds) {
    if (!caseIds.has(caseId)) throw new Error(`Ares 2.3 comparison references unknown case ${caseId}.`);
  }
  return prototype;
}
