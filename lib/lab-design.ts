import { escapeXML, type Experiment } from "./lab-tools";

export const colourThemes = [
  {
    name: "Violet & Mint",
    colours: ["#6846db", "#238978", "#c05873", "#386baf", "#9d65cc"],
    background: "#f8f5ff",
  },
  {
    name: "Sunset",
    colours: ["#ad3e65", "#d96a3d", "#854b9d", "#a66c12", "#bc4162"],
    background: "#fff7ee",
  },
  {
    name: "Ocean",
    colours: ["#285b9c", "#167d93", "#5069ba", "#267875", "#4e459c"],
    background: "#f0f9ff",
  },
  {
    name: "Forest",
    colours: ["#2c6c4b", "#517c34", "#927032", "#356d69", "#705a44"],
    background: "#f4f9f0",
  },
  {
    name: "Ink",
    colours: ["#202b3b", "#48556a", "#657084", "#33465d", "#526077"],
    background: "#f5f6f8",
  },
  {
    name: "Candy",
    colours: ["#ae3883", "#774ac1", "#236f9b", "#b04f35", "#317a68"],
    background: "#fff3fa",
  },
] as const;
export const bookThemes = [
  { name: "Paper", colour: "#eee4d5" },
  { name: "Lavender", colour: "#eae2ff" },
  { name: "Mint", colour: "#d9eee5" },
  { name: "Peach", colour: "#ffe4d3" },
  { name: "Midnight", colour: "#242b42" },
];
export const examples: Record<
  Extract<Experiment, "flipbook" | "word-cloud" | "page-palette">,
  { eyebrow: string; hint: string }
> = {
  flipbook: {
    eyebrow: "A new way to read",
    hint: "Give your document a beautiful reading space.",
  },
  "word-cloud": {
    eyebrow: "Find the words that matter",
    hint: "Turn document text into a colourful, downloadable visual.",
  },
  "page-palette": {
    eyebrow: "Find your next colour story",
    hint: "Explore a page, collect its colours and make them yours.",
  },
};
export const demoText =
  "creative creative creative creative creative ideas ideas ideas ideas stories stories stories design design design explore explore explore paper paper colour colour notes notes reading reading playful playful studio studio imagination inspiration curiosity discover moments";
