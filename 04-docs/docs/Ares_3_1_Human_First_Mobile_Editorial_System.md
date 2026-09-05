# Ares 3.1 — the human-first mobile editorial system

**Status:** Authoritative for public identity, Home composition, the mobile grouping law, the chronological/magnitude decision and case-opening grammar.
**Issue:** #62. **Parent programme:** #61. **Implemented by:** #63 (Home) and #64 (representative cases).
**Supersedes:** `Ares_2_3_Mobile_Screen_Composition_Principle.md` §5 and §6; `Ares_2_3_Content_Graph.md` §10; the Home composition described in `Ares_3_Ground_Level_Overhaul.md` §3.
**Unchanged:** the Ares 3.0 dark oxide visual system; every editorial, provenance and ethical rule in `Ares_2_Product_Editorial_Design_Brief.md` and `AGENTS.md`.

This document is product and editorial direction. It ships no production UI.

---

## 1. The fault, stated precisely

Ares 3.0 was right that 29 routes was too many and wrong that route count was the thing to fix. Measured on the built site at 390 px, current `main` shows what the reduction actually produced:

| Surface | Height | Screens | Words | What the reader meets, in order |
| --- | --- | --- | --- | --- |
| `/` | 2 831 px | 3.35 | 246 | wordmark → 10-row route directory → methodology paragraph |
| `/cases` | 2 291 px | 2.71 | 143 | eight cases, chronological |
| `/cases/my-lai-massacre` | 6 521 px | 7.73 | 950 | 2.1 screens of apparatus → four essential units → closed depth |
| `/cases/rwandan-genocide` | 8 864 px | 10.50 | 1 355 | header → six sections, no layering, no depth control |
| `/cases/ukrainian-holodomor` | 8 746 px | 10.36 | 1 425 | as Rwanda |

Four findings follow from that table and from reading the surfaces.

**1. Home contains no history.** Not one date, place, case name or historical sentence appears on Home. A reader meets a wordmark, then eight Roman numerals, then a paragraph about `requires source trace`. Home answers *what routes exist*; it never answers *what this is about*.

**2. The Home directory is a literal duplicate.** `PublicationLayout` renders `PublicationHeader` — which carries the complete eight-item Contents in a native `<details>` — on every surface **except** Home, which passes `surface="home"` and suppresses the header. 3.0 then re-implemented the same eight destinations as Home body content. The directory on Home is not reach; it is the cost of having removed the control that already provided reach.

**3. Apparatus precedes the thing it qualifies.** On My Lai the reader scrolls 1 785 px — 2.1 screens of index link, header, four-row metadata stack, source-trace boundary, reading-location strip and caveat block — before the first historical sentence. `Ares_2_3_Content_Graph.md` §6 already recorded this ("roughly 2.5 screens of every unit is shared chrome") and correctly named it the thing #46 must judge. It is now measured.

**4. The orientation unit does four jobs in one paragraph.** My Lai's `#orientation` is a single 125-word block that fuses what happened, why the case is included, what "the prototype asks readers" to do, and the source-trace caveat. It is the dominant-idea failure at paragraph scale, and it addresses the reader as a test subject in production copy.

Two further defects were found by inspection and are in scope for #63/#64 because they are composition faults, not cosmetics:

- **No-JS mobile opens on a directory.** `.publication-contents` renders `<details open>` and is closed by an inline script only below 76 rem. With JavaScript disabled at 390 px, every publication route opens with a 590 px expanded Contents list and pushes `<main>` to 651 px — below the fold. The fix is CSS, not more script: render the `<details>` **closed**, and at ≥ 76 rem present the nav as a plain list with the summary hidden.
- **The case index conflates two variables.** `/cases` prints one column that is a calendar span for four cases ("1915–1917") and a duration for four others ("~6 weeks", "1 day (16 Mar)", "100 days"). A reader cannot learn *when* Nanking, My Lai, El Mozote or Rwanda happened from the index that orders them by when they happened.

Nothing above argues for another visual reset. The Ares 3.0 ground, ramp and oxide accent are the strongest thing in the system and 3.1 keeps all of it.

---

## 2. Public identity

### Recommendation: **Project Ares**

Adopt `Project Ares` as the public identity. It is already the repository's own instinct in three places — the Home credit line reads `PROJECT ARES · DIGITAL PUBLICATION`, `<meta name="author">` is `Project Ares`, and the programme issues use it throughout — while the display wordmark says `ARES` alone.

The case for the change is narrow and sufficient: a display-scale `ARES` in caps on a near-black ground under an oxide rule is read as a war-god brand or a defence programme. `Project` reframes it as an inquiry with an author. It does not make the name self-explanatory — nothing would — so the work of saying what this is falls to a descriptor, which is where it belonged anyway.

The counter-consideration is recorded rather than hidden: `Project Ares` is also the name of an unrelated commercial cyber-range product. Ares is not competing for that term, the descriptor disambiguates immediately, and the alternative is worse.

### The identity block

Three tiers. **The descriptor is not optional and is never separated from the wordmark.**

| Tier | Content | Budget |
| --- | --- | --- |
| Wordmark | **Project Ares** | — |
| Descriptor | *Military massacre and genocide, examined case by case.* | ≤ 10 words |
| Deck | *Eight historical cases read against the psychology of extreme mass homicide, with estimates, uncertainty and sources kept in view rather than cleaned away.* | ≤ 30 words |

