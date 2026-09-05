# Ares 2.3 parent/child content graph — Issues #51 and #55

**Status:** Authoritative map of the representative hierarchy, corrected by #55's parent-screen composition invariant. Representative slice only; the rest of the corpus is mapped as *not yet migrated* rather than guessed at.
**Derived from:** `main` at `97f5f7e86d490635302d118379ff9884aada1248`
**Machine-readable form:** `src/content/data/hierarchy/*.json`, validated by `src/lib/content/hierarchy-schema.ts` and `src/lib/content/hierarchy.ts`
**Gate boundary:** #46 must record ACCEPT or AMEND-complete before #47 migrates anything below the line drawn in §5.

## 1. What this document is for

Issue #51 replaces the remaining long-page mobile model with an explicit hierarchy: **one bounded conceptual unit per mobile reading surface; moving to another unit is a navigation action, not a scroll.**

That cannot be implemented as "split every heading into a route". It needs a statement of what is a subset of what, which canonical file each unit comes from, and where the repository genuinely does not know. This file is that statement in prose; `src/content/data/hierarchy/*.json` is the same statement in a form the build validates.

Two rules govern both:

1. **Reference, never copy.** A unit points at `src/content/sections/*.md`, `src/content/cases/*.md`, `cases.json` or `mobile-reading-prototype.json`. Navigation text (label, title, question, cognitive job) and caveats are authored at the graph level; manuscript prose never is. `tests/unit/hierarchy.test.ts` fails the build if a sentence from a manuscript appears in the graph.
2. **Ambiguity is recorded, not resolved.** Where a subset relationship is arguable, the unit carries a `note` saying so and naming the issue that owns the decision.

## 2. The graph

Roles are editorial, not visual: `overview` (a parent surface that exposes its children), `essential` (first-pass reading), `depth` (optional scholarship, off the guided march), `utility` (a research tool), `full-scholarship` (a complete canonical manuscript).

```text
ares — / — overview
├─ framework — /framework — overview
│  ├─ framework-scope-purpose — /framework/scope-purpose — essential — screen
│  ├─ framework-definitions-typology — /framework/definitions-typology — essential — screen
│  └─ framework-theoretical-lenses — /framework/theoretical-lenses — depth — screen
├─ my-lai — /cases/my-lai-massacre — overview
│  ├─ my-lai-orientation — /cases/my-lai-massacre/orientation — essential — screen
│  ├─ my-lai-narrative — /cases/my-lai-massacre/narrative — essential — screen
│  ├─ my-lai-key-evidence — /cases/my-lai-massacre/key-evidence — essential — screen
│  ├─ my-lai-finding — /cases/my-lai-massacre/finding — essential — screen
│  └─ my-lai-scholarly-depth — /cases/my-lai-massacre/scholarly-depth — depth — screen
└─ comparison — /comparison — overview
   ├─ comparison-tempo — /comparison/tempo — essential — screen
   └─ comparison-scholarly-depth — /comparison/scholarly-depth — depth — screen
```

### Guided sequence

Previous/next are derived from this tree by depth-first pre-order over screen units whose role is `overview` or `essential`. Depth screens are deliberately excluded, so *Next* never turns optional scholarship — or extended atrocity detail — into the step the reader is expected to take:

`ares → framework → framework-scope-purpose → framework-definitions-typology → my-lai → my-lai-orientation → my-lai-narrative → my-lai-key-evidence → my-lai-finding → comparison → comparison-tempo`

A depth screen instead offers its parent (return) and the guided unit that follows its parent (continue).

## 3. Unit register

