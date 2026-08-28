# Ares 2.0 Motion Principles

**Issue:** #11 — restrained motion and interaction polish  
**Status:** Implemented motion contract

## Principle

Ares is a long-form publication about mass violence. Motion exists only when it helps a reader perceive an interface state change. It is never used to dramatize historical material, casualty magnitude, testimony, chronology, or the process synthesis.

## Vocabulary

- `--motion-fast: 140ms` — small visual-state feedback such as link, summary and button colour/border changes.
- `--motion-standard: 200ms` — reserved upper bound for a future functional state transition that genuinely needs more time.
- `--motion-ease-state: cubic-bezier(.2, 0, 0, 1)` — the shared state-change easing curve.

Production code should use these tokens rather than inventing local durations/easings.

## Current implementation

Ares intentionally has almost no structural animation.

- Native `<details>` navigation/process disclosures open and close immediately.
- The native glossary `<dialog>` opens and closes immediately; focus is moved/restored explicitly rather than animated.
- Current-location/navigation feedback may transition colour/border state using the fast token.
- Skip-link and keyboard-focus appearance is immediate.
- Reading progress updates directly with scrolling; it is not animated independently.
- Anchor navigation, deep links, browser history and programmatic focus use normal browser jumps. Global smooth scrolling is explicitly disabled because it adds motion to navigation without improving comprehension.

No production motion uses parallax, scroll hijacking, reveal-on-scroll, scale spectacle, casualty animation, testimony animation, or cinematic transitions.

## Reduced motion

`prefers-reduced-motion: reduce` reduces any CSS transition/animation duration to effectively zero and forces automatic scrolling. Content structure, focus movement, disclosure state and comprehension are unchanged.

## Review rule

New motion requires a concrete answer to: **what state relationship becomes easier to understand because this moves?** If the answer is aesthetic novelty, emphasis of suffering, or generic polish, do not add it.
