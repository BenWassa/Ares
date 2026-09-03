# Ares 2.3 human mobile validation protocol — Issue #46

**Status:** READY FOR REAL-HUMAN TESTING. No human evidence is recorded here.  
**Issue:** #46 — P2 human mobile validation gate  
**Prototype under test:** Ares 2.3 parent-screen hierarchy after #55 / PR #57.  
**Implementation baseline (`main`):** `adcd53ebf68335fad7a97f2ad6beac5bbd361666`  
**Deployment/workflow run:** `33704829404`  
**Live/tested `dist/index.html` SHA-256:** `84eacff8fc3056db9b648d277e235bba0de702cabb2e125fa5678fd78055b1b3`  
**Production origin:** https://benwassa.github.io/Ares/  
**Gate boundary:** #47 remains blocked until real-reader evidence exists and #46 records an explicit **ACCEPT** or **AMEND-complete** decision.

> The #55 composition rule is binding for this round: a parent screen is one grouping/decision context, not a directory plus embedded child manuscript. Home offers exactly three primary choices; Framework, My Lai and Comparison parents introduce their scope and hand off to separate child screens. Deep links, native Back/Forward, no-JS navigation and screen-level resume remain part of the tested contract.

## 1. Evidence boundary

This protocol tests whether the Ares 2.3 mobile architecture reduces overload without sacrificing comprehension, orientation, provenance awareness, or reader agency around traumatic material.

The publication is being tested, not the participant. Do not coach toward controls or teach the hierarchy before a task. A wrong turn, failure to find a child, or mistaken reading of a label is product evidence.

Only **real-reader sessions** count toward the #46 gate. CI, automated browsers, rendered screenshots, AI review, and moderator dry-runs establish readiness only. They must never be entered as participant results or counted toward a threshold.

Target **5–8 adult mobile readers**: roughly 3–5 non-specialists and 2–3 scholarly/history-adjacent readers where practical. Prioritize real 390–430 CSS-pixel phones, include Android and iOS where available, and include one 320–360 px/accessibility-scaling stress reader where practical.

## 2. Exact live routes

Use production, not localhost, a branch preview, or screenshots.

| Purpose | Live URL |
| --- | --- |
| Home / three entry choices / resume return | https://benwassa.github.io/Ares/ |
| Guided reading | https://benwassa.github.io/Ares/guided |
| Full publication | https://benwassa.github.io/Ares/full-publication |
| Framework parent | https://benwassa.github.io/Ares/framework |
| Framework — Scope & purpose | https://benwassa.github.io/Ares/framework/scope-purpose |
| Framework — Definitions & typology | https://benwassa.github.io/Ares/framework/definitions-typology |
| Framework — Theoretical lenses (depth) | https://benwassa.github.io/Ares/framework/theoretical-lenses |
| Cases index | https://benwassa.github.io/Ares/cases |
| Rwandan Genocide target | https://benwassa.github.io/Ares/cases/rwandan-genocide |
| My Lai parent | https://benwassa.github.io/Ares/cases/my-lai-massacre |
| My Lai — Orientation | https://benwassa.github.io/Ares/cases/my-lai-massacre/orientation |
| My Lai — Core narrative | https://benwassa.github.io/Ares/cases/my-lai-massacre/narrative |
| My Lai — Key evidence | https://benwassa.github.io/Ares/cases/my-lai-massacre/key-evidence |
| My Lai — Analytical finding | https://benwassa.github.io/Ares/cases/my-lai-massacre/finding |
| My Lai — Scholarly depth (optional) | https://benwassa.github.io/Ares/cases/my-lai-massacre/scholarly-depth |
| Comparison parent | https://benwassa.github.io/Ares/comparison |
| Comparison — Tempo | https://benwassa.github.io/Ares/comparison/tempo |
| Comparison — Scholarly depth / full matrix | https://benwassa.github.io/Ares/comparison/scholarly-depth |
| Glossary | https://benwassa.github.io/Ares/glossary |
| References | https://benwassa.github.io/Ares/references |

