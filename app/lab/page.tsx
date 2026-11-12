import { SiteHeader, SiteFooter } from "@/components/site-header";
import { StudioNavigation } from "@/components/studio-navigation";
import { LabHome } from "@/components/lab-home";
import { pageMeta } from "@/lib/page-meta";
import { imageTools } from "@/lib/image-tools";
import { creativeTools } from "@/lib/lab-studios";
import "../creative/creative.css";
import "./lab.css";
export const metadata = pageMeta(
  "/lab",
  "Lab — Image Studio and Creative Studio",
  "Choose Image Studio for photo tools, or Creative Studio for printables and drawing. Search every Lab tool in one place.",
);
export default function Lab() {
  const tools = [...imageTools, ...creativeTools].map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
  }));
  return (
    <div className="creative-shell lab-home">
      <SiteHeader />
      <StudioNavigation active="lab" />
      <LabHome tools={tools} />
      <SiteFooter />
    </div>
  );
}
