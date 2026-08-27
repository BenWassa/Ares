# Ares 2.0 Product, Editorial and Design Brief

**Status:** Authoritative Ares 2.0 product/editorial/design direction  
**Issue:** #5 — define product, editorial and ethical design direction  
**Evidence baseline:** #4 / `Ares_2_Baseline_Audit.md`  
**Supersedes:** `Design_Vision.md` as the active design authority  
**Scope:** Direction-setting only. This document does not implement the production redesign.

---

## 1. Product thesis

**Ares 2.0 is an evidence-led, long-form interactive digital-humanities publication that interprets Dutton, Boyanowsky & Bond (2005) through historically grounded case studies and comparative analysis. Its primary mental model is a scholarly editorial publication: interaction, exhibition-like orientation and educational affordances exist to clarify the argument and evidence, not to turn the work into an app, dashboard or spectacle.**

This resolves the relationship between the labels previously used around the project:

- **Long-form publication** is the primary product identity and reading model.
- **Interactive essay** describes the editorial form when explanation benefits from interaction.
- **Research synopsis** describes Ares's relationship to the Dutton et al. paper, not a promise that every historical statement originates in that paper.
- **Digital exhibition** is a quality bar for curation, context and humane presentation, not a mandate for immersive or cinematic effects.
- **Educational resource** is an important use case, not a separate product mode. Ares should support teaching and study without quizzes, completion mechanics or gamification.

Ares is not an original historical monograph and must not imply that it is. Where it moves beyond the source paper into case reconstruction, synthesis or interpretation, that authorship boundary must be visible.

### Audience and core use cases

Ares should serve three overlapping reading modes:

1. **Guided reading:** a reader follows the argument from conceptual foundations through cases, comparison, process analysis and implications.
2. **Focused study:** a student, educator or research-adjacent reader enters a specific case, concept, chronology or comparison directly and needs enough orientation to understand how it fits the larger argument.
3. **Reference and return:** a reader revisits a definition, source, testimony passage, process concept or case without rereading the entire publication.

The experience must support all three without maintaining separate app modes.

---

## 2. Evidence from the #4 audit that changes Ares 2.0

The redesign is not a cosmetic refresh. #4 established product constraints that change the brief itself:

- The current process explainer has a **P0 scholarly-integrity conflict**: authored prose describes six stages while the rendered SVG and builder expose a different eight-stage taxonomy.
- Detailed historical claims, casualty estimates, chronology and witness quotations are presented with **insufficient source-level provenance**.
- The current process diagram is not a viable phone experience; desktop geometry is merely reduced until labels become unreadable.
- Below 1440px, ordinary laptops lose persistent document orientation and inherit mobile-style navigation.
- Glossary/process interactions have incomplete keyboard, focus and semantic behavior.
- Several current small-text/control colour combinations miss AA contrast.
- Repeated rounded, tinted and elevated surfaces fragment long-form reading and make the publication feel more like a collection of UI cards than an authored editorial composition.
- The opening sequence becomes too front-loaded on narrow screens.

At the same time, #4 identified strengths that Ares 2.0 should preserve: text-first reading, durable static content, narrow reading measure, strong case-study information architecture, progressive enhancement, the dual narrative/analytical voice, reduced-motion support, printability and restrained treatment of sensitive material.

These are product requirements, not nostalgia for the current visual implementation.

---

## 3. Editorial journey and document hierarchy

Ares should remain readable front to back, but every major part must also make sense as a deliberate entry point.

### Opening / title

The opening should establish, quickly:

- what Ares is;
- what source paper anchors it;
- what the reader will encounter;
- a concise content note appropriate to the subject;
- a clear path into the argument or contents.

The current long sequence of executive summary, content note, usage instructions and voice legend should not all demand attention before Part I. The minimum orientation belongs up front; detailed “how to use,” voice explanation and interaction help should appear contextually or be progressively disclosed.

### Conceptual framework

