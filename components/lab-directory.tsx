"use client";
import { useState } from "react";
import Link from "@/components/browser-link";
import {
  Search,
  X,
  ArrowUpRight,
  Camera,
  BookOpen,
  Sparkles,
  NotebookPen,
  Grid3X3,
  Image as ImageIcon,
  Paintbrush,
  Palette,
  Timer,
  PenLine,
} from "lucide-react";
import { imageTools } from "@/lib/image-tools";
const tools = [
  ...imageTools.map((t) => ({
    ...t,
    group: "Images",
    output: t.category,
    icon: ImageIcon,
  })),
  {
    slug: "photo-strip",
    title: "Quick Photo Strip",
    description: "Turn your favourite photos into a keepsake strip.",
    group: "Play",
    output: "Photo strip",
    icon: Camera,
  },
  {
    slug: "flashcards",
    title: "Study Flashcards",
    description: "Make a deck, practise it, or print it for later.",
    group: "Learn",
    output: "Study & print",
    icon: BookOpen,
  },
  {
    slug: "decision-wheel",
    title: "Decision Wheel",
    description: "Add your choices. Give indecision a little spin.",
    group: "Play",
    output: "Spin a choice",
    icon: Sparkles,
  },
  {
    slug: "practice-sheets",
    title: "Practice Sheets & Notebooks",
    description: "Create paper that fits your notes and handwriting practice.",
    group: "Make",
    output: "Printable PDF",
    icon: NotebookPen,
  },
  {
    slug: "mini-zine-maker",
    title: "Mini Zine Maker",
    description: "Fold your ideas into a pocket-sized paper book.",
    group: "Make",
    output: "Printable PDF",
    icon: BookOpen,
  },
  {
    slug: "custom-bingo",
    title: "Custom Bingo",
    description: "Make a personal bingo game for your next gathering.",
    group: "Play",
    output: "Printable PDF",
    icon: Grid3X3,
  },
  {
    slug: "giant-poster",
    title: "Giant Poster Maker",
    description: "Split one image across sheets for a bigger print.",
    group: "Make",
    output: "Printable PDF",
    icon: ImageIcon,
  },
  {
    slug: "photo-coloring-page",
    title: "Photo to Coloring Page",
    description: "Make a colouring activity from your own photo.",
    group: "Make",
    output: "Printable PDF",
    icon: Paintbrush,
  },
  {
    slug: "daily-mood-canvas",
    title: "Daily Mood Canvas",
    description: "Express your day with colours, photos and scribbles.",
    group: "Play",
    output: "Creative canvas",
    icon: Palette,
  },
  {
    slug: "whiteboard",
    title: "Whiteboard",
    description: "Give diagrams, doodles and rough ideas some room.",
    group: "Make",
    output: "Drawing canvas",
    icon: PenLine,
  },
  {
    slug: "pomodoro",
    title: "Focus Timer",
    description: "Make time for focused work and proper breaks.",
    group: "Learn",
    output: "Focus session",
    icon: Timer,
  },
  {
    slug: "text-to-handwriting",
    title: "Text to Handwriting",
    description: "Give typed notes a handwritten-style finish.",
    group: "Make",
    output: "Styled notes",
    icon: PenLine,
  },
];
const categories = ["All", "Images", "Make", "Learn", "Play"];
export function LabDirectory() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const shown = tools.filter(
    (t) =>
      (filter === "All" || t.group === filter) &&
      `${t.title} ${t.description} ${t.output} ${t.group}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <section className="lab-discovery" aria-labelledby="lab-tools-heading">
      <div className="lab-discovery-top">
        <div>
          <span className="lab-kicker">Small tools. Real possibilities.</span>
          <h2 id="lab-tools-heading">Find your next little project.</h2>
        </div>
        <label className="lab-search">
          <Search size={20} aria-hidden="true" />
          <span className="lab-sr-only">Search Lab tools</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Photos, flashcards, colouring…"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={18} />
            </button>
          )}
        </label>
      </div>
      <div className="lab-browse-row">
        <div className="lab-segments" role="group" aria-label="Lab categories">
          {categories.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "Images"
                ? "Image tools"
                : f === "Make"
                  ? "Make & print"
                  : f === "Learn"
                    ? "Focus & learn"
                    : f === "Play"
                      ? "Just for fun"
                      : "Everything"}
            </button>
          ))}
        </div>
        <p role="status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "tool" : "tools"}
        </p>
      </div>
      <div className="lab-curated-grid">
        {shown.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.slug}
              href={"/lab/" + t.slug}
              className={"lab-project lab-tone-" + t.group.toLowerCase()}
            >
              <div className="lab-project-top">
                <span className="lab-project-icon">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className="lab-output">{t.output}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <span className="lab-project-go">
                Let’s try it <span aria-hidden="true">→</span>
              </span>
            </Link>
          );
        })}
      </div>
      {!shown.length && (
        <div className="lab-empty">
          <h3>No tools match that yet.</h3>
          <p>Try “photo”, “print” or “study”, or browse everything.</p>
          <button
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
          >
            Show all tools
          </button>
        </div>
      )}
      <p className="lab-endnote">
        25 image tools. Plenty of room to make something your own.{" "}
        <Link href="/lab/guides">Read the Image Studio guides ↗</Link>
      </p>
    </section>
  );
}
