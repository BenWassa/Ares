# Figure 03 — Duration and scale across the eight cases

**Kind:** data-driven, cross-case · **Built by:** Claude (Astro component)
**Lives on:** `/comparison` (Part III), above the existing table.

---

## Why this figure exists

Two problems meet here.

**One:** `/comparison` does not afford comparison on a phone. At 390px the table collapses
into eight sequential cards over **9,523px** of scroll. You cannot compare a value across
cases without holding eight numbers in memory across ten screens. The most important
analytical surface in the publication is effectively desktop-only.

**Two:** the page's form currently contradicts the publication's own ethic. `/framework`
argues *"Comparison is not equivalence."* `/comparison` then presents eight atrocities as
rows in a scorecard with a death-toll column — which is the visual grammar of a league
table. A reader scanning that column is doing exactly what the framework forbids.

## The argument the figure must make

*These events differ in kind and in tempo, not in rank.*

The figure compares the axis where comparison is genuinely informative and ethically safe —
**time** — and refuses the axis where it is neither.

## What it encodes, and what it refuses

**Encodes:** duration of the violence itself, on a shared, honest axis, across all eight
cases, 1915–1995.

The contrast is stark and is the whole point: one morning at My Lai, one day at El Mozote,
six weeks at Nanking, 100 days in Rwanda, two years of Holodomor, four years of Cambodia.
Same axis, wildly different shapes. A reader sees immediately that "extreme mass homicide"
names events of profoundly different tempo.

**Refuses:** any encoding of death tolls as length, area, or size. No bar proportional to
casualties. No dot-per-thousand. No area-scaled circles.

This is not squeamishness; it is accuracy. The estimates carry ranges spanning millions
(Holodomor: 3.9M–7M) and every single one is marked `requires-source-trace`. Rendering
unverified, hugely-uncertain figures as precise proportional geometry would be the most
misleading thing this publication could do. Death tolls stay as **text, with their ranges
and their uncertainty visible** — which is what the case pages already do well.

## Data requirements

`displayPeriod` is human-readable and inconsistent (`"~6 weeks"`, `"1 day (16 Mar)"`,
`"100 days"`, `"1992-1995"`). Do not parse it.

Add to `CaseRecordSchema`:

```ts
duration: z.object({
  days: z.number().int().positive(),      // canonical duration of the violence
  approximate: z.boolean(),               // true for "~6 weeks", "100 days"
  note: z.string().optional(),            // e.g. "Killing concentrated in the first six weeks"
  sourceStatus: SourceStatusSchema,
}),
```

`displayPeriod` remains the displayed string. `duration.days` is for geometry only.

**Judgement calls to record explicitly in `note`, not to decide silently:**
- Bosnia 1992–1995 is a war; Srebrenica is eight days inside it. Encode which one, and say so.
- The Holodomor's peak mortality is a subset of the 1932–33 span.
- Cambodia's 1975–79 covers a regime, not a continuous massacre.

Each of these is a defensible choice and an indefensible silence. The `note` renders.

## Form

- **Horizontal bars on a shared log-scaled time axis**, ordered **chronologically** by start
  year, never by duration or toll.
- Log scale is unavoidable (one day to four years is a 1,460× range) and must be **labelled
  as logarithmic on the axis itself**, with gridlines at day / week / month / year. An
  unlabelled log axis is a misleading chart.
- `approximate: true` renders with a soft or hatched terminal edge, not a hard cap.
- Each row carries the case name, `displayPeriod` as text, and links to the case.
- Death toll appears as **text at the end of the row**, in the same size and weight as any
  other metadata — never as a visual quantity.

## Mobile

This is the figure's primary justification, so it must be excellent at 390px:
- Eight rows, full width, each ~44px tall — the entire comparison fits in roughly **two
  screens** instead of ten.
- Axis labels abbreviate (`1d`, `1w`, `1mo`, `1y`) but the axis stays visible and labelled.
- The detailed table remains below for readers who want every field.

## Accessibility

- Rendered as a `<table>` with a visually-hidden but real header row, bars drawn as CSS
  widths on table cells — so the semantic comparison structure exists without the figure.
- Log scale stated in the caption, in words.
- Never colour-only: each row is labelled with its own text.

## Ethical constraints

- **Chronological order only.** Any sort control that would rank by duration or toll is out
  of scope and should not be built.
- The caption must state, in prose, that the figure compares tempo and not severity, and that
  duration is not a proxy for harm. One morning at My Lai and four years in Cambodia are not
  ordered by this figure and must not appear to be.
- Carry the corpus-wide source-status line: every duration is `requires-source-trace`.
