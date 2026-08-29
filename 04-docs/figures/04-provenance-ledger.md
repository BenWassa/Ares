# Figure 04 — The provenance ledger

**Kind:** data-driven, corpus-wide · **Built by:** Claude (Astro component)
**Lives on:** `/references` (Sources), with a compact variant in each case header.

---

## Why this figure exists

Ares's genuinely distinctive claim is not its subject — many publications cover this material.
It is the **source-trace contract**: the promise that the publication tells you what it has
verified and what it has merely inherited.

That claim is currently made only in prose, one record at a time, as a repeated sentence
("Case metadata and quantitative estimates remain marked *requires source trace*"). A reader
cannot see the shape of it. They cannot answer: *how much of this publication is actually
traced?*

## The current answer, and why it matters

Counting every source-status value in `cases.json` — classification, death estimate, primary
method, evidence record, and all 56 chronology entries:

```
requires-source-trace : 88
source-reviewed       :  0
approved              :  0
```

**Nothing in the case corpus is traced. 0 of 88.**

That is not a reason to hide the figure. It is the strongest argument for building it.

A publication that states its epistemic position that plainly is doing something almost no
digital-humanities project does, and it is entirely consistent with what Ares already says
about itself. The figure makes an honest claim legible instead of leaving it buried in
eighty-eight repetitions of the same sentence.

**Be aware of what this means for the figure today:** with one value at 100%, the figure has
no internal variance. It renders as a single full-width band. That is correct and honest, and
it is also why this figure's design must be judged on how it looks *as tracing progresses* —
it is a progress instrument, not a decoration. Build it so that the first record moving to
`source-reviewed` is immediately visible.

## The argument the figure must make

*Here is exactly how much of this publication rests on traced sources, and how much is
inherited from a legacy corpus that has not yet been checked.*

## Form

- A **stacked proportion bar** per category (classification, estimates, method, evidence,
  chronology) plus a corpus total — not a pie, not a gauge, not a ring.
- Three states, distinguished by **value and pattern, not hue alone**: `requires-source-trace`
  (hatched / low value), `source-reviewed` (mid), `approved` (solid accent).
- Absolute counts printed as text beside every bar. Percentages alone hide that the corpus is
  88 records, not 88,000.
- No trend line, no target, no gamified progress framing. This is a statement of position, not
  a completion meter. No "12% complete!" language, no celebratory styling when values improve.

## Compact variant

In each case header, a one-line version replaces the current repeated sentence:

```
Sources   0 of 11 records traced        [————————————]  requires source trace
```

Same component, `variant="inline"`. This removes eight copies of an identical paragraph and
replaces them with something that actually carries information per case.

## Data requirements

None. Every value already exists in `cases.json` and is Zod-validated. This figure is
**buildable today with no data work** — the only one of the five that is.

Add a derived selector in `src/lib/content/` that counts statuses across the corpus, so the
figure and any future badge read from one place.

## Mobile

Trivially responsive — stacked full-width bars with counts beneath labels. No special case.

## Accessibility

- Real `<table>` of counts, with bars as CSS widths on cells.
- Never hue-only: each segment carries a text label and a distinct fill pattern.
- `aria-label` on the total stating the position in one sentence.

## Ethical constraints

- **Never imply that untraced means false.** The label is `requires source trace`, and the
  caption must say plainly that these are inherited legacy claims awaiting verification, not
  claims known to be wrong.
- **Never imply that traced means true.** `source-reviewed` means a source has been attached
  and checked, not that the historical question is settled.
- Do not aggregate this into a single headline "trust score" or letter grade. A publication
  that reduces its own epistemic state to one number has replaced provenance with branding —
  which is the failure mode this entire figure exists to prevent.

## Build note

This is the cheapest of the five figures and the one most specific to what Ares is. If the
programme has to be cut, cut something else.
