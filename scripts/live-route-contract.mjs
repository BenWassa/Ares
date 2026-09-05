/**
 * The published route/marker contract, shared by the built-site check and the
 * live Pages check.
 *
 * It used to live only in `verify-live.mjs`, which runs after deployment with a
 * live origin and is therefore invisible to `pnpm check`. #51 moved reading units
 * onto their own routes, the markers went stale, and the drift was not caught
 * until the merged-main deploy. One table, checked against `dist/` before the
 * deploy and against the live origin after it, cannot drift that way again.
 *
 * Markers are durable things — unit IDs, orientation chrome, compatibility
 * anchors — not incidental class names.
 *
 * #63 gives Home its own human-first editorial sequence. The complete publication
 * directory remains present in the collapsed apparatus, but the root contract is
 * pinned to the sequence itself rather than to the superseded directory-first
 * composition from #58.
 */
export const routeChecks = [
  ['', [
    'id="front-matter"', 'Project Ares',
    'Military massacre and genocide, examined case by case.',
    'id="proposition"', 'id="historical-field"', 'id="comparison-question"',
    'id="publication-apparatus"', 'href="/Ares/framework"', 'href="/Ares/cases"',
    'href="/Ares/comparison"', 'href="/Ares/glossary"', 'href="/Ares/references"',
    'legacy-anchor-aliases',
  ]],
  ['framework', ['id="part-i"', 'id="scope-purpose"', 'id="definitions-typology"', 'id="theoretical-lenses"', 'unit-children', 'screen-trail']],
  ['framework/definitions-typology', ['id="what-matters"', 'id="critical-caveats"', 'id="scholarly-framing"', 'screen-trail', 'screen-nav__parent']],
  ['framework/theoretical-lenses', ['Theoretical lenses', 'screen-trail', 'screen-nav__parent']],
  ['cases', ['id="part-ii"', 'class="case-index"']],
  ['cases/armenian-genocide', ['id="armenian-genocide"', 'chronology--spine', 'figure-02-armenian-genocide']],
  ['cases/my-lai-massacre', [
    'id="my-lai-massacre"', 'screen-trail', 'requires source trace',
    'id="orientation"', 'id="narrative"', 'narrative-section',
    'id="key-evidence"', 'essential-chronology', 'Trace status',
    'id="finding"', 'integrity-note',
    'id="scholarly-depth"', 'chronology--spine', 'figure-02-my-lai-massacre',
  ]],
  ['comparison', [
    'id="part-iii"', 'screen-trail',
    'id="tempo"', 'dimension-list',
    'id="scholarly-depth"', 'id="full-matrix"', 'comparison-table', 'id="figure-03"', 'id="full-analysis"',
  ]],
  ['process', ['id="part-iv"', 'data-process-domain=', 'id="figure-01"']],
  ['implications', ['id="part-v"']],
  ['reflection', ['id="part-vi"']],
  ['glossary', ['id="glossary"']],
  ['references', ['id="references"', 'ref-src-dutton-2005', 'id="figure-04"']],
];
