# Ares figures — specification set

Five figures specified for Ares 2.2. Written after a review that found **zero images, SVGs,
figures or charts across all 17 routes** — the publication currently carries no visual
explanation of any kind.

Each spec states what argument the figure makes, what data it needs, what data is missing,
its form, its mobile behaviour, its accessibility contract, its ethical constraints, and
**who builds it**.

| # | Figure | Kind | Built by |
|---|---|---|---|
| 01 | Four-domain process cycle | Conceptual diagram | **Ben** (authored elsewhere, imported as SVG) |
| 02 | Chronology spine | Data-driven, per case | Claude (Astro component) |
| 03 | Duration and scale | Data-driven, cross-case | Claude (Astro component) |
| 04 | Provenance ledger | Data-driven, corpus-wide | Claude (Astro component) |
| 05 | Photographic programme | Sourced imagery | **Ben** decides scope; Claude builds `<Figure>` |

## Rules that apply to all five

1. **No figure asserts more than the source supports.** Every figure carries its own source
   line and, where the underlying records are untraced, says so on the figure itself.
2. **No figure ranks atrocities.** Ordering is chronological or alphabetical, never by
   death toll. Nothing is sorted into a league table.
3. **Static-first.** Every figure renders completely as SVG or CSS with JavaScript disabled.
   Motion and interaction are enhancements on top of a complete static figure.
4. **Colour follows the locked system.** One accent plus ground values. No figure introduces
   a hue that means something only inside that figure.
5. **`prefers-reduced-motion` removes all figure motion**, leaving the static state.
6. **Every figure has a text equivalent** — a caption that carries the finding in prose, so
   the argument survives for screen-reader users and in print.
