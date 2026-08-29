# Lane 1 — Design system

**Blocks:** L3, L4, L5, L6 · **Size:** large · **Risk:** medium (touches every route)

The foundation. Nothing else in the programme should land before this.

---

## Problem

The Ares 2.1 corrective pass added chroma without adding meaning, and the release gate could
not tell the difference — it measured contrast ratios, not whether the colours meant anything.

Measured on the live artifact (commit `1883435`):

- **22 positional colour rules** across four CSS files assign hue by DOM position, not by
  meaning. `.chapter-directory li:nth-child(3)`, `.case-index li:nth-child(4)`,
  `.glossary-entry:nth-child(3n)`. Two cases with the same classification get different
  colours; the Cambodian Killing Fields renders on pastel mint because it is fifth.
- **25 distinct font size/weight/family combinations** on a single case page, using **seven**
  weights of one sans (400/600/650/700/750/800/850), with a floor of **10.9px at weight 800**.
- **84-character measure** on desktop (`--measure: 43rem` at 18px).
- **Serif/sans inverted**: `h1` is a serif display face, `h2`/`h3` drop to bold sans, body
  returns to serif. Section heads read as app chrome inside scholarly prose.
- **Dark/light band alternation** on every page, violating the one-theme lock.
- **Cool gray secondary text on warm coloured fields** — the mechanism that makes the
  pastels look muddy.
- Palette (`#eee8dc` / `#986014` / `#9d5547`) sits inside the family Taste v2 §4.2 bans by hex.

## Objective

One locked visual system in which every colour, size and weight is chosen, not inherited from
position in a list.

## Scope

### Ground and colour
- Replace warm beige `--canvas` with a **cool paper**; keep values close enough that body
  contrast stays comfortably above AA.
- **Dark ground reserved** for chapter openings and case entry only. No mid-page inversions.
  The dark provenance aside becomes a light-ground treatment.
- **One accent, locked**, working on both grounds (deep verdigris teal is the working
  candidate — validate against both).
- **Delete all 22 positional colour rules.** Grep `nth-child|nth-of-type` in `src/styles/`
  must return zero colour assignments when this lane is done.
- Secondary text on any coloured surface is **tinted from that surface's hue**, never gray.
- Value, not hue, carries emotional modulation: sections deepen and tighten as material
  intensifies, open and lighten for analysis and reference.

### Typography
- Self-host **Newsreader** (display + text) and **IBM Plex Sans** (apparatus) as variable
  woff2, with `latin` + `latin-ext` + `vietnamese` `unicode-range` blocks.
  **The corpus needs all three** — `ả ỹ ơ` and `ć č š ž` are absent from `latin`, and without
  the extra subsets those characters render in a fallback font mid-word.
- Consider a **custom subset**: the corpus contains only eight non-Latin-1 letters, so a
  tight subset would cut Newsreader's `latin` file well below its 129KB.
- **One ramp: seven steps, three weights (400/600/700).** Apparatus floor **13px**.
- Measure to **65ch**.
- **Serif for headings.** `h2`/`h3` move to Newsreader. Sans is for apparatus only:
  labels, metadata, navigation, data, provenance.
- `font-variant-numeric: tabular-nums` on all date ranges, tolls and table figures;
  `lining-nums` in display, oldstyle in running prose.
- `font-display: swap` with a metric-compatible fallback to avoid layout shift.

### Labels
- **Cut decorative eyebrows**: `PART I` above a heading, `PREVIOUS CASE`, `SOURCE MAPPING`,
  `CASE n OF 8` as a standalone kicker. Fold wayfinding into the locator line.
- **Keep provenance labels**: authorship (`Ares synthesis`), source status, evidence
  attribution — reset at 13px minimum, tinted, sentence case or small caps rather than
  wide-tracked all-caps.

### Browser surfaces (Impeccable craft floor)
Already themed: `::selection`, focus rings, underline offset. Add: caret colour, scrollbar
treatment on the dark ground, and tabular figures. These are the cheapest signal that a page
was built rather than assembled.

### Layout
- Kill the 200–330px dead gaps on mobile; establish one vertical rhythm.
- Give the desktop right-hand void a job (marginalia, source notes, figure captions) **or**
  narrow the frame deliberately. Currently it is neither.
- Restore Part numbering in the desktop nav — delete
  `.publication-contents a span { display: none }`. Desktop currently discards structure that
  mobile shows.

## Acceptance criteria

- [ ] `grep -rn "nth-child\|nth-of-type" src/styles/` returns no colour assignments
- [ ] Distinct font size/weight/family combinations on any single route **≤ 9**
- [ ] Weights in use **≤ 3**; smallest rendered text **≥ 13px**
- [ ] Prose measure 60–70ch at every breakpoint
- [ ] No light→dark→light inversion within a single page's scroll
- [ ] Vietnamese and Serbo-Croatian glyphs render in Newsreader, not a fallback
  (verify per-glyph, not with `document.fonts.check`, which is unreliable)
- [ ] 0 WCAG AA failures — re-run the 906-node sweep, not just axe
- [ ] No horizontal overflow 320–1920px
- [ ] Total build ≤ 700KB including fonts
- [ ] Existing Playwright/axe gates green
