# Figure 03 — Duration and scale across the eight cases

**Kind:** data-driven, cross-case · **Lives on:** `/comparison` (Part III), above the existing table.  
**Status:** Specialist comparison figure. **Not Home authority.** For Home, #70 / `Ares_3_1_Final_Home_Communication_Design.md` is later and binding.

> **#70 clarification.** The original version of this specification described `duration.days` as a single shared measure of “duration of the violence itself.” The eight-case audit shows that wording is too strong. The field is a **recorded case-study window in days**, and its boundary conventions differ materially: Bosnia uses the whole 1992–95 war while focusing on Srebrenica; El Mozote uses the one-day hamlet massacre rather than the surrounding four-day operation; Holodomor uses the policy/famine window rather than peak mortality; Cambodia uses the regime span. Figure 03 may compare those recorded windows only with those boundary notes attached. Its logarithmic geometry must **not** be transplanted to Home. Current structured data, not examples in older prose, is authoritative for values.

---

## Why this figure exists

Two problems meet here.

**One:** `/comparison` does not afford comparison on a phone. At 390px the historical table can become a long sequence that requires the reader to hold values in memory across many screens.

**Two:** the page must not present eight atrocities as a scorecard. Comparison is useful only when the represented dimension is named and the graphic does not turn magnitude into moral or historical rank.

## The argument the figure may make

*The case studies are bounded over very different time windows; those windows are not a ranking of harm.*

This is narrower than saying the bars represent one universally defined “duration of violence.” The boundary notes are part of the comparison.

## What it encodes, and what it does not

**Encodes:** the current `duration.days` value for each case as the case study's recorded main-event/window duration, with `duration.note`, `approximate` and source status kept available.

Current values include:

- My Lai — `1` day;
- El Mozote — `1` day;
- Nanking — `42` days / six weeks;
- Rwanda — `100` days;
- Holodomor — `396` days / about thirteen months;
- Armenian Genocide — `1065` days / about three years;
- Cambodia — `1362` days / about four years;
- Bosnia — `1370` days / about four years, measuring the war rather than the Srebrenica killings.

**Does not encode death magnitude in the current corpus.** #70's audit found that the eight death fields are not one sufficiently source-traced, commensurable quantity. This is a present-data ruling under the quantitative visualisation amendment, not a permanent prohibition on quantitative death visualisation.

## Data requirements

`displayPeriod` is human-readable and inconsistent (`"~6 weeks"`, `"1 day (16 Mar)"`, `"100 days"`, `"1992-1995"`). Do not parse it for geometry.

The structured record is authoritative:

```ts
duration: z.object({
  days: z.number().int().positive(),
  approximate: z.boolean(),
  note: z.string().optional(),
  sourceStatus: SourceStatusSchema,
})
```

`duration.days` is the numeric window value. `duration.note` is not optional editorial decoration where a boundary is a judgement call; it explains what the number includes and excludes.

Material boundary cases:

- **Bosnia:** the case is the 1992–95 war with Srebrenica as focal atrocity; the duration measures the war, not the July 1995 killings.
- **Holodomor:** the record chooses the Aug 1932–summer 1933 policy/famine window rather than only peak mortality.
- **Cambodia:** the record uses the Khmer Rouge regime span, not a claim of continuous killing at one rate.
- **El Mozote:** the record uses the killings at El Mozote on 11 Dec 1981 rather than the wider 10–13 Dec operation.

Each is a defensible recorded case boundary only when its note travels with the comparison.

## Form on `/comparison`

- Horizontal bars on a shared **log-scaled day axis**, ordered chronologically, never by window length or toll.
- The axis must be explicitly labelled logarithmic with interpretable reference points such as day / week / month / year.
- `approximate: true` remains visually distinguishable from an exact boundary without colour alone.
- Each row carries the case name and a natural-language window label.
- The boundary/source note is reachable at the point of the row, especially for Bosnia, Holodomor, Cambodia and El Mozote.
- Current death estimates may remain textual in the detailed comparison only where their existing uncertainty/source treatment travels with them; they do not drive Figure 03 geometry.

The logarithm is acceptable here only because this is a specialist comparison figure whose axis is explicitly named and whose detailed notes are adjacent. #70 deliberately rejects importing this grammar into the lower-burden Home historical field.

## Mobile

At ~390px:

- eight rows remain readable without requiring a wide horizontal table;
- axis/reference labels remain visible;
- no row label is truncated;
- the detailed prose/table remains available below for full context;
- boundary notes must not require hover.

## Accessibility

- Render the comparison with a semantic tabular/list equivalent; bars are a visual layer rather than the only information source.
- State `logarithmic` and `recorded case window` in words.
- Never colour-only: each row has its textual value and case identity.
- Preserve keyboard/source-note access and reflow at 200% text.

## Ethical and interpretive constraints

- **Chronological order only.** No sort control by duration or toll.
- Do not call a longer recorded case window a more severe, important or harmful atrocity.
- Do not describe `duration.days` as one uniform measure of killing intensity or continuous violence.
- Every material boundary judgement remains visible/reachable.
- Every duration remains `requires-source-trace` until source-level review changes that status.
- No animated bars, accumulating values or spectacle.

## Relationship to Home

`Ares_3_1_Final_Home_Communication_Design.md` chooses a different grammar for #71:

- **linear proportional calendar position** from canonical `sortKey`;
- **recorded case-window duration in words only**;
- **no death estimate on Home** under the current provenance audit.

That Home decision is later authority and does not require Figure 03 to be removed from `/comparison`.
