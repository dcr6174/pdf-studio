import { BlogDirectory } from "@/components/blog-directory";
import Link from "@/components/browser-link";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { pageMeta } from "@/lib/page-meta";
import { articles } from "@/lib/articles";
import { imageGuides } from "@/lib/image-guides";
import "./blog.css";
export const metadata = pageMeta(
  "/blog",
  "PDF and image tutorials — practical guides",
  "Practical guides for PDF tasks and all Image Studio tools, with settings, worked examples, download checks and honest limitations.",
);
export default function Blog() {
  return (
    <div className="blog-shell">
      <SiteHeader />
      <main className="blog-main blog-directory-main">
        <nav aria-label="Breadcrumb">
          <Link href="/">PDF Studio</Link> / Learn
        </nav>
        <h1>Make your next file task easier.</h1>
        <p className="blog-intro">
          Practical guides with clear steps, checks and limitations. Explore PDF
          workflows and tutorials for all 25 Image Studio tools. Written by PDF
          Studio.
        </p>
        <nav className="learn-nav">
          <Link href="/guides">Browse tool instructions</Link>
          <Link href="/lab/guides">Image Studio guides</Link>
          <Link href="/check-it-yourself">Check document privacy</Link>
        </nav>
        <BlogDirectory
          articles={[
            ...articles.map(
              ({ slug, title, summary, category, intent, tags }) => ({
                slug,
                title,
                summary,
                category,
                intent,
                tags,
              }),
            ),
            ...imageGuides.map((g) => ({
              slug: "image-guide-" + g.slug,
              title: g.title,
              summary: g.description,
              category: "Image Studio",
              intent: g.kind,
              tags: g.tags,
              href: "/lab/guides/" + g.slug,
            })),
          ]}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
