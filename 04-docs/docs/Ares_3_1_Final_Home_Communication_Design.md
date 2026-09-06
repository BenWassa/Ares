# Ares 3.1 — final Home communication design

**Status:** Authoritative for the remaining Ares 3.1 Home correction owned by #71.  
**Issue:** #70. **Parent programme:** #61.  
**Evidence baseline:** `main` at `0e081fbd1fb3ba3cee508e9dc948bf79c023992d`.  
**Applies:** `Ares_3_1_Quantitative_Historical_Visualisation_Amendment.md`.  
**Preserves:** Project Ares identity; the dominant-idea rule; case-opening grammar; progressive disclosure; dark memorial visual system; canonical historical content; provenance/uncertainty rules; semantic/no-JS access; trauma-aware restraint.  
**Supersedes for Home only:** the Hero copy and no-visual ruling, H3/H4 order and copy, chronology-only/ordinal Home-field contract, Home-specific desktop rules, #63 implementation boundary and Home acceptance clauses in `Ares_3_1_Human_First_Mobile_Editorial_System.md` wherever they conflict with this document. The quantitative amendment remains the governing general rule.

This is a design and editorial contract. It changes no production UI and authorizes no historical rewrite.

---

## 1. Final decision in one page

The remaining Home problem is not lack of content. It is that the most expensive first-screen words are still spent on method, qualifications and publication mechanics before the reader has a simple model of the subject.

The final Home therefore uses this reader order:

1. **What is this?** — Project Ares, eight historical cases of mass killing, 1915–1995.
2. **What happened in history?** — the eight cases, where they sit in time, where they occurred, and the recorded case window for each.
3. **What is Project Ares trying to understand?** — which human and institutional conditions recur across historically unlike cases and can help make organized mass killing possible.
4. **What appears to recur?** — four interacting kinds of condition, presented as a framework hand-off rather than a universal sequence.
5. **Where can I go deeper?** — direct case entry, framework, complete contents, sources/provenance and method.

Three design rulings follow.

### Prose

The opening no longer leads with `extreme mass homicide`, comparability, source traces, classification policy, severity disclaimers or what Ares “refuses to claim.” Those concepts remain available after the reader understands the subject and question.

### Hero

**Adopt a real explanatory visual:** a restrained, server-rendered **1915–1995 linear chronology rail** derived only from the eight canonical `sortKey` values. It establishes historical scope and the distribution of the eight case anchors without imagery, historical-border claims or death geometry. It is a visual overview, not navigation.

### Historical field

**Adopt a stronger quantitative chronology treatment:** the same linear calendar rail, expanded as the historical field, followed by the eight linked cases with their recorded case windows in words.

- **Calendar position is geometrically encoded.** The position of each mark is proportional to elapsed calendar time between the earliest and latest canonical `sortKey`.
- **Duration is not geometrically encoded on Home.** The current `duration.days` values use materially different case-boundary conventions. Tempo remains visible as concise text: `one day`, `six weeks`, `a hundred days`, `about thirteen months`, `about three years`, `about four years`.
- **Death magnitude is not encoded or listed on Home in #71.** The current eight estimates do not form one sufficiently source-traced, commensurable quantity. This is an evidence/provenance ruling, not a categorical ban on future quantitative death visualisation.
- **Chronological order remains fixed.** No sorting or ranking by any magnitude.

This is materially stronger than the shipped chronology-only list because actual historical gaps and clustering become perceptible: the 1937→1968 gap is visibly long; the 1994/1995 anchors are visibly close; the case rows simultaneously make the very different recorded time windows easy to scan.

---

## 2. Current Home inspection: 390 px and 430 px

The #63 implementation is technically strong and compositionally calm, but the first-pass communication is still wrong for #61.

At both 390 px and 430 px the rendered Home shows:

- a large, almost entirely typographic Hero;
- the descriptor `Military massacre and genocide, examined case by case.`;
- a deck that foregrounds the psychology of `extreme mass homicide`, estimates, uncertainty and sources;
- a proposition headed `What Project Ares claims — and refuses to claim`;
- a thesis that begins by explaining how the cases are not treated as one phenomenon or a severity scale;
- numbered propositions that elevate anti-ranking and source-status policy to the same weight as the substantive question;
- a historical field that uses decade rules, ordinal spacing and identical dots, then prints place, textual duration and classification/source status;
- a framework hand-off that again leads through comparison method and the source paper;
- quiet apparatus at the bottom.

