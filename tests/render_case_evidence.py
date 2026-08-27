#!/usr/bin/env python3
"""Browser acceptance and screenshot evidence for Ares 2.0 Issue #9."""

import asyncio
import http.server
import os
import shutil
import socketserver
import threading
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT / "01-core"
OUT = ROOT / "artifacts" / "issue-9-rendered-evidence"

VIEWPORTS = [
    (390, 844, "phone"),
    (768, 1024, "tablet"),
    (1280, 800, "laptop-1280"),
    (1366, 768, "laptop-1366"),
    (1440, 900, "desktop"),
]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    os.chdir(CORE)
    server = socketserver.ThreadingTCPServer(("127.0.0.1", 0), QuietHandler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    chrome = (
        shutil.which("google-chrome")
        or shutil.which("chromium")
        or shutil.which("chromium-browser")
    )
    if not chrome:
        raise RuntimeError("Chromium/Chrome executable not found on runner")

    failures = []
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(executable_path=chrome, headless=True, args=["--no-sandbox"])
            for width, height, label in VIEWPORTS:
                page = await browser.new_page(viewport={"width": width, "height": height})
                await page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
                await page.route("https://fonts.gstatic.com/**", lambda route: route.abort())
                await page.goto(
                    f"http://127.0.0.1:{port}/index-with-content.html#nanking-massacre",
                    wait_until="domcontentloaded",
                )
                await page.locator("#nanking-massacre").scroll_into_view_if_needed()

                metrics = await page.evaluate(
                    """() => {
                        const chronology = document.querySelector('#nanking-massacre .case-chronology');
                        const firstEvent = chronology?.querySelector('li');
                        const table = document.querySelector('.case-comparison-table-wrap');
                        const stacked = document.querySelector('.case-comparison-stacked');
                        return {
                            viewport: innerWidth,
                            bodyOverflow: document.documentElement.scrollWidth - innerWidth,
                            chronologyWidth: chronology?.getBoundingClientRect().width || 0,
                            eventFont: firstEvent ? parseFloat(getComputedStyle(firstEvent.querySelector('.case-chronology-event')).fontSize) : 0,
                            tableDisplay: table ? getComputedStyle(table).display : 'missing',
                            stackedDisplay: stacked ? getComputedStyle(stacked).display : 'missing',
                            sourcePending: !!document.querySelector('#nanking-massacre .case-provenance-pending'),
                            semanticEvents: chronology?.querySelectorAll('li').length || 0,
                        };
                    }"""
                )

                if metrics["bodyOverflow"] > 2:
                    failures.append(f"{label}: page overflows viewport by {metrics['bodyOverflow']}px")
                if metrics["chronologyWidth"] <= 0 or metrics["chronologyWidth"] > width:
                    failures.append(f"{label}: chronology width is invalid ({metrics['chronologyWidth']})")
                if metrics["eventFont"] < 14:
                    failures.append(f"{label}: chronology event text is too small ({metrics['eventFont']}px)")
                if metrics["semanticEvents"] < 5:
                    failures.append(f"{label}: semantic chronology events missing")
                if not metrics["sourcePending"]:
                    failures.append(f"{label}: point-of-use provenance status missing")
                if width <= 700:
                    if metrics["tableDisplay"] != "none" or metrics["stackedDisplay"] == "none":
                        failures.append(f"{label}: phone comparison transformation is not active")
                else:
                    if metrics["tableDisplay"] == "none" or metrics["stackedDisplay"] != "none":
                        failures.append(f"{label}: desktop/tablet comparison table is not active")

                if label in {"phone", "tablet", "laptop-1366", "desktop"}:
                    await page.locator("#nanking-massacre").screenshot(path=OUT / f"nanking-{label}.png")
                await page.close()

            page = await browser.new_page(viewport={"width": 390, "height": 844})
            await page.goto(
                f"http://127.0.0.1:{port}/index-with-content.html#my-lai-massacre",
                wait_until="domcontentloaded",
            )
            await page.locator("#my-lai-massacre").scroll_into_view_if_needed()
            await page.locator("#my-lai-massacre").screenshot(path=OUT / "my-lai-phone.png")
            my_lai_events = await page.locator("#my-lai-massacre .case-chronology > li").count()
            if my_lai_events != 8:
                failures.append(f"my-lai-phone: expected 8 chronology events, found {my_lai_events}")
            await page.close()

            context = await browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 844})
            page = await context.new_page()
            await page.goto(
                f"http://127.0.0.1:{port}/index-with-content.html#armenian-genocide",
                wait_until="domcontentloaded",
            )
            if await page.locator("#armenian-genocide .case-chronology > li").count() == 0:
                failures.append("no-js: structured chronology is missing")
            if await page.locator("#armenian-genocide .case-evidence-quote").count() == 0:
                failures.append("no-js: quoted evidence is missing")
            if await page.locator(".case-comparison-stacked").count() == 0:
                failures.append("no-js: comparison fallback is missing")
            await context.close()
            await browser.close()
    finally:
        server.shutdown()
        server.server_close()

    if failures:
        raise SystemExit("\n".join(failures))
    print(f"Issue #9 browser acceptance passed across {len(VIEWPORTS)} viewports + no-JS mode")


if __name__ == "__main__":
    asyncio.run(main())
