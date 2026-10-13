import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { imageGuides } from "@/lib/image-guides";
import { ImageGuideArticle } from "@/components/image-guide-article";
import { pageMeta } from "@/lib/page-meta";
import "./guide.css";
export function generateStaticParams() {
  return imageGuides.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params,
    g = imageGuides.find((g) => g.slug === slug);
  if (!g) return {};
  const title = g.title + " | PDF Studio Lab",
    meta = pageMeta("/lab/guides/" + slug, title, g.description),
    image = {
      url: "/social/image-studio.png",
      width: 1200,
      height: 630,
      alt: "Image Studio practical guides",
    };
  return {
    ...meta,
    title: { absolute: title },
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: g.published,
      modifiedTime: g.updated,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: g.description,
      images: [image.url],
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
  return <ImageGuideArticle guide={g} />;
}