The visual density is not the central defect. The page has sufficient whitespace and no need for another visual-system reset. The defect is **attention priority**: the reader is asked to understand the publication’s safeguards before the reader has been given a concrete historical field and a plain-language human question.

The 390/430 inspection also confirms that the Hero has enough physical room for a compact explanatory object without creating a dense first viewport. The existing empty space should do historical-orientation work rather than remain purely atmospheric.

---

## 3. Final reader-facing copy architecture

The copy below is the recommended production copy for #71. Minor punctuation or line-break changes are allowed for typography; substantive wording is not an implementation-agent decision.

### H1 — Hero

**Credit line**  
`Project Ares · digital publication`

**Wordmark**  
`Project Ares`

**Descriptor**  
`Eight historical cases of mass killing · 1915–1995`

**Deck**  
> They unfold across different societies and regimes, from single-day massacres to years-long campaigns. Project Ares asks what human and institutional conditions recur across them.

**Primary action**  
`See the eight cases` → `#historical-field`

**No second Hero action is required.** The previous two-action pattern is not harmful, but it adds a choice before the reader needs one. The natural scroll reaches the question after the historical field.

**What this replaces:** the current methodology-forward Hero deck, including its early `extreme mass homicide`, estimate, uncertainty and source-policy language.

### H2 — Resume, conditional

Keep the existing compact local Resume behavior. It is for a returning reader and does not enter the first-time narrative sequence.

- absent when no valid local state exists;
- one line/action plus clear dismiss/clear control;
- no progress summary;
- no card/dashboard treatment;
- must not change Hero composition before hydration.

### H3 — Historical field

**Label**  
`The historical field`

**Heading**  
`Eight cases across eighty years`

**Orientation**  
> The cases are separated by years and decades, and their recorded case windows range from one day to about four years.

**Calendar-rail legend**  
`Position on the line is proportional to calendar time.`

**Case-row content**

Each linked row carries, in this order:

1. the canonical `navTitle` **verbatim**, including its parenthetical year/period;
2. `location.display`;
3. `Recorded case window: {caseSpanInWords(record)}`.

Do **not** place classification/source-status text in the default row. Classification is historically and legally important but is not needed to understand the Home field; it remains visible in the case opening and deeper record.

**Boundary note after the rows**  
> Case windows follow the boundary recorded for each case study; several are judgement calls. They are not a measure of severity or harm.

**Quiet method link**  
`How the case windows are defined` → the existing duration/tempo explanation.

**Case navigation:** each row is the case link. Home does not add a second eight-case directory.

### H4 — Primary question / thesis

**Label**  
`The question`

**Heading**  
`What makes organized mass killing possible?`

**Body**  
> These cases are not interchangeable. Project Ares asks which human and institutional conditions recur across them—and how those conditions can help make organized mass killing possible.

There is **no numbered 01/02/03 proposition list on the final Home**. The old list promoted comparison guardrails and source-status policy into co-equal opening ideas. Those rules remain binding in the publication; they are no longer the Home thesis.

### H5 — Framework hand-off

**Label**  
`What appears to recur`

**Heading**  
`Recurring conditions, not a fixed sequence`

**Body**  
> Ares follows four interacting kinds of condition: political and social conditions; construction of a threatening out-group; authorization and organization; and the situational dynamics that can move people into violence. They are not a fixed sequence.

This wording is a reader-facing compression of the source-reviewed four-domain `process.json` authority. It must not be expanded into a stage ladder, risk score or deterministic progression on Home.

**Source note, subordinate**  
`Ares synthesis of Dutton, Boyanowsky & Bond (2005).`

**CTA**  
`Read the framework` → `/framework`

### H6 — Quiet apparatus

**Intro**  
`For the complete publication, source registry, uncertainty and method:`

Then retain the quiet native `Contents` disclosure and links to sources/provenance and method/about.

The apparatus does not regain a long paragraph and does not appear before the substantive sequence.

---

## 4. Hero visual ruling and exact contract

### 4.1 Adopt: the chronology rail

The Hero gets one explanatory object: a thin linear rail from the earliest to latest canonical chronology anchor, with one identical mark per case.

Its job is narrow:

