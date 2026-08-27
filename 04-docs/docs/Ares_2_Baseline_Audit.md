# Ares 2.0 Baseline UX, Design and Product Audit

Issue: #4 — establish rendered baseline and UX/design audit  
Branch: `ares-2/4-baseline-audit`  
Audited baseline: `main` at `0ae83ea923f0dbdbe211e66e54a5c581939ca07e`  
Production: GitHub Pages deployment from the same SHA

## Executive summary

Current Ares has a credible foundation for Ares 2.0: it is sober, text-first, readable without JavaScript, structurally consistent, and already has useful editorial primitives for narrative versus analytical material, case-study chronology, glossary definitions, comparative data and the process model. The redesign should preserve those strengths rather than replace the product with an application shell.

The largest problem is not visual polish. The central process-model interaction currently presents a different escalation taxonomy from the surrounding Ares prose. The rendered SVG and interactive stage data use an eight-stage sequence (`Discrimination → Dehumanization → Organization → Polarization → Preparation → Persecution → Extermination → Denial`), while the authored Part IV source describes a six-stage sequence (`Political Grievance Framing → Propaganda & Fear Inculcation → “Eliminate” Decision → Organizational Logistics → Mass Atrocity Execution → Denial`). Because the process model is a core scholarly claim and a headline interaction, this is a **P0 content/product-integrity defect**. Ares 2.0 should not build a stronger visual treatment around it until the authoritative model and provenance are settled.

The next tier is mostly mobile and accessibility. The current process SVG becomes effectively illegible on phones; off-canvas navigation remains keyboard-focusable while invisible; glossary/process controls expose incomplete focus and semantic state; the glossary drawer does not manage focus; and several small-text/control color combinations miss WCAG AA contrast. These are objective defects, not aesthetic preference.

Ares does **not** currently provide evidence that a framework migration is necessary. The static Markdown/JSON → generated HTML → vanilla CSS/JS → GitHub Pages model remains a strong fit for a reading-first publication. The architecture issue should instead focus first on source-of-truth integrity, builder decomposition where useful, and a real automated browser/accessibility/visual QA harness.

## Audit method and evidence boundary

Issue #4 requires the deployed site and repository to be treated together, with rendered output as primary evidence.

### Production/deployment verification

- Current `main` is `0ae83ea923f0dbdbe211e66e54a5c581939ca07e`.
- GitHub Actions run `28657472504` successfully built and deployed GitHub Pages from exactly that SHA.
- The deployment workflow runs `python build.py --quiet`, stages `01-core/index-with-content.html` as the published `index.html`, copies `stylesheet.css`, `script.js` and `02-assets/`, then deploys the Pages artifact.
- The successful Pages artifact was 2,749,610 bytes.
- The direct Pages origin was not network-reachable from the execution sandbox used for this audit. To avoid pretending otherwise, production parity was established through the exact deployment SHA/workflow, then representative browser states were rendered in headless Chromium using the production markup/style values for those states. Repository findings were checked against the generated HTML, CSS, JS and source Markdown at the deployed SHA.

This is therefore not a source-only review, but it also does not claim a network trace from the public Pages origin that could not be performed in the environment.

### Rendered viewport checks

Representative desktop and phone states were rendered at 1440×900, 1366×768, 375×812 and 320×740. The following measurements are reproducible directly from current production CSS/SVG geometry:

| State | Observed result |
| --- | --- |
| 1440 px desktop | TOC is docked and hamburger hidden. Process SVG renders about 668 px wide inside the 736 px diagram surface. |
| 1366 px desktop/laptop | TOC is translated off-canvas and the only entry point is a 30×30 px hamburger. The visually hidden TOC links remain in the keyboard tab order. |
| 375 px phone | Process SVG is about 323 px wide. A 120×80 SVG stage renders at about 49×33 px; 10–12 px SVG labels render at about 4.0–4.8 CSS px. Comparative table viewport is about 359 px while content needs about 498 px, producing horizontal scrolling. Glossary panel is 280 px wide. |
| 320 px phone | Process SVG is about 268 px wide. A stage is about 41×27 px; 10–12 px labels render at about 3.4–4.0 CSS px. Comparative table viewport is about 304 px against about 498 px of content. Glossary panel remains 280 px wide. |
| Reduced motion | `scroll-behavior` becomes `auto`; animations/transitions are effectively disabled. This is working as intended. |

