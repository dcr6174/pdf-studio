"use client";
/* eslint-disable @next/next/no-img-element -- Local document data URLs must stay in the browser. */
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import Link from "@/components/browser-link";
import { SupportLink } from "@/components/support-link";
import { experiments, bitmapPDF, type Experiment } from "@/lib/lab-tools";
import {
  bookThemes,
  colourThemes,
  examples,
  demoText,
  countWords,
  arrangeCloud,
  renderCloudSVG,
  extractPalette,
  colourValue,
  styledFlipbookHTML,
  defaultBook,
  defaultCloud,
  type BookSettings,
  type CloudSettings,
} from "@/lib/lab-design";
import "../app/lab/lab-workspace.css";
import {useExportScreen} from "@/components/use-export-screen";

type Mode = Extract<Experiment, "flipbook" | "word-cloud" | "page-palette">;
type Region = { x: number; y: number; w: number; h: number };
async function svgPNG(svg: string, width = 1800) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const image = new window.Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Image export could not render. Try SVG instead."));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.round((width * image.height) / image.width);
    canvas
      .getContext("2d")!
      .drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Image export failed."))),
        "image/png",
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
function SamplePage({ number = 1 }: { number?: number }) {
  return (
    <svg
      className="lab-sample-page"
      viewBox="0 0 420 570"
      role="img"
      aria-label="Example travel journal page"
    >
      <rect width="420" height="570" fill="#fffaf1" />
      <text x="34" y="62" fill="#233c50" fontSize="16" letterSpacing="3">
        FIELD NOTES / {number === 1 ? "01" : "02"}
      </text>
      <text x="34" y="112" fill="#263d51" fontSize="38" fontFamily="Georgia">
        A slower kind
      </text>
      <text x="34" y="154" fill="#263d51" fontSize="38" fontFamily="Georgia">
        of adventure.
      </text>
      <rect x="34" y="184" width="352" height="232" rx="5" fill="#d9eaf2" />
      <circle cx="306" cy="230" r="25" fill="#ffbd88" />
      <path
        d="M34 350 L135 223 L247 365 L326 270 L386 352 V416 H34"
        fill="#93b7af"
      />
      <path d="M34 390 L182 284 L299 400 L386 335 V416 H34" fill="#3c7972" />
      <path d="M34 401 Q200 350 386 400 V416 H34" fill="#326287" />
      <text x="34" y="455" fill="#537065" fontSize="14">
        Small moments. Open skies. New stories.
      </text>
      {[481, 501, 521].map((y, i) => (
        <line
          key={y}
          x1="34"
          x2={i === 2 ? "276" : "386"}
          y1={y}
          y2={y}
          stroke="#c7c9b7"
          strokeWidth="3"
        />
      ))}
    </svg>
  );
}
function SwatchThemes({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="lab-theme-grid">
      {colourThemes.map((t, i) => (
        <button
          key={t.name}
          className="lab-theme-choice"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
        >
          <span className="lab-mini-swatches">
            {t.colours.map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </span>
          <span>{t.name}</span>
        </button>
      ))}
    </div>
  );
}
export function LabWorkspace({ mode }: { mode: Mode }) {
  const {prepare: save, visible: resultVisible, screen: resultScreen} = useExportScreen();
  const tool = experiments.find((t) => t.slug === mode)!;
  const [file, setFile] = useState<File>(),
    [bytes, setBytes] = useState<Uint8Array>(),
    [count, setCount] = useState(0),
    [page, setPage] = useState(0),
    [images, setImages] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [cancellable, setCancellable] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [success, setSuccess] = useState(false);
  const [book, setBook] = useState<BookSettings>(defaultBook),
    [zoom, setZoom] = useState(100),
    [thumbnails, setThumbnails] = useState(false),
    [narrow, setNarrow] = useState(true),
    [full, setFull] = useState(false);
  const [rawText, setRawText] = useState(""),
    [paste, setPaste] = useState(false),
    [cloud, setCloud] = useState<CloudSettings>(defaultCloud),
    [omitCommon, setOmitCommon] = useState(true),
    [minLength, setMinLength] = useState(2),
    [excluded, setExcluded] = useState(""),
    [selectedWord, setSelectedWord] = useState(""),
    [speed, setSpeed] = useState(200),
    [exportWidth, setExportWidth] = useState(1800),
    [fontReady, setFontReady] = useState(false);
  const [amount, setAmount] = useState(5),
    [omitPaper, setOmitPaper] = useState(true),
    [omitInk, setOmitInk] = useState(false),
    [balanced, setBalanced] = useState(true),
    [format, setFormat] = useState<"HEX" | "RGB" | "HSL">("HEX"),
    [pageCanvas, setPageCanvas] = useState<HTMLCanvasElement | null>(null),
    [cache, setCache] = useState<Record<number, string>>({}),
    [locked, setLocked] = useState<string[]>([]),
    [region, setRegion] = useState<Region>(),
    [sampling, setSampling] = useState<"page" | "region" | "eyedropper">(
      "page",
    ),
    [sampled, setSampled] = useState("");
  const picker = useRef<HTMLInputElement>(null),
    viewer = useRef<HTMLDivElement>(null),
    img = useRef<HTMLImageElement>(null),
    raster = useRef<HTMLCanvasElement | null>(null),
    job = useRef<AbortController | null>(null),
    drag = useRef<{ x: number; y: number } | null>(null),
    touch = useRef<{ x: number; y: number; id: number } | null>(null),
    swipe = useRef(false);
  const spread =
    mode === "flipbook" &&
    (book.layout === "spread" || (book.layout === "auto" && !narrow));
  const hasText = rawText.trim().length > 0;
  const realSource = !!file || (mode === "word-cloud" && hasText);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:650px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    const change = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", change);
    void document.fonts.ready.then(() => setFontReady(true));
    return () => {
      mq.removeEventListener("change", update);
      document.removeEventListener("fullscreenchange", change);
      job.current?.abort();
    };
  }, []);
  const frequencies = useMemo(
    () =>
      countWords(hasText ? rawText : demoText, {
        omitCommon,
        minLength,
        excluded,
      }),
    [rawText, hasText, omitCommon, minLength, excluded],
  );
  const cloudWords = useMemo(() => {
    let measure:
      ((word: string, size: number, font: string) => number) | undefined;
    if (fontReady) {
      const context = document.createElement("canvas").getContext("2d");
      if (context)
        measure = (word, size, font) => {
          context.font = `600 ${size}px ${font}`;
          return context.measureText(word).width;
        };
    }
    return arrangeCloud(frequencies, cloud, measure);
  }, [frequencies, cloud, fontReady]);
  const cloudSVG = useMemo(
    () => renderCloudSVG(cloudWords, cloud),
    [cloudWords, cloud],
  );
  const totalWords =
    (hasText ? rawText.match(/[\p{L}\p{N}]+/gu)?.length : 0) || 0;
  useEffect(() => {
    if (!bytes || mode === "word-cloud") return;
    const abort = new AbortController();
    let live = true;
    void (async () => {
      await Promise.resolve();
      if (!live) return;
      setReady(false);
      setError("");
      setMessage("Rendering your page…");
      const { renderer } = await import("@/lib/pdf-client");
      abort.signal.throwIfAborted();
      const doc = await renderer(bytes);
      try {
        const results: string[] = [];
        for (let n = page; n < Math.min(count, page + (spread ? 2 : 1)); n++) {
          abort.signal.throwIfAborted();
          const p = await doc.getPage(n + 1),
            base = p.getViewport({ scale: 1 }),
            vp = p.getViewport({
              scale: Math.min(2, 1400 / Math.max(base.width, base.height)),
            });
          const c = document.createElement("canvas");
          c.width = Math.ceil(vp.width);
          c.height = Math.ceil(vp.height);
          const ctx = c.getContext("2d")!;
          const task = p.render({ canvasContext: ctx, viewport: vp });
          const cancel = () => task.cancel();
          abort.signal.addEventListener("abort", cancel, { once: true });
          try {
            await task.promise;
          } finally {
            abort.signal.removeEventListener("abort", cancel);
          }
          if (n === page && live) {
            raster.current = c;
            setPageCanvas(c);
          }
          const url = c.toDataURL("image/jpeg", 0.9);
          if (live) setCache((previous) => ({ ...previous, [n]: url }));
          results.push(url);
          p.cleanup();
        }
        if (live) {
          setImages(results);
          setReady(true);
          setMessage("");
        }
      } finally {
        await doc.destroy();
      }
    })().catch((e) => {
      if (live && !abort.signal.aborted) {
        setError(
          e instanceof Error
            ? e.message
            : "This page could not render. Change the file and retry.",
        );
        setMessage("");
      }
    });
    return () => {
      live = false;
      abort.abort();
    };
  }, [bytes, page, count, mode, spread]);
  const palette = useMemo(() => {
    if (mode !== "page-palette" || !ready || !pageCanvas) return [];
    const c = pageCanvas;
    let x = 0,
      y = 0,
      w = c.width,
      h = c.height;
    if (region) {
      x = Math.floor(region.x * c.width);
      y = Math.floor(region.y * c.height);
      w = Math.max(1, Math.min(c.width - x, Math.round(region.w * c.width)));
      h = Math.max(1, Math.min(c.height - y, Math.round(region.h * c.height)));
    }
    const data = c.getContext("2d")!.getImageData(x, y, w, h).data;
    const found = extractPalette(data, {
      amount: amount + locked.length,
      omitPaper,
      omitInk,
      balanced,
    });
    return [
      ...locked.map((hex) => ({ hex, percent: 0 })),
      ...found.filter((v) => !locked.includes(v.hex)),
    ].slice(0, amount);
  }, [
    mode,
    ready,
    pageCanvas,
    amount,
    omitPaper,
    omitInk,
    balanced,
    region,
    locked,
  ]);
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    if (files.length !== 1) {
      setError("Choose one PDF at a time. Your current result is retained.");
      return;
    }
    const f = files[0];
    if (f.size > 50_000_000) {
      setError(
        "Choose a PDF smaller than 50 MB. Your current document is retained.",
      );
      return;
    }
    const abort = new AbortController();
    job.current?.abort();
    job.current = abort;
    setBusy(true);
    setCancellable(true);
    setError("");
    setMessage("Opening your PDF…");
    let doc:
      | Awaited<ReturnType<typeof import("@/lib/pdf-client").renderer>>
      | undefined;
    try {
      const data = new Uint8Array(await f.arrayBuffer());
      if (!new TextDecoder().decode(data.slice(0, 1024)).includes("%PDF-"))
        throw new Error("This is not a readable PDF. Choose a PDF document.");
      const { renderer } = await import("@/lib/pdf-client");
      doc = await renderer(data);
      if (doc.numPages > 100)
        throw new Error(
          "Choose a PDF with 100 pages or fewer. Split a longer document first.",
        );
      let text = "";
      if (mode === "word-cloud") {
        for (let n = 1; n <= doc.numPages; n++) {
          abort.signal.throwIfAborted();
          setMessage(`Reading page ${n} of ${doc.numPages}…`);
          const content = await (await doc.getPage(n)).getTextContent();
          text +=
            content.items
              .map((item) => ("str" in item ? item.str : ""))
              .join(" ") + "\n";
          if (text.length > 1_000_000)
            throw new Error(
              "This document has too much text. Split it into a smaller PDF.",
            );
        }
        if (!text.trim())
          throw new Error(
            "This looks like a scanned PDF. Open OCR to recognise its text, or use Paste text.",
          );
      }
      abort.signal.throwIfAborted();
      setRawText(text);
      setFile(f);
      setBytes(data);
      setCount(doc.numPages);
      setPage(0);
      setRegion(undefined);
      setSampled("");
      setLocked([]);
      setCache({});
      setSuccess(false);
      setPaste(false);
      setMessage("");
    } catch (e) {
      if (!abort.signal.aborted)
        setError(
          e instanceof Error
            ? e.message
            : "This PDF could not open. Unlock password-protected files first.",
        );
    } finally {
      await doc?.destroy();
      if (job.current === abort) {
        setBusy(false);
        if (abort.signal.aborted)
          setMessage("Cancelled. Your previous result is retained.");
      }
    }
  }
  function sound() {
    if (!book.sound) return;
    try {
      const ctx = new AudioContext();
      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.42), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / data.length;
        data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * (0.65 + 0.35 * Math.sin(t * 55));
      }
      const src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
      src.buffer = buffer; filter.type = 'bandpass'; filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.42); filter.Q.value = 0.55;
      gain.gain.value = 0.18; src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      src.onended = () => void ctx.close(); void ctx.resume().then(() => src.start()).catch(() => ctx.close());
    } catch { /* Optional paper rustle. */ }
  }
  function navigate(next: number) {
    const target = Math.max(0, Math.min(count - 1, next));
    if (!file || busy || target === page) return;
    setPage(target);
    setRegion(undefined);
  }
  function turn(delta: number) {
    if (!file || busy || page + delta * (spread ? 2 : 1) < 0 || page + delta * (spread ? 2 : 1) >= count) return;
    navigate(page + delta * (spread ? 2 : 1));
    if (mode === "flipbook") sound();
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await viewer.current?.requestFullscreen();
    } catch {
      setMessage(
        "Fullscreen is unavailable in this browser. You can still use the reader.",
      );
    }
  }
  async function exportBook() {
    if (!bytes) return;
    const abort = new AbortController();
    job.current = abort;
    setBusy(true);
    setCancellable(true);
    setError("");
    try {
      const { renderer } = await import("@/lib/pdf-client");
      const doc = await renderer(bytes);
      try {
        const pages: string[] = [];
        let size = 0;
        for (let n = 1; n <= doc.numPages; n++) {
          abort.signal.throwIfAborted();
          setMessage(`Preparing book page ${n} of ${doc.numPages}…`);
          const p = await doc.getPage(n),
            base = p.getViewport({ scale: 1 }),
            vp = p.getViewport({
              scale: Math.min(1.8, 1300 / Math.max(base.width, base.height)),
            }),
            c = document.createElement("canvas");
          c.width = Math.ceil(vp.width);
          c.height = Math.ceil(vp.height);
          const task = p.render({
            canvasContext: c.getContext("2d")!,
            viewport: vp,
          });
          const cancel = () => task.cancel();
          abort.signal.addEventListener("abort", cancel, { once: true });
          try {
            await task.promise;
          } finally {
            abort.signal.removeEventListener("abort", cancel);
          }
          const url = c.toDataURL("image/jpeg", 0.86);
          size += url.length;
          if (size > 60_000_000)
            throw new Error(
              "This offline book is too large. Split the document first.",
            );
          pages.push(url);
          p.cleanup();
        }
        abort.signal.throwIfAborted();
        save(
          new Blob([styledFlipbookHTML(pages, book)], { type: "text/html" }),
          "pdf-studio-flipbook.html",
        );
        setSuccess(true);
        setMessage(
          "Offline book prepared. Open the downloaded HTML file to read it.",
        );
      } finally {
        await doc.destroy();
      }
    } catch (e) {
      if (!abort.signal.aborted)
        setError(
          e instanceof Error ? e.message : "Book export failed. Please retry.",
        );
    } finally {
      setBusy(false);
      if (abort.signal.aborted)
        setMessage("Export cancelled. Your document is retained.");
    }
  }
  async function cloudExport(kind: "png" | "svg" | "pdf" | "csv") {
    if (!hasText || !cloudWords.length) return;
    setBusy(true);
    setCancellable(false);
    setError("");
    try {
      if (kind === "svg")
        save(new Blob([cloudSVG], { type: "image/svg+xml" }), "word-cloud.svg");
      else if (kind === "csv")
        save(
          new Blob(
            [
              "Word,Count\n" +
                frequencies
                  .map((w) => `"${w.word.replace(/"/g, '""')}",${w.count}`)
                  .join("\n"),
            ],
            { type: "text/csv;charset=utf-8" },
          ),
          "word-frequencies.csv",
        );
      else {
        const png = await svgPNG(cloudSVG, exportWidth);
        if (kind === "png") save(png, "word-cloud.png");
        else
          save(
            new Blob(
              [
                (await bitmapPDF(
                  new Uint8Array(await png.arrayBuffer()),
                )) as BlobPart,
              ],
              { type: "application/pdf" },
            ),
            "word-cloud.pdf",
          );
      }
      setSuccess(true);
      setMessage("Your word cloud export is ready.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied to clipboard.");
    } catch {
      setMessage("Clipboard unavailable. Select and copy: " + text);
    }
  }
  async function paletteExport(kind: "json" | "css" | "png") {
    if (!palette.length) return;
    setBusy(true);
    setCancellable(false);
    setError("");
    try {
      if (kind === "json")
        save(
          new Blob(
            [
              JSON.stringify(
                { page: page + 1, region: region ?? null, colors: palette },
                null,
                2,
              ),
            ],
            { type: "application/json" },
          ),
          "page-palette.json",
        );
      else if (kind === "css")
        save(
          new Blob(
            [
              ":root {\n" +
                palette
                  .map((c, i) => `  --palette-${i + 1}: ${c.hex};`)
                  .join("\n") +
                "\n}\n",
            ],
            { type: "text/css" },
          ),
          "page-palette.css",
        );
      else {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500"><rect width="1000" height="500" fill="#fffaf5"/><text x="40" y="65" font-size="28" font-family="sans-serif" fill="#263247">PDF Studio / Page ${page + 1} palette</text>${palette.map((c, i) => `<rect x="${40 + (i * 920) / palette.length}" y="110" width="${920 / palette.length - 8}" height="265" fill="${c.hex}"/><text x="${40 + (i * 920) / palette.length}" y="410" font-size="${Math.min(24, 150 / palette.length)}" font-family="monospace" fill="#263247">${c.hex.toUpperCase()}</text>`).join("")}</svg>`;
        save(await svgPNG(svg), "page-palette.png");
      }
      setSuccess(true);
      setMessage("Your palette export is ready.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Palette export failed.");
    } finally {
      setBusy(false);
    }
  }
  function coordinates(e: PointerEvent) {
    const r = img.current?.getBoundingClientRect();
    if (!r) return;
    return {
      x: Math.max(0, Math.min(0.999999, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(0.999999, (e.clientY - r.top) / r.height)),
    };
  }
  function beginRegion(e: PointerEvent) {
    if (!ready || sampling === "page") return;
    const pos = coordinates(e);
    if (!pos) return;
    e.preventDefault();
    if (sampling === "eyedropper" && raster.current) {
      const c = raster.current,
        d = c
          .getContext("2d")!
          .getImageData(
            Math.floor(pos.x * c.width),
            Math.floor(pos.y * c.height),
            1,
            1,
          ).data;
      setSampled(
        "#" +
          [d[0], d[1], d[2]]
            .map((v) => v.toString(16).padStart(2, "0"))
            .join(""),
      );
      return;
    }
    drag.current = pos;
    e.currentTarget.setPointerCapture(e.pointerId);
    setRegion(undefined);
  }
  function moveRegion(e: PointerEvent) {
    if (!drag.current) return;
    const p = coordinates(e);
    if (!p) return;
    setRegion({
      x: Math.min(p.x, drag.current.x),
      y: Math.min(p.y, drag.current.y),
      w: Math.abs(p.x - drag.current.x),
      h: Math.abs(p.y - drag.current.y),
    });
  }
  const setCloudOption = <K extends keyof CloudSettings>(
    key: K,
    value: CloudSettings[K],
  ) => setCloud((c) => ({ ...c, [key]: value }));
  const setBookOption = <K extends keyof BookSettings>(
    key: K,
    value: BookSettings[K],
  ) => setBook((b) => ({ ...b, [key]: value }));
  const activePalette = file
    ? ready
      ? palette
      : []
    : [
        { hex: "#3c7972", percent: 35 },
        { hex: "#93b7af", percent: 25 },
        { hex: "#326287", percent: 20 },
        { hex: "#ffbd88", percent: 10 },
        { hex: "#d9eaf2", percent: 10 },
      ];
  return (
    <main className={"lab-workspace lab-workspace-" + mode}>
      <div className="studio-workspace-content" data-export-workspace tabIndex={-1} hidden={resultVisible}>
      <header className="lab-workspace-heading">
        <Link href="/lab">Back to Studio Lab</Link>
        <span className="lab-workspace-beta">BETA</span>
        <p className="lab-eyebrow">{examples[mode].eyebrow}</p>
        <h1>{tool.title.replace("PDF ", "")}</h1>
        <p>{examples[mode].hint}</p>
      </header>
      <input
        className="lab-file-input"
        ref={picker}
        type="file"
        accept=".pdf,application/pdf"
        aria-label="Choose a PDF"
        disabled={busy}
        onChange={(e) => {
          void upload(e.target.files);
          e.target.value = "";
        }}
      />
      {error && (
        <div className="experiment-error" role="alert">
          {error}
          {mode === "word-cloud" && <Link href="/tools/ocr-pdf">Open OCR</Link>}
        </div>
      )}
      <div
        className="lab-source-bar"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) void upload(e.dataTransfer.files);
        }}
      >
        <div>
          <strong>
            {file
              ? file.name
              : hasText
                ? "Your pasted text"
                : "Start with your PDF"}
          </strong>
          <span>
            {file
              ? `${count} pages · ${(file.size / 1024).toFixed(1)} KB`
              : hasText
                ? `${totalWords.toLocaleString()} words`
                : "Drop one here, or choose a file. Up to 50 MB / 100 pages."}
          </span>
        </div>
        <button
          className={!realSource ? "lab-button-primary" : ""}
          disabled={busy}
          onClick={() => picker.current?.click()}
        >
          {realSource ? "Change file" : "Choose PDF"}
        </button>
        {mode === "word-cloud" && (
          <button disabled={busy} onClick={() => setPaste((v) => !v)}>
            {paste ? "Close text input" : "Paste text"}
          </button>
        )}
      </div>
      {paste && (
        <label className="lab-paste">
          Your text
          <textarea
            value={rawText}
            maxLength={1_000_000}
            placeholder="Paste your text here. Your cloud updates as you type."
            onChange={(e) => {
              setRawText(e.target.value);
              setFile(undefined);
              setBytes(undefined);
              setSuccess(false);
            }}
          />
        </label>
      )}
      <div className="lab-workspace-grid">
        <section className="lab-preview-panel" aria-label="Live preview">
          <div className="lab-preview-heading">
            <strong>
              {realSource ? "Your live preview" : "Example preview"}
            </strong>
            <span>
              {mode === "word-cloud"
                ? `${cloudWords.length} words displayed`
                : mode === "page-palette"
                  ? "Select a page. Explore its colours."
                  : "Your pages, a fresh perspective."}
            </span>
          </div>
          {mode === "word-cloud" ? (
            <>
              <div
                className={
                  "lab-cloud-canvas" +
                  (cloud.transparent ? " is-transparent" : "")
                }
                onClick={(e) => {
                  const target = e.target as Element;
                  if (target.tagName.toLowerCase() === "text")
                    setSelectedWord(target.textContent || "");
                }}
                dangerouslySetInnerHTML={{ __html: cloudSVG }}
              />
              {selectedWord && (
                <div className="lab-selected-word">
                  <strong>{selectedWord}</strong>
                  <span>
                    {frequencies.find((w) => w.word === selectedWord)?.count}{" "}
                    occurrences
                  </span>
                  <button
                    onClick={() => {
                      setExcluded((v) => v + " " + selectedWord);
                      setSelectedWord("");
                    }}
                  >
                    Exclude word
                  </button>
                  <button onClick={() => setSelectedWord("")}>Close</button>
                </div>
              )}
              <div className="lab-text-stats">
                <span>
                  <b>{realSource ? totalWords.toLocaleString() : "—"}</b>words
                  analysed
                </span>
                <span>
                  <b>
                    {realSource ? frequencies.length.toLocaleString() : "—"}
                  </b>
                  unique after filtering
                </span>
                <span>
                  <b>
                    {realSource
                      ? Math.max(1, Math.ceil(totalWords / speed)) + " min"
                      : "—"}
                  </b>
                  estimated reading time
                </span>
              </div>
              <p className="lab-preview-note">
                Click a word to view its frequency or exclude it.
              </p>
            </>
          ) : (
            <div
              ref={viewer}
              className={"lab-reader" + (mode === "flipbook" ? " is-book" : "")}
              style={{
                background: mode === "flipbook" ? book.background : "#eff3f1",
              }}
              tabIndex={0}
              aria-label="PDF page preview"
              onKeyDown={(e) => {
                if (
                  (e.target as HTMLElement).tagName === "INPUT" ||
                  (e.target as HTMLElement).tagName === "SELECT"
                )
                  return;
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  turn(book.rtl ? -1 : 1);
                }
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  turn(book.rtl ? 1 : -1);
                }
              }}
              onPointerDown={(e) => {
                if (mode !== "flipbook" || !file || busy || !ready || !e.isPrimary || e.button !== 0 || !(e.target as Element).closest(".lab-page-image")) return;
                touch.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
                swipe.current = false;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const start = touch.current;
                if (!start || start.id !== e.pointerId) return;
                const dx = e.clientX - start.x, dy = e.clientY - start.y;
                if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) swipe.current = true;
                if (swipe.current) {
                  e.currentTarget.classList.add("is-dragging");
                  e.currentTarget.style.setProperty("--page-drag", Math.max(-100, Math.min(100, dx)) + "px");
                  e.currentTarget.style.setProperty("--page-angle", Math.max(-28, Math.min(28, dx / 7)) + "deg");
                }
              }}
              onPointerUp={(e) => {
                const start = touch.current;
                if (!start || start.id !== e.pointerId) return;
                touch.current = null;
                e.currentTarget.classList.remove("is-dragging");
                e.currentTarget.style.removeProperty("--page-drag");
                e.currentTarget.style.removeProperty("--page-angle");
                if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                if (swipe.current && Math.abs(e.clientX - start.x) > 60)
                  turn((e.clientX < start.x ? 1 : -1) * (book.rtl ? -1 : 1));
                swipe.current = false;
              }}
              onPointerCancel={(e) => {
                touch.current = null;
                swipe.current = false;
                e.currentTarget.classList.remove("is-dragging");
                e.currentTarget.style.removeProperty("--page-drag");
                e.currentTarget.style.removeProperty("--page-angle");
              }}
              onLostPointerCapture={(e) => {
                touch.current = null;
                swipe.current = false;
                e.currentTarget.classList.remove("is-dragging");
                e.currentTarget.style.removeProperty("--page-drag");
                e.currentTarget.style.removeProperty("--page-angle");
              }}
            >
              <div className="lab-page-scroll">
                <div
                  className={
                    "lab-book-pages" +
                    (spread ? " is-spread" : "") +
                    (book.shadow ? " has-shadow" : "") +
                    (book.animate && mode === "flipbook"
                      ? " has-animation"
                      : "")
                  }
                  style={{
                    width: zoom + "%",
                    direction: mode === "flipbook" && book.rtl ? "rtl" : "ltr",
                  }}
                >
                  {file ? (
                    ready ? (
                      <>
                        {images.map((src, i) => (
                          <div
                            className="lab-page-image"
                            key={page + i}
                            onPointerDown={
                              mode === "page-palette" ? beginRegion : undefined
                            }
                            onPointerMove={
                              mode === "page-palette" ? moveRegion : undefined
                            }
                            onPointerUp={() => {
                              drag.current = null;
                            }}
                            onPointerCancel={() => {
                              drag.current = null;
                            }}
                            style={{
                              touchAction:
                                mode === "page-palette" && sampling !== "page"
                                  ? "none"
                                  : undefined,
                              cursor:
                                sampling === "eyedropper"
                                  ? "crosshair"
                                  : undefined,
                            }}
                          >
                            <img
                              ref={i === 0 ? img : undefined}
                              src={src}
                              alt={"PDF page " + (page + i + 1)}
                              draggable={false}
                            />
                            {i === 0 && region && (
                              <div
                                className="lab-region"
                                style={{
                                  left: region.x * 100 + "%",
                                  top: region.y * 100 + "%",
                                  width: region.w * 100 + "%",
                                  height: region.h * 100 + "%",
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="lab-rendering" role="status">
                        Preparing your preview…
                      </div>
                    )
                  ) : (
                    <>
                      <SamplePage />
                      {spread && <SamplePage number={2} />}
                    </>
                  )}
                </div>
              </div>
              <nav className="lab-reader-controls" aria-label="Page navigation">
                <button
                  disabled={!file || busy || page === 0}
                  onClick={() => turn(-1)}
                >
                  Previous
                </button>
                <label>
                  Page{" "}
                  <input
                    type="number"
                    min={1}
                    max={count || 1}
                    value={page + 1}
                    disabled={!file || busy}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (n >= 1 && n <= count) {
                        navigate(n - 1);
                      }
                    }}
                  />
                  <span>of {count || "12"}</span>
                </label>
                <button
                  disabled={!file || busy || page + (spread ? 2 : 1) >= count}
                  onClick={() => turn(1)}
                >
                  Next
                </button>
                {mode === "flipbook" && (
                  <button onClick={() => void fullscreen()}>
                    {full ? "Exit fullscreen" : "Fullscreen"}
                  </button>
                )}
              </nav>
            </div>
          )}
          {mode === "flipbook" && (
            <div className="lab-reader-secondary">
              <label>
                Zoom{" "}
                <select
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                >
                  {[75, 100, 125, 150, 200].map((v) => (
                    <option key={v} value={v}>
                      {v === 100 ? "Fit" : v + "%"}
                    </option>
                  ))}
                </select>
              </label>
              <button
                disabled={!file}
                aria-expanded={thumbnails}
                onClick={() => setThumbnails((v) => !v)}
              >
                Page navigator
              </button>
            </div>
          )}
          {mode === "flipbook" && thumbnails && file && (
            <div className="lab-thumbnails">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  aria-current={page === i ? "page" : undefined}
                  onClick={() => navigate(i)}
                >
                  {cache[i] ? (
                    <img src={cache[i]} alt="" />
                  ) : (
                    <span className="lab-thumbnail-placeholder">{i + 1}</span>
                  )}
                  Page {i + 1}
                </button>
              ))}
            </div>
          )}
          {mode === "page-palette" && (
            <>
              <div className="lab-extracted-swatches">
                {activePalette.map((c) => (
                  <div key={c.hex}>
                    <button
                      className="lab-colour-tile"
                      style={{ background: c.hex }}
                      aria-label={"Copy " + colourValue(c.hex, format)}
                      disabled={!file}
                      onClick={() => void copy(colourValue(c.hex, format))}
                    />
                    <button
                      disabled={!file}
                      className="lab-colour-code"
                      onClick={() => void copy(colourValue(c.hex, format))}
                    >
                      {colourValue(c.hex, format)}
                    </button>
                    <button
                      disabled={!file || busy}
                      aria-pressed={locked.includes(c.hex)}
                      onClick={() =>
                        setLocked((v) =>
                          v.includes(c.hex)
                            ? v.filter((h) => h !== c.hex)
                            : v.length < amount
                              ? [...v, c.hex]
                              : v,
                        )
                      }
                    >
                      {locked.includes(c.hex) ? "Unlock" : "Lock"}
                    </button>
                  </div>
                ))}
              </div>
              {file && ready && !palette.length && (
                <p>
                  No colours remain with these filters. Include paper
                  backgrounds or dark text.
                </p>
              )}
              {sampled && (
                <div className="lab-sampled">
                  <i style={{ background: sampled }} />
                  <strong>{colourValue(sampled, format)}</strong>
                  <button
                    onClick={() => void copy(colourValue(sampled, format))}
                  >
                    Copy sampled colour
                  </button>
                  <button
                    onClick={() =>
                      setLocked((v) =>
                        v.includes(sampled)
                          ? v
                          : [sampled, ...v].slice(0, amount),
                      )
                    }
                  >
                    Keep colour
                  </button>
                </div>
              )}
              <p className="lab-preview-note">
                Colours are approximate samples of the rendered page. Locked
                colours stay when you change extraction settings.
              </p>
            </>
          )}
        </section>
        <aside className="lab-settings" aria-label="Tool settings">
          <h2>Make it yours</h2>
          {mode === "flipbook" ? (
            <>
              <details open>
                <summary>Appearance</summary>
                <div className="lab-book-themes">
                  {bookThemes.map((t) => (
                    <button
                      key={t.name}
                      aria-pressed={book.background === t.colour}
                      onClick={() => setBookOption("background", t.colour)}
                    >
                      <i style={{ background: t.colour }} />
                      {t.name}
                    </button>
                  ))}
                </div>
                <label>
                  Custom background
                  <input
                    type="color"
                    value={book.background}
                    onChange={(e) =>
                      setBookOption("background", e.target.value)
                    }
                  />
                </label>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={book.shadow}
                    onChange={(e) => setBookOption("shadow", e.target.checked)}
                  />
                  Page shadow
                </label>
              </details>
              <details open>
                <summary>Reading</summary>
                <label>
                  Page layout
                  <select
                    value={book.layout}
                    onChange={(e) =>
                      setBookOption(
                        "layout",
                        e.target.value as BookSettings["layout"],
                      )
                    }
                  >
                    <option value="auto">Automatic</option>
                    <option value="single">Single page</option>
                    <option value="spread">Two-page spread</option>
                  </select>
                </label>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={book.rtl}
                    onChange={(e) => setBookOption("rtl", e.target.checked)}
                  />
                  Read right to left
                </label>
              </details>
              <details>
                <summary>Effects</summary>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={book.animate}
                    onChange={(e) => setBookOption("animate", e.target.checked)}
                  />
                  Gentle page animation
                </label>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={book.sound}
                    onChange={(e) => setBookOption("sound", e.target.checked)}
                  />
                  Paper page-turn sound
                </label>
                <p>
                  Reduced-motion preferences are respected. Sound is off by
                  default.
                </p>
              </details>
              <p className="lab-settings-note">
                The offline book contains page images. Selectable text, PDF
                links and forms are not preserved.
              </p>
            </>
          ) : mode === "word-cloud" ? (
            <>
              <details open>
                <summary>Style</summary>
                <SwatchThemes
                  value={cloud.theme}
                  onChange={(v) => setCloudOption("theme", v)}
                />
                <label>
                  Font
                  <select
                    value={cloud.font}
                    onChange={(e) =>
                      setCloudOption(
                        "font",
                        e.target.value as CloudSettings["font"],
                      )
                    }
                  >
                    <option value="sans-serif">Modern</option>
                    <option value="serif">Editorial</option>
                    <option value="monospace">Typewriter</option>
                  </select>
                </label>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={cloud.transparent}
                    onChange={(e) =>
                      setCloudOption("transparent", e.target.checked)
                    }
                  />
                  Transparent background
                </label>
              </details>
              <details open>
                <summary>Layout</summary>
                <label>
                  Shape
                  <select
                    value={cloud.shape}
                    onChange={(e) =>
                      setCloudOption(
                        "shape",
                        e.target.value as CloudSettings["shape"],
                      )
                    }
                  >
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                    <option value="heart">Heart</option>
                  </select>
                </label>
                <label>
                  Words to display: {cloud.maxWords}
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={cloud.maxWords}
                    onChange={(e) =>
                      setCloudOption("maxWords", Number(e.target.value))
                    }
                  />
                </label>
                <label>
                  Word spacing
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={cloud.density}
                    onChange={(e) =>
                      setCloudOption("density", Number(e.target.value))
                    }
                  />
                </label>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={cloud.mixed}
                    onChange={(e) => setCloudOption("mixed", e.target.checked)}
                  />
                  Mix horizontal and vertical words
                </label>
                <button onClick={() => setCloudOption("seed", cloud.seed + 1)}>
                  Shuffle layout
                </button>
              </details>
              <details>
                <summary>Words & reading time</summary>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={omitCommon}
                    onChange={(e) => setOmitCommon(e.target.checked)}
                  />
                  Remove common English words
                </label>
                <p>
                  For other languages, turn this off and add your own
                  exclusions. Fonts use your device’s script support.
                </p>
                <label>
                  Minimum word length
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={minLength}
                    onChange={(e) =>
                      setMinLength(
                        Math.max(1, Math.min(20, Number(e.target.value))),
                      )
                    }
                  />
                </label>
                <label>
                  Excluded words
                  <textarea
                    value={excluded}
                    onChange={(e) => setExcluded(e.target.value)}
                    placeholder="Separate words with spaces or commas"
                  />
                </label>
                <label>
                  Reading speed (words / minute)
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    value={speed}
                    onChange={(e) =>
                      setSpeed(
                        Math.max(50, Math.min(1000, Number(e.target.value))),
                      )
                    }
                  />
                </label>
              </details>
              <details>
                <summary>Export settings</summary>
                <label>
                  PNG / PDF image width
                  <select
                    value={exportWidth}
                    onChange={(e) => setExportWidth(Number(e.target.value))}
                  >
                    <option value={1200}>1200 px</option>
                    <option value={1800}>1800 px</option>
                    <option value={2400}>2400 px</option>
                  </select>
                </label>
              </details>
              {hasText && !frequencies.length && (
                <p>No words remain. Adjust filters or exclusions.</p>
              )}
            </>
          ) : (
            <>
              <details open>
                <summary>Source</summary>
                <label>
                  Sample from
                  <select
                    value={sampling}
                    onChange={(e) => {
                      setSampling(e.target.value as typeof sampling);
                      if (e.target.value === "page") setRegion(undefined);
                    }}
                  >
                    <option value="page">Whole page</option>
                    <option value="region">Selected region</option>
                    <option value="eyedropper">Eyedropper</option>
                  </select>
                </label>
                {sampling === "region" && (
                  <p>Drag across the page to select a region.</p>
                )}
                {sampling === "eyedropper" && (
                  <p>Click a colour on the page to sample it.</p>
                )}
                {region && (
                  <button onClick={() => setRegion(undefined)}>
                    Clear selected region
                  </button>
                )}
              </details>
              <details open>
                <summary>Palette</summary>
                <label>
                  Number of colours: {amount}
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={amount}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      setAmount(n);
                      setLocked((v) => v.slice(0, n));
                    }}
                  />
                </label>
                <label>
                  Selection
                  <select
                    value={balanced ? "balanced" : "dominant"}
                    onChange={(e) => setBalanced(e.target.value === "balanced")}
                  >
                    <option value="balanced">Balanced colours</option>
                    <option value="dominant">Most frequent colours</option>
                  </select>
                </label>
                <label>
                  Colour values
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as typeof format)}
                  >
                    <option>HEX</option>
                    <option>RGB</option>
                    <option>HSL</option>
                  </select>
                </label>
              </details>
              <details open>
                <summary>Filtering</summary>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={omitPaper}
                    onChange={(e) => setOmitPaper(e.target.checked)}
                  />
                  Ignore near-white paper
                </label>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={omitInk}
                    onChange={(e) => setOmitInk(e.target.checked)}
                  />
                  Ignore near-black text
                </label>
              </details>
              <button disabled={!locked.length} onClick={() => setLocked([])}>
                Unlock all colours
              </button>
              <p className="lab-settings-note">
                Extracted colours only. No invented harmony colours are mixed
                into your palette.
              </p>
            </>
          )}
        </aside>
      </div>
      {mode === "word-cloud" && hasText && (
        <details className="lab-frequency-list">
          <summary>Word frequencies ({frequencies.length})</summary>
          <ul>
            {frequencies.slice(0, 100).map((w) => (
              <li key={w.word}>
                <button onClick={() => setSelectedWord(w.word)}>
                  {w.word}
                </button>
                <b>{w.count}</b>
              </li>
            ))}
          </ul>
        </details>
      )}
      <div className="lab-export-bar">
        <div>
          <strong>
            {success
              ? "Your export is ready"
              : realSource
                ? "Ready when you are"
                : "Explore the example"}
          </strong>
          <span>
            {mode === "flipbook"
              ? "Download an offline HTML book."
              : mode === "word-cloud"
                ? "Your export uses the current colours and layout."
                : "Copy your colours or save a reusable palette."}
          </span>
          <span role="status" aria-live="polite">
            {message}
          </span>
        </div>
        <div className="lab-export-actions">
          {busy ? (
            <button
              className="lab-button-primary"
              disabled={!cancellable}
              onClick={() => job.current?.abort()}
            >
              {cancellable ? "Cancel processing" : "Preparing export…"}
            </button>
          ) : mode === "flipbook" ? (
            <button
              className="lab-button-primary"
              disabled={!file || !ready}
              onClick={() => void exportBook()}
            >
              {success ? "Download again" : "Export flipbook"}
            </button>
          ) : mode === "word-cloud" ? (
            <>
              <button
                className="lab-button-primary"
                disabled={!hasText || !cloudWords.length}
                onClick={() => void cloudExport("png")}
              >
                Download PNG
              </button>
              <details className="lab-export-menu">
                <summary>More formats</summary>
                <button
                  disabled={!hasText || !cloudWords.length}
                  onClick={() => void cloudExport("svg")}
                >
                  SVG
                </button>
                <button
                  disabled={!hasText || !cloudWords.length}
                  onClick={() => void cloudExport("pdf")}
                >
                  PDF
                </button>
                <button
                  disabled={!hasText}
                  onClick={() => void cloudExport("csv")}
                >
                  Word counts CSV
                </button>
              </details>
            </>
          ) : (
            <>
              <button
                className="lab-button-primary"
                disabled={!file || !ready || !palette.length}
                onClick={() =>
                  void copy(
                    palette.map((c) => colourValue(c.hex, format)).join("\n"),
                  )
                }
              >
                Copy palette
              </button>
              <details className="lab-export-menu">
                <summary>Download</summary>
                {(["png", "css", "json"] as const).map((k) => (
                  <button
                    key={k}
                    disabled={!file || !ready || !palette.length}
                    onClick={() => void paletteExport(k)}
                  >
                    {k === "png" ? "Palette sheet PNG" : k.toUpperCase()}
                  </button>
                ))}
              </details>
            </>
          )}
        </div>
      </div>
      {success && <SupportLink success />}
      <p className="lab-workspace-footer">
        Processed on your device. Download your work before leaving; this
        workspace is not saved.
      </p>
      </div>{resultScreen}
    </main>
  );
}