- establish that Project Ares spans the twentieth century rather than one war or region;
- make `eight cases · 1915–1995` perceptible rather than merely stated;
- show that the cases are not evenly distributed in time;
- create a visual bridge into H3 without adding another concept.

It does **not** encode deaths, duration, classification, geography, severity or importance.

### 4.2 Inputs

Only:

- the eight canonical case records from `src/content/data/cases.json`;
- each record’s `sortKey`;
- the earliest canonical `sortKey`, `1915-04-24`;
- the latest canonical `sortKey`, `1995-07-11`.

No external image, map, historical border, flag, casualty estimate or inferred date is required.

### 4.3 Geometry

For a case with canonical anchor date `d`:

```text
position = (d - 1915-04-24) / (1995-07-11 - 1915-04-24)
```

Render that value on a **linear** horizontal axis. No logarithm, cap, floor, collision displacement or hand-tuning by case.

Expected positions, rounded for test fixtures only:

| Case | `sortKey` | Linear position |
| --- | --- | ---: |
| Armenian Genocide | 1915-04-24 | 0.00% |
| Ukrainian Holodomor | 1932-08-01 | 21.53% |
| Nanking Massacre | 1937-12-13 | 28.22% |
| My Lai Massacre | 1968-03-16 | 65.94% |
| Cambodian Killing Fields | 1975-04-17 | 74.78% |
| El Mozote Massacre | 1981-12-11 | 83.07% |
| Rwandan Genocide | 1994-04-07 | 98.43% |
| Bosnia — Srebrenica | 1995-07-11 | 100.00% |

The last two marks are intentionally close. That is the historical information. Do not separate them artificially.

Every case mark has identical stroke/weight/colour. Variation is carried only by **position on the calendar**.

### 4.4 Mobile composition

At 320–430 px:

- rail spans the available Hero content measure;
- endpoint years `1915` and `1995` are visible;
- eight marks remain visually distinct at the available width without enlarging individual cases;
- no case labels, tooltips or tap targets appear on the Hero rail;
- descriptor + rail together carry the historical-scope fact, allowing the deck to stay short;
- no motion or draw-on effect.

The rail should occupy roughly 64–96 px of vertical space including endpoint labels. It is a historical locator, not a chart panel.

### 4.5 Desktop adaptation

The same rail may become wider. Do not add labels, hover states, map layers or a second information tier merely because room exists. It may sit below the Hero copy or alongside it if the reading order remains wordmark → descriptor → deck → rail → primary action.

### 4.6 Accessibility and no-JS

The Hero rail is redundant with the descriptor and H3 list, so it may be `aria-hidden="true"` provided the semantic text remains present. It must be server-rendered as ordinary HTML/CSS or inline SVG; JavaScript is not required to calculate or reveal it.

With CSS/SVG unavailable, the reader still receives the descriptor, deck and H3 list. No information needed to understand or navigate Home disappears.

### 4.7 Why the other Hero candidates lose

| Candidate | Ruling | Reason |
| --- | --- | --- |
| Restrained cartography | Reject for #71 | The eight cases cross defunct/changing political geographies; the repository has no sourced historical-border dataset. A modern basemap would silently misstate historical geography. |
| Rights-cleared document image | Reject for #71 | #35 explicitly leaves rights research unfinished and deferrable. No suitable document asset is currently cleared in the canonical production record. |
| Generic archival/war image | Reject | Adds affect or atmosphere rather than explanation; rights and ethical burden exceed communicative value. |
| Abstract motif unrelated to data | Reject | Decoration does not reduce reading work. |
| Chronology-derived case rail | **Adopt** | Uses canonical data, establishes scope in one glance, carries no rights risk and directly prepares the reader for H3. |

---

## 5. Eight-case quantitative and comparability audit

### 5.1 Corpus-wide findings

1. Every `deathEstimate` is `requires-source-trace`.
2. `src/content/data/references.json` currently contains the Dutton et al. source paper but no case-level source registry capable of establishing the method and endpoint semantics for the eight death estimates.
3. The eight death fields do not measure one common construct. Some are direct massacre deaths; some include starvation/disease or broader regime mortality; Bosnia contains a broad war total and a focal Srebrenica figure in one display string; El Mozote contains a total and a child subset.
4. Most displayed lower/high endpoints have **unresolved interval semantics in the repository**. The current record does not establish whether they are statistical uncertainty, definitional disagreement, competing institutional counts or another construct.
5. The prior #62 document’s statement that My Lai `347–504` is specifically two institutional counts is **withdrawn as Home authority**. The current repository does not source that endpoint provenance. Until source tracing establishes it, the only defensible statement is that it is a legacy debated range.
6. `duration.days` uses a common unit but not a uniform historical boundary. It is best treated as the **recorded case-study window**, not as one clean corpus-wide measure of “duration of killing.”

