#!/usr/bin/env python3
"""Focused Issue #10 build/data contract checks using only the standard library."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROCESS_PATH = ROOT / "03-content" / "data" / "process.json"
GLOSSARY_PATH = ROOT / "03-content" / "data" / "glossary.json"
OUTPUT_PATH = ROOT / "01-core" / "index-with-content.html"
MAP_DECISION_PATH = ROOT / "03-content" / "maps" / "README.md"
PROCESS_MD_PATH = ROOT / "03-content" / "sections" / "process-model.md"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    process = json.loads(PROCESS_PATH.read_text(encoding="utf-8"))
    glossary = json.loads(GLOSSARY_PATH.read_text(encoding="utf-8"))["glossary"]

    require(process["editorialStatus"] == "source-reviewed", "process must be source-reviewed")
    require("Ares synthesis" in process["authorshipLabel"], "process authorship must be explicit")
    require(process["rendering"]["sequential"] is False, "process must be non-sequential")
    require(
        process["rendering"]["structure"] == "grouped-interacting-domains",
        "process must use grouped interacting domains",
    )
    require(len(process["domains"]) == 4, "reviewed synthesis should contain four grouped domains")

    source_ids = set(process["sourceMap"])
    domain_ids = {domain["id"] for domain in process["domains"]}
    require(set(process["basisSourceIds"]).issubset(source_ids), "basis source must resolve")
    require(len(domain_ids) == len(process["domains"]), "domain IDs must be unique")

    for domain in process["domains"]:
        require(domain["sourceMappings"], f"{domain['id']} must be source-mapped")
        for mapping in domain["sourceMappings"]:
            require(mapping["sourceId"] in source_ids, f"unknown source {mapping['sourceId']}")
        for term_id in domain["glossaryTermIds"]:
            require(term_id in glossary, f"unknown glossary term {term_id}")

    relationship_ids = set()
    for relationship in process["relationships"]:
        require(relationship["id"] not in relationship_ids, "relationship IDs must be unique")
        relationship_ids.add(relationship["id"])
        require(relationship["from"] in domain_ids, "relationship source domain must resolve")
        require(relationship["to"] in domain_ids, "relationship target domain must resolve")
        require(relationship["sourceMappings"], "relationships must be source-mapped")

    process_source = PROCESS_PATH.read_text(encoding="utf-8")
    require('"stages"' not in process_source, "process.json must not contain a stages collection")
    require('"stage"' not in process_source, "process.json must not contain stage fields")

    process_md = PROCESS_MD_PATH.read_text(encoding="utf-8")
    for legacy_claim in ("Stage 1:", "Stage 2:", "Escalation Ladder", "integrated process model proposes"):
        require(legacy_claim not in process_md, f"legacy process claim remains in process-model.md: {legacy_claim}")

    require("fixed six- or eight-stage model" in glossary["escalation"]["extendedDefinition"], "escalation glossary correction missing")
    require("does not establish denial as the final stage" in glossary["denial"]["extendedDefinition"], "denial glossary correction missing")
    require("long-term shaping" in glossary["situationalTransition"]["extendedDefinition"], "transition glossary correction missing")

    map_decision = MAP_DECISION_PATH.read_text(encoding="utf-8")
    require("defer interactive maps" in map_decision.lower(), "map decision must explicitly defer maps")

    result = subprocess.run(
        [sys.executable, str(ROOT / "build.py"), "--quiet"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode:
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        raise AssertionError("python build.py --quiet failed")

    html = OUTPUT_PATH.read_text(encoding="utf-8")
    require("window.ARES_PROCESS =" in html, "structured process data must be serialized")
    require("ARES_PROCESS_STAGES" not in html, "legacy stage data leaked into output")
    require("process-model-svg" not in html, "legacy process SVG leaked into output")
    require("Ares synthesis — not a stage model" in html, "reader-facing authorship label missing")
    require("How the domains can interact" in html, "relationship explanation missing")
    require("process-relationship-source-list" in html, "relationship source mappings missing")
    require("process-related-concepts" in html, "process glossary cross-links missing")
    require("Limits of the synthesis" in html, "process limits missing")
    require('id="ref-src-dutton-2005"' in html, "stable Dutton reference target missing")

    part_iv_match = re.search(r'<section id="part-iv".*?</section>\s*<section id="part-v"', html, re.DOTALL)
    require(part_iv_match is not None, "Part IV not found in generated output")
    part_iv = part_iv_match.group(0)
    for legacy_label in (
        "Political Grievance Framing",
        "Propaganda &amp; Fear Inculcation",
        "Decision Node",
        "Mass Atrocity Execution",
        ">Discrimination<",
        ">Preparation<",
        ">Persecution<",
        ">Extermination<",
    ):
        require(legacy_label not in part_iv, f"legacy process taxonomy leaked into Part IV: {legacy_label}")

    for domain_id in domain_ids:
        require(f'id="process-domain-{domain_id}"' in html, f"missing rendered domain {domain_id}")

    require('<dialog class="glossary-dialog" id="glossary-dialog"' in html, "glossary dialog missing")
    require('class="side-panel" id="side-panel"' not in html, "legacy glossary side panel remains")
    require("glossary-tooltip" not in html, "legacy glossary tooltip markup should not be generated")

    cue_targets = set(re.findall(r'class="glossary-cue"[^>]+href="#(glossary-[^"]+)"', html))
    require(cue_targets, "no glossary cues were rendered")
    entry_targets = set(re.findall(r'<dt id="(glossary-[^"]+)"', html))
    require(cue_targets.issubset(entry_targets), "every glossary cue must resolve to a static glossary entry")

    print(
        "Issue #10 contract checks passed: "
        f"{len(process['domains'])} process domains, "
        f"{len(process['relationships'])} relationships, "
        f"{len(cue_targets)} glossary targets."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
