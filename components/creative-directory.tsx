"use client";
import { useState } from "react";
import Link from "@/components/browser-link";
import { ArrowUpRight, Search } from "lucide-react";
import {
  creativeTools,
  creativeGroups,
  type CreativeGroup,
} from "@/lib/lab-studios";
export function CreativeDirectory() {
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState<CreativeGroup | "All">("All");
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    matches = creativeTools.filter(
      (t) =>
        (filter === "All" || filter === t.group) &&
        terms.every((w) =>
          (
            t.title +
            " " +
            t.description +
            " " +
            t.group +
            " " +
            t.slug.replaceAll("-", " ")
          )
            .toLowerCase()
            .includes(w),
        ),
    );
  const section = (group: CreativeGroup) => {
    const tools = matches.filter((t) => t.group === group);
    return tools.length ? (
      <section
        className="creative-tool-group"
        key={group}
        aria-labelledby={"creative-" + group.replaceAll(" ", "-")}
      >
        <h2 id={"creative-" + group.replaceAll(" ", "-")}>{group}</h2>
        <div className="creative-tool-grid">
          {tools.map((t) => (
            <Link key={t.slug} href={"/lab/" + t.slug}>
              <div>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    ) : null;
  };
  return (
    <>
      <div className="creative-browse-controls">
        <label className="creative-tool-search">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search creative tools"
            placeholder="Find a creative tool…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div
          className="creative-group-filters"
          role="group"
          aria-label="Creative tool categories"
        >
          {(["All", ...creativeGroups] as const).map((g) => (
            <button
              type="button"
              key={g}
              aria-pressed={filter === g}
              onClick={() => setFilter(g)}
            >
              {g === "All" ? "All creative tools" : g}
            </button>
          ))}
        </div>
        <p role="status" aria-live="polite">
          {matches.length} {matches.length === 1 ? "tool" : "tools"}
        </p>
      </div>
      {creativeGroups.filter((g) => g !== "Document experiments").map(section)}
      {matches.some((t) => t.group === "Document experiments") &&
        (query.trim() || filter === "Document experiments" ? (
          section("Document experiments")
        ) : (
          <details className="creative-document-experiments">
            <summary>More: document experiments</summary>
            <p>Creative ways to work with PDF pages.</p>
            {section("Document experiments")}
          </details>
        ))}
      {!matches.length && (
        <div className="creative-empty">
          <h2>No creative tools found.</h2>
          <p>Try “poster”, “draw” or “study”.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
          >
            Show all creative tools
          </button>
        </div>
      )}
    </>
  );
}
