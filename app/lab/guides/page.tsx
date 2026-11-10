import type { Metadata } from "next";
import Link from "@/components/browser-link";
import {SiteHeader,SiteFooter} from "@/components/site-header";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { imageGuides } from "@/lib/image-guides";
import { imageTools } from "@/lib/image-tools";
import { ImageGuideDirectory } from "@/components/image-guide-directory";
import { pageMeta } from "@/lib/page-meta";
import "./[slug]/guide.css";
const title = "Image Studio guides: editing, compression and conversion",
  description =
    "Practical tutorials for all 25 Image Studio tools, with settings, worked examples, download checks and honest limitations.";
const meta = pageMeta("/lab/guides", title, description);
export const metadata: Metadata = {
  ...meta,
  title: { absolute: title + " | PDF Studio Lab" },
  openGraph: {
    ...meta.openGraph,
    images: [
      {
        url: "/social/image-studio.png",
        width: 1200,
        height: 630,
        alt: "Image Studio guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/social/image-studio.png"],
  },
};
export default function ImageGuideIndex() {
  const cards = imageGuides.map((g) => ({
    slug: g.slug,
    title: g.title,
    description: g.description,
    kind: g.kind,
    category:
      g.kind === "Comparison"
        ? "Comparisons"
        : imageTools.find((t) => t.slug === g.tools[0])!.category,
    tags: g.tags,
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: "https://pdf-studio.in/lab/guides",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: imageGuides.length,
      itemListElement: imageGuides.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: "https://pdf-studio.in/lab/guides/" + g.slug,
        name: g.title,
      })),
    },
  };
  return (
    <><SiteHeader/><main className="image-guide-page ig-index">
      <nav className="ig-topnav" aria-label="Breadcrumb">
        <Link href="/lab">
          <ArrowLeft size={15} />
          Studio Lab
        </Link>
        <Link href="/blog">
          All articles
          <ArrowUpRight size={15} />
        </Link>
      </nav>
      <header className="ig-index-hero">
        <p className="ig-kicker">THE IMAGE STUDIO HANDBOOK</p>
        <h1>
          Better images.
          <br />
          <em>Clearer steps.</em>
        </h1>
        <p>
          Practical guides for editing, optimizing and creating with your
          images. Learn the settings, check the download and know the limits.
        </p>
        <div className="ig-index-stats">
          <span>{imageTools.length} tool guides</span>
          <span>
            {imageGuides.filter((g) => g.kind === "Comparison").length} workflow
            comparisons
          </span>
          <span>Examples & troubleshooting</span>
        </div>
      </header>
      <ImageGuideDirectory guides={cards} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </main><SiteFooter/></>
  );
}