The descriptor names the subject in the first line a reader reads. The deck names the method and the integrity stance. Together they remove every ambiguity the name creates, in under forty words, on the first viewport.

### Naming rules

1. **The mythology is never explained.** No Greek god, no etymology, no "the name comes from". Anywhere. If a reader has to be told why it is called Ares, the descriptor has failed and the fix is the descriptor.
2. **`Project Ares` is the identity on first contact**: the Home wordmark, `<title>` on Home, `<meta name="author">`, Open Graph and any external reference.
3. **`Ares` survives as the running head.** The compact `.reader-mark` in `PublicationHeader`, the footer mark and the `· Ares` suffix in interior `<title>`s may stay short, exactly as a book's running head is shorter than its title page. Changing those is optional in #63 and must not be a reason to touch every route.
4. The current subject line "The human story of extreme mass homicide" is retired in favour of the descriptor. "Extreme mass homicide" survives inside the deck, where it is doing citation work against the source paper rather than acting as a headline.

---

## 3. The mobile grouping law

> ### The dominant-idea rule
>
> **Every mobile viewport of an Ares surface is dominated by one idea. A surface may hold several sections; a viewport may not.**
>
> Where two ideas compete for the same screen, one is deferred — to a later section, to a native disclosure, or to another surface. **Discoverability is never a reason to co-locate.** A reader who cannot find something needs a better path, not a longer page.
>
> Progressive disclosure is preferred to simultaneous availability. Proximity is not comprehension: a destination that is one tap away is not harder to reach than one that is one screen away, and it is much easier to ignore.

This replaces route-count minimisation as the optimisation target. Route count is now a constraint (nothing exceeds two navigation steps from the opening, per `hierarchy.test.ts`), not a goal.

### The four sub-rules, and what a machine can check

Automated tests establish structure. They cannot establish comprehension — that is #46's job and this document does not pretend otherwise. Three of the four sub-rules are mechanically checkable and should be; the fourth is a review rule.

| # | Rule | Check |
| --- | --- | --- |
| **G1** | **One directory per surface.** At most one enumerated list of destinations may render as default body content on any surface. | Testable. Count elements matching the directory pattern (`nav > ol/ul` of route links) in `<main>`; assert ≤ 1 per route. This is the rule that forbids "cover **and** complete directory". |
| **G2** | **Apparatus follows its object.** Methodology, provenance-policy and integrity prose may not precede, on the same surface, the content it qualifies. | Testable per surface: assert the first `<section>` in `<main>` on Home is not the about/methodology block. |
| **G3** | **One section heading per viewport-run.** At 390 × 844, consecutive `h2`-level section headings on a principal surface should not fall within 500 px of each other unless the shorter is a labelled sub-part of the same idea. | Testable as a soft gate: report offsets, fail only on a hard floor (< 250 px). Below that, two headings are visible at once and the viewport has two ideas. |
| **G4** | **Deferral is honest.** What is deferred is optional depth, extended traumatic detail, complete records and research utilities — never uncertainty, source status, legal qualification, a finding's limitation, or a content note. | Review rule, backed by the existing caveat assertions in `hierarchy.test.ts` and `prototype-45.spec.ts`. |

### Anti-patterns this law forbids

Carried forward from `Ares_2_3_Mobile_Screen_Composition_Principle.md` §11 and still binding: decorative separation, accordion concealment, 100 vh sections over one concatenated document, tabs or carousels as a hierarchy substitute, duplicate directories, a parent that renders its child's manuscript, and a mobile-only duplicate manuscript.

Added by 3.1:

- **The reach argument.** "It is only one more tap" is a reason to defer, not a reason to inline. Any change justified by "so the reader can find it" must name what it displaced.
- **The completeness argument.** A surface is not improved by listing everything it could link to. Home is the strongest case: its completeness is the reason it says nothing.

---

## 4. Home: the editorial sequence

Home stops being a cover-plus-directory and becomes an editorial argument that ends in a case.

```
390 px                                     ~ screens
┌─────────────────────────────────┐
│  PROJECT ARES · DIGITAL PUBL.   │   H1  Hero            0.9–1.1
│                                 │
│      PROJECT ARES               │   identity dominant, type only
│  ─────────────────────────────  │
│  Military massacre and genocide,│   descriptor (oxide, caps)
│  examined case by case.         │
│                                 │
│  Eight historical cases read    │   deck (serif, ink-soft)
│  against the psychology of …    │
│                                 │
│  [ Read the argument      ]     │   one filled oxide action
│  Or start from a case ↓         │   one quiet action → H3
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  Continue — Rwanda            × │   H2  Resume (conditional) ≤0.15
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  THE PROPOSITION                │   H3  Proposition      1.0–1.3
│  <thesis, ≤40 words>            │
│                                 │
│  01  <proposition>              │   three enumerated claims
│  02  <proposition>              │   ≤25 words each
│  03  <proposition>              │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  THE HISTORICAL FIELD           │   H4  Field            1.6–2.0
│  Eight cases · 1915–1995        │   one orientation line
│  ┌─ 1910s ────────────────────  │   decade rule
│  ● 1915  Armenian Genocide      │   one mark per case
│    Ottoman Empire · three years │   place · span in words
│    Genocide                     │   classification
│  ┌─ 1930s ────────────────────  │
│  ● 1932  Ukrainian Holodomor    │
│    …                            │   × 8, chronological
│  └──────────────────────────────│
│  How these dates are measured → │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  WHAT THE COMPARISON ASKS       │   H5  Framework hand-off 0.6–0.8
│  <≤70 words>                    │
│  Read the framework →           │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  Contents ▸  Sources ▸  About ▸ │   H6  Quiet apparatus   0.3–0.5
└─────────────────────────────────┘
                                   total ≈ 4.5–5.5 screens
```

