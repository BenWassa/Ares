# Ares 2.2 — programme roadmap

Six lanes, staged as independent reviewable PRs against `claude/ares-design-review-pp0lg7`.

## Decisions taken (do not relitigate without a reason)

| Decision | Choice | Why |
|---|---|---|
| **Ground** | Cool paper; dark **reserved** for chapter openings and case entry | The current warm beige (`#eee8dc`) sits inside the palette family Taste v2 §4.2 bans by hex, and matches the "museum-beige academic template" the brief rules out. Dark/light band alternation violates the one-theme lock (Taste §4.11). |
| **Emotional modulation** | Ground **value** + density | Sections deepen and tighten as material intensifies; open and lighten for analysis and reference. Range comes from value, measure, leading and whitespace — not from rotating hue. |
| **Typefaces** | **Newsreader** (display + text) + **IBM Plex Sans** (apparatus), self-hosted | Chosen from a three-way specimen at 390px on real My Lai content. Newsreader fits ~48ch against Literata's ~40, keeps "My Lai Massacre" on one line where Source Serif breaks it, and has the strongest italic — which matters because testimony is load-bearing. |
| **Font subsets** | `latin` + `latin-ext` + `vietnamese` via `unicode-range` | The corpus contains `ả ỹ ơ` (Quảng Ngãi, Sơn Mỹ) and `ć č š ž` (Srebrenica material). Google's `latin` subset covers neither — without this, those characters render in a fallback font mid-word. |
| **Motion** | Interaction polish throughout — on **chrome only** | Emil-grade quality on navigation, controls, focus, state and transitions. Never on atrocity content. Craft in the chrome, stillness in the material. |
| **Label tier** | Keep provenance labels, cut decorative ones | Impeccable bans eyebrows outright and Taste caps them at 1 per 3 sections. Authorship and source-status labels carry real scholarly meaning and survive; positional ones (`PART I` above a heading, `PREVIOUS CASE`, `SOURCE MAPPING`) go. |
| **Colour semantics** | One accent, locked. All positional colour deleted | 22 `nth-child`/`nth-of-type` colour rules currently assign meaning by DOM position, manufacturing a taxonomy of atrocities that does not exist. |
| **Figures** | Five specified in `04-docs/figures/` | 01 and 05 authored by Ben; 02–04 built in code. |

## Lanes and dependencies

```
L1 Design system ──┬── L3 Interaction and motion
                   ├── L4 Case architecture ── L5 Figures
                   └── L6 Photography (gated on external research)
L2 Content integrity  (independent — can land first or in parallel)
```

Programme issue: **#29**

| Lane | Issue | Doc | Blocking? | Notes |
|---|---|---|---|---|
| **L1** Design system | [#30](https://github.com/BenWassa/Ares/issues/30) | [01-design-system.md](01-design-system.md) | Blocks L3, L4, L5, L6 | The foundation. Largest diff. |
| **L2** Content integrity | [#31](https://github.com/BenWassa/Ares/issues/31) | [02-content-integrity.md](02-content-integrity.md) | Independent | Small, ethical, ships anytime. |
| **L3** Interaction and motion | [#32](https://github.com/BenWassa/Ares/issues/32) | [03-interaction-and-motion.md](03-interaction-and-motion.md) | After L1 | |
| **L4** Case architecture | [#33](https://github.com/BenWassa/Ares/issues/33) | [04-case-architecture.md](04-case-architecture.md) | After L1; blocks L5 fig 02 | Schema change. |
| **L5** Figures | [#34](https://github.com/BenWassa/Ares/issues/34) | [05-figures.md](05-figures.md) | After L1; fig 02 after L4 | Fig 04 buildable immediately. |
| **L6** Photography | [#35](https://github.com/BenWassa/Ares/issues/35) | [06-photography.md](06-photography.md) | Gated on research | Deferrable indefinitely. |

## What must not regress in any lane

The Ares 2.0/2.1 gains are not up for renegotiation:

- Astro + strict TypeScript, static output, GitHub Pages
- Zod validation of all structured content
- Essential content available with JavaScript disabled
- Playwright / axe gates green
- Provenance and source-trace contracts
- Explicit uncertainty states (`requires-source-trace`)
- Four-domain, non-sequential process synthesis
- `prefers-reduced-motion` honoured
- WCAG 2.2 AA
- No horizontal overflow at any viewport

**Current measured baseline** (from the 2.2 review, commit `1883435`): 0 AA failures across
906 text nodes on 10 routes; 308KB total build; 0 JS bundles; 17 routes; 1,406 lines of
source; 414 lines of CSS.
