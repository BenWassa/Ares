import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD_DIR = ROOT / "03-content" / "build"
if str(BUILD_DIR) not in sys.path:
    sys.path.insert(0, str(BUILD_DIR))

import case_study_builder  # noqa: E402


class CaseStudySourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload = json.loads((ROOT / "03-content" / "data" / "casestudies.json").read_text(encoding="utf-8"))
        cls.cases = cls.payload["cases"]
        cls.builder = case_study_builder.CaseStudySiteBuilder(quiet=True)

    def test_all_eight_cases_are_structured_and_chronological(self):
        self.assertEqual(len(self.cases), 8)
        self.assertEqual(len({case["id"] for case in self.cases}), 8)
        self.assertEqual(
            [case["sortKey"] for case in self.cases],
            sorted(case["sortKey"] for case in self.cases),
        )

    def test_structured_metadata_retains_integrity_status(self):
        for case in self.cases:
            with self.subTest(case=case["id"]):
                self.assertEqual(case["argumentRole"]["authorship"], "Ares synthesis")
                self.assertEqual(case["deathEstimate"]["provenanceClass"], "quantitative-estimate")
                self.assertEqual(case["deathEstimate"]["sourceStatus"], "requires-source-trace")
                self.assertEqual(case["classification"]["sourceStatus"], "requires-source-trace")
                self.assertEqual(case["evidence"]["sourceStatus"], "requires-source-trace")
                self.assertTrue(case["chronology"])
                self.assertTrue(all(item["sourceStatus"] == "requires-source-trace" for item in case["chronology"]))

    def test_markdown_relinquishes_chronology_authority(self):
        pattern = re.compile(
            r"^##\s+C\.\s+Chronology of Events\s*(.*?)(?=^##\s+D\.)",
            flags=re.MULTILINE | re.DOTALL,
        )
        for case in self.cases:
            path = ROOT / "03-content" / "case-studies" / f"{case['file']}.md"
            text = path.read_text(encoding="utf-8")
            match = pattern.search(text)
            self.assertIsNotNone(match, case["id"])
            residual = re.sub(r"<!--.*?-->", "", match.group(1), flags=re.DOTALL).strip()
            self.assertEqual(residual, "", case["id"])

    def test_case_render_uses_semantic_chronology_and_evidence_context(self):
        meta = self.builder.legacy_case_meta[0]
        rendered = self.builder._render_case(meta)
        self.assertIn('<ol class="case-chronology">', rendered)
        self.assertIn("Why this case is here", rendered)
        self.assertIn("Ares synthesis", rendered)
        self.assertIn('class="case-evidence-quote"', rendered)
        self.assertIn("Source trace pending Ares 2.0 provenance mapping.", rendered)
        self.assertNotIn("case-epigraph", rendered)
        self.assertNotIn("case-meta", rendered)

    def test_comparison_has_desktop_and_phone_static_forms(self):
        rendered = self.builder._render_comparative_table()
        self.assertIn('class="data-table case-comparison-table"', rendered)
        self.assertIn('class="case-comparison-stacked"', rendered)
        self.assertIn("This comparison is descriptive, not a ranking.", rendered)
        self.assertNotRegex(rendered.lower(), r"severity|score|ranked")
        for case in self.cases:
            self.assertIn(f'href="#{case["id"]}"', rendered)

    def test_rendered_case_order_matches_structured_source(self):
        self.assertEqual(
            [meta["id"] for meta in self.builder.legacy_case_meta],
            [case["id"] for case in self.cases],
        )


if __name__ == "__main__":
    unittest.main()
