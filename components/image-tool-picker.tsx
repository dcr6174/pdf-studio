"use client";
import { useRef, useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  X,
  ArrowUpRight,
  Check,
  SlidersHorizontal,
  WandSparkles,
  FileImage,
  ShieldCheck,
  Minimize2,
} from "lucide-react";
import Link from "./browser-link";
import { imageTools } from "@/lib/image-tools";
const icons = {
  Edit: SlidersHorizontal,
  Create: WandSparkles,
  Convert: FileImage,
  Protect: ShieldCheck,
  Optimize: Minimize2,
};
/** Navigation only: selecting a tool opens its existing route with a fresh workspace. */
export function ImageToolPicker({ title }: { title: string }) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);
  const current = imageTools.find((t) => t.title === title),
    Icon = icons[current?.category ?? "Edit"];
  return (
    <div className="iw-picker">
      <h1 className="iw-sr-only">{title}</h1>
      <button
        ref={trigger}
        className="iw-picker-trigger"
        aria-label="Choose image tool"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
      >
        <Icon size={17} />
        <span>{title}</span>
        <ChevronDown size={14} />
      </button>
      <dialog
        ref={dialog}
        className="iw-tool-dialog"
        aria-label="Choose image tool"
        onKeyDownCapture={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }
        }}
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              setOpen(false);
          }
        }}
      >
        <div className="iw-tool-dialog-heading">
          <div>
            <span className="iw-eyebrow">IMAGE STUDIO</span>
            <h2>Your image toolkit</h2>
          </div>
          <button aria-label="Close image tools" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <label className="iw-tool-search">
          <Search size={18} />
          <input
            autoFocus
            type="search"
            placeholder="Find a tool…"
            aria-label="Search image tools"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <nav className="iw-studio-destinations" aria-label="Studio destinations"><Link href="/lab/image-studio">All image tools</Link><Link href="/lab">All studios</Link></nav>
        <p className="iw-tool-navigation-note">
          Opening a different tool starts a new workspace.
        </p>
        <div className="iw-tool-list">
          {Object.entries(icons).map(([category, CategoryIcon]) => {
            const matches = imageTools.filter(
              (t) =>
                t.category === category &&
                `${t.title} ${t.description}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
            );
            return matches.length ? (
              <section key={category}>
                <h3>
                  <CategoryIcon size={14} />
                  {category}
                </h3>
                {matches.map((t) => (
                  <a
                    key={t.slug}
                    href={"/lab/" + t.slug}
                    aria-current={t.title === title ? "page" : undefined}
                  >
                    <span>
                      <b>{t.title}</b>
                      <small>{t.description}</small>
                    </span>
                    {t.title === title ? (
                      <Check size={16} />
                    ) : (
                      <ArrowUpRight size={15} />
                    )}
                  </a>
                ))}
              </section>
            ) : null;
          })}
          {!imageTools.some((t) =>
            `${t.title} ${t.description}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ) && (
            <p className="iw-tool-no-results">
              No tools match “{query}”. Try crop, compress or convert.
            </p>
          )}
        </div>
      </dialog>
    </div>
  );
}
