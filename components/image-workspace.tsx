"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  X,
  Undo2,
  RotateCcw,
  Maximize2,
} from "lucide-react";
import Link from "./browser-link";
import "@/app/lab/image-tools.css";
type Props = {
  title: string;
  toolMenu?: ReactNode;
  children: ReactNode;
  controls: ReactNode;
  actions: ReactNode;
  onReset: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  help?: string;
};
/** Shared image-only layout; no document processors or global PDF styles. */
export function ImageWorkspace({
  title,
  toolMenu,
  children,
  controls,
  actions,
  onReset,
  onUndo,
  canUndo,
  help,
}: Props) {
  const [mobile, setMobile] = useState(false),
    [open, setOpen] = useState(false),
    [full, setFull] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    gear = useRef<HTMLButtonElement>(null),
    root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = matchMedia("(max-width: 760px)"),
      change = () => {
        setMobile(mq.matches);
        setOpen(false);
      };
    change();
    mq.addEventListener("change", change);
    return () => mq.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);
  useEffect(() => {
    const change = () => setFull(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);
  const settings = (
    <>
      <div className="iw-panel-heading">
        <div>
          <span className="iw-eyebrow">SETTINGS</span>
          <h2>{title}</h2>
        </div>
        {mobile ? (
          <button aria-label="Close settings" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        ) : (
          <button aria-label="Reset settings" onClick={onReset}>
            <RotateCcw size={17} />
          </button>
        )}
      </div>
      <div className="iw-settings">
        {controls}
        {mobile && (
          <button className="iw-secondary" onClick={onReset}>
            Reset settings
          </button>
        )}
        {help && (
          <Link className="iw-guide" href={help}>
            How to use this tool ↗
          </Link>
        )}
      </div>
      <div className="iw-actions">{actions}</div>
    </>
  );
  return (
    <div className="iw-root" ref={root}>
      <header className="iw-header">
        <Link href="/lab" className="iw-brand">
          <ArrowLeft size={17} />
          <span>
            Studio <b>Lab</b>
          </span>
        </Link>
        <span className="iw-divider" />
        {toolMenu ?? <h1>{title}</h1>}
        <div className="iw-header-actions">
          <span className="iw-local">
            <i />
            On your device
          </span>
          {onUndo && (
            <button
              disabled={!canUndo}
              aria-label="Undo last change"
              onClick={onUndo}
            >
              <Undo2 size={17} />
            </button>
          )}
          <button
            aria-label="Reset settings"
            className="iw-header-reset"
            onClick={onReset}
          >
            <RotateCcw size={17} />
          </button>
          <button
            aria-label="Fullscreen image workspace"
            onClick={() => {
              if (document.fullscreenElement)
                void document.exitFullscreen().catch(() => {});
              else void root.current?.requestFullscreen().catch(() => {});
            }}
            aria-pressed={full}
          >
            <Maximize2 size={17} />
          </button>
          <button
            ref={gear}
            className="iw-gear"
            aria-label="Open image settings"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </header>
      <main className="iw-layout" aria-label={title + " workspace"}>
        <section className="iw-stage" aria-label="Image canvas">
          {children}
        </section>
        {!mobile && (
          <aside className="iw-panel" aria-label="Image settings">
            {settings}
          </aside>
        )}
        {mobile && (
          <>
            <footer className="iw-mobile-action">{actions}</footer>
            <dialog
              ref={dialog}
              className="iw-dialog"
              aria-label={title + " settings"}
              onCancel={() => setOpen(false)}
              onClose={() => {
                setOpen(false);
                gear.current?.focus();
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  const r = e.currentTarget.getBoundingClientRect();
                  if (
                    e.clientY < r.top ||
                    e.clientX < r.left ||
                    e.clientX > r.right
                  )
                    setOpen(false);
                }
              }}
            >
              <div className="iw-sheet-grip" />
              {settings}
            </dialog>
          </>
        )}
      </main>
    </div>
  );
}