### 5.2 Case-by-case audit

| Case | Chronology / recorded window | `deathEstimate.display` verbatim | What the current record says the estimate counts | Endpoint / compound meaning | Trace status | Common-scale verdict |
| --- | --- | --- | --- | --- | --- | --- |
| Armenian Genocide | Anchor `1915-04-24`; `1065` days, approximate. Duration note measures from Feb 1915 disarmament through end 1917; notes wider 1914–1923 datings. | `1,000,000–1,500,000` | Deaths across the genocide/campaign as presented by the case; case prose includes massacre, deportation, starvation and disease mechanisms. | Legacy range; repository does not establish method or why endpoints differ. | `requires-source-trace` | No proportional death encoding. Duration is a judgement-bounded case window, safe as text only on Home. |
| Ukrainian Holodomor | Anchor `1932-08-01`; `396` days, approximate. Note chooses Aug 1932 through end of summer 1933; peak-mortality months would be much shorter. | `3,900,000–7,000,000` | Deaths associated with engineered famine/starvation and associated disease in Soviet Ukraine as presented by the case; no direct-killing-only construct. | Legacy debated range; repository does not establish whether endpoints are demographic-method, definitional or other disagreement. | `requires-source-trace` | No proportional death encoding. No duration geometry on Home because policy-window vs peak-mortality boundary is a substantive choice. |
| Nanking Massacre | Anchor `1937-12-13`; `42` days, approximate. Note uses roughly six weeks from entry into the city and excludes later smaller-scale violence. | `200,000–300,000` | Deaths in the massacre as presented; case prose includes civilians and surrendered/disarmed soldiers among victims. | Legacy debated range; endpoint method and interval semantics are not source-traced. | `requires-source-trace` | Potentially closer to a direct-killing construct, but current provenance is insufficient for shared death geometry. Recorded window is safe as text. |
| My Lai Massacre | Anchor `1968-03-16`; `1` day, not approximate. Killing is bounded to morning/afternoon; cover-up and courts-martial are aftermath. | `347–504` | Unarmed civilian deaths in the massacre. | Legacy debated range. **Current repo does not establish the provenance of 347 versus 504 or justify treating the span as a statistical interval.** | `requires-source-trace` | Direct event count, but source semantics remain insufficient for Home geometry or a shared range grammar. |
| Cambodian Killing Fields | Anchor `1975-04-17`; `1362` days, approximate. Note chooses the full Khmer Rouge rule through 7 Jan 1979 because deaths from execution, forced labour and starvation run across the regime. | `1,500,000–3,000,000` | Broader regime-attributable mortality as presented, including execution, forced labour, starvation and disease; not a direct-killing-only count. | Legacy range pending source-level verification; endpoint construction unresolved. | `requires-source-trace` | Not commensurable with bounded massacre counts. Duration is a regime/case window, not continuous killing intensity. |
| El Mozote Massacre | Anchor `1981-12-11`; `1` day, not approximate. Note chooses the El Mozote killings on 11 Dec; surrounding operation would span 10–13 Dec. | `~978 (553 children)` | Approximate total civilian deaths plus a child subset. Case prose says `at least 978 civilians, including 553 children`; the structured display must remain verbatim unless separately reconciled. | **Not a range.** `553 children` is a subset of the approximate total, not a low/high endpoint. | `requires-source-trace` | Cannot enter a generic range/band grammar. One-day case window is itself a scope choice versus the surrounding operation. |
| Rwandan Genocide | Anchor `1994-04-07`; `100` days, approximate. Conventional 7 Apr to mid-July window; chronology gives 4 July for capture of Kigali. | `800,000–1,000,000` | Deaths of Tutsis and moderate Hutus in the genocide as presented by the case. | Legacy range; case prose says `800,000 to over 1 million`, while structured display ends at `1,000,000`; do not normalize without source review. | `requires-source-trace` | A direct mass-killing estimate, but endpoint/source semantics remain insufficient for a common Home magnitude scale. |
| Bosnia — Srebrenica | Anchor `1995-07-11`; `1370` days, approximate. Duration note measures the 1992–95 Bosnian War, not the July 1995 Srebrenica killings. | `~100,000 (8,000+ at Srebrenica)` | A broad Bosnian War death total plus a focal Srebrenica victim figure at a different scope. | **Two quantities at different scopes in one display field.** They are not an uncertainty range and cannot drive one mark. | `requires-source-trace` | Fatal blocker for a corpus-wide death mark. Duration geometry would also compare a whole-war window with bounded massacre windows. |

