"use client";
import { useMemo, useState } from "react";
import { Search, X, ArrowUpRight, BookOpen } from "lucide-react";
import Link from "@/components/browser-link";
export type ImageGuideCard = {
  slug: string;
  title: string;
  description: string;
  kind: string;
  category: string;
  tags: string[];
};
export function ImageGuideDirectory({ guides }: { guides: ImageGuideCard[] }) {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All");
  const matches = useMemo(
    () =>
      guides.filter(
        (g) =>
          (category === "All" || g.category === category) &&
          `${g.title} ${g.description} ${g.tags.join(" ")}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [guides, category, query],
  );
  return (
    <section
      className="ig-directory"
      aria-label="Image Studio article collection"
    >
      <div className="ig-directory-controls">
        <label className="ig-search">
          <Search size={18} />
          <input
            type="search"
            aria-label="Search image guides"
            placeholder="Try crop, signature, watermark…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              aria-label="Clear image guide search"
              onClick={() => setQuery("")}
            >
              <X size={17} />
            </button>
          )}
        </label>
        <div className="ig-filters" aria-label="Image guide categories">
          {[
            "All",
            "Optimize",
            "Edit",
            "Convert",
            "Protect",
            "Create",
            "Comparisons",
          ].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="ig-result-count" role="status">
        {matches.length} {matches.length === 1 ? "guide" : "guides"}
        {query ? " matching your search" : ""}
      </p>
      <div className="ig-guide-grid">
        {matches.map((g) => (
          <Link
            key={g.slug}
            href={"/lab/guides/" + g.slug}
            className="ig-guide-card"
          >
            <div>
              <BookOpen size={17} />
              <span>
                {g.category} · {g.kind}
              </span>
            </div>
            <h2>{g.title}</h2>
            <p>{g.description}</p>
            <span className="ig-card-action">
              Read the guide
              <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
      {!matches.length && (
        <div className="ig-empty">
          <h2>No matching guides</h2>
          <p>Try a tool name or choose another category.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Show all guides
          </button>
        </div>
      )}
    </section>
  );
}