Do not give child URLs to participants unless a task explicitly begins there. Every child is a durable route and must remain reachable without JavaScript.

## 3. Session setup

Create one copy of `Ares_2_3_Human_Testing_Session_Record.md`; assign a non-identifying ID such as `P01`. Do not record names, emails, employers, schools, account identifiers, or unnecessary personal data.

Record device, OS, browser, CSS-pixel viewport if known, orientation, text/display scaling, input method, JavaScript/storage availability, and whether the device is the participant's own.

For Task 6, JavaScript and ordinary browser storage must be enabled. Do not clear Ares storage immediately before the interruption unless explicitly running a fresh-state variant.

The participant may pause, skip material, close depth, or end the session at any time. Extended traumatic detail is never required for task success.

## 4. Moderator opening script

> We are testing a mobile publication, not testing you. Some material concerns genocide, massacres and other mass killing. You can pause, skip material or end the session at any point, and you never need to open more detailed material merely because it is available.
>
> I will give you tasks and mostly stay quiet. Please use the site as you naturally would. If something is confusing, do what you would normally do rather than trying to guess what I want.
>
> I may time tasks and take anonymous notes about the interface. With your permission, I may record short anonymous quotations. There is no required level of prior knowledge.

Record quotation consent separately as Yes/No. Do not audio/video record without a separate consent process.

## 5. Participant tasks

### Task 1 — Opening orientation

Open https://benwassa.github.io/Ares/ . Without opening **Contents**, spend about 10–15 seconds on the opening screen, then answer:

1. What do you think Ares is?
2. What is it trying to help a reader understand or do?
3. Which choice would you use for the shortest coherent path?
4. What do you think distinguishes **Guided reading**, **Explore cases**, and **Full publication**?

Capture time to orientation, description accuracy, entry-choice interpretation and confidence (1–7).

### Task 2 — Find a specified case

Starting from wherever you are: **Find the Rwandan Genocide case.** Stop when you believe you are on it.

Capture success, time, route, wrong turns/loops, Contents use and moderator assistance.

### Task 3 — Read one case naturally

Open https://benwassa.github.io/Ares/cases/my-lai-massacre .

Read this case the way you normally would. Stop when you feel you have read the case. Do not open anything merely because you think the test expects it.

Then ask:

1. What is the main analytical point Ares is making with this case?
2. What evidence or chronology point most supports that interpretation for you?
3. What important uncertainty, limitation or source qualification did Ares communicate?
4. How many separate parts did the case seem to have, and did you read all of them?
5. At any point, did you know which part of the case you were on?

Record child screens entered and order, navigation method, whether the analytical finding was reached, optional-depth use, place loss, fragmentation/backtracking, comprehension (0–3), and immediate mental effort (1–9).

### Task 4 — Verify provenance

Stay anywhere inside My Lai. Prompt:

**Find what Ares says about the source status of the estimated death figure. Tell me whether it presents the figure as fully verified or as still needing source trace, and show me where you found that information.**

A pass requires both locating the relevant status and understanding **requires source trace** as unresolved verification/source-tracing debt, not a verification badge. Record whether the participant deliberately moves back to the case parent, wanders among siblings, or gives up.

### Task 5 — Essential versus optional; parent versus child

Return to https://benwassa.github.io/Ares/cases/my-lai-massacre and ask:

1. Which parts seem necessary for a first coherent reading, and which may be skipped?
2. Which cues did you use?
3. Do all five choices belong to the same case, or do any seem like unrelated topics?
4. If you opened **Key evidence**, did it look like all evidence for the case or a selected subset? How could you tell?

Then open https://benwassa.github.io/Ares/framework and ask:

5. How many framework units are offered here?
6. Which appear essential and which appear deeper/optional?
7. Where would you expect each unit to open?

A correct structural reading is: three separate child screens; **Scope & purpose** and **Definitions & typology** are essential first-pass units, while **Theoretical lenses** is depth. Do not teach this before the answer.

