import { headers } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
export default async function sitemap() {
  const host = (await headers()).get("host") || "informreaders.com";

  // Call backend to get all sitemap XML files for this host
  const { data: result } = await axiosInstance.get("/sitemaps", { params: { host } });

  if (result.error) return [];

  const sitemaps = result.data; // Array of DB sitemap entries

  const finalUrls = [];

  for (const sm of sitemaps) {
    const xml = sm.xmlContent;

    // Extract <loc> URLs
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);

    for (const m of matches) {
      finalUrls.push({
        url: m[1],
        lastModified: sm.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return finalUrls;
}