Part I should establish definitions, the paper's central questions, theoretical lenses and the boundary between **what Dutton et al. argue** and **what Ares later synthesizes or adds**. Source attribution is part of the explanatory hierarchy, not footer furniture.

### Case studies

Preserve the strongest current case grammar:

1. case identity and place/time context;
2. compact, sourced metadata where it aids comprehension;
3. human-scale narrative/testimony opening;
4. historical context;
5. chronology;
6. atrocity pattern and organizational dynamics;
7. psychological/social analysis;
8. aftermath, accountability and memory.

Not every subsection must receive equal visual weight. The hierarchy should help readers distinguish evidence, chronology, interpretation and reflection.

A reader who lands directly in a case must be able to tell which part they are in, why the case is present, and how to move to the previous/next case or the comparative argument without returning to the top of the publication.

### Comparative analysis

Comparison should synthesize patterns without reducing cases to scorecards. It may use tables, small multiples or structured prose, but the editorial question must lead the format. Casualty counts cannot become a proxy for historical or legal significance.

### Process model / escalation explanation

This section remains a potentially important synthesis, but its scholarly model must be settled before its interaction is made more persuasive. The process integrity decision in Section 7 is binding on #10.

### Prevention / implications

Claims about intervention, warning signs and prevention must identify whether they are drawn from Dutton et al., another named framework, later scholarship or Ares synthesis. Prescriptive claims require at least as much provenance discipline as historical claims.

### References and glossary

Both are durable parts of the publication, not utility drawers that exist only when JavaScript works.

- Inline glossary cues may progressively disclose definitions, but a complete glossary must remain directly addressable and readable.
- Citations and source notes must be discoverable at the point of use and resolve to complete reference information.
- Core reference access must survive failed or disabled JavaScript.

### Non-linear orientation contract

At every major entry point, readers should be able to answer three questions with little effort:

1. **Where am I?** — part, case or appendix context.
2. **How does this fit?** — the role of the section in the argument.
3. **Where can I go next?** — nearby structure and a route to the full contents.

The exact controls belong to #7. The product requirement does not.

---

## 4. Hierarchy and composition principles

Ares 2.0 should feel composed like a serious publication, not assembled from a component catalogue.

1. **Typography and spacing do most of the hierarchical work.** Containers, colour fills and icons are secondary tools.
2. **Sustained prose stays at a comfortable reading measure**—roughly the range associated with 60–75 characters per line—rather than stretching because a desktop is wide.
3. **Wide editorial material gets a deliberate breakout canvas.** Comparative tables, diagrams, maps and chronologies may extend beyond the prose measure when the content requires it, then return the reader to the text column.
4. **Major transitions should be unmistakable without theatrical dividers.** Part, case and appendix boundaries deserve stronger rhythm than ordinary subsections.
5. **Metadata is subordinate but fully legible.** Small type is not permission for low contrast or cramped density.
6. **Whitespace controls pacing, not prestige.** Ares should not imitate sparse luxury-product pages; difficult arguments and evidence can be information-dense when structure remains clear.
7. **Do not wrap every semantic distinction in a card.** Use alignment, rules, type, measure and spacing before adding a surface.

---

## 5. Narrative and analytical voice

The dual-voice concept survives into Ares 2.0. The current warm-versus-cool card treatment does not.

### Analytical voice

Analytical material carries definitions, causal arguments, comparisons, source-paper interpretation and project synthesis. Its presentation should be structured, economical and citation-forward. It can support denser information, tables and explanatory figures, but must still read as editorial prose rather than a dashboard.

### Narrative / testimony voice

Narrative material operates at human scale. It may use a different typographic rhythm, measure, label treatment and spacing from analytical prose, but it must never become a visual “emotion layer” whose purpose is to make the page dramatic.

The distinction between voices must use at least two non-colour cues, such as:

- explicit section/voice labels;
- typographic role or style;
- spacing and measure;
- rule/indent/alignment pattern;
- source/attribution treatment.

