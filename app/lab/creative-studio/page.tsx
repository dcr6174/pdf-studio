import { SiteHeader, SiteFooter } from "@/components/site-header";
import { StudioNavigation } from "@/components/studio-navigation";
import { CreativeDirectory } from "@/components/creative-directory";
import { creativeTools } from "@/lib/lab-studios";
import { pageMeta } from "@/lib/page-meta";
import "../../creative/creative.css";
import "./creative-studio.css";
export const metadata = pageMeta(
  "/lab/creative-studio",
  "Creative Studio — printables, drawing and study tools",
  "Make photo strips, posters, mini zines and flashcards. Draw on a canvas, create handwritten notes, or find study and focus tools in PDF Studio Lab.",
);
export default function CreativeStudio() {
  return (
    <div className="creative-shell lab-creative-hub">
      <SiteHeader />
      <StudioNavigation active="creative" />
      <main className="creative-hub-main">
        <header>
          <span>MAKE · DRAW · LEARN</span>
          <h1>Creative Studio</h1>
          <p>
            Turn an idea into something you can keep. Make a printable, sketch
            freely, write or study.
          </p>
          <span className="creative-tool-count">
            {creativeTools.length} creative tools
          </span>
        </header>
        <CreativeDirectory />
      </main>
      <SiteFooter />
    </div>
  );
}
