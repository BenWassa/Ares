# Ares 2.3 — Mobile screen composition principle

> **Partly superseded, twice.** Sections 1, 3 and 4 are amended by
> `Ares_3_Ground_Level_Overhaul.md` §3.1: a unit is still one coherent reading
> task, but a unit no longer requires a route of its own.
>
> Sections 5 and 6 — the Home contract and the Guided / Explore cases / Full
> publication top-level shape — are **superseded** by
> `Ares_3_1_Human_First_Mobile_Editorial_System.md` §3 and §4. Those routes no
> longer exist, and Home is now an editorial sequence rather than a chooser.
> The dominant-idea rule in 3.1 §3 is the current form of the invariant.
>
> The rest of this document — what a screen is (§2), why a parent must not stack
> unrelated groupings, the leaf and depth contracts (§8–§10), the anti-patterns
> (§11), the exception discipline (§12) and the navigation, resume and desktop
> implications (§13–§15) — still holds.

**Status:** Authoritative product/IA guidance for Issue #55.  
**Parent programme:** #44  
**Human gate:** #46 must not begin real-reader sessions until #55 is implemented, deployed and the testing baseline is re-pinned.  
**Rollout gate:** #47 remains blocked.

## 1. The principle

Ares 2.3 uses a hierarchical mobile publication model.

> **One screen represents one major grouping or one coherent reading task. A parent screen presents its immediate children; it does not also render sibling groups or their contents farther down the same page. Choosing a child moves the reader to that child screen.**

This principle applies at every level of the information architecture, including Home.

It is stronger than “split long articles into routes.” A site can have child routes and still overload a parent by stacking several unrelated groupings on that parent. That is the failure #55 corrects.

## 2. Screen does not mean viewport

A **screen** is a semantic navigation surface, not a promise that all content fits inside one physical phone viewport.

A screen may scroll vertically when its one coherent job requires it.

Examples:

- a case evidence screen may require several phonefuls of reading;
- a case-index screen may require scrolling through eight case choices;
- a full-publication directory may require scrolling through the publication tree.

Those remain one screen when every item belongs to the same immediate grouping or cognitive task.

A screen becomes suspect when the reader finishes one grouping or decision and then encounters another unrelated grouping simply by continuing to scroll.

## 3. Major grouping

A **major grouping** is a set of sibling choices that share one immediate parent and answer one navigation question.

Examples:

- Home: “How do you want to enter Ares?”
- Guided reading: “Which major part of the argument comes next?”
- Framework: “Which framework concept do you want to read?”
- Explore cases: “Which historical case do you want to enter?”
- Full publication: “Where in the complete publication do you want to go?”
- My Lai overview: “Which part of this case do you want to read?”

A major grouping should not share a parent screen with another independent grouping just because both are useful.

## 4. Parent-screen invariant

Every parent/choice screen should contain only:

1. **identity** — a clear title;
2. **orientation** — normally one short sentence explaining what this grouping is;
3. **its immediate children** — the one major set of choices owned by this parent;
4. **contextual state** — e.g. Continue/resume, only when directly relevant;
5. **minimal navigation** — parent/back/home as required.

It should not also contain:

- the contents of its child screens;
- another sibling directory;
- a separate archive;
- long-form article content;
- research utilities unrelated to the current grouping;
- repeated navigation choices already presented above;
- additional “while you are here” sections that create a second page purpose.

### Binding test

Ask:

> If the reader keeps scrolling, do they remain inside the same major grouping or coherent reading task?

If the answer becomes “no,” the next block probably belongs on another screen.

## 5. Home contract

> **Superseded** by `Ares_3_1_Human_First_Mobile_Editorial_System.md` §4. The
> three entry routes below were retired by Ares 3.0 and Home is no longer a
> chooser. What survives is the reasoning under *Why*: the reader should not have
> to evaluate the publication architecture before they can act. 3.1 reaches that
> by making Home communicate rather than by making it choose.

Home is the strongest expression of this rule.

Home has one job:

> **Orient the reader to Ares and let them choose how to enter it.**

Default Home composition:

```text
Ares
Short orientation sentence

[Continue] — only when a valid saved location exists

[Guided reading]
[Explore cases]
[Full publication]

Optional quiet link: About / How Ares works
```

Home must not also render:

- the full chapter/publication directory;
- the complete case archive;
- the executive summary as a long article block;
- long front matter;
- the full content note;
- glossary/references utilities;
- multiple repeated route directories;
- child content from Guided, Explore cases or Full publication.

Those are separate destinations.

### Why

The reader should make one high-level decision on Home. They should not need to evaluate the entire publication architecture, read the thesis, scan eight cases and understand research utilities before making that decision.

## 6. Default top-level hierarchy

> **Superseded.** `/guided` and `/full-publication` were retired by Ares 3.0 §3;
> the current shape is Home → the historical field → the eight cases, with the
> complete directory in the Contents control. See
> `Ares_3_1_Human_First_Mobile_Editorial_System.md` §4. Retained as the record of
> what was tried.

The intended top-level shape is:

```text
Home
├─ Continue (conditional state, not a fourth mode)
├─ Guided reading
├─ Explore cases
└─ Full publication
```

### Guided reading

```text
Guided reading
├─ Framework
├─ Historical cases
├─ Cross-case findings
├─ Process
└─ Implications / conclusion
```

This is a guided-path grouping screen, not the publication manuscript itself.

### Explore cases

```text
Explore cases
├─ Armenian Genocide
├─ Ukrainian Holodomor
├─ Nanking Massacre
├─ My Lai Massacre
├─ Cambodian Killing Fields
├─ El Mozote Massacre
├─ Rwandan Genocide
└─ Bosnia — Srebrenica
```

The case archive belongs here rather than on Home.

### Full publication

```text
Full publication
└─ complete scholarly hierarchy
   ├─ framework
   ├─ cases
   ├─ comparison
   ├─ process
   ├─ implications
   ├─ reflection
   ├─ glossary
   └─ references / provenance
```

This route may be long because its single job is browsing the complete hierarchy.

## 7. Lower-level example: Framework

Framework is a parent grouping screen:

```text
Framework
├─ Scope & purpose
├─ Definitions & typology
└─ Theoretical lenses
```

The parent may briefly explain how those three concepts relate.

It should not render a full Scope & purpose article followed by the Definitions choice followed by full Theoretical lenses content. Once a unit is treated as a child, choosing it should move to its reading screen.

If an editorial reason requires one child to remain embedded rather than routed, document that as an explicit exception; do not leave the hierarchy inconsistent accidentally.

## 8. Leaf reading-screen contract

A leaf screen has a different job from a parent screen.

It should contain:

- named location / breadcrumb;
- parent identity;
- one unit question or clear purpose;
- the essential content for that unit;
- meaning-changing caveats that cannot be deferred;
- optional depth links where appropriate;
- explicit previous/next/return behavior.

A leaf may scroll as needed. The rule is one cognitive job, not a fixed word count or viewport count.

## 9. Depth screens

Optional scholarly depth is a child/depth destination when stacking it underneath essential reading would create a second cognitive task.

Depth should not be used to hide:

- uncertainty that changes interpretation;
- source gaps that change confidence;
- legal or methodological qualification needed to understand the claim;
- principal evidence necessary to support the essential finding.

Depth is about pacing, not concealment.

## 10. Utilities

Glossary and references/provenance are utilities.

They should be directly reachable where needed, but should not be stacked into ordinary parent screens or compulsory Guided previous/next progression.

A utility route may itself be long if its one job is lookup/research.

## 11. Anti-patterns

The following do **not** satisfy this principle:

### Decorative separation

Adding whitespace, backgrounds, dividers or large cards while retaining several major groupings on one long page.

### Accordion concealment

Turning sibling groups into accordions on the same route. Hidden content is still co-located conceptual load.

### 100vh sections

Making every section fill a viewport while preserving one concatenated document underneath.

### Tabs/carousels as hierarchy substitute

Hiding sibling groups behind JavaScript tabs or swipe panels instead of giving them durable navigable locations.

### Duplicate directories

Showing the three top-level paths and then showing the full publication directory and case archive farther down Home.

### Parent plus child manuscript

A parent screen lists a child and then immediately renders the child's full content below the list.