| Unit ID | Label | Parent | Route | Screen | Role | Canonical source | Visible caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ares` | Ares | — | `/` | yes | overview | `sections/front-matter.md`; the eight-case registry in `cases.json` | none at this level; see note |
| `framework` | Framework | `ares` | `/framework` | yes | overview | `sections/scope-purpose.md` | vocabulary, not a legal classification system |
| `framework-scope-purpose` | Scope & purpose | `framework` | `/framework/scope-purpose` | yes | essential | `sections/scope-purpose.md` | inherits the framework overview's |
| `framework-definitions-typology` | Definitions & typology | `framework` | `/framework/definitions-typology` | yes | essential | `mobile-reading-prototype.json → framework`; `sections/definitions-typology.md` as depth | the three canonical caveats render from the reading contract in `#critical-caveats` |
| `framework-theoretical-lenses` | Theoretical lenses | `framework` | `/framework/theoretical-lenses` | yes | depth | `sections/theoretical-lenses.md` | none required at this level |
| `my-lai` | My Lai | `ares` | `/cases/my-lai-massacre` | yes | overview | `cases.json → my-lai-massacre`; `mobile-reading-prototype.json → case` | every unit inherits an unresolved source-trace state |
| `my-lai-orientation` | Orientation | `my-lai` | `/cases/my-lai-massacre/orientation` | yes | essential | `mobile-reading-prototype.json → case.orientation`; case record | contested record; figures and attributions untraced |
| `my-lai-narrative` | Core narrative | `my-lai` | `/cases/my-lai-massacre/narrative` | yes | essential | `cases/my-lai-massacre.md` section A | concise factual account; extended detail is not on this screen |
| `my-lai-key-evidence` | Key evidence | `my-lai` | `/cases/my-lai-massacre/key-evidence` | yes | essential | `cases.json` chronology indexes 2, 3, 5, 6; evidence index 0 | per-entry trace status; legacy unverified quotation attribution |
| `my-lai-finding` | Analytical finding | `my-lai` | `/cases/my-lai-massacre/finding` | yes | essential | `mobile-reading-prototype.json → case.finding`, `case.limitation` | the limitation is part of the claim, not a footnote |
| `my-lai-scholarly-depth` | Scholarly depth | `my-lai` | `/cases/my-lai-massacre/scholarly-depth` | yes | depth | `cases/my-lai-massacre.md` sections B, D, E, C, F; the complete chronology | reaching it is a choice; leaving it costs nothing |
| `comparison` | Comparison | `ares` | `/comparison` | yes | overview | `mobile-reading-prototype.json → comparison`; case registry | compared, never ranked |
| `comparison-tempo` | Dimension: tempo | `comparison` | `/comparison/tempo` | yes | essential | `mobile-reading-prototype.json → comparison.dimension`; case registry | duration describes an organizational problem, not gravity |
| `comparison-scholarly-depth` | Scholarly depth | `comparison` | `/comparison/scholarly-depth` | yes | depth | `sections/comparative-analysis.md`; case registry | a research surface, not a summary; no toll-as-geometry |

Every route in the table is a real static document produced by `pnpm build`, reachable without JavaScript, and validated as unique by the loader.

## 4. Subset relationships stated explicitly

These are the places where "is a subset of" is a real claim rather than a layout decision, and they are recorded in the graph rather than implied by the templates.

1. **My Lai key evidence ⊂ My Lai complete chronology.** The essential screen renders chronology entries 2, 3, 5 and 6 of the same eight-entry array in `cases.json` that the depth screen renders in full through the shared spine figure. It is one chronology shown at two grains, not two chronologies. The selection is authored in `mobile-reading-prototype.json`, validated against `cases.json` at build time, and asserted as a subset in `tests/unit/hierarchy.test.ts`.
2. **My Lai narrative ⊂ the canonical case document.** Section A is rendered whole on the narrative screen; sections B, D, E, C and F are rendered whole on the depth screen. Every declared section of the case appears exactly once across the two.
3. **Framework definitions ⊂ `definitions-typology.md`.** The essential screen renders the structured terms authored for the guided layer; the canonical manuscript is the same unit's scholarly depth, opened in place. The guided terms are not a second manuscript — they are a typed selection with their own caveat set.
4. **Comparison tempo ⊄ the five rollout themes.** Tempo is the #45 prototype dimension. It is *not* one of the five issue-defined drill-downs (preconditions and structural catalysts; target construction and propaganda; transitional mechanisms; cruelty and modality; perpetrator selection). Recorded as a distinct thing so #47 cannot mistake it for one fifth of the rollout.

