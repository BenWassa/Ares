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
 * #58 folded the chooser routes and the per-unit routes back into the surfaces
 * that own them. #64 replaces the My Lai case-unit apparatus with the A–G
 * editorial opening and applies the same grammar to the Holodomor only. Their
 * markers below pin that representative slice without migrating the other cases.
 */
export const routeChecks = [
  ['', ['id="front-matter"', 'id="contents-title"', 'id="about-ares"', 'href="/Ares/framework"', 'href="/Ares/cases"', 'href="/Ares/comparison"', 'href="/Ares/glossary"', 'href="/Ares/references"', 'legacy-anchor-aliases']],
  ['framework', ['id="part-i"', 'id="scope-purpose"', 'id="definitions-typology"', 'id="theoretical-lenses"', 'unit-children', 'screen-trail']],
  ['framework/definitions-typology', ['id="what-matters"', 'id="critical-caveats"', 'id="scholarly-framing"', 'screen-trail', 'screen-nav__parent']],
  ['framework/theoretical-lenses', ['Theoretical lenses', 'screen-trail', 'screen-nav__parent']],
  ['cases', ['id="part-ii"', 'class="case-index"']],
  ['cases/armenian-genocide', ['id="armenian-genocide"', 'chronology--spine', 'figure-02-armenian-genocide']],
  ['cases/ukrainian-holodomor', [
    'id="ukrainian-holodomor"', 'id="identity"', 'id="standing-facts"',
    '3,900,000–7,000,000', 'id="duration-note"', 'requires source trace',
    'id="what-happened"', 'id="why-ares"', 'id="finding"', 'integrity-note',
    'id="essential-reading"', 'principal-testimony', 'content-note',
    'id="scholarly-depth"', 'chronology--spine', 'figure-02-ukrainian-holodomor',
  ]],
  ['cases/my-lai-massacre', [
    'id="my-lai-massacre"', 'id="identity"', 'id="standing-facts"',
    '347–504', 'requires source trace',
    'id="what-happened"', 'id="why-ares"', 'id="finding"', 'integrity-note',
    'id="essential-reading"', 'principal-testimony', 'content-note',
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