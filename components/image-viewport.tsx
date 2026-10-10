"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Minus, Plus, Scan, Move, Image as ImageIcon } from "lucide-react";
import type { Rect } from "@/lib/image-lab";
type Point = { x: number; y: number };
type Props = {
  image: HTMLCanvasElement | null;
  rect?: Rect;
  ratio?: number;
  onRect?: (r: Rect) => void;
  onPoint?: (p: Point) => void;
  pointDrag?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onStroke?: (p: Point) => void;
  point?: Point;
  addControl?: React.ReactNode;
  empty?: React.ReactNode;
  label?: string;
};
export function ImageViewport({
  image,
  rect,
  ratio = 0,
  onRect,
  onPoint,
  pointDrag,
  onStroke,
  onStart,
  onEnd,
  point,
  addControl,
  empty,
  label = "Image preview",
}: Props) {
  const holder = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    [bounds, setBounds] = useState({ width: 800, height: 600 }),
    [zoom, setZoom] = useState<number | null>(null),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [hand, setHand] = useState(false),
    [checker, setChecker] = useState(true),
    [space, setSpace] = useState(false);
  const pointers = useRef(new Map<number, Point>()),
    drag = useRef<{
      type: "pan" | "select" | "move" | "resize" | "stroke" | "point";
      start: Point;
      pan: Point;
      rect?: Rect;
      handle?: string;
    } | null>(null),
    pinch = useRef<{
      distance: number;
      scale: number;
      pan: Point;
      center: Point;
    } | null>(null);
  const iw = image?.width ?? 1,
    ih = image?.height ?? 1,
    fit = Math.max(
      0.01,
      Math.min((bounds.width - 56) / iw, (bounds.height - 100) / ih, 4),
    ),
    scale = Math.max(0.01, zoom ?? fit),
    left = (bounds.width - iw * scale) / 2 + pan.x,
    top = (bounds.height - 76 - ih * scale) / 2 + 16 + pan.y;
  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const observer = new ResizeObserver(([e]) =>
      setBounds({
        width: Math.max(1, e.contentRect.width),
        height: Math.max(1, e.contentRect.height),
      }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    el.width = image?.width ?? 1;
    el.height = image?.height ?? 1;
    if (image) el.getContext("2d")?.drawImage(image, 0, 0);
    return () => {
      el.width = 1;
      el.height = 1;
    };
  }, [image]);
  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) {
        setZoom(null);
        setPan({ x: 0, y: 0 });
      }
    });
    return () => {
      alive = false;
    };
  }, [iw, ih]);
  const clampPan = (p: Point, z = scale) => ({
    x: Math.max(
      -Math.max(0, (iw * z - bounds.width) / 2 + 32),
      Math.min(Math.max(0, (iw * z - bounds.width) / 2 + 32), p.x),
    ),
    y: Math.max(
      -Math.max(0, (ih * z - bounds.height) / 2 + 32),
      Math.min(Math.max(0, (ih * z - bounds.height) / 2 + 32), p.y),
    ),
  });
  function changeZoom(next: number) {
    const z = Math.max(Math.min(fit, 0.1), Math.min(8, next));
    setZoom(z);
    setPan((p) => clampPan(p, z));
  }
  const coordinates = (e: { clientX: number; clientY: number }) => {
    const r = holder.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(iw - 1, (e.clientX - r.left - left) / scale)),
      y: Math.max(0, Math.min(ih - 1, (e.clientY - r.top - top) / scale)),
    };
  };
  function down(e: PointerEvent<HTMLDivElement>) {
    if (!image || e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") && !target.dataset.handle) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (drag.current?.rect && onRect) onRect(drag.current.rect);
      pinch.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        scale,
        pan,
        center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      drag.current = null;
      return;
    }
    const p = coordinates(e),
      handle = target.dataset.handle;
    if (hand || space || (!onRect && !onPoint && !onStroke)) {
      drag.current = {
        type: "pan",
        start: { x: e.clientX, y: e.clientY },
        pan,
      };
      return;
    }
    onStart?.();
    if (onStroke) {
      drag.current = { type: "stroke", start: p, pan };
      onStroke(p);
      return;
    }
    if (onPoint) {
      if (pointDrag) drag.current = { type: "point", start: p, pan };
      onPoint(p);
      return;
    }
    if (onRect) {
      drag.current = {
        type: handle === "move" ? "move" : handle ? "resize" : "select",
        start: p,
        pan,
        rect,
        handle,
      };
      if (!handle)
        onRect({ x: Math.round(p.x), y: Math.round(p.y), width: 1, height: 1 });
    }
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const z = Math.min(
        8,
        Math.max(
          0.02,
          (pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) /
            Math.max(1, pinch.current.distance),
        ),
      );
      setZoom(z);
      setPan(
        clampPan(
          {
            x: pinch.current.pan.x + (a.x + b.x) / 2 - pinch.current.center.x,
            y: pinch.current.pan.y + (a.y + b.y) / 2 - pinch.current.center.y,
          },
          z,
        ),
      );
      return;
    }
    const d = drag.current;
    if (!d) return;
    if (d.type === "pan") {
      setPan(
        clampPan({
          x: d.pan.x + e.clientX - d.start.x,
          y: d.pan.y + e.clientY - d.start.y,
        }),
      );
      return;
    }
    const p = coordinates(e);
    if (d.type === "stroke") {
      onStroke?.(p);
      return;
    }
    if (d.type === "point") {
      onPoint?.(p);
      return;
    }
    if (!onRect) return;
    let r: Rect;
    if (d.type === "move" && d.rect) {
      r = {
        ...d.rect,
        x: Math.max(0, Math.min(iw - d.rect.width, d.rect.x + p.x - d.start.x)),
        y: Math.max(
          0,
          Math.min(ih - d.rect.height, d.rect.y + p.y - d.start.y),
        ),
      };
    } else {
      let a = d.start,
        b = p;
      if (d.type === "resize" && d.rect) {
        const old = d.rect,
          h = d.handle ?? "se";
        a = {
          x: h.includes("w") ? old.x + old.width : old.x,
          y: h.includes("n") ? old.y + old.height : old.y,
        };
        b = {
          x: h === "n" || h === "s" ? old.x + old.width : p.x,
          y: h === "e" || h === "w" ? old.y + old.height : p.y,
        };
      }
      let w = Math.max(1, Math.abs(b.x - a.x)),
        h = Math.max(1, Math.abs(b.y - a.y));
      if (ratio) {
        if (w / h > ratio) h = w / ratio;
        else w = h * ratio;
        w = Math.min(w, b.x < a.x ? a.x : iw - a.x);
        h = Math.min(h, b.y < a.y ? a.y : ih - a.y);
        w = Math.min(w, h * ratio);
        h = w / ratio;
      }
      r = {
        x: b.x < a.x ? a.x - w : a.x,
        y: b.y < a.y ? a.y - h : a.y,
        width: w,
        height: h,
      };
    }
    onRect({
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.max(1, Math.round(r.width)),
      height: Math.max(1, Math.round(r.height)),
    });
  }
  function up(e: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    drag.current = null;
    onEnd?.();
  }
  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const limit = (p: Point, z: number) => ({
      x: Math.max(
        -Math.max(0, (iw * z - bounds.width) / 2 + 32),
        Math.min(Math.max(0, (iw * z - bounds.width) / 2 + 32), p.x),
      ),
      y: Math.max(
        -Math.max(0, (ih * z - bounds.height) / 2 + 32),
        Math.min(Math.max(0, (ih * z - bounds.height) / 2 + 32), p.y),
      ),
    });
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const z = Math.max(
          Math.min(fit, 0.1),
          Math.min(8, scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15)),
        );
        setZoom(z);
        setPan((p) => limit(p, z));
      } else if (scale > fit) {
        e.preventDefault();
        setPan((p) => limit({ x: p.x - e.deltaX, y: p.y - e.deltaY }, scale));
      }
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [scale, fit, iw, ih, bounds.width, bounds.height]);
  return (
    <div
      className={
        "iv-holder" +
        (checker ? " iv-checker" : "") +
        (hand || space ? " iv-hand" : "")
      }
      ref={holder}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.code === "Space") {
          e.preventDefault();
          setSpace(true);
        }
        if (e.key === "+" || e.key === "=") changeZoom(scale * 1.25);
        if (e.key === "-") changeZoom(scale / 1.25);
        if (e.key === "0") {
          setZoom(null);
          setPan({ x: 0, y: 0 });
        }
      }}
      onKeyUp={(e) => {
        if (e.code === "Space") setSpace(false);
      }}
      onBlur={() => setSpace(false)}
      tabIndex={image ? 0 : -1}
      aria-label="Image viewport. Plus and minus zoom, zero fits, space and drag pans."
    >
      {image ? (
        <>
          <canvas
            ref={canvas}
            className={"iv-canvas" + (checker ? " iv-artboard-checker" : "")}
            style={{ width: iw * scale, height: ih * scale, left, top }}
            aria-label={label}
          />
          {rect && onRect && (
            <div
              className="iv-selection"
              data-handle="move"
              style={{
                left: left + rect.x * scale,
                top: top + rect.y * scale,
                width: rect.width * scale,
                height: rect.height * scale,
              }}
            >
              <span className="iv-grid" />
              <span className="iv-dimensions">
                {rect.width} × {rect.height}
              </span>
              {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((h) => (
                <span key={h} data-handle={h} className={"iv-handle iv-" + h} />
              ))}
            </div>
          )}
          {point && (
            <span
              className="iv-point"
              style={{
                left: left + point.x * scale,
                top: top + point.y * scale,
              }}
            />
          )}
        </>
      ) : (
        empty
      )}
      {image && (
        <div className="iv-toolbar" aria-label="Canvas view controls">
          <button
            aria-label="Zoom out"
            onClick={() => changeZoom(scale / 1.25)}
          >
            <Minus size={16} />
          </button>
          <output aria-label="Zoom percentage">
            {Math.round(scale * 100)}%
          </output>
          <button aria-label="Zoom in" onClick={() => changeZoom(scale * 1.25)}>
            <Plus size={16} />
          </button>
          <span />
          <button
            aria-label="Fit image"
            onClick={() => {
              setZoom(null);
              setPan({ x: 0, y: 0 });
            }}
          >
            <Scan size={16} />
            <i>Fit</i>
          </button>
          <button
            aria-label="Actual size"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            1:1
          </button>
          <button
            aria-label="Pan image"
            aria-pressed={hand}
            onClick={() => setHand(!hand)}
          >
            <Move size={16} />
          </button>
          <button
            aria-label="Toggle transparency background"
            aria-pressed={checker}
            onClick={() => setChecker(!checker)}
          >
            <ImageIcon size={16} />
          </button>
        </div>
      )}
      {addControl && <div className="iv-add">{addControl}</div>}
    </div>
  );
}