### Task 6 — Interruption and screen-level resume

Open https://benwassa.github.io/Ares/framework . Ask the participant to follow the essential reading path naturally. Allow them to move through **Scope & purpose** and into **Definitions & typology**. Interrupt after they have read enough of Definitions & typology to have a specific question or idea in working memory.

Give a neutral 3–5 minute interruption or have them leave the browser. Then return through https://benwassa.github.io/Ares/ and ask them to continue from where they believe they stopped.

After resuming ask:

1. What unit or question were you working on?
2. What larger topic was it part of?
3. What do you remember from immediately before the interruption?
4. Did **Continue**, **Previously**, or **Next** help, get in the way, or make no difference?

Capture correct screen recovery, seconds to regain context, backtracking, recall and cue reaction. A next-day resume check may be run for a subset but is not required for readiness.

### Task 7 — Comparison comprehension

Open https://benwassa.github.io/Ares/comparison . **Before opening either choice**, ask:

1. What do you expect to find behind each of the two choices?

Then let the participant use the comparison screens and ask:

2. State one cross-case pattern or difference Ares claims.
3. Why should the comparison not be read as saying the cases are equivalent?
4. Show where you would go for the complete matrix or fuller scholarly evidence.

Record parent-choice prediction, comprehension, drill-down discoverability, full-matrix findability, wrong turns and mental effort (1–9).

### Task 8 — Back, Next and parent recovery

Open https://benwassa.github.io/Ares/cases/my-lai-massacre/key-evidence directly. Before pressing anything ask:

1. Where are you?
2. What larger topic is this part of?
3. If you used the phone/browser Back action now, where would you expect to go?
4. What would you expect to come next?
5. What else could you reach from here?

Then ask the participant to use the page to return to the case as a whole. Record whether the result matched their expectation. Do not manufacture browser history before asking the prediction; native Back follows actual history, while the visible parent control has a stable authored destination.

### Task 9 — Copied deep link

Send/open https://benwassa.github.io/Ares/comparison/tempo as if received from another person. Ask:

1. What are you looking at?
2. What is it part of?
3. How would you reach the rest of the comparison?

Capture cold-entry orientation, parent identification and route recovery.

### Task 10 — Debrief

Rate 1–7:

- I always knew where I was.
- I knew what was essential and what was optional.
- The amount presented at once felt manageable.
- I could stop without feeling I had lost my place.
- The interface added unnecessary strain. **[reverse]**
- I am confident I understood the central argument.
- I had appropriate control over how much traumatic detail I encountered.
- Moving between separate screens helped rather than fragmented the reading.

Ask:

- Where did Ares feel longest?
- What did you skip, and why?
- What felt repetitive?
- What information did you want earlier?
- What felt like apparatus you did not need yet?
- Did any parent screen feel like a useful decision point, an unnecessary extra step, or both?
- Did separate screens make the hierarchy clearer or make the publication feel fragmented?

## 6. Scoring and measures

### Comprehension rubric (0–3)

- **0 — No usable comprehension:** cannot state the analytical point, or gives a materially wrong account.
- **1 — Partial:** identifies the broad subject but not the analytical relationship/finding; evidence/qualification is absent or mistaken.
- **2 — Adequate:** states the central analytical point in substance and gives at least one relevant supporting item or limitation.
- **3 — Strong:** accurately states the analytical point, connects it to supporting evidence/chronology, and preserves a meaningful uncertainty/source qualification.

Do not reward specialist vocabulary or prior historical knowledge.

### Mental effort

Immediately after Task 3 and Task 7 ask:

> How much mental effort did this reading task require?

Record **1–9**, where 1 = very, very low mental effort and 9 = very, very high mental effort.

### Primary measures

- task success and time;
- time to orientation;
- case/comparison comprehension;
- resume success and time-to-context;
- essential-vs-optional recognition;
- parent/child and subset recognition;
- unit completion/abandon point;
- 1–9 mental effort.

### Secondary measures

