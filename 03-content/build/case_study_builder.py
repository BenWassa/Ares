#!/usr/bin/env python3
"""Ares 2.0 Issue #9 case-study rendering layer.

This module deliberately leaves the existing static publication generator in place and
specializes only the case-study source model and rendering grammar. It is a transitional
step toward the decomposition accepted in the Ares 2.0 architecture decision record.
"""

from __future__ import annotations

import html as html_lib
import json
import re

import unified_builder as legacy


SOURCE_PENDING = "requires-source-trace"


class CaseStudySiteBuilder(legacy.SiteBuilder):
    """Render case studies from the structured Ares 2.0 case source."""

    def __init__(self, quiet: bool = False):
        super().__init__(quiet=quiet)
        self.case_data = self._load_case_data()
        self.case_by_id = {case["id"]: case for case in self.case_data}
        self._validate_case_data()
        self.legacy_case_meta = [self._legacy_meta(case) for case in self.case_data]

        # The legacy generator still consumes CASE_STUDIES for document order and nav.
        # Replace that duplicated Python content with adapters generated from JSON.
        legacy.CASE_STUDIES = self.legacy_case_meta

    def _load_case_data(self):
        path = self.data_dir / "casestudies.json"
        raw = self._read(path)
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid casestudies.json: {exc}") from exc
        cases = payload.get("cases")
        if not isinstance(cases, list):
            raise ValueError("casestudies.json must contain a top-level 'cases' array")
        return cases

    @staticmethod
    def _legacy_meta(case):
        """Adapter for legacy nav/body assembly; no historical facts live here."""
        return {
            "file": case["file"],
            "id": case["id"],
            "nav": case["navTitle"],
            "type": case["classification"]["display"],
            "duration": case["displayPeriod"],
            "deaths": case["deathEstimate"]["display"],
            "method": case["primaryMethod"]["display"],
            "location": case["location"]["display"],
            "kicker": case["openingContext"],
            "epigraph": None,
        }

    def _validate_case_data(self):
        if len(self.case_data) != 8:
            raise ValueError(f"Issue #9 requires exactly eight case records; found {len(self.case_data)}")

        ids = [case.get("id") for case in self.case_data]
        files = [case.get("file") for case in self.case_data]
        if len(set(ids)) != len(ids) or len(set(files)) != len(files):
            raise ValueError("Case ids and source filenames must be unique")

        sort_keys = [case.get("sortKey", "") for case in self.case_data]
        if sort_keys != sorted(sort_keys):
            raise ValueError("Case records must be ordered chronologically by sortKey")

        required = {
            "id", "file", "navTitle", "displayPeriod", "sortKey", "classification",
            "location", "openingContext", "argumentRole", "deathEstimate", "primaryMethod",
            "evidence", "chronology",
        }
        for case in self.case_data:
            missing = required - set(case)
            if missing:
                raise ValueError(f"{case.get('id', '<unknown>')}: missing fields {sorted(missing)}")
            source = self.cases_dir / f"{case['file']}.md"
            if not source.exists():
                raise ValueError(f"{case['id']}: missing Markdown source {source.name}")
            if case["argumentRole"].get("authorship") != "Ares synthesis":
                raise ValueError(f"{case['id']}: argumentRole must be explicitly labelled Ares synthesis")
            if case["deathEstimate"].get("provenanceClass") != "quantitative-estimate":
                raise ValueError(f"{case['id']}: death estimate must carry quantitative-estimate provenance class")
            if case["deathEstimate"].get("sourceStatus") != SOURCE_PENDING:
                raise ValueError(f"{case['id']}: legacy death estimate must remain source-trace pending")
            if case["classification"].get("sourceStatus") != SOURCE_PENDING:
                raise ValueError(f"{case['id']}: legacy classification must remain source-trace pending")
            if case["evidence"].get("sourceStatus") != SOURCE_PENDING:
                raise ValueError(f"{case['id']}: quoted evidence must remain source-trace pending")
            if not case["chronology"]:
                raise ValueError(f"{case['id']}: chronology cannot be empty")
            if any(event.get("sourceStatus") != SOURCE_PENDING for event in case["chronology"]):
                raise ValueError(f"{case['id']}: legacy chronology items must remain source-trace pending")

            _, blocks = self._parse_case(case["file"])
            expected_blocks = set("ABCDEF")
            if not expected_blocks.issubset(blocks):
                raise ValueError(f"{case['id']}: case source must preserve A-F editorial blocks")
            chronology_md = re.sub(r"<!--.*?-->", "", blocks.get("C", ""), flags=re.DOTALL).strip()
            if chronology_md:
                raise ValueError(
                    f"{case['id']}: chronology must live only in casestudies.json; "
                    "Markdown block C should contain only the migration comment"
                )

    def _render_case(self, meta):
        case = self.case_by_id[meta["id"]]
        title, blocks = self._parse_case(case["file"])
        linked = set()
        index = self.case_data.index(case) + 1
        heading_id = f"{case['id']}-title"

        parts = [
            f'<section id="{case["id"]}" class="subsection case-study" aria-labelledby="{heading_id}">',
            '<header class="case-opening">',
            f'<p class="case-position">Case {index} of {len(self.case_data)} · Part II</p>',
            f'<h3 id="{heading_id}">{html_lib.escape(title)}</h3>',
            f'<p class="case-place-time">{html_lib.escape(case["openingContext"])}</p>',
            '<div class="case-argument-role">',
            '<p class="case-role-label">Why this case is here <span>Ares synthesis</span></p>',
            f'<p>{html_lib.escape(case["argumentRole"]["text"])}</p>',
            '</div>',
            self._render_case_facts(case),
            '<p class="case-source-status">Case metadata, estimates and quoted evidence retain current Ares wording; source-level trace is pending.</p>',
            '</header>',
        ]

        vignette = blocks.get("A", "").strip()
        if vignette:
            parts.append(self._render_vignette(vignette, case, linked))

        parts.append('<div class="case-analysis" aria-label="Case analysis">')
        parts.append(self._render_analytic_section(
            "Historical record", "Historical Context", blocks.get("B", ""), linked, "case-context"
        ))
        parts.append(self._render_chronology(case, linked))
        parts.append(self._render_analytic_section(
            "Observed pattern", "Atrocity Pattern", blocks.get("D", ""), linked, "case-pattern"
        ))
        parts.append(self._render_analytic_section(
            "Interpretation", "Psychological & Societal Drivers", blocks.get("E", ""), linked, "case-interpretation"
        ))
        parts.append(self._render_analytic_section(
            "Consequences and accountability", "Aftermath & Legacy", blocks.get("F", ""), linked, "case-aftermath"
        ))
        parts.append("</div>")
        parts.append("</section>")
        return "\n".join(part for part in parts if part)

    @staticmethod
    def _render_case_facts(case):
        rows = [
            ("Current Ares classification", case["classification"]["display"]),
            ("Period / duration", case["displayPeriod"]),
            ("Estimated deaths", case["deathEstimate"]["display"]),
            ("Location", case["location"]["display"]),
        ]
        items = ['<dl class="case-facts">']
        for label, value in rows:
            items.append(
                '<div class="case-fact">'
                f'<dt>{html_lib.escape(label)}</dt>'
                f'<dd>{html_lib.escape(value)}</dd>'
                '</div>'
            )
        items.append("</dl>")
        return "\n".join(items)

    def _render_vignette(self, vignette_md, case, linked):
        evidence = case["evidence"]
        kind_label = {
            "testimony": "Testimony",
            "historical-quotation": "Historical quotation",
            "historical-slogan": "Quoted source material",
            "legal-institutional-quotation": "Institutional quotation",
        }.get(evidence.get("kind"), "Quoted evidence")

        parts = [
            '<section class="case-narrative" aria-label="Narrative and quoted evidence">',
            '<p class="case-voice-label">Narrative evidence</p>',
        ]
        first_prose = True
        quote_seen = False
        for para in re.split(r"\n\s*\n", vignette_md):
            para = para.strip()
            if not para:
                continue
            if para.lstrip().startswith(">"):
                quote_seen = True
                parts.append('<div class="case-evidence">')
                parts.append(f'<p class="case-evidence-label">{html_lib.escape(kind_label)}</p>')
                parts.append(self.renderer.render_quote(
                    para.split("\n"), linked, css_class="case-evidence-quote"
                ))
                parts.append('<div class="case-evidence-context">')
                parts.append(
                    f'<p><strong>{html_lib.escape(evidence["speaker"])}</strong> · '
                    f'{html_lib.escape(evidence["context"])}</p>'
                )
                parts.append(
                    '<p class="case-provenance-pending">Source trace pending Ares 2.0 provenance mapping.</p>'
                )
                parts.append('</div></div>')
                continue

            para = re.sub(r"^\*(?!\*)|(?<!\*)\*$", "", para).strip()
            para = " ".join(line.strip() for line in para.split("\n"))
            cls = ' class="case-narrative-lead"' if first_prose else ""
            parts.append(f"<p{cls}>{self.renderer._inline(para, linked)}</p>")
            first_prose = False

        if not quote_seen:
            raise ValueError(f"{case['id']}: opening vignette must retain its quoted-evidence block")
        parts.append("</section>")
        return "\n".join(parts)

    def _render_analytic_section(self, kicker, heading, body_md, linked, css_class):
        body = body_md.strip()
        if not body:
            return ""
        return (
            f'<section class="case-analysis-section {css_class}">\n'
            f'<p class="case-analysis-kicker">{html_lib.escape(kicker)}</p>\n'
            f'<h4>{html_lib.escape(heading)}</h4>\n'
            f'{self.renderer.render(body, linked)}\n'
            '</section>'
        )

    def _render_chronology(self, case, linked):
        items = [
            '<section class="case-analysis-section case-chronology-section">',
            '<p class="case-analysis-kicker">Sequence</p>',
            '<h4>Chronology of Events</h4>',
            '<ol class="case-chronology">',
        ]
        for event in case["chronology"]:
            label = html_lib.escape(event["dateLabel"])
            date_time = event.get("dateTime")
            if date_time:
                date_html = f'<time datetime="{html_lib.escape(date_time)}">{label}</time>'
            else:
                date_html = f'<span>{label}</span>'
            items.extend([
                f'<li data-source-status="{html_lib.escape(event["sourceStatus"])}">',
                f'<div class="case-chronology-date">{date_html}</div>',
                f'<div class="case-chronology-event">{self.renderer._inline(event["text"], linked)}</div>',
                '</li>',
            ])
        items.extend([
            '</ol>',
            '<p class="case-chronology-note">Chronology wording was migrated from the existing case text without substantive rewriting; source-level trace remains pending.</p>',
            '</section>',
        ])
        return "\n".join(items)

    def _render_comparative_table(self):
        parts = [
            '<div class="case-comparison" aria-label="Cross-case descriptive comparison">',
            '<p class="case-comparison-intro">This comparison is descriptive, not a ranking. Estimated deaths are retained as uncertain historical estimates and are not used as a measure of significance.</p>',
            '<div class="case-comparison-table-wrap">',
            '<table class="data-table case-comparison-table">',
            '<caption>Cross-case descriptive comparison</caption>',
            '<thead><tr><th scope="col">Case</th><th scope="col">Current Ares classification</th><th scope="col">Period / duration</th><th scope="col">Estimated deaths</th><th scope="col">Primary method</th><th scope="col">Location</th></tr></thead>',
            '<tbody>',
        ]
        for case in self.case_data:
            parts.append(
                '<tr>'
                f'<th scope="row"><a href="#{case["id"]}">{html_lib.escape(case["navTitle"])}</a></th>'
                f'<td>{html_lib.escape(case["classification"]["display"])}</td>'
                f'<td>{html_lib.escape(case["displayPeriod"])}</td>'
                f'<td>{html_lib.escape(case["deathEstimate"]["display"])}</td>'
                f'<td>{html_lib.escape(case["primaryMethod"]["display"])}</td>'
                f'<td>{html_lib.escape(case["location"]["display"])}</td>'
                '</tr>'
            )
        parts.extend(['</tbody></table></div>', '<div class="case-comparison-stacked">'])
        for case in self.case_data:
            parts.extend([
                '<article class="case-comparison-record">',
                f'<h4><a href="#{case["id"]}">{html_lib.escape(case["navTitle"])}</a></h4>',
                '<dl>',
                self._comparison_fact("Current Ares classification", case["classification"]["display"]),
                self._comparison_fact("Period / duration", case["displayPeriod"]),
                self._comparison_fact("Estimated deaths", case["deathEstimate"]["display"]),
                self._comparison_fact("Primary method", case["primaryMethod"]["display"]),
                self._comparison_fact("Location", case["location"]["display"]),
                '</dl></article>',
            ])
        parts.extend([
            '</div>',
            '<p class="case-comparison-note">Metadata and estimates retain current Ares wording pending the source-level provenance mapping required by the Ares 2.0 editorial contract.</p>',
            '</div>',
        ])
        return "\n".join(parts)

    @staticmethod
    def _comparison_fact(label, value):
        return (
            '<div>'
            f'<dt>{html_lib.escape(label)}</dt>'
            f'<dd>{html_lib.escape(value)}</dd>'
            '</div>'
        )

    def _render_document(self):
        document = super()._render_document()
        styles_path = self.core_dir / "case-studies.css"
        styles = self._read(styles_path).strip()
        if not styles:
            raise ValueError("case-studies.css is required for the Issue #9 case grammar")
        return document.replace(
            "</head>",
            f"    <style id=\"ares-case-study-styles\">\n{styles}\n    </style>\n</head>",
            1,
        )


def main():
    # Reuse the existing CLI/build/watch surface while substituting the Issue #9 builder.
    legacy.SiteBuilder = CaseStudySiteBuilder
    legacy.main()


if __name__ == "__main__":
    main()