### Section contracts

**H1 — Hero.**
*Question answered:* What is this? · *Content:* credit line, wordmark, descriptor, deck, one primary action, one quiet action. · *Max default text:* **45 words.** · *Hierarchy:* the wordmark is the largest object on the surface; the descriptor is the second thing read and is set in the oxide label style so it cannot be skipped; the deck is the only serif prose. · *CTA:* primary `Read the argument` scrolls to H3 (same surface, no page load); quiet `Or start from a case` scrolls to H4. **The primary action no longer routes to `/framework`** — sending a first-time reader into definitional material is what made the current Home an architecture quiz. · *Deferred:* everything. The hero carries no navigation beyond two in-page moves.

**H2 — Resume (conditional).**
*Question:* Where was I? · *Content:* one line naming the unit, one clear control. · *Max:* **12 words.** · *Hierarchy:* a slim strip, never a card, never taller than 0.15 screens. · *Deferred:* progress summaries, unit counts, anything resembling a dashboard. Absent when no state exists, and it must never reflow the hero.

**H3 — Proposition.**
*Question:* What does this publication claim, and what does it refuse to claim? · *Content:* a thesis sentence, then exactly three enumerated propositions. The recommended three, all supportable from existing canonical material:

> **01** These eight events differ in kind, scale and tempo. They are compared, never ranked.
> **02** The same organisational and psychological conditions recur across them, and the publication names which.
> **03** The historical record is uneven. Where a figure, quotation or classification is unverified, Ares says so beside it.

*Max:* **thesis 40 words, each proposition 25 words, section total 120 words.** · *Hierarchy:* enumerators `01/02/03` in the oxide label style; propositions in serif at reading size, equal weight. · *CTA:* none. This section is read, not acted on. · *Deferred:* the whole of today's "How Ares works" paragraph. Proposition 03 **is** the integrity stance, promoted from apparatus into argument, which is why the methodology block leaves Home entirely.

> **Ruling on "numbered callouts".** #62 is ambiguous between *enumerated* and *numeric*. It resolves as enumerated. Numeric callouts here would be death tolls, and `Ares_2_Product_Editorial_Design_Brief.md` §8 forbids KPI tiles for deaths and durations. One factual figure is permitted in the section, and only one: the corpus orientation line `Eight cases · 1915–1995`, which is a fact about the publication rather than about the dead. It belongs in H4.

**H4 — The historical field.** *(specified in full in §5)*
*Question:* What material does this examine, and when did it happen? · *Content:* one orientation line, then eight chronological entries, then one link to the measurement note. · *Max:* **60 words of connective prose.** Entry text is structured metadata, not prose, and is not counted against that budget. · *Hierarchy:* decade rules are the strongest horizontal element; the year and the case name are the two things legible at a glance. · *CTA:* **each entry is the case link. This is the case navigation.** Home does not additionally list the eight cases anywhere else, and `/cases` remains as the durable index and the Part II address. · *Deferred:* death estimates, duration geometry, maps, flags, per-case summaries.

**H5 — Framework hand-off.**
*Question:* What is the comparison trying to understand? · *Content:* one short paragraph naming the analytical question and the source paper. · *Max:* **70 words.** · *Hierarchy:* quiet; a single rule above it, no display type. · *CTA:* one link to `/framework`. · *Deferred:* definitions, typology, the three framework units, the lenses.

**H6 — Quiet apparatus.**
*Question:* Where is everything else? · *Content:* the complete publication contents, sources and provenance, and about/method. · *Max:* **40 words.** · *Hierarchy:* the quietest block on the surface; apparatus type, no display step. · *CTA:* **Home gains the same native `<details>` Contents control every other surface already has**, or the standard footer, or both. This is how all eight publication destinations stay one tap from the front door while G1 holds. · *Deferred:* nothing. This is where deferral lands.

### What leaves Home

| Leaving | Where it goes | Why |
| --- | --- | --- |
| The ten-row `.chapter-directory` | The Contents control / footer | G1. It duplicates chrome that exists on every other surface. |
| `#about-ares` methodology block | `/references` and the About link | G2. Apparatus preceded everything it qualifies. Its load-bearing sentence becomes proposition 03. |
| `Begin — Part I, Framework` as primary action | H5, as one quiet link | Framework is where the argument is defined, not where a first-time reader should land. |

### Success condition (#61), mapped

| Reader question | Answered by | By what screen |
| --- | --- | --- |
| What is Project Ares? | H1 descriptor + deck | 1 |
| What is the central proposition? | H3 thesis + 01/02/03 | 2 |
| What historical material? | H4 field | 3 |
| Where do I go next? | H1 actions, H4 entries, H5 link, H6 contents | 1, 3, 4, 5 |

---

## 5. Chronology and magnitude: the decision

### 5.1 Ruling

