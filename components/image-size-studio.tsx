"use client";
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Download,
  LoaderCircle,
  Image as ImageIcon,
} from "lucide-react";
import { fitImage, type SizedImage } from "@/lib/image-size";
import { decodePhoto } from "@/lib/mobile-image";
import { decodeImageOutput } from "@/lib/image-lab";
import { ImageWorkspace } from "./image-workspace";
import { ImageViewport } from "./image-viewport";
export function ImageSizeStudio() {
  const [file, setFile] = useState<File>(),
    [limit, setLimit] = useState("200"),
    [format, setFormat] = useState<"jpeg" | "png">("jpeg"),
    [width, setWidth] = useState(""),
    [height, setHeight] = useState(""),
    [result, setResult] = useState<SizedImage>(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [source, setSource] = useState<HTMLCanvasElement | null>(null),
    [final, setFinal] = useState<HTMLCanvasElement | null>(null),
    [view, setView] = useState<"original" | "final">("original"),
    [url, setURL] = useState(""),
    [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const input = useRef<HTMLInputElement>(null),
    job = useRef<AbortController | null>(null);
  useEffect(() => () => job.current?.abort(), []);
  useEffect(() => {
    if (!file) return;
    let alive = true,
      c: HTMLCanvasElement | undefined;
    queueMicrotask(() => {
      if (alive) setSource(null);
    });
    void decodePhoto(file)
      .then((image) => {
        try {
          if (!alive) return;
          if (image.width * image.height > 40000000)
            throw new Error("Use an image below 40 megapixels.");
          const scale = Math.min(1, 4096 / Math.max(image.width, image.height));
          c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(image.width * scale));
          c.height = Math.max(1, Math.round(image.height * scale));
          c.getContext("2d")!.drawImage(image.source, 0, 0, c.width, c.height);
          setDimensions({ width: image.width, height: image.height });
          setSource(c);
        } finally {
          image.close();
        }
      })
      .catch((e) => {
        if (alive)
          setError(
            e instanceof Error ? e.message : "Could not open this image.",
          );
      });
    return () => {
      alive = false;
      if (c) c.width = 0;
    };
  }, [file]);
  useEffect(() => {
    if (!result) {
      queueMicrotask(() => {
        setFinal(null);
        setURL("");
      });
      return;
    }
    const next = URL.createObjectURL(result.blob);
    queueMicrotask(() => {
      if (alive) setURL(next);
    });
    let alive = true,
      c: HTMLCanvasElement | undefined;
    void decodeImageOutput(result.blob)
      .then((image) => {
        c = image;
        if (alive) setFinal(image);
        else image.width = 0;
      })
      .catch((e) => {
        if (alive) setError(String(e));
      });
    return () => {
      alive = false;
      URL.revokeObjectURL(next);
      if (c) c.width = 0;
    };
  }, [result]);
  function invalidate() {
    job.current?.abort();
    job.current = null;
    setBusy(false);
    setResult(undefined);
    setError("");
    setView("original");
  }
  function choose(next?: File) {
    if (!next) return;
    invalidate();
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (next.size > 25 * 1024 * 1024) {
      setError("Choose an image smaller than 25 MB.");
      return;
    }
    setFile(next);
  }
  async function run() {
    if (!file) return;
    invalidate();
    const controller = new AbortController();
    job.current = controller;
    setBusy(true);
    try {
      const output = await fitImage(
        file,
        {
          limitKB: Number(limit),
          format,
          maxWidth: width ? Number(width) : undefined,
          maxHeight: height ? Number(height) : undefined,
        },
        controller.signal,
      );
      if (job.current === controller) {
        setResult(output);
        setView("final");
      }
    } catch (e) {
      if (job.current === controller && !controller.signal.aborted)
        setError(
          e instanceof Error ? e.message : "Could not reduce image size.",
        );
    } finally {
      if (job.current === controller) {
        setBusy(false);
        job.current = null;
      }
    }
  }
  const controls = (
    <>
      <label>
        Maximum file size (KB)
        <input
          type="number"
          min="1"
          max="10000"
          value={limit}
          onChange={(e) => {
            invalidate();
            setLimit(e.target.value);
          }}
        />
      </label>
      <div className="iw-presets">
        {[20, 50, 100, 200, 300].map((kb) => (
          <button
            key={kb}
            aria-pressed={limit === String(kb)}
            onClick={() => {
              invalidate();
              setLimit(String(kb));
            }}
          >
            {kb}
          </button>
        ))}
      </div>
      <label>
        Output format
        <select
          value={format}
          onChange={(e) => {
            invalidate();
            setFormat(e.target.value as "jpeg" | "png");
          }}
        >
          <option value="jpeg">JPG · white background</option>
          <option value="png">PNG · keep transparency</option>
        </select>
      </label>
      <details>
        <summary>Optional pixel limits</summary>
        <div className="iw-pair">
          <label>
            Max width
            <input
              type="number"
              min="32"
              max="10000"
              placeholder="Original"
              value={width}
              onChange={(e) => {
                invalidate();
                setWidth(e.target.value);
              }}
            />
          </label>
          <label>
            Max height
            <input
              type="number"
              min="32"
              max="10000"
              placeholder="Original"
              value={height}
              onChange={(e) => {
                invalidate();
                setHeight(e.target.value);
              }}
            />
          </label>
        </div>
      </details>
      <p className="iw-hint">
        Keeps proportions and never enlarges. Meeting a strict file limit can
        reduce dimensions. 1 KB = 1,000 bytes.
      </p>
      <p className="iw-hint">
        JPG uses a white matte; PNG preserves transparency. Inspect faces and
        signature lines before uploading.
      </p>
    </>
  );
  const actions = (
    <>
      {error && (
        <p className="iw-error" role="alert">
          {error}
        </p>
      )}
      {busy ? (
        <>
          <button className="iw-primary" disabled>
            <LoaderCircle className="iw-spin" size={17} />
            Making it fit…
          </button>
          <button
            className="iw-secondary"
            onClick={() => {
              job.current?.abort();
              job.current = null;
              setBusy(false);
            }}
          >
            Stop processing
          </button>
        </>
      ) : result && url ? (
        <>
          <a
            className="iw-primary"
            href={url}
            download={
              (file?.name.replace(/\.[^.]+$/, "") ?? "image") +
              (result.met ? "-under-" + limit + "kb" : "-smallest-result") +
              "." +
              (format === "jpeg" ? "jpg" : "png")
            }
          >
            <Download size={17} />
            {result.met ? "Download image" : "Download smallest result"}
          </a>
          <button className="iw-reprocess" onClick={() => void run()}>
            Process again
          </button>
        </>
      ) : (
        <button
          className="iw-primary"
          disabled={!source}
          onClick={() => void run()}
        >
          Reduce image size
        </button>
      )}
      <p className="iw-status" role="status">
        {result
          ? `${result.met ? "Below " + limit + " KB" : "Limit not reached"} · ${result.blob.size.toLocaleString()} bytes · ${result.width} × ${result.height} px${result.original ? " · original already fits" : ""}`
          : file
            ? `${(file.size / 1000).toFixed(1)} KB original · maximum 25 MB`
            : "Choose a photo or signature to begin"}
      </p>
      {result && !result.met && (
        <p className="iw-hint">
          Try JPG or a larger limit. This is the smallest tested result.
        </p>
      )}
    </>
  );
  return (
    <ImageWorkspace
      title="Photo & signature size reducer"
      controls={controls}
      actions={actions}
      help="/lab/guides/image-size-reducer"
      onReset={() => {
        invalidate();
        setLimit("200");
        setFormat("jpeg");
        setWidth("");
        setHeight("");
      }}
    >
      <input
        ref={input}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          choose(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div
        className="iw-canvas-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          choose(e.dataTransfer.files[0]);
        }}
      >
        {file && (
          <div className="iw-stage-top">
            <span className="iw-filename">{file.name}</span>
            <div className="iw-view-tabs">
              <button
                aria-pressed={view === "original"}
                onClick={() => setView("original")}
              >
                Original
              </button>
              {result && (
                <button
                  aria-pressed={view === "final"}
                  onClick={() => setView("final")}
                >
                  Final result
                </button>
              )}
            </div>
          </div>
        )}
        <ImageViewport
          image={view === "final" ? final : source}
          label={
            view === "final"
              ? "Final file decoded from the download"
              : "Original image preview"
          }
          addControl={
            file ? (
              <button
                onClick={() => input.current?.click()}
                aria-label="Replace image"
              >
                <Upload size={16} />
                <span>Replace image</span>
              </button>
            ) : undefined
          }
          empty={
            <div className="iw-empty">
              <div className="iw-empty-art">
                <ImageIcon size={36} />
              </div>
              <h2>A smaller file. A clearer workspace.</h2>
              <p>
                Fit a photo or signature to your upload limit, then inspect the
                actual result.
              </p>
              <button
                className="iw-primary"
                onClick={() => input.current?.click()}
              >
                <Upload size={17} />
                Choose an image
              </button>
              <small>JPG, PNG or WebP · up to 25 MB</small>
            </div>
          }
        />
        {file && (
          <div className="iw-stage-bottom">
            <span>
              {dimensions.width} × {dimensions.height} px original
            </span>
            <span>
              {view === "final"
                ? "Final downloaded pixels"
                : Math.max(dimensions.width, dimensions.height) > 4096
                  ? "Original preview scaled to 4096 px"
                  : "Original stays intact"}
            </span>
          </div>
        )}
      </div>
    </ImageWorkspace>
  );
}
