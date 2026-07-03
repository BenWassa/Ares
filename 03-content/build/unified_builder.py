#!/usr/bin/env python3
"""
Project Ares - Unified Content Builder
=======================================

Data-driven site generator. Reads every markdown section, every case study,
the glossary / map JSON data and the process-model SVG, then assembles the
complete `01-core/index-with-content.html` from scratch.

Unlike the previous regex-patching approach, this builder owns the whole page
structure, so adding a new case study or section is just a matter of dropping a
markdown file into `03-content/` and re-running the build.

Usage (from anywhere in the project, via `python build.py`):
    python build.py            # standard build
    python build.py --clean    # remove stale build artefacts, then build
    python build.py --watch     # rebuild automatically on markdown changes
    python build.py --quiet     # minimal logging
"""

import sys
import re
import json
import time
import html as html_lib
import argparse
from pathlib import Path
from datetime import datetime

# Optional file watching (requires: pip install watchdog)
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    HAS_WATCHDOG = True
except ImportError:
    HAS_WATCHDOG = False


# ---------------------------------------------------------------------------
# Static configuration: the document skeleton and ordering.
# ---------------------------------------------------------------------------

# Analytical sections grouped by the "Part" they belong to. Each entry maps a
# markdown filename (without extension) to the display heading / numbering.
SECTION_ORDER = [
    "scope-purpose",
    "definitions-typology",
    "theoretical-lenses",
    "comparative-analysis",
    "process-model",
    "implications",
    "critical-reflection",
]

# Case studies, in chronological order, each pointing at its markdown file and
# carrying the structured metadata used for the TOC and the comparative table.
CASE_STUDIES = [
    {
        "file": "nanking-massacre",
        "id": "nanking-massacre",
        "nav": "Nanking Massacre (1937)",
        "type": "Military massacre",
        "duration": "~6 weeks",
        "deaths": "200,000–300,000",
        "method": "Mass execution, mass rape, arson",
        "location": "Nanking, China",
        "kicker": "Nanking, China · December 1937",
        "epigraph": "An army off the leash: what conquest becomes when restraint is treated as weakness.",
    },
    {
        "file": "armenian-genocide",
        "id": "armenian-genocide",
        "nav": "Armenian Genocide (1915–17)",
        "type": "Genocide",
        "duration": "1915–1917",
        "deaths": "1,000,000–1,500,000",
        "method": "Death marches, massacre, starvation",
        "location": "Ottoman Empire",
        "kicker": "Ottoman Empire · 1915–1917",
        "epigraph": "Annihilation by administration: the twentieth century's template for genocide.",
    },
    {
        "file": "ukrainian-holodomor",
        "id": "ukrainian-holodomor",
        "nav": "Ukrainian Holodomor (1932–33)",
        "type": "Political slaughter",
        "duration": "1932–1933",
        "deaths": "3,900,000–7,000,000",
        "method": "Engineered starvation",
        "location": "Soviet Ukraine",
        "kicker": "Soviet Ukraine · 1932–1933",
        "epigraph": "Hunger as an instrument of state: a famine with an author.",
    },
    {
        "file": "cambodian-genocide",
        "id": "cambodian-genocide",
        "nav": "Cambodian Killing Fields (1975–79)",
        "type": "Political slaughter / genocide",
        "duration": "1975–1979",
        "deaths": "1,500,000–3,000,000",
        "method": "Execution, forced labour, starvation",
        "location": "Cambodia",
        "kicker": "Phnom Penh, Cambodia · April 1975",
        "epigraph": "Year Zero: utopia at gunpoint, and a quarter of a nation dead.",
    },
    {
        "file": "my-lai-massacre",
        "id": "my-lai-massacre",
        "nav": "My Lai Massacre (1968)",
        "type": "Military massacre",
        "duration": "1 day (16 Mar)",
        "deaths": "347–504",
        "method": "Mass shooting",
        "location": "Quảng Ngãi, Vietnam",
        "kicker": "Sơn Mỹ, Quảng Ngãi Province, Vietnam · 16 March 1968",
        "epigraph": "Four hours, one company, five hundred dead — and the pilot who landed between them.",
    },
    {
        "file": "el-mozote-massacre",
        "id": "el-mozote-massacre",
        "nav": "El Mozote Massacre (1981)",
        "type": "Military massacre",
        "duration": "1 day (11 Dec)",
        "deaths": "~978 (553 children)",
        "method": "Mass execution",
        "location": "Morazán, El Salvador",
        "kicker": "Morazán Department, El Salvador · 11 December 1981",
        "epigraph": "The village that was erased — and the one woman left to say so.",
    },
    {
        "file": "bosnian-war",
        "id": "bosnian-war",
        "nav": "Bosnia — Srebrenica (1992–95)",
        "type": "Genocide / ethnic cleansing",
        "duration": "1992–1995",
        "deaths": "~100,000 (8,000+ at Srebrenica)",
        "method": "Mass execution, ethnic cleansing",
        "location": "Bosnia & Herzegovina",
        "kicker": "Srebrenica, Bosnia and Herzegovina · July 1995",
        "epigraph": "Genocide in Europe, under the flag of the United Nations, fifty years after “never again.”",
    },
    {
        "file": "rwandan-genocide",
        "id": "rwandan-genocide",
        "nav": "Rwandan Genocide (1994)",
        "type": "Genocide",
        "duration": "100 days",
        "deaths": "800,000–1,000,000",
        "method": "Machete attacks, mass killing",
        "location": "Rwanda",
        "kicker": "Kigali, Rwanda · April–July 1994",
        "epigraph": "One hundred days, up to a million dead — and the neighbors did the killing.",
    },
]

