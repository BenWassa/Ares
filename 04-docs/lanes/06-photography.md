# Lane 6 — Photography

**Depends on:** L1 · **Gated on:** external rights research (Ben) · **Size:** medium
**Risk:** highest in the programme · **Deferrable indefinitely**

Specs: [`figures/05-photography.md`](../figures/05-photography.md) (rules and component) and
[`figures/05a-photography-content-shortlist.md`](../figures/05a-photography-content-shortlist.md)
(what to research).

---

## Problem

Ares carries no photographic content. Photography is the strongest available answer to "zero
figures across 17 routes" and is what a real publication would do.

It is also the only item in this programme that can go wrong in ways a redesign cannot undo.

## Position

**Documents and places, not bodies.**

Period atrocity photography is ruled out on two independent grounds, either sufficient alone:

- **Ethics.** Issue #26 already forbids gore, cinematic atrocity montage and casualty
  spectacle. A photograph of identifiable victims used as page furniture is the clearest case
  of the aestheticisation this publication exists to avoid.
- **Rights.** Most is under active copyright or restrictive archive licence. A public GitHub
  Pages site is publication, not private study — academic fair dealing does not cover it.

Three hard exclusions are named in the specs and should not be revisited: the Tuol Sleng S-21
prisoner mugshots, the displayed human remains at Nyamata and Ntarama, and the Srebrenica
Scorpions video.

## The editorial idea

Across the eight cases one pattern recurs strongly enough to become the spine of the whole
programme: **someone documented it, warned about it, or reported it — and was ignored, denied,
or contradicted at the time.**

Gareth Jones filed from Ukraine in 1933 and Walter Duranty contradicted him in print. Ron
Ridenhour wrote to Congress in 1969 because the chain of command had buried it. Roméo Dallaire
sent a fax in January 1994. The Security Council declared Srebrenica a safe area in 1993.
Bonner and Guillermoprieto described El Mozote in January 1982 and were discredited by their
own government.

This maps directly onto what the publication already argues about authorization, denial and
contested record — and it points almost entirely at **documents**, where the rights position
is cleanest.

## Split of work

**Ben:** rights research and sourcing, using the per-case shortlist. Confirm every title,
date, holding institution and licence at source. The shortlist is a starting point from
recall, not established fact.

**Claude:** the `<Figure>` component, the `FigureImageSchema` rights record, responsive image
pipeline, and integration. Buildable before any image exists.

## Rights enforced by schema, not by style guide

`FigureImageSchema` makes provenance structurally impossible to omit: `alt` (min 20 chars),
`caption`, `credit`, `repository`, `sourceUrl`, `licence`, `licenceNote`, `sourceStatus`.

The `licence` enum includes `fair-dealing-review` as a deliberate blocker — any image in that
state **fails the release gate** until resolved.

## Acceptance criteria

- [ ] `<Figure>` component and `FigureImageSchema` built and validated
- [ ] No image ships without a complete rights record
- [ ] `fair-dealing-review` fails the build
- [ ] At most two images per case; one is the target
- [ ] No identifiable victim of violence; no human remains
- [ ] Propaganda material labelled as propaganda at the point of use
- [ ] Every caption states what the image contributes to the argument — if it cannot, the
      image comes out
- [ ] Documents legible at rendered size, or linked to a legible source
- [ ] Images degrade to their captions with images disabled
- [ ] Served at ≤ 2× rendered CSS width, AVIF/WebP/JPEG, explicit dimensions

## If this lane is cut

Ares keeps zero photographic content, but figures 01–04 still deliver a complete
visual-explanation layer. **This is the highest-value and highest-risk lane, and the only one
that can be deferred indefinitely without leaving a hole in the argument.** Treat it as an
enrichment programme with no fixed deadline, not a release blocker.