### 5.3 What would become false if reduced to one plotted death value

A one-value-per-case death chart would necessarily do at least one of the following:

- turn Bosnia’s two-scope field into one silently chosen quantity;
- treat El Mozote’s child subset as if it were uncertainty or discard it;
- imply that famine/regime mortality and bounded massacre victim counts are the same measurement construct;
- assign statistical meaning to ranges whose endpoint semantics are not currently sourced;
- render `requires-source-trace` estimates as if their methods were already established;
- select midpoints or endpoints that the canonical record does not authorize.

No caption can repair those assertions after the geometry has made them.

---

## 6. Candidate historical-field comparison

### A. Chronology + duration + textual death estimate

**Verdict: partially useful, not selected as specified.**

- Chronology remains essential.
- Textual recorded case windows are useful and retained.
- Proportional duration geometry is rejected for Home because the case-boundary audit is heterogeneous.
- Printing all eight death estimates on Home would add source-status and construct caveats precisely where #70 is removing methodology burden. It would also visually invite a comparison the current source record cannot support.

**Retained piece:** chronology + textual recorded case window.

### B. Chronology + magnitude bands/ranges

**Verdict: reject on current evidence.**

Broad bands do not solve construct mismatch. They merely hide precision while still asserting that all eight cases belong on one death-magnitude variable. Bosnia and El Mozote do not even supply the same field shape as a conventional range, and most endpoint semantics are unknown.

A banded treatment may be reconsidered after source tracing establishes a genuinely common quantity and defensible thresholds. #71 must not invent those thresholds.

### C. Chronology + proportional death magnitude

**Verdict: reject on current evidence.**

The source/provenance audit fails before geometry is considered. Even if it did not, the current display values span from hundreds to millions; an honest linear phone-scale treatment would make smaller values effectively invisible, while floors/caps or an audience-hostile logarithm would distort the represented relationship.

The rejection is **not** `death geometry is unethical in principle`. It is: **this corpus does not presently provide one sufficiently comparable, source-traced death quantity for a truthful proportional Home encoding.**

### D. Linear calendar rail + linked cases + recorded case-window text

**Verdict: adopt.**

This treatment encodes a quantitative dimension the record actually supports: elapsed calendar time between canonical chronology anchors.

It adds explanatory work the shipped field lacks:

- true temporal gaps and clustering are perceptible;
- chronology remains the fixed organizing order;
- the list still provides direct case navigation;
- tempo differences remain visible in natural-language case windows without false proportional geometry;
- no death estimate must be stripped of its source/construct caveats to make the graphic work.

It also needs only one short legend. If the reader understands `position on the line is calendar time`, the visual is usable.

---

## 7. Selected historical-field encoding contract

### 7.1 Encoded variables

| Channel | Meaning | Rule |
| --- | --- | --- |
| Horizontal position on calendar rail | Canonical chronology anchor (`sortKey`) | Linear elapsed time, earliest anchor = 0%, latest = 100%. |
| Mark size/weight/colour | Nothing quantitative | Identical for all eight cases. |
| List order | Chronology | Existing `sortKey` order only. Never sortable. |
| Case-window text | The duration boundary recorded by Ares for that case study | Use `caseSpanInWords(record)`; do not convert to geometry on Home. |
| Death estimate | **Not present on Home in #71** | Current corpus fails common-quantity/source-trace test. |
| Classification | **Not present in default Home field row** | Deferred to case opening/depth so a first-time reader need not parse technical classification to understand the field. |
| Location | Place orientation | Render `location.display` as text. No map. |

### 7.2 No hidden transformations

- no logarithmic axis;
- no mark-size scaling;
- no minimum-size floor per case;
- no collision displacement of chronology marks;
- no manual per-case positions;
- no midpoint calculation for any range;
- no normalized death or duration score;
- no colour ramp;
- no ranking language.

