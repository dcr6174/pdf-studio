import { imageTools } from "./image-tools";
export type StudioId = "lab" | "images" | "creative";
export const studioLinks = [
  {
    id: "lab",
    title: "Lab home",
    href: "/lab",
    description: "Choose a studio or find a task.",
  },
  {
    id: "images",
    title: "Image Studio",
    href: "/lab/image-studio",
    description: "Edit, resize, compress and convert images.",
  },
  {
    id: "creative",
    title: "Creative Studio",
    href: "/lab/creative-studio",
    description: "Make printables, draw, write and learn.",
  },
] as const;
export const creativeGroups = [
  "Make & print",
  "Draw & write",
  "Study & focus",
  "Document experiments",
] as const;
export type CreativeGroup = (typeof creativeGroups)[number];
export const creativeTools: {
  slug: string;
  title: string;
  description: string;
  group: CreativeGroup;
}[] = [
  {
    slug: "mini-zine-maker",
    title: "Mini Zine Maker",
    description: "Fold pictures or PDF pages into a pocket-sized book.",
    group: "Make & print",
  },
  {
    slug: "photo-strip",
    title: "Quick Photo Strip",
    description: "Arrange your photos into a downloadable PNG strip.",
    group: "Make & print",
  },
  {
    slug: "photo-booth-strips",
    title: "Photo Booth Strip Maker",
    description: "Make a classic four-photo strip with a caption.",
    group: "Make & print",
  },
  {
    slug: "custom-bingo",
    title: "Custom Bingo",
    description: "Make printable bingo cards for your group.",
    group: "Make & print",
  },
  {
    slug: "giant-poster",
    title: "Giant Poster Maker",
    description: "Print one picture across several sheets.",
    group: "Make & print",
  },
  {
    slug: "photo-coloring-page",
    title: "Photo to Coloring Page",
    description: "Turn a photo into printable outlines to colour.",
    group: "Make & print",
  },
  {
    slug: "printable-flashcards",
    title: "Printable Flashcard Maker",
    description: "Print aligned question-and-answer cards.",
    group: "Make & print",
  },
  {
    slug: "practice-sheets",
    title: "Practice Sheets & Notebooks",
    description: "Create tracing, ruled, dotted or grid paper.",
    group: "Make & print",
  },
  {
    slug: "notebook-maker",
    title: "Notebook Maker",
    description: "Create printable paper for your notes.",
    group: "Make & print",
  },
  {
    slug: "daily-mood-canvas",
    title: "Daily Mood Canvas",
    description: "Sketch, stamp and express your day on a blank canvas.",
    group: "Draw & write",
  },
  {
    slug: "whiteboard",
    title: "Whiteboard",
    description: "Draw diagrams, doodles and rough ideas.",
    group: "Draw & write",
  },
  {
    slug: "text-to-handwriting",
    title: "Text to Handwriting",
    description: "Give typed notes a handwritten-style finish.",
    group: "Draw & write",
  },
  {
    slug: "handwriting-practice",
    title: "Handwriting Practice",
    description: "Make tracing lines with room to practise.",
    group: "Draw & write",
  },
  {
    slug: "flashcards",
    title: "Study Flashcards",
    description: "Write, practise and shuffle a study deck.",
    group: "Study & focus",
  },
          {
    slug: "flipbook",
    title: "PDF Flipbook",
    description: "Read a PDF as a turning book and export offline HTML.",
    group: "Document experiments",
  },
  {
    slug: "word-cloud",
    title: "PDF Word Cloud",
    description: "Explore frequent words in selectable PDF text.",
    group: "Document experiments",
  },
  {
    slug: "page-palette",
    title: "Page Palette",
    description: "Find representative colours in a PDF page.",
    group: "Document experiments",
  },
  {
    slug: "poster-collage",
    title: "Poster Collage",
    description: "Arrange PDF pages into a poster.",
    group: "Document experiments",
  },
  {
    slug: "pdf-to-gif",
    title: "PDF to GIF",
    description: "Turn selected PDF pages into an animation.",
    group: "Document experiments",
  },
  {
    slug: "remove-watermark",
    title: "Remove PDF Watermark",
    description: "Review and remove separate watermark objects from a PDF.",
    group: "Document experiments",
  },
];
export type LabEntry = {
  href: string;
  title: string;
  description: string;
  studio: Exclude<StudioId, "lab">;
  kind: "studio" | "tool";
  keywords?: string;
};
const aliases: Record<string, string> = {
  "image-compressor": "smaller photo reduce file size kb compress",
  "image-size-reducer": "signature form upload limit kb smaller photo",
  "image-resizer": "width height dimensions pixels resize",
  "image-crop": "trim cut crop",
  "image-background-remover": "erase transparent plain background",
  "png-to-jpg": "jpeg convert",
  flashcards: "study learn cards",
};
export const labEntries: LabEntry[] = [
  ...studioLinks
    .filter((s) => s.id !== "lab")
    .map((s) => ({
      href: s.href,
      title: s.title,
      description: s.description,
      studio: s.id as Exclude<StudioId, "lab">,
      kind: "studio" as const,
      keywords:
        s.id === "images"
          ? "image tools photo tools edit pictures image studio"
          : "create studio creative tools printables drawing study",
    })),
  ...imageTools.map((t) => ({
    href: "/lab/" + t.slug,
    title: t.title,
    description: t.description,
    studio: "images" as const,
    kind: "tool" as const,
    keywords: aliases[t.slug] ?? t.category,
  })),
  ...creativeTools.map((t) => ({
    href: "/lab/" + t.slug,
    title: t.title,
    description: t.description,
    studio: "creative" as const,
    kind: "tool" as const,
    keywords:
      t.group +
      " " +
      t.slug.replaceAll("-", " ") +
      " " +
      (aliases[t.slug] ?? ""),
  })),
];
export function findLabEntries(
  query: string,
  studio: "all" | Exclude<StudioId, "lab"> = "all",
) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return labEntries.filter(
    (e) =>
      (studio === "all" || e.studio === studio) &&
      terms.every((t) =>
        `${e.title} ${e.description} ${e.keywords ?? ""}`
          .toLocaleLowerCase()
          .includes(t),
      ),
  );
}
export const labQuickLinks = [
  "image-compressor",
  "image-resizer",
  "image-size-reducer",
  "daily-mood-canvas",
  "mini-zine-maker",
  "whiteboard",
].map((slug) => labEntries.find((e) => e.href === "/lab/" + slug)!);
