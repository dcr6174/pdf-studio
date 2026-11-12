"use client";
import { useMemo, useState } from "react";
import Link from "@/components/browser-link";
import {
  Search, Camera, Crop, RotateCw, Droplets, Contrast, Eraser,
  FileImage, Shield, KeyRound, Stamp, CreditCard, PenLine,
  Palette, LayoutGrid, Sun, Brush, BookOpen, Printer, Notebook, PenTool,
  GraduationCap, Heart, Layers, Film, Cloud, Sparkles,
  Move, Puzzle, Wrench, FileDown, ChevronRight, Shapes,
} from "lucide-react";

const icons: Record<string, typeof Camera> = {
  "image-size-reducer": FileDown,
  "image-compressor": FileDown,
  "image-resizer": Move,
  "image-crop": Crop,
  "image-rotate": RotateCw,
  "image-blur": Droplets,
  "image-pixelate": Puzzle,
  "image-grayscale": Contrast,
  "image-background-remover": Eraser,
  "jpg-to-png": FileImage,
  "png-to-jpg": FileImage,
  "image-to-webp": FileImage,
  "svg-to-image": Shapes,
  "svg-cleaner": Wrench,
  "image-watermark": Stamp,
  "image-metadata-remover": Shield,
  "image-secret-message": KeyRound,
  "passport-photo": CreditCard,
  "signature-cleaner": PenLine,
  "image-id-card": CreditCard,
  "image-color-picker": Palette,
  "favicon-generator": LayoutGrid,
  "image-contact-sheet": LayoutGrid,
  "image-adjustments": Sun,
  "mini-zine-maker": BookOpen,
  "photo-strip": Camera,
  "photo-booth-strips": Camera,
  "custom-bingo": LayoutGrid,
  "giant-poster": Printer,
  "photo-coloring-page": Brush,
  "printable-flashcards": GraduationCap,
  "practice-sheets": Notebook,
  "notebook-maker": Notebook,
  "daily-mood-canvas": Heart,
  "whiteboard": PenTool,
  "text-to-handwriting": PenLine,
  "handwriting-practice": PenTool,
  "flashcards": GraduationCap,
  "flipbook": BookOpen,
  "word-cloud": Cloud,
  "page-palette": Palette,
  "poster-collage": Layers,
  "pdf-to-gif": Film,
  "remove-watermark": Eraser,
};

export type LabHomeTool = { slug: string; title: string; description: string };

export function LabHome({ tools }: { tools: LabHomeTool[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      q
        ? tools.filter((t) => (t.title + " " + t.description).toLowerCase().includes(q))
        : tools,
    [q, tools],
  );
  return (
    <main className="lh-main">
      <header className="lh-hero">
        <span className="lh-pill">{tools.length} free tools · 100% private</span>
        <h1>
          Everything beyond PDFs.
          <span> Nothing leaves your device.</span>
        </h1>
        <p>Photo tools, printables, drawing and study aids. Completely free, right in your browser.</p>
        <label className="lh-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Lab tools"
            aria-label="Search Lab tools"
          />
        </label>
      </header>
      <section className="lh-tools" aria-label="All Lab tools">
        <div className="lh-tools-head">
          <span className="lh-pill">{shown.length} tools</span>
          <h2>
            Every tool you need. <span>Free forever.</span>
          </h2>
        </div>
        {shown.length ? (
          <div className="lh-grid">
            {shown.map((t) => {
              const Icon = icons[t.slug] ?? Sparkles;
              return (
                <Link key={t.slug} className="lh-card" href={"/lab/" + t.slug}>
                  <b>{t.title}</b>
                  <span className="lh-desc">{t.description}</span>
                  <span className="lh-foot">
                    <Icon size={20} aria-hidden="true" />
                    <span className="lh-open">
                      Open <ChevronRight size={14} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="lh-empty" role="status">
            No Lab tools match “{query}”. Try another word.
          </p>
        )}
      </section>
      <p className="lh-studios">
        Browse by studio: <Link href="/lab/image-studio">Image Studio</Link>
        {" · "}
        <Link href="/lab/creative-studio">Creative Studio</Link>
      </p>
    </main>
  );
}