### Mobile-only duplicate manuscript

Copying simplified prose into a separate mobile-only content tree instead of composing the canonical sources through a hierarchy.

## 12. Allowed exceptions

Exceptions are allowed when splitting would materially harm comprehension or historical/editorial continuity.

An exception must be documented with:

- the route/unit;
- the competing possible grouping;
- why splitting harms coherence more than continued scrolling;
- how orientation is preserved;
- why the route still has one dominant cognitive job.

“Easier to implement,” “already on the page,” or “desktop has room” are not sufficient reasons.

## 13. Navigation implications

The hierarchy must be expressed by normal web navigation.

Required:

- durable URLs or stable anchors for screen-level units;
- explicit parent link;
- browser Back/Forward behaves naturally;
- copied deep links restore the same conceptual location;
- no-JS traversal reaches every essential screen;
- no swipe-only or JavaScript-only movement;
- compatibility aliases preserved where published links already exist.

The reader should be able to understand the hierarchy from URLs, breadcrumbs and link relationships without reconstructing it from scroll position.

## 14. Resume implications

Resume is screen-level, not vague long-page position state.

A saved place should identify:

- conceptual unit ID;
- canonical route;
- human-readable parent path;
- optional within-unit position only as a secondary enhancement.

Home may show Continue when state exists, but Continue does not turn Home into a dashboard with additional resumed-content summaries.

## 15. Desktop relationship

The hierarchy is mobile-first but not a separate mobile publication.

Desktop may:

- place sibling choices in a wider grid;
- expose slightly richer orientation text;
- use space more efficiently.

Desktop should not silently revert to the old “everything on one page” model if doing so destroys the semantic parent/child structure.

One canonical source model must power all presentations.

## 16. Representative-route audit required by #55

Before implementation is considered complete, classify each currently migrated route as one of:

- **parent/choice screen**;
- **leaf reading unit**;
- **optional depth screen**;
- **utility**;
- **full-publication directory**.

Flag any route that mixes two or more of these roles.

At minimum audit:

- `/`;
- Guided reading entry;
- `/cases` / Explore cases;
- Full publication directory;
- `/framework`;
- `/framework/definitions-typology`;
- `/cases/my-lai-massacre` and its child routes;
- `/comparison` and its child routes.

## 17. Human-validation implication

The current live #51 build is technically valid but no longer the product baseline to validate.

**Pause #46 real-reader sessions until #55 is implemented and deployed.**

Afterward, #46 must test both sides of the tradeoff:

- does the stronger parent/child separation improve orientation and reduce overload?;
- does the extra navigation fragment narrative flow or become annoying?;
- can readers correctly predict what a child contains before opening it?;
- does Back behave as expected?;
- can they resume to the right grouping/unit?;
- can they still find Full publication and research utilities without them cluttering Home?

Automated tests can establish that the hierarchy works mechanically. They cannot establish that it works cognitively.

## 18. Agent acceptance checklist

Before an agent calls a screen complete, answer all of these:

- [ ] What is this screen's single major grouping or cognitive job?
- [ ] What is its semantic parent?
- [ ] What are its immediate children, if any?
- [ ] Does it render only those children rather than sibling groups?
- [ ] If it is a parent, does it avoid rendering child manuscripts underneath the choices?
- [ ] If it is a leaf, does it avoid becoming a directory/archive as well?
- [ ] Does continued vertical scrolling remain inside the same job?
- [ ] Is the next different grouping reached by an explicit navigation action?
- [ ] Does browser Back return somewhere sensible?
- [ ] Does a copied URL restore the same conceptual location?
- [ ] Can the same hierarchy be traversed without JavaScript?
- [ ] Does resume identify the conceptual unit rather than relying on scroll position alone?
- [ ] Are provenance, uncertainty and required caveats still visible where meaning demands them?
- [ ] Has the implementation avoided duplicating canonical manuscript prose?

If the first question cannot be answered in one sentence, the screen is probably doing too much.

## 19. Decision rule

> **If two blocks represent different major choices, different sibling groups, or different cognitive jobs, they should not be stacked on the same mobile parent screen. The reader should choose, then move.**