The phone process-model defect is visible without instrumentation: the full 800×600 desktop diagram is simply scaled down, leaving labels too small to read and vertical stage targets too short for reliable touch interaction.

### Design-review skill availability

Issue #4 asks for the Humbleteam Design Review skill if available. It was not available in the installed skill catalogue, plugin catalogue, or repository. The audit therefore uses the issue's explicit criteria directly and does not claim that Humbleteam was run.

## Strengths to preserve

### 1. The product is already text-first and appropriately restrained

The generated page contains no `<img>` elements. The live document is therefore dominated by text, data and the inline process SVG rather than sensational imagery. The content note explicitly prepares readers for difficult material without turning the whole interface into a warning state. This is appropriate for the subject.

**Preserve:** scholarly seriousness, low visual sensationalism, content-first loading and the ability to read the core publication without JavaScript.

### 2. The dual-voice concept is genuinely useful

Ares clearly separates narrative/witness material from analytical reconstruction. Narrative vignettes use a warm treatment; analytical sections use a cooler treatment; the front matter teaches the distinction. This gives readers a reliable grammar for switching between human-scale testimony and explanatory argument.

**Preserve:** the semantic distinction. Ares 2.0 can refine its visual expression, but should not collapse the two voices into one undifferentiated article style.

### 3. Case-study information architecture is strong

Each historical case follows a predictable pattern:

1. case title and short epigraph;
2. compact metadata (type, duration, deaths, location);
3. place/date narrative opening;
4. attributed witness quotation;
5. historical context;
6. chronology;
7. atrocity pattern;
8. psychological/societal drivers;
9. aftermath and legacy.

This repetition is productive: readers learn the structure once and can compare cases more easily.

**Preserve:** this editorial sequence even if the visual containers change.

### 4. Long-form reading fundamentals are sound

The main reading column is capped at 800 px, body copy uses a serif face at generous line-height, headings are distinct, and paragraph/list spacing is generally comfortable. The page also provides a reading-progress indicator and a hierarchical TOC.

**Preserve:** narrow reading measure, typographic calm and document hierarchy.

### 5. Glossary progressive disclosure is a useful concept

Glossary terms are discoverable inline, short definitions appear near the term, and click/keyboard activation can expose longer definitions. A full glossary also exists in the appendix, so the publication does not depend on the interactive treatment for access to the material.

**Preserve:** progressive enhancement and a non-JavaScript fallback path.

### 6. Reduced-motion and print handling are already present

The stylesheet respects `prefers-reduced-motion`, removes smooth scrolling and effectively suppresses transitions/animations. Print styles also remove navigation chrome and simplify the page.

**Preserve:** these as baseline requirements, not optional polish.

### 7. Static deployment is simple and reproducible

The current pipeline rebuilds the document and deploys a static Pages artifact. Core reading does not require client routing, authentication, a backend or application state.

**Preserve unless a later requirement proves otherwise:** durable static output and graceful reading without JavaScript.

---

## Prioritized findings

Severity definition for this audit:

- **P0** — blocks a trustworthy Ares 2.0 direction or materially misrepresents the publication.
- **P1** — major usability, accessibility, mobile or editorial-integrity problem that should be resolved during the redesign programme.
- **P2** — meaningful polish/quality/technical debt that should be addressed but need not block direction-setting.

### P0 — Process model contradicts the authored model

**Category:** editorial/product integrity; interaction; architecture/source of truth

**Before**  
The inline SVG and `ARES_PROCESS_STAGES` expose eight stages: Discrimination, Dehumanization, Organization, Polarization, Preparation, Persecution, Extermination and Denial. Immediately below, Part IV describes Dutton, Boyanowsky & Bond's integrated model as six different stages: Political Grievance Framing, Propaganda & Fear Inculcation, an “Eliminate” decision, Organizational Logistics, Mass Atrocity Execution and Denial. The glossary's escalation entry also describes the six-stage pattern.

**After / required outcome**  
Ares must have one authoritative process model with explicit provenance. Diagram labels, interactive detail, glossary copy, analytical prose and any future mobile representation must derive from or be validated against that same source of truth. If Ares intentionally presents multiple models, they must be named and distinguished rather than blended.

**Why**  
This is the publication's central explanatory interaction. A polished but internally contradictory model would increase, not reduce, the risk of misleading readers.