### 7.3 Semantic structure

The case navigation remains an `<ol>` of ordinary links in chronological order. The rail may be a sibling `<figure>`/inline SVG or a CSS rendering from the same case data.

The list itself is the semantic equivalent of the rail because every plotted mark’s date identity is available through the canonical case title/order. A screen reader must not be forced through a duplicate eight-item graphic before the eight links.

### 7.4 Scope language

Visible copy says `recorded case window`, not `duration of killing`, because the audit shows that the boundary semantics differ materially.

The boundary note is sufficient on Home. The detailed notes remain one layer away.

---

## 8. Final mobile Home wire-level hierarchy

Target: one dominant communicative job at a time, without adding new sections.

```text
390 px                                             target burden
┌──────────────────────────────────────────┐
│ PROJECT ARES · DIGITAL PUBLICATION       │
│                                          │
│ PROJECT ARES                             │
│ Eight historical cases of mass killing  │
│ · 1915–1995                              │
│                                          │
│ They unfold across different societies… │
│                                          │
│ 1915 ─│────│─│────────│──│──│──────││─  │  H1 Hero
│                                    1995  │  0.8–1.0 screen
│                                          │
│ [ See the eight cases ]                  │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ Continue — <last reading location>    ×  │  H2 Resume, conditional
└──────────────────────────────────────────┘  ≤0.1 screen
┌──────────────────────────────────────────┐
│ THE HISTORICAL FIELD                     │
│ Eight cases across eighty years          │
│ <1 orientation sentence>                 │
│                                          │
│ 1915 ─│────│─│────────│──│──│──────││─  │  proportional calendar rail
│                                    1995  │
│ Position on the line is proportional…    │
│                                          │
│ Armenian Genocide (1915–17)              │
│ Ottoman Empire · recorded window …       │
│ ───────────────────────────────────────  │
│ … × 8 linked rows                        │  H3 Field
│                                          │  1.5–1.9 screens
│ <boundary note>                          │
│ How the case windows are defined →       │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ THE QUESTION                             │
│ What makes organized mass killing        │
│ possible?                                │
│ <one thesis paragraph>                   │  H4 Question
└──────────────────────────────────────────┘  0.6–0.8 screen
┌──────────────────────────────────────────┐
│ WHAT APPEARS TO RECUR                    │
│ Recurring conditions, not a fixed        │
│ sequence                                 │
│ <four-domain compression>                │
│ Ares synthesis of Dutton et al. (2005)   │
│ Read the framework →                     │  H5 Framework
└──────────────────────────────────────────┘  0.6–0.8 screen
┌──────────────────────────────────────────┐
│ For the complete publication…            │
│ Contents ▸  Sources ▸  Method ▸          │  H6 Apparatus
└──────────────────────────────────────────┘  0.3–0.4 screen
```

Expected total default Home burden at ~390×844: roughly **4.0–4.9 screens**, depending on font metrics and case-title wrapping. This is a target range, not a reason to shrink type or collapse essential text.

### What is deliberately deferred

| Deferred from early Home | Where it belongs |
| --- | --- |
| `extreme mass homicide` as a technical category | Framework / source-paper context after the plain-language question is established. |
| comparability explanation | Short field boundary note, then comparison/method depth. |
| severity/anti-ranking policy | Binding implementation rule; only a short `not severity or harm` boundary line is reader-facing where needed. |
| source-trace mechanics | Case/source apparatus at point of claim; quiet Home apparatus. |
| classification/source-status row | Case opening and scholarly depth. |
| complete publication directory | Native Contents disclosure / footer. |
| all eight death estimates | Case openings until a source audit establishes a defensible common Home quantity. |

---

## 9. Desktop adaptation

Desktop is the same product and same sequence.

1. H1 → H6 order is unchanged.
2. The Hero rail may use the wider measure; it does not gain per-case labels or interaction.
3. H3’s calendar rail may use the full wide editorial measure. The eight linked rows remain one chronological list; do not split them into two reading-order columns.
4. At wider widths, each H3 row may align case title, location and recorded window into columns for faster comparison, but DOM order remains title → location → window.
5. H4 and H5 stay at readable prose measure rather than stretching across the page.
6. H6 may use the existing persistent-desktop Contents behavior; no additional Home directory is introduced.
7. No wide-only visual data, hover-only source access or desktop-only case path.

---

