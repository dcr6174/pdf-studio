#!/usr/bin/env python3
"""100-game browser-emulation smoke audit (not physical iOS/Android testing).

Discovers active slugs from the five real TypeScript catalogues, excluding
retired games via arcade-active.ts. Visits every live game with Chromium mobile
emulation, attempts its start action, verifies primary UI and overflow, captures
JavaScript errors and collects screenshots for failures.

Usage:
  python checks/mobile-catalog-qa.py --base https://pdf-studio.in
  python checks/mobile-catalog-qa.py --base http://localhost:5173 --max-games 5
"""
import argparse
import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from playwright.async_api import async_playwright

CATALOG_FILES = [
    "lib/arcade-catalog.ts",
    "lib/puzzle-catalog.ts",
    "lib/club-catalog.ts",
    "lib/fresh-catalog.ts",
    "lib/expansion-catalog.ts",
]
SLUG_RE = re.compile(r"""["']?slug["']?\s*:\s*["']([^"']+)["']""")
TOKEN_RE = re.compile(r"""["']([^"']+)["']""")
CORE_REQUIRED = 100


def active_slugs(root: Path) -> list[str]:
    """Read the repo's actual declared games; do not hard-code a partial list."""
    files = []
    for name in CATALOG_FILES:
        path = root / name
        if not path.is_file():
            raise FileNotFoundError(f"Catalogue missing: {path}")
        files.extend(SLUG_RE.findall(path.read_text(encoding="utf-8")))
    active_file = (root / "lib/arcade-active.ts").read_text(encoding="utf-8")
    match = re.search(r"retiredArcadeSlugs\s*=\s*\[(.*?)\]\s*as const", active_file, re.S)
    if not match:
        raise ValueError("Unable to locate retiredArcadeSlugs: fail instead of testing wrong titles")
    retired = set(TOKEN_RE.findall(match.group(1)))
    active = [slug for slug in files if slug not in retired]
    if len(active) != CORE_REQUIRED or len(set(active)) != CORE_REQUIRED:
        raise AssertionError(f"Expected exactly {CORE_REQUIRED} unique active games; got "
                             f"{len(active)} entries and {len(set(active))} unique")
    return active


async def test_game(browser, base, slug, output, semaphore, viewport, capture_all):
    async with semaphore:
        width, height = viewport
        entry = {"game": slug, "viewport": f"{width}x{height}", "passed": False,
                 "checks": {}, "error": None, "screenshot": None}
        context = await browser.new_context(
            viewport={"width": width, "height": height},
            device_scale_factor=1,
            is_mobile=True,
            has_touch=True,
            reduced_motion="reduce",
        )
        page = await context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        try:
            response = await page.goto(
                f"{base.rstrip('/')}/lab/arcade/{slug}",
                wait_until="domcontentloaded", timeout=28000)
            if response is None or response.status >= 400:
                raise AssertionError(f"HTTP {response.status if response else 'no response'}")
            await page.locator("main").first.wait_for(state="visible", timeout=15000)
            heading = page.locator("h1").first
            if await heading.count() == 0 or not await heading.is_visible():
                raise AssertionError("No visible game title")
            title = (await heading.inner_text()).strip()
            if not title:
                raise AssertionError("Blank game title")
            entry["checks"]["title"] = title

            # New game family has a start curtain. Older games may start
            # immediately and must not be failed because no curtain exists.
            play = page.get_by_role("button", name="Play now", exact=False)
            if await play.count() > 0 and await play.first.is_visible():
                await play.first.click(timeout=5000)
                entry["checks"]["start_clicked"] = True
                await page.wait_for_timeout(250)
            else:
                entry["checks"]["start_clicked"] = False

            visible_controls = await page.locator("main button:visible, main [role=button]:visible").count()
            entry["checks"]["controls"] = visible_controls
            if visible_controls < 1:
                raise AssertionError("No visible game controls after opening")
            viewport_data = await page.evaluate("""() => ({
                outerWidth: window.innerWidth,
                scrollWidth: document.documentElement.scrollWidth,
                height: window.innerHeight,
                bodyTextLength: document.body.innerText.length,
                viewportScale: window.visualViewport ? window.visualViewport.scale : 1
            })""")
            entry["checks"]["layout"] = viewport_data
            if viewport_data["scrollWidth"] > viewport_data["outerWidth"] + 3:
                raise AssertionError(
                    f"Horizontal viewport overflow: {viewport_data['scrollWidth'] - viewport_data['outerWidth']}px")
            if viewport_data["bodyTextLength"] < 45:
                raise AssertionError("Game page is nearly blank")
            if errors:
                raise AssertionError("Uncaught JavaScript errors: " + "; ".join(errors[:3]))
            entry["passed"] = True
        except Exception as error:
            entry["error"] = str(error)
        finally:
            if capture_all or not entry["passed"]:
                file = f"{slug}-{width}x{height}.jpg"
                try:
                    await page.screenshot(path=str(output / file), full_page=True,
                                          type="jpeg", quality=65, timeout=12000)
                    entry["screenshot"] = file
                except Exception as error:
                    entry["screenshot_error"] = str(error)
            await context.close()
        return entry


async def main(args):
    root = Path(__file__).resolve().parents[1]
    slugs = active_slugs(root)
    if args.catalog_only:
        print(json.dumps({"count": len(slugs), "games": slugs}, indent=2))
        return 0
    if args.max_games is not None:
        slugs = slugs[:args.max_games]
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    semaphore = asyncio.Semaphore(args.concurrency)
    async with async_playwright() as tool:
        browser = await tool.chromium.launch(headless=True)
        try:
            tasks = [test_game(browser, args.base, slug, output, semaphore,
                               (args.width, args.height), args.screenshots == "all")
                     for slug in slugs]
            results = await asyncio.gather(*tasks)
        finally:
            await browser.close()
    failures = [result for result in results if not result["passed"]]
    report = {
        "date_utc": datetime.now(timezone.utc).isoformat(),
        "base_url": args.base,
        "expected_active_titles": CORE_REQUIRED,
        "tested_titles": len(results),
        "passed": len(results) - len(failures),
        "failed": len(failures),
        "viewport": f"{args.width}x{args.height}",
        "limitations": [
            "Chromium responsive emulation, not physical iOS/Android devices.",
            "Opening and starting game pages does not certify end-of-game rules or full playthroughs.",
            "Main title/buttons, JS errors and horizontal overflow are smoke checks, not accessibility certification.",
        ],
        "results": results,
    }
    (output / "catalog-audit.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    (output / "failures.txt").write_text(
        "\n".join(f"{x['game']}: {x['error']}" for x in failures), encoding="utf-8")
    print(f"RESULT: {len(results) - len(failures)}/{len(results)} live games passed")
    for item in failures:
        print(f"FAIL {item['game']}: {item['error']}")
    return 0 if not failures else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://pdf-studio.in")
    parser.add_argument("--output", default="play-studio-mobile-qa")
    parser.add_argument("--width", type=int, default=390)
    parser.add_argument("--height", type=int, default=844)
    parser.add_argument("--max-games", type=int)
    parser.add_argument("--concurrency", type=int, default=3)
    parser.add_argument("--catalog-only", action="store_true")
    parser.add_argument("--screenshots", choices=("failures", "all"), default="failures")
    settings = parser.parse_args()
    if settings.max_games is not None and settings.max_games <= 0:
        parser.error("--max-games must be positive")
    if not 1 <= settings.concurrency <= 8:
        parser.error("--concurrency must be 1..8")
    raise SystemExit(asyncio.run(main(settings)))