Colour may reinforce the distinction but cannot carry it alone.

### Witness material is evidence

Witness and survivor material is not a pull-quote asset. A testimony treatment must keep the evidence chain attached to the words.

Where known and relevant, testimony should expose:

- speaker / witness identity;
- role or relationship to the event;
- place/date or recollection context;
- source container (diary, interview, memoir, tribunal record, contemporaneous report, etc.);
- citation/reference;
- translation or indirect-citation status when applicable.

Do not isolate a quotation at display scale merely because the wording is powerful. Do not use giant quotation marks, quote carousels or “hero” testimony. Attribution must stay visually and semantically attached.

Project-written case epigraphs must not look like historical quotations. If retained, they should be treated as editorial decks/summaries and labeled through structure rather than quotation styling.

### Narrative integrity rule

The current repository contains vivid, sometimes cinematic case narration. #5 does not rewrite it, but #9 must not preserve sensory detail merely because it reads well. Narrative detail that purports to reconstruct a scene must be traceable to a source or clearly presented as editorial synthesis; invented specificity is not an acceptable engagement technique.

---

## 6. Ares 2.0 provenance contract

Sourcing is part of the product experience. Ares must allow a reader to understand **what kind of claim they are reading and where it came from** without turning every paragraph into citation clutter.

The content model and presentation should distinguish at least these provenance classes:

| Class | Meaning | Required editorial treatment |
| --- | --- | --- |
| **Documented historical fact** | A factual historical statement supported by appropriate historical sources. | Cite the source set at a useful level of granularity. Do not imply the Dutton paper is the source when Ares used other material. |
| **Source-paper claim** | An argument, definition, finding or characterization attributed to Dutton, Boyanowsky & Bond (2005). | Attribute to the paper and, where practical, retain section/page-level traceability. |
| **Project synthesis** | Ares combines material from one or more sources into a new editorial framework, summary or comparison. | Label as Ares synthesis and cite the inputs. Do not back-attribute the synthesis to a source author. |
| **Interpretation** | An inferential or analytical reading rather than a directly documented fact. | Identify the interpreter (source scholar or Ares) and avoid declarative factual styling when uncertainty is material. |
| **Quantitative estimate** | Casualty counts, durations, proportions or other historical estimates. | Preserve ranges where sources disagree; identify source/date/method where material; avoid false precision and unsupported single-number metadata. |
| **Witness / testimony** | First-person or observer evidence from survivors, perpetrators, officials, journalists, rescuers or other witnesses. | Keep attribution, source context and citation attached. Treat quotation as evidence, not decoration. |
| **Contested / uncertain claim** | A claim for which attribution, causation, scale, classification or factual detail is materially disputed or uncertain. | Surface the uncertainty near the claim, describe the nature of the dispute where relevant, and cite competing/qualifying evidence rather than burying uncertainty in a generic bibliography. |
| **Legal or institutional finding** | A tribunal, court, commission or official investigatory finding. | Name the institution and decision/findings; do not silently convert a legal determination into universal scholarly consensus, or vice versa. |

### Provenance interaction rules

- **Point-of-use discoverability:** a reader should be able to reach the relevant source from the claim/testimony without hunting through a generic bibliography.
- **Full-reference durability:** every compact citation resolves to a stable full reference/endnote entry that remains available without advanced JavaScript.
- **No false primary sourcing:** if Ares encountered a witness quotation through Dutton et al. or another secondary source, it must not imply that Ares consulted the original diary/interview/record unless it did.
- **Quotation integrity:** quoted wording is preserved; editorial omissions, translations and paraphrases are distinguished from verbatim testimony.
- **Uncertainty is local:** materially disputed numbers or causal claims should communicate uncertainty where the reader encounters them.
- **Sources do not become badges:** citation UI should be quiet, legible and consistent rather than chip-heavy or status-like.

### Current integrity debt that remains after #5

