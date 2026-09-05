# Ares 3.0 — ground-level overhaul

**Status:** Authoritative for the visual system. **Partly superseded for composition.**
**Supersedes:** the palette and ground rules in `Ares_2_1_Visual_Overhaul.md` and in `Ares_2_Product_Editorial_Design_Brief.md` §8 (which specified a light reading-first default); sections 1, 3 and 4 of `Ares_2_3_Mobile_Screen_Composition_Principle.md`.
**Superseded by:** `Ares_3_1_Human_First_Mobile_Editorial_System.md` for public identity, Home composition and the mobile grouping law. §3 below reduced route depth, which was correct, but treated route count as the optimization target and made Home a cover *and* a complete directory. 3.1 replaces that: route count is a constraint, the target is how many ideas a viewport asks a reader to hold, and the complete directory leaves Home. The dark oxide ground, ramp and accent rules in §2 are unchanged and are not reopened.
**Unchanged:** every editorial, provenance and ethical rule in `Ares_2_Product_Editorial_Design_Brief.md` and `AGENTS.md`.

## 1. The two findings

The publication owner's assessment, in their words: *"design and number of pages is still awful. Too many pages deep. And design plain and boring."*

Both are correct, and they are separate faults.

**The ground was the wrong register.** 2.2 locked a cool grey-green paper (`#e8ecec`) under a verdigris accent (`#0d5b58`), and reserved its one dark field for chapter openings. So roughly 85% of every route was pale institutional grey — the palette of a clinic or a policy PDF — for a publication about military massacre and genocide. The one genuinely good surface in the system, the dark case header, was rationed to a band at the top of a page.

**The hierarchy had become its own content.** Counting screens rather than tree levels, the worst path was:

```
/  →  /guided  →  /framework  →  /framework/scope-purpose
```

Three consecutive surfaces whose entire content was a list of links, before one sentence of the publication. `/framework` rendered an opening, a breadcrumb, three child links and a footer, and nothing else. My Lai was six routes; the comparison was three.

29 routes, and the reader's first act was to choose a chooser.

## 2. What 3.0 does about the ground

One warm, brown-shifted near-black family carries every route. There is no light field anywhere in `main`. The single chromatic voice is iron oxide.

The register is deliberately **memorial, not spectacular**. Rust and dried blood on stone; black granite. The material is mass killing, and `AGENTS.md` forbids atrocity spectacle — that rule is not relaxed here and the palette is built to honour it. Nothing glows, nothing is crimson, nothing pulses, and no figure got more dramatic. The publication got graver, not louder.

Rules that survive from #30 unchanged:

- Modulation is by ground **value** and density, never by rotating hue.
- No colour is assigned by position in a list.
- Three weights, one ramp, apparatus floor at 13px.

Rules that are new:

- `--accent` is **structure** — keylines, fills, borders. It never carries small text, because at AA it only clears the 3:1 large-text bar on this ground. `--accent-lift` is the only accent value permitted to be typography.
- Elevation is cast by **shadow**, not by a lighter fill. A panel that got brighter would compete with the reading column.
- Ink is bone (`#f2ebe1`), not white, and the serif is antialiased: pure white on near-black blooms and reads as glare.
- The ramp gained two display steps. A publication whose largest type was 3.5rem could open nothing; it could only label things.

`tests/browser/design-system.spec.ts` now asserts the ground contract **positively**: every content band on every route must be dark. The old check ("never dark after light") is satisfied by construction in a dark-first system and would have caught nothing.

## 3. What 3.0 does about depth

19 routes, down from 29. Every unit is at most **two** screens from the opening, and `tests/unit/hierarchy.test.ts` fails the build if that stops being true.

> **Amended by 3.1.** The route reductions below stand. The Home composition they produced does not: measured at 390 px, that opening carries a wordmark, a ten-row route directory and a methodology paragraph, and not one date, place or historical sentence. The directory also duplicated the `<details>` Contents that `PublicationHeader` already renders on every surface except Home. `Ares_3_1_Human_First_Mobile_Editorial_System.md` §4 replaces the Home contract; the retired routes keep the addresses recorded here.

| Retired | Where it went |
| --- | --- |
| `/guided`, `/full-publication` | The opening, in 3.0. Under 3.1 the complete directory moves to Home's Contents control and footer; every published part is still one tap away. |
| `/framework/scope-purpose` | `/framework#scope-purpose`. The overview *was* this orientation. |
| Five `/cases/my-lai-massacre/*` routes | Sections of the case. |
| Two `/comparison/*` routes | Sections of Part III. |

### 3.1 Amendment to the 2.3 composition principle

2.3 said: *one screen represents one major grouping or one coherent reading task; a parent presents its immediate children and does not render their contents.*

The first clause holds. The second is amended:

> **A unit is one coherent reading task. A unit does not require a route of its own.** Sibling units of the same topic may render as sections of one surface when the reader's next action after finishing one is to read the next. A unit earns a separate route when it is a genuine branch — optional depth, a different topic, or a research utility — not merely because it is a distinct job.

The rationale 2.3 gave was cognitive load, and it was right about long undifferentiated pages. It was wrong that the remedy is always a route. Four essential units of a single case study are not four decisions; they are one reading, and a page load between each is navigation the reader never asked for.

The units did not disappear. Each keeps its hierarchy identity, its question, its cognitive job, its caveats, its own address, and its "N of 4 · Essential" caption. The schema already anticipated this: `screen: false` with a `parentRoute#anchor` address was designed in from the start as the way a deferred split stays documented.

### 3.2 What still earns a route, and what stays behind a disclosure

Optional depth is still never material the reader scrolls into by accident. On the merged surfaces it is a **closed `<details>`** below the essential units — a native control, so it works without JavaScript, and it is closed on load. Extended detail of the killing, the cover-up and the courts-martial is never in front of a reader who did not open it. `tests/browser/prototype-45.spec.ts` asserts exactly that, and it is the #45 guarantee restated for the new shape rather than dropped.

### 3.3 Addresses are durable

Every anchor published by 2.2 and every route published by #51 still resolves. Retired routes forward from the opening's legacy alias map; renamed anchors forward on their own surface; resume state pointing at a merged route is treated as stale and dropped rather than offered as a link into a 404.

## 4. Two latent bugs the pale ground was hiding

Neither was introduced by this work; both were visible the moment contrast went up.

- **`.reading-unit` double-centred.** A 54ch unit with `margin: 0 auto` inside a 62rem page column sat ~15rem to the right of the breadcrumb, heading and unit navigation it belonged to, on every route that used it.
- **The case article and its header sat on different axes.** The header bled to the viewport and re-centred its own text; everything else in the article started at the page frame's gutter. On any screen wider than the page column the case title and its breadcrumb did not line up.

Both are fixed by one rule in `publication.css`: a block narrower than the page column starts at that column's left edge.

## 5. Unchanged, and non-negotiable

No gamification, no atrocity spectacle, no animated suffering, no severity scoring, no generic SaaS cards, no decorative testimony. Cases are compared, never ranked. `requires-source-trace` still means exactly that, and it is still rendered wherever the datum appears. Essential prose, glossary definitions, citations and process explanation remain static semantic HTML that works with JavaScript disabled.
