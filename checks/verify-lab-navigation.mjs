/** Real React navigation/search interactions in a simulated DOM; no device-layout claims. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { build } from "vite";
import { Window } from "happy-dom";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const window = new Window({ url: "https://pdf-studio.in/lab" });
for (const k of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLInputElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
])
  Object.defineProperty(globalThis, k, {
    configurable: true,
    value: k === "window" ? window : window[k],
  });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
await build({
  configFile: false,
  logLevel: "error",
  resolve: { alias: { "@": process.cwd() } },
  build: {
    ssr: true,
    outDir: ".lab-navigation-check",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        directory: resolve("components/lab-directory.tsx"),
        creative: resolve("components/creative-directory.tsx"),
        navigation: resolve("components/studio-navigation.tsx"),
        showcase: resolve("components/lab-showcase.tsx"),
        data: resolve("lib/lab-studios.ts"),
        images: resolve("lib/image-tools.ts"),
        games: resolve("lib/arcade-active.ts"),
      },
      output: { entryFileNames: "[name].mjs" },
      external: ["react", "react-dom", "react-dom/client", "react-dom/server"],
    },
  },
});
process.env.NODE_ENV = "development";
const load = (n) =>
  import(pathToFileURL(resolve(".lab-navigation-check/" + n + ".mjs")).href);
const [
  { LabDirectory },
  { CreativeDirectory },
  { StudioNavigation },
  { LabShowcase },
  data,
  { imageTools },
  { activeArcadeGames },
] = await Promise.all(
  [
    "directory",
    "creative",
    "navigation",
    "showcase",
    "data",
    "images",
    "games",
  ].map(load),
);
const { createElement, act } = await import("react"),
  { createRoot } = await import("react-dom/client"),
  { renderToStaticMarkup } = await import("react-dom/server");
assert.equal(
  new Set(data.labEntries.map((e) => e.href)).size,
  data.labEntries.length,
  "one destination per result",
);
for (const t of imageTools)
  assert(
    data.labEntries.some(
      (e) => e.href === "/lab/" + t.slug && e.studio === "images",
    ),
  );
for (const g of activeArcadeGames)
  assert(
    data.labEntries.some(
      (e) => e.href === "/lab/arcade/" + g.slug && e.kind === "game",
    ),
  );
for (const t of data.creativeTools)
  assert(
    data.labEntries.some(
      (e) => e.href === "/lab/" + t.slug && e.studio === "creative",
    ),
  );
assert(
  data
    .findLabEntries("smaller photo")
    .some((e) => e.href === "/lab/image-compressor"),
);
assert(
  data
    .findLabEntries("cricket")
    .some((e) => e.href === "/lab/arcade/boundary-cricket"),
);
assert(data.findLabEntries("flashcards").some((e) => e.studio === "creative"));
assert(
  data.findLabEntries("game studio").some((e) => e.href === "/lab/arcade"),
  "old name finds the single Arcade destination",
);
for (const studio of data.studioLinks) {
  const html = renderToStaticMarkup(
    createElement(StudioNavigation, { active: studio.id }),
  );
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  for (const s of data.studioLinks)
    assert(html.includes('href="' + s.href + '"'));
}
const showcase = renderToStaticMarkup(createElement(LabShowcase));
assert.equal((showcase.match(/class="lab-world-card"/g) || []).length, 3);
assert(showcase.includes('href="/lab/creative-studio"'));
assert(!showcase.includes('href="#lab-creative-tools"'));
assert(
  !showcase.includes("Play Studio") && !showcase.includes("Create Studio"),
);
const routeSource = await readFile("app/lab/[slug]/page.tsx", "utf8");
assert(
  routeSource.includes("generateStaticParams"),
  "existing dynamic tool routes retained",
);
const host = document.createElement("div");
document.body.append(host);
let root = createRoot(host);
const click = async (e) => {
  assert(e);
  await act(async () => e.click());
};
const type = async (e, value) => {
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set.call(e, value);
    e.dispatchEvent(new window.Event("input", { bubbles: true }));
  });
};
const key = async (e, k) => {
  await act(async () =>
    e.dispatchEvent(
      new window.KeyboardEvent("keydown", {
        key: k,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
};
const button = (text) =>
  [...host.querySelectorAll("button")].find(
    (e) => e.textContent.trim() === text,
  );
let navigated;
host.addEventListener("click", (e) => {
  const a = e.target.closest?.("a");
  if (a) {
    e.preventDefault();
    navigated = a.getAttribute("href");
  }
});
try {
  await act(async () =>
    root.render(createElement(LabDirectory, null, createElement(LabShowcase))),
  );
  assert.equal(
    host.querySelectorAll(".lab-world-card").length,
    3,
    "three visible destinations at start",
  );
  const input = host.querySelector("input[role=combobox]");
  await act(async () => input.focus());
  assert.equal(input.getAttribute("aria-expanded"), "true");
  await type(input, "cricket");
  assert.equal(
    host.querySelectorAll(".lab-world-card").length,
    0,
    "search replaces the hub instead of competing with it",
  );
  await key(input, "ArrowDown");
  const selected = host.querySelector("[role=option][aria-selected=true]");
  assert(selected);
  assert.equal(input.getAttribute("aria-activedescendant"), selected.id);
  await key(input, "Enter");
  assert.equal(navigated, "/lab/arcade/boundary-cricket");
  await key(input, "Escape");
  assert.equal(input.getAttribute("aria-expanded"), "false");
  await click(button("Images"));
  assert(host.textContent.includes("No matches for"));
  assert(!host.querySelector(".lab-search-result"));
  await click(host.querySelector('[aria-label="Clear search"]'));
  assert.equal(input.value, "");
  assert.equal(host.querySelectorAll(".lab-world-card").length, 3);
  assert.equal(document.activeElement, input);
  await type(input, "zzzz-no-such-tool");
  await key(input, "ArrowDown");
  assert.equal(
    input.getAttribute("aria-activedescendant"),
    null,
    "empty suggestions never reference a nonexistent option",
  );
  await click(button("Browse the studios"));
  assert.equal(host.querySelectorAll(".lab-world-card").length, 3);
  await act(async () => root.unmount());
  root = createRoot(host);
  await act(async () => root.render(createElement(CreativeDirectory)));
  const search = host.querySelector("input");
  await type(search, "flashcards");
  assert.equal(
    host.querySelectorAll(".creative-tool-grid a").length,
    2,
    "practice deck and printable export remain distinct",
  );
  await type(search, "");
  await click(button("Draw & write"));
  assert.equal(host.querySelectorAll(".creative-tool-grid a").length, 4);
  assert(host.querySelector('a[href="/lab/daily-mood-canvas"]'));
  assert(!host.querySelector('a[href="/lab/image-crop"]'));
  await type(search, "no-such-tool");
  assert(host.textContent.includes("No creative tools found"));
  await click(button("Show all creative tools"));
  assert.equal(
    host.querySelectorAll(".creative-tool-grid a").length,
    data.creativeTools.length,
  );
  console.log(
    "PASS: all image/game/creative destinations preserved, consistent active studio navigation, real Creative Studio route, cross-studio search, keyboard suggestions/Enter/Escape, empty states, clear/focus return and creative-category isolation. Simulated DOM; responsive browser checks remain separate.",
  );
} finally {
  await act(async () => root.unmount());
  await window.happyDOM.close();
}