# Human-readable labels for the lettered blocks inside each case study.
CASE_BLOCK_LABELS = {
    "A": "Opening Vignette",
    "B": "Historical Context",
    "C": "Chronology of Events",
    "D": "Atrocity Pattern",
    "E": "Psychological & Societal Drivers",
    "F": "Aftermath & Legacy",
}

# The eight visual stages rendered in the process-model SVG, keyed by their
# `data-stage` attribute, with the short descriptions shown in the detail panel.
PROCESS_STAGE_DETAILS = {
    "1": ("Discrimination", "Legal and social exclusion of the target group: denial of rights, "
          "civic participation and economic opportunity marks them as second-class."),
    "2": ("Dehumanization", "Propaganda strips the group of humanity — recast as vermin, disease "
          "or existential threat — dissolving the empathy that normally restrains violence."),
    "3": ("Organization", "Killing is planned. Militias are formed and trained, logistics and "
          "command structures are put in place, and hate is given an institutional home."),
    "4": ("Polarization", "Moderates are silenced or killed and extremists seize the centre, "
          "widening the gap between groups until coexistence appears impossible."),
    "5": ("Preparation", "Lists are drawn up, weapons distributed, victims concentrated or "
          "disarmed. The machinery of atrocity is armed and aimed."),
    "6": ("Persecution", "Mass violence begins: round-ups, deportations, confinement and the "
          "first killings, often under cover of war or emergency powers."),
    "7": ("Extermination", "Systematic mass killing — the point the perpetrators have built "
          "toward. Moral and legal restraint has collapsed entirely."),
    "8": ("Denial", "Evidence is destroyed, history rewritten and responsibility disowned. "
          "Denial is the final stage of every genocide and the seed of the next."),
}


# ---------------------------------------------------------------------------
# Markdown → HTML rendering
# ---------------------------------------------------------------------------

