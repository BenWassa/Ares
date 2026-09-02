# Ares 2.3 human mobile validation protocol — Issue #46

**Status:** Ready for real-reader sessions; no human evidence is recorded in this document.  
**Issue:** #46 — P2 human mobile validation gate  
**Prototype under test:** the #51 screen hierarchy. Update the baseline SHA below to the merged `main` commit that carries it before the first session.  
**Prototype baseline:** `TO BE PINNED AT SESSION START — the merged #51 commit`  
**Superseded baseline:** `caf4fa95a5bcf3447c4117108af6f257f5555c4a` (the #45 stacked-page prototype; do not test against it)  
**Production origin:** https://benwassa.github.io/Ares/  
**Gate boundary:** Issue #47 remains blocked until #46 records real-reader evidence and an explicit **ACCEPT** or **AMEND-complete** decision.

> **What changed for this protocol (#51).** The mobile model under test is no longer a bounded reading layer stacked on one route. Each conceptual unit is now its own screen with its own address, and moving between units is an explicit navigation action. The tasks below therefore test parent/child understanding, Back and Next expectations, subset recognition and screen-level resume, and they ask directly whether the hierarchy reads as clearer than long-page scrolling or as fragmentation. Tasks 1, 2, 4 and 8 are materially unchanged; Tasks 3, 5, 6 and 7 have been rewritten for the hierarchy, and Tasks 9 and 10 are new.

## 1. Purpose and evidence boundary

This protocol tests whether the representative Ares 2.3 mobile reading architecture reduces overload without sacrificing comprehension, orientation, provenance awareness, or reader agency around traumatic material.

The test is of the publication experience, not of the participant's historical knowledge. Do not teach the interface before a task, coach toward a control, or treat a wrong turn as a participant failure. Record it as product evidence.

Only real-reader sessions count toward the #46 gate. Automated QA, rendered screenshots, AI review, and the dry run at the end of this document establish **testing readiness only**. They must never be entered in the participant results table or counted toward a threshold.

Recommended sample from #46: **5–8 adult mobile readers**, including roughly 3–5 non-specialist readers and 2–3 scholarly/history-adjacent readers where practical. Use real phones, prioritizing common 390–430 CSS-pixel widths; include Android and iOS where available, plus a 320–360 px stress device or equivalent display setting where practical.

## 2. Exact live routes

Use the live production origin, not localhost, a branch preview, or a stale screenshot.

| Purpose | Live URL |
| --- | --- |
| Home / goal choice / resume return | https://benwassa.github.io/Ares/ |
| Framework overview | https://benwassa.github.io/Ares/framework |
| Definitions & typology unit screen | https://benwassa.github.io/Ares/framework/definitions-typology |
| Cases index | https://benwassa.github.io/Ares/cases |
| My Lai case overview (parent) | https://benwassa.github.io/Ares/cases/my-lai-massacre |
| Rwandan Genocide target for findability task | https://benwassa.github.io/Ares/cases/rwandan-genocide |
| Comparison overview (parent) | https://benwassa.github.io/Ares/comparison |
| Glossary utility | https://benwassa.github.io/Ares/glossary |
| References / provenance utility | https://benwassa.github.io/Ares/references |

### Child screens under test

Every unit below is a real route with its own address, reachable without JavaScript. Do not supply these URLs to a participant unless a task says to; they are the destinations a participant should reach by navigating.

| Parent | Child screen | URL |
| --- | --- | --- |
| Framework | Definitions & typology | https://benwassa.github.io/Ares/framework/definitions-typology |
| My Lai | Orientation | https://benwassa.github.io/Ares/cases/my-lai-massacre/orientation |
| My Lai | Core narrative | https://benwassa.github.io/Ares/cases/my-lai-massacre/narrative |
| My Lai | Key evidence | https://benwassa.github.io/Ares/cases/my-lai-massacre/key-evidence |
| My Lai | Analytical finding | https://benwassa.github.io/Ares/cases/my-lai-massacre/finding |
| My Lai | Scholarly depth (optional) | https://benwassa.github.io/Ares/cases/my-lai-massacre/scholarly-depth |
| Comparison | Dimension: tempo | https://benwassa.github.io/Ares/comparison/tempo |
| Comparison | Scholarly depth (optional) | https://benwassa.github.io/Ares/comparison/scholarly-depth |

Scope & purpose (`/framework#scope-purpose`) and Theoretical lenses (`/framework#theoretical-lenses`) are framework child units that deliberately remain on the framework overview. That is a documented decision in `Ares_2_3_Content_Graph.md`, not an omission; Task 5 asks participants what they make of it.

Compatibility anchors kept from the #45 prototype. They forward to the screen that inherited them, and a moderator can use them to confirm a deployment before a session:

- https://benwassa.github.io/Ares/cases/my-lai-massacre#key-evidence
- https://benwassa.github.io/Ares/cases/my-lai-massacre#analysis
- https://benwassa.github.io/Ares/cases/my-lai-massacre#full-scholarly-depth
- https://benwassa.github.io/Ares/comparison#tempo
- https://benwassa.github.io/Ares/comparison#full-comparison-depth
- https://benwassa.github.io/Ares/framework/definitions-typology#critical-caveats

## 3. Before the participant arrives

Create one copy of `Ares_2_3_Human_Testing_Session_Record.md` and assign a non-identifying session ID such as `P01`. Do not record a participant name, email address, employer, school, account identifier, or other directly identifying information.

Confirm the device/browser can load the production origin. Record device/session metadata before the tasks. Leave the participant's normal text/display scaling in place; do not normalize an accessibility setting merely to make the layout look conventional. Record the setting used.

For the standardized resume task, JavaScript and ordinary browser storage must be enabled. Do not clear Ares local storage immediately before the interruption unless the session protocol specifically calls for a fresh-state variant. The task is meant to test the real progressive-enhancement behavior.

The participant may stop, skip a task, close a disclosure, or end the session at any time without explanation. Extended traumatic detail is never required for task success. If the participant shows discomfort, stop or redirect without asking them to continue for the sake of the test.

## 4. Moderator opening script

Read this with minimal paraphrase:

> We are testing a mobile publication, not testing you. Some of the material concerns genocide, massacres, and other mass killing. You can pause, skip material, or end the session at any point, and you do not need to explain why. You never need to open more detailed material just because it is available.
>
> I will give you a series of tasks and mostly stay quiet. Please use the site as you naturally would. For navigation tasks, you can say what you are looking for if that feels natural. For reading tasks, read normally; I will ask questions afterward. If something is confusing, do what you would normally do rather than trying to guess what I want.
>
> I may time tasks and take anonymous notes about the interface. With your permission, I may also record short anonymous quotations from what you say. There is no right level of prior knowledge for this test.

Record quote consent separately as Yes/No. Do not audio/video record unless a separate consent process exists.

## 5. Participant task sheet

The participant-facing prompts below intentionally omit scoring rules and expected answers. They may be shown one at a time.

### Task 1 — Understand the opening

Open:

https://benwassa.github.io/Ares/

Without opening the Contents control, spend about 10–15 seconds on the opening screen. Then tell me:

1. What do you think Ares is?
2. What do you think it is trying to help a reader understand or do?
3. If you wanted the shortest coherent reading path, what would you choose?
4. What do you think the difference is between **Guided reading** and **Full scholarly publication**?

### Task 2 — Find a case

Starting from wherever you are now:

**Find the Rwandan Genocide case.**

Stop when you believe you are on that case.

### Task 3 — Read one case

Open:

https://benwassa.github.io/Ares/cases/my-lai-massacre

Read this case the way you normally would. Stop when you feel you have read the case. Do not open anything merely because you think the test expects it.

When you are finished, tell me:

1. What is the main analytical point Ares is making with this case?
2. What evidence or chronology point most supports that interpretation for you?
3. What important uncertainty, limitation, or source qualification did the page leave you with?
4. How many separate parts did this case seem to have, and did you read all of them?
5. At any point, did you know which part of the case you were on?

### Task 4 — Verify provenance

Stay anywhere inside the My Lai case.

Find what Ares says about the **source status of the estimated death figure**. Tell me whether the publication presents that figure as fully verified or as still needing source trace, and show me where you found that information.

### Task 5 — Essential versus optional, and what belongs to what

Go back to:

https://benwassa.github.io/Ares/cases/my-lai-massacre

Tell me:

1. Which parts of this case does Ares seem to treat as necessary reading, and which does it let you skip?
2. Which cues did you use to decide?
3. Are all of those parts part of the same case, or are some of them separate topics?
4. If you opened **Key evidence**, was what you saw there all of the evidence Ares has for this case, or a selection from something larger? How can you tell?

Then open:

https://benwassa.github.io/Ares/framework

5. How many parts does the framework have, and where does each one live?

You do not need to open the optional material to answer.

### Task 6 — Interrupt and resume

Open:

https://benwassa.github.io/Ares/framework

Begin reading the framework and continue naturally into whatever it hands you next. The moderator will interrupt you after you have moved past the framework overview.

When the moderator asks you to stop, leave the site for the break. After the break, return to:

https://benwassa.github.io/Ares/

Continue from where you believe you left off. Once you have resumed, tell me:

1. What unit or question were you working on?
2. What larger topic was it part of?
3. What do you remember from immediately before the interruption?
4. Did the return cues help, get in the way, or make no difference?

### Task 7 — Compare cases

Open:

https://benwassa.github.io/Ares/comparison

Use the page to answer:

1. Name one cross-case pattern or difference that becomes visible in the comparison.
2. Why does the page say that comparison does **not** mean the cases are equivalent?
3. Find the deeper comparison material and show where you would go for the complete matrix or fuller evidence.
4. Before you opened anything: what did you expect to find behind each of the two choices this page offered you?

### Task 9 — Back, Next and where you are

Open:

https://benwassa.github.io/Ares/cases/my-lai-massacre/key-evidence

Without pressing anything yet, tell me:

1. Where are you?
2. What larger topic is this part of?
3. If you pressed your phone's Back button now, where would you expect to end up?
4. What would you expect to come next?
5. What else could you go to from here?

Then use the page to go back to the case as a whole, and tell me whether that matched what you expected.

### Task 10 — A copied link

The moderator will send you this link the way a friend might:

https://benwassa.github.io/Ares/comparison/tempo

Open it and tell me:

1. What are you looking at?
2. What is it part of?
3. How would you get to the rest of it?

### Task 8 — Debrief

Run this last, after Tasks 9 and 10.

Answer the rating statements and the open questions supplied by the moderator. There is no preferred answer.

## 6. Moderator procedure and measurements

### T1 — Home orientation

Start the timer when the production home visibly loads. Stop timing the 10–15 second scan when the participant begins answering.

Capture:

- whether the participant can describe Ares in terms consistent with a scholarly/evidence-led publication rather than an app, quiz, or case database only;
- whether they identify **Guided reading** as the shortest coherent ordered path;
- whether they distinguish Guided reading from Full scholarly publication;
- orientation confidence on a 1–7 scale after their answer;
- hesitation, wrong interpretation, and whether they open Contents despite the instruction.

Do not require exact project wording.

### T2 — Case findability

Start timing when the prompt is read. Stop when the Rwandan Genocide case page is visibly reached.

Capture success, time, route taken, wrong turns, loops, use of Contents, and any moderator assistance. A wrong-route loop means leaving the plausible path and returning/repeating it without reaching the target.

### T3 — My Lai reading

The participant enters at the case overview, which is now a parent surface listing five units. Do not tell them the case has children, do not name the units, and do not instruct them to open **Scholarly depth**. Observe what they choose.

Record:

- how many child screens they entered, in what order, and whether they used Next, the child list, or the browser;
- whether they treated the overview as the case or as a menu, and whether that confused them;
- whether they reached the analytical finding at all;
- whether they voluntarily entered the optional depth screen, and at what point;
- visible backtracking, re-reading, and any moment they appeared unsure which unit they were in;
- whether they ever scrolled looking for material that was on another screen;
- the five post-reading answers verbatim or close paraphrase;
- case comprehension score using the rubric in the session record;
- immediate 1–9 mental-effort rating.

Two failure modes matter equally here and must be recorded distinctly:

- **Place loss** — they cannot say which unit they were in or how it relates to the case.
- **Fragmentation** — they can say it, but the movement between screens broke their reading, or they stopped before the finding because it felt like more steps than they wanted.

Do not score historical details that are not required to understand the case's analytical claim.

### T4 — Provenance

Start timing after the prompt. Stop when the participant points to the relevant source-status information and gives an interpretation.

A pass requires both findability and correct meaning: **requires source trace** must be understood as unresolved verification/source-tracing debt, not as a badge saying the estimate has been verified.

The estimate and its source-trace boundary sit on the case overview, so a participant who is on a child screen has to navigate up to reach them. That is a hierarchy observation as much as a provenance one: record whether they went up deliberately, wandered across sibling screens, or gave up. Also record whether they noticed the unit-level trace statuses on the Key evidence screen and whether they read those as the same claim or a different one.

Record wrong targets, whether the participant expects a citation elsewhere, and whether the wording itself causes confusion.

### T5 — Essential/optional and subset recognition

Do not define the distinction first. Record the participant's classification and the visible cues they cite.

A pass on essential/optional requires them to recognize the four essential units as first-pass material and **Scholarly depth** as optional deeper evidence, method, interpretation and provenance. They need not reproduce the layer labels.

Record separately, as a **subset-recognition** result:

- whether they place all five units inside the same case rather than treating a child screen as an unrelated topic;
- whether they recognize the four Key evidence entries as a selection from a larger chronology rather than the whole record — the screen says so in a source-status line, and the depth screen renders the full chronology;
- for the framework, whether they can say that it has three parts, that one of them opens as its own screen and two are on the overview.

The framework question is a deliberate test of a documented inconsistency: two children live on the parent surface and one does not. If participants find that arbitrary, that is evidence for #47, not a defect to talk them out of.

### T6 — Interruption and resume

Let the participant follow the guided path from `/framework` into Definitions & typology. Interrupt once they are on that child screen and have read past its opening section. Do not tell the participant the unit name or the anchor.

Use a neutral **3–5 minute** break. Record the actual duration. Ask the participant to put the phone down or use a neutral non-Ares activity; do not rehearse the content during the break.

After the break, have them return through the production home. Do not point out **Continue where you left off**. Start the resume timer when home loads. Stop it when they reach the correct unit and say they have regained context.

Resume now stores a screen-level unit rather than a scroll position, so the pass condition is stricter and more specific:

- the Continue affordance must name the unit and its parent (for example `Continue: Framework · Definitions & typology`);
- following it must land on that unit's own route;
- the participant must be able to say **which unit** they were in and **what larger topic** it belonged to.

Capture:

- whether the saved Continue affordance is noticed without coaching;
- whether it returns to the correct conceptual unit;
- seconds to regain context;
- backtracking or Contents use;
- recall of the prior question or finding;
- reaction to the `Previously` / `Next` orientation cues;
- whether returning to a named unit felt more or less useful than returning to a scroll position would have, if the participant has an opinion;
- any stale, surprising, or privacy-related reaction to local resume state.

A next-day repeat on a subset is useful but optional. Mark it separately from the standardized same-session gate.

### T7 — Comparison

Do not explain the two child screens, the tempo view or the non-equivalence warning first.

Record:

- comparison comprehension score;
- whether the participant predicted correctly what each of the two child screens contained before opening either;
- whether the dimension-first view is understood as one controlled variable rather than a severity scale;
- whether the non-equivalence warning is understood;
- whether the complete matrix is found, and whether the participant expected it to be on the overview;
- immediate 1–9 mental-effort rating;
- confusion, backtracking, and requests for a different comparison dimension.

### T9 — Navigation expectations

This task measures the #51 navigation contract directly, and it is the one place where the moderator asks the participant to predict rather than act.

Take the five answers before they touch the interface. Score each as MATCH or MISMATCH against what the interface actually does:

| Question | Correct behaviour |
| --- | --- |
| Where are you? | Key evidence, unit 3 of 5 |
| What larger topic? | The My Lai case |
| What does Back do? | Returns to the previous screen they came from; the interface states this in the unit-boundary hint |
| What comes next? | Analytical finding |
| What else is reachable? | The other three essential units, the optional depth screen, the case overview and the publication Contents |

Then have them return to the case overview and record which control they used — the breadcrumb, the **Back to My Lai overview** link, the case-index link, or the browser's Back button. Record whether the result matched their stated expectation.

A **MISMATCH on Back** is the most important single observation in this task: it means the hierarchy is legible but the return path is not.

### T10 — Copied deep link

The point of this task is that every screen has an address a person can send. Send the link the way a person would, with no explanation.

Record:

- whether the participant can say what the screen is and what it belongs to from the screen alone;
- how they attempt to reach the rest of the comparison, and whether that attempt succeeds;
- whether arriving mid-hierarchy feels disorienting, and in their words why.

### T8 — Debrief

Run the debrief after T9 and T10. Use a 1–7 agreement scale: `1 = strongly disagree`, `4 = neither agree nor disagree`, `7 = strongly agree`.

Ask:

1. I always knew where I was.
2. I knew what was essential and what was optional.
3. The amount presented at once felt manageable.
4. I could stop without feeling I had lost my place.
5. The interface added unnecessary strain. **[reverse-direction item]**
6. I am confident I understood the central argument.
7. I had appropriate control over how much traumatic detail I encountered.
8. I could tell how the parts of a topic fitted together.
9. Moving between screens was clearer than scrolling one long page would have been.
10. The publication was broken into too many separate screens. **[reverse-direction item]**
11. Pressing Back did what I expected.

Items 8–11 are new for #51 and carry the hierarchy question. Items 9 and 10 are deliberately not opposites: a participant may find the structure clearer *and* find the number of steps tiring, and that combination is the most useful result this study can produce.

Then ask:

- What felt longest or most tiring?
- What, if anything, did you skip, and why?
- What felt repetitive?
- Did the same orientation information appear too often as you moved between screens?
- Was there a point where you wanted more on one screen instead of moving to another?
- Was there a point where a screen tried to do too much at once?
- Did the reading feel like one continuous account, or like separate pieces? Where did it break?
- What did you want to see earlier?
- What source, methodological, or other apparatus felt unnecessary at the point where you encountered it?
- Was there any point where the interface made you feel pressured to continue into traumatic detail?

Do not argue with a response or explain the design rationale during the debrief. If a participant says the structure is annoying, record it as a finding; that is exactly what this gate exists to surface.

### New #51 measures to record in every session

These sit alongside the existing #46 measures rather than replacing them:

| Measure | Source | Pass condition to interpret, not to apply mechanically |
| --- | --- | --- |
| Parent/child understanding | T3.5, T5.3, T9.2, T10.2 | The participant can name the parent topic of the screen they are on |
| Subset recognition | T5.4, T5.5 | Key evidence is understood as a selection from a larger chronology |
| Back expectation | T9.3 and the return control they actually used | Stated expectation matches observed behaviour |
| Next expectation | T9.4 | The named next unit matches what the interface offers |
| Screen-level resume | T6 | Continue names the unit and its parent, and lands on that unit's route |
| Clarity versus long-page scrolling | Debrief item 9, plus T3 observation | Directional only; report the distribution, never a mean over 5–8 readers |
| Fragmentation cost | Debrief item 10, T3 fragmentation observations, open questions | Any participant who abandoned a case because of step count is a high-salience finding |
| Deep-link orientation | T10 | The participant can place a screen they arrived at cold |

Do not convert these into a composite score. With 5–8 readers they are evidence to read, not statistics.

## 7. Mental-effort measure

After T3 and T7, ask:

> How much mental effort did this reading task require?

Use the same 1–9 scale every time:

| Score | Anchor |
| ---: | --- |
| 1 | Extremely low effort |
| 2 | Very low |
| 3 | Low |
| 4 | Somewhat low |
| 5 | Moderate |
| 6 | Somewhat high |
| 7 | High |
| 8 | Very high |
| 9 | Extremely high effort |

Ask before discussing the participant's answer. Do not convert time-on-task into a mental-effort score.

Issue #46 prefers a within-participant Ares 2.2 comparison where practical, counterbalanced across participants. There is **no separate Ares 2.2 public test origin in this readiness package**. Therefore:

- collect the absolute 1–9 ratings in every session;
- if an exact Ares 2.2 baseline is later supplied, use a matched task and alternate prototype/baseline order across participants;
- never infer a one-point improvement from absolute Ares 2.3 ratings alone;
- mark the comparative mental-effort threshold `NOT TESTED` until a valid baseline comparison exists.

If that comparative threshold remains required for ACCEPT, lack of a baseline is a gate gap to resolve explicitly; it is not permission to fabricate a comparison.

## 8. Session completion and data handling

After the debrief, save the anonymous session record. Separate observations from interpretation. Use participant quotes only when quote consent is Yes, and remove incidental identifying details before they enter the repository.

Do not aggregate results until the session record is complete. Do not replace missing observations with moderator inference. A task skipped because of participant choice is `SKIPPED`, not `FAIL`; a task impossible because of a product defect is `BLOCKED/PRODUCT`, with the defect described.

## 9. Readiness dry run — not human evidence

**This section is stale for the #51 prototype and must be redone before the first session.**

The recorded dry run below was performed against the #45 stacked-page artifact at `caf4fa95a5bcf3447c4117108af6f257f5555c4a`. Every route it verified still exists, but the material it verified — an in-page essential unit ending, `Continue to analysis`, a `<details>` labelled *Open full scholarly depth*, and `ares:reading-position:v1` — has been replaced by the screen hierarchy. Do not treat it as readiness for the tasks in this document.

### Required before the first session

1. Confirm the merged #51 commit deployed cleanly and pin its SHA in the header of this file and in the session record.
2. Re-run the material/link dry run against the deployed artifact, covering at minimum:
   - each of the eight child-screen URLs in §2 returns the unit it names;
   - each compatibility anchor in §2 forwards to the screen that inherited it;
   - the My Lai overview lists five child units, marks exactly one as optional depth, and carries the estimate and source-trace boundary;
   - the framework overview lists three child units and marks two as living on that page;
   - the comparison overview lists two child units and carries the non-equivalence warning;
   - every screen shows a breadcrumb ending in its own label, a role line, a unit question, a parent link and a next step;
   - deployed scripts use `ares:reading-position:v2`, and the home carries Continue/Clear resume controls;
   - no page requires JavaScript to reach any of the above.
3. Record the deployment run ID, the `verify-live` output, and the exact `index.html` SHA-256, as the previous dry run did.

### Superseded record — #45 artifact

Deployment run: `33592114226`. The run's `pnpm check`, deploy, and `verify-live` jobs all passed. `verify-live` reported production origin `https://benwassa.github.io/Ares/`, exact tested/live `index.html` SHA-256 `5cffeb5fa21d9e6bccf49efe46a40b660b3f48fd61714da3af6a273242b1e6c2`, and successful checks of 12 publication routes. The downloaded Pages artifact was artifact `9832199571` from that same run. A material/link dry run against that exact deployed artifact produced 34/34 checks passing for the task set as it stood then.

No participant was simulated in that dry run, and none of its checks count toward #46's human thresholds. The same holds for the automated `pnpm check` gate that accompanies #51: a green browser suite establishes that the hierarchy behaves as specified, and says nothing at all about whether readers understand it.

## 10. Package files

Use this protocol together with:

- `04-docs/docs/Ares_2_3_Human_Testing_Session_Record.md` — one copy per participant/session;
- `04-docs/docs/Ares_2_3_Human_Testing_Decision_Record.md` — aggregate evidence and final ACCEPT / AMEND / REJECT gate decision;
- `04-docs/docs/Ares_2_3_Rollout_Preflight.md` — #47 preflight only; remains blocked on the human gate;
- `04-docs/docs/Ares_2_3_Content_Graph.md` — the authoritative parent/child map of the hierarchy under test, including the ambiguities #46 evidence is expected to settle.