### P1 — Historical claims and testimony need source-level provenance

**Category:** editorial/product; ethical presentation

**Before**  
The case studies contain detailed chronology, death estimates, witness quotations and historically contested/high-stakes claims, but the rendered publication ends with a single source/further-reading entry for the Dutton et al. paper. The interface visually elevates witness quotations without exposing the underlying citation trail.

**After / required outcome**  
Ares 2.0 needs an editorial citation/provenance policy capable of distinguishing: source-paper claims, project synthesis, witness/testimony sources, quantitative estimates and genuinely contested claims. The exact UI is a #5 decision; the audit requirement is that provenance become visible and durable.

**Why**  
For a publication about genocide and mass killing, sourcing is part of ethical interaction design, not appendix decoration. It also prevents “documented testimony” from being presented as a decorative quotation treatment detached from evidence.

### P1 — The process model is not a viable phone interaction

**Category:** responsive/mobile; interaction; accessibility

**Before**  
The 800×600 SVG is set to `width: 100%` with no mobile-specific representation. At 375 px the production geometry yields about 323 px of SVG width, shrinking 10–12 px SVG labels to roughly 4.0–4.8 CSS px and stages to roughly 49×33 px. At 320 px labels fall to roughly 3.4–4.0 px and stages to roughly 41×27 px.

**After / required outcome**  
The process model must have a phone-first representation in which every stage label is normally legible, every interactive target is comfortably operable, the sequence remains comprehensible, and the same information is available to keyboard/screen-reader users. This audit does not prescribe whether that is a reflow, list, stepper, horizontally navigable graphic or another pattern.

**Why**  
This is a core learning element, not optional decoration. Simple desktop-to-phone scaling fails its basic reading and interaction purpose.

### P1 — Off-canvas TOC is still keyboard-focusable and exposes no expanded state

**Category:** accessibility; responsive navigation

**Before**  
Below 1440 px, `.sticky-nav` is moved out of view using `transform`; it is not removed from the accessibility tree or tab sequence. Reproduced keyboard traversal at 1366 px moves from the visible hamburger directly to a TOC link whose rendered x-position is about −276 px. The hamburger is a `div role="button"` with an accessible label, but it has no `aria-expanded` or `aria-controls` state.

**After / required outcome**  
Closed navigation must not receive focus off-screen. The trigger must expose its relationship and open/closed state, and focus behavior must remain predictable when the menu opens and closes.

**Why**  
Keyboard users can currently “lose” focus into invisible controls. This is an objective interaction defect.

### P1 — Glossary and process controls have incomplete focus/semantic behavior

**Category:** accessibility; interaction

**Before**  
Glossary terms are converted to `role="button"` and receive keyboard handlers, but their stylesheet explicitly removes the normal focus outline and substitutes only a subtle background tint. The glossary side panel has no landmark/dialog role or programmatic label; opening it leaves focus on the source term, while the close button and newly revealed content appear elsewhere on screen. There is no focus restoration contract beyond focus never moving in the first place.

Process-model stages are also converted to `role="button"`, but receive no accessible name derived from their visible stage label, and no `aria-pressed`/selected state. They rely on browser-default SVG focus rendering rather than a deliberate focus treatment.

**After / required outcome**  
Every interactive term and stage needs an obvious keyboard focus state, a meaningful accessible name/state, and coherent focus behavior when supplementary content opens. The glossary detail surface needs an explicit semantic role appropriate to the final interaction model.

**Why**  
“Enter/Space works” is not equivalent to an accessible interaction. Users must be able to locate focus, understand the control and know what changed.

### P1 — Several current color combinations miss the project's WCAG AA target

**Category:** accessibility

The stylesheet declares WCAG 2.1 AA as a project target, but several production combinations fall below 4.5:1 for normal-size text. WCAG relative-luminance calculations from current tokens give approximately:

| Use | Contrast |
| --- | ---: |
| standard link blue `#4682B4` on white | 4.11:1 |
| hover green `#6B8E23` on white | 3.81:1 |
| reading metadata `#8A94A6` on white | 3.06:1 |
| vignette kicker `#A08020` on `#FFFBEB` | 3.61:1 |
| vignette citation `#8A7A4A` on `#FFFBEB` | 4.08:1 |
| active-nav white text on `#4682B4` | 4.11:1 |
| active-nav hover white text on `#5A94C7` | 3.23:1 |
| side-panel close icon `#999` on white | 2.85:1 |

