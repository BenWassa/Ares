# Lane 5 — Figures

**Depends on:** L1 (tokens); figure 02 depends on L4 (chronology precision) and figure 03 on
L4 (duration) · **Size:** large · **Risk:** medium

Full specifications live in [`04-docs/figures/`](../figures/). This document is the build lane.

---

## Problem

**Zero images, SVGs, figures, charts or canvases across all 17 routes.**

```
grep -o '<svg|<img|<figure|<canvas|<picture' dist/*.html dist/cases/*.html  →  no matches
```

Issue #26 asked explicitly for "chronology treatments; maps where genuinely useful; process
relationships; comparative diagrams" and warned "do not treat 'text-first' as 'text-only'."
That acceptance criterion was not met and the release closed anyway.

The sharpest instance: `process.json` models the four domains as a **directed graph with a
closed feedback loop**, source-mapped and Zod-validated. It renders as four stacked coloured
blocks above four bullet points — directly beneath a caveat reading *"Do not read this as a
sequence."* The page argues non-linearity in prose and renders linearity in form. Form wins.

## Build order

| # | Figure | Depends on | Notes |
|---|---|---|---|
| **04** | Provenance ledger | L1 only | **Build first.** No data work needed. |
| **03** | Duration and scale | L4 duration | Fixes `/comparison` on mobile. |
| **02** | Chronology spine | L4 precision | Highest per-case value. |
| **01** | Process cycle | Ben authors SVG | Import + build contract only. |

Figure **05** (photography) is Lane 6.

## Shared infrastructure to build once

- A `<Figure>` component: caption, credit, source line, `role="img"`, `figcaption`.
- Figure tokens (`--figure-ink`, `--figure-accent`, `--figure-rule`) so figures inherit the
  locked palette and work on both grounds.
- A build check asserting figure text matches its source JSON — the thing that stops a
  hand-authored diagram silently going stale when the text is edited.

## Rules that apply to all figures

1. No figure asserts more than the source supports; each carries its own source line.
2. **No figure ranks atrocities.** Ordering is chronological or alphabetical, never by toll.
3. Static-first: complete as SVG/CSS with JavaScript disabled.
4. Locked palette only. No figure introduces a hue meaningful only inside itself.
5. `prefers-reduced-motion` removes all figure motion.
6. Every figure has a prose text equivalent carrying the finding.

## Two things worth restating

**Figure 03 must not encode death tolls as geometry.** The estimates span ranges of millions
(Holodomor 3.9M–7M) and every one is `requires-source-trace`. Rendering unverified,
hugely-uncertain figures as precise proportional bars would be the most misleading thing this
publication could do. It compares **tempo**, on a labelled log axis. Tolls stay as text with
their ranges visible.

**Figure 04 currently renders as one flat band.** All 88 source-status values in the case
corpus are `requires-source-trace` — nothing is traced. That is honest and is the argument for
building it, but it is a progress instrument, not a decoration. You may want to trace some
records before it ships.

## Acceptance criteria

- [ ] Figures 02, 03, 04 built; 01 imported with its build contract
- [ ] Every figure renders completely with JavaScript disabled
- [ ] Every figure has a semantic DOM equivalent (list or table), not just an image
- [ ] No figure sorts or sizes by death toll
- [ ] Figure 03's log axis is labelled as logarithmic
- [ ] Figure 02 renders no ISO dates
- [ ] `/comparison` is comparable on a 390px phone in ≤ 3 screens
- [ ] axe green on every route carrying a figure
- [ ] Build stays within budget