The existing case studies, builder metadata and glossary contain detailed chronology, casualty estimates, legal/historical characterization and quotations without a sufficient source-level trail. This brief does **not** certify those claims and does not broadly fact-check them. It establishes the contract that later editorial implementation must satisfy.

The current front matter's assurances that narrative passages are grounded in “documented witnesses” and that analytical sections are “sourced” are not, by themselves, adequate provenance.

---

## 7. Process-model integrity decision

### Repository trace

The #4 audit identified two incompatible formulations:

- authored Part IV prose and the glossary describe a **six-part sequence**: grievance framing → propaganda/fear → elimination decision → organizational logistics → execution → denial;
- the SVG and builder describe an **eight-stage sequence**: Discrimination → Dehumanization → Organization → Polarization → Preparation → Persecution → Extermination → Denial.

Tracing their provenance changes the decision:

1. The six-part formulation appears in Ares's AI-assisted synopsis material (`04-docs/docs/edit.md`) and is expressed as an editorial synthesis of concepts discussed by Dutton et al. It should **not** be described as a named six-stage “Dutton integrated process model” unless a source review establishes that attribution.
2. The eight-stage formulation closely matches stages 3–10 of Gregory H. Stanton's **Ten Stages of Genocide** while omitting Classification and Symbolization. The current Ares repository does not attribute that lineage, and it should not be blended into a Dutton-derived model.
3. Dutton, Boyanowsky & Bond discuss recurring psychological, political and organizational processes—among them target-group construction, fear inculcation, decisions to eliminate an out-group, situational transitions and organizational conditions—but the source paper should not be represented as having authored either current Ares stage taxonomy without direct source support.

Primary references for the source review:

- Dutton, Boyanowsky & Bond (2005), *Extreme Mass Homicide: From Military Massacre to Genocide*, Aggression and Violent Behavior 10(4), DOI: https://doi.org/10.1016/j.avb.2004.06.002
- Gregory H. Stanton, *The Ten Stages of Genocide*, Genocide Watch: https://www.genocide-watch.com/genocide/tenstagesofgenocide.html

### Binding decision for Ares 2.0

**Ares will have one primary process explanation for this publication: an explicitly labeled _Ares synthesis of processes discussed by Dutton et al. (2005)_, only after its nodes, wording, relationships and source mappings have been reviewed against the paper. Ares will not silently blend this synthesis with Stanton or another stage framework.**

If Stanton's framework is editorially useful, it may be presented later as a **separate, fully attributed external framework**, not as missing/extra stages inside the Ares/Dutton synthesis.

The current eight-stage SVG taxonomy is therefore **not approved content for the Ares 2.0 flagship explainer**. The current six-stage wording is **not approved for attribution as “Dutton's six-stage model.”** It is a candidate editorial synthesis whose exact structure still requires source mapping.

### Bounded unresolved scholarly question

The remaining unresolved question is not “six or eight?” It is:

> What is the most defensible Ares synthesis of the processes actually described by Dutton et al.—including their relationships, sequencing and limits—and does the evidence justify presenting those relationships as a ladder at all?

That question requires scholarly source mapping/editorial review, not a visual-design choice.

**Implication for #10:** #10 may design the responsive and accessible *explanation pattern*, but it must not finalize a persuasive stage diagram, labels or causal sequence until the source map is approved. The final explainer must avoid implying a deterministic universal progression if the research does not support one.

**Implication for #6:** prose, glossary language, interactive detail and visual representation must eventually derive from, or be validated against, one structured scholarly source of truth so this drift cannot recur.

---

## 8. Visual character

Ares 2.0 should feel **sober, authored, documentary, contemporary and editorially confident**. The quality reference is high-end explanatory journalism and museum/digital-humanities publishing—not the visual tropes of any one newsroom.

### Typography

