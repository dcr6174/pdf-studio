"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import Link from "@/components/browser-link";
import { Search, X, ArrowUpRight } from "lucide-react";
import {
  findLabEntries,
  labEntries,
  labQuickLinks,
  studioLinks,
  type LabEntry,
} from "@/lib/lab-studios";
import { PublicDirectory } from "@/components/public-directory";
const filters = [
  ["all", "All"],
  ["images", "Images"],
  ["creative", "Creative"],
] as const;
export function LabDirectory({ children }: { children?: ReactNode }) {
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState<(typeof filters)[number][0]>("all"),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(-1),
    [limit, setLimit] = useState(12);
  const id = useId(),
    input = useRef<HTMLInputElement>(null),
    options = useRef<(HTMLAnchorElement | null)[]>([]),
    results = findLabEntries(query, filter),
    suggestions = query.trim() ? results.slice(0, 5) : labQuickLinks;
  const label = (e: LabEntry) =>
    studioLinks.find((s) => s.id === e.studio)!.title;
  const result = (e: LabEntry) => (
    <Link className="lab-search-result" key={e.href} href={e.href}>
      <div>
        <span>
          {label(e)} ·{" "}
          {e.kind === "studio" ? "Catalogue" : "Tool"}
        </span>
        <h3>{e.title}</h3>
        <p>{e.description}</p>
      </div>
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
  return (
    <section className="lab-discovery" aria-label="Find a Lab tool">
      <div
        className="lab-search-wrap"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
      >
        <label className="lab-search-label" htmlFor={id}>
          Find a Lab tool
        </label>
        <div className="lab-search">
          <Search size={21} aria-hidden="true" />
          <input
            ref={input}
            id={id}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? id + "-list" : undefined}
            aria-activedescendant={
              open && active >= 0 && active < suggestions.length
                ? id + "-" + active
                : undefined
            }
            aria-label="Search Lab tools"
            value={query}
            placeholder="Try crop, flashcards or whiteboard…"
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setFilter("all");
              setActive(-1);
              setLimit(12);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                setActive(-1);
              } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                if (!suggestions.length) return;
                setOpen(true);
                setActive((n) =>
                  n < 0
                    ? e.key === "ArrowUp"
                      ? suggestions.length - 1
                      : 0
                    : Math.max(
                        0,
                        Math.min(
                          suggestions.length - 1,
                          n + (e.key === "ArrowDown" ? 1 : -1),
                        ),
                      ),
                );
              } else if (e.key === "Enter" && open && active >= 0) {
                e.preventDefault();
                options.current[active]?.click();
              }
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setFilter("all");
                setActive(-1);
                setLimit(12);
                input.current?.focus();
              }}
            >
              <X size={19} />
            </button>
          )}
        </div>
        {open && (
          <div className="lab-suggestions">
            <p>{query.trim() ? "Suggested matches" : "Quick actions"}</p>
            <div
              id={id + "-list"}
              role="listbox"
              aria-label="Suggested tools"
            >
              {suggestions.map((e, i) => (
                <a
                  key={e.href}
                  ref={(el) => {
                    options.current[i] = el;
                  }}
                  id={id + "-" + i}
                  role="option"
                  aria-selected={active === i}
                  tabIndex={-1}
                  href={e.href}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <b>{e.title}</b>
                  <small>{label(e)}</small>
                </a>
              ))}
            </div>
            {!suggestions.length && (
              <p>No match. Try “photo”, “cards” or “timer”.</p>
            )}
            <button type="button" onClick={() => setOpen(false)}>
              Close suggestions
            </button>
          </div>
        )}
      </div>
      {query.trim() ? (
        <section className="lab-query-results" aria-label="Search results">
          <div className="lab-result-head">
            <h2>Search results</h2>
            <div
              className="lab-search-filters"
              role="group"
              aria-label="Search by studio"
            >
              {filters.map(([value, title]) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={filter === value}
                  onClick={() => {
                    setFilter(value);
                    setOpen(false);
                    setActive(-1);
                    setLimit(12);
                  }}
                >
                  {title}
                </button>
              ))}
            </div>
            <p role="status" aria-live="polite">
              {results.length} {results.length === 1 ? "match" : "matches"}
            </p>
          </div>
          <div className="lab-results-grid">
            {results.slice(0, limit).map(result)}
          </div>
          {results.length > limit && (
            <button
              className="lab-show-more"
              type="button"
              onClick={() => setLimit((n) => n + 12)}
            >
              Show more matches
            </button>
          )}
          {!results.length && (
            <div className="lab-no-results">
              <h3>No matches for “{query}”.</h3>
              <p>Try a shorter task name, or choose a studio below.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  setOpen(false);
                }}
              >
                Browse the studios
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          {children}
          <section
            className="lab-quick-actions"
            aria-labelledby="lab-quick-title"
          >
            <div>
              <h2 id="lab-quick-title">Know what you need?</h2>
              <p>Go straight to a task.</p>
            </div>
            <div className="lab-quick-grid">
              {labQuickLinks.map((e) => (
                <Link key={e.href} href={e.href}>
                  <span>
                    {e.title}
                    <small>{label(e)}</small>
                  </span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
      <PublicDirectory
        title="Browse all Lab tools"
        entries={labEntries.map((e) => ({
          path: e.href,
          title: e.title + " — " + label(e),
        }))}
      />
    </section>
  );
}
