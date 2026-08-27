# Ares 2.0 Editorial Visual System

**Status:** Implemented visual foundation for Issue #8  
**Branch:** `ares-2/8-visual-system`  
**Base:** post-#6 `main` at `ad33a84f7508f91c0c7efe19f125d551498748fa`  
**Product authority:** `Ares_2_Product_Editorial_Design_Brief.md`  
**Architecture authority:** `Ares_2_Architecture_Decision_Record.md`

This document records the shared visual decisions implemented in `01-core/stylesheet.css`. It is intentionally narrower than the product brief: #5 remains authoritative for product/editorial/ethical direction, while this file defines the visual tokens and presentation rules that parallel implementation branches should reconcile against.

## 1. Implemented thesis

Ares 2.0 uses an **editorial rather than component-first visual system**. The publication is carried by typographic hierarchy, reading measure, whitespace, rules and evidence structure. Colour and surfaces reinforce meaning but do not create a collection of cards.

The intended character is:

- sober;
- documentary;
- contemporary without fashion-driven novelty;
- publication-grade rather than application-like;
- information-dense when the argument requires it;
- restrained around testimony and mass-violence material.

The implementation deliberately removes the dominant Ares 1.x patterns of rounded tinted cards, soft shadows, gradient accents, dark table-header blocks, decorative pull-quote styling and hover-driven scale effects.

## 2. Typography

### Text face

Sustained prose uses a durable OS serif stack:

```css
Charter, "Bitstream Charter", "Iowan Old Style", "Sitka Text", Cambria, Georgia, serif
```

This keeps the publication readable if third-party font requests fail and avoids making the reading product depend on one hosted font file.

### Display face

The title, major part names and case-study titles use a restrained old-style/display serif stack:

```css
"Iowan Old Style", Baskerville, "Times New Roman", Georgia, serif
```

Display typography is allowed to be large, but its role is editorial orientation rather than spectacle.

### UI / metadata face

Labels, metadata, chronology dates, table text, captions and navigation use the system sans stack:

```css
ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif
```

The sans face signals structure and evidence metadata without competing with the reading voice.

### Hierarchy rules

- The title is a large serif display with tight leading and tracking.
- Major parts use a small uppercase sans part label followed by a large serif part name.
- Case titles use the display serif and are clearly stronger than ordinary subsections.
- Ordinary analytical headings use sans typography and compact spacing.
- Analytical subheads within cases use small uppercase sans labels rather than another oversized heading tier.
- Metadata remains smaller than prose but never low-contrast.
- Captions/citations use sans typography and explicit spacing rather than grey-on-grey mini text.

## 3. Measure and layout

The core sustained-reading measure is `43rem`. This produces approximately 60–75 characters per line across the representative desktop range with the implemented text size.

The wider editorial measure is `52rem` and is reserved for content that genuinely benefits from width, currently tables and explainer surfaces. These elements break out symmetrically from the reading column and then return to prose measure.

Page gutters are fluid through:

```css
--gutter: clamp(1rem, 4vw, 2.5rem);
```

The body canvas is intentionally not a white card floating on grey. The publication sits directly on a warm paper-like canvas with rules defining important boundaries.

## 4. Colour system

| Role | Token | Value | Purpose |
| --- | --- | --- | --- |
| Canvas | `--canvas` | `#f1f0eb` | page field |
| Paper | `--paper` | `#fbfaf7` | utility surfaces / sticky content |
| Ink | `--ink` | `#1f2428` | primary text |
| Soft ink | `--ink-soft` | `#4f575d` | secondary prose |
| Muted ink | `--ink-muted` | `#656c71` | metadata/captions |
| Rule | `--rule` | `#d4d3cd` | quiet separators |
| Strong rule | `--rule-strong` | `#b8bab6` | major boundaries |
| Analytical accent | `--accent` | `#315d78` | analytical structure |
| Strong analytical accent | `--accent-strong` | `#21475f` | links/headings |
| Narrative accent | `--narrative` | `#75623f` | narrative/testimony structure |
| Focus | `--focus` | `#075fbd` | keyboard focus |

The former olive and bright gold identities are not carried forward as co-equal brand colours. Narrative material retains a muted earth/bronze signal, while analytical material retains a restrained slate-blue signal.

There are no identity gradients and no blood-red/danger palette.

### Contrast checks

Against the implemented `#fbfaf7` paper:

- primary ink: ~15.0:1;
- soft ink: ~7.05:1;
- muted ink: ~5.11:1;
- analytical accent: ~6.78:1;
- strong analytical accent: ~9.44:1;
- narrative accent: ~5.63:1.

These values clear 4.5:1 for normal-size text and directly address the small-text contrast failures identified by #4.

## 5. Surfaces and hierarchy

Ares 2.0 defaults to **no container**.

The stylesheet removes or materially reduces:

- rounded content cards;
- tinted analytical boxes;
- tinted testimony boxes;
- decorative surface gradients;
- content hover shadows;
- chip-like case metadata;
- dark filled table headers;
- decorative pull-quote rules/quotation marks.

Preferred hierarchy tools are:

1. type scale and family;
2. vertical rhythm;
3. reading measure;
4. alignment / indentation;
5. one-dimensional rules;
6. colour as reinforcement.

Elevated surfaces are retained only where an actual layer exists, such as the current glossary side panel or tooltip. Those remain provisional interaction surfaces for #10.

## 6. Dual voice

The narrative/analytical distinction uses multiple non-colour signals.

