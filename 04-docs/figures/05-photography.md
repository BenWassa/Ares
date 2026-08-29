# Figure 05 — The photographic programme

**Kind:** sourced imagery · **Built by:** Ben decides scope and sourcing; Claude builds the
`<Figure>` component and the rights schema.
**Lives on:** case pages primarily; one image on the opening.

---

## Why this figure exists

Photography is the strongest available answer to *"zero images across 17 routes."* It is
also the only item in this programme that can go badly wrong in ways a redesign cannot undo,
so this spec is mostly about **which photographs**, not how to lay them out.

## The recommendation, in one line

**Documents and places, not bodies.**

## What to rule out, and why

**Atrocity photography — victims, remains, killings in progress.**

Ruled out on two independent grounds, either of which is sufficient:

- **Ethics.** Issue #26 already forbids gore, cinematic atrocity montage, and casualty
  spectacle. A photograph of identifiable victims used as page furniture is the clearest
  possible case of the aestheticisation this publication exists to avoid. The people in those
  photographs did not consent to being anyone's illustration.
- **Rights.** Most of this material is under active copyright or restrictive archive licence.
  Ronald Haeberle's personal My Lai photographs are his own copyright (his official US Army
  frames are a separate, public-domain set). ICTY and Bosnian war photography is largely
  agency-owned. Rwandan 1994 photography is overwhelmingly agency-owned. A public GitHub Pages
  site is publication, not private study — academic fair dealing does not cover it.

## What to use instead

### A. Documentary evidence (strongest fit)

Photographs or high-quality scans of **the record itself**: an order, a cable, a page of
inquiry transcript, a court exhibit, a census page, a ration decree.

This is the best option for Ares specifically, because:
- It is *evidence*, which is precisely what the publication claims to foreground. A page of
  the Peers Inquiry beside the My Lai analysis does real argumentative work.
- Much of it is **public domain**: works of the US federal government (Peers Inquiry, Army
  photographs, Congressional records) carry no copyright. ICTY and ICTR judgments are UN
  documents with permissive reuse.
- It is visually distinctive — typewriter grain, stamps, redactions, handwriting — and
  nothing else on the web looks like it.
- It carries zero risk of depicting a victim as spectacle.

### B. Place, photographed now (strong second)

The site as it exists today: the memorial at Nyamata, the Srebrenica–Potočari cemetery, the
irrigation ditch at Sơn Mỹ, the El Mozote monument, the Tuol Sleng buildings.

- Ethically clean, and often more affecting than period imagery.
- Frequently available under Creative Commons on Wikimedia Commons with verifiable licences,
  or commissionable directly from photographers.
- Establishes that these places are real and still there — which is an argument the
  publication is otherwise making only in words.

### C. Period context, non-atrocity (use sparingly)

Streets, buildings, officials, published propaganda, newspaper front pages. Often public
domain by age. Propaganda material in particular supports the *target-group construction*
domain directly — but it must be captioned as propaganda, never presented neutrally.

## Rights: make provenance structurally impossible to omit

Extend the schema so an image **cannot be added without its rights record**:

```ts
export const FigureImageSchema = z.object({
  src: z.string(),
  alt: z.string().min(20),              // description, not a label
  caption: z.string().min(1),           // what it shows and why it is here
  credit: z.string().min(1),            // photographer / creating body
  repository: z.string().min(1),        // holding archive
  sourceUrl: z.string().url(),
  licence: z.enum(['public-domain','cc0','cc-by','cc-by-sa','permission-granted','fair-dealing-review']),
  licenceNote: z.string().optional(),   // required when licence is not clearly PD/CC
  dateTaken: z.string().optional(),
  sourceStatus: SourceStatusSchema,
});
```

Zod then enforces at build time what a style guide only requests. `fair-dealing-review` exists
as a deliberate blocker: any image in that state fails the release gate until resolved.

## Form

- **One image per case, at most two.** This is a publication, not a gallery. A single
  well-chosen document beats six stock photographs.
- Full-measure or full-bleed, never a thumbnail grid, never a carousel.
- **Caption is part of the figure, not a hover.** Credit, repository and licence render
  visibly beneath — small, but present and selectable.
- No filters, no duotone, no colour grading, no parallax, no Ken Burns. The image is evidence;
  styling it is editorialising it.
- Documents should be legible enough to read, or linked to a legible source. An unreadable
  document used as texture is decoration pretending to be evidence.

## Technical

- `<picture>` with AVIF + WebP + JPEG fallback; explicit `width`/`height` to reserve layout
  space; `loading="lazy"` below the fold, eager for any above it.
- Serve at most 2× the rendered CSS width. Current total build is 308KB — a single careless
  4000px JPEG would be ten times the entire site.
- Images live in `public/figures/[case-slug]/` with the rights record in the case JSON, so the
  asset and its provenance are reviewed together.
- Every image must degrade to its caption with images disabled.

## Accessibility

- `alt` is a description of content, minimum 20 characters, never `"photograph"` or a repeat
  of the caption.
- For documents, `alt` summarises what the document says, and the full text goes in the
  caption or a linked transcript. A scanned document with no transcript is inaccessible.
- Never convey essential argument through an image alone.

## Ethical constraints

- **No identifiable victim of violence** appears as illustration. If a person is identifiable
  and did not consent, the image needs a specific justification recorded in `licenceNote`, or
  it does not ship.
- **No human remains.** This includes exhumation and memorial ossuary photography, which is
  otherwise tempting because it is well-documented and often freely licensed.
- **Propaganda is always labelled as propaganda**, in the caption, at the point of use.
- Images are **never decorative**. If the caption cannot say what the image contributes to
  the argument, the image comes out.

## Decision needed from Ben

Which of A / B / C to pursue, and for how many of the eight cases. A is the strongest fit and
the cheapest to clear; B is the most emotionally effective; C is the most useful for the
target-construction argument and the most easily misread.

My recommendation: **A for all eight, B for three or four where a strong CC-licensed image
exists, C only where it directly serves the analysis.**