Body text itself is strong (about 12.6:1 on white), so this is a targeted system problem rather than a wholesale readability failure.

**After / required outcome**  
The Ares 2.0 visual system should validate all small text, focus indicators and UI controls against its declared accessibility target as tokens/components are defined.

**Why**  
These are measurable accessibility misses, especially in metadata, citations and navigation states that already use small type.

### P1 — Long-document orientation disappears too early on desktop/laptop

**Category:** editorial/product; responsive navigation

**Before**  
The full TOC is persistently docked only at `min-width: 1440px`. A common 1366 px laptop gets the same hidden-menu mental model as a phone, despite Ares containing six major parts, eight case studies and appendices. A top progress bar communicates completion but not location or nearby structure.

**After / required outcome**  
#5 should define a deliberate long-form orientation model by viewport rather than using one 1440 px switch. Readers should be able to answer “where am I, what is nearby, and how do I move to another case/part?” without excessive menu toggling.

**Why**  
This is a publication-navigation problem, not merely a breakpoint preference.

### P2 — Comparative-table overflow works technically but is weakly discoverable

**Category:** responsive/mobile; interaction

**Before**  
`.table-wrap` correctly enables horizontal scrolling. In the representative phone render, the table needs roughly 498 px while the viewport offers 359 px at 375 and 304 px at 320. The right-hand columns simply continue off-screen; there is no persistent cue that the table is horizontally navigable.

**After / required outcome**  
The redesign should make additional columns discoverable and preserve row/column relationships at phone width. #5 can decide whether the right answer is improved scrolling affordance, responsive transformation or another editorial pattern.

**Why**  
The current implementation prevents page-level overflow, which is good, but does not communicate the interaction.

### P2 — Front matter is informative but too front-loaded on phone

**Category:** editorial/product; responsive/mobile

**Before**  
Before Part I, readers encounter the title/subtitle, reading metadata, a substantial executive summary, content note, “How to Use” explanation and a two-part voice legend. Each element is defensible independently, but together they delay the first substantive section and create a long onboarding sequence on a narrow screen.

**After / required outcome**  
#5 should decide what a first-time reader must understand immediately and what can be progressively disclosed or moved closer to the moment it becomes useful.

**Why**  
The issue is pacing and hierarchy, not missing content.

### P2 — Repeated rounded surfaces make the publication feel more like UI cards than editorial structure

**Category:** visual/editorial design

**Before**  
Narrative vignettes, analytical sections, process detail, content notes and other blocks repeatedly use tinted backgrounds, borders, radii and elevation. The semantic distinction is useful, but across eight cases the repeated “boxed” treatment fragments the reading flow and competes with typography for hierarchy.

**After / required outcome**  
Preserve the semantic dual-voice system while allowing #5 to determine a more publication-like hierarchy with fewer competing surfaces.

**Why**  
This is a design-quality judgment, not an accessibility defect; it should therefore remain P2 and should not be “fixed” independently before the design brief.

### P2 — Motion is mostly benign, but some effects are ornamental

**Category:** interaction; ethical presentation

**Before**  
Sections can reveal on scroll and process stages scale/drop-shadow on hover/activation. Reduced-motion support is good and disables these effects for users who request it.

**After / required outcome**  
#5 should define motion as informational and restrained. Motion should aid orientation/state change, not dramatize atrocity content.

**Why**  
The implementation is not currently harmful, but Ares 2.0 needs an explicit rule before richer interactions are introduced.

### P2 — Quality tooling is declared but not enforced

**Category:** performance/technical; QA

**Before**  
`01-core/package.json` declares HTML validation, accessibility and Lighthouse scripts, but the repository's GitHub Actions surface contains only the Pages deployment workflow. There is no enforced multi-viewport browser, accessibility or visual-regression gate protecting the generated experience.

**After / required outcome**  
#6 should define a small CI quality harness around the static output: HTML validation, automated accessibility checks, browser interaction coverage, representative viewport screenshots/visual diffs, and performance checks with thresholds appropriate to a static publication.

**Why**  
Several P1 defects in this audit are exactly the type that a browser/a11y regression suite should catch.

### P2 — Deployed artifact contains substantial unused media weight, but runtime performance is otherwise not alarming

**Category:** performance/technical

