import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";

export const revalidate = 3600; // revalidate sitemap every hour

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://maxcsh.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allContent = await sanityFetch({ query: sitemapData });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE_URL}/portfolio`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/photography`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/posts`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/resume`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  if (allContent?.data?.length) {
    for (const item of allContent.data) {
      let url: string;
      let priority: number;
      let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];

      switch (item._type) {
        case "page":
          url = `${SITE_URL}/${item.slug}`;
          priority = 0.7;
          changeFrequency = "monthly";
          break;
        case "post":
          url = `${SITE_URL}/posts/${item.slug}`;
          priority = 0.6;
          changeFrequency = "never";
          break;
        case "portfolioProject":
          url = `${SITE_URL}/portfolio/${item.slug}`;
          priority = 0.8;
          changeFrequency = "monthly";
          break;
        case "photoPost":
          url = `${SITE_URL}/photography/${item.slug}`;
          priority = 0.6;
          changeFrequency = "never";
          break;
        default:
          continue;
      }

      dynamicRoutes.push({
        url,
        lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
        priority,
        changeFrequency,
      });
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
