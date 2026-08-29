# Figure 02 — The chronology spine

**Kind:** data-driven, one per case · **Built by:** Claude (Astro component)
**Lives on:** each `/cases/[slug]`, replacing the current `Chronology.astro` definition list.

---

## Why this figure exists

Chronology is the single most important visual opportunity in a publication whose subject is
**escalation as a process**. Ares currently renders it as a `<dl>` of date labels and
sentences on a pale field: no axis, no proportion, no sense of duration or acceleration.

It also makes all eight cases look identical. My Lai (one morning) and the Holodomor
(two years of engineered famine) are currently the same shape on screen. They should not be.

## The finding this figure reveals

Pulling the real data out shows something the current design completely hides:

| Case | Event duration | Chronology span |
|---|---|---|
| My Lai | one morning | 1968 → 1971 |
| El Mozote | one day | early 1980s → **2016** |
| Rwanda | 100 days | 1959 → 1994 |
| Nanking | ~6 weeks | 1937 → 1938 |
| Holodomor | ~2 years | 1929 → 1933 |

**El Mozote's chronology runs thirty-five years past the massacre** — through denial,
exhumation, and trial. My Lai's runs three, through cover-up and court-martial. The ratio of
*event* to *aftermath* differs enormously between cases, and that ratio is itself a finding
about how these events are contested, buried, and eventually established.

A time-scaled spine makes that visible. The definition list cannot.

## The best feature comes from the worst data

Only **14 of 56** chronology entries carry a machine-readable `dateTime`. The other 42 have
labels like:

- `"Spring-Summer 1915"`
- `"Throughout 1915-1917"`
- `"Late 1932 - Early 1933"`
- `"Early 1980s"`

This is not missing data. These are **intervals of known imprecision**, and they are exactly
what a publication about contested historical record should be showing.

**Encode precision as bar width.** An entry known to the day is a hard 2px tick. An entry
known to a month is a short band. An entry known to a season is a wider, softer band. An
entry known only to a decade is a wide, low-opacity wash.

This turns the data's weakness into the figure's argument: *the historical record is more
precise about some moments than others, and you can see which.* No other design decision in
this programme does as much work for as little.

## Data requirements

Extend `ChronologyEntrySchema` in `src/lib/content/schemas.ts`:

```ts
precision: z.enum(['day','month','season','year','multi-year','decade']),
startDate: z.string(),          // ISO 8601, earliest plausible
endDate:   z.string(),          // ISO 8601, latest plausible
```

Keep `dateLabel` exactly as it is — it stays the human-readable truth and the accessible
text. `startDate`/`endDate` are derived bounds for **positioning only** and must never be
displayed as if they were sourced precision.

**Data work required: 56 entries across 8 cases.** This is the prerequisite for the figure
and should be its own commit, reviewed for historical accuracy before any rendering work.
Do not infer bounds mechanically from the label strings without review — `"Early 1980s"` in
the El Mozote record refers to a specific period of Salvadoran military policy, not to
1980-01-01.

## Form

- A **vertical spine** on mobile, because the case pages are read by scrolling and a vertical
  time axis maps to scroll direction. Horizontal at ≥ 900px only if it earns the space.
- Position along the axis is **proportional to real time**, not to entry index.
- **The event itself is marked distinctly** from its lead-up and aftermath — a change in the
  spine's weight or value, not a change in hue.
- Where a long empty stretch occurs (My Lai: nothing between 1968 and the 1969 revelation),
  the axis **compresses with a visible break mark** rather than silently rescaling. A reader
  must be able to tell a compressed gap from a real one.
- Entry text sits beside its mark at full reading size. This is a chronology, not a sparkline —
  the prose is the content and the axis is the frame.

## Mobile

Primary target. The spine is a narrow left rail (≈ 28–40px) with entries flowing to its
right at the standard measure. No horizontal scrolling. No tooltips carrying essential text.

## Accessibility

- Render as a real `<ol>` in DOM order (chronological), visually positioned. Screen readers
  and no-JS/no-CSS get a correct ordered list for free.
- Each entry's accessible name is its `dateLabel` plus its text — never the derived ISO date.
- Precision must be conveyed non-visually: append the label's own hedge (`"Spring–Summer
  1915"` already says it) and, where the label is exact, nothing is added.
- The spine graphic itself is `aria-hidden="true"`; it is decoration over a semantic list.

## Ethical constraints

- **No density-of-death encoding.** Do not size, colour, or weight marks by casualties. The
  axis is time; the only quantity encoded is time.
- **Compression must be honest.** Any broken axis is visibly broken.
- Derived `startDate`/`endDate` never appear in the interface. Showing an ISO date the source
  does not support would manufacture precision, which is the exact failure this publication
  exists to avoid.

## Motion (per the agreed interaction-polish direction)

One restrained device: entries fade and rise by 4–6px as they enter the viewport, staggered
by ~40ms, exponential ease-out, **once**. The spine line itself may draw once on first view.
Both removed entirely under `prefers-reduced-motion: reduce`, leaving the complete static
figure. Nothing animates on scroll position continuously; nothing re-animates on scroll-back.