- Sustained reading should use a text face with strong long-form legibility and a durable fallback strategy.
- Display and navigation typography should establish a sharper editorial hierarchy without looking corporate, academic-template generic or militaristic.
- Serif/sans roles may change from the current Merriweather/Open Sans pairing; #8 owns the final selection.
- Avoid an “all-UI sans” app feel, novelty display faces, stencil/military typography, faux typewriter evidence styling and gratuitous uppercase.
- Long headings must wrap naturally. Do not solve difficult text by shrinking it into illegibility.

### Measure, density and rhythm

- Keep prose narrow enough for sustained reading.
- Let analytical figures become denser when the material benefits from density.
- Use stronger vertical rhythm around part/case transitions and quieter rhythm within subsections.
- Avoid both extremes: cramped research notes and over-spaced marketing pages.

### Palette

- Default toward paper/ink neutrals with a restrained accent system.
- Colour should identify links, focus, selected state and limited editorial roles, not paint every block.
- Narrative/analytical differences cannot depend on colour alone.
- Avoid blood-red identity systems, “danger” gradients, military olive as a thematic device and colour ramps that imply atrocity severity or inevitability.
- A light, reading-first presentation is the default. A future dark/system theme must preserve the same editorial meaning and contrast; a cinematic dark mode is not an Ares identity goal.

### Borders, surfaces and elevation

- Prefer whitespace, alignment and fine rules over boxed containers.
- Background washes should indicate a real editorial distinction, not be the default shape of content.
- Radius should be restrained and functional rather than a universal design signature.
- Elevation/shadow is primarily for genuinely layered/transient UI, not ordinary prose sections.
- Do not reproduce the current pattern of repeated tinted rounded cards with soft shadows across every case.

### Testimony and quotations

- Testimony appears as contextualized evidence, not decorative pull-quote content.
- Avoid giant quotation marks, oversized isolated sentences, theatrical italics, carousels and “quote cards.”
- Attribution/source information is part of the block's primary hierarchy.

### Data and tables

- Use an editorial/factbook language: clear labels, aligned values, strong row/column relationships and nearby source notes.
- Do not turn death counts and durations into KPI tiles.
- Avoid decorative charts when structured prose or a table communicates the comparison more truthfully.
- Interactivity such as sorting/filtering must earn its place by improving comprehension.

### Diagrams

- Diagrams should make relationships explicit through annotation and hierarchy rather than through glossy nodes, gradients or “flowchart card” styling.
- Every important diagram needs a logical text equivalent/alternate reading order.
- A narrow-screen representation may be structurally different from desktop; semantic equivalence matters more than visual sameness.

### Imagery

The default remains **text, documentary evidence, data and explanatory graphics first**.

Archival/documentary imagery may be used only when it adds historical or evidentiary understanding and when provenance, rights/licensing, captioning and accessible description are handled properly. Avoid atmospheric photographs of weapons, smoke, ruins or uniforms merely to create mood. Do not use gratuitous gore.

**Do not use generative imagery to simulate historical evidence, witnesses, atrocity scenes or archival documentation.** Illustrative graphics, if ever used, must be clearly editorial rather than evidentiary.

### Iconography

Use familiar, quiet functional symbols only where they reduce cognitive load. Avoid crosshairs, medals, shields, military insignia, weapon silhouettes or icon-heavy feature grids.

---

## 9. Interaction and motion philosophy

Interaction has one test: **does it improve comprehension, orientation or evidence access?** If not, keep the content static.

Permitted motion is restrained and functional—for example, showing a state change, maintaining spatial continuity or helping a reader understand that a panel opened from a source term. It should be brief, interruptible and unnecessary to understand the content.

Ares must not use:

- motion to dramatize suffering;
- animated casualty figures or counters;
- scroll-jacking;
- parallax atrocity imagery;
- staged reveals that turn evidence into suspense;
- pulsing risk/attack markers;
- gratuitous hover scaling/glow on atrocity stages;
- celebratory completion transitions.

`prefers-reduced-motion` support is a baseline requirement. Core reading and evidence access must remain coherent with motion disabled.

---

## 10. Ethical design rules

These rules are durable programme guardrails:

1. **No gamification, scores, streaks, badges, achievements or completion rewards.**
2. **No celebratory interaction language or success-state framing around atrocity content.**
3. **No militaristic interface treatment, war-room aesthetic or tactical-display framing.**
4. **No gratuitous gore or imagery whose primary purpose is shock.**
5. **No motion used to dramatize suffering.**
6. **No animated casualty figures.**
7. **No testimony used as decorative pull quotes.**
8. **No false certainty around disputed historical claims, estimates, legal classifications or causation.**
9. **Fact, testimony, source-paper claim, project synthesis, interpretation and uncertainty must be distinguishable.**
10. **Sourcing/provenance must remain discoverable at the point of use and durable in the static publication.**
11. **No generative reconstruction presented as historical evidence.**
12. **No severity meters, rankings or visual systems that imply atrocities can be meaningfully ordered by a single quantitative score.**
13. **Content warnings should be specific and proportionate, not alarmist chrome around the entire product.**
14. **Visual restraint must not become emotional detachment.** Names, testimony, individual experience and consequences should remain present so that analytical clarity does not reduce people to abstractions.

---

## 11. Mobile-first editorial principles

Phone width is a first-class reading condition, not a smaller desktop.

### Long-form navigation

- The reader should retain or quickly recover current part/case context.
- The full contents must be easy to open, scan and dismiss without losing reading position.
- Hidden navigation must not remain focusable off-screen.
- Core navigation cannot depend on hover.
- Fixed chrome should occupy as little reading area as possible and must respect safe areas where relevant.

### Process model and diagrams

Never shrink a desktop diagram until its labels become microscopic. On phones, the same model may become a vertical sequence, annotated list, stepwise explainer or another reflowed form. All labels, relationships and detail must remain legible and operable.

### Glossary

A tap target should provide useful context near the reading flow, with extended detail available through an accessible pattern that returns the reader to the source term. Do not force a desktop side drawer into a narrow viewport. A complete non-interactive glossary remains available.

### Comparative tables

Preserve the comparison, not necessarily the desktop table geometry. Mobile may recompose columns, group variables, provide a clearly signaled horizontal viewport or use another editorial form. Row/column relationships and source notes must remain understandable.

### Chronology

Phone chronology should read naturally in the document's vertical flow. Do not depend on a wide horizontal timeline, tiny event labels or decorative track geometry.

### Long headings

Allow natural wrapping, reasonable hyphenation where appropriate and content-driven height. Do not truncate major historical names/titles or reduce type until it ceases to serve the hierarchy.

### Testimony

Keep testimony, context, attribution and citation together in the reading flow. Avoid floating or offset quote treatments that separate words from evidence on narrow screens.

### Citations

Citation affordances must be touch-friendly and not hover-dependent. Endnote/reference navigation should include a reliable return path when practical.

### Fixed/sticky controls

Use sparingly. Sticky elements must not obscure text, consume a large fraction of the viewport or conflict with browser/system gestures.

### Overlays and panels

Use only when they improve the task. If a secondary surface behaves as a dialog/sheet/panel, it needs coherent focus entry, keyboard dismissal where appropriate, focus restoration and screen-reader semantics. Essential content cannot exist only inside the enhanced surface.

### Text scaling and touch

The publication must remain usable with enlarged text and browser zoom/reflow. Interactive targets must meet WCAG 2.2 AA requirements and primary controls should be comfortably operable by touch rather than merely satisfying the minimum through exceptions.

---

## 12. Laptop and intermediate-width behavior

Ares must have a deliberate **laptop orientation tier**. A 1280–1366px viewport is not a phone and must not lose document context simply because a wide fixed sidebar no longer fits.

At ordinary laptop widths, a reader should be able to answer without repeatedly opening and closing a generic hamburger menu:

- what Part they are in;
- which case/section is active;
- what is nearby;
- how to reach the full contents.

#7 may choose a compact persistent rail, contextual header, semi-persistent outline or another editorial solution. The binding product rules are:

