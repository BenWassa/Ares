#!/usr/bin/env python3
"""Ares 2.0 scoped builder extension for Issue #10.

The repository is still in the incremental builder transition accepted by ADR #6.
This module subclasses the current static builder rather than rewriting shared
navigation/case rendering owned by parallel issues. It replaces only the
Issue-10-owned surfaces: glossary cues/appendix, the process explainer, and the
small progressive-enhancement layer that supports them.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path

from unified_builder import HAS_WATCHDOG, MarkdownRenderer, SiteBuilder


class Ares2MarkdownRenderer(MarkdownRenderer):
    """Render glossary discovery as durable anchors, not scripted pseudo-buttons."""

    def __init__(self, glossary_terms):
        super().__init__(glossary_terms)
        self._cue_counts: dict[str, int] = {}

    def _link_glossary(self, text, linked):
        """Link the first occurrence of a term in each editorial reading unit.

        The parent builder deliberately passes a fresh ``linked`` set for each
        analytical section and case study. Keeping that boundary means a reader
        who deep-links into a case can still discover definitions without every
        repeated occurrence becoming interactive noise.
        """
        for regex, key, _display in self.glossary_terms:
            if key in linked:
                continue

            parts = re.split(r"(<[^>]+>)", text)
            done = False
            for index, part in enumerate(parts):
                if part.startswith("<"):
                    continue
                match = regex.search(part)
                if not match:
                    continue

                cue_number = self._cue_counts.get(key, 0) + 1
                self._cue_counts[key] = cue_number
                cue_id = f"glossary-cue-{key}-{cue_number}"
                replacement = (
                    f'<a class="glossary-cue" id="{cue_id}" '
                    f'href="#glossary-{html_lib.escape(key, quote=True)}" '
                    f'data-term="{html_lib.escape(key, quote=True)}">'
                    f"{match.group(0)}</a>"
                )
                parts[index] = part[: match.start()] + replacement + part[match.end() :]
                done = True
                break

            if done:
                text = "".join(parts)
                linked.add(key)
        return text


class Ares2SiteBuilder(SiteBuilder):
    """Current static builder with Issue #10 ownership applied."""

    def __init__(self, quiet=False):
        super().__init__(quiet=quiet)
        self.process = self._load_process()
        self.renderer = Ares2MarkdownRenderer(self._build_glossary_matchers())
        self.explainer_css = self._read(self.core_dir / "explainers.css")
        self.explainer_js = self._read(self.core_dir / "explainers.js")

    # ------------------------------------------------------------------
    # Structured process source of truth
    # ------------------------------------------------------------------

    def _load_process(self):
        path = self.data_dir / "process.json"
        raw = self._read(path)
        if not raw:
            raise ValueError("process.json is required for the Ares 2.0 process synthesis")
        try:
            process = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Could not parse process.json: {exc}") from exc
        self._validate_process(process)
        return process

    def _validate_process(self, process):
        required = {
            "id",
            "title",
            "editorialStatus",
            "authorshipLabel",
            "basisSourceIds",
            "rendering",
            "framing",
            "sourceMap",
            "domains",
            "relationships",
            "limits",
        }
        missing = sorted(required - set(process))
        if missing:
            raise ValueError("process.json missing required fields: " + ", ".join(missing))

        if process["editorialStatus"] not in {"source-reviewed", "approved"}:
            raise ValueError("Issue #10 requires a source-reviewed process synthesis")
        if "Ares synthesis" not in process["authorshipLabel"]:
            raise ValueError("Process authorship must explicitly identify the model as Ares synthesis")
        if process.get("rendering", {}).get("sequential") is not False:
            raise ValueError("The reviewed process synthesis must not be rendered as a sequence")
        if process.get("rendering", {}).get("structure") != "grouped-interacting-domains":
            raise ValueError("Unexpected process rendering structure")

        source_ids = set(process["sourceMap"])
        basis_ids = set(process["basisSourceIds"])
        if not basis_ids or not basis_ids.issubset(source_ids):
            raise ValueError("All process basisSourceIds must resolve in sourceMap")

        domain_ids = [domain.get("id") for domain in process["domains"]]
        if len(domain_ids) != len(set(domain_ids)) or any(not item for item in domain_ids):
            raise ValueError("Process domain IDs must be present and unique")
        domain_id_set = set(domain_ids)

        default_domain = process["rendering"].get("defaultExpandedDomainId")
        if default_domain not in domain_id_set:
            raise ValueError("defaultExpandedDomainId must name a declared process domain")

        glossary_ids = set(self.glossary)
        for domain in process["domains"]:
            mappings = domain.get("sourceMappings", [])
            if not mappings:
                raise ValueError(f"Process domain {domain['id']} needs source mappings")
            for mapping in mappings:
                if mapping.get("sourceId") not in source_ids:
                    raise ValueError(f"Unknown process source ID: {mapping.get('sourceId')}")
            unknown_terms = set(domain.get("glossaryTermIds", [])) - glossary_ids
            if unknown_terms:
                raise ValueError(
                    f"Process domain {domain['id']} references unknown glossary terms: "
                    + ", ".join(sorted(unknown_terms))
                )

        relationship_ids = []
        for relationship in process["relationships"]:
            relationship_ids.append(relationship.get("id"))
            if relationship.get("from") not in domain_id_set or relationship.get("to") not in domain_id_set:
                raise ValueError(f"Relationship {relationship.get('id')} has an unresolved domain")
            for mapping in relationship.get("sourceMappings", []):
                if mapping.get("sourceId") not in source_ids:
                    raise ValueError(f"Unknown relationship source ID: {mapping.get('sourceId')}")
        if len(relationship_ids) != len(set(relationship_ids)):
            raise ValueError("Process relationship IDs must be unique")

        # Prevent a future edit from reintroducing either legacy taxonomy as
        # an ordered data structure. Individual concepts such as
        # dehumanization may still be discussed where the source supports them.
        forbidden_keys = {"stages", "stage", "sequence", "step", "steps"}
        for domain in process["domains"]:
            if forbidden_keys.intersection(domain):
                raise ValueError("Legacy stage/step fields are not permitted in process domains")

    # ------------------------------------------------------------------
    # Glossary
    # ------------------------------------------------------------------

    def _render_glossary_appendix(self):
        if not self.glossary:
            return "<p>Glossary data unavailable.</p>"

        items = ['<dl class="glossary-list" data-glossary-index>']
        for key, entry in self.glossary.items():
            term = html_lib.escape(entry.get("term", ""))
            definition = html_lib.escape(entry.get("definition", ""))
            extended = html_lib.escape(entry.get("extendedDefinition", ""))
            related = entry.get("relatedTerms", [])
            source_note = html_lib.escape(entry.get("sourceNote", ""))
            anchor = f"glossary-{html_lib.escape(key, quote=True)}"

            items.append(
                f'<dt id="{anchor}" tabindex="-1">'
                f'<a class="glossary-self-link" href="#{anchor}">{term}</a></dt>'
            )
            block = f"<p>{definition}</p>"
            if extended:
                block += f'<p class="glossary-extended">{extended}</p>'
            if source_note:
                block += f'<p class="glossary-source-note">{source_note}</p>'
            if related:
                rel = ", ".join(html_lib.escape(item) for item in related)
                block += f'<p class="glossary-related"><span>Related:</span> {rel}</p>'
            items.append(f"<dd>{block}</dd>")
        items.append("</dl>")
        return "\n".join(items)

    def _render_glossary_dialog(self):
        return """    <dialog class="glossary-dialog" id="glossary-dialog" aria-labelledby="glossary-dialog-title">
        <div class="glossary-dialog-inner">
            <button type="button" class="glossary-dialog-close" id="glossary-dialog-close" aria-label="Close definition">&times;</button>
            <p class="glossary-dialog-kicker">Glossary</p>
            <h4 id="glossary-dialog-title">Definition</h4>
            <p id="glossary-dialog-short"></p>
            <p class="glossary-dialog-extended" id="glossary-dialog-extended"></p>
            <p class="glossary-dialog-source" id="glossary-dialog-source"></p>
            <p class="glossary-dialog-related" id="glossary-dialog-related"></p>
            <p class="glossary-dialog-actions">
                <a id="glossary-dialog-full-link" href="#appendix-b">Open full glossary entry</a>
            </p>
        </div>
    </dialog>"""

    # ------------------------------------------------------------------
    # Process explainer
    # ------------------------------------------------------------------

    def _source_mapping_html(self, mappings):
        rendered = []
        for mapping in mappings:
            source = self.process["sourceMap"][mapping["sourceId"]]
            label = html_lib.escape(source["shortLabel"])
            locator = html_lib.escape(mapping["locator"])
            note = html_lib.escape(mapping.get("note", ""))
            target = html_lib.escape(source["referenceTarget"], quote=True)
            text = f'<a href="#{target}">{label}, {locator}</a>'
            if note:
                text += f" — {note}"
            rendered.append(f"<li>{text}</li>")
        return "\n".join(rendered)

    def _glossary_links_html(self, term_ids):
        links = []
        for term_id in term_ids:
            entry = self.glossary[term_id]
            target = html_lib.escape(term_id, quote=True)
            label = html_lib.escape(entry.get("term", term_id))
            links.append(f'<a href="#glossary-{target}">{label}</a>')
        return ", ".join(links)

    def _render_process_explainer(self):
        process = self.process
        default_open = process["rendering"]["defaultExpandedDomainId"]
        parts = [
            '<section class="process-explainer" aria-labelledby="process-synthesis-title" '
            'data-process-explainer>',
            '<p class="process-kicker">Ares synthesis · source-reviewed</p>',
            f'<h3 id="process-synthesis-title">{html_lib.escape(process["title"])}</h3>',
            f'<p class="process-authorship">{html_lib.escape(process["authorshipLabel"])}</p>',
            f'<p class="process-framing">{html_lib.escape(process["framing"]["summary"])}</p>',
            f'<p class="process-caveat"><strong>Not a ladder:</strong> '
            f'{html_lib.escape(process["framing"]["nonDeterminism"])}</p>',
            '<div class="process-domain-grid">',
        ]

        for domain in process["domains"]:
            domain_id = html_lib.escape(domain["id"], quote=True)
            open_attr = " open" if domain["id"] == default_open else ""
            parts.extend(
                [
                    f'<details class="process-domain" id="process-domain-{domain_id}" '
                    f'data-process-domain="{domain_id}"{open_attr}>',
                    '<summary>',
                    f'<span class="process-domain-label">{html_lib.escape(domain["label"])}</span>',
                    f'<span class="process-domain-summary">{html_lib.escape(domain["summary"])}</span>',
                    '</summary>',
                    '<div class="process-domain-detail">',
                    f'<p>{html_lib.escape(domain["detail"])}</p>',
                    f'<p class="process-related-concepts"><span>Related concepts:</span> '
                    f'{self._glossary_links_html(domain["glossaryTermIds"])}</p>',
                    '<p class="process-source-heading">Source map</p>',
                    '<ul class="process-source-list">',
                    self._source_mapping_html(domain["sourceMappings"]),
                    '</ul>',
                    '</div>',
                    '</details>',
                ]
            )

        parts.extend(
            [
                '</div>',
                '<section class="process-relationships" aria-labelledby="process-relationships-title">',
                '<h4 id="process-relationships-title">How the domains can interact</h4>',
                '<ul>',
            ]
        )
        for relationship in process["relationships"]:
            parts.extend(
                [
                    f'<li data-relationship="{html_lib.escape(relationship["type"], quote=True)}">',
                    f'<p>{html_lib.escape(relationship["label"])}</p>',
                    '<ul class="process-source-list process-relationship-source-list">',
                    self._source_mapping_html(relationship["sourceMappings"]),
                    '</ul>',
                    '</li>',
                ]
            )
        parts.extend(['</ul>', '</section>'])

        parts.extend(
            [
                '<section class="process-limits" aria-labelledby="process-limits-title">',
                '<h4 id="process-limits-title">Limits of the synthesis</h4>',
                '<ul>',
            ]
        )
        for limit in process["limits"]:
            parts.append(f"<li>{html_lib.escape(limit)}</li>")
        parts.extend(
            [
                '</ul>',
                f'<p class="process-scope-note">{html_lib.escape(process["framing"]["scopeNote"])}</p>',
                '</section>',
                '</section>',
            ]
        )
        return "\n".join(parts)

    def _render_body(self):
        body = super()._render_body()
        replacement = f"""        <section id="part-iv" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Part IV <span class="part-subtitle">Process Synthesis</span></h2>
            {self._render_process_explainer()}
            <div class="analytic-section process-context">
                {self._section_body('process-model', set())}
            </div>
        </section>

"""
        body, count = re.subn(
            r'        <section id="part-iv" class="section">.*?</section>\n\n(?=        <section id="part-v")',
            replacement,
            body,
            count=1,
            flags=re.DOTALL,
        )
        if count != 1:
            raise ValueError("Could not replace the legacy Part IV process rendering")
        return body

    def _render_data_script(self):
        glossary_json = json.dumps(self.glossary, ensure_ascii=False).replace("</", "<\\/")
        process_json = json.dumps(self.process, ensure_ascii=False).replace("</", "<\\/")
        return (
            "    <script>\n"
            f"        window.ARES_GLOSSARY = {glossary_json};\n"
            f"        window.ARES_PROCESS = {process_json};\n"
            "    </script>"
        )

    def _render_document(self):
        document = super()._render_document()

        # Replace the legacy off-canvas concept panel with a real dialog. The
        # old script ignores the new cue class, so the two enhancement systems
        # do not compete during the incremental Ares 2.0 transition.
        document, panel_count = re.subn(
            r'    <aside class="side-panel" id="side-panel">.*?</aside>',
            self._render_glossary_dialog(),
            document,
            count=1,
            flags=re.DOTALL,
        )
        if panel_count != 1:
            raise ValueError("Could not replace legacy glossary side panel")

        document = document.replace(
            "Part IV &middot; Process Model",
            "Part IV &middot; Process Synthesis",
        )
        document = document.replace(
            '<p class="reference">Dutton, D. G., Boyanowsky, E. O., &amp; Bond, M. H. (2005).',
            '<p class="reference" id="ref-src-dutton-2005">Dutton, D. G., Boyanowsky, E. O., &amp; Bond, M. H. (2005).',
            1,
        )

        if self.explainer_css:
            document = document.replace(
                "</head>",
                f'    <style id="ares-explainers-styles">\n{self.explainer_css}\n    </style>\n</head>',
                1,
            )
        if self.explainer_js:
            document = document.replace(
                "</body>",
                f'    <script id="ares-explainers-script">\n{self.explainer_js}\n    </script>\n</body>',
                1,
            )

        if "ARES_PROCESS_STAGES" in document or "process-model-svg" in document:
            raise ValueError("Legacy stage process representation leaked into generated output")
        return document