## 10. Accessibility, no-JS, reduced-motion and 200% text

### Semantic/no-JS

- All Hero and section copy is static HTML.
- Hero and H3 rails are rendered at build time; no client script is required for positions or visibility.
- H3 remains an `<ol>` of eight ordinary `<a>` case links.
- The rail never becomes the only source of date/order information.
- Native Contents remains useful with JavaScript disabled.
- Resume remains enhancement only and absent cleanly without JavaScript.

### Screen readers

- Avoid making a screen reader traverse the same eight cases twice. If the rail is semantically redundant, mark its SVG/visual layer hidden from assistive tech and provide a concise visible caption/legend plus the linked list.
- Case link names must remain distinguishable without relying on position or colour.
- Heading order remains one H1 followed by ordered H2 sections.

### Keyboard/touch

- rail marks are not controls;
- each case row is a normal keyboard-focusable link;
- visible focus preserved;
- interactive targets remain at least 44 px where the repository contract requires it;
- no hover-only explanation.

### Reduced motion

#71 adds **no motion** to Hero or historical field. No draw-on timeline, no scroll reveal, no accumulating marks, no scroll-linked effect.

### 200% text / reflow

At 320/360/390/430 and 200% text:

- descriptor/deck wrap naturally;
- rail retains its width without forcing horizontal overflow;
- tick marks need no labels beyond endpoints in the Hero;
- H3 case rows reflow vertically rather than compressing text;
- long case names are never truncated;
- any desktop-aligned H3 columns collapse to natural block flow;
- no content depends on fixed section heights.

---

## 11. Real provenance/source blockers

These are blockers to **specific desired visuals**, not blockers to #71 overall.

### Death-magnitude Home visual — blocked

Blocked by:

- all eight death estimates being `requires-source-trace`;
- absence of case-specific quantitative sources/method records in `references.json`;
- unresolved endpoint semantics for most displayed ranges;
- Bosnia’s two different scopes in one field;
- El Mozote’s total + child subset shape;
- mixed direct-killing, famine/regime mortality and broader-war constructs.

A later source-audit issue may reopen this. #71 may not solve it by normalizing the data.

### Period cartography — blocked

Blocked by absence of a sourced historical-boundary dataset across Ottoman, Soviet, Yugoslav/Bosnian and other relevant contexts. Modern borders are not a harmless substitute.

### Document/image Hero — blocked for #71

#35 has not cleared a canonical document/image asset and licence record for this use. The chronology rail therefore wins without waiting on rights research.

### Selected chronology rail — unblocked

It needs only canonical `sortKey` values already present and validated. No new provenance claim is created.

---

## 12. Exact #71 implementation boundary

### In scope

#71 implements only the final Home correction defined here:

- replace Hero descriptor/deck with §3 copy;
- remove the second Hero action unless implementation evidence shows it is required for an existing accessibility contract;
- add the §4 chronology rail to Hero;
- reorder Home so the historical field precedes the primary question;
- replace the numbered proposition block with H4;
- replace/extend `HistoricalField` with the §7 calendar rail and simplified case rows;
- keep case-window duration textual and use existing canonical display helper/data;
- remove Home classification/source-status text from field rows;
- do not render Home death estimates;
- replace framework hand-off copy with H5;
- simplify apparatus intro to H6;
- preserve compact Resume behavior;
- implement desktop/reflow/accessibility contracts here;
- update objective tests for the new order, copy and exact calendar-position calculation.

### Explicitly out of scope

- any rewrite of canonical case history;
- any source-trace resolution or death-estimate normalization;
- decomposing Bosnia or El Mozote estimate strings;
- adding a new death data schema;
- changing case-study bodies/openings from the #64 baseline;
- changing the four-domain process authority;
- period-map research;
- photography/document rights work;
- visual-system reset;
- route migration;
- real-reader testing or fabricated participant results;
- corpus-wide rollout.

### Stop conditions for #71

Stop the affected encoding and flag the mismatch if:

1. the canonical eight `sortKey` values differ from the §4 table;
2. implementation would require moving a chronology mark away from its linear calendar position to avoid collision;
3. a case-window value must be inferred rather than rendered from the existing canonical duration/display helper;
4. Home death geometry is proposed to compensate for the lack of visual variation;
5. a historical image/map requires a rights or boundary assumption not already resolved.

---

## 13. #71 acceptance criteria

