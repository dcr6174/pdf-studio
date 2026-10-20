import { SiteHeader, SiteFooter } from "@/components/site-header";
import { LabDirectory } from "@/components/lab-directory";
import { pageMeta } from "@/lib/page-meta";
import Link from "@/components/browser-link";
import { Sparkles, ArrowDown } from "lucide-react";
import "../creative/creative.css";
import "./lab.css";
import "./discovery.css";
import "./arcade-entry.css";
export const metadata = pageMeta(
  "/lab",
  "Studio Lab — make, learn and play",
  "Practical and playful tools for photo and signature sizing, photo strips, study flashcards, printables, creative canvases and focused breaks.",
);
export default function Lab() {
  return (
    <div className="creative-shell lab-home">
      <SiteHeader />
      <main className="lab-home-main">
        <header className="lab-cinematic-hero">
          <div className="lab-hero-copy">
            <span className="lab-kicker">
              <Sparkles size={16} aria-hidden="true" />
              Studio Lab
            </span>
            <h1>
              Small tasks.
              <br />
              <em>Beautifully simple.</em>
            </h1>
            <p>
              Edit a photo, make something to print, or take a creative break.
              Choose a task to get started.
            </p>
            <Link href="#lab-tools-heading" className="lab-hero-link">
              Find your tool <ArrowDown size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="lab-hero-note">
            <span aria-hidden="true">✦</span>
            <strong>Your ideas. Your device.</strong>
            <p>
              No account needed. Clear previews. Download a copy when you’re
              ready.
            </p>
          </div>
        </header>
        <section className="lab-arcade-entry" aria-labelledby="lab-arcade-heading"><div><span className="lab-kicker">TAKE A PROPER LITTLE BREAK</span><h2 id="lab-arcade-heading">Studio Arcade</h2><p>60 free games. Word puzzles, Sudoku, picture puzzles and arcade favourites.</p></div><Link href="/lab/arcade">Explore the Arcade ↗</Link></section>
        <LabDirectory />
      </main>
      <SiteFooter />
    </div>
  );
}