- perceived length 1–7;
- confidence 1–7;
- orientation 1–7;
- traumatic-detail agency 1–7;
- disclosure/depth-open rate;
- step-count/fragmentation observations;
- scroll depth/backtracking, interpreted cautiously.

SUS may be recorded as a secondary whole-site metric but must not replace comprehension or mental-effort evidence.

## 7. Product thresholds

Treat these as formative product gates, not inferential statistics:

- ≥80% correctly explain what Ares is and distinguish Guided reading from Full publication;
- ≥80% find the specified case without a wrong-route loop;
- median case comprehension ≥2/3;
- ≥80% locate and correctly interpret prompted provenance;
- ≥80% identify essential vs optional layers;
- ≥80% correctly place tested child screens under their parent context;
- ≥80% resume to the correct conceptual screen after interruption;
- median mental effort at least one point lower than the comparable prior baseline where a valid within-participant comparison is available, without lower comprehension;
- no participant reports that progress/navigation controls pressured them to continue through traumatic detail.

If one threshold misses slightly, interpret severity and qualitative evidence. If multiple core thresholds fail, do not authorize rollout.

## 8. Dry-run readiness record — not human evidence

**Dry-run date:** 2026-09-03  
**Baseline:** `adcd53ebf68335fad7a97f2ad6beac5bbd361666` / deployment `33704829404` / index SHA-256 `84eacff8fc3056db9b648d277e235bba0de702cabb2e125fa5678fd78055b1b3`.

Moderator-path dry-run against the live production build:

| Task | Readiness result |
| --- | --- |
| T1 Home | PASS — the exact tested/live artifact exposes Home as one orientation surface with the three primary choices Guided reading, Explore cases and Full publication. |
| T2 Rwandan case findability | PASS — the Cases index and Rwandan Genocide durable route are present in the exact tested/live artifact and covered by live route verification. |
| T3 My Lai parent + five child screens | PASS — the My Lai parent exposes five separate child routes: four essential reading screens plus optional Scholarly depth; child content is not embedded below the parent choices. |
| T4 My Lai source-status lookup | PASS — the My Lai source-status prompt is grounded in the visible “requires source trace” state and the Key evidence route; the wording does not imply completed verification. |
| T5 hierarchy / essential-depth / subset prompts | PASS — My Lai and Framework parent/child, essential/depth and selected-subset prompts match the deployed hierarchy; Framework has three durable child screens with Theoretical lenses marked as depth. |
| T6 interruption/resume setup | PASS — Framework → Scope & purpose → Definitions & typology, Home Continue, and screen-level resume are executable on the pinned build; resume behavior is technically verified, but no participant was simulated. |
| T7 Comparison parent + tempo + depth | PASS — Comparison is a parent choice surface with Tempo and Scholarly depth children; Tempo preserves the non-equivalence qualification and Scholarly depth contains the fuller matrix/evidence. |
| T8 direct Key evidence / parent recovery | PASS — the direct Key evidence route has stable parent recovery plus authored Previous/Next movement; the prompt correctly distinguishes visible parent navigation from native browser history. |
| T9 copied Tempo deep link | PASS — the copied Tempo deep link is durable and exposes enough parent/location recovery to run the cold-entry orientation task. |
| T10 debrief instrument | PASS — the debrief vocabulary matches the deployed #55 hierarchy and explicitly tests whether separate screens reduce overload or instead create fragmentation. |

**Evidence boundary:** No participant was simulated. No AI answer, automated browser assertion, screenshot review, moderator dry-run observation, or CI result counts as human evidence. This record establishes only that the protocol is executable against the pinned production artifact.

## 9. Decision boundary

After real sessions, summarize results in `Ares_2_3_Human_Testing_Decision_Record.md` and choose exactly one:

- **ACCEPT** — authorize rollout;
- **AMEND** — make only evidence-required prototype changes and recheck affected tasks;
- **REJECT** — do not roll out this architecture.

Until that real-reader record exists, #46 stays open and #47 stays blocked.