import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import ts from "typescript";
import vm from "node:vm";
await mkdir(".lab-check", { recursive: true });
for (const name of ["lab-tools", "lab-design"]) {
  const source = await readFile(`lib/${name}.ts`, "utf8");
  const result = ts
    .transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    })
    .outputText.replace(/from ['"]\.\/lab-tools['"]/, "from './lab-tools.mjs'");
  await writeFile(`.lab-check/${name}.mjs`, result);
}
const {
  countWords,
  extractPalette,
  colourValue,
  arrangeCloud,
  renderCloudSVG,
  defaultCloud,
  defaultBook,
  styledFlipbookHTML,
} = await import("../.lab-check/lab-design.mjs");
assert.deepEqual(
  countWords("The café café notes notes notes and design", {
    excluded: "design",
  }),
  [
    { word: "notes", count: 3 },
    { word: "café", count: 2 },
  ],
);
assert.equal(countWords("नमस्ते नमस्ते")[0].count, 2);
assert.deepEqual(
  extractPalette(
    new Uint8ClampedArray([
      255, 255, 255, 255, 255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255, 0,
      255, 0, 0,
    ]),
  ),
  [
    { hex: "#ff0000", percent: 67 },
    { hex: "#0000ff", percent: 33 },
  ],
);
assert.equal(colourValue("#ff0000", "HSL"), "hsl(0, 100%, 50%)");
const words = countWords(
  "creative creative creative ideas ideas stories stories paper colour studio inspiration imagination playful reading moments",
);
for (const shape of ["rectangle", "circle", "heart"]) {
  const settings = { ...defaultCloud, shape };
  const placed = arrangeCloud(words, settings);
  assert(placed.length >= 5);
  assert.deepEqual(placed, arrangeCloud(words, settings));
  assert.notDeepEqual(placed, arrangeCloud(words, { ...settings, seed: 1 }));
  const boxes = placed.map((w) => ({
    x: w.x - (w.word.length * w.size * 0.65) / 2,
    y: w.y - (w.size * 1.22) / 2,
    w: w.word.length * w.size * 0.65,
    h: w.size * 1.22,
  }));
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i],
        b = boxes[j];
      assert(
        !(
          a.x < b.x + b.w &&
          a.x + a.w > b.x &&
          a.y < b.y + b.h &&
          a.y + a.h > b.y
        ),
        "cloud words overlap",
      );
    }
}
const svg = renderCloudSVG(
  [
    {
      word: "<script>&",
      count: 1,
      x: 50,
      y: 50,
      size: 20,
      rotate: false,
      colour: "#263247",
    },
  ],
  { ...defaultCloud, transparent: true },
);
assert(!svg.includes("<script>"));
assert(!svg.includes("<rect"));
assert(svg.includes("&lt;script&gt;&amp;"));
const images = [
  "data:image/jpeg;base64,QQ==",
  "data:image/jpeg;base64,Qg==",
  "data:image/jpeg;base64,Qw==",
];
const html = styledFlipbookHTML(images, {
  ...defaultBook,
  layout: "spread",
  background: "#d9eee5",
});
assert.throws(() => styledFlipbookHTML(["</script>"], defaultBook));
assert(html.includes("prefers-reduced-motion"));
assert(html.includes("#d9eee5"));
const elements = Object.fromEntries(
  ["book", "first", "second", "prev", "next", "count", "view", "full", "sound"].map(
    (id) => [
      id,
      {
        style: {setProperty(){},removeProperty(){}},
        setPointerCapture(){},hasPointerCapture(){return true},releasePointerCapture(){},
        classList: { toggle() {}, add(){}, remove(){} },
        click() {
          if (!this.disabled) this.onclick?.();
        },
      },
    ],
  ),
);
const document = {
  getElementById: (id) => elements[id],
  documentElement: {},
  fullscreenElement: null,
};
vm.runInNewContext(html.match(/<script>([\s\S]*)<\/script>/)[1], {
  document,
  window: {},
  innerWidth: 1200,
});
assert.equal(elements.first.src, images[0]);
assert.equal(elements.second.src, images[1]);
assert(elements.prev.disabled);
elements.next.click();
assert.equal(elements.first.src, images[2]);
assert(elements.next.disabled);
elements.prev.click();
assert.equal(elements.first.src, images[0]);
elements.view.value = "single";
elements.view.onchange();
elements.next.click();
assert.equal(elements.first.src, images[1]);
const pointer=(x,y=0)=>({clientX:x,clientY:y,pointerId:1,isPrimary:true,button:0,target:{tagName:'IMG'}});
elements.book.onpointerdown(pointer(200));
elements.book.onpointermove(pointer(90));
elements.book.onpointerup(pointer(90));
assert.equal(elements.first.src,images[2]);
elements.book.onpointerdown(pointer(90));
elements.book.onpointerup(pointer(200));
assert.equal(elements.first.src,images[1]);
elements.book.onpointerdown(pointer(200));
elements.book.onpointerup(pointer(185));
assert.equal(elements.first.src,images[1]);
elements.book.onpointerdown(pointer(200));
elements.book.onpointercancel();
elements.book.onpointerup(pointer(80));
assert.equal(elements.first.src,images[1]);
elements.book.onpointerdown(pointer(200));
elements.book.onpointerup(pointer(120,180));
assert.equal(elements.first.src,images[1]);
console.log(
  "PASS: Unicode counts, exclusions, palette filtering and ratios, colour formats, deterministic non-overlapping cloud shapes, SVG escaping/transparency, offline book navigation and validation.",
);