**Before**  
The repository contains a 2,719,226-byte PNG under `02-assets/images/`, and the Pages workflow copies the entire `02-assets` folder. The generated HTML does not reference that image and contains no `<img>` elements, so this increases the deployment artifact/repository footprint rather than the browser's initial page transfer. Core authored assets are comparatively modest: generated HTML about 162 KB, CSS about 22 KB, JS about 10 KB.

The document also uses externally hosted Google Fonts, so first render depends on a third-party font request unless cached.

**After / required outcome**  
#6 should distinguish deployment hygiene from real runtime bottlenecks. Remove or exclude genuinely unused assets, measure the actual public page, and preserve the current text-first bias. Do not use the 2.75 MB artifact size as justification for a framework migration.

**Why**  
Performance work should follow browser evidence rather than bundle folklore.

---

## Findings by required audit category

### Editorial/product

- **P0:** contradictory process-model taxonomies.
- **P1:** source/provenance model is insufficient for detailed historical claims and testimony.
- **P1:** long-document orientation is weak on normal laptop widths.
- **P2:** front matter is too front-loaded on phone.
- **P2:** repeated card/surface treatment fragments long-form reading.
- **Strength:** case-study information architecture and dual-voice distinction are worth preserving.

### Responsive/mobile

- **P1:** process diagram becomes unreadable/unreliable on phones.
- **P1:** navigation collapses to a small 30×30 trigger below 1440 px; common laptop widths lose persistent orientation.
- **P2:** comparative table scrolls horizontally but does not signal that more columns exist.
- **P2:** 280 px glossary panel dominates a 320 px viewport and lacks a mobile-specific presentation model.

### Interaction

- **P1:** glossary drawer and process stages have incomplete semantics/state/focus behavior.
- **P1:** closed TOC remains keyboard-interactive off-screen.
- **P2:** ornamental reveal/scale motion should be governed by a stricter Ares 2.0 motion philosophy.
- **Strength:** glossary and process details are progressively enhanced rather than required for basic reading.

### Accessibility

- **P1:** invisible off-canvas focus path.
- **P1:** glossary focus indication is deliberately suppressed; panel focus is unmanaged.
- **P1:** process-stage accessible names/states are incomplete.
- **P1:** multiple small-text/control contrast combinations miss AA.
- **P2:** no skip link is present for bypassing repeated navigation.
- **Strength:** semantic `main`/`nav`/`aside`/`footer`, keyboard activation handlers, `aria-live` process detail, reduced-motion and print modes are useful starting points.

### Performance/technical

- **P2:** no automated browser/a11y/visual QA gate.
- **P2:** full assets directory is deployed even when media is unused.
- **P2:** external font dependency should be measured, not assumed harmless.
- **Observation:** current HTML/CSS/JS sizes do not by themselves establish a performance or framework problem.
- **Strength:** static output, minimal JS and no runtime dependency for reading are appropriate for the product.

---

## Design principles Ares 2.0 should respect

These are constraints derived from the baseline, not a visual redesign:

1. **Scholarly integrity before interaction polish.** An interactive claim must be sourced, internally consistent and no less rigorous than prose.
2. **Publication, not dashboard.** Typography, hierarchy and editorial pacing should do more work than cards, chrome or component surfaces.
3. **Two voices, one standard of evidence.** Narrative testimony and analytical explanation may look different, but neither is decorative and both need provenance.
4. **Mobile is a first-class reading mode.** Complex desktop visuals must recompose, not merely shrink.
5. **Orientation is part of reading.** A long publication needs persistent or quickly recoverable structural context across realistic laptop and phone widths.
6. **Core reading must survive without JavaScript.** Interactivity should enrich comprehension rather than gate content.
7. **Motion must communicate, never dramatize suffering.** Reduced-motion support remains mandatory.
8. **Accessibility is behavioral, not checkbox ARIA.** Focus visibility, focus order, accessible names/states, contrast and responsive interaction all need browser-level verification.
9. **Sensitive material should remain restrained.** No gamification, militaristic spectacle, gratuitous gore or cinematic dramatization.
10. **Prefer one source of truth for important structured concepts.** Process-model labels/details/prose should not be able to drift independently.

## Product questions #5 should answer

