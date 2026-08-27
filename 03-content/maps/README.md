# Ares map data — Ares 2.0 decision

**Ares 2.0 release decision: defer interactive maps.**

`interactive-maps.json` is retained as legacy/research-draft material only. It is not a production source of truth and the current Ares 2.0 publication does not render or advertise an interactive map experience.

The decision is deliberate rather than a missing implementation:

- the prepared configuration covers only three of the eight case studies;
- several referenced geographic datasets are not present in the repository;
- exact coordinates, historical boundaries, routes, counts and event labels require the same point-of-use provenance discipline as other historical claims;
- the existing configuration does not yet provide a documented textual equivalent or accessibility model;
- none of the currently prepared interactions is necessary to understand the publication's central argument.

A future map should ship only if a specific editorial question cannot be answered as clearly by prose, chronology or a static figure, and only after its geographic/historical data are source-mapped and a non-JavaScript equivalent is defined.

Prepared data may be researched again later, but its presence in the repository is **not** evidence that a map feature is approved for Ares 2.0.