**Ares does not encode casualty magnitude as geometry — not on Home, not in a case opening, not anywhere.** The estimates across the eight cases are not commensurable, and no scale function survives the phone.

**Ares does encode chronology**, as an ordinal field of eight marks in calendar order. Human scale is carried by words at the point where each case's caveats can travel with it.

#61 withdrew #47's blanket prohibition and asked this issue to determine the question on the evidence rather than inherit an instruction. The evidence is below. It reaches the same conclusion #47 asserted, and `DurationScale.astro`'s existing refusal of toll geometry is confirmed rather than merely carried forward.

### 5.2 The commensurability finding

The eight `deathEstimate.display` values in `cases.json` are not eight measurements of one quantity. They are at least five different quantities:

| # | What the number actually counts | Cases |
| --- | --- | --- |
| a | A named or forensically derived victim list of one bounded massacre | El Mozote `~978 (553 children)`; the `8,000+` inside the Bosnia field; the upper `504` of My Lai |
| b | An institutional investigative count of the same known event | the lower `347` of My Lai |
| c | A scholarly estimate of targeted-group deaths across a campaign | Armenian, Rwandan, Nanking |
| d | A demographic excess-mortality estimate of an engineered famine | Holodomor |
| e | All-cause, all-sides deaths across a multi-year war, combatants included | the `~100,000` of the Bosnia field |

Three consequences, each fatal on its own:

1. **Two fields hold two numbers from two universes.** `~100,000 (8,000+ at Srebrenica)` places a four-year war total beside a single massacre's named list in one cell. `~978 (553 children)` places a total beside a subset. Neither can be plotted as one value without choosing, and choosing is an editorial act no visualisation may perform silently.
2. **One "range" is not a range.** My Lai's `347–504` is not a confidence interval; it is two institutions counting the same morning. Rendering it as an uncertainty band asserts a statistical claim the record does not make.
3. **Every one of the eight is `requires-source-trace`.** Rendering unverified figures as precise proportional geometry is the single most misleading thing this publication could do, and `AGENTS.md` already says moving a datum into JSON is not source verification.

### 5.3 No scale function survives

Corpus span: **347 to 7,000,000 — a ratio of 20,173:1, or 4.30 decades.** At a 390 px viewport, ~340 px is usable.

