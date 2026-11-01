import Link from "@/components/browser-link";
import {
  ArrowUpRight,
  Image as ImageIcon,
  Palette,
  Gamepad2,
  Crop,
  SlidersHorizontal,
  PenLine,
} from "lucide-react";
import { imageTools } from "@/lib/image-tools";
import { activeArcadeGames } from "@/lib/arcade-active";
import { creativeTools } from "@/lib/lab-studios";
export function LabShowcase() {
  return (
    <section className="lab-choices" aria-labelledby="lab-studios-title">
      <div className="lab-section-heading">
        <h2 id="lab-studios-title">Choose your studio</h2>
        <p>Three places. A clear purpose for each.</p>
      </div>
      <div className="lab-world-grid">
        <Link
          href="/lab/image-studio"
          className="lab-world-card"
          data-studio="images"
        >
          <div className="lab-choice-top">
            <ImageIcon size={24} aria-hidden="true" />
            <span>{imageTools.length} tools</span>
            <ArrowUpRight size={21} aria-hidden="true" />
          </div>
          <div className="lab-choice-art image-art" aria-hidden="true">
            <span className="lab-mini-photo" />
            <span className="lab-mini-control">
              <Crop size={20} />
              <SlidersHorizontal size={20} />
            </span>
          </div>
          <h3>Image Studio</h3>
          <p>Crop, resize, compress and convert your images.</p>
          <span className="lab-choice-examples">
            Photos · Signatures · Image formats
          </span>
          <strong>
            Open image tools <span aria-hidden="true">→</span>
          </strong>
        </Link>
        <Link
          href="/lab/creative-studio"
          className="lab-world-card"
          data-studio="creative"
        >
          <div className="lab-choice-top">
            <Palette size={24} aria-hidden="true" />
            <span>{creativeTools.length} tools</span>
            <ArrowUpRight size={21} aria-hidden="true" />
          </div>
          <div className="lab-choice-art creative-art" aria-hidden="true">
            <span className="lab-mini-paper">
              <i />
              <i />
              <i />
            </span>
            <PenLine size={32} />
          </div>
          <h3>Creative Studio</h3>
          <p>Make printables, draw, write and learn.</p>
          <span className="lab-choice-examples">
            Posters · Canvases · Study & focus
          </span>
          <strong>
            Explore creative tools <span aria-hidden="true">→</span>
          </strong>
        </Link>
        <Link
          href="/lab/arcade"
          className="lab-world-card"
          data-studio="arcade"
        >
          <div className="lab-choice-top">
            <Gamepad2 size={24} aria-hidden="true" />
            <span>{activeArcadeGames.length} games</span>
            <ArrowUpRight size={21} aria-hidden="true" />
          </div>
          <div className="lab-choice-art arcade-art" aria-hidden="true">
            <span>🏏</span>
            <span>🏎️</span>
            <span>♟</span>
          </div>
          <h3>Arcade</h3>
          <p>Play cricket, racing, puzzles and quick games.</p>
          <span className="lab-choice-examples">
            Sports · Puzzles · Browser games
          </span>
          <strong>
            Browse games <span aria-hidden="true">→</span>
          </strong>
        </Link>
      </div>
    </section>
  );
}
