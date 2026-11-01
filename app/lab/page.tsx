import { SiteHeader, SiteFooter } from "@/components/site-header";
import { LabDirectory } from "@/components/lab-directory";
import { LabShowcase } from "@/components/lab-showcase";
import { StudioNavigation } from "@/components/studio-navigation";
import { pageMeta } from "@/lib/page-meta";
import "../creative/creative.css";
import "./lab.css";
import "./discovery.css";
export const metadata = pageMeta(
  "/lab",
  "Lab — Image Studio, Creative Studio and Arcade",
  "Choose Image Studio for photo tools, Creative Studio for printables and drawing, or Arcade for browser games. Search every Lab tool and game in one place.",
);
export default function Lab() {
  return (
    <div className="creative-shell lab-home">
      <SiteHeader />
      <StudioNavigation active="lab" />
      <main className="lab-home-main">
        <header className="lab-hub-heading">
          <span>PDF STUDIO LAB</span>
          <h1>What would you like to do?</h1>
          <p>
            Edit an image, make something, or play a game. Start in the right
            place.
          </p>
        </header>
        <LabDirectory>
          <LabShowcase />
        </LabDirectory>
      </main>
      <SiteFooter />
    </div>
  );
}