| Scale | Result | Verdict |
| --- | --- | --- |
| **Linear length** (Holodomor high = 340 px) | My Lai **0.02 px**. El Mozote **0.05 px**. Bosnia-Srebrenica 0.39 px. Bosnia-war 4.9 px. Nanking 14.6 px. | Six of eight cases are invisible. The chart says four cases exist. |
| **Area-true circles** (diameter ∝ √value, as #62 suggested) | Diameter ratio **142×**. My Lai at a minimum-visible 8 px forces the Holodomor to **1 136 px** — 2.9× the viewport. Cap the Holodomor at 340 px and My Lai returns to **2.4 px**. | Geometrically impossible on a phone. And area is near the bottom of Cleveland & McGill's accuracy ranking; perceived disc size follows a power law with exponent ≈ 0.7, so even a correctly computed area is systematically underestimated. "Perceptually correct area" does not exist. |
| **Logarithmic** | My Lai reads at **14%** of the Holodomor's extent; El Mozote at 20%. | Compression in the opposite direction, asserting a proportion that is false. Romano, Sotis, Dominioni & Guidi (2020) found general readers do not read log scales correctly and form different judgements from the same data. A scale the audience misreads, applied to death tolls, is not a defensible instrument. |

There is no fourth option. A scale that shows six cases at zero, one that cannot fit on the screen, and one that is misread are the complete set.

### 5.4 The ethical finding, independent of geometry

Even if the numbers were commensurable and a scale existed, aggregate magnitude marks would work against the publication's purpose. Slovic's work on psychic numbing and compassion fade is that comprehension and moral response **decline** as the number rises: a seven-million mark does not communicate seven million, it communicates a large shape. A row of eight such shapes is a severity ranking whatever the caption says, and `AGENTS.md`, the editorial brief (§10.12) and the existing comparison caveat all forbid ranking.

`Ares_2_Product_Editorial_Design_Brief.md` §10.14 supplies the countervailing rule that stops this becoming detachment: *visual restraint must not become emotional detachment*. The answer to that is not a bigger circle. It is §5.6.

### 5.5 What Ares builds instead: the historical field

One quantity is genuinely commensurable across all eight cases — **position on the calendar**. Every case carries an ISO `sortKey`; all eight sit between 1915 and 1995; and earlier is not worse, so chronological order carries no moral ordering. It is also position along a common scale, the *most* accurately decoded encoding available.

The field is **ordinal, not scaled**, and says so. A linearly scaled 1915–1995 spine over 900 px puts Rwanda at 888.8 px and Bosnia at 900.0 px — 11 px apart and colliding — while leaving a 349 px void between Nanking (1937) and My Lai (1968). Even spacing with labelled decades is the honest form.

**Encoding rules — binding on #63:**

| Aspect | Rule |
| --- | --- |
| Encoded quantity | **Calendar position only.** Nothing else is encoded geometrically anywhere in the field. |
| Order | **Chronological by `sortKey`, always.** Never by severity, toll, duration or classification. Not sortable, not reorderable. |
| Mark | **One mark per case, identical for every case.** No mark varies in size, weight, colour or shape by any quantity. A varying mark is a ranking. |
| Spacing | Even. Decade rules are labelled. Where the gap between consecutive cases exceeds ten years it may be stated in words ("thirty-one years later"), reusing `ChronologySpine`'s existing convention. The spine must never imply proportional time. |
| Entry text | Year · case name · place · **span in words** · classification with its source status. |
| Span | **Words, never length.** "one morning", "six weeks", "a hundred days", "three years". Words are exact, need no scale, cannot be misread as ranking, and fix the `/cases` column that currently mixes spans with durations. Any surface printing a span links to that case's `duration.note`, several of which are recorded judgement calls. |
| Death estimates | **Absent from the field and from Home.** They appear in case openings, where the range, its uncertainty sentence and its trace status travel with them. |
| Legend | One line: what the order is, that spacing is ordinal, and that nothing here is ranked. |
| Maps, flags | **Excluded.** See §7. |
| Motion | None. No draw-on, no reveal, no scroll-linked animation, no scroll-jacking, no carousel. |
| Markup | An ordered list of links. The visual field is a CSS layer over it. |

### 5.6 Human scale without geometry

Where the publication needs to restore human scale, it does so with **one concrete, sourced, individuating fact per case, in words**, inside that case's opening — never as a comparative row.

The corpus already contains the model. El Mozote's estimate is `~978 (553 children)`: the smallest figure in the corpus and the most humanly legible one, because it is a near-census of named people rather than a demographic band. That is the register. It also inverts the toll hierarchy without ranking anything, which is exactly the point.

**Rules:** the fact must be in the canonical record; it is never invented, strengthened or selected for affect; testimony is not used as a pull quote (brief §5); and no case is required to have one. A case whose record does not support it says nothing rather than reaching.

### 5.7 Ethical red lines

Non-negotiable, and inherited by every future issue:

1. No death toll, casualty count or victim number is ever encoded as length, area, volume, size, weight, opacity, colour intensity or position.
2. No ordering of cases by any quantity other than time.
3. No mark whose visual weight varies with any measure of harm.
4. No animated, counting, accumulating or revealed figure.
5. No single number where the record holds a range; no midpoint; no rounding that narrows a recorded range.
6. No estimate rendered without its uncertainty statement and trace status.
7. No comparison that implies the cases are instances of one measurable phenomenon differing only in degree.
8. No decorative atrocity imagery, and no imagery whose primary function is affect.

### 5.8 Data gaps this decision exposes

These are recorded, not fixed here. #62 does not change content.

| Gap | Why it matters | Owner |
| --- | --- | --- |
| `bosnian-war.deathEstimate.display` holds two quantities at two scopes (`~100,000` whole war, all sides; `8,000+` Srebrenica named list). | Any structured rendering must choose one, and the field does not say which is the case's estimate. | #64 for its two cases; #47 corpus-wide |
| `el-mozote-massacre.deathEstimate.display` holds a total and a subset (`~978 (553 children)`). | Same shape, lower severity. The subset is editorially valuable and must survive any restructuring. | as above |
| `my-lai-massacre` `347–504` is two institutional counts, not an interval. | The `uncertainty` string does not say so. Anything calling it a range overstates the record. | #64 |
| `ukrainian-holodomor` `3,900,000–7,000,000` spans differing definitions of what is counted, not only differing estimates. | The `uncertainty` string says figures are debated but not that the *definition* varies. | #47, with source review |
| `displayPeriod` mixes calendar spans and durations across the eight records; `bosnian-war` uses a hyphen where the others use an en dash. | The field needs a year for every case. | #63 must derive year from `sortKey` and must not edit `displayPeriod` to get it. |

**#63 must not normalise, average, reconcile or invent any estimate to make a surface work.** If a value cannot be rendered under these rules, it is not rendered.

---

## 6. Case-study opening grammar

A reusable sequence with case-specific content. **The presence of A–G is fixed. Their contents are not.** Do not force identical fact counts, identical callout counts or identical prose lengths across historically different cases.

```
A  Identity            place · calendar date / title / argument role
B  Standing facts      ≤4 facts, 2-column, estimate with uncertainty attached
C  What happened       60–110 words, narrative only
D  Why this case is    30–60 words, labelled Ares synthesis
   in Project Ares
E  Central finding     30–60 words + its limitation, same block
F  Essential reading   core narrative · 3–5 chronology/evidence points ·
                       one principal testimony where it adds evidence
G  The complete        closed <details>, specific content note naming
   record              what is inside
```

**A — Identity.** ≤ 25 words. Locator carries the **calendar date**, not the duration. Title dominant. Argument role on one line with its authorship label.

**B — Standing facts.** ≤ 40 words plus the uncertainty sentence. **Maximum four.** A fifth means one was not standing. Today's four-row vertical `<dl>` becomes a two-column grid — it currently costs ~0.85 screens for four short values. Required treatments: `When` carries the calendar span; `Span` appears only where the case's tempo is editorially load-bearing, and links to its `duration.note`; the estimate renders its **full recorded string with its uncertainty sentence attached** — never abbreviated, never a midpoint, never a KPI tile; classification carries its source status.

**C — What happened.** 60–110 words. Plain narrative. No analysis, no provenance, no address to the reader. This is the first half of today's fused orientation, extracted.

**D — Why this case is in Project Ares.** 30–60 words, labelled `Ares synthesis`. The second half, extracted. Today's sentence *"The prototype asks readers to understand that analytical distinction…"* is production copy addressing the reader as a test subject and must not survive.

**E — Central finding.** 30–60 words, and **the limitation is in the same block**. Never below a fold, never in depth, never a footnote. The existing `.integrity-note` treatment is correct and stays.

**F — Essential reading.** Length varies by case. The #47 pacing contract holds as an editorial band, not a build failure.

**G — The complete record.** A closed native `<details>` with a content note naming what is inside. **This is currently implemented for My Lai only.** Rwanda and the Holodomor render extended atrocity detail and full chronology inline by default, at 10.5 and 10.4 screens with no content note and no way past. That is the most serious defect in the corpus and #64 must fix it for both of its cases.

### Visible by default — never deferred

1. Every quantitative estimate's full recorded range and its uncertainty sentence.
2. `requires-source-trace`, wherever the datum appears.
3. Legal and classification qualification, including what a tribunal did *and did not* find.
4. The duration measurement note wherever a span is shown, for the several cases whose `duration.note` records a judgement call.
5. The central finding's limitation.
6. A **specific** content note before extended traumatic detail — proportionate, naming what follows, not alarmist chrome around the whole case.
7. Any statement that the case is presented at a different scope than its name implies (Bosnia is the 1992–95 war with Srebrenica as focal atrocity).

Extended detail of the killing, complete chronologies, extended testimony, full aftermath and the complete provenance ledger **may** be deferred to G.

### Representative pair for #64

**My Lai** (deepest prototype and testing history, already layered) and **the Ukrainian Holodomor**. The Holodomor is the stronger second choice than Rwanda: it is structurally maximally different from My Lai — a three-year engineered famine against a single morning — it currently has no layering at all, its estimate carries the corpus's widest and most definition-dependent range, and its `duration.note` is an explicit judgement call. It exercises every hard part of the grammar. Rwanda remains an acceptable substitute if #64 finds a blocking reason.

---

## 7. Visual direction

The question is which visual types genuinely reduce text burden. Most do not.

| Type | Verdict | Reason |
| --- | --- | --- |
| **Chronological field / spine** | **Adopt** | Replaces prose that would otherwise have to state the span and the order. Already half-built in `ChronologySpine`. |
| **Typography as the primary visual** | **Adopt** | Display-scale Newsreader on the warm near-black under one oxide rule is already the strongest object in the system. **The hero needs no image.** |
| **Duration / tempo figure** | **Keep where it is** | Figure 03 on `/comparison` is correct and stays. It does not move to Home. |
| **Restrained cartography** | **Reject for 3.1** | The borders are the problem. Ottoman Empire, Soviet Ukraine and Yugoslavia do not exist on a modern basemap, and a period-correct one requires per-case boundary sourcing — a research project, not a design task. A map that must caption away its own borders adds burden. Place stays a word per entry. Revisitable only with a rights-clear period basemap and sourced boundaries. |
| **Death-toll data visualisation** | **Reject** | §5. |
| **Rights-cleared documents / photography** | **Out of scope** | #35 remains the photography and image-rights authority. #63 and #64 source no imagery. |
| **Abstract editorial graphics** | **Reject** | On this material abstraction is either decoration or accidental symbolism. |
| **Flags** | **Reject** | Several cases are perpetrated by the state whose flag it would be; three of the eight polities no longer exist. |

**No decorative atrocity imagery. No generative imagery. No imagery whose primary function is affect.**

---

## 8. Progressive disclosure rules

1. **Native only.** Disclosure is `<details>/<summary>`. No JavaScript-only reveals, no tabs, no carousels, no swipe panels.
2. **Closed on load, at every width.** Optional depth and extended traumatic detail are closed on phone *and* desktop. Desktop having room is not a reason (`Ares_2_3_Mobile_Screen_Composition_Principle.md` §12).
3. **Maximum nesting: two levels** (#44).
4. **Honest summaries.** A summary names what is inside and its cost: *"Open the complete record — optional · extended detail of the killing, the cover-up and the courts-martial"*. Never a euphemism, never a teaser.
5. **Never conceals**, per G4: uncertainty that changes interpretation, source gaps that change confidence, methodological or legal qualification, a finding's limitation, or a content note.
6. **Skipping is not a negative state.** No progress penalty, no "you didn't finish", no completion language. Progress is orientation, never reward (#44 §6).
7. **The directory is disclosure too.** The Contents control is closed by default at phone widths — *in CSS, not by script*. See §9.

---

## 9. Accessibility and no-JS requirements

Binding on #63 and #64.

**No-JS.**
- The historical field is an `<ol>` of `<a>` elements with the visual treatment applied as a CSS layer. Every entry is reachable, readable and linkable with scripting off.
- Every Home section, every case opening block A–G, and the complete record inside G are reachable with scripting off.
- **Fix the Contents defect.** Render `.publication-contents` as `<details>` **closed**; at ≥ 76 rem present the nav as a plain list and hide the summary via CSS. Do not close it with an inline script. Currently, no-JS at 390 px opens every publication route with a 590 px directory and pushes `<main>` to 651 px.

**Semantics and text equivalence.**
- The field's text equivalent is the field: it is a list of text, so no parallel long description is required or permitted. Any figure that is *not* already text carries a logical text equivalent (`Ares_2_Product_Editorial_Design_Brief.md` §8).
- Landmarks, heading order and skip link preserved. Home's skip target is updated for the new sequence.
- No meaning carried by colour alone; the oxide accent never carries small text (`--accent-lift` only).

**Interaction.**
- Keyboard reachable in DOM order; visible focus on the dark ground; targets ≥ 44 px.
- `prefers-reduced-motion` respected. **3.1 adds no motion.** The one authored moment (the chronology spine draw) is unchanged and remains opt-out.
- No scroll-jacking, no scroll-linked animation, no autoplay, no carousel.

**Reflow.**
- 200% text and 320/360/390/430/768/1440 remain coherent; decade labels must not truncate; no horizontal overflow at any of them.
- Long historical names wrap naturally and are never truncated or shrunk (brief §11).

---

## 10. Desktop adaptation

One product, one source model, one order.

1. **Same sequence, same order.** Desktop does not reorder, add or remove Home sections.
2. **Space goes to measure and column count**, not to more sections: the field may run two columns above ~64 rem; standing facts may run 3–4 columns; prose stays at `--measure`.
3. **Desktop may reveal a directory that mobile defers** — the Contents control as a persistent list at ≥ 76 rem. That is the *only* category permitted to differ.
4. **Desktop may never open what mobile defers for editorial or ethical reasons.** Optional depth and extended traumatic detail stay closed at every width.
5. No wide-only content, and no desktop-only navigation path to any unit.

---

## 11. Content and provenance constraints

Restating what #63 and #64 may not do, because a composition change is the most common way a claim silently changes.

- **No factual claim, date, quotation, casualty estimate, legal classification, chronology precision, source attribution or uncertainty wording is changed.** Recomposition only.
- **No new historical assertion.** New connective copy (Home thesis, propositions, block C, block D) must be derivable from the canonical record without resolving an ambiguity. If it cannot be, flag it — do not invent certainty (#64).
- **`requires-source-trace` renders wherever its datum renders.** Structuring a datum is not verifying it (`AGENTS.md`).
- **Structure once, render many.** If a datum appears in more than one place, it comes from `cases.json` (`AGENTS.md`). The Home field derives year from `sortKey`; it does not restate a period string.
- **No second manuscript.** The opening is a communication layer over canonical scholarship. `hierarchy.test.ts` already fails the build if manuscript prose is copied into the graph.
- **No new content route and no route migration.** 3.1 is composition. `/cases` survives as the durable Part II index and as the no-JS fallback for the field.

---

## 12. Implementation boundaries

### #63 — Home and the historical field

**In scope.** `Project Ares` identity, descriptor and deck on Home and in metadata; hero; proposition section; the chronological historical field with all eight cases entered from it; framework hand-off; quiet apparatus including a Home Contents affordance; conditional resume as a slim strip; removal of `.chapter-directory` and `#about-ares` from Home; desktop adaptation; the two composition defects in §1 (no-JS Contents, the `/cases` date column).

**Out of scope.** Case bodies beyond what Home links to. Route changes. Content edits. Imagery. The visual system. `PublicationHeader`'s running head may stay `Ares`.

**Tests to update.** `tests/browser/home-entry.spec.ts` currently asserts the shape 3.1 replaces — `.home-wordmark` = `Ares`, `.home-cover__subject` contains "extreme mass homicide", `.home-begin` → `/Ares/framework`, `nav.home-contents a` count 8. #63 rewrites these against the new contract; that is expected, not a regression.

**#63 is ready to execute on merge of this document.**

### #64 — Representative case openings

**In scope.** Grammar A–G on **My Lai** and **the Ukrainian Holodomor**; the two-column standing-facts grid; splitting the fused orientation into C and D; removing the "the prototype asks readers" copy; adding a closed complete-record disclosure with a specific content note to the Holodomor; the default-visible list in §6.

**Out of scope.** The other six cases. Content rewriting. New estimates. Route changes. Real-reader testing.

**Blocking dependency.** The Holodomor and Bosnia estimate-field ambiguities in §5.8. #64 renders `deathEstimate.display` **verbatim as the single recorded string** with its uncertainty sentence attached, and must not decompose it into structured fields. Under that rule the ambiguity is recorded rather than resolved, and #64 is unblocked. **If #64 finds it needs the estimate decomposed, it stops and escalates rather than choosing a value.**

**#64 is ready to execute on merge of this document, under that constraint.**

### Not authorised by this document

Corpus-wide rollout (#47, still blocked), real-reader sessions (#46, still paused until #63 and #64 are deployed), any visual-system change, any photography, any route migration.

---

## 13. Acceptance checklist

### Identity
- [ ] Home wordmark reads `Project Ares`; the descriptor is adjacent and never separated from it.
- [ ] The deck names subject, method and the integrity stance in ≤ 30 words.
- [ ] No mythology, etymology or name explanation appears anywhere.
- [ ] `<title>`, `<meta name="author">` and Open Graph carry `Project Ares`.

### Home composition
- [ ] Section order is H1 → H6, with resume conditional and never reflowing the hero.
- [ ] Word budgets met: hero ≤ 45, proposition ≤ 120, field connective ≤ 60, hand-off ≤ 70, apparatus ≤ 40.
- [ ] Home carries **no** complete-publication directory as body content (**G1**).
- [ ] All eight publication destinations remain one tap away via the Contents control or footer.
- [ ] The methodology/about block does not precede historical content (**G2**).
- [ ] At 390 px no two `h2` section headings fall within 250 px (**G3**).
- [ ] The primary hero action does not route to `/framework`.

### Historical field
- [ ] Eight entries, chronological by `sortKey`, not sortable and not reorderable.
- [ ] One identical mark per case; no mark varies by any quantity.
- [ ] Each entry carries year · name · place · span in words · classification with source status.
- [ ] **No death estimate appears on Home in any form.**
- [ ] No length, area, size, opacity or colour encodes any quantity other than calendar position.
- [ ] Spacing is ordinal; decade labels present; no claim of proportional time.
- [ ] Every case is reachable from the field with JavaScript disabled.
- [ ] The field is an `<ol>` of links; the visual treatment is a CSS layer over it.
- [ ] No motion added.

### Case openings (#64)
- [ ] Blocks A–G present on both cases; contents differ between them.
- [ ] Standing facts ≤ 4, two-column, and the estimate renders its full recorded string with its uncertainty sentence attached.
- [ ] `What happened` and `Why this case is in Project Ares` are separate blocks.
- [ ] The central finding's limitation is in the same block as the finding.
- [ ] Both cases carry a closed complete-record disclosure with a **specific** content note.
- [ ] No extended traumatic detail renders by default on either case.
- [ ] The §6 default-visible list holds on both cases.
- [ ] No production copy addresses the reader as a test participant.

### Integrity
- [ ] No factual claim, date, quotation, estimate, classification, chronology precision or uncertainty wording changed.
- [ ] `requires-source-trace` renders wherever its datum renders.
- [ ] No estimate normalised, averaged, rounded, decomposed or invented.
- [ ] No new historical assertion that is not derivable from the canonical record.
- [ ] Every ethical red line in §5.7 holds.

### Access
- [ ] Every Home section and every case block reachable with JavaScript disabled.
- [ ] `.publication-contents` renders closed by default, in CSS, and no longer pushes `<main>` below the fold at 390 px without JavaScript.
- [ ] Keyboard order, visible focus, targets ≥ 44 px.
- [ ] 200% text and 320/360/390/430/768/1440 coherent; no horizontal overflow.
- [ ] `prefers-reduced-motion` respected; no motion added by 3.1.

### Gates
- [ ] `pnpm check` green.
- [ ] Fresh rendered evidence reviewed at 390 px and 430 px for grouping and simultaneous-information density.
- [ ] No comprehension or cognitive-load claim is made from screenshots. That evidence is #46's, and #46 stays paused until #63 and #64 are deployed.

---

## 14. Sources consulted

Research informing §3, §5 and §8. Cited for the decisions they support, not as a literature review.

- Romano, Sotis, Dominioni & Guidi, *The scale of COVID-19 graphs affects understanding, attitudes, and policy preferences*, Health Economics (2020) — https://onlinelibrary.wiley.com/doi/abs/10.1002/hec.4143 — log scales are misread by general readers (§5.3).
- Cleveland & McGill's encoding-accuracy ranking; Stevens' power law for perceived area (exponent ≈ 0.7) — https://hci.stanford.edu/courses/cs448b/f12/lectures/CS448B-20121011-Perception.pdf — position on a common scale is the most accurate encoding; area is near the bottom and is systematically underestimated (§5.3, §5.5).
- Slovic, *"If I look at the mass I will never act": Psychic numbing and genocide*, Judgment and Decision Making (2007) — https://www.cambridge.org/core/journals/judgment-and-decision-making/article/if-i-look-at-the-mass-i-will-never-act-psychic-numbing-and-genocide/0E55D099E133068F9ACD5A0DBBE1E4E2 — comprehension and moral response decline as magnitude rises (§5.4, §5.6).
- Cowan's ~4-chunk working-memory limit and Nielsen's progressive disclosure; NN/g on chunking — https://www.uxpin.com/studio/blog/what-is-progressive-disclosure/ — the basis for three propositions, four standing facts and two-level nesting (§3, §4, §6, §8).
- *The Challenging Power of Data Visualization for Human Rights Advocacy*, in *New Technologies for Human Rights Law and Practice*, Cambridge — https://www.cambridge.org/core/books/new-technologies-for-human-rights-law-and-practice/challenging-power-of-data-visualization-for-human-rights-advocacy/3FB46953FB908FABB3C6C81AC137CFAA — individuation over aggregation; visual integrity against source data (§5.6).
- OHCHR, *Guidance on Casualty Recording* — https://www.ohchr.org/sites/default/files/Documents/Publications/Guidance_on_Casualty_Recording.pdf — casualty figures are defined by their recording method; figures from different methods are not interchangeable (§5.2).
- The Pudding, *Responsive scrollytelling best practices* — https://pudding.cool/process/responsive-scrollytelling/ — stack rather than scroll-drive on phones; core content must not depend on scroll behaviour (§5.5, §9).
- Wilke, *Fundamentals of Data Visualization* ch. 16, and the gradient-plot literature on uncertainty encoding — https://clauswilke.com/dataviz/visualizing-uncertainty.html — summary statistics shown beside uncertainty cause the uncertainty to be ignored; the basis for keeping ranges as text with their basis attached (§5.2, §6).