- do not use “mobile navigation for everything under 1440px” as the model;
- maintain visible or immediately recoverable current-location context;
- preserve a narrow prose measure even if navigation or diagrams use surrounding space;
- keep navigation visually subordinate to the publication;
- ensure the orientation model survives long labels, keyboard use and responsive resizing.

---

## 13. Accessibility expectations

Ares 2.0 targets **WCAG 2.2 AA** and treats accessibility as behavior, not an ARIA layer applied after design.

Later implementation must provide:

- visible, high-contrast focus states;
- complete keyboard access to navigation, glossary, diagrams and secondary interactions;
- native semantic controls wherever possible;
- logical heading/landmark structure and bypass mechanisms such as skip navigation;
- colour-independent meaning and state;
- AA contrast for small text, metadata, controls and focus indicators;
- robust text scaling, zoom and responsive reflow;
- reduced-motion behavior that preserves all content and state understanding;
- accessible diagram alternatives and logical reading order;
- equivalent textual information for meaningful maps/data graphics;
- appropriate accessible names/states for interactive explainers;
- coherent focus entry, dismissal and restoration for overlays/panels;
- citations/definitions that do not require hover;
- no off-screen-but-focusable closed controls.

#12 owns full hardening, performance and correctness. #7–#10 must not knowingly build patterns that make #12's job impossible.

---

## 14. Explicit anti-patterns

The following should be rejected during implementation unless a clearly documented editorial need overrides the pattern:

- rounded tinted card for every section/subsection;
- generic “feature card” grids, icon boxes and chip clouds;
- glassmorphism, soft SaaS shadows or app-dashboard chrome;
- blood-red/black cinematic theming;
- war-room, targeting, radar or tactical-map visual language;
- gradients that suggest a universal low-risk → high-risk atrocity meter;
- KPI tiles for deaths, duration or “severity”;
- giant decorative witness quotations or quote carousels;
- project-written prose styled as if it were historical testimony;
- hero video, ambient battlefield footage or mood-setting atrocity imagery;
- AI-generated historical reenactments presented alongside documentary evidence;
- scroll-jacking, parallax or reveal-on-scroll suspense;
- animated death/casualty counters;
- badges, progress celebrations or completion rewards;
- microscopic desktop diagrams scaled onto phones;
- horizontal phone timelines that require tiny labels;
- hamburger-only long-document orientation across ordinary laptop widths;
- hover-only glossary or citation interactions;
- colour-only narrative/analytical distinction;
- excessive pills, badges and status chips where plain editorial labels work;
- false precision in disputed casualty estimates;
- unattributed synthesis presented as a source author's model.

---

## 15. Downstream ownership and constraints

This brief sets contracts; it does not replace later issue scopes.

### #6 — architecture and build-system decision

Before architecture is finalized, #6 must account for:

- provenance as structured editorial data, not only free-text bibliography markup;
- stable source/reference identifiers usable from historical claims, testimony, quantitative metadata, glossary entries and project synthesis;
- a single structured source of truth for any approved process model, with provenance/status/source mappings that can generate or validate prose, glossary and interactive representations;
- build-time validation that can detect model/citation drift;
- a durable static fallback for citations, glossary content and explanatory text;
- progressive enhancement rather than client-only evidence access;
- quality gates capable of checking representative phone, laptop and wide-desktop behavior plus accessibility.

This brief does **not** create a new requirement for React, an SPA or a framework migration.

### #7 — navigation and orientation

Implement the multi-viewport orientation contract: first-class phone navigation, a deliberate 1280–1366 laptop tier, current part/case context, non-linear entry/deep links, reduced fixed chrome and correct focus behavior. Decide the final progress treatment only if it communicates meaningful location.

### #8 — typography and visual system

Turn this direction into the production type, spacing, palette, rule/surface, focus and data-display system. Preserve the dual voice without reproducing the current repeated card pattern. Verify contrast and long-form measure across viewports. #8 owns concrete tokens and font choices.

