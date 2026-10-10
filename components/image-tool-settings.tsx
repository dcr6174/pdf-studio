"use client";
import Link from "./browser-link";
import { Upload, Copy } from "lucide-react";
import type { ImageSettings, Rect } from "@/lib/image-lab";
import type { ImageToolSlug } from "@/lib/image-tools";
type Props = {
  slug: ImageToolSlug;
  s: ImageSettings;
  size: { width: number; height: number };
  update: (patch: Partial<ImageSettings>) => void;
  ratio: number;
  setRatio: (r: number) => void;
  aspect: boolean;
  setAspect: (a: boolean) => void;
  percent: number;
  resizePercent: (n: number) => void;
  noUpscale: boolean;
  setNoUpscale: (v: boolean) => void;
  logo: boolean;
  chooseLogo: () => void;
  clearLogo: () => void;
  color: { hex: string; rgb: string; alpha: number } | null;
  sample: (x: number, y: number) => void;
  copy: (value: string) => void;
  capacity: number;
  restore: boolean;
  setRestore: (b: boolean) => void;
  brush: number;
  setBrush: (v: number) => void;
  batch: boolean;
  scope: "all" | "active";
  setScope: (v: "all" | "active") => void;
  previewIndex: number;
  setPreviewIndex: (n: number) => void;
};
export function ImageToolSettings(p: Props) {
  const { slug, s, size, update } = p,
    area = [
      "image-crop",
      "image-blur",
      "image-pixelate",
      "passport-photo",
    ].includes(slug),
    dimension = ["image-resizer", "svg-to-image"].includes(slug),
    noFormat =
      [
        "svg-cleaner",
        "image-secret-message",
        "favicon-generator",
        "image-color-picker",
        "image-contact-sheet",
      ].includes(slug) ||
      (slug === "image-metadata-remover" && s.metadataMode === "preserve");
  const number = (
    label: string,
    key:
      | "width"
      | "height"
      | "columns"
      | "mmWidth"
      | "mmHeight"
      | "dpi"
      | "signaturePadding",
    min: number,
    max: number,
  ) => (
    <label>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={s[key] ?? 8}
        onChange={(e) => {
          const n = Math.max(
            min,
            Math.min(max, Math.round(Number(e.target.value) || min)),
          );
          if (dimension && p.aspect && (key === "width" || key === "height")) {
            const r = size.width / size.height;
            update(
              key === "width"
                ? { width: n, height: Math.max(1, Math.round(n / r)) }
                : { height: n, width: Math.max(1, Math.round(n * r)) },
            );
          } else update({ [key]: n });
        }}
      />
    </label>
  );
  const slider = (
    label: string,
    key: "quality" | "amount" | "contrast" | "saturation" | "angle" | "opacity",
    min: number,
    max: number,
    unit = "%",
  ) => (
    <label>
      {label}
      <span className="iw-range">
        <input
          type="range"
          min={min}
          max={max}
          value={s[key]}
          onChange={(e) => update({ [key]: Number(e.target.value) })}
        />
        <output>
          {s[key]}
          {unit}
        </output>
      </span>
    </label>
  );
  const point = (x: number, y: number) =>
    update({ point: { x, y }, backgroundSelected: true });
  const rectInput = (key: keyof Rect, label: string) => (
    <label>
      {label}
      <input
        type="number"
        min={key === "x" || key === "y" ? 0 : 1}
        max={
          key === "x" || key === "width"
            ? size.width || 8192
            : size.height || 8192
        }
        value={s.rect[key]}
        onChange={(e) => {
          const value = Math.max(
            key === "x" || key === "y" ? 0 : 1,
            Math.round(Number(e.target.value) || 0),
          );
          let rect = { ...s.rect, [key]: value };
          if (p.ratio && key === "width")
            rect = {
              ...rect,
              height: Math.max(1, Math.round(value / p.ratio)),
            };
          if (p.ratio && key === "height")
            rect = { ...rect, width: Math.max(1, Math.round(value * p.ratio)) };
          update({ rect });
        }}
      />
    </label>
  );
  return (
    <>
      {p.batch &&
        !["image-contact-sheet", "image-color-picker"].includes(slug) && (
          <label>
            Apply settings to
            <select
              value={p.scope}
              onChange={(e) => p.setScope(e.target.value as Props["scope"])}
            >
              <option value="all">All images · relative placement</option>
              <option value="active">This image only</option>
            </select>
          </label>
        )}
      {dimension && (
        <>
          <div className="iw-pair">
            {number("Width (px)", "width", 1, 8192)}
            {number("Height (px)", "height", 1, 8192)}
          </div>
          <label className="iw-check">
            <input
              type="checkbox"
              checked={p.aspect}
              onChange={(e) => p.setAspect(e.target.checked)}
            />
            Keep aspect ratio
          </label>
          <label>
            Scale (%)
            <input
              type="number"
              min="1"
              max="800"
              value={p.percent}
              onChange={(e) =>
                p.resizePercent(
                  Math.max(1, Math.min(800, Number(e.target.value) || 1)),
                )
              }
            />
          </label>
          <label>
            Image fit
            <select
              value={s.fit}
              onChange={(e) =>
                update({ fit: e.target.value as ImageSettings["fit"] })
              }
            >
              <option value="contain">Fit inside · keep whole image</option>
              <option value="cover">Fill · crop edges</option>
              <option value="stretch">Stretch to exact dimensions</option>
            </select>
          </label>
          <label className="iw-check">
            <input
              type="checkbox"
              checked={p.noUpscale}
              onChange={(e) => p.setNoUpscale(e.target.checked)}
            />
            Do not enlarge smaller images
          </label>
        </>
      )}
      {area && (
        <>
          <label>
            Aspect ratio
            <select
              value={p.ratio}
              onChange={(e) => {
                const r = Number(e.target.value);
                p.setRatio(r);
                if (r) {
                  let width = Math.min(s.rect.width, s.rect.height * r),
                    height = width / r;
                  if (!width) {
                    width = Math.min(size.width, size.height * r);
                    height = width / r;
                  }
                  update({
                    rect: {
                      ...s.rect,
                      width: Math.round(width),
                      height: Math.round(height),
                    },
                  });
                }
              }}
            >
              <option value="0">Free selection</option>
              <option value="1">Square · 1:1</option>
              <option value={4 / 3}>Landscape · 4:3</option>
              <option value={16 / 9}>Widescreen · 16:9</option>
              <option value={3 / 4}>Portrait · 3:4</option>
            </select>
          </label>
          {["image-blur", "image-pixelate"].includes(slug) && (
            <button
              className="iw-secondary"
              onClick={() =>
                update({
                  rect: { x: 0, y: 0, width: size.width, height: size.height },
                })
              }
            >
              Apply to whole image
            </button>
          )}
          <details>
            <summary>Exact selection</summary>
            <div className="iw-pair">
              {rectInput("x", "Left (px)")}
              {rectInput("y", "Top (px)")}
              {rectInput("width", "Area width (px)")}
              {rectInput("height", "Area height (px)")}
            </div>
          </details>
        </>
      )}
      {slug === "image-rotate" && (
        <>
          <div className="iw-presets">
            {[-90, 0, 90, 180].map((angle) => (
              <button
                key={angle}
                aria-pressed={s.angle === angle}
                onClick={() => update({ angle })}
              >
                {angle}°
              </button>
            ))}
          </div>
          <label className="iw-check">
            <input
              type="checkbox"
              checked={s.flipX}
              onChange={(e) => update({ flipX: e.target.checked })}
            />
            Flip horizontally
          </label>
          <label className="iw-check">
            <input
              type="checkbox"
              checked={s.flipY}
              onChange={(e) => update({ flipY: e.target.checked })}
            />
            Flip vertically
          </label>
          <details>
            <summary>Fine rotation</summary>
            {slider("Rotation", "angle", -180, 180, "°")}
          </details>
        </>
      )}
      {[
        "image-blur",
        "image-pixelate",
        "image-grayscale",
        "image-sharpen",
        "signature-cleaner",
        "image-background-remover",
      ].includes(slug) &&
        slider(
          slug === "image-pixelate"
            ? "Block size"
            : slug === "image-grayscale"
              ? "Grayscale amount"
              : slug === "signature-cleaner"
                ? "Paper cleanup"
                : slug === "image-background-remover"
                  ? "Color tolerance"
                  : "Strength",
          "amount",
          slug === "image-grayscale" || slug === "image-sharpen" ? 0 : 1,
          100,
          slug === "image-pixelate" ? " px" : "%",
        )}
      {slug === "image-adjustments" && (
        <>
          {slider("Brightness", "amount", 10, 200)}
          {slider("Contrast", "contrast", 0, 200)}
          {slider("Saturation", "saturation", 0, 200)}
          <button
            className="iw-secondary"
            onClick={() =>
              update({ amount: 100, contrast: 100, saturation: 100 })
            }
          >
            Reset adjustments
          </button>
        </>
      )}
      {slug === "image-background-remover" && (
        <>
          <p className="iw-hint">
            Click a plain background to remove connected matching colors. Your
            image stays intact until you choose a sample.
          </p>
          <div className="iw-pair">
            <label>
              Sample X (px)
              <input
                type="number"
                min="0"
                max={size.width - 1}
                value={Math.round(s.point.x)}
                onChange={(e) => point(Number(e.target.value), s.point.y)}
              />
            </label>
            <label>
              Sample Y (px)
              <input
                type="number"
                min="0"
                max={size.height - 1}
                value={Math.round(s.point.y)}
                onChange={(e) => point(s.point.x, Number(e.target.value))}
              />
            </label>
          </div>
          <p className="iw-hint">
            Plain-color removal, without AI subject detection.
          </p>
        </>
      )}
      {["signature-cleaner", "image-background-remover"].includes(slug) && (
        <>
          <button
            className="iw-secondary"
            aria-pressed={p.restore}
            onClick={() => p.setRestore(!p.restore)}
          >
            {p.restore ? "Finish restoring" : "Restore brush"}
          </button>
          {p.restore && (
            <label>
              Restore brush size (px)
              <input
                type="number"
                min="2"
                max="200"
                value={p.brush}
                onChange={(e) =>
                  p.setBrush(
                    Math.max(2, Math.min(200, Number(e.target.value) || 2)),
                  )
                }
              />
            </label>
          )}
          {s.restoreStrokes?.length ? (
            <button
              className="iw-secondary"
              onClick={() => update({ restoreStrokes: [] })}
            >
              Clear restoration
            </button>
          ) : null}
        </>
      )}
      {slug === "signature-cleaner" && (
        <>
          {number("Crop padding (px)", "signaturePadding", 0, 100)}
          <p className="iw-hint">
            Inspect faint lines at 1:1. Paper is made transparent in PNG; use
            the size reducer for a strict upload limit.
          </p>
          <Link className="iw-guide" href="/lab/image-size-reducer">
            Then reduce signature size ↗
          </Link>
        </>
      )}
      {slug === "image-watermark" && (
        <>
          <div className="iw-segments">
            <button aria-pressed={!p.logo} onClick={p.clearLogo}>
              Text
            </button>
            <button aria-pressed={p.logo} onClick={p.chooseLogo}>
              <Upload size={14} />
              Logo
            </button>
          </div>
          {!p.logo && (
            <>
              <label>
                Watermark text
                <textarea
                  aria-label="Watermark text"
                  rows={3}
                  maxLength={1000}
                  value={s.text}
                  onChange={(e) => update({ text: e.target.value })}
                />
              </label>
              <label>
                Font
                <select
                  value={s.fontFamily ?? "system-ui"}
                  onChange={(e) =>
                    update({
                      fontFamily: e.target.value as ImageSettings["fontFamily"],
                    })
                  }
                >
                  <option value="system-ui">Sans serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </label>
              <label>
                Text color
                <input
                  type="color"
                  value={s.background}
                  onChange={(e) => update({ background: e.target.value })}
                />
              </label>
            </>
          )}
          {slider("Mark size", "amount", 5, 100)}
          {slider("Opacity", "opacity", 5, 100)}
          <label>
            Position
            <select
              value=""
              onChange={(e) => {
                const [x, y] = e.target.value.split(",").map(Number);
                if (Number.isFinite(x) && Number.isFinite(y))
                  update({ point: { x: size.width * x, y: size.height * y } });
              }}
            >
              <option value="">Choose a position</option>
              <option value="0.5,0.5">Center</option>
              <option value="0.2,0.15">Top left</option>
              <option value="0.8,0.15">Top right</option>
              <option value="0.2,0.85">Bottom left</option>
              <option value="0.8,0.85">Bottom right</option>
            </select>
          </label>
          <p className="iw-hint">
            Click or drag on the image to place your mark. Enter starts a new
            line.
          </p>
          <details>
            <summary>Placement & repeat</summary>
            {slider("Rotation", "angle", -90, 90, "°")}
            <label className="iw-check">
              <input
                type="checkbox"
                checked={s.tiled}
                onChange={(e) => update({ tiled: e.target.checked })}
              />
              Repeat across image
            </label>
            <div className="iw-pair">
              <label>
                Position X
                <input
                  type="number"
                  value={Math.round(s.point.x)}
                  onChange={(e) =>
                    update({ point: { ...s.point, x: Number(e.target.value) } })
                  }
                />
              </label>
              <label>
                Position Y
                <input
                  type="number"
                  value={Math.round(s.point.y)}
                  onChange={(e) =>
                    update({ point: { ...s.point, y: Number(e.target.value) } })
                  }
                />
              </label>
            </div>
          </details>
        </>
      )}
      {slug === "image-secret-message" && (
        <>
          <label>
            Mode
            <select
              value={s.extract ? "read" : "hide"}
              onChange={(e) => update({ extract: e.target.value === "read" })}
            >
              <option value="hide">Hide a message</option>
              <option value="read">Read a hidden message</option>
            </select>
          </label>
          {!s.extract && (
            <label>
              Secret message
              <textarea
                aria-label="Secret message"
                rows={4}
                value={s.text}
                onChange={(e) => update({ text: e.target.value })}
              />
            </label>
          )}
          <label>
            Password
            <input
              type="password"
              autoComplete="off"
              value={s.password}
              onChange={(e) => update({ password: e.target.value })}
            />
          </label>
          {!s.extract && (
            <p className="iw-hint">
              {new TextEncoder().encode(s.text).length} /{" "}
              {Math.max(0, p.capacity - 52).toLocaleString()} available message
              bytes.
            </p>
          )}
          <p className="iw-hint">
            Encrypted with AES-GCM. Keep the output PNG unchanged; resizing or
            conversion can destroy the message.
          </p>
        </>
      )}
      {slug === "passport-photo" && (
        <>
          <div className="iw-pair">
            {number("Width (mm)", "mmWidth", 10, 100)}
            {number("Height (mm)", "mmHeight", 10, 100)}
          </div>
          {number("Print density (DPI)", "dpi", 72, 600)}
          <label>
            Preview
            <select
              value={p.previewIndex}
              onChange={(e) => p.setPreviewIndex(Number(e.target.value))}
            >
              <option value="0">Cropped photo</option>
              <option value="1">6 × 4 inch sheet</option>
            </select>
          </label>
          <p className="iw-hint">
            {Math.round((s.mmWidth * s.dpi) / 25.4)} ×{" "}
            {Math.round((s.mmHeight * s.dpi) / 25.4)} px. Creates a separate
            sheet per photo. Print at 6 × 4 inches; PNG DPI metadata is
            unchanged. Check the authority’s current requirements.
          </p>
        </>
      )}
      {slug === "image-id-card" && (
        <>
          <label>
            Name
            <input
              maxLength={80}
              value={s.text}
              onChange={(e) => update({ text: e.target.value })}
            />
          </label>
          <label>
            Membership details
            <textarea
              aria-label="Membership details"
              rows={2}
              maxLength={100}
              value={s.detail}
              onChange={(e) => update({ detail: e.target.value })}
            />
          </label>
          <p className="iw-hint">
            Simple membership-card artwork, 1011 × 638 px. This does not verify
            identity.
          </p>
        </>
      )}
      {slug === "image-contact-sheet" && (
        <>
          <label>
            Background color
            <input
              type="color"
              value={s.background}
              onChange={(e) => update({ background: e.target.value })}
            />
          </label>
          <div className="iw-pair">
            {number("Columns", "columns", 1, 6)}
            {number("Tile width (px)", "width", 100, 1200)}
          </div>
          <label className="iw-check">
            <input
              type="checkbox"
              checked={s.labels !== false}
              onChange={(e) => update({ labels: e.target.checked })}
            />
            Show filenames
          </label>
          <p className="iw-hint">
            Use the file strip to reorder photos. The preview shows the complete
            sheet.
          </p>
        </>
      )}
      {slug === "favicon-generator" && (
        <>
          <label>
            Site name
            <input
              maxLength={100}
              value={s.text}
              onChange={(e) => update({ text: e.target.value })}
            />
          </label>
          <p className="iw-hint">
            7 PNG sizes, a multi-size ICO, manifest and installation snippet.
            ZIP references match the included filenames.
          </p>
        </>
      )}
      {slug === "image-color-picker" && (
        <>
          <div className="iw-pair">
            <label>
              Sample X (px)
              <input
                type="number"
                min="0"
                max={size.width - 1}
                value={Math.round(s.point.x)}
                onChange={(e) => p.sample(Number(e.target.value), s.point.y)}
              />
            </label>
            <label>
              Sample Y (px)
              <input
                type="number"
                min="0"
                max={size.height - 1}
                value={Math.round(s.point.y)}
                onChange={(e) => p.sample(s.point.x, Number(e.target.value))}
              />
            </label>
          </div>
          <p className="iw-hint">
            Click a pixel or use numeric coordinates. Arrow keys in these fields
            move one source pixel.
          </p>
          {p.color && (
            <div className="iw-color">
              <i style={{ background: p.color.hex }} />
              <strong>{p.color.hex}</strong>
              <span>
                RGB {p.color.rgb} · Alpha{" "}
                {Math.round((p.color.alpha / 255) * 100)}%
              </span>
              <div className="iw-pair">
                <button onClick={() => p.copy(p.color!.hex)}>
                  <Copy size={14} />
                  Copy HEX
                </button>
                <button onClick={() => p.copy(p.color!.rgb)}>
                  <Copy size={14} />
                  Copy RGB
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {slug === "image-metadata-remover" && (
        <>
          <label>
            Removal method
            <select
              value={s.metadataMode ?? "preserve"}
              onChange={(e) =>
                update({
                  metadataMode: e.target.value as ImageSettings["metadataMode"],
                })
              }
            >
              <option value="preserve">
                Preserve image data · JPG/PNG/WebP
              </option>
              <option value="reencode">Re-encode pixels · still image</option>
            </select>
          </label>
          <p className="iw-hint">
            Preserve mode removes descriptive EXIF/GPS/text tags and retains the
            image payload and color profile. EXIF-rotated photos require pixel
            re-encoding. Re-encode mode changes compression and removes
            animation/color profiles.
          </p>
        </>
      )}
      {slug === "svg-cleaner" && (
        <p className="iw-hint">
          Conservative cleanup preserves local gradients and accessible titles.
          Scripts, comments, metadata and external resources are removed.
          Geometry is not optimized.
        </p>
      )}
      {slug === "jpg-to-png" && (
        <p className="iw-hint">
          PNG does not restore JPEG detail or remove the background. File size
          may increase.
        </p>
      )}
      {!noFormat && (
        <details
          className="iw-export"
          open={[
            "image-compressor",
            "png-to-jpg",
            "image-to-webp",
            "jpg-to-png",
          ].includes(slug)}
        >
          <summary>Export settings</summary>
          <label>
            Export format
            <select
              value={
                slug === "jpg-to-png"
                  ? "png"
                  : slug === "png-to-jpg"
                    ? "jpeg"
                    : slug === "image-to-webp"
                      ? "webp"
                      : s.format
              }
              disabled={["jpg-to-png", "png-to-jpg", "image-to-webp"].includes(
                slug,
              )}
              onChange={(e) =>
                update({ format: e.target.value as ImageSettings["format"] })
              }
            >
              <option value="png">PNG · sharp lines & transparency</option>
              <option value="jpeg">JPG · smaller photos</option>
              <option value="webp">WebP · modern & lightweight</option>
            </select>
          </label>
          {(s.format !== "png" ||
            ["png-to-jpg", "image-to-webp"].includes(slug)) &&
            slider("Export quality", "quality", 10, 100)}
          {slug === "image-compressor" && s.format === "png" && (
            <p className="iw-hint">
              PNG preserves pixels; browser PNG encoding ignores quality. A
              smaller output is not guaranteed.
            </p>
          )}
          {!["jpg-to-png", "image-to-webp"].includes(slug) && (
            <>
              {[
                "image-resizer",
                "svg-to-image",
                "image-rotate",
                "image-background-remover",
              ].includes(slug) && (
                <label className="iw-check">
                  <input
                    type="checkbox"
                    checked={s.transparent}
                    onChange={(e) => update({ transparent: e.target.checked })}
                  />
                  Transparent background
                </label>
              )}
              {(s.format === "jpeg" ||
                [
                  "png-to-jpg",
                  "passport-photo",
                  "image-contact-sheet",
                ].includes(slug)) && (
                <label>
                  Background color
                  <input
                    type="color"
                    value={s.background}
                    onChange={(e) => update({ background: e.target.value })}
                  />
                </label>
              )}
            </>
          )}
        </details>
      )}
    </>
  );
}
