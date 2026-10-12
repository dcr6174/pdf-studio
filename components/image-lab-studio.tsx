"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Plus,
  Download,
  LoaderCircle,
  Check,
  ArrowLeft,
  ArrowRight,
  X,
  Image as ImageIcon,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { ImageWorkspace } from "./image-workspace";
import { ImageViewport } from "./image-viewport";
import { ImageToolSettings } from "./image-tool-settings";
import { imageTools, type ImageToolSlug } from "@/lib/image-tools";
import {
  defaultImageSettings,
  openImage,
  renderImage,
  imageOutputs,
  contactSheet,
  clampRect,
  opaqueCapacity,
  packageImageOutputs,
  decodeImageOutput,
  cleanSVG,
  type ImageSettings,
  type ImageOutput,
} from "@/lib/image-lab";
type Item = { id: number; file: File };
type Ready = ImageOutput & { url: string; fileId: number };
type View = "original" | "preview" | "final" | "edit";
type Color = { hex: string; rgb: string; alpha: number };
const initial = (mode: ImageToolSlug): ImageSettings => ({
  ...defaultImageSettings,
  format: ["image-compressor", "png-to-jpg"].includes(mode)
    ? "jpeg"
    : mode === "image-to-webp"
      ? "webp"
      : "png",
  amount: ["image-adjustments", "image-grayscale"].includes(mode) ? 100 : 30,
  backgroundSelected: false,
  metadataMode: "preserve",
  signaturePadding: 8,
  restoreStrokes: [],
  text: mode === "image-secret-message" ? "" : "Made by me",
});
const actionNames: Partial<Record<ImageToolSlug, string>> = {
  "image-compressor": "Compress images",
  "image-resizer": "Resize images",
  "image-crop": "Create crop",
  "image-background-remover": "Remove background",
  "favicon-generator": "Generate icons",
  "image-contact-sheet": "Create contact sheet",
  "passport-photo": "Create photo sheets",
  "image-watermark": "Add watermark",
  "image-secret-message": "Hide message",
  "image-rotate": "Rotate and flip images",
  "image-blur": "Blur images",
  "image-pixelate": "Pixelate images",
  "image-grayscale": "Create grayscale images",
  "jpg-to-png": "Convert to PNG",
  "png-to-jpg": "Convert to JPG",
  "image-to-webp": "Convert to WebP",
  "svg-to-image": "Convert SVG to image",
  "svg-cleaner": "Clean SVG",
  "signature-cleaner": "Clean signature",
  "image-id-card": "Create ID card",
  "image-adjustments": "Apply image adjustments",
  "image-sharpen": "Sharpen images",
  "image-metadata-remover": "Remove metadata",
  "image-color-picker": "Export color",
};
export function ImageLabStudio({ mode }: { mode: ImageToolSlug }) {
  const slug = mode,
    tool = imageTools.find((t) => t.slug === slug)!;
  const [settings, setSettings] = useState<ImageSettings>(() => initial(mode)),
    [files, setFiles] = useState<Item[]>([]),
    [active, setActive] = useState(0),
    [source, setSource] = useState<HTMLCanvasElement | null>(null),
    [preview, setPreview] = useState<HTMLCanvasElement | null>(null),
    [finalImage, setFinalImage] = useState<HTMLCanvasElement | null>(null),
    [view, setView] = useState<View>(
      ["image-crop", "passport-photo", "image-blur", "image-pixelate"].includes(
        mode,
      )
        ? "edit"
        : "preview",
    ),
    [outputs, setOutputs] = useState<Ready[]>([]),
    [error, setError] = useState(""),
    [failures, setFailures] = useState<
      { id: number; name: string; message: string }[]
    >([]),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [previewBusy, setPreviewBusy] = useState(false),
    [previewBytes, setPreviewBytes] = useState(0),
    [previewIndex, setPreviewIndex] = useState(0),
    [resultIndex, setResultIndex] = useState(0),
    [ratio, setRatio] = useState(0),
    [aspect, setAspect] = useState(true),
    [noUpscale, setNoUpscale] = useState(false),
    [restore, setRestore] = useState(false),
    [brush, setBrush] = useState(18),
    [color, setColor] = useState<Color | null>(null),
    [capacity, setCapacity] = useState(0),
    [scope, setScope] = useState<"all" | "active">("all"),
    [history, setHistory] = useState<ImageSettings[]>([]),
    [dragOver, setDragOver] = useState(false),
    [logoVersion, setLogoVersion] = useState(0),
    [logoCanvas, setLogoCanvas] = useState<HTMLCanvasElement | null>(null),
    [svgReport, setSvgReport] = useState<{
      raw: string;
      cleaned: string;
      removed: number;
      attributes: number;
    } | null>(null);
  const displayedPreview = useRef<HTMLCanvasElement | null>(null);
  const input = useRef<HTMLInputElement>(null),
    logoInput = useRef<HTMLInputElement>(null),
    logo = useRef<HTMLCanvasElement | null>(null),
    serial = useRef(0),
    generation = useRef(0),
    job = useRef<AbortController | null>(null),
    ready = useRef<Ready[]>([]),
    initialized = useRef(false),
    gesture = useRef(false),
    appendInput = useRef(false),
    current = useRef(settings),
    edits = useRef(
      new Map<
        number,
        Pick<
          ImageSettings,
          "rect" | "point" | "backgroundSelected" | "restoreStrokes"
        >
      >(),
    );
  useEffect(() => {
    current.current = settings;
  }, [settings]);
  const selected = files.find((f) => f.id === active),
    size = { width: source?.width ?? 0, height: source?.height ?? 0 },
    area = [
      "image-crop",
      "image-blur",
      "image-pixelate",
      "passport-photo",
    ].includes(slug),
    activeOutput = outputs[resultIndex];
  const clearResults = useCallback(() => {
    job.current?.abort();
    generation.current++;
    ready.current.forEach((o) => URL.revokeObjectURL(o.url));
    ready.current = [];
    setOutputs([]);
    setFailures([]);
    setBusy(false);
    setError("");
    setNotice("");
  }, []);
  const update = useCallback(
    (patch: Partial<ImageSettings>) => {
      if (!gesture.current)
        setHistory((h) => [...h.slice(-29), current.current]);
      clearResults();
      setSettings((s) => ({ ...s, ...patch }));
    },
    [clearResults],
  );
  function browse(append = false) {
    appendInput.current = append;
    input.current?.click();
  }
  function beginGesture() {
    if (!gesture.current) {
      setHistory((h) => [...h.slice(-29), current.current]);
      gesture.current = true;
    }
  }
  function reset() {
    setHistory((h) => [...h.slice(-29), settings]);
    clearResults();
    setRatio(0);
    setRestore(false);
    setSettings({
      ...initial(mode),
      ...(source
        ? {
            width: source.width,
            height: source.height,
            rect: { x: 0, y: 0, width: source.width, height: source.height },
            point: { x: source.width / 2, y: source.height / 2 },
          }
        : {}),
      ...(slug === "image-contact-sheet" ? { width: 400 } : {}),
    });
  }
  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    clearResults();
    setSettings(previous);
    setHistory((h) => h.slice(0, -1));
  }
  function choose(list: File[], append = false) {
    if (!list.length) return;
    if (list.length + (append ? files.length : 0) > 20) {
      setError(
        "Choose up to 20 images in a workspace. Your existing images have been kept.",
      );
      return;
    }
    clearResults();
    const next = list.map((file) => ({ id: ++serial.current, file }));
    if (!append) {
      initialized.current = false;
      edits.current.clear();
      setHistory([]);
      setFiles(next);
      setActive(next[0].id);
      setPreviewIndex(0);
      setResultIndex(0);
      setColor(null);
    } else {
      setFiles((f) => [...f, ...next]);
      setNotice(
        next.length + " image" + (next.length === 1 ? "" : "s") + " added",
      );
    }
  }
  function selectFile(id: number) {
    if (id === active) return;
    edits.current.set(active, {
      rect: settings.rect,
      point: settings.point,
      backgroundSelected: settings.backgroundSelected,
      restoreStrokes: settings.restoreStrokes,
    });
    if (job.current) clearResults();
    setHistory([]);
    setActive(id);
    setRestore(false);
    setColor(null);
    setView(area ? "edit" : "preview");
  }
  function removeFile(id: number) {
    if (job.current) clearResults();
    else {
      const keep = ready.current.filter((o) => o.fileId !== id);
      ready.current
        .filter((o) => o.fileId === id)
        .forEach((o) => URL.revokeObjectURL(o.url));
      ready.current = keep;
      setOutputs(keep);
      setFailures((f) => f.filter((x) => x.id !== id));
      setResultIndex(0);
      setError("");
    }
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    edits.current.delete(id);
    if (id === active) {
      setActive(next[0]?.id ?? 0);
      setHistory([]);
    }
    if (!next.length) initialized.current = false;
  }
  function reorder(id: number, delta: number) {
    clearResults();
    setFiles((items) => {
      const next = [...items],
        at = next.findIndex((f) => f.id === id),
        target = Math.max(0, Math.min(next.length - 1, at + delta));
      [next[at], next[target]] = [next[target], next[at]];
      return next;
    });
  }
  useEffect(() => {
    let canceled = false,
      decoded: HTMLCanvasElement | undefined;
    queueMicrotask(() => {
      if (!canceled) {
        setSource(null);
        setSvgReport(null);
      }
    });
    if (!selected) return;
    void openImage(selected.file)
      .then(async (canvas) => {
        decoded = canvas;
        if (canceled) {
          canvas.width = 0;
          return;
        }
        const saved = edits.current.get(selected.id);
        setSource(canvas);
        setSettings((s) => ({
          ...s,
          ...(!initialized.current
            ? {
                width: slug === "image-contact-sheet" ? 400 : canvas.width,
                height: canvas.height,
                format: ["image-compressor", "png-to-jpg"].includes(slug)
                  ? "jpeg"
                  : slug === "image-to-webp"
                    ? "webp"
                    : "png",
              }
            : {}),
          rect: saved?.rect ?? {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
          },
          point: saved?.point ?? { x: canvas.width / 2, y: canvas.height / 2 },
          backgroundSelected: saved?.backgroundSelected ?? false,
          restoreStrokes: saved?.restoreStrokes ?? [],
        }));
        initialized.current = true;
        setCapacity(
          slug === "image-secret-message"
            ? opaqueCapacity(
                canvas
                  .getContext("2d")!
                  .getImageData(0, 0, canvas.width, canvas.height),
              )
            : 0,
        );
        setError("");
        if (
          /\.svg$/i.test(selected.file.name) ||
          selected.file.type === "image/svg+xml"
        ) {
          const raw = await selected.file.text(),
            cleaned = cleanSVG(raw),
            a = new DOMParser().parseFromString(raw, "image/svg+xml"),
            b = new DOMParser().parseFromString(cleaned, "image/svg+xml");
          if (!canceled)
            setSvgReport({
              raw,
              cleaned,
              removed:
                a.querySelectorAll("*").length - b.querySelectorAll("*").length,
              attributes:
                [...a.querySelectorAll("*")].reduce(
                  (n, e) => n + e.attributes.length,
                  0,
                ) -
                [...b.querySelectorAll("*")].reduce(
                  (n, e) => n + e.attributes.length,
                  0,
                ),
            });
        }
      })
      .catch((e) => {
        if (!canceled) {
          setError(
            e instanceof Error ? e.message : "This image could not be opened.",
          );
          setSource(null);
        }
      });
    return () => {
      canceled = true;
      if (decoded) decoded.width = 0;
    };
    // Active inspection never resets shared target dimensions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);
  function effective(s: ImageSettings, canvas: HTMLCanvasElement) {
    if (noUpscale && ["image-resizer", "svg-to-image"].includes(slug)) {
      const scale = Math.min(
        1,
        s.width / canvas.width,
        s.height / canvas.height,
      );
      return {
        ...s,
        width: Math.max(1, Math.round(canvas.width * scale)),
        height: Math.max(1, Math.round(canvas.height * scale)),
      };
    }
    return s;
  }
  useEffect(() => {
    let canceled = false,
      rendered: HTMLCanvasElement | undefined;
    queueMicrotask(() => {
      if (!canceled) {
        setPreviewBusy(!!source);
        setPreviewBytes(0);
        if (!source) {
          setPreview(null);
          if (displayedPreview.current) displayedPreview.current.width = 0;
          displayedPreview.current = null;
        }
      }
    });
    const timer = setTimeout(() => {
      if (!source || !selected) return;
      void (async () => {
        try {
          let output: ImageOutput | undefined;
          if (slug === "image-contact-sheet")
            output = await contactSheet(
              files.map((x) => x.file),
              settings,
            );
          else if (
            ["image-secret-message", "image-color-picker"].includes(slug) ||
            restore
          )
            rendered = renderImage(source, "jpg-to-png", {
              ...settings,
              format: "png",
            });
          else {
            const candidates = await imageOutputs(
              source,
              selected.file,
              slug,
              effective(settings, source),
              logo.current ?? undefined,
            );
            output =
              candidates[
                slug === "favicon-generator"
                  ? 6
                  : Math.min(previewIndex, candidates.length - 1)
              ];
          }
          if (output && output.blob.type.startsWith("image/")) {
            rendered = await decodeImageOutput(output.blob);
            if (!canceled) setPreviewBytes(output.blob.size);
          }
          if (canceled) {
            if (rendered && rendered !== displayedPreview.current)
              rendered.width = 0;
            return;
          }
          if (rendered) {
            const previous = displayedPreview.current;
            displayedPreview.current = rendered;
            setPreview(rendered);
            if (previous && previous !== rendered) previous.width = 0;
          }
          setPreviewBusy(false);
        } catch (e) {
          if (!canceled) {
            setPreviewBusy(false);
            setError(e instanceof Error ? e.message : "Preview unavailable.");
          }
        }
      })();
    }, 180);
    return () => {
      canceled = true;
      clearTimeout(timer);
      if (rendered && rendered !== displayedPreview.current) rendered.width = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, settings, files, previewIndex, logoVersion, noUpscale, restore]);
  useEffect(() => {
    let canceled = false,
      decoded: HTMLCanvasElement | undefined;
    queueMicrotask(() => {
      if (!canceled) setFinalImage(null);
    });
    if (
      activeOutput?.blob.type.startsWith("image/") &&
      activeOutput.blob.type !== "image/x-icon"
    ) {
      void decodeImageOutput(activeOutput.blob)
        .then((canvas) => {
          decoded = canvas;
          if (canceled) canvas.width = 0;
          else setFinalImage(canvas);
        })
        .catch(() => {});
    }
    return () => {
      canceled = true;
      if (decoded) decoded.width = 0;
    };
  }, [activeOutput]);
  useEffect(() => {
    const paste = (e: ClipboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))
        return;
      const items = [...(e.clipboardData?.files ?? [])].filter((f) =>
        f.type.startsWith("image/"),
      );
      if (items.length) {
        e.preventDefault();
        choose(items, files.length > 0);
      }
    };
    window.addEventListener("paste", paste);
    return () => window.removeEventListener("paste", paste);
  });
  useEffect(
    () => () => {
      job.current?.abort();
      generation.current++;
      ready.current.forEach((o) => URL.revokeObjectURL(o.url));
      if (logo.current) logo.current.width = 0;
      if (displayedPreview.current) displayedPreview.current.width = 0;
    },
    [],
  );
  function sample(x: number, y: number) {
    if (!source) return;
    const px = Math.max(0, Math.min(source.width - 1, Math.round(x))),
      py = Math.max(0, Math.min(source.height - 1, Math.round(y))),
      d = source.getContext("2d")!.getImageData(px, py, 1, 1).data;
    clearResults();
    setSettings((s) => ({ ...s, point: { x: px, y: py } }));
    setColor({
      hex:
        "#" +
        [...d.slice(0, 3)].map((v) => v.toString(16).padStart(2, "0")).join(""),
      rgb: [...d.slice(0, 3)].join(", "),
      alpha: d[3],
    });
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice("Copied");
    } catch {
      setNotice(
        "Copy is unavailable here. Select the displayed value to copy it.",
      );
    }
  }
  async function run(only?: number[]) {
    if (!source || !selected) return;
    if (slug === "image-background-remover" && !settings.backgroundSelected) {
      setError("Choose a background sample first.");
      return;
    }
    if (slug === "image-color-picker" && !color) {
      setError("Choose a pixel or enter sample coordinates first.");
      return;
    }
    const retained = only
      ? outputs.filter((o) => !only.includes(o.fileId))
      : [];
    clearResults();
    const id = generation.current,
      controller = new AbortController();
    job.current = controller;
    setBusy(true);
    const result: Ready[] = retained.map((o) => ({
        ...o,
        url: URL.createObjectURL(o.blob),
      })),
      failed: { id: number; name: string; message: string }[] = [];
    const targets = only
      ? files.filter((f) => only.includes(f.id))
      : scope === "active" && slug !== "image-contact-sheet"
        ? files.filter((f) => f.id === active)
        : files;
    let canceled = false;
    const add = (items: ImageOutput[], fileId: number) => {
      for (const o of items)
        result.push({ ...o, fileId, url: URL.createObjectURL(o.blob) });
    };
    try {
      if (slug === "image-color-picker") {
        add(
          [
            {
              blob: new Blob(
                [
                  JSON.stringify(
                    {
                      hex: color!.hex,
                      rgb: color!.rgb.split(", ").map(Number),
                      alpha: color!.alpha,
                      x: Math.round(settings.point.x),
                      y: Math.round(settings.point.y),
                    },
                    null,
                    2,
                  ),
                ],
                { type: "application/json" },
              ),
              name: "sampled-color.json",
              note: color!.hex,
            },
          ],
          active,
        );
      } else if (slug === "image-contact-sheet") {
        const valid: File[] = [];
        for (const item of targets) {
          controller.signal.throwIfAborted();
          setNotice(
            "Checking " +
              (valid.length + failed.length + 1) +
              " of " +
              targets.length,
          );
          try {
            if (item.id !== active) {
              const decoded = await openImage(item.file);
              decoded.width = 0;
            }
            valid.push(item.file);
          } catch (e) {
            failed.push({
              id: item.id,
              name: item.file.name,
              message: e instanceof Error ? e.message : "Could not open image.",
            });
          }
        }
        if (valid.length)
          add([await contactSheet(valid, settings, controller.signal)], active);
      } else
        for (let i = 0; i < targets.length; i++) {
          controller.signal.throwIfAborted();
          const item = targets[i];
          setNotice("Processing " + (i + 1) + " of " + targets.length);
          let canvas: HTMLCanvasElement | undefined;
          try {
            canvas = item.id === active ? source : await openImage(item.file);
            const sx = canvas.width / source.width,
              sy = canvas.height / source.height,
              s =
                item.id === active
                  ? settings
                  : {
                      ...settings,
                      rect: {
                        x: Math.round(settings.rect.x * sx),
                        y: Math.round(settings.rect.y * sy),
                        width: Math.round(settings.rect.width * sx),
                        height: Math.round(settings.rect.height * sy),
                      },
                      point: {
                        x: settings.point.x * sx,
                        y: settings.point.y * sy,
                      },
                      restoreStrokes:
                        edits.current.get(item.id)?.restoreStrokes ?? [],
                    };
            const items = await imageOutputs(
              canvas,
              item.file,
              slug,
              effective(s, canvas),
              logo.current ?? undefined,
            );
            add(
              packageImageOutputs(
                items,
                slug,
                item.file,
                files.findIndex((f) => f.id === item.id),
                files.length,
              ),
              item.id,
            );
          } catch (e) {
            if (controller.signal.aborted) throw e;
            failed.push({
              id: item.id,
              name: item.file.name,
              message: e instanceof Error ? e.message : "Processing failed.",
            });
          } finally {
            if (canvas && canvas !== source) canvas.width = 0;
          }
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
    } catch (e) {
      if (controller.signal.aborted) canceled = true;
      else setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      if (generation.current !== id) {
        result.forEach((o) => URL.revokeObjectURL(o.url));
        return;
      }
      ready.current = result;
      setOutputs(result);
      setFailures(failed);
      setResultIndex(
        slug === "favicon-generator" ? Math.min(6, result.length - 1) : 0,
      );
      setView("final");
      setBusy(false);
      job.current = null;
      const completedIds = new Set(result.map((o) => o.fileId));
      const originalBytes = files
        .filter((f) => completedIds.has(f.id))
        .reduce((n, f) => n + f.file.size, 0);
      const resultBytes = result.reduce((n, o) => n + o.blob.size, 0);
      const sizeFeedback =
        slug === "image-compressor" && originalBytes > 0 && result.length > 0
          ? resultBytes < originalBytes
            ? ` · ${Math.round((1 - resultBytes / originalBytes) * 100)}% smaller than the original${completedIds.size === 1 ? "" : "s"}`
            : " · No size reduction. Try a lower quality or a different format."
          : "";
      setNotice(
        (canceled ? "Stopped · " : "") +
          result.length +
          " file" +
          (result.length === 1 ? "" : "s") +
          " ready" +
          (failed.length ? " · " + failed.length + " need attention" : "") +
          sizeFeedback,
      );
    }
  }
  async function zip() {
    const id = generation.current;
    setBusy(true);
    setNotice("Packing your files…");
    try {
      const { default: JSZip } = await import("jszip"),
        archive = new JSZip();
      outputs.forEach((o) => archive.file(o.name, o.blob));
      const blob = await archive.generateAsync({ type: "blob" });
      if (generation.current !== id) return;
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = slug + "-results.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setNotice("Download started · check your browser’s downloads");
    } catch {
      setError("ZIP creation failed. Individual files are still available.");
    } finally {
      if (generation.current === id) setBusy(false);
    }
  }
  const shown =
      view === "final"
        ? (finalImage ?? source)
        : view === "original" || view === "edit" || restore
          ? source
          : preview,
    hasImage = !!source;
  const empty = (
    <div className="iw-empty">
      <div className="iw-empty-art" aria-hidden="true">
        <ImageIcon size={35} />
        <i />
        <span>✦</span>
      </div>
      <span className="iw-eyebrow">YOUR EVERYDAY IMAGE STUDIO</span>
      <h2>{tool.title}</h2>
      <p>{tool.description}</p>
      <button className="iw-primary" onClick={() => browse()}>
        <Upload size={17} />
        Choose images
      </button>
      <small>
        Or drop or paste here · up to 20 files · 25 MB each
        <br />
        JPG, PNG, WebP, SVG, GIF, BMP, AVIF · still-image editing
      </small>
      <span className="iw-empty-trust">
        <ShieldCheck size={14} />
        Image processing stays on your device
      </span>
    </div>
  );
  const controls = (
    <ImageToolSettings
      slug={slug}
      s={settings}
      size={size}
      update={(patch) => {
        update(patch);
        if (patch.rect && area) setView("edit");
      }}
      ratio={ratio}
      setRatio={setRatio}
      aspect={aspect}
      setAspect={setAspect}
      percent={source ? Math.round((settings.width / source.width) * 100) : 100}
      resizePercent={(n) => {
        if (source)
          update({
            width: Math.min(
              8192,
              Math.max(1, Math.round((source.width * n) / 100)),
            ),
            height: Math.min(
              8192,
              Math.max(1, Math.round((source.height * n) / 100)),
            ),
          });
      }}
      noUpscale={noUpscale}
      setNoUpscale={(v) => {
        clearResults();
        setNoUpscale(v);
      }}
      logo={!!logoCanvas}
      chooseLogo={() => logoInput.current?.click()}
      clearLogo={() => {
        if (logo.current) logo.current.width = 0;
        logo.current = null;
        setLogoCanvas(null);
        setLogoVersion((v) => v + 1);
        clearResults();
      }}
      color={color}
      sample={sample}
      copy={(v) => void copy(v)}
      capacity={capacity}
      restore={restore}
      setRestore={(v) => {
        setRestore(v);
        setView(v ? "original" : "preview");
      }}
      brush={brush}
      setBrush={setBrush}
      batch={files.length > 1}
      scope={scope}
      setScope={(v) => {
        clearResults();
        setScope(v);
      }}
      previewIndex={previewIndex}
      setPreviewIndex={(v) => {
        setPreviewIndex(v);
        setView("preview");
      }}
    />
  );
  const actions = (
    <>
      {error && (
        <p role="alert" className="iw-error">
          {error}
        </p>
      )}
      {busy ? (
        <>
          <button className="iw-primary" disabled>
            <LoaderCircle size={17} className="iw-spin" />
            Working…
          </button>
          <button className="iw-secondary" onClick={() => job.current?.abort()}>
            Stop processing
          </button>
        </>
      ) : outputs.length > 0 ? (
        <>
          {outputs.length > 1 ? (
            <button className="iw-primary" onClick={() => void zip()}>
              <Download size={17} />
              Download all ({outputs.length}) · ZIP
            </button>
          ) : (
            <a
              className="iw-primary"
              href={outputs[0].url}
              download={outputs[0].name}
              onClick={() =>
                setNotice("Download started · check your browser’s downloads")
              }
            >
              <Download size={17} />
              Download{" "}
              {outputs[0].blob.type === "image/jpeg"
                ? "JPG"
                : (outputs[0].name.split(".").at(-1)?.toUpperCase() ?? "file")}
            </a>
          )}
          <button className="iw-reprocess" onClick={() => void run()}>
            <RefreshCw size={13} />
            Process again
          </button>
        </>
      ) : (
        <button
          className="iw-primary"
          disabled={!hasImage}
          onClick={() => void run()}
        >
          <Check size={17} />
          {slug === "image-secret-message" && settings.extract
            ? "Read message"
            : (actionNames[slug] ?? "Create result")}
        </button>
      )}
      <p className="iw-status" role="status" aria-live="polite">
        {notice ||
          (!hasImage
            ? "Choose an image to begin"
            : previewBusy
              ? "Updating encoded preview…"
              : previewBytes
                ? "Preview · " + (previewBytes / 1000).toFixed(1) + " KB"
                : "Original stays intact")}
      </p>
      {failures.length > 0 && (
        <details className="iw-failures" open>
          <summary>
            {failures.length} image{failures.length === 1 ? "" : "s"} need
            attention
          </summary>
          {failures.map((f) => (
            <p key={f.id}>
              <b>{f.name}</b>
              <br />
              {f.message}
              <button onClick={() => removeFile(f.id)}>
                Remove this image
              </button>
            </p>
          ))}
          {slug !== "image-contact-sheet" && (
            <button
              className="iw-secondary"
              onClick={() => void run(failures.map((f) => f.id))}
            >
              Retry failed images
            </button>
          )}
        </details>
      )}
      {outputs.length > 1 && (
        <details className="iw-file-downloads">
          <summary>Individual downloads</summary>
          {outputs.map((o) => (
            <a key={o.url} href={o.url} download={o.name}>
              <Download size={13} />
              <span>
                {o.name}
                <small>{(o.blob.size / 1000).toFixed(1)} KB</small>
              </span>
            </a>
          ))}
        </details>
      )}
    </>
  );
  const guide = [
    "image-compressor",
    "png-to-jpg",
    "image-to-webp",
    "jpg-to-png",
  ].includes(slug)
    ? "image-formats"
    : slug === "image-resizer" || slug === "image-crop"
      ? "resize-or-crop"
      : slug === "svg-cleaner" || slug === "svg-to-image"
        ? "safe-svg"
        : [
              "favicon-generator",
              "signature-cleaner",
              "image-background-remover",
            ].includes(slug)
          ? slug
          : undefined;
  return (
    <ImageWorkspace
      title={tool.title}
      controls={controls}
      actions={actions}
      onReset={reset}
      onUndo={undo}
      canUndo={history.length > 0}
      help={guide ? "/lab/guides/" + guide : undefined}
    >
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/bmp,image/avif"
        multiple
        hidden
        onChange={(e) => {
          choose([...(e.target.files ?? [])], appendInput.current);
          e.target.value = "";
        }}
      />
      <input
        ref={logoInput}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file)
            void openImage(file)
              .then((c) => {
                if (logo.current) logo.current.width = 0;
                logo.current = c;
                setLogoCanvas(c);
                setLogoVersion((v) => v + 1);
                clearResults();
                setNotice("Logo loaded");
              })
              .catch((e) => setError(String(e)));
          e.target.value = "";
        }}
      />
      <div
        className={"iw-canvas-area" + (dragOver ? " iw-dragover" : "")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          choose([...e.dataTransfer.files], files.length > 0);
        }}
      >
        {hasImage && (
          <div className="iw-stage-top">
            <span className="iw-filename">{selected?.file.name}</span>
            <div className="iw-view-tabs" aria-label="Image view">
              {(
                [
                  "original",
                  ...(area ? ["edit"] : []),
                  "preview",
                  ...(outputs.length ? ["final"] : []),
                ] as View[]
              ).map((v) => (
                <button
                  key={v}
                  aria-pressed={view === v}
                  onClick={() => {
                    setView(v);
                    if (v !== "original") setRestore(false);
                  }}
                >
                  {v === "original"
                    ? svgReport
                      ? "Safe source"
                      : "Original"
                    : v === "edit"
                      ? "Select area"
                      : v === "final"
                        ? "Final result"
                        : "Preview"}
                </button>
              ))}
            </div>
            <button className="iw-replace" onClick={() => browse(false)}>
              Choose new images
            </button>
          </div>
        )}
        <ImageViewport
          image={shown}
          rect={
            view === "edit" && area
              ? clampRect(settings.rect, size.width, size.height)
              : undefined
          }
          ratio={ratio}
          onRect={
            view === "edit" && area
              ? (r) => update({ rect: clampRect(r, size.width, size.height) })
              : undefined
          }
          onPoint={
            hasImage &&
            (view === "original" || view === "preview" || view === "edit") &&
            !restore &&
            [
              "image-watermark",
              "image-background-remover",
              "image-color-picker",
            ].includes(slug)
              ? (p) => {
                  if (slug === "image-color-picker") sample(p.x, p.y);
                  else update({ point: p, backgroundSelected: true });
                }
              : undefined
          }
          pointDrag={slug === "image-watermark"}
          point={
            (slug === "image-color-picker" && color) ||
            (slug === "image-background-remover" && settings.backgroundSelected)
              ? settings.point
              : undefined
          }
          onStroke={
            restore
              ? (p) =>
                  update({
                    restoreStrokes: [
                      ...(current.current.restoreStrokes ?? []),
                      { ...p, radius: brush / 2 },
                    ],
                  })
              : undefined
          }
          onStart={beginGesture}
          onEnd={() => {
            gesture.current = false;
          }}
          label={
            view === "edit"
              ? "Original image with editable selection. Numeric selection controls are in settings."
              : view === "final"
                ? "Final processed image decoded from the download."
                : view === "preview"
                  ? "Encoded preview. Changes are applied only to exported copies."
                  : "Original decoded image."
          }
          empty={
            source ? undefined : selected ? (
              <div className="iw-empty">
                <LoaderCircle className="iw-spin" />
                <p>
                  {error
                    ? "This image could not be opened."
                    : "Opening your image…"}
                </p>
                {error && (
                  <button
                    className="iw-secondary"
                    onClick={() => browse(false)}
                  >
                    Choose another image
                  </button>
                )}
              </div>
            ) : (
              empty
            )
          }
          addControl={
            files.length ? (
              <button onClick={() => browse(true)} aria-label="Add images">
                <Plus size={17} />
                <span>Add images</span>
              </button>
            ) : undefined
          }
        />
        {hasImage && (
          <div className="iw-stage-bottom">
            <span>
              {view === "final" && activeOutput
                ? `${activeOutput.width ?? size.width} × ${activeOutput.height ?? size.height} px · ${(activeOutput.blob.size / 1000).toFixed(1)} KB`
                : `${size.width} × ${size.height} px · ${((selected?.file.size ?? 0) / 1000).toFixed(1)} KB original`}
            </span>
            <span>
              {view === "final"
                ? activeOutput?.blob.type.startsWith("image/")
                  ? "Finished result · ready to download"
                  : "Text result · original shown"
                : view === "edit"
                  ? "Drag selection or handles"
                  : restore
                    ? "Paint to restore original pixels"
                    : previewBusy
                      ? "Updating preview…"
                      : previewBytes
                        ? `Encoded preview · ${(previewBytes / 1000).toFixed(1)} KB`
                        : "Original stays intact"}
            </span>
          </div>
        )}
      </div>
      {files.length > 1 && (
        <div className="iw-files" aria-label="Workspace images">
          {files.map((f, i) => (
            <div
              className={"iw-file" + (f.id === active ? " iw-file-active" : "")}
              key={f.id}
            >
              <button
                aria-pressed={f.id === active}
                onClick={() => selectFile(f.id)}
                aria-label={"Preview " + f.file.name}
              >
                <span>{i + 1}</span>
                {f.file.name}
              </button>
              {slug === "image-contact-sheet" && (
                <>
                  <button
                    aria-label={"Move " + f.file.name + " earlier"}
                    disabled={i === 0}
                    onClick={() => reorder(f.id, -1)}
                  >
                    <ArrowLeft size={13} />
                  </button>
                  <button
                    aria-label={"Move " + f.file.name + " later"}
                    disabled={i === files.length - 1}
                    onClick={() => reorder(f.id, 1)}
                  >
                    <ArrowRight size={13} />
                  </button>
                </>
              )}
              <button
                aria-label={"Remove " + f.file.name}
                onClick={() => removeFile(f.id)}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      {outputs.length > 1 && view === "final" && (
        <div className="iw-results-strip" aria-label="Generated results">
          {outputs
            .filter((o) => o.width)
            .map((o) => (
              <button
                key={o.url}
                aria-pressed={o === activeOutput}
                onClick={() => setResultIndex(outputs.indexOf(o))}
              >
                {slug === "favicon-generator"
                  ? o.width + " px"
                  : o.name.includes("sheet")
                    ? "Photo sheet"
                    : o.name}
                <small>
                  {o.width} × {o.height}
                </small>
              </button>
            ))}
        </div>
      )}
      {view === "final" && activeOutput?.note && (
        <p className="iw-result-note">{activeOutput.note}</p>
      )}
      {svgReport && (
        <details className="iw-svg-report">
          <summary>
            SVG cleanup report · {svgReport.removed} elements and{" "}
            {Math.max(0, svgReport.attributes)} attributes removed
          </summary>
          <p>
            The source preview is sanitized for safe decoding. Compare the text
            below to inspect changes. Showing at most 20,000 characters per
            version.
          </p>
          <div>
            <section>
              <h3>Source markup</h3>
              <pre>{svgReport.raw.slice(0, 20000)}</pre>
            </section>
            <section>
              <h3>Cleaned markup</h3>
              <pre>{svgReport.cleaned.slice(0, 20000)}</pre>
            </section>
          </div>
        </details>
      )}
    </ImageWorkspace>
  );
}
