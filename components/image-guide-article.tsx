import Link from "@/components/browser-link";
import {SiteHeader,SiteFooter} from "@/components/site-header";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ArrowLeft,
} from "lucide-react";
import { imageGuides, type ImageGuide } from "@/lib/image-guides";
import { imageTools } from "@/lib/image-tools";
export function guideWordCount(g: ImageGuide) {
  return [
    g.intro,
    ...g.steps,
    ...g.sections.map((s) => s.text),
    ...Object.values(g.example),
    ...g.checks,
    ...g.limitations,
    ...g.faq.flatMap((f) => [f.question, f.answer]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
}
export function ImageGuideArticle({ guide: g }: { guide: ImageGuide }) {
  const date = new Date(g.updated + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const related = g.related
    .map((slug) => imageGuides.find((other) => other.slug === slug))
    .filter((other): other is ImageGuide => !!other)
    .slice(0, 4);
  const url = "https://pdf-studio.in/lab/guides/" + g.slug;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.published,
    dateModified: g.updated,
    inLanguage: "en",
    wordCount: guideWordCount(g),
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "PDF Studio" },
    publisher: {
      "@type": "Organization",
      name: "PDF Studio",
      url: "https://pdf-studio.in",
    },
    image: "https://pdf-studio.in/social/image-studio.png",
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "PDF Studio", item: "https://pdf-studio.in" },
      { name: "Studio Lab", item: "https://pdf-studio.in/lab" },
      { name: "Image Studio guides", item: "https://pdf-studio.in/lab/guides" },
      { name: g.title, item: url },
    ].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...item,
    })),
  };
  return (
    <><SiteHeader/><main className="image-guide-page">
      <nav className="ig-topnav" aria-label="Breadcrumb">
        <Link href="/lab">
          <ArrowLeft size={15} />
          Studio Lab
        </Link>
        <Link href="/lab/guides">
          <BookOpen size={15} />
          Image Studio guides
        </Link>
      </nav>
      <article className="ig-article">
        <header className="ig-hero">
          <p className="ig-kicker">IMAGE STUDIO / {g.kind.toUpperCase()}</p>
          <h1>{g.title}</h1>
          <p className="ig-description">{g.description}</p>
          <div className="ig-byline">
            <span>By PDF Studio</span>
            <span>
              Updated <time dateTime={g.updated}>{date}</time>
            </span>
            <span>
              <Clock3 size={14} />
              {Math.max(1, Math.ceil(guideWordCount(g) / 200))} min read
            </span>
          </div>
          <div className="image-guide-tools">
            {g.tools.map((slug) => (
              <Link key={slug} href={"/lab/" + slug}>
                {imageTools.find((t) => t.slug === slug)?.title}
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        </header>
        <div className="ig-layout">
          <nav className="ig-contents" aria-label="Article contents">
            <p>IN THIS GUIDE</p>
            <a href="#start">Before you start</a>
            <a href="#steps">Follow the steps</a>
            {g.sections.map((s, i) => (
              <a key={s.title} href={"#section-" + i}>
                {s.title}
              </a>
            ))}
            <a href="#example">Worked example</a>
            <a href="#checks">Check the result</a>
            <a href="#questions">Questions</a>
          </nav>
          <details className="ig-contents-mobile">
            <summary>On this page</summary>
            <nav
              className="ig-contents-mobile-nav"
              aria-label="Mobile article contents"
            >
              <p>IN THIS GUIDE</p>
              <a href="#start">Before you start</a>
              <a href="#steps">Follow the steps</a>
              {g.sections.map((s, i) => (
                <a key={s.title} href={"#section-" + i}>
                  {s.title}
                </a>
              ))}
              <a href="#example">Worked example</a>
              <a href="#checks">Check the result</a>
              <a href="#questions">Questions</a>
            </nav>
          </details>
          <div className="ig-content">
            <section id="start">
              <h2>Before you start</h2>
              <p>{g.intro}</p>
            </section>
            <section id="steps">
              <h2>Follow the steps</h2>
              <ol className="ig-steps">
                {g.steps.map((step, i) => (
                  <li key={step}>
                    <span aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
              <p className="ig-mobile-note">
                On mobile, open the settings icon for options. The main action
                stays near the bottom. Keep the original image for revisions.
              </p>
            </section>
            {g.sections.map((s, i) => (
              <section id={"section-" + i} key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </section>
            ))}
            <section id="example" className="ig-example">
              <p className="ig-kicker">WORKED EXAMPLE</p>
              <h2>A practical example</h2>
              <dl>
                <div>
                  <dt>Start with</dt>
                  <dd>{g.example.input}</dd>
                </div>
                <div>
                  <dt>Try these settings</dt>
                  <dd>{g.example.settings}</dd>
                </div>
                <div>
                  <dt>What to expect</dt>
                  <dd>{g.example.expected}</dd>
                </div>
              </dl>
              <p className="ig-example-note">
                This example explains the workflow. It is not a recorded test or
                a guarantee about your file.
              </p>
            </section>
            <section id="checks">
              <h2>
                <CheckCircle2 size={20} />
                Check the downloaded result
              </h2>
              <ul className="ig-checks">
                {g.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
              <aside className="ig-limits">
                <h3>Know the limits</h3>
                <ul>
                  {g.limitations.map((limit) => (
                    <li key={limit}>{limit}</li>
                  ))}
                </ul>
              </aside>
            </section>
            <section id="questions">
              <h2>Questions and troubleshooting</h2>
              {g.faq.map((f) => (
                <details className="ig-faq" key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </section>
            {g.sources.length > 0 && (
              <section className="ig-sources">
                <h2>Further reading</h2>
                <p>
                  These references explain formats and browser behavior. The
                  steps above describe PDF Studio’s current tools.
                </p>
                <ul>
                  {g.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url}>
                        {s.label}
                        <ArrowUpRight size={13} />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <div className="ig-end-action">
              <p>Ready to try it?</p>
              <div className="image-guide-tools">
                {g.tools.map((slug) => (
                  <Link key={slug} href={"/lab/" + slug}>
                    {imageTools.find((t) => t.slug === slug)?.title}
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <section className="ig-related">
            <h2>Continue with a related guide</h2>
            <div>
              {related.map((other) => (
                <Link key={other.slug} href={"/lab/guides/" + other.slug}>
                  <span>{other.kind}</span>
                  <h3>{other.title}</h3>
                  <p>{other.description}</p>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
    </main><SiteFooter/></>
  );
}