### Reader-first copy

- [ ] Hero descriptor is `Eight historical cases of mass killing · 1915–1995`.
- [ ] Hero deck communicates historical difference and the human/institutional question without `comparability`, `source trace`, `classification`, `severity scale` or `extreme mass homicide`.
- [ ] The historical field appears before the primary question/thesis.
- [ ] H4 uses the §3 question/thesis copy and has no 01/02/03 methodology proposition list.
- [ ] H5 names recurring conditions only after subject/history/question are established.
- [ ] Apparatus remains last and quiet.

### Hero

- [ ] Explanatory chronology rail present; no decorative image.
- [ ] Rail derives only from canonical `sortKey`.
- [ ] Linear positions match §4 within a small implementation tolerance; no per-case displacement.
- [ ] Marks are identical except for position.
- [ ] No Hero map, flag, archival image, casualty mark or motion.
- [ ] Hero remains coherent at 320/360/390/430 and 200% text.

### Historical field

- [ ] Eight case rows, fixed existing chronological order.
- [ ] Linear calendar rail makes true anchor gaps/clustering visible.
- [ ] Each row uses canonical `navTitle`, `location.display` and `caseSpanInWords(record)`.
- [ ] `Recorded case window` language is used; Home does not call the values a common severity/intensity measure.
- [ ] Classification/source-status text is absent from default Home rows.
- [ ] No death estimate appears on Home in #71.
- [ ] No duration geometry, magnitude band, midpoint, log transform, cap or floor is introduced.
- [ ] Every case row is a direct normal link and survives no-JS.

### Integrity

- [ ] No canonical date, estimate, quotation, classification, uncertainty sentence or source status is changed.
- [ ] Bosnia and El Mozote compound estimate strings are untouched.
- [ ] The My Lai range is not relabelled as a confidence interval or institutional-count range without new source authority.
- [ ] The quantitative visual is described only as calendar position, never severity, importance, moral worth or rank.

### Access and behavior

- [ ] semantic Home complete with JavaScript disabled;
- [ ] keyboard order follows visual reading order;
- [ ] visible focus and ≥44 px interactive targets preserved;
- [ ] screen reader does not receive a duplicate eight-case traversal from the rail;
- [ ] reduced motion adds no animation;
- [ ] 200% text and 320/360/390/430/768/1440 remain coherent with no page-level horizontal overflow;
- [ ] complete publication directory remains demoted to apparatus.

### Evidence/gates

- [ ] `pnpm check` green at exact PR head.
- [ ] Fresh 390 px and 430 px evidence reviewed for first viewport, historical field, H4 question and conditional Resume state.
- [ ] Screenshot review checks cognitive hierarchy, not only overflow.
- [ ] No claim of reader comprehension is made from automated evidence; #73 repins the real-reader protocol after #71 is deployed.

---

## 14. Relationship to older authority

Implementation agents should use this precedence order for Home:

1. `Ares_3_1_Final_Home_Communication_Design.md` — final #70 Home copy, Hero, field and wire hierarchy.
2. `Ares_3_1_Quantitative_Historical_Visualisation_Amendment.md` — general quantitative-encoding rule.
3. `Ares_3_1_Human_First_Mobile_Editorial_System.md` — public identity, dominant-idea law, case-opening grammar and progressive disclosure; its conflicting Home copy/order/no-visual/chronology-only clauses are superseded here.
4. `Ares_2_Product_Editorial_Design_Brief.md` — durable product/editorial/ethical rules.
5. `Ares_3_Ground_Level_Overhaul.md` — visual-system authority, not Home communication authority.

`04-docs/figures/03-duration-and-scale.md` remains a specialist `/comparison` figure specification. Its log-duration geometry is **not** a Home pattern and must not be transplanted into #71. The duration audit here is later authority on what `duration.days` means across the corpus.

---

## 15. Handoff conclusion

#71 does not need a new product decision.

It has:

- exact opening copy;
- exact Home section order;
- one approved Hero visual and its data formula;
- a complete eight-case quantitative/provenance audit;
- explicit rejection grounds for death magnitude, death bands and Home duration geometry;
- one selected quantitative historical-field treatment;
- exact data channels and forbidden transformations;
- mobile/desktop/accessibility/no-JS contracts;
- provenance blockers and stop conditions;
- objective acceptance criteria.

**#71 is fully ready to execute once this authority is merged.**
