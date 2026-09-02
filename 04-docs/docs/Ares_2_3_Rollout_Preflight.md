# Ares 2.3 rollout preflight — Issue #47

**Status:** Preflight only. No #47 production implementation has begun.  
**Superseded in part by #51.** The representative slice this file describes has been replaced by the screen hierarchy: what was one route per domain with stacked reading stages is now a parent surface with child screens, each with its own address. Read `Ares_2_3_Content_Graph.md` and the sections below marked *#51 update* before planning any rollout; the phasing, ownership and risk analysis still hold, but several concrete artifacts named here no longer exist.  
**Inspected baseline:** `caf4fa95a5bcf3447c4117108af6f257f5555c4a`  
**Human gate:** #46 must record **ACCEPT** or **AMEND-complete for rollout** before any step below becomes executable.  
**Architecture authority:** `Ares_2_Architecture_Decision_Record.md`  
**Product/editorial authority:** `Ares_2_Product_Editorial_Design_Brief.md`

## 1. What is already proven by #45

The representative vertical slice proves the technical shape only; #46 must still prove the cognitive-load claim with real readers.

Current validated prototype surfaces:

- home goal choice: Guided reading / Explore cases / Full scholarly publication;
- `/framework` orientation plus bounded `/framework/definitions-typology` unit;
- one complete guided case: `/cases/my-lai-massacre`;
- `/comparison` overview with high-level findings, tempo as a dimension-first view, and the complete comparison as scholarly depth;
- named `ReadingLocation` orientation;
- local-only resume, now screen-level and stored in `ares:reading-position:v2` (#51 update: v1 state migrates once and is then discarded);
- native `<details>` scholarly-depth controls;
- glossary/references as discoverable utilities rather than required next chapters;
- no-JS reading, durable links, source-state visibility, and the existing Ares 2.2 quality gates.

The current `MobileReadingPrototypeSchema` is deliberately prototype-specific: one framework unit, My Lai, and one tempo dimension. It must not be expanded by copy-paste into a second corpus.

## 2. Route and content inventory to migrate after the human gate

### Home and guided sequence

| Surface | Current state | #47 migration work |
| --- | --- | --- |
| `/` | Goal-based entry and prototype resume are live | Complete the guided route hierarchy, retain full directory, make Continue valid across every guided unit, keep glossary/references outside ordinary chapter march |

### Framework

| Canonical content | Current state | #47 target |
| --- | --- | --- |
| `scope-purpose.md` | Rendered on `/framework` as orientation | Bounded guided Scope & purpose unit with stable location/question/recap/next while preserving current anchors |
| `definitions-typology.md` + prototype structured terms | Representative bounded unit complete | Preserve the accepted #46 behavior; migrate only amendments supported by #46 evidence |
| `theoretical-lenses.md` | Currently optional disclosure on `/framework` | Bounded guided Theoretical lenses unit; full scholarly depth remains reachable |

Do not remove existing `/framework#scope-purpose`, `/framework#definitions-typology`, or `/framework#theoretical-lenses` compatibility without an explicit durable-alias plan.

### Historical cases

The canonical case corpus remains eight case Markdown documents plus `src/content/data/cases.json`.

| Case | Current guided status |
| --- | --- |
| Armenian Genocide | Legacy/full case only — migrate |
| Ukrainian Holodomor | Legacy/full case only — migrate |
| Nanking Massacre | Legacy/full case only — migrate |
| My Lai Massacre | #45 representative guided case — preserve accepted behavior |
| Cambodian Killing Fields | Legacy/full case only — migrate |
| El Mozote Massacre | Legacy/full case only — migrate |
| Rwandan Genocide | Legacy/full case only — migrate |
| Bosnia — Srebrenica | Legacy/full case only — migrate |

Each migrated case needs the validated pacing contract: orientation; core narrative; 3–5 essential chronology/evidence points; principal evidence where warranted; analytical finding + limitation/counterpoint; optional scholarly depth; explicit Continue/Pause/depth choices. Do not force a case into an identical section order when historical meaning or the canonical record does not support it.

### Comparison

Current `/comparison` has a dimension-first tempo prototype and the complete comparison manuscript/matrix as depth. #47 must retain the validated dimension-first interaction model while migrating the five issue-defined analytical themes into bounded drill-down units:

1. Preconditions / structural catalysts;
2. Target construction / propaganda;
3. Transitional mechanisms;
4. Cruelty / modality;
5. Perpetrator selection / situational transition.

*#51 update:* the comparison child slugs `/comparison/tempo` and `/comparison/scholarly-depth` are now published, and `/comparison#tempo`, `#full-comparison-depth`, `#full-matrix` and `#full-analysis` are compatibility anchors that forward to them. The five rollout themes still have no slugs; keep it that way until #46 is decided. Route naming is cheap to decide once and expensive to repair after links escape.

Tempo is a validated prototype dimension, not one of the five issue-defined full-rollout themes. After #46, decide explicitly whether tempo remains an overview example, becomes an additional drill-down, or is folded into another view. Do not silently delete it during migration.

### Remaining guided publication

| Route | Canonical authority | #47 work |
| --- | --- | --- |
| `/process` | `process.json` + `process-model.md`; four interacting, non-sequential, source-reviewed domains | Introduce bounded essential reading and named progress without weakening source mappings or implying a sequence |
| `/implications` | `implications.md` | Bounded guided unit(s), provenance-forward implications, explicit recap/next |
| `/reflection` | `critical-reflection.md` | Guided conclusion/limits; preserve uncertainty and the publication's claim boundary |
| `/glossary` | `glossary.json` | Keep as research utility; ensure persistent discoverability and direct return, not ordinary guided previous/next |
| `/references` | `references.json` | Keep as sources/provenance utility; ensure point-of-use access and direct return, not ordinary guided previous/next |
| `/cases` | canonical case registry | Preserve direct case entry and complete archive while making guided-case status legible where useful |

## 3. Shared schema/component changes likely required

These are preflight expectations, not permission to implement them before #46.

### A. Generalize the reading contract, not the manuscript

`src/content/data/mobile-reading-prototype.json`, `MobileReadingPrototypeSchema`, and `loadMobileReadingPrototype()` are intentionally narrow. After ACCEPT/AMEND-complete, replace or evolve them into a permanent validated guided-reading contract that can describe multiple units while continuing to reference canonical prose/data.

Likely stable fields include:

- durable unit ID and route/location;
- unit question;
- essential canonical selectors/IDs;
- visible meaning-changing caveats/uncertainty;
- bounded evidence/chronology selectors;
- analytical finding/recap where authored for the guided layer;
- optional depth targets by evidence/method/interpretation/provenance role;
- previous/next guided locations;
- trauma-aware Continue/Pause choices where relevant.

Do not copy full case/framework/comparison manuscripts into a guided manifest. `cases.json`, case Markdown, section Markdown, `process.json`, glossary data, and references remain their existing authorities.

*#51 update:* most of that list now exists as the screen hierarchy — `src/lib/content/hierarchy-schema.ts`, `src/lib/content/hierarchy.ts` and the domain-local files under `src/content/data/hierarchy/`. It carries unit IDs, routes, parent/child order, roles, questions, canonical source selectors and unit-level caveats, and it validates every selector against the published content. `MobileReadingPrototypeSchema` still owns the authored guided prose for the representative slice and remains deliberately narrow. #47 should extend the hierarchy files per domain rather than replacing them with a manifest, and should generalize the reading contract separately.

### B. Prove shared renderers with a second real use before bulk abstraction

*#51 update:* `MyLaiReadingPrototype.astro` no longer exists. `[slug].astro` special-cases the case to `MyLaiCaseOverview.astro`, and the five reading units are generated by `src/pages/cases/my-lai-massacre/[unit].astro` from the screen graph. The advice below applies unchanged to those two files. Do not rename either into a universal case component and immediately migrate seven cases. First migrate one second representative case after the gate, use that evidence to identify genuinely shared semantics, then extract/adapt the smallest stable guided-case renderer.

Apply the same discipline to framework and comparison child units: build the second real unit against the accepted contract before introducing a broad generic component.

### C. Guided route registry and navigation

*#51 update:* the guided sequence now exists. It is derived from the hierarchy by depth-first pre-order over screen units whose role is `overview` or `essential`, so depth and utility surfaces are never a compulsory Next, and sibling order is authored in one place. `publicationRoutes` is untouched and still describes the full publication including glossary/references. #47 needs to extend that graph, not build a second one, so that:

- guided previous/next can traverse bounded units;
- full scholarly publication order remains intact;
- glossary/references stay utilities rather than compulsory chapters;
- deep-linked focused study remains possible;
- route aliases remain durable.

Do not overload one route array with conditional mode logic if two explicit semantic sequences are clearer.

### D. Resume hardening

`ReadingLocation`, `ResumeHome`, and `reading-progress.ts` are already mostly route-agnostic, but #47 expands the state surface substantially. Extend the contract/tests for:

- every guided unit and major named section;
- stale routes/anchors after rollout;
- corrupt/partial localStorage values;
- safe handling of superseded resume state; #51 already added a v1→v2 migration and discards a stored position that no longer names a published screen, so extend that mechanism rather than inventing a second one;
- clear-state behavior;
- native browser history/deep-link truth when JavaScript is absent.

Prefer an explicit versioned migration or safe invalidation over guessing how an old state maps to a new route.

### E. Existing shared infrastructure to preserve

Preserve unless #46 evidence directly requires a change:

- `PublicationLayout` and native Contents architecture;
- `ReadingLocation` semantics and authored Previous/Next reorientation;
- `PageNavigation` as ordinary route navigation where appropriate;
- native `<details>` depth baseline;
- canonical glossary/provenance components;
- Ares 2.2 typography, source, figure, accessibility, and build-budget contracts.

## 4. Dependency order

### Gate 0 — human evidence

No #47 implementation branch or production migration until #46 records ACCEPT or AMEND-complete evidence. Pin the exact #46 decision-record commit SHA at implementation start.

### Phase 1 — accepted-contract foundation

One focused workstream should:

1. encode only the #46-accepted reading contract in a permanent schema/loader shape;
2. establish the guided route/sequence contract;
3. harden resume state/version behavior;
4. extend unit tests for canonical selectors, stable IDs, utility exclusion, and critical-caveat visibility;
5. make no bulk corpus migration.

This phase blocks all mass migration because parallel authors need a stable target.

### Phase 2 — prove the generalized pattern

Before seven-case or five-theme parallel rollout:

- migrate one additional non-My-Lai case with a different structure/load profile;
- migrate one additional framework unit;
- migrate one issue-defined comparison theme.

Run the full gate and rendered mobile review. If those three expose incompatible semantics, amend the shared contract here rather than spreading workaround branches across the corpus.

### Phase 3 — bounded parallel migration

Only after Phase 2 is stable:

- remaining case units may proceed in separate ownership lanes **if** their guided metadata/content is partitioned so agents do not all edit one monolithic manifest;
- remaining framework work can proceed independently from case authoring if it owns separate files;
- comparison themes can be parallel only if the comparison contract and per-theme authoring files are already stable;
- process/implications/reflection can form a separate guided-publication lane after shared ReadingLocation/sequence APIs are fixed.

If the implementation retains one monolithic guided JSON file, serialize edits to that file. Do not call work “parallel” while every branch edits the same central registry.

### Phase 4 — integration surfaces

After content lanes land:

- complete home guided hierarchy and Continue behavior;
- reconcile full Contents versus guided sequence;
- verify glossary/reference utility return behavior;
- reconcile legacy aliases/deep links;
- perform publication-wide density/disclosure pass without a visual-system reset.

### Phase 5 — full release gate

Run complete `pnpm check`, inspect exact rendered evidence, then deploy the exact tested artifact under the existing Pages workflow.

## 5. Safe parallel workstreams

After Phase 2, the safest ownership split is:

1. **Framework lane** — remaining bounded framework units and their local tests.
2. **Case lanes** — one or small groups of case Markdown/metadata mappings per lane; no shared renderer/schema ownership.
3. **Comparison lane** — dimension/theme authoring after one owner stabilizes shared comparison semantics.
4. **Process + implications + reflection lane** — guided wrapping of already-authoritative scholarly content; no process-model reinterpretation.
5. **Integration/navigation lane** — home, guided sequence, utilities, resume, aliases; lands after content routes are known.
6. **Verification lane** — adds/maintains cross-route contracts but does not redefine product semantics to make tests convenient.

Schema, shared renderers, shared route registries, `cases.json` if centrally edited, global CSS/tokens, and resume-state format are **not** good parallel ownership surfaces.

## 6. High-risk areas

1. **Duplicate manuscripts.** The easiest rollout shortcut is to copy long prose into guided JSON. That violates the canonical-content contract and creates drift.
2. **Silent factual/editorial rewriting.** Pacing work must not “clean up” dates, casualty estimates, quotations, classifications, or contested claims. `requires-source-trace` remains unresolved debt.
3. **Hidden meaning-changing caveats.** Uncertainty, legal/methodological qualification, and principal evidence cannot be pushed into depth merely to shorten screens.
4. **Trauma agency regression.** Bulk case templating can accidentally make extended atrocity detail mandatory or turn Continue into completion pressure.
5. **Comparison-as-ranking.** Five drill-downs must not read as a severity score, universal sequence, or equivalence claim.
6. **Route/fragment churn.** Child-route rollout can break legacy links, saved locations, browser history, and external citations.
7. **Resume-state drift.** Existing local state may point to routes/anchors that move during rollout; stale/corrupt state must fail safely.
8. **Monolithic agent conflict surface.** One central guided manifest or god renderer would undo the AI-maintainer architecture rationale.
9. **Disclosure overload.** Repeating nested details everywhere can recreate the cognitive burden the architecture is meant to reduce. Maximum nesting remains two levels.
10. **Design-system regression.** #45 already exposed how one extra typography combination can fail the locked type-ramp gate. Bulk units must reuse the existing ramp rather than proliferate local styles.
11. **Mobile wide-content regression.** The full comparison matrix/figures remain available as depth but may not become the primary horizontal-pan interaction at 320–430 px.
12. **No-JS divergence.** Guided enhancements must not make core reading, caveats, source access, or deep links depend on runtime state.

## 7. Tests and gates to extend

### Unit/content contracts

Add coverage that proves:

- every required guided unit has a durable ID, question, recap/establishment, and explicit next step;
- all canonical selectors/chronology/evidence IDs resolve;
- all eight cases are represented exactly once in guided case inventory;
- meaning-changing caveats/source states required for interpretation remain in the essential layer;
- guided data does not duplicate full manuscripts;
- guided sequence excludes glossary/references from compulsory previous/next traversal;
- route/fragment aliases resolve;
- comparison theme IDs are unique and non-ranking semantics are retained;
- process guided content still derives from the four-domain non-sequential source-reviewed model.

### Browser contracts

Extend Playwright across Chromium, Firefox, and WebKit for:

- complete Guided reading path from home to conclusion;
- direct focused entry into every case and each new framework/comparison unit;
- essential/depth behavior on every migrated case, including Pause/Continue and visible limitations;
- comparison dimension-first layouts and complete-matrix discoverability;
- keyboard operation of every disclosure/navigation path;
- JavaScript-disabled essential reading and scholarly-depth access;
- back/forward history and durable deep links;
- resume restore across multiple routes;
- stale, corrupt, partial, and old-version resume state;
- Clear saved place;
- 200% text scaling;
- reduced motion;
- horizontal overflow from 320px through 1920px;
- axe checks of representative and newly distinct states.

Retain the existing deterministic-build, duplicate-ID/fragment, source/provenance, figure, self-hosted-font, typography-ramp, CSS/build-budget, and exact-artifact deployment gates. Do not relax a gate because the route count grows.

### Rendered review

At minimum review changed representative surfaces at:

- 320/360 px stress width where relevant;
- 390 px;
- 430 px;
- 768 px;
- 1440 px;
- 1920 px for wide comparison/figure behavior.

Prioritize actual content density, closed/open depth states, long case material, larger text, and return/resume states rather than empty-component screenshots.

## 8. Exact stop conditions from #46

### If #46 = ACCEPT

#47 may begin only after:

- the decision record names the accepted architecture behaviors;
- required human thresholds are resolved;
- the exact #46 decision-record commit SHA is pinned in the implementation handoff;
- current `main` is green.

Implement the accepted behavior, not the preflight author's preferred redesign.

### If #46 = AMEND

**Stop #47.** Do not generalize the prototype schema across the corpus, migrate another case, create framework/comparison drill-downs, or open a #47 implementation PR.

Allowed work is limited to the #46-required amendment on the representative prototype/shared behavior needed to test it. After that change is live, rerun the affected human tasks. #47 remains blocked until #46 explicitly records **AMEND — complete for rollout** (or ACCEPT) and identifies the rechecked evidence.

An automated green gate is not AMEND-complete human evidence.

### If #46 = REJECT

**Do not start #47.** Do not preserve rollout work “just in case,” do not mass-migrate content onto a rejected schema, and do not open a #47 implementation PR.

The rejected assumptions must return to a separately scoped architecture/product-design decision. #47 stays blocked until a replacement architecture is prototyped and human-validated under a new explicit gate.

### If #46 is incomplete, mixed, or lacks the required decision

Treat it as blocked. “Mostly positive,” unaggregated session notes, AI inspection, or an issue comment without the decision record do not release #47.

## 9. Ready-to-execute handoff condition

This preflight is execution-ready when paired with a future #46 ACCEPT/AMEND-complete decision. The first #47 implementation prompt should include:

- current green `main` SHA;
- exact #46 decision-record commit SHA;
- accepted/amended behavior list;
- Phase 1 scope only;
- explicit prohibition on bulk content migration until the generalized contract is proven by Phase 2.

Until then, this file is a plan, not an implementation authorization.
