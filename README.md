# Project Ares

Ares is a static digital humanities publication built around Dutton, Boyanowsky & Bond (2005), *Extreme Mass Homicide: From Military Massacre to Genocide*. It combines long-form analytical reading with eight historical case studies while treating provenance, uncertainty and testimony as part of the product rather than as decoration.

## Product contract

Ares is a publication before it is an interface. Core prose, cases, chronology, glossary, process synthesis and source targets ship as semantic static HTML and remain readable without JavaScript. Browser code progressively enhances orientation and glossary lookup; it does not own essential scholarly content.

Part IV is an explicitly labelled **Ares synthesis** of four interacting domains source-mapped to Dutton et al. It is non-sequential. The older six/eight-stage taxonomy and escalation-ladder/early-warning framing are not part of Ares 2.0.

## Visual system and depth

Ares 3.0 sits on one warm near-black ground with a single iron-oxide accent — a memorial register, not a spectacular one. No route inverts to a light field, and the build fails if one does.

Every unit is at most two screens from the opening. The opening is the cover *and* the complete directory, so each of the eight published parts is one click away. Units that belong to the same topic render as addressable sections of one surface rather than as separate routes; optional scholarly depth stays behind a closed native disclosure on that same surface. `04-docs/docs/Ares_3_Ground_Level_Overhaul.md` is the authority for both.

## One production path

The only production build is the Astro/TypeScript build rooted at `src/` and driven by the root `package.json`.

The former Python builder, `01-core`, `03-content`, committed generated HTML, legacy CSS/JavaScript, process SVG and helper batch scripts were retired after the integrated Astro implementation passed PR #21. Do not recreate or use those paths. Historical material worth retaining lives under `04-docs/archive/` and is explicitly non-authoritative.

## Stack

- Astro static output, Vite through Astro
- strict TypeScript
- pnpm with committed lockfile
- Zod validation for structured editorial data
- Marked for trusted repository-authored Markdown
- semantic modular CSS and custom properties
- Vitest
- Playwright: Chromium, Firefox and WebKit
- axe browser accessibility checks
- GitHub Actions + GitHub Pages

There is no React, Tailwind, client router, backend, database or CMS in the baseline architecture.

## Local development

Use Node 24 and pnpm 11.23.0.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Run the complete quality gate before considering work complete:

```bash
pnpm check
```

`pnpm check` runs strict Astro/TypeScript validation, unit/content contracts, deterministic double-build verification, built-site anchor/ID validation, payload reporting, multi-browser Playwright, JavaScript-disabled checks, responsive checks, reduced-motion checks and axe.

## Repository map

```text
src/
├── content/
│   ├── sections/          long-form authored prose
│   ├── cases/             case prose using the A–F editorial grammar
│   └── data/              cases, glossary, process and references
├── lib/content/           Zod schemas, loaders, Markdown adapter, validation
├── components/
│   ├── navigation/        publication orientation
│   ├── cases/             case grammar, chronology and comparison
│   ├── explainers/        process synthesis
│   ├── glossary/          static definitions + dialog shell
│   └── provenance/        source presentation
├── scripts/               optional progressive enhancement
├── styles/                tokens and concern-specific semantic CSS
├── layouts/               document shell
└── pages/                 route composition
tests/
├── unit/                  editorial/schema contracts
└── browser/               rendered behavior, a11y and viewport contracts
scripts/                   deterministic-build and artifact validation
04-docs/docs/              current product, design, architecture and QA decisions
04-docs/archive/           non-authoritative historical material only
```

AI coding agents should read `AGENTS.md`, the Ares 2.0 product/editorial/design brief, the 3.0 ground-level overhaul and the architecture ADR before implementation work.

## Editorial data boundaries

- `src/content/data/cases.json` owns reusable case metadata and chronology.
- `src/content/data/glossary.json` owns glossary definitions.
- `src/content/data/process.json` is the only process-synthesis authority.
- `src/content/data/references.json` owns stable source identifiers.
- Historical claims labelled `requires-source-trace` remain unresolved integrity debt; moving them into structured data does not certify them.

## Deployment

Every accepted `main` build is verified before deployment. `.github/workflows/deploy-pages.yml` runs the full quality gate and uploads that exact tested `dist/` directory as the GitHub Pages artifact.

Production: https://benwassa.github.io/Ares/

## Documentation

The principal authorities are:

- `04-docs/docs/Ares_3_Ground_Level_Overhaul.md`
- `04-docs/docs/Ares_2_Product_Editorial_Design_Brief.md`
- `04-docs/docs/Ares_2_Architecture_Decision_Record.md`
- `04-docs/docs/Ares_2_Baseline_Audit.md`
- `04-docs/docs/Development_Guide.md`

## License

MIT. The original paper and third-party source material remain subject to their respective rights and citation requirements.
