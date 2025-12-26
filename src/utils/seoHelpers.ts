import type { Ref } from "vue";

export interface SeoMeta {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: "website" | "article" | "video.movie" | "video.tv_show";
}

export const createSeoHead = (meta: SeoMeta) => ({
  title: meta.title,
  meta: [
    { name: "description", content: meta.description },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    { property: "og:image", content: meta.image || "/og-default.jpg" },
    { property: "og:url", content: meta.url },
    { property: "og:type", content: meta.type || "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
    { name: "twitter:image", content: meta.image || "/og-default.jpg" },
  ],
  link: [{ rel: "canonical", href: meta.url }],
});

export const createStructuredData = (
  type: "Movie" | "TVSeries" | "WebPage",
  data: Record<string, any>
) => ({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": type,
        ...data,
      }),
    } as any,
  ],
});
