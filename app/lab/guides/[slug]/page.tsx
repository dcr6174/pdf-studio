import { notFound } from "next/navigation";
import { imageGuides } from "@/lib/image-guides";
import { imageTools } from "@/lib/image-tools";
import { pageMeta } from "@/lib/page-meta";
import Link from "@/components/browser-link";
import "./guide.css";
export function generateStaticParams() {
  return imageGuides.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    g = imageGuides.find((g) => g.slug === slug);
  if (!g) return {};
  const title = g.title + " | PDF Studio Lab",
    meta = pageMeta("/lab/guides/" + slug, title, g.description);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [
        {
          url: "/social/image-studio.png",
          width: 1200,
          height: 630,
          alt: "PDF Studio Lab image guide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: g.description,
      images: ["/social/image-studio.png"],
    },
  };
}
export default async function ImageGuide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    g = imageGuides.find((g) => g.slug === slug);
  if (!g) notFound();
  const url = "https://pdf-studio.in/lab/guides/" + slug;
  return (
    <main className="image-guide-page">
      <nav>
        <Link href="/lab">← Studio Lab</Link>
        <span>IMAGE GUIDES</span>
      </nav>
      <article>
        <header>
          <p>Practical guides · Studio Lab</p>
          <h1>{g.title}</h1>
          <p>{g.description}</p>
        </header>
        <div className="image-guide-tools">
          {g.tools.map((slug) => (
            <Link key={slug} href={"/lab/" + slug}>
              {imageTools.find((t) => t.slug === slug)?.title} ↗
            </Link>
          ))}
        </div>
        {g.sections.map((s, i) => (
          <section key={s.title}>
            <span>0{i + 1}</span>
            <div>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </div>
          </section>
        ))}
        <aside>
          <h2>Related image guides</h2>
          {imageGuides
            .filter((other) => other.slug !== slug)
            .map((other) => (
              <Link key={other.slug} href={"/lab/guides/" + other.slug}>
                {other.title} ↗
              </Link>
            ))}
        </aside>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: g.title,
            description: g.description,
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "PDF Studio" },
            publisher: { "@type": "Organization", name: "PDF Studio" },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Studio Lab",
                item: "https://pdf-studio.in/lab",
              },
              { "@type": "ListItem", position: 2, name: g.title, item: url },
            ],
          }),
        }}
      />
    </main>
  );
}