class MarkdownRenderer:
    """A small, purpose-built markdown renderer.

    It handles exactly the subset of markdown used across the Ares content:
    ATX headings, bold/italic, unordered lists (with one level of nesting),
    GFM pipe tables and paragraphs — plus automatic, first-occurrence glossary
    linking that emits `data-term` attributes matching the glossary JSON keys.
    """

    def __init__(self, glossary_terms):
        # glossary_terms: list of (compiled_regex, json_key, display) sorted so
        # that longer phrases match before shorter ones.
        self.glossary_terms = glossary_terms

    # -- inline formatting --------------------------------------------------

    def _inline(self, text, linked):
        """Escape, then apply bold/italic and glossary links to a text run."""
        text = html_lib.escape(text)
        # Bold before italic so the ** markers are consumed first.
        text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
        text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", text)
        text = self._link_glossary(text, linked)
        return text

    def _link_glossary(self, text, linked):
        """Link the first unseen occurrence of each glossary term.

        Replacement only touches text that sits outside existing HTML tags, so
        we never corrupt an attribute or nest a span inside another.
        """
        for regex, key, _display in self.glossary_terms:
            if key in linked:
                continue

            # Split on tags; only substitute within the plain-text segments.
            parts = re.split(r"(<[^>]+>)", text)
            done = False
            for i, part in enumerate(parts):
                if part.startswith("<"):
                    continue
                m = regex.search(part)
                if m:
                    replacement = (
                        f'<span class="glossary-term" data-term="{key}">'
                        f'{m.group(0)}</span>'
                    )
                    parts[i] = part[: m.start()] + replacement + part[m.end():]
                    done = True
                    break
            if done:
                text = "".join(parts)
                linked.add(key)
        return text

    # -- block parsing ------------------------------------------------------

    def render(self, markdown, linked=None):
        """Convert a markdown string to an HTML fragment."""
        if linked is None:
            linked = set()

        # Strip HTML comments and the boilerplate scaffolding notes.
        markdown = re.sub(r"<!--.*?-->", "", markdown, flags=re.DOTALL)
        markdown = re.sub(r"^\*This file will contain.*?$", "", markdown,
                          flags=re.MULTILINE)

        lines = markdown.split("\n")
        out = []
        i = 0
        n = len(lines)

        while i < n:
            line = lines[i]
            stripped = line.strip()

            if not stripped:
                i += 1
                continue

            # Table (GFM pipe table): current line and the next are | rows and
            # the next is a |---| separator.
            if stripped.startswith("|") and i + 1 < n and \
                    re.match(r"^\s*\|?[\s:|-]+\|?\s*$", lines[i + 1]):
                block, i = self._collect(lines, i, lambda s: s.strip().startswith("|"))
                out.append(self._render_table(block, linked))
                continue

            # Blockquote -> styled pull quote (with optional citation after
            # the final " — " separator).
            if stripped.startswith(">"):
                block, i = self._collect(lines, i,
                                         lambda s: s.strip().startswith(">"))
                out.append(self.render_quote(block, linked))
                continue

            # Heading.
            heading = re.match(r"^(#{1,6})\s+(.*)$", stripped)
            if heading:
                level = min(len(heading.group(1)) + 1, 4)  # md h1 -> html h2
                text = self._inline(heading.group(2).strip(), linked)
                out.append(f"<h{level}>{text}</h{level}>")
                i += 1
                continue

            # Unordered list (supports one level of nesting via indentation).
            if re.match(r"^\s*[\*\-]\s+", line):
                block, i = self._collect(lines, i,
                                         lambda s: bool(re.match(r"^\s*[\*\-]\s+", s))
                                         or (s.strip() == ""))
                # Trim trailing blank lines swept up by the collector.
                while block and block[-1].strip() == "":
                    block.pop()
                out.append(self._render_list(block, linked))
                continue

            # Paragraph: gather consecutive plain lines.
            para, i = self._collect(
                lines, i,
                lambda s: s.strip() != ""
                and not re.match(r"^#{1,6}\s", s.strip())
                and not re.match(r"^\s*[\*\-]\s+", s)
                and not s.strip().startswith("|")
                and not s.strip().startswith(">"),
            )
            text = " ".join(p.strip() for p in para).strip()
            if text:
                out.append(f"<p>{self._inline(text, linked)}</p>")

        return "\n".join(out)

    def render_quote(self, block, linked, css_class="pull-quote"):
        """Render a `>` blockquote. If the text ends with an ' — attribution'
        segment, it is split out into a <cite> element."""
        text = " ".join(re.sub(r"^\s*>\s?", "", line).strip()
                        for line in block).strip()
        cite = None
        if " — " in text:
            text, cite = text.rsplit(" — ", 1)
        html = [f'<blockquote class="{css_class}">',
                f"<p>{self._inline(text, linked)}</p>"]
        if cite:
            html.append(f"<cite>{self._inline(cite, linked)}</cite>")
        html.append("</blockquote>")
        return "\n".join(html)

    @staticmethod
    def _collect(lines, i, predicate):
        """Collect consecutive lines while `predicate(line)` holds."""
        block = []
        n = len(lines)
        while i < n and predicate(lines[i]):
            block.append(lines[i])
            i += 1
        return block, i

    def _render_list(self, block, linked):
        """Render an unordered list, honouring a single level of nesting."""
        html = ["<ul>"]
        open_child = False
        for line in block:
            if not line.strip():
                continue
            indent = len(line) - len(line.lstrip(" "))
            content = re.sub(r"^\s*[\*\-]\s+", "", line).strip()
            item = self._inline(content, linked)
            if indent >= 2:  # nested item
                if not open_child:
                    # Attach nested list to the previous item.
                    if html and html[-1].endswith("</li>"):
                        html[-1] = html[-1][:-5]  # reopen last <li>
                    html.append("<ul>")
                    open_child = True
                html.append(f"<li>{item}</li>")
            else:
                if open_child:
                    html.append("</ul></li>")
                    open_child = False
                html.append(f"<li>{item}</li>")
        if open_child:
            html.append("</ul></li>")
        html.append("</ul>")
        return "\n".join(html)

    def _render_table(self, block, linked):
        """Render a GFM pipe table as a styled data table."""
        rows = [r for r in block if r.strip()]
        header = self._split_row(rows[0])
        body = [self._split_row(r) for r in rows[2:]]  # skip the |---| separator

        html = ['<div class="table-wrap"><table class="data-table">', "<thead><tr>"]
        for cell in header:
            html.append(f"<th>{self._inline(cell, linked)}</th>")
        html.append("</tr></thead><tbody>")
        for row in body:
            html.append("<tr>")
            for cell in row:
                html.append(f"<td>{self._inline(cell, linked)}</td>")
            html.append("</tr>")
        html.append("</tbody></table></div>")
        return "\n".join(html)

    @staticmethod
    def _split_row(row):
        row = row.strip()
        if row.startswith("|"):
            row = row[1:]
        if row.endswith("|"):
            row = row[:-1]
        return [c.strip() for c in row.split("|")]