### Narrative / testimony

- serif reading voice;
- slightly looser line-height;
- a single left rule;
- indented measure;
- uppercase provenance/location kicker in UI sans;
- testimony attribution attached directly below quoted evidence.

The narrative block has no filled quote card, no top gradient, no hover decoration and no theatrical quote scale.

### Analytical

- analytical sections begin with a restrained top rule;
- analytical case material uses a quiet left rule;
- analytical hierarchy uses compact sans labels;
- denser tables/chronologies use the UI sans for structure.

This distinction remains legible in monochrome because type, indentation, rule direction and spacing differ independently of colour.

## 7. Testimony and quotation treatment

The stylesheet treats `.vignette-quote` as an evidence block rather than a pull-quote asset:

- quote text stays near body scale;
- no giant quotation marks are generated;
- no centered/cinematic composition;
- attribution remains immediately attached;
- a thin rule separates the quoted evidence from preceding narrative.

The legacy `.pull-quote` pattern is restyled as a restrained analytical thesis/callout: left aligned, body-adjacent scale, one rule, no generated quotation marks or decorative gradient bars. This avoids making project-written editorial language resemble witness testimony.

## 8. Case metadata

The existing case metadata markup remains unchanged so #9 owns the eventual case grammar. The shared visual system nevertheless removes the Ares 1.x “metadata chip” treatment.

Metadata now renders as a ruled editorial band:

- four columns on larger widths;
- two columns on narrow screens;
- small uppercase labels;
- no filled pills, rounded corners or badges.

This is a visual primitive, not a structural decision for #9.

## 9. Chronology and tables

Chronology remains a semantic list. The visual system replaces the decorative gold timeline spine with separated chronological rows and a small positional marker. Dates use a high-contrast sans treatment.

Tables use:

- transparent/light surfaces;
- strong top/header rules rather than dark filled headers;
- quiet row separators;
- compact sans typography;
- intentional wide breakout width.

The responsive transformation and final comparative-data behavior remain #9 ownership.

## 10. Glossary and explainers

Glossary terms are presented as quiet dotted underlines with strong `:focus-visible` treatment. The visual system does not rely on a background tint to communicate keyboard focus.

Explainer containers are no longer elevated cards. They use wide editorial measure and horizontal rules. The legacy process-stage scale/drop-shadow hover effect is removed because interaction should not make uncertain scholarly content feel more authoritative or dramatic.

Final glossary/process mechanics remain #10 ownership.

## 11. Responsive behavior

The visual system was exercised at:

- 360×812;
- 390×844;
- 412×915;
- 768×1024;
- 1024×768;
- 1280×800;
- 1366×768;
- 1440×900;
- 1600×1000.

Observed visual-system invariants:

- no page-level horizontal overflow at any tested width;
- the reading column remains narrow on laptop/desktop rather than expanding with the viewport;
- case metadata reflows to two columns below 768px;
- title and case display type scale down without clipping;
- narrative/testimony and analytical treatments remain visibly distinct on phone widths;
- the table breakout is constrained to the viewport while its own wrapper retains horizontal scrolling for wide table content;
- focus-ring colour remains visible against the warm canvas/paper system.

Navigation behavior at these widths is not certified by this issue; #7 owns the responsive navigation model.

## 12. Motion

#8 does not establish Ares 2.0 motion language. Existing ornamental section reveal styling is neutralized in the visual foundation so the page does not depend on scroll animation for hierarchy. #11 may later add restrained motion under the #5 ethical contract.

Utility transitions already tied to existing controls remain minimal and are still disabled by `prefers-reduced-motion`.

## 13. Accessibility baseline

The stylesheet:

- increases contrast for metadata, links, narrative labels and utility text;
- uses a 3px high-contrast `:focus-visible` ring;
- does not suppress glossary focus outlines;
- retains reduced-motion handling;
- adds a `prefers-contrast: more` palette;
- keeps type scalable through `rem`/`clamp()` values;
- avoids colour-only distinction for the dual voice.

This does not replace #12’s full WCAG 2.2 AA hardening. It ensures the visual foundation does not knowingly preserve the contrast/focus defects identified in #4.

## 14. Handoff / integration boundaries

### #7 navigation

Use the CSS tokens in `:root`, especially ink, rules, accent, type families and gutters. #7 may replace the current nav markup and breakpoint behavior. Preserve the publication’s narrow reading measure and avoid turning the navigation into a persistent app shell.

### #9 case studies

Treat these as shared visual primitives, not locked case grammar:

- display-serif case title;
- ruled metadata band;
- narrative left-rule treatment;
- attached testimony attribution;
- analytical label hierarchy;
- chronology rule/marker language;
- table typography.

#9 may restructure markup when the content model/provenance work requires it, but should reuse the tokens and editorial hierarchy rather than reintroducing cards or chips.

### #10 explainers

Use the same wide editorial measure, rules, UI type, focus token and paper/ink palette. Tooltip/panel styling is provisional; #10 owns the final interaction model and may remove those surfaces if the chosen glossary/process pattern does not need them.

### #11 motion

The visual system intentionally contains almost no ornamental motion. Add only motion that clarifies state/relationship and remains appropriate to the subject.

## 15. Files owned by this implementation

- `01-core/stylesheet.css` — production visual source.
- `04-docs/docs/Ares_2_Visual_System.md` — visual-system implementation record.

No case-study source, scholarly claim, navigation structure, process taxonomy or generated HTML is edited by Issue #8.
