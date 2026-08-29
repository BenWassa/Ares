# Lane 4 — Case architecture

**Depends on:** L1 · **Blocks:** L5 figure 02 · **Size:** medium · **Risk:** medium (schema)

---

## Problem

The eight cases are one template with swapped strings.

`CaseStudy.astro` hardcodes a fixed six-slot skeleton for every case:

```
A narrative → B analysis → C chronology → D analysis → E analysis → F analysis
```

Rwanda 1994 and My Lai 1968 have identical heroes, identical metadata layout, identical
section order, identical band rhythm. A three-month engineered famine and a single morning get
the same shape.

Issue #26 asked that cases "feel like a meaningful chapter rather than one repeated block."
That is **architecturally precluded**, not merely unstyled — no amount of CSS fixes it while
the component dictates content shape.

Two further constraints baked into the schema:

- `CaseRecordSchema.evidence` is a **single object, not an array**. Each case can carry exactly
  one quotation, forever. The home page's "each with testimony, chronology and analysis" is
  technically true — all eight have exactly one — but the publication cannot carry a second
  voice per case without a schema change.
- `displayPeriod` is a human string (`"~6 weeks"`, `"1 day (16 Mar)"`, `"100 days"`,
  `"1992-1995"`) with no machine duration, so nothing can compute or compare durations.

## Objective

Let content shape the page, not the reverse — while keeping the shared editorial grammar that
makes cross-case comparison possible.

## Scope

### Variable section structure
- Replace the fixed A–F skeleton with an ordered array of sections, each declaring its `kind`
  (`narrative` / `analysis` / `chronology` / `evidence`) and its `authorship`.
- A case may have five sections or eight, in an order that suits it.
- The **shared grammar stays**: every case still opens with orientation, still carries a
  chronology, still carries at least one evidence record, still ends with aftermath. The
  constraint moves from "these exact six slots" to "these required kinds, in a sensible
  order."
- Section `authorship` is what Lane 2's label fix reads from. Land L2 first or together.

### Evidence as an array
```ts
evidence: z.array(EvidenceRecordSchema).min(1),
```
One record per case remains valid; more become possible. Every record keeps its own
`sourceStatus` and `quotationStatus`.

### Chronology precision (prerequisite for Figure 02)
Add to `ChronologyEntrySchema`:
```ts
precision: z.enum(['day','month','season','year','multi-year','decade']),
startDate: z.string(),   // ISO 8601, earliest plausible
endDate:   z.string(),   // ISO 8601, latest plausible
```
`dateLabel` stays exactly as it is and remains the displayed truth. The ISO bounds are for
**positioning only** and must never render.

**56 entries across 8 cases need this.** Only 14 currently carry any machine date. Do this as
its own commit, reviewed for historical accuracy. Do not derive bounds mechanically from label
strings — `"Early 1980s"` in the El Mozote record refers to a specific period of Salvadoran
military policy, not to 1980-01-01.

### Case duration (prerequisite for Figure 03)
```ts
duration: z.object({
  days: z.number().int().positive(),
  approximate: z.boolean(),
  note: z.string().optional(),
  sourceStatus: SourceStatusSchema,
}),
```
Three judgement calls must be recorded in `note`, not decided silently: Bosnia (war vs the
eight days at Srebrenica), the Holodomor (peak mortality vs the full span), Cambodia (regime
duration vs continuous killing). Each is defensible; the silence is not.

## Acceptance criteria

- [ ] Case sections come from data; no fixed A–F in any component
- [ ] At least two cases demonstrably differ in section count or order, for editorial reasons
      recorded in the content
- [ ] `evidence` is an array; all eight cases validate
- [ ] All 56 chronology entries carry `precision`, `startDate`, `endDate`
- [ ] All 8 cases carry `duration`, with `note` populated for the three judgement calls
- [ ] No ISO date renders anywhere in the interface
- [ ] Zod validation passes; `pnpm check` green
- [ ] Every existing route and deep link still resolves