# ---------------------------------------------------------------------------
# Site builder
# ---------------------------------------------------------------------------

class SiteBuilder:
    def __init__(self, quiet=False):
        self.build_dir = Path(__file__).parent
        self.content_dir = self.build_dir.parent
        self.project_root = self.content_dir.parent
        self.sections_dir = self.content_dir / "sections"
        self.cases_dir = self.content_dir / "case-studies"
        self.data_dir = self.content_dir / "data"
        self.core_dir = self.project_root / "01-core"
        self.assets_dir = self.project_root / "02-assets"
        self.output_file = self.core_dir / "index-with-content.html"
        self.quiet = quiet

        self.glossary = self._load_glossary()
        self.renderer = MarkdownRenderer(self._build_glossary_matchers())

    # -- utilities ----------------------------------------------------------

    def log(self, message, level="INFO"):
        if self.quiet and level == "INFO":
            return
        ts = datetime.now().strftime("%H:%M:%S")
        print(f"[{ts}] {level}: {message}")

    def _read(self, path):
        try:
            return path.read_text(encoding="utf-8")
        except FileNotFoundError:
            self.log(f"Missing file: {path}", "WARNING")
            return ""

    def _load_glossary(self):
        raw = self._read(self.data_dir / "glossary.json")
        if not raw:
            return {}
        try:
            return json.loads(raw).get("glossary", {})
        except json.JSONDecodeError as exc:
            self.log(f"Could not parse glossary.json: {exc}", "WARNING")
            return {}

    def _build_glossary_matchers(self):
        """Map surface phrases to glossary JSON keys for auto-linking.

        The JSON keys (e.g. `massHomicide`) differ from the words that appear in
        the prose, so we build explicit phrase -> key pairs and compile a
        case-insensitive, word-bounded regex for each.
        """
        phrase_to_key = {
            "genocide": "genocide",
            "extreme mass homicide": "massHomicide",
            "mass homicide": "massHomicide",
            "massacres": "massacre",
            "massacre": "massacre",
            "political slaughter": "politicalSlaughter",
            "ethnic cleansing": "ethnicCleansing",
            "perpetrators": "perpetrator",
            "perpetrator": "perpetrator",
            "bystanders": "bystander",
            "bystander": "bystander",
            "dehumanization": "dehumanization",
            "dehumanisation": "dehumanization",
            "moral disengagement": "moralDisengagement",
            "obedience to authority": "obedienceToAuthority",
            "group polarization": "groupPolarization",
            "diffusion of responsibility": "diffusionOfResponsibility",
            "situational transitions": "situationalTransition",
            "situational transition": "situationalTransition",
            "escalation": "escalation",
            "propaganda": "propaganda",
            "ideological": "ideology",
            "ideology": "ideology",
            "impunity": "impunity",
            "denial": "denial",
            "forensic ethology": "forensicEthology",
            "atrocities": "atrocity",
            "atrocity": "atrocity",
        }
        # Only keep phrases whose key actually exists in the loaded glossary.
        matchers = []
        for phrase, key in phrase_to_key.items():
            if key not in self.glossary:
                continue
            regex = re.compile(r"\b" + re.escape(phrase) + r"\b", re.IGNORECASE)
            matchers.append((regex, key, phrase))
        # Longest phrase first so "mass homicide" wins over "homicide".
        matchers.sort(key=lambda m: len(m[2]), reverse=True)
        return matchers

    # -- section parsing ----------------------------------------------------

    @staticmethod
    def _strip_leading_h(markdown):
        """Drop the first ATX heading from a section body (rendered separately)."""
        lines = markdown.split("\n")
        out = []
        dropped = False
        for line in lines:
            if not dropped and re.match(r"^#{1,3}\s", line.strip()):
                dropped = True
                continue
            out.append(line)
        return "\n".join(out)

    def _section_body(self, name, linked):
        raw = self._read(self.sections_dir / f"{name}.md")
        raw = self._strip_leading_h(raw)
        return self.renderer.render(raw, linked)

    def _parse_case(self, name):
        """Split a case-study markdown file into its lettered blocks."""
        raw = self._read(self.cases_dir / f"{name}.md")
        # Title is the first level-1 heading.
        title_match = re.search(r"^#\s+(.*)$", raw, flags=re.MULTILINE)
        title = title_match.group(1).strip() if title_match else name

        blocks = {}
        # Blocks look like "## A. Opening Vignette".
        pattern = re.compile(r"^##\s+([A-F])\.\s*(.*)$", flags=re.MULTILINE)
        matches = list(pattern.finditer(raw))
        for idx, m in enumerate(matches):
            letter = m.group(1)
            start = m.end()
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(raw)
            blocks[letter] = raw[start:end].strip()
        return title, blocks

    # -- HTML fragment builders --------------------------------------------

    def _render_case(self, meta):
        """Render a full dual-voice case study section."""
        title, blocks = self._parse_case(meta["file"])
        linked = set()  # link glossary terms fresh within each case
        parts = [f'<section id="{meta["id"]}" class="subsection case-study">']
        parts.append(f"<h3>{html_lib.escape(title)}</h3>")

        # One-line thematic epigraph under the title.
        if meta.get("epigraph"):
            parts.append(f'<p class="case-epigraph">'
                         f'{html_lib.escape(meta["epigraph"])}</p>')

        # Metadata chip row from the comparative dataset.
        parts.append('<ul class="case-meta">')
        parts.append(f'<li><span>Type</span>{html_lib.escape(meta["type"])}</li>')
        parts.append(f'<li><span>Duration</span>{html_lib.escape(meta["duration"])}</li>')
        parts.append(f'<li><span>Deaths</span>{html_lib.escape(meta["deaths"])}</li>')
        parts.append(f'<li><span>Location</span>{html_lib.escape(meta["location"])}</li>')
        parts.append("</ul>")

        # A. Vignette -> narrative voice: kicker, drop-cap prose, witness quote.
        vignette = blocks.get("A", "").strip()
        if vignette:
            parts.append(self._render_vignette(vignette, meta, linked))

        # B-F -> analytic voice.
        parts.append('<div class="analytic-content">')
        for letter in ["B", "C", "D", "E", "F"]:
            body = blocks.get(letter, "").strip()
            if not body:
                continue
            label = CASE_BLOCK_LABELS[letter]
            parts.append(f"<h4>{label}</h4>")
            if letter == "C":
                # Chronology renders as a timeline list.
                parts.append('<div class="chronology">'
                             + self.renderer.render(body, linked) + "</div>")
            else:
                parts.append(self.renderer.render(body, linked))
        parts.append("</div>")
        parts.append("</section>")
        return "\n".join(parts)

    def _render_vignette(self, vignette_md, meta, linked):
        """Render the opening vignette: a place/date kicker, multi-paragraph
        narrative prose (drop cap on the first paragraph), and any closing
        `>` blockquote as a styled witness quote."""
        parts = ['<div class="narrative-vignette">']
        if meta.get("kicker"):
            parts.append(f'<p class="vignette-kicker">'
                         f'{html_lib.escape(meta["kicker"])}</p>')
        first_prose = True
        for para in re.split(r"\n\s*\n", vignette_md):
            para = para.strip()
            if not para:
                continue
            if para.lstrip().startswith(">"):
                parts.append(self.renderer.render_quote(
                    para.split("\n"), linked, css_class="vignette-quote"))
                continue
            # Strip the legacy single-paragraph italic wrapping (*...*).
            para = re.sub(r"^\*(?!\*)|(?<!\*)\*$", "", para).strip()
            para = " ".join(line.strip() for line in para.split("\n"))
            cls = ' class="drop-cap-paragraph"' if first_prose else ""
            parts.append(f"<p{cls}>{self.renderer._inline(para, linked)}</p>")
            first_prose = False
        parts.append("</div>")
        return "\n".join(parts)

    def _render_process_svg(self):
        svg = self._read(self.assets_dir / "svgs" / "process-model.svg")
        # Drop the XML/HTML comment header, keep the <svg> element itself.
        svg = re.sub(r"^<!--.*?-->\s*", "", svg, flags=re.DOTALL)
        return svg.strip()

    def _render_glossary_appendix(self):
        if not self.glossary:
            return "<p>Glossary data unavailable.</p>"
        items = ['<dl class="glossary-list">']
        for entry in self.glossary.values():
            term = html_lib.escape(entry.get("term", ""))
            definition = html_lib.escape(entry.get("definition", ""))
            extended = html_lib.escape(entry.get("extendedDefinition", ""))
            related = entry.get("relatedTerms", [])
            items.append(f"<dt>{term}</dt>")
            block = f"<p>{definition}</p>"
            if extended:
                block += f'<p class="glossary-extended">{extended}</p>'
            if related:
                rel = ", ".join(html_lib.escape(r) for r in related)
                block += f'<p class="glossary-related"><span>Related:</span> {rel}</p>'
            items.append(f"<dd>{block}</dd>")
        items.append("</dl>")
        return "\n".join(items)

    def _render_comparative_table(self):
        rows = ['<div class="table-wrap"><table class="data-table">',
                "<thead><tr><th>Case</th><th>Type</th><th>Period</th>"
                "<th>Estimated deaths</th><th>Primary method</th>"
                "<th>Location</th></tr></thead><tbody>"]
        for c in CASE_STUDIES:
            rows.append(
                "<tr>"
                f'<td><a href="#{c["id"]}">{html_lib.escape(c["nav"])}</a></td>'
                f'<td>{html_lib.escape(c["type"])}</td>'
                f'<td>{html_lib.escape(c["duration"])}</td>'
                f'<td>{html_lib.escape(c["deaths"])}</td>'
                f'<td>{html_lib.escape(c["method"])}</td>'
                f'<td>{html_lib.escape(c["location"])}</td>'
                "</tr>"
            )
        rows.append("</tbody></table></div>")
        rows.append('<p class="table-note">Figures are scholarly estimates and, for '
                    "several cases, remain contested. They are presented to convey "
                    "scale, not to suggest false precision.</p>")
        return "\n".join(rows)

    # -- navigation ---------------------------------------------------------

    def _render_nav(self):
        case_links = "\n".join(
            f'                            <li><a href="#{c["id"]}">'
            f'{html_lib.escape(c["nav"])}</a></li>'
            for c in CASE_STUDIES
        )
        return f"""            <div class="nav-content" id="nav-content">
                <h3>Table of Contents</h3>
                <ul>
                    <li><a href="#front-matter">Front Matter</a></li>
                    <li><a href="#part-i">Part I &middot; Conceptual Foundations</a>
                        <ul>
                            <li><a href="#scope-purpose">1. Scope &amp; Purpose</a></li>
                            <li><a href="#definitions-typology">2. Definitions &amp; Typology</a></li>
                            <li><a href="#theoretical-lenses">3. Theoretical Lenses</a></li>
                        </ul>
                    </li>
                    <li><a href="#part-ii">Part II &middot; Historical Cases</a>
                        <ul>
{case_links}
                        </ul>
                    </li>
                    <li><a href="#part-iii">Part III &middot; Comparative Analysis</a></li>
                    <li><a href="#part-iv">Part IV &middot; Process Model</a></li>
                    <li><a href="#part-v">Part V &middot; Implications</a></li>
                    <li><a href="#part-vi">Part VI &middot; Critical Reflection</a></li>
                    <li><a href="#appendices">Appendices</a></li>
                </ul>
            </div>"""

    # -- page assembly ------------------------------------------------------

    def _render_body(self):
        linked_front = set()
        # Front matter: pull executive summary + how-to from front-matter.md.
        fm_raw = self._read(self.sections_dir / "front-matter.md")
        exec_md = self._extract(fm_raw, "Executive Summary")
        note_md = self._extract(fm_raw, "A Note Before You Begin")
        howto_md = self._extract(fm_raw, "How to Use This Synopsis")
        note_html = ""
        if note_md:
            note_html = (
                '<aside class="content-note" role="note">\n'
                "<h2>A Note Before You Begin</h2>\n"
                f"{self.renderer.render(note_md, linked_front)}\n"
                "</aside>"
            )

        cases_html = "\n".join(self._render_case(c) for c in CASE_STUDIES)

        body = f"""    <main class="main-content" id="top">
        <section id="front-matter" class="section">
            <div class="section-title-page">
                <p class="eyebrow">A Digital Synopsis</p>
                <h1 class="main-title">The Human Story of Extreme Mass Homicide</h1>
                <p class="subtitle">From Military Massacre to Genocide &middot;
                    Dutton, Boyanowsky &amp; Bond (2005)</p>
                <p class="reading-meta" id="reading-meta"></p>
            </div>

            <div class="executive-summary">
                <h2>Executive Summary</h2>
                {self.renderer.render(exec_md, linked_front)}
            </div>

            {note_html}

            <div class="how-to-use">
                <h2>How to Use This Synopsis</h2>
                {self.renderer.render(howto_md, linked_front)}
                <div class="voice-legend">
                    <div class="voice-swatch narrative">Narrative voice — immersive,
                        human-scale storytelling</div>
                    <div class="voice-swatch analytic">Analytic voice — precise,
                        evidence-led argument</div>
                </div>
            </div>
        </section>

        <section id="part-i" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Part I <span class="part-subtitle">Conceptual Foundations</span></h2>

            <section id="scope-purpose" class="subsection analytic-section">
                <h3>1. Scope &amp; Purpose</h3>
                {self._section_body('scope-purpose', set())}
            </section>

            <section id="definitions-typology" class="subsection analytic-section">
                <h3>2. Key Definitions &amp; Typology</h3>
                {self._section_body('definitions-typology', set())}
            </section>

            <section id="theoretical-lenses" class="subsection analytic-section">
                <h3>3. Theoretical Lenses</h3>
                {self._section_body('theoretical-lenses', set())}
            </section>
        </section>

        <section id="part-ii" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Part II <span class="part-subtitle">Historical Cases</span></h2>
            <p class="part-intro">Eight events, ordered chronologically. Each opens with a
                narrative vignette, then turns to analytic reconstruction: context,
                chronology, the pattern of atrocity, its psychological drivers, and its
                aftermath.</p>
{cases_html}
        </section>

        <section id="part-iii" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Part III <span class="part-subtitle">Cross-Case Comparative Analysis</span></h2>
            <div class="analytic-section">
                {self._section_body('comparative-analysis', set())}
            </div>
        </section>

        <section id="part-iv" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Part IV <span class="part-subtitle">Integrated Process Model</span></h2>
            <div id="process-model-diagram" class="interactive-diagram">
                {self._render_process_svg()}
            </div>
            <div id="process-model-detail" class="process-detail" aria-live="polite">
                <p class="process-detail-hint">Select a stage in the diagram to read how it
                    works and where intervention is still possible.</p>
            </div>
            <div class="analytic-section">
                {self._section_body('process-model', set())}
            </div>
        </section>

        <section id="part-v" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Part V <span class="part-subtitle">Implications &amp; Applications</span></h2>
            <div class="analytic-section">
                {self._section_body('implications', set())}
            </div>
        </section>

        <section id="part-vi" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Part VI <span class="part-subtitle">Critical Reflection</span></h2>
            <div class="analytic-section">
                {self._section_body('critical-reflection', set())}
            </div>
        </section>

        <section id="appendices" class="section">
            <div class="section-divider"></div>
            <h2 class="part-title">Appendices</h2>

            <section id="appendix-a" class="subsection">
                <h3>Appendix A &middot; Comparative Data</h3>
                {self._render_comparative_table()}
            </section>

            <section id="appendix-b" class="subsection">
                <h3>Appendix B &middot; Glossary</h3>
                {self._render_glossary_appendix()}
            </section>

            <section id="appendix-c" class="subsection">
                <h3>Appendix C &middot; Source &amp; Further Reading</h3>
                <p>This synopsis is a digital humanities adaptation of the following work.
                    The interpretation, structuring and narrative framing are the project's
                    own; the underlying scholarship belongs to the authors.</p>
                <p class="reference">Dutton, D. G., Boyanowsky, E. O., &amp; Bond, M. H. (2005).
                    <em>Extreme mass homicide: From military massacre to genocide.</em>
                    Aggression and Violent Behavior, 10(4), 437&ndash;473.</p>
            </section>
        </section>
    </main>"""
        return body

    @staticmethod
    def _extract(front_matter, heading):
        """Pull the body under a `### {heading}` block from front-matter.md."""
        pattern = re.compile(
            r"^###\s+" + re.escape(heading) + r"\s*(.*?)(?=^###\s|\Z)",
            flags=re.DOTALL | re.MULTILINE,
        )
        m = pattern.search(front_matter)
        return m.group(1).strip() if m else ""

    def _render_data_script(self):
        """Inline the glossary + process-stage data so the page is fully
        interactive when opened directly from disk (file://), where fetch()
        of a sibling JSON file is blocked by the browser."""
        glossary_json = json.dumps(self.glossary, ensure_ascii=False)
        stages = {k: {"title": v[0], "description": v[1]}
                  for k, v in PROCESS_STAGE_DETAILS.items()}
        stages_json = json.dumps(stages, ensure_ascii=False)
        return (
            "    <script>\n"
            f"        window.ARES_GLOSSARY = {glossary_json};\n"
            f"        window.ARES_PROCESS_STAGES = {stages_json};\n"
            "    </script>"
        )

    def _render_document(self):
        nav = self._render_nav()
        body = self._render_body()
        data_script = self._render_data_script()
        generated = datetime.now().strftime("%Y-%m-%d")
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Interactive Digital Synopsis: The Human Story of Extreme Mass Homicide">
    <meta name="author" content="Project Ares">
    <meta name="generator" content="Ares unified_builder ({generated})">
    <title>The Human Story of Extreme Mass Homicide &middot; Digital Synopsis</title>
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%232C3E50'/%3E%3Ctext x='50' y='68' font-size='52' text-anchor='middle' fill='%23D4AF37' font-family='Georgia,serif'%3E%CE%91%3C/text%3E%3C/svg%3E">
    <link rel="stylesheet" href="stylesheet.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="main-header">
        <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
        <div class="nav-toggle" id="nav-toggle" role="button" tabindex="0" aria-label="Toggle table of contents">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <nav class="sticky-nav" id="sticky-nav">
{nav}
        </nav>
    </header>

