"use client";
import { useId, useRef, useState } from "react";
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
  {slug:"arcade",title:"Studio Arcade",description:"Ten quick games: Snake, 2048, Buddy Stack and more.",group:"Play",output:"Free browser games",icon:Grid3X3},
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
// Editorial shortcuts, not an analytics-based popularity claim.
const common = [
  "image-compressor",
  "image-resizer",
  "image-crop",
  "image-size-reducer",
  "image-background-remover",
  "photo-strip",
];
const aliases: Record<string, string> = {
  "image-compressor": "smaller photo reduce kb size compress",
  "image-size-reducer": "form signature upload kb limit",
  "image-resizer": "dimensions width height pixels resize",
  "image-crop": "trim cut crop",
  "image-background-remover": "transparent erase background",
  "png-to-jpg": "jpeg convert",
  "image-to-webp": "web website convert",
  pomodoro: "timer focus break",
  flashcards: "study learn cards",
};

export function LabDirectory() {
  const [filter, setFilter] = useState("All"),
    [query, setQuery] = useState(""),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(-1);
  const popup = useId(),
    options = useRef<(HTMLAnchorElement | null)[]>([]);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matching = tools.filter((t) =>
    terms.every((term) =>
      `${t.title} ${t.description} ${t.output} ${t.group} ${aliases[t.slug] ?? ""}`
        .toLowerCase()
        .includes(term),
    ),
  );
  const suggestions = query.trim()
    ? matching.slice(0, 5)
    : common.map((slug) => tools.find((t) => t.slug === slug)!);
  const shown = matching.filter((t) => filter === "All" || t.group === filter);
  const card = (t: (typeof tools)[number], compact = false) => {
    const Icon = t.icon;
    return (
      <Link
        key={t.slug}
        href={"/lab/" + t.slug}
        className={
          "lab-project lab-tone-" +
          t.group.toLowerCase() +
          (compact ? " lab-quick-tool" : "")
        }
      >
        <span className="lab-project-icon">
          <Icon size={22} aria-hidden="true" />
        </span>
        <div>
          <h3>{t.title}</h3>
          {!compact && <p>{t.description}</p>}
        </div>
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    );
  };
  return (
    <section className="lab-discovery" aria-labelledby="lab-tools-heading">
      <div className="lab-discovery-top">
        <div>
          <span className="lab-kicker">Find your next task</span>
          <h2 id="lab-tools-heading">What would you like to make?</h2>
        </div>
        <div
          className="lab-search-wrap"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
          }}
        >
          <div className="lab-search">
            <Search size={20} aria-hidden="true" />
            <input
              aria-label="Search Lab tools"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={open ? popup : undefined}
              aria-activedescendant={
                open && active >= 0 ? popup + "-" + active : undefined
              }
              value={query}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setFilter("All");
                setActive(-1);
                setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  setActive(-1);
                } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setOpen(true);
                  setActive((n) =>
                    Math.max(
                      0,
                      Math.min(
                        suggestions.length - 1,
                        n + (e.key === "ArrowDown" ? 1 : -1),
                      ),
                    ),
                  );
                } else if (
                  e.key === "Enter" &&
                  open &&
                  active >= 0 &&
                  suggestions[active]
                ) {
                  e.preventDefault();
                  options.current[active]?.click();
                }
              }}
              placeholder="Try ‘smaller photo’ or ‘crop’"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setActive(-1);
                }}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {open && (
            <div className="lab-suggestions">
              <p>{query.trim() ? "Matching tools" : "Try a common task"}</p>
              <div id={popup} role="listbox" aria-label="Suggested Lab tools">
                {suggestions.map((t, i) => (
                  <a
                    ref={(el) => {
                      options.current[i] = el;
                    }}
                    tabIndex={-1}
                    href={"/lab/" + t.slug}
                    onMouseDown={(e) => e.preventDefault()}
                    role="option"
                    id={popup + "-" + i}
                    aria-selected={i === active}
                    key={t.slug}
                  >
                    <b>{t.title}</b>
                    <small>{t.description}</small>
                  </a>
                ))}
              </div>
              {!suggestions.length && (
                <p role="status">No match. Try “resize”, “photo” or “study”.</p>
              )}
              <button
                className="lab-dismiss-search"
                onClick={() => setOpen(false)}
              >
                Close suggestions
              </button>
            </div>
          )}
        </div>
      </div>
      {!query && filter === "All" && (
        <section className="lab-start" aria-labelledby="lab-start-heading">
          <div>
            <h3 id="lab-start-heading">Start here</h3>
            <p>A few useful tasks for photos, forms and everyday editing.</p>
          </div>
          <div className="lab-quick-grid">
            {common.map((slug) =>
              card(tools.find((t) => t.slug === slug)!, true),
            )}
          </div>
        </section>
      )}
      <div className="lab-browse-row">
        <div className="lab-segments" role="group" aria-label="Lab categories">
          {categories.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setOpen(false);
              }}
            >
              {f === "Images"
                ? "Images"
                : f === "Make"
                  ? "Make & print"
                  : f === "Learn"
                    ? "Focus & learn"
                    : f === "Play"
                      ? "Play"
                      : "All tools"}
            </button>
          ))}
        </div>
        <p role="status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "tool" : "tools"}
        </p>
      </div>
      <div className="lab-curated-grid">{shown.map((t) => card(t))}</div>
      {!shown.length && (
        <div className="lab-empty">
          <h3>No tools match “{query}”.</h3>
          <p>Try a simpler task: “photo”, “print” or “study”.</p>
          <button
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
          >
            Browse all tools
          </button>
          <div className="lab-related">
            {common
              .slice(0, 3)
              .map((slug) => card(tools.find((t) => t.slug === slug)!, true))}
          </div>
        </div>
      )}
      <p className="lab-endnote">
        {imageTools.length} image tools. Originals stay on your device.{" "}
        <Link href="/lab/guides">Read the Image Studio guides ↗</Link>
      </p>
    </section>
  );
}