## 5. Ambiguity recorded rather than resolved

| Question | What #51 did | Who owns the decision |
| --- | --- | --- |
| Should Scope & purpose be its own screen? | **Resolved by #55:** yes. Keeping it below the chooser made Framework both a parent and a leaf. | #55; #46 tests whether the added movement fragments reading |
| Should Theoretical lenses be its own screen? | **Resolved by #55:** yes, as optional depth. It no longer shares the parent surface with the child chooser. | #55; #46 tests discoverability and navigation cost |
| Should the My Lai depth screen have children? | No. B, D, E, C and F are five canonical sections and could each be a screen, but the essential path already answers the case's analytical question, and paginating a reader through a record they came to consult makes it harder to use. | #47, with real-reader evidence |
| Is the core narrative too long for one screen? | Kept whole. It scrolls, and it should: splitting a single narrative across screens destroys the continuity that makes it intelligible. This is the documented exception to the screen-length rule, not an oversight. | #46 debrief, then #47 |
| Does tempo survive as a drill-down? | Preserved unchanged and explicitly marked as not one of the five rollout themes. | #47 |
| Where do process, implications, reflection, glossary and references sit? | Deliberately absent from this graph. They keep their existing routes and remain reachable through Contents and the full-publication directory. Inventing parent/child relations for them without migrating them would be the silent guessing this issue forbids. | #47 |
| Do the other seven cases share My Lai's five-unit shape? | Unknown, and not assumed. Ares 2.2's variable case architecture exists because a three-month engineered famine and a single morning do not carry the same chapter shape. | #47, after a second representative case |

## 6. Screen-length review

The rule is one cognitive job per surface, not one viewport. Reviewed at 390 px:

| Unit | Rendered height at 390 px | Judgement |
| --- | --- | --- |
| `framework` | Parent/choice screen | One concise orientation and three immediate child links; no child manuscript is rendered below the chooser. |
| `framework-definitions-typology` | ~3 screens | Three terms and a caveat block: one job. |
| `my-lai` | 3380 px · 4.0 screens | Case metadata, the source-trace boundary, five choices. Roughly half is the dark case header the whole publication uses for case entry. |
| `my-lai-orientation` | ~2 screens | One job. |
| `my-lai-narrative` | ~4 screens | Longest essential unit. Kept whole deliberately; see §5. |
| `my-lai-key-evidence` | 3040 px · 3.6 screens | Four entries and one testimony: one bounded evidence set. |
| `my-lai-finding` | 2406 px · 2.9 screens | Finding and limitation, deliberately not separated. The shortest essential unit, and the floor set by the shared orientation and boundary chrome. |
| `my-lai-scholarly-depth` | very long | A research surface, entered by choice, with a content note first. Length here belongs to the record, not to the interface. |
| `comparison` | 3110 px · 3.7 screens | Warning, four findings, two choices. |
| `comparison-tempo` | 2795 px · 3.3 screens | One variable across eight cases. |
| `comparison-scholarly-depth` | very long | As above: the complete comparison as research material. |

Roughly 2.5 screens of every unit is shared chrome — masthead, orientation strip, caveats, unit boundary and footer. That is the cost of making location, role and next step answerable everywhere, and it is the main thing #46 should judge: whether the orientation earns its height, or whether readers experience it as repetition.

## 7. What the reader can answer on every screen

Each of the six #51 questions is answered by a named element, and `tests/browser/hierarchy-51.spec.ts` asserts each one at 390 px and 430 px:

| Question | Where it is answered |
| --- | --- |
| Where am I? | `.screen-trail [aria-current]` plus `.reading-location__progress` ("Essential reading · Unit 3 of 5") |
| What parent topic am I inside? | `.screen-trail` links, ending at the parent |
| What are the immediate child/sibling choices? | `.unit-children` on a parent surface; `.screen-nav__siblings` at a unit boundary |
| Essential or optional depth? | The role label in `.reading-location__progress` and on each `.unit-children` entry |
| What does Back do? | `.screen-nav__parent` ("Back to My Lai overview") and `.screen-nav__hint`, which states that browser Back returns to the screen you came from while the parent link always returns to the overview |
| What comes next? | `Next` in `.screen-nav__siblings`, and `Previously`/`Next` names in the location strip |

## 8. Durability of addresses

- Every screen unit owns a fragment-free path; the loader rejects a screen whose route carries a `#`.
- Units that still live on a parent surface must address themselves as `parentRoute#anchor`; the loader rejects any other shape.
- The anchors that #45 published for the reading stages — `/cases/my-lai-massacre#orientation`, `#key-evidence`, `#analysis`, `#full-scholarly-depth`, and `/comparison#tempo`, `#full-comparison-depth`, `#full-matrix`, `#full-analysis` — remain in their documents and forward to the screen that inherited them. Without JavaScript they land on the parent overview, which lists every child by name.
- Resume state moved from `ares:reading-position:v1` to `v2` because its meaning changed from "the last section I scrolled past" to "the unit I was inside". v1 state migrates once, dropping its fragment; a stored position that no longer names a published screen is discarded rather than offered.

## 9. What #51 did not do

- No other case, framework unit, comparison theme or publication route was migrated.
- No factual claim, date, quotation, casualty estimate, legal classification or source status was changed. The same canonical files render the same text; only its address changed.
- No caveat moved into depth. Every qualification that was in the essential layer before #51 is in the essential layer after it, and the graph adds unit-level caveats on top.
- No swipe pagination, client-side router or gamified progress was introduced. Progress is orientation ("Unit 3 of 5"), never reward.

## 10. Parent-screen composition correction — #55

> **Superseded; retained as the record.** Ares 3.0 §3 retired `/guided` and
> `/full-publication`, and folded the five My Lai routes and the two comparison
> routes back onto their parent surfaces. The tree and the audit table below
> describe a shape that is no longer built. Ares 3.1 replaces the Home contract
> again — see `Ares_3_1_Human_First_Mobile_Editorial_System.md` §4. Sections 1–9
> above remain the authoritative map of the representative slice, subject to the
> route mergers 3.0 recorded.

Issue #55 adds a semantic entry hierarchy above the representative graph without mass-migrating the remaining corpus:

```text
Home — /
├─ Guided reading — /guided
│  ├─ Framework — /framework
│  ├─ Historical cases — representative path enters My Lai
│  ├─ Cross-case findings — /comparison
│  ├─ Process — /process
│  └─ Implications / conclusion — /implications
├─ Explore cases — /cases
│  └─ eight canonical case routes
└─ Full publication — /full-publication
   └─ complete scholarly route directory and research utilities
```

The entry parents are route-composition surfaces rather than a second manuscript. They reference canonical routes and data; they do not copy publication prose. Home contains only its identity, one orientation sentence, conditional resume state, the three entry choices and one quiet About link. The complete directory, case archive and research utilities have moved to their own semantic children.

The representative parent audit is now:

| Route | Role | Immediate grouping | Child manuscript on parent? |
| --- | --- | --- | --- |
| `/` | parent/choice | Guided / Explore / Full | No |
| `/guided` | parent/choice | five major argument groups | No |
| `/cases` | parent/choice | eight canonical cases | No |
| `/full-publication` | full-publication directory | complete scholarly routes | No |
| `/framework` | parent/choice | three framework units | No |
| `/cases/my-lai-massacre` | parent/choice | five case units | No |
| `/comparison` | parent/choice | controlled dimension / complete comparison | No |

Existing leaf and optional-depth routes keep their #51 roles. Compatibility anchors continue to resolve to the screens that inherited their content. Automated evidence establishes mechanical separation only; #46 must determine whether people understand it and whether the extra movement is helpful or fragmentary.