{body}

    <aside class="side-panel" id="side-panel">
        <div class="side-panel-content">
            <button class="side-panel-close" id="side-panel-close" aria-label="Close panel">&times;</button>
            <h4>Key Concept</h4>
            <div class="concept-placeholder">
                <p class="concept-hint">Click any highlighted term to see its definition here.</p>
            </div>
        </div>
    </aside>

    <button class="back-to-top" id="back-to-top" aria-label="Back to top">&uarr;</button>

    <footer class="main-footer">
        <div class="footer-content">
            <p>Project Ares &middot; Digital Synopsis. Based on Dutton, Boyanowsky &amp; Bond (2005),
                <em>Extreme Mass Homicide: From Military Massacre to Genocide</em>.</p>
            <p class="footer-note">Presented for education and remembrance.</p>
        </div>
    </footer>

{data_script}
    <script src="script.js"></script>
</body>
</html>"""

    # -- entry points -------------------------------------------------------

    def build(self):
        try:
            document = self._render_document()
            self.output_file.write_text(document, encoding="utf-8")
            self._write_manifest()
            self.log("Build complete")
            self.log(f"Output: {self.output_file}")
            self.log(f"Sections: {len(SECTION_ORDER)}  Cases: {len(CASE_STUDIES)}  "
                     f"Glossary terms: {len(self.glossary)}")
            return True
        except Exception as exc:  # noqa: BLE001 - surface any build failure
            self.log(f"Build failed: {exc}", "ERROR")
            import traceback
            traceback.print_exc()
            return False

    def _write_manifest(self):
        manifest = {
            "generated": datetime.now().isoformat(),
            "output_file": str(self.output_file),
            "sections": SECTION_ORDER,
            "case_studies": [c["id"] for c in CASE_STUDIES],
            "glossary_terms": len(self.glossary),
        }
        (self.build_dir / "build-manifest.json").write_text(
            json.dumps(manifest, indent=2), encoding="utf-8"
        )

    def clean(self):
        artifacts = [
            "content-builder.js", "debug_test.py", "debug_vignette.py",
            "fix_vignettes.py", "inject_all_cases.py", "inject_front_matter.py",
            "content-manifest.json",
        ]
        removed = 0
        for name in artifacts:
            path = self.build_dir / name
            if path.exists():
                path.unlink()
                removed += 1
                self.log(f"Removed {name}")
        self.log(f"Cleaned {removed} artefact(s)" if removed else "No artefacts to clean")

    def watch_paths(self):
        return [self.sections_dir, self.cases_dir, self.data_dir]


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Project Ares unified content builder")
    parser.add_argument("--watch", action="store_true", help="rebuild on markdown changes")
    parser.add_argument("--clean", action="store_true", help="remove stale build artefacts first")
    parser.add_argument("--quiet", action="store_true", help="minimal logging")
    args = parser.parse_args()

    builder = SiteBuilder(quiet=args.quiet)
    if not args.quiet:
        print("Project Ares - Unified Content Builder")
        print("=" * 40)

    if args.clean:
        builder.clean()

    if not builder.build():
        sys.exit(1)

    if args.watch:
        if not HAS_WATCHDOG:
            builder.log("File watching requires the 'watchdog' package "
                        "(pip install watchdog)", "ERROR")
            sys.exit(1)

        class Handler(FileSystemEventHandler):
            def __init__(self):
                self.last = 0.0

            def on_modified(self, event):
                if event.is_directory or not str(event.src_path).endswith((".md", ".json")):
                    return
                now = time.time()
                if now - self.last < 1.5:
                    return
                self.last = now
                builder.log(f"Changed: {Path(event.src_path).name} — rebuilding")
                builder.build()

        observer = Observer()
        handler = Handler()
        for path in builder.watch_paths():
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
