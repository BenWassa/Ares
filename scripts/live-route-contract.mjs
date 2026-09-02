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
 */
export const routeChecks = [
  ['', ['chapter-directory', 'goal-paths', 'legacy-anchor-aliases']],
  ['framework', ['id="part-i"', 'id="scope-purpose"', 'id="definitions-typology"', 'id="theoretical-lenses"', 'unit-children']],
  ['framework/definitions-typology', ['id="what-matters"', 'id="critical-caveats"', 'id="scholarly-framing"', 'screen-trail', 'screen-nav__parent']],
  ['cases', ['id="part-ii"', 'class="case-index"']],
  ['cases/armenian-genocide', ['id="armenian-genocide"', 'chronology--spine', 'figure-02-armenian-genocide']],
  ['cases/my-lai-massacre', ['id="my-lai-massacre"', 'unit-children', 'cases/my-lai-massacre/orientation', 'cases/my-lai-massacre/scholarly-depth', 'requires source trace']],
  ['cases/my-lai-massacre/orientation', ['id="orientation"', 'screen-trail', 'screen-nav__parent']],
  ['cases/my-lai-massacre/narrative', ['narrative-section', 'screen-trail', 'screen-nav__parent']],
  ['cases/my-lai-massacre/key-evidence', ['id="key-evidence"', 'essential-chronology', 'Trace status']],
  ['cases/my-lai-massacre/finding', ['id="analysis"', 'integrity-note', 'screen-nav__parent']],
  ['cases/my-lai-massacre/scholarly-depth', ['id="full-scholarly-depth"', 'chronology--spine', 'figure-02-my-lai-massacre']],
  ['comparison', ['id="part-iii"', 'id="tempo"', 'unit-children', 'comparison/tempo', 'comparison/scholarly-depth']],
  ['comparison/tempo', ['id="tempo"', 'dimension-list', 'screen-nav__parent']],
  ['comparison/scholarly-depth', ['id="full-matrix"', 'comparison-table', 'id="figure-03"', 'id="full-analysis"']],
  ['process', ['id="part-iv"', 'data-process-domain=', 'id="figure-01"']],
  ['implications', ['id="part-v"']],
  ['reflection', ['id="part-vi"']],
  ['glossary', ['id="glossary"']],
  ['references', ['id="references"', 'ref-src-dutton-2005', 'id="figure-04"']],
];
