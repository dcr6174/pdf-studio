#!/usr/bin/env python3
"""Mobile Play Studio exploratory smoke test. Requires: pip install playwright; playwright install chromium.

Usage: python checks/mobile-play-studio.py --base http://localhost:5173
       python checks/mobile-play-studio.py --base https://pdf-studio.in

This is real Chromium emulation, NOT certification of iOS/Android hardware.
Produces screenshots and JSON including failures. Exit 1 if any check fails.
"""
import argparse
import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from playwright.async_api import async_playwright

SIZES=[(320,568),(360,740),(390,844),(768,1024),(1280,800)]
GAMES=[
 ("boundary-cricket",".pc-stage-wrap"),
 ("untangle-lines",".untangle-board"),
 ("shape-packing",".packing-board"),
 ("one-line-draw",".one-line-board"),
]

async def run_case(browser,base,width,height,slug,selector,out):
    name=f"{slug}-{width}x{height}"
    result={"game":slug,"viewport":{"width":width,"height":height},"ok":False,"checks":{},"error":None}
    context=await browser.new_context(viewport={"width":width,"height":height},device_scale_factor=1,
                                      is_mobile=width<700,has_touch=width<700)
    page=await context.new_page()
    errors=[]
    page.on("pageerror",lambda error:errors.append(str(error)))
    try:
        response=await page.goto(f"{base.rstrip('/')}/lab/arcade/{slug}",wait_until="domcontentloaded",timeout=30000)
        if response is None or response.status>=400:
            raise RuntimeError(f"HTTP {response.status if response else 'no response'}")
        await page.wait_for_timeout(1200)
        play=page.get_by_role("button",name="Play now")
        if await play.count() and await play.first.is_visible():
            await play.first.click()
        await page.locator(selector).wait_for(state="visible",timeout=15000)
        scroll=await page.evaluate("""() => ({scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth-window.innerWidth})""")
        result["checks"]["horizontal_overflow"]=scroll
        if scroll["overflow"]>2:
            raise AssertionError(f"horizontal overflow {scroll['overflow']}px")
        stage=page.locator(selector)
        result["checks"]["stage_box"]=await stage.bounding_box()
        if slug=="boundary-cricket":
            start=page.locator(".pc-start")
            if await start.count():
                await start.click()
                await page.locator(".pc-mobile-pad button, .pc-bat-buttons button").first.wait_for(timeout=6000)
            if width<700:
                button=page.locator(".pc-mobile-pad button").first
                await button.wait_for(state="visible",timeout=7000)
                box=await button.bounding_box()
                result["checks"]["bat_pad"]=box
                if not box or box["y"]+box["height"]>height+5:
                    raise AssertionError("Mobile batting button extends beyond viewport")
        elif slug=="untangle-lines":
            before=await page.locator(".spatial-scoreline").inner_text()
            knot=page.locator(".untangle-board g[role=button]").first
            rect=await knot.bounding_box()
            await page.mouse.move(rect["x"]+rect["width"]/2,rect["y"]+rect["height"]/2)
            await page.mouse.down()
            await page.mouse.move(rect["x"]+rect["width"]/2+36,rect["y"]+rect["height"]/2+22,steps=7)
            await page.mouse.up()
            after=await page.locator(".spatial-scoreline").inner_text()
            result["checks"]["drag_moves_counter_changed"]=before!=after
            if before==after:
                raise AssertionError("Drag did not update puzzle move count")
        elif slug=="one-line-draw":
            dots=page.locator(".one-line-board g[role=button]")
            if await dots.count()<5:raise AssertionError("Graph has too few nodes")
            await dots.nth(1).click()
            result["checks"]["graph_status"]=(await page.locator(".spatial-progress").inner_text())[:140]
        elif slug=="shape-packing":
            pieces=page.locator(".packing-piece")
            if await pieces.count()!=5:
                raise AssertionError("Expected five draggable pieces")
            # Exercise piece selection, rotation and board tap, repeating rotation if required.
            await pieces.first.click()
            rotate=page.get_by_role("button",name="Rotate selected",exact=False)
            if await rotate.count():await rotate.click()
            result["checks"]["pieces"]=await pieces.count()
            board=await stage.bounding_box()
            await page.mouse.click(board["x"]+board["width"]*.17,board["y"]+board["height"]*.17)
            result["checks"]["status"]=(await page.locator(".spatial-progress").inner_text())[:150]
        result["checks"]["js_errors"]=errors
        if errors:raise AssertionError("JavaScript errors: "+"; ".join(errors[:3]))
        result["ok"]=True
    except Exception as e:
        result["error"]=str(e)
    finally:
        try:
            await page.screenshot(path=str(out/f"{name}.png"),full_page=True,timeout=10000)
            result["screenshot"]=f"{name}.png"
        except Exception as e:
            result["screenshot_error"]=str(e)
        await context.close()
    return result

async def main(args):
    out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
    results=[]
    async with async_playwright() as playwright:
        browser=await playwright.chromium.launch(headless=True)
        for width,height in SIZES:
            for slug,selector in GAMES:
                case=await run_case(browser,args.base,width,height,slug,selector,out)
                results.append(case)
                print(("PASS" if case["ok"] else "FAIL"),slug,f"{width}x{height}",case["error"] or "")
        await browser.close()
    summary={"at":datetime.now(timezone.utc).isoformat(),"base":args.base,
             "disclaimer":"Chromium emulation is not a substitute for physical Android/iOS testing.",
             "passed":sum(1 for x in results if x["ok"]),"total":len(results),"results":results}
    (out/"mobile-audit.json").write_text(json.dumps(summary,indent=2),encoding="utf-8")
    return 1 if summary["passed"]!=summary["total"] else 0

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--base",default="https://pdf-studio.in")
    parser.add_argument("--output",default="play-studio-mobile-qa")
    raise SystemExit(asyncio.run(main(parser.parse_args())))
