"""Issue #7 integration contract for Ares 2.0 navigation.

Uses only the Python standard library so the checks can run in a clean clone.
The builder is rendered in memory; generated output is never rewritten.
"""

from html.parser import HTMLParser
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
BUILDER_PATH = ROOT / "03-content" / "build" / "unified_builder.py"
SCRIPT_PATH = ROOT / "01-core" / "script.js"
NAV_SCRIPT_PATH = ROOT / "01-core" / "navigation.js"
NAV_CSS_PATH = ROOT / "01-core" / "navigation.css"
WORKFLOW_PATH = ROOT / ".github" / "workflows" / "deploy-pages.yml"


class PublicationParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.nav_hashes = []
        self._nav_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "nav":
            self._nav_depth += 1
        if self._nav_depth and tag == "a":
            href = attrs.get("href", "")
            if href.startswith("#") and len(href) > 1:
                self.nav_hashes.append(href[1:])

    def handle_endtag(self, tag):
        if tag == "nav" and self._nav_depth:
            self._nav_depth -= 1


def render_publication():
    spec = importlib.util.spec_from_file_location("ares_builder", BUILDER_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module.SiteBuilder(quiet=True)._render_document()


class NavigationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = render_publication()
        cls.script = SCRIPT_PATH.read_text(encoding="utf-8")
        cls.nav_script = NAV_SCRIPT_PATH.read_text(encoding="utf-8")
        cls.css = NAV_CSS_PATH.read_text(encoding="utf-8")
        cls.workflow = WORKFLOW_PATH.read_text(encoding="utf-8")

    def test_all_navigation_hashes_resolve_to_unique_ids(self):
        parser = PublicationParser()
        parser.feed(self.html)
        self.assertEqual(len(parser.ids), len(set(parser.ids)), "duplicate durable HTML ids")
        missing = sorted(set(parser.nav_hashes) - set(parser.ids))
        self.assertEqual(missing, [], f"unresolved navigation anchors: {missing}")

    def test_overlay_uses_native_button_state_and_inert_hidden_navigation(self):
        self.assertIn("button.type = 'button'", self.nav_script)
        self.assertIn("aria-controls", self.nav_script)
        self.assertIn("aria-expanded", self.nav_script)
        self.assertIn("stickyNav.hidden = true", self.nav_script)
        self.assertIn("setNavInert(true)", self.nav_script)
        self.assertIn("event.key === 'Escape'", self.nav_script)

    def test_fragment_navigation_remains_native(self):
        self.assertIn("Do not preventDefault", self.nav_script)
        self.assertIn("if (!window.ARES_NAVIGATION_V2)", self.script)
        self.assertIn("script.src = 'navigation.js'", self.script)

    def test_laptop_breakpoint_and_no_js_fallback_are_explicit(self):
        self.assertIn("@media (min-width: 1180px)", self.css)
        self.assertIn("html:not(.js) .sticky-nav", self.css)
        self.assertIn("transform: none", self.css)
        self.assertIn("env(safe-area-inset-top", self.css)
        self.assertIn("min-height: 2.75rem", self.css)

    def test_deployment_bundles_navigation_styles(self):
        self.assertIn(
            "cat 01-core/stylesheet.css 01-core/navigation.css > _site/stylesheet.css",
            self.workflow,
        )
        self.assertIn("cp 01-core/script.js 01-core/navigation.js _site/", self.workflow)

    def test_redundant_back_to_top_is_not_interactive(self):
        self.assertIn("backToTop.hidden = true", self.nav_script)
        self.assertIn(".back-to-top", self.css)
        self.assertIn("display: none !important", self.css)


if __name__ == "__main__":
    unittest.main()
