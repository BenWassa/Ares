# Lane 3 — Interaction and motion

**Depends on:** L1 · **Size:** medium · **Risk:** medium (ethical surface)

---

## Problem

Ares currently ships motion on colour transitions and nothing else. Under Impeccable's craft
floor that reads as under-designed: *"one authored moment, not scattered effects."* Stillness
is not the same as restraint — one is a decision, the other is an absence.

There is also a real defect: **the Contents panel does not close on scroll.** It is a
`<details>` with Escape and link-click handlers only, so scrolling with it open leaves an
opaque panel covering ~68% of the mobile viewport while content moves underneath it.

## The governing rule for this lane

**Craft in the chrome, stillness in the material.**

Emil-grade interaction quality goes on navigation, controls, focus, state and transitions.
**Nothing animates atrocity content.** No reveal-on-scroll for a massacre description, no
parallax on a case opening, no counting-up death tolls, no staggered entrance on testimony.

If a motion would make the reader notice the interface at the moment they are reading about
killing, it does not ship.

## Scope

### Fixes
- Contents panel closes on scroll, on outside click, and on Escape (Escape already works).
- Delete `src/scripts/navigation.ts` — **it is not imported anywhere.** The real navigation is
  an inline script in `PublicationHeader.astro` using a different breakpoint (`63.99rem` vs
  the dead file's `73.75rem`) and referencing DOM that no longer exists (`#reading-progress`,
  `[data-nav-target]`). A fresh agent reading it would patch the wrong file.
- Delete orphaned `ReadingNav.astro` and `EntryPoints.astro` (0 usages each).

### Interaction quality
- Full state cycles on every control: rest, hover, active, focus-visible, disabled.
- `:active` gives real tactile feedback (1px translate or 0.98 scale) — a physical press.
- Focus rings themed from the accent, visible on both grounds, never removed.
- Exponential ease-out from an already-visible default. No linear easing, no bounce.
- Glossary dialog: considered open/close, focus trap already works, keep focus restoration.
- Duration ceiling 200ms for state, 320ms for anything larger. Anything slower is felt.

### The one authored moment
Per the craft floor, exactly one. Candidate: **the chronology spine drawing once as it enters
view** (Figure 02, Lane 5) — it is structural rather than decorative, it reinforces the
passage of time the figure encodes, and it happens on the frame, not on the content.

Decide this once. Do not add a second.

## Acceptance criteria

- [ ] Contents panel dismisses on scroll and outside click
- [ ] Dead files deleted; `grep -rn "ReadingNav\|EntryPoints\|scripts/navigation"` returns
      only the deletions
- [ ] Every interactive element has all five states
- [ ] `prefers-reduced-motion: reduce` removes all transitions and the authored moment,
      leaving a complete static page
- [ ] No motion on any case narrative, testimony, chronology entry text, or death toll
- [ ] Keyboard traversal of every route with visible focus at all times
- [ ] No `window.addEventListener('scroll')` doing layout work; use IntersectionObserver
- [ ] Still zero JS bundles, or one small one — no framework, no animation library
