# Figure 01 — The four-domain process cycle

**Kind:** conceptual diagram · **Built by:** Ben, authored externally, imported as SVG
**Lives on:** `/process` (Part IV), replacing the current stacked `<details>` blocks as the
primary object. The existing text and source mappings stay beneath it.

---

## Why this figure exists

This is the highest-value single object in the publication, and its absence is the clearest
design failure in Ares 2.1.

`src/content/data/process.json` already models the four domains as a **directed graph with a
closed feedback loop**, validated by Zod, with source mappings on every edge:

```
structural-conditions-grievance  → target-construction-threat     (can-shape)
target-construction-threat       → authorization-organization     (can-enable)
authorization-organization       → perpetrator-transition-violence(changes-conditions)
perpetrator-transition-violence  → target-construction-threat     (can-reinforce)  ← closes the loop
```

That fourth edge — violence feeding back into how the target group is perceived — is the
intellectual heart of the synthesis and the entire reason the page says *"Do not read this
as a sequence."*

Today the page renders that caveat in prose and then renders **four vertically stacked
coloured blocks followed by four bullet points**. A vertical stack is the visual grammar of
a sequence. The form contradicts the argument directly above it, and form wins.

## The argument the figure must make

A reader who looks at this figure for three seconds, reads nothing, and leaves should come
away with: *these four things feed each other; there is no start and no finish.*

If the figure can be read as "step 1 → step 2 → step 3 → step 4", it has failed.

## Form

- **A cycle, not a ladder.** Four nodes arranged so no node is visually first. A ring, a
  rotated square, or a quadrant — anything where the composition has no top.
- **Directed edges with visible arrowheads**, including the return edge. The return edge
  should be as visually strong as the other three, not a dotted afterthought.
- **Edge labels carry the verb**: `can shape`, `can enable`, `changes conditions`,
  `can reinforce`. These modal verbs are load-bearing — they are what stop the diagram
  claiming determinism. Do not shorten them to arrows alone.
- **No numbering.** No "1 / 2 / 3 / 4" anywhere.
- **No severity, no scale, no magnitude.** Node size is uniform. The domains are not ranked
  and are not quantities.

## Data source

`src/content/data/process.json` → `domains[]` (`id`, `label`, `summary`) and
`relationships[]` (`from`, `to`, `type`, `label`, `sourceMappings`).

**Do not retype the labels into the SVG.** Use the exact `label` strings from the JSON so
the figure and the text cannot drift. If the SVG is authored externally, the four node
labels and four edge labels must be copied verbatim, and a build check should assert they
still match the JSON (see *Build contract* below).

## Mobile

The figure must work at **320px wide**. A four-node ring with edge labels usually will not.
Plan two compositions from the start:

- **≥ 640px:** the full ring with edge labels placed along the arcs.
- **< 640px:** a squared-off cycle (2×2) with shorter edge labels, or edge labels moved to a
  numbered-free legend directly beneath. Do not simply scale the desktop ring down until the
  labels are 8px.

Ship both as one SVG with a CSS-driven swap, or as two SVGs behind a `<picture>`-style
switch. Do not use a horizontally scrolling container — a diagram the reader has to pan is a
diagram they will not read.

## Accessibility

- `role="img"` on the SVG with an `aria-label` giving the one-sentence finding.
- A `<figcaption>` that states the cycle in prose, including the feedback edge, so the
  argument is fully available without seeing the figure.
- Text in the SVG as real `<text>` elements, never outlined paths — it must be selectable,
  searchable and resizable.
- Minimum text size inside the figure: **12px at mobile**, and it must survive a 200% zoom.
- Contrast: all figure text ≥ 4.5:1 against its local background; edge strokes ≥ 3:1.

## Ethical constraints

- The four domains are an **Ares synthesis**, not a model authored by Dutton, Boyanowsky &
  Bond. The figure must carry that attribution visibly — not only in the surrounding prose.
  Suggested figure-level line: *"Ares synthesis of processes discussed in Dutton, Boyanowsky
  & Bond (2005). Not a stage model, a severity scale, or an early-warning instrument."*
- No arrow may imply inevitability. The modal verbs do this work; keep them.
- The figure must not be styled to look like an intelligence or targeting graphic. No
  crosshairs, no radar, no network-of-threat aesthetic, no dark "war room" treatment.

## Build contract

Add a unit test (`tests/unit/content-contracts.test.ts`) asserting that every `label` in
`process.json` `domains[]` and `relationships[]` appears verbatim in the imported SVG
source. This is what stops the figure silently going stale when the text is edited — the
single most common failure mode for hand-authored diagrams in a content-driven site.

## Deliverable from Ben

One SVG (or two, per the mobile note), with:
- text as `<text>`, not paths
- no embedded raster images
- no hardcoded colours — use `currentColor` and CSS custom properties (`--figure-ink`,
  `--figure-accent`, `--figure-rule`) so the figure inherits the locked palette and works on
  both the light ground and the reserved dark ground
- viewBox set, no fixed `width`/`height`