### #9 — case studies, chronology and comparative storytelling

Preserve the useful case grammar while rebalancing hierarchy. Build testimony as sourced evidence; do not carry unsourced cinematic detail forward by default. Make chronology and comparison excellent on phones. Implement the provenance presentation contract without silently changing historical claims during UI restructuring.

### #10 — glossary, process model and interactive explainers

Glossary interactions must be progressive, accessible and mobile-native. The process explainer is bound by Section 7: the current eight-stage taxonomy is not approved, and the six-stage synthesis cannot be attributed to Dutton as a named model without source validation. #10 may design the interaction grammar while scholarship is resolved, but may not finalize the explanatory taxonomy ahead of that work.

### #11 — motion

Use motion only for orientation/state continuity. Remove ornamental reveal/scale effects where they do not improve comprehension. No dramatization, casualty animation or celebratory motion; reduced motion remains equivalent in meaning.

### #12 — accessibility, performance and web correctness

Harden to WCAG 2.2 AA, validate semantics/focus/reflow/contrast, preserve progressive enhancement, measure real performance and enforce browser/a11y quality gates. Accessibility defects identified in #4 remain owned here unless naturally resolved earlier.

### #13 — final rendered QA

Review the real rendered publication across representative phones, tablets, 1280–1366 laptops and wide desktop. Verify visual hierarchy, source/testimony treatment, long-document orientation, complex-content reflow, reduced motion and absence of the anti-patterns in this brief. Content/provenance labels are part of rendered QA, not separate from design quality.

---

## 16. Genuinely unresolved questions

### A. Exact Dutton-derived process synthesis — blocks final #10 process content

A source-mapped editorial review must establish which Dutton concepts belong in the Ares process explanation, how they relate, and whether a linear ladder is defensible. Until then, the current six- and eight-stage representations are not authoritative Ares 2.0 models.

This does **not** block #7 or #8 and need not block general interaction-pattern work in #10. It does block final labels, sequence and persuasive process visualization.

### B. Historical source audit depth — constrains #9 content confidence

Ares currently lacks a sufficient claim-level source inventory for every case, quotation and estimate. This brief defines the contract but does not perform the broad historical fact-check prohibited by #5's scope. #9 can restructure presentation, but revised copy/testimony should not be treated as publication-ready until its provenance is known.

### C. Citation style mechanics — does not block design

The exact scholarly citation style, note numbering convention and source-record schema can be finalized with #6/#9. The product requirement is already settled: provenance is point-of-use, class-aware, durable and non-decorative.

No other unresolved design question should prevent #6–#9 from proceeding once this brief lands.

---

## 17. Acceptance check for Issue #5

- [x] #4 materially changes the brief: process integrity, provenance, mobile complex content, laptop orientation, card overuse, front-matter pacing and accessibility are first-class constraints.
- [x] The six-stage/eight-stage conflict is traced and bounded; neither is silently accepted as “the Dutton model.”
- [x] A single primary Ares/Dutton synthesis direction is defined, with external frameworks required to remain separately attributed.
- [x] Provenance is part of the product and distinguishes fact, source-paper claim, synthesis, interpretation, estimates, testimony, contested claims and legal findings.
- [x] Testimony is treated as evidence rather than decorative quotation.
- [x] Narrative and analytical voices retain a deliberate, colour-independent relationship.
- [x] Mobile and ordinary laptop widths are first-class product conditions.
- [x] Visual direction is specific enough to reject generic AI/SaaS/card redesign tendencies without prematurely freezing arbitrary tokens.
- [x] WCAG 2.2 AA, focus, keyboard, reduced motion, text scaling and accessible explainers are explicit expectations.
- [x] Motion and ethical guardrails prohibit dramatization, gamification and militaristic treatment.
- [x] #7–#13 receive explicit constraints without creating replacement scopes.
- [x] No production CSS, JS, HTML, build system or historical-content rewrite is part of this sprint.