def main():
    parser = argparse.ArgumentParser(description="Project Ares Ares 2.0 content builder")
    parser.add_argument("--watch", action="store_true", help="rebuild on markdown/data changes")
    parser.add_argument("--clean", action="store_true", help="remove stale build artefacts first")
    parser.add_argument("--quiet", action="store_true", help="minimal logging")
    args = parser.parse_args()

    builder = Ares2SiteBuilder(quiet=args.quiet)
    if not args.quiet:
        print("Project Ares - Ares 2.0 Static Builder")
        print("=" * 40)

    if args.clean:
        builder.clean()
    if not builder.build():
        sys.exit(1)

    if args.watch:
        if not HAS_WATCHDOG:
            builder.log("File watching requires the 'watchdog' package (pip install watchdog)", "ERROR")
            sys.exit(1)

        from watchdog.events import FileSystemEventHandler
        from watchdog.observers import Observer

        class Handler(FileSystemEventHandler):
            def __init__(self):
                self.last = 0.0

            def on_modified(self, event):
                if event.is_directory or not str(event.src_path).endswith((".md", ".json", ".css", ".js")):
                    return
                now = time.time()
                if now - self.last < 1.5:
                    return
                self.last = now
                builder.log(f"Changed: {Path(event.src_path).name} — rebuilding")
                builder.build()

        observer = Observer()
        handler = Handler()
        for path in builder.watch_paths() + [builder.core_dir]:
            observer.schedule(handler, str(path), recursive=False)
        observer.start()
        builder.log("Watching for changes (Ctrl+C to stop)")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()


if __name__ == "__main__":
    main()