1. What is Ares primarily: an interactive scholarly publication, a research synopsis, a teaching resource, or an explicit combination? The interface should have one dominant mental model.
2. Which process model is authoritative, what is its provenance, and is Ares presenting the source paper's model, a project synthesis, or multiple named frameworks?
3. What is the citation/provenance contract for case facts, estimates, witness testimony, quotations and contested claims?
4. How should narrative and analytical voices remain distinguishable without turning every section into a card?
5. What information must appear before Part I, and what onboarding/help can be disclosed contextually?
6. What is the long-document orientation model at phone, tablet, laptop and wide desktop widths?
7. What is the phone representation for process models, tables, timelines and future maps?
8. How should glossary detail behave on touch devices and for keyboard/screen-reader users: inline disclosure, non-modal drawer, dialog, or another pattern?
9. What is the imagery policy? The current rendered page is effectively image-free; any Ares 2.0 imagery should have an explicit evidentiary/ethical purpose.
10. What motion is permitted, and what should remain static because the subject does not benefit from animation?

## Material implications for #5

Issue #5 should not begin by choosing colors, cards or typography tokens. The audit materially changes its order of operations:

1. **Resolve the P0 process-model provenance/taxonomy first.** The design brief cannot define the flagship interaction while its content model is internally contradictory.
2. **Make citation/provenance part of product design.** Witness material must read as testimony/evidence, not as decorative pull quotes.
3. **Preserve the dual-voice concept, not necessarily the current boxes.** The existing distinction is one of Ares's strongest ideas; the current repeated surface treatment is not sacred.
4. **Treat mobile complex-content patterns as first-class decisions.** Process model, comparative table, glossary and navigation all need explicit phone behavior in the brief.
5. **Define orientation before visual polish.** Ares is too long for a generic hamburger-at-everything-under-1440 approach.
6. **Keep the current ethical restraint.** The absence of sensational imagery, respectful content note and reduced-motion behavior are positive baseline evidence.

## Material implications for #6

The audit does **not** justify React, an SPA or a broad migration programme.

1. **Default to preserving the static-content model.** Markdown/structured data → static HTML remains a good product fit and keeps basic reading durable.
2. **Treat the P0 model drift as a source-of-truth problem.** The process SVG, prose and interactive detail must not be independently editable representations of the same scholarly concept. #6 should prefer a structured source that can generate/validate all representations.
3. **Builder modernization should target separation of concerns, not fashion.** `unified_builder.py` is roughly 43 KB and currently produces a roughly 162 KB monolithic document. That size is not itself a reason to migrate, but the process-model drift shows why clearer ownership/validation boundaries matter.
4. **Add the missing quality harness.** At minimum: generated-HTML validation, axe-style automated accessibility checks, Playwright browser coverage for TOC/glossary/process interactions, phone/laptop/wide-desktop visual snapshots, reduced-motion coverage and targeted Lighthouse/performance checks.
5. **Keep basic reading independent of JavaScript.** Any modernization must retain that current strength.
6. **Measure real runtime performance before optimizing architecture.** The large PNG currently bloats the deployed artifact but is unreferenced by the page. Fix deployment hygiene separately from browser-load performance.
7. **Decide generated-artifact ownership explicitly.** If `index-with-content.html` remains committed, CI should verify it is in sync with sources; if it becomes build-only, deployment/tests must build it deterministically.

## Acceptance check against Issue #4

- [x] Current `main` inspected at the deployed SHA.
- [x] GitHub Pages deployment/build artifact verified against that exact SHA.
- [x] Representative desktop and mobile rendered states checked.
- [x] First-load/title, long-form typography and dual-voice system reviewed.
- [x] TOC, current-location behavior and mobile navigation reviewed.
- [x] Representative case-study opening, chronology, analysis and aftermath reviewed.
- [x] Glossary discovery, keyboard activation and detail panel reviewed.
- [x] Process-model content, rendering, interaction and responsive behavior reviewed.
- [x] Comparative table and phone overflow behavior reviewed.
- [x] Content note, witness quotation treatment and sensitive-material presentation reviewed.
- [x] Keyboard focus, semantic state, contrast and reduced-motion behavior reviewed.
- [x] Obvious performance/deployment/QA concerns reviewed without inferring a framework requirement.
- [x] Strengths and problems separated; major problems prioritized P0/P1/P2.
- [x] Important findings use Before / After / Why outcomes rather than implementation designs.
- [x] Audit only: no production redesign, architecture migration or historical-content rewrite included in this branch.
