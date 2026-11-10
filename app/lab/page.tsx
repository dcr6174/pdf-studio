import { SiteHeader, SiteFooter } from "@/components/site-header";
import { LabDirectory } from "@/components/lab-directory";
import { StudioNavigation } from "@/components/studio-navigation";
import Link from "@/components/browser-link";
import { pageMeta } from "@/lib/page-meta";
import { imageTools } from "@/lib/image-tools";
import { creativeTools, creativeGroups } from "@/lib/lab-studios";
import { ArrowRight } from "lucide-react";
import "../creative/creative.css";
import "./lab.css";
import "./discovery.css";
export const metadata = pageMeta(
  "/lab",
  "Lab — Image Studio and Creative Studio",
  "Choose Image Studio for photo tools, or Creative Studio for printables and drawing. Search every Lab tool in one place.",
);
export default function Lab() {
  return (
    <div className="creative-shell lab-home">
      <SiteHeader />
      <StudioNavigation active="lab" />
      <main className="lab-home-main">
        <header className="lab-hub-heading">
          <span>PDF STUDIO LAB</span>
          <h1>More than PDFs</h1>
          <p>Photo tools, printables, drawing and study aids — free and private, on your device.</p>
        </header>
        <div className="lb-studios">
          <Link className="lb-studio-card" href="/lab/image-studio">
            <b>Image Studio</b>
            <p>Edit, resize, compress and convert images.</p>
            <span>{imageTools.length} tools<ArrowRight size={15} aria-hidden="true" /></span>
          </Link>
          <Link className="lb-studio-card" href="/lab/creative-studio">
            <b>Creative Studio</b>
            <p>Make printables, draw, write and learn.</p>
            <span>{creativeTools.length} tools<ArrowRight size={15} aria-hidden="true" /></span>
          </Link>
        </div>
        <LabDirectory />
        <section className="lb-group" aria-labelledby="lb-images-title">
          <div className="lb-group-head">
            <h2 id="lb-images-title">Image Studio</h2>
            <p>{imageTools.length} tools</p>
          </div>
          <div className="lb-grid">
            {imageTools.map((t) => (
              <Link key={t.slug} className="lb-card" href={"/lab/" + t.slug}>
                <b>{t.title}</b>
                <span>{t.description}</span>
              </Link>
            ))}
          </div>
        </section>
        {creativeGroups.map((g) => {
          const items = creativeTools.filter((t) => t.group === g);
          return (
            <section className="lb-group" key={g} aria-labelledby={"lb-" + g}>
              <div className="lb-group-head">
                <h2 id={"lb-" + g}>{g}</h2>
                <p>{items.length} {items.length === 1 ? "tool" : "tools"} · Creative Studio</p>
              </div>
              <div className="lb-grid">
                {items.map((t) => (
                  <Link key={t.slug} className="lb-card" href={"/lab/" + t.slug}>
                    <b>{t.title}</b>
                    <span>{t.description}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
}