const stop = new Set(
  "a an and are as at be been but by can for from had has have he her his i if in into is it its me my no not of on or our she so that the their them there they this to was we were will with you your".split(
    " ",
  ),
);
export function countWords(
  text: string,
  { omitCommon = true, minLength = 2, excluded = "" } = {},
) {
  const excludedWords = new Set(
    excluded
      .toLocaleLowerCase()
      .split(/[\s,;]+/u)
      .filter(Boolean),
  );
  const counts = new Map<string, number>();
  for (const raw of text
    .toLocaleLowerCase()
    .match(/[\p{L}\p{M}][\p{L}\p{M}\p{N}'’-]*/gu) ?? []) {
    const word = raw.replace(/^['’-]+|['’-]+$/g, "");
    if (
      [...word].length < minLength ||
      excludedWords.has(word) ||
      (omitCommon && stop.has(word))
    )
      continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}
export type CloudSettings = {
  theme: number;
  maxWords: number;
  shape: "rectangle" | "circle" | "heart";
  mixed: boolean;
  seed: number;
  font: "sans-serif" | "serif" | "monospace";
  transparent: boolean;
  density: number;
};
export const defaultCloud: CloudSettings = {
  theme: 0,
  maxWords: 40,
  shape: "rectangle",
  mixed: false,
  seed: 0,
  font: "sans-serif",
  transparent: false,
  density: 4,
};
export type CloudWord = {
  word: string;
  count: number;
  x: number;
  y: number;
  size: number;
  rotate: boolean;
  colour: string;
};
function random(seed: number) {
  let v = seed | 0;
  return () => {
    v = Math.imul(v ^ (v >>> 16), 0x45d9f3b);
    v = Math.imul(v ^ (v >>> 16), 0x45d9f3b);
    return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
  };
}
export function arrangeCloud(
  words: { word: string; count: number }[],
  settings: CloudSettings,
  measure?: (word: string, size: number, font: string) => number,
) {
  const placed: CloudWord[] = [];
  const boxes: { x: number; y: number; w: number; h: number }[] = [];
  const rng = random(settings.seed + 701);
  const top = words[0]?.count || 1;
  function inside(x: number, y: number) {
    const nx = (x - 500) / 455,
      ny = (y - 350) / 305;
    if (settings.shape === "rectangle")
      return Math.abs(nx) < 1 && Math.abs(ny) < 1;
    if (settings.shape === "circle") return nx * nx + ny * ny < 1;
    const hy = -ny * 1.15,
      hx = nx * 1.15;
    return Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * hy * hy * hy < 0;
  }
  for (const item of words.slice(0, settings.maxWords)) {
    const rotate = settings.mixed && rng() > 0.72;
    let size = Math.min(100, 22 + 78 * Math.sqrt(item.count / top));
    let accepted = false;
    for (let shrink = 0; shrink < 4 && !accepted; shrink++, size *= 0.82) {
      const width = measure
        ? measure(item.word, size, settings.font)
        : [...item.word].length * size * 0.65;
      const padding = settings.density;
      const w = (rotate ? size * 1.22 : width) + padding * 2,
        h = (rotate ? width : size * 1.22) + padding * 2;
      const offset = rng() * Math.PI * 2;
      for (let j = 0; j < 2400; j++) {
        const radius = Math.sqrt(j) * 8,
          angle = j * 0.29 + offset;
        const x = 500 + Math.cos(angle) * radius * 1.3,
          y = 350 + Math.sin(angle) * radius * 0.85;
        const b = { x: x - w / 2, y: y - h / 2, w, h };
        if (
          ![
            [b.x, b.y],
            [b.x + w, b.y],
            [b.x, b.y + h],
            [b.x + w, b.y + h],
          ].every(([a, c]) => inside(a, c))
        )
          continue;
        if (
          boxes.some(
            (a) =>
              b.x < a.x + a.w &&
              b.x + w > a.x &&
              b.y < a.y + a.h &&
              b.y + h > a.y,
          )
        )
          continue;
        boxes.push(b);
        placed.push({
          ...item,
          x,
          y,
          size,
          rotate,
          colour: colourThemes[settings.theme].colours[placed.length % 5],
        });
        accepted = true;
        break;
      }
    }
  }
  return placed;
}
export function renderCloudSVG(placed: CloudWord[], settings: CloudSettings) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700" role="img" aria-label="Word cloud">${settings.transparent ? "" : `<rect width="1000" height="700" fill="${colourThemes[settings.theme].background}"/>`}${placed.map((w) => `<text x="${w.x.toFixed(2)}" y="${w.y.toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-family="${settings.font}" font-weight="600" font-size="${w.size.toFixed(2)}" fill="${w.colour}"${w.rotate ? ` transform="rotate(90 ${w.x.toFixed(2)} ${w.y.toFixed(2)})"` : ""}>${escapeXML(w.word)}</text>`).join("")}</svg>`;
}
export function extractPalette(
  data: Uint8ClampedArray,
  { amount = 5, omitPaper = true, omitInk = false, balanced = false } = {},
) {
  const bins = new Map<
    string,
    { n: number; r: number; g: number; b: number }
  >();
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    if (omitPaper && Math.min(r, g, b) > 235) continue;
    if (omitInk && Math.max(r, g, b) < 45) continue;
    total++;
    const key = [r >> 5, g >> 5, b >> 5].join(",");
    const v = bins.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    v.n++;
    v.r += r;
    v.g += g;
    v.b += b;
    bins.set(key, v);
  }
  const ranked = [...bins.values()].sort((a, b) => b.n - a.n);
  const selected: typeof ranked = [];
  for (const v of ranked) {
    if (
      balanced &&
      selected.some(
        (c) =>
          Math.hypot(
            v.r / v.n - c.r / c.n,
            v.g / v.n - c.g / c.n,
            v.b / v.n - c.b / c.n,
          ) < 60,
      )
    )
      continue;
    selected.push(v);
    if (selected.length === amount) break;
  }
  return selected.map((v) => ({
    hex:
      "#" +
      [v.r, v.g, v.b]
        .map((c) =>
          Math.round(c / v.n)
            .toString(16)
            .padStart(2, "0"),
        )
        .join(""),
    percent: Math.round((v.n / Math.max(1, total)) * 100),
  }));
}
export function colourValue(hex: string, format: "HEX" | "RGB" | "HSL") {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  if (format === "HEX") return hex.toUpperCase();
  if (format === "RGB") return `rgb(${c.join(", ")})`;
  const [r, g, b] = c.map((v) => v / 255),
    max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    l = (max + min) / 2,
    d = max - min;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  let h = 0;
  if (d) {
    h =
      max === r
        ? ((g - b) / d) % 6
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
export type BookSettings = {
  background: string;
  layout: "auto" | "single" | "spread";
  rtl: boolean;
  shadow: boolean;
  animate: boolean;
  sound: boolean;
};
export const defaultBook: BookSettings = {
  background: "#eee4d5",
  layout: "auto",
  rtl: false,
  shadow: true,
  animate: true,
  sound: false,
};
export function styledFlipbookHTML(images: string[], settings: BookSettings) {
  if (
    !images.length ||
    images.some((s) => !/^data:image\/jpeg;base64,[a-zA-Z0-9+/=]+$/.test(s))
  )
    throw new Error("Invalid book page images.");
  if (!/^#[0-9a-f]{6}$/i.test(settings.background))
    throw new Error("Invalid book background.");
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PDF Studio Flipbook</title><style>*{box-sizing:border-box}body{margin:0;background:${settings.background};color:#202b3b;font:16px system-ui}main{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:20px}.book{display:flex;justify-content:center;max-width:100%;direction:${settings.rtl ? "rtl" : "ltr"}}img{max-width:48vw;height:72vh;object-fit:contain;${settings.shadow ? "filter:drop-shadow(0 12px 15px #0003);" : ""}${settings.animate ? "animation:turn .65s;transform-origin:left center;" : ""}}img{cursor:grab;touch-action:pan-y;user-select:none;-webkit-user-drag:none}.book.dragging img{cursor:grabbing;animation:none!important;transform:translateX(var(--drag,0px)) perspective(1600px) rotateY(var(--angle,0deg))}.single img{max-width:90vw}.single #second{display:none}nav{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;background:#fff;padding:12px;border-radius:16px}button,select{font:inherit;padding:12px;border-radius:10px;border:1px solid #d9d3e8;background:white;color:#202b3b}button:focus-visible,select:focus-visible{outline:3px solid #6846db}button:disabled{opacity:.4}@keyframes turn{0%{transform:perspective(1600px) rotateY(-65deg);filter:brightness(.8)}60%{transform:perspective(1600px) rotateY(12deg)}100%{transform:none;filter:brightness(1)}}@media(prefers-reduced-motion:reduce){img{animation:none}.book.dragging img{transform:translateX(var(--drag,0px))}}@media(max-width:650px){img{height:65vh}}</style><main><div class="book" id="book"><img id="first" alt="PDF page"><img id="second" alt="PDF page"></div><nav><button id="prev">Previous</button><span id="count" aria-live="polite"></span><button id="next">Next</button><label>View <select id="view"><option value="auto">Automatic</option><option value="single">Single page</option><option value="spread">Spread</option></select></label><label><input id="sound" type="checkbox"> Paper sound</label><button id="full">Fullscreen</button></nav></main><script>const pages=${JSON.stringify(images)},initial=${JSON.stringify(settings).replace(/</g, "\\u003c")};let i=0;const el=id=>document.getElementById(id),view=el('view');view.value=initial.layout;el('sound').checked=initial.sound;function rustle(){if(!el('sound').checked)return;try{const c=new AudioContext(),b=c.createBuffer(1,Math.ceil(c.sampleRate*.42),c.sampleRate),d=b.getChannelData(0);for(let n=0;n<d.length;n++)d[n]=(Math.random()*2-1)*Math.sin(Math.PI*n/d.length);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=1200;f.Q.value=.55;g.gain.value=.18;s.connect(f);f.connect(g);g.connect(c.destination);s.onended=()=>c.close();c.resume().then(()=>s.start()).catch(()=>c.close())}catch{}}function spread(){return view.value==='spread'||view.value==='auto'&&innerWidth>650}function show(){const two=spread();el('book').classList.toggle('single',!two);for(const id of ['first','second']){const p=el(id);p.style.animation='none';void p.offsetWidth;p.style.animation='';}el('first').src=pages[i];el('first').alt='PDF page '+(i+1);el('second').src=pages[i+1]||pages[i];el('second').alt='PDF page '+Math.min(i+2,pages.length);el('second').style.visibility=i+1<pages.length?'visible':'hidden';el('count').textContent='Page '+(i+1)+(two&&i+1<pages.length?'–'+(i+2):'')+' of '+pages.length;el('prev').disabled=i===0;el('next').disabled=i+(two?2:1)>=pages.length;}el('prev').onclick=()=>{i=Math.max(0,i-(spread()?2:1));rustle();show()};el('next').onclick=()=>{i=Math.min(pages.length-1,i+(spread()?2:1));rustle();show()};const book=el('book');let drag=null;function clearDrag(){drag=null;book.classList.remove('dragging');book.style.removeProperty('--drag');book.style.removeProperty('--angle')}book.onpointerdown=e=>{if(!e.isPrimary||e.button!==0||e.target.tagName!=='IMG')return;drag={x:e.clientX,y:e.clientY,id:e.pointerId};book.setPointerCapture(e.pointerId)};book.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)){book.classList.add('dragging');book.style.setProperty('--drag',Math.max(-100,Math.min(100,dx))+'px');book.style.setProperty('--angle',Math.max(-28,Math.min(28,dx/7))+'deg')}};book.onpointerup=e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;clearDrag();if(book.hasPointerCapture(e.pointerId))book.releasePointerCapture(e.pointerId);if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))el((dx<0)!==initial.rtl?'next':'prev').click()};book.onpointercancel=clearDrag;book.onlostpointercapture=clearDrag;view.onchange=show;window.onresize=show;document.onkeydown=e=>{if(e.target.tagName==='SELECT')return;if(e.key==='ArrowRight')el(initial.rtl?'prev':'next').click();if(e.key==='ArrowLeft')el(initial.rtl?'next':'prev').click();};el('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{el('full').textContent='Fullscreen unavailable'}};show();</script></html>`;
}

